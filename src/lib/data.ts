export const SITE = {
  name: "Tavolara Calcio",
  short: "Tavolara",
  founded: 1954,
  city: "Olbia",
  league: "Prima Categoria",
  social: {
    instagram: "https://www.instagram.com/tavolaracalcio1954/",
    facebook: "https://www.facebook.com/asdtavolaracalcio/?locale=it_IT",
  },
};

export const NEXT_MATCH = {
  opponent: "Da definire",
  home: true,
  competition: "Prima Categoria",
  round: "1ª giornata",
  datetime: "2026-09-13T16:00:00",
  venue: "Geovillage, Olbia",
};

export type Player = {
  slug: string;
  first: string;
  last: string;
  number: number;
  role: "Portiere" | "Difensore" | "Centrocampista" | "Attaccante";
  captain?: boolean;
  viceCaptain?: boolean;
};

export const PLAYERS: Player[] = [
  { slug: "van-der-want", first: "Maarten", last: "Van Der Want", number: 22, role: "Portiere", captain: true },
  { slug: "casu", first: "Gianmarco", last: "Casu", number: 1, role: "Portiere" },
  { slug: "meloni", first: "Marco", last: "Meloni", number: 24, role: "Difensore" },
  { slug: "varrucciu", first: "Stefano", last: "Varrucciu", number: 18, role: "Difensore", viceCaptain: true },
  { slug: "raimo", first: "Nicolò", last: "Raimo", number: 3, role: "Difensore" },
  { slug: "larribite", first: "Bryan", last: "Larribite", number: 21, role: "Difensore" },
  { slug: "marongiu", first: "Paolo", last: "Marongiu", number: 23, role: "Difensore" },
  { slug: "ballatore", first: "Filippo", last: "Ballatore", number: 17, role: "Difensore" },
  { slug: "gallo", first: "Stefano", last: "Gallo", number: 8, role: "Centrocampista" },
  { slug: "mannoni", first: "Federico", last: "Mannoni", number: 4, role: "Centrocampista" },
  { slug: "chiappetta", first: "Filippo", last: "Chiappetta", number: 25, role: "Centrocampista" },
  { slug: "spigno", first: "Paride", last: "Spigno", number: 28, role: "Centrocampista" },
  { slug: "mancini", first: "Roberto", last: "Mancini", number: 11, role: "Centrocampista" },
  { slug: "zela", first: "Lorenzo", last: "Zela", number: 27, role: "Attaccante" },
  { slug: "valenti", first: "Stefano", last: "Valenti", number: 9, role: "Attaccante" },
  { slug: "bulla", first: "Giacomo", last: "Bulla", number: 7, role: "Attaccante" },
  { slug: "barbuio", first: "Marco", last: "Barbuio", number: 32, role: "Attaccante" },
  { slug: "cugini", first: "Vittorio", last: "Cugini", number: 5, role: "Difensore" },
  { slug: "vannozzi", first: "Samuele", last: "Vannozzi", number: 6, role: "Difensore" },
  { slug: "masala", first: "Andrea", last: "Masala", number: 14, role: "Centrocampista" },
  { slug: "becconi", first: "Lorenzo", last: "Becconi", number: 10, role: "Attaccante" },
];

export const ROLE_ORDER = ["Portieri", "Difensori", "Centrocampisti", "Attaccanti"] as const;

export type NewsItem = {
  slug: string;
  title: string;
  excerpt: string;
  category?: string;
  date: string;
  image?: string;
  body?: string[];
};

export const NEWS: NewsItem[] = [
  {
    slug: "guido-tamponi-preparatore-atletico",
    title: "Guido Tamponi è il nuovo preparatore atletico",
    excerpt: "La società è lieta di comunicare che Guido Tamponi ricoprirà il ruolo di preparatore atletico per la stagione 2026/2027.",
    category: "Ufficiale",
    date: "2026-07-01",
    image: "/GUIDO TAMPONI.png",
    body: [
      "La società Tavolara Calcio è lieta di comunicare che Guido Tamponi ricoprirà il ruolo di preparatore atletico per la stagione 2026/2027.",
      "Reduce da esperienze importanti tra Eccellenza e Serie D, con realtà come Budoni, Calangianus, Olbia Calcio e U.S. Tempio, Guido metterà a disposizione del gruppo competenza, metodo e professionalità.",
      "Una figura importante all'interno dello staff tecnico, pronta a contribuire al percorso della squadra con serietà, passione e dedizione quotidiana.",
      "Buon lavoro, Guido.",
    ],
  },
  {
    slug: "giovanni-ciaddu-massaggiatore",
    title: "Giovanni Ciaddu è il nuovo massaggiatore",
    excerpt: "Un ritorno in biancoverde: l'ex giocatore Giovanni Ciaddu entra nello staff per la stagione 2026/27.",
    category: "Ufficiale",
    date: "2026-06-24",
    image: "/ciaddu.jpg",
  },
  {
    slug: "mister-tamponi-confermato",
    title: "Mister Tamponi confermato per la stagione 2026/2027",
    excerpt: "La società riparte dalla guida tecnica che ha vinto il campionato.",
    category: "Ufficiale",
    date: "2026-06-22",
    image: "/tamponi.png",
  },
  {
    slug: "checco-fera-vice-allenatore",
    title: "Checco Fera confermato vice allenatore per la stagione 2026/2027",
    excerpt: "La società conferma Checco Fera nel ruolo di vice allenatore per la stagione 2026/2027.",
    category: "Ufficiale",
    date: "2026-06-22",
  },
];

export function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric" });
}

export function countdown(isoDatetime: string) {
  const diff = new Date(isoDatetime).getTime() - Date.now();
  if (diff <= 0) return null;
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return { d, h, m };
}
