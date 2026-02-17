
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function MorningClarityPage() {
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  const handleSaveSession = () => {
    // Save session to localStorage (simulate persistent save)
    const session = {
      type: "Meditation",
      duration: "12:45",
      title: "Morning Clarity with Rahul",
      instructor: "Rahul Sharma",
      image: "/images/meditation-poster.jpg",
      watched: false,
    };
    const prev = JSON.parse(localStorage.getItem("savedSessions") || "[]");
    // Avoid duplicates
    if (!prev.some((s: any) => s.title === session.title)) {
      localStorage.setItem("savedSessions", JSON.stringify([session, ...prev]));
    }
    setSaved(true);
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FB]">
      {/* Sidebar removed as requested. */}

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-10">
        <div className="max-w-4xl mx-auto w-full">
          <h2 className="text-lg font-semibold mb-4 text-[#22223B]">Meditation Session</h2>
          <div className="rounded-xl overflow-hidden shadow bg-white mb-6">
            <video
              className="w-full h-[350px] object-cover bg-black"
              controls
              poster="/images/meditation-poster.jpg"
            >
              <source src="/videos/vdo1.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-[#22223B]">Morning Clarity with Rahul</h3>
              <div className="text-[#6C6C80] text-sm mt-1">Rahul Sharma · 12:45 · Mindfulness, Stress Relief</div>
            </div>
            <div className="flex gap-2">
              <button
                className={`px-4 py-2 rounded-lg font-semibold ${saved ? "bg-green-500 text-white" : "bg-[#7B61FF] text-white"}`}
                onClick={handleSaveSession}
                disabled={saved}
              >
                {saved ? "Session Saved" : "Save Session"}
              </button>
              <button className="border border-gray-300 px-4 py-2 rounded-lg font-semibold text-[#22223B]">Add to Favorites</button>
            </div>
          </div>
          <div className="bg-[#F8F9FB] rounded-xl p-6 flex gap-6">
            <div className="flex-1">
              <div className="mb-4">
                <button className="flex items-center gap-2 text-[#7B61FF] font-semibold mb-2">
                  <span className="material-icons">expand_more</span> Description
                </button>
                <div className="text-[#22223B] text-sm">
                  Start your day with mental clarity and calm in this guided morning meditation with Rahul. This session will gently lead you through mindful breathing and affirmations to help you release tension and set a positive tone for the day.
                </div>
              </div>
              <div>
                <button className="flex items-center gap-2 text-[#7B61FF] font-semibold mb-2">
                  <span className="material-icons">expand_more</span> What you'll experience
                </button>
                <ul className="list-disc ml-6 text-[#22223B] text-sm">
                  <li>Guided mindful breathing exercises</li>
                  <li>Positive morning affirmations</li>
                </ul>
              </div>
            </div>
            <div className="w-64 flex-shrink-0">
              <div className="mb-4">
                <div className="font-semibold text-[#22223B] mb-2">Benefits</div>
                <ul className="list-disc ml-6 text-[#22223B] text-sm">
                  <li>Enhances mental clarity and focus</li>
                  <li>Reduces stress and anxiety</li>
                  <li>Boosts energy and positive mindset</li>
                </ul>
              </div>
              <div>
                <div className="font-semibold text-[#22223B] mb-2">Preparation Tips</div>
                <ul className="list-disc ml-6 text-[#22223B] text-sm">
                  <li>Use headphones for better focus</li>
                  <li>Find a quiet, comfortable space</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="w-80 bg-[#F5F6FA] p-6 border-l border-gray-200 flex flex-col gap-6">
        <div className="bg-[#7B61FF] rounded-xl p-4 text-white mb-4">
          <div className="font-semibold text-lg mb-1">Mantra of the Day</div>
          <div className="mb-2">Lokah Samastah Sukhino Bhavantu</div>
          <div className="text-xs mb-3">"May all beings everywhere be happy and free"</div>
          <button className="bg-white text-[#7B61FF] px-4 py-2 rounded-lg font-semibold">Listen & Chant</button>
        </div>
        <div className="bg-white rounded-xl p-4 mb-4">
          <div className="font-semibold text-[#22223B] mb-2">Reminders</div>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between"><span>Live: Sunset Yoga</span><span className="font-semibold text-[#7B61FF]">18:30</span></div>
            <div className="flex justify-between"><span>Bedtime Nidra</span><span className="font-semibold text-[#7B61FF]">21:00</span></div>
            <div className="flex justify-between"><span>Morning Ritual</span><span className="font-semibold text-[#7B61FF]">06:00</span></div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 flex flex-col items-center">
          <div className="font-semibold text-[#22223B] mb-2">Weekly Goal</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div className="bg-[#7B61FF] h-2 rounded-full" style={{ width: "75%" }}></div>
          </div>
          <div className="text-xs text-[#6C6C80] mb-2">5 of 7 sessions completed</div>
          <button className="bg-[#7B61FF] text-white px-4 py-2 rounded-lg font-semibold w-full">VIEW INSIGHTS</button>
        </div>
      </aside>
    </div>
  );
}
