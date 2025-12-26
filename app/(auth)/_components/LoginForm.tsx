
"use client";

import { Eye, EyeOff, Mail } from "lucide-react";
import { useState } from "react";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-md rounded-2xl bg-black/40 backdrop-blur-xl p-8 shadow-2xl text-white">
      <h1 className="text-2xl font-semibold text-center">Welcome back</h1>
      <p className="mt-1 text-center text-sm text-gray-300">
        Find your inner peace. Please enter your details.
      </p>

      {/* Email */}
      <div className="mt-6">
        <label className="text-sm text-gray-300">Email</label>
        <div className="mt-1 flex items-center rounded-lg bg-white/10 px-3">
          <input
            type="email"
            placeholder="name@example.com"
            className="w-full bg-transparent py-3 text-sm outline-none placeholder-gray-400"
          />
          <Mail size={18} className="text-gray-400" />
        </div>
      </div>

      {/* Password */}
      <div className="mt-4">
        <label className="text-sm text-gray-300">Password</label>
        <div className="mt-1 flex items-center rounded-lg bg-white/10 px-3">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="w-full bg-transparent py-3 text-sm outline-none placeholder-gray-400"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-400"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* Remember / Forgot */}
      <div className="mt-4 flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-gray-300">
          <input type="checkbox" className="accent-cyan-400" />
          Remember me
        </label>
        <a href="#" className="text-cyan-400 hover:underline">
          Forgot password?
        </a>
      </div>

      {/* Login Button */}
      <button className="mt-6 w-full rounded-lg bg-cyan-400 py-3 font-medium text-black transition hover:bg-cyan-300">
        Log in
      </button>

      {/* Divider */}
      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-white/20" />
        <span className="text-xs text-gray-300">OR CONTINUE WITH</span>
        <div className="h-px flex-1 bg-white/20" />
      </div>

      {/* Social Buttons */}
      <div className="flex gap-4">
        <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-white/10 py-2 transition hover:bg-white/20">
          <img src="/google.svg" alt="Google" className="h-5 w-5" />
          <span className="text-sm">Google</span>
        </button>

        <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-white/10 py-2 transition hover:bg-white/20">
          <img src="/apple.svg" alt="Apple" className="h-5 w-5" />
          <span className="text-sm">Apple</span>
        </button>
      </div>
    </div>
  );
}
