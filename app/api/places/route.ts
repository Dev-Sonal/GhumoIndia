import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { MappedPlace, MappedPlaceKind, MappedPlacesResponse } from "@/lib/places";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type OverpassElement = {
    type: string;
    id: number;
    lat?: number;
    lon?: number;
    center?: { lat: number; lon: number };
    tags?: Record<string, string>;
};

type OverpassResponse = { elements?: OverpassElement[] };

// Public Overpass mirrors are free, flaky and frequently overloaded: they
// answer 502 "at capacity" within a second, or hang until a timeout. Racing
// several mirrors in parallel means one busy mirror no longer stalls the
// dashboard; the first successful answer wins and the rest abort.
const OVERPASS_INSTANCES = [
    // The main instance and its lz4 backend use separate worker pools, so one
    // is often free while the other is at capacity.
    "https://overpass-api.de/api/interpreter",
    "https://lz4.overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass.private.coffee/api/interpreter",
    "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
];

// "At capacity" replies arrive in under a second, so a bounded retry loop is
// cheap and turns a minute-long outage into a successful load for most users.
const TOTAL_BUDGET_MS = 25_000;
const REQUEST_TIMEOUT_MS = 12_000;
const RETRY_DELAYS_MS = [1_500, 3_000];
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // Fresh entries are served without touching Overpass.
// Expired entries are kept this long so a mirror outage can serve the last
// known listing instead of empty cards.
const STALE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const CACHE_MAX_ENTRIES = 200;
const MAX_RADIUS_KM = 51;

const ATTRACTION_TOURISM = ["attraction", "museum", "viewpoint", "zoo", "theme_park", "gallery"];
const STAY_TOURISM = ["hotel", "hostel", "guest_house", "motel", "apartment", "chalet", "camp_site"];
const FOOD_AMENITY = ["restaurant", "food_court", "cafe"];
const LEISURE_TAGS = ["park", "garden", "nature_reserve"];

// Keep the response small: the browser only ever displays a handful of each.
const LIMITS: Record<MappedPlaceKind, number> = {
    attraction: 80,
    stay: 25,
    food: 40,
    transit: 12,
};

type PlaceCacheEntry = { savedAt: number; places: MappedPlace[] };

const placeCache = new Map<string, PlaceCacheEntry>();
// The cache is mirrored to .next/cache so it survives dev-server and production
// restarts: once a destination has loaded successfully, its cards keep working
// even while every public Overpass mirror is overloaded.
// Loaded lazily on the first request of each server process.
const CACHE_FILE = path.join(process.cwd(), ".next", "cache", "mapped-places.json");
let cacheLoadedFromDisk = false;
let cacheWriteQueue: Promise<void> = Promise.resolve();

async function loadCacheFromDisk(): Promise<void> {
    if (cacheLoadedFromDisk) return;
    cacheLoadedFromDisk = true;

    try {
        const raw = await readFile(CACHE_FILE, "utf8");
        const parsed = JSON.parse(raw) as Record<string, PlaceCacheEntry>;
        for (const [key, entry] of Object.entries(parsed)) {
            if (!entry || typeof entry.savedAt !== "number" || !Array.isArray(entry.places)) continue;
            placeCache.set(key, { savedAt: entry.savedAt, places: entry.places });
        }
        while (placeCache.size > CACHE_MAX_ENTRIES) {
            const oldest = placeCache.keys().next().value;
            if (oldest === undefined) break;
            placeCache.delete(oldest);
        }
    } catch {
        // No readable cache file yet; start empty.
    }
}

function persistCache(): void {
    // Serialise writes so concurrent requests cannot interleave file output.
    cacheWriteQueue = cacheWriteQueue.then(async () => {
        try {
            await mkdir(path.dirname(CACHE_FILE), { recursive: true });
            await writeFile(CACHE_FILE, JSON.stringify(Object.fromEntries(placeCache)), "utf8");
        } catch {
            // Caching is best effort; a write problem must never fail a request.
        }
    });
}

/**
 * One merged Overpass query replaces the two heavy ones the dashboard used to
 * send from the browser. Radii are deliberately different per category so a
 * dense city does not drag thousands of restaurants into a 50 km scan.
 */
