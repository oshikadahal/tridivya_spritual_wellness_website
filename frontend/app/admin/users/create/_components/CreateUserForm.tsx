"use client";

import { Controller, useForm } from "react-hook-form";
import { UserData, UserSchema } from "../../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { handleCreateUser } from "@/lib/actions/admin-action";
import { useRouter } from "next/navigation";

export default function CreateUserForm() {
    const [pending, startTransition] = useTransition();
    const router = useRouter();
    const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<UserData>({
        resolver: zodResolver(UserSchema)
    });
    const [error, setError] = useState<string | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (file: File | undefined, onChange: (file: File | undefined) => void) => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
        }
        onChange(file);
    };

    const handleDismissImage = (onChange?: (file: File | undefined) => void) => {
        setPreviewImage(null);
        onChange?.(undefined);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const onSubmit = async (data: UserData) => {
        setError(null);
        try {
            const formData = new FormData();
            formData.append("email", data.email);
            formData.append("password", data.password);
            formData.append("firstName", data.firstName);
            formData.append("lastName", data.lastName);
            formData.append("username", data.username);
            formData.append("role", data.role);
            if (data.image) {
                formData.append("imageUrl", data.image);
            }

            startTransition(async () => {
                const result = await handleCreateUser(formData);
                if (result.success) {
                    toast.success(result.message);
                    reset();
                    setPreviewImage(null);
                    router.push("/admin/users");
                } else {
                    setError(result.message);
                    toast.error(result.message);
                }
            });
        } catch (err: any) {
            const errorMessage = err.message || "Failed to create user";
            setError(errorMessage);
            toast.error(errorMessage);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700 text-sm">{error}</p>
                </div>
            )}

            {/* Profile Image */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Profile Image</label>
                {previewImage ? (
                    <div className="relative w-24 h-24">
                        <img
                            src={previewImage}
                            alt="Preview"
                            className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500"
                        />
                        <Controller
                            name="image"
                            control={control}
                            render={({ field: { onChange } }) => (
                                <button
                                    type="button"
                                    onClick={() => handleDismissImage(onChange)}
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                                >
                                    ✕
                                </button>
                            )}
                        />
                    </div>
                ) : (
                    <div className="w-full">
                        <Controller
                            name="image"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-indigo-500 transition">
                                    <div className="text-center">
                                        <span className="text-2xl">📷</span>
                                        <p className="text-sm text-slate-700">Click to upload image</p>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            handleImageChange(file, onChange);
                                        }}
                                    />
                                </label>
                            )}
                        />
                    </div>
                )}
                {errors.image && (
                    <p className="text-xs text-red-500">{errors.image.message}</p>
                )}
            </div>

            {/* Email */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Email</label>
                <input
                    type="email"
                    placeholder="user@example.com"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                    {...register("email")}
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            {/* First Name */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">First Name</label>
                <input
                    type="text"
                    placeholder="John"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                    {...register("firstName")}
                />
                {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
            </div>

            {/* Last Name */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Last Name</label>
                <input
                    type="text"
                    placeholder="Doe"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                    {...register("lastName")}
                />
                {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
            </div>

            {/* Username */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Username</label>
                <input
                    type="text"
                    placeholder="johndoe"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                    {...register("username")}
                />
                {errors.username && <p className="text-xs text-red-500">{errors.username.message}</p>}
            </div>

            {/* Role */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Role</label>
                <select
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                    {...register("role")}
                >
                    <option value="user">👤 User</option>
                    <option value="admin">🛡️ Admin</option>
                </select>
                {errors.role && <p className="text-xs text-red-500">{errors.role.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <input
                    type="password"
                    placeholder="Enter password"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                    {...register("password")}
                />
                {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Confirm Password</label>
                <input
                    type="password"
                    placeholder="Confirm password"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                    {...register("confirmPassword")}
                />
                {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
                <button
                    type="submit"
                    disabled={isSubmitting || pending}
                    className="flex-1 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting || pending ? "Creating..." : "Create User"}
                </button>
                <Link
                    href="/admin/users"
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                    Cancel
                </Link>
            </div>
        </form>
    );
}
