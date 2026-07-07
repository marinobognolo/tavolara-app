"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MenuDrawer from "./MenuDrawer";
import { haptic } from "@/lib/haptic";

export default function TopNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isGame = pathname.startsWith("/game");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
      <nav
        className="fixed top-0 inset-x-0 z-30 flex items-center justify-between px-5 transition-all duration-300"
        style={{
          paddingTop: "calc(env(safe-area-inset-top) + 14px)",
          paddingBottom: "14px",
          backgroundColor: scrolled ? "rgba(20,17,12,0.88)" : "transparent",
          backdropFilter: scrolled ? "blur(18px) saturate(1.5)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(18px) saturate(1.5)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "1px solid transparent",
        }}
      >
        {/* Hamburger */}
        <button
          onClick={() => { haptic(); setMenuOpen(true); }}
          className="flex flex-col gap-[5px] p-1"
          aria-label="Menu"
        >
          <span className="block w-6 h-[1.5px] bg-white" />
          <span className="block w-6 h-[1.5px] bg-white" />
          <span className="block w-4 h-[1.5px] bg-white" />
        </button>

        {/* Logo → home (nascosto nelle pagine game) */}
        {!isGame && (
          <Link href="/" aria-label="Home" onClick={() => haptic()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-tavolara-gold.png"
              alt="Tavolara Calcio"
              className="h-12 object-contain"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </Link>
        )}
        {isGame && <div />}

        {/* Login */}
        <Link href="/login" aria-label="Login" onClick={() => haptic()}>
          <div className="w-8 h-8 rounded-full bg-white/15 border border-white/25 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.5} className="w-4 h-4">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        </Link>
      </nav>
    </>
  );
}
