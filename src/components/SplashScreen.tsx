"use client";

import { useState, useRef, useEffect, useCallback } from "react";

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"idle" | "playing" | "fallback" | "zoom">("idle");
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
      if (!video) { setPhase("fallback"); setTimeout(skip, 1800); return; }
      video.play()
        .then(() => {
          setPhase("playing");
          // Se dopo 2s il video non avanza (browser che blocca autoplay), fallback
          setTimeout(() => {
            if (!doneRef.current && video.currentTime < 0.1) {
              setPhase("fallback");
              setTimeout(skip, 1800);
            }
          }, 2000);
        })
        .catch(() => {
          setPhase("fallback");
          setTimeout(skip, 1800);
        });
    };

    const t = setTimeout(tryPlay, 150);
    const hard = setTimeout(skip, 10000);

    return () => { clearTimeout(t); clearTimeout(hard); };
  }, [skip]);

  return (
    <div className="fixed inset-0 z-50 bg-nero overflow-hidden" onClick={skip}>
      <video
        ref={videoRef}
        src="/splash.mp4"
        muted
        playsInline
        preload="auto"
        onEnded={skip}
        onError={() => { setPhase("fallback"); setTimeout(skip, 1800); }}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: phase === "playing" ? 1 : 0, transition: "opacity 0.4s" }}
      />

      {/* Logo solo se il video non parte */}
      {(phase === "fallback" || phase === "zoom") && (
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
                : "opacity 0.3s ease",
            }}
          />
        </div>
      )}
    </div>
  );
}
