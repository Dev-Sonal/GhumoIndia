export type Coordinates = {
    lat: number;
    lon: number;
};

export type TripDetails = {
    origin: string;
    destination: string;
    duration: string;
    travellers: string;
    budget: string;
    tripType: string;
    originCoordinates?: Coordinates | null;
    destinationCoordinates?: Coordinates | null;
};

export const tripDetailsStorageKey = "pilgora-trip-details";

export const defaultTripDetails: TripDetails = {
    origin: "Bengaluru",
    destination: "Goa",
    duration: "4 Days",
    travellers: "2 Adults",
    budget: "Moderate Budget",
    tripType: "Couple",
    originCoordinates: null,
    destinationCoordinates: null,
};

export function isTripDetails(value: unknown): value is TripDetails {
    if (!value || typeof value !== "object") return false;

    const details = value as Record<string, unknown>;
    const requiredStrings = ["origin", "destination", "duration", "travellers", "budget", "tripType"];

    if (!requiredStrings.every((key) => typeof details[key] === "string")) return false;
    if (!(details.origin as string).trim() || !(details.destination as string).trim()) return false;

    const validCoordinates = (coordinates: unknown) => {
        if (coordinates === undefined || coordinates === null) return true;
        if (!coordinates || typeof coordinates !== "object") return false;
        const point = coordinates as Record<string, unknown>;
        return typeof point.lat === "number" && Number.isFinite(point.lat)
            && typeof point.lon === "number" && Number.isFinite(point.lon);
    };

    return validCoordinates(details.originCoordinates) && validCoordinates(details.destinationCoordinates);
}

export function getTripDetails(): TripDetails {
    if (typeof window === "undefined") return defaultTripDetails;

    try {
        const storedDetails = window.localStorage.getItem(tripDetailsStorageKey);
        if (!storedDetails) return defaultTripDetails;

        const parsed: unknown = JSON.parse(storedDetails);
        if (!isTripDetails(parsed)) return defaultTripDetails;

        // Old saved trips remain valid; missing coordinates are normalized to null.
        return {
            ...defaultTripDetails,
            ...parsed,
            originCoordinates: parsed.originCoordinates ?? null,
            destinationCoordinates: parsed.destinationCoordinates ?? null,
        };
    } catch {
        return defaultTripDetails;
    }
}

export function saveTripDetails(details: TripDetails): void {
    if (typeof window === "undefined") return;
    if (!isTripDetails(details)) {
        throw new Error("Invalid trip details. Please check the origin and destination.");
    }
    window.localStorage.setItem(tripDetailsStorageKey, JSON.stringify(details));
}
