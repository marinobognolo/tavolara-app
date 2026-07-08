import { PLAYERS } from "@/lib/data";
import { readdir } from "fs/promises";
import path from "path";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PlayerClient from "./PlayerClient";

export async function generateStaticParams() {
  return PLAYERS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const player = PLAYERS.find((p) => p.slug === slug);
  if (!player) return {};
  return { title: `${player.first} ${player.last}` };
}

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const player = PLAYERS.find((p) => p.slug === slug);
  if (!player) notFound();

  let photoCount = 0;
  try {
    const dir = path.join(process.cwd(), "public", "giocatori", slug);
    const files = await readdir(dir);
    photoCount = files.filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f)).length;
  } catch {}

  return <PlayerClient player={player} photoCount={photoCount} />;
}
