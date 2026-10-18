
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

    const details = value as Record<string, unknown>;

    return (
        ["origin", "destination", "duration", "travellers", "budget", "tripType"].every(
            (key) => typeof details[key] === "string",
        ) &&
        ["origin", "destination"].every(
            (key) => (details[key] as string).trim().length > 0,
        )
    );
}

export function getTripDetails(): TripDetails {
    if (typeof window === "undefined") {
        return defaultTripDetails;
    }

    try {
        const storedDetails = window.localStorage.getItem(tripDetailsStorageKey);

        if (!storedDetails) {
            return defaultTripDetails;
        }

        const parsedDetails: unknown = JSON.parse(storedDetails);

        return isTripDetails(parsedDetails) ? parsedDetails : defaultTripDetails;
    } catch {
        return defaultTripDetails;
    }
}

export function saveTripDetails(details: TripDetails): void {
    if (typeof window === "undefined") {
        return;
    }

    if (!isTripDetails(details)) {
        throw new Error("Invalid trip details. Please check the origin and destination.");
    }

    window.localStorage.setItem(tripDetailsStorageKey, JSON.stringify(details));
}
