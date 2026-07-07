"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { PLAYERS, type Player } from "@/lib/data";
import {
  RARITIES, RARITY_ORDER, PACKS_PER_DAY,
  cardId, openPack, loadState, saveState,
  type RarityKey, type CollectionState,
} from "@/lib/collection";
import { CollectibleCard } from "./CollectibleCard";
import { haptic } from "@/lib/haptic";
import { useAuth } from "@/lib/auth-context";

type Tab = "pack" | "album" | "premi";
type AlbumView = "rarity" | "player";

interface RevealedCard {
  player: Player;
  rarity: RarityKey;
  flipped: boolean;
}

function fmtCountdown(ms: number): string {
  if (ms <= 0) return "00:00:00";
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

/* ── Physical Pack ────────────────────────────────────── */
const PACK_W = 250;
const PACK_H = 350;
const PACK_PHOTOS = ["/BUSTINA%201.jpg", "/BUSTINA%202.jpg", "/BUSTINA%203.jpg"];
const LOCKED_PHOTO = "/BUSTINA%204.jpg";

function PhysicalPack({
  available,
  locked = false,
  isBonus = false,
  isOpening = false,
  photo = PACK_PHOTOS[0],
  dimmed = false,
}: {
  available: boolean;
  locked?: boolean;
  isBonus?: boolean;
  isOpening?: boolean;
  photo?: string;
  dimmed?: boolean;
}) {
  const borderAlpha = locked ? 0.18 : available ? 0.88 : 0.28;
  const borderColor = locked
    ? `rgba(255,255,255,${borderAlpha})`
    : `rgba(201,168,106,${borderAlpha})`;
  const overlay = locked ? "rgba(0,0,0,0.72)" : available ? "rgba(0,0,0,0.1)" : "rgba(0,0,0,0.52)";
  const glow = !dimmed && available && !locked
    ? ", 0 0 48px rgba(201,168,106,0.16), 0 20px 64px rgba(0,0,0,0.7)"
    : ", 0 8px 32px rgba(0,0,0,0.45)";

  return (
    <div style={{
      width: PACK_W, height: PACK_H, position: "relative", flexShrink: 0,
      borderRadius: 14, overflow: "hidden",
      boxShadow: `inset 0 0 0 2px ${borderColor}${glow}`,
      opacity: dimmed ? 0.38 : 1,
      transform: dimmed ? "scale(0.92)" : "scale(1)",
      transition: isOpening ? "none" : "opacity 0.3s, transform 0.3s",
      animation: isOpening ? "tav-pack-burst 0.55s cubic-bezier(0.4,0,0.2,1) forwards" : "none",
    }}>

      {/* Photo — clipped naturally by overflow:hidden + border-radius */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photo} alt="" aria-hidden
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 25%" }}
      />

      {/* Dark overlay */}
      <div style={{ position: "absolute", inset: 0, background: overlay }} />

      {/* Top header strip */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 38,
        background: "linear-gradient(180deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.38) 100%)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 14px", zIndex: 2,
      }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: "rgba(201,168,106,0.88)", letterSpacing: "0.22em", textTransform: "uppercase" }}>TAVOLARA</span>
        <div style={{ display: "flex", gap: 4 }}>
          {[0,1,2,3,4].map(i => <div key={i} style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(201,168,106,0.38)" }} />)}
        </div>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: "rgba(201,168,106,0.88)", letterSpacing: "0.22em", textTransform: "uppercase" }}>2025</span>
      </div>

      {/* Perforation tear line */}
      <div style={{
        position: "absolute", top: 38, left: 10, right: 10, height: 1, zIndex: 2,
        backgroundImage: "repeating-linear-gradient(90deg, rgba(201,168,106,0.45) 0px, rgba(201,168,106,0.45) 5px, transparent 5px, transparent 10px)",
      }} />

      {/* Center content */}
      <div style={{
        position: "absolute", top: 39, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: 10, zIndex: 2,
      }}>
        {locked ? (
          <>
            <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth={1.4} style={{ width: 36, height: 36 }}>
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeLinecap="round" />
            </svg>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "rgba(255,255,255,0.45)", margin: 0, letterSpacing: "0.16em", textTransform: "uppercase" }}>Login</p>
          </>
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-tavolara-gold.png" alt="" aria-hidden
              style={{ width: 52, height: 52, objectFit: "contain", opacity: available ? 0.92 : 0.3, filter: available ? "drop-shadow(0 0 14px rgba(201,168,106,0.55))" : "none" }}
            />
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: available ? "rgba(201,168,106,0.88)" : "rgba(255,255,255,0.22)", margin: 0, letterSpacing: "0.18em", textTransform: "uppercase" }}>
              {available ? "Tap" : "—"}
            </p>
          </>
        )}
      </div>

      {/* Bonus badge */}
      {isBonus && available && (
        <div style={{ position: "absolute", top: 48, right: 14, background: "var(--color-oro)", borderRadius: 4, padding: "2px 7px", zIndex: 5 }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: "#111", fontWeight: 700, margin: 0 }}>+1</p>
        </div>
      )}

      {/* Bottom gradient */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        background: "linear-gradient(transparent, rgba(0,0,0,0.78))",
        padding: "48px 14px 14px", zIndex: 2,
      }}>
        <p style={{
          fontFamily: "var(--font-mono)", fontSize: 7, textAlign: "center", margin: 0,
          color: available && !locked ? "rgba(201,168,106,0.58)" : "transparent",
          letterSpacing: "0.22em", textTransform: "uppercase",
        }}>Collection · 2025</p>
      </div>
    </div>
  );
}

