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
} from "lucide-react";




export default function Sidebar() {
    const menuItems = [
        { name: "Trip Dashboard", icon: Home },
        { name: "Itinerary", icon: CalendarDays },
        { name: "Cost Breakdown", icon: CircleDollarSign },
        { name: "Places to Visit", icon: MapPin },
        { name: "Nearby Places", icon: Map },
        { name: "Transport Options", icon: Car },
        { name: "Stay & Areas", icon: Bed },
        { name: "Food Guide", icon: Utensils },
        { name: "Ways to Save", icon: Lightbulb },
    ];
    return (
        <aside className="flex h-screen w-56 flex-col border-r border-slate-200 bg-white p-4">

            {/* Logo Section */}
            <div>
                <h1 className="text-2xl font-bold text-blue-600">
                    GhumoIndia
                </h1>

                <p className="mt-2 text-xs text-slate-500">
                    You decide where.
                    <br />
                    We plan how.
                </p>
            </div>

            {/* Navigation Menu */}

            <nav className="mt-8 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.name}
                            className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition ${item.name === "Trip Dashboard"
                                ? "bg-blue-50 font-semibold text-blue-700"
                                : "text-slate-600 hover:bg-slate-100"
                                }`}
                        >
                            <Icon size={18} />
                            {item.name}
                        </button>
                    );
                })}
            </nav>
            <div className="mt-auto border-t border-slate-200 pt-4">
                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm text-slate-600 hover:bg-slate-100">
                    <Heart size={18} />
                    My Trips
                </button>

                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm text-slate-600 hover:bg-slate-100">
                    <User size={18} />
                    Profile
                </button>

                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm text-slate-600 hover:bg-slate-100">
                    <Settings size={18} />
                    Settings
                </button>
            </div>

        </aside>
    );
}