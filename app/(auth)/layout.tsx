
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen w-full">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/login-bg.jpg')",
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Page Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        {children}
      </div>
    </div>
  );
}
