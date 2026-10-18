"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    MapPin,
    Plane,
    Sparkles,
    Users,
    Wallet,
} from "lucide-react";
import LoginModal from "@/components/login-modal";
import { defaultTripDetails, tripDetailsStorageKey } from "@/lib/trip-details";

export default function Home() {
    const router = useRouter();
    const [tripDetails, setTripDetails] = useState(defaultTripDetails);
    const [activeTool, setActiveTool] = useState("Trip planner");
    const [loginOpen, setLoginOpen] = useState(false);

    const updateDetail = (key: keyof typeof tripDetails, value: string) => {
        setTripDetails((current) => ({ ...current, [key]: value }));
    };

    const handlePlanSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const nextTripDetails = {
            ...tripDetails,
            origin: tripDetails.origin.trim(),
            destination: tripDetails.destination.trim(),
        };

        if (!nextTripDetails.origin || !nextTripDetails.destination) {
            return;
        }

        window.localStorage.setItem(tripDetailsStorageKey, JSON.stringify(nextTripDetails));
        router.push("/dashboard#trip-options");
    };

    return (
        <main className="min-h-screen overflow-hidden bg-white text-slate-900">
            <section className="bg-[#05203c] text-white">
                <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
                    <Link href="/" className="flex items-center gap-3" aria-label="Pilgora home">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500 shadow-lg shadow-blue-500/30"><Plane size={22} className="rotate-[-25deg]" /></span>
                        <span><span className="block text-xl font-bold tracking-tight">Pilgora</span><span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-200">Travel smarter</span></span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <a href="#what-you-get" className="hidden text-sm font-semibold text-blue-100 hover:text-white sm:block">How it works</a>
                        <button type="button" onClick={() => setLoginOpen(true)} className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-[#05203c] hover:bg-blue-50">Log in</button>
                    </div>
                </nav>

                <div className="mx-auto max-w-7xl px-5 pb-12 pt-7 sm:px-8 lg:px-10 lg:pb-16">
                    <div className="flex flex-wrap gap-2">
                        {["Trip planner", "Stays", "Transport"].map((tool) => <button key={tool} type="button" onClick={() => setActiveTool(tool)} aria-pressed={activeTool === tool} className={`rounded-full border px-4 py-2 text-sm font-bold transition ${activeTool === tool ? "border-blue-500 bg-blue-600 text-white" : "border-white/45 text-white hover:bg-white/10"}`}>{tool}</button>)}
                    </div>
                    <h1 className="mt-7 text-4xl font-bold tracking-[-0.04em] sm:text-5xl">Plan a better trip. <span className="text-blue-300">One simple start.</span></h1>
                    <p className="mt-3 text-base text-blue-100">Set your route and travel preferences—Pilgora organizes the details in one place.</p>

                    <form onSubmit={handlePlanSubmit} className="mt-8">
                        <div className="grid overflow-hidden rounded-2xl bg-white shadow-2xl shadow-slate-950/30 sm:grid-cols-2 lg:grid-cols-[1.15fr_1.15fr_.85fr_.95fr_1fr_.85fr_1fr] lg:items-stretch">
                            <label className="border-b border-slate-200 p-4 text-sm font-semibold text-slate-600 lg:border-b-0 lg:border-r">From<input required value={tripDetails.origin} onChange={(event) => updateDetail("origin", event.target.value)} className="mt-1 w-full bg-transparent text-base font-medium text-slate-900 outline-none" placeholder="City or airport" /></label>
                            <label className="border-b border-slate-200 p-4 text-sm font-semibold text-slate-600 lg:border-b-0 lg:border-r">To<input required value={tripDetails.destination} onChange={(event) => updateDetail("destination", event.target.value)} className="mt-1 w-full bg-transparent text-base font-medium text-slate-900 outline-none" placeholder="City or destination" /></label>
                            <label className="border-b border-slate-200 p-4 text-sm font-semibold text-slate-600 lg:border-b-0 lg:border-r"><span className="flex items-center gap-1"><CalendarDays size={14} />Duration</span><select value={tripDetails.duration} onChange={(event) => updateDetail("duration", event.target.value)} className="mt-1 w-full bg-transparent text-base font-medium text-slate-900 outline-none"><option>2 Days</option><option>3 Days</option><option>4 Days</option><option>5 Days</option><option>7 Days</option></select></label>
                            <label className="border-b border-slate-200 p-4 text-sm font-semibold text-slate-600 lg:border-b-0 lg:border-r"><span className="flex items-center gap-1"><Users size={14} />Travellers</span><select value={tripDetails.travellers} onChange={(event) => updateDetail("travellers", event.target.value)} className="mt-1 w-full bg-transparent text-base font-medium text-slate-900 outline-none"><option>1 Adult</option><option>2 Adults</option><option>3 Adults</option><option>4 Adults</option><option>Family</option><option>Friends</option></select></label>
                            <label className="border-b border-slate-200 p-4 text-sm font-semibold text-slate-600 lg:border-b-0 lg:border-r"><span className="flex items-center gap-1"><Wallet size={14} />Budget</span><select value={tripDetails.budget} onChange={(event) => updateDetail("budget", event.target.value)} className="mt-1 w-full bg-transparent text-base font-medium text-slate-900 outline-none"><option>Budget</option><option>Moderate Budget</option><option>Comfortable Budget</option><option>Luxury Budget</option></select></label>
                            <label className="border-b border-slate-200 p-4 text-sm font-semibold text-slate-600 sm:border-b-0 lg:border-r"><span className="flex items-center gap-1"><Sparkles size={14} />Style</span><select value={tripDetails.tripType} onChange={(event) => updateDetail("tripType", event.target.value)} className="mt-1 w-full bg-transparent text-base font-medium text-slate-900 outline-none"><option>Solo</option><option>Couple</option><option>Family</option><option>Friends</option></select></label>
                            <button type="submit" className="m-2 flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-4 text-sm font-bold text-white transition hover:bg-blue-700">Build plan <ArrowRight size={17} /></button>
                        </div>
                        <p className="mt-3 flex items-center gap-2 text-sm text-blue-100"><CheckCircle2 size={15} className="text-blue-300" /> Your preferences are saved to your trip workspace. Goa is the current destination-data demo.</p>
                    </form>
                </div>
            </section>

            <section className="bg-white px-5 py-10 text-slate-900 sm:px-8 lg:px-10">
                <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Link href="/dashboard#trip-options" className="flex items-center gap-3 rounded-2xl bg-[#05203c] p-5 text-sm font-bold text-white shadow-lg shadow-slate-200 transition hover:-translate-y-0.5"><Sparkles size={21} className="text-blue-300" />Build my trip</Link>
                    <Link href="/stay" className="flex items-center gap-3 rounded-2xl bg-[#05203c] p-5 text-sm font-bold text-white shadow-lg shadow-slate-200 transition hover:-translate-y-0.5"><MapPin size={21} className="text-blue-300" />Compare stays</Link>
                    <Link href="/transport" className="flex items-center gap-3 rounded-2xl bg-[#05203c] p-5 text-sm font-bold text-white shadow-lg shadow-slate-200 transition hover:-translate-y-0.5"><Plane size={21} className="text-blue-300" />Explore transport</Link>
                    <Link href="/places" className="flex items-center gap-3 rounded-2xl bg-[#05203c] p-5 text-sm font-bold text-white shadow-lg shadow-slate-200 transition hover:-translate-y-0.5"><MapPin size={21} className="text-blue-300" />Explore places</Link>
                </div>
            </section>

            <section className="bg-white px-5 py-20 text-slate-900 sm:px-8 lg:px-10">
                <div className="mx-auto max-w-7xl">
                    <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.14em] text-blue-600">More than a destination list</p>
                            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Every decision for your trip, in one calm workspace.</h2>
                        </div>
                        <p className="max-w-2xl text-base leading-7 text-slate-600">Pilgora turns scattered research into practical next steps—what to do, where to stay, how to get around, and what your choices mean for the budget.</p>
                    </div>

                    <div className="mt-10 grid gap-4 md:grid-cols-3">
                        <article className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700"><CalendarDays size={21} /></span>
                            <h3 className="mt-5 text-lg font-bold">A day that flows</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-600">See your trip day by day, with enough structure to make planning feel easy.</p>
                        </article>
                        <article className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700"><Wallet size={21} /></span>
                            <h3 className="mt-5 text-lg font-bold">A budget you understand</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-600">Compare travel styles, understand costs, and find ways to spend smarter.</p>
                        </article>
                        <article className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700"><Sparkles size={21} /></span>
                            <h3 className="mt-5 text-lg font-bold">Recommendations with context</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-600">Choose stays, transport and places based on the kind of trip you want.</p>
                        </article>
                    </div>
                </div>
            </section>

            <section className="bg-slate-100 px-5 py-16 text-slate-900 sm:px-8 lg:px-10">
                <div className="mx-auto flex max-w-7xl flex-col gap-6 rounded-3xl bg-slate-900 px-6 py-8 text-white shadow-2xl sm:px-10 sm:py-10 lg:flex-row lg:items-center lg:justify-between">
                    <div><p className="text-sm font-semibold text-blue-300">READY WHEN YOU ARE</p><h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Your next great trip starts with a few simple choices.</h2><p className="mt-2 text-sm leading-6 text-slate-300">Set your travel preferences above, then explore the plan Pilgora builds around them.</p></div>
                    <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-3 text-sm font-bold text-white hover:bg-blue-400">Plan my trip <ArrowRight size={17} /></button>
                </div>
            </section>

            <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
        </main>
    );
}
