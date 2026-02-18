"use client";
import React from "react";
import Sidebar from "../(user)/_components/Sidebar";
import UserHeader from "../(user)/_components/UserHeader";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const books = [
  {
    title: "The Yoga Sutras",
    author: "Patanjali",
    description: "A foundational text of yoga philosophy, ...",
    image: "/images/the%20heart%20of%20yoga.jpg",
  },
  {
    title: "The Power of Now",
    author: "Eckhart Tolle",
    description: "A guide to spiritual enlightenment through ...",
    image: "/images/power-of-now.jpg",
  },
  {
    title: "Autobiography of a Yogi",
    author: "Paramahansa Yogananda",
    description: "The life story of a spiritual master and teacher ...",
    image: "/images/autobiography-of-a-yogi.jpg",
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    description: "Tiny changes that lead to remarkable results ...",
    image: "/images/atomic-habits.jpg",
  },
  {
    title: "Think Like a Monk",
    author: "Jay Shetty",
    description: "Training your mind for peace and purpose ...",
    image: "/images/think-like-a-monk.jpg",
  },
  {
    title: "Inner Engineering",
    author: "Sadhguru",
    description: "A yogi's guide to joy and wellbeing through ...",
    image: "/images/inner-engineering.jpg",
  },
  {
    title: "The Bhagavad Gita",
    author: "Vyasa",
    description: "A classic scripture of yoga and spiritual wisdom ...",
    image: "/images/bhagavad-gita.jpg",
  },
  {
    title: "Light on Yoga",
    author: "B.K.S. Iyengar",
    description: "Comprehensive guide to yoga postures and philosophy ...",
    image: "/images/light-on-yoga.jpg",
  },
  {
    title: "The Four Agreements",
    author: "Don Miguel Ruiz",
    description: "A practical guide to personal freedom ...",
    image: "/images/four-agreements.jpg",
  },
  {
    title: "The Untethered Soul",
    author: "Michael A. Singer",
    description: "Journey beyond yourself to inner peace ...",
    image: "/images/untethered-soul.jpg",
  },
  {
    title: "Waking Up",
    author: "Sam Harris",
    description: "A guide to spirituality without religion ...",
    image: "/images/waking-up.jpg",
  },
  {
    title: "The Miracle of Mindfulness",
    author: "Thich Nhat Hanh",
    description: "An introduction to mindfulness practice ...",
    image: "/images/miracle-of-mindfulness.jpg",
  },
];

export default function WisdomLibraryPage() {
  const [savedBooks, setSavedBooks] = React.useState<number[]>([]);
  const { user } = useAuth();
  const router = useRouter();
  const { logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  const handleToggleSave = (idx: number) => {
    setSavedBooks((prev) =>
      prev.includes(idx)
        ? prev.filter((i) => i !== idx)
        : [...prev, idx]
    );
  };

  const handleLogout = async () => {
    setShowLogoutModal(false);
    await logout();
    router.push("/auth/login");
  };

  return (
    <div className="flex min-h-screen bg-linear-to-br from-[#e7e0ff] via-[#f3eaff] to-[#e0eaff]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <UserHeader />
        <div className="flex flex-1 gap-8 p-8">
          {/* Main Content */}
          <section className="flex-1 flex flex-col items-center">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow p-8 mt-2">
              <div className="flex items-center gap-4 mb-6">
                <span className="inline-block bg-[#7B61FF] rounded-full p-2"><svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M4 19V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v14" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 19h16" stroke="#7B61FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                <h1 className="text-3xl font-bold text-[#4b2676]">Wisdom Library</h1>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map((book, idx) => (
                  <div key={idx} className="bg-[#e7e0ff] rounded-xl p-6 shadow flex flex-col items-center relative">
                    <img src="/images/the%20heart%20of%20yoga.jpg" alt={book.title} className="w-40 h-56 rounded-xl object-cover mb-4" />
                    <h2 className="text-xl font-bold text-[#4b2676] mb-2">{book.title}</h2>
                    <span className="text-sm text-[#7B61FF] mb-2">{book.author}</span>
                    <p className="text-sm text-[#6C6C80] text-center mb-2">{book.description}</p>
                    <button
                      className="absolute top-4 right-4 focus:outline-none"
                      onClick={() => handleToggleSave(idx)}
                      aria-label={savedBooks.includes(idx) ? 'Unsave book' : 'Save book'}
                    >
                      {savedBooks.includes(idx) ? (
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#7B61FF]">
                          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path d="M7 5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v14l-5-3-5 3V5z" fill="#fff" stroke="#fff" strokeWidth="2" />
                          </svg>
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-200">
                          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path d="M7 5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v14l-5-3-5 3V5z" stroke="#7B61FF" strokeWidth="2" fill="none" />
                          </svg>
                        </span>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        
          {/* Right Sidebar */}
          <div className="w-80 bg-white/50 backdrop-blur border-l border-purple-200 p-6 space-y-6">
            {/* Mantra of the Day */}
            <div className="bg-linear-to-br from-[#7B61FF] to-[#5B6EF8] rounded-2xl p-6 text-white">
              <p className="text-sm font-semibold mb-3 opacity-90">Mantra of the Day</p>
              <h3 className="text-2xl font-bold mb-2 leading-tight">
                Lokah Samastah Sukhino Bhavantu
              </h3>
              <p className="text-sm opacity-90 mb-4">
                "May all beings everywhere be happy and free"
              </p>
              <button className="w-full bg-white text-purple-600 py-3 rounded-xl font-semibold hover:bg-purple-50 transition flex items-center justify-center gap-2">
                <span className="material-icons">music_note</span> Listen & Chant
              </button>
            </div>
            {/* Reminders */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Reminders</h3>
                <button className="text-purple-600 hover:text-purple-700">
                  <span className="material-icons">add</span>
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
                <span className="text-2xl font-bold text-purple-600">60%</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">3 of 5 books read</p>
              <div className="w-full bg-purple-100 rounded-full h-3 mb-4">
                <div className="bg-linear-to-r from-purple-500 to-blue-500 h-3 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <button className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition">
                VIEW INSIGHTS
              </button>
            </div>
          </div>
        </div>
        <button
          className="mt-4 w-full bg-[#7B61FF] text-white py-3 rounded-xl font-semibold hover:bg-[#5B6EF8] transition flex items-center justify-center gap-2"
          onClick={() => setShowLogoutModal(true)}
        >
          <span className="material-icons">logout</span> Logout
        </button>

        {/* Logout Confirmation Modal */}
        {showLogoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full relative">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
                onClick={() => setShowLogoutModal(false)}
                aria-label="Close"
              >
                &times;
              </button>
              <div className="flex flex-col items-center">
                <div className="bg-red-100 rounded-full p-4 mb-4">
                  <span className="material-icons text-red-500 text-4xl">error_outline</span>
                </div>
                <h2 className="text-xl font-bold mb-2 text-center">Are you sure you want to log out?</h2>
                <p className="text-gray-600 mb-6 text-center">You will be logged out of your account.</p>
                <div className="flex gap-4 w-full">
                  <button
                    className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition"
                    onClick={() => setShowLogoutModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex-1 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition"
                    onClick={handleLogout}
                  >
                    Log Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



