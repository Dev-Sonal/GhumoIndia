"use client";

import { useState } from "react";
import Image from "next/image";

import {
    CalendarDays,
    IndianRupee,
    Sun,
    BadgeIndianRupee,
    Star,
    Crown,
    CloudSun,
    CloudRain,
    Camera,
    Utensils,
    Landmark,
    ShoppingBag,
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
    Lightbulb,
    Clock3,
    Route,
    CircleDollarSign,
    Church,
    ShipWheel,
    Map,
    Hotel,
    Soup,
    PiggyBank,
    Ticket,
    CalendarCheck,
    Navigation,
    Bike,
} from "lucide-react";

export default function Dashboard() {
    // =========================================================
    // STATES
    // =========================================================

    const [selectedStyle, setSelectedStyle] = useState("Recommended");
    const [selectedDuration, setSelectedDuration] = useState("4 Days");

    const [showFullBreakdown, setShowFullBreakdown] = useState(false);
    const [showAllPlaces, setShowAllPlaces] = useState(false);
    const [showAllNearby, setShowAllNearby] = useState(false);

    const [openDay, setOpenDay] = useState<number | null>(0);

    const [selectedTransport, setSelectedTransport] =
        useState("Best Balance");

    const [selectedStay, setSelectedStay] =
        useState("Candolim");

    const [showTripPlan, setShowTripPlan] = useState(false);

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

    const tripDurations = [
        {
            days: "3 Days",
            baseCost: 8000,
            description: "Quick trip - Cover highlights",
            recommended: false,
        },
        {
            days: "4 Days",
            baseCost: 11000,
            description: "Perfect balance",
            recommended: true,
        },
        {
            days: "6 Days",
            baseCost: 14500,
            description: "Explore more & nearby places",
            recommended: false,
        },
    ];

    // =========================================================
    // BEST TIME DATA
    // =========================================================

    const bestTimes = [
        {
            title: "Best Experience",
            months: "Nov - Feb",
            description: "Great weather, more activities",
            icon: Sun,
            iconClass: "text-yellow-500",
            monthClass: "text-green-700",
        },
        {
            title: "Best Value",
            months: "Mar - May",
            description: "Good weather, less crowd",
            icon: CloudSun,
            iconClass: "text-green-500",
            monthClass: "text-green-600",
        },
        {
            title: "Cheapest Time",
            months: "Jun - Sep",
            description: "Lowest prices, off-season",
            icon: CloudRain,
            iconClass: "text-red-500",
            monthClass: "text-red-500",
        },
    ];

    // =========================================================
    // TRIP HIGHLIGHTS
    // =========================================================

    const tripHighlights = [
        {
            title: "Beaches, Nightlife & Water Activities",
            icon: Palmtree,
        },
        {
            title: "Delicious Goan Food & Cafes",
            icon: Utensils,
        },
        {
            title: "Portuguese Heritage & Culture",
            icon: Landmark,
        },
        {
            title: "Scenic Views & Sunsets",
            icon: Camera,
        },
        {
            title: "Shopping & Local Markets",
            icon: ShoppingBag,
        },
    ];

    // =========================================================
    // TOP PLACES
    // =========================================================

    const topPlaces = [
        {
            name: "Baga Beach",
            duration: "3-4 hrs",
            image: "/images/baga-beach.jpg",
        },
        {
            name: "Fort Aguada",
            duration: "1-2 hrs",
            image: "/images/fort-aguada.jpg",
        },
        {
            name: "Dudhsagar Falls",
            duration: "1 day",
            image: "/images/dudhsagar-falls.jpg",
        },
        {
            name: "Anjuna Beach",
            duration: "2-3 hrs",
            image: "/images/anjuna-beach.jpg",
        },
    ];

    const extraPlaces = [
        {
            name: "Chapora Fort",
            duration: "1-2 hrs",
            image: "/images/fort-aguada.jpg",
        },
        {
            name: "Candolim Beach",
            duration: "2-3 hrs",
            image: "/images/baga-beach.jpg",
        },
        {
            name: "Old Goa Churches",
            duration: "2-3 hrs",
            image: "/images/anjuna-beach.jpg",
        },
    ];

    // =========================================================
    // NEARBY PLACES
    // =========================================================

    const nearbyPlaces = [
        {
            name: "Dudhsagar Falls",
            distance: "45 km",
            duration: "1.5 hrs",
            recommendation: "Worth adding",
            image: "/images/dudhsagar-falls.jpg",
            icon: MapPin,
        },
        {
            name: "Old Goa Churches",
            distance: "15 km",
            duration: "40 mins",
            recommendation: "Worth adding",
            image: "/images/anjuna-beach.jpg",
            icon: Church,
        },
        {
            name: "Divar Island",
            distance: "32 km",
            duration: "1 hr",
            recommendation: "Good for half day",
            image: "/images/baga-beach.jpg",
            icon: ShipWheel,
        },
        {
            name: "Arambol Beach",
            distance: "38 km",
            duration: "1.5 hrs",
            recommendation: "Worth adding",
            image: "/images/anjuna-beach.jpg",
            icon: Palmtree,
        },
        {
            name: "Salim Ali Bird Sanctuary",
            distance: "28 km",
            duration: "50 mins",
            recommendation: "Nature lovers",
            image: "/images/dudhsagar-falls.jpg",
            icon: Map,
        },
    ];

    // =========================================================
    // DAY-WISE ITINERARY
    // =========================================================

    const itinerary = [
        {
            day: "Day 1",
            title: "Arrival + North Goa",
            short: "Candolim Beach, Fort Aguada, Sunset",
            details: [
                "Check-in and freshen up",
                "Visit Candolim Beach",
                "Explore Fort Aguada",
                "Sunset by the beach",
                "Dinner and optional nightlife",
            ],
        },
        {
            day: "Day 2",
            title: "Beaches & Activities",
            short: "Water activities, Baga Beach, Anjuna",
            details: [
                "Breakfast near your stay",
                "Water activities at Baga Beach",
                "Relax at Calangute Beach",
                "Visit Anjuna Beach",
                "Explore cafes and nightlife",
            ],
        },
        {
            day: "Day 3",
            title: "Explore & Local Experience",
            short: "Local markets, churches, food tour",
            details: [
                "Visit Old Goa Churches",
                "Explore local markets",
                "Try authentic Goan food",
                "Visit Panaji streets",
                "Enjoy a relaxed evening",
            ],
        },
        {
            day: "Day 4",
            title: "Departure",
            short: "Breakfast, check-out, return journey",
            details: [
                "Breakfast",
                "Last-minute shopping",
                "Check-out from hotel",
                "Travel to airport or station",
            ],
        },
    ];

    // =========================================================
    // TRANSPORT OPTIONS
    // =========================================================

    const transportOptions = [
        {
            title: "Cheapest",
            subtitle: "Bus / Train",
            price: "₹1,200 - 1,800",
            duration: "12 - 14 hrs",
            icon: Bus,
            recommended: false,
        },
        {
            title: "Best Balance",
            subtitle: "Train + Local Cab",
            price: "₹2,800 - 3,500",
            duration: "10 - 12 hrs",
            icon: Train,
            recommended: true,
        },
        {
            title: "Fastest",
            subtitle: "Flight",
            price: "₹4,500 - 6,000",
            duration: "1.5 - 2 hrs",
            icon: Plane,
            recommended: false,
        },
    ];

    // =========================================================
    // STAY AREAS
    // =========================================================

    const stayAreas = [
        {
            name: "Baga / Calangute",
            description: "Best for nightlife & friends",
            price: "₹2,500 - 4,000 / night",
            image: "/images/baga-beach.jpg",
            recommended: false,
        },
        {
            name: "Candolim",
            description: "Best for couples & families",
            price: "₹2,000 - 3,500 / night",
            image: "/images/fort-aguada.jpg",
            recommended: true,
        },
        {
            name: "Panaji",
            description: "Quiet, cultural & convenient",
            price: "₹1,800 - 3,000 / night",
            image: "/images/anjuna-beach.jpg",
            recommended: false,
        },
    ];

    // =========================================================
    // FOOD DATA
    // =========================================================

    const foodItems = [
        "Goan Fish Curry",
        "Prawn Balchao",
        "Bebinca",
        "Goan Sausage",
    ];

    // =========================================================
    // MONEY SAVING TIPS
    // =========================================================

    const savingTips = [
        {
            title: "Travel in shoulder season",
            description: "Save up to 30%",
            icon: CalendarCheck,
        },
        {
            title: "Book stays in advance",
            description: "Better deals available",
            icon: Hotel,
        },
        {
            title: "Use local transport",
            description: "Rent scooter / bike",
            icon: Bike,
        },
        {
            title: "Eat at local eateries",
            description: "Save on food cost",
            icon: Soup,
        },
    ];

    // =========================================================
    // SELECTED DATA
    // =========================================================

    const selectedStyleData =
        tripOptions.find(
            (option) => option.title === selectedStyle
        ) || tripOptions[1];

    const selectedDurationData =
        tripDurations.find(
            (duration) =>
                duration.days === selectedDuration
        ) || tripDurations[1];

    const selectedTransportData =
        transportOptions.find(
            (transport) =>
                transport.title === selectedTransport
        ) || transportOptions[1];

    const selectedStayData =
        stayAreas.find(
            (stay) => stay.name === selectedStay
        ) || stayAreas[1];

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
        <section className="min-h-screen p-4 md:p-6 lg:p-8">

            {/* =====================================================
                TOP SECTION
            ===================================================== */}
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-4">

                {/* LEFT SIDE */}
                <div className="xl:col-span-3">

                    {/* =================================================
                        HERO
                    ================================================= */}
                    <div className="relative h-[430px] overflow-hidden rounded-2xl shadow-sm sm:h-[300px]">

                        <Image
                            src="/images/goa.jpg"
                            alt="Beautiful Goa beach"
                            fill
                            priority
                            className="object-cover"
                        />

                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-900/40 to-transparent" />

                        <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-7">

                            <div className="max-w-xl">
                                <h1 className="text-2xl font-bold text-white sm:text-3xl">
                                    Your Goa Trip is Ready! 🌴
                                </h1>

                                <p className="mt-2 text-sm text-slate-100 sm:text-base">
                                    We've created the best plan for you with the
                                    perfect balance of experience and budget.
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
                                            Estimated Cost
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
                                            Nov - Feb
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
                                            setSelectedStyle(option.title)
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
                <div className="flex flex-col gap-5">

                    {/* BEST TIME */}
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                        <h2 className="text-sm font-bold text-slate-800">
                            Best Time vs Cheapest Time
                        </h2>

                        <div className="mt-3">
                            {bestTimes.map((time, index) => {
                                const Icon = time.icon;

                                return (
                                    <div
                                        key={time.title}
                                        className={`flex gap-3 py-3 ${
                                            index !==
                                            bestTimes.length - 1
                                                ? "border-b border-slate-100"
                                                : ""
                                        }`}
                                    >
                                        <Icon
                                            size={17}
                                            className={time.iconClass}
                                        />

                                        <div className="min-w-0 flex-1">
                                            <div className="flex justify-between gap-2">
                                                <p className="text-xs font-semibold text-slate-800">
                                                    {time.title}
                                                </p>

                                                <span
                                                    className={`whitespace-nowrap text-xs font-semibold ${time.monthClass}`}
                                                >
                                                    {time.months}
                                                </span>
                                            </div>

                                            <p className="mt-1 text-[11px] text-slate-500">
                                                {time.description}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* TRIP HIGHLIGHTS */}
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                        <h2 className="text-sm font-bold text-slate-800">
                            Trip Highlights
                        </h2>

                        <div className="mt-3">
                            {tripHighlights.map(
                                (highlight, index) => {
                                    const Icon = highlight.icon;

                                    return (
                                        <div
                                            key={highlight.title}
                                            className={`flex items-center gap-3 py-2 ${
                                                index !==
                                                tripHighlights.length - 1
                                                    ? "border-b border-slate-100"
                                                    : ""
                                            }`}
                                        >
                                            <Icon
                                                size={16}
                                                className="text-blue-600"
                                            />

                                            <p className="text-xs text-slate-600">
                                                {highlight.title}
                                            </p>
                                        </div>
                                    );
                                }
                            )}
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
                            Total (Per Person)
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
                                        setSelectedDuration(duration.days)
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
                                setSelectedDuration("4 Days")
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
                        {displayedPlaces.map((place) => (
                            <button
                                key={place.name}
                                className="flex w-full items-center gap-3 text-left"
                            >
                                <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-md">
                                    <Image
                                        src={place.image}
                                        alt={place.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                <p className="flex-1 text-sm font-medium text-slate-800">
                                    {place.name}
                                </p>

                                <span className="text-xs text-slate-500">
                                    {place.duration}
                                </span>
                            </button>
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
                        Within ~50 km
                    </p>

                    <div className="mt-3 space-y-3">
                        {displayedNearbyPlaces.map((place) => (
                            <div
                                key={place.name}
                                className="flex items-center gap-3"
                            >
                                <div className="relative h-9 w-12 shrink-0 overflow-hidden rounded-md">
                                    <Image
                                        src={place.image}
                                        alt={place.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-xs font-semibold text-slate-800">
                                        {place.name}
                                    </p>

                                    <p className="text-[10px] text-slate-500">
                                        {place.distance} | {place.duration}
                                    </p>
                                </div>

                                <span className="text-right text-[10px] font-medium text-green-700">
                                    {place.recommendation}
                                </span>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() =>
                            setShowAllNearby(!showAllNearby)
                        }
                        className="mt-4 flex w-full items-center justify-center gap-1 text-sm font-medium text-blue-600"
                    >
                        {showAllNearby
                            ? "Show Less"
                            : "View All Nearby Places"}

                        <ChevronDown
                            size={16}
                            className={
                                showAllNearby
                                    ? "rotate-180 transition"
                                    : "transition"
                            }
                        />
                    </button>
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
                        {itinerary.map((item, index) => {
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

                    <button className="mt-4 w-full text-sm font-medium text-blue-600">
                        View Full Itinerary
                    </button>
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

                    <button className="mt-4 w-full text-sm font-medium text-blue-600">
                        Compare All Options
                    </button>
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
                                    <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md">
                                        <Image
                                            src={area.image}
                                            alt={area.name}
                                            fill
                                            className="object-cover"
                                        />
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

                    <button className="mt-4 w-full text-sm font-medium text-blue-600">
                        View All Areas & Stays
                    </button>
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

                    <button className="mt-5 w-full text-sm font-medium text-blue-600">
                        View Food Recommendations
                    </button>
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

                <button className="mt-3 w-full text-sm font-medium text-blue-600">
                    View All Money Saving Tips
                </button>
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
                            personalized Goa trip.
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
                <div className="mt-5 rounded-2xl border border-blue-200 bg-white p-5 shadow-md">

                    <div className="flex items-start justify-between gap-4">

                        <div>
                            <div className="flex items-center gap-2">
                                <Sparkles
                                    size={22}
                                    className="text-blue-600"
                                />

                                <h2 className="text-xl font-bold text-slate-800">
                                    Your Goa Trip Plan ✨
                                </h2>
                            </div>

                            <p className="mt-2 text-sm text-slate-500">
                                This plan is based on all the choices you
                                selected above.
                            </p>
                        </div>

                        <button
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
                                    <div className="relative h-24">
                                        <Image
                                            src={place.image}
                                            alt={place.name}
                                            fill
                                            className="object-cover"
                                        />
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
                            onClick={() =>
                                setShowTripPlan(false)
                            }
                            className="flex-1 rounded-lg border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Modify My Choices
                        </button>

                        <button
                            onClick={() =>
                                setShowTripPlan(false)
                            }
                            className="flex-1 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            Continue to Full Itinerary
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}