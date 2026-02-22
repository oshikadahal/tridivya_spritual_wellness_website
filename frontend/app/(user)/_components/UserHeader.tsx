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
    <header className="w-full bg-transparent px-8 pt-6 flex items-center justify-end">
      <div className="flex items-center gap-3">
        <button
          aria-label="Notifications"
          className="w-10 h-10 bg-white border border-slate-200 rounded-full shadow-sm flex items-center justify-center hover:shadow-md transition"
        >
          <Bell className="w-5 h-5 text-slate-600" />
        </button>

        <button
          aria-label="Profile"
          onClick={() => router.push("/user/my-profile")}
          className="flex items-center gap-3 bg-white border border-slate-200 rounded-full px-3 py-2 shadow-sm hover:shadow-md transition"
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
