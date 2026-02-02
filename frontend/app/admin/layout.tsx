"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "./_components/Header";
import Sidebar from "./_components/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && (!isAuthenticated || user?.role !== "admin")) {
            router.push("/login");
        }
    }, [isAuthenticated, loading, user, router]);

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (!isAuthenticated || user?.role !== "admin") {
        return null;
    }

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            {/* Fixed Sidebar */}
            <Sidebar />
            
            {/* Main Content Area */}
            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Fixed Header */}
                <Header />
                
                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
