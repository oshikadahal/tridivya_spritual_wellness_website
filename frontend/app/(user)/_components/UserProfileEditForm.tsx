"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { updateProfile } from "@/lib/api/auth";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

interface UserProfile {
  _id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  imageUrl?: string;
}

interface UserProfileEditFormProps {
  user: UserProfile;
}

export default function UserProfileEditForm({ user }: UserProfileEditFormProps) {
  const router = useRouter();
  const { setUserData } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(user.imageUrl ? `http://localhost:5051${user.imageUrl}` : null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          image: "Please select a valid image file",
        }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "Image size must be less than 5MB",
        }));
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setErrors((prev) => ({
        ...prev,
        image: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const data = new FormData();
      data.append("firstName", formData.firstName);
      data.append("lastName", formData.lastName);
      data.append("username", formData.username);
      data.append("email", formData.email);

      if (selectedFile) {
        data.append("imageUrl", selectedFile);
      }

      const response = await updateProfile(data);

      if (response.success) {
        // Update auth context
        if (setUserData) {
          setUserData(response.data);
        }
        toast.success("Profile updated successfully!");
        
        // Redirect to profile page after a short delay
        setTimeout(() => {
          router.push("/profile");
        }, 1500);
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    } catch (error: any) {
      console.error("Update profile error:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Picture Section */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Profile preview"
              className="w-32 h-32 rounded-full object-cover border-4 border-indigo-200"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-linear-to-br from-indigo-200 to-indigo-300 flex items-center justify-center border-4 border-indigo-200">
              <span className="text-4xl font-bold text-indigo-600">
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </span>
            </div>
          )}
        </div>

        <label className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 cursor-pointer transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Change Photo
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>

        {errors.image && (
          <p className="text-xs text-red-500">{errors.image}</p>
        )}
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* First Name */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-300"
            placeholder="First name"
          />
          {errors.firstName && (
            <p className="text-xs text-red-500">{errors.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-300"
            placeholder="Last name"
          />
          {errors.lastName && (
            <p className="text-xs text-red-500">{errors.lastName}</p>
          )}
        </div>
      </div>

      {/* Username */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-300"
          placeholder="Username"
        />
        {errors.username && (
          <p className="text-xs text-red-500">{errors.username}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-300"
          placeholder="Email"
        />
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 sm:flex-row flex-col">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition disabled:opacity-60 font-medium"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
