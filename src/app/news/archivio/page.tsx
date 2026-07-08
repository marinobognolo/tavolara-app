import type { Metadata } from "next";
import Link from "next/link";
import { NEWS, type NewsItem } from "@/lib/data";
import ArchivioClient from "./ArchivioClient";

export const metadata: Metadata = { title: "Archivio News" };

type MonthGroup = { key: string; label: string; items: NewsItem[] };

function groupByMonth(news: NewsItem[]): MonthGroup[] {
  const map = new Map<string, MonthGroup>();
  for (const item of news) {
    const d = new Date(item.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("it-IT", { month: "long", year: "numeric" });
    if (!map.has(key)) map.set(key, { key, label, items: [] });
    map.get(key)!.items.push(item);
  }
  return Array.from(map.values());
}

export default function ArchivioPage() {
  const groups = groupByMonth(NEWS);
  const now = new Date();
  const currentKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  return (
    <div className="min-h-[100svh] pb-28" style={{ backgroundColor: "var(--color-nero)" }}>

      {/* Header */}
      <div className="relative px-6 pt-24 pb-6">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(201,168,106,0.08) 0%, transparent 70%)" }}
        />
        <p className="font-mono text-[9px] uppercase tracking-[0.28em] relative" style={{ color: "var(--color-oro)" }}>
          Tavolara Calcio
        </p>
        <h1 className="font-body font-extrabold text-[2rem] uppercase text-white leading-none relative mt-1">
          Archivio
        </h1>
      </div>

      <ArchivioClient groups={groups} currentKey={currentKey} />

    </div>
  );
}
