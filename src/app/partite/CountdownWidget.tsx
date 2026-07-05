"use client";

import { useEffect, useState } from "react";

function getCountdown(iso: string) {
  const diff = new Date(iso).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
  };
}

export function CountdownWidget({ datetime }: { datetime: string | null }) {
  const [cd, setCd] = useState(() => (datetime ? getCountdown(datetime) : null));

  useEffect(() => {
    if (!datetime) return;
    const id = setInterval(() => setCd(getCountdown(datetime)), 1000);
    return () => clearInterval(id);
  }, [datetime]);

  const units = [
    { label: "Giorni", val: cd?.d },
    { label: "Ore",    val: cd?.h },
    { label: "Min",    val: cd?.m },
    { label: "Sec",    val: cd?.s },
  ];

  return (
    <div className="w-full flex items-center justify-center gap-2 my-8">
      {units.map(({ label, val }, i) => (
        <div
          key={label}
          className="flex-1 flex flex-col items-center gap-1.5 py-3 rounded-2xl"
          style={{
            background: "rgba(201,168,106,0.06)",
            border: "1px solid rgba(201,168,106,0.15)",
          }}
        >
          <span
            className="font-mono font-bold tabular-nums"
            style={{ fontSize: "1.55rem", color: "var(--color-oro)", lineHeight: 1 }}
          >
            {val !== undefined ? String(val).padStart(2, "0") : "—"}
          </span>
          <span
            className="font-mono text-[7px] uppercase tracking-widest"
            style={{ color: "rgba(255,255,255,0.28)" }}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
