"use client";

import { useState } from "react";

type Tab = "partite" | "classifica" | "marcatori";

// ── TIPI ──────────────────────────────────────────────────────
type Match = { date: string; home: string; away: string; gH: number; gA: number; r: "V" | "P" | "S" };
type Season = { id: string; label: string; competition: string; promo?: string; matches: Match[] };
type Standing = { pos: number; team: string; g: number; v: number; p: number; s: number; gf: number; gs: number; pt: number; isUs?: boolean };
type Scorer = { name: string; team: string; goals: number; isUs?: boolean };
type TavScorer = { number?: number; first: string; last: string; goals: number };

// ── RISULTATI 2025/26 — ultime 5 (più recente prima) ──
const MATCHES_2526: Match[] = [
  { date: "2026-04-26", home: "Tavolara",           away: "F.C. Biasì",            gH: 5, gA: 1, r: "V" },
  { date: "2026-04-18", home: "Palau",               away: "Tavolara",              gH: 1, gA: 1, r: "P" },
  { date: "2026-04-12", home: "La Salette Olbia",   away: "Tavolara",              gH: 1, gA: 3, r: "V" },
  { date: "2026-03-28", home: "Tavolara",           away: "Porto San Paolo",        gH: 6, gA: 0, r: "V" },
  { date: "2026-03-21", home: "Funtanaliras",        away: "Tavolara",              gH: 0, gA: 2, r: "V" },
];

// ── RISULTATI 2024/25 — ultime 5 (più recente prima) ──
const MATCHES_2425: Match[] = [
  { date: "2025-05-04", home: "Codaruina",           away: "Tavolara",              gH: 1, gA: 4, r: "V" },
  { date: "2025-04-27", home: "Tavolara",            away: "Sporting Paduledda",   gH: 1, gA: 0, r: "V" },
  { date: "2025-04-20", home: "Tavolara",            away: "Atletico Castelsardo",  gH: 2, gA: 1, r: "V" },
  { date: "2025-04-13", home: "Trinità",              away: "Tavolara",              gH: 2, gA: 3, r: "V" },
  { date: "2025-04-06", home: "Tavolara",            away: "Alà",                   gH: 3, gA: 1, r: "V" },
];

// ── RISULTATI 2023/24 — ultimi 5 (più recente prima) ──
const MATCHES_2324: Match[] = [
  { date: "2024-04-28", home: "Supramonte",          away: "Tavolara",              gH: 5, gA: 0, r: "S" },
  { date: "2024-04-21", home: "Tavolara",            away: "Golfo Aranci",          gH: 1, gA: 2, r: "S" },
  { date: "2024-04-14", home: "Irgolese",             away: "Tavolara",              gH: 4, gA: 1, r: "S" },
  { date: "2024-04-07", home: "Tavolara",            away: "Don Cesare Delogu",     gH: 1, gA: 1, r: "P" },
  { date: "2024-03-31", home: "Atletico Phiniscollis", away: "Tavolara",            gH: 2, gA: 3, r: "V" },
];

// ── RISULTATI 2021/22 — ultime 5 (più recente prima) ──
const MATCHES_2122: Match[] = [
  { date: "2022-04-30", home: "Tre Monti",     away: "Tavolara",         gH: 2, gA: 0, r: "S" },
  { date: "2022-04-24", home: "Tavolara",      away: "Juve Luras",       gH: 6, gA: 0, r: "V" },
  { date: "2022-04-17", home: "Tavolara",      away: "Azzanì",           gH: 0, gA: 1, r: "S" },
  { date: "2022-04-10", home: "Audax Padru",   away: "Tavolara",         gH: 2, gA: 1, r: "S" },
  { date: "2022-04-03", home: "Tavolara",      away: "San Pantaleo 2020",gH: 2, gA: 0, r: "V" },
];

// ── RISULTATI 2022/23 — ultimi 5 (più recente prima) ──
const MATCHES_2223: Match[] = [
  { date: "2023-04-30", home: "Alà",                 away: "Tavolara",              gH: 2, gA: 4, r: "V" },
  { date: "2023-04-23", home: "Tavolara",            away: "Atletico Tomi's",       gH: 2, gA: 1, r: "V" },
  { date: "2023-04-16", home: "Tre Monti",            away: "Tavolara",              gH: 2, gA: 4, r: "V" },
  { date: "2023-04-09", home: "Tavolara",            away: "Azzanì",                gH: 2, gA: 2, r: "P" },
  { date: "2023-03-26", home: "Funtanaliras",         away: "Tavolara",              gH: 1, gA: 6, r: "V" },
];

