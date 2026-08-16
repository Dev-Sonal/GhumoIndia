import Sidebar from "@/components/sidebar";
import Header from "@/components/header";

import {
    Map,
    MapPin,
    Clock,
    Car,
    IndianRupee,
    Star,
    Route,
    Lightbulb,
    ChevronRight,
} from "lucide-react";

export default function NearbyPlacesPage() {
    const nearbyPlaces = [
        {
            name: "Candolim Beach",
            distance: "12 km",
            travelTime: "25 min",
            transport: "Bike / Cab",
            estimatedCost: "₹200 - ₹500",
            rating: "4.5",
            category: "Beach",
            description:
                "A beautiful and less crowded beach known for its relaxed atmosphere, beach shacks and scenic coastline.",
            whyVisit:
                "A great choice if you want to enjoy a peaceful beach experience close to the main North Goa attractions.",
            bestFor: ["Relaxation", "Beach Shacks", "Sunset"],
        },
        {
            name: "Chapora Fort",
            distance: "18 km",
            travelTime: "35 min",
            transport: "Bike / Cab",
            estimatedCost: "₹300 - ₹600",
            rating: "4.4",
            category: "Historic Place",
            description:
                "A historic fort famous for its panoramic views of Vagator Beach and the Arabian Sea.",
            whyVisit:
                "Perfect for photography, sunset views and travellers interested in Goa's history and scenic locations.",
            bestFor: ["Photography", "History", "Sunset"],
        },
        {
            name: "Vagator Beach",
            distance: "19 km",
            travelTime: "40 min",
            transport: "Bike / Cab",
            estimatedCost: "₹300 - ₹700",
            rating: "4.5",
            category: "Beach",
            description:
                "Known for its dramatic cliffs, relaxed vibe and beautiful views of the Arabian Sea.",
            whyVisit:
                "A good option for combining beach time, cafes and a visit to nearby Chapora Fort.",
            bestFor: ["Cliff Views", "Cafes", "Beach"],
        },
        {
            name: "Panaji",
            distance: "22 km",
            travelTime: "45 min",
            transport: "Cab / Bus",
            estimatedCost: "₹100 - ₹800",
            rating: "4.3",
            category: "City & Culture",
            description:
                "Goa's capital city, offering colourful streets, heritage buildings, local markets and riverside views.",
            whyVisit:
                "Best for travellers who want to experience Goan culture, local food and Portuguese-style architecture.",
            bestFor: ["Culture", "Shopping", "Food"],
        },
        {
            name: "Basilica of Bom Jesus",
            distance: "32 km",
            travelTime: "55 min",
            transport: "Cab / Bus",
            estimatedCost: "₹150 - ₹1,000",
            rating: "4.6",
            category: "Heritage",
            description:
                "One of Goa's most important historic churches and a major attraction in Old Goa.",
            whyVisit:
                "Worth visiting if you are interested in history, architecture and Goa's Portuguese heritage.",
            bestFor: ["History", "Architecture", "Culture"],
        },
        {
            name: "Divar Island",
            distance: "35 km",
            travelTime: "1 hr",
            transport: "Bike / Cab + Ferry",
            estimatedCost: "₹300 - ₹1,000",
            rating: "4.4",
            category: "Nature",
            description:
                "A peaceful island offering a quieter side of Goa with villages, greenery and scenic roads.",
            whyVisit:
                "A good escape from crowded tourist areas if you want a more local and relaxed experience.",
            bestFor: ["Nature", "Peaceful Ride", "Local Experience"],
        },
    ];

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />

            <main className="min-w-0 flex-1">
                <Header />

                <section className="p-4 md:p-6 lg:p-8">

                    {/* PAGE HEADER */}
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-blue-50 p-2">
                                    <Map
                                        size={24}
                                        className="text-blue-600"
                                    />
                                </div>

                                <div>
                                    <h1 className="text-2xl font-bold text-slate-800">
                                        Nearby Places
                                    </h1>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Discover worthwhile destinations within approximately 50 km.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
                            <p className="text-xs text-slate-500">
                                Search Radius
                            </p>

                            <p className="mt-1 text-sm font-bold text-blue-700">
                                Within 50 km
                            </p>
                        </div>
                    </div>

                    {/* SUMMARY */}
                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

                        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                            <div className="flex items-center gap-3">
                                <MapPin
                                    size={22}
                                    className="text-red-500"
                                />

                                <div>
                                    <p className="text-xs text-slate-500">
                                        Nearby Recommendations
                                    </p>

                                    <p className="mt-1 text-lg font-bold text-slate-800">
                                        {nearbyPlaces.length} Places
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                            <div className="flex items-center gap-3">
                                <Route
                                    size={22}
                                    className="text-blue-600"
                                />

                                <div>
                                    <p className="text-xs text-slate-500">
                                        Farthest Place
                                    </p>

                                    <p className="mt-1 text-lg font-bold text-slate-800">
                                        35 km
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                            <div className="flex items-center gap-3">
                                <Car
                                    size={22}
                                    className="text-green-600"
                                />

                                <div>
                                    <p className="text-xs text-slate-500">
                                        Best Way to Explore
                                    </p>

                                    <p className="mt-1 text-lg font-bold text-slate-800">
                                        Bike / Cab
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION TITLE */}
                    <div className="mt-8">
                        <h2 className="text-xl font-bold text-slate-800">
                            Worth Adding to Your Trip
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            These places can be added depending on your available
                            time, travel style and budget.
                        </p>
                    </div>

                    {/* PLACES */}
                    <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">

                        {nearbyPlaces.map((place) => (
                            <div
                                key={place.name}
                                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                            >
                                {/* TOP */}
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-bold text-slate-800">
                                                {place.name}
                                            </h3>

                                            <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-semibold text-blue-700">
                                                {place.category}
                                            </span>
                                        </div>

                                        <div className="mt-2 flex items-center gap-1 text-sm text-slate-500">
                                            <MapPin
                                                size={15}
                                                className="text-red-500"
                                            />

                                            {place.distance} away
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1 rounded-full bg-yellow-50 px-3 py-1 text-sm font-semibold text-slate-700">
                                        <Star
                                            size={15}
                                            className="fill-yellow-400 text-yellow-400"
                                        />

                                        {place.rating}
                                    </div>
                                </div>

                                {/* DESCRIPTION */}
                                <p className="mt-4 text-sm leading-6 text-slate-600">
                                    {place.description}
                                </p>

                                {/* DETAILS */}
                                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">

                                    <div className="rounded-lg bg-slate-50 p-3">
                                        <div className="flex items-center gap-2">
                                            <Clock
                                                size={16}
                                                className="text-blue-600"
                                            />

                                            <span className="text-xs text-slate-500">
                                                Travel Time
                                            </span>
                                        </div>

                                        <p className="mt-2 text-sm font-semibold text-slate-800">
                                            {place.travelTime}
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-slate-50 p-3">
                                        <div className="flex items-center gap-2">
                                            <Car
                                                size={16}
                                                className="text-green-600"
                                            />

                                            <span className="text-xs text-slate-500">
                                                Transport
                                            </span>
                                        </div>

                                        <p className="mt-2 text-sm font-semibold text-slate-800">
                                            {place.transport}
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-slate-50 p-3">
                                        <div className="flex items-center gap-2">
                                            <IndianRupee
                                                size={16}
                                                className="text-purple-600"
                                            />

                                            <span className="text-xs text-slate-500">
                                                Travel Cost
                                            </span>
                                        </div>

                                        <p className="mt-2 text-sm font-semibold text-slate-800">
                                            {place.estimatedCost}
                                        </p>
                                    </div>
                                </div>

                                {/* WHY ADD */}
                                <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">
                                    <p className="text-sm font-semibold text-slate-800">
                                        Why add this to your trip?
                                    </p>

                                    <p className="mt-2 text-sm leading-6 text-slate-600">
                                        {place.whyVisit}
                                    </p>
                                </div>

                                {/* BEST FOR */}
                                <div className="mt-5">
                                    <p className="text-sm font-semibold text-slate-800">
                                        Best for
                                    </p>

                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {place.bestFor.map((item) => (
                                            <span
                                                key={item}
                                                className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600"
                                            >
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* BUTTON */}
                                <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-blue-200 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50">
                                    Add to Trip

                                    <ChevronRight size={17} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* TIP */}
                    <div className="mt-8 rounded-2xl border border-yellow-200 bg-yellow-50 p-5">
                        <div className="flex gap-4">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-yellow-400">
                                <Lightbulb
                                    size={20}
                                    className="text-white"
                                />
                            </div>

                            <div>
                                <h3 className="font-bold text-slate-800">
                                    Smart Trip Planning Tip
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    Don't add every nearby destination just because it is close.
                                    Choose places that match your interests and group destinations
                                    in the same direction together. This helps reduce unnecessary
                                    travel time and transport costs.
                                </p>
                            </div>
                        </div>
                    </div>

                </section>
            </main>
        </div>
    );
}