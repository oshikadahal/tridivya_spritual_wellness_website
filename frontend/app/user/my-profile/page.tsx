
"use client";


import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { handleUpdateProfile } from "@/lib/actions/auth-action";
import { deleteUserProfilePicture } from "@/lib/api/auth";
import { toast } from "react-toastify";
import { Trash2, Camera, ArrowLeft, Loader } from "lucide-react";
import { useLogoutModal } from "@/context/LogoutModalContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5051';

const getImageUrl = (imageUrl: string | null | undefined) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${API_BASE_URL}${imageUrl}`;
};

function UserProfile() {
    const { user, isAuthenticated, loading, setUser } = useAuth();
    const router = useRouter();
    const { setShowLogoutModal } = useLogoutModal();
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
                setImagePreview(getImageUrl(user.imageUrl));
            }
        }
    }, [user]);


    // Handle image file input and preview
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
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

    // Handle form submit with FormData (image upload)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setSaving(true);
        try {
            const data = new FormData();
            data.append("firstName", formData.firstName);
            data.append("lastName", formData.lastName);
            data.append("email", formData.email);
            data.append("username", formData.username);
            if (imageFile) data.append("image", imageFile); // 'image' key for backend multer
            const result = await handleUpdateProfile(data);
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
        <div className="min-h-screen bg-[#F4F0FF] py-8 px-2 md:px-8">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Profile Card */}
                <div className="flex flex-col md:flex-row items-center md:items-start bg-white rounded-2xl shadow-md p-8 gap-8">
                    <div className="flex items-center gap-6 flex-1">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md">
                            {imagePreview ? (
                                <img src={imagePreview} alt={user.firstName} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-purple-200 text-5xl font-bold text-purple-700">
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
                                <span className="inline-block bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-1 rounded-lg text-xs font-semibold shadow">Premium Member</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 md:mt-0 md:ml-auto">
                        <button
                            className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-8 py-3 rounded-lg font-semibold shadow hover:from-purple-600 hover:to-indigo-600 transition"
                            onClick={() => setIsEditing(true)}
                        >
                            Edit Profile
                        </button>
                    </div>
                </div>

                {/* Account Details Card */}
                <div className="bg-white rounded-2xl shadow-md p-8 space-y-6">
                    <h3 className="text-xl font-semibold text-slate-900 mb-4">Account Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-slate-600 text-sm font-semibold mb-1">First Name</label>
                            <input type="text" value={user.firstName || ""} disabled className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900" />
                        </div>
                        <div>
                            <label className="block text-slate-600 text-sm font-semibold mb-1">Last Name</label>
                            <input type="text" value={user.lastName || ""} disabled className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900" />
                        </div>
                        <div>
                            <label className="block text-slate-600 text-sm font-semibold mb-1">Email</label>
                            <input type="email" value={user.email || ""} disabled className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900" />
                        </div>
                        <div>
                            <label className="block text-slate-600 text-sm font-semibold mb-1">Username</label>
                            <input type="text" value={user.username || ""} disabled className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900" />
                        </div>
                    </div>
                </div>

                {/* Security Settings Card */}
                <div className="bg-white rounded-2xl shadow-md p-8 space-y-4">
                    <h3 className="text-xl font-semibold text-slate-900 mb-4">Security Settings</h3>
                    <div className="flex flex-wrap gap-4">
                        <button className="flex items-center gap-2 px-6 py-3 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition">
                            <span className="text-lg">🔒</span> Change Password
                        </button>
                        <button
                            onClick={() => setShowLogoutModal(true)}
                            className="flex items-center gap-2 px-6 py-3 border border-red-200 bg-red-50 text-red-700 rounded-lg font-medium hover:bg-red-100 transition"
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

