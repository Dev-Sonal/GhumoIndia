"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { defaultTripDetails, getTripDetails, isTripDetails, saveTripDetails as persistTripDetails, tripDetailsStorageKey } from "@/lib/trip-details";
import LocationAutocomplete from "@/components/location-autocomplete";
import {
    ChevronDown,
    Edit3,
    Heart,
    MapPin,
    Menu,
    Share2,
    Users,
    Wallet,
    X,
} from "lucide-react";

type HeaderProps = {
    onMenuClick?: () => void;
};

export default function Header({ onMenuClick }: HeaderProps) {
    const [isSaved, setIsSaved] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [shareStatus, setShareStatus] = useState("");
    const [tripDetails, setTripDetails] = useState(defaultTripDetails);
    const [draftTripDetails, setDraftTripDetails] = useState(defaultTripDetails);
    const [tripEditorOpen, setTripEditorOpen] = useState(false);

    useEffect(() => {
        const loadStoredTrip = () => {
            try {
                const saved = getTripDetails();
                setTripDetails(saved);
                setDraftTripDetails(saved);
            } catch {
                // Keep the default trip details if storage cannot be read.
            }
        };

        const initialLoad = window.setTimeout(loadStoredTrip, 0);
        const handleUpdated = () => loadStoredTrip();
        const handleStorage = (event: StorageEvent) => {
            if (event.key === tripDetailsStorageKey) loadStoredTrip();
        };

        window.addEventListener("pilgora-trip-details-updated", handleUpdated);
        window.addEventListener("storage", handleStorage);
        window.addEventListener("focus", handleUpdated);

        return () => {
            window.clearTimeout(initialLoad);
            window.removeEventListener("pilgora-trip-details-updated", handleUpdated);
            window.removeEventListener("storage", handleStorage);
            window.removeEventListener("focus", handleUpdated);
        };
    }, []);

    const openTripEditor = () => {
        setDraftTripDetails(tripDetails);
        setTripEditorOpen(true);
    };

    const saveTripDetails = () => {
        const nextTripDetails = {
            ...draftTripDetails,
            origin: draftTripDetails.origin.trim(),
            destination: draftTripDetails.destination.trim(),
        };

        if (!nextTripDetails.origin || !nextTripDetails.destination) {
            setShareStatus("Add both an origin and destination to update your trip.");
            return;
        }

        try {
            persistTripDetails(nextTripDetails);
            setTripDetails(nextTripDetails);
            setDraftTripDetails(nextTripDetails);
            window.dispatchEvent(new Event("pilgora-trip-details-updated"));
            setTripEditorOpen(false);
            setShareStatus("Trip details saved on this device.");
        } catch {
            setShareStatus("Could not save trip details. Please try again.");
        }
    };

    const handleShare = async () => {
        const shareData = {
            title: "Pilgora trip plan",
            text: `Take a look at my ${tripDetails.origin} to ${tripDetails.destination} trip plan.`,
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                setShareStatus("Trip link shared.");
                return;
            }

            if (navigator.clipboard) {
                await navigator.clipboard.writeText(shareData.url);
                setShareStatus("Trip link copied.");
                return;
            }

            setShareStatus("Copy this trip URL from your browser.");
        } catch (error) {
            if (error instanceof DOMException && error.name === "AbortError") {
                return;
            }

            setShareStatus("Sharing is unavailable in this browser.");
        }
    };

    return (
        <>
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
            <div className="flex min-h-[72px] items-center justify-between gap-3 px-3 sm:min-h-[76px] sm:px-4 md:px-6 lg:min-h-[82px] lg:px-8">
                <div className="flex min-w-0 items-center gap-3">
                    <button
                        type="button"
                        onClick={onMenuClick}
                        aria-label="Open navigation"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 active:scale-95 lg:hidden"
                    >
                        <Menu size={21} />
                    </button>

                    <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600 shadow-sm sm:flex">
                        <MapPin size={21} />
                    </div>

                    <div className="min-w-0">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <h2 className="truncate text-base font-bold tracking-tight text-slate-800 sm:text-lg lg:text-xl">{tripDetails.origin}</h2>
                            <span className="text-slate-300" aria-hidden="true">→</span>
                            <h2 className="truncate text-base font-bold tracking-tight text-blue-600 sm:text-lg lg:text-xl">{tripDetails.destination}</h2>
                            <button
                                type="button"
                                onClick={openTripEditor}
                                className="ml-1 rounded-lg p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                                title="Edit trip choices"
                                aria-label="Edit trip choices"
                            >
                                <Edit3 size={15} />
                            </button>
                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-slate-500 sm:text-xs md:text-sm">
                            <span><span className="font-semibold text-slate-700">{tripDetails.duration}</span> Trip</span>
                            <span className="hidden text-slate-300 sm:inline" aria-hidden="true">•</span>
                            <span className="hidden items-center gap-1 sm:flex"><Users size={13} />{tripDetails.travellers}</span>
                            <span className="hidden text-slate-300 md:inline" aria-hidden="true">•</span>
                            <span className="hidden items-center gap-1 md:flex"><Wallet size={13} />{tripDetails.budget}</span>
                            <span className="hidden text-slate-300 lg:inline" aria-hidden="true">•</span>
                            <span className="hidden lg:inline">{tripDetails.tripType}</span>
                        </div>
                    </div>
                </div>

                <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 md:gap-3">
                    <button
                        type="button"
                        onClick={handleShare}
                        className="flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 text-sm font-medium text-slate-700 shadow-sm hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 active:scale-95 sm:h-10 sm:px-3 md:px-4"
                        aria-label="Share trip"
                    >
                        <Share2 size={15} />
                        <span className="hidden xl:inline">Share Trip</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsSaved((saved) => !saved)}
                        aria-pressed={isSaved}
                        className={`flex h-9 items-center justify-center gap-2 rounded-lg border px-2.5 text-sm font-medium shadow-sm active:scale-95 sm:h-10 sm:px-3 md:px-4 ${
                            isSaved
                                ? "border-rose-200 bg-rose-100 text-rose-700"
                                : "border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-100"
                        }`}
                        aria-label={isSaved ? "Remove trip from this session" : "Save trip for this session"}
                    >
                        <Heart size={15} fill={isSaved ? "currentColor" : "none"} />
                        <span className="hidden xl:inline">{isSaved ? "Saved" : "Save Trip"}</span>
                    </button>

                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setProfileOpen((open) => !open)}
                            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1 shadow-sm hover:border-slate-300 hover:bg-slate-50"
                            aria-label="Open account menu"
                            aria-expanded={profileOpen}
                            aria-controls="account-menu"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 text-[10px] font-bold text-white sm:h-9 sm:w-9 sm:text-xs">SD</div>
                            <div className="hidden text-left xl:block">
                                <p className="text-xs font-semibold text-slate-800">Sonal Dev</p>
                                <p className="text-[10px] text-slate-500">My Account</p>
                            </div>
                            <ChevronDown size={15} className={`mr-1 hidden text-slate-400 transition-transform xl:block ${profileOpen ? "rotate-180" : ""}`} />
                        </button>

                        {profileOpen && (
                            <div id="account-menu" className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
                                <Link href="/profile" onClick={() => setProfileOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Profile</Link>
                                <Link href="/my-trips" onClick={() => setProfileOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">My Trips</Link>
                                <Link href="/settings" onClick={() => setProfileOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Settings</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <p className="sr-only" role="status" aria-live="polite">{shareStatus}{isSaved ? " Trip saved for this session." : ""}</p>
        </header>

            {tripEditorOpen && (
                <div className="fixed inset-0 z-[70] flex items-end bg-slate-950/60 p-3 backdrop-blur-md sm:items-center sm:justify-center sm:p-6">
                    <button
                        type="button"
                        className="absolute inset-0 cursor-default"
                        aria-label="Close trip editor"
                        onClick={() => setTripEditorOpen(false)}
                    />

                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            saveTripDetails();
                        }}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="edit-trip-title"
                        className="animate-page-in relative z-10 max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/30 bg-white shadow-2xl"
                    >
                        <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-600 px-5 pb-6 pt-5 text-white sm:px-7 sm:pb-7 sm:pt-6">
                            <div className="absolute -right-12 -top-16 h-44 w-44 rounded-full bg-white/10" />
                            <div className="absolute -bottom-20 left-1/3 h-36 w-36 rounded-full bg-cyan-300/15" />
                            <div className="relative flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-100">Trip details</p>
                                    <h2 id="edit-trip-title" className="mt-1 text-2xl font-bold tracking-tight">Where are we going?</h2>
                                    <p className="mt-1 text-sm text-blue-100">Build the trip summary that feels right for you.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setTripEditorOpen(false)}
                                    className="rounded-xl border border-white/20 bg-white/10 p-2 text-white hover:bg-white/20"
                                    aria-label="Close trip editor"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="relative mt-5 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
                                <MapPin size={19} className="shrink-0 text-cyan-100" />
                                <div className="min-w-0 flex-1">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-100">Your route</p>
                                    <p className="truncate text-base font-bold">{draftTripDetails.origin || "Origin"} <span className="mx-1.5 text-blue-200">→</span> {draftTripDetails.destination || "Destination"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50/80 p-5 sm:p-7">
                            <div className="mb-4 flex items-center gap-2">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">1</span>
                                <p className="text-sm font-bold text-slate-800">Route & preferences</p>
                            </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="relative z-20 rounded-xl border border-slate-200 bg-white p-3 text-sm font-medium text-slate-700 shadow-sm">
                                <LocationAutocomplete
                                    label="From"
                                    value={draftTripDetails.origin}
                                    placeholder="e.g. Bengaluru"
                                    onChange={(value) => setDraftTripDetails((current) => ({ ...current, origin: value, originCoordinates: null }))}
                                    onSelect={({ coordinates }) => setDraftTripDetails((current) => ({ ...current, originCoordinates: coordinates }))}
                                    inputClassName="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    dropdownClassName="left-0 right-0 z-[100] mt-2"
                                />
                            </div>
                            <div className="relative z-10 rounded-xl border border-slate-200 bg-white p-3 text-sm font-medium text-slate-700 shadow-sm">
                                <LocationAutocomplete
                                    label="To"
                                    value={draftTripDetails.destination}
                                    placeholder="e.g. Goa"
                                    onChange={(value) => setDraftTripDetails((current) => ({ ...current, destination: value, destinationCoordinates: null }))}
                                    onSelect={({ coordinates }) => setDraftTripDetails((current) => ({ ...current, destinationCoordinates: coordinates }))}
                                    inputClassName="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    dropdownClassName="left-0 right-0 z-[100] mt-2"
                                />
                            </div>
                            <label className="rounded-xl border border-slate-200 bg-white p-3 text-sm font-medium text-slate-700 shadow-sm">
                                Duration
                                <select value={draftTripDetails.duration} onChange={(event) => setDraftTripDetails((current) => ({ ...current, duration: event.target.value }))} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                                    <option>2 Days</option><option>3 Days</option><option>4 Days</option><option>5 Days</option><option>7 Days</option>
                                </select>
                            </label>
                            <label className="rounded-xl border border-slate-200 bg-white p-3 text-sm font-medium text-slate-700 shadow-sm">
                                Travellers
                                <select value={draftTripDetails.travellers} onChange={(event) => setDraftTripDetails((current) => ({ ...current, travellers: event.target.value }))} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                                    <option>1 Adult</option><option>2 Adults</option><option>3 Adults</option><option>4 Adults</option><option>Family</option><option>Friends</option>
                                </select>
                            </label>
                            <label className="rounded-xl border border-slate-200 bg-white p-3 text-sm font-medium text-slate-700 shadow-sm">
                                Budget
                                <select value={draftTripDetails.budget} onChange={(event) => setDraftTripDetails((current) => ({ ...current, budget: event.target.value }))} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                                    <option>Budget</option><option>Moderate Budget</option><option>Comfortable Budget</option><option>Luxury Budget</option>
                                </select>
                            </label>
                            <label className="rounded-xl border border-slate-200 bg-white p-3 text-sm font-medium text-slate-700 shadow-sm">
                                Trip type
                                <select value={draftTripDetails.tripType} onChange={(event) => setDraftTripDetails((current) => ({ ...current, tripType: event.target.value }))} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                                    <option>Solo</option><option>Couple</option><option>Family</option><option>Friends</option>
                                </select>
                            </label>
                        </div>

                        <p className="mt-4 flex items-center gap-2 text-xs text-slate-500"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Saved only in this browser. Trip recommendations remain demonstration data.</p>

                        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
                            <button type="button" onClick={() => setTripEditorOpen(false)} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
                            <button type="submit" className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98]">Save trip details</button>
                        </div>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}
