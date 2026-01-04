"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

const NAV_LINKS = [
    { href: "/", label: "Home" },
    { href: "/yoga", label: "Yoga  " },
    { href: "/meditation", label: "Meditation" },
    { href: "/mantra", label: "Mantras" },
    { href: "/about", label: "About Us " },
];

export default function Header() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname?.startsWith(href));

    return (
        <header className="sticky top-0 z-50 bg-black text-white shadow-md">
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Global">
                <div className="flex h-16 items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr] w-full">
                    {/* Left: Logo */}
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex items-center gap-3 group">
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-white/6 text-white font-semibold">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M12 3s-4 3-6 6c2 1 6 2 6 6 0-4 4-5 6-6-2-3-6-6-6-6z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </span>
                            <span className="text-base font-semibold tracking-tight group-hover:opacity-90 transition-opacity">
                                Tridivya Wellness
                            </span>
                        </Link>
                    </div>

                    {/* Center: Desktop Nav */}
                    <div className="hidden md:flex items-center gap-6 justify-self-center">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={
                                    "text-sm font-medium transition-colors hover:opacity-90 " +
                                    (isActive(link.href) ? "text-white font-semibold" : "text-white/70")
                                }
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div> 

                 
                    <div className="flex items-center gap-2 md:justify-self-end">
                        <div className="hidden md:block mr-4">
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                <input
                                    type="search"
                                    placeholder="Search sessions..."
                                    className="h-9 w-56 rounded-full bg-white/6 border border-white/8 px-10 text-sm placeholder-white/60 text-white outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                            </div>
                        </div> 

                        <div className="hidden sm:flex items-center gap-2">
                            <Link
                                href="/login"
                                className="h-9 px-3 inline-flex items-center justify-center rounded-md border border-white/12 text-sm font-medium hover:bg-white/6 transition-colors"
                            >
                                Log in
                            </Link>
                            <Link
                                href="/register"
                                className="h-9 px-3 inline-flex items-center justify-center rounded-md bg-cyan-400 text-black text-sm font-semibold hover:opacity-90 transition-opacity"
                            >
                                Sign up
                            </Link>
                        </div>

                    
                        <ThemeToggle />

                   
                        <button
                            type="button"
                            onClick={() => setOpen((v) => !v)}
                            aria-label="Toggle menu"
                            aria-expanded={open}
                            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-black/10 dark:border-white/15 hover:bg-foreground/5 transition-colors"
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
                    <div className="pb-4 pt-2 border-t border-black/10 dark:border-white/10">
                        <div className="flex flex-col gap-2">
                            {NAV_LINKS.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setOpen(false)}
                                    className={
                                        "rounded-md px-2 py-2 text-sm font-medium transition-colors hover:bg-foreground/5 " +
                                        (isActive(link.href) ? "text-foreground" : "text-foreground/70")
                                    }
                                >
                                    {link.label}
                                </Link>
                            ))}

                            <div className="mt-2 flex items-center gap-2">
                                <Link
                                    href="/login"
                                    className="flex-1 h-9 px-3 inline-flex items-center justify-center rounded-md border border-black/10 dark:border-white/15 text-sm font-medium hover:bg-foreground/5 transition-colors"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href="/register"
                                    className="flex-1 h-9 px-3 inline-flex items-center justify-center rounded-md bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity"
                                >
                                    Sign up
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}