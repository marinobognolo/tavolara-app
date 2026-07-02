"use client";

import { useState } from "react";
import SplashScreen from "./SplashScreen";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      {children}
    </>
  );
}
