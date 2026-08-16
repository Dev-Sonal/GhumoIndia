"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";

import {
    User,
    Mail,
    Phone,
    MapPin,
    Users,
    Wallet,
    Hotel,
    Sparkles,
    Save,
    Check,
} from "lucide-react";

export default function ProfilePage() {
    // ==============================
    // PROFILE INFORMATION
    // ==============================
    const [name, setName] = useState("Sonal");
    const [email, setEmail] = useState("sonal@example.com");
    const [phone, setPhone] = useState("");
    const [city, setCity] = useState("Patna");

    // ==============================
    // TRAVEL PREFERENCES
    // ==============================
    const [travelStyle, setTravelStyle] =
        useState("Recommended");

    const [travelGroup, setTravelGroup] =
        useState("Friends");

    const [budget, setBudget] =
        useState("₹10,000 - ₹15,000");

    const [stayPreference, setStayPreference] =
        useState("Comfortable");

    // ==============================
    // SAVE STATE
    // ==============================
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);

        // Later this data will be sent to the backend/API
        setTimeout(() => {
            setSaved(false);
        }, 3000);
    };

    return (
        <div className="flex min-h-screen bg-slate-50">

            <Sidebar />

            <main className="min-w-0 flex-1">
                <Header />

                <section className="p-4 md:p-6 lg:p-8">

                    {/* ==============================
                        PAGE HEADER
                    ============================== */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                        <div className="flex items-center gap-3">

                            <div className="rounded-xl bg-blue-50 p-3">
                                <User
                                    size={24}
                                    className="text-blue-600"
                                />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-slate-800">
                                    Profile
                                </h1>

                                <p className="mt-1 text-sm text-slate-500">
                                    Manage your personal information and
                                    travel preferences.
                                </p>
                            </div>
                        </div>

                        {/* SAVE BUTTON */}
                        <button
                            onClick={handleSave}
                            className={`flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white transition ${
                                saved
                                    ? "bg-green-600"
                                    : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        >
                            {saved ? (
                                <>
                                    <Check size={18} />
                                    Saved
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>

                    {/* ==============================
                        PROFILE INFORMATION
                    ============================== */}
                    <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">

                        <div className="flex items-center gap-2">
                            <User
                                size={20}
                                className="text-blue-600"
                            />

                            <h2 className="text-lg font-bold text-slate-800">
                                Personal Information
                            </h2>
                        </div>

                        <p className="mt-2 text-sm text-slate-500">
                            Basic information that can help personalize your
                            travel experience.
                        </p>

                        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">

                            {/* NAME */}
                            <div>
                                <label className="text-sm font-medium text-slate-700">
                                    Full Name
                                </label>

                                <div className="relative mt-2">

                                    <User
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        className="w-full rounded-lg border border-slate-200 py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>
                            </div>

                            {/* EMAIL */}
                            <div>
                                <label className="text-sm font-medium text-slate-700">
                                    Email Address
                                </label>

                                <div className="relative mt-2">

                                    <Mail
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        className="w-full rounded-lg border border-slate-200 py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>
                            </div>

                            {/* PHONE */}
                            <div>
                                <label className="text-sm font-medium text-slate-700">
                                    Phone Number
                                </label>

                                <div className="relative mt-2">

                                    <Phone
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        type="tel"
                                        placeholder="Enter phone number"
                                        value={phone}
                                        onChange={(e) =>
                                            setPhone(e.target.value)
                                        }
                                        className="w-full rounded-lg border border-slate-200 py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>
                            </div>

                            {/* CITY */}
                            <div>
                                <label className="text-sm font-medium text-slate-700">
                                    Home City
                                </label>

                                <div className="relative mt-2">

                                    <MapPin
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        type="text"
                                        value={city}
                                        onChange={(e) =>
                                            setCity(e.target.value)
                                        }
                                        className="w-full rounded-lg border border-slate-200 py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* ==============================
                        TRAVEL PREFERENCES
                    ============================== */}
                    <div className="mt-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">

                        <div className="flex items-center gap-2">

                            <Sparkles
                                size={20}
                                className="text-blue-600"
                            />

                            <h2 className="text-lg font-bold text-slate-800">
                                Travel Preferences
                            </h2>
                        </div>

                        <p className="mt-2 text-sm text-slate-500">
                            These preferences will help us create better trip
                            recommendations for you.
                        </p>

                        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">

                            {/* TRAVEL STYLE */}
                            <div>
                                <label className="text-sm font-medium text-slate-700">
                                    Preferred Travel Style
                                </label>

                                <select
                                    value={travelStyle}
                                    onChange={(e) =>
                                        setTravelStyle(e.target.value)
                                    }
                                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                >
                                    <option>Cheapest</option>
                                    <option>Recommended</option>
                                    <option>Comfortable</option>
                                    <option>Luxury</option>
                                </select>
                            </div>

                            {/* TRAVEL GROUP */}
                            <div>
                                <label className="text-sm font-medium text-slate-700">
                                    Usually Travel With
                                </label>

                                <div className="relative mt-2">

                                    <Users
                                        size={18}
                                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <select
                                        value={travelGroup}
                                        onChange={(e) =>
                                            setTravelGroup(e.target.value)
                                        }
                                        className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    >
                                        <option>Solo</option>
                                        <option>Couple</option>
                                        <option>Friends</option>
                                        <option>Family</option>
                                    </select>
                                </div>
                            </div>

                            {/* BUDGET */}
                            <div>
                                <label className="text-sm font-medium text-slate-700">
                                    Preferred Budget Per Person
                                </label>

                                <div className="relative mt-2">

                                    <Wallet
                                        size={18}
                                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <select
                                        value={budget}
                                        onChange={(e) =>
                                            setBudget(e.target.value)
                                        }
                                        className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    >
                                        <option>Under ₹5,000</option>
                                        <option>₹5,000 - ₹10,000</option>
                                        <option>₹10,000 - ₹15,000</option>
                                        <option>₹15,000 - ₹25,000</option>
                                        <option>Above ₹25,000</option>
                                    </select>
                                </div>
                            </div>

                            {/* STAY */}
                            <div>
                                <label className="text-sm font-medium text-slate-700">
                                    Stay Preference
                                </label>

                                <div className="relative mt-2">

                                    <Hotel
                                        size={18}
                                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <select
                                        value={stayPreference}
                                        onChange={(e) =>
                                            setStayPreference(e.target.value)
                                        }
                                        className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    >
                                        <option>Budget Friendly</option>
                                        <option>Comfortable</option>
                                        <option>Premium</option>
                                        <option>Luxury</option>
                                    </select>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* ==============================
                        PROFILE SUMMARY
                    ============================== */}
                    <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-5 md:p-6">

                        <div className="flex items-center gap-2">

                            <Sparkles
                                size={20}
                                className="text-blue-600"
                            />

                            <h2 className="text-lg font-bold text-slate-800">
                                Your Travel Profile
                            </h2>
                        </div>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            Based on your preferences, GhumoIndia will prioritize
                            <span className="font-semibold text-slate-800">
                                {" "}{travelStyle.toLowerCase()}
                            </span>{" "}
                            trips for
                            <span className="font-semibold text-slate-800">
                                {" "}{travelGroup.toLowerCase()}
                            </span>{" "}
                            within a budget of
                            <span className="font-semibold text-slate-800">
                                {" "}{budget}
                            </span>.
                        </p>

                    </div>

                </section>
            </main>
        </div>
    );
}