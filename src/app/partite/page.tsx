import type { Metadata } from "next";

export const metadata: Metadata = { title: "Partite" };

const MATCHES = [
  { date: "2026-04-26", home: "Tavolara", away: "FC Biasi", scoreHome: 5, scoreAway: 1, competition: "Seconda Categoria", result: "V" },
  { date: "2026-04-19", home: "Tavolara", away: "Budonese", scoreHome: 3, scoreAway: 0, competition: "Seconda Categoria", result: "V" },
  { date: "2026-04-12", home: "Palau", away: "Tavolara", scoreHome: 1, scoreAway: 1, competition: "Seconda Categoria", result: "P" },
  { date: "2026-04-05", home: "Tavolara", away: "Calangianus", scoreHome: 2, scoreAway: 0, competition: "Seconda Categoria", result: "V" },
];

const resultColor: Record<string, string> = {
  V: "bg-green-600/20 text-green-400 border-green-600/30",
  P: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
  S: "bg-red-600/20 text-red-400 border-red-600/30",
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("it-IT", { day: "2-digit", month: "short" }).toUpperCase();
}

export default function PartitePage() {
  return (
    <div className="min-h-[100svh] bg-nero">
      <div className="px-5 pt-12 pb-6">
        <p className="eyebrow mb-2">Stagione 2025/26</p>
        <h1 className="font-display text-4xl uppercase text-avorio">Partite</h1>
      </div>

      {/* Prossima */}
      <div className="mx-5 mb-6 border border-oro/30 bg-carbon p-5">
        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-oro mb-3">Prossima · Prima Categoria</p>
        <div className="flex items-center justify-between">
          <p className="font-display text-xl uppercase text-avorio">Tavolara</p>
          <p className="font-mono text-xs text-avorio-dim">vs</p>
          <p className="font-display text-xl uppercase text-avorio">Da definire</p>
        </div>
        <p className="mt-3 font-mono text-[10px] text-avorio-dim/60">13 settembre 2026 · Geovillage, Olbia</p>
      </div>

      {/* Risultati */}
      <div className="px-5 pb-6">
        <p className="eyebrow mb-4">Ultimi risultati</p>
        <div className="space-y-2">
          {MATCHES.map((m, i) => (
            <div key={i} className="flex items-center gap-3 border border-granito-2 bg-carbon p-4">
              <span className={`shrink-0 border px-2 py-0.5 font-mono text-[10px] font-bold ${resultColor[m.result]}`}>
                {m.result}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-display text-sm uppercase text-avorio leading-tight">
                  {m.home} <span className="text-oro font-bold">{m.scoreHome}–{m.scoreAway}</span> {m.away}
                </p>
                <p className="font-mono text-[9px] text-avorio-dim/60 mt-0.5">{fmtDate(m.date)} · {m.competition}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
