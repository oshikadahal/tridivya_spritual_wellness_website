"use client";

import { useState } from "react";
import Footer from "../_components/Footer";

export default function AboutPage() {
    const [reviews, setReviews] = useState([
        {
            name: "Rajesh Kumar",
            role: "Business Executive",
            rating: 5,
            review: "Tridivya Wellness has completely transformed my life. The platform is user-friendly and the guidance is invaluable.",
            image: "👨‍💼"
        },
        {
            name: "Sophia Rodriguez",
            role: "Wellness Coach",
            rating: 5,
            review: "As a wellness coach, I recommend Tridivya to all my clients. The holistic approach is truly exceptional.",
            image: "👩‍🏫"
        },
        {
            name: "Arjun Patel",
            role: "Meditation Teacher",
            rating: 5,
            review: "The authenticity and depth of the practices offered here are unparalleled. Highly impressed!",
            image: "👨‍🏫"
        }
    ]);

    const [newReview, setNewReview] = useState({
        name: "",
        role: "",
        rating: 5,
        review: ""
    });

    const handleAddReview = () => {
        if (newReview.name && newReview.role && newReview.review) {
            setReviews([...reviews, { ...newReview, image: "👤" }]);
            setNewReview({ name: "", role: "", rating: 5, review: "" });
        }
    };

    const missionVision = [
        {
            icon: "🎯",
            title: "OUR MISSION",
            description: "To bridge the gap between ancient spiritual practices and the complexities of modern life, providing a sanctuary for healing, growth, and self-discovery through the sacred arts of yoga and meditation."
        },
        {
            icon: "👁️",
            title: "OUR VISION",
            description: "A world where every individual has the tools to achieve inner peace, fostering a global community rooted in mindfulness, compassion, and authentic connection to the universal consciousness."
        }
    ];

    const coreValues = [
        {
            icon: "💎",
            title: "Authenticity",
            description: "Staying true to the integrity of ancient practices while ensuring their relevance to contemporary life."
        },
        {
            icon: "👥",
            title: "Community",
            description: "Creating a space of acceptance and belonging where people support and inspire one another on their path."
        },
        {
            icon: "🤝",
            title: "Inclusivity",
            description: "Welcome every seeker regardless of experience, background, or belief system. Universal wisdom for all."
        }
    ];

    const teachers = [
        {
            name: "Aria Sharma",
            specialty: "Yoga & Mindfulness Practitioner",
            description: "With 15+ years of continuous practice, Aria has guided thousands to discover inner strength through yoga",
            image: "👩"
        },
        {
            name: "David Chen",
            specialty: "Meditation Guide",
            description: "Specializing in advanced meditation techniques. David helps students find peace and spiritual awakening.",
            image: "👨"
        },
        {
            name: "Sarath Devi",
            specialty: "Mantra Specialist",
            description: "A master of sacred chanting. Sarath uses ancient mantras and music to propel life transformation.",
            image: "👩‍🌾"
        }
    ];

    return (
        <div className="bg-[#CAD3FF] min-h-screen">
            {/* Hero Section */}
            <section 
                className="relative h-80 bg-cover bg-center flex items-center justify-center text-center"
                style={{
                    backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1200 400%22><defs><linearGradient id=%22grad%22 x1=%220%25%22 y1=%220%25%22 x2=%22100%25%22 y2=%22100%25%22><stop offset=%220%25%22 style=%22stop-color:rgb(180,120,60);stop-opacity:1%22 /><stop offset=%22100%25%22 style=%22stop-color:rgb(80,40,20);stop-opacity:1%22 /></linearGradient></defs><rect width=%221200%22 height=%22400%22 fill=%22url(%23grad)%22/><circle cx=%22600%22 cy=%22100%22 r=%2280%22 fill=%22rgba(255,200,100,0.2)%22/></svg>')"
                }}
            >
                <div className="max-w-4xl px-6">
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                        Our Journey to Harmony
                    </h1>
                    <p className="text-lg text-gray-100">
                        Discover the essence of Tridivya Wellness—where ancient wisdom meets modern soul searching.
                    </p>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className="px-6 md:px-12 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {missionVision.map((item, index) => (
                        <div key={index} className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                            <div className="text-5xl mb-4">{item.icon}</div>
                            <h3 className="text-orange-400 text-xs font-bold tracking-widest mb-4">{item.title}</h3>
                            <p className="text-gray-700 leading-relaxed">{item.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Our Story Section */}
            <section className="px-6 md:px-12 py-16 bg-indigo-50">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="text-4xl mb-6">🙏</div>
                    <h2 className="text-4xl font-bold text-gray-800 mb-8">Our Story</h2>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                        Tridivya was born from a deep-seated passion for the transformative power of the Himalayan traditions. Our founders, after years of immersion in sacred seminars, realized that ancient wisdom holds the profound answers to modern challenges.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                        What started as a small gathering of seekers has grown into a global platform. We believe that yoga is more than just movement. It is a dialogue with the divine. Our dedication to meditation and mantra chanting are the ultimate healers of the human psyche.
                    </p>
                </div>
            </section>

            {/* Core Values Section */}
            <section className="px-6 md:px-12 py-16">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">Core Values</h2>
                    <p className="text-center text-gray-600 mb-12">The pillars that support our spiritual sanctuary</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {coreValues.map((value, index) => (
                            <div key={index} className="bg-yellow-50 rounded-3xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
                                <div className="text-5xl mb-4">{value.icon}</div>
                                <h3 className="text-xl font-bold text-gray-800 mb-3">{value.title}</h3>
                                <p className="text-gray-700">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Meet Our Teachers Section */}
            <section className="px-6 md:px-12 py-16">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-gray-800 mb-3">Meet Our Teachers</h2>
                    <p className="text-gray-600 mb-12">Guided by experienced wisdom keepers</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {teachers.map((teacher, index) => (
                            <div key={index} className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                                <div className="h-56 bg-gray-400 flex items-center justify-center text-6xl">
                                    {teacher.image}
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-bold text-gray-800 mb-1">{teacher.name}</h3>
                                    <p className="text-sm text-orange-400 font-semibold mb-3">{teacher.specialty}</p>
                                    <p className="text-sm text-gray-600">{teacher.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Reviews Section */}
            <section className="px-6 md:px-12 py-16 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center">Community Reviews</h2>
                    
                    {/* Existing Reviews */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        {reviews.map((review, index) => (
                            <div key={index} className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                                <div className="flex items-center mb-4">
                                    <span className="text-3xl mr-3">{review.image}</span>
                                    <div>
                                        <h3 className="font-bold text-gray-800">{review.name}</h3>
                                        <p className="text-xs text-gray-600">{review.role}</p>
                                    </div>
                                </div>
                                <div className="flex mb-3">
                                    {[...Array(review.rating)].map((_, i) => (
                                        <span key={i} className="text-yellow-400">★</span>
                                    ))}
                                </div>
                                <p className="text-gray-700 text-sm italic">"{review.review}"</p>
                            </div>
                        ))}
                    </div>

                    {/* Add Review Section */}
                    <div className="bg-white rounded-3xl p-10 shadow-lg max-w-3xl mx-auto">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Share Your Experience</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <input
                                type="text"
                                placeholder="Your Name"
                                value={newReview.name}
                                onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
                            />
                            <input
                                type="text"
                                placeholder="Your Role/Title"
                                value={newReview.role}
                                onChange={(e) => setNewReview({ ...newReview, role: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setNewReview({ ...newReview, rating: star })}
                                        className="text-3xl transition-colors"
                                    >
                                        <span className={newReview.rating >= star ? "text-yellow-400" : "text-gray-300"}>
                                            ★
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <textarea
                            placeholder="Share your experience with Tridivya Wellness..."
                            value={newReview.review}
                            onChange={(e) => setNewReview({ ...newReview, review: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 mb-4 resize-none"
                        />
                        <button
                            onClick={handleAddReview}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors"
                        >
                            Submit Review
                        </button>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="px-6 md:px-12 py-16">
                <div className="max-w-5xl mx-auto bg-gray-800 rounded-3xl p-12 text-center text-white">
                    <h2 className="text-4xl font-bold mb-4">Begin Your Transformation Today</h2>
                    <p className="text-lg text-gray-200 mb-8">
                        Join our community of thousands of seekers and access our full library of yoga, meditation, and mantras for free.
                    </p>
                    <div className="flex gap-4 justify-center flex-wrap">
                        <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold px-8 py-3 rounded-full transition-colors">
                            Join Our Community
                        </button>
                        <button className="bg-transparent hover:bg-white hover:bg-opacity-10 text-white font-bold px-8 py-3 rounded-full border-2 border-white transition-colors">
                            Explore Courses
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
}