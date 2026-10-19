import type { LocationSuggestion } from "@/lib/travel-types";

export async function searchLocationSuggestions(
    query: string,
    signal: AbortSignal,
    limit = 8,
): Promise<LocationSuggestion[]> {
    const params = new URLSearchParams({ q: query, limit: String(limit) });
    const response = await fetch(`/api/locations?${params.toString()}`, { signal });
    if (!response.ok) throw new Error("Location search is temporarily unavailable.");

    const payload = await response.json() as { suggestions?: unknown };
    if (!Array.isArray(payload.suggestions)) return [];

    return payload.suggestions.flatMap((item) => {
        if (!item || typeof item !== "object" || Array.isArray(item)) return [];
        const suggestion = item as Record<string, unknown>;
        const coordinates = suggestion.coordinates;
        const validCoordinates = coordinates && typeof coordinates === "object" && !Array.isArray(coordinates)
            && typeof (coordinates as Record<string, unknown>).lat === "number"
            && Number.isFinite((coordinates as Record<string, unknown>).lat)
            && typeof (coordinates as Record<string, unknown>).lon === "number"
            && Number.isFinite((coordinates as Record<string, unknown>).lon);
        if (typeof suggestion.id !== "string" || typeof suggestion.name !== "string" || typeof suggestion.label !== "string") return [];
        return [{
            id: suggestion.id,
            name: suggestion.name,
            label: suggestion.label,
            type: typeof suggestion.type === "string" ? suggestion.type : undefined,
            coordinates: validCoordinates
                ? {
                    lat: (coordinates as Record<string, number>).lat,
                    lon: (coordinates as Record<string, number>).lon,
                }
                : null,
        }];
    });
}
