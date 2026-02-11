"use client";

import { useState } from "react";
import UserRightSidebar from "../(user)/_components/UserRightSidebar";

const mantras = [
  {
    name: "Gayatri Mantra",
    subtitle: "Illumination & Wisdom",
    color: "border-[#5B6EF8]",
    icon: "🔔",
    text: `ॐ भूर्भुवः स्वः ।\nतत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि ।\nधियो यो नः प्रचोदयात् ॥`,
    translation: `Om Bhur Bhuvah Svah\nTat Savitur Varenyam Bhargo Devasya Dhimahi\nDhiyo Yo Nah Prachodayat`,
    audio: "#",
    duration: "11:08",
    current: true,
  },
  {
    name: "Maha Mrityunjaya",
    subtitle: "Healing & Protection",
    color: "border-green-400",
    icon: "🟢",
    text: `ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्।\nउर्वारुकमिव बन्धनान् मृत्योर्मुक्षीय माऽमृतात्॥`,
    translation: `Om Tryambakam Yajamahe Sugandhim Pushtivardhanam\nUrvarukamiva Bandhanan Mrityor Mukshiya Maamritat`,
    audio: "#",
    duration: "9:30",
  },
  {
    name: "Om Shanti",
    subtitle: "Inner Peace & Harmony",
    color: "border-yellow-400",
    icon: "🟡",
    text: `ॐ शान्तिः शान्तिः शान्तिः`,
    translation: `Om Peace Peace Peace`,
    audio: "#",
    duration: "7:45",
  },
  {
    name: "Om Mani Padme Hum",
    subtitle: "Compassion & Clarity",
    color: "border-blue-400",
    icon: "🔵",
    text: `ॐ मणि पद्मे हूँ`,
    translation: `Om the jewel in the lotus, hum`,
    audio: "#",
    duration: "8:20",
  },
  {
    name: "Lokah Samastah",
    subtitle: "Universal Well-being",
    color: "border-red-400",
    icon: "🔴",
    text: `लोकाः समस्ताः सुखिनो भवन्तु`,
    translation: `May all beings everywhere be happy and free`,
    audio: "#",
    duration: "6:30",
  },
  {
    name: "Hanuman Chalisa",
    subtitle: "Strength & Devotion",
    color: "border-orange-400",
    icon: "🟠",
    text: `श्रीगुरु चरन सरोज रज...`,
    translation: `Forty verses in praise of Lord Hanuman`,
    audio: "#",
    duration: "20:00",
  },
  {
    name: "Saraswati Vandana",
    subtitle: "Knowledge & Wisdom",
    color: "border-purple-400",
    icon: "🟣",
    text: `या कुन्देन्दुतुषारहारधवला...`,
    translation: `Salutation to Goddess Saraswati`,
    audio: "#",
    duration: "5:30",
  },
  {
    name: "Dhanvantri Mantra",
    subtitle: "Health & Healing",
    color: "border-teal-400",
    icon: "🟢",
    text: `ॐ शं नो देवीरभिष्टय...`,
    translation: `Prayer for health and healing`,
    audio: "#",
    duration: "4:45",
  },
];

const filters = ["All", "Peace", "Health", "Abundance"];


