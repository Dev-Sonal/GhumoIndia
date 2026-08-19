import {
    ChevronDown,
    Edit3,
    Heart,
    MapPin,
    Menu,
    Share2,
    Users,
    Wallet,
} from "lucide-react";

type HeaderProps = {
    onMenuClick?: () => void;
};

export default function Header({
    onMenuClick,
}: HeaderProps) {
    return (
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">

            <div className="flex min-h-[72px] items-center justify-between gap-3 px-3 sm:min-h-[76px] sm:px-4 md:px-6 lg:min-h-[82px] lg:px-8">

                {/* ==============================
                    LEFT SIDE
                ============================== */}
                <div className="flex min-w-0 items-center gap-3">

                    {/* MOBILE MENU */}
                    <button
                        type="button"
                        onClick={onMenuClick}
                        aria-label="Open navigation"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 active:scale-95 lg:hidden"
                    >
                        <Menu size={21} />
                    </button>


                    {/* DESKTOP TRIP ICON */}
                    <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600 shadow-sm transition-transform duration-200 hover:scale-105 sm:flex lg:flex">
                        <MapPin size={21} />
                    </div>


                    {/* TRIP DETAILS */}
                    <div className="min-w-0">

                        <div className="flex items-center gap-1.5 sm:gap-2">

                            <h2 className="truncate text-base font-bold tracking-tight text-slate-800 sm:text-lg lg:text-xl">
                                Bengaluru
                            </h2>

                            <span className="text-slate-300">
                                →
                            </span>

                            <h2 className="truncate text-base font-bold tracking-tight text-blue-600 sm:text-lg lg:text-xl">
                                Goa
                            </h2>

                            <button
                                className="ml-1 hidden rounded-lg p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600 sm:block"
                                title="Edit Trip"
                                aria-label="Edit Trip"
                            >
                                <Edit3 size={15} />
                            </button>

                        </div>


                        {/* TRIP INFO */}
                        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-slate-500 sm:text-xs md:text-sm">

                            <span>
                                <span className="font-semibold text-slate-700">
                                    4 Days
                                </span>{" "}
                                Trip
                            </span>

                            <span className="hidden text-slate-300 sm:inline">
                                •
                            </span>

                            <span className="hidden items-center gap-1 sm:flex">
                                <Users size={13} />
                                2 Adults
                            </span>

                            <span className="hidden text-slate-300 md:inline">
                                •
                            </span>

                            <span className="hidden items-center gap-1 md:flex">
                                <Wallet size={13} />
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


                {/* ==============================
                    RIGHT ACTIONS
                ============================== */}
                <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 md:gap-3">

                    {/* SHARE */}
                    <button
                        className="flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 text-sm font-medium text-slate-700 shadow-sm hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 active:scale-95 sm:h-10 sm:px-3 md:px-4"
                        aria-label="Share Trip"
                    >
                        <Share2 size={15} />

                        <span className="hidden xl:inline">
                            Share Trip
                        </span>
                    </button>


                    {/* SAVE */}
                    <button
                        className="flex h-9 items-center justify-center gap-2 rounded-lg border border-rose-100 bg-rose-50 px-2.5 text-sm font-medium text-rose-600 shadow-sm hover:bg-rose-100 active:scale-95 sm:h-10 sm:px-3 md:px-4"
                        aria-label="Save Trip"
                    >
                        <Heart size={15} />

                        <span className="hidden xl:inline">
                            Save Trip
                        </span>
                    </button>


                    {/* PROFILE */}
                    <button
                        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1 shadow-sm hover:border-slate-300 hover:bg-slate-50"
                        aria-label="Open Profile"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 text-[10px] font-bold text-white sm:h-9 sm:w-9 sm:text-xs">
                            SD
                        </div>

                        <div className="hidden text-left xl:block">
                            <p className="text-xs font-semibold text-slate-800">
                                Sonal Dev
                            </p>

                            <p className="text-[10px] text-slate-500">
                                My Account
                            </p>
                        </div>

                        <ChevronDown
                            size={15}
                            className="mr-1 hidden text-slate-400 xl:block"
                        />
                    </button>

                </div>

            </div>

        </header>
    );
}