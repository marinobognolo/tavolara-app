"use client";

import { useRef, useCallback } from "react";
import type { Player } from "@/lib/data";
import { RARITIES, type RarityKey } from "@/lib/collection";

function IslandSvg({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 40 32" fill="none" style={{ width: "100%", height: "100%" }}>
      <path
        d="M2 30 L12 10 L18 18 L26 4 L38 30 Z"
        stroke={color}
        strokeWidth="1.5"
        fill={color}
        fillOpacity="0.18"
        strokeLinejoin="round"
      />
    </svg>
  );
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
  const isUltra = rarity === "ultra";
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = cardRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      el.style.setProperty("--rx", `${(0.5 - y) * 20}deg`);
      el.style.setProperty("--ry", `${(x - 0.5) * 20}deg`);
      el.style.setProperty("--gx", `${x * 100}%`);
      el.style.setProperty("--gy", `${y * 100}%`);
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  }, []);

  /* ── MINI card ──────────────────────────────────────── */
  if (variant === "mini") {
    if (missing) {
      return (
        <div
          style={{
            width: 88, height: 123,
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.07)",
            background: "rgba(255,255,255,0.02)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={1.5} style={{ width: 18, height: 18 }}>
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeLinecap="round" />
          </svg>
        </div>
      );
    }

    return (
      <div
        style={{
          width: 88, height: 123,
          borderRadius: 8,
          border: `1.5px solid ${r.color}`,
          background: r.bg,
          boxShadow: `0 0 14px ${r.glow}`,
          position: "relative",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {/* Photo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/giocatori/${player.slug}/01.jpg`}
          alt={player.last}
          style={{ width: "100%", height: "76%", objectFit: "cover", objectPosition: "center top" }}
        />

        {/* Holographic overlay */}
        {(isLeg || isUltra) && (
          <div
            style={{
              position: "absolute", inset: 0,
              background: isLeg
                ? "linear-gradient(135deg, rgba(255,0,128,0.12), rgba(0,255,255,0.12), rgba(255,200,0,0.1), rgba(200,0,255,0.12))"
                : "linear-gradient(135deg, rgba(192,132,252,0.1), rgba(56,189,248,0.1))",
              backgroundSize: "300% 300%",
              animation: "tav-holo 4s ease infinite",
              pointerEvents: "none",
            }}
          />
        )}

        {/* Sweep shine */}
        {!missing && (
          <div style={{
            position: "absolute", top: 0, bottom: 0, width: "30%",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
            animation: "tav-sweep 4s ease infinite",
            pointerEvents: "none",
          }} />
        )}

        {/* Bottom name strip */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "linear-gradient(transparent, rgba(0,0,0,0.92))",
          padding: "14px 5px 5px",
          textAlign: "center",
        }}>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: 8, fontWeight: 800,
            textTransform: "uppercase", color: "white", letterSpacing: "0.04em",
            lineHeight: 1,
          }}>
            {player.last}
          </p>
        </div>

        {/* Rarity badge top-left */}
        <div style={{
          position: "absolute", top: 4, left: 4,
          background: r.color,
          borderRadius: 3,
          padding: "1.5px 4px",
        }}>
          <p style={{
            fontFamily: "var(--font-mono)", fontSize: 6, fontWeight: 700,
            color: "#000", letterSpacing: "0.04em",
          }}>
            {r.short}
          </p>
        </div>

        {/* Island emblem top-right */}
        <div style={{ position: "absolute", top: 3, right: 3, width: 18, height: 14, opacity: 0.8 }}>
          <IslandSvg color={r.color} />
        </div>

        {/* Duplicate badge */}
        {count > 1 && (
          <div style={{
            position: "absolute", bottom: 20, right: 3,
            background: "rgba(0,0,0,0.75)",
            borderRadius: 3,
            padding: "1px 4px",
            border: `1px solid ${r.color}`,
          }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 7, color: r.color }}>×{count}</p>
          </div>
        )}

        {/* Prismatic stars for leggendaria */}
        {isLeg && [0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} style={{
            position: "absolute",
            width: 2, height: 2,
            borderRadius: "50%",
            background: "white",
            left: `${12 + (i * 14) % 76}%`,
            top: `${8 + (i * 11) % 60}%`,
            animation: `tav-pulse-glow ${1.4 + (i % 3) * 0.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.25}s`,
            pointerEvents: "none",
          }} />
        ))}
      </div>
    );
  }

  /* ── FULL overlay card ──────────────────────────────── */
  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(0,0,0,0.88)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
      onClick={onClose}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 280, height: 392,
          borderRadius: 16,
          border: `2px solid ${r.color}`,
          background: r.bg,
          boxShadow: `0 0 60px ${r.glow}, 0 24px 64px rgba(0,0,0,0.8)`,
          position: "relative",
          overflow: "hidden",
          transform: "perspective(800px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))",
          transition: "transform 0.12s ease",
          animation: "tav-card-in 0.4s cubic-bezier(0.4,0,0.2,1) both",
        }}
      >
        {/* Photo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/giocatori/${player.slug}/01.jpg`}
          alt={player.last}
          style={{ width: "100%", height: "76%", objectFit: "cover", objectPosition: "center top" }}
        />

        {/* Holographic overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: isLeg
            ? "linear-gradient(135deg, rgba(255,0,128,0.16), rgba(0,255,255,0.16), rgba(255,200,0,0.13), rgba(200,0,255,0.16), rgba(0,255,128,0.12))"
            : isUltra
            ? "linear-gradient(135deg, rgba(192,132,252,0.14), rgba(236,72,153,0.1), rgba(192,132,252,0.14))"
            : "linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.05) 50%, transparent 60%)",
          backgroundSize: "300% 300%",
          animation: isLeg
            ? "tav-prism 5s ease infinite"
            : isUltra
            ? "tav-holo 4s ease infinite"
            : "none",
          pointerEvents: "none",
          mixBlendMode: "screen",
        }} />

        {/* Mouse glare */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(circle at var(--gx, 50%) var(--gy, 50%), rgba(255,255,255,0.1) 0%, transparent 55%)",
          pointerEvents: "none",
        }} />

        {/* Sweep shine */}
        <div style={{
          position: "absolute", top: 0, bottom: 0, width: "40%",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)",
          animation: "tav-sweep 6s ease infinite",
          pointerEvents: "none",
        }} />

        {/* Bottom info */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "linear-gradient(transparent, rgba(0,0,0,0.97))",
          padding: "36px 16px 18px",
        }}>
          <p style={{
            fontFamily: "var(--font-mono)", fontSize: 9, color: r.color,
            textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 6,
          }}>
            {r.label} · #{player.number}
          </p>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: 24, fontWeight: 800,
            color: "white", textTransform: "uppercase", letterSpacing: "0.02em",
            lineHeight: 1,
          }}>
            {player.last}
          </p>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: 12, color: "rgba(255,255,255,0.5)",
            textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 3,
          }}>
            {player.first}
          </p>
          <p style={{
            fontFamily: "var(--font-mono)", fontSize: 8, color: "rgba(255,255,255,0.25)",
            textTransform: "uppercase", letterSpacing: "0.14em", marginTop: 8,
          }}>
            {player.role} · Tavolara Calcio
          </p>
        </div>

        {/* Rarity badge */}
        <div style={{
          position: "absolute", top: 12, left: 12,
          background: r.color, borderRadius: 6, padding: "4px 10px",
        }}>
          <p style={{
            fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700,
            color: "#000", letterSpacing: "0.08em",
          }}>
            {r.label.toUpperCase()}
          </p>
        </div>

        {/* Island emblem */}
        <div style={{ position: "absolute", top: 12, right: 12, width: 30, height: 24, opacity: 0.9 }}>
          <IslandSvg color={r.color} />
        </div>

        {/* Duplicate badge */}
        {count > 1 && (
          <div style={{
            position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.7)", borderRadius: 8, padding: "3px 12px",
            border: `1px solid ${r.color}`,
          }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: r.color }}>×{count}</p>
          </div>
        )}

        {/* Stars for leggendaria */}
        {isLeg && [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <div key={i} style={{
            position: "absolute",
            width: 3, height: 3, borderRadius: "50%",
            background: "white",
            left: `${8 + (i * 8.5) % 84}%`,
            top: `${5 + (i * 7) % 65}%`,
            animation: `tav-pulse-glow ${1.2 + (i % 5) * 0.4}s ease-in-out infinite`,
            animationDelay: `${i * 0.18}s`,
            pointerEvents: "none",
            boxShadow: "0 0 4px rgba(200,200,255,0.8)",
          }} />
        ))}
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: "fixed", top: "calc(env(safe-area-inset-top) + 16px)", right: 16,
          width: 40, height: 40, borderRadius: "50%",
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.15)",
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
