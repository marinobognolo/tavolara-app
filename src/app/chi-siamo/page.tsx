import type { Metadata } from "next";
import Link from "next/link";
import ClubShell from "@/components/ClubShell";

export const metadata: Metadata = { title: "Chi Siamo" };

const CHAPTERS = [
  {
    range: "1954 – 1959",
    title: "Le origini",
    paragraphs: [
      "Il Tavolara Calcio nasce a Olbia nel 1954, all'ombra della chiesa di San Paolo, dall'entusiasmo di un gruppo di giovani legati all'Azione Cattolica e al Centro Sportivo Italiano. A guidare quella prima avventura fu Pinuccio Deiana, fondatore e primo presidente, che nel 1956 iscrisse la squadra alla FIGC, dando forma a una delle società simbolo del calcio olbiese.",
      "Il nome Tavolara fu scelto in omaggio all'isola che domina il golfo; il verde e il bianco richiamavano la vegetazione dell'isola e l'identità cittadina di Olbia. Già nel 1959 arrivò una delle prime grandi soddisfazioni: il titolo sardo Juniores, conquistato battendo il Cagliari, con la successiva partecipazione alle finali nazionali di Carrara contro club come Juventus, Inter e Fiorentina.",
    ],
  },
  {
    range: "1970 – 1998",
    title: "Radici nel calcio sardo",
    paragraphs: [
      "Negli anni Settanta e Ottanta il Tavolara consolidò il proprio ruolo nel calcio regionale. La vittoria del campionato 1977-1978, decisa anche dallo storico spareggio contro il Berchidda a Calangianus, aprì la strada alla Promozione.",
      "Negli anni successivi la società rimase stabilmente tra le protagoniste del calcio sardo, fino all'approdo in Eccellenza dopo la riforma dei campionati regionali.",
    ],
  },
  {
    range: "1999 – 2009",
    title: "Gli anni d'oro",
    paragraphs: [
      "Il periodo più brillante della storia biancoverde arrivò tra la fine degli anni Novanta e il primo decennio del Duemila. Nel 1999-2000 il Tavolara vinse l'Eccellenza e conquistò la prima storica promozione in Serie D.",
      "Seguì una nuova fase di crescita: due Coppe Sardegna consecutive, nel 2004-2005 e nel 2005-2006, e nel 2006-2007 un nuovo titolo d'Eccellenza che riportò la squadra in Serie D.",
      "La Serie D fu il punto più alto del percorso sportivo: terzo posto nel girone G nel 2007-2008 e secondo nel 2008-2009, tra le migliori realtà dilettantistiche della Sardegna e del panorama nazionale di categoria.",
    ],
  },
  {
    range: "2010 – 2019",
    title: "Crisi e rinascita",
    paragraphs: [
      "Dopo gli anni d'oro arrivò una fase difficile. La retrocessione dalla Serie D nel 2010-2011, il ritorno in Eccellenza e poi la scomparsa del club al termine della stagione 2011-2012 segnarono uno dei momenti più delicati della storia societaria.",
      "La tradizione non si spense: il Tavolara fu rifondato come Gruppo Sportivo Tavolara 1954, ripartendo dalla Terza Categoria. Dopo una nuova interruzione nel 2016-2017, la società tornò in campo nel 2019 con la denominazione A.S.D. Tavolara Calcio, grazie al presidente Paolo Pirina, al suo vice Marco Bronzolo e al segretario Roberto Vitiello.",
    ],
  },
  {
    range: "2021 – 2024",
    title: "Post Covid",
    paragraphs: [
      "Superata l'emergenza sanitaria, il Tavolara aprì un ciclo lungo tre stagioni affidato all'allenatore Dario Muntoni, affiancato dal vice Alessandro Zuddas. Una gestione di continuità che restituì solidità all'ambiente e gettò le basi della risalita.",
      "Al secondo anno arrivò il primo grande risultato: la squadra chiuse al secondo posto il campionato di Terza Categoria, mancando la vetta soltanto all'ultima giornata. Il salto di categoria arrivò comunque, grazie al ripescaggio in Seconda Categoria, e nella stagione successiva il Tavolara centrò una salvezza tranquilla con quattro giornate d'anticipo.",
    ],
  },
  {
    range: "2024 – oggi",
    title: "Il nuovo corso",
    paragraphs: [
      "La rinascita recente ha preso forza con una nuova gestione e con il ritorno di figure legate alla storia del club. Nel 2024 la società ha celebrato i 70 anni e ha avviato un nuovo progetto sportivo — con Fulvio Guadagni presidente, Fabio Dettori direttore generale, Pierpaolo Pisanu direttore sportivo — puntando a ridare al Tavolara il ruolo di seconda squadra di Olbia.",
      "Nel 2025 l'ingresso di Damiano Brundu come presidente ha dato ulteriore slancio alla società. Con Michele Tamponi in panchina, il Tavolara ha affrontato la stagione 2025-2026 con ambizione e programmazione, chiudendola da imbattuti e conquistando la promozione in Prima Categoria.",
    ],
  },
];

