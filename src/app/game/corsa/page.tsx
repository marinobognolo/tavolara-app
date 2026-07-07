"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Popup = { x: number; y: number; val: number; life: number };

export default function CorsaPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [best, setBest] = useState(0);
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [newRecord, setNewRecord] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const H = 340;
    let W = canvas.clientWidth || 390;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      W = canvas.clientWidth || 390;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const groundY = H - 52;
    const GRAV = 0.58;
    const JUMP_INIT = -9.0;
    const JUMP_DBL = -8.2;
    const HOLD_FORCE = 0.32;
    const MAX_HOLD = 15;
    const MAX_JUMPS = 2;

    const player = { x: 56, w: 26, h: 34, y: groundY - 34, vy: 0, grounded: true };

    type Obstacle = { x: number; w: number; h: number };
    type Ball = { x: number; y: number; r: number; got: boolean };

    let obstacles: Obstacle[] = [];
    let balls: Ball[] = [];
    let popups: Popup[] = [];
    let speed = 0;
    let dist = 0;
    let score = 0;
    let spawnT = 0;
    let ballT = 0;
    let bgX = 0;
    let holding = false;
    let holdT = 0;
    let jumpsUsed = 0;
    let mode: "idle" | "playing" | "over" = "idle";

    // Parametri di sessione — variano ad ogni partita
    let sessionGapBase = 200;
    let sessionGapMin = 110;

    let bestLocal = 0;
    try {
      bestLocal = parseInt(localStorage.getItem("tavgame-corsa-best") || "0", 10) || 0;
    } catch {}
    setBest(bestLocal);

    const reset = () => {
      obstacles = [];
      balls = [];
      popups = [];
      speed = 3.0;
      dist = 0;
      score = 0;
      // Ogni partita ha una spaziatura birilli diversa (sessione unica)
      sessionGapBase = 260 + Math.random() * 100; // 260–360
      sessionGapMin  = 190 + Math.random() * 40;  // 190–230
      spawnT = sessionGapBase + 30;
      ballT  = 160 + Math.random() * 120;
      player.y = groundY - player.h;
      player.vy = 0;
      player.grounded = true;
      jumpsUsed = 0;
      holding = false;
      holdT = 0;
    };

    const press = () => {
      if (mode !== "playing") {
        reset();
        mode = "playing";
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
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        if (!e.repeat) press();
      }
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

    /* ── Helpers ── */

    const drawCone = (x: number, w: number, h: number) => {
      const oy = groundY - h;
      ctx.fillStyle = "#c9a86a";
      ctx.beginPath();
      ctx.moveTo(x, groundY);
      ctx.lineTo(x + w / 2, oy);
      ctx.lineTo(x + w, groundY);
      ctx.closePath();
      ctx.fill();
      // Striscia bianca
      ctx.fillStyle = "rgba(255,255,255,0.88)";
      ctx.fillRect(x + w * 0.18, oy + h * 0.42, w * 0.64, 2.5);
    };

    const drawBall = (bx: number, by: number, r: number) => {
      ctx.fillStyle = "#f0ece3";
      ctx.beginPath();
      ctx.arc(bx, by, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#1a1611";
      ctx.lineWidth = 1.2;
      ctx.stroke();
      // Pentagono centrale
      ctx.fillStyle = "#1a1611";
      ctx.beginPath();
      ctx.arc(bx, by, 3.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#1a1611";
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        const angle = (i * Math.PI * 2) / 3 - Math.PI / 2;
        ctx.moveTo(bx + 3 * Math.cos(angle), by + 3 * Math.sin(angle));
        ctx.lineTo(bx + r * 0.75 * Math.cos(angle), by + r * 0.75 * Math.sin(angle));
      }
      ctx.stroke();
    };

    const drawPlayer = (now: number) => {
      const { x: px, y: py, w: pw, h: ph } = player;
      const swing = mode === "playing" && player.grounded ? Math.sin(now / 65) * 0.9 : 0;
      const footY = py + ph;
      const hipX = px + pw / 2;
      const hipY = py + ph - 10;
      ctx.lineWidth = 3;
      // Gambe
      ctx.strokeStyle = "#c8c0b0";
      ctx.beginPath(); ctx.moveTo(hipX, hipY); ctx.lineTo(hipX - 5 + swing * 5, footY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(hipX, hipY); ctx.lineTo(hipX + 5 - swing * 5, footY); ctx.stroke();
      // Maglia verde Tavolara
      ctx.fillStyle = "#1f7a4d";
      ctx.fillRect(px + 4, py + 8, pw - 8, ph - 16);
      // Striscia bianca verticale sulla maglia
      ctx.fillStyle = "#f3efe6";
      ctx.fillRect(px + pw / 2 - 1.5, py + 8, 3, ph - 16);
      // Testa
      ctx.fillStyle = "#e8c39a";
      ctx.beginPath();
      ctx.arc(px + pw / 2, py + 6, 7, 0, Math.PI * 2);
      ctx.fill();
      // Braccio
      ctx.strokeStyle = "#1f7a4d";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(px + pw / 2, py + 14);
      ctx.lineTo(px + pw / 2 + 8 - swing * 5, py + 22);
      ctx.stroke();
    };

    const drawBg = () => {
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, "#0d0a07");
      grad.addColorStop(1, "#1a1611");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      const period = W + 360;
      const ix = ((bgX % period) + period) % period;

      // Collinette sullo sfondo (isola di Tavolara stilizzata)
      const hill = (x: number, w: number, h: number, color: string) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(x, groundY);
        ctx.bezierCurveTo(x + w * 0.2, groundY - h * 0.5, x + w * 0.4, groundY - h, x + w * 0.5, groundY - h);
        ctx.bezierCurveTo(x + w * 0.6, groundY - h, x + w * 0.8, groundY - h * 0.5, x + w, groundY);
        ctx.closePath();
        ctx.fill();
      };
      hill(ix - period * 0.4, 420, 115, "#1c1914");
      hill(ix + 50,            300,  80, "#181510");

      // Linea terreno
      ctx.strokeStyle = "#2c261e";
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, groundY); ctx.lineTo(W, groundY); ctx.stroke();

      // Linea campo tratteggiata
      ctx.strokeStyle = "rgba(31,122,77,0.45)";
      ctx.setLineDash([12, 20]);
      ctx.lineDashOffset = -((dist * 0.45) % 32);
      ctx.beginPath(); ctx.moveTo(0, groundY + 7); ctx.lineTo(W, groundY + 7); ctx.stroke();
      ctx.setLineDash([]);
    };

    /* ── Update ── */

    const update = () => {
      dist  += speed;
      score  = Math.floor(dist / 14);
      speed += 0.0006;
      bgX   -= speed * 0.25;

      // Spawn birilli — tre modalità di gap per varietà di ritmo
      spawnT -= speed;
      if (spawnT <= 0) {
        obstacles.push({ x: W + 20, w: 16 + Math.random() * 12, h: 22 + Math.random() * 20 });
        const gapRoll = Math.random();
        if (gapRoll < 0.18) {
          // Respiro lungo — pausa di sollievo (18%)
          spawnT = sessionGapBase * (1.6 + Math.random() * 0.8);
        } else if (gapRoll < 0.34) {
          // Coppia ravvicinata — sfida breve (16%)
          spawnT = Math.max(120, sessionGapBase * 0.52 + Math.random() * 45);
        } else {
          // Gap normale con leggera variazione (66%)
          spawnT = Math.max(sessionGapMin, sessionGapBase + Math.random() * 90 - dist / 220);
        }
      }

      // Spawn palloni
      ballT -= speed;
      if (ballT <= 0) {
        const rnd = Math.random();
        const ballY = rnd < 0.4 ? groundY - 82 : rnd < 0.7 ? groundY - 46 : groundY - 20;
        balls.push({ x: W + 20, y: ballY, r: 9, got: false });
        ballT = 260 + Math.random() * 230;
      }

      obstacles.forEach((o) => (o.x -= speed));
      balls.forEach((b) => (b.x -= speed));
      obstacles = obstacles.filter((o) => o.x + o.w > -10);
      balls = balls.filter((b) => b.x + b.r > -10 && !b.got);
      popups = popups.filter((p) => p.life > 0);
      popups.forEach((p) => { p.y -= 1.4; p.life -= 1; });

      // Fisica salto
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
        holding = false;
      }

      // Collisione birilli → game over
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
          break;
        }
      }

      // Collisione palloni → +5 bonus
      for (const b of balls) {
        const cx = player.x + player.w / 2;
        const cy = player.y + player.h / 2;
        if (Math.hypot(cx - b.x, cy - b.y) < b.r + 16) {
          b.got = true;
          score += 5;
          popups.push({ x: b.x, y: b.y - 8, val: 5, life: 30 });
        }
      }
    };

    /* ── Draw ── */

    const draw = (now: number) => {
      drawBg();
      balls.forEach((b) => drawBall(b.x, b.y, b.r));
      obstacles.forEach((o) => drawCone(o.x, o.w, o.h));
      drawPlayer(now);

      // Popup "+5"
      popups.forEach((p) => {
        const alpha = p.life / 30;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = "#c9a86a";
        ctx.font = "bold 13px ui-monospace,monospace";
        ctx.textAlign = "center";
        ctx.fillText(`+${p.val}`, p.x, p.y);
        ctx.globalAlpha = 1;
      });

      // HUD punteggio
      ctx.textAlign = "right";
      ctx.fillStyle = "#c9a86a";
      ctx.font = "bold 22px ui-monospace,monospace";
      ctx.fillText(String(score).padStart(5, "0"), W - 14, 34);
      ctx.fillStyle = "rgba(179,172,156,0.55)";
      ctx.font = "600 10px ui-monospace,monospace";
      ctx.fillText("BEST " + bestLocal, W - 14, 50);

      // Overlay
      ctx.textAlign = "center";
      if (mode === "idle") {
        ctx.fillStyle = "rgba(13,10,7,0.62)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#c9a86a";
        ctx.font = "bold 17px ui-monospace,monospace";
        ctx.fillText("CORSA", W / 2, H / 2 - 14);
        ctx.fillStyle = "#f3efe6";
        ctx.font = "600 12px ui-monospace,monospace";
        ctx.fillText("Tocca per iniziare", W / 2, H / 2 + 8);
        ctx.fillStyle = "rgba(179,172,156,0.55)";
        ctx.font = "500 10px ui-monospace,monospace";
        ctx.fillText("Tieni premuto = più alto  ·  doppio salto in aria", W / 2, H / 2 + 28);
      } else if (mode === "over") {
        ctx.fillStyle = "rgba(13,10,7,0.78)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#c9a86a";
        ctx.font = "bold 20px ui-monospace,monospace";
        ctx.fillText("GAME OVER", W / 2, H / 2 - 22);
        ctx.fillStyle = "#f3efe6";
        ctx.font = "bold 15px ui-monospace,monospace";
        ctx.fillText("Punti  " + score, W / 2, H / 2 + 4);
        if (score === bestLocal && score > 0) {
          ctx.fillStyle = "#c9a86a";
          ctx.font = "600 11px ui-monospace,monospace";
          ctx.fillText("★  NUOVO RECORD!", W / 2, H / 2 + 22);
        }
        ctx.fillStyle = "rgba(179,172,156,0.6)";
        ctx.font = "500 10px ui-monospace,monospace";
        ctx.fillText("Tocca per rigiocare", W / 2, H / 2 + (score === bestLocal && score > 0 ? 40 : 24));
      }
      ctx.textAlign = "left";
    };

    let raf = 0;
    let lastTs = 0;
    let accumulator = 0;
    const STEP = 1000 / 60; // fisica sempre a 60 fps logici

    const loop = (now: number) => {
      if (lastTs > 0) {
        accumulator += Math.min(now - lastTs, 100); // clamp a 100ms per evitare spiral
        while (accumulator >= STEP) {
          if (mode === "playing") update();
          accumulator -= STEP;
        }
      }
      lastTs = now;
      draw(now);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, []);

  return (
    <div
      className="min-h-[100svh] flex flex-col"
      style={{ backgroundColor: "var(--color-nero)", paddingBottom: "calc(env(safe-area-inset-bottom) + 5rem)" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 14px)", paddingBottom: "12px" }}
      >
        <Link href="/game" className="p-1 text-white" aria-label="Tav Game">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.22em]" style={{ color: "var(--color-oro)" }}>
            TAV GAME
          </p>
          <p className="font-body font-extrabold text-[1.05rem] uppercase text-white leading-none">
            Corsa
          </p>
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="block w-full touch-none select-none"
        style={{ height: "340px", background: "#0d0a07" }}
        aria-label="Corsa — TAV GAME"
      />

      {/* Info bar */}
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.14em]" style={{ color: "rgba(255,255,255,0.3)" }}>
          Tieni premuto = più alto  ·  doppio salto
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: "var(--color-oro)" }}>
          Record {best}
        </span>
      </div>

      {/* Score cards */}
      <div className="px-4 pt-4 grid grid-cols-2 gap-3">
        <div
          className="rounded-2xl p-4 text-center"
          style={{ background: "var(--color-carbon)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <p className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>
            Ultima partita
          </p>
          <p className="font-body font-extrabold text-[1.8rem] text-white">
            {lastScore ?? "—"}
          </p>
          {newRecord && lastScore !== null && (
            <p className="font-mono text-[9px] uppercase tracking-wider mt-1" style={{ color: "var(--color-oro)" }}>
              ★ Record!
            </p>
          )}
        </div>
        <div
          className="rounded-2xl p-4 text-center"
          style={{
            background: "var(--color-carbon)",
            border: `1px solid rgba(201,168,106,${best > 0 ? "0.3" : "0.08"})`,
          }}
        >
          <p className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: "var(--color-oro)" }}>
            Record
          </p>
          <p className="font-body font-extrabold text-[1.8rem]" style={{ color: "var(--color-oro)" }}>
            {best > 0 ? best : "—"}
          </p>
        </div>
      </div>

      {/* Come si gioca */}
      <div className="px-4 pt-4">
        <div
          className="rounded-2xl p-4 space-y-2"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
        >
          <p className="font-mono text-[9px] uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.25)" }}>
            Come si gioca
          </p>
          <p className="font-mono text-[11px] uppercase leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
            SALTA I BIRILLI DORATI — TIENI PREMUTO PER SALTARE PIÙ IN ALTO.
          </p>
          <p className="font-mono text-[11px] uppercase leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
            PREMI DI NUOVO MENTRE SEI IN ARIA PER IL DOPPIO SALTO.
          </p>
          <p className="font-mono text-[11px] uppercase leading-relaxed" style={{ color: "var(--color-oro)" }}>
            RACCOGLI I PALLONI DURANTE LA CORSA: OGNI PALLONE VALE +5 PUNTI BONUS.
          </p>
        </div>
      </div>
    </div>
  );
}
