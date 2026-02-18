import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "next-themes";
import "react-toastify/dist/ReactToastify.css";
import { LogoutModalProvider } from "@/context/LogoutModalContext";
import LogoutModal from "@/components/LogoutModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tridivya Wellness",
  description: "Yoga, Meditation, and Mantra for wellness",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <LogoutModalProvider>
            <AuthProvider>
              {children}
              <ToastContainer position="top-right" autoClose={3000} />
              <LogoutModal />
            </AuthProvider>
          </LogoutModalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
