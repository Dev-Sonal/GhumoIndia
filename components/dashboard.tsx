"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { defaultTripDetails, getTripDetails, saveTripDetails } from "@/lib/trip-details";
import { fetchMappedPlaces } from "@/lib/places";


import {
    CalendarDays,
    IndianRupee,
    Sun,
    BadgeIndianRupee,
    Star,
    Crown,

    Utensils,

    Palmtree,
    ChevronRight,
    ChevronDown,
    ChevronUp,
    Check,
    MapPin,
    Sparkles,
    X,
    Car,
    Train,
    Bus,
    Plane,
    BedDouble,
    Wallet,

    Map,
    Hotel,
    Soup,
    CalendarCheck,
    Bike,
} from "lucide-react";

type LiveNearbyPlace = {
    id: string;
    name: string;
    distance: string;
    duration: string;
    recommendation: string;
    lat: number;
    lon: number;
};

type DestinationImage = {
    url: string;
    title: string;
    description: string;
    author: string;
    license: string;
    filePageUrl: string;
};

export default function Dashboard() {
    // =========================================================
    // STATES
    // =========================================================

    const [tripDetails, setTripDetails] = useState(defaultTripDetails);
    const [destinationImage, setDestinationImage] = useState<DestinationImage | null>(null);
    const [liveNearbyPlaces, setLiveNearbyPlaces] = useState<LiveNearbyPlace[]>([]);
    const [nearbyLoading, setNearbyLoading] = useState(false);
    const [nearbyError, setNearbyError] = useState("");
    // Bumped by the "Try again" button so the nearby-places effect re-runs
    // without changing the destination coordinates.
    const [nearbyRefreshToken, setNearbyRefreshToken] = useState(0);
    const [selectedStyle, setSelectedStyle] = useState("Recommended");
    const [selectedDuration, setSelectedDuration] = useState(defaultTripDetails.duration);
    const [destinationSummary, setDestinationSummary] = useState<{ text: string; title: string; url: string } | null>(null);
    const [destinationSummaryLoading, setDestinationSummaryLoading] = useState(false);

    const applySavedTripDetails = () => {
        const savedTrip = getTripDetails();
        setTripDetails(savedTrip);
        setSelectedDuration(savedTrip.duration);
        setSelectedStyle(
            savedTrip.budget === "Budget"
                ? "Cheapest"
                : savedTrip.budget === "Comfortable Budget" || savedTrip.budget === "Luxury Budget"
                    ? "Comfortable"
                    : "Recommended",
        );
    };

    useEffect(() => {
        applySavedTripDetails();

        // Refresh when trip details are edited elsewhere in Pilgora.
        const handleTripDetailsUpdated = () => applySavedTripDetails();
        const handleStorage = (event: StorageEvent) => {
            if (event.key === "pilgora-trip-details") applySavedTripDetails();
        };

        window.addEventListener("pilgora-trip-details-updated", handleTripDetailsUpdated);
        window.addEventListener("storage", handleStorage);
        window.addEventListener("focus", handleTripDetailsUpdated);

        return () => {
            window.removeEventListener("pilgora-trip-details-updated", handleTripDetailsUpdated);
            window.removeEventListener("storage", handleStorage);
            window.removeEventListener("focus", handleTripDetailsUpdated);
        };
    }, []);

    // Load a general destination overview dynamically instead of relying on city-specific hard-coded data.
    // Wikipedia is used for descriptive context only; it is not treated as a source for live prices or seasonal advice.
    useEffect(() => {
        const destination = tripDetails.destination.trim();
        if (!destination) {
            setDestinationSummary(null);
            setDestinationSummaryLoading(false);
            return;
        }

        const controller = new AbortController();
        setDestinationSummary(null);
        setDestinationSummaryLoading(true);

        const loadDestinationSummary = async () => {
            try {
                const searchParams = new URLSearchParams({
                    action: "query",
                    list: "search",
                    srsearch: `${destination} India`,
                    srlimit: "1",
                    format: "json",
                    origin: "*",
                });
                const searchResponse = await fetch(
                    `https://en.wikipedia.org/w/api.php?${searchParams.toString()}`,
                    { signal: controller.signal },
                );
                if (!searchResponse.ok) throw new Error("Destination search failed");
                const searchData = await searchResponse.json() as {
                    query?: { search?: Array<{ title?: string }> };
                };
                const title = searchData.query?.search?.[0]?.title;
                if (!title) {
                    setDestinationSummary(null);
                    return;
                }

                const summaryResponse = await fetch(
                    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
                    { signal: controller.signal },
                );
                if (!summaryResponse.ok) throw new Error("Destination overview unavailable");
                const summaryData = await summaryResponse.json() as {
                    extract?: string;
                    type?: string;
                    title?: string;
                    content_urls?: { desktop?: { page?: string } };
                };
                const extract = summaryData.type !== "disambiguation" ? (summaryData.extract ?? "") : "";
                setDestinationSummary(extract ? {
                    text: extract,
                    title: summaryData.title ?? title,
                    url: summaryData.content_urls?.desktop?.page
                        ?? `https://en.wikipedia.org/wiki/${encodeURIComponent((summaryData.title ?? title).replace(/ /g, "_"))}`,
                } : null);
            } catch (error) {
                if (!(error instanceof Error && error.name === "AbortError")) {
                    setDestinationSummary(null);
                }
            } finally {
                if (!controller.signal.aborted) setDestinationSummaryLoading(false);
            }
        };

        void loadDestinationSummary();
        return () => controller.abort();
    }, [tripDetails.destination]);

    // Load a destination-specific image from the Pilgora API.
    useEffect(() => {
        const destination = tripDetails.destination.trim();

        if (!destination) {
            setDestinationImage(null);
            return;
        }

        const controller = new AbortController();

        const loadDestinationImage = async () => {
            setDestinationImage(null);

            try {
                const params = new URLSearchParams({ destination });
                const response = await fetch(
                    `/api/destination-image?${params.toString()}`,
                    { signal: controller.signal },
                );

                if (!response.ok) {
                    throw new Error(`Destination image request failed: ${response.status}`);
                }

                const data = await response.json() as {
                    image: DestinationImage | null;
                    reason?: string;
                };

                if (controller.signal.aborted) return;

                const image = data.image;
                const validImage =
                    image !== null &&
                    typeof image?.url === "string" &&
                    image.url.startsWith("https://upload.wikimedia.org/") &&
                    typeof image.filePageUrl === "string" &&
                    image.filePageUrl.startsWith("https://commons.wikimedia.org/wiki/File:");

                setDestinationImage(validImage ? image : null);

                if (!validImage && data.reason) {
                    console.info("Destination image unavailable:", data.reason);
                }
            } catch (error) {
                if (error instanceof Error && error.name !== "AbortError") {
                    console.error("Unable to load destination image:", error);
                }

                if (!controller.signal.aborted) {
                    setDestinationImage(null);
                }
            } finally {
                if (!controller.signal.aborted) {
                        }
            }
        };

        void loadDestinationImage();
        return () => controller.abort();
    }, [tripDetails.destination]);

    // Load real nearby attractions from OpenStreetMap when selected destination coordinates exist.
    useEffect(() => {
        const coordinates = tripDetails.destinationCoordinates;
        if (!coordinates || !Number.isFinite(coordinates.lat) || !Number.isFinite(coordinates.lon)) {
            setLiveNearbyPlaces([]);
            setNearbyLoading(false);
            setNearbyError("");
            return;
        }

        const controller = new AbortController();

        const loadNearbyPlaces = async () => {
            setNearbyLoading(true);
            setNearbyError("");
            setLiveNearbyPlaces([]);

            try {
                // One cached /api/places request powers every map-backed card, so this
                // widget no longer sends its own heavy Overpass query from the browser.
                const places = await fetchMappedPlaces(coordinates.lat, coordinates.lon, controller.signal);

                setLiveNearbyPlaces(
                    places
                        .filter((place) => place.kind === "attraction")
                        .slice(0, 30)
                        .map((place) => ({
                            id: place.id,
                            name: place.name,
                            distance: `${place.distanceKm.toFixed(place.distanceKm < 10 ? 1 : 0)} km away`,
                            duration: "Straight-line distance",
                            recommendation: place.category.replaceAll("_", " "),
                            lat: place.lat,
                            lon: place.lon,
                        })),
                );
            } catch (error) {
                if (error instanceof Error && error.name !== "AbortError") {
                    setNearbyError("The public map service is busy right now, so nearby attractions could not be loaded. This usually clears within a minute.");
                }
            } finally {
                if (!controller.signal.aborted) setNearbyLoading(false);
            }
        };

        void loadNearbyPlaces();
        return () => controller.abort();
    }, [tripDetails.destinationCoordinates?.lat, tripDetails.destinationCoordinates?.lon, nearbyRefreshToken]);

    const updateSelectedDuration = (duration: string) => {
        setSelectedDuration(duration);
        const updatedTrip = { ...tripDetails, duration };
        setTripDetails(updatedTrip);
        try {
            saveTripDetails(updatedTrip);
        } catch (error) {
            console.error("Unable to save selected trip duration:", error);
        }
    };

    const updateSelectedStyle = (style: string) => {
        setSelectedStyle(style);
        const budget = style === "Cheapest"
            ? "Budget"
            : style === "Comfortable"
                ? "Comfortable Budget"
                : "Moderate Budget";
        const updatedTrip = { ...tripDetails, budget };
        setTripDetails(updatedTrip);
        try {
            saveTripDetails(updatedTrip);
        } catch (error) {
            console.error("Unable to save selected trip budget:", error);
        }
    };

    const [showFullBreakdown, setShowFullBreakdown] = useState(false);
    const [showAllPlaces, setShowAllPlaces] = useState(false);
    const [showAllNearby, setShowAllNearby] = useState(false);

    const [openDay, setOpenDay] = useState<number | null>(0);

    const [selectedTransport, setSelectedTransport] =
        useState("Best Balance");

    const [selectedStay, setSelectedStay] =
        useState("Candolim");

    const [showTripPlan, setShowTripPlan] = useState(false);
    const tripPlanDialogRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!showTripPlan) {
            return;
        }

        const previousOverflow = document.body.style.overflow;
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setShowTripPlan(false);
            }
        };

        document.body.style.overflow = "hidden";
        tripPlanDialogRef.current?.focus();
        window.addEventListener("keydown", closeOnEscape);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", closeOnEscape);
        };
    }, [showTripPlan]);

    // =========================================================
    // TRAVEL STYLE DATA
    // =========================================================

    const tripOptions = [
        {
            title: "Cheapest",
            description: "Best for saving money",
            shortDescription: "Economical stay, Bus/Train",
            costMultiplier: 0.77,
            icon: BadgeIndianRupee,
            recommended: false,
        },
        {
            title: "Recommended",
            description: "Best balance of experience and budget",
            shortDescription: "Balanced transport, Good stay",
            costMultiplier: 1,
            icon: Star,
            recommended: true,
        },
        {
            title: "Comfortable",
            description: "More comfort and convenience",
            shortDescription: "Flight, Comfortable stay",
            costMultiplier: 1.64,
            icon: Crown,
            recommended: false,
        },
    ];

    // =========================================================
    // TRIP DURATION DATA
    // Base recommended costs
    // =========================================================

    // These are illustrative baseline estimates, not live quotes.
    // Keep them destination-independent until a route/cost data provider is connected.
    const tripDurations = [
        { days: "2 Days", baseCost: 6000, description: "Short getaway", recommended: false },
        { days: "3 Days", baseCost: 8000, description: "Quick trip - cover highlights", recommended: false },
        { days: "4 Days", baseCost: 11000, description: "Perfect balance", recommended: true },
        { days: "5 Days", baseCost: 13500, description: "More time to explore", recommended: false },
        { days: "7 Days", baseCost: 18000, description: "A relaxed week-long trip", recommended: false },
    ];

    // Destination guidance is fetched from public geographic/weather sources at runtime.
    // No city-name allowlist is used. Facts that a source does not provide stay unavailable.
    type DynamicSeason = {
        title: string; months: string; description: string;
        icon: typeof Sun; iconClass: string; monthClass: string;
    };
    type DynamicGuide = {
        seasons: DynamicSeason[];
        highlights: Array<{ title: string; icon: typeof Palmtree }>;
        transport: Array<{ title: string; subtitle: string; price: string; duration: string; icon: typeof Train; recommended: boolean }>;
        stays: Array<{ name: string; description: string; price: string; image: string; recommended: boolean }>;
        foods: string[];
    };
    const [dynamicGuide, setDynamicGuide] = useState<DynamicGuide | null>(null);
    const [guideLoading, setGuideLoading] = useState(false);
    const destinationKey = tripDetails.destination.trim().toLowerCase();

    useEffect(() => {
        const destination = tripDetails.destination.trim();
        const coordinates = tripDetails.destinationCoordinates;
        if (!destination) {
            setDynamicGuide(null);
            return;
        }

        const controller = new AbortController();
        const loadGuide = async () => {
            setGuideLoading(true);
            setDynamicGuide(null);
            try {
                let lat = coordinates?.lat;
                let lon = coordinates?.lon;

                // Resolve manually typed destinations too; autocomplete is not mandatory.
                if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
                    const geoUrl = new URL("https://nominatim.openstreetmap.org/search");
                    geoUrl.search = new URLSearchParams({
                        q: `${destination}, India`,
                        format: "jsonv2",
                        limit: "1",
                        addressdetails: "1",
                    }).toString();
                    const geoResponse = await fetch(geoUrl.toString(), {
                        signal: controller.signal,
                        headers: { Accept: "application/json" },
                    });
                    if (geoResponse.ok) {
                        const geo = await geoResponse.json() as Array<{ lat?: string; lon?: string; display_name?: string }>;
                        const match = geo[0];
                        if (match?.lat && match?.lon) {
                            lat = Number(match.lat);
                            lon = Number(match.lon);
                            setTripDetails((current) => {
                                if (current.destination.trim().toLowerCase() !== destination.toLowerCase()) return current;
                                const updated = { ...current, destinationCoordinates: { lat: Number(lat), lon: Number(lon) } };
                                try { saveTripDetails(updated); } catch (error) { console.error("Unable to save destination coordinates:", error); }
                                return updated;
                            });
                        }
                    }
                }

                const latitude = Number(lat);
                const longitude = Number(lon);
                if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
                    setDynamicGuide({
                        seasons: [],
                        highlights: [],
                        transport: [],
                        stays: [],
                        foods: [],
                    });
                    return;
                }

                const [weatherResult, placesResult] = await Promise.allSettled([
                    (async () => {
                        // Recent historical climate provides an estimate, not a forecast.
                        // Two years of daily readings give a stable monthly average while
                        // keeping the response roughly a third of the old three-year pull.
                        const referenceYear = new Date().getFullYear() - 1;
                        const url = new URL("https://archive-api.open-meteo.com/v1/archive");
                        url.search = new URLSearchParams({
                            latitude: String(latitude),
                            longitude: String(longitude),
                            start_date: `${referenceYear - 1}-01-01`,
                            end_date: `${referenceYear}-12-31`,
                            daily: "temperature_2m_mean,precipitation_sum",
                            timezone: "auto",
                        }).toString();
                        const response = await fetch(url.toString(), { signal: controller.signal });
                        if (!response.ok) throw new Error("Climate history unavailable");
                        return await response.json() as {
                            daily?: { time?: string[]; temperature_2m_mean?: Array<number | null>; precipitation_sum?: Array<number | null> };
                        };
                    })(),
                    // Cached server route: a single merged Overpass query feeds the
                    // highlights, stays, food and transport sections below.
                    fetchMappedPlaces(latitude, longitude, controller.signal),
                ]);

                const seasons: DynamicSeason[] = [];
                if (weatherResult.status === "fulfilled") {
                    const daily = weatherResult.value.daily;
                    const monthly: Array<{ month: number; tempTotal: number; tempCount: number; rainTotal: number; rainCount: number }> =
                        Array.from({ length: 12 }, (_, index) => ({ month: index + 1, tempTotal: 0, tempCount: 0, rainTotal: 0, rainCount: 0 }));
                    (daily?.time ?? []).forEach((date, index) => {
                        const month = Number(date.slice(5, 7)) - 1;
                        const temp = daily?.temperature_2m_mean?.[index];
                        const rain = daily?.precipitation_sum?.[index];
                        if (monthly[month] && typeof temp === "number" && Number.isFinite(temp)) {
                            monthly[month].tempTotal += temp;
                            monthly[month].tempCount += 1;
                        }
                        if (monthly[month] && typeof rain === "number" && Number.isFinite(rain)) {
                            monthly[month].rainTotal += rain;
                            monthly[month].rainCount += 1;
                        }
                    });
                    const ranked = monthly
                        .filter((month) => month.tempCount && month.rainCount)
                        .map((month) => ({
                            ...month,
                            averageTemp: month.tempTotal / month.tempCount,
                            averageRain: month.rainTotal / month.rainCount,
                        }));
                    if (ranked.length) {
                        const score = (item: typeof ranked[number]) =>
                            Math.abs(item.averageTemp - 22) + item.averageRain * 0.08;
                        const rankedByComfort = [...ranked].sort((a, b) => score(a) - score(b));
                        const best = rankedByComfort.slice(0, 4).sort((a, b) => a.month - b.month);
                        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                        const monthsLabel = (items: typeof ranked) =>
                            items.map((item) => monthNames[item.month - 1]).join(", ");

                        seasons.push({
                            title: "Best experience",
                            months: monthsLabel(best),
                            description: "Climate-based estimate using historical temperature and rainfall, not a forecast. Check weather and local advisories before travelling.",
                            icon: Sun,
                            iconClass: "text-amber-500",
                            monthClass: "text-green-700",
                        });

                        const valueMonths = rankedByComfort
                            .slice(4, 7)
                            .sort((a, b) => a.month - b.month);
                        if (valueMonths.length) {
                            seasons.push({
                                title: "Best value (climate estimate)",
                                months: monthsLabel(valueMonths),
                                description: "A possible alternative to the mildest months based on climate only. Accommodation and transport prices are not included.",
                                icon: BadgeIndianRupee,
                                iconClass: "text-emerald-600",
                                monthClass: "text-emerald-700",
                            });
                        }

                        seasons.push({
                            title: "Cheapest time",
                            months: "Price data unavailable",
                            description: "Live or historical travel-price data is not connected, so the cheapest months cannot be verified.",
                            icon: Wallet,
                            iconClass: "text-orange-500",
                            monthClass: "text-orange-700",
                        });
                    }
                }

                const places = placesResult.status === "fulfilled" ? placesResult.value : [];
                const transitLabels: Record<string, string> = {
                    railway_station: "Railway station",
                    bus_station: "Bus station",
                    ferry_terminal: "Ferry terminal",
                    aerodrome: "Airport",
                };

                // Trip Highlights only talks about mapped places close to the destination.
                const nearbyAttractions = places.filter(
                    (place) => place.kind === "attraction" && place.distanceKm <= 12,
                );

                const stays = places
                    .filter((place) => place.kind === "stay")
                    .map((place, index) => ({
                        name: place.name,
                        description: `${place.category.replaceAll("_", " ")} listed in OpenStreetMap near ${destination}. Verify location, reviews, availability and rates.`,
                        price: "Check current rates",
                        image: "",
                        recommended: index === 0,
                    }))
                    .slice(0, 5);

                const foods = [...new Set(places
                    .filter((place) => place.kind === "food" && place.cuisine)
                    .flatMap((place) => place.cuisine!.split(";").map((value) => value.trim()).filter(Boolean))
                    .filter(Boolean))].slice(0, 8);

                const transitTypes = [...new Set(places
                    .map((place) => (place.kind === "transit" ? transitLabels[place.category] : ""))
                    .filter(Boolean))];
                const transport: DynamicGuide["transport"] = transitTypes.slice(0, 3).map((type, index) => ({
                    title: index === 0 ? "Mapped local option" : type,
                    subtitle: type,
                    price: "Check operator for current fares",
                    duration: "Depends on route",
                    icon: type === "Airport" ? Plane : type === "Railway station" ? Train : type === "Bus station" ? Bus : Car,
                    recommended: index === 0,
                }));
                // Always show route-neutral options, but clearly label them as suggestions rather than live availability.
                if (!transport.length) {
                    transport.push(
                        { title: "Public transport", subtitle: "Bus / train where available", price: "Check operator fares", duration: "Route dependent", icon: Train, recommended: true },
                        { title: "Local transfer", subtitle: "Taxi / cab", price: "Check local rates", duration: "Route dependent", icon: Car, recommended: false },
                    );
                }

                const attractionNames = [...new Set(nearbyAttractions.map((place) => place.name.trim()))].slice(0, 3);

                // Keep highlights useful: prioritize actual named places and only show categories
                // when there is no reliable destination-specific listing for that category.
                const highlights: DynamicGuide["highlights"] = [];
                attractionNames.forEach((name) => highlights.push({ title: name, icon: MapPin }));
                if (foods.length) {
                    highlights.push({ title: `Food and cafés: ${foods.slice(0, 3).join(", ")}`, icon: Utensils });
                }
                if (stays.length) {
                    highlights.push({ title: `${stays.length} accommodation listings to compare`, icon: Hotel });
                }
                if (transitTypes.length) {
                    highlights.push({ title: `Transport links: ${transitTypes.slice(0, 3).join(", ")}`, icon: Train });
                }
                if (highlights.length < 3) {
                    highlights.push({
                        title: `Explore more mapped attractions around ${destination}`,
                        icon: Palmtree,
                    });
                }
                if (highlights.length < 4) {
                    highlights.push({
                        title: "Check opening hours, access and local weather before visiting",
                        icon: Sun,
                    });
                }
                setDynamicGuide({ seasons, highlights, transport, stays, foods });
            } catch (error) {
                if (!(error instanceof Error && error.name === "AbortError")) {
                    setDynamicGuide({ seasons: [], highlights: [], transport: [], stays: [], foods: [] });
                }
            } finally {
                if (!controller.signal.aborted) setGuideLoading(false);
            }
        };

        void loadGuide();
        return () => controller.abort();
    }, [tripDetails.destination, tripDetails.destinationCoordinates?.lat, tripDetails.destinationCoordinates?.lon]);

    const destinationGuide = dynamicGuide;
    const bestTimes = destinationGuide?.seasons ?? [];
    // The overview and map-based attractions stay visible for every destination.
    const tripHighlights: Array<{ title: string; icon: typeof Palmtree }> = [];

    // Reuse the live, coordinate-based attraction results for the Top Places card.
    // This lets the feature work for any destination supported by the map data source.
    const topPlaces = liveNearbyPlaces.slice(0, 4).map((place) => ({
        name: place.name,
        duration: place.distance,
        image: "",
    }));

    const extraPlaces = liveNearbyPlaces.slice(4, 12).map((place) => ({
        name: place.name,
        duration: place.distance,
        image: "",
    }));

    const nearbyPlaces = liveNearbyPlaces.map((place) => ({
        ...place,
        image: "",
        icon: MapPin,
    }));

    // Generic itinerary scaffold based on attractions found near the selected destination.
    // Travel times/opening hours are not inferred from straight-line distances.
    const itinerary = topPlaces.length > 0
        ? [
            {
                day: "Day 1",
                title: `${tripDetails.destination} highlights`,
                short: "Choose nearby attractions based on your interests",
                details: topPlaces.slice(0, 3).map((place) => `Consider visiting ${place.name}; verify opening hours and route before travelling`),
            },
            {
                day: "Day 2",
                title: "Explore at your own pace",
                short: "Use nearby attractions to build your second day",
                details: (extraPlaces.length ? extraPlaces : topPlaces).slice(0, 3).map((place) => `Consider ${place.name}; check local access and travel time before leaving`),
            },
        ]
        : [];

    const transportOptions = destinationGuide?.transport ?? [];
    const stayAreas = destinationGuide?.stays ?? [];
    const foodItems = destinationGuide?.foods ?? [];

    // =========================================================
    // MONEY SAVING TIPS
    // =========================================================

    const savingTips = [
        { title: "Compare travel dates", description: "Check weekday and seasonal rates", icon: CalendarCheck },
        { title: "Compare stays early", description: "Review location and cancellation rules", icon: Hotel },
        { title: "Plan local transport", description: "Compare public transport and local cabs", icon: Bike },
        { title: "Try local eateries", description: "Set a daily food budget", icon: Soup },
    ];

    // =========================================================
    // SELECTED DATA
    // =========================================================

    const selectedStyleData =
        tripOptions.find(
            (option) => option.title === selectedStyle
        ) || tripOptions[1];

    const selectedDurationData =
        tripDurations.find((duration) => duration.days === selectedDuration) ||
        tripDurations[0];

    // Always provide a safe value: unsupported destinations currently have
    // no destination-specific transport or stay options.
    const selectedTransportData =
        transportOptions.find(
            (transport) => transport.title === selectedTransport
        ) ??
        transportOptions.find((transport) => transport.recommended) ??
        transportOptions[0] ?? {
            title: "Not available",
            subtitle: "Route-specific transport data is not available yet",
            price: "Check current fares",
            duration: "Check your route",
            icon: Train,
            recommended: false,
        };

    const selectedStayData =
        stayAreas.find((stay) => stay.name === selectedStay) ??
        stayAreas.find((stay) => stay.recommended) ??
        stayAreas[0] ?? {
            name: "Stay information unavailable",
            description: `Compare accommodation options in ${tripDetails.destination}.`,
            price: "Check current hotel rates",
            image: "",
            recommended: false,
        };

    // =========================================================
    // DYNAMIC BUDGET
    // =========================================================

    const estimatedCost = Math.round(
        selectedDurationData.baseCost *
            selectedStyleData.costMultiplier
    );

    const formatCurrency = (amount: number) =>
        `₹${amount.toLocaleString("en-IN")}`;

    // =========================================================
    // DYNAMIC COST BREAKDOWN
    // =========================================================

    const costBreakdown = [
        {
            name: "Stay",
            amount: Math.round(estimatedCost * 0.36),
        },
        {
            name: "Food",
            amount: Math.round(estimatedCost * 0.18),
        },
        {
            name: "Local Transport",
            amount: Math.round(estimatedCost * 0.09),
        },
        {
            name: "Activities",
            amount: Math.round(estimatedCost * 0.14),
        },
        {
            name: "Miscellaneous",
            amount: Math.round(estimatedCost * 0.05),
        },
    ];

    const extraCostBreakdown = [
        {
            name: "Local Taxes & Fees",
            amount: Math.round(estimatedCost * 0.05),
        },
        {
            name: "Travel Buffer",
            amount: Math.round(estimatedCost * 0.09),
        },
        {
            name: "Optional Experiences",
            amount: Math.round(estimatedCost * 0.04),
        },
    ];

    const displayedPlaces = showAllPlaces
        ? [...topPlaces, ...extraPlaces]
        : topPlaces;

    const displayedNearbyPlaces = showAllNearby
        ? nearbyPlaces
        : nearbyPlaces.slice(0, 4);

    // =========================================================
    // COMPONENT
    // =========================================================

    return (
        <section id="trip-options" className="min-h-screen p-4 md:p-6 lg:p-8">

            {/* =====================================================
                TOP SECTION
            ===================================================== */}
            <div className="grid grid-cols-1 items-stretch gap-5 xl:grid-cols-4">

                {/* LEFT SIDE */}
                <div className="flex min-w-0 flex-col xl:col-span-3">

                    {/* =================================================
                        HERO
                    ================================================= */}
                    <div className="relative h-[430px] overflow-hidden rounded-2xl shadow-sm sm:h-[300px]">

                        {/* Destination photograph, with the existing gradient as fallback. */}
                        <div
                            className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-teal-800 to-slate-900"
                            aria-hidden="true"
                        />

                        {destinationImage && (
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: `url("${destinationImage.url}")` }}
                                role="img"
                                aria-label={
                                    destinationImage.description ||
                                    `Photograph of ${tripDetails.destination}, India`
                                }
                            />
                        )}

                        {/* Keep text readable over bright photographs. */}
                        <div
                            className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/45 to-slate-950/10"
                            aria-hidden="true"
                        />

                       

                        <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-7">

                            <div className="max-w-xl">
                                <h1 className="text-2xl font-bold text-white sm:text-3xl">
                                    Your {tripDetails.destination} Trip is Ready! {"🧭"}
                                </h1>

                                <p className="mt-2 text-sm text-slate-100 sm:text-base">
                                    {tripDetails.origin} to {tripDetails.destination} · {tripDetails.travellers} · {tripDetails.budget}.
                                    {" Nearby attractions are based on mapped location data when available."}
                                </p>
                                <p className="mt-2 inline-block rounded-lg bg-amber-100/95 px-3 py-2 text-xs font-medium text-amber-950">
                                    Budget figures are illustrative baseline estimates, not live prices or bookings. Verify transport, stay, opening hours and seasonal conditions before travelling.
                                </p>
                            </div>

                            {/* SUMMARY */}
                            <div className="mt-5 grid max-w-2xl grid-cols-1 overflow-hidden rounded-xl bg-white/95 shadow-lg sm:grid-cols-3">

                                <div className="flex items-center gap-3 p-4">
                                    <CalendarDays
                                        size={22}
                                        className="text-blue-600"
                                    />

                                    <div>
                                        <p className="text-[10px] uppercase text-slate-500">
                                            Recommended Duration
                                        </p>

                                        <p className="font-bold text-slate-800">
                                            {selectedDuration}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 border-t border-slate-200 p-4 sm:border-l sm:border-t-0">
                                    <IndianRupee
                                        size={22}
                                        className="text-green-600"
                                    />

                                    <div>
                                        <p className="text-[10px] uppercase text-slate-500">
                                            Estimated Cost / Person
                                        </p>

                                        <p className="font-bold text-slate-800">
                                            {formatCurrency(estimatedCost)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 border-t border-slate-200 p-4 sm:border-l sm:border-t-0">
                                    <Sun
                                        size={22}
                                        className="text-orange-500"
                                    />

                                    <div>
                                        <p className="text-[10px] uppercase text-slate-500">
                                            Best Season
                                        </p>

                                        <p className="font-bold text-slate-800">
                                            {destinationGuide?.seasons[0]?.months ?? "Not available"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* =================================================
                        TRAVEL STYLE
                    ================================================= */}
                    <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">

                        {tripOptions.map((option) => {
                            const Icon = option.icon;

                            const isSelected =
                                selectedStyle === option.title;

                            const optionCost = Math.round(
                                selectedDurationData.baseCost *
                                    option.costMultiplier
                            );

                            return (
                                <div
                                    key={option.title}
                                    className={`relative rounded-xl bg-white p-5 shadow-sm transition-all ${
                                        isSelected
                                            ? "border-2 border-blue-600 ring-2 ring-blue-100"
                                            : "border border-slate-200 hover:border-blue-300"
                                    }`}
                                >
                                    {option.recommended && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-[11px] font-semibold text-white shadow">
                                            Most Popular
                                        </div>
                                    )}

                                    <Icon
                                        size={25}
                                        className="text-blue-600"
                                    />

                                    <h3 className="mt-3 text-lg font-bold text-slate-800">
                                        {option.title} Trip
                                    </h3>

                                    <p className="mt-1 text-xs text-slate-500">
                                        {option.shortDescription}
                                    </p>

                                    <p className="mt-4 text-lg font-bold text-slate-800">
                                        {formatCurrency(optionCost)}
                                        <span className="text-sm font-normal">
                                            {" "}
                                            / person
                                        </span>
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        {option.description}
                                    </p>

                                    <button
                                        onClick={() =>
                                            updateSelectedStyle(option.title)
                                        }
                                        className={`mt-4 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                                            isSelected
                                                ? "bg-blue-600 text-white"
                                                : "bg-slate-800 text-white hover:bg-slate-700"
                                        }`}
                                    >
                                        {isSelected ? (
                                            <>
                                                <Check size={16} />
                                                Selected
                                            </>
                                        ) : (
                                            "Select Plan"
                                        )}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* =====================================================
                    RIGHT SIDE
                ===================================================== */}
                {/*
                    This column stays in flow but its content is taken out of it at xl, so it
                    contributes no height to the grid row. The row height is then defined by the
                    left column (hero + trip plan cards), which keeps the bottom of the Trip
                    Highlights card level with the bottom of the three trip plan cards. Below xl
                    the column simply stacks in normal flow.
                */}
                <div className="flex min-h-0 flex-col gap-4 xl:relative xl:self-stretch">
                    <div className="flex min-h-0 flex-col gap-4 xl:absolute xl:inset-0">

                        {/* BEST TIME */}
                        <div className="shrink-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                            <h2 className="text-sm font-bold text-slate-800">
                                Best Time vs Cheapest Time
                            </h2>

                            <div className="mt-2">
                                {bestTimes.length === 0 && (
                                    <p className="py-3 text-xs text-slate-500">
                                        {guideLoading ? `Loading climate history for ${tripDetails.destination}…` : `Historical seasonal guidance is unavailable for ${tripDetails.destination}.`}
                                    </p>
                                )}
                                {bestTimes.slice(0, 3).map((time, index) => {
                                    const Icon = time.icon;
                                    return (
                                        <div
                                            key={time.title}
                                            className={`flex gap-3 py-2.5 ${index !== Math.min(bestTimes.length, 3) - 1 ? "border-b border-slate-100" : ""}`}
                                        >
                                            <Icon size={17} className={`mt-0.5 shrink-0 ${time.iconClass}`} aria-hidden="true" />
                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
                                                    <p className="text-xs font-semibold text-slate-800">{time.title}</p>
                                                    <span className={`whitespace-nowrap text-xs font-semibold ${time.monthClass}`}>{time.months}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* TRIP HIGHLIGHTS */}
                        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                            <h2 className="shrink-0 text-sm font-bold text-slate-800">Trip Highlights</h2>

                            <div className="mt-2 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
                                {guideLoading && !destinationGuide && (
                                    <p role="status" className="py-3 text-xs text-slate-500">Finding highlights for {tripDetails.destination}…</p>
                                )}

                                {!guideLoading && (!destinationGuide || destinationGuide.highlights.length === 0) && (
                                    <p className="py-3 text-xs text-slate-500">No mapped highlight details were returned for {tripDetails.destination}. Try again later or check the destination spelling.</p>
                                )}

                                {destinationGuide?.highlights && destinationGuide.highlights.length > 0 && (
                                    <ul className="divide-y divide-slate-100">
                                        {destinationGuide.highlights.slice(0, 5).map((highlight) => {
                                            const Icon = highlight.icon;
                                            return (
                                                <li key={highlight.title} className="flex items-start gap-3 py-2.5 first:pt-1">
                                                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                                                        <Icon size={15} aria-hidden="true" />
                                                    </span>
                                                    <span className="min-w-0 text-xs leading-5 text-slate-700">{highlight.title}</span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                                <p className="mt-2 text-[10px] leading-4 text-slate-400">Based on available public map listings. Coverage varies by destination; verify details before travelling.</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* =========================================================
                SECOND ROW
            ========================================================= */}
            <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-4">

                {/* COST BREAKDOWN */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                    <div className="flex items-center gap-2">
                        <Wallet
                            size={19}
                            className="text-green-600"
                        />

                        <h2 className="font-bold text-slate-800">
                            Cost Breakdown
                        </h2>
                    </div>

                    <div className="mt-4 space-y-3">
                        {costBreakdown.map((item) => (
                            <div
                                key={item.name}
                                className="flex justify-between text-sm"
                            >
                                <span className="text-slate-600">
                                    {item.name}
                                </span>

                                <span className="font-medium text-slate-800">
                                    {formatCurrency(item.amount)}
                                </span>
                            </div>
                        ))}

                        {showFullBreakdown &&
                            extraCostBreakdown.map((item) => (
                                <div
                                    key={item.name}
                                    className="flex justify-between text-sm"
                                >
                                    <span className="text-slate-600">
                                        {item.name}
                                    </span>

                                    <span className="font-medium text-slate-800">
                                        {formatCurrency(item.amount)}
                                    </span>
                                </div>
                            ))}
                    </div>

                    <div className="mt-4 flex justify-between border-t border-slate-200 pt-4">
                        <span className="text-sm font-bold text-slate-800">
                            Estimated Total (Per Person)
                        </span>

                        <span className="text-lg font-bold text-slate-800">
                            {formatCurrency(estimatedCost)}
                        </span>
                    </div>

                    <button
                        onClick={() =>
                            setShowFullBreakdown(!showFullBreakdown)
                        }
                        className="mt-4 flex w-full items-center justify-center gap-1 text-sm font-medium text-blue-600"
                    >
                        {showFullBreakdown
                            ? "Hide Full Breakdown"
                            : "View Full Breakdown"}

                        <ChevronDown
                            size={16}
                            className={
                                showFullBreakdown
                                    ? "rotate-180 transition"
                                    : "transition"
                            }
                        />
                    </button>
                </div>

                {/* HOW MANY DAYS */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                    <div className="flex items-center gap-2">
                        <CalendarDays
                            size={19}
                            className="text-blue-600"
                        />

                        <h2 className="font-bold text-slate-800">
                            How Many Days?
                        </h2>
                    </div>

                    <div className="mt-4 space-y-2">
                        {tripDurations.map((duration) => {
                            const isSelected =
                                selectedDuration === duration.days;

                            return (
                                <button
                                    key={duration.days}
                                    onClick={() =>
                                        updateSelectedDuration(duration.days)
                                    }
                                    className={`w-full rounded-lg border p-3 text-left transition ${
                                        isSelected
                                            ? "border-blue-500 bg-blue-50 ring-1 ring-blue-100"
                                            : "border-slate-200 hover:bg-slate-50"
                                    }`}
                                >
                                    <div className="flex justify-between">
                                        <span className="text-sm font-bold text-slate-800">
                                            {duration.days}
                                        </span>

                                        <div className="flex items-center gap-2">
                                            {isSelected && (
                                                <Check
                                                    size={16}
                                                    className="text-blue-600"
                                                />
                                            )}

                                            <span className="text-sm font-bold text-slate-800">
                                                {formatCurrency(
                                                    Math.round(
                                                        duration.baseCost *
                                                            selectedStyleData.costMultiplier
                                                    )
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-1 flex items-center gap-2">
                                        <span className="text-xs text-slate-500">
                                            {duration.description}
                                        </span>

                                        {duration.recommended && (
                                            <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-[9px] font-semibold text-yellow-700">
                                                Recommended
                                            </span>
                                        )}
                                    </div>
                                </button>
                            );
                        })}

                        <button
                            onClick={() =>
                                updateSelectedDuration("4 Days")
                            }
                            className="flex w-full items-center justify-between rounded-lg border border-slate-200 p-3 text-left hover:bg-slate-50"
                        >
                            <div>
                                <p className="text-sm font-semibold text-slate-800">
                                    Help me decide
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                    Choose the recommended 4-day trip
                                </p>
                            </div>

                            <ChevronRight
                                size={18}
                                className="text-slate-500"
                            />
                        </button>
                    </div>
                </div>

                {/* TOP PLACES */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                    <div className="flex items-center gap-2">
                        <Palmtree
                            size={19}
                            className="text-green-600"
                        />

                        <h2 className="font-bold text-slate-800">
                            Top Places to Visit
                        </h2>
                    </div>

                    <div className="mt-4 space-y-3">
                        {displayedPlaces.length === 0 && (
                            <p className="text-xs text-slate-500">
                                Place recommendations for {tripDetails.destination} are not available yet.
                            </p>
                        )}
                        {displayedPlaces.map((place) => (
                            <Link
                                href="/places"
                                key={place.name}
                                className="flex w-full items-center gap-3 text-left"
                            >
                                <div className="relative flex h-10 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md bg-emerald-50 text-emerald-700">
                                    {place.image ? <Image src={place.image} alt={place.name} fill className="object-cover" /> : <MapPin size={18} aria-hidden="true" />}
                                </div>

                                <p className="flex-1 text-sm font-medium text-slate-800">
                                    {place.name}
                                </p>

                                <span className="text-xs text-slate-500">
                                    {place.duration}
                                </span>
                            </Link>
                        ))}
                    </div>

                    <button
                        onClick={() =>
                            setShowAllPlaces(!showAllPlaces)
                        }
                        className="mt-5 flex w-full items-center justify-center gap-1 text-sm font-medium text-blue-600"
                    >
                        {showAllPlaces
                            ? "Show Less"
                            : "View All Places"}

                        <ChevronDown
                            size={16}
                            className={
                                showAllPlaces
                                    ? "rotate-180 transition"
                                    : "transition"
                            }
                        />
                    </button>
                </div>

                {/* NEARBY PLACES */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                    <div className="flex items-center gap-2">
                        <MapPin
                            size={19}
                            className="text-red-500"
                        />

                        <h2 className="font-bold text-slate-800">
                            Nearby Places
                        </h2>
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                        Mapped attractions within 50 km of {tripDetails.destination}. Distances are straight-line estimates.
                    </p>

                    <div className="mt-3 space-y-3">
                        {nearbyLoading && (
                            <p role="status" className="text-xs text-slate-500">Finding nearby attractions…</p>
                        )}
                        {nearbyError && (
                            <div role="status" className="rounded-lg bg-amber-50 p-3">
                                <p className="text-xs text-amber-800">{nearbyError}</p>
                                <button
                                    type="button"
                                    onClick={() => setNearbyRefreshToken((token) => token + 1)}
                                    className="mt-2 rounded-lg bg-amber-600 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-amber-700"
                                >
                                    Try again
                                </button>
                            </div>
                        )}
                        {!nearbyLoading && !nearbyError && !tripDetails.destinationCoordinates && (
                            <p className="text-xs text-slate-500">Select the destination from the autocomplete suggestions to find nearby attractions.</p>
                        )}
                        {!nearbyLoading && !nearbyError && tripDetails.destinationCoordinates && displayedNearbyPlaces.length === 0 && (
                            <p className="text-xs text-slate-500">No mapped attractions found within 50 km of this location.</p>
                        )}
                        {displayedNearbyPlaces.map((place) => (
                            <div
                                key={place.name}
                                className="flex items-center gap-3"
                            >
                                <div className="relative flex h-9 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-emerald-50 text-emerald-700">
                                    {place.image ? <Image src={place.image} alt={place.name} fill className="object-cover" /> : <MapPin size={16} aria-hidden="true" />}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-xs font-semibold text-slate-800">
                                        {place.name}
                                    </p>

                                    <p className="text-[10px] text-slate-500">
                                        {place.distance} | {place.duration}
                                    </p>
                                </div>

                                <div className="flex shrink-0 flex-col items-end gap-1">
                                    <span className="text-right text-[10px] font-medium capitalize text-green-700">
                                        {place.recommendation}
                                    </span>
                                    <a
                                        href={`https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lon}#map=15/${place.lat}/${place.lon}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-[10px] font-medium text-blue-600 hover:underline"
                                    >
                                        Map
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>

                    {nearbyPlaces.length > 4 && (
                        <button
                            type="button"
                            onClick={() => setShowAllNearby(!showAllNearby)}
                            className="mt-4 flex w-full items-center justify-center gap-1 text-sm font-medium text-blue-600"
                        >
                            {showAllNearby ? "Show Less" : "View All Nearby Places"}
                            <ChevronDown size={16} className={showAllNearby ? "rotate-180 transition" : "transition"} />
                        </button>
                    )}
                </div>
            </div>

            {/* =========================================================
                THIRD ROW
            ========================================================= */}
            <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-4">

                {/* DAY-WISE ITINERARY */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-1">

                    <div className="flex items-center gap-2">
                        <CalendarDays
                            size={19}
                            className="text-blue-600"
                        />

                        <h2 className="font-bold text-slate-800">
                            Day-wise Itinerary
                        </h2>
                    </div>

                    <div className="mt-4 space-y-2">
                        {itinerary.slice(0, Math.max(1, Number.parseInt(selectedDuration, 10) || 2)).map((item, index) => {
                            const isOpen = openDay === index;

                            return (
                                <div
                                    key={item.day}
                                    className="rounded-lg border border-slate-200"
                                >
                                    <button
                                        onClick={() =>
                                            setOpenDay(
                                                isOpen ? null : index
                                            )
                                        }
                                        className="flex w-full items-center justify-between p-3 text-left"
                                    >
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="rounded bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700">
                                                    {item.day}
                                                </span>

                                                <span className="text-xs font-semibold text-slate-800">
                                                    {item.title}
                                                </span>
                                            </div>

                                            <p className="mt-1 text-[10px] text-slate-500">
                                                {item.short}
                                            </p>
                                        </div>

                                        {isOpen ? (
                                            <ChevronUp
                                                size={16}
                                                className="text-slate-500"
                                            />
                                        ) : (
                                            <ChevronDown
                                                size={16}
                                                className="text-slate-500"
                                            />
                                        )}
                                    </button>

                                    {isOpen && (
                                        <div className="border-t border-slate-100 px-3 pb-3 pt-2">
                                            <ul className="space-y-2">
                                                {item.details.map(
                                                    (detail) => (
                                                        <li
                                                            key={detail}
                                                            className="flex gap-2 text-[11px] text-slate-600"
                                                        >
                                                            <Check
                                                                size={13}
                                                                className="mt-0.5 shrink-0 text-green-600"
                                                            />

                                                            {detail}
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <Link href="/itinerary" className="mt-4 block w-full text-center text-sm font-medium text-blue-600">
                        View Full Itinerary
                    </Link>
                </div>

                {/* TRANSPORT */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                    <div className="flex items-center gap-2">
                        <Car
                            size={19}
                            className="text-blue-600"
                        />

                        <h2 className="font-bold text-slate-800">
                            Transport Options
                        </h2>
                    </div>

                    <div className="mt-4 space-y-3">
                        {transportOptions.length === 0 && (
                            <p className="text-xs text-slate-500">
                                {guideLoading ? `Finding transport locations around ${tripDetails.destination}…` : `No transport locations were returned by the map source near ${tripDetails.destination}. Check route operators directly.`}
                            </p>
                        )}
                        {transportOptions.map((option) => {
                            const Icon = option.icon;

                            const isSelected =
                                selectedTransport === option.title;

                            return (
                                <button
                                    key={option.title}
                                    onClick={() =>
                                        setSelectedTransport(option.title)
                                    }
                                    className={`w-full rounded-lg border p-3 text-left transition ${
                                        isSelected
                                            ? "border-blue-500 bg-blue-50 ring-1 ring-blue-100"
                                            : "border-slate-200 hover:bg-slate-50"
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <Icon
                                            size={18}
                                            className="mt-0.5 text-blue-600"
                                        />

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="text-xs font-bold text-slate-800">
                                                    {option.title}
                                                </p>

                                                {option.recommended && (
                                                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[9px] font-semibold text-blue-700">
                                                        Recommended
                                                    </span>
                                                )}
                                            </div>

                                            <p className="mt-1 text-[10px] text-slate-500">
                                                {option.subtitle}
                                            </p>

                                            <div className="mt-2 flex justify-between text-[11px]">
                                                <span className="font-semibold text-slate-700">
                                                    {option.price}
                                                </span>

                                                <span className="text-slate-500">
                                                    {option.duration}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <Link href="/transport" className="mt-4 block w-full text-center text-sm font-medium text-blue-600">
                        Compare All Options
                    </Link>
                </div>

                {/* STAY AREAS */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                    <div className="flex items-center gap-2">
                        <BedDouble
                            size={19}
                            className="text-blue-600"
                        />

                        <h2 className="font-bold text-slate-800">
                            Stay & Best Areas
                        </h2>
                    </div>

                    <div className="mt-4 space-y-3">
                        {stayAreas.length === 0 && (
                            <p className="text-xs text-slate-500">
                                {guideLoading ? `Finding mapped accommodation near ${tripDetails.destination}…` : `No accommodation listings were returned near ${tripDetails.destination}. Search current stays and rates separately.`}
                            </p>
                        )}
                        {stayAreas.map((area) => {
                            const isSelected =
                                selectedStay === area.name;

                            return (
                                <button
                                    key={area.name}
                                    onClick={() =>
                                        setSelectedStay(area.name)
                                    }
                                    className={`flex w-full items-center gap-3 rounded-lg border p-2 text-left transition ${
                                        isSelected
                                            ? "border-blue-500 bg-blue-50"
                                            : "border-slate-200 hover:bg-slate-50"
                                    }`}
                                >
                                    <div className="relative flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-emerald-50 text-emerald-700">
                                        {area.image ? <Image src={area.image} alt={area.name} fill className="object-cover" /> : <Hotel size={18} aria-hidden="true" />}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="text-xs font-bold text-slate-800">
                                                {area.name}
                                            </p>

                                            {area.recommended && (
                                                <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[8px] font-semibold text-blue-700">
                                                    Recommended
                                                </span>
                                            )}
                                        </div>

                                        <p className="mt-1 text-[10px] text-slate-500">
                                            {area.description}
                                        </p>

                                        <p className="mt-1 text-[10px] font-medium text-slate-700">
                                            {area.price}
                                        </p>
                                    </div>

                                    {isSelected && (
                                        <Check
                                            size={16}
                                            className="shrink-0 text-blue-600"
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <Link href="/stay" className="mt-4 block w-full text-center text-sm font-medium text-blue-600">
                        View All Areas & Stays
                    </Link>
                </div>

                {/* FOOD GUIDE */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                    <div className="flex items-center gap-2">
                        <Utensils
                            size={19}
                            className="text-orange-500"
                        />

                        <h2 className="font-bold text-slate-800">
                            Food Guide
                        </h2>
                    </div>

                    <div className="mt-4">

                        <div className="flex items-center gap-2">
                            <Soup
                                size={16}
                                className="text-orange-500"
                            />

                            <p className="text-xs font-semibold text-slate-800">
                                Must Try
                            </p>
                        </div>

                        <div className="mt-2 space-y-1 pl-6">
                            {foodItems.length === 0 && (
                                <p className="text-[11px] text-slate-500">
                                    Local food guidance for {tripDetails.destination} is not in the current curated set yet.
                                </p>
                            )}
                            {foodItems.map((food) => (
                                <p
                                    key={food}
                                    className="text-[11px] text-slate-600"
                                >
                                    {food}
                                </p>
                            ))}
                        </div>

                        <div className="mt-5 border-t border-slate-100 pt-4">

                            <div className="flex items-center gap-2">
                                <IndianRupee
                                    size={16}
                                    className="text-green-600"
                                />

                                <p className="text-xs font-semibold text-slate-800">
                                    Food Budget (Per Day)
                                </p>
                            </div>

                            <div className="mt-3 space-y-2 text-[11px]">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">
                                        Budget
                                    </span>

                                    <span className="font-medium text-slate-800">
                                        ₹400 - 600
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-slate-500">
                                        Comfortable
                                    </span>

                                    <span className="font-medium text-slate-800">
                                        ₹800 - 1,200
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Link href="/food-guide" className="mt-5 block w-full text-center text-sm font-medium text-blue-600">
                        View Food Recommendations
                    </Link>
                </div>
            </div>

            {/* =========================================================
                WAYS TO SAVE MONEY
            ========================================================= */}
            <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

                <div className="grid grid-cols-1 divide-y divide-slate-100 md:grid-cols-2 md:divide-x md:divide-y-0 lg:grid-cols-4">

                    {savingTips.map((tip) => {
                        const Icon = tip.icon;

                        return (
                            <div
                                key={tip.title}
                                className="flex items-center gap-3 px-4 py-3"
                            >
                                <Icon
                                    size={20}
                                    className="text-orange-500"
                                />

                                <div>
                                    <p className="text-xs font-semibold text-slate-800">
                                        {tip.title}
                                    </p>

                                    <p className="mt-1 text-[10px] text-slate-500">
                                        {tip.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <Link href="/ways-to-save" className="mt-3 block w-full text-center text-sm font-medium text-blue-600">
                    View All Money Saving Tips
                </Link>
            </div>

            {/* =========================================================
                GENERATE TRIP PLAN
            ========================================================= */}
            <div className="mt-5 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 shadow-sm">

                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                    <div>
                        <div className="flex items-center gap-2">
                            <Sparkles
                                size={22}
                                className="text-blue-600"
                            />

                            <h2 className="text-xl font-bold text-slate-800">
                                Ready to Plan Your Trip?
                            </h2>
                        </div>

                        <p className="mt-2 text-sm text-slate-600">
                            Your selections will be used to create your
                            personalized {tripDetails.destination} trip.
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                            <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">
                                {selectedStyleData.title}
                            </span>

                            <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">
                                {selectedDurationData.days}
                            </span>

                            <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">
                                {selectedTransportData.title}
                            </span>

                            <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">
                                {selectedStayData.name}
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowTripPlan(true)}
                        className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                    >
                        <Sparkles size={17} />
                        Generate My Trip Plan
                    </button>
                </div>
            </div>

            {/* =========================================================
                GENERATED PLAN
            ========================================================= */}
            {showTripPlan && (
                <div className="fixed inset-0 z-[60] flex items-end bg-slate-950/45 p-3 backdrop-blur-sm sm:items-center sm:justify-center sm:p-6">
                    <button
                        type="button"
                        className="absolute inset-0 cursor-default"
                        aria-label="Close generated trip plan"
                        onClick={() => setShowTripPlan(false)}
                    />

                    <div
                        ref={tripPlanDialogRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="generated-trip-plan-title"
                        tabIndex={-1}
                        className="animate-page-in relative z-10 max-h-[88dvh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-blue-200 bg-white p-5 shadow-2xl sm:p-6"
                    >

                    <div className="flex items-start justify-between gap-4">

                        <div>
                            <div className="flex items-center gap-2">
                                <Sparkles
                                    size={22}
                                    className="text-blue-600"
                                />

                                <h2 id="generated-trip-plan-title" className="text-xl font-bold text-slate-800">
                                    Your {tripDetails.destination} Trip Plan is ready
                                </h2>
                            </div>

                            <p className="mt-2 text-sm text-slate-500">
                                This plan is based on all the choices you
                                selected above.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setShowTripPlan(false)
                            }
                            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                            aria-label="Close trip plan"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* PLAN SUMMARY */}
                    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                        <div className="rounded-xl bg-slate-50 p-4">
                            <p className="text-xs text-slate-500">
                                Travel Style
                            </p>

                            <p className="mt-2 font-bold text-slate-800">
                                {selectedStyleData.title}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                {selectedStyleData.description}
                            </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-4">
                            <p className="text-xs text-slate-500">
                                Duration
                            </p>

                            <p className="mt-2 font-bold text-slate-800">
                                {selectedDurationData.days}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                {selectedDurationData.description}
                            </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-4">
                            <p className="text-xs text-slate-500">
                                Transport
                            </p>

                            <p className="mt-2 font-bold text-slate-800">
                                {selectedTransportData.title}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                {selectedTransportData.subtitle}
                            </p>
                        </div>

                        <div className="rounded-xl bg-green-50 p-4">
                            <p className="text-xs text-green-700">
                                Estimated Budget
                            </p>

                            <p className="mt-2 text-xl font-bold text-green-700">
                                {formatCurrency(estimatedCost)}
                            </p>

                            <p className="mt-1 text-xs text-green-700">
                                Per person
                            </p>
                        </div>
                    </div>

                    {/* SELECTED STAY */}
                    <div className="mt-5 rounded-xl border border-slate-200 p-4">

                        <div className="flex items-center gap-2">
                            <BedDouble
                                size={18}
                                className="text-blue-600"
                            />

                            <h3 className="font-bold text-slate-800">
                                Recommended Stay Area
                            </h3>
                        </div>

                        <p className="mt-2 text-sm text-slate-700">
                            <span className="font-semibold">
                                {selectedStayData.name}
                            </span>{" "}
                            — {selectedStayData.description}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                            Expected stay cost: {selectedStayData.price}
                        </p>
                    </div>

                    {/* HIGHLIGHTS */}
                    <div className="mt-5">

                        <div className="flex items-center gap-2">
                            <MapPin
                                size={18}
                                className="text-red-500"
                            />

                            <h3 className="font-bold text-slate-800">
                                Suggested Trip Highlights
                            </h3>
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

                            {topPlaces.map((place) => (
                                <div
                                    key={place.name}
                                    className="overflow-hidden rounded-xl border border-slate-200"
                                >
                                    <div className="relative flex h-24 items-center justify-center bg-emerald-50 text-emerald-700">
                                        {place.image ? <Image src={place.image} alt={place.name} fill className="object-cover" /> : <MapPin size={28} aria-hidden="true" />}
                                    </div>

                                    <div className="p-3">
                                        <p className="text-sm font-semibold text-slate-800">
                                            {place.name}
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500">
                                            Recommended: {place.duration}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ACTION */}
                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">

                        <button
                            type="button"
                            onClick={() =>
                                setShowTripPlan(false)
                            }
                            className="flex-1 rounded-lg border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Modify My Choices
                        </button>

                        <Link
                            href="/itinerary"
                            className="flex-1 rounded-lg bg-blue-600 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            Continue to Full Itinerary
                        </Link>
                    </div>
                    </div>
                </div>
            )}
        </section>
    );
}