const SEASONS: Season[] = [
  { id: "2025-26", label: "2025 / 26", competition: "Seconda Categoria · Girone H", promo: "★ Campioni — Promossi in Prima Categoria", matches: MATCHES_2526 },
  { id: "2024-25", label: "2024 / 25", competition: "Seconda Categoria · Girone H", matches: MATCHES_2425 },
  { id: "2023-24", label: "2023 / 24", competition: "Seconda Categoria · Girone F", matches: MATCHES_2324 },
  { id: "2022-23", label: "2022 / 23", competition: "Terza Categoria · Girone G",   matches: MATCHES_2223 },
  { id: "2021-22", label: "2021 / 22", competition: "Terza Categoria · Girone D",   matches: MATCHES_2122 },
];

// ── CLASSIFICHE ────────────────────────────────────────────────
const STANDINGS_2526: Standing[] = [
  { pos:  1, team: "Tavolara",              g: 26, v: 21, p: 5, s:  0, gf: 101, gs:  25, pt: 68, isUs: true },
  { pos:  2, team: "Golfo Aranci",          g: 26, v: 21, p: 4, s:  1, gf: 105, gs:  26, pt: 67 },
  { pos:  3, team: "Palau",                 g: 26, v: 19, p: 3, s:  4, gf:  66, gs:  30, pt: 60 },
  { pos:  4, team: "Porto San Paolo",       g: 26, v: 17, p: 2, s:  7, gf:  83, gs:  50, pt: 53 },
  { pos:  5, team: "Academy PR",            g: 26, v: 13, p: 5, s:  8, gf:  51, gs:  38, pt: 44 },
  { pos:  6, team: "Porto Cervo",           g: 26, v: 11, p: 6, s:  9, gf:  48, gs:  38, pt: 39 },
  { pos:  7, team: "Alà",                   g: 26, v: 10, p: 5, s: 11, gf:  53, gs:  56, pt: 35 },
  { pos:  8, team: "La Salette Olbia",      g: 26, v: 11, p: 0, s: 15, gf:  36, gs:  53, pt: 33 },
  { pos:  9, team: "F.C. Biasì",            g: 26, v:  9, p: 4, s: 13, gf:  37, gs:  63, pt: 31 },
  { pos: 10, team: "Funtanaliras",          g: 26, v:  7, p: 5, s: 14, gf:  41, gs:  58, pt: 26 },
  { pos: 11, team: "Trinità",               g: 26, v:  7, p: 2, s: 17, gf:  31, gs:  75, pt: 23 },
  { pos: 12, team: "Loiri",                 g: 26, v:  6, p: 4, s: 16, gf:  40, gs:  60, pt: 22 },
  { pos: 13, team: "Budonese",              g: 26, v:  5, p: 4, s: 17, gf:  27, gs:  68, pt: 19 },
  { pos: 14, team: "Siniscola 2010",        g: 26, v:  0, p: 1, s: 25, gf:  14, gs:  93, pt:  1 },
];

const STANDINGS_2425: Standing[] = [
  { pos:  1, team: "Lauras",                g: 28, v: 25, p: 3, s:  0, gf:  87, gs:  17, pt: 78 },
  { pos:  2, team: "Sporting Paduledda",    g: 28, v: 19, p: 4, s:  5, gf:  77, gs:  44, pt: 61 },
  { pos:  3, team: "Palau",                 g: 28, v: 18, p: 7, s:  3, gf:  55, gs:  24, pt: 61 },
  { pos:  4, team: "Andrea Doria Sedini",   g: 28, v: 12, p: 9, s:  7, gf:  49, gs:  42, pt: 45 },
  { pos:  5, team: "Tavolara",              g: 28, v: 12, p: 7, s:  9, gf:  53, gs:  44, pt: 43, isUs: true },
  { pos:  6, team: "Porto Cervo",           g: 28, v: 12, p: 6, s: 10, gf:  42, gs:  36, pt: 42 },
  { pos:  7, team: "Alà",                   g: 28, v: 10, p: 8, s: 10, gf:  43, gs:  43, pt: 38 },
  { pos:  8, team: "Santa Teresa Gallura",  g: 28, v:  9, p: 8, s: 11, gf:  41, gs:  51, pt: 35 },
  { pos:  9, team: "Funtanaliras",          g: 28, v:  8, p:10, s: 10, gf:  48, gs:  58, pt: 34 },
  { pos: 10, team: "Academy PR",            g: 28, v:  8, p: 8, s: 12, gf:  45, gs:  54, pt: 32 },
  { pos: 11, team: "Atletico Castelsardo",  g: 28, v: 10, p: 1, s: 17, gf:  50, gs:  59, pt: 31 },
  { pos: 12, team: "Golfo Aranci",          g: 28, v:  7, p: 4, s: 17, gf:  46, gs:  68, pt: 25 },
  { pos: 13, team: "Trinità",               g: 28, v:  6, p: 5, s: 17, gf:  40, gs:  72, pt: 23 },
  { pos: 14, team: "Codaruina",             g: 28, v:  5, p: 8, s: 15, gf:  44, gs:  60, pt: 23 },
  { pos: 15, team: "Berchidda",             g: 28, v:  4, p: 3, s: 21, gf:  35, gs:  83, pt: 15 },
];

