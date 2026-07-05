import type { Metadata } from "next";
import Link from "next/link";
import ClubShell from "@/components/ClubShell";

export const metadata: Metadata = { title: "Organigramma" };

const ORG = [
  {
    area: "Presidenza",
    members: [
      { name: "Damiano Brundu", role: "Presidente" },
      { name: "Fulvio Guadagni", role: "Vice Presidente" },
    ],
  },
  {
    area: "Dirigenza",
    members: [
      { name: "Fabio Dettori", role: "Direttore Generale" },
      { name: "Francesca Stangoni", role: "Segretario Generale / Sportivo" },
      { name: "Pierpaolo Pisanu", role: "Direttore Sportivo · Addetto Stampa" },
      { name: "Marco Usai", role: "Tesoriere" },
      { name: "Marco Bronzolo", role: "Dirigente" },
      { name: "Paolo Pirina", role: "Dirigente" },
      { name: "Massimo Bacciu", role: "Dirigente" },
      { name: "Paolino Varrucciu", role: "Dirigente" },
      { name: "Pietro Piroddi", role: "Dirigente" },
    ],
  },
  {
    area: "Safe Guarding",
    members: [
      { name: "Gabriele Multineddu", role: "Responsabile" },
    ],
  },
  {
    area: "Comunicazione",
    members: [
      { name: "Marino Bognolo", role: "Social Media Manager · Responsabile Comunicazione" },
      { name: "Immacolata Pisuttu", role: "Social Media Supervisor" },
      { name: "Francesco Baragone", role: "Fotografo" },
      { name: "Thiago Valenti", role: "Fotografo" },
    ],
  },
  {
    area: "Aiutanti",
    members: [
      { name: "Fabio Usai", role: "Aiutante" },
      { name: "Andrea Atzori", role: "Aiutante" },
      { name: "Dorin", role: "Aiutante" },
      { name: "Gianni", role: "Aiutante · Autista" },
    ],
  },
  {
    area: "Area Tecnica",
    members: [
      { name: "Michele Tamponi", role: "Allenatore" },
      { name: 'Francesco "Checco" Fera', role: "Vice Allenatore" },
      { name: "Sergio Sergente", role: "Preparatore dei Portieri" },
      { name: "Guido Tamponi", role: "Preparatore Atletico" },
      { name: "Giovanni Ciaddu", role: "Massaggiatore" },
      { name: 'Vincenzo "Enzo" Coscia', role: "Magazziniere" },
    ],
  },
];

export default function OrganigrammaPage() {
  const presidenza = ORG.find((g) => g.area === "Presidenza")!;
  const presidente = presidenza.members[0];
  const vice = presidenza.members[1];
  const groups = ORG.filter((g) => g.area !== "Presidenza");

  return (
    <ClubShell>
    <div className="min-h-[100svh] bg-nero pb-24">

      {/* Hero */}
      <div className="relative px-5 pt-24 pb-10">
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: "linear-gradient(rgba(201,168,106,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,106,1) 1px, transparent 1px)",
            backgroundSize: "38px 38px",
          }}
        />
        <Link href="/club" className="font-mono text-[12px] uppercase tracking-[0.18em] mb-5 inline-flex items-center gap-2 relative" style={{ color: "var(--color-oro)" }}>
          ← Club
        </Link>
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] mb-3" style={{ color: "var(--color-oro)" }}>
          L'organigramma
        </p>
        <h1 className="font-body font-extrabold text-[2.4rem] uppercase text-white leading-none">
          Dirigenza
        </h1>
        <p className="mt-4 text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
          Le persone che guidano il Tavolara Calcio, dentro e fuori dal campo.
        </p>
      </div>

      <div className="px-5 space-y-8">

        {/* Presidente in evidenza */}
        <div
          className="rounded-2xl p-6 text-center"
          style={{ border: "1px solid rgba(201,168,106,0.4)", background: "rgba(201,168,106,0.05)" }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] mb-2" style={{ color: "var(--color-oro)" }}>
            {presidente.role}
          </p>
          <p className="font-body font-extrabold text-[1.6rem] uppercase text-white">
            {presidente.name}
          </p>
        </div>

        {/* Vice Presidente */}
        <div
          className="rounded-2xl p-5 text-center"
          style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] mb-1.5" style={{ color: "var(--color-oro)" }}>
            {vice.role}
          </p>
          <p className="font-body font-extrabold text-[1.2rem] uppercase text-white">
            {vice.name}
          </p>
        </div>

        {/* Gruppi */}
        {groups.map((group) => (
          <div key={group.area}>
            <div className="flex items-center gap-3 mb-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: "var(--color-oro)" }}>
                {group.area}
              </p>
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
              {group.members.map((m, i) => (
                <div
                  key={m.name}
                  className="px-5 py-4"
                  style={{
                    borderTop: i > 0 ? "1px solid rgba(255,255,255,0.05)" : undefined,
                    background: "var(--color-carbon)",
                  }}
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] mb-0.5" style={{ color: "var(--color-oro)" }}>
                    {m.role}
                  </p>
                  <p className="font-body font-extrabold text-[1rem] uppercase text-white">
                    {m.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}

        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-center pb-2" style={{ color: "rgba(255,255,255,0.25)" }}>
          Organigramma in aggiornamento
        </p>
      </div>
    </div>
    </ClubShell>
  );
}
