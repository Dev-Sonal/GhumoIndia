import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import {
    Lightbulb,
    Hotel,
    Utensils,
    Car,
    CalendarDays,
    Ticket,
    ShoppingBag,
    CheckCircle2,
    IndianRupee,
} from "lucide-react";

export default function WaysToSavePage() {
    const savingTips = [
        {
            title: "Travel During the Off-Season",
            description:
                "Visit Goa during Jun - Sep for lower stay and travel prices. Compare the weather before booking.",
            potentialSaving: "Save up to ₹3,000",
            icon: CalendarDays,
        },
        {
            title: "Choose Budget-Friendly Stay Areas",
            description:
                "Stay slightly away from expensive beachfront areas and use local transport to reach major attractions.",
            potentialSaving: "Save up to ₹2,000",
            icon: Hotel,
        },
        {
            title: "Rent a Bike for Local Travel",
            description:
                "A bike can be more affordable than repeatedly booking taxis for nearby beaches and attractions.",
            potentialSaving: "Save up to ₹1,500",
            icon: Car,
        },
        {
            title: "Eat at Local Restaurants",
            description:
                "Try local Goan restaurants and smaller cafes instead of relying on expensive tourist-focused restaurants.",
            potentialSaving: "Save up to ₹1,000",
            icon: Utensils,
        },
        {
            title: "Book Activities in Advance",
            description:
                "Compare activity prices before your trip and look for package deals when booking multiple experiences.",
            potentialSaving: "Save up to ₹1,000",
            icon: Ticket,
        },
        {
            title: "Avoid Unnecessary Shopping",
            description:
                "Set a shopping budget before visiting markets so souvenirs and impulse purchases do not increase your total cost.",
            potentialSaving: "Depends on spending",
            icon: ShoppingBag,
        },
    ];

    const quickTips = [
        "Compare travel and stay prices before booking.",
        "Avoid travelling during peak holiday dates if your schedule is flexible.",
        "Share taxis and rental costs when travelling with friends.",
        "Keep a small emergency budget instead of overspending on the main plan.",
        "Choose free beaches, viewpoints and heritage places along with paid activities.",
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

                                <div className="rounded-xl bg-yellow-100 p-3">
                                    <Lightbulb
                                        size={24}
                                        className="text-yellow-600"
                                    />
                                </div>

                                <div>
                                    <h1 className="text-2xl font-bold text-slate-800">
                                        Ways to Save Money
                                    </h1>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Smart choices can help you enjoy Goa
                                        without increasing your trip budget.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* SAVINGS ESTIMATE */}
                        <div className="rounded-xl border border-green-200 bg-green-50 px-5 py-4">

                            <div className="flex items-center gap-2">
                                <IndianRupee
                                    size={18}
                                    className="text-green-600"
                                />

                                <p className="text-xs font-medium text-green-700">
                                    Possible Savings
                                </p>
                            </div>

                            <p className="mt-1 text-xl font-bold text-green-700">
                                Up to ₹8,500
                            </p>

                            <p className="text-xs text-green-600">
                                Depending on your choices
                            </p>
                        </div>
                    </div>

                    {/* MAIN SAVING TIPS */}
                    <div className="mt-8">

                        <h2 className="text-lg font-bold text-slate-800">
                            Smart Ways to Reduce Your Trip Cost
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Select the options that best fit your travel style.
                        </p>

                        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

                            {savingTips.map((tip) => {
                                const Icon = tip.icon;

                                return (
                                    <div
                                        key={tip.title}
                                        className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                                    >

                                        <div className="flex items-start justify-between gap-4">

                                            <div className="rounded-lg bg-blue-50 p-3">
                                                <Icon
                                                    size={22}
                                                    className="text-blue-600"
                                                />
                                            </div>

                                            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                                                {tip.potentialSaving}
                                            </span>
                                        </div>

                                        <h3 className="mt-5 text-base font-bold text-slate-800">
                                            {tip.title}
                                        </h3>

                                        <p className="mt-2 text-sm leading-6 text-slate-500">
                                            {tip.description}
                                        </p>

                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* QUICK MONEY SAVING CHECKLIST */}
                    <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">

                        <div className="flex items-center gap-2">

                            <CheckCircle2
                                size={21}
                                className="text-green-600"
                            />

                            <h2 className="text-lg font-bold text-slate-800">
                                Quick Saving Checklist
                            </h2>
                        </div>

                        <p className="mt-2 text-sm text-slate-500">
                            Keep these points in mind while planning and booking
                            your Goa trip.
                        </p>

                        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">

                            {quickTips.map((tip) => (
                                <div
                                    key={tip}
                                    className="flex items-start gap-3 rounded-lg bg-slate-50 p-4"
                                >
                                    <CheckCircle2
                                        size={18}
                                        className="mt-0.5 shrink-0 text-green-600"
                                    />

                                    <p className="text-sm leading-6 text-slate-600">
                                        {tip}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RECOMMENDED PLAN */}
                    <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-5 md:p-6">

                        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                            <div>

                                <div className="flex items-center gap-2">

                                    <Lightbulb
                                        size={22}
                                        className="text-blue-600"
                                    />

                                    <h2 className="text-lg font-bold text-slate-800">
                                        Recommended for Your Goa Trip
                                    </h2>
                                </div>

                                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                                    For your recommended 4-day Goa trip, you can
                                    reduce costs by choosing value stays, renting
                                    local transport and balancing paid activities
                                    with free beaches and sightseeing.
                                </p>
                            </div>

                            <div className="shrink-0 rounded-lg bg-white px-5 py-4 text-center shadow-sm">

                                <p className="text-xs text-slate-500">
                                    Current Estimated Budget
                                </p>

                                <p className="mt-1 text-xl font-bold text-slate-800">
                                    ₹11,000
                                </p>

                                <p className="text-xs text-slate-500">
                                    Per person
                                </p>
                            </div>
                        </div>
                    </div>

                </section>
            </main>

        </div>
    );
}