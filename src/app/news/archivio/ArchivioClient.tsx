"use client";

import { useState } from "react";
import Link from "next/link";
import { fmtDate, type NewsItem } from "@/lib/data";

type MonthGroup = { key: string; label: string; items: NewsItem[] };

export default function ArchivioClient({
  groups,
  currentKey,
}: {
  groups: MonthGroup[];
  currentKey: string;
}) {
  const [open, setOpen] = useState<Set<string>>(() => new Set([currentKey]));

  const toggle = (key: string) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div className="px-4 space-y-6">
      {groups.map((group) => {
        const isCurrent = group.key === currentKey;
        const isOpen = open.has(group.key);

        return (
          <div key={group.key}>
            {/* Etichetta mese — cliccabile solo per i mesi passati */}
            <button
              className="w-full flex items-center gap-3 mb-3"
              onClick={() => !isCurrent && toggle(group.key)}
              style={{ cursor: isCurrent ? "default" : "pointer" }}
            >
              <span
                className="font-mono text-[9px] uppercase tracking-[0.22em] capitalize"
                style={{ color: "var(--color-oro)" }}
              >
                {group.label}
              </span>
              <div className="flex-1 h-px" style={{ background: "rgba(201,168,106,0.18)" }} />
              {!isCurrent && (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgba(201,168,106,0.6)"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 shrink-0 transition-transform duration-300"
                  style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              )}
            </button>

            {/* News del mese */}
            {isOpen && (
              <div className="flex flex-col gap-2">
                {group.items.map((n) => (
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
                          <img src={n.image} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
