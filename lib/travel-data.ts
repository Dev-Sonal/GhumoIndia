import "server-only";

import type {
    AiTravelGuidance,
    Coordinates,
    LocationSuggestion,
    SourceStatus,
    TravelGuideData,
    TravelHighlight,
    TravelPlace,
    TravelSeason,
    TravelStay,
    TravelTransport,
} from "@/lib/travel-types";

type GuideRequest = {
    destination: string;
    coordinates: Coordinates | null;
    origin: string;
    duration: string;
    travellers: string;
    budget: string;
    tripType: string;
};

type CacheEntry<T> = {
    value: T;
    expiresAt: number;
};

type OverpassElement = {
    type: string;
    id: number;
    lat?: number;
    lon?: number;
    center?: { lat?: number; lon?: number };
    tags?: Record<string, string>;
};

type MapPlace = {
    id: string;
    name: string;
    lat: number;
    lon: number;
    tags: Record<string, string>;
    distanceKm: number;
};

const MAX_CACHE_ENTRIES = 120;
const responseCache = new Map<string, CacheEntry<unknown>>();
const inFlight = new Map<string, Promise<unknown>>();
const overpassEndpoints = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
];
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function normalizeText(value: string, limit = 160): string {
    return value.replace(/\s+/g, " ").trim().slice(0, limit);
}

function locationKey(value: string): string {
    return normalizeText(value).toLocaleLowerCase();
}

function isCoordinates(value: Coordinates | null | undefined): value is Coordinates {
    return Boolean(value)
        && Number.isFinite(value.lat)
        && Number.isFinite(value.lon)
        && Math.abs(value.lat) <= 90
        && Math.abs(value.lon) <= 180;
}

function cacheKeyForGuide(input: GuideRequest): string {
    const coordinates = isCoordinates(input.coordinates)
        ? `${input.coordinates.lat.toFixed(4)},${input.coordinates.lon.toFixed(4)}`
        : "auto";
    return [
        "guide",
        locationKey(input.destination),
        coordinates,
        normalizeText(input.origin).toLocaleLowerCase(),
        normalizeText(input.duration, 40),
        normalizeText(input.travellers, 40),
        normalizeText(input.budget, 40),
        normalizeText(input.tripType, 40),
    ].join(":");
}

function pruneCache(): void {
    const now = Date.now();
    for (const [key, entry] of responseCache) {
        if (entry.expiresAt <= now) responseCache.delete(key);
    }
    while (responseCache.size > MAX_CACHE_ENTRIES) {
        const oldest = responseCache.keys().next().value;
        if (!oldest) break;
        responseCache.delete(oldest);
    }
}

async function cached<T>(key: string, ttlMs: number, load: () => Promise<T>): Promise<T> {
    const existing = responseCache.get(key) as CacheEntry<T> | undefined;
    if (existing && existing.expiresAt > Date.now()) return existing.value;

    const pending = inFlight.get(key) as Promise<T> | undefined;
    if (pending) return pending;

    const request = load()
        .then((value) => {
            responseCache.set(key, { value, expiresAt: Date.now() + ttlMs });
            pruneCache();
            return value;
        })
        .finally(() => {
            inFlight.delete(key);
        });

    inFlight.set(key, request);
    return request;
}

async function fetchWithTimeout(url: string, init: RequestInit = {}, timeoutMs = 9_000): Promise<Response> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
        return await fetch(url, {
            ...init,
            signal: controller.signal,
            cache: "no-store",
        });
    } catch (error) {
        if (controller.signal.aborted) throw new Error("The data source timed out.");
        throw error;
    } finally {
        clearTimeout(timeout);
    }
}

