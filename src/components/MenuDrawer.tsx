"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Level = "main" | "squadre";

const MAIN_ITEMS = [
  { label: "HOME", href: "/" },
  { label: "NEWS", href: "/news" },
  { label: "PARTITE", href: "/partite" },
  { label: "SHOP", href: "/shop" },
  { label: "TAV COLLECTION", href: "/collection" },
];

const SQUADRE_ITEMS = [
  { label: "PRIMA SQUADRA", href: "/rosa" },
  { label: "JUNIORES", href: "/juniores" },
];

export default function MenuDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [level, setLevel] = useState<Level>("main");
  const pathname = usePathname();

  useEffect(() => {
    if (!open) setTimeout(() => setLevel("main"), 350);
  }, [open]);

  const close = () => onClose();

  return (
    <div
      className="fixed inset-0 z-40 bg-nero overflow-hidden"
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
          <img src="/logo-tavolara-gold.png" alt="Tavolara" className="h-8 object-contain"
            style={{ filter: "brightness(0) invert(1)" }} />
        </Link>
        <div className="w-8" />
      </div>

      {/* ── MENU PRINCIPALE ── */}
      <div
        className="absolute inset-x-0 bottom-0"
        style={{
          top: "72px",
          transform: level === "main" ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.28s ease",
        }}
      >
        <nav className="px-8 pt-10">
          {MAIN_ITEMS.slice(0, 2).map((item) => (
            <Link key={item.label} href={item.href} onClick={close}
              className="block py-2 font-body font-extrabold text-4xl uppercase text-white leading-none">
              {item.label}
            </Link>
          ))}

          {/* SQUADRE — con freccia */}
          <button
            onClick={() => setLevel("squadre")}
            className="w-full flex items-center justify-between py-2"
          >
            <span className="font-body font-extrabold text-4xl uppercase text-white leading-none">SQUADRE</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
              className="w-7 h-7 opacity-80 shrink-0 ml-3">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {MAIN_ITEMS.slice(2).map((item) => (
            <Link key={item.label} href={item.href} onClick={close}
              className="block py-2 font-body font-extrabold text-4xl uppercase text-white leading-none">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* ── SUBMENU SQUADRE ── */}
      <div
        className="absolute inset-x-0 bottom-0"
        style={{
          top: "72px",
          transform: level === "squadre" ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.28s ease",
        }}
      >
        <div className="px-8 pt-10">
          {/* Back + titolo sezione in oro */}
          <button onClick={() => setLevel("main")} className="flex items-center gap-2 mb-8">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
              className="w-6 h-6 text-oro shrink-0">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            <span className="font-body font-extrabold text-4xl uppercase text-oro leading-none">SQUADRE</span>
          </button>

          <nav>
            {SQUADRE_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.label} href={item.href} onClick={close}
                  className={`block py-2 font-body font-extrabold text-4xl uppercase leading-none transition-colors ${
                    isActive ? "text-oro" : "text-white"
                  }`}>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
