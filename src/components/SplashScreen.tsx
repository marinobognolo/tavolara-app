"use client";

import { useState } from "react";

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [zooming, setZooming] = useState(false);

  function skip() {
    setZooming(true);
    setTimeout(onComplete, 400);
  }

  return (
    <div className="fixed inset-0 z-50 bg-nero overflow-hidden">
      <video
        src="/splash.mp4"
        autoPlay
        muted
        playsInline
        onEnded={skip}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Logo centrato — click per saltare */}
      <div className="absolute inset-0 flex items-center justify-center" onClick={skip}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-tavolara-gold.png"
          alt="Tavolara Calcio"
          className="w-28 object-contain"
          style={{
            filter: "brightness(0) invert(1)",
            transform: zooming ? "scale(8)" : "scale(1)",
            opacity: zooming ? 0 : 1,
            transition: zooming
              ? "transform 0.35s cubic-bezier(0.4,0,1,1), opacity 0.2s ease 0.1s"
              : "none",
          }}
        />
      </div>
    </div>
  );
}
