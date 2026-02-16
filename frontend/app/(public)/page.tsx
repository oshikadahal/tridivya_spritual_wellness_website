"use client";
import Link from "next/link";
export default function LandingPage() {
  return (
    <main className="bg-[#E6E6FA] min-h-screen w-full">
      <header className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-[#B6A6F7] flex items-center justify-center">
            <span className="text-white text-xl font-bold">Tridivya Wellness</span>
          </div>
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="px-6 py-3 rounded-lg border border-[#6C4AB6] text-[#6C4AB6] font-semibold bg-white hover:bg-[#f3f0ff] transition text-lg">Log in</Link>
          <Link href="/register" className="px-6 py-3 rounded-lg bg-[#6C4AB6] text-white font-semibold hover:bg-[#5636a6] transition text-lg">Sign Up</Link>
        </div>
      </header>
      <section className="flex flex-col md:flex-row items-center justify-between px-8 py-12 gap-12">
        <div className="max-w-xl">
          <span className="bg-[#B6A6F7] text-white px-4 py-1 rounded-full text-xs font-semibold mb-4 inline-block">SPIRITUAL AWAKENING & BALANCE</span>
          <h1 className="text-5xl font-bold text-[#2D1B69] mb-6">Find Peace Through <span className="text-[#6C4AB6]">Mantras</span>, Yoga & Meditation</h1>
          <p className="text-lg text-[#4B3A8B] mb-8">Embark on a journey of spiritual awakening and physical vitality with our expert-led sessions designed for the modern seeker.</p>
          {/* Removed login/signup buttons from hero section. Only navbar buttons remain. */}
          <div className="flex items-center gap-2 mt-2">
            <span className="bg-[#F7E6A6] px-3 py-1 rounded-full text-xs font-semibold">🧘‍♂️</span>
            <span className="text-[#4B3A8B] text-sm">Join 10k+ mindful practitioners</span>
          </div>
        </div>
        <div className="relative">
          <div className="w-96 h-96 bg-[#B6A6F7] rounded-2xl flex items-center justify-center">
            <img src="/images/dummy-meditation.png" alt="Meditation" className="w-72 h-72 object-cover rounded-xl" />
            <div className="absolute top-6 left-6 bg-white px-4 py-2 rounded-xl shadow text-[#6C4AB6] font-semibold text-sm">❤️ Heart Rate Decreased by 12%</div>
          </div>
        </div>
      </section>
      <section className="px-8 py-12">
        <h2 className="text-3xl font-bold text-[#2D1B69] mb-6">Everything You Need For Harmony</h2>
        <p className="text-lg text-[#4B3A8B] mb-8">We combine ancient Vedic practices with modern scientific wellness techniques to provide a complete sanctuary for your mind and body.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow">
            <h3 className="text-xl font-bold text-[#6C4AB6] mb-2">Guided Meditation Videos</h3>
            <p className="text-[#4B3A8B] mb-4">Discover inner silence with our curated video library led by masters of mindfulness and stillness.</p>
            <Link href="#" className="text-[#6C4AB6] font-semibold">View Sessions &rarr;</Link>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow">
            <h3 className="text-xl font-bold text-[#6C4AB6] mb-2">Learn Powerful Mantras</h3>
            <p className="text-[#4B3A8B] mb-4">Unlock the vibrational power of ancient chants for modern emotional and spiritual healing.</p>
            <Link href="#" className="text-[#6C4AB6] font-semibold">Start Chanting &rarr;</Link>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow">
            <h3 className="text-xl font-bold text-[#6C4AB6] mb-2">Yoga for Everyone</h3>
            <p className="text-[#4B3A8B] mb-4">Flow through sequences designed for all skill levels, from restorative stretching to powerful Vinyasa.</p>
            <Link href="#" className="text-[#6C4AB6] font-semibold">Choose Your Level &rarr;</Link>
          </div>
        </div>
        <section className="bg-[#B6A6F7] rounded-2xl p-12 text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to begin your journey?</h2>
          <p className="text-lg text-white mb-6">Experience the transformation first-hand. Start your 14-day free trial today and discover the path to a balanced life.</p>
          <button className="px-8 py-4 rounded-lg bg-white text-[#6C4AB6] font-bold text-xl">Get Started</button>
          <p className="text-xs text-white mt-4">No credit card required. Cancel anytime.</p>
        </section>
        <div className="flex justify-between items-center text-xs text-[#4B3A8B]">
          <div>© 2026 Tridivya Wellness</div>
          <div className="flex gap-6">
            <Link href="#">Platform</Link>
            <Link href="#">Company</Link>
            <Link href="#">Support</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
