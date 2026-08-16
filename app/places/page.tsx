import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import Image from "next/image";

import {
    MapPin,
    Clock,
    IndianRupee,
    Star,
    Camera,
    CalendarDays,
    Palmtree,
} from "lucide-react";

export default function PlacesPage() {
    const places = [
        {
            name: "Baga Beach",
            image: "/images/baga-beach.jpg",
            duration: "3 - 4 hrs",
            area: "North Goa",
            entry: "Free",
            rating: "4.5",
            bestTime: "Morning or Sunset",
            description:
                "One of Goa's most popular beaches, known for its lively atmosphere, beach shacks, water sports and nightlife.",
            whyVisit:
                "Perfect for travellers looking for beaches, adventure activities, food and nightlife in one place.",
            activities: [
                "Water Sports",
                "Beach Relaxation",
                "Beach Shacks",
                "Nightlife",
            ],
        },
        {
            name: "Fort Aguada",
            image: "/images/fort-aguada.jpg",
            duration: "1 - 2 hrs",
            area: "Candolim, North Goa",
            entry: "Free",
            rating: "4.4",
            bestTime: "Late Afternoon",
            description:
                "A historic Portuguese fort offering beautiful views of the Arabian Sea and Goa's coastline.",
            whyVisit:
                "A great combination of history, architecture, photography and scenic sea views.",
            activities: [
                "Explore the Fort",
                "Photography",
                "Sea Views",
                "Sunset",
            ],
        },
        {
            name: "Dudhsagar Falls",
            image: "/images/dudhsagar-falls.jpg",
            duration: "Full Day",
            area: "Sanguem, Goa",
            entry: "Varies",
            rating: "4.6",
            bestTime: "Oct - Feb",
            description:
                "One of India's tallest waterfalls, surrounded by the beautiful Western Ghats.",
            whyVisit:
                "Ideal for nature lovers and travellers who want an adventurous full-day experience.",
            activities: [
                "Waterfall View",
                "Nature",
                "Jeep Safari",
                "Photography",
            ],
        },
        {
            name: "Anjuna Beach",
            image: "/images/anjuna-beach.jpg",
            duration: "2 - 3 hrs",
            area: "North Goa",
            entry: "Free",
            rating: "4.4",
            bestTime: "Evening",
            description:
                "A famous Goa beach known for its relaxed vibe, rocky coastline, cafes and beautiful sunsets.",
            whyVisit:
                "Best for travellers looking for a relaxed beach experience with cafes, shopping and scenic views.",
            activities: [
                "Beach Walk",
                "Visit Cafes",
                "Sunset Views",
                "Shopping",
            ],
        },
    ];

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />

            <main className="min-w-0 flex-1">
                <Header />

                <section className="p-4 md:p-6 lg:p-8">

                    {/* PAGE HEADER */}
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-blue-50 p-2">
                                <MapPin
                                    size={24}
                                    className="text-blue-600"
                                />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-slate-800">
                                    Places to Visit
                                </h1>

                                <p className="mt-1 text-sm text-slate-500">
                                    Explore the best places in Goa based on your trip duration.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* SUMMARY CARDS */}
                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

                        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                            <div className="flex items-center gap-3">
                                <Palmtree
                                    size={22}
                                    className="text-green-600"
                                />

                                <div>
                                    <p className="text-xs text-slate-500">
                                        Recommended Places
                                    </p>

                                    <p className="mt-1 text-lg font-bold text-slate-800">
                                        {places.length} Places
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                            <div className="flex items-center gap-3">
                                <CalendarDays
                                    size={22}
                                    className="text-blue-600"
                                />

                                <div>
                                    <p className="text-xs text-slate-500">
                                        Your Trip Duration
                                    </p>

                                    <p className="mt-1 text-lg font-bold text-slate-800">
                                        4 Days
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                            <div className="flex items-center gap-3">
                                <Star
                                    size={22}
                                    className="fill-yellow-400 text-yellow-400"
                                />

                                <div>
                                    <p className="text-xs text-slate-500">
                                        Trip Style
                                    </p>

                                    <p className="mt-1 text-lg font-bold text-slate-800">
                                        Recommended
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION TITLE */}
                    <div className="mt-8">
                        <h2 className="text-xl font-bold text-slate-800">
                            Recommended for Your Trip
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Explore beaches, history, nature and scenic experiences.
                        </p>
                    </div>

                    {/* PLACES GRID */}
                    <div className="mt-5 grid grid-cols-1 gap-6 xl:grid-cols-2">

                        {places.map((place, index) => (
                            <div
                                key={place.name}
                                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                            >
                                {/* IMAGE */}
                                <div className="relative h-56 w-full">
                                    <Image
                                        src={place.image}
                                        alt={place.name}
                                        fill
                                        className="object-cover"
                                    />

                                    <div className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-800 shadow">
                                        #{index + 1} Recommended
                                    </div>

                                    <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-800 shadow">
                                        <Star
                                            size={14}
                                            className="fill-yellow-400 text-yellow-400"
                                        />
                                        {place.rating}
                                    </div>
                                </div>

                                {/* CONTENT */}
                                <div className="p-5">

                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-800">
                                                {place.name}
                                            </h3>

                                            <div className="mt-2 flex items-center gap-1 text-sm text-slate-500">
                                                <MapPin
                                                    size={15}
                                                    className="text-red-500"
                                                />

                                                {place.area}
                                            </div>
                                        </div>

                                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                            Must Visit
                                        </span>
                                    </div>

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
                                                    Duration
                                                </span>
                                            </div>

                                            <p className="mt-2 text-sm font-semibold text-slate-800">
                                                {place.duration}
                                            </p>
                                        </div>

                                        <div className="rounded-lg bg-slate-50 p-3">
                                            <div className="flex items-center gap-2">
                                                <IndianRupee
                                                    size={16}
                                                    className="text-green-600"
                                                />

                                                <span className="text-xs text-slate-500">
                                                    Entry
                                                </span>
                                            </div>

                                            <p className="mt-2 text-sm font-semibold text-slate-800">
                                                {place.entry}
                                            </p>
                                        </div>

                                        <div className="rounded-lg bg-slate-50 p-3">
                                            <div className="flex items-center gap-2">
                                                <Camera
                                                    size={16}
                                                    className="text-purple-600"
                                                />

                                                <span className="text-xs text-slate-500">
                                                    Best Time
                                                </span>
                                            </div>

                                            <p className="mt-2 text-sm font-semibold text-slate-800">
                                                {place.bestTime}
                                            </p>
                                        </div>
                                    </div>

                                    {/* WHY VISIT */}
                                    <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">
                                        <p className="text-sm font-semibold text-slate-800">
                                            Why should you visit?
                                        </p>

                                        <p className="mt-2 text-sm leading-6 text-slate-600">
                                            {place.whyVisit}
                                        </p>
                                    </div>

                                    {/* ACTIVITIES */}
                                    <div className="mt-5">
                                        <p className="text-sm font-semibold text-slate-800">
                                            Things to do
                                        </p>

                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {place.activities.map((activity) => (
                                                <span
                                                    key={activity}
                                                    className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600"
                                                >
                                                    {activity}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>

                    {/* PLANNING TIP */}
                    <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5">
                        <div className="flex gap-4">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600">
                                <CalendarDays
                                    size={20}
                                    className="text-white"
                                />
                            </div>

                            <div>
                                <h3 className="font-bold text-slate-800">
                                    Suggested Planning Tip
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    Group nearby places together to reduce travel
                                    time. You can explore North Goa beaches and
                                    Fort Aguada together, while Dudhsagar Falls
                                    should be planned as a separate full-day trip.
                                </p>
                            </div>
                        </div>
                    </div>

                </section>
            </main>
        </div>
    );
}