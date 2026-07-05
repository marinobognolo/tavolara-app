import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { hashPin } from "@/lib/pin";

export async function POST(req: NextRequest) {
  const { nickname, pin } = await req.json();

  if (!nickname || !pin) {
    return NextResponse.json({ error: "Inserisci nickname e PIN" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("gamers")
    .select("nickname, pin_hash, must_change_pin")
    .eq("nickname", nickname.trim())
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Nickname o PIN non validi" }, { status: 401 });
  }

  const pin_hash = await hashPin(pin, nickname);
  if (pin_hash !== data.pin_hash) {
    return NextResponse.json({ error: "Nickname o PIN non validi" }, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    nickname: data.nickname,
    mustChangePin: data.must_change_pin,
  });
}
