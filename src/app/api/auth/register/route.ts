import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { hashPin } from "@/lib/pin";

export async function POST(req: NextRequest) {
  const { nickname, pin } = await req.json();

  if (!nickname || !pin || !/^\d{6}$/.test(pin)) {
    return NextResponse.json({ error: "Dati non validi" }, { status: 400 });
  }
  if (nickname.length < 3 || nickname.length > 20) {
    return NextResponse.json({ error: "Il nickname deve essere tra 3 e 20 caratteri" }, { status: 400 });
  }

  const pin_hash = await hashPin(pin, nickname);

  const { error } = await supabase.from("gamers").insert({
    nickname: nickname.trim(),
    pin_hash,
    must_change_pin: false,
  });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Nickname già in uso, scegline un altro" }, { status: 409 });
    }
    return NextResponse.json({ error: "Errore di registrazione" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, nickname: nickname.trim() });
}
