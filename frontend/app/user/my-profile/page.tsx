
"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLogoutModal } from "@/context/LogoutModalContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5051';

const getImageUrl = (imageUrl: string | null | undefined) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${API_BASE_URL}${imageUrl}`;
};

function UserProfile() {
    const { user, isAuthenticated, loading } = useAuth();
    const router = useRouter();
    const { setShowLogoutModal } = useLogoutModal();
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Redirect if not authenticated
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, loading, router]);

    // Initialize preview with user image
    useEffect(() => {
        if (user) {
            if (user.imageUrl) {
                setImagePreview(getImageUrl(user.imageUrl));
            } else {
                setImagePreview(null);
            }
        }
    }, [user]);

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

    if (!isAuthenticated || !user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-linear-to-b from-slate-50 to-white text-slate-900 py-8 px-2 md:px-6">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Profile Card */}
                <div className="flex flex-col md:flex-row items-center md:items-start bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 gap-6">
                    <div className="flex items-center gap-6 flex-1">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-violet-100 shadow-sm">
                            {imagePreview ? (
                                <img src={imagePreview} alt={user.firstName} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-violet-100 to-indigo-100 text-5xl font-bold text-violet-700">
                                    {user.firstName?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || "U"}
                                </div>
                            )}
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{user.firstName} {user.lastName}</h2>
                            </div>
                            <div className="text-slate-600 text-lg">@{user.username}</div>
                            <div className="text-slate-500 text-sm">{user.email}</div>
                            <div className="mt-2">
                                <span className="inline-block bg-linear-to-r from-violet-500 to-indigo-500 text-white px-4 py-1 rounded-lg text-xs font-semibold shadow-sm">Premium Member</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 md:mt-0 md:ml-auto">
                        <button
                            className="session-btn-primary text-white px-8 py-3 rounded-xl font-semibold shadow-sm"
                            onClick={() => router.push("/profile-edit")}
                        >
                            Edit Profile
                        </button>
                    </div>
                </div>

                {/* Account Details Card */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
                    <h3 className="text-xl font-semibold text-slate-900 mb-4">Account Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-slate-600 text-sm font-semibold mb-1">First Name</label>
                            <input type="text" value={user.firstName || ""} disabled className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900" />
                        </div>
                        <div>
                            <label className="block text-slate-600 text-sm font-semibold mb-1">Last Name</label>
                            <input type="text" value={user.lastName || ""} disabled className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900" />
                        </div>
                        <div>
                            <label className="block text-slate-600 text-sm font-semibold mb-1">Email</label>
                            <input type="email" value={user.email || ""} disabled className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900" />
                        </div>
                        <div>
                            <label className="block text-slate-600 text-sm font-semibold mb-1">Username</label>
                            <input type="text" value={user.username || ""} disabled className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900" />
                        </div>
                    </div>
                </div>

                {/* Security Settings Card */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-4">
                    <h3 className="text-xl font-semibold text-slate-900 mb-4">Security Settings</h3>
                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={() => router.push("/user/change-password")}
                            className="flex items-center gap-2 px-6 py-3 border border-slate-300 rounded-xl text-slate-700 font-semibold hover:bg-slate-50 transition"
                        >
                            <span className="text-lg">🔒</span> Change Password
                        </button>
                        <button
                            onClick={() => setShowLogoutModal(true)}
                            className="flex items-center gap-2 px-6 py-3 border border-red-200 bg-red-50 text-red-700 rounded-xl font-semibold hover:bg-red-100 transition"
                        >
                            <span className="text-lg">❗</span> Log Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default UserProfile;

