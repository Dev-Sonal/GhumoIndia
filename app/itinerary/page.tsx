"use client";

import { useState } from "react";

import Sidebar from "@/components/sidebar";
import Header from "@/components/header";

import {
    CalendarDays,
    Clock,
    MapPin,
    IndianRupee,
    ChevronDown,
    CheckCircle2,
    Sparkles,
    Car,
    Utensils,
    Camera,
    Palmtree,
    Landmark,
} from "lucide-react";

export default function ItineraryPage() {

    // ==========================================
    // SELECTED DAY
    // Controls which day's details are expanded
    // ==========================================
    const [selectedDay, setSelectedDay] = useState(1);

    // ==========================================
    // TRIP DATA
    // Same trip as the Trip Dashboard
    // ==========================================
    const tripDetails = {
        destination: "Goa",
        duration: "4 Days",
        budget: "₹11,000",
        travelStyle: "Recommended",
    };

    // ==========================================
    // 4-DAY GOA ITINERARY
    // Detailed version of dashboard trip summary
    // ==========================================
    const itineraryDays = [
        {
            day: 1,
            title: "Arrival & North Goa Beaches",
            subtitle: "Settle in and enjoy your first Goan sunset",
            area: "North Goa",
            icon: Palmtree,
            estimatedCost: "₹2,200",

            activities: [
                {
                    time: "10:00 AM",
                    title: "Arrive & Check-in",
                    description:
                        "Reach your stay, freshen up and relax before starting your Goa trip.",
                    icon: MapPin,
                    duration: "1-2 hrs",
                },
                {
                    time: "1:00 PM",
                    title: "Lunch",
                    description:
                        "Try local Goan food or a beachside cafe near your stay.",
                    icon: Utensils,
                    duration: "1 hr",
                },
                {
                    time: "3:00 PM",
                    title: "Explore Baga Beach",
                    description:
                        "Relax at the beach, enjoy the sea and explore nearby beach activities.",
                    icon: Palmtree,
                    duration: "3-4 hrs",
                },
                {
                    time: "7:00 PM",
                    title: "Sunset & Evening at Baga",
                    description:
                        "Enjoy the sunset, beach atmosphere and evening nightlife.",
                    icon: Camera,
                    duration: "2-3 hrs",
                },
            ],
        },

        {
            day: 2,
            title: "Fort Aguada & Coastal Exploration",
            subtitle: "History, scenic views and famous North Goa beaches",
            area: "North Goa",
            icon: Landmark,
            estimatedCost: "₹2,300",

            activities: [
                {
                    time: "9:00 AM",
                    title: "Breakfast & Start Early",
                    description:
                        "Have breakfast and leave early to comfortably cover the day's places.",
                    icon: Utensils,
                    duration: "1 hr",
                },
                {
                    time: "10:30 AM",
                    title: "Visit Fort Aguada",
                    description:
                        "Explore the historic Portuguese fort and enjoy panoramic sea views.",
                    icon: Landmark,
                    duration: "1-2 hrs",
                },
                {
                    time: "1:00 PM",
                    title: "Candolim Area",
                    description:
                        "Explore the nearby coastal area and have lunch.",
                    icon: Palmtree,
                    duration: "2 hrs",
                },
                {
                    time: "4:00 PM",
                    title: "Coastal Drive & Sunset",
                    description:
                        "Take a scenic ride through North Goa and enjoy the evening views.",
                    icon: Car,
                    duration: "2-3 hrs",
                },
            ],
        },

        {
            day: 3,
            title: "Dudhsagar Falls Adventure",
            subtitle: "A full-day nature and adventure experience",
            area: "South-East Goa",
            icon: Camera,
            estimatedCost: "₹3,200",

            activities: [
                {
                    time: "7:00 AM",
                    title: "Early Departure",
                    description:
                        "Leave early because Dudhsagar Falls requires most of the day.",
                    icon: Car,
                    duration: "2-3 hrs travel",
                },
                {
                    time: "10:00 AM",
                    title: "Dudhsagar Falls Experience",
                    description:
                        "Explore the famous waterfall and enjoy the surrounding natural scenery.",
                    icon: Camera,
                    duration: "4-5 hrs",
                },
                {
                    time: "3:00 PM",
                    title: "Lunch & Return Journey",
                    description:
                        "Have lunch and begin your return towards your stay.",
                    icon: Utensils,
                    duration: "1 hr",
                },
                {
                    time: "7:00 PM",
                    title: "Relaxing Evening",
                    description:
                        "Keep the evening relaxed after a long day of travel and exploration.",
                    icon: Palmtree,
                    duration: "Flexible",
                },
            ],
        },

        {
            day: 4,
            title: "Anjuna Beach & Departure",
            subtitle: "A relaxed final day before leaving Goa",
            area: "North Goa",
            icon: Palmtree,
            estimatedCost: "₹3,300",

            activities: [
                {
                    time: "9:00 AM",
                    title: "Breakfast & Check-out",
                    description:
                        "Pack your luggage and check out, or leave it safely at your stay.",
                    icon: Utensils,
                    duration: "1-2 hrs",
                },
                {
                    time: "11:00 AM",
                    title: "Explore Anjuna Beach",
                    description:
                        "Enjoy the beach, scenic views and relaxed atmosphere.",
                    icon: Palmtree,
                    duration: "2-3 hrs",
                },
                {
                    time: "2:00 PM",
                    title: "Lunch & Last-minute Exploration",
                    description:
                        "Have lunch and spend some free time shopping or exploring nearby areas.",
                    icon: Utensils,
                    duration: "2 hrs",
                },
                {
                    time: "5:00 PM",
                    title: "Departure",
                    description:
                        "Collect your luggage and begin your journey back.",
                    icon: Car,
                    duration: "Depends on travel",
                },
            ],
        },
    ];

    // ==========================================
    // CURRENT SELECTED DAY DATA
    // ==========================================
    const currentDay =
        itineraryDays.find(
            (item) => item.day === selectedDay
        ) || itineraryDays[0];

    return (
        <div className="flex min-h-screen bg-slate-50">

            {/* ==============================
                SIDEBAR
            ============================== */}
            <Sidebar />

            {/* ==============================
                MAIN CONTENT
            ============================== */}
            <main className="min-w-0 flex-1">

                <Header />

                <section className="p-4 md:p-6 lg:p-8">

                    {/* ==============================
                        PAGE HEADER
                    ============================== */}
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

                        <div>
                            <div className="flex items-center gap-2">

                                <CalendarDays
                                    size={24}
                                    className="text-blue-600"
                                />

                                <h1 className="text-2xl font-bold text-slate-800 md:text-3xl">
                                    Your Goa Itinerary
                                </h1>
                            </div>

                            <p className="mt-2 text-sm text-slate-500">
                                Your complete {tripDetails.duration.toLowerCase()} trip plan,
                                based on the recommendations from your Trip Dashboard.
                            </p>
                        </div>

                        {/* Trip Summary */}
                        <div className="flex flex-wrap gap-2">

                            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                                <p className="text-[10px] text-slate-500">
                                    Duration
                                </p>

                                <p className="text-sm font-semibold text-slate-800">
                                    {tripDetails.duration}
                                </p>
                            </div>

                            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                                <p className="text-[10px] text-slate-500">
                                    Style
                                </p>

                                <p className="text-sm font-semibold text-slate-800">
                                    {tripDetails.travelStyle}
                                </p>
                            </div>

                            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                                <p className="text-[10px] text-slate-500">
                                    Budget
                                </p>

                                <p className="text-sm font-semibold text-green-600">
                                    {tripDetails.budget}
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* ==============================
                        DAY SELECTOR
                    ============================== */}
                    <div className="mt-6 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">

                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">

                            {itineraryDays.map((item) => {

                                const Icon = item.icon;

                                const isSelected =
                                    selectedDay === item.day;

                                return (
                                    <button
                                        key={item.day}
                                        onClick={() =>
                                            setSelectedDay(item.day)
                                        }
                                        className={`flex items-center gap-3 rounded-lg p-3 text-left transition ${
                                            isSelected
                                                ? "bg-blue-600 text-white shadow-sm"
                                                : "hover:bg-slate-50 text-slate-700"
                                        }`}
                                    >
                                        <div
                                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                                                isSelected
                                                    ? "bg-white/20"
                                                    : "bg-blue-50 text-blue-600"
                                            }`}
                                        >
                                            <Icon size={18} />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-xs font-semibold">
                                                Day {item.day}
                                            </p>

                                            <p
                                                className={`truncate text-[11px] ${
                                                    isSelected
                                                        ? "text-blue-100"
                                                        : "text-slate-500"
                                                }`}
                                            >
                                                {item.area}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}

                        </div>
                    </div>

                    {/* ==============================
                        SELECTED DAY HERO
                    ============================== */}
                    <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-5">

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                            <div>
                                <div className="flex items-center gap-2">

                                    <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                                        Day {currentDay.day}
                                    </span>

                                    <span className="text-xs text-slate-500">
                                        {currentDay.area}
                                    </span>
                                </div>

                                <h2 className="mt-3 text-xl font-bold text-slate-800">
                                    {currentDay.title}
                                </h2>

                                <p className="mt-1 text-sm text-slate-600">
                                    {currentDay.subtitle}
                                </p>
                            </div>

                            <div className="rounded-lg bg-white px-4 py-3">

                                <div className="flex items-center gap-2">
                                    <IndianRupee
                                        size={17}
                                        className="text-green-600"
                                    />

                                    <div>
                                        <p className="text-[10px] text-slate-500">
                                            Estimated Day Cost
                                        </p>

                                        <p className="text-sm font-bold text-slate-800">
                                            {currentDay.estimatedCost}
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* ==============================
                        DAY TIMELINE
                    ============================== */}
                    <div className="mt-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                        <div className="flex items-center justify-between gap-4">

                            <div>
                                <h2 className="text-lg font-bold text-slate-800">
                                    Day {currentDay.day} Schedule
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    A suggested schedule to help you make the most of your day.
                                </p>
                            </div>

                            <Sparkles
                                size={22}
                                className="shrink-0 text-blue-600"
                            />
                        </div>

                        {/* Activities */}
                        <div className="mt-6">

                            {currentDay.activities.map(
                                (activity, index) => {

                                    const ActivityIcon =
                                        activity.icon;

                                    const isLast =
                                        index ===
                                        currentDay.activities.length - 1;

                                    return (
                                        <div
                                            key={activity.title}
                                            className="flex gap-4"
                                        >

                                            {/* Timeline */}
                                            <div className="flex flex-col items-center">

                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                                    <ActivityIcon size={18} />
                                                </div>

                                                {!isLast && (
                                                    <div className="h-full min-h-10 w-px bg-slate-200" />
                                                )}
                                            </div>

                                            {/* Activity */}
                                            <div
                                                className={`flex-1 pb-6 ${
                                                    isLast
                                                        ? "pb-0"
                                                        : ""
                                                }`}
                                            >

                                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                                                    <div>
                                                        <div className="flex items-center gap-2">

                                                            <Clock
                                                                size={14}
                                                                className="text-slate-400"
                                                            />

                                                            <span className="text-xs font-semibold text-blue-600">
                                                                {activity.time}
                                                            </span>
                                                        </div>

                                                        <h3 className="mt-2 font-semibold text-slate-800">
                                                            {activity.title}
                                                        </h3>
                                                    </div>

                                                    <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
                                                        {activity.duration}
                                                    </span>
                                                </div>

                                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                                    {activity.description}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                }
                            )}

                        </div>
                    </div>

                    {/* ==============================
                        ALL DAYS OVERVIEW
                    ============================== */}
                    <div className="mt-5">

                        <h2 className="text-lg font-bold text-slate-800">
                            Complete Trip Overview
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            See how your 4 days in Goa are planned.
                        </p>

                        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">

                            {itineraryDays.map((item) => {

                                const Icon = item.icon;

                                const isSelected =
                                    selectedDay === item.day;

                                return (
                                    <button
                                        key={item.day}
                                        onClick={() =>
                                            setSelectedDay(item.day)
                                        }
                                        className={`rounded-xl border bg-white p-5 text-left shadow-sm transition ${
                                            isSelected
                                                ? "border-blue-500 ring-2 ring-blue-100"
                                                : "border-slate-200 hover:border-blue-300"
                                        }`}
                                    >

                                        <div className="flex items-start justify-between gap-4">

                                            <div className="flex items-center gap-3">

                                                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                                    <Icon size={21} />
                                                </div>

                                                <div>
                                                    <p className="text-xs font-semibold text-blue-600">
                                                        Day {item.day}
                                                    </p>

                                                    <h3 className="mt-1 font-bold text-slate-800">
                                                        {item.title}
                                                    </h3>
                                                </div>
                                            </div>

                                            <CheckCircle2
                                                size={18}
                                                className={
                                                    isSelected
                                                        ? "text-blue-600"
                                                        : "text-slate-300"
                                                }
                                            />
                                        </div>

                                        <p className="mt-4 text-sm text-slate-500">
                                            {item.subtitle}
                                        </p>

                                        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">

                                            <span className="text-xs text-slate-500">
                                                {item.activities.length} activities
                                            </span>

                                            <span className="text-sm font-semibold text-slate-800">
                                                {item.estimatedCost}
                                            </span>
                                        </div>

                                    </button>
                                );
                            })}

                        </div>
                    </div>

                    {/* ==============================
                        TRIP NOTE
                    ============================== */}
                    <div className="mt-5 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">

                        <Sparkles
                            size={19}
                            className="mt-0.5 shrink-0 text-amber-600"
                        />

                        <div>
                            <h3 className="text-sm font-semibold text-amber-900">
                                Your itinerary is flexible
                            </h3>

                            <p className="mt-1 text-sm leading-6 text-amber-800">
                                This plan is based on your Recommended travel style,
                                4-day duration and estimated ₹11,000 per-person budget.
                                You can later customize places, activities and timing
                                according to your actual travel dates.
                            </p>
                        </div>
                    </div>

                </section>
            </main>
        </div>
    );
}