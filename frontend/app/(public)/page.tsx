"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface MeditationCard {
  id: string;
  title: string;
  description: string;
  duration: string;
  sessions: string;
  badge: string;
  tint: string;
}

interface YogaCard {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  sessions: string;
  tint: string;
  highlight?: boolean;
}

const MEDITATION_CARDS: MeditationCard[] = [
  {
    id: "1",
    title: "Ocean of Calm",
    description: "A guided visual meditation to help you release stress and find inner peace.",
    duration: "10 min guided journey",
    sessions: "1.2k sessions this week",
    badge: "10m",
    tint: "bg-[#E9D5B5]"
  },
  {
    id: "2",
    title: "Evening Gratitude",
    description: "End your day with a heart-centered gratitude practice.",
    duration: "12 min relaxation",
    sessions: "850 sessions this week",
    badge: "20m",
    tint: "bg-[#F6DFC0]"
  },
  {
    id: "3",
    title: "Breath Awareness",
    description: "Return to the present moment through mindful breathing.",
    duration: "8 min focus",
    sessions: "740 sessions this week",
    badge: "10m",
    tint: "bg-[#F2E0C8]"
  }
];

const YOGA_CARDS: YogaCard[] = [
  {
    id: "1",
    title: "Sun Salutations",
    description: "Wake up your body and mind with a powerful flow sequence.",
    level: "Beginner",
    duration: "15 mins",
    sessions: "1.1k sessions",
    tint: "bg-white dark:bg-slate-800"
  },
  {
    id: "2",
    title: "Restorative Yin",
    description: "Deeply relax your muscles and nervous system with long holds.",
    level: "Intermediate",
    duration: "30 mins",
    sessions: "850 sessions",
    tint: "bg-[#F59E0B]",
    highlight: true
  },
  {
    id: "3",
    title: "Power Vinyasa",
    description: "Build strength and stamina through flowing sequences.",
    level: "Advanced",
    duration: "45 mins",
    sessions: "640 sessions",
    tint: "bg-white dark:bg-slate-800"
  }
];

export default function Home() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = theme === "dark";

  return (
    <main className={`min-h-screen ${isDark ? "bg-slate-900" : "bg-[#CAD3FF]"}`}>
      {/* Hero Section */}
      <section className={`px-4 sm:px-6 lg:px-8 pt-16 pb-10 ${isDark ? "bg-slate-900" : "bg-[#CAD3FF]"}`}>
        <div className="max-w-6xl mx-auto text-center">
          <h1 className={`text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            Your Journey to <span className="text-amber-500">Inner Peace</span>
            <br />
            Starts Here
          </h1>
          <p className={`mt-4 text-sm sm:text-base max-w-2xl mx-auto ${isDark ? "text-slate-300" : "text-slate-700"}`}>
            Connect your body, mind and spirit with our curated collection of ancient wisdom and modern practices.
          </p>
          <div className="mt-6">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-500 text-white text-sm font-semibold shadow-sm hover:bg-indigo-600 transition-colors"
            >
              Join for Free
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Meditations */}
      <section className={`px-4 sm:px-6 lg:px-8 py-10 ${isDark ? "bg-slate-900" : "bg-[#CAD3FF]"}`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-xl sm:text-2xl font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                Trending Meditations
              </h2>
              <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Our most practiced sessions this week
              </p>
            </div>
            <Link href="/meditation" className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold">
              View All →
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
            {MEDITATION_CARDS.map((card) => (
              <div
                key={card.id}
                className={`rounded-2xl border shadow-sm ${isDark ? "bg-slate-800 border-slate-700" : "bg-white/80 border-white"}`}
              >
                <div className={`relative h-40 rounded-2xl m-3 ${card.tint} flex items-center justify-center`}>
                  <div className="h-16 w-16 rounded-full bg-white/70" />
                  <span className="absolute top-3 right-3 text-[10px] px-2 py-1 rounded-full bg-white/80 text-slate-700">
                    {card.badge}
                  </span>
                </div>
                <div className="px-5 pb-5">
                  <h3 className={`text-sm font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>{card.title}</h3>
                  <p className={`mt-1 text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>{card.description}</p>
                  <div className="mt-4 flex items-center justify-between text-[10px]">
                    <span className={`${isDark ? "text-slate-400" : "text-slate-500"}`}>{card.duration}</span>
                    <span className={`${isDark ? "text-slate-400" : "text-slate-500"}`}>{card.sessions}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Yoga for Every Level */}
      <section className={`px-4 sm:px-6 lg:px-8 pb-14 ${isDark ? "bg-slate-900" : "bg-[#CAD3FF]"}`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-xl sm:text-2xl font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                Yoga for Every Level
              </h2>
              <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Whether you are just starting or deepening your practice
              </p>
            </div>
            <div className="flex items-center gap-2">
              {["Beginner", "Intermediate", "Advanced"].map((level) => (
                <span
                  key={level}
                  className={`text-[10px] px-3 py-1 rounded-full ${isDark ? "bg-slate-800 text-slate-200" : "bg-white/70 text-slate-700"}`}
                >
                  {level}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {YOGA_CARDS.map((card) => (
              <div
                key={card.id}
                className={`rounded-2xl p-5 shadow-sm ${card.tint} ${
                  card.highlight
                    ? "text-white"
                    : isDark
                      ? "border border-slate-700"
                      : "border border-white"
                }`}
              >
                <div className={`h-40 rounded-xl ${card.highlight ? "bg-orange-300/40" : "bg-[#D9E1FF] dark:bg-slate-700"} flex items-center justify-center`}>
                  <div className={`h-16 w-16 rounded-full ${card.highlight ? "bg-white/30" : "bg-white/70"}`} />
                </div>
                <div className="mt-4">
                  <p className={`text-[10px] uppercase tracking-widest ${card.highlight ? "text-orange-100" : isDark ? "text-slate-400" : "text-slate-500"}`}>
                    {card.level}
                  </p>
                  <h3 className={`mt-1 text-sm font-semibold ${card.highlight ? "text-white" : isDark ? "text-white" : "text-slate-900"}`}>
                    {card.title}
                  </h3>
                  <p className={`mt-1 text-xs ${card.highlight ? "text-orange-100" : isDark ? "text-slate-400" : "text-slate-600"}`}>
                    {card.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-[10px]">
                    <span className={`${card.highlight ? "text-orange-50" : isDark ? "text-slate-400" : "text-slate-500"}`}>
                      {card.sessions}
                    </span>
                    <span className={`${card.highlight ? "text-orange-50" : isDark ? "text-slate-400" : "text-slate-500"}`}>
                      {card.duration}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`px-4 sm:px-6 lg:px-8 pb-10 ${isDark ? "bg-slate-900" : "bg-[#CAD3FF]"}`}>
        <div className="max-w-6xl mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs">
          <div className={`${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Tridivya
          </div>
          <div className={`flex items-center gap-5 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            <Link href="/about" className="hover:text-indigo-600">About Us</Link>
            <Link href="/yoga" className="hover:text-indigo-600">Yoga</Link>
            <Link href="/meditation" className="hover:text-indigo-600">Meditation</Link>
            <Link href="/mantra" className="hover:text-indigo-600">Mantras</Link>
          </div>
          <div className={`${isDark ? "text-slate-500" : "text-slate-500"}`}>
            © 2026 Tridivya Wellness
          </div>
        </div>
      </footer>
    </main>
  );
}
