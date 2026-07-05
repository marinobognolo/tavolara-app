"use client";

import { useState } from "react";
import SplashScreen from "./SplashScreen";
import { AuthProvider } from "@/lib/auth-context";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <AuthProvider>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      {children}
    </AuthProvider>
  );
}
