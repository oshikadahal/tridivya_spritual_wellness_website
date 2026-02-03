"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { RegisterData, registerSchema } from "../schema";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { handleRegister } from "@/lib/actions/auth-action";




export default function RegisterForm() {
    const router = useRouter();
    const [error, setError] = useState("");
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
        setError("");
        try {
            const result = await handleRegister(values);
            if (!result.success) {
                throw new Error(result.message || "Registration failed");
            }
            setTransition(() => {
                router.push("/login");
            });
        } catch (err: Error | any) {
            setError(err.message || "Registration failed");
        }
    };

    return (
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Full Name</label>
                <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-300"
                    {...register("name")}
                    placeholder="e.g. John Doe"
                />
                {errors.name?.message && (
                    <p className="text-xs text-red-500">{errors.name.message}</p>
                )}
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Email Address</label>
                <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-300"
                    {...register("email")}
                    placeholder="name@example.com"
                />
                {errors.email?.message && (
                    <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-300"
                    {...register("password")}
                    placeholder="Create a password"
                />
                {errors.password?.message && (
                    <p className="text-xs text-red-500">{errors.password.message}</p>
                )}
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Confirm Password</label>
                <input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-300"
                    {...register("confirmPassword")}
                    placeholder="Confirm your password"
                />
                {errors.confirmPassword?.message && (
                    <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
                )}
            </div>

            <label className="flex items-start gap-2 text-xs text-slate-500">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300 mt-0.5" />
                <span>I agree to the <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a></span>
            </label>

            <button
                type="submit"
                disabled={isSubmitting || pending}
                className="h-10 w-full rounded-lg bg-indigo-500 text-white text-sm font-semibold hover:bg-indigo-600 transition disabled:opacity-60"
            >
                {isSubmitting || pending ? "Creating account..." : "Create Account"}
            </button>

            <div className="mt-2 text-center text-xs text-slate-500">
                Already have an account? <Link href="/login" className="font-semibold text-indigo-600 hover:underline">Log in here</Link>
            </div>
        </form>
    );
}
