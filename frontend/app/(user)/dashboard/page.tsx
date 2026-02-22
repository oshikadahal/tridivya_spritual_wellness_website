"use client";

import Image from "next/image";
import { useEffect } from "react";
import { Bell, Flame, Play, Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const recommended = [
    { id: 1, title: "Morning Sun Salutation", level: "Beginner", duration: "15 mins", action: "Start Practice" },
    { id: 2, title: "Vinyasa Flow", level: "Intermediate", duration: "20 mins", action: "Start Practice" },
    { id: 3, title: "Deep Sleep Meditation", level: "All Levels", duration: "15 mins", action: "Start Practice" },
    { id: 4, title: "Power Yoga", level: "Advanced", duration: "30 mins", action: "Start Practice" },
    { id: 5, title: "Breathwork Basics", level: "Beginner", duration: "10 mins", action: "Start Practice" },
    { id: 6, title: "Restorative Yoga", level: "Beginner", duration: "25 mins", action: "Start Practice" },
    { id: 7, title: "Mindful Walking", level: "All Levels", duration: "15 mins", action: "Start Practice" },
    { id: 8, title: "Zen Flow", level: "Intermediate", duration: "20 mins", action: "Start Practice" }
];

const moods = [
    { label: "Calm", emoji: "🙂" },
    { label: "Stressed", emoji: "😵‍💫" },
    { label: "Tired", emoji: "😮‍💨" },
    { label: "Energized", emoji: "⚡" }
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
        <div className="min-h-screen bg-[#f7f8ff] text-slate-900">
            <main className="px-8 py-8 flex flex-col gap-8">

                {/* Streak + Resume */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                        <div>
                            <div className="text-xs font-semibold text-slate-500">Current Streak</div>
                            <div className="text-2xl font-bold text-slate-900 flex items-center gap-2 mt-1">
                                <Flame className="w-5 h-5 text-[#f2994a]" /> 12 Days
                            </div>
                        </div>
                        <button className="text-xs font-semibold text-[#6a5ae0] underline">View progress</button>
                    </div>
                    <div className="bg-[#6a5ae0] text-white rounded-2xl p-5 shadow-sm flex items-center justify-between">
                        <div>
                            <div className="text-xs font-semibold opacity-80">Continue where you left</div>
                            <div className="text-2xl font-bold mt-1">Resume Session</div>
                        </div>
                        <button className="bg-white text-[#6a5ae0] rounded-full w-12 h-12 flex items-center justify-center shadow">
                            <Play className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Hero */}
                <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#f3e8ff] via-[#f0ecff] to-[#ffeef7] border border-slate-200 shadow-sm">
                    <div className="absolute inset-0">
                        <Image src="/images/homepage.png" alt="Home" fill className="object-cover opacity-70" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#6a5ae0]/80 via-[#8f7bea]/70 to-transparent" />
                    </div>
                    <div className="relative p-8 md:p-12 text-white max-w-xl">
                        <p className="text-xs font-semibold uppercase tracking-wide opacity-90">Personalized for you</p>
                        <h2 className="text-3xl md:text-4xl font-bold leading-snug mt-2">The Path to Radical Self-Acceptance</h2>
                        <div className="mt-4 flex items-center gap-4 text-sm font-medium opacity-90">
                            <span>20 mins</span>
                            <span>•</span>
                            <span>Master Sivananda</span>
                        </div>
                        <button className="mt-6 inline-flex items-center gap-2 bg-white text-[#6a5ae0] px-5 py-3 rounded-full font-semibold shadow-lg">
                            <Play className="w-4 h-4" /> Resume Session
                        </button>
                    </div>
                </section>

                {/* Recommended */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-slate-900">Recommended for You</h3>
                        <button className="text-sm font-semibold text-[#6a5ae0]">See All</button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {recommended.map((item) => (
                            <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm flex flex-col gap-3">
                                <div className="relative h-36 rounded-xl overflow-hidden">
                                    <Image src="/images/homepage.png" alt={item.title} fill className="object-cover" />
                                </div>
                                <div className="flex items-center justify-between text-[11px] text-slate-500">
                                    <span>{item.duration}</span>
                                    <span className="capitalize">{item.level.toLowerCase()}</span>
                                </div>
                                <h4 className="font-semibold text-slate-900 text-sm leading-tight">{item.title}</h4>
                                <button className="mt-auto bg-[#6a5ae0] hover:bg-[#5b4fcb] text-white text-sm font-semibold py-2 rounded-xl transition">{item.action}</button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Your Growth */}
                <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                    <div>
                        <p className="text-xs font-semibold text-slate-500">Your Growth</p>
                        <h3 className="text-xl font-bold text-slate-900">How are you feeling right now?</h3>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {moods.map((mood) => (
                            <button key={mood.label} className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 hover:border-[#6a5ae0] transition">
                                <span>{mood.label}</span>
                                <span className="text-lg">{mood.emoji}</span>
                            </button>
                        ))}
                    </div>
                    <button className="w-full sm:w-auto bg-[#6a5ae0] hover:bg-[#5b4fcb] text-white font-semibold px-5 py-3 rounded-xl">Get Session Recommendation</button>
                </section>

                {/* Mantra */}
                <section className="bg-gradient-to-r from-[#6a5ae0] to-[#7b5df0] text-white rounded-3xl p-6 shadow-sm">
                    <p className="text-xs font-semibold opacity-90">Mantra of the Day</p>
                    <h3 className="text-2xl font-bold mt-1">Lokah Samastah Sukhino Bhavantu</h3>
                    <p className="text-sm opacity-90 mt-2 max-w-3xl">"May all beings everywhere be happy and free, and may my thoughts, words and actions contribute to that happiness."</p>
                    <button className="mt-4 inline-flex items-center gap-2 bg-white text-[#6a5ae0] px-4 py-3 rounded-xl font-semibold shadow">
                        <Play className="w-4 h-4" /> Listen & Chant
                    </button>
                </section>
            </main>
        </div>
    );
}
