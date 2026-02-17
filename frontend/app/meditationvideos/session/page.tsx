"use client";
import React from "react";
import Link from "next/link";

export default function MeditationSession() {
  return (
    <div className="flex min-h-screen bg-[#F8F9FB]">
      {/* Main Content and Right Sidebar only */}
      <main className="flex-1 flex flex-col p-0 md:p-10 justify-center items-center">
        <div className="w-full max-w-3xl py-8 px-4 md:px-10">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-[#22223B]">Morning Clarity with Rahul</h1>
            <div className="text-[#6C6C80] text-sm mt-1">Rahul Sharma &bull; 12:45 &bull; Mindfulness, Stress Relief</div>
          </div>
          <div className="rounded-2xl overflow-hidden shadow bg-white mb-8">
            <video
              className="w-full h-[320px] md:h-[400px] object-cover bg-black"
              controls
              poster="/images/meditation-poster.jpg"
            >
              <source src="/videos/vdo1.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div className="flex gap-2">
              <Link href="/saved">
                <button className="bg-[#7B61FF] hover:bg-[#6B4FD6] text-white px-6 py-2 rounded-lg font-semibold shadow transition">Save Session</button>
              </Link>
              <button className="border border-gray-300 px-6 py-2 rounded-lg font-semibold text-[#22223B] hover:bg-gray-100 transition">Add to Favorites</button>
            </div>
            <div className="flex gap-4 text-xs md:text-sm text-[#6C6C80]">
              <span>Level: <span className="font-semibold text-[#7B61FF]">Beginner</span></span>
              <span>Category: <span className="font-semibold text-[#7B61FF]">Mindfulness</span></span>
              <span>Language: <span className="font-semibold text-[#7B61FF]">English</span></span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-semibold text-[#22223B] mb-2 flex items-center gap-2"><span className="material-icons text-[#7B61FF]">expand_more</span>Description</h2>
              <p className="text-[#444] text-base mb-4">Start your day with mental clarity and calm in this guided morning meditation with Rahul. This session will gently lead you through mindful breathing and affirmations to help you release tension and set a positive tone for the day.</p>
              <h2 className="text-lg font-semibold text-[#22223B] mb-2 flex items-center gap-2"><span className="material-icons text-[#7B61FF]">expand_more</span>What you'll experience</h2>
              <ul className="list-disc ml-6 text-[#444] text-base mb-4">
                <li>Guided mindful breathing exercises</li>
                <li>Positive morning affirmations</li>
                <li>Visualization for a fresh start</li>
                <li>Gentle body awareness</li>
              </ul>
              <h2 className="text-lg font-semibold text-[#22223B] mb-2 flex items-center gap-2"><span className="material-icons text-[#7B61FF]">expand_more</span>Instructor</h2>
              <div className="flex items-center gap-3 mb-2">
                <img src="/images/rahul-avatar.png" alt="Rahul Sharma" className="w-10 h-10 rounded-full object-cover border-2 border-[#7B61FF]" />
                <div>
                  <div className="font-semibold text-[#22223B]">Rahul Sharma</div>
                  <div className="text-xs text-[#6C6C80]">Certified Meditation Coach</div>
                </div>
              </div>
              <p className="text-[#444] text-sm mb-2">Rahul has over 10 years of experience in mindfulness and stress relief practices, helping thousands find clarity and calm.</p>
            </div>
            <div>
              <div className="mb-6">
                <h2 className="font-semibold text-[#22223B] mb-2">Benefits</h2>
                <ul className="list-disc ml-6 text-[#444] text-base">
                  <li>Enhances mental clarity and focus</li>
                  <li>Reduces stress and anxiety</li>
                  <li>Boosts energy and positive mindset</li>
                  <li>Improves emotional balance</li>
                  <li>Promotes better sleep</li>
                </ul>
              </div>
              <div className="mb-6">
                <h2 className="font-semibold text-[#22223B] mb-2">Preparation Tips</h2>
                <ul className="list-disc ml-6 text-[#444] text-base">
                  <li>Use headphones for better focus</li>
                  <li>Find a quiet, comfortable space</li>
                  <li>Wear loose, comfortable clothing</li>
                  <li>Keep a bottle of water nearby</li>
                </ul>
              </div>
              <div>
                <h2 className="font-semibold text-[#22223B] mb-2">Session Details</h2>
                <ul className="list-disc ml-6 text-[#444] text-base">
                  <li>Duration: 12:45 minutes</li>
                  <li>Recommended time: Morning</li>
                  <li>Equipment: None required</li>
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
