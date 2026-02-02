"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getAllUsers } from "@/lib/api/admin";
import { useAuth } from "@/context/AuthContext";

interface DashboardStats {
    totalUsers: number;
    adminUsers: number;
    regularUsers: number;
}

export default function AdminDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState<DashboardStats>({
        totalUsers: 0,
        adminUsers: 0,
        regularUsers: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await getAllUsers();
            if (response.success) {
                const users = response.data;
                setStats({
                    totalUsers: users.length,
                    adminUsers: users.filter((u: any) => u.role === "admin").length,
                    regularUsers: users.filter((u: any) => u.role === "user").length,
                });
            }
        } catch (err) {
            console.error("Failed to fetch stats:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.firstName || 'Admin'}!</h1>
                <p className="text-gray-600 mt-1">Here's what's happening with your platform</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Users */}
                <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-cyan-500">
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium text-gray-600">Total Users</div>
                        <span className="text-2xl">👥</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">
                        {loading ? "..." : stats.totalUsers}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Registered on platform</p>
                </div>

                {/* Admin Users */}
                <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium text-gray-600">Admin Users</div>
                        <span className="text-2xl">🛡️</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">
                        {loading ? "..." : stats.adminUsers}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Full access granted</p>
                </div>

                {/* Regular Users */}
                <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium text-gray-600">Regular Users</div>
                        <span className="text-2xl">👤</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">
                        {loading ? "..." : stats.regularUsers}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Standard user access</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Manage Users Card */}
                <Link href="/admin/users">
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md hover:border-cyan-300 transition-all cursor-pointer group">
                        <div className="flex items-start gap-4">
                            <div className="bg-cyan-100 p-3 rounded-lg group-hover:bg-cyan-200 transition">
                                <span className="text-2xl">📋</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                    Manage Users
                                </h3>
                                <p className="text-sm text-gray-600 mb-3">
                                    View, edit, and manage all registered users
                                </p>
                                <div className="flex items-center text-sm font-semibold text-cyan-600 group-hover:gap-2 transition-all">
                                    Go to Users
                                    <span className="ml-2">→</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Create User Card */}
                <Link href="/admin/users/create">
                    <div className="bg-linear-to-br from-cyan-600 to-cyan-700 rounded-lg shadow-sm p-6 text-white hover:shadow-md transition-all cursor-pointer group">
                        <div className="flex items-start gap-4">
                            <div className="bg-white/20 p-3 rounded-lg group-hover:scale-110 transition-transform">
                                <span className="text-2xl">➕</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold mb-1">Create New User</h3>
                                <p className="text-sm text-white/90 mb-3">
                                    Add a new user account with custom roles
                                </p>
                                <div className="flex items-center text-sm font-semibold group-hover:gap-2 transition-all">
                                    Create User
                                    <span className="ml-2">→</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}