
import Image from "next/image";
import Link from "next/link";

const SOCIAL_LINKS = {
    facebook: "https://www.facebook.com/oshika.dahal.12",
    instagram: "https://www.instagram.com/oshikkaaa/",
    linkedin: "https://www.linkedin.com/in/oshikadahal/",
    whatsapp: "https://wa.me/9779851326755",
};

export default function LandingPage() {
    return (
        <main className="w-full">
            <section className="relative min-h-[calc(100vh-72px)] overflow-hidden">
                <Image
                    src="/images/landing page.png"
                    alt="Tridivya Wellness landing"
                    fill
                    priority
                    className="object-cover object-[72%_14%] brightness-[0.72]"
                />

                <div className="absolute inset-0 bg-linear-to-r from-[#ede5ff]/35 via-[#ede5ff]/12 to-transparent" />

                <div className="relative z-10 mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-7xl items-center px-6 py-16 sm:px-10 lg:px-14">
                    <div className="max-w-2xl text-center lg:text-left">
                        <h1 className="text-4xl font-bold leading-tight text-[#5b3ca7] sm:text-5xl md:text-6xl">
                            Find Your Inner Peace
                            <br />
                            and Balance
                        </h1>

                        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[#5b3ca7]/90 lg:mx-0">
                            Transform your mind, body, and spirit with our expert-guided meditations and yoga sessions. Discover a harmonious way of living.
                        </p>

                        <Link
                            href="/register"
                            className="mt-8 inline-flex rounded-xl bg-[#7c5be8] px-10 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-[#6f4fe0]"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </section>

            <footer className="bg-linear-to-r from-[#7e62d9] via-[#7a5dd4] to-[#7357cb] px-6 py-8 text-center text-white">
                <div className="mx-auto max-w-7xl">
                    <p className="text-3xl leading-none">✿</p>
                    <p className="mt-2 text-4xl font-semibold">Tridivya Wellness</p>
                    <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-sm font-medium">
                        <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="transition hover:text-white/80">Facebook</a>
                        <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="transition hover:text-white/80">Instagram</a>
                        <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="transition hover:text-white/80">LinkedIn</a>
                        <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="transition hover:text-white/80">WhatsApp</a>
                    </div>
                    <p className="mt-6 text-sm text-white/80">© 2026 Tridivya Wellness. All rights reserved.</p>
                </div>
            </footer>
        </main>
    );
}
