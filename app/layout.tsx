import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

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
        <html lang="en" className="h-full">
            <body className="min-h-full bg-slate-50 font-sans text-slate-900 antialiased">
                {children}
            </body>
        </html>
    );
}
