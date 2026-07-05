"use client";

import { useState, useEffect } from "react";
import SplashScreen from "./SplashScreen";
import { AuthProvider } from "@/lib/auth-context";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  return (
    <AuthProvider>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      {children}
    </AuthProvider>
  );
}
