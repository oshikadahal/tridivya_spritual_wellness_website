"use client";

import Link from "next/link";
import { Play, Search, Bell, Filter } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

// Dummy data for mantras and recommendations
const RECOMMENDED_MANTRAS = [
    {
        title: "Om Chanting",
        level: "Beginner",
        duration: "9.2 min",
        image: "/images/landing.png",
        stats: "Beginner",
        rating: "9.2 min",
        likes: 0,
        stars: 0,
    },
    {
        title: "Gayatri Mantra",
        level: "Intermediate",
        duration: "-",
        image: "/images/landing.png",
        stats: "Intermediate",
        rating: "5,509",
        likes: 0,
        stars: 0,
    },
    {
        title: "मौन मंत्र",
        level: "Intermediate",
        duration: "9.2.64",
        image: "/images/landing.png",
        stats: "Intermediate",
        rating: "3,627",
        likes: 0,
        stars: 0,
    },
];

const POPULAR_MANTRAS = [
    {
      title: "Lokah Samastah Sukhino_Bhavantu",
      level: "Beginner",
      duration: "30:12",
      image: "/images/landing.png",
      completed: 3098,
      sun: 5996,
      likes: 1200,
      hearts: 3089,
      stars: 272,
    },
    {
      title: "Maha Mrityunjaya Mantra",
      level: "Intermediate",
      duration: "30:29",
      image: "/images/landing.png",
      completed: 2358,
      sun: 5306,
      likes: 4671,
      hearts: 3527,
      stars: 0,
    },
  ];

  const powerOfMantras = [
    {
      icon: "🔊",
      title: "Vibrational Harmony",
      description: "Sound frequencies that align your body's energy centers and promote healing through resonance."
    },
    {
      icon: "🧠",
      title: "Mental Clarity",
      description: "Focus your mind, eliminate negative thoughts, and achieve unshakeable inner peace."
    },
    {
      icon: "✨",
      title: "Spiritual Connection",
      description: "Connect with the divine essence and awaken your higher consciousness through sacred words."
    }
];

const benefitsOfChanting = [
    {
        title: "Stress Relief",
        description: "Release tension and anxiety through the therapeutic power of rhythmic chanting."
    },
    {
        title: "Enhanced Focus",
        description: "Improve concentration and mental clarity with daily mantra practice."
    },
    {
        title: "Emotional Balance",
        description: "Cultivate inner peace and emotional stability through sacred vibrations."
    }
];

const mantras = [
    {
        image: "ॐ",
        title: "Om (ॐ)",
        description: "The universal sound, representing the essence of reality and consciousness.",
        level: "Beginner",
        duration: "5 min",
        bgColor: "bg-blue-100"
    },
    {
        image: "🙏",
        title: "Gayatri Mantra",
        description: "A powerful mantra invoking divine light and wisdom.",
        level: "Intermediate",
        duration: "10 min",
        bgColor: "bg-purple-100"
    },
    {
        image: "💛",
        title: "Maha Mrityunjaya",
        description: "The great death-conquering mantra for healing and longevity.",
        level: "Advanced",
        duration: "15 min",
        bgColor: "bg-yellow-100"
    },
    {
        image: "🕉️",
        title: "Shiva Mantra",
        description: "Invoking the cosmic consciousness and transformation.",
        level: "Beginner",
        duration: "8 min",
        bgColor: "bg-teal-100"
    },
    {
        image: "🌸",
        title: "Lakshmi Mantra",
        description: "Attracting abundance, prosperity, and divine grace.",
        level: "Intermediate",
        duration: "12 min",
        bgColor: "bg-pink-100"
    },
    {
        image: "🌟",
        title: "Saraswati Mantra",
        description: "Invoking wisdom, creative flow, and intellectual excellence.",
        level: "Beginner",
        duration: "7 min",
        bgColor: "bg-green-100"
    }
];

const stats = [
    { number: "500K+", label: "Active Practitioners" },
    { number: "50+", label: "Sacred Mantras" },
    { number: "180", label: "Countries" },
    { number: "99.8%", label: "Satisfaction Rate" }
];

const howToChant = [
    {
        step: "1",
        title: "Find Your Space",
        description: "Choose a quiet, clean place where you feel comfortable and connected."
    },
    {
        step: "2",
        title: "Sit Comfortably",
        description: "Assume a comfortable meditative posture with straight spine."
    },
    {
        step: "3",
        title: "Focus Your Mind",
        description: "Calm your thoughts and set a clear intention before starting."
    },
    {
        step: "4",
        title: "Chant with Devotion",
        description: "Recite the mantra with feeling, 108 times or more for best results."
    }
];

