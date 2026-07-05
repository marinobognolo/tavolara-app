"use client";

import { useState } from "react";
import Link from "next/link";

type View = "landing" | "hub";

type Game = {
  id: string;
  title: string;
  subtitle: string;
  href?: string;
  comingSoon?: boolean;
};

const GAMES: Game[] = [
  // I giochi verranno aggiunti qui
];

export default function GamePage() {
  const [view, setView] = useState<View>("landing");
  return view === "landing"
    ? <LandingView onPlay={() => setView("hub")} />
    : <HubView onBack={() => setView("landing")} />;
}

// ─── LANDING ─────────────────────────────────────────────────
function LandingView({ onPlay }: { onPlay: () => void }) {
  return (
    <div
      className="min-h-[100svh] relative flex flex-col"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 5rem)" }}
    >
      {/* BG gradient */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(145deg, #0d0b08 0%, #1c1000 55%, #0d0b08 100%)" }}
      />
      {/* Grid pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(201,168,106,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,106,0.07) 1px, transparent 1px)",
          backgroundSize: "38px 38px",
        }}
      />
      {/* Gold radial glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% 65%, rgba(201,168,106,0.1) 0%, transparent 70%)",
        }}
      />

      {/* Content — pushed to bottom */}
      <div className="relative flex-1 flex flex-col justify-end px-6 pb-6" style={{ paddingTop: "calc(env(safe-area-inset-top) + 80px)" }}>
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.22em] mb-4" style={{ color: "var(--color-oro)" }}>
          Tavolara Calcio
        </p>
        <h1
          className="font-body font-extrabold uppercase text-white leading-[1.02] mb-8"
          style={{ fontSize: "2.3rem" }}
        >
          METTITI ALLA PROVA
          <br />
          CON{" "}
          <span style={{ color: "var(--color-oro)" }}>TAV GAME</span>
        </h1>
        <button
          onClick={onPlay}
          className="self-start px-9 py-3.5 rounded-full font-body font-extrabold text-[0.82rem] uppercase tracking-wider text-white"
          style={{ backgroundColor: "#ef4444" }}
        >
          GIOCA ORA
        </button>
      </div>
    </div>
  );
}

// ─── HUB ─────────────────────────────────────────────────────
function HubView({ onBack }: { onBack: () => void }) {
  return (
    <div
      className="min-h-[100svh] overflow-y-auto"
      style={{ backgroundColor: "var(--color-nero)", paddingBottom: "calc(env(safe-area-inset-bottom) + 5rem)" }}
    >
      {/* Custom topbar con back */}
      <div
        className="fixed top-0 left-0 right-0 z-20 flex items-center px-5"
        style={{
          paddingTop: "calc(env(safe-area-inset-top) + 12px)",
          paddingBottom: "12px",
          backgroundColor: "rgba(13,10,8,0.92)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <button onClick={onBack} className="p-1 text-white mr-4" aria-label="Indietro">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-tavolara-gold.png"
          alt="Tavolara"
          className="h-9 object-contain"
          style={{ filter: "brightness(0) invert(1)" }}
        />
      </div>

      {/* Welcome hero */}
      <div
        className="relative flex flex-col items-center justify-center text-center px-8"
        style={{
          paddingTop: "calc(env(safe-area-inset-top) + 90px)",
          paddingBottom: "3.5rem",
          minHeight: "62svh",
          background: "linear-gradient(180deg, #0e0820 0%, #100c1a 60%, var(--color-nero) 100%)",
        }}
      >
        {/* Purple/blue gaming glow */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 90% 60% at 50% 35%, rgba(90,20,200,0.22) 0%, transparent 65%), radial-gradient(ellipse 50% 40% at 15% 55%, rgba(10,50,180,0.18) 0%, transparent 55%)",
          }}
        />
        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(201,168,106,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,106,1) 1px, transparent 1px)",
            backgroundSize: "38px 38px",
          }}
        />

        <div className="relative">
          <p className="font-body font-extrabold text-[1.1rem] uppercase tracking-[0.18em] text-white/60 mb-2">
            Welcome to
          </p>
          <h1
            className="font-body font-extrabold uppercase leading-none mb-4"
            style={{ fontSize: "2.1rem", color: "var(--color-oro)" }}
          >
            TAVOLARA GAME
          </h1>
          <p className="font-body font-extrabold text-[0.95rem] uppercase text-white leading-snug mb-3">
            PORTA LA TUA ABILITÀ ONLINE
          </p>
          <p
            className="font-mono text-[0.6rem] uppercase leading-relaxed mb-9"
            style={{ color: "rgba(255,255,255,0.58)" }}
          >
            INSERISCI IL TUO CODICE LOGIN E METTITI<br />
            ALLA PROVA CON TUTTE LE SFIDE!
          </p>
          <Link
            href="/login"
            className="inline-block px-10 py-3.5 font-body font-extrabold text-[0.82rem] uppercase tracking-wider text-white"
            style={{ border: "2px solid white" }}
          >
            ACCEDI
          </Link>
        </div>
      </div>

      {/* Game cards */}
      <div className="px-4 pt-6 space-y-4">
        <p className="font-mono text-[0.58rem] uppercase tracking-widest px-1" style={{ color: "rgba(255,255,255,0.32)" }}>
          Le sfide
        </p>

        {GAMES.length === 0 ? (
          <div
            className="rounded-3xl flex flex-col items-center justify-center py-20"
            style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <p className="font-body font-extrabold text-[1rem] uppercase" style={{ color: "rgba(255,255,255,0.15)" }}>
              Giochi in arrivo
            </p>
            <p className="font-mono text-[0.55rem] uppercase mt-1" style={{ color: "rgba(255,255,255,0.1)" }}>
              Torna presto!
            </p>
          </div>
        ) : (
          GAMES.map((game) => <GameCard key={game.id} game={game} />)
        )}
      </div>
    </div>
  );
}

// ─── GAME CARD ────────────────────────────────────────────────
function GameCard({ game }: { game: Game }) {
  return (
    <div
      className="rounded-3xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #160830 0%, #081830 100%)",
        border: "1px solid rgba(201,168,106,0.18)",
      }}
    >
      {/* Preview area */}
      <div
        className="h-44 flex items-center justify-center relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(90,20,200,0.28) 0%, rgba(10,50,180,0.28) 100%)",
        }}
      >
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Play icon */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "rgba(201,168,106,0.12)", border: "1px solid rgba(201,168,106,0.35)" }}
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 ml-1">
            <polygon points="5 3 19 12 5 21 5 3" fill="var(--color-oro)" fillOpacity="0.75" />
          </svg>
        </div>
      </div>

      <div className="px-5 py-4">
        <p className="font-body font-extrabold text-[1.15rem] uppercase text-white leading-tight">
          {game.title}
        </p>
        <p className="font-mono text-[0.58rem] uppercase mt-0.5" style={{ color: "var(--color-oro)" }}>
          {game.subtitle}
        </p>

        <div className="mt-4">
          {game.comingSoon ? (
            <div
              className="py-3 text-center font-body font-extrabold text-[0.72rem] uppercase"
              style={{ color: "rgba(255,255,255,0.25)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              Prossimamente
            </div>
          ) : game.href ? (
            <Link
              href={game.href}
              className="block py-3 text-center font-body font-extrabold text-[0.75rem] uppercase tracking-wider text-white"
              style={{ border: "2px solid white" }}
            >
              GIOCA ORA
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
