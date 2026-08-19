import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default: "Pilgora | Smart Travel Planning",
        template: "%s | Pilgora",
    },
    description:
        "Plan your complete trip with costs, itineraries, places, transport, stays and smarter travel recommendations.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} h-full`}
        >
            <body className="min-h-full bg-slate-50 font-sans text-slate-900 antialiased">
                {children}
            </body>
        </html>
    );
}