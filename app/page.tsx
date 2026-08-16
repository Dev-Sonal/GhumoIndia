import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import Dashboard from "@/components/dashboard";

export default function Home() {
    return (
        <div className="flex min-h-screen bg-slate-50">

            <Sidebar />

            <main className="min-w-0 flex-1">
                <Header />
                <Dashboard />
            </main>

        </div>
    );
}