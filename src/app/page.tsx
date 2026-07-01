"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { NEXT_MATCH, NEWS, countdown, fmtDate } from "@/lib/data";

function Countdown({ datetime }: { datetime: string }) {
  const [cd, setCd] = useState(countdown(datetime));
  useEffect(() => {
    const t = setInterval(() => setCd(countdown(datetime)), 60000);
    return () => clearInterval(t);
  }, [datetime]);
  if (!cd) return null;
  return (
    <div className="flex gap-4">
      {[{ v: cd.d, l: "giorni" }, { v: cd.h, l: "ore" }, { v: cd.m, l: "min" }].map(({ v, l }) => (
        <div key={l} className="flex flex-col items-center">
          <span className="font-mono text-3xl font-bold text-oro leading-none">{String(v).padStart(2, "0")}</span>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-avorio-dim mt-1">{l}</span>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const nm = NEXT_MATCH;
  const latestNews = NEWS.slice(0, 3);

  return (
    <div className="min-h-[100svh] bg-nero">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-tavolara-gold.png" alt="Tavolara Calcio" className="h-12 w-auto" />
        <div className="text-right">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-oro">Prima Categoria</p>
          <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-avorio-dim">Sardegna · 2026/27</p>
        </div>
      </div>

      {/* Prossima partita */}
      {nm && (
        <div className="mx-5 mb-6 border border-granito-2 bg-carbon p-5">
          <p className="eyebrow mb-4">Prossima partita</p>
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-avorio-dim">{nm.competition}</p>
              {nm.round && <p className="font-mono text-[10px] text-avorio-dim/60">{nm.round}</p>}
            </div>
            <div className="text-right">
              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-avorio-dim">{nm.venue}</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mb-6">
            <p className="font-display text-2xl uppercase text-oro">TAV</p>
            <p className="font-mono text-xs text-avorio-dim/50">vs</p>
            <p className="font-display text-2xl uppercase text-avorio">{nm.opponent}</p>
          </div>

          {nm.datetime && <Countdown datetime={nm.datetime} />}
          {nm.datetime && (
            <p className="mt-3 font-mono text-[10px] text-avorio-dim/60">
              {new Date(nm.datetime).toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
            </p>
          )}
        </div>
      )}

      {/* Accessi rapidi */}
      <div className="mx-5 mb-6 grid grid-cols-2 gap-3">
        {[
          { href: "/rosa", label: "La Rosa", sub: "Giocatori" },
          { href: "/partite", label: "Partite", sub: "Calendario & risultati" },
        ].map((c) => (
          <Link key={c.href} href={c.href}
            className="border border-granito-2 bg-carbon p-4 transition-colors active:bg-granito">
            <p className="font-display text-xl uppercase text-avorio">{c.label}</p>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.15em] text-avorio-dim/60">{c.sub}</p>
          </Link>
        ))}
      </div>

      {/* Ultime news */}
      <div className="px-5 pb-6">
        <div className="flex items-center justify-between mb-4">
          <p className="eyebrow">Ultime news</p>
          <Link href="/news" className="font-mono text-[9px] uppercase tracking-[0.2em] text-oro">Tutte →</Link>
        </div>
        <div className="space-y-3">
          {latestNews.map((n) => (
            <Link key={n.slug} href={`/news/${n.slug}`}
              className="flex gap-3 border border-granito-2 bg-carbon p-4 transition-colors active:bg-granito">
              {n.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={n.image} alt="" className="h-16 w-16 shrink-0 object-cover" />
              )}
              <div className="min-w-0">
                <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-oro mb-1">{fmtDate(n.date)}</p>
                <p className="font-display text-base uppercase text-avorio leading-tight line-clamp-2">{n.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