const STANDINGS_2324: Standing[] = [
  { pos:  1, team: "Don Cesare Delogu",     g: 26, v: 19, p: 2, s:  5, gf:  67, gs:  29, pt: 59 },
  { pos:  2, team: "Lulese 1981",           g: 26, v: 18, p: 4, s:  4, gf:  56, gs:  30, pt: 58 },
  { pos:  3, team: "Supramonte",            g: 26, v: 15, p: 4, s:  7, gf:  53, gs:  32, pt: 49 },
  { pos:  4, team: "Calagonone",            g: 26, v: 15, p: 4, s:  7, gf:  49, gs:  35, pt: 49 },
  { pos:  5, team: "F.C. Biasì",            g: 26, v: 15, p: 4, s:  7, gf:  59, gs:  32, pt: 49 },
  { pos:  6, team: "Irgolese",              g: 26, v: 13, p: 4, s:  9, gf:  41, gs:  33, pt: 43 },
  { pos:  7, team: "Lodine Calcio 1983",    g: 26, v: 13, p: 3, s: 10, gf:  51, gs:  47, pt: 42 },
  { pos:  8, team: "Tavolara",              g: 26, v:  8, p: 5, s: 13, gf:  43, gs:  60, pt: 29, isUs: true },
  { pos:  9, team: "Santu Predu",           g: 26, v:  8, p: 5, s: 13, gf:  35, gs:  49, pt: 29 },
  { pos: 10, team: "Golfo Aranci",          g: 26, v:  8, p: 4, s: 14, gf:  43, gs:  56, pt: 28 },
  { pos: 11, team: "Siniscola 2010",        g: 26, v:  7, p: 6, s: 13, gf:  36, gs:  49, pt: 27 },
  { pos: 12, team: "Orani",                 g: 26, v:  8, p: 3, s: 15, gf:  39, gs:  51, pt: 27 },
  { pos: 13, team: "Gennargentu Desulo",    g: 26, v:  4, p: 6, s: 16, gf:  39, gs:  64, pt: 18 },
  { pos: 14, team: "Atletico Phiniscollis", g: 26, v:  0, p: 5, s: 21, gf:  28, gs:  88, pt:  5 },
];

const STANDINGS_2122: Standing[] = [
  { pos:  1, team: "Don Cesare Delogu",      g: 22, v: 18, p: 1, s:  3, gf:  77, gs:  29, pt: 55 },
  { pos:  2, team: "Audax Padru",             g: 22, v: 15, p: 3, s:  4, gf:  65, gs:  26, pt: 48 },
  { pos:  3, team: "M.B. Orange",             g: 22, v: 15, p: 3, s:  4, gf:  49, gs:  27, pt: 48 },
  { pos:  4, team: "Funtanaliras Monti",      g: 22, v: 14, p: 3, s:  5, gf:  67, gs:  27, pt: 45 },
  { pos:  5, team: "Atletico Tomi's Oschiri", g: 22, v: 14, p: 2, s:  6, gf:  52, gs:  25, pt: 44 },
  { pos:  6, team: "Azzanì",                  g: 22, v: 10, p: 1, s: 11, gf:  47, gs:  52, pt: 31 },
  { pos:  7, team: "Tavolara Calcio",         g: 22, v:  9, p: 3, s: 10, gf:  45, gs:  37, pt: 30, isUs: true },
  { pos:  8, team: "S.M. Alzachena",          g: 22, v:  8, p: 3, s: 11, gf:  39, gs:  49, pt: 27 },
  { pos:  9, team: "San Pantaleo 2020",       g: 22, v:  6, p: 4, s: 12, gf:  32, gs:  52, pt: 22 },
  { pos: 10, team: "Tre Monti",               g: 22, v:  4, p: 4, s: 14, gf:  28, gs:  57, pt: 16 },
  { pos: 11, team: "Aggius",                  g: 22, v:  3, p: 4, s: 15, gf:  27, gs:  75, pt: 13 },
  { pos: 12, team: "Juve Luras",              g: 22, v:  0, p: 1, s: 21, gf:  21, gs:  93, pt:  1 },
];

