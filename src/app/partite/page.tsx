import type { Metadata } from "next";
import { CountdownWidget } from "./CountdownWidget";
import { PartiteTabs } from "./PartiteTabs";

export const metadata: Metadata = { title: "Partite" };

const NEXT_MATCH = {
  home: "Tavolara",
  away: "Da definire",
  datetime: null as string | null, // es. "2026-09-13T16:00:00" quando confermata
  date: "Da definire",
  venue: "Da definire",
  competition: "Prima Categoria",
};

function TavLogo({ size = 22 }: { size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo-tavolara-gold.png"
      alt=""
      aria-hidden
      style={{ width: size, height: size, objectFit: "contain", flexShrink: 0 }}
    />
  );
}

export default function PartitePage() {
  return (
    <div className="min-h-[100svh] pb-28" style={{ backgroundColor: "var(--color-nero)" }}>

      {/* ── PROSSIMA PARTITA HERO ── */}
      <div
        className="relative overflow-hidden flex flex-col"
        style={{
          minHeight: "calc(100svh - 80px)",
          background: "linear-gradient(160deg, #080600 0%, #181000 45%, #0c0900 100%)",
        }}
      >
        {/* Gold radial glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 90% 65% at 50% 52%, rgba(201,168,106,0.10) 0%, transparent 68%)" }} />
        {/* Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.038]"
          style={{
            backgroundImage: "linear-gradient(rgba(201,168,106,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,106,1) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }} />
        {/* Top gold bar */}
        <div className="h-[3px] shrink-0" style={{ backgroundColor: "var(--color-oro)" }} />

        {/* Header */}
        <div className="relative px-6 pt-20 pb-2">
          <p className="font-mono text-[9px] uppercase tracking-[0.28em]" style={{ color: "var(--color-oro)" }}>
            Stagione 2026/27
          </p>
          <h1 className="font-body font-extrabold text-[2rem] uppercase text-white leading-none mt-1">
            Partite
          </h1>
        </div>

        {/* Main hero content */}
        <div className="relative flex-1 flex flex-col items-center justify-center px-6 pb-8 text-center">

          {/* Competition badge */}
          <div className="mb-10 px-5 py-2 rounded-full font-mono text-[9px] uppercase tracking-[0.24em]"
            style={{ border: "1px solid rgba(201,168,106,0.3)", color: "var(--color-oro)", background: "rgba(201,168,106,0.07)" }}>
            Prossima · {NEXT_MATCH.competition}
          </div>

          {/* Teams */}
          <div className="w-full flex items-center justify-between gap-2 mb-2">
            {/* Home */}
            <div className="flex-1 flex flex-col items-center gap-3">
              {NEXT_MATCH.home === "Tavolara" && <TavLogo size={64} />}
              <p className="font-body font-extrabold text-[1.25rem] uppercase text-white leading-none">
                {NEXT_MATCH.home}
              </p>
            </div>
            {/* VS */}
            <div className="shrink-0 px-2">
              <p className="font-mono text-[22px] font-bold" style={{ color: "rgba(255,255,255,0.10)", letterSpacing: "0.12em" }}>VS</p>
            </div>
            {/* Away */}
            <div className="flex-1 flex flex-col items-center gap-3">
              {NEXT_MATCH.away === "Tavolara" && <TavLogo size={64} />}
              <p className="font-body font-extrabold text-[1.25rem] uppercase leading-none" style={{ color: "rgba(255,255,255,0.42)" }}>
                {NEXT_MATCH.away}
              </p>
            </div>
          </div>

          {/* Countdown */}
          <CountdownWidget datetime={NEXT_MATCH.datetime} />

          {/* Date + Venue bar */}
          <div className="w-full flex items-center justify-between px-5 py-4 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="text-left">
              <p className="font-mono text-[8px] uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.28)" }}>Data</p>
              <p className="font-body font-extrabold text-[0.85rem] uppercase text-white">{NEXT_MATCH.date}</p>
            </div>
            <div className="w-px h-8 mx-4" style={{ background: "rgba(255,255,255,0.08)" }} />
            <div className="text-right">
              <p className="font-mono text-[8px] uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.28)" }}>Luogo</p>
              <p className="font-body font-extrabold text-[0.85rem] uppercase text-white">{NEXT_MATCH.venue}</p>
            </div>
          </div>

        </div>

        {/* Scroll hint */}
        <div className="relative flex flex-col items-center pb-5 gap-1">
          <p className="font-mono text-[8px] uppercase tracking-[0.22em]" style={{ color: "rgba(255,255,255,0.2)" }}>
            Scorri per i risultati
          </p>
          <svg width="12" height="7" viewBox="0 0 12 7" fill="none" style={{ opacity: 0.25 }}>
            <path d="M1 1l5 5 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* ── TAB: PARTITE / CLASSIFICA / MARCATORI ── */}
      <PartiteTabs />

    </div>
  );
}
