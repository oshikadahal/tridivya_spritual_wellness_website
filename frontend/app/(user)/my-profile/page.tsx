"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { handleUpdateProfile } from "@/lib/actions/auth-action";
import { deleteUserProfilePicture } from "@/lib/api/auth";
import { toast } from "react-toastify";
import { Trash2, Camera, ArrowLeft, Loader } from "lucide-react";

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
        <div className="min-h-screen bg-[#CAD3FF]">
            {/* Header with Back Button */}
            <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors p-2 hover:bg-slate-100 rounded-lg"
                        title="Go back"
                    >
                        <ArrowLeft size={20} />
                        <span className="text-sm font-medium">Back</span>
                    </button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
                        <p className="text-sm text-slate-600">Manage your account information</p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Error & Success Messages */}
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
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 space-y-8">
                        {/* Profile Picture Section */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                            <div className="relative shrink-0">
                                {imagePreview ? (
                                    <div className="w-40 h-40 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center overflow-hidden border-4 border-slate-200">
                                        <img
                                            src={imagePreview}
                                            alt={user.firstName}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-40 h-40 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-5xl font-bold border-4 border-slate-200">
                                        {user.firstName?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || "U"}
                                    </div>
                                )}
                                {/* Icon overlay */}
                                <div className="absolute bottom-2 right-2 flex gap-2">
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transition shadow-lg"
                                        title="Edit profile"
                                    >
                                        <Camera size={20} />
                                    </button>
                                    {imagePreview && (
                                        <button
                                            onClick={handleDeleteProfilePicture}
                                            disabled={saving}
                                            className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition shadow-lg disabled:opacity-50"
                                            title="Delete profile picture"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* User Info */}
                            <div className="flex-1 text-center sm:text-left">
                                <p className="text-3xl font-bold text-slate-900">
                                    {user.firstName} {user.lastName}
                                </p>
                                <p className="text-slate-600 text-lg mt-1">@{user.username}</p>
                                <p className="text-slate-500 text-sm mt-3">{user.email}</p>
                                <div className="mt-4 flex items-center justify-center sm:justify-start gap-2">
                                    <span className="inline-block bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold">
                                        {user.role === "admin" ? "🛡️ Admin" : "👤 User"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* User Info Grid */}
                        <div className="border-t border-slate-200 pt-8">
                            <h2 className="text-lg font-semibold text-slate-900 mb-6">Profile Details</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-slate-50 rounded-lg p-4">
                                    <label className="text-xs font-semibold text-slate-600 uppercase">First Name</label>
                                    <p className="text-lg text-slate-900 font-medium mt-2">{user.firstName || "-"}</p>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-4">
                                    <label className="text-xs font-semibold text-slate-600 uppercase">Last Name</label>
                                    <p className="text-lg text-slate-900 font-medium mt-2">{user.lastName || "-"}</p>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-4">
                                    <label className="text-xs font-semibold text-slate-600 uppercase">Email</label>
                                    <p className="text-lg text-slate-900 font-medium mt-2">{user.email}</p>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-4">
                                    <label className="text-xs font-semibold text-slate-600 uppercase">Username</label>
                                    <p className="text-lg text-slate-900 font-medium mt-2">{user.username}</p>
                                </div>
                            </div>
                        </div>

                        {/* Edit Button */}
                        <div className="flex gap-3 pt-4 border-t border-slate-200">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center gap-2"
                            >
                                <Camera size={20} />
                                Edit Profile
                            </button>
                        </div>
                    </div>
                ) : (
                    // Edit Mode
                    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 space-y-6">
                        {/* Profile Picture Upload */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-700">Profile Picture</label>
                            <div className="flex items-center gap-6">
                                {imagePreview ? (
                                    <div className="w-32 h-32 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center overflow-hidden border-4 border-slate-200">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-32 h-32 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-slate-200">
                                        {user.firstName?.[0]?.toUpperCase() || "U"}
                                    </div>
                                )}
                                <label className="relative cursor-pointer">
                                    <span className="inline-flex items-center gap-2 px-4 py-3 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition font-medium">
                                        <Camera size={18} />
                                        Choose Photo
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
                        <div className="border-t border-slate-200 pt-6 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                                />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4 pt-6 border-t border-slate-200">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                            >
                                {saving ? (
                                    <>
                                        <Loader size={18} className="animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Camera size={18} />
                                        Save Changes
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false);
                                    setError("");
                                    setSuccess("");
                                }}
                                className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
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
