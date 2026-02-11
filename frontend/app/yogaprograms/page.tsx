"use client";

import UserRightSidebar from "../(user)/_components/UserRightSidebar";

const recommended = {
  title: "Hatha Fundamentals",
  description: "Perfect for your current progress. This path focuses on foundational alignment and breathwork for inner balance.",
  lessons: 15,
  weeks: 12,
  difficulty: "Beginner-Intermediate",
  image: "/images/recommended-yoga.jpg",
};

const beginnerBasics = [
  {
    title: "Sun Salutation Series",
    completed: "45% Completed • 3/7 Lessons",
    tags: ["FLEXIBILITY", "MOBILITY"],
    video: true,
    whatYouWillLearn: "Master the 12 basic postures of Surya Namaskar A & B with precise breathing techniques.",
    lessons: [
      "Introduction & Alignment",
      "Flow Connection (Part I)",
      "Breath Retention Masterclass",
    ],
  },
  {
    title: "Restorative Yin Yoga",
    completed: "Not Started • 0/10 Lessons",
    tags: ["RELAXATION"],
    video: true,
    whatYouWillLearn: "Release deep tissue tension and calm the nervous system through long-hold passive poses.",
    lessons: [
      "The Philosophy of Stillness",
      "Hip Openers for Sleep",
      "Deep Release: Upper Back",
    ],
  },
  {
    title: "Breathwork Mastery",
    completed: "15% Completed • 1/6 Lessons",
    tags: ["PRANAYAMA", "FOCUS"],
    video: true,
    whatYouWillLearn: "Control your vital energy through advanced yogic breathing techniques (Pranayama).",
    lessons: [
      "Diaphragmatic Awareness",
      "Ujjayi: The Victorious Breath",
      "Nadi Shodhana (Alternate)",
    ],
  },
];

const advancedMastery = [
  {
    title: "Power Vinyasa Flow",
    completed: "Not Started • 0/21 Lessons",
    tags: ["STRENGTH", "POWER"],
    video: false,
    whatYouWillLearn: "Dynamic, fast-paced sequences designed to build heat and muscular endurance.",
    lessons: [
      "Igniting the Inner Fire",
      "Arm Balance Foundations",
      "Advanced Jump-Throughs",
    ],
  },
  {
    title: "Inversion Masterclass",
    completed: "Not Started • 0/8 Lessons",
    tags: ["BALANCE", "ADVANCED"],
    video: true,
    whatYouWillLearn: "Conquer your fears and master the art of handstands, headstands, and forearm balances.",
    lessons: [
      "Shoulder Stability & Core",
      "Wall-Assisted Headstand",
      "Floating Off the Wall",
    ],
  },
];

