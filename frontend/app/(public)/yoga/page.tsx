"use client";

import Link from "next/link";
import { useState } from "react";
import { Play, Heart, Zap, Wind, Users } from "lucide-react";

export default function YogaPage() {
    const [activeLevel, setActiveLevel] = useState("All Levels");
    const [activeDuration, setActiveDuration] = useState("All");

    const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"];
    const durations = ["All", "15m", "30m", "45m+"];

    const sessions = [
        {
            title: "Morning Sun Salutation",
            instructor: "Elena Ray",
            level: "BEGINNER",
            duration: "30m",
            description: "A revitalizing sequence to awaken your energy and prepare your body for the day ahead.",
            bgColor: "bg-purple-100",
            image: "👩",
            rating: 4.8,
            students: "1.2k"
        },
        {
            title: "Gentle Vinyasa Flow",
            instructor: "Marcus Chen",
            level: "ALL LEVELS",
            duration: "45m",
            description: "Connect breath with movement in this fluid practice designed to release tension and build strength.",
            bgColor: "bg-orange-400",
            image: "👨",
            rating: 4.9,
            students: "2.1k"
        },
        {
            title: "Power Core Ignite",
            instructor: "Sarah Jenkins",
            level: "INTERMEDIATE",
            duration: "18m",
            description: "A focused session to strengthen your core and improve your balance through dynamic postures.",
            bgColor: "bg-amber-700",
            image: "🧘‍♀️",
            rating: 4.7,
            students: "1.5k"
        },
        {
            title: "Advanced Hatha Sequence",
            instructor: "David Miller",
            level: "ADVANCED",
            duration: "60m",
            description: "Deepen your practice with challenging asanas and prolonged holds for profound mental focus.",
            bgColor: "bg-amber-100",
            image: "👨",
            rating: 5.0,
            students: "890"
        },
        {
            title: "Stress Relief Stretching",
            instructor: "Priya Sharma",
            level: "BEGINNER",
            duration: "20m",
            description: "A gentle series of stretches specifically designed to target areas where we hold the most tension.",
            bgColor: "bg-amber-200",
            image: "👩",
            rating: 4.8,
            students: "1.8k"
        },
        {
            title: "Balance & Harmony Flow",
            instructor: "Aria Kim",
            level: "INTERMEDIATE",
            duration: "30m",
            description: "Finding equilibrium on and off the mat with this balanced sequence of tensioning and seated poses.",
            bgColor: "bg-yellow-50",
            image: "✨",
            rating: 4.9,
            students: "1.4k"
        },
        {
            title: "Restorative Yin Yoga",
            instructor: "Lisa Wong",
            level: "BEGINNER",
            duration: "40m",
            description: "Deep relaxation with long-held poses to calm your nervous system and release tension.",
            bgColor: "bg-green-100",
            image: "🧘",
            rating: 4.9,
            students: "2.3k"
        },
        {
            title: "Power Vinyasa Challenge",
            instructor: "James Carter",
            level: "ADVANCED",
            duration: "55m",
            description: "Build strength and endurance with dynamic flowing movements and challenging holds.",
            bgColor: "bg-red-200",
            image: "💪",
            rating: 4.7,
            students: "950"
        },
        {
            title: "Prenatal Yoga Flow",
            instructor: "Sophie Anderson",
            level: "BEGINNER",
            duration: "35m",
            description: "Safe and nurturing poses designed specifically for expecting mothers and their growing babies.",
            bgColor: "bg-pink-100",
            image: "🤰",
            rating: 4.9,
            students: "1.1k"
        }
    ];

    const yogaTypes = [
        {
            icon: "🕉️",
            title: "Hatha Yoga",
            description: "The foundation of all physical yoga styles. Hatha focuses on slow, deliberate movements and holdings postures to align the body and mind.",
            benefits: ["Increases flexibility & core strength", "Balances feminine and masculine energies", "Ideal for stress reduction"]
        },
        {
            icon: "🌊",
            title: "Vinyasa Flow",
            description: "Characterized by stringing postures together so that you move from one to another, seamlessly, unsegmented. It offers a far-more 'flow' yoga experience.",
            benefits: ["Improves cardiovascular health", "Develops muscular endurance", "Promotes a moving meditation stance"]
        },
        {
            icon: "🧘",
            title: "Yin Yoga",
            description: "A slow-paced style where postures are held for longer periods to target deep connective tissues rather than muscles.",
            benefits: ["Enhances flexibility & range", "Regulates the flow of energy in the body", "Calms the nervous system deeply"]
        }
    ];

    const readings = [
        {
            title: "Light on Yoga",
            author: "B.K.S. Iyengar",
            description: "Why read this: Often called the 'Bible of modern yoga,' it provides detailed instructions and philosophy for over 200 asanas.",
            bgColor: "bg-yellow-100",
            link: "View Details"
        },
        {
            title: "The Yoga Sutras",
            author: "Patanjali",
            description: "Why read this: The fundamental text of yoga, outlining the eight fold path and mental mastery.",
            bgColor: "bg-teal-900",
            textColor: "text-white",
            link: "View Details"
        },
        {
            title: "The Heart of Yoga",
            author: "T.K.V. Desikachar",
            description: "Why read this: A complete guide to developing a personal practice that adapts to your individual needs and lifestyle.",
            bgColor: "bg-purple-100",
            link: "View Details"
        },
        {
            title: "Autobiography of a Yogi",
            author: "Paramahansa Yogananda",
            description: "Why read this: A deeply spiritual journey that introduces readers to the miraculous side and science of yoga.",
            bgColor: "bg-green-100",
            link: "View Details"
        }
    ];

    return (
        <>
            <main className="min-h-screen w-full bg-[#CAD3FF]">
                {/* Yoga Video Section - Top */}
                <section className="pt-8 pb-8 px-4">
                    <div className="max-w-5xl mx-auto">
                        <div className="rounded-3xl overflow-hidden shadow-2xl">
                            <video 
                                className="w-full h-auto"
                                controls
                                poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1280 720'%3E%3Crect fill='%23E97451' width='1280' height='720'/%3E%3C/svg%3E"
                            >
                                <source src="https://videos.pexels.com/video-files/3571310/3571310-hd_1280_720_25fps.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    </div>
                </section>

                {/* Hero Section */}
                <section className="pt-16 pb-12 px-4 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        <span className="text-gray-800">Yoga for</span> <span className="text-orange-400">Every Body</span>
                    </h1>
                    <p className="text-gray-600 max-w-3xl mx-auto text-base mb-12 leading-relaxed">
                        A sanctuary of movement and mindfulness. Explore our collection of practices and deepen your understanding of the yogic path.
                    </p>

                    {/* Wisdom of Yoga Section */}
                    <div className="mt-16 mb-20">
                        <h2 className="text-3xl font-bold text-gray-800 mb-12">Wisdom of Yoga</h2>
                        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                            {yogaTypes.map((type, index) => (
                                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="text-5xl mb-6">{type.icon}</div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{type.title}</h3>
                                    <p className="text-base text-gray-600 mb-6 leading-relaxed">{type.description}</p>
                                    <ul className="text-sm text-gray-600 space-y-3">
                                        {type.benefits.map((benefit, idx) => (
                                            <li key={idx} className="flex items-start">
                                                <span className="text-indigo-600 mr-3 font-bold">✓</span>
                                                <span>{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Explore Sessions */}
                <section className="px-4 py-20">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl font-bold text-gray-800 mb-12">Explore Sessions</h2>
                        
                        {/* Filters */}
                        <div className="max-w-12xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 mb-20 shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Level Filter */}
                                <div className="text-left">
                                    <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">Level:</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {levels.map((level) => (
                                            <button
                                                key={level}
                                                onClick={() => setActiveLevel(level)}
                                                className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                                                    activeLevel === level
                                                        ? "bg-indigo-600 text-white"
                                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                }`}
                                            >
                                                {level}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Duration Filter */}
                                <div className="text-left">
                                    <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">Duration:</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {durations.map((duration) => (
                                            <button
                                                key={duration}
                                                onClick={() => setActiveDuration(duration)}
                                                className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                                                    activeDuration === duration
                                                        ? "bg-indigo-600 text-white"
                                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                }`}
                                            >
                                                {duration}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Session Cards - All Sessions */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {sessions.map((session, index) => (
                                <div key={index} className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                                    {/* Image Section */}
                                    <div className={`${session.bgColor} h-72 flex items-center justify-center relative overflow-hidden`}>
                                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-gray-800 shadow-md">
                                            ⏱ {session.duration}
                                        </div>
                                        <div className="text-8xl">{session.image}</div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="p-7">
                                        <div className="mb-3">
                                            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                                                {session.level}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">{session.title}</h3>
                                        <p className="text-sm text-gray-600 mb-6 leading-relaxed line-clamp-2">{session.description}</p>

                                        {/* Rating & Students */}
                                        <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-200">
                                            <div className="flex items-center gap-1">
                                                <span className="text-yellow-400">★</span>
                                                <span className="text-xs font-semibold text-gray-700">{session.rating}</span>
                                            </div>
                                            <div className="text-xs text-gray-500">{session.students} students</div>
                                        </div>

                                        {/* Instructor */}
                                        <div className="flex items-center justify-between pt-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-lg">
                                                    👤
                                                </div>
                                                <span className="text-sm font-medium text-gray-800">{session.instructor}</span>
                                            </div>
                                            <button className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center hover:bg-indigo-700 transition-colors shadow-sm">
                                                <Play className="w-5 h-5 text-white fill-white" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Recommended Reading Section */}
                <section className="px-4 py-20">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-16">
                            <p className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-3">Resources</p>
                            <h2 className="text-4xl font-bold text-gray-900">Recommended Reading</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            {readings.map((reading, index) => (
                                <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                    <div className={`${reading.bgColor} h-56 flex items-center justify-center`}>
                                        <div className="text-6xl">📖</div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">{reading.title}</h3>
                                        <p className={`text-xs ${reading.textColor ? reading.textColor : "text-gray-600"} mb-4`}>{reading.author}</p>
                                        <p className="text-xs text-gray-600 mb-5 leading-relaxed">{reading.description}</p>
                                        <button className="text-indigo-600 hover:text-indigo-700 text-xs font-semibold">
                                            {reading.link} →
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Why Practice Yoga Section */}
                <section className="px-4 py-20 bg-white/40">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Practice Yoga?</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">Discover the transformative benefits of regular yoga practice for your physical, mental, and spiritual well-being</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                                <div className="text-4xl mb-4">🧘</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Physical Health</h3>
                                <p className="text-gray-600 leading-relaxed">Improve flexibility, build strength, enhance balance, and boost your immune system. Yoga helps reduce chronic pain and improves posture naturally.</p>
                            </div>
                            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                                <div className="text-4xl mb-4">🧠</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Mental Clarity</h3>
                                <p className="text-gray-600 leading-relaxed">Reduce stress and anxiety through mindful breathing and meditation. Experience improved focus, better sleep, and emotional balance.</p>
                            </div>
                            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                                <div className="text-4xl mb-4">❤️</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Emotional Well-being</h3>
                                <p className="text-gray-600 leading-relaxed">Connect with your inner self and cultivate self-compassion. Build a stronger sense of purpose and inner peace through consistent practice.</p>
                            </div>
                            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                                <div className="text-4xl mb-4">🌟</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Spiritual Growth</h3>
                                <p className="text-gray-600 leading-relaxed">Deepen your spiritual connection and explore ancient wisdom traditions. Find alignment between your body, mind, and spirit.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="px-4 py-20">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Students Say</h2>
                            <p className="text-gray-600">Join thousands of happy practitioners who have transformed their lives</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center mb-4">
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => <span key={i} className="text-yellow-400">★</span>)}
                                    </div>
                                </div>
                                <p className="text-gray-600 mb-6 leading-relaxed">"The yoga sessions have completely transformed my morning routine. I feel more energized and focused throughout the day. Highly recommended!"</p>
                                <div>
                                    <p className="font-semibold text-gray-900">Sarah Mitchell</p>
                                    <p className="text-sm text-gray-600">Registered in 45 sessions</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center mb-4">
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => <span key={i} className="text-yellow-400">★</span>)}
                                    </div>
                                </div>
                                <p className="text-gray-600 mb-6 leading-relaxed">"After years of dealing with back pain, I finally found relief through consistent yoga practice. The instructors are incredibly knowledgeable and supportive."</p>
                                <div>
                                    <p className="font-semibold text-gray-900">Michael Johnson</p>
                                    <p className="text-sm text-gray-600">Registered in 62 sessions</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center mb-4">
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => <span key={i} className="text-yellow-400">★</span>)}
                                    </div>
                                </div>
                                <p className="text-gray-600 mb-6 leading-relaxed">"I love how accessible all the different levels of yoga are. Whether I'm a beginner or feeling more advanced, there's always something perfect for me."</p>
                                <div>
                                    <p className="font-semibold text-gray-900">Emma Rodriguez</p>
                                    <p className="text-sm text-gray-600">Registered in 38 sessions</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer - Same as home page */}
            <footer className="px-4 sm:px-6 lg:px-8 pb-10 bg-white border-t border-slate-200">
                <div className="max-w-6xl mx-auto flex flex-col items-center text-center gap-4 text-xs">
                    <div className="text-black font-semibold">
                        Tridivya
                    </div>
                    <div className="flex flex-wrap justify-center items-center gap-5 text-slate-700">
                        <Link href="/about" className="hover:text-indigo-600 transition-colors">About Us</Link>
                        <Link href="/yoga" className="hover:text-indigo-600 transition-colors">Yoga</Link>
                        <Link href="/meditation" className="hover:text-indigo-600 transition-colors">Meditation</Link>
                        <Link href="/mantra" className="hover:text-indigo-600 transition-colors">Mantras</Link>
                    </div>
                    <div className="text-slate-600">
                        © 2026 Tridivya Wellness
                    </div>
                </div>
            </footer>
        </>
    );
}
