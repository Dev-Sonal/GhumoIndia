export type TripDetails = {
    origin: string;
    destination: string;
    duration: string;
    travellers: string;
    budget: string;
    tripType: string;
};

export const tripDetailsStorageKey = "pilgora-trip-details";

export const defaultTripDetails: TripDetails = {
    origin: "Bengaluru",
    destination: "Goa",
    duration: "4 Days",
    travellers: "2 Adults",
    budget: "Moderate Budget",
    tripType: "Couple",
};

export function isTripDetails(value: unknown): value is TripDetails {
    if (!value || typeof value !== "object") {
        return false;
    }

    return ["origin", "destination", "duration", "travellers", "budget", "tripType"].every(
        (key) => typeof (value as Record<string, unknown>)[key] === "string",
    );
}
