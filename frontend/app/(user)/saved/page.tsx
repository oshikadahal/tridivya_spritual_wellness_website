"use client";

import { useState } from "react";

const savedSessions = [
  {
    type: "Meditation",
    duration: "16 mins",
    title: "Morning Zen: Foundational Breathing",
    instructor: "Sarah Jenkins",
    image: "/images/meditation-session.jpg",
    watched: false,
  },
  {
    type: "Yoga Program",
    duration: "Session 3/10",
    title: "Hatha Flow for Mobility",
    instructor: "",
    image: "/images/yoga-session.jpg",
    watched: true,
    progress: 30,
  },
  {
    type: "Mantra",
    duration: "8 mins",
    title: "Om Shanti : Peace Chant",
    instructor: "",
    image: "/images/mantra-session.jpg",
    watched: false,
  },
];

export default function SavedSessionsPage() {
  const [filter, setFilter] = useState("All Content");
  const filters = ["All Content", "Meditation Videos", "Yoga Programs", "Mantras & Chants"];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-[#3B4A6B] mb-2">Your Saved Sessions</h1>
      <div className="flex items-center mb-6">
        <input
          type="text"
          placeholder="Search your library..."
          className="border border-[#E6EAF3] rounded-lg px-4 py-2 focus:outline-none w-80 mr-4"
        />
        <select className="border border-[#E6EAF3] rounded-lg px-3 py-2 text-[#3B4A6B] bg-white" defaultValue="Recently Saved">
          <option>Recently Saved</option>
          <option>Recently Watched</option>
        </select>
      </div>
      <div className="bg-[#F3F4F6] rounded-xl p-4 flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <span className="bg-[#E6EAF3] p-3 rounded-xl">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="#5B6EF8" fillOpacity="0.1"/><path d="M7 7h10v10H7V7z" fill="#5B6EF8"/></svg>
          </span>
          <span className="font-medium text-[#3B4A6B]">You have 12 saved sessions</span>
        </div>
        <button className="text-[#5B6EF8] font-medium">MANAGE ALL</button>
      </div>
      <div className="flex gap-2 mb-8">
        {filters.map((f) => (
          <button
            key={f}
            className={`px-4 py-2 rounded-lg font-medium ${filter === f ? "bg-[#5B6EF8] text-white" : "bg-[#E6EAF3] text-[#3B4A6B]"}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {savedSessions.map((session, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col">
            <div className="flex items-center gap-4 mb-4">
              <img src={session.image} alt={session.title} className="w-20 h-20 rounded-xl object-cover" />
              <div className="flex-1">
                <div className="flex gap-2 mb-1">
                  <span className="bg-[#5B6EF8] text-white px-2 py-1 rounded-lg text-xs font-semibold">{session.type}</span>
                  <span className="bg-[#E6EAF3] text-[#5B6EF8] px-2 py-1 rounded-lg text-xs font-semibold">{session.duration}</span>
                </div>
                <h2 className="text-lg font-bold text-[#3B4A6B] mb-1">{session.title}</h2>
                {session.instructor && <span className="text-xs text-[#6B7280]">{session.instructor}</span>}
              </div>
              <button className="ml-2">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="#E6EAF3"/><path d="M7 7h10v10H7V7z" fill="#5B6EF8"/></svg>
              </button>
            </div>
            {session.progress !== undefined && (
              <div className="mb-2">
                <div className="flex justify-between text-xs text-[#6B7280] mb-1">
                  <span>COURSE PROGRESS</span>
                  <span>{session.progress}%</span>
                </div>
                <div className="w-full h-2 bg-[#E6EAF3] rounded-full">
                  <div className="h-2 bg-[#5B6EF8] rounded-full" style={{ width: `${session.progress}%` }} />
                </div>
              </div>
            )}
            <button className={`mt-4 px-6 py-2 rounded-lg font-medium text-white ${session.watched ? "bg-[#E6EAF3] text-[#5B6EF8]" : "bg-[#5B6EF8]"}`}>
              {session.type === "Yoga Program" ? "Resume Session" : "Watch Now"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
