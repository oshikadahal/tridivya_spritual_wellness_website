"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isRegister = pathname?.includes("/register");
    const isForgot = pathname?.includes("/forgot-password");
    const isReset = pathname?.includes("/reset-password");

    const title = isRegister
        ? "Join Tridivya"
        : isForgot
        ? "Recover Access"
        : isReset
        ? "Set a New Password"
        : "Welcome Back";
    const subtitle = isRegister
        ? "Enter your details to begin your practice."
        : isForgot
        ? "We will send a reset link to your email."
        : isReset
        ? "Choose a strong password you will remember."
        : "Enter your details to continue your practice.";
    const imageSrc = isRegister ? "/images/register.png" : "/images/login.png";

    return (
        <section className="min-h-screen bg-[#C5AAFF]">
            <div className="min-h-screen flex items-center justify-center px-4 py-10">
                <div className="w-full max-w-6xl bg-[#c9d7ff]/70 rounded-3xl shadow-[0_20px_60px_rgba(15,23,42,0.18)] border border-white/60 backdrop-blur">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        {/* Brand Panel */}
                        <div className="hidden lg:flex flex-col items-center justify-center px-10 py-12 text-center">
                            <div className="mb-6 w-full h-64 relative">
                                <Image
                                    src={imageSrc}
                                    alt={isRegister ? "Register" : "Login"}
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                            <h1 className="text-3xl font-semibold text-slate-800">Tridivya</h1>
                            <p className="text-sm text-slate-500 mt-2">Feel the power of mantras</p>
                        </div>

                        {/* Form Panel */}
                        <div className={`px-6 ${isRegister ? 'py-6' : 'py-10'} sm:px-10`}>
                            <div className={`mx-auto w-full max-w-md bg-white rounded-2xl shadow-lg border border-slate-100 ${isRegister ? 'p-6' : 'p-8'}`}>
                                <div className={`${isRegister ? 'mb-4' : 'mb-6'}`}>
                                    <h2 className={`${isRegister ? 'text-xl' : 'text-2xl'} font-semibold text-slate-900`}>{title}</h2>
                                    <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
                                </div>
                                {children}
                            </div>
                            <div className="mt-6 text-center text-xs text-slate-400">
                                Terms of Service &middot; Privacy Policy
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}