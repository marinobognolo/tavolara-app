"use client";

import { useState, useRef } from "react";
import Link from "next/link";

const LOGHI = [
  {
    year: "1954",
    title: "Le origini",
    desc: "Il primo stemma del Gruppo Sportivo Tavolara: l'isola e la barca a tratto, dalla fondazione.",
    img: "/1954.png",
  },
  {
    year: "1970",
    title: "Lo scudo a colori",
    desc: "Lo stemma biancoverde con l'isola e la barca; in basso l'anno di fondazione.",
    img: "/1970.png",
  },
  {
    year: "2000",
    title: "Gli anni della Serie D",
    desc: "Lo stemma con l'aquila, nel periodo più alto della storia biancoverde.",
    img: "/2000.png",
  },
  {
    year: "2004",
    title: "Il Cinquantenario",
    desc: "Il marchio per i 50 anni del club (1954–2004).",
    img: "/2004.png",
  },
  {
    year: "2010",
    title: "La S.S. Tavolara",
    desc: "Lo stemma della Società Sportiva, con l'isola e la barca su scudo biancoverde.",
    img: "/2010.png",
  },
  {
    year: "2019",
    title: "La rinascita",
    desc: "Il marchio dell'A.S.D. Tavolara Calcio: lo scudo del nuovo corso.",
    img: "/2019.png",
  },
  {
    year: "2024",
    title: "I 70 anni",
    desc: "Il nuovo stemma dei 70 anni: richiama il vecchio scudo rendendolo più moderno.",
    img: "/2024.png",
  },
];

const STEP = 195;
const SIZE = 200;

export default function LogoPage() {
  const [active, setActive] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const go = (i: number) => setActive(Math.max(0, Math.min(LOGHI.length - 1, i)));

  return (
    <div
      className="min-h-[100svh] bg-nero pb-32 select-none"
      onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        if (dx < -40) go(active + 1);
        else if (dx > 40) go(active - 1);
        touchStartX.current = null;
      }}
    >
      {/* Header */}
      <div className="px-5 pt-24 pb-8">
        <Link href="/club" className="font-mono text-[12px] uppercase tracking-[0.18em] mb-5 inline-flex items-center gap-2" style={{ color: "var(--color-oro)" }}>
          ← Club
        </Link>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-px" style={{ backgroundColor: "var(--color-oro)" }} />
          <span
            className="font-mono text-[10px] uppercase tracking-widest"
            style={{ color: "var(--color-oro)" }}
          >
            LE FASI EVOLUTIVE
          </span>
        </div>
        <h1 className="text-[2.4rem] text-white">
          Scorri la linea del tempo
        </h1>
      </div>

      {/* Testo introduttivo */}
      <div className="px-5 pb-8 space-y-5">
        <p className="text-[13.5px] leading-relaxed font-mono uppercase tracking-wide" style={{ color: "var(--color-oro)" }}>
          La storia dello stemma biancoverde: come è nato il marchio del Tavolara e come è cambiato, fase dopo fase.
        </p>
        <div>
          <p className="font-body font-extrabold text-[1rem] uppercase text-white mb-2">La nascita del marchio</p>
          <p className="text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
            Il segno del Tavolara nasce con la società, nel 1954: un'identità legata al mare, all'isola che domina il golfo di Olbia e ai colori sociali, il verde e il bianco.
          </p>
        </div>
        <p className="text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
          Negli anni il marchio è cambiato seguendo le stagioni del club — rifondazioni, ritorni, nuovi corsi — ma ha sempre conservato gli elementi che lo rendono riconoscibili: il nome dell'isola, lo scudo e i colori biancoverdi.
        </p>
        <p className="text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
          Questa è la sua evoluzione: scorri la linea del tempo per vedere come lo stemma è cambiato, fase dopo fase.
        </p>
      </div>

      {/* Carousel */}
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{ height: "260px" }}
      >
        {LOGHI.map((logo, i) => {
          const off = i - active;
          const abs = Math.abs(off);
          const scale = abs === 0 ? 1 : abs === 1 ? 0.5 : 0.32;
          const opacity = abs === 0 ? 1 : abs === 1 ? 0.35 : abs === 2 ? 0.1 : 0;

          return (
            <div
              key={logo.year}
              onClick={() => abs > 0 && abs <= 2 && go(i)}
              className="absolute flex items-center justify-center"
              style={{
                transform: `translateX(${off * STEP}px) scale(${scale})`,
                opacity,
                transition: "transform 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease",
                pointerEvents: abs > 2 ? "none" : "auto",
                cursor: abs > 0 ? "pointer" : "default",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo.img}
                alt={logo.title}
                className="object-contain"
                style={{
                  width: `${SIZE}px`,
                  height: `${SIZE}px`,
                  filter: abs === 0 ? "drop-shadow(0 0 20px rgba(201,168,106,0.3))" : "none",
                  transition: "filter 0.4s ease",
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Info */}
      <div className="px-8 pt-7 text-center">
        <p
          className="font-mono text-sm tracking-[0.2em] mb-2"
          style={{ color: "var(--color-oro)" }}
        >
          {LOGHI[active].year}
        </p>
        <h2 className="text-[1.9rem] text-white mb-3">
          {LOGHI[active].title}
        </h2>
        <p
          className="text-sm leading-relaxed"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          {LOGHI[active].desc}
        </p>
      </div>

      {/* Timeline nav */}
      <div className="flex items-center gap-1 px-4 pt-10">
        {/* Prev */}
        <button
          onClick={() => go(active - 1)}
          disabled={active === 0}
          className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center shrink-0 disabled:opacity-25 transition-opacity"
          aria-label="Precedente"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Dots */}
        <div className="flex-1 flex items-end justify-around px-1">
          {LOGHI.map((logo, i) => (
            <button
              key={logo.year}
              onClick={() => go(i)}
              className="flex flex-col items-center gap-1 py-1"
              aria-label={logo.year}
            >
              <div
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === active ? "8px" : "6px",
                  height: i === active ? "8px" : "6px",
                  backgroundColor:
                    i === active ? "var(--color-oro)" : "rgba(255,255,255,0.25)",
                }}
              />
              <span
                className="font-mono transition-colors duration-300"
                style={{
                  fontSize: "8px",
                  color:
                    i === active ? "var(--color-oro)" : "rgba(255,255,255,0.3)",
                }}
              >
                {logo.year}
              </span>
            </button>
          ))}
        </div>

        {/* Next */}
        <button
          onClick={() => go(active + 1)}
          disabled={active === LOGHI.length - 1}
          className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center shrink-0 disabled:opacity-25 transition-opacity"
          aria-label="Successivo"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
