export function haptic(type: "light" | "medium" = "light") {
  if (typeof navigator === "undefined" || !navigator.vibrate) return;
  navigator.vibrate(type === "light" ? 6 : 14);
}
