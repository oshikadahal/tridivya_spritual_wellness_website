
'use client';

import UserRightSidebar from "../_components/UserRightSidebar";
import { useState } from "react";

const meditationVideos = [
  {
    id: 1,
    title: "Morning Clarity with Rahul",
    instructor: "Rahul Verma - Senior Instructor",
    tag: "MINDFULNESS",
    duration: "12:45",
    image: "/images/morning-clarity.jpg",
    description: "Start your day with clarity and calm through mindful breathing and visualization.",
    videoUrl: "#"
  },
  {
    id: 2,
    title: "Anxiety Release with Sarah",
    instructor: "Sarah Jenkins - Mindfulness Coach",
    tag: "STRESS RELIEF",
    duration: "15:00",
    image: "/images/anxiety-release.jpg",
    description: "Let go of anxiety and tension with this guided meditation for stress relief.",
    videoUrl: "#"
  },
  {
    id: 3,
    title: "Digital Detox & Sharp Focus",
    instructor: "Dr. Emily Chen - Neurologist",
    tag: "FOCUS",
    duration: "9:30",
    image: "/images/digital-detox.jpg",
    description: "Sharpen your focus and disconnect from digital distractions.",
    videoUrl: "#"
  },
  {
    id: 4,
    title: "Evening Calm with Priya",
    instructor: "Priya Sharma - Yoga Therapist",
    tag: "RELAXATION",
    duration: "18:20",
    image: "/images/evening-calm.jpg",
    description: "Wind down and relax with this calming evening meditation.",
    videoUrl: "#"
  },
  {
    id: 5,
    title: "Mindful Breathing",
    instructor: "Alex Kim - Breath Coach",
    tag: "BREATHING",
    duration: "10:00",
    image: "/images/mindful-breathing.jpg",
    description: "Practice mindful breathing to center yourself and reduce stress.",
    videoUrl: "#"
  },
  {
    id: 6,
    title: "Body Scan Meditation",
    instructor: "Dr. Emily Chen - Neurologist",
    tag: "AWARENESS",
    duration: "14:10",
    image: "/images/body-scan.jpg",
    description: "Increase body awareness and relaxation with this guided scan.",
    videoUrl: "#"
  },
  {
    id: 7,
    title: "Stress Relief Flow",
    instructor: "Sarah Jenkins - Mindfulness Coach",
    tag: "STRESS RELIEF",
    duration: "16:00",
    image: "/images/stress-relief.jpg",
    description: "A gentle flow to help you release stress and tension.",
    videoUrl: "#"
  },
  {
    id: 8,
    title: "Morning Energy Boost",
    instructor: "Rahul Verma - Senior Instructor",
    tag: "ENERGY",
    duration: "11:30",
    image: "/images/energy-boost.jpg",
    description: "Boost your energy and motivation for the day ahead.",
    videoUrl: "#"
  },
  {
    id: 9,
    title: "Deep Focus Meditation",
    instructor: "Alex Kim - Breath Coach",
    tag: "FOCUS",
    duration: "13:45",
    image: "/images/deep-focus.jpg",
    description: "Achieve deep focus and clarity with this meditation.",
    videoUrl: "#"
  },
];

export default function MeditationVideosPage() {
  const [featured, setFeatured] = useState(meditationVideos[0]);

  return (
    <div className="flex min-h-screen bg-linear-to-br from-purple-100 via-purple-50 to-blue-100">
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#3B4A6B]">Meditation Videos</h1>
            <p className="text-[#6B7280] mt-2">Browse and play meditation sessions for every mood and goal.</p>
          </div>
          <div>
            <input
              type="text"
              placeholder="Search sessions..."
              className="border border-[#E6EAF3] rounded-lg px-4 py-2 focus:outline-none"
            />
          </div>
        </div>

        {/* Featured Video */}
        <div className="flex mb-10">
          <div className="w-2/3 flex justify-center items-center">
            <div className="bg-white rounded-2xl shadow-lg p-10 flex flex-col items-center w-full max-w-2xl">
              {/* Video Player or Thumbnail */}
              <div className="w-full aspect-video bg-black rounded-xl flex items-center justify-center mb-8 relative overflow-hidden">
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="bg-white bg-opacity-80 rounded-full p-6 shadow-lg hover:scale-105 transition-transform">
                    <svg width="56" height="56" fill="none" viewBox="0 0 56 56">
                      <circle cx="28" cy="28" r="28" fill="#5B6EF8" />
                      <polygon points="24,20 40,28 24,36" fill="white" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="mt-2 text-center w-full max-w-xl mx-auto">
                <span className="bg-[#E6EAF3] text-[#5B6EF8] px-4 py-2 rounded-lg text-xs font-semibold">{featured.tag}</span>
                <h2 className="text-3xl font-bold text-[#3B4A6B] mt-6 mb-4">{featured.title}</h2>
                <p className="text-[#6B7280] text-lg mb-6">{featured.description}</p>
                <div className="flex items-center justify-center mt-2 space-x-8 text-base">
                  <span className="text-[#6B7280]">{featured.duration}</span>
                  <span className="text-[#6B7280]">{featured.instructor}</span>
                </div>
                <button className="mt-8 bg-[#5B6EF8] text-white px-8 py-3 rounded-lg font-medium text-lg">Start Session</button>
              </div>
            </div>
          </div>
          <div className="w-1/3 pl-8">
            {/* Optionally add more info or recommendations here */}
          </div>
        </div>

        {/* Meditation Videos Grid */}
        <div>
          <h3 className="text-xl font-bold text-[#3B4A6B] mb-4">All Meditation Videos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {meditationVideos.map((video) => (
              <div
                key={video.id}
                className={`bg-white rounded-xl shadow-lg p-4 cursor-pointer transition-transform hover:scale-105 border-2 ${featured.id === video.id ? 'border-[#5B6EF8]' : 'border-transparent'}`}
                onClick={() => setFeatured(video)}
              >
                <div className="h-40 w-full bg-[#E6EAF3] rounded-lg mb-4 overflow-hidden flex items-center justify-center">
                  <img
                    src={video.image}
                    alt={video.title}
                    className="object-cover w-full h-full"
                  />
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
      <UserRightSidebar />
    </div>
  );
}
