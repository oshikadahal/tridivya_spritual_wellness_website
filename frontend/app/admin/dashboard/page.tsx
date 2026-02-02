"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getAllUsers } from "@/lib/api/admin";
import { useAuth } from "@/context/AuthContext";
import { Users, TrendingUp, Activity, BarChart3, UserPlus } from "lucide-react";

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
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold text-gray-900">Admin Overview</h1>
                <p className="text-gray-600 mt-2">Welcome back! Here's your wellness platform overview.</p>
            </div>

            {/* Stats Grid - 4 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Practitioners */}
                <div className="bg-linear-to-br from-slate-900 to-slate-800 rounded-xl shadow-sm p-6 border border-slate-700">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-slate-400 font-medium">Total Practitioners</p>
                            <p className="text-4xl font-bold text-white mt-2">{loading ? "..." : stats.totalUsers}</p>
                        </div>
                        <div className="flex items-center gap-1 bg-green-500/20 text-green-400 px-2 py-1 rounded-lg text-xs font-semibold">
                            <span>↑</span>
                            <span>12%</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                        <Users className="text-slate-400" size={16} />
                        <span className="text-xs text-slate-400">Last month</span>
                    </div>
                </div>

                {/* Monthly Revenue */}
                <div className="bg-linear-to-br from-slate-900 to-slate-800 rounded-xl shadow-sm p-6 border border-slate-700">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-slate-400 font-medium">Monthly Revenue</p>
                            <p className="text-4xl font-bold text-white mt-2">$42,150</p>
                        </div>
                        <div className="flex items-center gap-1 bg-green-500/20 text-green-400 px-2 py-1 rounded-lg text-xs font-semibold">
                            <span>↑</span>
                            <span>8.4%</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                        <TrendingUp className="text-slate-400" size={16} />
                        <span className="text-xs text-slate-400">Compared to last month</span>
                    </div>
                </div>

                {/* Active Sessions */}
                <div className="bg-linear-to-br from-slate-900 to-slate-800 rounded-xl shadow-sm p-6 border border-slate-700">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-slate-400 font-medium">Active Sessions</p>
                            <p className="text-4xl font-bold text-white mt-2">1,842</p>
                        </div>
                        <div className="flex items-center gap-1 bg-green-500/20 text-green-400 px-2 py-1 rounded-lg text-xs font-semibold">
                            <span>↑</span>
                            <span>5.2%</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                        <Activity className="text-slate-400" size={16} />
                        <span className="text-xs text-slate-400">Real-time users</span>
                    </div>
                </div>

                {/* New Bookings */}
                <div className="bg-linear-to-br from-slate-900 to-slate-800 rounded-xl shadow-sm p-6 border border-slate-700">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-slate-400 font-medium">New Bookings</p>
                            <p className="text-4xl font-bold text-white mt-2">856</p>
                        </div>
                        <div className="flex items-center gap-1 bg-red-500/20 text-red-400 px-2 py-1 rounded-lg text-xs font-semibold">
                            <span>↓</span>
                            <span>2%</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                        <BarChart3 className="text-slate-400" size={16} />
                        <span className="text-xs text-slate-400">This month</span>
                    </div>
                </div>
            </div>

            {/* Charts and Content Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* User Engagement Trends */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">User Engagement Trends</h2>
                            <p className="text-sm text-gray-600">Meditation minutes consumed daily</p>
                        </div>
                        <button className="text-sm text-gray-600 hover:text-gray-900">Last 30 Days ▼</button>
                    </div>

                    {/* Bar Chart */}
                    <div className="h-64 flex items-end justify-between gap-3 bg-gray-50 rounded-lg p-8">
                        {[35, 48, 42, 65, 72, 58, 78].map((height, i) => (
                            <div key={i} className="flex flex-col items-center flex-1 gap-2">
                                <div
                                    className="w-full bg-linear-to-t from-blue-500 to-blue-400 rounded-sm"
                                    style={{ height: `${height}%`, minHeight: "10px" }}
                                ></div>
                                <p className="text-xs text-gray-600 font-medium">WEEK {i + 1}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Platform Growth Card */}
                <div className="bg-linear-to-br from-blue-600 to-blue-500 rounded-xl shadow-sm p-8 text-white border border-blue-400">
                    <h3 className="text-2xl font-bold mb-2">Platform Growth</h3>
                    <p className="text-blue-100 mb-6">You've reached 85% of your quarterly subscription target. Keep up the aim!</p>
                    <button className="w-full bg-white text-blue-600 font-semibold py-3 rounded-lg hover:bg-blue-50 transition-colors">
                        View Full Report
                    </button>

                    {/* Quick Stats */}
                    <div className="mt-8 pt-8 border-t border-blue-400 space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-blue-100">Target Progress</span>
                            <span className="font-bold">85%</span>
                        </div>
                        <div className="w-full bg-blue-400/30 rounded-full h-2">
                            <div className="bg-white rounded-full h-2 w-[85%]"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        <Link href="/admin/users/create">
                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                                <UserPlus size={20} />
                                New Class
                            </button>
                        </Link>
                        <Link href="/admin/users">
                            <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                                <Users size={20} />
                                Upload Video
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
                        <a href="#" className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
                            View All Records
                        </a>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Activity</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-4 text-gray-900 font-medium">Liam Thompson</td>
                                    <td className="py-4 px-4 text-gray-600">Booked "Morning Vinyasa"</td>
                                    <td className="py-4 px-4">
                                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                                            Confirmed
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-gray-600">2 mins ago</td>
                                </tr>
                                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-4 text-gray-900 font-medium">Sarah Williams</td>
                                    <td className="py-4 px-4 text-gray-600">Completed Session</td>
                                    <td className="py-4 px-4">
                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                                            Active
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-gray-600">15 mins ago</td>
                                </tr>
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-4 text-gray-900 font-medium">Michael Chen</td>
                                    <td className="py-4 px-4 text-gray-600">Updated Profile</td>
                                    <td className="py-4 px-4">
                                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
                                            Pending
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-gray-600">1 hour ago</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
