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

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";
    const resolveImageUrl = (imageUrl?: string) => {
        if (!imageUrl) return "/default-profile.png";
        if (imageUrl.startsWith("http")) return imageUrl;
        return `${API_BASE_URL}${imageUrl}`;
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await getAllUsers();
            if (response.success) {
                setUsers(response.data);
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
                setUsers(users.filter(u => u._id !== id));
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
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="text-center py-10">Loading...</div>
                ) : users.length === 0 ? (
                    <div className="text-center py-10 text-slate-500">No users found</div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Username</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Joined</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-600 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={resolveImageUrl(user.imageUrl)}
                                                alt={`${user.firstName} ${user.lastName}`}
                                                className="w-10 h-10 rounded-full object-cover border border-slate-200"
                                            />
                                            <div>
                                                <p className="font-medium text-slate-900">
                                                    {user.firstName} {user.lastName}
                                                </p>
                                                <p className="text-xs text-slate-500">ID: {user._id.slice(-6)}</p>
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
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                        <div className="inline-flex items-center gap-2">
                                            <Link
                                                href={`/admin/users/${user._id}`}
                                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                                            >
                                                <Eye size={14} /> View
                                            </Link>
                                            <Link
                                                href={`/admin/users/${user._id}/edit`}
                                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition"
                                            >
                                                <Pencil size={14} /> Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 transition"
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
        </div>
    );
}
