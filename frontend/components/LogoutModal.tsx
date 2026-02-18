"use client";
import React from "react";
import { useLogoutModal } from "@/context/LogoutModalContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LogoutModal() {
  const { showLogoutModal, setShowLogoutModal } = useLogoutModal();
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    setShowLogoutModal(false);
    await logout();
    router.push("/auth/login");
  };

  if (!showLogoutModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
          onClick={() => setShowLogoutModal(false)}
          aria-label="Close"
        >
          &times;
        </button>
        <div className="flex flex-col items-center">
          <div className="bg-red-100 rounded-full p-4 mb-4 flex items-center justify-center">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#fee2e2" />
              <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <circle cx="12" cy="16" r="1" fill="currentColor" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-center text-gray-900">Are you sure you want to log out?</h2>
          <p className="text-gray-600 mb-6 text-center">You will be logged out of your account.</p>
          <div className="flex gap-4 w-full">
            <button
              className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition"
              onClick={() => setShowLogoutModal(false)}
            >
              Cancel
            </button>
            <button
              className="flex-1 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
