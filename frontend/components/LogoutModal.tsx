"use client";
import React from "react";
import { useLogoutModal } from "@/context/LogoutModalContext";
import { useAuth } from "@/context/AuthContext";

export default function LogoutModal() {
  const { showLogoutModal, setShowLogoutModal } = useLogoutModal();
  const { logout } = useAuth();

  const handleLogout = async () => {
    setShowLogoutModal(false);
    await logout();
  };

  if (!showLogoutModal) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/10"
      onClick={() => setShowLogoutModal(false)}
    >
      <div
        className="w-96 rounded-xl bg-[#f7f7fa] px-5 py-4 shadow-[0_16px_36px_rgba(15,23,42,0.24)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#f4e9ee]">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="#c93b4a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H9" />
              <path d="M15 12H3" />
              <path d="m7 16-4-4 4-4" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold leading-tight text-[#1f2638]">Log out of your account?</h2>
          <p className="mt-2 text-sm font-medium leading-6 text-[#6a7286]">
            You will need to sign in again to access your account.
          </p>

          <div className="mt-4 w-full rounded-xl border border-[#e6e8ef] bg-[#f8f9fc] p-2.5">
            <div className="grid grid-cols-2 gap-3">
              <button
                className="h-10 rounded-lg border border-[#d8dbe3] bg-[#e9ebf0] text-base font-semibold leading-none text-[#3f4658] transition hover:bg-[#e3e6ed]"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button
                className="h-10 rounded-lg bg-linear-to-r from-[#c43b4d] to-[#d24557] text-base font-semibold leading-none text-white shadow-[0_8px_20px_rgba(196,59,77,0.35)] transition hover:brightness-105"
                onClick={handleLogout}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
