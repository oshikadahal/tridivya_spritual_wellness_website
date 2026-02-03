"use client";

import Header from "./_components/Header";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isFullWhite = pathname === "/" || pathname?.startsWith("/explore");

    return (
        <section>
            <Header />
            {isFullWhite ? (
             
                <main className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100">
                    {children}
                </main>
            ) : (
                <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </main>
            )}
        </section>
    );
}
