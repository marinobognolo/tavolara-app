"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Level = "main" | "squadre" | "club";

const SQUADRE_ITEMS = [
  { label: "PRIMA SQUADRA", href: "/rosa" },
  { label: "JUNIORES", href: "/juniores" },
];

const CLUB_ITEMS = [
  { label: "CHI SIAMO", href: "/club" },
  { label: "LOGO", href: "/logo" },
  { label: "ORGANIGRAMMA", href: "/organigramma" },
  { label: "PALMARES", href: "/palmares" },
  { label: "CONTATTI", href: "/contatti" },
];

const chevronRight = (
  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
    className="w-6 h-6 opacity-80 shrink-0 ml-3">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

const itemCls = "block py-2 font-body font-extrabold text-4xl uppercase text-white leading-none";

export default function MenuDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [level, setLevel] = useState<Level>("main");
  const pathname = usePathname();

  useEffect(() => {
    if (!open) setTimeout(() => setLevel("main"), 350);
  }, [open]);

  const close = () => onClose();

  const SubBack = ({ to, label }: { to: Level; label: string }) => (
    <button onClick={() => setLevel(to)} className="flex items-center gap-2 mb-8">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
        className="w-6 h-6 text-oro shrink-0">
        <path d="M15 18l-6-6 6-6" />
      </svg>
      <span className="font-body font-extrabold text-4xl uppercase text-oro leading-none">{label}</span>
    </button>
  );

  const slide = (target: Level) => ({
    transform: level === target ? "translateX(0)" : level === "main" ? "translateX(100%)" : "translateX(-100%)",
    transition: "transform 0.28s ease",
  });

  return (
    <div
      className="fixed inset-0 z-[60] bg-nero overflow-hidden"
      style={{
        transform: open ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.32s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-6"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 14px)", paddingBottom: "14px" }}
      >
        <button onClick={close} className="p-1 text-white" aria-label="Chiudi">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" className="w-6 h-6">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
        <Link href="/" onClick={close}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-tavolara-gold.png" alt="Tavolara" className="h-12 object-contain"
            style={{ filter: "brightness(0) invert(1)" }} />
        </Link>
        <div className="w-8" />
      </div>

      {/* ── MENU PRINCIPALE ── */}
      <div className="absolute inset-x-0 overflow-y-auto" style={{ top: "72px", bottom: "185px", ...slide("main") }}>
        <nav className="px-8 pt-8 pb-6">
          <Link href="/" onClick={close} className={itemCls}>HOME</Link>
          <Link href="/news" onClick={close} className={itemCls}>NEWS</Link>

          <button onClick={() => setLevel("squadre")} className="w-full flex items-center justify-between py-2">
            <span className={itemCls.replace("block ", "")}>SQUADRE</span>
            {chevronRight}
          </button>

          <Link href="/partite" onClick={close} className={itemCls}>PARTITE</Link>

          <button onClick={() => setLevel("club")} className="w-full flex items-center justify-between py-2">
            <span className={itemCls.replace("block ", "")}>CLUB</span>
            {chevronRight}
          </button>

          <Link href="/shop" onClick={close} className={itemCls}>SHOP</Link>
          <Link href="/sponsor" onClick={close} className={itemCls}>SPONSOR</Link>
          <Link href="/collection" onClick={close} className={itemCls}>TAV COLLECTION</Link>
          <Link href="/game" onClick={close} className={itemCls}>TAV GAME</Link>
        </nav>
      </div>

      {/* Sponsor logos — fissi in basso a sinistra */}
      <div
        className="absolute bottom-0 left-0 right-0 px-8 flex flex-col gap-3"
        style={{
          paddingBottom: "calc(env(safe-area-inset-bottom) + 1.25rem)",
          paddingTop: "0.75rem",
          pointerEvents: "none",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-sardares-gold.png" alt="Sardares" className="w-full h-auto object-contain" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-sponsor-3-gold.png" alt="Nexum STP" className="w-full h-auto object-contain" />
      </div>

      {/* ── SUBMENU SQUADRE ── */}
      <div className="absolute inset-x-0 bottom-0" style={{ top: "72px", ...slide("squadre") }}>
        <div className="px-8 pt-8">
          <SubBack to="main" label="SQUADRE" />
          <nav>
            {SQUADRE_ITEMS.map((item) => (
              <Link key={item.label} href={item.href} onClick={close}
                className={`block py-2 font-body font-extrabold text-4xl uppercase leading-none transition-colors ${
                  "text-white"
                }`}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* ── SUBMENU CLUB ── */}
      <div className="absolute inset-x-0 bottom-0" style={{ top: "72px", ...slide("club") }}>
        <div className="px-8 pt-8">
          <SubBack to="main" label="CLUB" />
          <nav>
            {CLUB_ITEMS.map((item) => (
              <Link key={item.label} href={item.href} onClick={close}
                className={`block py-2 font-body font-extrabold text-4xl uppercase leading-none transition-colors ${
                  "text-white"
                }`}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
