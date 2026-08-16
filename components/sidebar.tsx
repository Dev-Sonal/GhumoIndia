"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    CalendarDays,
    Car,
    CircleDollarSign,
    Home,
    Lightbulb,
    MapPin,
    Utensils,
    Bed,
    Map,
    Heart,
    User,
    Settings,
} from "lucide-react";

export default function Sidebar() {
    const pathname = usePathname();

    const menuItems = [
        {
            name: "Trip Dashboard",
            icon: Home,
            href: "/",
        },
        {
            name: "Itinerary",
            icon: CalendarDays,
            href: "/itinerary",
        },
        {
            name: "Cost Breakdown",
            icon: CircleDollarSign,
            href: "/cost-breakdown",
        },
        {
            name: "Places to Visit",
            icon: MapPin,
            href: "/places",
        },
        {
            name: "Nearby Places",
            icon: Map,
            href: "/nearby-places",
        },
        {
            name: "Transport Options",
            icon: Car,
            href: "/transport",
        },
        {
            name: "Stay & Areas",
            icon: Bed,
            href: "/stay",
        },
        {
            name: "Food Guide",
            icon: Utensils,
            href: "/food-guide",
        },
        {
            name: "Ways to Save",
            icon: Lightbulb,
            href: "/ways-to-save",
        },
    ];

    const bottomItems = [
        {
            name: "My Trips",
            icon: Heart,
            href: "/my-trips",
        },
        {
            name: "Profile",
            icon: User,
            href: "/profile",
        },
        {
            name: "Settings",
            icon: Settings,
            href: "/settings",
        },
    ];

    return (
        <aside className="sticky top-0 flex h-screen w-56 shrink-0 flex-col border-r border-slate-200 bg-white p-4">

            {/* ==============================
                LOGO
            ============================== */}
            <div>
                <h1 className="text-2xl font-bold text-blue-600">
                    GhumoIndia
                </h1>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                    You decide where.
                    <br />
                    We plan how.
                </p>
            </div>

            {/* ==============================
                MAIN NAVIGATION
            ============================== */}
            <nav className="mt-8 space-y-2">

                {menuItems.map((item) => {
                    const Icon = item.icon;

                    const isActive =
                        pathname === item.href;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition ${
                                isActive
                                    ? "bg-blue-50 font-semibold text-blue-700"
                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            }`}
                        >
                            <Icon size={18} />

                            <span>
                                {item.name}
                            </span>
                        </Link>
                    );
                })}

            </nav>

            {/* ==============================
                BOTTOM NAVIGATION
            ============================== */}
            <div className="mt-auto border-t border-slate-200 pt-4">

                {bottomItems.map((item) => {
                    const Icon = item.icon;

                    const isActive =
                        pathname === item.href;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition ${
                                isActive
                                    ? "bg-blue-50 font-semibold text-blue-700"
                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            }`}
                        >
                            <Icon size={18} />

                            <span>
                                {item.name}
                            </span>
                        </Link>
                    );
                })}

            </div>

        </aside>
    );
}