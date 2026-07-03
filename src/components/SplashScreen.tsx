"use client";

import { useState, useRef, useEffect, useCallback } from "react";

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"idle" | "playing" | "zoom">("idle");
  const videoRef = useRef<HTMLVideoElement>(null);
  const doneRef = useRef(false);

  const skip = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    setPhase("zoom");
    setTimeout(onComplete, 450);
  }, [onComplete]);

  useEffect(() => {
    const video = videoRef.current;

    const tryPlay = () => {
      if (!video) { setTimeout(skip, 3000); return; }
      video.play()
        .then(() => setPhase("playing"))
        .catch(() => {
          // video non supportato o bloccato → splash statico 3 secondi
          setTimeout(skip, 3000);
        });
    };

    // piccolo delay per evitare race condition con hydration
    const t = setTimeout(tryPlay, 150);

    // fallback duro: se dopo 20s il video non è finito, salta
    const hard = setTimeout(skip, 20000);

    return () => { clearTimeout(t); clearTimeout(hard); };
  }, [skip]);

  return (
    <div className="fixed inset-0 z-50 bg-nero overflow-hidden" onClick={skip}>
      {/* Video — nascosto finché non parte */}
      <video
        ref={videoRef}
        src="/splash.mp4"
        muted
        playsInline
        preload="auto"
        onEnded={skip}
        onError={() => setTimeout(skip, 3000)}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: phase === "playing" ? 1 : 0, transition: "opacity 0.3s" }}
      />

      {/* Logo centrato */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-tavolara-gold.png"
          alt="Tavolara Calcio"
          className="w-28 object-contain"
          style={{
            filter: "brightness(0) invert(1)",
            transform: phase === "zoom" ? "scale(8)" : "scale(1)",
            opacity: phase === "zoom" ? 0 : 1,
            transition: phase === "zoom"
              ? "transform 0.4s cubic-bezier(0.4,0,1,1), opacity 0.25s ease 0.1s"
              : "none",
          }}
        />
      </div>
    </div>
  );
}
