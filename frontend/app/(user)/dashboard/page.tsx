"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Search, Bell, Plus, Music, Play } from "lucide-react";

// Dummy video data
const POPULAR_VIDEOS = [
    {
        id: 1,
        title: "Morning Sun Salutation",
        instructor: "Beginner",
        duration: "5:00",
        thumbnail: "🌅",
        category: "FREE",
        bgColor: "bg-gradient-to-br from-teal-600 to-teal-800"
    },
    {
        id: 2,
        title: "Anxiety Release Breathe",
        instructor: "Intermediate",
        duration: "10:00",
        thumbnail: "🌊",
        category: "RITE",
        bgColor: "bg-gradient-to-br from-gray-700 to-gray-900"
    },
    {
        id: 3,
        title: "Tibetan Sound Healing",
        instructor: "Advanced",
        duration: "45:00",
        thumbnail: "🏔️",
        category: "PLUS",
        bgColor: "bg-gradient-to-br from-orange-500 to-orange-700"
    }
];

const REMINDERS = [
    {
        id: 1,
        title: "Live: Sunset Yoga",
        time: "18:30",
        subtitle: "with Master Stephanie",
        label: "TODAY",
        labelColor: "text-blue-500"
    },
    {
        id: 2,
        title: "Bedtime Nidra",
        time: "21:00",
        subtitle: "Guided sleep meditation",
        label: "TODAY",
        labelColor: "text-purple-500"
    },
    {
        id: 3,
        title: "Morning Ritual",
        time: "06:00",
        subtitle: "Start fresh morning",
        label: "TOMORROW",
        labelColor: "text-orange-400"
    }
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
        <div className="flex min-h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-blue-100">
            {/* Main Content */}
            <div className="flex-1 p-8">
                {/* Header is now handled globally in layout, so this is removed */}

                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Namaste, {user?.firstName}
                    </h1>
                    <p className="text-purple-600 flex items-center gap-2">
                        <span>✨ Every breath is a new beginning. Your streak:</span>
                        <span className="font-semibold">12 Days</span>
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-white/80 backdrop-blur rounded-2xl p-6 border border-purple-200 hover:shadow-lg transition cursor-pointer">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                            <span className="text-2xl">🧘</span>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1">Meditation</h3>
                        <p className="text-sm text-gray-600">Quiet your mind and find inner peace</p>
                    </div>
                    <div className="bg-white/80 backdrop-blur rounded-2xl p-6 border border-purple-200 hover:shadow-lg transition cursor-pointer">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                            <span className="text-2xl">🙏</span>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1">Yoga</h3>
                        <p className="text-sm text-gray-600">Align your body and strengthen soul</p>
                    </div>
                    <div className="bg-white/80 backdrop-blur rounded-2xl p-6 border border-purple-200 hover:shadow-lg transition cursor-pointer">
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-3">
                            <span className="text-2xl">🎵</span>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1">Mantras</h3>
                        <p className="text-sm text-gray-600">Sacred chants for spiritual healing</p>
                    </div>
                </div>

                {/* Recommended Session */}
                <div className="bg-gradient-to-r from-gray-700 to-gray-900 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
                    <div className="absolute top-4 left-4">
                        <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                            RECOMMENDED TODAY
                        </span>
                    </div>
                    <div className="mt-8">
                        <h2 className="text-3xl font-bold mb-3">The Path to Radical Self-Acceptance</h2>
                        <p className="text-gray-300 mb-6">
                            A 20-minute immersive meditation session guided by Master Sivananda
                        </p>
                        <button className="bg-white text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition flex items-center gap-2">
                            <Play className="w-5 h-5" />
                            Start Session
                        </button>
                    </div>
                    <div className="absolute right-0 bottom-0 w-64 h-64 opacity-20">
                        <div className="text-9xl">🧘‍♀️</div>
                    </div>
                </div>

                {/* Popular Free Videos */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-gray-900">Popular Free Videos</h2>
                        <button className="text-purple-600 font-semibold hover:text-purple-700">View</button>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                        {POPULAR_VIDEOS.map((video) => (
                            <div
                                key={video.id}
                                className="bg-white/80 backdrop-blur rounded-2xl overflow-hidden border border-purple-200 hover:shadow-xl transition cursor-pointer"
                            >
                                <div className={`${video.bgColor} h-40 flex items-center justify-center text-6xl relative`}>
                                    {video.thumbnail}
                                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                        {video.duration}
                                    </div>
                                    <button className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition">
                                        <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center">
                                            <Play className="w-6 h-6 text-gray-900 ml-1" />
                                        </div>
                                    </button>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xl">🧘</span>
                                        <h3 className="font-bold text-gray-900 flex-1">{video.title}</h3>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">👤 {video.instructor}</span>
                                        <span className="text-purple-600 font-semibold">{video.category}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-80 bg-white/50 backdrop-blur border-l border-purple-200 p-6 space-y-6">
                {/* Mantra of the Day */}
                <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl p-6 text-white">
                    <p className="text-sm font-semibold mb-3 opacity-90">Mantra of the Day</p>
                    <h3 className="text-2xl font-bold mb-2 leading-tight">
                        Lokah Samastah Sukhino Bhavantu
                    </h3>
                    <p className="text-sm opacity-90 mb-4">
                        "May all beings everywhere be happy and free"
                    </p>
                    <button className="w-full bg-white text-purple-600 py-3 rounded-xl font-semibold hover:bg-purple-50 transition flex items-center justify-center gap-2">
                        <Music className="w-5 h-5" />
                        Listen & Chant
                    </button>
                </div>

                {/* Reminders */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-900">Reminders</h3>
                        <button className="text-purple-600 hover:text-purple-700">
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="space-y-3">
                        {REMINDERS.map((reminder) => (
                            <div
                                key={reminder.id}
                                className="bg-white border border-purple-200 rounded-xl p-4 hover:shadow-md transition"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <span className={`text-xs font-bold ${reminder.labelColor}`}>
                                        {reminder.label}
                                    </span>
                                    <span className="text-lg font-bold text-purple-600">
                                        {reminder.time}
                                    </span>
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-1">{reminder.title}</h4>
                                <p className="text-sm text-gray-600">{reminder.subtitle}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Weekly Goal */}
                <div className="bg-white border border-purple-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-gray-900">Weekly Goal</h3>
                        <span className="text-2xl font-bold text-purple-600">75%</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">5 of 7 sessions completed</p>
                    <div className="w-full bg-purple-100 rounded-full h-3 mb-4">
                        <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <button className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition">
                        VIEW INSIGHTS
                    </button>
                </div>
            </div>
        </div>
    );
}
