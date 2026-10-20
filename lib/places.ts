// Shared shape returned by /api/places.
//
// The heavy OpenStreetMap (Overpass) work happens once, on the server, and the
// route returns a small classified list. Every map-backed dashboard card
// (Trip Highlights, Top Places, Nearby Places, stays, food, transport) reads
// from this single payload instead of issuing its own Overpass query.
export type MappedPlaceKind = "attraction" | "stay" | "food" | "transit";

export type MappedPlace = {
    id: string;
    name: string;
    kind: MappedPlaceKind;
    /** Raw OSM category value (tourism/historic/natural/leisure/amenity/...). */
    category: string;
    lat: number;
    lon: number;
    /** Straight-line distance from the destination, in kilometres. */
    distanceKm: number;
    /** OSM cuisine tags, semicolon separated. Only set for food places. */
    cuisine?: string;
};

export type MappedPlacesResponse = {
    places: MappedPlace[];
    generatedAt: string;
    source: string;
};

const CACHE_KEY_PREFIX = "pilgora-mapped-places-v1";
// Map edits trickle in slowly, so a day of client-side reuse is safe and makes
// revisits and route changes instant.
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

const cacheStorageKey = (lat: number, lon: number) =>
    `${CACHE_KEY_PREFIX}:${lat.toFixed(2)}:${lon.toFixed(2)}`;

// Several dashboard effects ask for the same destination at the same time;
// share one in-flight request instead of paying for it twice.
const inFlight = new Map<string, Promise<MappedPlace[]>>();

const abortError = () => new DOMException("Request aborted", "AbortError");

/**
 * Fetch classified mapped places for a destination.
 *
 * - One shared request serves every caller for the same coordinates.
 * - Results are cached in sessionStorage for 24 hours.
 * - A caller's `signal` only detaches that caller. The shared request itself is
 *   never cancelled, so one effect cleaning up (React Strict Mode double-mount,
 *   a re-render, a navigation) can no longer make every other caller observe an
 *   AbortError — which the dashboard effects intentionally treat as "show
 *   nothing", producing empty cards. The request still finishes and warms the
 *   cache for whoever asks next.
 */
export function fetchMappedPlaces(
    lat: number,
    lon: number,
    signal?: AbortSignal,
): Promise<MappedPlace[]> {
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return Promise.resolve([]);
    if (signal?.aborted) return Promise.reject(abortError());

    const key = cacheStorageKey(lat, lon);

    let pending = inFlight.get(key);
    if (!pending) {
        pending = loadPlaces(lat, lon, key).finally(() => {
            inFlight.delete(key);
        });
        inFlight.set(key, pending);
    }

    if (!signal) return pending;

    // Wait for the shared request, but honour this caller's own cancellation.
    return new Promise<MappedPlace[]>((resolve, reject) => {
        const onAbort = () => reject(abortError());
        signal.addEventListener("abort", onAbort, { once: true });
        pending.then(
            (places) => {
                signal.removeEventListener("abort", onAbort);
                resolve(places);
            },
            (error: unknown) => {
                signal.removeEventListener("abort", onAbort);
                reject(error);
            },
        );
    });
}

async function loadPlaces(lat: number, lon: number, key: string): Promise<MappedPlace[]> {
    const cached = readCache(key);
    if (cached) return cached;

    const params = new URLSearchParams({ lat: String(lat), lon: String(lon) });
    const response = await fetch(`/api/places?${params.toString()}`);
    if (!response.ok) throw new Error(`Mapped places unavailable (${response.status}).`);

    const data = (await response.json()) as Partial<MappedPlacesResponse>;
    const places = Array.isArray(data.places) ? data.places : [];
    writeCache(key, places);
    return places;
}

function readCache(key: string): MappedPlace[] | null {
    if (typeof window === "undefined") return null;

    try {
        const raw = window.sessionStorage.getItem(key);
        if (!raw) return null;

        const parsed = JSON.parse(raw) as { savedAt?: number; places?: MappedPlace[] };
        if (!Array.isArray(parsed.places)) return null;
        if (typeof parsed.savedAt !== "number") return null;
        if (Date.now() - parsed.savedAt > CACHE_TTL_MS) return null;

        return parsed.places;
    } catch {
        // Storage can be unavailable (private mode, quota); fall back to the network.
        return null;
    }
}

function writeCache(key: string, places: MappedPlace[]): void {
    if (typeof window === "undefined") return;

    try {
        window.sessionStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), places }));
    } catch {
        // Never let caching problems break the dashboard.
    }
}
