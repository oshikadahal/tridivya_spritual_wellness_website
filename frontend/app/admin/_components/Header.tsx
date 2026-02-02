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
        <header className="sticky top-0 z-50 backdrop-blur supports-backdrop-filter:bg-background/80 border-b border-black/10">
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Global">
                <div className="flex h-16 items-center justify-between">
                    {/* Left: Logo & Title */}
                    <div className="flex items-center gap-3">
                        <Link href="/admin" className="flex items-center gap-2 group">
                            <span className="text-base font-semibold tracking-tight group-hover:opacity-80 transition-opacity">
                                Admin Panel
                            </span>
                        </Link>
                    </div>

                    {/* Right: User Menu */}
                    <div className="flex items-center gap-4">
                        <div className="h-6 flex items-center justify-center text-xs font-semibold text-gray-700">
                            {user?.email || 'Admin'}
                        </div>
                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-100 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
}
