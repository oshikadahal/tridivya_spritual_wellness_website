import Link from "next/link";

export default function Footer() {
    return (
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
    );
}
