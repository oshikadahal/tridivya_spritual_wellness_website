"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ADMIN_LINKS = [
    { href: "/admin", label: "Dashboard", icon: "📊" },
    { href: "/admin/users", label: "Users", icon: "👥" },
];

export default function Sidebar() {
    const pathname = usePathname();

    const isActive = (href: string) => {
        return href === "/" ? pathname === "/" : pathname?.startsWith(href);
    };

    return (
        <aside className="flex-shrink-0 w-64 bg-gray-900 text-white border-r border-gray-800 overflow-y-auto">
            <div className="flex h-16 items-center gap-3 border-b border-gray-800 px-6 flex-shrink-0">
                <span className="text-lg font-bold">Tridivya Admin</span>
            </div>
            <nav className="space-y-2 p-6">
                {ADMIN_LINKS.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                            isActive(link.href)
                                ? "bg-cyan-600 text-white"
                                : "text-gray-300 hover:bg-gray-800"
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
