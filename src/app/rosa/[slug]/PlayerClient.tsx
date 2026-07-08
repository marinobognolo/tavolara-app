"use client";

import { useState, useRef, useEffect } from "react";
import { Player } from "@/lib/data";

function Lightbox({
  photos,
  index,
  onClose,
}: {
  photos: string[];
  index: number;
  onClose: () => void;
}) {
  const [cur, setCur] = useState(index);
  const touchX = useRef(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const prev = () => setCur((c) => Math.max(0, c - 1));
  const next = () => setCur((c) => Math.min(photos.length - 1, c + 1));

  return (
    <div className="fixed inset-0 z-[80] bg-black flex flex-col">
      {/* Header */}
      <div
        className="flex items-center justify-between px-5"
        style={{
          paddingTop: "calc(env(safe-area-inset-top) + 14px)",
          paddingBottom: "14px",
        }}
      >
        <span className="font-mono text-[0.65rem]" style={{ color: "rgba(255,255,255,0.38)" }}>
          {cur + 1} / {photos.length}
        </span>
        <button onClick={onClose} className="w-9 h-9 flex items-center justify-center" aria-label="Chiudi">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.5} strokeLinecap="round" className="w-6 h-6">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Image */}
      <div
        className="flex-1 relative overflow-hidden"
        onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (dx > 50) prev();
          else if (dx < -50) next();
        }}
      >
        {/* Tap zones */}
        <div className="absolute inset-y-0 left-0 w-1/2 z-10" onClick={prev} />
        <div className="absolute inset-y-0 right-0 w-1/2 z-10" onClick={next} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photos[cur]}
          alt=""
          className="w-full h-full object-contain"
          draggable={false}
        />
      </div>

      <div style={{ height: "calc(env(safe-area-inset-bottom) + 0.75rem)" }} />
    </div>
  );
}

const STAT_LABELS = [
  { key: "presenze",     label: "Pres."  },
  { key: "gol",         label: "Gol"    },
  { key: "assist",      label: "Assist" },
  { key: "ammonizioni", label: "Amm."   },
  { key: "espulsioni",  label: "Esp."   },
] as const;

export default function PlayerClient({
  player,
  photoCount,
}: {
  player: Player;
  photoCount: number;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const photos = Array.from({ length: photoCount }, (_, i) =>
    `/giocatori/${player.slug}/${String(i + 1).padStart(2, "0")}.jpg`
  );

  return (
    <>
      {/* ── HERO ──────────────────────────────────────────── */}
      <div className="relative min-h-[100svh] flex flex-col overflow-hidden">
        {photos[0] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photos[0]}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, #14110c 22%, rgba(20,17,12,0.65) 52%, rgba(0,0,0,0.2) 100%)",
          }}
        />

        {/* Numero enorme in background */}
        <div
          className="absolute bottom-24 right-2 font-body font-extrabold pointer-events-none select-none leading-none"
          style={{ fontSize: "clamp(9rem, 44vw, 16rem)", color: "rgba(255,255,255,0.05)" }}
        >
          {player.number}
        </div>

        {/* Info in basso */}
        <div
          className="relative mt-auto px-5"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 3rem)" }}
        >
          <p
            className="font-mono text-[0.6rem] uppercase tracking-[0.32em] mb-2"
            style={{ color: "var(--color-oro)" }}
          >
            {player.role}
          </p>

          <div className="flex items-end justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-mono text-[0.78rem] uppercase tracking-wide text-white/50 leading-none mb-1">
                {player.first}
              </p>
              <h1
                className="font-body font-extrabold uppercase text-white leading-none"
                style={{ fontSize: "clamp(2rem, 9.5vw, 2.8rem)" }}
              >
                {player.last}
              </h1>
            </div>

            <div className="flex items-end gap-2 shrink-0">
              {player.captain && (
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-body font-extrabold text-[0.85rem] mb-1"
                  style={{ backgroundColor: "var(--color-oro)", color: "var(--color-nero)" }}
                >
                  C
                </div>
              )}
              {player.viceCaptain && (
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-body font-extrabold text-[0.68rem] mb-1"
                  style={{ backgroundColor: "var(--color-oro)", color: "var(--color-nero)" }}
                >
                  VC
                </div>
              )}
              <p
                className="font-body font-extrabold leading-none"
                style={{ fontSize: "clamp(2.8rem, 13vw, 4rem)", color: "var(--color-oro)" }}
              >
                {player.number}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── STATS ─────────────────────────────────────────── */}
      <div className="px-5 pt-8 pb-8" style={{ backgroundColor: "var(--color-nero)" }}>
        <p
          className="font-mono text-[0.55rem] uppercase tracking-[0.26em] mb-4"
          style={{ color: "rgba(255,255,255,0.28)" }}
        >
          Stagione 2025/26
        </p>
        <div
          className="flex rounded-2xl py-5"
          style={{
            backgroundColor: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {STAT_LABELS.map(({ key, label }, i) => {
            const val = player.stats?.[key];
            return (
              <div
                key={key}
                className="flex-1 flex flex-col items-center gap-1.5"
                style={{
                  borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.07)" : undefined,
                }}
              >
                <p className="font-body font-extrabold text-[1.85rem] text-white leading-none">
                  {val ?? "—"}
                </p>
                <p
                  className="font-mono text-[0.46rem] uppercase tracking-widest"
                  style={{ color: "var(--color-oro)" }}
                >
                  {label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── GALLERY ───────────────────────────────────────── */}
      {photos.length > 1 && (
        <div style={{ backgroundColor: "var(--color-nero)" }} className="pb-32">
          <div className="px-5 pb-4 flex items-baseline justify-between">
            <h2 className="font-body font-extrabold text-[1.5rem] uppercase text-white">
              Gallery
            </h2>
            <span
              className="font-mono text-[0.55rem] uppercase tracking-wider"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              {photos.length} foto
            </span>
          </div>
          <div className="grid grid-cols-2 gap-px">
            {photos.map((src, i) => (
              <button
                key={i}
                className="aspect-square overflow-hidden"
                style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                onClick={() => setLightboxIndex(i)}
                aria-label={`Foto ${i + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  className="w-full h-full object-cover"
                  loading={i < 6 ? "eager" : "lazy"}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── LIGHTBOX ──────────────────────────────────────── */}
      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
