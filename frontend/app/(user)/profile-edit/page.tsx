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
      <div className="min-h-screen bg-linear-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-linear-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-900 text-lg font-semibold mb-4">User data not found</p>
          <Link href="/profile" className="text-violet-600 hover:text-violet-700">
            Back to profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white text-slate-900">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/profile" className="text-violet-600 hover:text-violet-700 font-medium flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Edit Profile</h1>
          <div className="w-24" /> {/* Spacer for alignment */}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 md:p-10">
          <UserProfileEditForm user={user} />
        </div>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-violet-50 border border-violet-200 rounded-2xl">
          <p className="text-sm text-violet-700">
            <span className="font-semibold">Tip:</span> Update your profile information and profile picture. Changes are saved immediately after clicking "Save Changes".
          </p>
        </div>
      </div>
    </div>
  );
}
