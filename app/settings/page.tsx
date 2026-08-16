"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";

import {
    Bell,
    Globe,
    User,
    Shield,
    MapPin,
    Heart,
    Pencil,
    ChevronRight,
    Mail,
    Smartphone,
    Trash2,
    Check,
} from "lucide-react";

export default function SettingsPage() {
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [tripUpdates, setTripUpdates] = useState(true);
    const [priceAlerts, setPriceAlerts] = useState(true);
    const [travelTips, setTravelTips] = useState(false);

    const Toggle = ({
        enabled,
        onChange,
    }: {
        enabled: boolean;
        onChange: () => void;
    }) => {
        return (
            <button
                onClick={onChange}
                className={`relative h-6 w-11 rounded-full transition ${
                    enabled ? "bg-blue-600" : "bg-slate-300"
                }`}
                aria-label="Toggle setting"
            >
                <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                        enabled ? "left-6" : "left-1"
                    }`}
                />
            </button>
        );
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />

            <main className="min-w-0 flex-1">
                <Header />

                <section className="p-4 md:p-6 lg:p-8">
                    {/* PAGE HEADER */}
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            Settings
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Manage your GhumoIndia account, preferences and
                            notifications.
                        </p>
                    </div>

                    <div className="mt-6 max-w-5xl space-y-6">

                        {/* ACCOUNT SETTINGS */}
                        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-200 p-5">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-blue-50 p-2">
                                        <User
                                            size={20}
                                            className="text-blue-600"
                                        />
                                    </div>

                                    <div>
                                        <h2 className="font-bold text-slate-800">
                                            Account Settings
                                        </h2>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Manage your personal account
                                            information.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="divide-y divide-slate-100">
                                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full bg-blue-100 p-3 text-lg font-semibold text-blue-700">
                                            S
                                        </div>

                                        <div>
                                            <p className="font-semibold text-slate-800">
                                                Sonal Dev
                                            </p>

                                            <p className="text-sm text-slate-500">
                                                Personal profile
                                            </p>
                                        </div>
                                    </div>

                                    <button className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                                        <Pencil size={16} />
                                        Edit Profile
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-5">
                                    <div className="flex items-center gap-3">
                                        <Mail
                                            size={19}
                                            className="text-slate-500"
                                        />

                                        <div>
                                            <p className="font-medium text-slate-800">
                                                Email Address
                                            </p>

                                            <p className="mt-1 text-sm text-slate-500">
                                                sonal@example.com
                                            </p>
                                        </div>
                                    </div>

                                    <ChevronRight
                                        size={18}
                                        className="text-slate-400"
                                    />
                                </div>

                                <div className="flex items-center justify-between p-5">
                                    <div className="flex items-center gap-3">
                                        <Smartphone
                                            size={19}
                                            className="text-slate-500"
                                        />

                                        <div>
                                            <p className="font-medium text-slate-800">
                                                Phone Number
                                            </p>

                                            <p className="mt-1 text-sm text-slate-500">
                                                Add a phone number for trip
                                                updates
                                            </p>
                                        </div>
                                    </div>

                                    <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* TRAVEL PREFERENCES */}
                        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-200 p-5">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-green-50 p-2">
                                        <MapPin
                                            size={20}
                                            className="text-green-600"
                                        />
                                    </div>

                                    <div>
                                        <h2 className="font-bold text-slate-800">
                                            Travel Preferences
                                        </h2>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Help us create better trip
                                            recommendations for you.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="divide-y divide-slate-100">
                                <div className="flex items-center justify-between p-5">
                                    <div>
                                        <p className="font-medium text-slate-800">
                                            Default Budget Style
                                        </p>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Moderate budget
                                        </p>
                                    </div>

                                    <button className="flex items-center gap-2 text-sm font-medium text-blue-600">
                                        Moderate
                                        <ChevronRight size={16} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-5">
                                    <div>
                                        <p className="font-medium text-slate-800">
                                            Preferred Travel Style
                                        </p>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Balanced experience and comfort
                                        </p>
                                    </div>

                                    <button className="flex items-center gap-2 text-sm font-medium text-blue-600">
                                        Recommended
                                        <ChevronRight size={16} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-5">
                                    <div className="flex items-center gap-3">
                                        <Heart
                                            size={19}
                                            className="text-slate-500"
                                        />

                                        <div>
                                            <p className="font-medium text-slate-800">
                                                Saved Interests
                                            </p>

                                            <p className="mt-1 text-sm text-slate-500">
                                                Beaches, food, culture and
                                                scenic places
                                            </p>
                                        </div>
                                    </div>

                                    <ChevronRight
                                        size={18}
                                        className="text-slate-400"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* NOTIFICATIONS */}
                        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-200 p-5">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-orange-50 p-2">
                                        <Bell
                                            size={20}
                                            className="text-orange-500"
                                        />
                                    </div>

                                    <div>
                                        <h2 className="font-bold text-slate-800">
                                            Notifications
                                        </h2>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Choose what updates you want to
                                            receive.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="divide-y divide-slate-100">
                                <div className="flex items-center justify-between p-5">
                                    <div>
                                        <p className="font-medium text-slate-800">
                                            Email Notifications
                                        </p>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Receive important account and trip
                                            updates.
                                        </p>
                                    </div>

                                    <Toggle
                                        enabled={emailNotifications}
                                        onChange={() =>
                                            setEmailNotifications(
                                                !emailNotifications
                                            )
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between p-5">
                                    <div>
                                        <p className="font-medium text-slate-800">
                                            Trip Updates
                                        </p>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Get notified about changes to your
                                            saved trips.
                                        </p>
                                    </div>

                                    <Toggle
                                        enabled={tripUpdates}
                                        onChange={() =>
                                            setTripUpdates(!tripUpdates)
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between p-5">
                                    <div>
                                        <p className="font-medium text-slate-800">
                                            Price Alerts
                                        </p>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Get notified when travel prices
                                            change.
                                        </p>
                                    </div>

                                    <Toggle
                                        enabled={priceAlerts}
                                        onChange={() =>
                                            setPriceAlerts(!priceAlerts)
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between p-5">
                                    <div>
                                        <p className="font-medium text-slate-800">
                                            Travel Tips & Recommendations
                                        </p>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Receive useful travel ideas and
                                            destination recommendations.
                                        </p>
                                    </div>

                                    <Toggle
                                        enabled={travelTips}
                                        onChange={() =>
                                            setTravelTips(!travelTips)
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        {/* PRIVACY */}
                        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-200 p-5">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-purple-50 p-2">
                                        <Shield
                                            size={20}
                                            className="text-purple-600"
                                        />
                                    </div>

                                    <div>
                                        <h2 className="font-bold text-slate-800">
                                            Privacy & Security
                                        </h2>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Control your account security and
                                            privacy.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="divide-y divide-slate-100">
                                <button className="flex w-full items-center justify-between p-5 text-left transition hover:bg-slate-50">
                                    <div>
                                        <p className="font-medium text-slate-800">
                                            Change Password
                                        </p>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Update your account password.
                                        </p>
                                    </div>

                                    <ChevronRight
                                        size={18}
                                        className="text-slate-400"
                                    />
                                </button>

                                <button className="flex w-full items-center justify-between p-5 text-left transition hover:bg-slate-50">
                                    <div className="flex items-center gap-3">
                                        <Globe
                                            size={19}
                                            className="text-slate-500"
                                        />

                                        <div>
                                            <p className="font-medium text-slate-800">
                                                Language
                                            </p>

                                            <p className="mt-1 text-sm text-slate-500">
                                                English
                                            </p>
                                        </div>
                                    </div>

                                    <ChevronRight
                                        size={18}
                                        className="text-slate-400"
                                    />
                                </button>
                            </div>
                        </div>

                        {/* DANGER ZONE */}
                        <div className="rounded-xl border border-red-200 bg-white shadow-sm">
                            <div className="p-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h2 className="font-bold text-red-600">
                                            Danger Zone
                                        </h2>

                                        <p className="mt-2 text-sm text-slate-500">
                                            Permanently remove your account and
                                            all saved trip information.
                                        </p>
                                    </div>

                                    <button className="flex shrink-0 items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50">
                                        <Trash2 size={16} />
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* SAVE STATUS */}
                        <div className="flex items-center gap-2 pb-6 text-sm text-slate-500">
                            <Check size={16} className="text-green-600" />
                            Your settings are saved automatically.
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}