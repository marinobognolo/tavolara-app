import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Club" };

const ITEMS = [
  { label: "Chi Siamo", href: "/chi-siamo" },
  { label: "Logo", href: "/logo" },
  { label: "Organigramma", href: "/organigramma" },
  { label: "Palmares", href: "/palmares" },
  { label: "Contatti", href: "/contatti" },
];

export default function ClubPage() {
  return (
    <div className="min-h-[100svh] bg-nero px-8" style={{ paddingTop: "calc(env(safe-area-inset-top) + 72px)" }}>
      <Link
        href="/"
        className="flex items-center gap-2 mb-8"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
          className="w-6 h-6 shrink-0" style={{ color: "var(--color-oro)" }}>
          <path d="M15 18l-6-6 6-6" />
        </svg>
        <span className="font-body font-extrabold text-4xl uppercase leading-none" style={{ color: "var(--color-oro)" }}>
          CLUB
        </span>
      </Link>

      <nav className="space-y-1">
        {ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block py-2 font-body font-extrabold text-2xl uppercase text-white leading-none"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
