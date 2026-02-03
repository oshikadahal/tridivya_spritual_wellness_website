"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Header() {
    const { logout, user } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

    return (
        <header className="flex-shrink-0 bg-white border-b border-slate-200 shadow-sm">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Left: Logo & Title */}
                    <div className="flex items-center gap-3">
                        <Link href="/admin" className="flex items-center gap-2 group">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-indigo-100 text-indigo-600 font-bold text-sm">A</span>
                            <span className="text-base font-semibold tracking-tight text-slate-900 group-hover:opacity-80 transition-opacity">
                                Admin Panel
                            </span>
                        </Link>
                    </div>

                    {/* Right: User Menu */}
                    <div className="flex items-center gap-4">
                        <div className="h-6 flex items-center justify-center text-xs font-semibold text-slate-600">
                            {user?.email || 'Admin'}
                        </div>
                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors font-medium"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
