"use client";

import Link from "next/link";
import { useState } from "react";
import { Play } from "lucide-react";
import Footer from "../_components/Footer";

export default function MeditationPage() {
    const [activeLevel, setActiveLevel] = useState("All Levels");
    const [activeDuration, setActiveDuration] = useState("All");

    const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"];
    const durations = ["All", "15m", "30m", "45m+"];

    const meditationWisdom = [
        {
            tag: "mindfulness",
            title: "Mindfulness Meditation",
            description: "The art of being fully present in the moment. Mindfulness involves observing your thoughts and feelings without judgment, allowing you to develop a peaceful awareness.",
            benefits: [
                "Reduces anxiety and stress",
                "Improves emotional regulation",
                "Enhances focus and clarity"
            ]
        },
        {
            tag: "breathing",
            title: "Breath Awareness",
            description: "A foundational practice that uses the breath as an anchor to the present moment. By focusing on your natural breath patterns, you calm the nervous system and center your mind.",
            benefits: [
                "Lowers blood pressure",
                "Promotes deep relaxation",
                "Builds mental resilience"
            ]
        },
        {
            tag: "loving",
            title: "Loving-Kindness Meditation",
            description: "Also known as Metta, this practice involves directing well-wishes and compassion toward yourself and others in a structured sequence of affirmations.",
            benefits: [
                "Cultivates self-compassion",
                "Increases empathy and kindness",
                "Strengthens emotional connections"
            ]
        }
    ];

    const sessions = [
        {
            title: "Deep Relaxation",
            instructor: "Elena Ray",
            level: "BEGINNER",
            duration: "20m",
            description: "A guided practice to release tension from the body and calm the nervous system.",
            bgColor: "bg-purple-100",
            image: "🧘‍♀️",
            rating: 4.8,
            students: "1.2k"
        },
        {
            title: "Morning Clarity",
            instructor: "Marcus Chen",
            level: "ALL LEVELS",
            duration: "15m",
            description: "Set your intentions and clear mental fog with this breath-centered morning routine.",
            bgColor: "bg-teal-100",
            image: "☀️",
            rating: 4.9,
            students: "2.1k"
        },
        {
            title: "Stress Release",
            instructor: "Sarah Jenkins",
            level: "INTERMEDIATE",
            duration: "25m",
            description: "A powerful session using visualization techniques to dissolve acute stress and anxiety.",
            bgColor: "bg-blue-100",
            image: "🌊",
            rating: 4.7,
            students: "1.5k"
        },
        {
            title: "Sleep Preparation",
            instructor: "David Miller",
            level: "BEGINNER",
            duration: "30m",
            description: "A calming bedtime meditation to guide you into restful, rejuvenating sleep.",
            bgColor: "bg-indigo-100",
            image: "🌙",
            rating: 5.0,
            students: "3.2k"
        },
        {
            title: "Body Scan",
            instructor: "Priya Sharma",
            level: "BEGINNER",
            duration: "20m",
            description: "Systematically scan your body to release tension and increase bodily awareness.",
            bgColor: "bg-amber-100",
            image: "💫",
            rating: 4.8,
            students: "1.8k"
        },
        {
            title: "Chakra Balancing",
            instructor: "Aria Kim",
            level: "INTERMEDIATE",
            duration: "35m",
            description: "An energy-focused session that balances and aligns your seven chakras for harmony.",
            bgColor: "bg-pink-100",
            image: "🎆",
            rating: 4.9,
            students: "1.4k"
        },
        {
            title: "Mantra Meditation",
            instructor: "Lisa Wong",
            level: "INTERMEDIATE",
            duration: "25m",
            description: "Use sacred sounds and mantras to elevate your consciousness and inner peace.",
            bgColor: "bg-orange-100",
            image: "✨",
            rating: 4.9,
            students: "2.3k"
        },
        {
            title: "Walking Meditation",
            instructor: "James Carter",
            level: "BEGINNER",
            duration: "20m",
            description: "A dynamic meditation practice that combines mindfulness with gentle movement.",
            bgColor: "bg-green-100",
            image: "👣",
            rating: 4.7,
            students: "950"
        },
        {
            title: "Advanced Vipassana",
            instructor: "Sophie Anderson",
            level: "ADVANCED",
            duration: "45m",
            description: "Deep insight meditation that cultivates profound awareness and spiritual growth.",
            bgColor: "bg-yellow-50",
            image: "🌸",
            rating: 4.9,
            students: "1.1k"
        }
    ];

    const readings = [
        {
            title: "The Miracle of Mindfulness",
            author: "Thich Nhat Hanh",
            description: "WHY READ THIS: A beautiful guide to bringing mindfulness into every mundane moment of your life.",
            bgColor: "bg-teal-600",
            image: "📖"
        },
        {
            title: "10% Happier",
            author: "Dan Harris",
            description: "WHY READ THIS: A practical, skeptic-friendly introduction to why meditation actually works.",
            bgColor: "bg-slate-900",
            image: "📕"
        },
        {
            title: "Real Happiness",
            author: "Sharon Salzberg",
            description: "WHY READ THIS: The 28-day program to realize the power of meditation in your daily life.",
            bgColor: "bg-amber-50",
            image: "📗"
        },
        {
            title: "The Power of Now",
            author: "Eckhart Tolle",
            description: "WHY READ THIS: A transformative journey that teaches you how to transcend your thoughts.",
            bgColor: "bg-cyan-600",
            image: "📙"
        }
    ];

    const whyMeditate = [
        {
            icon: "🧠",
            title: "Mental Clarity",
            description: "Sharpen your focus and improve your ability to concentrate on what truly matters in life."
        },
        {
            icon: "💆",
            title: "Stress Reduction",
            description: "Lower cortisol levels and activate your parasympathetic nervous system for deep relaxation."
        },
        {
            icon: "❤️",
            title: "Emotional Balance",
            description: "Develop emotional resilience and a greater capacity for compassion toward yourself and others."
        },
        {
            icon: "🌟",
            title: "Spiritual Growth",
            description: "Deepen your connection with your inner self and discover profound meaning and purpose."
        }
    ];

    const testimonials = [
        {
            name: "Olivia Martinez",
            role: "HR Manager",
            feedback: "Meditation has transformed my relationship with stress. I feel more grounded and present in every moment of my day.",
            rating: 5,
            image: "👩‍💼"
        },
        {
            name: "James Wilson",
            role: "Software Developer",
            feedback: "After just three weeks of daily meditation, my anxiety has decreased significantly and my productivity has increased considerably.",
            rating: 5,
            image: "👨‍💻"
        },
        {
            name: "Priya Desai",
            role: "Teacher",
            feedback: "Teaching meditation has brought so much peace into my life. It's wonderful to share these practices with my students.",
            rating: 5,
            image: "👩‍🏫"
        }
    ];

    return (
        <div className="bg-[#CAD3FF] min-h-screen">
            {/* Hero Section */}
            <section className="px-6 md:px-12 py-16 md:py-24 text-center">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
                    Meditation for Inner Peace
                </h1>
                <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                    Discover the transformative power of meditation. Find inner harmony, clarity, and profound peace through our guided practices.
                </p>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-full transition-colors">
                    Start Your Journey
                </button>
            </section>

            {/* Wisdom of Meditation Section */}
            <section className="px-6 md:px-12 py-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">
                    The Wisdom of Meditation
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {meditationWisdom.map((wisdom, index) => (
                        <div key={index} className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                            <p className="text-orange-400 text-xs font-semibold tracking-wider mb-4">{wisdom.tag}</p>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">{wisdom.title}</h3>
                            <p className="text-gray-600 mb-6">{wisdom.description}</p>
                            <div className="space-y-2">
                                {wisdom.benefits.map((benefit, i) => (
                                    <p key={i} className="text-sm text-gray-700 flex items-start">
                                        <span className="text-indigo-600 mr-3 font-bold">✓</span>
                                        {benefit}
                                    </p>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Filter & Explore Sessions Section */}
            <section className="px-6 md:px-12 py-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
                    Explore Guided Sessions
                </h2>

                {/* Filter Container */}
                <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 mb-12 max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-600 mb-3">LEVEL</p>
                            <div className="flex gap-3 flex-wrap">
                                {levels.map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => setActiveLevel(level)}
                                        className={`px-5 py-2 rounded-full font-medium text-xs transition-all ${
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

                        <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-600 mb-3">DURATION</p>
                            <div className="flex gap-3 flex-wrap">
                                {durations.map((duration) => (
                                    <button
                                        key={duration}
                                        onClick={() => setActiveDuration(duration)}
                                        className={`px-5 py-2 rounded-full font-medium text-xs transition-all ${
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

                {/* Sessions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {sessions.map((session, index) => (
                        <div key={index} className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                            {/* Image Section */}
                            <div className={`${session.bgColor} h-48 flex items-center justify-center text-6xl`}>
                                {session.image}
                            </div>

                            {/* Content Section */}
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800 mb-1">{session.title}</h3>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                            {session.level}
                                        </p>
                                    </div>
                                    <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full">
                                        {session.duration}
                                    </span>
                                </div>

                                <p className="text-sm text-gray-600 mb-4">{session.description}</p>

                                {/* Instructor & Play Button */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">{session.image}</span>
                                        <div>
                                            <p className="text-xs text-gray-500">by</p>
                                            <p className="text-sm font-semibold text-gray-800">{session.instructor}</p>
                                        </div>
                                    </div>
                                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-3 transition-colors">
                                        <Play size={16} />
                                    </button>
                                </div>

                                {/* Rating & Students */}
                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                                    <div className="flex items-center gap-1">
                                        <span className="text-yellow-400">★</span>
                                        <span className="text-sm font-semibold text-gray-800">{session.rating}</span>
                                    </div>
                                    <span className="text-xs text-gray-600">{session.students} Students</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Why Practice Meditation Section */}
            <section className="px-6 md:px-12 py-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">
                    Why Practice Meditation?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                    {whyMeditate.map((reason, index) => (
                        <div key={index} className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center">
                            <div className="text-5xl mb-4">{reason.icon}</div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">{reason.title}</h3>
                            <p className="text-sm text-gray-600">{reason.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Recommended Reading Section */}
            <section className="px-6 md:px-12 py-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">
                    Recommended Reading
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
                    {readings.map((book, index) => (
                        <div key={index} className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                            <div className={`${book.bgColor} h-48 flex items-center justify-center text-5xl`}>
                                {book.image}
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-2">{book.title}</h3>
                                <p className="text-sm font-semibold text-indigo-600 mb-3">{book.author}</p>
                                <p className="text-xs text-gray-600">{book.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="px-6 md:px-12 py-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">
                    What Our Community Says
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                            <div className="flex items-center mb-4">
                                <span className="text-4xl mr-3">{testimonial.image}</span>
                                <div>
                                    <h3 className="font-bold text-gray-800">{testimonial.name}</h3>
                                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                                </div>
                            </div>
                            <div className="flex mb-3">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <span key={i} className="text-yellow-400">★</span>
                                ))}
                            </div>
                            <p className="text-gray-600 italic">"{testimonial.feedback}"</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
}
