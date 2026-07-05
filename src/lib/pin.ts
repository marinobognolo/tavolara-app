const SALT = process.env.PIN_SALT ?? "tavolara_calcio_2026_secret";

export async function hashPin(pin: string, nickname: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${pin}:${nickname.toLowerCase()}:${SALT}`);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
