"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Search, Bell } from "lucide-react";

export default function UserHeader() {
  const { user } = useAuth();
  const router = useRouter();

  const initials = `${user?.firstName?.[0] ?? "U"}${user?.lastName?.[0] ?? ""}`;

  return (
    <header className="w-full bg-transparent px-4 md:px-8 py-3 md:py-4 flex items-center justify-between">
      <button
        onClick={() => router.push("/search")}
        aria-label="Search"
        className="hidden md:flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 shadow-sm hover:shadow-md transition max-w-xs text-slate-500"
      >
        <Search className="w-5 h-5" />
        <span className="text-sm">Search content...</span>
      </button>

      <div className="flex items-center gap-2 md:gap-3">
        <button
          onClick={() => router.push("/search")}
          aria-label="Search"
          className="md:hidden w-9 h-9 md:w-10 md:h-10 bg-white border border-slate-200 rounded-full shadow-sm flex items-center justify-center hover:shadow-md transition"
        >
          <Search className="w-5 h-5 text-slate-600" />
        </button>

        <button
          aria-label="Notifications"
          className="w-9 h-9 md:w-10 md:h-10 bg-white border border-slate-200 rounded-full shadow-sm flex items-center justify-center hover:shadow-md transition"
        >
          <Bell className="w-5 h-5 text-slate-600" />
        </button>

        <button
          aria-label="Profile"
          onClick={() => router.push("/user/my-profile")}
          className="flex items-center gap-2 md:gap-3 bg-white border border-slate-200 rounded-full px-2.5 md:px-3 py-1.5 md:py-2 shadow-sm hover:shadow-md transition"
        >
          <span className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold text-sm">
            {initials}
          </span>
          <span className="text-sm font-medium text-slate-700">{user?.firstName ?? "User"}</span>
        </button>
      </div>
    </header>
  );
}
