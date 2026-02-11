import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Search, Bell } from "lucide-react";

const navItems = [
  { label: "Home", href: "/dashboard" },
  { label: "Explore", href: "/explore" },
  { label: "Sessions", href: "/sessions" },
  { label: "Mantras", href: "/mantras" },
  { label: "Yoga", href: "/yoga" },
];

export default function UserHeader() {
  const { user } = useAuth();
  return (
    <header className="w-full bg-transparent px-8 pt-6 flex items-center justify-between">
      <nav className="flex gap-6">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-gray-700 hover:text-purple-700 font-medium text-base transition"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-purple-200 rounded-full transition">
          <Search className="w-5 h-5 text-gray-700" />
        </button>
        <button className="p-2 hover:bg-purple-200 rounded-full transition relative">
          <Bell className="w-5 h-5 text-gray-700" />
        </button>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-gray-600">PREMIUM MEMBER</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
        </div>
      </div>
    </header>
  );
}
