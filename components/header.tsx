export default function Header() {
    return (
        <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8">
            <div>
                <h2 className="text-xl font-bold text-slate-800">
                    Bengaluru → Goa
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                    4 Day Trip • 2 Adults • Moderate Budget • Couple
                </p>
            </div>

            <div className="flex items-center gap-3">
                <button className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50">
                    Share Trip
                </button>

                <button className="rounded-lg border border-red-100 bg-red-50 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-100">
                    ♡ Save Trip
                </button>

                <div className="h-10 w-10 rounded-full bg-slate-800" />
            </div>
        </header>
    );
}