export default function MantraProgramPage() {
  const [selected, setSelected] = useState(0);
  const [filter, setFilter] = useState("All");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [ambient, setAmbient] = useState(false);
  const [downloaded, setDownloaded] = useState<number[]>([]);

  const mantra = mantras[selected];

  const toggleFavorite = () => {
    setFavorites((prev) =>
      prev.includes(selected) ? prev.filter((i) => i !== selected) : [...prev, selected]
    );
  };
  const toggleDownload = () => {
    setDownloaded((prev) =>
      prev.includes(selected) ? prev.filter((i) => i !== selected) : [...prev, selected]
    );
  };

  return (
    <div className="flex min-h-screen bg-linear-to-br from-purple-100 via-purple-50 to-blue-100">
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-[#3B4A6B] mb-2">Mantra Library</h1>
        <p className="text-[#6B7280] mb-8">Sacred sounds for your spiritual well-being and daily practice.</p>
        <div className="flex items-center mb-6">
          <input
            type="text"
            placeholder="Search mantras..."
            className="border border-[#E6EAF3] rounded-lg px-4 py-2 focus:outline-none w-80 mr-4"
          />
          <div className="flex space-x-2">
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
        </div>
        <div className="flex gap-8">
          {/* Mantra List */}
          <div className="w-72 flex flex-col gap-4">
            {mantras.map((m, i) => (
              <button
                key={m.name}
                className={`flex flex-col items-start p-4 rounded-2xl border-2 bg-white shadow transition-all ${i === selected ? m.color + " bg-blue-50" : "border-transparent"}`}
                onClick={() => setSelected(i)}
              >
                <span className="text-2xl mb-2">{m.icon}</span>
                <span className="font-bold text-[#3B4A6B] text-lg">{m.name}</span>
                <span className="text-xs text-[#6B7280]">{m.subtitle}</span>
                {favorites.includes(i) && <span className="text-xs text-[#5B6EF8] mt-1">★ Favorite</span>}
                {downloaded.includes(i) && <span className="text-xs text-green-600 mt-1">⬇ Downloaded</span>}
              </button>
            ))}
          </div>
          {/* Main Player & Details */}
          <div className="flex-1 flex flex-col gap-6">
            <div className="bg-gradient-to-br from-[#5B6EF8] to-[#7F9CF5] rounded-2xl shadow-lg p-8 text-white relative">
              <div className="flex items-center justify-between mb-4">
                <span className="uppercase text-xs tracking-widest opacity-80">Now Playing</span>
                <div className="flex items-center gap-6">
                  <button className={`text-white/80 hover:text-white text-sm ${favorites.includes(selected) ? 'font-bold underline' : ''}`} onClick={toggleFavorite}>
                    {favorites.includes(selected) ? 'Favorited' : 'Add to Favorites'}
                  </button>
                  <button className={`text-white/80 hover:text-white text-sm ${downloaded.includes(selected) ? 'font-bold underline' : ''}`} onClick={toggleDownload}>
                    {downloaded.includes(selected) ? 'Downloaded' : 'Download for Offline'}
                  </button>
                  <span className="ml-4 text-xs opacity-80">Ambient Sound</span>
                  <button className={`ml-2 bg-white/20 rounded-full px-2 py-1 ${ambient ? 'ring-2 ring-white' : ''}`} onClick={() => setAmbient((a) => !a)}>
                    {ambient ? '🎵 + 🌿 On' : '🎵 + 🌿 Off'}
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-2">{mantra.name}</h2>
                <div className="w-full flex items-center gap-4 mb-4">
                  <div className="flex-1 h-16 bg-white/20 rounded-lg flex items-end">
                    {/* Dummy waveform */}
                    <div className="w-full h-2/3 bg-gradient-to-r from-white/40 to-white/10 rounded-lg" />
                  </div>
                  <button className="bg-white/20 rounded-full p-4 hover:bg-white/30 transition">
                    <svg width="32" height="32" fill="none" viewBox="0 0 56 56">
                      <circle cx="28" cy="28" r="28" fill="white" fillOpacity="0.2" />
                      <polygon points="24,20 40,28 24,36" fill="white" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center justify-between w-full text-xs opacity-80">
                  <span>03:45</span>
                  <span>{mantra.duration}</span>
                </div>
              </div>
            </div>
            {/* Sanskrit & Translation */}
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="text-2xl font-bold text-[#3B4A6B] mb-4 whitespace-pre-line">{mantra.text}</div>
              <div className="text-[#6B7280] text-sm whitespace-pre-line">{mantra.translation}</div>
            </div>
          </div>
        </div>
      </div>
      <UserRightSidebar />
    </div>
  );
}
