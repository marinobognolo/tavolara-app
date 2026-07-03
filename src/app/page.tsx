"use client";

import { useState } from "react";
import Link from "next/link";
import { NEWS } from "@/lib/data";

const FEATURED = NEWS.slice(0, 4);

export default function Home() {
  const [active, setActive] = useState(0);
  const news = FEATURED[active];

  return (
    <div className="fixed inset-0 z-10 overflow-hidden bg-nero">
      {/* Foto di sfondo - crossfade */}
      {FEATURED.map((n, i) => (
        <div
          key={n.slug}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === active ? 1 : 0 }}
        >
          {n.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={n.image}
              alt=""
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
          ) : (
            <div className="absolute inset-0 bg-granito" />
          )}
        </div>
      ))}

      {/* Gradiente top - leggibilità TopNav */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

      {/* Gradiente bottom - leggibilità testo */}
      <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-nero via-nero/85 to-transparent pointer-events-none" />

      {/* Contenuto in basso */}
      <div
        className="absolute bottom-0 inset-x-0 px-5"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 2rem)" }}
      >
        {/* Categoria */}
        <p className="font-body font-bold text-sm uppercase tracking-widest text-white/60 mb-3">
          NEWS
        </p>

        {/* Titolo */}
        <Link href={`/news/${news.slug}`}>
          <h2 className="text-[1.85rem] text-white mb-5">
            {news.category && <span className="text-oro">{news.category.toUpperCase()} | </span>}
            {news.title.toUpperCase()}
          </h2>
        </Link>

        {/* Like + Share */}
        <div className="flex items-center gap-5 mb-5">
          <button className="text-white/40" aria-label="Like">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
          <button className="text-white/40" aria-label="Condividi">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </button>
        </div>

        {/* Lente + trattini carousel */}
        <div className="flex items-center gap-3 mb-8">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-white/40 shrink-0">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <div className="flex items-center gap-2">
          {FEATURED.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="h-[2px] rounded-full transition-all duration-300"
              style={{
                width: i === active ? "26px" : "14px",
                backgroundColor: i === active ? "white" : "rgba(255,255,255,0.25)",
              }}
            />
          ))}
          </div>
        </div>

        {/* TUTTE LE NEWS */}
        <Link href="/news" className="flex flex-col items-center gap-1.5">
          <span className="font-body font-bold text-sm uppercase tracking-widest text-white/50">
            Tutte le news
          </span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white/30">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
