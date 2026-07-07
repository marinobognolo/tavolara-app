import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("tavgame_corsa")
      .select("nickname, score")
      .order("score", { ascending: false })
      .limit(10);
    if (error) return NextResponse.json([]);
    return NextResponse.json(data ?? []);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { nickname, score } = await req.json();
    if (!nickname || typeof score !== "number") {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    // Aggiorna solo se il nuovo punteggio è migliore
    const { data: existing } = await supabase
      .from("tavgame_corsa")
      .select("score")
      .eq("nickname", nickname)
      .single();

    if (!existing || score > existing.score) {
      await supabase
        .from("tavgame_corsa")
        .upsert({ nickname, score }, { onConflict: "nickname" });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
