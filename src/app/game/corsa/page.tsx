"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth-context";

type Popup = { x: number; y: number; val: number; life: number };
type LeaderEntry = { nickname: string; score: number };

export default function CorsaPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { gamer } = useAuth();
  const [best, setBest] = useState(0);
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [newRecord, setNewRecord] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderEntry[]>([]);
  const [leaderLoading, setLeaderLoading] = useState(false);

  const fetchLeaderboard = async () => {
    setLeaderLoading(true);
    try {
      const res = await fetch("/api/game/corsa");
      if (res.ok) setLeaderboard(await res.json());
    } catch {}
    setLeaderLoading(false);
  };

  const saveScore = async (score: number) => {
    if (!gamer) return;
    try {
      await fetch("/api/game/corsa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: gamer.nickname, score }),
      });
    } catch {}
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // alpha:false = compositing più veloce, nessuna trasparenza necessaria
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let W = canvas.clientWidth || 390;
    let H = canvas.clientHeight || Math.round(W * 4 / 3);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let groundY = H - 52;

    // ── Gradient cache (ricreato solo su resize) ──────────
    let bgGrad: CanvasGradient | null = null;
    const makeBgGrad = () => {
      bgGrad = ctx.createLinearGradient(0, 0, 0, H);
      bgGrad.addColorStop(0, "#0d0a07");
      bgGrad.addColorStop(1, "#1a1611");
    };

    // ── Pre-render isola su canvas offscreen ─────────────
    const ISLAND_H = 120;
    const ISLAND_W = 420;
    const islandEl = document.createElement("canvas");
    islandEl.width  = ISLAND_W;
    islandEl.height = ISLAND_H;
    const ic = islandEl.getContext("2d")!;
    ic.fillStyle = "#1c1914";
    ic.beginPath();
    ic.moveTo(0, ISLAND_H);
    ic.bezierCurveTo(40, ISLAND_H, 60, ISLAND_H - 30, 80, ISLAND_H - 60);
    ic.bezierCurveTo(90, ISLAND_H - 85, 100, ISLAND_H - 105, 110, ISLAND_H - 110);
    ic.lineTo(240, ISLAND_H - 108);
    ic.bezierCurveTo(260, ISLAND_H - 105, 275, ISLAND_H - 80, 290, ISLAND_H - 45);
    ic.bezierCurveTo(300, ISLAND_H - 20, 310, ISLAND_H - 8, 320, ISLAND_H);
    ic.closePath();
    ic.fill();
    ic.fillStyle = "#181410";
    ic.beginPath();
    ic.moveTo(330, ISLAND_H);
    ic.bezierCurveTo(350, ISLAND_H - 10, 365, ISLAND_H - 38, 375, ISLAND_H - 42);
    ic.bezierCurveTo(385, ISLAND_H - 38, 400, ISLAND_H - 15, 410, ISLAND_H);
    ic.closePath();
    ic.fill();

    const resize = () => {
      W = canvas.clientWidth || 390;
      H = canvas.clientHeight || Math.round(W * 4 / 3);
      groundY = H - 52;
      canvas.width  = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      makeBgGrad();
    };
    resize();
    window.addEventListener("resize", resize);

    // ── Fisica ────────────────────────────────────────────
    const GRAV       = 0.58;
    const JUMP_INIT  = -9.0;
    const JUMP_DBL   = -8.2;
    const HOLD_FORCE = 0.32;
    const MAX_HOLD   = 15;
    const MAX_JUMPS  = 2;

    const player = { x: 56, w: 26, h: 34, y: groundY - 34, vy: 0, grounded: true };

    type Obstacle = { x: number; w: number; h: number };
    type Ball = { x: number; y: number; r: number; got: boolean };

    let obstacles: Obstacle[] = [];
    let balls: Ball[] = [];
    let popups: Popup[] = [];
    let speed = 0;
    let dist  = 0;
    let score = 0;
    let spawnT = 0;
    let ballT  = 0;
    let holding = false;
    let holdT   = 0;
    let jumpsUsed = 0;
    let mode: "idle" | "playing" | "over" = "idle";
    let sessionGapBase = 200;
    let sessionGapMin  = 110;

    // Interpolazione sub-frame
    let prevPlayerY = player.y;

    let bestLocal = 0;
    try { bestLocal = parseInt(localStorage.getItem("tavgame-corsa-best") || "0", 10) || 0; } catch {}
    setBest(bestLocal);

    let lastTs = 0;
    let accumulator = 0;

    const reset = () => {
      obstacles = [];
      balls     = [];
      popups    = [];
      speed     = 3.0;
      dist      = 0;
      score     = 0;
      sessionGapBase = 260 + Math.random() * 100;
      sessionGapMin  = 190 + Math.random() * 40;
      spawnT = sessionGapBase + 200;
      ballT  = 380 + Math.random() * 160;
      player.y = groundY - player.h;
      player.vy = 0;
      player.grounded = true;
      prevPlayerY = player.y;
      jumpsUsed = 0;
      holding = false;
      holdT   = 0;
    };

    const press = () => {
      if (mode === "idle" || mode === "over") {
        reset();
        mode = "playing";
        lastTs = 0;
        accumulator = 0;
        return;
      }
      if (player.grounded) {
        player.vy = JUMP_INIT;
        player.grounded = false;
        jumpsUsed = 1;
        holding = true;
        holdT = 0;
      } else if (jumpsUsed < MAX_JUMPS) {
        player.vy = JUMP_DBL;
        jumpsUsed += 1;
        holding = true;
        holdT = 0;
      }
    };

    const release = () => {
      holding = false;
      if (player.vy < 0) player.vy *= 0.5;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") { e.preventDefault(); if (!e.repeat) press(); }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") release();
    };
    const onPointerDown = (e: Event) => { e.preventDefault(); press(); };
    const onPointerUp = () => release();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    // ── Draw helpers ──────────────────────────────────────
    const drawCone = (rx: number, w: number, h: number) => {
      const x  = Math.round(rx);
      const oy = Math.round(groundY - h);
      ctx.fillStyle = "#c9a86a";
      ctx.beginPath();
      ctx.moveTo(x, groundY);
      ctx.lineTo(x + (w >> 1), oy);
      ctx.lineTo(x + w, groundY);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.88)";
      ctx.fillRect(x + Math.round(w * 0.18), oy + Math.round(h * 0.42), Math.round(w * 0.64), 2);
    };

    const drawBall = (rbx: number, rby: number, r: number) => {
      const bx = Math.round(rbx);
      const by = Math.round(rby);
      ctx.fillStyle = "#f0ece3";
      ctx.beginPath(); ctx.arc(bx, by, r, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#1a1611"; ctx.lineWidth = 1.2; ctx.stroke();
      ctx.fillStyle = "#1a1611";
      ctx.beginPath(); ctx.arc(bx, by, 3, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#1a1611"; ctx.lineWidth = 0.9;
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        const angle = (i * Math.PI * 2) / 3 - Math.PI / 2;
        ctx.moveTo(bx + 3 * Math.cos(angle), by + 3 * Math.sin(angle));
        ctx.lineTo(bx + r * 0.75 * Math.cos(angle), by + r * 0.75 * Math.sin(angle));
      }
      ctx.stroke();
    };

    const drawPlayer = (now: number, py: number) => {
      const px  = player.x;
      const rpx = Math.round(px);
      const rpy = Math.round(py);
      const pw  = player.w;
      const ph  = player.h;
      const swing = mode === "playing" && player.grounded ? Math.sin(now / 65) * 0.9 : 0;
      const footY = rpy + ph;
      const hipX  = rpx + (pw >> 1);
      const hipY  = rpy + ph - 10;
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#c8c0b0";
      ctx.beginPath(); ctx.moveTo(hipX, hipY); ctx.lineTo(Math.round(hipX - 5 + swing * 5), footY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(hipX, hipY); ctx.lineTo(Math.round(hipX + 5 - swing * 5), footY); ctx.stroke();
      ctx.fillStyle = "#1f7a4d";
      ctx.fillRect(rpx + 4, rpy + 8, pw - 8, ph - 16);
      ctx.fillStyle = "#f3efe6";
      ctx.fillRect(rpx + (pw >> 1) - 1, rpy + 8, 3, ph - 16);
      ctx.fillStyle = "#e8c39a";
      ctx.beginPath(); ctx.arc(rpx + (pw >> 1), rpy + 6, 7, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#1f7a4d"; ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(rpx + (pw >> 1), rpy + 14);
      ctx.lineTo(Math.round(rpx + (pw >> 1) + 8 - swing * 5), rpy + 22);
      ctx.stroke();
    };

    const PERIOD = 460; // periodo isola (< W+ISLAND_W per copertura continua)

    const drawBg = (renderDist: number) => {
      // Sfondo (gradient cached)
      ctx.fillStyle = bgGrad!;
      ctx.fillRect(0, 0, W, H);

      // Isola Tavolara — blittata da canvas offscreen
      const islandY = Math.round(groundY - ISLAND_H);
      const px0 = (renderDist * 0.10) % PERIOD;
      for (let rep = 0; rep < 3; rep++) {
        const ix = Math.round(W * 0.15 - px0 + rep * PERIOD);
        if (ix + ISLAND_W < -4 || ix > W + 4) continue;
        ctx.drawImage(islandEl, ix, islandY);
      }

      // Linea terreno
      ctx.fillStyle = "#2c261e";
      ctx.fillRect(0, Math.round(groundY), W, 2);

      // Linea tratteggiata campo
      ctx.strokeStyle = "rgba(31,122,77,0.45)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([12, 20]);
      ctx.lineDashOffset = -Math.round((renderDist * 0.45) % 32);
      ctx.beginPath();
      ctx.moveTo(0, Math.round(groundY) + 7);
      ctx.lineTo(W, Math.round(groundY) + 7);
      ctx.stroke();
      ctx.setLineDash([]);
    };

    // ── Aggiornamento fisica ──────────────────────────────
    const update = () => {
      dist  += speed;
      score  = Math.floor(dist / 14);
      speed += 0.0006;

      spawnT -= speed;
      if (spawnT <= 0) {
        obstacles.push({ x: W + 20, w: 16 + Math.random() * 12, h: 22 + Math.random() * 20 });
        const r = Math.random();
        if (r < 0.18)      spawnT = sessionGapBase * (1.6 + Math.random() * 0.8);
        else if (r < 0.34) spawnT = Math.max(120, sessionGapBase * 0.52 + Math.random() * 45);
        else               spawnT = Math.max(sessionGapMin, sessionGapBase + Math.random() * 90 - dist / 220);
      }

      ballT -= speed;
      if (ballT <= 0) {
        const r2  = Math.random();
        const ballY = r2 < 0.4 ? groundY - 82 : r2 < 0.7 ? groundY - 46 : groundY - 20;
        balls.push({ x: W + 20, y: ballY, r: 9, got: false });
        ballT = 260 + Math.random() * 230;
      }

      obstacles.forEach((o) => (o.x -= speed));
      balls.forEach((b) => (b.x -= speed));
      obstacles = obstacles.filter((o) => o.x + o.w > -10);
      balls     = balls.filter((b) => b.x + b.r > -10 && !b.got);
      popups    = popups.filter((p) => p.life > 0);
      popups.forEach((p) => { p.y -= 1.4; p.life -= 1; });

      if (holding && player.vy < 0 && holdT < MAX_HOLD) {
        player.vy -= HOLD_FORCE;
        holdT += 1;
      }
      player.vy += GRAV;
      if (player.vy > 14) player.vy = 14;
      player.y += player.vy;
      if (player.y >= groundY - player.h) {
        player.y = groundY - player.h;
        player.vy = 0;
        player.grounded = true;
        jumpsUsed = 0;
        holding   = false;
      }

      for (const o of obstacles) {
        if (
          player.x + player.w - 6 > o.x &&
          player.x + 6 < o.x + o.w &&
          player.y + player.h - 2 > groundY - o.h
        ) {
          mode = "over";
          const isNew = score > bestLocal;
          setLastScore(score);
          setNewRecord(isNew);
          if (isNew) {
            bestLocal = score;
            setBest(bestLocal);
            try { localStorage.setItem("tavgame-corsa-best", String(bestLocal)); } catch {}
          }
          saveScore(score);
          fetchLeaderboard();
          break;
        }
      }

      for (const b of balls) {
        const cx = player.x + (player.w >> 1);
        const cy = player.y + (player.h >> 1);
        if (Math.hypot(cx - b.x, cy - b.y) < b.r + 16) {
          b.got = true;
          score += 5;
          popups.push({ x: b.x, y: b.y - 8, val: 5, life: 30 });
        }
      }
    };

    // ── Rendering con interpolazione sub-frame ────────────
    const draw = (now: number, alpha: number) => {
      // Posizione interpolata del player (smooth su ogni Hz)
      const iPlayerY = prevPlayerY + alpha * (player.y - prevPlayerY);

      // Distanza interpolata (parallasse smooth)
      const renderDist = dist + alpha * speed;

      drawBg(renderDist);

      // Palle (interpolate)
      balls.forEach((b) => drawBall(b.x - alpha * speed, b.y, b.r));

      // Birilli (interpolati)
      obstacles.forEach((o) => drawCone(o.x - alpha * speed, o.w, o.h));

      // Player
      drawPlayer(now, iPlayerY);

      // Popup +5
      popups.forEach((p) => {
        ctx.globalAlpha = p.life / 30;
        ctx.fillStyle = "#c9a86a";
        ctx.font = "bold 13px ui-monospace,monospace";
        ctx.textAlign = "center";
        ctx.fillText(`+${p.val}`, Math.round(p.x), Math.round(p.y));
        ctx.globalAlpha = 1;
      });

      // HUD score + record
      if (mode === "playing") {
        ctx.textAlign = "right";
        ctx.fillStyle = "#c9a86a";
        ctx.font = "bold 22px ui-monospace,monospace";
        ctx.fillText(String(score).padStart(5, "0"), W - 14, 38);
        if (bestLocal > 0) {
          ctx.fillStyle = "rgba(201,168,106,0.35)";
          ctx.font = "500 10px ui-monospace,monospace";
          ctx.fillText("RECORD  " + bestLocal, W - 14, 54);
        }
      }

      // Overlay idle / game over
      ctx.textAlign = "center";
      if (mode === "idle") {
        ctx.fillStyle = "rgba(13,10,7,0.65)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#c9a86a";
        ctx.font = "bold 17px ui-monospace,monospace";
        ctx.fillText("CORSA", W >> 1, (H >> 1) - 14);
        ctx.fillStyle = "#f3efe6";
        ctx.font = "600 12px ui-monospace,monospace";
        ctx.fillText("Tocca per iniziare", W >> 1, (H >> 1) + 8);
        ctx.fillStyle = "rgba(179,172,156,0.55)";
        ctx.font = "500 10px ui-monospace,monospace";
        ctx.fillText("Tieni premuto = più alto  ·  doppio salto", W >> 1, (H >> 1) + 28);
        if (bestLocal > 0) {
          ctx.fillStyle = "rgba(201,168,106,0.45)";
          ctx.fillText("RECORD  " + bestLocal, W >> 1, (H >> 1) + 46);
        }
      } else if (mode === "over") {
        ctx.fillStyle = "rgba(13,10,7,0.82)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#c9a86a";
        ctx.font = "bold 28px ui-monospace,monospace";
        ctx.fillText("GAME OVER", W >> 1, (H >> 1) - 24);
        ctx.fillStyle = "#f3efe6";
        ctx.font = "bold 48px ui-monospace,monospace";
        ctx.fillText(String(score), W >> 1, (H >> 1) + 36);
        ctx.fillStyle = "rgba(179,172,156,0.5)";
        ctx.font = "500 11px ui-monospace,monospace";
        ctx.fillText("Tocca per rigiocare", W >> 1, (H >> 1) + 62);
      }
      ctx.textAlign = "left";
    };

    // ── Game loop a timestep fisso con interpolazione ─────
    const STEP = 1000 / 60;

    const loop = (now: number) => {
      if (lastTs > 0) {
        accumulator += Math.min(now - lastTs, 50);
        prevPlayerY = player.y; // snapshot prima degli step fisici
        while (accumulator >= STEP) {
          if (mode === "playing") update();
          accumulator -= STEP;
        }
      }
      lastTs = now;
      const alpha = accumulator / STEP; // 0..1, frazione di step residua
      draw(now, alpha);
      raf = requestAnimationFrame(loop);
    };
    let raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="min-h-[100svh] flex flex-col"
      style={{ backgroundColor: "var(--color-nero)", paddingBottom: "calc(env(safe-area-inset-bottom) + 5rem)" }}
    >
      <div
        className="flex items-center px-4"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 14px)", paddingBottom: "10px" }}
      >
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.22em]" style={{ color: "var(--color-oro)" }}>TAV GAME</p>
          <p className="font-body font-extrabold text-[1.05rem] uppercase text-white leading-none">Corsa</p>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        className="block w-full touch-none select-none"
        style={{ aspectRatio: "3/4", background: "#0d0a07" }}
        aria-label="Corsa — TAV GAME"
      />

      <div
        className="flex items-center px-4 py-2.5"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.14em]" style={{ color: "rgba(255,255,255,0.3)" }}>
          Tieni premuto = più alto  ·  doppio salto
        </span>
      </div>

      {lastScore !== null && (
        <>
          <div className="px-4 pt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl p-4 text-center" style={{ background: "var(--color-carbon)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <p className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>Ultima partita</p>
              <p className="font-body font-extrabold text-[1.8rem] text-white">{lastScore}</p>
              {newRecord && <p className="font-mono text-[9px] uppercase tracking-wider mt-1" style={{ color: "var(--color-oro)" }}>★ Record!</p>}
            </div>
            <div className="rounded-2xl p-4 text-center" style={{ background: "var(--color-carbon)", border: `1px solid rgba(201,168,106,${best > 0 ? "0.3" : "0.08"})` }}>
              <p className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: "var(--color-oro)" }}>Record</p>
              <p className="font-body font-extrabold text-[1.8rem]" style={{ color: "var(--color-oro)" }}>{best > 0 ? best : "—"}</p>
            </div>
          </div>

          {gamer ? (
            <div className="px-4 pt-5">
              <p className="font-mono text-[9px] uppercase tracking-[0.22em] mb-3" style={{ color: "var(--color-oro)" }}>Classifica</p>
              {leaderLoading ? (
                <div className="flex justify-center py-6">
                  <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-[var(--color-oro)] animate-spin" />
                </div>
              ) : leaderboard.length === 0 ? (
                <p className="font-mono text-[10px] text-white/60 text-center py-4">Nessun punteggio ancora</p>
              ) : (
                <div className="flex flex-col gap-1">
                  {leaderboard.map((entry, i) => (
                    <div
                      key={entry.nickname}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl"
                      style={{
                        background: entry.nickname === gamer.nickname ? "rgba(201,168,106,0.08)" : "var(--color-carbon)",
                        border: entry.nickname === gamer.nickname ? "1px solid rgba(201,168,106,0.3)" : "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      <span
                        className="font-mono text-[11px] font-bold w-6 text-center shrink-0"
                        style={{ color: i === 0 ? "#FFD700" : i === 1 ? "#C0C0C0" : i === 2 ? "#CD7F32" : "rgba(255,255,255,0.6)" }}
                      >
                        {i === 0 ? "★" : i + 1}
                      </span>
                      <span
                        className="font-body font-extrabold text-[0.88rem] uppercase flex-1 truncate"
                        style={{ color: entry.nickname === gamer.nickname ? "var(--color-oro)" : "white" }}
                      >
                        {entry.nickname}
                        {entry.nickname === gamer.nickname && <span className="font-mono text-[8px] ml-2 opacity-60">TU</span>}
                      </span>
                      <span className="font-mono text-[0.88rem] font-bold" style={{ color: "var(--color-oro)" }}>
                        {entry.score}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="px-4 pt-5">
              <div className="rounded-2xl p-4 text-center" style={{ background: "var(--color-carbon)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <p className="font-mono text-[9px] uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.6)" }}>Classifica</p>
                <p className="font-body text-white/75 text-[0.82rem] mb-3">
                  Fai il login per vedere la classifica e salvare il tuo punteggio
                </p>
                <a
                  href="/login"
                  className="inline-block font-mono text-[10px] uppercase tracking-widest px-5 py-2 rounded-full"
                  style={{ background: "var(--color-oro)", color: "var(--color-nero)" }}
                >
                  Accedi
                </a>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