const TIMELINE = [
  { year: "1954", title: "La fondazione", text: "Nasce a Olbia, all'ombra della chiesa di San Paolo. Primo presidente: Pinuccio Deiana." },
  { year: "1956", title: "Iscrizione alla FIGC", text: "Il club entra nei tornei federali." },
  { year: "1959", title: "Titolo sardo Juniores", text: "Battuto il Cagliari, poi le finali nazionali di Carrara contro Juventus, Inter e Fiorentina." },
  { year: "1978", title: "La Promozione", text: "Vinto il campionato 1977-1978 dopo lo spareggio con il Berchidda a Calangianus." },
  { year: "2000", title: "Prima storica Serie D", text: "Vinta l'Eccellenza 1999-2000: primo approdo in Serie D." },
  { year: "2005–06", title: "Due Coppe Sardegna", text: "Successi consecutivi in Coppa Sardegna." },
  { year: "2007", title: "Di nuovo in Serie D", text: "Nuovo titolo d'Eccellenza nel 2006-2007." },
  { year: "2009", title: "Ai vertici di categoria", text: "Terzi nel girone G (2007-08), secondi nel 2008-09." },
  { year: "2012", title: "La scomparsa", text: "Dopo la retrocessione del 2010-11, il club si scioglie. Sarà rifondato come G.S. Tavolara 1954." },
  { year: "2019", title: "La rinascita", text: "Rinasce come A.S.D. Tavolara Calcio con il presidente Paolo Pirina." },
  { year: "2023", title: "Ripescaggio in Seconda", text: "Secondo posto in Terza Categoria sfiorato all'ultima giornata, poi ripescaggio." },
  { year: "2024", title: "Settant'anni", text: "Nuovo progetto con Fulvio Guadagni presidente e Damiano Brundu." },
  { year: "2025", title: "Damiano Brundu presidente", text: "In panchina Michele Tamponi: ambizione e programmazione." },
  { year: "2026", title: "Promozione in Prima Categoria", text: "Vinto il Girone H di Seconda Categoria da imbattuti. Festa biancoverde." },
];

export default function ChiSiamoPage() {
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
          Dal 1954 · Olbia
        </p>
        <h1 className="font-body font-extrabold text-[2.4rem] uppercase text-white leading-none">
          La nostra<br />storia
        </h1>
        <p className="mt-4 text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
          Settant'anni di calcio biancoverde: una squadra che porta il nome dell'isola e la stessa testardaggine di chi resta in piedi nel mare.
        </p>
      </div>

      {/* Capitoli */}
      <div className="px-5 space-y-0">
        {CHAPTERS.map((ch, i) => (
          <div
            key={ch.title}
            className="py-8 border-t"
            style={{ borderColor: "rgba(255,255,255,0.07)" }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] mb-1" style={{ color: "var(--color-oro)" }}>
              {ch.range}
            </p>
            <h2 className="font-body font-extrabold text-[1.35rem] uppercase text-white mb-4">
              {ch.title}
            </h2>
            <div className="space-y-3">
              {ch.paragraphs.map((p, j) => (
                <p key={j} className="text-[13.5px] leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Promozione 2026 — banner */}
      <div className="mx-5 my-6 rounded-2xl overflow-hidden relative py-8 px-5 text-center">
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(201,168,106,0.12) 0%, rgba(201,168,106,0.04) 100%)", border: "1px solid rgba(201,168,106,0.2)" }} />
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] mb-2" style={{ color: "var(--color-oro)" }}>Stagione 2025–2026</p>
        <p className="font-body font-extrabold text-[1.6rem] uppercase text-white leading-tight">
          Promossi in<br />Prima Categoria
        </p>
        <div className="flex justify-center gap-6 mt-5">
          {[["68", "Punti"], ["21", "Vittorie"], ["0", "Sconfitte"], ["101", "Gol"]].map(([v, k]) => (
            <div key={k} className="text-center">
              <p className="font-body font-extrabold text-[1.5rem]" style={{ color: "var(--color-oro)" }}>{v}</p>
              <p className="font-mono text-[9px] uppercase tracking-wider text-white/40">{k}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Cronologia */}
      <div className="px-5 mt-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] mb-1" style={{ color: "var(--color-oro)" }}>Cronologia</p>
        <h2 className="font-body font-extrabold text-[1.8rem] uppercase text-white mb-8">Le tappe</h2>

        <ol className="border-l" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
          {TIMELINE.map((t) => (
            <li key={t.year + t.title} className="relative pl-6 pb-7 last:pb-0">
              <span
                className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full"
                style={{ background: "var(--color-oro)", boxShadow: "0 0 0 3px #14110c" }}
              />
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] mb-0.5" style={{ color: "var(--color-oro)" }}>
                {t.year}
              </p>
              <p className="font-body font-extrabold text-[0.95rem] uppercase text-white leading-snug">
                {t.title}
              </p>
              <p className="mt-1 text-[12px] leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                {t.text}
              </p>
            </li>
          ))}
        </ol>
      </div>

      {/* Link prima squadra */}
      <div className="px-5 mt-10">
        <Link
          href="/rosa"
          className="flex items-center justify-between px-5 py-4 rounded-2xl font-body font-extrabold text-[0.85rem] uppercase tracking-wider text-white"
          style={{ border: "1px solid rgba(201,168,106,0.3)", background: "rgba(201,168,106,0.05)" }}
        >
          <span>Scopri la prima squadra</span>
          <span style={{ color: "var(--color-oro)" }}>→</span>
        </Link>
      </div>

    </div>
    </ClubShell>
  );
}
