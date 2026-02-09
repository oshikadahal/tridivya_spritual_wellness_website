"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordData, forgotPasswordSchema } from "../schema";
import { handleForgotPassword } from "@/lib/actions/auth-action";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordForm() {
    const [status, setStatus] = useState<{ type: "error" | "success"; message: string } | null>(null);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ForgotPasswordData>({
        resolver: zodResolver(forgotPasswordSchema),
        mode: "onSubmit",
    });

    const submit = async (values: ForgotPasswordData) => {
        setStatus(null);
        const result = await handleForgotPassword(values.email);
        if (result.success) {
            setStatus({ type: "success", message: result.message || "Reset link sent" });
        } else {
            setStatus({ type: "error", message: result.message || "Request failed" });
        }
    };

    return (
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
            {status && (
                <div
                    className={`border rounded-lg p-3 text-sm ${
                        status.type === "success"
                            ? "bg-green-50 border-green-200 text-green-700"
                            : "bg-red-50 border-red-200 text-red-600"
                    }`}
                >
                    {status.message}
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

            <button
                type="submit"
                disabled={isSubmitting}
                className="h-10 w-full rounded-lg bg-indigo-500 text-white text-sm font-semibold hover:bg-indigo-600 transition disabled:opacity-60"
            >
                {isSubmitting ? "Sending..." : "Send Reset Link"}
            </button>

            <div className="text-center text-xs text-slate-500">
                Remembered your password? <Link href="/login" className="font-semibold text-indigo-600 hover:underline">Log in</Link>
            </div>
        </form>
    );
}
