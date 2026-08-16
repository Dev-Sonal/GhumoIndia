import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import {
    Bed,
    MapPin,
    IndianRupee,
    Users,
    Car,
    Coffee,
    CheckCircle2,
    Star,
    Waves,
    Building2,
} from "lucide-react";

export default function StayPage() {
    return (
        <div className="flex min-h-screen bg-slate-50">

            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="min-w-0 flex-1">
                <Header />

                <section className="p-4 md:p-6 lg:p-8">

                    {/* ================================
                        PAGE HEADING
                    ================================= */}
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            Stay & Best Areas
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Find the best area to stay based on convenience,
                            budget and your travel style.
                        </p>
                    </div>

                    {/* ================================
                        RECOMMENDED AREA
                    ================================= */}
                    <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-5">

                        <div className="flex items-start gap-3">
                            <Star
                                size={24}
                                className="mt-1 text-blue-600"
                            />

                            <div>
                                <h2 className="font-bold text-slate-800">
                                    Recommended for Your Goa Trip
                                </h2>

                                <p className="mt-1 text-sm text-slate-600">
                                    North Goa is recommended for your 4-day trip
                                    because it gives you easy access to popular
                                    beaches, nightlife, restaurants, cafes and
                                    major attractions.
                                </p>

                                <div className="mt-3 flex flex-wrap gap-2">
                                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-blue-700">
                                        Convenient Location
                                    </span>

                                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-blue-700">
                                        More Activities
                                    </span>

                                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-blue-700">
                                        Good Transport Access
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ================================
                        BEST AREAS TO STAY
                    ================================= */}
                    <div className="mt-8">

                        <h2 className="text-xl font-bold text-slate-800">
                            Best Areas to Stay in Goa
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Each area offers a different experience depending
                            on your budget and travel preferences.
                        </p>

                        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

                            {/* Baga */}
                            <div className="rounded-xl border-2 border-blue-500 bg-white p-5 shadow-sm">

                                <div className="flex items-center justify-between">
                                    <Waves
                                        size={25}
                                        className="text-blue-600"
                                    />

                                    <span className="rounded-full bg-blue-600 px-3 py-1 text-[10px] font-semibold text-white">
                                        Recommended
                                    </span>
                                </div>

                                <h3 className="mt-4 text-lg font-bold text-slate-800">
                                    Baga & Calangute
                                </h3>

                                <p className="mt-2 text-sm text-slate-500">
                                    Best for first-time visitors who want to
                                    stay close to beaches, nightlife, food and
                                    activities.
                                </p>

                                <div className="mt-5 space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <MapPin size={16} />
                                        Close to major attractions
                                    </div>

                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Coffee size={16} />
                                        Many cafes and restaurants
                                    </div>

                                    <div className="flex items-center gap-2 text-slate-600">
                                        <IndianRupee size={16} />
                                        Budget to premium options
                                    </div>
                                </div>
                            </div>

                            {/* Candolim */}
                            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                                <Waves
                                    size={25}
                                    className="text-cyan-600"
                                />

                                <h3 className="mt-4 text-lg font-bold text-slate-800">
                                    Candolim
                                </h3>

                                <p className="mt-2 text-sm text-slate-500">
                                    A good choice if you want beautiful beaches
                                    and restaurants with a comparatively relaxed
                                    atmosphere.
                                </p>

                                <div className="mt-5 space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <CheckCircle2 size={16} />
                                        Beach nearby
                                    </div>

                                    <div className="flex items-center gap-2 text-slate-600">
                                        <CheckCircle2 size={16} />
                                        Good restaurants
                                    </div>

                                    <div className="flex items-center gap-2 text-slate-600">
                                        <CheckCircle2 size={16} />
                                        Good for couples
                                    </div>
                                </div>
                            </div>

                            {/* Anjuna */}
                            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                                <Coffee
                                    size={25}
                                    className="text-orange-500"
                                />

                                <h3 className="mt-4 text-lg font-bold text-slate-800">
                                    Anjuna & Vagator
                                </h3>

                                <p className="mt-2 text-sm text-slate-500">
                                    Great for cafes, nightlife, scenic beaches
                                    and travellers looking for a more vibrant
                                    Goa experience.
                                </p>

                                <div className="mt-5 space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <CheckCircle2 size={16} />
                                        Popular cafes
                                    </div>

                                    <div className="flex items-center gap-2 text-slate-600">
                                        <CheckCircle2 size={16} />
                                        Nightlife nearby
                                    </div>

                                    <div className="flex items-center gap-2 text-slate-600">
                                        <CheckCircle2 size={16} />
                                        Great sunset spots
                                    </div>
                                </div>
                            </div>

                            {/* Panjim */}
                            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                                <Building2
                                    size={25}
                                    className="text-purple-600"
                                />

                                <h3 className="mt-4 text-lg font-bold text-slate-800">
                                    Panjim
                                </h3>

                                <p className="mt-2 text-sm text-slate-500">
                                    Best for travellers interested in culture,
                                    heritage, city convenience and easy access
                                    to Old Goa.
                                </p>

                                <div className="mt-5 space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <CheckCircle2 size={16} />
                                        City convenience
                                    </div>

                                    <div className="flex items-center gap-2 text-slate-600">
                                        <CheckCircle2 size={16} />
                                        Heritage attractions nearby
                                    </div>

                                    <div className="flex items-center gap-2 text-slate-600">
                                        <CheckCircle2 size={16} />
                                        Good transport connections
                                    </div>
                                </div>
                            </div>

                            {/* South Goa */}
                            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                                <Bed
                                    size={25}
                                    className="text-green-600"
                                />

                                <h3 className="mt-4 text-lg font-bold text-slate-800">
                                    South Goa
                                </h3>

                                <p className="mt-2 text-sm text-slate-500">
                                    Best for travellers looking for quieter
                                    beaches, resorts and a more relaxed stay.
                                </p>

                                <div className="mt-5 space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <CheckCircle2 size={16} />
                                        Peaceful atmosphere
                                    </div>

                                    <div className="flex items-center gap-2 text-slate-600">
                                        <CheckCircle2 size={16} />
                                        Resort options
                                    </div>

                                    <div className="flex items-center gap-2 text-slate-600">
                                        <CheckCircle2 size={16} />
                                        Less crowded beaches
                                    </div>
                                </div>
                            </div>

                            {/* Budget Area */}
                            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                                <IndianRupee
                                    size={25}
                                    className="text-green-600"
                                />

                                <h3 className="mt-4 text-lg font-bold text-slate-800">
                                    Arpora
                                </h3>

                                <p className="mt-2 text-sm text-slate-500">
                                    A useful option for travellers looking for
                                    comparatively affordable stays while staying
                                    close to North Goa attractions.
                                </p>

                                <div className="mt-5 space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <CheckCircle2 size={16} />
                                        Budget-friendly options
                                    </div>

                                    <div className="flex items-center gap-2 text-slate-600">
                                        <CheckCircle2 size={16} />
                                        Close to Baga area
                                    </div>

                                    <div className="flex items-center gap-2 text-slate-600">
                                        <CheckCircle2 size={16} />
                                        Good for longer stays
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* ================================
                        STAY OPTIONS BY BUDGET
                    ================================= */}
                    <div className="mt-8">

                        <h2 className="text-xl font-bold text-slate-800">
                            Stay Options by Budget
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Choose the type of accommodation that matches your
                            selected travel style.
                        </p>

                        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">

                            {/* Budget */}
                            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                                <IndianRupee
                                    size={24}
                                    className="text-green-600"
                                />

                                <h3 className="mt-4 font-bold text-slate-800">
                                    Budget Stay
                                </h3>

                                <p className="mt-2 text-sm text-slate-500">
                                    Hostels, guest houses and basic hotels.
                                </p>

                                <p className="mt-5 text-xl font-bold text-slate-800">
                                    ₹800 - ₹2,000
                                </p>

                                <p className="text-xs text-slate-500">
                                    Approx. per night
                                </p>
                            </div>

                            {/* Mid Range */}
                            <div className="rounded-xl border-2 border-blue-500 bg-white p-5 shadow-sm">

                                <div className="flex items-center justify-between">
                                    <Bed
                                        size={24}
                                        className="text-blue-600"
                                    />

                                    <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-semibold text-blue-700">
                                        Recommended
                                    </span>
                                </div>

                                <h3 className="mt-4 font-bold text-slate-800">
                                    Comfortable Stay
                                </h3>

                                <p className="mt-2 text-sm text-slate-500">
                                    Good hotels with better comfort and
                                    convenient locations.
                                </p>

                                <p className="mt-5 text-xl font-bold text-slate-800">
                                    ₹2,000 - ₹5,000
                                </p>

                                <p className="text-xs text-slate-500">
                                    Approx. per night
                                </p>
                            </div>

                            {/* Premium */}
                            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                                <Star
                                    size={24}
                                    className="text-yellow-500"
                                />

                                <h3 className="mt-4 font-bold text-slate-800">
                                    Premium Resort
                                </h3>

                                <p className="mt-2 text-sm text-slate-500">
                                    Resorts and premium hotels with additional
                                    facilities and comfort.
                                </p>

                                <p className="mt-5 text-xl font-bold text-slate-800">
                                    ₹5,000+
                                </p>

                                <p className="text-xs text-slate-500">
                                    Approx. per night
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* ================================
                        BEST STAY FOR YOUR TRIP
                    ================================= */}
                    <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

                        <div className="flex items-center gap-3">
                            <Bed
                                size={24}
                                className="text-blue-600"
                            />

                            <div>
                                <h2 className="text-lg font-bold text-slate-800">
                                    Best Stay Choice for Your Trip
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Based on your current 4-day Recommended Goa
                                    trip plan.
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">

                            <div className="rounded-lg bg-slate-50 p-4">

                                <p className="text-xs text-slate-500">
                                    Recommended Area
                                </p>

                                <p className="mt-2 font-bold text-slate-800">
                                    Baga / Calangute
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                    Best access to popular attractions.
                                </p>
                            </div>

                            <div className="rounded-lg bg-slate-50 p-4">

                                <p className="text-xs text-slate-500">
                                    Recommended Stay Type
                                </p>

                                <p className="mt-2 font-bold text-slate-800">
                                    Comfortable Hotel
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                    Good balance of price and convenience.
                                </p>
                            </div>

                            <div className="rounded-lg bg-slate-50 p-4">

                                <p className="text-xs text-slate-500">
                                    Best for
                                </p>

                                <p className="mt-2 font-bold text-slate-800">
                                    First-Time Goa Visitors
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                    Easy access to beaches, food and nightlife.
                                </p>
                            </div>

                        </div>

                    </div>

                </section>
            </main>

        </div>
    );
}