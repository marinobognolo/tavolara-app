import type { Metadata } from "next";
import Link from "next/link";
import { NEWS, fmtDate } from "@/lib/data";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return NEWS.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const n = NEWS.find((x) => x.slug === slug);
  return { title: n?.title ?? "News" };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const n = NEWS.find((x) => x.slug === slug);
  if (!n) notFound();

  return (
    <div className="min-h-[100svh] bg-nero">
      {n.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={n.image} alt="" className="w-full aspect-video object-cover" />
      )}
      <div className="px-5 pt-6 pb-10">
        <Link href="/news" className="font-mono text-[9px] uppercase tracking-[0.2em] text-oro mb-6 inline-flex items-center gap-2">
          ← News
        </Link>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-oro mt-4 mb-2">{fmtDate(n.date)}</p>
        <h1 className="font-display text-3xl uppercase text-avorio leading-tight mb-6">{n.title}</h1>
        {n.body ? (
          <div className="space-y-4">
            {n.body.map((para, i) => (
              <p key={i} className="text-sm leading-relaxed text-avorio-dim">{para}</p>
            ))}
          </div>
        ) : (
          <p className="text-sm leading-relaxed text-avorio-dim">{n.excerpt}</p>
        )}
      </div>
    </div>
  );
}
