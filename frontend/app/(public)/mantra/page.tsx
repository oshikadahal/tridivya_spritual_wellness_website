"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import Footer from "../_components/Footer";

const powerOfMantras = [
    {
        icon: "🔊",
        title: "Vibrational Harmony",
        description: "Sound frequencies that align your body's energy centers and promote healing through resonance."
    },
    {
        icon: "🧠",
        title: "Mental Clarity",
        description: "Focus your mind, eliminate negative thoughts, and achieve unshakeable inner peace."
    },
    {
        icon: "✨",
        title: "Spiritual Connection",
        description: "Connect with the divine essence and awaken your higher consciousness through sacred words."
    }
];

const benefitsOfChanting = [
    {
        title: "Stress Relief",
        description: "Release tension and anxiety through the therapeutic power of rhythmic chanting."
    },
    {
        title: "Enhanced Focus",
        description: "Improve concentration and mental clarity with daily mantra practice."
    },
    {
        title: "Emotional Balance",
        description: "Cultivate inner peace and emotional stability through sacred vibrations."
    }
];

const mantras = [
    {
        image: "ॐ",
        title: "Om (ॐ)",
        description: "The universal sound, representing the essence of reality and consciousness.",
        level: "Beginner",
        duration: "5 min",
        bgColor: "bg-blue-100"
    },
    {
        image: "🙏",
        title: "Gayatri Mantra",
        description: "A powerful mantra invoking divine light and wisdom.",
        level: "Intermediate",
        duration: "10 min",
        bgColor: "bg-purple-100"
    },
    {
        image: "💛",
        title: "Maha Mrityunjaya",
        description: "The great death-conquering mantra for healing and longevity.",
        level: "Advanced",
        duration: "15 min",
        bgColor: "bg-yellow-100"
    },
    {
        image: "🕉️",
        title: "Shiva Mantra",
        description: "Invoking the cosmic consciousness and transformation.",
        level: "Beginner",
        duration: "8 min",
        bgColor: "bg-teal-100"
    },
    {
        image: "🌸",
        title: "Lakshmi Mantra",
        description: "Attracting abundance, prosperity, and divine grace.",
        level: "Intermediate",
        duration: "12 min",
        bgColor: "bg-pink-100"
    },
    {
        image: "🌟",
        title: "Saraswati Mantra",
        description: "Invoking wisdom, creative flow, and intellectual excellence.",
        level: "Beginner",
        duration: "7 min",
        bgColor: "bg-green-100"
    }
];

const stats = [
    { number: "500K+", label: "Active Practitioners" },
    { number: "50+", label: "Sacred Mantras" },
    { number: "180", label: "Countries" },
    { number: "99.8%", label: "Satisfaction Rate" }
];

const howToChant = [
    {
        step: "1",
        title: "Find Your Space",
        description: "Choose a quiet, clean place where you feel comfortable and connected."
    },
    {
        step: "2",
        title: "Sit Comfortably",
        description: "Assume a comfortable meditative posture with straight spine."
    },
    {
        step: "3",
        title: "Focus Your Mind",
        description: "Calm your thoughts and set a clear intention before starting."
    },
    {
        step: "4",
        title: "Chant with Devotion",
        description: "Recite the mantra with feeling, 108 times or more for best results."
    }
];

const transformationStories = [
    {
        name: "Priya Sharma",
        role: "Yoga Instructor",
        rating: 5,
        image: "👩‍🏫",
        feedback: "Mantras have transformed my life completely. The peace I feel is indescribable. My students feel it too!"
    },
    {
        name: "Rajesh Kumar",
        role: "Corporate Executive",
        rating: 5,
        image: "👨‍💼",
        feedback: "From stress to serenity. Daily mantra practice helped me find balance in my hectic life."
    },
    {
        name: "Anjali Patel",
        role: "Wellness Coach",
        rating: 5,
        image: "👩‍⚕️",
        feedback: "The wisdom in these ancient mantras is timeless. Highly recommend for anyone seeking transformation."
    }
];