function distanceKm(from: Coordinates, to: Coordinates): number {
    const radians = (degrees: number) => degrees * Math.PI / 180;
    const dLat = radians(to.lat - from.lat);
    const dLon = radians(to.lon - from.lon);
    const a = Math.sin(dLat / 2) ** 2
        + Math.cos(radians(from.lat)) * Math.cos(radians(to.lat)) * Math.sin(dLon / 2) ** 2;
    return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function uniqueByName<T extends { name: string }>(items: T[]): T[] {
    const seen = new Set<string>();
    return items.filter((item) => {
        const key = item.name.toLocaleLowerCase().replace(/\s+/g, " ").trim();
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

async function fetchPhotonSuggestions(query: string, limit: number): Promise<LocationSuggestion[]> {
    const params = new URLSearchParams({ q: query, limit: String(limit), lang: "en" });
    const response = await fetchWithTimeout(`https://photon.komoot.io/api/?${params.toString()}`, {}, 6_000);
    if (!response.ok) throw new Error("Location search is unavailable.");

    const payload = await response.json() as {
        features?: Array<{
            geometry?: { coordinates?: [number, number] };
            properties?: {
                osm_id?: number;
                name?: string;
                city?: string;
                town?: string;
                village?: string;
                state?: string;
                country?: string;
                type?: string;
            };
        }>;
    };

    const unique = new Map<string, LocationSuggestion>();
    for (const feature of payload.features ?? []) {
        const properties = feature.properties;
        const name = properties?.name ?? properties?.city ?? properties?.town ?? properties?.village;
        if (!name) continue;

        const locality = properties.city ?? properties.town ?? properties.village;
        const parts = [name];
        if (locality && locality.toLocaleLowerCase() !== name.toLocaleLowerCase()) parts.push(locality);
        if (properties.state && !parts.some((part) => part.toLocaleLowerCase() === properties.state?.toLocaleLowerCase())) {
            parts.push(properties.state);
        }
        if (properties.country) parts.push(properties.country);

        const label = [...new Set(parts)].join(", ");
        const key = label.toLocaleLowerCase();
        const point = feature.geometry?.coordinates;
        const coordinates = point && Number.isFinite(point[0]) && Number.isFinite(point[1])
            ? { lon: point[0], lat: point[1] }
            : null;

        if (!unique.has(key)) {
            unique.set(key, {
                id: `${properties?.osm_id ?? key}-${key}`,
                name,
                label,
                type: properties?.type,
                coordinates,
            });
        }
    }

    return rankSuggestions([...unique.values()], query).slice(0, limit);
}

/** Relevance order shared by every geocoder: exact name, prefix, then substring. */
function rankSuggestions(
    suggestions: LocationSuggestion[],
    query: string,
    positionOf?: (item: LocationSuggestion) => number,
): LocationSuggestion[] {
    const normalized = query.toLocaleLowerCase();
    const score = (item: LocationSuggestion) => {
        const name = item.name.toLocaleLowerCase();
        const label = item.label.toLocaleLowerCase();
        if (name === normalized) return 0;
        if (name.startsWith(normalized)) return 1;
        if (label.startsWith(normalized)) return 2;
        if (name.includes(normalized)) return 3;
        return 4;
    };
    // Pilgora plans trips in India: for equally good name matches an Indian
    // place wins over e.g. "Goa, Dagestan" or "Delhi, Iowa". Foreign matches
    // still surface when nothing in India matches.
    const country = (item: LocationSuggestion) => /(?:^|,)\s*india$/i.test(item.label) ? 0 : 1;

    return suggestions.sort((left, right) => {
        const byName = score(left) - score(right);
        if (byName) return byName;
        const byCountry = country(left) - country(right);
        if (byCountry) return byCountry;
        // Providers order results by importance/population — "Shimla, Himachal
        // Pradesh" must outrank a smaller namesake before alphabetical order.
        if (positionOf) {
            const byPosition = positionOf(left) - positionOf(right);
            if (byPosition) return byPosition;
        }
        return left.label.localeCompare(right.label);
    });
}

/** Label in the same shape for every provider, so merged lists read consistently. */
function buildLabel(name: string, parts: Array<string | undefined | null>): string {
    const seen = new Set<string>();
    return [name, ...parts]
        .map((part) => part?.trim() ?? "")
        .filter((part) => {
            if (!part) return false;
            const key = part.toLocaleLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        })
        .join(", ");
}

/** Same place returned by two providers collapses into one dropdown row. */
function suggestionKey(item: LocationSuggestion): string {
    const name = item.name.toLocaleLowerCase().replace(/\s+/g, " ").trim();
    // Compare name + the stable tail of the label (state, country). One
    // provider may add a district the others omit; that must not create a
    // second row for the same town, while the same name in another state
    // stays a separate suggestion.
    const parts = item.label.split(",").map((part) => part.trim().toLocaleLowerCase()).filter(Boolean);
    const tail = parts.slice(-2).join(",");
    return tail ? `${name}|${tail}` : `${name}|${item.label.toLocaleLowerCase()}`;
}

const GEOCODER_TIMEOUT_MS = 6_000;
// Once one provider answers, give the others a brief window to enrich the
// merged list — but never let a hanging provider delay the dropdown.
const GEOCODER_GRACE_MS = 900;

/** Nominatim's public usage policy allows ~1 request/second per IP. */
const NOMINATIM_MIN_INTERVAL_MS = 1_100;
let lastNominatimStartedAt = 0;

async function fetchNominatimSuggestions(query: string, limit: number): Promise<LocationSuggestion[]> {
    // Keyboard bursts must not hammer the public instance; the other two
    // providers answer in the meantime.
    const now = Date.now();
    if (now - lastNominatimStartedAt < NOMINATIM_MIN_INTERVAL_MS) return [];
    lastNominatimStartedAt = now;

    const params = new URLSearchParams({
        q: query,
        format: "jsonv2",
        limit: String(limit),
        addressdetails: "1",
    });
    const response = await fetchWithTimeout(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
        headers: {
            Accept: "application/json",
            "User-Agent": "Pilgora/1.0 travel-planning application",
        },
    }, GEOCODER_TIMEOUT_MS);
    if (!response.ok) throw new Error("Location search is unavailable.");

    const results = await response.json() as Array<{
        lat?: string;
        lon?: string;
        name?: string;
        display_name?: string;
        type?: string;
        address?: Record<string, string | undefined>;
    }>;

    const suggestions: LocationSuggestion[] = [];
    for (const item of results) {
        const lat = Number(item.lat);
        const lon = Number(item.lon);
        const name = item.name?.trim() || item.display_name?.split(",")[0]?.trim();
        if (!name || !Number.isFinite(lat) || !Number.isFinite(lon)
            || Math.abs(lat) > 90 || Math.abs(lon) > 180) continue;

        const address = item.address ?? {};
        suggestions.push({
            id: `nominatim:${lat},${lon}`,
            name,
            label: buildLabel(name, [
                address.city ?? address.town ?? address.village,
                address.state,
                address.country,
            ]),
            type: item.type,
            coordinates: { lat, lon },
        });
    }

    return suggestions;
}

async function fetchOpenMeteoSuggestions(query: string, limit: number): Promise<LocationSuggestion[]> {
    const params = new URLSearchParams({
        name: query,
        count: String(limit),
        language: "en",
        format: "json",
    });
    const response = await fetchWithTimeout(
        `https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`,
        {},
        GEOCODER_TIMEOUT_MS,
    );
    if (!response.ok) throw new Error("Location search is unavailable.");

    const payload = await response.json() as {
        results?: Array<{
            id?: number;
            name?: string;
            latitude?: number;
            longitude?: number;
            country?: string;
            admin1?: string;
            admin2?: string;
            feature_code?: string;
        }>;
    };

    const suggestions: LocationSuggestion[] = [];
    for (const item of payload.results ?? []) {
        const name = item.name?.trim();
        const lat = item.latitude;
        const lon = item.longitude;
        if (!name || typeof lat !== "number" || typeof lon !== "number"
            || !Number.isFinite(lat) || !Number.isFinite(lon)
            || Math.abs(lat) > 90 || Math.abs(lon) > 180) continue;

        suggestions.push({
            id: `open-meteo:${item.id ?? `${lat},${lon}`}`,
            name,
            label: buildLabel(name, [item.admin2, item.admin1, item.country]),
            type: item.feature_code,
            coordinates: { lat, lon },
        });
    }

    return suggestions;
}

/**
 * Photon, Nominatim and Open-Meteo geocoding run on independent infrastructure.
 * Whichever answers first, the dropdown works — providers that hang or fail are
 * skipped instead of holding up the merged result.
 */
async function searchGeocoders(query: string, limit: number): Promise<LocationSuggestion[]> {
    const providers = [fetchPhotonSuggestions, fetchNominatimSuggestions, fetchOpenMeteoSuggestions];
    const attempts = providers.map((provider) => provider(query, limit).then(
        (suggestions) => ({ ok: true as const, suggestions }),
        (error: unknown) => ({ ok: false as const, error }),
    ));

    // Indexed by provider, not by arrival order: each provider's own ranking
    // (importance, population) is its strongest relevance signal.
    const batches: Array<LocationSuggestion[] | null> = providers.map(() => null);
    let answered = 0;
    let lastError: unknown;

    await new Promise<void>((resolve) => {
        let remaining = attempts.length;
        attempts.forEach((attempt, index) => {
            void attempt.then((outcome) => {
                remaining -= 1;
                if (outcome.ok) {
                    batches[index] = outcome.suggestions;
                    answered += 1;
                    setTimeout(resolve, GEOCODER_GRACE_MS);
                } else {
                    lastError = outcome.error;
                }
                if (remaining === 0) resolve();
            });
        });
    });

    const merged = new Map<string, LocationSuggestion>();
    const ranks = new Map<string, Array<number | undefined>>();
    batches.forEach((batch, providerIndex) => {
        batch?.forEach((suggestion, position) => {
            const key = suggestionKey(suggestion);
            let tuple = ranks.get(key);
            if (!tuple) {
                tuple = new Array<number | undefined>(providers.length).fill(undefined);
                ranks.set(key, tuple);
            }
            if (tuple[providerIndex] === undefined) tuple[providerIndex] = position;
            if (!merged.has(key)) merged.set(key, suggestion);
        });
    });

    // Fold each position tuple into one integer (Photon's slot most
    // significant), so ties resolve by Photon's verdict first, then
    // Nominatim's, then Open-Meteo's — e.g. Nominatim ranks the famous
    // "Manali, Himachal Pradesh" above a larger Tamil Nadu namesake that
    // Open-Meteo sorts first by population.
    const base = limit + 1;
    const precedence = new Map<string, number>();
    for (const [key, tuple] of ranks) {
        precedence.set(key, tuple.reduce<number>((acc, position) => acc * base + (position ?? limit), 0));
    }

    // No provider answered at all → outage. A provider that answered with
    // nothing is a legitimate "no matches" and must stay an empty list.
    if (answered === 0) {
        throw lastError instanceof Error ? lastError : new Error("Location search is unavailable.");
    }

    return rankSuggestions(
        [...merged.values()],
        query,
        (item) => precedence.get(suggestionKey(item)) ?? Number.MAX_SAFE_INTEGER,
    ).slice(0, limit);
}

export async function getLocationSuggestions(query: string, limit = 8): Promise<LocationSuggestion[]> {
    const normalizedQuery = normalizeText(query, 120);
    if (normalizedQuery.length < 2) return [];
    const normalizedLimit = Math.max(1, Math.min(limit, 8));
    return cached(`locations:${normalizedQuery.toLocaleLowerCase()}:${normalizedLimit}`, 10 * 60_000, () =>
        searchGeocoders(normalizedQuery, normalizedLimit),
    );
}

async function geocodeDestination(destination: string): Promise<{
    coordinates: Coordinates | null;
    displayName: string | null;
    isAmbiguous: boolean;
}> {
    // Same multi-provider search as the autocomplete, so a typed destination
    // resolves even when a single geocoder is down.
    const matches = (await getLocationSuggestions(destination, 5)).filter((match) => match.coordinates);
    const first = matches[0];

    return {
        coordinates: first?.coordinates ?? null,
        displayName: first?.label ?? null,
        isAmbiguous: matches.length > 1,
    };
}

async function loadDestinationSummary(destination: string): Promise<TravelGuideData["summary"]> {
    const searchParams = new URLSearchParams({
        action: "query",
        list: "search",
        srsearch: destination,
        srlimit: "1",
        format: "json",
        origin: "*",
    });
    const searchResponse = await fetchWithTimeout(`https://en.wikipedia.org/w/api.php?${searchParams.toString()}`);
    if (!searchResponse.ok) throw new Error("Destination overview search failed.");
    const searchData = await searchResponse.json() as { query?: { search?: Array<{ title?: string }> } };
    const title = searchData.query?.search?.[0]?.title;
    if (!title) return null;

    const summaryResponse = await fetchWithTimeout(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
    );
    if (!summaryResponse.ok) throw new Error("Destination overview is unavailable.");
    const summary = await summaryResponse.json() as {
        extract?: string;
        type?: string;
        title?: string;
        content_urls?: { desktop?: { page?: string } };
    };
    const text = summary.type === "disambiguation" ? "" : normalizeText(summary.extract ?? "", 700);
    if (!text) return null;

    return {
        title: summary.title ?? title,
        text,
        url: summary.content_urls?.desktop?.page
            ?? `https://en.wikipedia.org/wiki/${encodeURIComponent((summary.title ?? title).replace(/ /g, "_"))}`,
    };
}

async function loadClimate(coordinates: Coordinates): Promise<TravelSeason[]> {
    const currentYear = new Date().getUTCFullYear();
    const params = new URLSearchParams({
        latitude: String(coordinates.lat),
        longitude: String(coordinates.lon),
        start_date: `${currentYear - 3}-01-01`,
        end_date: `${currentYear - 1}-12-31`,
        daily: "temperature_2m_mean,precipitation_sum",
        timezone: "auto",
    });
    const response = await fetchWithTimeout(`https://archive-api.open-meteo.com/v1/archive?${params.toString()}`, {}, 10_000);
    if (!response.ok) throw new Error("Climate history is unavailable.");
    const data = await response.json() as {
        daily?: {
            time?: string[];
            temperature_2m_mean?: Array<number | null>;
            precipitation_sum?: Array<number | null>;
        };
    };

    const monthly = Array.from({ length: 12 }, (_, index) => ({
        month: index + 1,
        tempTotal: 0,
        tempCount: 0,
        rainTotal: 0,
        rainCount: 0,
    }));
    (data.daily?.time ?? []).forEach((date, index) => {
        const month = Number(date.slice(5, 7)) - 1;
        const temperature = data.daily?.temperature_2m_mean?.[index];
        const rain = data.daily?.precipitation_sum?.[index];
        if (monthly[month] && typeof temperature === "number" && Number.isFinite(temperature)) {
            monthly[month].tempTotal += temperature;
            monthly[month].tempCount += 1;
        }
        if (monthly[month] && typeof rain === "number" && Number.isFinite(rain)) {
            monthly[month].rainTotal += rain;
            monthly[month].rainCount += 1;
        }
    });

    const ranked = monthly
        .filter((month) => month.tempCount > 0 && month.rainCount > 0)
        .map((month) => ({
            ...month,
            averageTemp: month.tempTotal / month.tempCount,
            averageRain: month.rainTotal / month.rainCount,
        }));
    if (!ranked.length) return [];

    const comfortScore = (month: typeof ranked[number]) => Math.abs(month.averageTemp - 22) + month.averageRain * 0.08;
    const byComfort = [...ranked].sort((left, right) => comfortScore(left) - comfortScore(right));
    const label = (months: typeof ranked) => months.map((month) => monthNames[month.month - 1]).join(", ");
    const best = byComfort.slice(0, 4).sort((left, right) => left.month - right.month);
    const value = byComfort.slice(4, 7).sort((left, right) => left.month - right.month);

    const seasons: TravelSeason[] = [
        {
            kind: "best",
            title: "Best experience",
            months: label(best),
            description: "Climate-based estimate using historical temperature and rainfall, not a forecast. Check weather and local advisories before travelling.",
        },
    ];
    if (value.length) {
        seasons.push({
            kind: "value",
            title: "Best value (climate estimate)",
            months: label(value),
            description: "A possible alternative to the mildest months based on climate only. Accommodation and transport prices are not included.",
        });
    }
    seasons.push({
        kind: "price",
        title: "Cheapest time",
        months: "Price data unavailable",
        description: "Live or historical travel-price data is not connected, so the cheapest months cannot be verified.",
    });
    return seasons;
}

function buildMapQuery(coordinates: Coordinates): string {
    const { lat, lon } = coordinates;
    return `
[out:json][timeout:18];
(
  node(around:50000,${lat},${lon})[tourism~"^(attraction|museum|viewpoint|zoo|theme_park|gallery)$"];
  way(around:50000,${lat},${lon})[tourism~"^(attraction|museum|viewpoint|zoo|theme_park|gallery)$"];
  relation(around:50000,${lat},${lon})[tourism~"^(attraction|museum|viewpoint|zoo|theme_park|gallery)$"];
  node(around:50000,${lat},${lon})[historic~"^(monument|castle|fort|ruins|memorial|archaeological_site)$"];
  way(around:50000,${lat},${lon})[historic~"^(monument|castle|fort|ruins|memorial|archaeological_site)$"];
  node(around:50000,${lat},${lon})[natural~"^(beach|waterfall|cave|hot_spring)$"];
  way(around:50000,${lat},${lon})[natural~"^(beach|waterfall|cave|hot_spring)$"];
  node(around:50000,${lat},${lon})[leisure~"^(park|garden|nature_reserve)$"];
  way(around:50000,${lat},${lon})[leisure~"^(park|garden|nature_reserve)$"];
  node(around:12000,${lat},${lon})[tourism~"^(hotel|hostel|guest_house|motel|apartment|chalet|camp_site)$"];
  way(around:12000,${lat},${lon})[tourism~"^(hotel|hostel|guest_house|motel|apartment|chalet|camp_site)$"];
  node(around:12000,${lat},${lon})[amenity~"^(restaurant|food_court|cafe)$"];
  way(around:12000,${lat},${lon})[amenity~"^(restaurant|food_court|cafe)$"];
  node(around:30000,${lat},${lon})[railway~"^(station|halt)$"];
  node(around:30000,${lat},${lon})[amenity~"^(bus_station|ferry_terminal)$"];
  node(around:30000,${lat},${lon})[aeroway="aerodrome"];
);
out center tags;
`;
}

async function loadMapPlaces(coordinates: Coordinates): Promise<MapPlace[]> {
    const query = buildMapQuery(coordinates);
    let lastError: unknown;
    for (const endpoint of overpassEndpoints) {
        try {
            const response = await fetchWithTimeout(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
                body: new URLSearchParams({ data: query }).toString(),
            }, 14_000);
            if (!response.ok) {
                const retryable = [429, 502, 503, 504].includes(response.status);
                if (!retryable) throw new Error(`Map service returned ${response.status}.`);
                lastError = new Error(`Map service returned ${response.status}.`);
                continue;
            }
            const data = await response.json() as { elements?: OverpassElement[] };
            const candidates: MapPlace[] = [];
            for (const element of data.elements ?? []) {
                const name = normalizeText(element.tags?.name ?? "", 180);
                const lat = element.lat ?? element.center?.lat;
                const lon = element.lon ?? element.center?.lon;
                if (!name || !Number.isFinite(lat) || !Number.isFinite(lon)) continue;
                const tags = element.tags ?? {};
                const building = tags.building?.toLocaleLowerCase();
                if (tags.shop || tags.office || tags.craft || ["commercial", "retail", "office", "industrial"].includes(building ?? "")) continue;
                const point = { lat: Number(lat), lon: Number(lon) };
                const distance = distanceKm(coordinates, point);
                if (!Number.isFinite(distance) || distance > 50) continue;
                candidates.push({
                    id: `${element.type}-${element.id}`,
                    name,
                    lat: point.lat,
                    lon: point.lon,
                    tags,
                    distanceKm: distance,
                });
            }
            return candidates.sort((left, right) => left.distanceKm - right.distanceKm);
        } catch (error) {
            lastError = error;
        }
    }
    throw lastError instanceof Error ? lastError : new Error("Map data is unavailable.");
}

function isAttraction(tags: Record<string, string>): boolean {
    return ["attraction", "museum", "viewpoint", "gallery", "zoo", "theme_park"].includes(tags.tourism ?? "")
        || Boolean(tags.historic)
        || Boolean(tags.natural)
        || ["park", "garden", "nature_reserve"].includes(tags.leisure ?? "");
}

function toNearbyPlaces(places: MapPlace[]): TravelPlace[] {
    const namedLocations: MapPlace[] = [];
    for (const place of places.filter((item) => isAttraction(item.tags))) {
        const duplicate = namedLocations.some((existing) => existing.name.toLocaleLowerCase() === place.name.toLocaleLowerCase()
            && distanceKm(existing, place) < 0.25);
        if (!duplicate) namedLocations.push(place);
    }
    return namedLocations.slice(0, 30).map((place) => ({
        id: place.id,
        name: place.name,
        distance: `${place.distanceKm.toFixed(place.distanceKm < 10 ? 1 : 0)} km away`,
        duration: "Straight-line distance",
        recommendation: (place.tags.tourism ?? place.tags.historic ?? place.tags.natural ?? place.tags.leisure ?? "attraction").replaceAll("_", " "),
        lat: place.lat,
        lon: place.lon,
    }));
}

function toStays(places: MapPlace[], destination: string): TravelStay[] {
    const stayTypes = ["hotel", "hostel", "guest_house", "motel", "apartment", "chalet", "camp_site"];
    const stays = places
        .filter((place) => stayTypes.includes(place.tags.tourism ?? ""))
        .map((place) => ({
            name: place.name,
            description: `${(place.tags.tourism ?? "Accommodation").replaceAll("_", " ")} listed in OpenStreetMap near ${destination}. Verify location, reviews, availability and rates.`,
            price: "Check current rates",
            recommended: false,
        }));
    return uniqueByName(stays).slice(0, 5).map((stay, index) => ({ ...stay, recommended: index === 0 }));
}

function toFoods(places: MapPlace[]): string[] {
    const foods = new Set<string>();
    for (const place of places) {
        if (!["restaurant", "food_court", "cafe"].includes(place.tags.amenity ?? "")) continue;
        for (const cuisine of (place.tags.cuisine ?? "").split(";")) {
            const normalized = normalizeText(cuisine, 80);
            if (normalized) foods.add(normalized);
        }
    }
    return [...foods].slice(0, 8);
}

function toTransport(places: MapPlace[]): TravelTransport[] {
    const types = new Set<TravelTransport["kind"]>();
    for (const place of places) {
        if (["station", "halt"].includes(place.tags.railway ?? "")) types.add("rail");
        if (place.tags.amenity === "bus_station") types.add("bus");
        if (place.tags.amenity === "ferry_terminal") types.add("ferry");
        if (place.tags.aeroway === "aerodrome") types.add("airport");
    }
    const labels: Record<TravelTransport["kind"], { title: string; subtitle: string }> = {
        rail: { title: "Mapped local option", subtitle: "Railway station" },
        bus: { title: "Bus station", subtitle: "Bus station" },
        ferry: { title: "Ferry terminal", subtitle: "Ferry terminal" },
        airport: { title: "Airport", subtitle: "Airport" },
        local: { title: "Local transfer", subtitle: "Taxi / cab" },
    };
    const mapped = [...types].slice(0, 3).map((kind, index) => ({
        ...labels[kind],
        price: "Check operator for current fares",
        duration: "Depends on route",
        kind,
        recommended: index === 0,
    }));
    if (mapped.length) return mapped;
    return [
        { title: "Public transport", subtitle: "Bus / train where available", price: "Check operator fares", duration: "Route dependent", kind: "rail", recommended: true },
        { ...labels.local, price: "Check local rates", duration: "Route dependent", kind: "local", recommended: false },
    ];
}

function toHighlights(nearbyPlaces: TravelPlace[], foods: string[], stays: TravelStay[], transport: TravelTransport[], destination: string): TravelHighlight[] {
    const highlights: TravelHighlight[] = nearbyPlaces.slice(0, 3).map((place) => ({ kind: "place", title: place.name }));
    if (foods.length) highlights.push({ kind: "food", title: `Food and cafes: ${foods.slice(0, 3).join(", ")}` });
    if (stays.length) highlights.push({ kind: "stay", title: `${stays.length} accommodation listings to compare` });
    if (transport.some((option) => option.subtitle !== "Taxi / cab")) {
        highlights.push({ kind: "transit", title: `Transport links: ${transport.slice(0, 3).map((option) => option.subtitle).join(", ")}` });
    }
    if (highlights.length < 3) highlights.push({ kind: "general", title: `Explore more mapped attractions around ${destination}` });
    if (highlights.length < 4) highlights.push({ kind: "weather", title: "Check opening hours, access and local weather before visiting" });
    return highlights;
}

function readString(value: unknown, maxLength: number): string | null {
    return typeof value === "string" && value.trim().length > 0 ? normalizeText(value, maxLength) : null;
}

function parseAiGuidance(value: unknown): AiTravelGuidance | null {
    if (!value || typeof value !== "object" || Array.isArray(value)) return null;
    const candidate = value as Record<string, unknown>;
    const overview = readString(candidate.overview, 600);
    if (!overview || !Array.isArray(candidate.days) || !Array.isArray(candidate.cautions)) return null;

    const days = candidate.days.slice(0, 7).flatMap((day) => {
        if (!day || typeof day !== "object" || Array.isArray(day)) return [];
        const record = day as Record<string, unknown>;
        const focus = readString(record.focus, 120);
        const suggestions = Array.isArray(record.suggestions)
            ? record.suggestions.map((suggestion) => readString(suggestion, 220)).filter((suggestion): suggestion is string => Boolean(suggestion)).slice(0, 5)
            : [];
        return focus && suggestions.length ? [{ focus, suggestions }] : [];
    });
    const cautions = candidate.cautions
        .map((caution) => readString(caution, 220))
        .filter((caution): caution is string => Boolean(caution))
        .slice(0, 4);
    return days.length ? { overview, days, cautions } : null;
}

async function generateAiGuidance(input: GuideRequest, facts: Omit<TravelGuideData, "ai" | "sourceStatus">): Promise<AiTravelGuidance | null> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;

    const factualContext = {
        destination: facts.destination,
        summary: facts.summary ? { title: facts.summary.title, text: facts.summary.text } : null,
        nearbyPlaces: facts.nearbyPlaces.slice(0, 10).map(({ name, recommendation, distance }) => ({ name, recommendation, distance })),
        climate: facts.seasons,
        foods: facts.foods,
        stays: facts.stays.slice(0, 5).map(({ name }) => name),
        transport: facts.transport.map(({ subtitle }) => subtitle),
        preferences: {
            origin: input.origin,
            duration: input.duration,
            travellers: input.travellers,
            budget: input.budget,
            tripType: input.tripType,
        },
    };
    const schema = {
        type: "object",
        properties: {
            overview: { type: "string" },
            days: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        focus: { type: "string" },
                        suggestions: { type: "array", items: { type: "string" } },
                    },
                    required: ["focus", "suggestions"],
                },
            },
            cautions: { type: "array", items: { type: "string" } },
        },
        required: ["overview", "days", "cautions"],
    };
    const prompt = [
        "Create concise, optional travel-planning guidance using only the factual JSON supplied below.",
        "Do not invent or imply prices, booking availability, opening hours, route duration, transport schedules, safety conditions, or cheapest months.",
        "Only reference named places that appear in nearbyPlaces. Treat all visits as suggestions and remind the traveller to verify local details.",
        "Use at most one day object per requested day, up to seven. If map data is sparse, provide fewer days rather than making up places.",
        `FACTS: ${JSON.stringify(factualContext)}`,
    ].join("\n");
    const model = normalizeText(process.env.GEMINI_MODEL ?? "gemini-2.5-flash-lite", 80);
    const response = await fetchWithTimeout(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.2,
                    responseMimeType: "application/json",
                    responseJsonSchema: schema,
                },
            }),
        },
        9_000,
    );
    if (!response.ok) throw new Error("AI guidance is unavailable.");
    const data = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("").trim();
    if (!text) return null;
    try {
        return parseAiGuidance(JSON.parse(text));
    } catch {
        return null;
    }
}

