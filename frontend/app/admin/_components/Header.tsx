"use client";

import { useAuth } from "@/context/AuthContext";

export default function Header() {
    const { user } = useAuth();
    const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.username || "Admin";
    const avatarInitial = displayName.charAt(0).toUpperCase();

    return (
        <header className="shrink-0 border-b border-slate-200 bg-white">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div />

                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-semibold text-slate-900">{displayName}</p>
                            <p className="text-[10px] font-semibold tracking-wider text-slate-400">PLATFORM ADMIN</p>
                        </div>
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-orange-300 text-white font-semibold text-sm">
                            {avatarInitial}
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
}
