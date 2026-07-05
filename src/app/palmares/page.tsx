import type { Metadata } from "next";
import Link from "next/link";
import ClubShell from "@/components/ClubShell";

export const metadata: Metadata = { title: "Palmares" };

const PALMARES = [
  {
    group: "Titoli nazionali",
    items: [
      {
        competition: "Serie D",
        honours: [
          { label: "Secondo posto", years: ["2008-09 · Girone G"], win: false },
          { label: "Terzo posto", years: ["2007-08 · Girone G"], win: false },
        ],
      },
    ],
  },
  {
    group: "Campionati regionali",
    items: [
      {
        competition: "Eccellenza",
        honours: [
          { label: "Vincitore", years: ["1999-00", "2006-07"], win: true },
          { label: "Secondo posto", years: ["2003-04"], win: false },
          { label: "Terzo posto", years: ["2005-06"], win: false },
        ],
      },
      {
        competition: "Promozione",
        honours: [
          { label: "Vincitore", years: ["1977-78 · Girone C"], win: true },
          { label: "Secondo posto", years: ["1996-97 · Girone B"], win: false },
        ],
      },
      {
        competition: "Seconda Categoria",
        honours: [
          { label: "Vincitore", years: ["1976-77 · Girone G", "2025-26 · Girone H"], win: true },
          { label: "Secondo posto", years: ["2014-15 · Girone G"], win: false },
        ],
      },
      {
        competition: "Terza Categoria",
        honours: [
          { label: "Secondo posto", years: ["2013-14 · Girone C", "2022-23 · Girone G"], win: false },
        ],
      },
    ],
  },
  {
    group: "Coppe",
    items: [
      {
        competition: "Coppa Italia Sardegna",
        honours: [
          { label: "Vincitore", years: ["2004-05", "2005-06"], win: true },
          { label: "Semifinale", years: ["2002-03", "2006-07"], win: false },
        ],
      },
    ],
  },
  {
    group: "Riconoscimenti",
    items: [
      {
        competition: "Coppa Sant'Antonio",
        honours: [
          { label: "Vincitore", years: ["2005-06"], win: true },
        ],
      },
    ],
  },
];

export default function PalmaresPage() {
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
          Albo d'oro
        </p>
        <h1 className="font-body font-extrabold text-[2.4rem] uppercase text-white leading-none">
          Palmares
        </h1>
        <p className="mt-4 text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
          Titoli, coppe e piazzamenti del Tavolara Calcio dal 1954 a oggi.
        </p>
      </div>

      <div className="px-5 space-y-10">
        {PALMARES.map((group) => (
          <div key={group.group}>
            {/* Intestazione gruppo */}
            <div className="flex items-center gap-3 mb-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: "var(--color-oro)" }}>
                {group.group}
              </p>
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
            </div>

            <div className="space-y-3">
              {group.items.map((item) => (
                <div
                  key={item.competition}
                  className="rounded-2xl overflow-hidden"
                  style={{ border: "1px solid rgba(255,255,255,0.07)", background: "var(--color-carbon)" }}
                >
                  <div className="px-5 pt-4 pb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <p className="font-body font-extrabold text-[1.05rem] uppercase text-white">
                      {item.competition}
                    </p>
                  </div>
                  <div className="px-5 py-3 space-y-2.5">
                    {item.honours.map((h) => (
                      <div key={h.label} className="flex items-start gap-3">
                        <span
                          className="font-mono text-[10px] uppercase tracking-[0.12em] mt-0.5 shrink-0 flex items-center gap-1"
                          style={{ color: h.win ? "var(--color-oro)" : "rgba(255,255,255,0.35)" }}
                        >
                          {h.win && <span>★</span>}
                          {h.label}
                          {h.years.length > 1 && (
                            <span style={{ color: "rgba(255,255,255,0.3)" }}>×{h.years.length}</span>
                          )}
                        </span>
                        <span
                          className="font-mono text-[11px] leading-relaxed"
                          style={{ color: h.win ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.35)" }}
                        >
                          {h.years.join("  ·  ")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
    </ClubShell>
  );
}
