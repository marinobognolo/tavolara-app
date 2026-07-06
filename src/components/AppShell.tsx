"use client";

import { useState, useEffect } from "react";
import SplashScreen from "./SplashScreen";
import { AuthProvider } from "@/lib/auth-context";

const SPLASH_KEY = "tav_splash_ts";
const SPLASH_TTL = 30 * 60 * 1000;

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    // Localhost → mai mostrare la splash
    if (window.location.hostname === "localhost") return;

    // Già vista di recente → salta
    try {
      const last = Number(localStorage.getItem(SPLASH_KEY) ?? "0");
      if (Date.now() - last < SPLASH_TTL) return;
    } catch {}

    setShowSplash(true);
  }, []);

  return (
    <AuthProvider>
      {showSplash && <SplashScreen onComplete={() => { setShowSplash(false); try { localStorage.setItem(SPLASH_KEY, String(Date.now())); } catch {} }} />}
      {children}
    </AuthProvider>
  );
}
