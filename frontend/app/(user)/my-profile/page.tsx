"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { handleUpdateProfile } from "@/lib/actions/auth-action";
import { deleteUserProfilePicture } from "@/lib/api/auth";
import { toast } from "react-toastify";
import { Trash2, Camera } from "lucide-react";

export default function UserProfile() {
    const { user, isAuthenticated, loading, setUser } = useAuth();
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form state
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
    });
    const [imageFile, setImageFile] = useState<File | null>(null);

    // Redirect if not authenticated
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, loading, router]);

    // Initialize form with user data
    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                username: user.username || "",
            });

            if (user.imageUrl) {
                setImagePreview(user.imageUrl);
            }
        }
    }, [user]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeleteProfilePicture = async () => {
        if (!confirm("Are you sure you want to delete your profile picture?")) return;

        try {
            setSaving(true);
            const result = await deleteUserProfilePicture();
            if (result.success) {
                setImagePreview(null);
                setUser(result.data);
                toast.success("Profile picture deleted successfully");
            } else {
                toast.error(result.message || "Failed to delete profile picture");
            }
        } catch (err: any) {
            toast.error(err.message || "Failed to delete profile picture");
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setSaving(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("firstName", formData.firstName);
            formDataToSend.append("lastName", formData.lastName);
            formDataToSend.append("email", formData.email);
            formDataToSend.append("username", formData.username);

            if (imageFile) {
                formDataToSend.append("imageUrl", imageFile);
            }

            const result = await handleUpdateProfile(formDataToSend);

            if (result.success) {
                setUser(result.data);
                setSuccess(result.message);
                setIsEditing(false);
                toast.success(result.message);
            } else {
                setError(result.message);
                toast.error(result.message);
            }
        } catch (err: any) {
            const errorMsg = err.message || "Failed to update profile";
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="text-center py-10">Loading...</div>;
    }

    if (!isAuthenticated || !user) {
        return null;
    }

    return (
        <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                <p className="text-gray-600 mt-1">Manage your account information</p>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-700 text-sm">{success}</p>
                    </div>
                )}

                {!isEditing ? (
                    // View Mode
                    <div className="space-y-6">
                        {/* Profile Picture */}
                        <div className="flex items-start gap-6">
                            <div className="relative">
                                {imagePreview ? (
                                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center overflow-hidden border-4 border-slate-200">
                                        <img
                                            src={imagePreview}
                                            alt={user.firstName}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-slate-200">
                                        {user.firstName?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || "U"}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <p className="text-2xl font-bold text-slate-900">
                                    {user.firstName} {user.lastName}
                                </p>
                                <p className="text-slate-600">@{user.username}</p>
                                <p className="text-slate-500 text-sm mt-2">{user.email}</p>
                                <div className="mt-4 flex items-center gap-2">
                                    <span className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">
                                        {user.role === "admin" ? "🛡️ Admin" : "👤 User"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* User Info Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 rounded-lg p-4">
                                <label className="text-xs font-semibold text-slate-600 uppercase">First Name</label>
                                <p className="text-lg text-slate-900 font-medium mt-1">{user.firstName || "-"}</p>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-4">
                                <label className="text-xs font-semibold text-slate-600 uppercase">Last Name</label>
                                <p className="text-lg text-slate-900 font-medium mt-1">{user.lastName || "-"}</p>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-4">
                                <label className="text-xs font-semibold text-slate-600 uppercase">Email</label>
                                <p className="text-lg text-slate-900 font-medium mt-1">{user.email}</p>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-4">
                                <label className="text-xs font-semibold text-slate-600 uppercase">Username</label>
                                <p className="text-lg text-slate-900 font-medium mt-1">{user.username}</p>
                            </div>
                        </div>

                        {/* Edit and Delete Buttons */}
                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center gap-2"
                            >
                                <Camera size={20} />
                                Edit Profile
                            </button>
                            {imagePreview && (
                                <button
                                    onClick={handleDeleteProfilePicture}
                                    disabled={saving}
                                    className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <Trash2 size={20} />
                                    Delete Photo
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    // Edit Mode
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Profile Picture Upload */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
                            <div className="flex items-center gap-4">
                                {imagePreview ? (
                                    <div className="relative">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-24 h-24 rounded-full object-cover border-2 border-cyan-500"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 border-2 border-gray-300">
                                        👤
                                    </div>
                                )}
                                <label className="relative cursor-pointer">
                                    <span className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium">
                                        📷 Change Photo
                                    </span>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        hidden
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                            >
                                {saving ? "Saving..." : "💾 Save Changes"}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false);
                                    setError("");
                                    setSuccess("");
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
