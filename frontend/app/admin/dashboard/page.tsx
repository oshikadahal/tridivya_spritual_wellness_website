"use client";

import { useEffect, useState } from "react";
import { getAdminDashboardOverview } from "@/lib/api/admin";
import { CalendarDays, Clock3, Library, Sparkles, Star, TrendingUp, Users } from "lucide-react";

type RecentActivityItem = {
    type: "users" | "reviews" | "bookings";
    title: string;
    subtitle: string;
};

interface DashboardStats {
    cards: {
        totalUsers: number;
        usersDelta: number;
        todaysBookings: number;
        bookingsDelta: number;
        newReviews: number;
        reviewsDelta: number;
        contentLibrary: number;
    };
    distribution: {
        yoga: number;
        meditation: number;
        mantras: number;
        totalAssets: number;
    };
    highlights: {
        yogaCompletion: number;
        meditationEngagement: number;
        mantraGrowth: number;
        monthlyActiveUsersGrowth: number;
    };
    recentActivity: RecentActivityItem[];
}

const initialStats: DashboardStats = {
    cards: {
        totalUsers: 0,
        usersDelta: 0,
        todaysBookings: 0,
        bookingsDelta: 0,
        newReviews: 0,
        reviewsDelta: 0,
        contentLibrary: 0,
    },
    distribution: {
        yoga: 0,
        meditation: 0,
        mantras: 0,
        totalAssets: 0,
    },
    highlights: {
        yogaCompletion: 0,
        meditationEngagement: 0,
        mantraGrowth: 0,
        monthlyActiveUsersGrowth: 0,
    },
    recentActivity: [],
};

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats>(initialStats);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await getAdminDashboardOverview();
            if (response.success) {
                setStats(response.data);
            }
        } catch (err) {
            console.error("Failed to fetch stats:", err);
        } finally {
            setLoading(false);
        }
    };

    const activityIcon = (type: RecentActivityItem["type"]) => {
        if (type === "users") {
            return (
                <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                    <Users size={14} />
                </span>
            );
        }
        if (type === "reviews") {
            return (
                <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <Star size={14} />
                </span>
            );
        }
        return (
            <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-orange-100 text-orange-700">
                <Clock3 size={14} />
            </span>
        );
    };

    const yogaShare = stats.distribution.yoga;
    const meditationShare = stats.distribution.meditation;
    const mantraShare = stats.distribution.mantras;
    const yogaEnd = yogaShare;
    const meditationEnd = yogaShare + meditationShare;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Admin Overview</h1>
                <p className="mt-1 text-sm text-slate-500">Welcome back! Here's your wellness platform overview.</p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-start justify-between">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                            <Users size={18} />
                        </span>
                        <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">{stats.cards.usersDelta >= 0 ? `+${stats.cards.usersDelta}%` : `${stats.cards.usersDelta}%`}</span>
                    </div>
                    <p className="text-sm text-slate-500">Total Users</p>
                    <p className="mt-1 text-4xl font-bold text-slate-900">{loading ? "..." : stats.cards.totalUsers.toLocaleString()}</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-start justify-between">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                            <CalendarDays size={18} />
                        </span>
                        <span className="rounded-md bg-violet-100 px-2 py-0.5 text-xs font-semibold text-violet-700">{stats.cards.bookingsDelta >= 0 ? `+${stats.cards.bookingsDelta}%` : `${stats.cards.bookingsDelta}%`}</span>
                    </div>
                    <p className="text-sm text-slate-500">Today's Bookings</p>
                    <p className="mt-1 text-4xl font-bold text-slate-900">{loading ? "..." : stats.cards.todaysBookings.toLocaleString()}</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-start justify-between">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                            <Star size={18} />
                        </span>
                        <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">{stats.cards.reviewsDelta >= 0 ? `+${stats.cards.reviewsDelta}%` : `${stats.cards.reviewsDelta}%`}</span>
                    </div>
                    <p className="text-sm text-slate-500">New Reviews</p>
                    <p className="mt-1 text-4xl font-bold text-slate-900">{loading ? "..." : stats.cards.newReviews.toLocaleString()}</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-start justify-between">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                            <Library size={18} />
                        </span>
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">Total</span>
                    </div>
                    <p className="text-sm text-slate-500">Content Library</p>
                    <p className="mt-1 text-4xl font-bold text-slate-900">{loading ? "..." : stats.cards.contentLibrary.toLocaleString()}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-1">
                    <h2 className="text-2xl font-bold text-slate-900">Content Distribution</h2>

                    <div className="mt-6 flex justify-center">
                        <div
                            className="relative h-56 w-56 rounded-full"
                            style={{
                                background:
                                    `conic-gradient(#6d28d9 0% ${yogaEnd}%, #8b5cf6 ${yogaEnd}% ${meditationEnd}%, #c4b5fd ${meditationEnd}% 100%)`,
                            }}
                        >
                            <div className="absolute inset-6 rounded-full bg-white" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-5xl font-bold text-slate-900">100%</span>
                                <span className="mt-1 text-xs font-semibold tracking-widest text-slate-400">TOTAL ASSETS</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 space-y-3 text-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-slate-700">
                                <span className="h-3 w-3 rounded-full bg-violet-700" /> Yoga
                            </div>
                            <span className="font-semibold text-slate-900">{yogaShare}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-slate-700">
                                <span className="h-3 w-3 rounded-full bg-violet-500" /> Meditation
                            </div>
                            <span className="font-semibold text-slate-900">{meditationShare}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-slate-700">
                                <span className="h-3 w-3 rounded-full bg-violet-300" /> Mantras
                            </div>
                            <span className="font-semibold text-slate-900">{mantraShare}%</span>
                        </div>
                    </div>
                </div>

                <div className="grid min-h-96 gap-5 lg:col-span-2 lg:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900">Platform Highlights</h3>
                            <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
                                <Sparkles size={13} /> Live
                            </span>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <div className="mb-2 flex items-center justify-between text-sm">
                                    <span className="text-slate-600">Yoga program completion</span>
                                    <span className="font-semibold text-slate-900">{stats.highlights.yogaCompletion}%</span>
                                </div>
                                <div className="h-2 rounded-full bg-slate-100">
                                    <div className="h-2 rounded-full bg-violet-600" style={{ width: `${stats.highlights.yogaCompletion}%` }} />
                                </div>
                            </div>

                            <div>
                                <div className="mb-2 flex items-center justify-between text-sm">
                                    <span className="text-slate-600">Meditation engagement</span>
                                    <span className="font-semibold text-slate-900">{stats.highlights.meditationEngagement}%</span>
                                </div>
                                <div className="h-2 rounded-full bg-slate-100">
                                    <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${stats.highlights.meditationEngagement}%` }} />
                                </div>
                            </div>

                            <div>
                                <div className="mb-2 flex items-center justify-between text-sm">
                                    <span className="text-slate-600">Mantra listens growth</span>
                                    <span className="font-semibold text-slate-900">{stats.highlights.mantraGrowth}%</span>
                                </div>
                                <div className="h-2 rounded-full bg-slate-100">
                                    <div className="h-2 rounded-full bg-violet-400" style={{ width: `${Math.min(100, stats.highlights.mantraGrowth)}%` }} />
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 rounded-xl bg-slate-50 p-4">
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                <TrendingUp size={16} className="text-emerald-600" />
                                Monthly active users {stats.highlights.monthlyActiveUsersGrowth >= 0 ? "up" : "down"} by {Math.abs(stats.highlights.monthlyActiveUsersGrowth)}%
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
                            <span className="text-xs font-semibold text-slate-500">Today</span>
                        </div>

                        <div className="space-y-4">
                            {stats.recentActivity.map((activity, index) => (
                                <div key={`${activity.type}-${index}`} className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                                    {activityIcon(activity.type)}
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">{activity.title}</p>
                                        <p className="text-xs text-slate-500">{activity.subtitle}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
