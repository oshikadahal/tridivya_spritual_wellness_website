"use client";

import RegisterForm from "../_components/RegisterForm";

export default function Page() {
    return (
        <div className="space-y-6 w-full">
            <div className="text-center">
                <h1 className="text-3xl font-bold">Create Account</h1>
                <p className="mt-2 text-sm text-white/80">Join our community to find your inner peace.</p>
            </div>

            <RegisterForm />

            <div className="mt-4 text-center text-xs text-white/60">
                Terms of Service &middot; Privacy Policy &middot; Help
            </div>
        </div>
    );
}