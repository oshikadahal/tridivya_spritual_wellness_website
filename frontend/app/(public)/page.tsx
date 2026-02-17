
"use client";
import Link from "next/link";
function LandingPage() {
  return (
    <main className="bg-linear-to-br from-[#E6E6FA] to-[#B6A6F7] min-h-screen w-full">
      <div className="px-8 py-12">
        <h2 className="text-4xl font-bold text-[#2D1B69] mb-8 text-center">Why Tridivya Wellness?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-2xl p-8 shadow text-center">
            <img src="/images/lotus.png" alt="Ancient Wisdom" className="mx-auto mb-4 w-12 h-12" />
            <h3 className="text-xl font-bold text-[#6C4AB6] mb-2">Ancient Vedic Wisdom</h3>
            <p className="text-[#4B3A8B] mb-4">Experience the time-honored practices of Vedic meditations to achieve inner peace and resilience.</p>
            <Link href="#" className="text-[#6C4AB6] font-semibold">View Sessions &rarr;</Link>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow text-center">
            <img src="/images/brain.png" alt="Science-backed" className="mx-auto mb-4 w-12 h-12" />
            <h3 className="text-xl font-bold text-[#6C4AB6] mb-2">Science-backed Practices</h3>
            <p className="text-[#4B3A8B] mb-4">Benefit from sessions grounded in research and proven techniques to improve mental clarity and well-being.</p>
            <Link href="#" className="text-[#6C4AB6] font-semibold">Start Chanting &rarr;</Link>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow text-center">
            <img src="/images/plan.png" alt="Personalized Plans" className="mx-auto mb-4 w-12 h-12" />
            <h3 className="text-xl font-bold text-[#6C4AB6] mb-2">Personalized Daily Plans</h3>
            <p className="text-[#4B3A8B] mb-4">Receive customized daily plans tailored to your goals, preferences, and skill level.</p>
            <Link href="#" className="text-[#6C4AB6] font-semibold">Choose Your Level &rarr;</Link>
          </div>
        </div>
      </div>
      <div className="px-8 py-12">
        <h2 className="text-4xl font-bold text-[#2D1B69] mb-8 text-center">Everything You Need For Harmony</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-2xl p-8 shadow text-center">
            <h3 className="text-xl font-bold text-[#6C4AB6] mb-2">Guided Meditation Videos</h3>
            <p className="text-[#4B3A8B] mb-4">Discover inner silence with our curated video library led by masters of mindfulness and stillness.</p>
            <Link href="#" className="text-[#6C4AB6] font-semibold">View Sessions &rarr;</Link>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow text-center">
            <h3 className="text-xl font-bold text-[#6C4AB6] mb-2">Science-backed Practices</h3>
            <p className="text-[#4B3A8B] mb-4">Benefit from sessions grounded in research and proven techniques to improve mental clarity and well-being.</p>
            <Link href="#" className="text-[#6C4AB6] font-semibold">Start Chanting &rarr;</Link>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow text-center">
            <h3 className="text-xl font-bold text-[#6C4AB6] mb-2">Yoga for Everyone</h3>
            <p className="text-[#4B3A8B] mb-4">Flow through sequences designed for all skill levels, from restorative stretching to powerful Vinyasa.</p>
            <Link href="#" className="text-[#6C4AB6] font-semibold">Choose Your Level &rarr;</Link>
          </div>
        </div>
        <div className="bg-linear-to-r from-[#B6A6F7] to-[#6C4AB6] rounded-2xl p-12 text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to begin your journey?</h2>
          <p className="text-lg text-white mb-6">Experience the transformation firsthand. Start your 14-day free trial today and discover a balanced life.</p>
          <button className="px-8 py-4 rounded-lg bg-white text-[#6C4AB6] font-bold text-xl shadow-lg">Get Started</button>
          <p className="text-xs text-white mt-4">No credit card required. Cancel anytime.</p>
        </div>
      </div>
      <footer className="px-8 py-6 text-center text-[#B6A6F7] text-sm">
        &copy; 2026 Tridivya Wellness
      </footer>
    </main>
  );
}
export default LandingPage;
