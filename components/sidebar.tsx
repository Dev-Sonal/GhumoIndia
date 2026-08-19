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
    Headphones,
    Plane,
    MapPinned,
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

    const isActive = (href: string) => {
        if (href === "/") {
            return pathname === "/";
        }

        return pathname === href;
    };

    return (
        <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white px-4 py-5">

            {/* =====================================
                PILGORA BRAND
            ====================================== */}
            <div className="border-b border-slate-100 px-6 py-6">

                <Link
                    href="/"
                    className="group flex items-center gap-3"
                >
                    {/* Logo */}
                    <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 shadow-lg shadow-blue-100 transition-transform duration-200 group-hover:scale-105">

                        <Plane
                            size={24}
                            strokeWidth={2.4}
                            className="rotate-[-25deg] text-white"
                        />

                    </div>

                    {/* Brand Name */}
                    <div>
                        <h1 className="text-[26px] font-bold leading-none tracking-tight text-slate-900">
                            Pilgora
                        </h1>

                        <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-blue-600">
                            Travel Smarter
                        </p>
                    </div>
                </Link>

                {/* Tagline */}
                <div className="mt-5">
                    <p className="text-[13px] leading-5 text-slate-500">
                        You decide where.
                    </p>

                    <p className="text-[13px] font-semibold leading-5 text-slate-800">
                        We plan how.
                    </p>
                </div>

            </div>


            {/* =====================================
                MAIN NAVIGATION
            ====================================== */}
            <nav className="flex-1 overflow-y-auto px-4 py-5">

                <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                    Your Trip
                </p>

                <div className="space-y-1">

                    {menuItems.map((item) => {

                        const Icon = item.icon;
                        const active = isActive(item.href);

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`relative flex items-center gap-4 rounded-lg px-3 py-3 text-sm transition-all duration-200 ${
                                    active
                                        ? "bg-blue-50 font-semibold text-blue-700"
                                        : "font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                }`}
                            >
                                {/* Active Indicator */}
                                {active && (
                                    <span className="absolute left-0 top-2 h-[calc(100%-16px)] w-1 rounded-r-full bg-blue-600" />
                                )}

                                {/* Icon */}
                                <Icon
                                    size={20}
                                    strokeWidth={active ? 2.2 : 1.8}
                                    className={
                                        active
                                            ? "text-blue-600"
                                            : "text-slate-500"
                                    }
                                />

                                {/* Name */}
                                <span>
                                    {item.name}
                                </span>

                            </Link>
                        );
                    })}

                </div>

            </nav>


            {/* =====================================
                BOTTOM NAVIGATION
            ====================================== */}
            <div className="border-t border-slate-200 px-4 pt-4">

                <div className="space-y-1">

                    {bottomItems.map((item) => {

                        const Icon = item.icon;
                        const active = isActive(item.href);

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-4 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 ${
                                    active
                                        ? "bg-blue-50 font-semibold text-blue-700"
                                        : "font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                }`}
                            >
                                <Icon
                                    size={19}
                                    strokeWidth={active ? 2.2 : 1.8}
                                    className={
                                        active
                                            ? "text-blue-600"
                                            : "text-slate-500"
                                    }
                                />

                                <span>
                                    {item.name}
                                </span>

                            </Link>
                        );
                    })}

                </div>


                {/* =====================================
                    HELP CARD
                ====================================== */}
                <div className="mb-5 mt-5 rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-3.5">

                    <div className="flex items-center gap-3">

                        {/* Icon */}
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 shadow-sm">

                            <Headphones
                                size={18}
                                className="text-white"
                            />

                        </div>

                        {/* Text */}
                        <div>
                            <p className="text-xs font-bold text-slate-800">
                                Need help?
                            </p>

                            <p className="mt-1 text-[11px] leading-4 text-slate-500">
                                Talk to your Pilgora
                                <br />
                                trip planner
                            </p>
                        </div>

                    </div>

                </div>

            </div>

        </aside>
    );
}