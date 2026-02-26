"use client";

import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { updateProfile } from "@/lib/api/auth";
import { useAuth } from "@/context/AuthContext";

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
  const { setUserData } = useAuth();
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(user.imageUrl ? `http://localhost:5050${user.imageUrl}` : null);
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

  const processSelectedImage = (file?: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        image: "Please select a valid image file",
      }));
      return;
    }

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
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processSelectedImage(e.target.files?.[0]);
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
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Profile Picture Section */}
      <div className="flex flex-col items-center space-y-4 pb-2">
        <div className="relative">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt={fullName}
              className="w-32 h-32 rounded-full object-cover border-4 border-violet-100 shadow-sm"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-linear-to-br from-violet-100 to-indigo-100 flex items-center justify-center border-4 border-violet-100 shadow-sm">
              <span className="text-4xl font-bold text-violet-700">
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl session-btn-primary text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2 1.586-1.586a2 2 0 012.828 0L20 14m-6-10h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Choose from Gallery
          </button>
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-800 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Open Camera
          </button>
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="user"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {errors.image && (
          <p className="text-xs text-red-500">{errors.image}</p>
        )}
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* First Name */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-700">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-violet-300"
            placeholder="First name"
          />
          {errors.firstName && (
            <p className="text-xs text-red-500">{errors.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-700">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-violet-300"
            placeholder="Last name"
          />
          {errors.lastName && (
            <p className="text-xs text-red-500">{errors.lastName}</p>
          )}
        </div>
      </div>

      {/* Username */}
      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-700">Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-violet-300"
          placeholder="Username"
        />
        {errors.username && (
          <p className="text-xs text-red-500">{errors.username}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-700">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-violet-300"
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
          className="flex-1 px-4 py-3 rounded-xl session-btn-primary text-white disabled:opacity-60 font-semibold"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="flex-1 px-4 py-3 bg-slate-100 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-200 transition font-semibold"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
