"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
    LayoutDashboard, 
    Play, 
    Dumbbell, 
    BookOpen, 
    Heart, 
    Settings, 
    LogOut,
    Search
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLogoutModal } from "@/context/LogoutModalContext";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Search, label: "Search", href: "/search" },
    { icon: Play, label: "Meditation Videos", href: "/meditationvideos" },
    { icon: Dumbbell, label: "Yoga Programs", href: "/yogaprograms" },
    { icon: BookOpen, label: "Mantra Library", href: "/mantraprogram" },
    { icon: BookOpen, label: "Wisdom Library", href: "/wisdomlibrary" },
    { icon: Heart, label: "Saved Sessions", href: "/saved" },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { setShowLogoutModal } = useLogoutModal();

    const handleLogout = async () => {
        await signOut({ redirect: false });
        router.push("/login");
        setShowLogoutModal(true);
    };

    return (
        <aside className="w-full md:w-64 md:min-h-screen bg-linear-to-b from-purple-100 to-purple-50 border-b md:border-b-0 md:border-r border-purple-200 flex flex-row md:flex-col items-center md:items-stretch">
            {/* Logo */}
            <div className="p-4 md:p-6 w-full">
                <div className="flex items-center justify-center md:justify-start gap-2">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xl">T</span>
                    </div>
                    <span className="font-bold text-xl text-gray-800">Tridivya</span>
                </div>
            </div>

            {/* Menu Section */}
            <div className="flex-1 px-2 md:px-4 w-full">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">
                    Menu
                </p>
                <nav className="flex md:block gap-1 overflow-x-auto md:overflow-visible whitespace-nowrap md:space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg transition-all ${
                                    isActive
                                        ? "bg-purple-600 text-white shadow-md"
                                        : "text-gray-700 hover:bg-purple-200/50"
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium text-sm">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom Actions */}
            <div className="hidden md:block p-4 space-y-1 w-full">
                <Link
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-purple-200/50 transition-all"
                >
                    <Settings className="w-5 h-5" />
                    <span className="font-medium text-sm">Settings</span>
                </Link>
                <button
                    onClick={() => setShowLogoutModal(true)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium text-sm">Logout</span>
                </button>
            </div>
        </aside>
    );
}
