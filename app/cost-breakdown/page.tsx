import Sidebar from "@/components/sidebar";
import Header from "@/components/header";

import {
    CircleDollarSign,
    Bed,
    Utensils,
    Car,
    Ticket,
    ShoppingBag,
    Lightbulb,
    CheckCircle2,
} from "lucide-react";

export default function CostBreakdownPage() {
    const costItems = [
        {
            name: "Stay",
            amount: "₹4,000",
            percentage: "36%",
            icon: Bed,
            description: "Accommodation for your Goa trip",
        },
        {
            name: "Food",
            amount: "₹2,000",
            percentage: "18%",
            icon: Utensils,
            description: "Meals, cafes and local food",
        },
        {
            name: "Local Transport",
            amount: "₹1,000",
            percentage: "9%",
            icon: Car,
            description: "Bike, taxi and local travel",
        },
        {
            name: "Activities",
            amount: "₹1,500",
            percentage: "14%",
            icon: Ticket,
            description: "Water activities and experiences",
        },
        {
            name: "Miscellaneous",
            amount: "₹500",
            percentage: "5%",
            icon: ShoppingBag,
            description: "Small personal expenses",
        },
    ];

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />

            <main className="min-w-0 flex-1">
                <Header />

                <section className="p-4 md:p-6 lg:p-8">

                    {/* PAGE HEADER */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-green-100 p-3">
                                <CircleDollarSign
                                    size={24}
                                    className="text-green-600"
                                />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-slate-800">
                                    Cost Breakdown
                                </h1>

                                <p className="mt-1 text-sm text-slate-500">
                                    Understand exactly where your Goa trip budget is being spent.
                                </p>
                            </div>
                        </div>

                        <div className="rounded-xl border border-green-200 bg-green-50 px-5 py-3">
                            <p className="text-xs text-slate-500">
                                Estimated Total
                            </p>

                            <p className="mt-1 text-2xl font-bold text-green-600">
                                ₹11,000
                            </p>

                            <p className="text-xs text-slate-500">
                                Per person • 4 Days
                            </p>
                        </div>
                    </div>

                    {/* SUMMARY */}
                    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">

                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                            <p className="text-xs text-slate-500">
                                Travel Style
                            </p>

                            <p className="mt-2 text-lg font-bold text-slate-800">
                                Recommended
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                                Best balance of experience and budget
                            </p>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                            <p className="text-xs text-slate-500">
                                Trip Duration
                            </p>

                            <p className="mt-2 text-lg font-bold text-slate-800">
                                4 Days
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                                Recommended Goa trip duration
                            </p>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                            <p className="text-xs text-slate-500">
                                Average Per Day
                            </p>

                            <p className="mt-2 text-lg font-bold text-slate-800">
                                ₹2,750
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                                Approximate daily budget
                            </p>
                        </div>
                    </div>

                    {/* MAIN CONTENT */}
                    <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">

                        {/* COST LIST */}
                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">

                            <h2 className="text-lg font-bold text-slate-800">
                                Where Your Money Goes
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Estimated spending across major categories.
                            </p>

                            <div className="mt-5 space-y-3">

                                {costItems.map((item) => {
                                    const Icon = item.icon;

                                    return (
                                        <div
                                            key={item.name}
                                            className="rounded-xl border border-slate-100 p-4"
                                        >
                                            <div className="flex items-center gap-4">

                                                <div className="rounded-lg bg-slate-100 p-3">
                                                    <Icon
                                                        size={20}
                                                        className="text-slate-600"
                                                    />
                                                </div>

                                                <div className="min-w-0 flex-1">

                                                    <div className="flex items-start justify-between gap-4">

                                                        <div>
                                                            <h3 className="font-semibold text-slate-800">
                                                                {item.name}
                                                            </h3>

                                                            <p className="mt-1 text-xs text-slate-500">
                                                                {item.description}
                                                            </p>
                                                        </div>

                                                        <div className="text-right">
                                                            <p className="font-bold text-slate-800">
                                                                {item.amount}
                                                            </p>

                                                            <p className="text-xs text-slate-500">
                                                                {item.percentage}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                                                        <div
                                                            className="h-full rounded-full bg-blue-600"
                                                            style={{
                                                                width: item.percentage,
                                                            }}
                                                        />
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* RIGHT SIDE */}
                        <div className="space-y-5">

                            <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">

                                <div className="flex items-center gap-2">
                                    <Lightbulb
                                        size={20}
                                        className="text-blue-600"
                                    />

                                    <h2 className="font-bold text-slate-800">
                                        Smart Budget Tips
                                    </h2>
                                </div>

                                <div className="mt-4 space-y-4 text-sm">

                                    <div>
                                        <p className="font-semibold text-slate-700">
                                            Save on Stay
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                            Stay slightly away from the busiest
                                            beach areas for better prices.
                                        </p>
                                    </div>

                                    <div>
                                        <p className="font-semibold text-slate-700">
                                            Rent a Bike
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                            A bike can be more affordable for
                                            exploring nearby places.
                                        </p>
                                    </div>

                                    <div>
                                        <p className="font-semibold text-slate-700">
                                            Plan Activities
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                            Compare activities before booking
                                            to find better prices.
                                        </p>
                                    </div>

                                </div>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                                <h2 className="font-bold text-slate-800">
                                    Included in Estimate
                                </h2>

                                <div className="mt-4 space-y-3">

                                    {[
                                        "Accommodation",
                                        "Daily food budget",
                                        "Local transportation",
                                        "Popular activities",
                                        "Basic miscellaneous expenses",
                                    ].map((item) => (
                                        <div
                                            key={item}
                                            className="flex items-center gap-2"
                                        >
                                            <CheckCircle2
                                                size={16}
                                                className="text-green-600"
                                            />

                                            <span className="text-xs text-slate-600">
                                                {item}
                                            </span>
                                        </div>
                                    ))}

                                </div>
                            </div>

                        </div>
                    </div>

                    {/* TOTAL */}
                    <div className="mt-6 rounded-2xl bg-slate-800 p-6 text-white">

                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                            <div>
                                <p className="text-sm text-slate-300">
                                    Recommended Goa Trip Budget
                                </p>

                                <h2 className="mt-2 text-3xl font-bold">
                                    ₹11,000
                                </h2>

                                <p className="mt-1 text-sm text-slate-300">
                                    Per person for a 4-day trip
                                </p>
                            </div>

                            <div className="flex gap-8">

                                <div>
                                    <p className="text-xs text-slate-400">
                                        Per Day
                                    </p>

                                    <p className="mt-1 text-lg font-bold">
                                        ₹2,750
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-slate-400">
                                        Style
                                    </p>

                                    <p className="mt-1 text-lg font-bold">
                                        Recommended
                                    </p>
                                </div>

                            </div>
                        </div>
                    </div>

                </section>
            </main>
        </div>
    );
}