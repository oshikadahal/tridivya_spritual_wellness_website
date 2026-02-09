"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordData, resetPasswordSchema } from "../schema";
import { handleResetPassword } from "@/lib/actions/auth-action";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

export default function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = useMemo(() => searchParams.get("token") || "", [searchParams]);
    const [status, setStatus] = useState<{ type: "error" | "success"; message: string } | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ResetPasswordData>({
        resolver: zodResolver(resetPasswordSchema),
        mode: "onSubmit",
    });

    const submit = async (values: ResetPasswordData) => {
        setStatus(null);
        if (!token) {
            setStatus({ type: "error", message: "Missing reset token." });
            return;
        }

        const result = await handleResetPassword({
            token,
            password: values.password,
            confirmPassword: values.confirmPassword,
        });

        if (result.success) {
            setStatus({ type: "success", message: result.message || "Password updated" });
            setTimeout(() => router.push("/login"), 1200);
        } else {
            setStatus({ type: "error", message: result.message || "Reset failed" });
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
                <label className="text-sm font-medium text-slate-700">New Password</label>
                <input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-300"
                    {...register("password")}
                    placeholder="Create a new password"
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

            <button
                type="submit"
                disabled={isSubmitting || !token}
                className="h-10 w-full rounded-lg bg-indigo-500 text-white text-sm font-semibold hover:bg-indigo-600 transition disabled:opacity-60"
            >
                {isSubmitting ? "Updating..." : "Update Password"}
            </button>

            <div className="text-center text-xs text-slate-500">
                Back to <Link href="/login" className="font-semibold text-indigo-600 hover:underline">Login</Link>
            </div>
        </form>
    );
}
