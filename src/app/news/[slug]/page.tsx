"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { NEWS, fmtDate } from "@/lib/data";
import { notFound } from "next/navigation";
import { useRef, useCallback } from "react";

export default function NewsDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const n = NEWS.find((x) => x.slug === slug);
  if (!n) notFound();

  const touchX = useRef(0);
  const touchY = useRef(0);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
    touchY.current = e.touches[0].clientY;
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchX.current;
    const dy = e.changedTouches[0].clientY - touchY.current;
    // Swipe orizzontale verso destra (gesto back standard iOS) o verso sinistra
    if (Math.abs(dx) > 60 && Math.abs(dy) < Math.abs(dx) * 0.6) {
      router.back();
    }
  }, [router]);

  return (
    <div
      className="min-h-[100svh] bg-nero"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {n.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={n.image} alt="" className="w-full aspect-video object-cover" />
      )}
      <div className="px-5 pt-6 pb-16">
        <Link
          href="/news"
          className="font-mono text-[13px] uppercase tracking-[0.18em] mb-6 inline-flex items-center gap-2"
          style={{ color: "var(--color-oro)" }}
        >
          ← News
        </Link>

        <p
          className="font-mono text-[13px] uppercase tracking-[0.18em] mt-5 mb-3"
          style={{ color: "var(--color-oro)" }}
        >
          {fmtDate(n.date)}
        </p>

        <h1 className="font-body font-extrabold text-[1.75rem] uppercase text-white leading-tight mb-6">
          {n.title}
        </h1>

        {n.body ? (
          <div className="space-y-5">
            {n.body.map((para, i) => (
              <p key={i} className="text-[15px] leading-relaxed" style={{ color: "rgba(255,255,255,0.8)" }}>
                {para}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-[15px] leading-relaxed" style={{ color: "rgba(255,255,255,0.8)" }}>
            {n.excerpt}
          </p>
        )}
      </div>
    </div>
  );
}
