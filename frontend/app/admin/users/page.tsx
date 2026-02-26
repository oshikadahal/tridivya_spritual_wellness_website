"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "@/lib/api/admin";
import { toast } from "react-toastify";
import { Eye, Pencil, Trash2, Plus, Shield, User as UserIcon } from "lucide-react";

interface User {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    username: string;
    role: "user" | "admin";
    imageUrl?: string;
    createdAt: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1,
    });

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";
    const resolveImageUrl = (imageUrl?: string) => {
        if (!imageUrl) return "/default-profile.png";
        if (imageUrl.startsWith("http")) return imageUrl;
        return `${API_BASE_URL}${imageUrl}`;
    };

    const getInitials = (firstName?: string, lastName?: string) => {
        const firstInitial = firstName?.trim()?.charAt(0) || "U";
        const lastInitial = lastName?.trim()?.charAt(0) || "";
        return `${firstInitial}${lastInitial}`.toUpperCase();
    };

    useEffect(() => {
        fetchUsers();
    }, [page]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await getAllUsers(page, limit);
            if (response.success) {
                setUsers(response.data);
                setPagination(response.pagination || {
                    page,
                    limit,
                    total: response.data?.length || 0,
                    totalPages: 1,
                });
            }
        } catch (err) {
            console.error("Failed to fetch users:", err);
            toast.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return;

        try {
            const response = await deleteUser(id);
            if (response.success) {
                await fetchUsers();
                toast.success("User deleted successfully");
            }
        } catch (err: any) {
            toast.error(err.message || "Failed to delete user");
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
                    <p className="text-slate-600 mt-1">View, edit, and manage all registered users</p>
                </div>
                <Link
                    href="/admin/users/create"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                >
                    <Plus size={18} /> Create User
                </Link>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-x-auto">
                {loading ? (
                    <div className="text-center py-10">Loading...</div>
                ) : users.length === 0 ? (
                    <div className="text-center py-10 text-slate-500">No users found</div>
                ) : (
                    <table className="w-full min-w-275">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Username</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Joined</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-600 uppercase min-w-70">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            {imageErrors[user._id] || !user.imageUrl ? (
                                                <div className="w-10 h-10 rounded-full border border-slate-200 bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-600">
                                                    {getInitials(user.firstName, user.lastName)}
                                                </div>
                                            ) : (
                                                <img
                                                    src={resolveImageUrl(user.imageUrl)}
                                                    alt={`${user.firstName} ${user.lastName}`}
                                                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                                                    onError={() =>
                                                        setImageErrors((prev) => ({ ...prev, [user._id]: true }))
                                                    }
                                                />
                                            )}
                                            <div>
                                                <p className="font-medium text-slate-900">
                                                    {user.firstName} {user.lastName}
                                                </p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <p className="text-xs text-slate-500">ID: {user._id.slice(-6)}</p>
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700">
                                                        Profile
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                        {user.username}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                user.role === "admin"
                                                    ? "bg-indigo-100 text-indigo-800"
                                                    : "bg-green-100 text-green-800"
                                            }`}
                                        >
                                            {user.role === "admin" ? <Shield size={12} /> : <UserIcon size={12} />}
                                            {user.role === "admin" ? "Admin" : "User"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm">
                                        <div className="flex items-center justify-end gap-2 min-w-65">
                                            <Link
                                                href={`/admin/users/${user._id}`}
                                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                                            >
                                                <Eye size={14} /> View
                                            </Link>
                                            <Link
                                                href={`/admin/users/${user._id}/edit`}
                                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition"
                                            >
                                                <Pencil size={14} /> Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 transition"
                                            >
                                                <Trash2 size={14} /> Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">
                    Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} users)
                </p>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page <= 1}
                        className="px-3 py-1 rounded border border-slate-200 text-slate-700 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => setPage((prev) => Math.min(prev + 1, pagination.totalPages))}
                        disabled={page >= pagination.totalPages}
                        className="px-3 py-1 rounded border border-slate-200 text-slate-700 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
