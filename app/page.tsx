"use client";

import { useState } from "react";

import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import Dashboard from "@/components/dashboard";

export default function Home() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50">

            {/* ==============================
                DESKTOP SIDEBAR
            ============================== */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:block">
                <Sidebar />
            </div>


            {/* ==============================
                MOBILE OVERLAY
            ============================== */}
            {sidebarOpen && (
                <button
                    type="button"
                    aria-label="Close sidebar"
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden"
                />
            )}


            {/* ==============================
                MOBILE SIDEBAR DRAWER
            ============================== */}
            <div
                className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-out lg:hidden ${
                    sidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                }`}
            >
                <Sidebar />
            </div>


            {/* ==============================
                MAIN CONTENT
            ============================== */}
            <main className="min-w-0 lg:ml-64">

                <Header
                    onMenuClick={() => setSidebarOpen(true)}
                />

                <Dashboard />

            </main>

        </div>
    );
}