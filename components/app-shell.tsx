"use client";

import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";

import Header from "@/components/header";
import Sidebar from "@/components/sidebar";

type AppShellProps = {
    children: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const drawerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const closeOnEscape = (event: globalThis.KeyboardEvent) => {
            if (event.key === "Escape") {
                setSidebarOpen(false);
            }
        };

        window.addEventListener("keydown", closeOnEscape);
        return () => window.removeEventListener("keydown", closeOnEscape);
    }, []);

    useEffect(() => {
        if (sidebarOpen) {
            drawerRef.current?.querySelector<HTMLElement>("button, a")?.focus();
        }
    }, [sidebarOpen]);

    const trapDrawerFocus = (event: ReactKeyboardEvent<HTMLDivElement>) => {
        if (event.key !== "Tab") {
            return;
        }

        const focusable = drawerRef.current?.querySelectorAll<HTMLElement>(
            "a[href], button:not([disabled])",
        );

        if (!focusable?.length) {
            return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:block">
                <Sidebar />
            </div>

            {sidebarOpen && (
                <button
                    type="button"
                    aria-label="Close navigation"
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden"
                />
            )}

            <div
                ref={drawerRef}
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
                aria-hidden={!sidebarOpen}
                inert={!sidebarOpen}
                onKeyDown={trapDrawerFocus}
                className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-out lg:hidden ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <Sidebar
                    onClose={() => setSidebarOpen(false)}
                    onNavigate={() => setSidebarOpen(false)}
                />
            </div>

            <main className="min-w-0 lg:ml-64">
                <Header onMenuClick={() => setSidebarOpen(true)} />
                {children}
            </main>
        </div>
    );
}