function emptyGuide(input: GuideRequest, summary: TravelGuideData["summary"], summaryStatus: SourceStatus, geocoding: SourceStatus): TravelGuideData {
    return {
        destination: { name: input.destination, displayName: null, coordinates: null, isAmbiguous: false },
        summary,
        nearbyPlaces: [],
        seasons: [],
        highlights: [],
        transport: [],
        stays: [],
        foods: [],
        ai: null,
        sourceStatus: { geocoding, summary: summaryStatus, climate: "unavailable", map: "unavailable", ai: process.env.GEMINI_API_KEY ? "unavailable" : "not-configured" },
    };
}

async function createTravelGuide(input: GuideRequest): Promise<TravelGuideData> {
    const summaryTask = loadDestinationSummary(input.destination);
    let resolution = {
        coordinates: input.coordinates,
        displayName: null as string | null,
        isAmbiguous: false,
    };
    let geocodingStatus: SourceStatus = isCoordinates(input.coordinates) ? "ready" : "unavailable";

    if (!isCoordinates(input.coordinates)) {
        try {
            resolution = await cached(`geocode:${locationKey(input.destination)}`, 24 * 60 * 60_000, () => geocodeDestination(input.destination));
            geocodingStatus = resolution.coordinates ? "ready" : "unavailable";
        } catch {
            geocodingStatus = "unavailable";
        }
    }

    const coordinates = resolution.coordinates;
    if (!isCoordinates(coordinates)) {
        const summaryResult = await Promise.allSettled([summaryTask]);
        return emptyGuide(
            input,
            summaryResult[0].status === "fulfilled" ? summaryResult[0].value : null,
            summaryResult[0].status === "fulfilled" ? "ready" : "unavailable",
            geocodingStatus,
        );
    }

    const [summaryResult, climateResult, mapResult] = await Promise.allSettled([
        summaryTask,
        loadClimate(coordinates),
        loadMapPlaces(coordinates),
    ]);
    const summary = summaryResult.status === "fulfilled" ? summaryResult.value : null;
    const mapPlaces = mapResult.status === "fulfilled" ? mapResult.value : [];
    const nearbyPlaces = toNearbyPlaces(mapPlaces);
    const stays = toStays(mapPlaces, input.destination);
    const foods = toFoods(mapPlaces);
    const transport = toTransport(mapPlaces);
    const seasons = climateResult.status === "fulfilled" ? climateResult.value : [];
    const factual: Omit<TravelGuideData, "ai" | "sourceStatus"> = {
        destination: {
            name: input.destination,
            displayName: resolution.displayName,
            coordinates,
            isAmbiguous: resolution.isAmbiguous,
        },
        summary,
        nearbyPlaces,
        seasons,
        highlights: toHighlights(nearbyPlaces, foods, stays, transport, input.destination),
        transport,
        stays,
        foods,
    };

    let ai: AiTravelGuidance | null = null;
    let aiStatus: SourceStatus = process.env.GEMINI_API_KEY ? "unavailable" : "not-configured";
    if (process.env.GEMINI_API_KEY && (nearbyPlaces.length > 0 || summary || seasons.length > 0)) {
        try {
            ai = await generateAiGuidance(input, factual);
            aiStatus = ai ? "ready" : "unavailable";
        } catch {
            aiStatus = "unavailable";
        }
    }

    return {
        ...factual,
        ai,
        sourceStatus: {
            geocoding: geocodingStatus,
            summary: summaryResult.status === "fulfilled" ? "ready" : "unavailable",
            climate: climateResult.status === "fulfilled" ? "ready" : "unavailable",
            map: mapResult.status === "fulfilled" ? "ready" : "unavailable",
            ai: aiStatus,
        },
    };
}

export async function getTravelGuide(input: GuideRequest): Promise<TravelGuideData> {
    const key = cacheKeyForGuide(input);
    const guide = await cached(key, 15 * 60_000, () => createTravelGuide(input));
    if (isCoordinates(guide.destination.coordinates)) {
        const resolvedKey = cacheKeyForGuide({ ...input, coordinates: guide.destination.coordinates });
        responseCache.set(resolvedKey, { value: guide, expiresAt: Date.now() + 15 * 60_000 });
    }
    return guide;
}