export default function YogaProgramsPage() {
  return (
    <div className="flex min-h-screen bg-linear-to-br from-purple-100 via-purple-50 to-blue-100">
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-[#3B4A6B] mb-2">Yoga Programs</h1>
        <p className="text-[#6B7280] mb-8">Master your practice through structured step-by-step journeys.</p>

        {/* Recommended for You */}
        <div className="bg-white rounded-2xl shadow-lg flex items-center p-6 mb-10">
          <img src={recommended.image} alt="Recommended Yoga" className="w-48 h-48 rounded-xl object-cover mr-8" />
          <div className="flex-1">
            <span className="bg-[#5B6EF8] text-white px-3 py-1 rounded-lg text-xs font-semibold mb-2 inline-block">TOP PICK</span>
            <h2 className="text-2xl font-bold text-[#3B4A6B] mb-2">{recommended.title}</h2>
            <p className="text-[#6B7280] mb-4">{recommended.description}</p>
            <div className="flex items-center space-x-6 mb-4">
              <span className="text-[#6B7280] text-sm">{recommended.lessons} Lessons • {recommended.weeks} Weeks</span>
              <span className="text-[#6B7280] text-sm">Difficulty: {recommended.difficulty}</span>
            </div>
            <button className="bg-[#5B6EF8] text-white px-6 py-2 rounded-lg font-medium">View Details</button>
          </div>
        </div>

        {/* Beginner Basics */}
        <h3 className="text-xl font-bold text-[#3B4A6B] mb-4">Beginner Basics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {beginnerBasics.map((program, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col">
              {program.video ? (
                <div className="h-36 bg-black rounded-lg flex items-center justify-center mb-4 relative">
                  <svg width="48" height="48" fill="none" viewBox="0 0 56 56">
                    <circle cx="28" cy="28" r="28" fill="#5B6EF8" />
                    <polygon points="24,20 40,28 24,36" fill="white" />
                  </svg>
                </div>
              ) : (
                <div className="h-36 bg-[#E6EAF3] rounded-lg mb-4" />
              )}
              <div className="flex space-x-2 mb-2">
                {program.tags.map((tag) => (
                  <span key={tag} className="bg-[#E6EAF3] text-[#5B6EF8] px-2 py-1 rounded-lg text-xs font-semibold">{tag}</span>
                ))}
              </div>
              <h4 className="text-lg font-bold text-[#3B4A6B] mb-1">{program.title}</h4>
              <span className="text-[#6B7280] text-xs mb-2">{program.completed}</span>
              <div className="bg-[#F3F4F6] rounded-lg p-3 mb-2">
                <span className="block text-xs font-semibold text-[#3B4A6B] mb-1">WHAT YOU WILL LEARN</span>
                <span className="text-xs text-[#6B7280]">{program.whatYouWillLearn}</span>
              </div>
              <ul className="text-xs text-[#6B7280] mb-4 list-decimal list-inside">
                {program.lessons.map((lesson) => (
                  <li key={lesson}>{lesson}</li>
                ))}
              </ul>
              <button className="bg-[#5B6EF8] text-white px-4 py-2 rounded-lg font-medium mt-auto">View Details</button>
            </div>
          ))}
        </div>

        {/* Advanced Mastery */}
        <h3 className="text-xl font-bold text-[#3B4A6B] mb-4">Advanced Mastery</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {advancedMastery.map((program, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col">
              {program.video ? (
                <div className="h-36 bg-black rounded-lg flex items-center justify-center mb-4 relative">
                  <svg width="48" height="48" fill="none" viewBox="0 0 56 56">
                    <circle cx="28" cy="28" r="28" fill="#5B6EF8" />
                    <polygon points="24,20 40,28 24,36" fill="white" />
                  </svg>
                </div>
              ) : (
                <div className="h-36 bg-[#E6EAF3] rounded-lg mb-4" />
              )}
              <div className="flex space-x-2 mb-2">
                {program.tags.map((tag) => (
                  <span key={tag} className="bg-[#E6EAF3] text-[#5B6EF8] px-2 py-1 rounded-lg text-xs font-semibold">{tag}</span>
                ))}
              </div>
              <h4 className="text-lg font-bold text-[#3B4A6B] mb-1">{program.title}</h4>
              <span className="text-[#6B7280] text-xs mb-2">{program.completed}</span>
              <div className="bg-[#F3F4F6] rounded-lg p-3 mb-2">
                <span className="block text-xs font-semibold text-[#3B4A6B] mb-1">WHAT YOU WILL LEARN</span>
                <span className="text-xs text-[#6B7280]">{program.whatYouWillLearn}</span>
              </div>
              <ul className="text-xs text-[#6B7280] mb-4 list-decimal list-inside">
                {program.lessons.map((lesson) => (
                  <li key={lesson}>{lesson}</li>
                ))}
              </ul>
              <button className="bg-[#5B6EF8] text-white px-4 py-2 rounded-lg font-medium mt-auto">View Details</button>
            </div>
          ))}
        </div>
      </div>
      <UserRightSidebar />
    </div>
  );
}