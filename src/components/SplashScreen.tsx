"use client";

import { useState } from "react";

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"playing" | "zoom" | "done">("playing");

  function handleEnded() {
    setPhase("zoom");
    setTimeout(onComplete, 1000);
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-nero overflow-hidden"
      style={{
        opacity: phase === "done" ? 0 : 1,
        transition: phase === "zoom" ? "opacity 0.4s ease 0.6s" : "none",
      }}
    >
      {/* Video fullscreen */}
      <video
        src="/splash.mp4"
        autoPlay
        muted
        playsInline
        onEnded={handleEnded}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay scuro leggero */}
      <div className="absolute inset-0 bg-black/25" />

      {/* Logo centrato */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          transform: phase === "zoom" ? "scale(2.8)" : "scale(1)",
          opacity: phase === "zoom" ? 0 : 1,
          transition: "transform 0.9s cubic-bezier(0.4,0,0.2,1), opacity 0.5s ease 0.3s",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-tavolara-gold.png"
          alt="Tavolara Calcio"
          className="w-28 object-contain"
          style={{ filter: "brightness(0) invert(1)" }}
        />
      </div>

      {/* Sponsor in basso */}
      <div
        className="absolute bottom-12 inset-x-0 flex items-center justify-center gap-12 px-10"
        style={{
          opacity: phase === "zoom" ? 0 : 1,
          transition: "opacity 0.3s ease",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-sardares.png"
          alt="Sardares"
          className="h-7 object-contain"
          style={{ filter: "brightness(0) invert(1)" }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-nexum.png"
          alt="Nexum STP"
          className="h-7 object-contain"
          style={{ filter: "brightness(0) invert(1)" }}
        />
      </div>
    </div>
  );
}
