"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { haptic } from "@/lib/haptic";

const TABS = [
  { href: "/", label: "Home", exact: true, icon: (active: boolean) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M3 12L12 3l9 9" /><path d="M5 10v9a1 1 0 001 1h4v-4h4v4h4a1 1 0 001-1v-9" />
    </svg>
  )},
  { href: "/partite", label: "Partite", exact: false, icon: (active: boolean) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  )},
  { href: "/rosa", label: "Rosa", exact: false, icon: (active: boolean) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )},
  { href: "/news", label: "News", exact: false, icon: (active: boolean) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" />
    </svg>
  )},
];

export default function BottomNav() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 border-t border-white/[0.06] bg-nero/95 backdrop-blur-2xl"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex h-16 items-stretch">
        {TABS.map((tab) => {
          const isActive = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              onClick={() => haptic()}
              className={`relative flex flex-1 flex-col items-center justify-center gap-1 transition-colors duration-200 ${
                isActive ? "text-oro" : "text-avorio-dim/50"
              }`}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 h-[2px] w-10 -translate-x-1/2 rounded-b-full bg-oro" />
              )}
              {tab.icon(isActive)}
              <span className="font-mono text-[9px] uppercase tracking-[0.14em]">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
