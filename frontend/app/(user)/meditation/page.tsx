import React from "react";

const meditationVideos = [
  {
    id: 1,
    title: "Morning Clarity with Rahul",
    instructor: "Rahul Verma - Senior Instructor",
    tag: "MINDFULNESS",
    duration: "12:45",
    image: "/images/morning-clarity.jpg",
  },
  {
    id: 2,
    title: "Anxiety Release with Sarah",
    instructor: "Sarah Jenkins - Mindfulness Coach",
    tag: "STRESS RELIEF",
    duration: "15:00",
    image: "/images/anxiety-release.jpg",
  },
  {
    id: 3,
    title: "Digital Detox & Sharp Focus",
    instructor: "Dr. Emily Chen - Neurologist",
    tag: "FOCUS",
    duration: "9:30",
    image: "/images/digital-detox.jpg",
  },
];

export default function MeditationPage() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-blue-100">
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#3B4A6B]">Meditation Library</h1>
            <p className="text-[#6B7280] mt-2">Discover peace through curated visual experiences.</p>
          </div>
          <div>
            <input
              type="text"
              placeholder="Search sessions..."
              className="border border-[#E6EAF3] rounded-lg px-4 py-2 focus:outline-none"
            />
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex space-x-4 mb-8">
          <button className="bg-[#5B6EF8] text-white px-4 py-2 rounded-lg font-medium">All</button>
          <button className="bg-[#E6EAF3] text-[#3B4A6B] px-4 py-2 rounded-lg font-medium">Sleep</button>
          <button className="bg-[#E6EAF3] text-[#3B4A6B] px-4 py-2 rounded-lg font-medium">Stress</button>
          <button className="bg-[#E6EAF3] text-[#3B4A6B] px-4 py-2 rounded-lg font-medium">Focus</button>
          <button className="bg-[#E6EAF3] text-[#3B4A6B] px-4 py-2 rounded-lg font-medium">Beginners</button>
        </div>

        {/* Featured Video */}
        <div className="flex mb-10">
          <div className="w-2/3 flex justify-center items-center">
            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
              <div className="w-80 h-80 bg-[#E6EAF3] rounded-xl flex items-center justify-center">
                <button className="bg-white rounded-full p-4 shadow-lg">
                  <svg width="48" height="48" fill="none" viewBox="0 0 48 48">
                    <circle cx="24" cy="24" r="24" fill="#5B6EF8" />
                    <polygon points="20,16 36,24 20,32" fill="white" />
                  </svg>
                </button>
              </div>
              <div className="mt-6 text-center">
                <span className="bg-[#E6EAF3] text-[#5B6EF8] px-3 py-1 rounded-lg text-xs font-semibold">PREMIUM SESSION</span>
                <h2 className="text-2xl font-bold text-[#3B4A6B] mt-4">Guided Sleep Meditation for Inner Peace</h2>
                <p className="text-[#6B7280] mt-2">A tranquil journey through soothing soundscapes designed to quiet the mind and prepare your body for a restorative night's rest.</p>
                <div className="flex items-center justify-center mt-4 space-x-6">
                  <span className="text-[#6B7280]">20 mins</span>
                  <span className="text-[#6B7280]">All levels</span>
                </div>
                <button className="mt-6 bg-[#5B6EF8] text-white px-6 py-2 rounded-lg font-medium">Start Session</button>
              </div>
            </div>
          </div>
          <div className="w-1/3 pl-8">
            {/* Optionally add more info or recommendations here */}
          </div>
        </div>

        {/* Recommended Videos */}
        <div>
          <h3 className="text-xl font-bold text-[#3B4A6B] mb-4">Recommended for You</h3>
          <div className="flex space-x-6">
            {meditationVideos.map((video) => (
              <div key={video.id} className="bg-white rounded-xl shadow-lg p-4 w-64">
                <div className="h-40 w-full bg-[#E6EAF3] rounded-lg mb-4 flex items-center justify-center">
                  {/* Replace with <img src={video.image} alt={video.title} /> if images available */}
                  <span className="text-[#6B7280]">Image</span>
                </div>
                <span className="bg-[#E6EAF3] text-[#5B6EF8] px-2 py-1 rounded-lg text-xs font-semibold mb-2 inline-block">
                  {video.tag}
                </span>
                <h4 className="text-lg font-bold text-[#3B4A6B] mb-1">{video.title}</h4>
                <p className="text-[#6B7280] text-sm mb-2">{video.instructor}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[#6B7280] text-xs">{video.duration}</span>
                  <button className="bg-[#5B6EF8] text-white px-3 py-1 rounded-lg text-xs font-medium">Start</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}