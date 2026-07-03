"use client";

import { useState, useRef, useEffect } from "react";

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [zooming, setZooming] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const doneRef = useRef(false);

  function skip() {
    if (doneRef.current) return;
    doneRef.current = true;
    setZooming(true);
    setTimeout(onComplete, 400);
  }

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const play = video.play();
    if (play !== undefined) {
      play.catch(() => skip()); // autoplay bloccato → vai subito alla home
    }

    // fallback: se il video non finisce entro 60s salta comunque
    const timeout = setTimeout(skip, 60000);
    return () => clearTimeout(timeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-nero overflow-hidden">
      <video
        ref={videoRef}
        src="/splash.mp4"
        autoPlay
        muted
        playsInline
        onEnded={skip}
        onError={skip}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Logo — click per saltare */}
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
