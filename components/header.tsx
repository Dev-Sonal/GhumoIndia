import {
    ChevronDown,
    Edit3,
    Heart,
    MapPin,
    Share2,
    Users,
    Wallet,
} from "lucide-react";

export default function Header() {
    return (
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
            <div className="flex min-h-[88px] items-center justify-between gap-4 px-4 md:px-6 lg:px-8">

                {/* LEFT SIDE - TRIP INFORMATION */}
                <div className="flex min-w-0 items-center gap-4">

                    {/* Trip Icon */}
                    <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 sm:flex">
                        <MapPin size={22} />
                    </div>

                    {/* Trip Details */}
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">

                            <h2 className="truncate text-lg font-bold text-slate-800 sm:text-xl">
                                Bengaluru
                            </h2>

                            <span className="text-slate-400">→</span>

                            <h2 className="truncate text-lg font-bold text-blue-600 sm:text-xl">
                                Goa
                            </h2>

                            <button
                                className="ml-1 hidden rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-blue-600 sm:block"
                                title="Edit Trip"
                            >
                                <Edit3 size={16} />
                            </button>
                        </div>

                        {/* Trip Information */}
                        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 sm:text-sm">

                            <span className="flex items-center gap-1">
                                <span className="font-medium text-slate-700">
                                    4 Days
                                </span>
                                Trip
                            </span>

                            <span className="hidden text-slate-300 sm:inline">
                                •
                            </span>

                            <span className="flex items-center gap-1">
                                <Users size={14} />
                                2 Adults
                            </span>

                            <span className="hidden text-slate-300 sm:inline">
                                •
                            </span>

                            <span className="flex items-center gap-1">
                                <Wallet size={14} />
                                Moderate Budget
                            </span>

                            <span className="hidden text-slate-300 lg:inline">
                                •
                            </span>

                            <span className="hidden lg:inline">
                                Couple
                            </span>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE - ACTIONS */}
                <div className="flex shrink-0 items-center gap-2 sm:gap-3">

                    {/* Share */}
                    <button
                        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 sm:px-4"
                    >
                        <Share2 size={16} />

                        <span className="hidden md:inline">
                            Share Trip
                        </span>
                    </button>

                    {/* Save */}
                    <button
                        className="flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-100 sm:px-4"
                    >
                        <Heart size={16} />

                        <span className="hidden md:inline">
                            Save Trip
                        </span>
                    </button>

                    {/* Profile */}
                    <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5 transition hover:bg-slate-50">

                        {/* Avatar */}
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-sm font-semibold text-white">
                            SD
                        </div>

                        <div className="hidden text-left lg:block">
                            <p className="text-xs font-semibold text-slate-800">
                                Sonal Dev
                            </p>

                            <p className="text-[11px] text-slate-500">
                                My Account
                            </p>
                        </div>

                        <ChevronDown
                            size={16}
                            className="mr-1 hidden text-slate-400 lg:block"
                        />
                    </button>
                </div>
            </div>
        </header>
    );
}