const STANDINGS_2223: Standing[] = [
  { pos:  1, team: "Golfo Aranci",          g: 24, v: 18, p: 4, s:  2, gf: 77, gs: 23, pt: 58 },
  { pos:  2, team: "Tavolara",              g: 24, v: 17, p: 5, s:  2, gf: 64, gs: 25, pt: 56, isUs: true },
  { pos:  3, team: "M.B. Orange",           g: 24, v: 15, p: 4, s:  5, gf: 54, gs: 33, pt: 49 },
  { pos:  4, team: "Atletico Tomi's",       g: 24, v: 15, p: 2, s:  7, gf: 52, gs: 25, pt: 47 },
  { pos:  5, team: "Funtanaliras",          g: 24, v: 13, p: 2, s:  9, gf: 58, gs: 37, pt: 41 },
  { pos:  6, team: "Audax Padru",           g: 24, v: 12, p: 4, s:  8, gf: 49, gs: 36, pt: 40 },
  { pos:  7, team: "Rudalza",               g: 24, v: 11, p: 5, s:  8, gf: 59, gs: 38, pt: 38 },
  { pos:  8, team: "La Tulese",             g: 24, v:  7, p: 7, s: 10, gf: 34, gs: 41, pt: 28 },
  { pos:  9, team: "Tre Monti",             g: 24, v:  7, p: 4, s: 13, gf: 42, gs: 63, pt: 25 },
  { pos: 10, team: "Aggius",                g: 24, v:  6, p: 3, s: 15, gf: 47, gs: 76, pt: 21 },
  { pos: 11, team: "Juve Luras",            g: 24, v:  5, p: 2, s: 17, gf: 28, gs: 65, pt: 17 },
  { pos: 12, team: "Azzanì",                g: 24, v:  3, p: 7, s: 14, gf: 19, gs: 48, pt: 16 },
  { pos: 13, team: "Alà",                   g: 24, v:  1, p: 3, s: 20, gf: 23, gs: 96, pt:  6 },
];

// ── MARCATORI GIRONE ───────────────────────────────────────────
const SCORERS_2526: Scorer[] = [
  { name: "Kozeli Romino",         team: "Porto San Paolo",       goals: 35 },
  { name: "Valenti Sergio Damian", team: "Tavolara",              goals: 32, isUs: true },
  { name: "Mulas Alessio",         team: "Golfo Aranci",          goals: 30 },
  { name: "Canu Sebastiano",       team: "Alà",                   goals: 20 },
  { name: "Ruzzittu Danilo",       team: "Golfo Aranci",          goals: 18 },
  { name: "Villa Mauricio",        team: "Tavolara",              goals: 18, isUs: true },
  { name: "Pisano Nicolò",         team: "Palau",                 goals: 18 },
  { name: "Fossati Giuseppe",      team: "Porto San Paolo",       goals: 17 },
  { name: "Saba Fabrizio",         team: "Academy PR",            goals: 14 },
  { name: "Zela Lorenzo",          team: "Tavolara",              goals: 14, isUs: true },
];

const SCORERS_2425: Scorer[] = [
  { name: "Valenti Sergio Damian", team: "Lauras",                goals: 30 },
  { name: "Seck Mane Moustapha",   team: "Sporting Paduledda",    goals: 23 },
  { name: "Inzaina Paolo",         team: "Sporting Paduledda",    goals: 23 },
  { name: "Deligios Costantino",   team: "Andrea Doria Sedini",   goals: 19 },
  { name: "Aloia Francesco",       team: "Tavolara",              goals: 17, isUs: true },
  { name: "Barbuio Matias",        team: "Lauras",                goals: 16 },
  { name: "Campana Gianluigi",     team: "Funtanaliras",          goals: 15 },
  { name: "Carbini Paolo",         team: "Golfo Aranci",          goals: 13 },
  { name: "Moore Antonello",       team: "Santa Teresa Gallura",  goals: 13 },
  { name: "Ghera Mario",           team: "Alà",                   goals: 13 },
];

const SCORERS_2324: Scorer[] = [
  { name: "Siazzu G.",             team: "Don Cesare Delogu",     goals: 33 },
  { name: "Marras P.",             team: "Lulese 1981",           goals: 24 },
  { name: "Muggianu D.",           team: "Calagonone",            goals: 23 },
  { name: "Mulas P.",              team: "Lodine Calcio 1983",    goals: 19 },
  { name: "Sansone D.",            team: "Gennargentu Desulo",    goals: 17 },
  { name: "Zedda D.",              team: "Lodine Calcio 1983",    goals: 15 },
  { name: "Maranzano S.",          team: "F.C. Biasì",            goals: 13 },
  { name: "Pintore M.",            team: "Supramonte",            goals: 13 },
  { name: "Mura M.",               team: "Santu Predu",           goals: 12 },
  { name: "Campa V.",              team: "F.C. Biasì",            goals: 11 },
];

