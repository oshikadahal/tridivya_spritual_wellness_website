"use client";

import Header from "./_components/Header";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isFullWhite = pathname === "/" || pathname?.startsWith("/dashboard");

    return (
        <section>
            <Header />
            {isFullWhite ? (
                // Full-width white background for home and dashboard
                <main className="min-h-screen w-full bg-white">
                    {children}
                </main>
            ) : (
                <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {children}
                </main>
            )}
        </section>
    );
}
