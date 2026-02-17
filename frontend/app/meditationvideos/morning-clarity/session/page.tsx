
"use client";
import Sidebar from "@/app/(user)/_components/Sidebar";
import UserHeader from "@/app/(user)/_components/UserHeader";
import { Music, Plus, Clock, User } from "lucide-react";
import Image from "next/image";

export default function MorningClaritySessionPage() {
  return (
    <div className="flex min-h-screen bg-linear-to-br from-[#e7e0ff] via-[#f3eaff] to-[#e0eaff]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <UserHeader />
        <div className="flex flex-1 gap-8 p-8">
          {/* Main Content */}
          <section className="flex-1 flex flex-col items-center">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow p-8 mt-2">
              <div className="rounded-3xl overflow-hidden mb-6">
                <video
                  src="/videos/vdo1.mp4"
                  controls
                  poster="/images/landing.png"
                  className="w-full h-96 object-cover bg-black"
                />
              </div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                <div>
                  <h1 className="text-3xl font-bold text-[#4b2676] mb-1">Morning Clarity with Rahul</h1>
                  <p className="text-lg text-[#6c4bb6] mb-2">Start your day with clarity and calm through mindful breathing and visualization.</p>
                  <div className="flex items-center gap-4 mb-2">
                    <span className="flex items-center gap-1 text-[#7c5fe6] font-semibold"><Clock className="w-5 h-5" /> 12:45</span>
                    <span className="flex items-center gap-1 text-[#7c5fe6] font-semibold"><User className="w-5 h-5" /> Rahul Verma - Senior Instructor</span>
                  </div>
                  <div className="bg-[#e7e0ff] rounded-xl p-4 text-[#4b2676] font-medium shadow mb-2">
                    <span className="block mb-1 font-semibold">Session Overview</span>
                    <span>Begin your morning with a guided meditation focused on mindful breathing and gentle visualization. This session is designed to help you cultivate clarity, calm, and a positive mindset for the day ahead.</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* Right Sidebar */}
          <div className="w-80 bg-white/50 backdrop-blur border-l border-purple-200 p-6 space-y-6">
            {/* Mantra of the Day */}
            <div className="bg-linear-to-br from-purple-500 to-blue-500 rounded-2xl p-6 text-white">
              <p className="text-sm font-semibold mb-3 opacity-90">Mantra of the Day</p>
              <h3 className="text-2xl font-bold mb-2 leading-tight">
                Lokah Samastah Sukhino Bhavantu
              </h3>
              <p className="text-sm opacity-90 mb-4">
                "May all beings everywhere be happy and free"
              </p>
              <button className="w-full bg-white text-purple-600 py-3 rounded-xl font-semibold hover:bg-purple-50 transition flex items-center justify-center gap-2">
                <Music className="w-5 h-5" /> Listen & Chant
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
                <div className="bg-white border border-purple-200 rounded-xl p-4 hover:shadow-md transition">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-bold text-blue-500">TODAY</span>
                    <span className="text-lg font-bold text-purple-600">18:30</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Live: Sunset Yoga</h4>
                  <p className="text-sm text-gray-600">with Master Stephanie</p>
                </div>
                <div className="bg-white border border-purple-200 rounded-xl p-4 hover:shadow-md transition">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-bold text-purple-500">TODAY</span>
                    <span className="text-lg font-bold text-purple-600">21:00</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Bedtime Nidra</h4>
                  <p className="text-sm text-gray-600">Guided sleep meditation</p>
                </div>
                <div className="bg-white border border-purple-200 rounded-xl p-4 hover:shadow-md transition">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-bold text-orange-400">TOMORROW</span>
                    <span className="text-lg font-bold text-purple-600">06:00</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Morning Ritual</h4>
                  <p className="text-sm text-gray-600">Start fresh morning</p>
                </div>
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
                <div className="bg-linear-to-r from-purple-500 to-blue-500 h-3 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <button className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition">
                VIEW INSIGHTS
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

