import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import {
    Plane,
    Train,
    Bus,
    Car,
    Bike,
    CheckCircle2,
    IndianRupee,
    Clock,
    Users,
    MapPin,
    Navigation,
} from "lucide-react";

export default function TransportPage() {
    return (
        <div className="flex min-h-screen bg-slate-50">

            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="min-w-0 flex-1">
                <Header />

                <section className="p-4 md:p-6 lg:p-8">

                    {/* Page Heading */}
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            Transport Options
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Compare ways to reach Goa and choose the best local
                            transport option for your trip.
                        </p>
                    </div>

                    {/* ================================
                        BEST OPTION SUMMARY
                    ================================= */}
                    <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-5">

                        <div className="flex items-start gap-3">
                            <Navigation
                                size={24}
                                className="mt-1 text-blue-600"
                            />

                            <div>
                                <h2 className="font-bold text-slate-800">
                                    Recommended for Your Goa Trip
                                </h2>

                                <p className="mt-1 text-sm text-slate-600">
                                    For a 4-day Goa trip, renting a scooter or
                                    bike is one of the most convenient ways to
                                    explore beaches, cafes and nearby attractions.
                                </p>

                                <div className="mt-3 flex flex-wrap gap-2">
                                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-blue-700">
                                        Flexible
                                    </span>

                                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-blue-700">
                                        Budget Friendly
                                    </span>

                                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-blue-700">
                                        Easy for Sightseeing
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ================================
                        HOW TO REACH GOA
                    ================================= */}
                    <div className="mt-8">

                        <h2 className="text-xl font-bold text-slate-800">
                            How to Reach Goa
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Choose the travel option that best matches your
                            budget and available time.
                        </p>

                        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

                            {/* Flight */}
                            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                                <div className="flex items-center justify-between">
                                    <Plane
                                        size={24}
                                        className="text-blue-600"
                                    />

                                    <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-semibold text-blue-700">
                                        Fastest
                                    </span>
                                </div>

                                <h3 className="mt-4 font-bold text-slate-800">
                                    Flight
                                </h3>

                                <p className="mt-2 text-sm text-slate-500">
                                    Best if you want to save travel time.
                                </p>

                                <div className="mt-4 space-y-2 text-sm">

                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Clock size={15} />
                                        Fastest option
                                    </div>

                                    <div className="flex items-center gap-2 text-slate-600">
                                        <IndianRupee size={15} />
                                        Usually higher cost
                                    </div>
                                </div>
                            </div>

                            {/* Train */}
                            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                                <div className="flex items-center justify-between">
                                    <Train
                                        size={24}
                                        className="text-green-600"
                                    />

                                    <span className="rounded-full bg-green-50 px-2 py-1 text-[10px] font-semibold text-green-700">
                                        Best Value
                                    </span>
                                </div>

                                <h3 className="mt-4 font-bold text-slate-800">
                                    Train
                                </h3>

                                <p className="mt-2 text-sm text-slate-500">
                                    A good balance between comfort and budget.
                                </p>

                                <div className="mt-4 space-y-2 text-sm">

                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Users size={15} />
                                        Comfortable for long trips
                                    </div>

                                    <div className="flex items-center gap-2 text-slate-600">
                                        <IndianRupee size={15} />
                                        Budget friendly
                                    </div>
                                </div>
                            </div>

                            {/* Bus */}
                            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                                <Bus
                                    size={24}
                                    className="text-orange-500"
                                />

                                <h3 className="mt-4 font-bold text-slate-800">
                                    Bus
                                </h3>

                                <p className="mt-2 text-sm text-slate-500">
                                    Useful for nearby cities and budget travel.
                                </p>

                                <div className="mt-4 space-y-2 text-sm">

                                    <div className="flex items-center gap-2 text-slate-600">
                                        <IndianRupee size={15} />
                                        Often affordable
                                    </div>

                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Clock size={15} />
                                        Travel time may be longer
                                    </div>
                                </div>
                            </div>

                            {/* Car */}
                            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                                <Car
                                    size={24}
                                    className="text-purple-600"
                                />

                                <h3 className="mt-4 font-bold text-slate-800">
                                    Self Drive
                                </h3>

                                <p className="mt-2 text-sm text-slate-500">
                                    Great for families or groups travelling together.
                                </p>

                                <div className="mt-4 space-y-2 text-sm">

                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Users size={15} />
                                        Good for groups
                                    </div>

                                    <div className="flex items-center gap-2 text-slate-600">
                                        <MapPin size={15} />
                                        Maximum flexibility
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ================================
                        LOCAL TRANSPORT
                    ================================= */}
                    <div className="mt-8">

                        <h2 className="text-xl font-bold text-slate-800">
                            Getting Around Goa
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Compare local transport options for sightseeing
                            during your trip.
                        </p>

                        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">

                            {/* Bike Rental */}
                            <div className="rounded-xl border-2 border-blue-500 bg-white p-5 shadow-sm">

                                <div className="flex items-center justify-between">

                                    <Bike
                                        size={26}
                                        className="text-blue-600"
                                    />

                                    <span className="rounded-full bg-blue-600 px-3 py-1 text-[10px] font-semibold text-white">
                                        Recommended
                                    </span>
                                </div>

                                <h3 className="mt-4 text-lg font-bold text-slate-800">
                                    Scooter / Bike Rental
                                </h3>

                                <p className="mt-2 text-sm text-slate-500">
                                    Ideal for couples, solo travellers and
                                    flexible sightseeing.
                                </p>

                                <div className="mt-5 space-y-3">

                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-500">
                                            Estimated Cost
                                        </span>

                                        <span className="font-semibold text-slate-800">
                                            ₹400 - ₹800/day
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-green-600">
                                        <CheckCircle2 size={16} />
                                        Easy to explore beaches
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-green-600">
                                        <CheckCircle2 size={16} />
                                        Flexible schedule
                                    </div>
                                </div>
                            </div>

                            {/* Car Rental */}
                            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                                <Car
                                    size={26}
                                    className="text-slate-700"
                                />

                                <h3 className="mt-4 text-lg font-bold text-slate-800">
                                    Car Rental
                                </h3>

                                <p className="mt-2 text-sm text-slate-500">
                                    More comfortable for families, groups and
                                    longer distances.
                                </p>

                                <div className="mt-5 space-y-3">

                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-500">
                                            Estimated Cost
                                        </span>

                                        <span className="font-semibold text-slate-800">
                                            ₹1,500 - ₹3,000/day
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-green-600">
                                        <CheckCircle2 size={16} />
                                        Comfortable
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-green-600">
                                        <CheckCircle2 size={16} />
                                        Better for groups
                                    </div>
                                </div>
                            </div>

                            {/* Taxi */}
                            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                                <MapPin
                                    size={26}
                                    className="text-red-500"
                                />

                                <h3 className="mt-4 text-lg font-bold text-slate-800">
                                    Taxi / Cab
                                </h3>

                                <p className="mt-2 text-sm text-slate-500">
                                    Convenient when you do not want to drive or
                                    rent a vehicle.
                                </p>

                                <div className="mt-5 space-y-3">

                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-500">
                                            Best For
                                        </span>

                                        <span className="font-semibold text-slate-800">
                                            Point-to-point travel
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-green-600">
                                        <CheckCircle2 size={16} />
                                        No driving required
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <CheckCircle2 size={16} />
                                        Less flexible than rentals
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ================================
                        OUR RECOMMENDATION
                    ================================= */}
                    <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

                        <h2 className="text-lg font-bold text-slate-800">
                            Our Recommendation for Your Trip
                        </h2>

                        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">

                            <div className="rounded-lg bg-slate-50 p-4">

                                <p className="text-xs text-slate-500">
                                    Best for Solo / Couple
                                </p>

                                <p className="mt-2 font-bold text-slate-800">
                                    Scooter Rental
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                    Flexible and economical.
                                </p>
                            </div>

                            <div className="rounded-lg bg-slate-50 p-4">

                                <p className="text-xs text-slate-500">
                                    Best for Family
                                </p>

                                <p className="mt-2 font-bold text-slate-800">
                                    Car Rental
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                    More comfortable with luggage.
                                </p>
                            </div>

                            <div className="rounded-lg bg-slate-50 p-4">

                                <p className="text-xs text-slate-500">
                                    Best Budget Choice
                                </p>

                                <p className="mt-2 font-bold text-slate-800">
                                    Train + Scooter
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                    Good balance of cost and freedom.
                                </p>
                            </div>
                        </div>
                    </div>

                </section>
            </main>
        </div>
    );
}