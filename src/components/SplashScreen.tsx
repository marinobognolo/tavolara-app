"use client";

import { useState, useRef, useEffect, useCallback } from "react";

const SPLASH_KEY = "tav_splash_ts";
const SPLASH_TTL = 30 * 60 * 1000; // 30 minuti

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"idle" | "playing" | "fallback" | "zoom">("idle");
  const videoRef = useRef<HTMLVideoElement>(null);
  const doneRef = useRef(false);

  const skip = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    try { localStorage.setItem(SPLASH_KEY, String(Date.now())); } catch {}
    setPhase("zoom");
    setTimeout(onComplete, 450);
  }, [onComplete]);

  useEffect(() => {
    // Se l'utente ha già visto la splash di recente, salta subito
    try {
      const last = Number(localStorage.getItem(SPLASH_KEY) ?? "0");
      if (Date.now() - last < SPLASH_TTL) {
        onComplete();
        return;
      }
    } catch {}

    const video = videoRef.current;

    const tryPlay = () => {
      if (!video) { setPhase("fallback"); setTimeout(skip, 1800); return; }
      video.play()
        .then(() => {
          setPhase("playing");
          // Se dopo 2s il video non avanza (browser headless / bloccato), vai in fallback
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
  }, [skip, onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-nero overflow-hidden" onClick={skip}>
      {/* Video */}
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

      {/* Logo — visibile solo nel fallback (video non disponibile) e durante zoom */}
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
