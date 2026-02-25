"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getAuthToken, getUserData, clearAuthCookies } from "@/lib/cookie";

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  role: "user" | "admin";
  imageUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  setUserData: (user: User) => void;
  setIsAuthenticated: (value: boolean) => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await getAuthToken();
      if (token) {
        const userData = await getUserData();
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await clearAuthCookies();
    setUser(null);
    setIsAuthenticated(false);
    if (typeof window !== "undefined") {
      window.location.replace("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        setUser,
        setUserData: setUser,
        setIsAuthenticated,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