/* ── Card back (during reveal) ───────────────────────── */
function CardBack() {
  return (
    <div style={{
      width: "100%", height: "100%",
      borderRadius: 8,
      background: "linear-gradient(155deg, #1a1200 0%, #0a0800 60%, #140e00 100%)",
      border: "1.5px solid rgba(201,168,106,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "absolute", inset: 0,
      backfaceVisibility: "hidden",
      WebkitBackfaceVisibility: "hidden",
    }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-tavolara-gold.png"
        alt=""
        aria-hidden
        style={{ width: 36, height: 36, objectFit: "contain", opacity: 0.7 }}
      />
    </div>
  );
}

/* ── Flipping reveal card ────────────────────────────── */
function RevealCard({
  card,
  index,
  onCardClick,
}: {
  card: RevealedCard;
  index: number;
  onCardClick: () => void;
}) {
  return (
    <div
      style={{ perspective: 600, width: 88, height: 123, flexShrink: 0, cursor: "pointer" }}
      onClick={card.flipped ? onCardClick : undefined}
    >
      <div style={{
        width: "100%", height: "100%",
        position: "relative",
        transformStyle: "preserve-3d",
        transform: card.flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        transition: "transform 0.65s cubic-bezier(0.4,0,0.2,1)",
      }}>
        <CardBack />
        <div style={{
          position: "absolute", inset: 0,
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
        }}>
          <CollectibleCard
            player={card.player}
            rarity={card.rarity}
            variant="mini"
          />
        </div>
      </div>
    </div>
  );
}

/* ── Pack Tab ────────────────────────────────────────── */
function PackTab({
  state,
  countdown,
  isLoggedIn,
  onOpen,
  onOpenBonus,
}: {
  state: CollectionState;
  countdown: string;
  isLoggedIn: boolean;
  onOpen: (cards: RevealedCard[]) => void;
  onOpenBonus: (cards: RevealedCard[]) => void;
}) {
  const [openingIdx, setOpeningIdx] = useState<number | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bonusAvailable = isLoggedIn && !state.bonusPackUsed;

  const handleCarouselScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCurrentIdx(Math.max(0, Math.min(Math.round(el.scrollLeft / (PACK_W + 16)), PACKS_PER_DAY)));
  }, []);

  const makeCards = useCallback((): RevealedCard[] =>
    openPack().map((rarity) => ({
      player: PLAYERS[Math.floor(Math.random() * PLAYERS.length)],
      rarity,
      flipped: false,
    })), []);

  const handlePackClick = useCallback((i: number) => {
    if (openingIdx !== null || i >= state.packsLeft) return;
    haptic();
    const cards = makeCards();
    setOpeningIdx(i);
    setTimeout(() => { setOpeningIdx(null); onOpen(cards); }, 700);
  }, [openingIdx, state.packsLeft, makeCards, onOpen]);

  const handleBonusClick = useCallback(() => {
    if (openingIdx !== null || !bonusAvailable) return;
    haptic();
    const cards = makeCards();
    setOpeningIdx(PACKS_PER_DAY);
    setTimeout(() => { setOpeningIdx(null); onOpenBonus(cards); }, 700);
  }, [openingIdx, bonusAvailable, makeCards, onOpenBonus]);

  return (
    <div>
      {/* Count */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <p style={{
          fontFamily: "var(--font-body)", fontSize: "3rem", fontWeight: 800,
          color: state.packsLeft > 0 ? "var(--color-oro)" : "rgba(255,255,255,0.2)",
          lineHeight: 1,
        }}>
          {state.packsLeft}
        </p>
        <p style={{
          fontFamily: "var(--font-mono)", fontSize: 9,
          textTransform: "uppercase", letterSpacing: "0.2em",
          color: "white", marginTop: 6,
        }}>
          {state.packsLeft === 1 ? "bustina disponibile" : "bustine disponibili"}
        </p>
        {state.packsLeft < PACKS_PER_DAY && (
          <p style={{
            fontFamily: "var(--font-mono)", fontSize: 10,
            color: "rgba(255,255,255,0.92)", marginTop: 10, letterSpacing: "0.1em",
          }}>
            Ricarica in <span style={{ color: "var(--color-oro)" }}>{countdown}</span>
          </p>
        )}
      </div>

      {/* Carousel */}
      <div style={{ position: "relative", margin: "0 -20px 8px" }}>
        <div
          ref={scrollRef}
          onScroll={handleCarouselScroll}
          className="tav-carousel"
          style={{
            display: "flex",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            gap: 16,
            paddingLeft: `calc(50vw - ${PACK_W / 2}px)`,
            paddingRight: `calc(50vw - ${PACK_W / 2}px)`,
            paddingTop: 10,
            paddingBottom: 10,
          }}
        >
          {Array.from({ length: PACKS_PER_DAY }).map((_, i) => (
            <button
              key={i}
              onClick={() => handlePackClick(i)}
              style={{
                background: "none", border: "none", padding: 0,
                scrollSnapAlign: "center", flexShrink: 0,
                cursor: i < state.packsLeft && openingIdx === null ? "pointer" : "default",
              }}
            >
              <PhysicalPack
                available={i < state.packsLeft}
                isOpening={openingIdx === i}
                photo={PACK_PHOTOS[i]}
                dimmed={currentIdx !== i}
              />
            </button>
          ))}
          <button
            onClick={bonusAvailable ? handleBonusClick : isLoggedIn ? undefined : () => { window.location.href = "/login"; }}
            style={{
              background: "none", border: "none", padding: 0,
              scrollSnapAlign: "center", flexShrink: 0,
              cursor: (bonusAvailable || !isLoggedIn) && openingIdx === null ? "pointer" : "default",
            }}
          >
            <PhysicalPack
              available={bonusAvailable}
              locked={!isLoggedIn}
              isBonus
              isOpening={openingIdx === PACKS_PER_DAY}
              photo={LOCKED_PHOTO}
              dimmed={currentIdx !== PACKS_PER_DAY}
            />
          </button>
        </div>
        {/* Side gradients */}
        <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 52, background: "linear-gradient(to right, var(--color-nero) 20%, transparent)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 52, background: "linear-gradient(to left, var(--color-nero) 20%, transparent)", pointerEvents: "none" }} />
      </div>

      {/* Dots */}
      <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 28 }}>
        {Array.from({ length: PACKS_PER_DAY + 1 }).map((_, i) => (
          <div key={i} style={{
            height: 5, borderRadius: 3,
            width: currentIdx === i ? 18 : 5,
            background: currentIdx === i ? "var(--color-oro)" : "rgba(255,255,255,0.28)",
            transition: "all 0.25s ease",
          }} />
        ))}
      </div>

      {/* CTA dinamica sul pacchetto corrente */}
      {(() => {
        const isBonus = currentIdx === PACKS_PER_DAY;
        const packOpen = !isBonus && currentIdx < state.packsLeft && openingIdx === null;
        const bonusOpen = isBonus && bonusAvailable && openingIdx === null;
        const ctaBase = {
          width: "100%", padding: "16px 0", borderRadius: 14, border: "none",
          fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 800,
          textTransform: "uppercase" as const, letterSpacing: "0.12em",
          color: "var(--color-nero)", cursor: "pointer" as const,
          background: "var(--color-oro)",
        };
        if (packOpen) return (
          <button onClick={() => handlePackClick(currentIdx)} style={ctaBase}>Apri bustina</button>
        );
        if (bonusOpen) return (
          <button onClick={handleBonusClick} style={ctaBase}>Apri bustina bonus</button>
        );
        if (isBonus && !isLoggedIn) return (
          <button onClick={() => { window.location.href = "/login"; }} style={{
            width: "100%", padding: "16px 0", borderRadius: 14,
            background: "rgba(201,168,106,0.08)", border: "1.5px solid rgba(201,168,106,0.35)",
            fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 800,
            textTransform: "uppercase", letterSpacing: "0.1em",
            color: "var(--color-oro)", cursor: "pointer",
          }}>Accedi per sbloccare</button>
        );
        return (
          <div style={{ padding: "16px 20px", borderRadius: 14, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em", color: "white" }}>
              {isBonus && isLoggedIn ? "Bonus già usata oggi" : "Bustine esaurite · Torni domani"}
            </p>
          </div>
        );
      })()}

      {/* Info */}
      <div style={{
        marginTop: 20, padding: "14px 16px", borderRadius: 12,
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.05)",
      }}>
        <p style={{
          fontFamily: "var(--font-mono)", fontSize: 8,
          textTransform: "uppercase", letterSpacing: "0.14em",
          color: "rgba(255,255,255,0.88)", lineHeight: 1.8,
        }}>
          3 bustine gratis ogni giorno · 3 carte per bustina<br />
          +1 bustina bonus per gli utenti registrati<br />
          Probabilità: C 45% · R 30% · SR 15% · UR 8% · L 2%
        </p>
      </div>
    </div>
  );
}

