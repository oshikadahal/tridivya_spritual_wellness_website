"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Search, Bell, Plus, Music, Play } from "lucide-react";
import Image from "next/image";

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
        <div className="flex min-h-screen bg-gradient-to-br from-[#e7e0ff] via-[#f3eaff] to-[#e0eaff]">
            {/* Main Content */}
            <div className="flex-1 p-8 flex flex-col gap-6">
                {/* Top Row: Welcome, Streak, Search, Profile */}
                <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                        <h1 className="text-3xl sm:text-4xl font-bold text-[#4b2676] mb-1 flex items-center gap-2">
                            Namaste, {user?.firstName} <span className="text-2xl">👋</span>
                        </h1>
                        <div className="text-lg text-[#6c4bb6] mb-4">Today's Focus: <span className="font-semibold text-[#4b2676]">Inner Calm</span></div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="bg-white/80 rounded-2xl px-6 py-4 flex items-center gap-4 shadow border border-[#e0d6f7]">
                                <span className="text-2xl">🔥</span>
                                <div>
                                    <div className="font-bold text-[#4b2676] text-lg">12 Day Streak</div>
                                    <div className="text-[#6c4bb6] text-sm">3 Sessions Completed Today</div>
                                </div>
                            </div>
                            <button className="bg-[#7c5fe6] hover:bg-[#6b4fd6] text-white font-semibold px-8 py-4 rounded-2xl shadow transition text-lg">Resume Session</button>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <Image src="/images/landing.png" alt="Yoga" width={260} height={340} className="rounded-3xl shadow-xl object-cover" />
                    </div>
                </div>

                {/* Personalized Session */}
                <div className="bg-white/80 rounded-2xl p-6 shadow border border-[#e0d6f7] flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-1">
                        <div className="mb-2">
                            <span className="bg-[#bca7f7] text-[#4b2676] text-xs font-bold px-3 py-1 rounded-full">PERSONALIZED FOR YOU</span>
                        </div>
                        <h2 className="text-2xl font-bold text-[#4b2676] mb-1">The Path to Radical Self-Acceptance</h2>
                        <p className="text-[#6c4bb6] mb-4">A 20-minute immersive meditation session by Master Sivananda</p>
                        <button className="bg-[#f3eaff] hover:bg-[#e7e0ff] text-[#7c5fe6] font-semibold px-6 py-3 rounded-full shadow transition flex items-center gap-2">
                            <Play className="w-5 h-5" /> Resume Session
                        </button>
                    </div>
                    <div className="hidden md:block">
                        <Image src="/images/landing.png" alt="Session" width={180} height={120} className="rounded-2xl object-cover" />
                    </div>
                </div>

                {/* Recommended For You Today */}
                <div>
                    <h3 className="text-xl font-bold text-[#4b2676] mb-4">Recommended For You Today</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        <div className="bg-white/90 rounded-2xl shadow border border-[#e0d6f7] p-4 flex flex-col">
                            <Image src="/images/landing.png" alt="Morning Sun Salutation" width={320} height={120} className="rounded-xl object-cover mb-3" />
                            <div className="font-bold text-[#4b2676] mb-1">Morning Sun Salutation</div>
                            <div className="flex items-center gap-2 text-xs mb-2">
                                <span className="bg-[#e7e0ff] text-[#7c5fe6] px-2 py-1 rounded">Beginner</span>
                            </div>
                            <button className="bg-[#7c5fe6] hover:bg-[#6b4fd6] text-white font-semibold px-4 py-2 rounded-xl mt-auto">Start</button>
                        </div>
                        <div className="bg-white/90 rounded-2xl shadow border border-[#e0d6f7] p-4 flex flex-col">
                            <Image src="/images/landing.png" alt="Releasing Worries" width={320} height={120} className="rounded-xl object-cover mb-3" />
                            <div className="font-bold text-[#4b2676] mb-1">Releasing Worries</div>
                            <div className="flex items-center gap-2 text-xs mb-2">
                                <span className="bg-[#e7e0ff] text-[#7c5fe6] px-2 py-1 rounded">Intermediate</span>
                            </div>
                            <button className="bg-[#7c5fe6] hover:bg-[#6b4fd6] text-white font-semibold px-4 py-2 rounded-xl mt-auto">Start</button>
                        </div>
                        <div className="bg-white/90 rounded-2xl shadow border border-[#e0d6f7] p-4 flex flex-col">
                            <Image src="/images/landing.png" alt="Sleep Soundscape" width={320} height={120} className="rounded-xl object-cover mb-3" />
                            <div className="font-bold text-[#4b2676] mb-1">Sleep Soundscape</div>
                            <div className="flex items-center gap-2 text-xs mb-2">
                                <span className="bg-[#e7e0ff] text-[#7c5fe6] px-2 py-1 rounded">All Levels</span>
                            </div>
                            <button className="bg-[#7c5fe6] hover:bg-[#6b4fd6] text-white font-semibold px-4 py-2 rounded-xl mt-auto">Start</button>
                        </div>
                    </div>
                </div>

                {/* Your Growth */}
                <div className="bg-white/80 rounded-2xl p-6 shadow border border-[#e0d6f7] flex flex-col gap-4">
                    <h3 className="text-lg font-bold text-[#4b2676] mb-2">Your Growth</h3>
                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-2xl">😊 Calm</span>
                        <span className="text-2xl">😌 Stressed</span>
                        <span className="text-2xl">🥲 Tired</span>
                        <span className="text-2xl">😁 Energized</span>
                    </div>
                    <button className="bg-[#f3eaff] hover:bg-[#e7e0ff] text-[#7c5fe6] font-semibold px-6 py-3 rounded-full shadow transition w-max">Get Session Recommendation</button>
                </div>

                {/* Resume Your Practice */}
                <div className="bg-white/90 rounded-2xl shadow border border-[#e0d6f7] p-6 flex items-center gap-6">
                    <Image src="/images/landing.png" alt="Resume Practice" width={120} height={80} className="rounded-xl object-cover" />
                    <div className="flex-1">
                        <div className="font-bold text-[#4b2676] mb-1">The Path to Radical Self-Acceptance</div>
                        <div className="text-[#6c4bb6] text-sm mb-2">A 20-minute immersive meditation session guided by Master Sivananda</div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs text-[#7c5fe6]">60 minute</span>
                            <span className="text-xs text-[#7c5fe6]">60:07</span>
                        </div>
                        <button className="bg-[#7c5fe6] hover:bg-[#6b4fd6] text-white font-semibold px-6 py-2 rounded-xl">Continue</button>
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
