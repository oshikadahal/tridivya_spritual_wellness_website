"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getAdminProfile, updateAdminProfile, deleteAdminProfilePicture } from "@/lib/api/admin";
import { Camera, Trash2, Upload, X, Loader } from "lucide-react";
import { toast } from "react-toastify";

interface AdminProfileData {
    _id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    imageUrl?: string;
    role: string;
}

export default function AdminProfile() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<AdminProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Form fields
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
    });

    useEffect(() => {
        fetchAdminProfile();
    }, []);

    const fetchAdminProfile = async () => {
        try {
            setLoading(true);
            const response = await getAdminProfile();
            if (response.success) {
                setProfile(response.data);
                setFormData({
                    firstName: response.data.firstName || "",
                    lastName: response.data.lastName || "",
                    username: response.data.username || "",
                    email: response.data.email || "",
                });
            }
        } catch (err: any) {
            console.error("Error fetching profile:", err);
            toast.error("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUpdateProfile = async () => {
        try {
            setUpdating(true);
            const formDataObj = new FormData();

            // Add text fields
            if (formData.firstName) formDataObj.append("firstName", formData.firstName);
            if (formData.lastName) formDataObj.append("lastName", formData.lastName);
            if (formData.username) formDataObj.append("username", formData.username);
            if (formData.email) formDataObj.append("email", formData.email);

            // Add image if selected
            if (selectedFile) {
                formDataObj.append("imageUrl", selectedFile);
            }

            const response = await updateAdminProfile(formDataObj);
            if (response.success) {
                setProfile(response.data);
                toast.success("Profile updated successfully");
                setShowModal(false);
                setSelectedFile(null);
                setPreviewImage(null);
            }
        } catch (err: any) {
            console.error("Error updating profile:", err);
            toast.error(err.message || "Failed to update profile");
        } finally {
            setUpdating(false);
        }
    };

    const handleDeleteProfilePicture = async () => {
        if (!confirm("Are you sure you want to delete your profile picture?")) return;

        try {
            setUpdating(true);
            const response = await deleteAdminProfilePicture();
            if (response.success) {
                setProfile(response.data);
                toast.success("Profile picture deleted successfully");
            }
        } catch (err: any) {
            console.error("Error deleting profile picture:", err);
            toast.error(err.message || "Failed to delete profile picture");
        } finally {
            setUpdating(false);
        }
    };

    const handleOpenModal = () => {
        setShowModal(true);
        setPreviewImage(profile?.imageUrl || null);
        setSelectedFile(null);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setPreviewImage(null);
        setSelectedFile(null);
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-8 border border-slate-200 flex items-center justify-center">
                <Loader className="animate-spin text-indigo-600" size={32} />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-8 border border-slate-200">
                <p className="text-slate-600">Failed to load profile</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm p-8 border border-slate-200">
            <div className="flex items-center gap-6">
                {/* Profile Picture Section */}
                <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center overflow-hidden border-4 border-slate-200">
                        {profile.imageUrl ? (
                            <img
                                src={profile.imageUrl}
                                alt={profile.username}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="text-white text-4xl font-bold">
                                {profile.firstName?.[0]?.toUpperCase() || profile.username?.[0]?.toUpperCase() || "A"}
                            </div>
                        )}
                    </div>

                    {/* Action Buttons Overlay */}
                    <div className="absolute bottom-2 right-2 flex gap-2">
                        <button
                            onClick={handleOpenModal}
                            className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition shadow-lg"
                            title="Edit profile"
                        >
                            <Camera size={18} />
                        </button>
                        {profile.imageUrl && (
                            <button
                                onClick={handleDeleteProfilePicture}
                                disabled={updating}
                                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition shadow-lg disabled:opacity-50"
                                title="Delete profile picture"
                            >
                                <Trash2 size={18} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Profile Information */}
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-slate-900">
                        {profile.firstName} {profile.lastName}
                    </h2>
                    <p className="text-slate-600">@{profile.username}</p>
                    <p className="text-slate-500 text-sm mt-2">{profile.email}</p>
                    <div className="mt-4 flex items-center gap-2">
                        <span className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">
                            {profile.role?.toUpperCase()}
                        </span>
                    </div>
                </div>
            </div>

            {/* Modal for Update */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-slate-900">Update Profile</h3>
                            <button
                                onClick={handleCloseModal}
                                className="text-slate-500 hover:text-slate-700"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Image Preview */}
                        {(previewImage || profile.imageUrl) && (
                            <div className="mb-6">
                                <div className="w-full h-40 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden">
                                    {previewImage ? (
                                        <img
                                            src={previewImage}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <img
                                            src={profile.imageUrl}
                                            alt={profile.username}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                            </div>
                        )}

                        {/* File Input */}
                        <div className="mb-6">
                            <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-indigo-300 rounded-lg cursor-pointer hover:border-indigo-500 transition">
                                <div className="flex items-center gap-2 text-indigo-600">
                                    <Upload size={20} />
                                    <span className="text-sm font-medium">
                                        {selectedFile ? "Change Image" : "Upload Image"}
                                    </span>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                    className="hidden"
                                />
                            </label>
                            {selectedFile && (
                                <p className="text-xs text-slate-600 mt-2">
                                    Selected: {selectedFile.name}
                                </p>
                            )}
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleCloseModal}
                                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateProfile}
                                disabled={updating}
                                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {updating && <Loader size={18} className="animate-spin" />}
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
