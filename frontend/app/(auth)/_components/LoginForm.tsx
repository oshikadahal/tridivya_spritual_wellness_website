"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LoginData, loginSchema } from "../schema";
import { loginUser } from "@/lib/api/auth";

export default function LoginForm() {
    const router = useRouter();
    const { login: setAuthState } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginData>({
        resolver: zodResolver(loginSchema),
        mode: "onSubmit",
    });
    const [error, setError] = useState<string | null>(null);

    const submit = async (values: LoginData) => {
        setError(null);
        try {
            const response = await loginUser(values);
            if (!response.success) {
                setError(response.message || 'Login failed');
                return;
            }

            // persist auth locally for client-side requests
            if (response.token) {
                localStorage.setItem("auth_token", response.token);
                document.cookie = `auth_token=${response.token}; path=/`;
            }
            if (response.data) {
                localStorage.setItem("user_data", JSON.stringify(response.data));
                document.cookie = `user_data=${encodeURIComponent(JSON.stringify(response.data))}; path=/`;
                // update in-memory auth state to avoid a flash back to /login
                setAuthState(response.data);
            }

            const redirectUrl = response.data?.role === 'admin'
                ? '/admin/dashboard'
                : '/dashboard';

            router.replace(redirectUrl);
        } catch (err: Error | any) {
            setError(err.message || 'Login failed');
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
                    autoComplete="current-password"
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-300"
                    {...register("password")}
                    placeholder="••••••••"
                />
                {errors.password?.message && (
                    <p className="text-xs text-red-500">{errors.password.message}</p>
                )}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
                <label className="flex items-center gap-2">
                    <input type="checkbox" className="h-4 w-4 rounded border-slate-300" />
                    <span>Remember me</span>
                </label>
                <Link href="/forgot-password" className="hover:underline">Forgot password?</Link>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="h-10 w-full rounded-lg bg-indigo-500 text-white text-sm font-semibold hover:bg-indigo-600 transition disabled:opacity-60"
            >
                {isSubmitting ? "Signing in..." : "Get Started"}
            </button>

            <div className="mt-2 text-center text-xs text-slate-500">
                New to Tridivya? <Link href="/register" className="font-semibold text-indigo-600 hover:underline">Join Tridivya</Link>
            </div>
        </form>
    );
}
