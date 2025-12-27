"use client";

import LoginForm from "../_components/LoginForm";

export default function Page() {
    return (
        <div className="space-y-6 w-full">
            <div className="text-center">
                <h1 className="text-3xl font-bold">Welcome back</h1>
                <p className="mt-2 text-sm text-white/80">Find your inner peace. Please enter your details.</p>
            </div>

            <LoginForm />

            <div className="mt-4 text-center text-xs text-white/60">
                Terms of Service &middot; Privacy Policy &middot; Help
            </div>
        </div>
    );
}