const transformationStories = [
    {
        name: "Priya Sharma",
        role: "Yoga Instructor",
        rating: 5,
        image: "👩‍🏫",
        feedback: "Mantras have transformed my life completely. The peace I feel is indescribable. My students feel it too!"
    },
    {
        name: "Rajesh Kumar",
        role: "Corporate Executive",
        rating: 5,
        image: "👨‍💼",
        feedback: "From stress to serenity. Daily mantra practice helped me find balance in my hectic life."
    },
    {
        name: "Anjali Patel",
        role: "Wellness Coach",
        rating: 5,
        image: "👩‍⚕️",
        feedback: "The wisdom in these ancient mantras is timeless. Highly recommend for anyone seeking transformation."
    }
];

const recommendedBook = {
    image: "📖",
    title: "The Complete Mantra Guide",
    author: "By Ancient Wisdom Keepers",
    description: "Discover the profound science behind mantras, their meanings, benefits, and how to practice them with proper technique. This comprehensive guide covers all major mantras from various traditions and their spiritual significance in modern life."
};

export default function MantraPage() {
  const { user } = useAuth?.() || {};
  return (
    <div className="flex min-h-screen" style={{ background: 'linear-gradient(135deg, #ece6ff 0%, #e6e2ff 100%)' }}>
      {/* Left Sidebar (reuse dashboard sidebar if any, else placeholder) */}
      <aside className="hidden lg:flex flex-col w-64 bg-white/80 border-r border-[#e0d6f7] p-6 min-h-screen">
        <div className="font-bold text-[#7c5fe6] text-xl mb-8">Tridivya</div>
        <nav className="flex flex-col gap-4">
          <Link href="/dashboard" className="text-[#4b2676] font-semibold hover:text-[#7c5fe6]">Dashboard</Link>
          <Link href="/mantra" className="text-[#7c5fe6] font-bold">Mantra Library</Link>
          <Link href="/yoga" className="text-[#4b2676] font-semibold hover:text-[#7c5fe6]">Yoga</Link>
          <Link href="/meditation" className="text-[#4b2676] font-semibold hover:text-[#7c5fe6]">Meditation</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col gap-6 p-8">
        {/* Navbar (reuse dashboard navbar style) */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="font-bold text-2xl text-[#7c5fe6]">Tridivya</div>
            <div className="relative">
              <input type="text" placeholder="Search sessions..." className="bg-white/80 border border-[#e0d6f7] rounded-full px-6 py-2 pl-10 text-[#4b2676] focus:outline-none focus:ring-2 focus:ring-[#7c5fe6] w-72" />
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-[#7c5fe6]" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Bell className="w-6 h-6 text-[#7c5fe6]" />
            <div className="flex items-center gap-2 bg-white/80 px-3 py-1 rounded-full">
              <Image src="/images/landing.png" alt="Profile" width={32} height={32} className="rounded-full object-cover" />
              <span className="font-semibold text-[#4b2676] text-sm">{user?.firstName || "User"}</span>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative rounded-3xl bg-gradient-to-br from-[#e7e0ff] to-[#c7bfff] p-8 flex flex-col md:flex-row items-center gap-8 mb-6 overflow-hidden">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-[#4b2676] mb-2">Mantra Videos</h1>
            <p className="text-lg text-[#6c4bb6] mb-4">Experience ancient chants for spiritual healing<br />healing and emotional well-being.</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {['Healing', 'Peace', 'Focus', 'Sleep', 'Energy'].map((cat) => (
                <span key={cat} className="bg-white/80 text-[#7c5fe6] font-semibold px-4 py-1 rounded-full text-sm cursor-pointer hover:bg-[#e7e0ff]">{cat}</span>
              ))}
            </div>
          </div>
          <div className="hidden md:block">
            <Image src="/images/landing.png" alt="Hero" width={220} height={320} className="rounded-3xl object-cover" />
          </div>
        </section>

        {/* Featured Mantra */}
        <section className="rounded-3xl bg-white/80 p-6 flex flex-col md:flex-row items-center gap-6 mb-6 shadow border border-[#e0d6f7]">
          <div className="flex-1">
            <div className="text-[#7c5fe6] font-semibold mb-1">Lokah Samastah Sukhino_Bhavantu</div>
            <div className="text-[#bca7f7] text-xs mb-2">AI For healing and positivity</div>
            <button className="bg-white hover:bg-[#f3eaff] text-[#7c5fe6] font-semibold px-6 py-3 rounded-full shadow transition flex items-center gap-2 mb-2">
              <Play className="w-5 h-5" /> Listen Now
            </button>
            <div className="flex items-center gap-4 text-[#6c4bb6] text-sm">
              <span>4.8</span>
              <span>30:12</span>
            </div>
          </div>
          <div className="hidden md:block">
            <Image src="/images/landing.png" alt="Featured Mantra" width={180} height={120} className="rounded-2xl object-cover" />
          </div>
        </section>

        {/* Recommended for Mood */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-bold text-[#4b2676]">Recommended for Your Current Mood</h3>
            <button className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full border border-[#e0d6f7] text-[#7c5fe6] font-semibold"><Filter className="w-4 h-4" /> Advanced Filters</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {RECOMMENDED_MANTRAS.map((m, i) => (
              <div key={i} className="bg-white/90 rounded-2xl shadow border border-[#e0d6f7] p-4 flex flex-col">
                <Image src={m.image} alt={m.title} width={320} height={120} className="rounded-xl object-cover mb-3" />
                <div className="font-bold text-[#4b2676] mb-1">{m.title}</div>
                <div className="flex items-center gap-2 text-xs mb-2">
                  <span className="bg-[#e7e0ff] text-[#7c5fe6] px-2 py-1 rounded">{m.level}</span>
                </div>
                <div className="flex items-center gap-2 text-xs mb-2">
                  <span className="text-[#7c5fe6]">{m.stats}</span>
                  <span className="text-[#7c5fe6]">{m.rating}</span>
                </div>
                <button className="bg-[#7c5fe6] hover:bg-[#6b4fd6] text-white font-semibold px-4 py-2 rounded-xl mt-auto">Start</button>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Mantras */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-bold text-[#4b2676]">Popular Mantras</h3>
            <div className="flex gap-2">
              <button className="bg-white/80 px-4 py-2 rounded-full border border-[#e0d6f7] text-[#7c5fe6] font-semibold">Most Popular</button>
              <button className="bg-white/80 px-4 py-2 rounded-full border border-[#e0d6f7] text-[#7c5fe6] font-semibold">All Durations</button>
              <button className="bg-white/80 px-4 py-2 rounded-full border border-[#e0d6f7] text-[#7c5fe6] font-semibold">All Purposes</button>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            {POPULAR_MANTRAS.map((m, i) => (
              <div key={i} className="bg-white/90 rounded-2xl shadow border border-[#e0d6f7] p-6 flex flex-col md:flex-row items-center gap-6">
                <Image src={m.image} alt={m.title} width={180} height={120} className="rounded-xl object-cover" />
                <div className="flex-1">
                  <div className="font-bold text-[#4b2676] mb-1">{m.title}</div>
                  <div className="flex items-center gap-2 text-xs mb-2">
                    <span className="bg-[#e7e0ff] text-[#7c5fe6] px-2 py-1 rounded">{m.level}</span>
                    <span className="text-[#7c5fe6]">{m.duration}</span>
                  </div>
                  <button className="bg-[#f3eaff] hover:bg-[#e7e0ff] text-[#7c5fe6] font-semibold px-6 py-2 rounded-full shadow transition flex items-center gap-2 mb-2">
                    <Play className="w-5 h-5" /> Listen Now
                  </button>
                  <div className="flex items-center gap-4 text-[#6c4bb6] text-sm">
                    <span>Completed: {m.completed}</span>
                    <span>Sun: {m.sun}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Right Sidebar (reuse dashboard right sidebar if any, else placeholder) */}
      <aside className="hidden xl:flex flex-col w-80 bg-white/80 border-l border-[#e0d6f7] p-6 min-h-screen">
        <div className="font-bold text-[#7c5fe6] text-lg mb-6">Reminders</div>
        <div className="flex flex-col gap-4">
          <div className="bg-[#e7e0ff] rounded-xl p-4 text-[#4b2676] font-semibold">Live: Sunset Yoga 18:30</div>
          <div className="bg-[#e7e0ff] rounded-xl p-4 text-[#4b2676] font-semibold">Bedtime Nidra 21:00</div>
          <div className="bg-[#e7e0ff] rounded-xl p-4 text-[#4b2676] font-semibold">Morning Ritual 06:00</div>
        </div>
      </aside>
    </div>
  );
}
