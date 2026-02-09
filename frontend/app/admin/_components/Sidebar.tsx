"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ADMIN_LINKS = [
    { href: "/admin", label: "Dashboard", icon: "📊" },
    { href: "/admin/users", label: "Users", icon: "👥" },
    { href: "/admin/announcements", label: "Announcements", icon: "📣" },
];

export default function Sidebar() {
    const pathname = usePathname();

    const isActive = (href: string) => {
        return href === "/" ? pathname === "/" : pathname?.startsWith(href);
    };

    return (
        <aside className="flex-shrink-0 w-64 bg-slate-50 text-slate-900 border-r border-slate-200 overflow-y-auto">
            <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-6 flex-shrink-0">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-indigo-100 text-indigo-600 font-bold text-sm">A</span>
                <span className="text-lg font-bold text-slate-900">Admin</span>
            </div>
            <nav className="space-y-2 p-6">
                {ADMIN_LINKS.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                            isActive(link.href)
                                ? "bg-indigo-500 text-white shadow-md"
                                : "text-slate-700 hover:bg-slate-100"
                        }`}
                    >
                        <span>{link.icon}</span>
                        {link.label}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}
