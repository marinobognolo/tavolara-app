"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [pin, setPin] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin !== confirm) { setError("I PIN non coincidono"); return; }
    if (pin.length !== 6) { setError("Il PIN deve essere di 6 cifre"); return; }
    setLoading(true);
    setError("");
    const res = await register(nickname.trim(), pin);
    setLoading(false);
    if (!res.ok) { setError(res.error ?? "Errore"); return; }
    router.push("/game");
  };

  const canSubmit = nickname.length >= 3 && pin.length === 6 && confirm.length === 6 && !loading;

  return (
    <div className="min-h-[100svh] relative flex flex-col" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 2rem)" }}>
      {/* BG */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(145deg, #0e0820 0%, #0d0b08 60%, #0e0820 100%)" }} />
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "linear-gradient(rgba(201,168,106,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,106,1) 1px, transparent 1px)", backgroundSize: "38px 38px" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 50% at 50% 35%, rgba(90,20,200,0.2) 0%, transparent 65%)" }} />

      {/* Back */}
      <div className="relative px-5 flex items-center" style={{ paddingTop: "calc(env(safe-area-inset-top) + 14px)", paddingBottom: "14px" }}>
        <button onClick={() => router.back()} className="p-1 text-white" aria-label="Indietro">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="relative flex-1 flex flex-col items-center justify-center px-8 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-tavolara-gold.png" alt="Tavolara" className="h-14 object-contain mb-6" style={{ filter: "brightness(0) invert(1)" }} />

        <p className="font-body font-extrabold text-[0.85rem] uppercase tracking-[0.18em] text-white/50 mb-1">Crea il tuo profilo</p>
        <h1 className="font-body font-extrabold uppercase leading-none mb-8" style={{ fontSize: "1.75rem", color: "var(--color-oro)" }}>
          TAV GAME
        </h1>

        <div className="w-full max-w-xs space-y-5">
          <div className="text-left">
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value.replace(/\s/g, "").slice(0, 20))}
              placeholder="NICKNAME"
              autoComplete="username"
              className="w-full bg-transparent text-center font-mono text-[0.9rem] uppercase tracking-[0.15em] text-white placeholder:text-white/25 outline-none py-4"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.2)" }}
            />
            <p className="font-mono text-[0.5rem] uppercase mt-1 text-right" style={{ color: "rgba(255,255,255,0.25)" }}>
              3–20 caratteri, no spazi
            </p>
          </div>

          <input
            type="password"
            inputMode="numeric"
            maxLength={6}
            value={pin}
            onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 6); setPin(v); }}
            placeholder="PIN 6 CIFRE"
            autoComplete="new-password"
            className="w-full bg-transparent text-center font-mono text-[0.9rem] tracking-[0.4em] text-white placeholder:text-white/25 outline-none py-4"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.2)" }}
          />
          <input
            type="password"
            inputMode="numeric"
            maxLength={6}
            value={confirm}
            onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 6); setConfirm(v); }}
            placeholder="CONFERMA PIN"
            autoComplete="new-password"
            className="w-full bg-transparent text-center font-mono text-[0.9rem] tracking-[0.4em] text-white placeholder:text-white/25 outline-none py-4"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.2)" }}
          />

          {error && <p className="font-mono text-[0.62rem] uppercase" style={{ color: "#ef4444" }}>{error}</p>}

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full py-4 font-body font-extrabold text-[0.82rem] uppercase tracking-wider text-white mt-2 transition-opacity"
            style={{ border: "2px solid white", opacity: canSubmit ? 1 : 0.35 }}
          >
            {loading ? "..." : "REGISTRATI"}
          </button>
        </div>

        <Link href="/login" className="mt-8 font-mono text-[0.62rem] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>
          Hai già un account? <span className="underline">Accedi</span>
        </Link>
      </form>
    </div>
  );
}
