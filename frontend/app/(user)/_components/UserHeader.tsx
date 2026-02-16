import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Search, Bell } from "lucide-react";



export default function UserHeader() {
  const { user } = useAuth();
  return (
    <header className="w-full bg-transparent px-8 pt-6 flex items-center justify-end">
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
          <button
            className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold transition hover:shadow-lg hover:scale-110 focus:outline-none cursor-pointer border border-purple-700"
            title="Go to My Profile"
            style={{ padding: 0, border: 'none', background: 'none' }}
            onClick={() => window.location.href = '/user/my-profile'}
          >
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </button>
        </div>
      </div>
    </header>
  );
}
