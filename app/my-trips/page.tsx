import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import {
    CalendarDays,
    MapPin,
    Heart,
    ArrowRight,
    Plus,
    Clock,
    IndianRupee,
} from "lucide-react";

export default function MyTripsPage() {
    const trips = [
        {
            destination: "Goa",
            status: "Planning",
            duration: "4 Days",
            budget: "₹11,000",
            date: "Nov - Feb",
            description:
                "Beaches, nightlife, food, heritage and scenic experiences.",
        },
    ];

    return (
        <div className="flex min-h-screen bg-slate-50">

            <Sidebar />

            <main className="min-w-0 flex-1">
                <Header />

                <section className="p-4 md:p-6 lg:p-8">

                    {/* PAGE HEADER */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                        <div>
                            <div className="flex items-center gap-3">

                                <div className="rounded-xl bg-red-50 p-3">
                                    <Heart
                                        size={24}
                                        className="text-red-500"
                                    />
                                </div>

                                <div>
                                    <h1 className="text-2xl font-bold text-slate-800">
                                        My Trips
                                    </h1>

                                    <p className="mt-1 text-sm text-slate-500">
                                        View and manage your saved and planned trips.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* PLAN NEW TRIP */}
                        <button className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
                            <Plus size={18} />
                            Plan New Trip
                        </button>
                    </div>

                    {/* TRIP SUMMARY */}
                    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">

                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                            <p className="text-xs font-medium text-slate-500">
                                Total Trips
                            </p>

                            <p className="mt-2 text-2xl font-bold text-slate-800">
                                {trips.length}
                            </p>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                            <p className="text-xs font-medium text-slate-500">
                                Currently Planning
                            </p>

                            <p className="mt-2 text-2xl font-bold text-blue-600">
                                {trips.filter(
                                    (trip) => trip.status === "Planning"
                                ).length}
                            </p>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                            <p className="text-xs font-medium text-slate-500">
                                Saved Destinations
                            </p>

                            <p className="mt-2 text-2xl font-bold text-red-500">
                                {trips.length}
                            </p>
                        </div>
                    </div>

                    {/* SAVED TRIPS */}
                    <div className="mt-8">

                        <div className="flex items-center justify-between">

                            <div>
                                <h2 className="text-lg font-bold text-slate-800">
                                    Your Trips
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Continue planning your saved trips.
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">

                            {trips.map((trip) => (
                                <div
                                    key={trip.destination}
                                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                                >

                                    {/* CARD TOP */}
                                    <div className="flex items-start justify-between gap-4">

                                        <div className="flex items-center gap-3">

                                            <div className="rounded-xl bg-blue-50 p-3">
                                                <MapPin
                                                    size={22}
                                                    className="text-blue-600"
                                                />
                                            </div>

                                            <div>
                                                <h3 className="text-lg font-bold text-slate-800">
                                                    {trip.destination}
                                                </h3>

                                                <span className="mt-1 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                                    {trip.status}
                                                </span>
                                            </div>
                                        </div>

                                        <Heart
                                            size={20}
                                            className="fill-red-500 text-red-500"
                                        />
                                    </div>

                                    {/* DESCRIPTION */}
                                    <p className="mt-5 text-sm leading-6 text-slate-500">
                                        {trip.description}
                                    </p>

                                    {/* TRIP DETAILS */}
                                    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">

                                        <div className="rounded-lg bg-slate-50 p-3">

                                            <div className="flex items-center gap-2">
                                                <Clock
                                                    size={15}
                                                    className="text-slate-500"
                                                />

                                                <span className="text-xs text-slate-500">
                                                    Duration
                                                </span>
                                            </div>

                                            <p className="mt-2 text-sm font-semibold text-slate-800">
                                                {trip.duration}
                                            </p>
                                        </div>

                                        <div className="rounded-lg bg-slate-50 p-3">

                                            <div className="flex items-center gap-2">
                                                <IndianRupee
                                                    size={15}
                                                    className="text-slate-500"
                                                />

                                                <span className="text-xs text-slate-500">
                                                    Budget
                                                </span>
                                            </div>

                                            <p className="mt-2 text-sm font-semibold text-slate-800">
                                                {trip.budget}
                                            </p>
                                        </div>

                                        <div className="rounded-lg bg-slate-50 p-3">

                                            <div className="flex items-center gap-2">
                                                <CalendarDays
                                                    size={15}
                                                    className="text-slate-500"
                                                />

                                                <span className="text-xs text-slate-500">
                                                    Best Time
                                                </span>
                                            </div>

                                            <p className="mt-2 text-sm font-semibold text-slate-800">
                                                {trip.date}
                                            </p>
                                        </div>
                                    </div>

                                    {/* CONTINUE BUTTON */}
                                    <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
                                        Continue Planning
                                        <ArrowRight size={17} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                </section>
            </main>
        </div>
    );
}