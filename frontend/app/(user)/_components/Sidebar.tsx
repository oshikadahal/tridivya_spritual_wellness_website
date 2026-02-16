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
    LogOut 
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Play, label: "Meditation Videos", href: "/meditationvideos" },
    { icon: Dumbbell, label: "Yoga Programs", href: "/yogaprograms" },
    { icon: BookOpen, label: "Mantra Library", href: "/mantraprogram" },
    { icon: Heart, label: "Saved Sessions", href: "/saved" },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut({ redirect: false });
        router.push("/login");
    };

    return (
        <aside className="w-64 min-h-screen bg-gradient-to-b from-purple-100 to-purple-50 border-r border-purple-200 flex flex-col">
            {/* Logo */}
            <div className="p-6">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xl">T</span>
                    </div>
                    <span className="font-bold text-xl text-gray-800">Tridivya</span>
                </div>
            </div>

            {/* Menu Section */}
            <div className="flex-1 px-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">
                    Menu
                </p>
                <nav className="space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
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
            <div className="p-4 space-y-1">
                <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-purple-200/50 transition-all"
                >
                    <Settings className="w-5 h-5" />
                    <span className="font-medium text-sm">Settings</span>
                </Link>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium text-sm">Logout</span>
                </button>
            </div>
        </aside>
    );
}
