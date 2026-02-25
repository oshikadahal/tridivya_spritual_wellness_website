"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import UserProfileEditForm from "../_components/UserProfileEditForm";

interface UserProfile {
  _id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  imageUrl?: string;
  role: string;
}

export default function EditProfilePage() {
  const { user: authUser, isAuthenticated } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (isAuthenticated && authUser) {
      setUser(authUser as any);
    }
    setLoading(false);
  }, [isAuthenticated, authUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-900 text-lg font-semibold mb-4">User data not found</p>
          <Link href="/profile" className="text-indigo-600 hover:underline">
            Back to profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/profile" className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Edit Profile</h1>
          <div className="w-24" /> {/* Spacer for alignment */}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
          <UserProfileEditForm user={user} />
        </div>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Tip:</span> Update your profile information and profile picture. Changes are saved immediately after clicking "Save Changes".
          </p>
        </div>
      </div>
    </div>
  );
}
