import Link from "next/link";

export default function ComingSoon({ label }: { label: string }) {
  return (
    <div className="min-h-[100svh] relative flex flex-col items-center justify-center px-8 text-center">
      {/* BG */}
      <div className="absolute inset-0 bg-nero" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(201,168,106,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,106,1) 1px, transparent 1px)",
          backgroundSize: "38px 38px",
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse 70% 45% at 50% 45%, rgba(201,168,106,0.06) 0%, transparent 65%)" }}
      />

      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-tavolara-gold.png"
          alt="Tavolara"
          className="h-16 object-contain mx-auto mb-8"
          style={{ filter: "brightness(0) invert(1) sepia(1) saturate(3) hue-rotate(345deg) brightness(0.88)" }}
        />

        <p className="font-mono text-[0.58rem] uppercase tracking-[0.28em] mb-2" style={{ color: "var(--color-oro)" }}>
          {label}
        </p>
        <h1 className="font-body font-extrabold text-[2rem] uppercase text-white leading-tight mb-4">
          IN LAVORAZIONE
        </h1>
        <p className="font-mono text-[0.62rem] uppercase leading-relaxed mb-1" style={{ color: "rgba(255,255,255,0.45)" }}>
          Questa sezione è in manutenzione.
        </p>
        <p className="font-mono text-[0.62rem] uppercase leading-relaxed mb-10" style={{ color: "rgba(255,255,255,0.45)" }}>
          Presto uscirà — resta aggiornato!
        </p>

        <Link
          href="/"
          className="inline-block px-8 py-3 font-body font-extrabold text-[0.78rem] uppercase tracking-wider"
          style={{ border: "1px solid rgba(201,168,106,0.5)", color: "var(--color-oro)" }}
        >
          Torna alla Home
        </Link>
      </div>
    </div>
  );
}
