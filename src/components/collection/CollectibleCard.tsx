"use client";

import { useRef, useEffect, useCallback } from "react";
import type { Player } from "@/lib/data";
import { RARITIES, type RarityKey } from "@/lib/collection";

/* Island silhouette — outline only */
function IslandSvg({ color, size = 22 }: { color: string; size?: number }) {
  return (
    <svg viewBox="0 0 40 32" fill="none" style={{ width: size, height: Math.round(size * 0.8) }}>
      <path
        d="M2 30 L12 10 L18 18 L26 4 L38 30 Z"
        stroke={color}
        strokeWidth="1.8"
        fill="none"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* Holographic gradient per rarità (usato sulla carta grande) */
function holoGradient(rarity: RarityKey): string {
  switch (rarity) {
    case "leggendaria":
      return "linear-gradient(45deg, rgba(255,0,100,0.38), rgba(255,120,0,0.32), rgba(255,230,0,0.32), rgba(0,255,120,0.32), rgba(0,160,255,0.32), rgba(160,0,255,0.38), rgba(255,0,100,0.38))";
    case "ultra":
      return "linear-gradient(45deg, rgba(192,132,252,0.38), rgba(56,189,248,0.32), rgba(236,72,153,0.32), rgba(192,132,252,0.38))";
    case "super":
      return "linear-gradient(45deg, transparent 15%, rgba(56,189,248,0.32) 50%, transparent 85%)";
    case "rara":
      return "linear-gradient(45deg, transparent 15%, rgba(52,211,153,0.32) 50%, transparent 85%)";
    case "comune":
    default:
      return "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.12) 50%, transparent 70%)";
  }
}

interface CardProps {
  player: Player;
  rarity: RarityKey;
  count?: number;
  missing?: boolean;
  variant?: "mini" | "full";
  onClose?: () => void;
}

export function CollectibleCard({
  player,
  rarity,
  count = 1,
  missing = false,
  variant = "mini",
  onClose,
}: CardProps) {
  const r = RARITIES[rarity];
  const isLeg = rarity === "leggendaria";
  const cardRef = useRef<HTMLDivElement>(null);
  const holoRef = useRef<HTMLDivElement>(null);

  /* ─── Tilt + holo (solo variant=full) ─────────────── */
  const updateTilt = useCallback((x: number, y: number) => {
    const el = cardRef.current;
    const holo = holoRef.current;
    if (!el) return;
    const rx = (0.5 - y) * 24;
    const ry = (x - 0.5) * 24;
    el.style.setProperty("--rx", `${rx}deg`);
    el.style.setProperty("--ry", `${ry}deg`);
    if (holo) {
      holo.style.backgroundPosition = `${x * 100}% ${y * 100}%`;
      holo.style.opacity = "1";
    }
  }, []);

  const resetTilt = useCallback(() => {
    const el = cardRef.current;
    const holo = holoRef.current;
    if (!el) return;
    el.style.transition = "transform 0.55s cubic-bezier(0.22,1,0.36,1)";
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    setTimeout(() => {
      if (el) el.style.transition = "transform 0.08s linear";
    }, 550);
    if (holo) holo.style.backgroundPosition = "50% 50%";
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (variant !== "full") return;
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    updateTilt(
      (e.clientX - rect.left) / rect.width,
      (e.clientY - rect.top) / rect.height
    );
  }, [variant, updateTilt]);

  /* Touch — must be passive:false per preventDefault */
  useEffect(() => {
    if (variant !== "full") return;
    const el = cardRef.current;
    if (!el) return;

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = el.getBoundingClientRect();
      updateTilt(
        (touch.clientX - rect.left) / rect.width,
        (touch.clientY - rect.top) / rect.height
      );
    };
    const onTouchEnd = () => resetTilt();

    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    return () => {
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [variant, updateTilt, resetTilt]);

  /* ─── MINI card ────────────────────────────────────── */
  if (variant === "mini") {
    if (missing) {
      return (
        <div style={{
          width: 88, height: 123, borderRadius: 8,
          border: "1px solid rgba(255,255,255,0.07)",
          background: "rgba(255,255,255,0.02)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth={1.5}
            style={{ width: 18, height: 18 }}>
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeLinecap="round" />
          </svg>
        </div>
      );
    }

    return (
      <div style={{
        width: 88, height: 123, borderRadius: 8,
        border: `1.5px solid ${r.color}`,
        background: r.bg,
        boxShadow: `0 0 14px ${r.glow}`,
        position: "relative", overflow: "hidden", flexShrink: 0,
      }}>
        {/* Photo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/giocatori/${player.slug}/01.jpg`} alt={player.last}
          style={{ width: "100%", height: "76%", objectFit: "cover", objectPosition: "center top" }} />

        {/* Sweep sheen */}
        <div style={{
          position: "absolute", top: 0, bottom: 0, width: "30%",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
          animation: "tav-sweep 4s ease infinite", pointerEvents: "none",
        }} />

        {/* Bottom strip */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "linear-gradient(transparent, rgba(0,0,0,0.95))",
          padding: "18px 7px 6px",
        }}>
          <p style={{
            fontFamily: "var(--font-mono)", fontSize: 6, textTransform: "uppercase",
            letterSpacing: "0.1em", color: "rgba(255,255,255,0.42)", marginBottom: 1,
          }}>
            {player.role}
          </p>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 800,
            textTransform: "uppercase", color: "white", letterSpacing: "0.02em", lineHeight: 1,
          }}>
            <span style={{ opacity: 0.6, marginRight: 3 }}>{player.number}</span>
            {player.last}
          </p>
        </div>

        {/* Rarity badge top-left */}
        <div style={{
          position: "absolute", top: 5, left: 5,
          background: r.color, borderRadius: 4, padding: "2px 5px",
        }}>
          <p style={{
            fontFamily: "var(--font-mono)", fontSize: 6, fontWeight: 700,
            color: "#000", letterSpacing: "0.04em",
          }}>
            {r.short}
          </p>
        </div>

        {/* Island top-right */}
        <div style={{ position: "absolute", top: 4, right: 5 }}>
          <IslandSvg color={r.color} size={18} />
        </div>

        {/* Doppioni */}
        {count > 1 && (
          <div style={{
            position: "absolute", bottom: 22, right: 4,
            background: "rgba(0,0,0,0.75)", borderRadius: 3, padding: "1px 4px",
            border: `1px solid ${r.color}`,
          }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 7, color: r.color }}>×{count}</p>
          </div>
        )}

        {/* Stars per leggendaria */}
        {isLeg && [0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} style={{
            position: "absolute", width: 2, height: 2, borderRadius: "50%",
            background: "white",
            left: `${12 + (i * 14) % 76}%`, top: `${8 + (i * 11) % 60}%`,
            animation: `tav-pulse-glow ${1.4 + (i % 3) * 0.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.25}s`, pointerEvents: "none",
          }} />
        ))}
      </div>
    );
  }

  /* ─── FULL overlay card ────────────────────────────── */
  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(0,0,0,0.9)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
      onClick={onClose}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={resetTilt}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 280, height: 392,
          borderRadius: 16,
          border: `2px solid ${r.color}`,
          background: r.bg,
          boxShadow: `0 0 60px ${r.glow}, 0 24px 64px rgba(0,0,0,0.8)`,
          position: "relative", overflow: "hidden",
          transform: "perspective(700px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))",
          transition: "transform 0.08s linear",
          animation: "tav-card-in 0.4s cubic-bezier(0.4,0,0.2,1) both",
          willChange: "transform",
          cursor: "grab",
          userSelect: "none",
          WebkitUserSelect: "none",
        }}
      >
        {/* Photo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/giocatori/${player.slug}/01.jpg`} alt={player.last}
          style={{
            width: "100%", height: "76%",
            objectFit: "cover", objectPosition: "center top",
            pointerEvents: "none",
          }} />

        {/* Holographic foil — position reacts to pointer */}
        <div
          ref={holoRef}
          style={{
            position: "absolute", inset: 0,
            background: holoGradient(rarity),
            backgroundSize: "200% 200%",
            backgroundPosition: "50% 50%",
            pointerEvents: "none",
            mixBlendMode: "screen",
            transition: "background-position 0.05s linear, opacity 0.2s",
          }}
        />

        {/* Glare highlight */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 60% 60% at var(--gx, 50%) var(--gy, 30%), rgba(255,255,255,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Stars per leggendaria */}
        {isLeg && [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <div key={i} style={{
            position: "absolute", width: 3, height: 3, borderRadius: "50%",
            background: "white",
            left: `${8 + (i * 8.5) % 84}%`, top: `${5 + (i * 7) % 65}%`,
            animation: `tav-pulse-glow ${1.2 + (i % 5) * 0.4}s ease-in-out infinite`,
            animationDelay: `${i * 0.18}s`, pointerEvents: "none",
            boxShadow: "0 0 4px rgba(200,200,255,0.8)",
          }} />
        ))}

        {/* Bottom info */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "linear-gradient(transparent, rgba(0,0,0,0.98))",
          padding: "52px 18px 20px",
          pointerEvents: "none",
        }}>
          <p style={{
            fontFamily: "var(--font-mono)", fontSize: 9,
            textTransform: "uppercase", letterSpacing: "0.18em",
            color: "rgba(255,255,255,0.45)", marginBottom: 5,
          }}>
            {player.role}
          </p>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: 30, fontWeight: 800,
            textTransform: "uppercase", color: "white",
            letterSpacing: "0.01em", lineHeight: 1,
            display: "flex", alignItems: "baseline", gap: 9,
          }}>
            <span style={{ fontSize: 22, opacity: 0.55, fontWeight: 800 }}>{player.number}</span>
            {player.last}
          </p>
        </div>

        {/* Rarity badge top-left */}
        <div style={{
          position: "absolute", top: 12, left: 12,
          background: r.color, borderRadius: 7, padding: "5px 10px",
        }}>
          <p style={{
            fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700,
            color: "#000", letterSpacing: "0.08em",
          }}>
            {r.label.toUpperCase()}
          </p>
        </div>

        {/* Island top-right */}
        <div style={{ position: "absolute", top: 12, right: 14 }}>
          <IslandSvg color={r.color} size={28} />
        </div>

        {/* Doppioni */}
        {count > 1 && (
          <div style={{
            position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.7)", borderRadius: 8, padding: "3px 12px",
            border: `1px solid ${r.color}`,
          }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: r.color }}>×{count}</p>
          </div>
        )}
      </div>

      {/* Close */}
      <button
        onClick={onClose}
        style={{
          position: "fixed", top: "calc(env(safe-area-inset-top) + 16px)", right: 16,
          width: 40, height: 40, borderRadius: "50%",
          background: "rgba(255,255,255,0.08)",
          color: "white", fontSize: 22,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
        }}
      >
        ×
      </button>
    </div>
  );
}
