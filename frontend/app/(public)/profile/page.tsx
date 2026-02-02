"use client";

import { useEffect, useState } from "react";
import { getUserData, getAuthToken } from "@/lib/cookie";
import Link from "next/link";
import axiosInstance from "@/lib/api/axios";

interface UserData {
  _id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  imageUrl?: string;
  role: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = await getAuthToken();
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axiosInstance.get("/api/auth/whoami", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setUser(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Fallback to cookie data if API fails
        const userData = await getUserData();
        setUser(userData);
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>User data not found</p>
      </div>
    );
  }

  const fullName = `${user.firstName} ${user.lastName}`;
  const profileImage = user.imageUrl ? `http://localhost:5050${user.imageUrl}` : null;

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← Back
          </Link>
          <h1 className="text-3xl font-bold">Profile</h1>
          <button className="text-gray-600 hover:text-gray-900">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

        {/* Profile Section */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          {/* Profile Picture and Name */}
          <div className="flex flex-col items-center mb-8">
            {profileImage ? (
              <img
                src={profileImage}
                alt={fullName}
                className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-gray-200"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-linear-to-br from-blue-200 to-blue-300 mb-4 flex items-center justify-center border-4 border-gray-200">
                <span className="text-3xl font-bold text-blue-600">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </span>
              </div>
            )}
            <h2 className="text-2xl font-bold text-gray-900">{fullName}</h2>
            <p className="text-gray-600 text-sm">@{user.username}</p>
          </div>

          {/* Camera/Upload Button */}
          <div className="flex justify-center mb-8">
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-full cursor-pointer hover:bg-blue-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Change Photo
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file || !user) return;

                  try {
                    const token = await getAuthToken();
                    const formData = new FormData();
                    formData.append("image", file);

                    const response = await axiosInstance.put(
                      "/api/auth/update-profile",
                      formData,
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                          "Content-Type": "multipart/form-data",
                        },
                      }
                    );

                    if (response.data.success) {
                      setUser(response.data.data);
                      alert("Profile picture updated successfully!");
                    }
                  } catch (error: any) {
                    console.error("Error uploading image:", error);
                    alert(error.response?.data?.message || "Failed to upload image");
                  }
                }}
              />
            </label>
          </div>

          {/* User Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 pt-8 border-t border-gray-200">
            <div>
              <label className="text-sm font-semibold text-gray-600">Email</label>
              <p className="text-gray-900 mt-1">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">Username</label>
              <p className="text-gray-900 mt-1">{user.username}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">First Name</label>
              <p className="text-gray-900 mt-1">{user.firstName}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">Last Name</label>
              <p className="text-gray-900 mt-1">{user.lastName}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">Role</label>
              <p className="text-gray-900 mt-1 capitalize">{user.role}</p>
            </div>
          </div>

          {/* Edit Profile Button */}
          <button className="w-full py-2 px-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold">
            Edit Profile
          </button>
        </div>

        {/* My Journey Section */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h3 className="text-lg font-bold mb-4">My Journey</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">15</p>
              <p className="text-xs text-gray-600 mt-2">Sessions Completed</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">30</p>
              <p className="text-xs text-gray-600 mt-2">Hours Meditated</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">10</p>
              <p className="text-xs text-gray-600 mt-2">Mantras Practiced</p>
            </div>
          </div>
        </div>

        {/* Saved Sessions Section */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h3 className="text-lg font-bold mb-4">Saved Sessions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-linear-to-br from-teal-200 to-teal-300 rounded-lg h-32"></div>
            <div className="bg-linear-to-br from-blue-200 to-blue-300 rounded-lg h-32"></div>
            <div className="bg-linear-to-br from-orange-200 to-orange-300 rounded-lg h-32"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2 text-sm text-gray-600">
            <p>Morning Yoga Flow</p>
            <p>Mindfulness Meditation</p>
            <p>Gratitude Practice</p>
          </div>
        </div>
      </div>
    </div>
  );
}
