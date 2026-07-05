import type { Metadata } from "next";
import Link from "next/link";
import ClubShell from "@/components/ClubShell";

export const metadata: Metadata = { title: "Contatti" };

export default function ContattiPage() {
  return (
    <ClubShell>
    <div className="min-h-[100svh] bg-nero pb-24">

      {/* Hero */}
      <div className="relative px-5 pt-24 pb-10">
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: "linear-gradient(rgba(201,168,106,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,106,1) 1px, transparent 1px)",
            backgroundSize: "38px 38px",
          }}
        />
        <Link href="/club" className="font-mono text-[12px] uppercase tracking-[0.18em] mb-5 inline-flex items-center gap-2 relative" style={{ color: "var(--color-oro)" }}>
          ← Club
        </Link>
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] mb-3" style={{ color: "var(--color-oro)" }}>
          Restiamo in contatto
        </p>
        <h1 className="font-body font-extrabold text-[2.4rem] uppercase text-white leading-none">
          Contatti
        </h1>
        <p className="mt-4 text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
          Per informazioni, collaborazioni o per entrare a far parte del club.
        </p>
      </div>

      <div className="px-5 space-y-4">

        {/* Email */}
        <a
          href="mailto:asdtavolaracalcio@gmail.com"
          className="flex items-center gap-4 rounded-2xl p-5"
          style={{ background: "var(--color-carbon)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <span
            className="w-11 h-11 rounded-full shrink-0 flex items-center justify-center"
            style={{ border: "1px solid rgba(201,168,106,0.4)" }}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ color: "var(--color-oro)" }}>
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] mb-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>Email</p>
            <p className="font-body font-extrabold text-[0.95rem] uppercase text-white truncate">asdtavolaracalcio@gmail.com</p>
          </div>
          <span className="font-mono text-[11px] uppercase tracking-wider shrink-0" style={{ color: "var(--color-oro)" }}>Scrivici →</span>
        </a>

        {/* Instagram */}
        <a
          href="https://www.instagram.com/tavolaracalcio1954/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 rounded-2xl p-5"
          style={{ background: "var(--color-carbon)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <span
            className="w-11 h-11 rounded-full shrink-0 flex items-center justify-center"
            style={{ border: "1px solid rgba(201,168,106,0.4)" }}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ color: "var(--color-oro)" }}>
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
            </svg>
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] mb-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>Instagram</p>
            <p className="font-body font-extrabold text-[0.95rem] uppercase text-white">@tavolaracalcio1954</p>
          </div>
          <span className="font-mono text-[11px] uppercase tracking-wider shrink-0" style={{ color: "var(--color-oro)" }}>Seguici →</span>
        </a>

        {/* Facebook */}
        <a
          href="https://www.facebook.com/asdtavolaracalcio/?locale=it_IT"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 rounded-2xl p-5"
          style={{ background: "var(--color-carbon)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <span
            className="w-11 h-11 rounded-full shrink-0 flex items-center justify-center"
            style={{ border: "1px solid rgba(201,168,106,0.4)" }}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ color: "var(--color-oro)" }}>
              <path d="M14 8h2V5h-2c-2 0-3 1-3 3v2H9v3h2v6h3v-6h2l1-3h-3V8c0-.5.3-1 1-1Z" strokeLinejoin="round" />
            </svg>
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] mb-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>Facebook</p>
            <p className="font-body font-extrabold text-[0.95rem] uppercase text-white">ASD Tavolara Calcio</p>
          </div>
          <span className="font-mono text-[11px] uppercase tracking-wider shrink-0" style={{ color: "var(--color-oro)" }}>Vai →</span>
        </a>

        {/* Stadio */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "var(--color-carbon)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] mb-2" style={{ color: "var(--color-oro)" }}>
            Dove giochiamo
          </p>
          <p className="font-body font-extrabold text-[1.1rem] uppercase text-white mb-1">
            Geovillage · Olbia
          </p>
          <p className="text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
            Il Tavolara Calcio disputa le gare interne al Geovillage di Olbia, Sardegna.
          </p>
          <a
            href="https://maps.google.com/?q=Geovillage+Olbia"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 font-mono text-[11px] uppercase tracking-wider"
            style={{ color: "var(--color-oro)" }}
          >
            Apri in Maps →
          </a>
        </div>

      </div>
    </div>
    </ClubShell>
  );
}
