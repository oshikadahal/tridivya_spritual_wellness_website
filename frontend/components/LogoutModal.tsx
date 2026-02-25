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
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm px-4"
      onClick={() => setShowLogoutModal(false)}
    >
      <div
        className="w-full max-w-md rounded-3xl border border-slate-200 bg-white px-6 py-7 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H9" />
              <path d="M15 12H3" />
              <path d="m7 16-4-4 4-4" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold leading-tight text-slate-900">Log out of your account?</h2>
          <p className="mt-3 text-base leading-7 text-slate-500 max-w-xs">
            You will need to sign in again to access your account.
          </p>

          <div className="mt-6 w-full rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <div className="grid grid-cols-2 gap-3">
              <button
                className="h-11 rounded-xl border border-slate-200 bg-white text-base font-semibold text-slate-700 transition hover:bg-slate-100"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button
                className="h-11 rounded-xl bg-linear-to-r from-red-500 to-rose-500 text-base font-semibold text-white shadow-sm transition hover:from-red-600 hover:to-rose-600"
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
