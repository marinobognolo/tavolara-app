"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { NEWS } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import { haptic } from "@/lib/haptic";

const LATEST = NEWS[0];

const MATCH = {
  competition: "Seconda Categoria — Giornata 28",
  venue: "GeoVillage — Olbia",
  home: "TAVOLARA",
  away: "FC BIASI",
  status: "FULL TIME",
  score: { h: 5, a: 1 },
  scorers: {
    h: ["2′ VANNOZZI", "9′ BULLA", "15′ RAIMO", "20′ ZELA", "54′ BARBUIO"],
    a: ["75′ ALOI"],
  },
};

type MatchEvent = {
  type: "schedule" | "kickoff" | "goal" | "halftime" | "sub" | "fulltime";
  min: string;
  text?: string;
  note?: string;
  player?: string;
  playerIn?: string;
  playerOut?: string;
  score?: string;
  team?: "h" | "a";
};

const EVENTS: MatchEvent[] = [
  { type: "schedule", min: "15:25", text: "Riscaldamento",   note: "Le squadre entrano in campo per iniziare il riscaldamento." },
  { type: "schedule", min: "15:55", text: "Squadre in campo",note: "Le squadre entrano in campo." },
  { type: "kickoff",  min: "16:00", text: "Fischio d'inizio",note: "Fischio d'inizio al Geovillage." },
  { type: "goal",     min: "2′",    player: "VANNOZZI", score: "1-0", team: "h", note: "Vantaggio immediato del Tavolara." },
  { type: "goal",     min: "9′",    player: "BULLA",    score: "2-0", team: "h", note: "Con una azione personale Giovanni Bulla porta avanti di due reti il Tavolara che sente sempre più suo il campionato." },
  { type: "goal",     min: "15′",   player: "RAIMO",    score: "3-0", team: "h", note: "Tavolara cala il tris!" },
  { type: "goal",     min: "20′",   player: "ZELA",     score: "4-0", team: "h", note: "Zela cala il poker per il Tavolara. C'è già aria di festa." },
  { type: "halftime", min: "45′",   text: "Intervallo",  note: "Fine primo tempo. Tavolara in vantaggio 4-0." },
  { type: "sub",      min: "46′",   playerIn: "BARBUIO",   playerOut: "BULLA",     team: "h" },
  { type: "sub",      min: "46′",   playerIn: "MANCINI",   playerOut: "GALLO",     team: "h" },
  { type: "goal",     min: "54′",   player: "BARBUIO",  score: "5-0", team: "h", note: "Barbuio appena entrato sigla la quinta rete del Tavolara." },
  { type: "sub",      min: "60′",   playerIn: "BALLATORE", playerOut: "RAIMO",    team: "h" },
  { type: "sub",      min: "68′",   playerIn: "CUGINI",    playerOut: "VANNOZZI", team: "h" },
  { type: "sub",      min: "70′",   playerIn: "SPIGNO",    playerOut: "VARRUCCIU",team: "h" },
  { type: "goal",     min: "75′",   player: "ALOI",     score: "5-1", team: "a", note: "Gol della bandiera per il FC Biasi." },
  { type: "fulltime", min: "90′",   text: "TAVOLARA CAMPIONE!", note: "Fine partita! Il Tavolara Calcio vince ufficialmente il campionato di seconda categoria, girone H da imbattuta." },
];

