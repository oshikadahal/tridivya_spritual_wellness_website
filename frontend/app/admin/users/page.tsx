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
                    <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-600 mt-1">View, edit, and manage all registered users</p>
                </div>
                <Link
                    href="/admin/users/create"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                >
                    <Plus size={18} /> Create User
                </Link>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="text-center py-10">Loading...</div>
                ) : users.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">No users found</div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={resolveImageUrl(user.imageUrl)}
                                                alt={`${user.firstName} ${user.lastName}`}
                                                className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                            />
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {user.firstName} {user.lastName}
                                                </p>
                                                <p className="text-xs text-gray-500">ID: {user._id.slice(-6)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {user.username}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                user.role === "admin"
                                                    ? "bg-purple-100 text-purple-800"
                                                    : "bg-green-100 text-green-800"
                                            }`}
                                        >
                                            {user.role === "admin" ? <Shield size={12} /> : <UserIcon size={12} />}
                                            {user.role === "admin" ? "Admin" : "User"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                        <div className="inline-flex items-center gap-2">
                                            <Link
                                                href={`/admin/users/${user._id}`}
                                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                                            >
                                                <Eye size={14} /> View
                                            </Link>
                                            <Link
                                                href={`/admin/users/${user._id}/edit`}
                                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
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
