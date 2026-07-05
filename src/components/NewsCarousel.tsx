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
  const touchX = useRef(0);
  const touchY = useRef(0);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
    touchY.current = e.touches[0].clientY;
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const dx = e.changedTouches[0].clientX - touchX.current;
      const dy = e.changedTouches[0].clientY - touchY.current;
      if (Math.abs(dx) > 50 && Math.abs(dy) < Math.abs(dx) * 0.7) {
        if (dx < 0 && active < pages.length - 1) setActive((p) => p + 1);
        if (dx > 0 && active > 0) setActive((p) => p - 1);
      }
    },
    [active, pages.length]
  );

  return (
    <div>
      {/* Carosello */}
      <div
        className="overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex"
          style={{
            transform: `translateX(-${active * 100}%)`,
            transition: "transform 0.32s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {pages.map((page, pi) => (
            <div key={pi} className="min-w-full flex flex-col gap-2 px-4">
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
      </div>

      {/* Puntini navigazione */}
      {pages.length > 1 && (
        <div className="flex justify-center items-center gap-2 mt-5">
          {pages.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === active ? "20px" : "6px",
                height: "6px",
                background:
                  i === active
                    ? "var(--color-oro)"
                    : "rgba(255,255,255,0.2)",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
