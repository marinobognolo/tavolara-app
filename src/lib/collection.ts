export type RarityKey = "comune" | "rara" | "super" | "ultra" | "leggendaria";

export interface Rarity {
  id: RarityKey;
  short: string;
  label: string;
  rate: number;
  color: string;
  bg: string;
  glow: string;
}

export const RARITIES: Record<RarityKey, Rarity> = {
  comune: {
    id: "comune",
    short: "C",
    label: "Comune",
    rate: 0.45,
    color: "#9ca3af",
    bg: "linear-gradient(155deg, #282828 0%, #181818 60%, #202020 100%)",
    glow: "rgba(156,163,175,0.25)",
  },
  rara: {
    id: "rara",
    short: "R",
    label: "Rara",
    rate: 0.30,
    color: "#34d399",
    bg: "linear-gradient(155deg, #0a2e1c 0%, #062014 60%, #0a2a18 100%)",
    glow: "rgba(52,211,153,0.35)",
  },
  super: {
    id: "super",
    short: "SR",
    label: "Super Rara",
    rate: 0.15,
    color: "#38bdf8",
    bg: "linear-gradient(155deg, #0c1e36 0%, #061428 60%, #0a1a30 100%)",
    glow: "rgba(56,189,248,0.4)",
  },
  ultra: {
    id: "ultra",
    short: "UR",
    label: "Ultra Rara",
    rate: 0.08,
    color: "#c084fc",
    bg: "linear-gradient(155deg, #1a0830 0%, #120420 60%, #1a0830 100%)",
    glow: "rgba(192,132,252,0.5)",
  },
  leggendaria: {
    id: "leggendaria",
    short: "L",
    label: "Leggendaria",
    rate: 0.02,
    color: "#f4f4ff",
    bg: "linear-gradient(155deg, #111118 0%, #0d0d1a 60%, #111118 100%)",
    glow: "rgba(244,244,255,0.55)",
  },
};

export const RARITY_ORDER: RarityKey[] = ["comune", "rara", "super", "ultra", "leggendaria"];

export const PACKS_PER_DAY = 5;
export const CARDS_PER_PACK = 3;
export const REFILL_MS = 24 * 60 * 60 * 1000;

export function cardId(slug: string, rarity: RarityKey): string {
  return `${slug}::${rarity}`;
}

export function pickRarity(): RarityKey {
  const n = Math.random();
  let acc = 0;
  for (const key of RARITY_ORDER) {
    acc += RARITIES[key].rate;
    if (n < acc) return key;
  }
  return "comune";
}

export function openPack(): RarityKey[] {
  return Array.from({ length: CARDS_PER_PACK }, pickRarity);
}

const STORAGE_KEY = "tav_collection_v1";

export interface CollectionState {
  owned: Record<string, number>;
  packsLeft: number;
  refillAt: number;
}

function defaultState(): CollectionState {
  return {
    owned: {},
    packsLeft: PACKS_PER_DAY,
    refillAt: Date.now() + REFILL_MS,
  };
}

export function loadState(): CollectionState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const s = JSON.parse(raw) as CollectionState;
      if (Date.now() >= s.refillAt) {
        s.packsLeft = PACKS_PER_DAY;
        s.refillAt = Date.now() + REFILL_MS;
        saveState(s);
      }
      return s;
    }
  } catch {}
  return defaultState();
}

export function saveState(s: CollectionState) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  }
}
