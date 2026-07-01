"use client";

import { PLAYERS, ROLE_ORDER } from "@/lib/data";

const roleLabel: Record<string, string> = {
  Portiere: "Portieri",
  Difensore: "Difensori",
  Centrocampista: "Centrocampisti",
  Attaccante: "Attaccanti",
};

export default function RosaPage() {
  return (
    <div className="min-h-[100svh] bg-nero">
      <div className="px-5 pt-12 pb-6">
        <p className="eyebrow mb-2">Prima Squadra</p>
        <h1 className="font-display text-4xl uppercase text-avorio">Rosa 2026/27</h1>
      </div>

      {ROLE_ORDER.map((group) => {
        const players = PLAYERS.filter((p) => roleLabel[p.role] === group);
        if (!players.length) return null;
        return (
          <div key={group} className="px-5 mb-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-oro mb-3">{group}</p>
            <div className="space-y-2">
              {players.map((p) => (
                <div key={p.slug} className="flex items-center gap-4 border border-granito-2 bg-carbon p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/giocatori/${p.slug}/card.jpg`}
                    alt={`${p.first} ${p.last}`}
                    className="h-14 w-10 object-cover object-top bg-granito shrink-0"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-lg uppercase text-avorio leading-tight">
                      {p.first} {p.last}
                      {p.captain && <span className="ml-2 font-mono text-[8px] text-oro">(C)</span>}
                      {p.viceCaptain && <span className="ml-2 font-mono text-[8px] text-oro">(VC)</span>}
                    </p>
                    <p className="font-mono text-[9px] text-avorio-dim/60 mt-0.5">{p.role}</p>
                  </div>
                  <span className="font-mono text-xl font-bold text-granito-2 shrink-0">#{p.number}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