function EventCard({ ev }: { ev: MatchEvent }) {
  const isGoalH    = ev.type === "goal" && ev.team === "h";
  const isSubH     = ev.type === "sub"  && ev.team === "h";
  const isFulltime = ev.type === "fulltime";
  const isNeutral  = ev.type === "schedule" || ev.type === "kickoff" || ev.type === "halftime";
  const dark = isGoalH || isFulltime;

  const cardBg = dark
    ? "var(--color-oro)"
    : isSubH
    ? "rgba(201,168,106,0.14)"
    : isNeutral
    ? "rgba(255,255,255,0.11)"
    : "rgba(255,255,255,0.08)";

  const cardBorder = dark ? "none"
    : isSubH    ? "1px solid rgba(201,168,106,0.3)"
    : isNeutral ? "1px solid rgba(255,255,255,0.28)"
    : "1px solid rgba(255,255,255,0.1)";

  const minColor  = dark ? "rgba(20,17,12,0.55)" : isSubH ? "var(--color-oro)" : isNeutral ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.35)";
  const sepColor  = dark ? "rgba(20,17,12,0.2)" : isNeutral ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.12)";
  const iconColor = dark ? "var(--color-nero)" : isSubH ? "var(--color-oro)" : isNeutral ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.6)";

  return (
    <div
      className="shrink-0 rounded-2xl flex items-stretch overflow-hidden"
      style={{ width: "200px", height: "80px", backgroundColor: cardBg, border: cardBorder, flexShrink: 0 }}
    >
      {/* Minuto */}
      <div className="flex items-center justify-center px-3" style={{ minWidth: "50px" }}>
        <span className="font-mono text-[0.78rem] font-bold leading-none" style={{ color: minColor }}>
          {ev.min}
        </span>
      </div>

      {/* Separatore verticale */}
      <div className="w-px self-stretch my-3" style={{ backgroundColor: sepColor }} />

      {/* Icona */}
      <div className="flex items-center justify-center px-2.5" style={{ minWidth: "40px" }}>
        {ev.type === "goal" && (
          <svg viewBox="0 0 20 20" fill="none" className="w-7 h-7">
            <circle cx="10" cy="10" r="8.5" stroke={iconColor} strokeWidth="1.1"/>
            <path d="M10 3L12 7H16.5L13 9.5L14.2 14.5L10 12L5.8 14.5L7 9.5L3.5 7H8L10 3Z" fill={iconColor} fillOpacity="0.85"/>
          </svg>
        )}
        {ev.type === "sub" && (
          <svg viewBox="0 0 20 20" fill="none" className="w-6 h-6">
            <path d="M4 7.5L7 4.5L10 7.5M7 4.5V13.5" stroke={iconColor} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 12.5L13 15.5L10 12.5M13 15.5V6.5" stroke={iconColor} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
        {(ev.type === "schedule" || ev.type === "halftime") && (
          <svg viewBox="0 0 20 20" fill="none" className="w-6 h-6">
            <circle cx="10" cy="10" r="8" stroke={iconColor} strokeWidth="1.2"/>
            <path d="M10 6.5V10L12.5 12.5" stroke={iconColor} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
        {ev.type === "kickoff" && (
          <svg viewBox="0 0 20 20" fill="none" className="w-6 h-6">
            <circle cx="10" cy="10" r="8" stroke={iconColor} strokeWidth="1.2"/>
            <circle cx="10" cy="10" r="2.5" fill={iconColor} fillOpacity="0.65"/>
            <path d="M2 10H18M10 2V18" stroke={iconColor} strokeWidth="0.8" strokeDasharray="1.5 1.5"/>
          </svg>
        )}
        {ev.type === "fulltime" && (
          <svg viewBox="0 0 20 20" fill="none" className="w-6 h-6">
            <path d="M5 4H15V11Q15 16 10 16Q5 16 5 11Z" stroke={iconColor} strokeWidth="1.2"/>
            <path d="M5 6Q2 6 2 9Q2 12 5 12" stroke={iconColor} strokeWidth="1.2"/>
            <path d="M15 6Q18 6 18 9Q18 12 15 12" stroke={iconColor} strokeWidth="1.2"/>
            <path d="M10 16V18M7.5 18H12.5" stroke={iconColor} strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        )}
      </div>

      {/* Separatore verticale 2 */}
      <div className="w-px self-stretch my-3" style={{ backgroundColor: sepColor }} />

      {/* Testo evento */}
      <div className="flex flex-col justify-center gap-0.5 flex-1 px-3">
        {ev.type === "goal" && (
          <>
            <span className="font-body font-extrabold text-[0.72rem] uppercase leading-none" style={{ color: dark ? "var(--color-nero)" : "white" }}>
              {ev.player}
            </span>
            <span className="font-mono text-[0.6rem] font-bold" style={{ color: dark ? "rgba(20,17,12,0.55)" : "rgba(255,255,255,0.45)" }}>
              {ev.score}
            </span>
          </>
        )}
        {ev.type === "sub" && (
          <>
            <span className="font-mono text-[0.58rem] font-bold uppercase leading-none" style={{ color: isSubH ? "var(--color-oro)" : "rgba(255,255,255,0.7)" }}>
              ↑ {ev.playerIn}
            </span>
            <span className="font-mono text-[0.58rem] uppercase leading-none" style={{ color: "rgba(255,255,255,0.35)" }}>
              ↓ {ev.playerOut}
            </span>
          </>
        )}
        {(ev.type === "schedule" || ev.type === "kickoff" || ev.type === "halftime") && (
          <span className="font-mono text-[0.58rem] uppercase leading-tight" style={{ color: "rgba(255,255,255,0.72)" }}>
            {ev.text}
          </span>
        )}
        {ev.type === "fulltime" && (
          <>
            <span className="font-body font-extrabold text-[0.72rem] uppercase leading-none" style={{ color: "var(--color-nero)" }}>
              FINE PARTITA
            </span>
            <span className="font-mono text-[0.6rem] font-bold" style={{ color: "rgba(20,17,12,0.55)" }}>
              TAVOLARA 5-1
            </span>
          </>
        )}
      </div>
    </div>
  );
}

const GALLERY_MATCH = "Tavolara 5–1 FC Biasi";
const GALLERY_PHOTOS = [
  "/giocatori/gallo/01.jpg",
  "/giocatori/bulla/01.jpg",
  "/giocatori/van-der-want/01.jpg",
  "/giocatori/mannoni/01.jpg",
  "/giocatori/varrucciu/01.jpg",
  "/giocatori/casu/01.jpg",
  "/giocatori/gallo/01.jpg",
  "/giocatori/bulla/01.jpg",
  "/giocatori/van-der-want/01.jpg",
  "/giocatori/mannoni/01.jpg",
  "/giocatori/varrucciu/01.jpg",
  "/giocatori/casu/01.jpg",
];

// ─── SLIDE 1: Ultima news ────────────────────────────────────
function SlideNews() {
  return (
    <div className="relative w-full h-full bg-nero">
      {LATEST?.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={LATEST.image} alt="" className="absolute inset-0 w-full h-full object-cover object-top" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-nero" />
      <div
        className="absolute inset-x-0 bottom-0 px-5"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 4.5rem)" }}
      >
        <p className="font-body font-bold text-[0.68rem] uppercase tracking-widest text-white/60 mb-2">News</p>
        <Link href={`/news/${LATEST?.slug}`}>
          <h2 className="text-[1.5rem] text-white leading-tight mb-4">
            {LATEST?.category && <span className="text-oro">{LATEST.category.toUpperCase()} | </span>}
            {LATEST?.title?.toUpperCase()}
          </h2>
        </Link>
        <Link href="/news" className="flex flex-col items-center gap-1 mt-8">
          <span className="font-body font-bold text-[0.68rem] uppercase tracking-widest text-white/50">Tutte le news</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-white/30">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

// ─── SLIDE 2: Kit Home 26/27 ─────────────────────────────────
function SlideKit() {
  return (
    <div className="relative w-full h-full bg-nero flex flex-col items-center justify-center px-6">
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ backgroundColor: "var(--color-oro)" }} />
      <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] mb-2" style={{ color: "var(--color-oro)" }}>
        Stagione 2026/27
      </p>
      <h2 className="text-[1.75rem] text-white text-center mb-10 leading-tight">
        KIT HOME<br />26/27
      </h2>
      <div className="w-44 h-60 rounded-2xl bg-carbon border border-white/10 flex items-center justify-center">
        <div className="text-center px-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-tavolara-gold.png"
            alt="Tavolara"
            className="h-14 w-auto mx-auto mb-4 object-contain"
            style={{ filter: "brightness(0) invert(1) sepia(1) saturate(3) hue-rotate(345deg) brightness(0.88)" }}
          />
          <p className="font-mono text-[0.55rem] uppercase tracking-widest text-white/40">Prossimamente</p>
        </div>
      </div>
      <Link
        href="/shop"
        className="mt-8 px-8 py-3 rounded-full font-body font-extrabold text-[0.75rem] uppercase tracking-wider"
        style={{ backgroundColor: "var(--color-oro)", color: "var(--color-nero)" }}
      >
        Scopri il Kit
      </Link>
    </div>
  );
}

// ─── SLIDE 3: Photo Gallery ──────────────────────────────────
function SlideGallery({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="relative w-full h-full bg-nero">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/giocatori/gallo/01.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-top"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-nero/90 via-nero/30 to-black/50" />
      <div
        className="absolute inset-x-0 bottom-0 px-5 flex flex-col items-center"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 4.5rem)" }}
      >
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] mb-1.5" style={{ color: "var(--color-oro)" }}>
          Photo Gallery
        </p>
        <p className="font-body font-extrabold text-[1.25rem] uppercase text-white text-center mb-1">
          {GALLERY_MATCH}
        </p>
        <button onClick={onOpen} className="flex flex-col items-center gap-1 mt-6">
          <span className="font-body font-bold text-[0.68rem] uppercase tracking-widest text-white/60">
            Tutte le foto
          </span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-white/40">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── CRONACA MODAL ───────────────────────────────────────────
function CronacaModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[70] bg-nero overflow-y-auto">
      <div
        className="sticky top-0 z-10 backdrop-blur-sm px-5 flex items-center justify-between border-b border-white/10"
        style={{ backgroundColor: "rgba(20,17,12,0.96)", paddingTop: "calc(env(safe-area-inset-top) + 14px)", paddingBottom: "14px" }}
      >
        <button onClick={onClose} className="p-1 text-white" aria-label="Indietro">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="text-center">
          <p className="font-body font-extrabold text-[0.82rem] uppercase text-white">Cronaca</p>
          <p className="font-mono text-[0.55rem] mt-0.5" style={{ color: "var(--color-oro)" }}>
            {MATCH.home} {MATCH.score.h}–{MATCH.score.a} {MATCH.away}
          </p>
        </div>
        <div className="w-8" />
      </div>

      <div className="px-4 py-4 pb-16 space-y-2">
        {EVENTS.map((ev, i) => {
          const isGoalH    = ev.type === "goal" && ev.team === "h";
          const isFulltime = ev.type === "fulltime";
          const isKey      = isGoalH || isFulltime;

          return (
            <div
              key={i}
              className="flex items-start gap-3 rounded-2xl px-4 py-3"
              style={{
                backgroundColor: isKey ? "rgba(201,168,106,0.1)" : "rgba(255,255,255,0.04)",
                border: isKey ? "1px solid rgba(201,168,106,0.2)" : "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {/* Minuto */}
              <span
                className="font-mono text-[0.62rem] font-bold shrink-0 w-10 text-right pt-0.5"
                style={{ color: isKey ? "var(--color-oro)" : "rgba(255,255,255,0.28)" }}
              >
                {ev.min}
              </span>

              {/* Icona piccola */}
              <div className="shrink-0 pt-0.5" style={{ width: "16px" }}>
                {ev.type === "goal" && (
                  <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                    <circle cx="8" cy="8" r="6.5" stroke={isGoalH ? "var(--color-oro)" : "rgba(255,255,255,0.4)"} strokeWidth="1"/>
                    <path d="M8 2.5L9.3 5.5H12.5L10 7.2L10.8 10.5L8 9L5.2 10.5L6 7.2L3.5 5.5H6.7L8 2.5Z" fill={isGoalH ? "var(--color-oro)" : "rgba(255,255,255,0.4)"} fillOpacity="0.85"/>
                  </svg>
                )}
                {ev.type === "sub" && (
                  <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                    <path d="M3 6L5.5 3.5L8 6M5.5 3.5V11" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M13 10L10.5 12.5L8 10M10.5 12.5V5" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
                {(ev.type === "schedule" || ev.type === "halftime") && (
                  <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                    <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
                    <path d="M8 5V8L10 10" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                )}
                {ev.type === "kickoff" && (
                  <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                    <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
                    <circle cx="8" cy="8" r="2" fill="rgba(255,255,255,0.3)"/>
                  </svg>
                )}
                {ev.type === "fulltime" && (
                  <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                    <path d="M4 3H12V8Q12 13 8 13Q4 13 4 8Z" stroke="var(--color-oro)" strokeWidth="1"/>
                    <path d="M4 5Q2 5 2 7.5Q2 10 4 10" stroke="var(--color-oro)" strokeWidth="1"/>
                    <path d="M12 5Q14 5 14 7.5Q14 10 12 10" stroke="var(--color-oro)" strokeWidth="1"/>
                  </svg>
                )}
              </div>

              {/* Testo */}
              <div className="flex-1 min-w-0">
                {ev.type === "goal" && (
                  <>
                    <p className="font-body font-extrabold text-[0.78rem] uppercase leading-tight"
                      style={{ color: isGoalH ? "var(--color-oro)" : "white" }}>
                      {ev.player}
                      <span className="ml-2 font-mono text-[0.62rem] font-normal" style={{ color: isGoalH ? "rgba(201,168,106,0.7)" : "rgba(255,255,255,0.4)" }}>
                        {ev.score}
                      </span>
                    </p>
                    {ev.note && <p className="font-mono text-[0.58rem] mt-0.5 text-white/75 uppercase">{ev.note}</p>}
                  </>
                )}
                {ev.type === "sub" && (
                  <>
                    <p className="font-mono text-[0.62rem] text-white/70">↑ {ev.playerIn}</p>
                    <p className="font-mono text-[0.58rem] text-white/35">↓ {ev.playerOut}</p>
                  </>
                )}
                {(ev.type === "schedule" || ev.type === "kickoff" || ev.type === "halftime") && (
                  <p className="font-mono text-[0.62rem] text-white/80 leading-snug uppercase">{ev.note || ev.text}</p>
                )}
                {ev.type === "fulltime" && (
                  <>
                    <p className="font-body font-extrabold text-[0.78rem] uppercase leading-tight" style={{ color: "var(--color-oro)" }}>
                      Fine Partita
                    </p>
                    <p className="font-mono text-[0.58rem] mt-0.5 text-white/80 uppercase">{ev.note}</p>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── SLIDE 4: Match result (stile Juve) ─────────────────────
function SlideMatch({ onHighlights }: { onHighlights: () => void }) {
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setTimeout(() => {
      if (timelineRef.current) timelineRef.current.scrollLeft = timelineRef.current.scrollWidth;
    }, 300);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="relative w-full h-full bg-nero overflow-hidden">
      {/* Player BG */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/tavolara-biasi.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-top opacity-50"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-nero via-nero/75 to-nero/55" />

      <div
        className="relative flex flex-col h-full px-5"
        style={{
          paddingTop: "calc(env(safe-area-inset-top) + 80px)",
          paddingBottom: "calc(env(safe-area-inset-bottom) + 4.5rem)",
        }}
      >
        {/* Competition + venue */}
        <div className="text-center mb-5">
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-white/75">{MATCH.competition}</p>
          <p className="font-mono text-[0.58rem] uppercase tracking-[0.1em] text-white/75 mt-0.5">{MATCH.venue}</p>
        </div>

        {/* Teams row */}
        <div className="flex items-center gap-3 mb-1">
          {/* Tavolara logo */}
          <div className="w-16 h-16 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-tavolara-color.png"
              alt="Tavolara"
              className="w-full h-full object-contain"
            />
          </div>
          {/* Team names */}
          <div className="flex-1 text-center">
            <h2 className="text-[1.7rem] text-white leading-[1.05] font-extrabold tracking-tight">
              {MATCH.home}<br />{MATCH.away}
            </h2>
          </div>
          {/* Away logo */}
          <div className="w-16 h-16 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-biasi.png"
              alt="FC Biasi"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* FULL TIME */}
        <p className="font-body font-extrabold text-[0.7rem] uppercase tracking-[0.15em] text-center mb-3" style={{ color: "#ef4444" }}>
          {MATCH.status}
        </p>

        {/* Scorers */}
        <div className="flex gap-4 mb-1 px-1">
          <div className="flex-1 space-y-px">
            {MATCH.scorers.h.map((s, i) => (
              <p key={i} className="font-mono text-[0.62rem] text-white/65">{s}</p>
            ))}
          </div>
          <div className="flex-1 space-y-px text-right">
            {MATCH.scorers.a.map((s, i) => (
              <p key={i} className="font-mono text-[0.62rem] text-white/65">{s}</p>
            ))}
          </div>
        </div>

        {/* Score */}
        <p
          className="font-body font-extrabold text-white text-center leading-none my-2"
          style={{ fontSize: "4.25rem" }}
        >
          {MATCH.score.h} – {MATCH.score.a}
        </p>

        {/* Buttons */}
        <div className="flex gap-3 mt-3">
          <button
            className="flex-1 py-3 rounded-full font-body font-extrabold text-[0.72rem] uppercase tracking-wider text-white"
            style={{ backgroundColor: "#ef4444" }}
          >
            Match Center
          </button>
          <button
            className="flex-1 py-3 rounded-full font-body font-extrabold text-[0.72rem] uppercase tracking-wider"
            style={{ backgroundColor: "var(--color-oro)", color: "var(--color-nero)" }}
            onClick={onHighlights}
          >
            Highlights
          </button>
        </div>

        {/* Timeline orizzontale eventi */}
        <div
          ref={timelineRef}
          className="flex gap-2 overflow-x-auto mt-4 -mx-5 px-5"
          style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
        >
          {EVENTS.map((ev, i) => <EventCard key={i} ev={ev} />)}
          <div className="shrink-0 w-2" />
        </div>

        {/* Tutte le partite */}
        <Link href="/partite" className="flex flex-col items-center gap-1 mt-auto pt-4">
          <span className="font-body font-bold text-[0.68rem] uppercase tracking-widest text-white/50">
            Tutte le partite
          </span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-white/30">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </Link>
      </div>

    </div>
  );
}

// ─── GALLERY MODAL ───────────────────────────────────────────
function GalleryModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[70] bg-nero overflow-y-auto">
      <div
        className="sticky top-0 z-10 bg-nero/95 backdrop-blur-sm px-5 flex items-center justify-between border-b border-white/10"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 14px)", paddingBottom: "14px" }}
      >
        <button onClick={onClose} className="p-1 text-white" aria-label="Chiudi">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" className="w-6 h-6">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
        <p className="font-body font-extrabold text-[0.82rem] uppercase text-white">{GALLERY_MATCH}</p>
        <div className="w-8" />
      </div>
      <div className="grid grid-cols-2 gap-1 p-1 pb-10">
        {GALLERY_PHOTOS.map((src, i) => (
          <div key={i} className="aspect-square rounded-lg overflow-hidden bg-white/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SLIDE 5: TAV GAME teaser ────────────────────────────────
function SlideGame() {
  return (
    <div className="relative w-full h-full overflow-hidden" style={{ backgroundColor: "#0d0b08" }}>
      {/* Grid pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(201,168,106,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,106,0.07) 1px, transparent 1px)",
          backgroundSize: "38px 38px",
        }}
      />
      {/* Purple gaming glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 40%, rgba(90,20,200,0.18) 0%, transparent 65%), radial-gradient(ellipse 80% 55% at 50% 70%, rgba(201,168,106,0.08) 0%, transparent 70%)",
        }}
      />
      {/* Content */}
      <div
        className="relative flex flex-col justify-end h-full px-6"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 4.5rem)" }}
      >
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.22em] mb-3" style={{ color: "var(--color-oro)" }}>
          Tavolara Calcio
        </p>
        <h2
          className="font-body font-extrabold uppercase text-white leading-[1.02] mb-6"
          style={{ fontSize: "2.1rem" }}
        >
          METTITI ALLA PROVA
          <br />
          CON{" "}
          <span style={{ color: "var(--color-oro)" }}>TAV GAME</span>
        </h2>
        <Link
          href="/game"
          className="self-start px-9 py-3.5 rounded-full font-body font-extrabold text-[0.82rem] uppercase tracking-wider text-white"
          style={{ backgroundColor: "#ef4444" }}
        >
          GIOCA ORA
        </Link>
      </div>
    </div>
  );
}

// ─── SLIDE 6: Fan Wall ──────────────────────────────────────
type FanPost = { id: number; nickname: string; reaction: string; message: string | null; created_at: string };
const REACTIONS = ["🔥", "❤️", "💪", "🏆", "⚡"];

function SlideFanWall() {
  const [posts, setPosts] = useState<FanPost[]>([]);
  const [reaction, setReaction] = useState("🔥");
  const [msg, setMsg] = useState("");
  const [name, setName] = useState(() => { try { return localStorage.getItem("tav-fan-name") || ""; } catch { return ""; } });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data } = await supabase.from("fan_wall").select("*").order("created_at", { ascending: false }).limit(5);
      if (data) setPosts(data as FanPost[]);
    } catch { setError(true); }
  }, []);

  useEffect(() => { load(); const t = setInterval(load, 12000); return () => clearInterval(t); }, [load]);

  const send = async () => {
    if (sending) return;
    haptic("medium");
    setSending(true);
    const nick = name.trim() || "Tifoso";
    try { localStorage.setItem("tav-fan-name", nick); } catch {}
    try {
      await supabase.from("fan_wall").insert({ nickname: nick, reaction, message: msg.trim().slice(0, 100) || null });
      setMsg("");
      await load();
    } catch { setError(true); }
    setSending(false);
  };

  return (
    <div className="relative w-full h-full" style={{ backgroundColor: "#0c0a07" }}>
      {/* Grid bg */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.05, backgroundImage: "linear-gradient(rgba(201,168,106,1) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,106,1) 1px,transparent 1px)", backgroundSize: "38px 38px" }} />
      {/* Gold glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 40% at 50% 20%, rgba(201,168,106,0.07) 0%, transparent 65%)" }} />

      <div className="relative flex flex-col h-full px-5" style={{ paddingTop: "calc(env(safe-area-inset-top) + 68px)", paddingBottom: "calc(env(safe-area-inset-bottom) + 5rem)" }}>
        <p className="font-mono text-[0.58rem] uppercase tracking-[0.22em] mb-1" style={{ color: "var(--color-oro)" }}>Tifosi</p>
        <h2 className="font-body font-extrabold text-[1.7rem] uppercase text-white mb-3 leading-none">FAN WALL</h2>

        {/* Messaggi */}
        <div className="flex-1 flex flex-col gap-2 overflow-hidden mb-3" onTouchStart={e => e.stopPropagation()} onTouchEnd={e => e.stopPropagation()}>
          {error && <p className="font-mono text-[0.58rem] text-white/30 uppercase text-center py-4">Configura Supabase su Vercel per attivare il Fan Wall</p>}
          {!error && posts.length === 0 && <p className="font-mono text-[0.6rem] text-white/30 uppercase text-center py-6">Sii il primo tifoso a scrivere!</p>}
          {posts.map((p, i) => (
            <div key={p.id} className={`flex items-start gap-2.5 rounded-2xl px-3 py-2.5 card-in card-in-${i + 1}`} style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <span className="text-[1.25rem] leading-none mt-0.5">{p.reaction}</span>
              <div className="flex-1 min-w-0">
                <span className="font-mono text-[0.58rem] uppercase tracking-wide" style={{ color: "var(--color-oro)" }}>{p.nickname}</span>
                {p.message && <p className="font-mono text-[0.65rem] text-white/80 mt-0.5 leading-snug">{p.message}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Reaction picker */}
        <div className="flex gap-2 mb-2" onTouchStart={e => e.stopPropagation()} onTouchEnd={e => e.stopPropagation()}>
          {REACTIONS.map(r => (
            <button key={r} onClick={() => { haptic(); setReaction(r); }}
              className="text-[1.2rem] w-9 h-9 rounded-full flex items-center justify-center transition-all duration-150"
              style={{ backgroundColor: reaction === r ? "rgba(201,168,106,0.22)" : "rgba(255,255,255,0.07)", border: reaction === r ? "1px solid rgba(201,168,106,0.5)" : "1px solid transparent", transform: reaction === r ? "scale(1.15)" : "scale(1)" }}>
              {r}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="flex flex-col gap-2" onTouchStart={e => e.stopPropagation()} onTouchEnd={e => e.stopPropagation()}>
          <div className="flex gap-2">
            <input value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Scrivi un messaggio..." maxLength={100}
              className="flex-1 rounded-xl px-3 py-2 font-mono text-[0.68rem] text-white placeholder-white/25 focus:outline-none"
              style={{ backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }} />
            <button onClick={send} disabled={sending}
              className="px-4 py-2 rounded-xl font-body font-extrabold text-[0.72rem] uppercase tracking-wide transition-opacity"
              style={{ backgroundColor: "var(--color-oro)", color: "var(--color-nero)", opacity: sending ? 0.55 : 1 }}>
              {sending ? "…" : "Invia"}
            </button>
          </div>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Il tuo nome (facoltativo)"
            className="w-full rounded-xl px-3 py-2 font-mono text-[0.62rem] text-white/70 placeholder-white/20 focus:outline-none"
            style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }} />
        </div>
      </div>
    </div>
  );
}

// ─── HOME ────────────────────────────────────────────────────
const SLIDES = ["news", "kit", "gallery", "match", "game", "fanwall"] as const;

export default function Home() {
  const [active, setActive] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [cronacaOpen, setCronacaOpen] = useState(false);
  const touchX = useRef(0);
  const touchY = useRef(0);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
    touchY.current = e.touches[0].clientY;
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const dx = e.changedTouches[0].clientX - touchX.current;
      const dy = e.changedTouches[0].clientY - touchY.current;
      if (Math.abs(dx) < 40 || Math.abs(dy) > Math.abs(dx) * 0.8) return;
      if (dx < 0 && active < SLIDES.length - 1) setActive((a) => a + 1);
      if (dx > 0 && active > 0) setActive((a) => a - 1);
    },
    [active]
  );

  return (
    <>
      <div
        className="fixed inset-0 z-10 overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Slides container */}
        <div
          className="flex h-full"
          style={{
            width: `${SLIDES.length * 100}vw`,
            transform: `translateX(-${active * 100}vw)`,
            transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <div style={{ width: "100vw" }} className="h-full shrink-0"><SlideNews /></div>
          <div style={{ width: "100vw" }} className="h-full shrink-0"><SlideKit /></div>
          <div style={{ width: "100vw" }} className="h-full shrink-0">
            <SlideGallery onOpen={() => setGalleryOpen(true)} />
          </div>
          <div style={{ width: "100vw" }} className="h-full shrink-0"><SlideMatch onHighlights={() => setCronacaOpen(true)} /></div>
          <div style={{ width: "100vw" }} className="h-full shrink-0"><SlideGame /></div>
          <div style={{ width: "100vw" }} className="h-full shrink-0"><SlideFanWall /></div>
        </div>

        {/* Dot indicators */}
        <div
          className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 z-20"
          style={{ bottom: "calc(env(safe-area-inset-bottom) + 1.25rem)" }}
        >
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => { haptic(); setActive(i); }}
              className="h-[2px] rounded-full transition-all duration-300"
              style={{
                width: i === active ? "22px" : "10px",
                backgroundColor: i === active ? "white" : "rgba(255,255,255,0.28)",
              }}
            />
          ))}
        </div>
      </div>

      {galleryOpen && <GalleryModal onClose={() => setGalleryOpen(false)} />}
      {cronacaOpen && <CronacaModal onClose={() => setCronacaOpen(false)} />}
    </>
  );
}
