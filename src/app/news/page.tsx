import type { Metadata } from "next";
import Link from "next/link";
import { NEWS } from "@/lib/data";
import NewsCarousel from "@/components/NewsCarousel";

export const metadata: Metadata = { title: "News" };

const GALLERIES = [
  { match: "Tavolara 5–1 FC Biasi", date: "26 Apr 2026", cover: "/giocatori/gallo/01.jpg" },
  { match: "Tavolara 3–0 Budonese", date: "19 Apr 2026", cover: "/giocatori/bulla/01.jpg" },
  { match: "Palau 1–1 Tavolara", date: "12 Apr 2026", cover: "/giocatori/van-der-want/01.jpg" },
  { match: "Tavolara 2–0 Calangianus", date: "05 Apr 2026", cover: "/giocatori/mannoni/01.jpg" },
  { match: "Tavolara vs Tempio", date: "29 Mar 2026", cover: "/giocatori/varrucciu/01.jpg" },
];

export default function NewsPage() {
  return (
    <div className="min-h-[100svh] bg-nero pb-24">

      {/* Header */}
      <div className="px-4 pt-24 pb-5 flex items-center justify-between">
        <h1 className="text-3xl text-white">Ultime News</h1>
        <Link href="/news/archivio" className="px-4 py-1.5 rounded-full border border-white/20 font-mono text-[11px] uppercase tracking-wide text-white/60">
          Di più
        </Link>
      </div>

      {/* Lista news a blocchi di 3 con swipe */}
      <NewsCarousel news={NEWS} />

      {/* Gallery ultimi 5 match */}
      <div className="px-4 mt-8">
        <h2 className="text-2xl text-white mb-4">Photo Gallery</h2>
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
