import React from "react";
import { Music, Plus } from "lucide-react";

const reminders = [
  {
    id: 1,
    label: "TODAY",
    labelColor: "text-blue-500",
    time: "18:30",
    title: "Live: Sunset Yoga",
    subtitle: "with Master Aradhana",
  },
  {
    id: 2,
    label: "TODAY",
    labelColor: "text-purple-500",
    time: "21:00",
    title: "Bedtime Nidra",
    subtitle: "Guided sleep meditation",
  },
  {
    id: 3,
    label: "TOMORROW",
    labelColor: "text-orange-400",
    time: "06:00",
    title: "Morning Ritual",
    subtitle: "Daily habit reminder",
  },
];

export default function UserRightSidebar() {
  return (
    <aside className="w-80 bg-white/50 backdrop-blur border-l border-purple-200 p-6 space-y-6 rounded-2xl min-h-screen">
      {/* Mantra of the Day */}
      <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl p-6 text-white mb-4">
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
          {reminders.map((reminder) => (
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
        <p className="text-sm text-gray-600 mb-4">6 of 8 sessions completed</p>
        <div className="w-full bg-purple-100 rounded-full h-3 mb-4">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full" style={{ width: '75%' }}></div>
        </div>
        <button className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition">
          VIEW INSIGHTS
        </button>
      </div>
    </aside>
  );
}
