"use client";

import Link from "next/link";
import { useRef, useState, useCallback } from "react";
import { type NewsItem, fmtDate } from "@/lib/data";

const PAGE_SIZE = 3;

export default function NewsCarousel({ news }: { news: NewsItem[] }) {
  const pages: NewsItem[][] = [];
  for (let i = 0; i < news.length; i += PAGE_SIZE) {
    pages.push(news.slice(i, i + PAGE_SIZE));
  }

  const [active, setActive] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    setActive(Math.max(0, Math.min(idx, pages.length - 1)));
  }, [pages.length]);

  const scrollTo = useCallback((i: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  }, []);

  return (
    <div>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="tav-carousel"
        style={{
          display: "flex",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {pages.map((page, pi) => (
          <div
            key={pi}
            style={{
              minWidth: "100%",
              scrollSnapAlign: "start",
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              gap: 8,
              padding: "0 16px",
            }}
          >
            {page.map((n) => (
              <Link
                key={n.slug}
                href={`/news/${n.slug}`}
                className="block bg-carbon rounded-2xl overflow-hidden"
              >
                <div className="flex gap-4 p-4 items-center">
                  <div className="flex-1 min-w-0">
                    {n.category && (
                      <p
                        className="font-mono text-[11px] uppercase tracking-[0.15em] mb-1"
                        style={{ color: "var(--color-oro)" }}
                      >
                        {n.category}
                      </p>
                    )}
                    <p className="font-body font-extrabold text-[1rem] uppercase text-white leading-snug line-clamp-2">
                      {n.title}
                    </p>
                    <p className="font-mono text-[12px] uppercase text-white/40 mt-1.5">
                      {fmtDate(n.date)}
                    </p>
                  </div>
                  {n.image && (
                    <div className="w-[72px] h-[72px] shrink-0 rounded-xl overflow-hidden bg-white/5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={n.image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ))}
      </div>

      {pages.length > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
            marginTop: 20,
          }}
        >
          {pages.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              style={{
                width: i === active ? 20 : 6,
                height: 6,
                borderRadius: 3,
                background:
                  i === active
                    ? "var(--color-oro)"
                    : "rgba(255,255,255,0.2)",
                transition: "all 0.3s",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
