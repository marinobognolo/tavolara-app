"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { PLAYERS, Player } from "@/lib/data";

type RoleTab = "Portieri" | "Difensori" | "Centrocampisti" | "Attaccanti";

const TABS: RoleTab[] = ["Portieri", "Difensori", "Centrocampisti", "Attaccanti"];

const ROLE_MAP: Record<RoleTab, Player["role"]> = {
  Portieri: "Portiere",
  Difensori: "Difensore",
  Centrocampisti: "Centrocampista",
  Attaccanti: "Attaccante",
};

const GOLD_FILTER = "brightness(0) invert(1) sepia(1) saturate(3) hue-rotate(345deg) brightness(0.88)";

function PlayerCard({ player }: { player: Player }) {
  return (
    <div className="bg-carbon rounded-2xl overflow-hidden">
      <div className="flex gap-3 p-4" style={{ minHeight: "116px" }}>
        {/* Foto */}
        <div className="w-[68px] shrink-0 rounded-xl overflow-hidden bg-white/5 self-stretch">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/giocatori/${player.slug}/01.jpg`}
            alt={`${player.first} ${player.last}`}
            className="w-full h-full object-cover object-top"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col justify-between">
          {/* Nome */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/50 leading-none mb-0.5">
              {player.first}
              {player.captain && <span className="ml-1.5" style={{ color: "var(--color-oro)" }}>(C)</span>}
              {player.viceCaptain && <span className="ml-1.5" style={{ color: "var(--color-oro)" }}>(VC)</span>}
            </p>
            <p className="font-body font-extrabold text-[1.05rem] uppercase text-white leading-tight">
              {player.last}
            </p>
          </div>

          {/* Numero + Maglia */}
          <div className="flex items-end justify-between">
            <p className="font-body font-extrabold text-[2.5rem] text-white leading-none">
              {player.number}
            </p>
            <button
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: "var(--color-oro)" }}
              aria-label="Maglia"
            >
              <svg viewBox="0 0 24 24" fill="var(--color-nero)" className="w-4 h-4">
                <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 001.23.77L6 9.5V19a2 2 0 002 2h8a2 2 0 002-2V9.5l1.91.53a1 1 0 001.23-.77l.58-3.57a2 2 0 00-1.34-2.23z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CarouselList({ players }: { players: Player[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activePage, setActivePage] = useState(0);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const firstChild = el.children[0] as HTMLElement | null;
    if (!firstChild) return;
    const pageW = firstChild.offsetWidth + 12;
    setActivePage(Math.round(el.scrollLeft / pageW));
  }, []);

  const pages: Player[][] = [];
  for (let i = 0; i < players.length; i += 3) {
    pages.push(players.slice(i, i + 3));
  }

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="flex gap-3 pl-4 overflow-x-auto"
      style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
    >
      {pages.map((group, gi) => {
        const dist = Math.abs(gi - activePage);
        return (
          <div
            key={gi}
            className="flex flex-col gap-3 shrink-0 transition-opacity duration-300"
            style={{
              width: "calc(84vw - 8px)",
              scrollSnapAlign: "start",
              opacity: dist === 0 ? 1 : dist === 1 ? 0.35 : 0.15,
              paddingRight: gi === pages.length - 1 ? "16px" : "0",
            } as React.CSSProperties}
          >
            {group.map(p => <PlayerCard key={p.slug} player={p} />)}
          </div>
        );
      })}
    </div>
  );
}

export default function RosaPage() {
  const [activeTab, setActiveTab] = useState<RoleTab>("Portieri");
  const [showTeamPicker, setShowTeamPicker] = useState(false);

  const players = PLAYERS.filter(p => p.role === ROLE_MAP[activeTab]);

  return (
    <div className="min-h-[100svh] bg-nero pb-32" onClick={() => showTeamPicker && setShowTeamPicker(false)}>
      {/* Header */}
      <div className="px-4 pt-24 pb-5 flex items-end justify-between">
        <h1 className="text-[2.75rem] text-white leading-none">
          SQUADRE
        </h1>

        {/* Team picker */}
        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setShowTeamPicker(v => !v); }}
            className="flex items-center gap-1 rounded-full px-3 py-1.5"
            style={{ border: "1px solid rgba(201,168,106,0.45)" }}
          >
            <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: "var(--color-oro)" }}>
              PRIMA SQUADRA
            </span>
            <svg
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
              strokeLinecap="round" strokeLinejoin="round"
              className="w-3 h-3 shrink-0 transition-transform"
              style={{ color: "var(--color-oro)", transform: showTeamPicker ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          {showTeamPicker && (
            <div
              className="absolute right-0 top-full mt-2 rounded-xl overflow-hidden z-20"
              style={{ backgroundColor: "#1e1c18", border: "1px solid rgba(255,255,255,0.08)", minWidth: "160px" }}
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setShowTeamPicker(false)}
                className="block w-full text-left px-4 py-3 font-mono text-[11px] uppercase tracking-widest text-white border-b"
                style={{ borderColor: "rgba(255,255,255,0.06)" }}
              >
                Prima Squadra
              </button>
              <Link
                href="/juniores"
                onClick={() => setShowTeamPicker(false)}
                className="block px-4 py-3 font-mono text-[11px] uppercase tracking-widest text-white/60"
              >
                Juniores
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Tab bar */}
      <div
        className="flex overflow-x-auto mb-5"
        style={{ scrollbarWidth: "none", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="shrink-0 px-4 pt-1 pb-3 relative font-mono text-[11px] uppercase tracking-widest transition-colors"
            style={{ color: activeTab === tab ? "white" : "rgba(255,255,255,0.3)" }}
          >
            {tab}
            {activeTab === tab && (
              <span
                className="absolute bottom-0 left-0 right-0 h-[2px] rounded-t-full"
                style={{ backgroundColor: "var(--color-oro)" }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Giocatori */}
      {activeTab === "Portieri" ? (
        <div className="flex flex-col gap-3 px-4">
          {players.map(p => <PlayerCard key={p.slug} player={p} />)}
        </div>
      ) : (
        <CarouselList players={players} />
      )}

      {/* Sponsor */}
      <div className="flex flex-col gap-3 px-4 pt-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-sardares-gold.png" alt="Sardares" className="w-full h-auto object-contain" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-sponsor-3-gold.png" alt="Nexum STP" className="w-full h-auto object-contain" />
      </div>
    </div>
  );
}
