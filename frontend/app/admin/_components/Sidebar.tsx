"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { BookOpenCheck, CalendarCheck2, Flower2, LayoutDashboard, Library, LogOut, MessageSquareText, Star, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const ADMIN_LINKS = [
    { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck2 },
    { href: "/admin/yoga", label: "Yoga", icon: Flower2 },
    { href: "/admin/meditation", label: "Meditation", icon: BookOpenCheck },
    { href: "/admin/mantras", label: "Mantras", icon: MessageSquareText },
    { href: "/admin/library", label: "Library", icon: Library },
    { href: "/admin/reviews", label: "Reviews", icon: Star },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const isActive = (href: string) => {
        if (href === "/admin/dashboard") {
            return pathname === "/admin" || pathname === "/admin/dashboard";
        }
        return pathname === href || pathname?.startsWith(`${href}/`);
    };

    const handleLogout = async () => {
        setShowLogoutConfirm(false);
        await logout();
    };

    return (
        <aside className="shrink-0 flex w-64 flex-col border-r border-slate-200 bg-white text-slate-900">
            <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-6">
                <Image src="/images/logo.png" alt="Tridivya Wellness Logo" width={32} height={32} className="h-8 w-8 rounded-full object-cover" />
                <span className="text-lg font-bold text-slate-900">Tridivya Wellness</span>
            </div>
            <nav className="flex-1 space-y-1 p-4">
                {ADMIN_LINKS.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                            isActive(link.href)
                                ? "bg-violet-100 text-violet-700"
                                : "text-slate-700 hover:bg-slate-100"
                        }`}
                    >
                        <link.icon size={16} />
                        {link.label}
                    </Link>
                ))}
            </nav>

            <div className="border-t border-slate-200 p-5 space-y-4">
                <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-100"
                >
                    <LogOut size={16} />
                    Logout
                </button>
                <div className="flex items-center gap-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-orange-300 text-white font-semibold text-xs">
                        A
                    </span>
                    <div>
                        <p className="text-sm font-semibold text-slate-900">Admin Panel</p>
                        <p className="text-xs text-slate-500">Super Administrator</p>
                    </div>
                </div>
            </div>

            {showLogoutConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
                        <h3 className="text-lg font-bold text-slate-900">Confirm Logout</h3>
                        <p className="mt-2 text-sm text-slate-600">Are you sure you want to logout?</p>

                        <div className="mt-6 flex items-center justify-end gap-3">
                            <button
                                onClick={() => setShowLogoutConfirm(false)}
                                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
}