function buildQuery(lat: number, lon: number): string {
    return `[out:json][timeout:25];
(
  nwr(around:50000,${lat},${lon})[tourism~"^(${ATTRACTION_TOURISM.join("|")})$"];
  nwr(around:50000,${lat},${lon})[historic~"^(monument|castle|fort|ruins|memorial|archaeological_site)$"];
  nwr(around:50000,${lat},${lon})[natural~"^(beach|waterfall|cave|hot_spring)$"];
  nwr(around:50000,${lat},${lon})[leisure~"^(${LEISURE_TAGS.join("|")})$"];
  nwr(around:15000,${lat},${lon})[tourism~"^(${STAY_TOURISM.join("|")})$"];
  nwr(around:10000,${lat},${lon})[amenity~"^(${FOOD_AMENITY.join("|")})$"];
  nwr(around:30000,${lat},${lon})[railway~"^(station|halt)$"];
  nwr(around:30000,${lat},${lon})[amenity~"^(bus_station|ferry_terminal)$"];
  nwr(around:40000,${lat},${lon})[aeroway="aerodrome"];
);
out center tags qt;
`;
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
    return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function classify(tags: Record<string, string>): MappedPlaceKind | null {
    if (STAY_TOURISM.includes(tags.tourism ?? "")) return "stay";
    if (FOOD_AMENITY.includes(tags.amenity ?? "")) return "food";
    if (
        tags.railway === "station" ||
        tags.railway === "halt" ||
        tags.amenity === "bus_station" ||
        tags.amenity === "ferry_terminal" ||
        tags.aeroway === "aerodrome"
    ) {
        return "transit";
    }
    if (
        ATTRACTION_TOURISM.includes(tags.tourism ?? "") ||
        Boolean(tags.historic) ||
        Boolean(tags.natural) ||
        LEISURE_TAGS.includes(tags.leisure ?? "")
    ) {
        return "attraction";
    }
    return null;
}

function categoryFor(tags: Record<string, string>, kind: MappedPlaceKind): string {
    if (kind === "transit") {
        if (tags.railway === "station" || tags.railway === "halt") return "railway_station";
        if (tags.amenity === "bus_station") return "bus_station";
        if (tags.amenity === "ferry_terminal") return "ferry_terminal";
        return "aerodrome";
    }
    return tags.tourism ?? tags.historic ?? tags.natural ?? tags.leisure ?? tags.amenity ?? "attraction";
}

/** Classify, distance sort, dedupe and cap each bucket so the payload stays tiny. */
function normalisePlaces(elements: OverpassElement[], lat: number, lon: number): MappedPlace[] {
    const buckets: Record<MappedPlaceKind, MappedPlace[]> = {
        attraction: [],
        stay: [],
        food: [],
        transit: [],
    };
    const seenNames = new Map<string, { lat: number; lon: number }>();

    for (const element of elements) {
        const tags = element.tags ?? {};
        const name = tags.name?.trim();
        const placeLat = element.lat ?? element.center?.lat;
        const placeLon = element.lon ?? element.center?.lon;
        if (!name || placeLat === undefined || placeLon === undefined) continue;
        if (!Number.isFinite(placeLat) || !Number.isFinite(placeLon)) continue;

        // Skip ordinary commercial listings even if they carry a tourism tag.
        const building = tags.building?.toLowerCase();
        if (
            tags.shop ||
            tags.office ||
            tags.craft ||
            ["commercial", "retail", "office", "industrial"].includes(building ?? "")
        ) {
            continue;
        }

        const kind = classify(tags);
        if (!kind) continue;

        const distanceKm = haversineKm(lat, lon, placeLat, placeLon);
        if (!Number.isFinite(distanceKm) || distanceKm > MAX_RADIUS_KM) continue;

        // Ways and nodes often describe the same landmark; keep the nearest copy.
        const normalisedName = name.toLocaleLowerCase().replace(/\s+/g, " ").trim();
        const seenAt = seenNames.get(normalisedName);
        if (seenAt && haversineKm(seenAt.lat, seenAt.lon, placeLat, placeLon) < 0.25) continue;
        seenNames.set(normalisedName, { lat: placeLat, lon: placeLon });

        buckets[kind].push({
            id: `${element.type}-${element.id}`,
            name,
            kind,
            category: categoryFor(tags, kind),
            lat: placeLat,
            lon: placeLon,
            distanceKm: Number(distanceKm.toFixed(3)),
            ...(kind === "food" && tags.cuisine ? { cuisine: tags.cuisine } : {}),
        });
    }

    return (Object.keys(LIMITS) as MappedPlaceKind[]).flatMap((kind) =>
        buckets[kind].sort((a, b) => a.distanceKm - b.distanceKm).slice(0, LIMITS[kind]),
    );
}

function fetchOverpass(endpoint: string, query: string, signal: AbortSignal): Promise<OverpassResponse> {
    return fetch(endpoint, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            "User-Agent": "PilgoraTravelPlanner/1.0",
        },
        body: new URLSearchParams({ data: query }).toString(),
        signal,
    }).then(async (response) => {
        if (!response.ok) throw new Error(`Overpass mirror returned ${response.status}`);
        return (await response.json()) as OverpassResponse;
    });
}

