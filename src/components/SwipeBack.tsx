"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

const MAIN_TABS   = new Set(["/", "/partite", "/rosa", "/news", "/game"]);
const AUTH_ROUTES = new Set(["/login", "/register", "/change-pin"]);
const EDGE        = 22;   // px dal bordo sinistro per attivare
const TRIGGER     = 0.36; // frazione larghezza schermo per completare il back

export default function SwipeBack({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const ref      = useRef<HTMLDivElement>(null);

  // Stato gesto tutto in ref — nessun re-render durante il drag
  const g = useRef({ on: false, dir: false, sx: 0, sy: 0, cur: 0 });

  const canSwipe =
    !MAIN_TABS.has(pathname) &&
    !AUTH_ROUTES.has(pathname) &&
    !pathname.startsWith("/game");

  // Reset quando cambia la pagina (dopo la navigazione)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "";
    el.style.transform  = "";
    g.current = { on: false, dir: false, sx: 0, sy: 0, cur: 0 };
  }, [pathname]);

  useEffect(() => {
    if (!canSwipe) return;
    const el = ref.current;
    if (!el) return;

    const onStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t.clientX > EDGE) return;
      g.current = { on: true, dir: false, sx: t.clientX, sy: t.clientY, cur: 0 };
    };

    const onMove = (e: TouchEvent) => {
      if (!g.current.on) return;
      const t  = e.touches[0];
      const dx = t.clientX - g.current.sx;
      const dy = Math.abs(t.clientY - g.current.sy);

      if (!g.current.dir) {
        if (Math.abs(dx) < 5) return;
        // Gesto troppo verticale → annulla
        if (dy > Math.abs(dx) * 0.7) { g.current.on = false; return; }
        g.current.dir = true;
      }

      const x = Math.max(0, dx);
      g.current.cur     = x;
      el.style.transition = "none";
      el.style.transform  = `translateX(${x}px)`;
    };

    const onEnd = () => {
      if (!g.current.on || !g.current.dir) { g.current.on = false; return; }
      g.current.on = false;

      const W = window.innerWidth;
      if (g.current.cur > W * TRIGGER) {
        // Completa il gesto: slide fuori poi naviga
        el.style.transition = "transform 0.22s cubic-bezier(0.4,0,1,1)";
        el.style.transform  = `translateX(${W}px)`;
        setTimeout(() => router.back(), 200);
      } else {
        // Annulla: torna in posizione con spring
        el.style.transition = "transform 0.32s cubic-bezier(0.34,1.56,0.64,1)";
        el.style.transform  = "translateX(0)";
      }
      g.current.dir = false;
      g.current.cur = 0;
    };

    const onCancel = () => {
      if (!g.current.on) return;
      g.current.on  = false;
      g.current.dir = false;
      el.style.transition = "transform 0.3s cubic-bezier(0.4,0,0.2,1)";
      el.style.transform  = "translateX(0)";
    };

    window.addEventListener("touchstart",  onStart,  { passive: true });
    window.addEventListener("touchmove",   onMove,   { passive: true });
    window.addEventListener("touchend",    onEnd,    { passive: true });
    window.addEventListener("touchcancel", onCancel, { passive: true });

    return () => {
      window.removeEventListener("touchstart",  onStart);
      window.removeEventListener("touchmove",   onMove);
      window.removeEventListener("touchend",    onEnd);
      window.removeEventListener("touchcancel", onCancel);
    };
  }, [canSwipe, router]);

  return <div ref={ref}>{children}</div>;
}
