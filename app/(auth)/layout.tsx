"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isRegister = pathname?.includes("/register");
    const bgSrc = isRegister ? "/images/signup image.jpg" : "/images/yoga login page.jpg";
    const containerClass = isRegister
        ? "w-full max-w-2xl rounded-2xl border border-white/8 bg-[rgba(6,10,14,0.58)] supports-backdrop-filter:backdrop-blur px-8 py-4 shadow-2xl text-white min-h-[480px]"
        : "w-full max-w-md rounded-xl border border-white/10 bg-[rgba(6,10,14,0.66)] supports-backdrop-filter:backdrop-blur p-8 shadow-2xl text-white";

    return (
        <section className="h-screen relative">

            {/* Full page background image */}
            <div className="absolute inset-0 -z-10">
                <Image
                    src={bgSrc}
                    alt="Background image"
                    fill
                    priority
                    className="object-cover object-center"



                />
                <div className="absolute inset-0 bg-black/40" />
            </div>


            <div className="h-full w-full flex items-center justify-center px-4 md:px-10">
                <div className={containerClass}>
                    {children}
                </div>
            </div>

            
        </section>
    );
}