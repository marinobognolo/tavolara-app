"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 6) { setError("Il PIN deve essere di 6 cifre"); return; }
    setLoading(true);
    setError("");
    const res = await login(nickname.trim(), pin);
    setLoading(false);
    if (!res.ok) { setError(res.error ?? "Errore"); return; }
    if (res.mustChangePin) {
      sessionStorage.setItem("tav_pending_nick", nickname.trim());
      router.push("/change-pin");
    } else {
      router.push("/game");
    }
  };

  return (
    <div className="min-h-[100svh] relative flex flex-col" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 2rem)" }}>
      {/* BG */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(145deg, #0e0820 0%, #0d0b08 60%, #0e0820 100%)" }} />
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "linear-gradient(rgba(201,168,106,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,106,1) 1px, transparent 1px)", backgroundSize: "38px 38px" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 50% at 50% 35%, rgba(90,20,200,0.2) 0%, transparent 65%)" }} />


      {/* Content */}
      <form onSubmit={handleSubmit} className="relative flex-1 flex flex-col items-center justify-center px-8 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-tavolara-gold.png" alt="Tavolara" className="h-16 object-contain mb-8" style={{ filter: "brightness(0) invert(1)" }} />

        <p className="font-body font-extrabold text-[1rem] uppercase tracking-[0.18em] text-white/50 mb-1">Welcome to</p>
        <h1 className="font-body font-extrabold uppercase leading-none mb-10" style={{ fontSize: "2rem", color: "var(--color-oro)" }}>
          TAV GAME
        </h1>

        <div className="w-full max-w-xs space-y-5">
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="NICKNAME"
            autoComplete="username"
            className="w-full bg-transparent text-center font-mono text-[0.9rem] uppercase tracking-[0.15em] text-white placeholder:text-white/25 outline-none py-4"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.2)" }}
          />
          <input
            type="password"
            inputMode="numeric"
            maxLength={6}
            value={pin}
            onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 6); setPin(v); }}
            placeholder="PIN 6 CIFRE"
            autoComplete="current-password"
            className="w-full bg-transparent text-center font-mono text-[0.9rem] tracking-[0.4em] text-white placeholder:text-white/25 outline-none py-4"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.2)" }}
          />

          {error && <p className="font-mono text-[0.62rem] uppercase" style={{ color: "#ef4444" }}>{error}</p>}

          <button
            type="submit"
            disabled={loading || nickname.length < 3 || pin.length !== 6}
            className="w-full py-4 font-body font-extrabold text-[0.82rem] uppercase tracking-wider text-white mt-2 transition-opacity"
            style={{ border: "2px solid white", opacity: (loading || nickname.length < 3 || pin.length !== 6) ? 0.35 : 1 }}
          >
            {loading ? "..." : "ENTRA"}
          </button>
        </div>

        {/* Crea account */}
        <Link href="/register" className="mt-8 font-mono text-[0.62rem] uppercase tracking-wider" style={{ color: "var(--color-oro)" }}>
          Non hai un account? <span className="underline">Crealo qui</span>
        </Link>

        {/* Recupero PIN */}
        <div className="mt-6">
          <p className="font-mono text-[0.55rem] uppercase tracking-wider mb-3" style={{ color: "rgba(255,255,255,0.3)" }}>
            Hai dimenticato il PIN? Contattaci
          </p>
          <div className="flex items-center justify-center gap-5">
            {/* Instagram */}
            <a href="https://www.instagram.com/tavolara_calcio" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" style={{ color: "rgba(255,255,255,0.5)" }}>
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
              </svg>
            </a>
            {/* Facebook */}
            <a href="https://www.facebook.com/tavolara.calcio" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" style={{ color: "rgba(255,255,255,0.5)" }}>
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
              </svg>
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}
