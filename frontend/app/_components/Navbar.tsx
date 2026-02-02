"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

const NAV_LINKS = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
];

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, isAuthenticated, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname?.startsWith(href));

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

    return (
        <header className="sticky top-0 z-50 bg-black text-white shadow-md">
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Global">
                <div className="flex h-16 items-center justify-between">
                    {/* Left: Logo */}
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex items-center gap-2 group">
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-white/10 text-white font-semibold text-sm">
                                TW
                            </span>
                            <span className="text-base font-semibold tracking-tight group-hover:opacity-90 transition-opacity hidden sm:inline">
                                Tridivya Wellness
                            </span>
                        </Link>
                    </div>

                    {/* Center: Desktop Nav */}
                    <div className="hidden md:flex items-center gap-6">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-medium transition-colors ${
                                    isActive(link.href)
                                        ? "text-white font-semibold"
                                        : "text-white/70 hover:text-white"
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right: User Menu */}
                    <div className="flex items-center gap-4">
                        {isAuthenticated && user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
                                >
                                    {user.imageUrl ? (
                                        <img
                                            src={user.imageUrl}
                                            alt={user.firstName}
                                            className="w-8 h-8 rounded-full object-cover border border-white/20"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center text-xs font-bold">
                                            {user.firstName?.[0] || "U"}
                                        </div>
                                    )}
                                    <span className="text-sm font-medium hidden sm:inline">
                                        {user.firstName}
                                    </span>
                                </button>

                                {/* Dropdown Menu */}
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-lg border border-gray-800 overflow-hidden">
                                        <div className="px-4 py-3 border-b border-gray-800">
                                            <p className="text-sm font-medium text-white">{user.firstName} {user.lastName}</p>
                                            <p className="text-xs text-gray-400">{user.email}</p>
                                        </div>
                                        <nav className="space-y-1 p-2">
                                            <Link
                                                href="/my-profile"
                                                className="block px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded transition"
                                                onClick={() => setDropdownOpen(false)}
                                            >
                                                👤 My Profile
                                            </Link>
                                            {user.role === "admin" && (
                                                <Link
                                                    href="/admin/dashboard"
                                                    className="block px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded transition"
                                                    onClick={() => setDropdownOpen(false)}
                                                >
                                                    🛡️ Admin Panel
                                                </Link>
                                            )}
                                            <button
                                                onClick={() => {
                                                    handleLogout();
                                                    setDropdownOpen(false);
                                                }}
                                                className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded transition"
                                            >
                                                🚪 Logout
                                            </button>
                                        </nav>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/login"
                                    className="px-3 py-2 text-sm font-medium text-white/70 hover:text-white transition"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-3 py-2 text-sm font-semibold bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition"
                                >
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
}