const SCORERS_2122: Scorer[] = [
  { name: "La Vecchia Alessandro", team: "Audax Padru",             goals: 29 },
  { name: "Muresu Matteo",         team: "Don Cesare Delogu",       goals: 28 },
  { name: "Carta Marco",           team: "Azzanì",                  goals: 16 },
  { name: "Maludrottu Teo",        team: "Atletico Tomi's Oschiri", goals: 15 },
  { name: "Deiana Alessandro",     team: "Tavolara Calcio",         goals: 14, isUs: true },
  { name: "Borit Viorel",          team: "Don Cesare Delogu",       goals: 13 },
  { name: "Pusceddu Mauro",        team: "S.M. Alzachena",          goals: 11 },
  { name: "Falai Gianni",          team: "Audax Padru",             goals: 11 },
  { name: "Sini Lorenzo",          team: "Don Cesare Delogu",       goals: 10 },
  { name: "Francioni Fabio",       team: "Funtanaliras Monti",      goals: 10 },
];

const SCORERS_2223: Scorer[] = [
  { name: "Carbini P.",            team: "Golfo Aranci",          goals: 35 },
  { name: "Fogarizzu G.",          team: "Atletico Tomi's",       goals: 17 },
  { name: "Campesi M.",            team: "La Tulese",             goals: 17 },
  { name: "Piga S.",               team: "Aggius",                goals: 14 },
  { name: "De Petrillo F.",        team: "Funtanaliras",          goals: 14 },
  { name: "Kozeli G.",             team: "M.B. Orange",           goals: 13 },
  { name: "Bruno G.",              team: "Golfo Aranci",          goals: 13 },
  { name: "Faedda D.",             team: "Juve Luras",            goals: 13 },
  { name: "Zedde A.",              team: "Funtanaliras",          goals: 12 },
  { name: "Bolognesi N.",          team: "Rudalza",               goals: 12 },
];

// ── MARCATORI TAVOLARA ─────────────────────────────────────────
const TAV_SCORERS_2526: TavScorer[] = [
  { number:  9, first: "Sergio Damian", last: "Valenti",    goals: 32 },
  { number: 10, first: "Mauricio",      last: "Villa",      goals: 18 },
  { number: 27, first: "Lorenzo",       last: "Zela",       goals: 14 },
  { number:  7, first: "Giovanni",      last: "Bulla",      goals:  8 },
  { number: 25, first: "Fausto",        last: "Chiappetta", goals:  8 },
  { number:  4, first: "Francesco",     last: "Mannoni",    goals:  4 },
  { number:  3, first: "Nicola",        last: "Raimo",      goals:  3 },
  { number: 32, first: "Mattias",       last: "Barbuio",    goals:  2 },
  { number:  8, first: "Salvatore",     last: "Gallo",      goals:  2 },
  { number: 21, first: "Benjamin",      last: "Larribite",  goals:  2 },
  { number:  6, first: "Saverio",       last: "Vannozzi",   goals:  2 },
  { number: 28, first: "Pietro",        last: "Spigno",     goals:  1 },
  { number: 18, first: "Simone",        last: "Varrucciu",  goals:  1 },
];

const TAV_SCORERS_2425: TavScorer[] = [
  { first: "Francesco",  last: "Aloia",       goals: 17 },
  { first: "Gianluca",   last: "Siazzu",      goals: 11 },
  { first: "Antonio",    last: "Sias",        goals:  9 },
  { first: "Alessandro", last: "Deiana",      goals:  4 },
  { first: "Umberto",    last: "Cavallaro",   goals:  3 },
  { first: "Alessio",    last: "Asole",       goals:  2 },
  { first: "Elia",       last: "Ragaglia",    goals:  2 },
  { first: "Vincenzo",   last: "Brondolone",  goals:  1 },
  { first: "Gabriele",   last: "Loi",         goals:  1 },
  { first: "Cristiano",  last: "Merone",      goals:  1 },
  { first: "Alessandro", last: "Rassu",       goals:  1 },
  { number: 6, first: "Saverio", last: "Vannozzi", goals: 1 },
];

const TAV_SCORERS_2324: TavScorer[] = [
  { first: "P.",  last: "Lai",        goals: 9 },
  { first: "P.",  last: "Acciaro",    goals: 8 },
  { first: "S.",  last: "Pedroni",    goals: 6 },
  { first: "S.",  last: "Scarfò",     goals: 6 },
  { first: "C.",  last: "Piccinnu",   goals: 3 },
  { first: "G.",  last: "Loi",        goals: 2 },
  { first: "A.",  last: "Asole",      goals: 1 },
  { first: "V.",  last: "Brondolone", goals: 1 },
  { first: "G.",  last: "Bronzolo",   goals: 1 },
  { first: "G.",  last: "Brugu",      goals: 1 },
];