/** Resolve with the first mirror that answers; abort the others and time out stragglers. */
function firstSuccessful(
    run: (endpoint: string, signal: AbortSignal) => Promise<OverpassResponse>,
    timeoutMs: number,
): Promise<OverpassResponse> {
    return new Promise<OverpassResponse>((resolve, reject) => {
        const controllers = OVERPASS_INSTANCES.map(() => new AbortController());
        let pending = controllers.length;
        let lastError: unknown;

        controllers.forEach((controller, index) => {
            const timeout = setTimeout(() => controller.abort(), timeoutMs);

            run(OVERPASS_INSTANCES[index], controller.signal).then(
                (value) => {
                    clearTimeout(timeout);
                    controllers.forEach((other) => {
                        if (other !== controller) other.abort();
                    });
                    resolve(value);
                },
                (error: unknown) => {
                    clearTimeout(timeout);
                    lastError =
                        error instanceof Error && error.name === "AbortError"
                            ? lastError ?? new DOMException("Map request timed out", "TimeoutError")
                            : error;
                    pending -= 1;
                    if (pending === 0) reject(lastError ?? new Error("All map services failed."));
                },
            );
        });
    });
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Race every mirror, and if all of them are busy, retry within a fixed time
 * budget. Overload answers are fast, so the retries cost well under a second
 * each while a minute-long busy window usually clears within the budget.
 */
async function queryMappedPlaces(lat: number, lon: number): Promise<MappedPlace[]> {
    const query = buildQuery(lat, lon);
    const deadline = Date.now() + TOTAL_BUDGET_MS;
    let lastError: unknown;

    for (let attempt = 0; ; attempt += 1) {
        const remaining = deadline - Date.now();
        if (remaining <= 0) break;

        try {
            const response = await firstSuccessful(
                (endpoint, signal) => fetchOverpass(endpoint, query, signal),
                Math.min(REQUEST_TIMEOUT_MS, remaining),
            );
            return normalisePlaces(response.elements ?? [], lat, lon);
        } catch (error) {
            lastError = error;
            const delay = RETRY_DELAYS_MS[attempt];
            if (delay === undefined || Date.now() + delay >= deadline) break;
            await sleep(delay);
        }
    }

    throw lastError ?? new Error("All map services failed.");
}

// ---------------------------------------------------------------------------
// Wikipedia fallback
//
// The public Overpass mirrors are frequently at capacity. Wikipedia's
// geosearch endpoint runs on Wikimedia infrastructure, needs no API key and
// answers in about a second, so attractions still load when OSM is busy
// instead of leaving the cards empty. It only covers points of interest
// (no stays/food listings), so it is strictly a fallback, never the first
// choice.
// ---------------------------------------------------------------------------

const WIKIPEDIA_ENDPOINT = "https://en.wikipedia.org/w/api.php";
// The geosearch module rejects radii above 10 km.
const WIKIPEDIA_RADIUS_M = 10_000;
const WIKIPEDIA_LIMIT = 50;
const WIKIPEDIA_TIMEOUT_MS = 8_000;
const WIKIPEDIA_MAX_PLACES = 30;

// How long Overpass gets to answer before the fallback takes over. Healthy
// mirrors reply inside this window; overloaded ones do not, and a slow success
// still upgrades the cache in the background afterwards.
const OVERPASS_FAST_PATH_MS = 6_000;

type WikipediaGeoItem = {
    pageid?: number;
    title?: string;
    lat?: number;
    lon?: number;
    dist?: number;
};

type WikipediaPage = { title?: string; categories?: Array<{ title?: string }> };

type WikipediaResponse = {
    query?: { geosearch?: WikipediaGeoItem[]; pages?: WikipediaPage[] };
    continue?: Record<string, string>;
};

function fetchWikipedia(params: Record<string, string>): Promise<WikipediaResponse> {
    const url = new URL(WIKIPEDIA_ENDPOINT);
    for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
    url.searchParams.set("format", "json");
    url.searchParams.set("formatversion", "2");

    return fetch(url, {
        headers: { Accept: "application/json", "User-Agent": "PilgoraTravelPlanner/1.0" },
        signal: AbortSignal.timeout(WIKIPEDIA_TIMEOUT_MS),
    }).then(async (response) => {
        if (!response.ok) throw new Error(`Wikipedia returned ${response.status}`);
        return (await response.json()) as WikipediaResponse;
    });
}

// Classification runs in tiers:
//   1. strong signals (a real fort, beach, church…) accepted immediately;
//   2. locality veto — Wikipedia tags villages, towns and districts with
//      "island", "river" or "tourist attraction" categories far too readily,
//      and the destination itself must never appear as its own highlight;
//   3. weak signals (a river, a street, a stadium) only when nothing above
//      matched, so a quiet village stays out but a genuinely interesting
//      riverside town can still appear.
// Categories are checked before titles: "Forts in Goa" identifies Reis Magos,
// which the title alone never would, while title matching keeps the fallback
// working when the category lookup fails.
const WIKIPEDIA_STRONG_RULES: Array<[RegExp, MappedPlaceKind, string]> = [
    [/beaches?\b|coastline/i, "attraction", "beach"],
    [/waterfalls?\b/i, "attraction", "waterfall"],
    [/forts?\b/i, "attraction", "fort"],
    [/castles?\b|palaces?\b/i, "attraction", "palace"],
    [/churches?\b|basilicas?\b|cathedrals?\b|chapels?\b/i, "attraction", "church"],
    [/temples?\b|mosques?\b|shrines?\b|synagogues?\b|gurudwaras?\b|monasteries?\b|convents?\b/i, "attraction", "religious_site"],
    [/museums?\b|galleries?\b|aquaria\b|centre for the arts|center for the arts/i, "attraction", "museum"],
    [/monuments?\b|memorials?\b|ruins\b|archaeolog/i, "attraction", "monument"],
    [/sanctuar|wildlife|national parks?\b|reserves?\b|gardens?\b/i, "attraction", "park"],
    [/bridges?\b|\bsetu\b|\bponte\b/i, "attraction", "bridge"],
    [/railway stations?\b/i, "transit", "railway_station"],
    [/bus stations?\b|bus stands?\b/i, "transit", "bus_station"],
    [/airports?\b|aerodromes?\b/i, "transit", "aerodrome"],
];

const WIKIPEDIA_WEAK_RULES: Array<[RegExp, MappedPlaceKind, string]> = [
    [/rivers?\b|lakes?\b|islands?\b|caves?\b|estuar|creeks?\b|bays?\b/i, "attraction", "nature"],
    [/markets?\b|bazaars?\b|shopping malls?\b|streets?\b|roads?\b/i, "attraction", "street"],
    [/heritage\b|historic quarters?\b|old towns?\b|houses?\b|mansions?\b|wada\b|havelis?\b|\(quarter\)/i, "attraction", "heritage"],
    [/stadiums?\b|sports complexes?\b/i, "attraction", "sports"],
    [/tourist attractions?\b|tourism in/i, "attraction", "attraction"],
];

// Titles naming an administration or an institution rather than somewhere
// somebody would travel: rejected before classification so a noisy category
// can never promote an assembly constituency or a school to a highlight.
const WIKIPEDIA_NOISE =
    /constituenc|\btaluka\b|\bdistrict\b|\bassembly\b|schools?\b|colleges?\b|universit|\binstitut|commission\b|hospital\b|polytechnic|vidyalaya|census\b|\bagency\b/i;

// Categories that mark a page as a settlement rather than a destination.
const WIKIPEDIA_LOCALITY =
    /villages in\b|populated places|cities and towns|census towns?\b|assembly constituencies|constituencies of|talukas? in|districts of/i;

function classifyWikipedia(
    haystack: string,
    rules: Array<[RegExp, MappedPlaceKind, string]>,
): { kind: MappedPlaceKind; category: string } | null {
    for (const [pattern, kind, category] of rules) {
        if (pattern.test(haystack)) return { kind, category };
    }
    return null;
}

function wikipediaToPlace(item: WikipediaGeoItem, categories: string[]): MappedPlace | null {
    const name = item.title?.trim();
    const lat = item.lat;
    const lon = item.lon;
    const distanceM = item.dist;
    if (!name) return null;
    if (typeof lat !== "number" || typeof lon !== "number" || typeof distanceM !== "number") return null;
    if (!Number.isFinite(lat) || !Number.isFinite(lon) || !Number.isFinite(distanceM)) return null;
    if (WIKIPEDIA_NOISE.test(name)) return null;

    const categoryText = categories.join(" | ");

    const strong = classifyWikipedia(categoryText, WIKIPEDIA_STRONG_RULES);
    if (!strong && WIKIPEDIA_LOCALITY.test(categoryText)) return null;

    const match =
        strong ??
        classifyWikipedia(name, WIKIPEDIA_STRONG_RULES) ??
        classifyWikipedia(categoryText, WIKIPEDIA_WEAK_RULES) ??
        classifyWikipedia(name, WIKIPEDIA_WEAK_RULES);
    if (!match) return null;

    return {
        id: `wikipedia-${item.pageid ?? name}`,
        name,
        kind: match.kind,
        category: match.category,
        lat,
        lon,
        distanceKm: Number((distanceM / 1000).toFixed(3)),
    };
}

/**
 * Look up categories for the matched articles. `cllimit=max` can paginate
 * across fifty articles, so follow the continuation a couple of times; a
 * failure here is not fatal because title-only classification still applies.
 */
async function fetchWikipediaCategories(titles: string[]): Promise<Map<string, string[]>> {
    const byTitle = new Map<string, string[]>();
    const usable = titles.filter((title) => Boolean(title) && !title.includes("|"));
    if (!usable.length) return byTitle;

    let params: Record<string, string> = {
        action: "query",
        titles: usable.join("|"),
        prop: "categories",
        cllimit: "max",
        clshow: "!hidden",
    };

    for (let round = 0; round < 3; round += 1) {
        let json: WikipediaResponse;
        try {
            json = await fetchWikipedia(params);
        } catch {
            break;
        }

        for (const page of json.query?.pages ?? []) {
            const title = page.title;
            if (!title) continue;
            const incoming = (page.categories ?? [])
                .map((category) => category.title?.replace(/^Category:/, ""))
                .filter((category): category is string => Boolean(category));
            if (incoming.length) byTitle.set(title, [...(byTitle.get(title) ?? []), ...incoming]);
        }

        const continuation = json.continue;
        if (!continuation) break;
        params = { action: "query", ...continuation };
    }

    return byTitle;
}

/** Nearest Wikipedia-described points of interest within the module's 10 km limit. */
async function fetchWikipediaNearby(lat: number, lon: number): Promise<MappedPlace[]> {
    const geo = await fetchWikipedia({
        action: "query",
        list: "geosearch",
        gscoord: `${lat}|${lon}`,
        gsradius: String(WIKIPEDIA_RADIUS_M),
        gslimit: String(WIKIPEDIA_LIMIT),
    });

    const items = geo.query?.geosearch ?? [];
    const categories = await fetchWikipediaCategories(
        items.map((item) => item.title ?? "").filter(Boolean),
    );

    const seen = new Set<string>();
    const places: MappedPlace[] = [];

    for (const item of items) {
        const place = wikipediaToPlace(item, categories.get(item.title ?? "") ?? []);
        if (!place) continue;
        const key = `${place.kind}:${place.name.toLocaleLowerCase()}`;
        if (seen.has(key)) continue;
        seen.add(key);
        places.push(place);
    }

    return places.sort((a, b) => a.distanceKm - b.distanceKm).slice(0, WIKIPEDIA_MAX_PLACES);
}

type MappedResult = { places: MappedPlace[]; source: string };

type OverpassOutcome =
    | { status: "ok"; places: MappedPlace[] }
    | { status: "failed" }
    | { status: "pending" };

/**
 * Give Overpass a short window to answer with its richer OSM data (stays,
 * food and transit as well as attractions). If it is still pending or has
 * failed by then, answer from Wikipedia — the request returns in seconds
 * instead of failing after the full retry budget. When Overpass is merely
 * slow, its eventual answer replaces the fallback entry in the cache.
 */
async function resolveMappedPlaces(lat: number, lon: number, cacheKey: string): Promise<MappedResult> {
    const overpass = queryMappedPlaces(lat, lon);
    const settled = overpass.then(
        (places) => ({ status: "ok" as const, places }),
        () => ({ status: "failed" as const }),
    );

    const outcome = await Promise.race<OverpassOutcome>([
        settled,
        sleep(OVERPASS_FAST_PATH_MS).then(() => ({ status: "pending" as const })),
    ]);

    if (outcome.status === "ok") return { places: outcome.places, source: "overpass" };

    let wikipedia: MappedPlace[] = [];
    try {
        wikipedia = await fetchWikipediaNearby(lat, lon);
    } catch {
        // No fallback either: fall through to Overpass's final answer or error.
    }

    if (wikipedia.length) {
        if (outcome.status === "pending") upgradeCacheInBackground(cacheKey, overpass);
        return { places: wikipedia, source: "wikipedia" };
    }

    return { places: await overpass, source: "overpass" };
}

/** Replace a fallback entry once a slower Overpass attempt finally succeeds. */
function upgradeCacheInBackground(cacheKey: string, overpass: Promise<MappedPlace[]>): void {
    overpass
        .then((places) => {
            if (!places.length) return;
            placeCache.set(cacheKey, { savedAt: Date.now(), places });
            persistCache();
        })
        .catch(() => {
            // Mirrors stayed busy; the Wikipedia entry already served stands.
        });
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const lat = Number(searchParams.get("lat"));
    const lon = Number(searchParams.get("lon"));

    if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
        return Response.json(
            { error: "Valid latitude and longitude are required." },
            { status: 400 },
        );
    }

    const headers = { "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400" };
    const cacheKey = `${lat.toFixed(3)},${lon.toFixed(3)}`;
    await loadCacheFromDisk();
    const cached = placeCache.get(cacheKey);

    if (cached && Date.now() - cached.savedAt < CACHE_TTL_MS) {
        const payload: MappedPlacesResponse = {
            places: cached.places,
            generatedAt: new Date(cached.savedAt).toISOString(),
            source: "cache",
        };
        return Response.json(payload, { headers });
    }

    try {
        const { places, source } = await resolveMappedPlaces(lat, lon, cacheKey);
        const generatedAt = new Date();

        placeCache.set(cacheKey, { savedAt: generatedAt.getTime(), places });
        if (placeCache.size > CACHE_MAX_ENTRIES) {
            // Insertion ordered: the first key is the oldest entry.
            const oldest = placeCache.keys().next().value;
            if (oldest) placeCache.delete(oldest);
        }
        persistCache();

        const payload: MappedPlacesResponse = {
            places,
            generatedAt: generatedAt.toISOString(),
            source,
        };
        return Response.json(payload, { headers });
    } catch {
        // Public mirrors go down often. Rather than empty cards, serve the last
        // known listing for these coordinates (kept for a week) when it exists.
        const staleCutoff = Date.now() - STALE_TTL_MS;
        if (cached && cached.savedAt > staleCutoff) {
            const payload: MappedPlacesResponse = {
                places: cached.places,
                generatedAt: new Date(cached.savedAt).toISOString(),
                source: "stale-cache",
            };
            return Response.json(payload, { headers });
        }

        return Response.json(
            { error: "Mapped places are unavailable right now." },
            { status: 502, headers },
        );
    }
}
