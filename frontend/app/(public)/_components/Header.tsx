"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { LogOut, ChevronDown } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';

const getImageUrl = (imageUrl: string | null | undefined) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${API_BASE_URL}${imageUrl}`;
};

export default function Header() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();
    const isLoginPage = pathname?.startsWith("/login");

    return (
        <header className="sticky top-0 z-50 bg-white text-black shadow-sm border-b border-slate-200">
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Global">
                <div className="flex h-18 items-center justify-between w-full gap-6">
                    {/* Left: Logo */}
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex items-center gap-3 group">
                            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100">
                                <Image
                                    src="/images/logo.png"
                                    alt="Tridivya logo"
                                    width={24}
                                    height={24}
                                    className="h-6 w-6 object-contain"
                                />
                            </span>
                            <span className="text-base font-semibold tracking-tight group-hover:opacity-80 transition-opacity text-black">
                                Tridivya Wellness
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-3">
                            {isAuthenticated && user ? (
                                <div className="flex items-center gap-3">
                                    {user.role === "admin" && (
                                        <Link
                                            href="/admin/dashboard"
                                            className="h-10 px-4 inline-flex items-center justify-center rounded-md bg-purple-500 text-white text-sm font-semibold hover:bg-purple-600 transition-colors"
                                        >
                                            Admin Panel
                                        </Link>
                                    )}
                                    {/* Profile Dropdown */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setProfileOpen(!profileOpen)}
                                            className="h-10 px-3 inline-flex items-center gap-2 rounded-lg border border-slate-300 text-black text-sm font-medium hover:bg-slate-100 transition-colors"
                                        >
                                            <div className="w-6 h-6 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center overflow-hidden text-white text-xs font-bold">
                                                {user.imageUrl ? (
                                                    <img
                                                        src={getImageUrl(user.imageUrl) || ''}
                                                        alt={user.firstName}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    user.firstName?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || "U"
                                                )}
                                            </div>
                                            <span>{user.firstName || user.username}</span>
                                            <ChevronDown size={16} className={`transition-transform ${profileOpen ? "rotate-180" : ""}`} />
                                        </button>

                                        {/* Dropdown Menu */}
                                        {profileOpen && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
                                                <Link
                                                    href="/my-profile"
                                                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                                    onClick={() => setProfileOpen(false)}
                                                >
                                                    👤 View Profile
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        logout();
                                                        setProfileOpen(false);
                                                    }}
                                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                                                >
                                                    <LogOut size={16} />
                                                    Logout
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <Link
                                        href="/login"
                                        className={
                                            "h-10 px-6 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors " +
                                            (isLoginPage
                                                ? "bg-indigo-500 text-white hover:bg-indigo-600"
                                                : "border border-slate-300 text-black hover:bg-slate-100")
                                        }
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="h-10 px-6 inline-flex items-center justify-center rounded-md bg-indigo-500 text-white text-sm font-semibold hover:bg-indigo-600 transition-colors"
                                    >
                                        Sign up
                                    </Link>
                                </div>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => setOpen((v) => !v)}
                            aria-label="Toggle menu"
                            aria-expanded={open}
                            className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 hover:bg-slate-100 transition-colors text-black"
                        >
                            {open ? (
                                // Close icon
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                                    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                // Hamburger icon
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                                    <path fillRule="evenodd" d="M3.75 5.25a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Zm0 6a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Zm0 6a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>


                {/* Mobile panel */}
                <div className={"md:hidden overflow-hidden transition-[max-height] duration-300 " + (open ? "max-h-96" : "max-h-0")}>
                    <div className="pb-4 pt-2 border-t border-black/10">
                        <div className="flex flex-col gap-2">
                            <div className="mt-2 flex flex-col items-center gap-2">
                                {isAuthenticated && user ? (
                                    <div className="w-full flex flex-col gap-2">
                                        {user.role === "admin" && (
                                            <Link
                                                href="/admin/dashboard"
                                                className="h-10 px-4 inline-flex items-center justify-center rounded-md bg-purple-500 text-white text-sm font-semibold hover:bg-purple-600 transition-colors"
                                                onClick={() => setOpen(false)}
                                            >
                                                Admin Panel
                                            </Link>
                                        )}
                                        <Link
                                            href="/my-profile"
                                            className="h-10 px-4 inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 text-black text-sm font-medium hover:bg-slate-100 transition-colors w-full"
                                            onClick={() => setOpen(false)}
                                        >
                                            <div className="w-5 h-5 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                                                {user.imageUrl ? (
                                                    <img
                                                        src={getImageUrl(user.imageUrl) || ''}
                                                        alt={user.firstName}
                                                        className="w-full h-full object-cover rounded-full"
                                                    />
                                                ) : (
                                                    user.firstName?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || "U"
                                                )}
                                            </div>
                                            <span>{user.firstName || user.username}</span>
                                        </Link>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setOpen(false);
                                            }}
                                            className="h-10 px-4 w-full inline-flex items-center justify-center gap-2 rounded-md bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors"
                                        >
                                            <LogOut size={16} />
                                            Logout
                                        </button>
                                    </div>
                                ) : (
                                    <div className="w-full flex gap-2">
                                        <Link
                                            href="/login"
                                            className={
                                                "flex-1 h-10 px-4 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors " +
                                                (isLoginPage
                                                    ? "bg-indigo-500 text-white hover:bg-indigo-600"
                                                    : "border border-black/10 text-black hover:bg-slate-100")
                                            }
                                            onClick={() => setOpen(false)}
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="flex-1 h-10 px-4 inline-flex items-center justify-center rounded-md bg-indigo-500 text-white text-sm font-semibold hover:bg-indigo-600 transition-colors"
                                            onClick={() => setOpen(false)}
                                        >
                                            Sign up
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}