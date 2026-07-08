"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import MenuDrawer from "./MenuDrawer";
import { haptic } from "@/lib/haptic";

// Tab principali → hamburger
const MAIN_TABS = ["/", "/partite", "/rosa", "/news", "/game"];
// Pagine auth → hamburger, niente logo né login icon, niente back
const AUTH_ROUTES = ["/login", "/register", "/change-pin"];

export default function TopNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isMain  = MAIN_TABS.includes(pathname);
  const isAuth  = AUTH_ROUTES.includes(pathname);
  const isGame  = pathname.startsWith("/game");
  const showBack = !isMain && !isAuth;
  const showLogo = !isGame && !isAuth;
  const showLoginIcon = !isGame && !isAuth;

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
        {/* Sinistra: back oppure hamburger */}
        {showBack ? (
          <button
            onClick={() => { haptic(); router.back(); }}
            className="p-1 -ml-1"
            aria-label="Torna indietro"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8}
              strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        ) : (
          <button
            onClick={() => { haptic(); setMenuOpen(true); }}
            className="flex flex-col gap-[5px] p-1"
            aria-label="Menu"
          >
            <span className="block w-6 h-[1.5px] bg-white" />
            <span className="block w-6 h-[1.5px] bg-white" />
            <span className="block w-4 h-[1.5px] bg-white" />
          </button>
        )}

        {/* Centro: logo */}
        {showLogo ? (
          <Link href="/" aria-label="Home" onClick={() => haptic()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-tavolara-gold.png"
              alt="Tavolara Calcio"
              className="h-12 object-contain"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </Link>
        ) : (
          <div />
        )}

        {/* Destra: login icon */}
        {showLoginIcon ? (
          <Link href="/login" aria-label="Login" onClick={() => haptic()}>
            <div className="w-8 h-8 rounded-full bg-white/15 border border-white/25 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.5} className="w-4 h-4">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </>
  );
}