const recommendedBook = {
    image: "📖",
    title: "The Complete Mantra Guide",
    author: "By Ancient Wisdom Keepers",
    description: "Discover the profound science behind mantras, their meanings, benefits, and how to practice them with proper technique. This comprehensive guide covers all major mantras from various traditions and their spiritual significance in modern life."
};

export default function MantraPage() {
    return (
        <div className="bg-[#CAD3FF] min-h-screen">
            {/* Hero Section */}
            <section className="px-6 md:px-12 py-16 md:py-24 relative overflow-hidden">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-8">
                        <div className="flex justify-center text-6xl mb-6">✨</div>
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
                            Sacred Mantras & Chants
                        </h1>
                        <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
                            Experience the divine resonance of ancient vibrations to awaken your inner consciousness and align with the cosmic harmony.
                        </p>
                        <div className="flex gap-4 justify-center flex-wrap">
                            <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold px-6 py-3 rounded-full transition-colors">
                                Begin Chanting
                            </button>
                            <button className="bg-white hover:bg-gray-100 text-gray-800 font-bold px-6 py-3 rounded-full border-2 border-gray-800 transition-colors">
                                Listen Now
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Power of Mantras Section */}
            <section className="px-6 md:px-12 py-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">
                    The Power of Mantras
                </h2>
                <p className="text-center text-gray-700 mb-12 max-w-2xl mx-auto">
                    Mantras are sacred sounds, syllables, or groups of words that act as vehicles for the mind. Utilizing vibrational healing, they shift your energy and bring profound mental clarity, connecting the individual soul with the universal spirit.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {powerOfMantras.map((item, index) => (
                        <div key={index} className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center">
                            <div className="text-5xl mb-4">{item.icon}</div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
                            <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Benefits of Chanting Section */}
            <section className="px-6 md:px-12 py-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">
                    Benefits of Chanting
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {benefitsOfChanting.map((benefit, index) => (
                        <div key={index} className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                            <div className="h-40 bg-gray-300 flex items-center justify-center text-5xl">
                                {index === 0 && "🌊"}
                                {index === 1 && "🧘"}
                                {index === 2 && "❤️"}
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-2">{benefit.title}</h3>
                                <p className="text-sm text-gray-600">{benefit.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Explore Mantras Section */}
            <section className="px-6 md:px-12 py-16">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                            Explore Mantras
                        </h2>
                        <Link href="#" className="text-orange-400 font-semibold text-sm hover:underline">
                            View All →
                        </Link>
                    </div>
                    <p className="text-gray-700 mb-8">
                        Listen and chant the meanings of ancient sacred chants.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {mantras.map((mantra, index) => (
                            <div key={index} className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                                {/* Image Section */}
                                <div className={`${mantra.bgColor} h-40 flex items-center justify-center text-5xl relative group cursor-pointer`}>
                                    {mantra.image}
                                    <button className="absolute bg-yellow-400 hover:bg-yellow-500 text-gray-800 rounded-full p-3 transition-colors opacity-0 group-hover:opacity-100">
                                        <Play size={20} fill="currentColor" />
                                    </button>
                                </div>

                                {/* Content Section */}
                                <div className="p-6">
                                    <h3 className="text-lg font-bold text-gray-800 mb-2">{mantra.title}</h3>
                                    <p className="text-sm text-gray-600 mb-4">{mantra.description}</p>

                                    {/* Level & Duration */}
                                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                        <div className="flex gap-2">
                                            <span className="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-semibold">
                                                {mantra.level}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-600 font-semibold">
                                            {mantra.duration}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Recommended Reading Section */}
            <section className="px-6 md:px-12 py-16">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">
                        Recommended Reading
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        {/* Book Image */}
                        <div className="flex justify-center">
                            <div className="bg-white rounded-3xl p-8 shadow-lg w-full max-w-xs">
                                <div className="bg-yellow-400 h-32 flex items-center justify-center text-6xl rounded-2xl mb-6">
                                    {recommendedBook.image}
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 text-center mb-2">{recommendedBook.title}</h3>
                                <p className="text-sm text-gray-600 text-center">{recommendedBook.author}</p>
                            </div>
                        </div>

                        {/* Book Description */}
                        <div>
                            <p className="text-gray-700 mb-8 text-lg leading-relaxed">
                                {recommendedBook.description}
                            </p>
                            <div className="flex gap-4">
                                <button className="bg-gray-800 hover:bg-gray-900 text-white font-bold px-6 py-3 rounded-full transition-colors">
                                    View on Store
                                </button>
                                <button className="bg-white hover:bg-gray-100 text-gray-800 font-bold px-6 py-3 rounded-full border-2 border-gray-800 transition-colors">
                                    More Resources
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="px-6 md:px-12 py-16 bg-gradient-to-r from-indigo-500 to-purple-600">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
                        Join Our Global Mantra Community
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-white bg-opacity-20 rounded-2xl p-6 text-center">
                                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                                <div className="text-white text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How to Chant Section */}
            <section className="px-6 md:px-12 py-16">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 text-center">
                        How to Chant Mantras
                    </h2>
                    <p className="text-center text-gray-700 mb-12 max-w-2xl mx-auto">
                        Follow these simple steps to begin your sacred chanting journey and unlock the transformative power within.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {howToChant.map((item, index) => (
                            <div key={index} className="relative">
                                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow h-full">
                                    <div className="bg-indigo-600 text-white text-3xl font-bold rounded-full w-16 h-16 flex items-center justify-center mb-4">
                                        {item.step}
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-3">{item.title}</h3>
                                    <p className="text-sm text-gray-600">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Transformation Stories Section */}
            <section className="px-6 md:px-12 py-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">
                    Transformation Stories
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {transformationStories.map((story, index) => (
                        <div key={index} className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                            <div className="flex items-center mb-4">
                                <span className="text-4xl mr-3">{story.image}</span>
                                <div>
                                    <h3 className="font-bold text-gray-800">{story.name}</h3>
                                    <p className="text-sm text-gray-600">{story.role}</p>
                                </div>
                            </div>
                            <div className="flex mb-3">
                                {[...Array(story.rating)].map((_, i) => (
                                    <span key={i} className="text-yellow-400">★</span>
                                ))}
                            </div>
                            <p className="text-gray-600 italic">"{story.feedback}"</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Daily Mantra Tips Section */}
            <section className="px-6 md:px-12 py-16 bg-yellow-50">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                        ✨ Daily Mantra Tips ✨
                    </h2>
                    <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
                        Chant your chosen mantra 108 times daily for 40 days to experience profound transformation. This ancient practice unlocks the deepest layers of your consciousness and aligns you with universal energy.
                    </p>
                    <div className="bg-white rounded-3xl p-8 shadow-lg max-w-2xl mx-auto mb-8">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">Power of 108</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <div className="text-3xl font-bold text-indigo-600 mb-2">108</div>
                                <p className="text-sm text-gray-700">Sacred number in all traditions</p>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-indigo-600 mb-2">40</div>
                                <p className="text-sm text-gray-700">Days for transformation</p>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-indigo-600 mb-2">∞</div>
                                <p className="text-sm text-gray-700">Infinite possibilities</p>
                            </div>
                        </div>
                    </div>
                    <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold px-8 py-4 rounded-full transition-colors text-lg">
                        Start Your 40-Day Journey
                    </button>
                </div>
            </section>

            {/* CTA Section */}
            <section className="px-6 md:px-12 py-16">
                <div className="max-w-4xl mx-auto bg-gradient-to-r from-purple-100 to-indigo-100 rounded-3xl p-12 text-center shadow-lg">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        Ready to Awaken Your Inner Potential?
                    </h2>
                    <p className="text-gray-700 mb-8 text-lg">
                        Join thousands of practitioners experiencing the life-changing power of sacred mantras. Begin your transformation today.
                    </p>
                    <div className="flex gap-4 justify-center flex-wrap">
                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-full transition-colors">
                            Start Free Trial
                        </button>
                        <button className="bg-white hover:bg-gray-100 text-indigo-600 font-bold px-8 py-3 rounded-full border-2 border-indigo-600 transition-colors">
                            Schedule Session
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
}
