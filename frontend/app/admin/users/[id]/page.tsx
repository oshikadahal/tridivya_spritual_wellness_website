"use client";

import { useState, useEffect } from "react";
import { getUserById } from "@/lib/api/admin";
import Link from "next/link";
import { use } from "react";
import { ArrowLeft, Mail, Calendar, Shield, User as UserIcon, Pencil } from "lucide-react";

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";
  const resolveImageUrl = (imageUrl?: string) => {
    if (!imageUrl) return "";
    if (imageUrl.startsWith("http")) return imageUrl;
    return `${API_BASE_URL}${imageUrl}`;
  };

  const getInitials = () => {
    const first = user?.firstName?.[0] || "";
    const last = user?.lastName?.[0] || "";
    const initials = `${first}${last}`.toUpperCase();
    return initials || "U";
  };

  useEffect(() => {
    fetchUser();
  }, [resolvedParams.id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setImageError(false);
      const response = await getUserById(resolvedParams.id);
      setUser(response.data);
    } catch (error: any) {
      setError(error.message || "Failed to fetch user");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="mb-4 text-red-600">{error}</div>
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 text-indigo-600 hover:underline"
        >
          <ArrowLeft size={16} /> Back to Users
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-2 text-indigo-600 hover:underline"
      >
        <ArrowLeft size={16} /> Back to Users
      </Link>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-5">
            {!user?.imageUrl || imageError ? (
              <div className="w-24 h-24 rounded-full bg-indigo-100 text-indigo-700 border-2 border-indigo-500 flex items-center justify-center text-2xl font-semibold">
                {getInitials()}
              </div>
            ) : (
              <img
                src={resolveImageUrl(user?.imageUrl)}
                alt={`${user?.firstName || ""} ${user?.lastName || ""}`}
                className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500"
                onError={() => setImageError(true)}
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {user?.firstName} {user?.lastName}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-slate-500">User ID: {user?._id}</p>
                <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-indigo-100 text-indigo-700">
                  Profile
                </span>
              </div>
            </div>
          </div>

          <Link
            href={`/admin/users/${resolvedParams.id}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
          >
            <Pencil size={16} /> Edit User
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="flex items-center gap-3">
            <UserIcon className="text-indigo-400" size={20} />
            <div>
              <p className="text-sm text-slate-500">Username</p>
              <p className="text-slate-900 font-medium">{user?.username || "-"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="text-indigo-400" size={20} />
            <div>
              <p className="text-sm text-slate-500">Email</p>
              <p className="text-slate-900 font-medium">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Shield className="text-indigo-400" size={20} />
            <div>
              <p className="text-sm text-slate-500">Role</p>
              <span
                className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                  user?.role === "admin"
                    ? "bg-indigo-100 text-indigo-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {user?.role}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="text-gray-400" size={20} />
            <div>
              <p className="text-sm text-gray-500">Created At</p>
              <p className="text-gray-900 font-medium">
                {user?.createdAt ? new Date(user.createdAt).toLocaleString() : "-"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="text-gray-400" size={20} />
            <div>
              <p className="text-sm text-gray-500">Updated At</p>
              <p className="text-gray-900 font-medium">
                {user?.updatedAt ? new Date(user.updatedAt).toLocaleString() : "-"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
