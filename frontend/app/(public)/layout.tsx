"use client";


import Header from "./_components/Header";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { isAuthenticated, loading } = useAuth();
    const isFullWhite = pathname === "/" || pathname?.startsWith("/explore") || pathname?.startsWith("/yoga") || pathname?.startsWith("/meditation") || pathname?.startsWith("/mantra");

    useEffect(() => {
        if (!loading && isAuthenticated) {
            router.replace("/dashboard");
        }
    }, [isAuthenticated, loading, router]);

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
