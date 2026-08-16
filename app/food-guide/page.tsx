import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import {
    Utensils,
    Coffee,
    IndianRupee,
    Star,
    CheckCircle2,
    Fish,
    IceCream,
    MapPin,
    Heart,
    Clock,
} from "lucide-react";

export default function FoodGuidePage() {
    return (
        <div className="flex min-h-screen bg-slate-50">

            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="min-w-0 flex-1">
                <Header />

                <section className="p-4 md:p-6 lg:p-8">

                    {/* ================================
                        PAGE HEADING
                    ================================= */}
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            Food Guide
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Discover local food, must-try dishes, cafes and
                            food budget options for your Goa trip.
                        </p>
                    </div>

                    {/* ================================
                        FOOD RECOMMENDATION
                    ================================= */}
                    <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-5">

                        <div className="flex items-start gap-3">
                            <Utensils
                                size={24}
                                className="mt-1 text-blue-600"
                            />

                            <div>
                                <h2 className="font-bold text-slate-800">
                                    Food Experience for Your Goa Trip
                                </h2>

                                <p className="mt-1 text-sm text-slate-600">
                                    Goa offers a mix of local seafood, traditional
                                    Goan dishes, beachside restaurants and modern
                                    cafes. Try a combination of local food and
                                    popular cafes for the best experience.
                                </p>

                                <div className="mt-3 flex flex-wrap gap-2">
                                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-blue-700">
                                        Local Goan Food
                                    </span>

                                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-blue-700">
                                        Beachside Dining
                                    </span>

                                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-blue-700">
                                        Cafes
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ================================
                        MUST-TRY GOAN DISHES
                    ================================= */}
                    <div className="mt-8">

                        <h2 className="text-xl font-bold text-slate-800">
                            Must-Try Goan Food
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Add some of these popular dishes to your food
                            experience during the trip.
                        </p>

                        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

                            {/* Fish Curry Rice */}
                            <div className="rounded-xl border-2 border-blue-500 bg-white p-5 shadow-sm">

                                <div className="flex items-center justify-between">
                                    <Fish
                                        size={25}
                                        className="text-blue-600"
                                    />

                                    <span className="rounded-full bg-blue-600 px-3 py-1 text-[10px] font-semibold text-white">
                                        Must Try
                                    </span>
                                </div>

                                <h3 className="mt-4 text-lg font-bold text-slate-800">
                                    Goan Fish Curry & Rice
                                </h3>

                                <p className="mt-2 text-sm text-slate-500">
                                    One of the most popular traditional Goan
                                    meals and a great choice for seafood lovers.
                                </p>

                                <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                                    <IndianRupee size={16} />
                                    Approx. ₹250 - ₹500
                                </div>
                            </div>

                            {/* Prawn Curry */}
                            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                                <Fish
                                    size={25}
                                    className="text-orange-500"
                                />

                                <h3 className="mt-4 text-lg font-bold text-slate-800">
                                    Prawn Curry
                                </h3>

                                <p className="mt-2 text-sm text-slate-500">
                                    A flavourful seafood option commonly found
                                    in traditional Goan restaurants.
                                </p>

                                <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                                    <IndianRupee size={16} />
                                    Approx. ₹300 - ₹600
                                </div>
                            </div>

                            {/* Xacuti */}
                            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                                <Utensils
                                    size={25}
                                    className="text-red-500"
                                />

                                <h3 className="mt-4 text-lg font-bold text-slate-800">
                                    Goan Xacuti
                                </h3>

                                <p className="mt-2 text-sm text-slate-500">
                                    A rich and flavourful curry made with
                                    traditional Goan spices.
                                </p>

                                <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                                    <IndianRupee size={16} />
                                    Approx. ₹250 - ₹500
                                </div>
                            </div>

                            {/* Vindaloo */}
                            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                                <Utensils
                                    size={25}
                                    className="text-orange-600"
                                />

                                <h3 className="mt-4 text-lg font-bold text-slate-800">
                                    Goan Vindaloo
                                </h3>

                                <p className="mt-2 text-sm text-slate-500">
                                    A well-known spicy and tangy Goan curry for
                                    travellers who enjoy bold flavours.
                                </p>

                                <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                                    <IndianRupee size={16} />
                                    Approx. ₹250 - ₹600
                                </div>
                            </div>

                            {/* Bebinca */}
                            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                                <IceCream
                                    size={25}
                                    className="text-pink-500"
                                />

                                <h3 className="mt-4 text-lg font-bold text-slate-800">
                                    Bebinca
                                </h3>

                                <p className="mt-2 text-sm text-slate-500">
                                    A traditional layered Goan dessert and a
                                    great sweet dish to try.
                                </p>

                                <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                                    <IndianRupee size={16} />
                                    Approx. ₹100 - ₹300
                                </div>
                            </div>

                            {/* Vegetarian */}
                            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                                <Heart
                                    size={25}
                                    className="text-green-600"
                                />

                                <h3 className="mt-4 text-lg font-bold text-slate-800">
                                    Vegetarian Goan Food
                                </h3>

                                <p className="mt-2 text-sm text-slate-500">
                                    Goa also has vegetarian curries, local
                                    breads, rice dishes and plenty of cafes with
                                    vegetarian options.
                                </p>

                                <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                                    <CheckCircle2 size={16} />
                                    Vegetarian friendly options available
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* ================================
                        WHERE TO EAT
                    ================================= */}
                    <div className="mt-8">

                        <h2 className="text-xl font-bold text-slate-800">
                            Where to Eat
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Choose the food experience based on your mood,
                            budget and travel plan.
                        </p>

                        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">

                            {/* Local Restaurants */}
                            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                                <Utensils
                                    size={25}
                                    className="text-orange-500"
                                />

                                <h3 className="mt-4 font-bold text-slate-800">
                                    Local Restaurants
                                </h3>

                                <p className="mt-2 text-sm text-slate-500">
                                    Best choice for traditional Goan meals and
                                    a more authentic local food experience.
                                </p>

                                <div className="mt-4 space-y-2 text-sm text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={16} />
                                        Authentic dishes
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={16} />
                                        Usually budget friendly
                                    </div>
                                </div>
                            </div>

                            {/* Cafes */}
                            <div className="rounded-xl border-2 border-blue-500 bg-white p-5 shadow-sm">

                                <div className="flex items-center justify-between">
                                    <Coffee
                                        size={25}
                                        className="text-blue-600"
                                    />

                                    <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-semibold text-blue-700">
                                        Recommended
                                    </span>
                                </div>

                                <h3 className="mt-4 font-bold text-slate-800">
                                    Cafes
                                </h3>

                                <p className="mt-2 text-sm text-slate-500">
                                    Perfect for breakfast, coffee, brunch and a
                                    relaxed atmosphere during sightseeing.
                                </p>

                                <div className="mt-4 space-y-2 text-sm text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={16} />
                                        Great for breakfast
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={16} />
                                        Popular around North Goa
                                    </div>
                                </div>
                            </div>

                            {/* Beachside */}
                            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                                <MapPin
                                    size={25}
                                    className="text-cyan-600"
                                />

                                <h3 className="mt-4 font-bold text-slate-800">
                                    Beachside Dining
                                </h3>

                                <p className="mt-2 text-sm text-slate-500">
                                    Enjoy food with beach views, especially
                                    during sunset or a relaxed evening.
                                </p>

                                <div className="mt-4 space-y-2 text-sm text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={16} />
                                        Scenic experience
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={16} />
                                        Good for dinner
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* ================================
                        FOOD BUDGET
                    ================================= */}
                    <div className="mt-8">

                        <h2 className="text-xl font-bold text-slate-800">
                            Food Budget for Your Trip
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Your trip dashboard currently estimates around
                            ₹2,000 per person for food.
                        </p>

                        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">

                            {/* Budget */}
                            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                                <IndianRupee
                                    size={24}
                                    className="text-green-600"
                                />

                                <h3 className="mt-4 font-bold text-slate-800">
                                    Budget Food
                                </h3>

                                <p className="mt-2 text-sm text-slate-500">
                                    Local restaurants, simple meals and quick
                                    snacks.
                                </p>

                                <p className="mt-5 text-xl font-bold text-slate-800">
                                    ₹400 - ₹700/day
                                </p>
                            </div>

                            {/* Recommended */}
                            <div className="rounded-xl border-2 border-blue-500 bg-white p-5 shadow-sm">

                                <div className="flex items-center justify-between">
                                    <Star
                                        size={24}
                                        className="text-blue-600"
                                    />

                                    <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-semibold text-blue-700">
                                        Your Plan
                                    </span>
                                </div>

                                <h3 className="mt-4 font-bold text-slate-800">
                                    Recommended Mix
                                </h3>

                                <p className="mt-2 text-sm text-slate-500">
                                    Mix local food, cafes and one or two
                                    special dining experiences.
                                </p>

                                <p className="mt-5 text-xl font-bold text-slate-800">
                                    Around ₹500/day
                                </p>
                            </div>

                            {/* Premium */}
                            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                                <Star
                                    size={24}
                                    className="text-yellow-500"
                                />

                                <h3 className="mt-4 font-bold text-slate-800">
                                    Premium Dining
                                </h3>

                                <p className="mt-2 text-sm text-slate-500">
                                    Resorts, premium restaurants and frequent
                                    beachside dining.
                                </p>

                                <p className="mt-5 text-xl font-bold text-slate-800">
                                    ₹1,000+/day
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* ================================
                        FOOD PLAN SUMMARY
                    ================================= */}
                    <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

                        <div className="flex items-center gap-3">
                            <Utensils
                                size={24}
                                className="text-blue-600"
                            />

                            <div>
                                <h2 className="text-lg font-bold text-slate-800">
                                    Recommended Food Plan
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    A balanced food experience for your current
                                    4-day Goa trip.
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-4">

                            <div className="rounded-lg bg-slate-50 p-4">
                                <Clock
                                    size={18}
                                    className="text-orange-500"
                                />

                                <p className="mt-3 text-xs text-slate-500">
                                    Breakfast
                                </p>

                                <p className="mt-1 font-bold text-slate-800">
                                    Cafes & Local Breakfast
                                </p>
                            </div>

                            <div className="rounded-lg bg-slate-50 p-4">
                                <Utensils
                                    size={18}
                                    className="text-blue-600"
                                />

                                <p className="mt-3 text-xs text-slate-500">
                                    Lunch
                                </p>

                                <p className="mt-1 font-bold text-slate-800">
                                    Local Goan Food
                                </p>
                            </div>

                            <div className="rounded-lg bg-slate-50 p-4">
                                <Coffee
                                    size={18}
                                    className="text-purple-600"
                                />

                                <p className="mt-3 text-xs text-slate-500">
                                    Evening
                                </p>

                                <p className="mt-1 font-bold text-slate-800">
                                    Cafe & Snacks
                                </p>
                            </div>

                            <div className="rounded-lg bg-slate-50 p-4">
                                <MapPin
                                    size={18}
                                    className="text-red-500"
                                />

                                <p className="mt-3 text-xs text-slate-500">
                                    Dinner
                                </p>

                                <p className="mt-1 font-bold text-slate-800">
                                    Local or Beachside Dining
                                </p>
                            </div>

                        </div>
                    </div>

                </section>
            </main>

        </div>
    );
}