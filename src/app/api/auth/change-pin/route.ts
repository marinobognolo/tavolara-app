import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { hashPin } from "@/lib/pin";

export async function POST(req: NextRequest) {
  const { nickname, currentPin, newPin } = await req.json();

  if (!nickname || !newPin || !/^\d{6}$/.test(newPin)) {
    return NextResponse.json({ error: "Dati non validi" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("gamers")
    .select("pin_hash, must_change_pin")
    .eq("nickname", nickname.trim())
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Utente non trovato" }, { status: 404 });
  }

  // Se non è un reset forzato, verifica il PIN corrente
  if (!data.must_change_pin && currentPin) {
    const currentHash = await hashPin(currentPin, nickname);
    if (currentHash !== data.pin_hash) {
      return NextResponse.json({ error: "PIN attuale non valido" }, { status: 401 });
    }
  }

  const new_pin_hash = await hashPin(newPin, nickname);

  const { error: updateError } = await supabase
    .from("gamers")
    .update({ pin_hash: new_pin_hash, must_change_pin: false })
    .eq("nickname", nickname.trim());

  if (updateError) {
    return NextResponse.json({ error: "Errore aggiornamento PIN" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
