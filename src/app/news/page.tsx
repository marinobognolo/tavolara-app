import type { Metadata } from "next";
import Link from "next/link";
import { NEWS, fmtDate } from "@/lib/data";

export const metadata: Metadata = { title: "News" };

const GALLERIES = [
  { match: "Tavolara 5–1 FC Biasi", date: "26 Apr 2026", cover: "/giocatori/gallo/01.jpg" },
  { match: "Tavolara 3–0 Budonese", date: "19 Apr 2026", cover: "/giocatori/bulla/01.jpg" },
  { match: "Palau 1–1 Tavolara", date: "12 Apr 2026", cover: "/giocatori/van-der-want/01.jpg" },
  { match: "Tavolara 2–0 Calangianus", date: "05 Apr 2026", cover: "/giocatori/mannoni/01.jpg" },
  { match: "Tavolara vs Tempio", date: "29 Mar 2026", cover: "/giocatori/varrucciu/01.jpg" },
];

function Heart() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function Share() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

export default function NewsPage() {
  const first = NEWS[0];
  const second = NEWS[1];
  const small = NEWS.slice(2, 5);

  return (
    <div className="min-h-[100svh] bg-nero pb-24">

      {/* Header */}
      <div className="px-4 pt-24 pb-5 flex items-center justify-between">
        <h1 className="font-body font-extrabold text-3xl uppercase text-white">Ultime News</h1>
        <button className="px-4 py-1.5 rounded-full border border-white/20 font-mono text-[11px] uppercase tracking-wide text-white/60">
          Di più
        </button>
      </div>

      {/* 1a news — GRANDE */}
      {first && (
        <Link href={`/news/${first.slug}`} className="block mx-4 mb-4 bg-carbon rounded-2xl overflow-hidden">
          <div className="p-4 flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-body font-extrabold text-[1.5rem] uppercase text-white leading-snug">
                {first.category && <span className="text-oro">{first.category.toUpperCase()} | </span>}{first.title.toUpperCase()}
              </p>
              <p className="font-mono text-[11px] text-white/40 mt-2">{fmtDate(first.date)}</p>
            </div>
            <div className="flex flex-col gap-3 shrink-0 text-white/40 pt-1">
              <button aria-label="Like"><Heart /></button>
              <button aria-label="Condividi"><Share /></button>
            </div>
          </div>
          {first.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={first.image} alt="" className="w-full aspect-[4/3] object-cover" />
          )}
        </Link>
      )}

      {/* 2a news — MEDIA */}
      {second && (
        <Link href={`/news/${second.slug}`} className="block mx-4 mb-3 bg-carbon rounded-2xl overflow-hidden">
          <div className="flex gap-3 p-4">
            <div className="flex-1 min-w-0">
              <p className="font-body font-bold text-[1.1rem] uppercase text-white leading-snug">
                {second.category && <span className="text-oro">{second.category.toUpperCase()} | </span>}{second.title.toUpperCase()}
              </p>
              <p className="font-mono text-[11px] text-white/40 mt-1">{fmtDate(second.date)}</p>
              <div className="flex gap-4 mt-2 text-white/40">
                <button aria-label="Like"><Heart /></button>
                <button aria-label="Condividi"><Share /></button>
              </div>
            </div>
            {second.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={second.image} alt="" className="w-24 h-24 object-cover rounded-xl shrink-0" />
            )}
          </div>
        </Link>
      )}

      {/* 3 news piccole */}
      {small.map((n) => (
        <Link key={n.slug} href={`/news/${n.slug}`} className="block mx-4 mb-3 bg-carbon rounded-2xl overflow-hidden">
          <div className="flex gap-3 p-4">
            <div className="flex-1 min-w-0">
              <p className="font-body font-bold text-[1rem] uppercase text-white leading-snug line-clamp-2">
                {n.category && <span className="text-oro">{n.category.toUpperCase()} | </span>}{n.title.toUpperCase()}
              </p>
              <p className="font-mono text-[11px] text-white/40 mt-1">{fmtDate(n.date)}</p>
            </div>
            {n.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={n.image} alt="" className="w-20 h-16 object-cover rounded-xl shrink-0" />
            )}
          </div>
        </Link>
      ))}

      {/* Gallery ultimi 5 match */}
      <div className="px-4 mt-6">
        <h2 className="font-display text-2xl text-white mb-4">Photo Gallery</h2>
        <div className="space-y-3">
          {GALLERIES.map((g, i) => (
            <div key={i} className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={g.cover} alt={g.match} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-nero/80 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4">
                <p className="font-body font-bold text-sm uppercase text-white">{g.match}</p>
                <p className="font-mono text-[10px] text-white/50 mt-0.5">{g.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