/* ── Reveal Modal ────────────────────────────────────── */
function RevealModal({
  cards,
  onDone,
  onCardClick,
}: {
  cards: RevealedCard[];
  onDone: () => void;
  onCardClick: (player: Player, rarity: RarityKey) => void;
}) {
  const allFlipped = cards.every((c) => c.flipped);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 50,
      background: "rgba(0,0,0,0.7)",
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "flex-end",
    }}>
      <div style={{
        width: "100%",
        background: "var(--color-carbon)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "20px 20px 0 0",
        padding: "28px 20px 40px",
        animation: "tav-card-in 0.35s cubic-bezier(0.4,0,0.2,1) both",
      }}>
        <p style={{
          fontFamily: "var(--font-mono)", fontSize: 10,
          textTransform: "uppercase", letterSpacing: "0.22em",
          color: "var(--color-oro)", textAlign: "center", marginBottom: 24,
        }}>
          Bustina aperta
        </p>

        <div style={{
          display: "flex", gap: 16, justifyContent: "center", marginBottom: 28,
        }}>
          {cards.map((card, i) => (
            <RevealCard
              key={i}
              card={card}
              index={i}
              onCardClick={() => onCardClick(card.player, card.rarity)}
            />
          ))}
        </div>

        {allFlipped && (
          <button
            onClick={onDone}
            style={{
              width: "100%", padding: "14px 0", borderRadius: 14,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 800,
              textTransform: "uppercase", letterSpacing: "0.12em",
              color: "white", cursor: "pointer",
              animation: "tav-card-in 0.3s ease both",
            }}
          >
            Continua
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Album Tab ───────────────────────────────────────── */
function AlbumTab({
  owned,
  view,
  onViewChange,
  onCardClick,
}: {
  owned: Record<string, number>;
  view: AlbumView;
  onViewChange: (v: AlbumView) => void;
  onCardClick: (player: Player, rarity: RarityKey) => void;
}) {
  const totalOwned = PLAYERS.reduce(
    (s, p) => s + RARITY_ORDER.filter((r) => (owned[cardId(p.slug, r)] || 0) > 0).length,
    0
  );
  const totalPossible = PLAYERS.length * RARITY_ORDER.length;

  return (
    <div>
      {/* View toggle */}
      <div style={{
        display: "flex", gap: 8, marginBottom: 24,
        padding: 4, borderRadius: 12,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}>
        {(["rarity", "player"] as AlbumView[]).map((v) => (
          <button
            key={v}
            onClick={() => { haptic(); onViewChange(v); }}
            style={{
              flex: 1, padding: "10px 0", borderRadius: 9,
              background: view === v ? "rgba(255,255,255,0.09)" : "none",
              border: "none",
              fontFamily: "var(--font-mono)", fontSize: 9,
              textTransform: "uppercase", letterSpacing: "0.14em",
              color: view === v ? "var(--color-oro)" : "rgba(255,255,255,0.7)",
              cursor: "pointer",
            }}
          >
            {v === "rarity" ? "Per rarità" : "Per giocatore"}
          </button>
        ))}
      </div>

      {/* Overall progress */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <p style={{
            fontFamily: "var(--font-mono)", fontSize: 9,
            textTransform: "uppercase", letterSpacing: "0.14em",
            color: "white",
          }}>Completamento album</p>
          <p style={{
            fontFamily: "var(--font-mono)", fontSize: 9,
            color: "var(--color-oro)", letterSpacing: "0.1em",
          }}>
            {totalOwned}/{totalPossible}
          </p>
        </div>
        <div style={{ height: 4, background: "rgba(255,255,255,0.07)", borderRadius: 2 }}>
          <div style={{
            height: "100%",
            width: `${(totalOwned / totalPossible) * 100}%`,
            background: "var(--color-oro)",
            borderRadius: 2,
            transition: "width 0.6s ease",
          }} />
        </div>
      </div>

      {/* Per rarità view */}
      {view === "rarity" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {RARITY_ORDER.map((rKey) => {
            const r = RARITIES[rKey];
            const ownedCount = PLAYERS.filter((p) => (owned[cardId(p.slug, rKey)] || 0) > 0).length;
            return (
              <div key={rKey}>
                {/* Section header */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: r.color, flexShrink: 0,
                    boxShadow: `0 0 8px ${r.glow}`,
                  }} />
                  <p style={{
                    fontFamily: "var(--font-mono)", fontSize: 10,
                    textTransform: "uppercase", letterSpacing: "0.18em",
                    color: r.color, flex: 1,
                  }}>
                    {r.label}
                  </p>
                  <p style={{
                    fontFamily: "var(--font-mono)", fontSize: 9,
                    color: "rgba(255,255,255,0.9)",
                  }}>
                    {ownedCount}/{PLAYERS.length}
                  </p>
                </div>
                {/* Progress bar */}
                <div style={{ height: 2, background: "rgba(255,255,255,0.06)", borderRadius: 1, marginBottom: 14 }}>
                  <div style={{
                    height: "100%",
                    width: `${(ownedCount / PLAYERS.length) * 100}%`,
                    background: r.color, borderRadius: 1,
                    boxShadow: `0 0 6px ${r.glow}`,
                  }} />
                </div>
                {/* Cards grid */}
                <div style={{
                  display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "flex-start",
                }}>
                  {PLAYERS.map((p) => {
                    const count = owned[cardId(p.slug, rKey)] || 0;
                    const isMissing = count === 0;
                    return (
                      <button
                        key={p.slug}
                        onClick={isMissing ? undefined : () => onCardClick(p, rKey)}
                        style={{ background: "none", border: "none", padding: 0, cursor: isMissing ? "default" : "pointer" }}
                      >
                        <CollectibleCard
                          player={p}
                          rarity={rKey}
                          count={count}
                          missing={isMissing}
                          variant="mini"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Per giocatore view */}
      {view === "player" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {PLAYERS.map((p, idx) => {
            const ownedRarities = RARITY_ORDER.filter((r) => (owned[cardId(p.slug, r)] || 0) > 0);
            return (
              <div
                key={p.slug}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "12px 0",
                  borderBottom: idx < PLAYERS.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                }}
              >
                {/* Number */}
                <div style={{
                  width: 28, height: 28, borderRadius: 6,
                  background: "rgba(255,255,255,0.05)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <p style={{
                    fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700,
                    color: "rgba(255,255,255,0.75)",
                  }}>
                    {p.number}
                  </p>
                </div>

                {/* Name */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 800,
                    textTransform: "uppercase", color: "white",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>
                    {p.last}
                  </p>
                  <p style={{
                    fontFamily: "var(--font-mono)", fontSize: 8,
                    color: "rgba(255,255,255,0.88)", textTransform: "uppercase",
                    letterSpacing: "0.08em", marginTop: 1,
                  }}>
                    {p.role}
                  </p>
                </div>

                {/* Rarity dots */}
                <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                  {RARITY_ORDER.map((rKey) => {
                    const r = RARITIES[rKey];
                    const has = (owned[cardId(p.slug, rKey)] || 0) > 0;
                    return (
                      <button
                        key={rKey}
                        onClick={has ? () => onCardClick(p, rKey) : undefined}
                        title={r.label}
                        style={{
                          width: 20, height: 20, borderRadius: 4,
                          background: has ? r.color : "rgba(255,255,255,0.05)",
                          border: has ? "none" : "1px solid rgba(255,255,255,0.08)",
                          cursor: has ? "pointer" : "default",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          padding: 0,
                          boxShadow: has ? `0 0 6px ${r.glow}` : "none",
                        }}
                      >
                        <p style={{
                          fontFamily: "var(--font-mono)", fontSize: 6, fontWeight: 700,
                          color: has ? "#000" : "rgba(255,255,255,0.4)",
                        }}>
                          {r.short}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Premi Tab ───────────────────────────────────────── */
function PremiTab({ owned }: { owned: Record<string, number> }) {
  const totalUnique = PLAYERS.reduce(
    (s, p) => s + RARITY_ORDER.filter((r) => (owned[cardId(p.slug, r)] || 0) > 0).length,
    0
  );
  const legCount = RARITY_ORDER.reduce(
    (s, _) =>
      s + PLAYERS.filter((p) => (owned[cardId(p.slug, "leggendaria")] || 0) > 0).length,
    0
  );
  const hasFullPlayer = PLAYERS.some(
    (p) => RARITY_ORDER.every((r) => (owned[cardId(p.slug, r)] || 0) > 0)
  );
  const totalPossible = PLAYERS.length * RARITY_ORDER.length;
  const albumComplete = totalUnique >= totalPossible;

  const ACHIEVEMENTS = [
    {
      id: "first-leg",
      title: "La prima Leggendaria",
      desc: "Trova la tua prima carta Leggendaria",
      reward: "Maglia ufficiale",
      done: legCount > 0,
      progress: `${Math.min(legCount, 1)}/1`,
    },
    {
      id: "full-player",
      title: "Giocatore completo",
      desc: "Possiedi tutte e 5 le rarità dello stesso giocatore",
      reward: "Sciarpa Tavolara",
      done: hasFullPlayer,
      progress: hasFullPlayer ? "1/1" : "0/1",
    },
    {
      id: "50-cards",
      title: "Collezionista",
      desc: "Colleziona 50 carte uniche",
      reward: "Ingresso Geovillage",
      done: totalUnique >= 50,
      progress: `${Math.min(totalUnique, 50)}/50`,
    },
    {
      id: "album",
      title: "Album completo",
      desc: "Tutte le 105 carte — tutte le rarità, tutti i giocatori",
      reward: "Premio speciale",
      done: albumComplete,
      progress: `${totalUnique}/${totalPossible}`,
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {ACHIEVEMENTS.map((a) => (
        <div
          key={a.id}
          style={{
            padding: "16px",
            borderRadius: 14,
            background: a.done ? "rgba(201,168,106,0.06)" : "rgba(255,255,255,0.02)",
            border: `1px solid ${a.done ? "rgba(201,168,106,0.3)" : "rgba(255,255,255,0.07)"}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            {/* Icon */}
            <div style={{
              width: 36, height: 36, borderRadius: 9, flexShrink: 0,
              background: a.done ? "rgba(201,168,106,0.15)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${a.done ? "rgba(201,168,106,0.4)" : "rgba(255,255,255,0.07)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {a.done ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--color-oro)" strokeWidth={2} style={{ width: 18, height: 18 }}>
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={1.5} style={{ width: 18, height: 18 }}>
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeLinecap="round" />
                </svg>
              )}
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 800,
                textTransform: "uppercase",
                color: a.done ? "var(--color-oro)" : "white",
              }}>
                {a.title}
              </p>
              <p style={{
                fontFamily: "var(--font-mono)", fontSize: 9,
                color: "rgba(255,255,255,0.92)", marginTop: 3,
                letterSpacing: "0.06em", lineHeight: 1.5,
              }}>
                {a.desc}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
                {/* Progress */}
                <p style={{
                  fontFamily: "var(--font-mono)", fontSize: 8,
                  color: a.done ? "var(--color-oro)" : "rgba(255,255,255,0.9)",
                  letterSpacing: "0.08em",
                }}>
                  {a.progress}
                </p>
                {/* Reward pill */}
                <div style={{
                  padding: "2px 8px", borderRadius: 4,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}>
                  <p style={{
                    fontFamily: "var(--font-mono)", fontSize: 7,
                    textTransform: "uppercase", letterSpacing: "0.1em",
                    color: "rgba(255,255,255,0.9)",
                  }}>
                    Premio: {a.reward}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Regolamento */}
      <div style={{
        marginTop: 8, padding: "14px 16px", borderRadius: 12,
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.05)",
      }}>
        <p style={{
          fontFamily: "var(--font-mono)", fontSize: 8,
          textTransform: "uppercase", letterSpacing: "0.14em",
          color: "rgba(255,255,255,0.88)", lineHeight: 1.9,
        }}>
          I premi sono fisici e verranno consegnati durante la stagione.<br />
          La raccolta è gratuita e riservata ai tifosi del Tavolara Calcio.<br />
          Per riscattare un premio contatta la società.
        </p>
      </div>
    </div>
  );
}

/* ── Main App ────────────────────────────────────────── */
export function CollectionApp() {
  const { gamer } = useAuth();
  const [state, setState] = useState<CollectionState | null>(null);
  const [tab, setTab] = useState<Tab>("pack");
  const [albumView, setAlbumView] = useState<AlbumView>("rarity");
  const [revealCards, setRevealCards] = useState<RevealedCard[] | null>(null);
  const [fullCard, setFullCard] = useState<{ player: Player; rarity: RarityKey; count: number } | null>(null);
  const [countdown, setCountdown] = useState("--:--:--");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Hydrate from localStorage
  useEffect(() => {
    setState(loadState());
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!state) return;
    const tick = () => {
      if (state.packsLeft >= PACKS_PER_DAY) {
        setCountdown("--:--:--");
        return;
      }
      const rem = state.refillAt - Date.now();
      if (rem <= 0) {
        setState(loadState());
      } else {
        setCountdown(fmtCountdown(rem));
      }
    };
    tick();
    timerRef.current = setInterval(tick, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [state]);

  const handleOpenPack = useCallback((cards: RevealedCard[]) => {
    setState((prev) => {
      if (!prev) return prev;
      const newOwned = { ...prev.owned };
      cards.forEach(({ player, rarity }) => {
        const id = cardId(player.slug, rarity);
        newOwned[id] = (newOwned[id] || 0) + 1;
      });
      const next: CollectionState = {
        ...prev,
        packsLeft: prev.packsLeft - 1,
        owned: newOwned,
      };
      saveState(next);
      return next;
    });

    setRevealCards(cards);
    // Flip cards with staggered delay
    cards.forEach((_, i) => {
      setTimeout(() => {
        setRevealCards((prev) =>
          prev ? prev.map((c, j) => (j === i ? { ...c, flipped: true } : c)) : null
        );
      }, 500 + i * 750);
    });
  }, []);

  const handleRevealDone = useCallback(() => {
    setRevealCards(null);
  }, []);

  const handleOpenBonus = useCallback((cards: RevealedCard[]) => {
    setState((prev) => {
      if (!prev) return prev;
      const newOwned = { ...prev.owned };
      cards.forEach(({ player, rarity }) => {
        const id = cardId(player.slug, rarity);
        newOwned[id] = (newOwned[id] || 0) + 1;
      });
      const next: CollectionState = { ...prev, bonusPackUsed: true, owned: newOwned };
      saveState(next);
      return next;
    });
    setRevealCards(cards);
    cards.forEach((_, i) => {
      setTimeout(() => {
        setRevealCards((prev) =>
          prev ? prev.map((c, j) => (j === i ? { ...c, flipped: true } : c)) : null
        );
      }, 500 + i * 750);
    });
  }, []);

  if (!state) return null;

  return (
    <div style={{ minHeight: "100svh", background: "var(--color-nero)", paddingBottom: 100 }}>
      {/* Header */}
      <div style={{
        padding: "calc(env(safe-area-inset-top) + 72px) 20px 20px",
        position: "relative",
        background: "linear-gradient(180deg, rgba(10,8,0,0.9) 0%, transparent 100%)",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(201,168,106,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,106,1) 1px, transparent 1px)",
          backgroundSize: "38px 38px",
          opacity: 0.028,
          pointerEvents: "none",
        }} />
        <p style={{
          fontFamily: "var(--font-mono)", fontSize: 10,
          textTransform: "uppercase", letterSpacing: "0.28em",
          color: "var(--color-oro)", marginBottom: 4, position: "relative",
        }}>
          Tavolara Calcio
        </p>
        <h1 style={{
          fontFamily: "var(--font-body)", fontWeight: 800,
          fontSize: "2.4rem", textTransform: "uppercase",
          color: "white", lineHeight: 1, position: "relative",
        }}>
          Collection
        </h1>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "0 20px",
      }}>
        {(["pack", "album", "premi"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => { haptic(); setTab(t); }}
            style={{
              flex: 1, padding: "14px 4px",
              fontFamily: "var(--font-mono)", fontSize: 9,
              textTransform: "uppercase", letterSpacing: "0.16em",
              color: tab === t ? "var(--color-oro)" : "rgba(255,255,255,0.65)",
              borderBottom: `2px solid ${tab === t ? "var(--color-oro)" : "transparent"}`,
              background: "none",
              cursor: "pointer",
              transition: "color 0.2s",
            }}
          >
            {t === "pack" ? "Bustine" : t === "album" ? "Album" : "Premi"}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ padding: "24px 20px" }}>
        {tab === "pack" && (
          <PackTab
            state={state}
            countdown={countdown}
            isLoggedIn={!!gamer}
            onOpen={handleOpenPack}
            onOpenBonus={handleOpenBonus}
          />
        )}
        {tab === "album" && (
          <AlbumTab
            owned={state.owned}
            view={albumView}
            onViewChange={setAlbumView}
            onCardClick={(player, rarity) =>
              setFullCard({ player, rarity, count: state.owned[cardId(player.slug, rarity)] || 1 })
            }
          />
        )}
        {tab === "premi" && <PremiTab owned={state.owned} />}
      </div>

      {/* Reveal bottom sheet */}
      {revealCards && (
        <RevealModal
          cards={revealCards}
          onDone={handleRevealDone}
          onCardClick={(player, rarity) => {
            handleRevealDone();
            setFullCard({ player, rarity, count: state.owned[cardId(player.slug, rarity)] || 1 });
          }}
        />
      )}

      {/* Full card overlay */}
      {fullCard && (
        <CollectibleCard
          player={fullCard.player}
          rarity={fullCard.rarity}
          count={fullCard.count}
          variant="full"
          onClose={() => setFullCard(null)}
        />
      )}
    </div>
  );
}
