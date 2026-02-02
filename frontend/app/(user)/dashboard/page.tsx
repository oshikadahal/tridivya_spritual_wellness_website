"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";

// Sample yoga/meditation content
const FEATURED_SESSIONS = [
    {
        id: 1,
        title: "Morning Yoga Flow",
        category: "Yoga",
        duration: "30 min",
        level: "Beginner",
        image: "🧘",
        description: "Start your day with a refreshing yoga flow"
    },
    {
        id: 2,
        title: "Guided Meditation",
        category: "Meditation",
        duration: "20 min",
        level: "All Levels",
        image: "🧠",
        description: "Find inner peace with guided meditation"
    },
    {
        id: 3,
        title: "Mantra Chanting",
        category: "Mantra",
        duration: "15 min",
        level: "Beginner",
        image: "🎵",
        description: "Heal with powerful mantra vibrations"
    },
    {
        id: 4,
        title: "Vinyasa Flow",
        category: "Yoga",
        duration: "45 min",
        level: "Intermediate",
        image: "🧘",
        description: "Dynamic flow for strength and flexibility"
    },
];

export default function Dashboard() {
    const { isAuthenticated, loading, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, loading, router]);

    if (loading) {
        return <div className="text-center py-10">Loading...</div>;
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-linear-to-r from-cyan-600 to-blue-600 rounded-lg shadow-lg p-8 text-white">
                <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.firstName}! 🙏</h1>
                <p className="text-cyan-50 text-lg">Continue your wellness journey with Tridivya</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Sessions Completed</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">12</p>
                        </div>
                        <span className="text-4xl">🎯</span>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Total Minutes</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">360</p>
                        </div>
                        <span className="text-4xl">⏱️</span>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Current Streak</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">7 days</p>
                        </div>
                        <span className="text-4xl">🔥</span>
                    </div>
                </div>
            </div>

            {/* Featured Sessions */}
            <div>
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Featured Sessions</h2>
                    <p className="text-gray-600 text-sm mt-1">Explore our curated wellness sessions</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {FEATURED_SESSIONS.map((session) => (
                        <div
                            key={session.id}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                        >
                            <div className="bg-linear-to-br from-cyan-100 to-blue-100 h-40 flex items-center justify-center text-6xl">
                                {session.image}
                            </div>
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold text-cyan-600 bg-cyan-50 px-2 py-1 rounded">
                                        {session.category}
                                    </span>
                                    <span className="text-xs text-gray-500">{session.duration}</span>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1">{session.title}</h3>
                                <p className="text-xs text-gray-600 mb-3">{session.description}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">{session.level}</span>
                                    <button className="text-sm font-semibold text-cyan-600 hover:text-cyan-700">
                                        Start →
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Categories Section */}
            <div>
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Explore by Category</h2>
                    <p className="text-gray-600 text-sm mt-1">Find sessions that match your interests</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { name: "Yoga", icon: "🧘", count: 24, color: "bg-orange-100 border-orange-300" },
                        { name: "Meditation", icon: "🧠", count: 18, color: "bg-purple-100 border-purple-300" },
                        { name: "Mantra", icon: "🎵", count: 12, color: "bg-pink-100 border-pink-300" },
                    ].map((category) => (
                        <button
                            key={category.name}
                            className={`${category.color} border-2 rounded-lg p-6 text-center hover:shadow-md transition-shadow`}
                        >
                            <div className="text-5xl mb-3">{category.icon}</div>
                            <h3 className="font-bold text-lg text-gray-900">{category.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{category.count} sessions</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Wellness Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-3">💡 Wellness Tip of the Day</h3>
                <p className="text-gray-700">
                    Consistency is key to seeing results. Even 10 minutes of daily practice can bring significant benefits to your physical and mental health. Start small and build a habit that lasts.
                </p>
            </div>
        </div>
    );
}
