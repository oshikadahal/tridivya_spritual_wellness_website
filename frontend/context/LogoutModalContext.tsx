"use client";
import React, { createContext, useContext, useState } from "react";

interface LogoutModalContextType {
  showLogoutModal: boolean;
  setShowLogoutModal: (show: boolean) => void;
}

const LogoutModalContext = createContext<LogoutModalContextType | undefined>(undefined);

export function LogoutModalProvider({ children }: { children: React.ReactNode }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  return (
    <LogoutModalContext.Provider value={{ showLogoutModal, setShowLogoutModal }}>
      {children}
    </LogoutModalContext.Provider>
  );
}

export function useLogoutModal() {
  const context = useContext(LogoutModalContext);
  if (!context) throw new Error("useLogoutModal must be used within a LogoutModalProvider");
  return context;
}