const TAV_SCORERS_2122: TavScorer[] = [
  { first: "Alessandro", last: "Deiana",   goals: 14 },
  { first: "Alberto",    last: "Pricope",  goals: 10 },
  { first: "Samuele",    last: "Pedroni",  goals:  5 },
  { first: "Gabriele",   last: "Loi",      goals:  4 },
  { first: "Federico",   last: "Asara",    goals:  3 },
  { first: "Marino",     last: "Bognolo",  goals:  2 },
  { first: "Claudio",    last: "Ghisu",    goals:  2 },
  { first: "Gabriele",   last: "Mura",     goals:  2 },
  { first: "Paolo",      last: "Brundu",   goals:  1 },
  { first: "Gabriele",   last: "Careddu",  goals:  1 },
];

const TAV_SCORERS_2223: TavScorer[] = [
  { first: "P.",  last: "Lai",        goals: 12 },
  { first: "A.",  last: "Deiana",     goals: 11 },
  { first: "F.",  last: "Saba",       goals:  8 },
  { first: "F.",  last: "Asara",      goals:  6 },
  { first: "G.",  last: "Loi",        goals:  4 },
  { first: "S.",  last: "Scarfò",     goals:  4 },
  { first: "G.",  last: "Careddu",    goals:  3 },
  { first: "S.",  last: "Pedroni",    goals:  3 },
  { first: "C.",  last: "Ghisu",      goals:  2 },
  { first: "S.",  last: "Piras",      goals:  2 },
  { first: "A.",  last: "Pricope",    goals:  2 },
  { first: "A.",  last: "Secchi",     goals:  2 },
  { first: "G.",  last: "Velati",     goals:  2 },
  { first: "M.",  last: "Fenu",       goals:  1 },
  { first: "G.",  last: "Mura",       goals:  1 },
  { first: "A.",  last: "Pisuttu",    goals:  1 },
];

// ── HELPERS ────────────────────────────────────────────────────
const BADGE: Record<string, { bg: string; color: string }> = {
  V: { bg: "rgba(74,222,128,0.13)",  color: "#4ade80" },
  P: { bg: "rgba(250,204,21,0.13)",  color: "#facc15" },
  S: { bg: "rgba(248,113,113,0.13)", color: "#f87171" },
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("it-IT", { day: "2-digit", month: "short" }).toUpperCase();
}

function TavLogo({ size = 18 }: { size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/logo-tavolara-gold.png" alt="" aria-hidden
      style={{ width: size, height: size, objectFit: "contain", flexShrink: 0 }} />
  );
}

function SectionHeader({ label, sub }: { label: string; sub: string }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <p className="font-body font-extrabold text-[1.1rem] uppercase text-white">{label}</p>
        <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
      </div>
      <p className="font-mono text-[9px] uppercase tracking-[0.18em]" style={{ color: "rgba(255,255,255,0.35)" }}>{sub}</p>
    </div>
  );
}

