export type Coordinates = {
    lat: number;
    lon: number;
};

export type LocationSuggestion = {
    id: string;
    name: string;
    label: string;
    type?: string;
    coordinates: Coordinates | null;
};

export type TravelPlace = {
    id: string;
    name: string;
    distance: string;
    duration: string;
    recommendation: string;
    lat: number;
    lon: number;
};

export type TravelSeason = {
    kind: "best" | "value" | "price";
    title: string;
    months: string;
    description: string;
};

export type TravelHighlight = {
    kind: "place" | "food" | "stay" | "transit" | "general" | "weather";
    title: string;
};

export type TravelTransport = {
    title: string;
    subtitle: string;
    price: string;
    duration: string;
    kind: "rail" | "bus" | "ferry" | "airport" | "local";
    recommended: boolean;
};

export type TravelStay = {
    name: string;
    description: string;
    price: string;
    recommended: boolean;
};

export type AiTravelGuidance = {
    overview: string;
    days: Array<{
        focus: string;
        suggestions: string[];
    }>;
    cautions: string[];
};

export type SourceStatus = "ready" | "unavailable" | "not-configured";

export type TravelGuideData = {
    destination: {
        name: string;
        displayName: string | null;
        coordinates: Coordinates | null;
        isAmbiguous: boolean;
    };
    summary: {
        title: string;
        text: string;
        url: string;
    } | null;
    nearbyPlaces: TravelPlace[];
    seasons: TravelSeason[];
    highlights: TravelHighlight[];
    transport: TravelTransport[];
    stays: TravelStay[];
    foods: string[];
    ai: AiTravelGuidance | null;
    sourceStatus: {
        geocoding: SourceStatus;
        summary: SourceStatus;
        climate: SourceStatus;
        map: SourceStatus;
        ai: SourceStatus;
    };
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
    Boolean(value) && typeof value === "object" && !Array.isArray(value);

const hasCoordinates = (value: unknown): value is Coordinates =>
    isRecord(value)
    && typeof value.lat === "number"
    && Number.isFinite(value.lat)
    && typeof value.lon === "number"
    && Number.isFinite(value.lon);

export function isTravelGuideData(value: unknown): value is TravelGuideData {
    if (!isRecord(value) || !isRecord(value.destination) || !isRecord(value.sourceStatus)) return false;

    const destination = value.destination;
    const sourceStatus = value.sourceStatus;
    return typeof destination.name === "string"
        && (destination.displayName === null || typeof destination.displayName === "string")
        && (destination.coordinates === null || hasCoordinates(destination.coordinates))
        && typeof destination.isAmbiguous === "boolean"
        && Array.isArray(value.nearbyPlaces)
        && Array.isArray(value.seasons)
        && Array.isArray(value.highlights)
        && Array.isArray(value.transport)
        && Array.isArray(value.stays)
        && Array.isArray(value.foods)
        && (value.ai === null || isRecord(value.ai))
        && typeof sourceStatus.geocoding === "string"
        && typeof sourceStatus.summary === "string"
        && typeof sourceStatus.climate === "string"
        && typeof sourceStatus.map === "string"
        && typeof sourceStatus.ai === "string";
}
