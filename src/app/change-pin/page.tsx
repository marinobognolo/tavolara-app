"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function ChangePinPage() {
  const { changePin } = useAuth();
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [pin, setPin] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const nick = sessionStorage.getItem("tav_pending_nick");
    if (!nick) { router.replace("/login"); return; }
    setNickname(nick);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin !== confirm) { setError("I PIN non coincidono"); return; }
    if (pin.length !== 6) { setError("Il PIN deve essere di 6 cifre"); return; }
    setLoading(true);
    setError("");
    const res = await changePin(nickname, pin);
    setLoading(false);
    if (!res.ok) { setError(res.error ?? "Errore"); return; }
    sessionStorage.removeItem("tav_pending_nick");
    router.push("/game");
  };

  const canSubmit = pin.length === 6 && confirm.length === 6 && !loading;

  return (
    <div className="min-h-[100svh] relative flex flex-col" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 2rem)" }}>
      {/* BG */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(145deg, #0e0820 0%, #0d0b08 60%, #0e0820 100%)" }} />
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "linear-gradient(rgba(201,168,106,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,106,1) 1px, transparent 1px)", backgroundSize: "38px 38px" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 50% at 50% 35%, rgba(90,20,200,0.2) 0%, transparent 65%)" }} />

      <form onSubmit={handleSubmit} className="relative flex-1 flex flex-col items-center justify-center px-8 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-tavolara-gold.png" alt="Tavolara" className="h-14 object-contain mb-6" style={{ filter: "brightness(0) invert(1)" }} />

        <p className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-white/40 mb-2">
          Ciao, {nickname || "…"}
        </p>
        <h1 className="font-body font-extrabold uppercase leading-none mb-3" style={{ fontSize: "1.6rem", color: "var(--color-oro)" }}>
          Scegli il tuo PIN
        </h1>
        <p className="font-mono text-[0.58rem] uppercase tracking-wider text-white/40 mb-8">
          Il tuo accesso temporaneo è scaduto.<br />Crea un nuovo PIN personale.
        </p>

        <div className="w-full max-w-xs space-y-5">
          <input
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 6); setPin(v); }}
            placeholder="NUOVO PIN 6 CIFRE"
            autoComplete="new-password"
            className="w-full bg-transparent text-center font-mono text-[0.9rem] tracking-[0.4em] text-white placeholder:text-white/25 outline-none py-4"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.2)" }}
          />
          <input
            type="password"
            inputMode="numeric"
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
            {loading ? "..." : "SALVA PIN"}
          </button>
        </div>
      </form>
    </div>
  );
}
