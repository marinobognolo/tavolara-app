import type { Metadata } from "next";
import Link from "next/link";
import { NEWS, fmtDate } from "@/lib/data";

export const metadata: Metadata = { title: "News" };

export default function NewsPage() {
  return (
    <div className="min-h-[100svh] bg-nero">
      <div className="px-5 pt-12 pb-6">
        <p className="eyebrow mb-2">Dal club</p>
        <h1 className="font-display text-4xl uppercase text-avorio">News</h1>
      </div>

      <div className="px-5 pb-6 space-y-3">
        {NEWS.map((n) => (
          <Link key={n.slug} href={`/news/${n.slug}`}
            className="flex gap-4 border border-granito-2 bg-carbon p-4 transition-colors active:bg-granito">
            {n.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={n.image} alt="" className="h-20 w-20 shrink-0 object-cover" />
            )}
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-oro mb-1">{fmtDate(n.date)}</p>
              <p className="font-display text-lg uppercase text-avorio leading-tight">{n.title}</p>
              <p className="mt-1 text-xs text-avorio-dim line-clamp-2">{n.excerpt}</p>
            </div>
            <span className="text-avorio-dim/30 self-center shrink-0">›</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
