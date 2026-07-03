import type { Metadata } from "next";

export const metadata: Metadata = { title: "Partite" };

const NEXT_MATCH = {
  home: "Tavolara",
  away: "Da definire",
  date: "13 settembre 2026",
  venue: "Geovillage, Olbia",
  competition: "Prima Categoria",
};

const MATCHES = [
  { date: "2026-04-26", home: "Tavolara", away: "FC Biasi",      gH: 5, gA: 1, comp: "Seconda Categoria", r: "V" },
  { date: "2026-04-19", home: "Tavolara", away: "Budonese",      gH: 3, gA: 0, comp: "Seconda Categoria", r: "V" },
  { date: "2026-04-12", home: "Palau",    away: "Tavolara",      gH: 1, gA: 1, comp: "Seconda Categoria", r: "P" },
  { date: "2026-04-05", home: "Tavolara", away: "Calangianus",   gH: 2, gA: 0, comp: "Seconda Categoria", r: "V" },
  { date: "2026-03-29", home: "Tempio",   away: "Tavolara",      gH: 0, gA: 2, comp: "Seconda Categoria", r: "V" },
  { date: "2026-03-22", home: "Tavolara", away: "Ozierese",      gH: 1, gA: 1, comp: "Seconda Categoria", r: "P" },
  { date: "2026-03-15", home: "Arzachena",away: "Tavolara",      gH: 2, gA: 1, comp: "Seconda Categoria", r: "S" },
];

const BADGE: Record<string, { bg: string; color: string }> = {
  V: { bg: "rgba(74,222,128,0.13)",  color: "#4ade80" },
  P: { bg: "rgba(250,204,21,0.13)",  color: "#facc15" },
  S: { bg: "rgba(248,113,113,0.13)", color: "#f87171" },
};

function fmtDate(iso: string) {
  return new Date(iso)
    .toLocaleDateString("it-IT", { day: "2-digit", month: "short" })
    .toUpperCase();
}

export default function PartitePage() {
  return (
    <div className="min-h-[100svh] bg-nero pb-28">

      {/* Header */}
      <div className="px-5 pt-24 pb-6">
        <p className="eyebrow mb-2">Stagione 2025/26</p>
        <h1 className="text-4xl text-avorio">Partite</h1>
      </div>

      {/* ── PROSSIMA PARTITA ── */}
      <div className="mx-5 mb-8 bg-carbon rounded-2xl overflow-hidden">
        <div className="h-[3px]" style={{ backgroundColor: "var(--color-oro)" }} />
        <div className="p-5">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-oro mb-5">
            Prossima · {NEXT_MATCH.competition}
          </p>

          <div className="flex items-center gap-2">
            <p className="flex-1 font-body font-extrabold text-xl uppercase text-white">
              {NEXT_MATCH.home}
            </p>
            <p className="shrink-0 font-mono text-[11px] uppercase tracking-widest text-white/25">
              vs
            </p>
            <p className="flex-1 text-right font-body font-extrabold text-xl uppercase text-white/40">
              {NEXT_MATCH.away}
            </p>
          </div>

          <div
            className="mt-4 pt-4 flex items-center justify-between"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <p className="font-mono text-[9px] uppercase tracking-wider text-white/40">
              {NEXT_MATCH.date}
            </p>
            <p className="font-mono text-[9px] uppercase tracking-wider text-white/40">
              {NEXT_MATCH.venue}
            </p>
          </div>
        </div>
      </div>

      {/* ── ULTIMI RISULTATI ── */}
      <div className="px-5">
        <p className="eyebrow mb-4">Ultimi risultati</p>
        <div className="flex flex-col gap-2">
          {MATCHES.map((m, i) => {
            const badge = BADGE[m.r];
            const tavHome = m.home === "Tavolara";
            return (
              <div key={i} className="bg-carbon rounded-2xl p-4 flex items-center gap-3">

                {/* Badge V / P / S */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-mono text-xs font-bold"
                  style={{ backgroundColor: badge.bg, color: badge.color }}
                >
                  {m.r}
                </div>

                {/* Squadre + punteggio */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap leading-none">
                    <span
                      className="font-body font-extrabold text-sm uppercase"
                      style={{ color: tavHome ? "white" : "rgba(255,255,255,0.45)" }}
                    >
                      {m.home}
                    </span>
                    <span
                      className="font-mono text-sm font-bold"
                      style={{ color: "var(--color-oro)" }}
                    >
                      {m.gH}–{m.gA}
                    </span>
                    <span
                      className="font-body font-extrabold text-sm uppercase"
                      style={{ color: !tavHome ? "white" : "rgba(255,255,255,0.45)" }}
                    >
                      {m.away}
                    </span>
                  </div>
                  <p className="font-mono text-[9px] uppercase tracking-wider text-white/30 mt-1">
                    {fmtDate(m.date)} · {m.comp}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