function ScorerList({ title, scorers }: { title: string; scorers: Scorer[] }) {
  return (
    <div>
      <p className="font-mono text-[9px] uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>{title}</p>
      {scorers.length === 0 ? <Empty /> : (
        <div className="flex flex-col gap-1.5">
          {scorers.map((s, i) => (
            <div key={i} className="rounded-2xl px-4 py-3 flex items-center gap-3"
              style={{ background: s.isUs ? "rgba(201,168,106,0.07)" : "var(--color-carbon)", border: s.isUs ? "1px solid rgba(201,168,106,0.18)" : "none" }}>
              <span className="font-mono text-[11px] w-5 shrink-0" style={{ color: "rgba(255,255,255,0.3)" }}>{i + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  {s.isUs && <TavLogo size={14} />}
                  <span className="font-body font-extrabold text-sm uppercase truncate"
                    style={{ color: s.isUs ? "var(--color-oro)" : "white" }}>{s.name}</span>
                </div>
                <p className="font-mono text-[9px] uppercase tracking-wider mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{s.team}</p>
              </div>
              <div className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-mono font-bold text-sm"
                style={{ background: s.isUs ? "rgba(201,168,106,0.15)" : "rgba(255,255,255,0.06)", color: s.isUs ? "var(--color-oro)" : "white" }}>
                {s.goals}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TavScorerList({ title, scorers }: { title: string; scorers: TavScorer[] }) {
  const sorted = [...scorers].sort((a, b) => b.goals - a.goals);
  return (
    <div>
      <p className="font-mono text-[9px] uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>{title}</p>
      {sorted.length === 0 ? <Empty /> : (
        <div className="flex flex-col gap-1.5">
          {sorted.map((s, i) => (
            <div key={i} className="rounded-2xl px-4 py-3 flex items-center gap-3" style={{ background: "var(--color-carbon)" }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-mono text-xs font-bold"
                style={{ background: "rgba(201,168,106,0.1)", color: "var(--color-oro)", border: "1px solid rgba(201,168,106,0.2)" }}>
                {s.number ?? "—"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body font-extrabold text-sm uppercase text-white truncate">{s.first} {s.last}</p>
              </div>
              <div className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-mono font-bold text-sm"
                style={{ background: "rgba(201,168,106,0.15)", color: "var(--color-oro)" }}>
                {s.goals}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StandingsTable({ rows }: { rows: Standing[] }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "var(--color-carbon)" }}>
      <div className="grid px-3 py-2.5" style={{
        gridTemplateColumns: "20px 1fr 22px 22px 22px 26px 26px 30px",
        borderBottom: "1px solid rgba(255,255,255,0.06)"
      }}>
        {["#", "Squadra", "V", "P", "S", "GF", "GS", "Pt"].map((h) => (
          <span key={h} className="font-mono text-[8px] uppercase tracking-widest text-right first:text-left"
            style={{ color: "rgba(255,255,255,0.3)" }}>{h}</span>
        ))}
      </div>
      {rows.map((row, i) => (
        <div key={row.pos} className="grid px-3 py-2.5 items-center"
          style={{
            gridTemplateColumns: "20px 1fr 22px 22px 22px 26px 26px 30px",
            background: row.isUs ? "rgba(201,168,106,0.07)" : "transparent",
            borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : undefined,
          }}>
          <span className="font-mono text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>{row.pos}</span>
          <div className="flex items-center gap-1 min-w-0">
            {row.isUs && <TavLogo size={13} />}
            <span className="font-body font-extrabold text-[11px] uppercase truncate"
              style={{ color: row.isUs ? "var(--color-oro)" : "white" }}>
              {row.team}
            </span>
          </div>
          {[row.v, row.p, row.s, row.gf, row.gs, row.pt].map((val, j) => (
            <span key={j} className="font-mono text-[11px] text-right"
              style={{ color: j === 5 ? "var(--color-oro)" : "rgba(255,255,255,0.6)", fontWeight: j === 5 ? 700 : 400 }}>
              {val}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

function Empty({ text = "Dati in aggiornamento" }: { text?: string }) {
  return (
    <div className="rounded-2xl p-6 text-center" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
      <p className="font-mono text-[10px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.2)" }}>{text}</p>
    </div>
  );
}

// ── ACCORDION STAGIONE ─────────────────────────────────────────
function SeasonAccordion({
  label, sub, defaultOpen = false, badge, children,
}: {
  label: string; sub: string; defaultOpen?: boolean; badge?: string; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${open ? "rgba(201,168,106,0.22)" : "rgba(255,255,255,0.07)"}`, transition: "border-color 0.2s" }}>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-4 text-left"
        style={{ background: open ? "rgba(201,168,106,0.06)" : "var(--color-carbon)" }}
      >
        <div>
          <p className="font-body font-extrabold text-[1.05rem] uppercase text-white leading-none">{label}</p>
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>{sub}</p>
        </div>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
          strokeLinecap="round" strokeLinejoin="round"
          className="w-4 h-4 shrink-0 transition-transform duration-300"
          style={{ color: open ? "var(--color-oro)" : "rgba(255,255,255,0.35)", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="px-4 pb-4 pt-3 space-y-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          {badge && (
            <div className="px-3 py-1.5 rounded-xl inline-block font-mono text-[10px] uppercase tracking-wider"
              style={{ background: "rgba(201,168,106,0.1)", color: "var(--color-oro)", border: "1px solid rgba(201,168,106,0.25)" }}>
              {badge}
            </div>
          )}
          {children}
        </div>
      )}
    </div>
  );
}

// ── COMPONENTE PRINCIPALE ──────────────────────────────────────
export function PartiteTabs() {
  const [tab, setTab] = useState<Tab>("partite");

  return (
    <div className="px-5 pt-6 pb-10">

      {/* Tab switcher */}
      <div className="flex gap-1 mb-6 p-1 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)" }}>
        {(["partite", "classifica", "marcatori"] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className="flex-1 py-2.5 rounded-xl font-mono text-[9px] uppercase tracking-widest transition-all duration-200"
            style={tab === t ? { background: "var(--color-oro)", color: "#0d0b08" } : { color: "rgba(255,255,255,0.38)" }}>
            {t}
          </button>
        ))}
      </div>

      {/* ── TAB: PARTITE ── */}
      {tab === "partite" && (
        <div className="space-y-3">
          {SEASONS.map((season, idx) => (
            <SeasonAccordion
              key={season.id}
              label={season.label}
              sub={season.competition}
              defaultOpen={idx === 0}
              badge={season.promo}
            >
              {season.matches.length === 0 ? <Empty /> : (
                <div className="flex flex-col gap-2">
                  {season.matches.map((m, i) => {
                    const badge = BADGE[m.r];
                    const tavHome = m.home === "Tavolara";
                    return (
                      <div key={i} className="rounded-2xl p-4 flex items-center gap-3" style={{ background: "rgba(255,255,255,0.03)" }}>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-mono text-xs font-bold"
                          style={{ backgroundColor: badge.bg, color: badge.color }}>
                          {m.r}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1 leading-none">
                            <div className="flex-1 flex items-center gap-1 min-w-0 overflow-hidden">
                              <span className="font-body font-extrabold text-sm uppercase truncate"
                                style={{ color: tavHome ? "white" : "rgba(255,255,255,0.45)" }}>
                                {m.home}
                              </span>
                              {tavHome && <TavLogo />}
                            </div>
                            <span className="font-mono text-sm font-bold shrink-0 px-1.5" style={{ color: "var(--color-oro)" }}>
                              {m.gH}–{m.gA}
                            </span>
                            <div className="flex-1 flex items-center justify-end gap-1 min-w-0 overflow-hidden">
                              {!tavHome && <TavLogo />}
                              <span className="font-body font-extrabold text-sm uppercase truncate"
                                style={{ color: !tavHome ? "white" : "rgba(255,255,255,0.45)" }}>
                                {m.away}
                              </span>
                            </div>
                          </div>
                          <p className="font-mono text-[9px] uppercase tracking-wider mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                            {fmtDate(m.date)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </SeasonAccordion>
          ))}
        </div>
      )}

      {/* ── TAB: CLASSIFICA ── */}
      {tab === "classifica" && (
        <div className="space-y-3">
          <SeasonAccordion label="2026 / 27" sub="Prima Categoria" defaultOpen>
            <Empty text="Stagione non ancora iniziata" />
          </SeasonAccordion>
          <SeasonAccordion label="2025 / 26" sub="Seconda Categoria · Girone H" badge="★ Campioni — Promossi in Prima Categoria">
            <StandingsTable rows={STANDINGS_2526} />
          </SeasonAccordion>
          <SeasonAccordion label="2024 / 25" sub="Seconda Categoria · Girone H">
            <StandingsTable rows={STANDINGS_2425} />
          </SeasonAccordion>
          <SeasonAccordion label="2023 / 24" sub="Seconda Categoria · Girone F">
            <StandingsTable rows={STANDINGS_2324} />
          </SeasonAccordion>
          <SeasonAccordion label="2022 / 23" sub="Terza Categoria · Girone G">
            <StandingsTable rows={STANDINGS_2223} />
          </SeasonAccordion>
          <SeasonAccordion label="2021 / 22" sub="Terza Categoria · Girone D">
            <StandingsTable rows={STANDINGS_2122} />
          </SeasonAccordion>
        </div>
      )}

      {/* ── TAB: MARCATORI ── */}
      {tab === "marcatori" && (
        <div className="space-y-3">
          <SeasonAccordion label="2026 / 27" sub="Prima Categoria" defaultOpen>
            <Empty text="Stagione non ancora iniziata" />
          </SeasonAccordion>
          <SeasonAccordion label="2025 / 26" sub="Seconda Categoria · Girone H" badge="★ Campioni — Promossi in Prima Categoria">
            <ScorerList title="Classifica marcatori" scorers={SCORERS_2526} />
            <TavScorerList title="Marcatori Tavolara" scorers={TAV_SCORERS_2526} />
          </SeasonAccordion>
          <SeasonAccordion label="2024 / 25" sub="Seconda Categoria · Girone H">
            <ScorerList title="Classifica marcatori" scorers={SCORERS_2425} />
            <TavScorerList title="Marcatori Tavolara" scorers={TAV_SCORERS_2425} />
          </SeasonAccordion>
          <SeasonAccordion label="2023 / 24" sub="Seconda Categoria · Girone F">
            <ScorerList title="Classifica marcatori" scorers={SCORERS_2324} />
            <TavScorerList title="Marcatori Tavolara" scorers={TAV_SCORERS_2324} />
          </SeasonAccordion>
          <SeasonAccordion label="2022 / 23" sub="Terza Categoria · Girone G">
            <ScorerList title="Classifica marcatori" scorers={SCORERS_2223} />
            <TavScorerList title="Marcatori Tavolara" scorers={TAV_SCORERS_2223} />
          </SeasonAccordion>
          <SeasonAccordion label="2021 / 22" sub="Terza Categoria · Girone D">
            <ScorerList title="Classifica marcatori" scorers={SCORERS_2122} />
            <TavScorerList title="Marcatori Tavolara" scorers={TAV_SCORERS_2122} />
          </SeasonAccordion>
        </div>
      )}

    </div>
  );
}
