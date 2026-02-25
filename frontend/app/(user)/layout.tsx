"use client";

import Sidebar from "../(user)/_components/Sidebar";
import UserHeader from "../(user)/_components/UserHeader";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UserLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, loading, router]);

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
                {/* Top Navbar */}
                <div className="sticky top-0 z-20 bg-gradient-to-br from-purple-50 to-blue-50">
                    <UserHeader />
                </div>
                {children}
            </main>
        </div>
    );
}
