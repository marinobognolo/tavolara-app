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

export type PlayerStats = {
  presenze: number;
  gol: number;
  assist: number;
  ammonizioni: number;
  espulsioni: number;
  cleanSheet?: number;   // portieri
  rigoriParati?: number; // portieri
};

export type Player = {
  slug: string;
  first: string;
  last: string;
  number: number;
  role: "Portiere" | "Difensore" | "Centrocampista" | "Attaccante";
  captain?: boolean;
  viceCaptain?: boolean;
  stats?: PlayerStats;
};

export const PLAYERS: Player[] = [
  { slug: "van-der-want", first: "Maarten", last: "Van Der Want", number: 22, role: "Portiere", captain: true,    stats: { presenze: 0, gol: 0, assist: 0, ammonizioni: 0, espulsioni: 0, cleanSheet: 0, rigoriParati: 0 } },
  { slug: "casu",         first: "Giovanni Maria", last: "Casu",  number: 1,  role: "Portiere",                   stats: { presenze: 0, gol: 0, assist: 0, ammonizioni: 0, espulsioni: 0, cleanSheet: 0, rigoriParati: 0 } },
  { slug: "masala",       first: "Ivan",  last: "Masala",         number: 12, role: "Portiere",                   stats: { presenze: 0, gol: 0, assist: 0, ammonizioni: 0, espulsioni: 0, cleanSheet: 0, rigoriParati: 0 } },
  { slug: "meloni",       first: "Marco", last: "Meloni",         number: 24, role: "Difensore",                  stats: { presenze: 0, gol: 0, assist: 0, ammonizioni: 0, espulsioni: 0 } },
  { slug: "varrucciu",    first: "Simone", last: "Varrucciu",     number: 18, role: "Difensore", viceCaptain: true, stats: { presenze: 0, gol: 0, assist: 0, ammonizioni: 0, espulsioni: 0 } },
  { slug: "raimo",        first: "Nicola", last: "Raimo",         number: 3,  role: "Difensore",                  stats: { presenze: 0, gol: 0, assist: 0, ammonizioni: 0, espulsioni: 0 } },
  { slug: "cugini",       first: "Vittorio", last: "Cugini",      number: 5,  role: "Difensore",                  stats: { presenze: 0, gol: 0, assist: 0, ammonizioni: 0, espulsioni: 0 } },
  { slug: "vannozzi",     first: "Saverio", last: "Vannozzi",     number: 6,  role: "Difensore",                  stats: { presenze: 0, gol: 0, assist: 0, ammonizioni: 0, espulsioni: 0 } },
  { slug: "ballatore",    first: "Francesco", last: "Ballatore",  number: 17, role: "Difensore",                  stats: { presenze: 0, gol: 0, assist: 0, ammonizioni: 0, espulsioni: 0 } },
  { slug: "larribite",    first: "Benjamin", last: "Larribite",   number: 21, role: "Difensore",                  stats: { presenze: 0, gol: 0, assist: 0, ammonizioni: 0, espulsioni: 0 } },
  { slug: "marongiu",     first: "Piero", last: "Marongiu",       number: 23, role: "Difensore",                  stats: { presenze: 0, gol: 0, assist: 0, ammonizioni: 0, espulsioni: 0 } },
  { slug: "mannoni",      first: "Francesco", last: "Mannoni",    number: 4,  role: "Centrocampista",             stats: { presenze: 0, gol: 0, assist: 0, ammonizioni: 0, espulsioni: 0 } },
  { slug: "gallo",        first: "Salvatore", last: "Gallo",      number: 8,  role: "Centrocampista",             stats: { presenze: 0, gol: 0, assist: 0, ammonizioni: 0, espulsioni: 0 } },
  { slug: "mancini",      first: "Roberto", last: "Mancini",      number: 11, role: "Centrocampista",             stats: { presenze: 0, gol: 0, assist: 0, ammonizioni: 0, espulsioni: 0 } },
  { slug: "chiappetta",   first: "Fausto", last: "Chiappetta",    number: 25, role: "Centrocampista",             stats: { presenze: 0, gol: 0, assist: 0, ammonizioni: 0, espulsioni: 0 } },
  { slug: "spigno",       first: "Pietro", last: "Spigno",        number: 28, role: "Centrocampista",             stats: { presenze: 0, gol: 0, assist: 0, ammonizioni: 0, espulsioni: 0 } },
  { slug: "valenti",      first: "Sergio Damian", last: "Valenti",number: 9,  role: "Attaccante",                 stats: { presenze: 0, gol: 0, assist: 0, ammonizioni: 0, espulsioni: 0 } },
  { slug: "bulla",        first: "Giovanni", last: "Bulla",       number: 7,  role: "Attaccante",                 stats: { presenze: 0, gol: 0, assist: 0, ammonizioni: 0, espulsioni: 0 } },
  { slug: "villa",        first: "Mauricio", last: "Villa",        number: 10, role: "Attaccante",                 stats: { presenze: 0, gol: 0, assist: 0, ammonizioni: 0, espulsioni: 0 } },
  { slug: "zela",         first: "Lorenzo", last: "Zela",          number: 27, role: "Attaccante",                 stats: { presenze: 0, gol: 0, assist: 0, ammonizioni: 0, espulsioni: 0 } },
  { slug: "barbuio",      first: "Mattias", last: "Barbuio",       number: 32, role: "Attaccante",                 stats: { presenze: 0, gol: 0, assist: 0, ammonizioni: 0, espulsioni: 0 } },
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
    slug: "staff-tecnico-2026-2027",
    title: "Ecco lo staff tecnico del Tavolara per la stagione 2026/2027",
    excerpt: "La società biancoverde comunica ufficialmente la composizione dello staff tecnico che guiderà la prima squadra nella stagione 2026/2027.",
    category: "Ufficiale",
    date: "2026-07-08",
    image: "/STAFF.png",
    body: [
      "Il Tavolara Calcio è lieto di comunicare ufficialmente la composizione dello staff tecnico che accompagnerà la prima squadra nella stagione sportiva 2026/2027, la prima in Prima Categoria dopo la storica promozione conquistata lo scorso campionato.",
      "A coordinare l'area sportiva è Pierpaolo Pisanu, Direttore Sportivo del club da tempo presenza fondamentale nella struttura biancoverde, punto di riferimento nella gestione della rosa e nel dialogo con lo staff tecnico.",
      "Alla guida tecnica della squadra ci sarà ancora Michele Tamponi, confermato come allenatore dopo una stagione straordinaria chiusa senza sconfitte. Al suo fianco, nel ruolo di vice allenatore, Checco Fera, anche lui confermato per garantire continuità al lavoro impostato negli ultimi mesi.",
      "La preparazione atletica sarà affidata a Guido Tamponi, nuovo innesto dello staff con un curriculum di tutto rispetto maturato tra Eccellenza e Serie D in realtà di spicco del calcio sardo come Budoni, Calangianus, Olbia Calcio e U.S. Tempio. La cura dei portieri resta invece nelle mani di Sergio Sergente, confermato nel suo ruolo con la fiducia totale della società.",
      "Completano lo staff Giovanni Ciaddu nel ruolo di massaggiatore — un ritorno in biancoverde per l'ex giocatore — ed Enzo Coscia, riconfermato magazziere per il terzo anno consecutivo.",
      "Un gruppo coeso, competente e profondamente legato ai colori biancoverdi. La società ringrazia ogni membro dello staff per la dedizione dimostrata e guarda con fiducia e ambizione alla nuova stagione.",
    ],
  },
  {
    slug: "enzo-coscia-magazziere",
    title: "Enzo Coscia confermato magazziere per la stagione 2026/2027",
    excerpt: "La società conferma Enzo Coscia nel ruolo di magazziere per la stagione 2026/2027.",
    category: "Ufficiale",
    date: "2026-07-06",
    image: "/coscia.png",
    body: [
      "La società Tavolara Calcio è lieta di comunicare la conferma di Enzo Coscia nel ruolo di magazziere della prima squadra per la stagione sportiva 2026/2027.",
      "Una conferma che rispecchia il clima di continuità e di fiducia che caratterizza il lavoro della società biancoverde. Enzo Coscia proseguirà il suo impegno al servizio del gruppo, garantendo quella cura e quella disponibilità che lo hanno contraddistinto nel corso delle stagioni precedenti.",
      "Il ruolo del magazziere è fondamentale nel quotidiano di una squadra: dalla gestione del materiale sportivo all'organizzazione del magazzino, dalla cura del kit gara al supporto nello svolgimento degli allenamenti. Un lavoro spesso silenzioso ma indispensabile per il buon funzionamento dell'intero sistema squadra.",
      "Con la conferma di Enzo Coscia, il Tavolara ribadisce la volontà di costruire un ambiente solido e coeso, in cui ogni membro dello staff rappresenta un tassello fondamentale del progetto. La sua presenza è una garanzia di professionalità e dedizione per tutta la società biancoverde.",
      "A Enzo va il ringraziamento della società per il lavoro svolto e il più sincero augurio di buon lavoro per la stagione 2026/2027.",
    ],
  },
  {
    slug: "guido-tamponi-preparatore-atletico",
    title: "Guido Tamponi è il nuovo preparatore atletico",
    excerpt: "La società è lieta di comunicare che Guido Tamponi ricoprirà il ruolo di preparatore atletico per la stagione 2026/2027.",
    category: "Ufficiale",
    date: "2026-07-01",
    image: "/GUIDO TAMPONI.png",
    body: [
      "La società Tavolara Calcio è lieta di comunicare che Guido Tamponi ricoprirà il ruolo di preparatore atletico della prima squadra per la stagione sportiva 2026/2027.",
      "Si tratta di un innesto importante all'interno dello staff tecnico biancoverde. Guido Tamponi arriva al Tavolara dopo esperienze significative maturate tra Eccellenza e Serie D, in realtà di prestigio del calcio sardo come Budoni, Calangianus, Olbia Calcio e U.S. Tempio.",
      "Il suo percorso professionale rappresenta una garanzia in termini di competenza, metodo e professionalità. Qualità che saranno fondamentali per accompagnare il gruppo durante tutta la stagione, dalla preparazione estiva al lavoro quotidiano sul campo.",
      "Il preparatore atletico avrà un ruolo centrale nella crescita della squadra, curando la condizione fisica degli atleti, la prevenzione degli infortuni e il miglioramento delle prestazioni. Un lavoro spesso silenzioso, ma determinante per affrontare al meglio gli impegni del campionato.",
      "Con l'arrivo di Guido Tamponi, il Tavolara rafforza ulteriormente il proprio staff e conferma la volontà di costruire un ambiente serio, organizzato e ambizioso, capace di affrontare la nuova stagione con entusiasmo e dedizione.",
      "A Guido va il benvenuto da parte di tutta la società biancoverde e l'augurio di buon lavoro per questa nuova avventura.",
    ],
  },
  {
    slug: "giovanni-ciaddu-massaggiatore",
    title: "Giovanni Ciaddu è il nuovo massaggiatore",
    excerpt: "Un ritorno in biancoverde: l'ex giocatore Giovanni Ciaddu entra nello staff per la stagione 2026/27.",
    category: "Ufficiale",
    date: "2026-06-24",
    image: "/ciaddu.jpg",
    body: [
      "Un ritorno che profuma di appartenenza e di passione per i colori biancoverdi. Giovanni Ciaddu entra ufficialmente nello staff del Tavolara Calcio come nuovo massaggiatore della prima squadra per la stagione sportiva 2026/27.",
      "Figura conosciuta nell'ambiente sportivo olbiese, Ciaddu ritrova il club con un ruolo diverso rispetto al passato. Dopo l'esperienza da giocatore, il suo percorso prosegue ora al servizio dello staff tecnico e degli atleti, mettendo a disposizione competenza, attenzione e conoscenza del mondo sportivo.",
      "Per il Tavolara si tratta di un innesto importante anche dal punto di vista umano. L'arrivo di un ex biancoverde all'interno dello staff rappresenta infatti un segnale di continuità con la storia del club e con quel senso di appartenenza che da sempre accompagna la società.",
      "Il ruolo del massaggiatore sarà fondamentale durante tutta la stagione: dalla gestione quotidiana degli allenamenti al supporto nel recupero fisico, fino alla cura degli atleti nei momenti più delicati del campionato. In un'annata che si preannuncia impegnativa, la presenza di una figura preparata e legata al territorio potrà rivelarsi un valore aggiunto per il gruppo.",
      "Con l'ingresso di Giovanni Ciaddu, il Tavolara rafforza dunque il proprio staff e riabbraccia una persona che conosce bene l'ambiente biancoverde. Un ritorno che unisce passato e futuro, esperienza e passione, con l'obiettivo di accompagnare la squadra nel migliore dei modi verso la nuova stagione.",
    ],
  },
  {
    slug: "sergio-sergente-preparatore-portieri",
    title: "Sergio Sergente confermato preparatore dei portieri per la stagione 2026/2027",
    excerpt: "La società conferma Sergio Sergente nel ruolo di preparatore dei portieri per la stagione 2026/2027.",
    category: "Ufficiale",
    date: "2026-06-24",
    image: "/sergente.png",
    body: [
      "La società Tavolara Calcio è lieta di comunicare la conferma di Sergio Sergente nel ruolo di preparatore dei portieri per la stagione sportiva 2026/2027.",
      "Una conferma importante all'interno dello staff tecnico biancoverde, nel segno della continuità e della fiducia. Sergio proseguirà il lavoro con gli estremi difensori della prima squadra, mettendo a disposizione esperienza, competenza e grande attenzione ai dettagli.",
      "Il ruolo del preparatore dei portieri è fondamentale nel percorso di crescita del gruppo. Allenamento specifico, cura della tecnica, mentalità e preparazione quotidiana sono aspetti decisivi per affrontare al meglio una stagione impegnativa.",
      "Con la conferma di Sergio Sergente, il Tavolara rafforza ulteriormente il proprio staff e prosegue nella costruzione di un ambiente serio, organizzato e motivato, pronto ad affrontare la nuova annata con entusiasmo e professionalità.",
      "A Sergio va il ringraziamento della società per il lavoro svolto e l'augurio di buon lavoro per la stagione 2026/2027.",
    ],
  },
  {
    slug: "checco-fera-vice-allenatore",
    title: "Checco Fera confermato vice allenatore per la stagione 2026/2027",
    excerpt: "La società conferma Checco Fera nel ruolo di vice allenatore per la stagione 2026/2027.",
    category: "Ufficiale",
    date: "2026-06-22",
    image: "/fera.png",
  },
  {
    slug: "mister-tamponi-confermato",
    title: "Mister Tamponi confermato per la stagione 2026/2027",
    excerpt: "La società riparte dalla guida tecnica che ha vinto il campionato.",
    category: "Ufficiale",
    date: "2026-06-22",
    image: "/tamponi.png",
    body: [
      "Il Tavolara riparte dalla sua guida tecnica. La società biancoverde ha confermato Michele Tamponi alla guida della prima squadra anche per la stagione sportiva 2026/2027, dando continuità al progetto che ha portato alla vittoria del campionato e alla promozione in Prima Categoria.",
      "Una scelta nel segno della fiducia e della programmazione. Dopo un'annata di grande livello, chiusa senza sconfitte e con un gruppo capace di imporsi per rendimento, solidità e mentalità, il club ha deciso di proseguire con l'allenatore che ha guidato la squadra verso il salto di categoria.",
      "La conferma di mister Tamponi rappresenta un punto fermo importante per il Tavolara, che si prepara ad affrontare una nuova stagione con ambizione e consapevolezza. La Prima Categoria sarà un banco di prova più impegnativo, ma la società ha scelto di ripartire dalle certezze costruite nell'ultimo campionato.",
      "Tamponi ha saputo dare identità, equilibrio e determinazione alla squadra, valorizzando il gruppo e trasmettendo una mentalità vincente. Il percorso compiuto nella scorsa stagione ha rafforzato il legame tra tecnico, società e ambiente biancoverde, creando le basi per guardare con fiducia al futuro.",
      "Con questa conferma, il Tavolara manda un segnale chiaro: continuità tecnica, serietà nel lavoro e volontà di consolidare quanto conquistato sul campo. La nuova stagione partirà da una certezza: Michele Tamponi sarà ancora il condottiero biancoverde.",
    ],
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
