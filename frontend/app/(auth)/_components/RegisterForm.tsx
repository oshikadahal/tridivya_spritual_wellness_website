"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { RegisterData, registerSchema } from "../schema";
import { useTransition } from "react";
import { useRouter } from "next/navigation";




export default function RegisterForm() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterData>({
        resolver: zodResolver(registerSchema),
        mode: "onSubmit",
    });

    const [pending, setTransition] = useTransition()

    const submit = async (values: RegisterData) => {
        setTransition( async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            router.push("/login");
        })
        console.log("register", values);
    };

    return (
        <form onSubmit={handleSubmit(submit)} className="space-y-3">
            <div className="space-y-1">
                <label className="text-sm font-semibold">Full Name</label>
                <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 20c0-2.2 2.7-4 6-4s6 1.8 6 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <input
                        id="name"
                        type="text"
                        autoComplete="name"
                        className="h-9 w-full rounded-full bg-white/6 border border-white/8 px-10 text-sm text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-cyan-400"
                        {...register("name")}
                        placeholder="Enter your full name"
                    />
                </div>
                {errors.name?.message && (
                    <p className="text-xs text-red-400">{errors.name.message}</p>
                )}
            </div>

            <div className="space-y-1">
                <label className="text-sm font-semibold">Email</label>
                <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 8.5L12 13L21 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        className="h-9 w-full rounded-full bg-white/6 border border-white/8 px-10 text-sm text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-cyan-400"
                        {...register("email")}
                        placeholder="name@example.com"
                    />
                </div>
                {errors.email?.message && (
                    <p className="text-xs text-red-400">{errors.email.message}</p>
                )}
            </div>

            <div className="space-y-1">
                <label className="text-sm font-semibold">Password</label>
                <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 15V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 11v4a4 4 0 0 1-8 0v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <input
                        id="password"
                        type="password"
                        autoComplete="new-password"
                        className="h-9 w-full rounded-full bg-white/6 border border-white/8 px-10 text-sm text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-cyan-400"
                        {...register("password")}
                        placeholder="Create a password"
                    />
                </div>
                {errors.password?.message && (
                    <p className="text-xs text-red-400">{errors.password.message}</p>
                )}
            </div>

            <div className="space-y-1">
                <label className="text-sm font-semibold">Confirm password</label>
                <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 15V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 11v4a4 4 0 0 1-8 0v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <input
                        id="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        className="h-9 w-full rounded-full bg-white/6 border border-white/8 px-10 text-sm text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-cyan-400"
                        {...register("confirmPassword")}
                        placeholder="Confirm your password"
                    />
                </div>
                {errors.confirmPassword?.message && (
                    <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>
                )}
            </div>

            <label className="flex items-start gap-2 text-sm text-white/80">
                <input type="checkbox" className="h-4 w-4 rounded-sm bg-white/6 border-white/10 mt-1" />
                <span>I agree to the <a href="#" className="underline">Terms of Service &amp; Privacy Policy</a></span>
            </label>

            <button
                type="submit"
                disabled={isSubmitting || pending}
                className="h-9 w-full rounded-full bg-linear-to-r from-cyan-400 to-blue-500 text-black text-sm font-semibold shadow-md disabled:opacity-60"
            >
                { isSubmitting || pending ? "Creating account..." : "Sign Up"}
            </button>

            <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-white/10" />
                <div className="text-sm text-white/70">OR CONTINUE WITH</div>
                <div className="h-px flex-1 bg-white/10" />
            </div>

            <div className="flex gap-3 mt-1">
                <button type="button" className="flex-1 rounded-full border border-white/10 bg-transparent py-2 text-sm text-white/90 flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.7 0 6.3 1.6 7.8 2.9l5.8-5.6C33.5 3 29.1 1 24 1 14.8 1 7.2 6.6 3.7 14.7l6.8 5.3C12.5 15 17.7 9.5 24 9.5z"/><path fill="#34A853" d="M46.5 24.5c0-1.6-.1-2.8-.4-4H24v7.6h12.7c-.6 3-2.6 5.6-5.5 7.3l6.8 5.3c4.2-3.9 6.5-9.7 6.5-16.2z"/><path fill="#4A90E2" d="M9.9 29.9c-.6-1.6-1-3.3-1-5.1s.4-3.5 1-5.1L3.1 14.4C1.1 17.4 0 20.6 0 24s1.1 6.6 3.1 9.6l6.8-3.7z"/><path fill="#FBBC05" d="M24 46.9c6.1 0 11.3-2 15.1-5.3l-7.1-5.6c-2 1.4-4.7 2.3-8 2.3-6.3 0-11.5-5.5-13.5-10.8l-7.1 5.5C7.2 42.3 14.8 46.9 24 46.9z"/></svg>
                    Google
                </button>

                <button type="button" className="flex-1 rounded-full border border-white/10 bg-transparent py-2 text-sm text-white/90 flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M16.365 1.43c-.986.044-2.16.706-2.864 1.518-.627.732-1.17 1.883-1.02 3.015 1.083.05 2.35-.689 3.04-1.517.657-.79 1.168-1.906.844-3.016zm3.64 12.564c.03-1.64.72-2.88 1.906-3.8-1.74-2.55-4.5-3.2-5.56-3.24-1.39-.05-2.72.81-3.45.81-.76 0-1.98-.79-3.26-.77-1.67.01-3.22.98-4.08 2.5-1.75 3.03-.45 7.53 1.27 10-1.04 1.5-2.3 3.33-1.03 5.85 1.81 2.75 3.84 3.67 6.3 3.66 1.66-.01 2.88-.7 3.95-.7.97 0 2.49.79 3.78.75 1.46-.04 2.88-.72 4.02-1.94-4.78-1.4-6.16-7.13-6.09-7.28z"/></svg>
                    Apple
                </button>
            </div>

            <div className="mt-3 text-center text-sm text-white/70">
                Already have an account? <Link href="/login" className="font-semibold hover:underline">Log in</Link>
            </div>
        </form>
    );
}
