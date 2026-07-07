"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Popup = { x: number; y: number; val: number; life: number };

export default function CorsaPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [best, setBest] = useState(0);
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [newRecord, setNewRecord] = useState(false);

  // Nascondi TopNav e BottomNav mentre il gioco è aperto
  useEffect(() => {
    const selectors = ['nav.fixed.top-0', 'nav.fixed.bottom-0'];
    const els = selectors.map(s => document.querySelector(s) as HTMLElement | null);
    els.forEach(el => { if (el) el.style.display = 'none'; });
    return () => { els.forEach(el => { if (el) el.style.display = ''; }); };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = canvas.clientWidth || 390;
    let H = canvas.clientHeight || window.innerHeight - 56;
    let groundY = H - 52;

    const resize = () => {
      W = canvas.clientWidth || 390;
      H = canvas.clientHeight || window.innerHeight - 56;
      groundY = H - 52;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

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
    let holding = false;
    let holdT = 0;
    let jumpsUsed = 0;
    let mode: "idle" | "playing" | "over" = "idle";

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
      sessionGapBase = 260 + Math.random() * 100;
      sessionGapMin  = 190 + Math.random() * 40;
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
      ctx.strokeStyle = "#c8c0b0";
      ctx.beginPath(); ctx.moveTo(hipX, hipY); ctx.lineTo(hipX - 5 + swing * 5, footY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(hipX, hipY); ctx.lineTo(hipX + 5 - swing * 5, footY); ctx.stroke();
      ctx.fillStyle = "#1f7a4d";
      ctx.fillRect(px + 4, py + 8, pw - 8, ph - 16);
      ctx.fillStyle = "#f3efe6";
      ctx.fillRect(px + pw / 2 - 1.5, py + 8, 3, ph - 16);
      ctx.fillStyle = "#e8c39a";
      ctx.beginPath();
      ctx.arc(px + pw / 2, py + 6, 7, 0, Math.PI * 2);
      ctx.fill();
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

      // Parallax montagne — usa dist (sempre positivo) per evitare glitch da modulo negativo
      const period = W + 440;
      const px = (dist * 0.12) % period;

      const drawHill = (baseX: number, w: number, h: number, color: string) => {
        // Disegna 2 copie affiancate per lo scorrimento senza stacchi
        for (let rep = 0; rep < 2; rep++) {
          const x = baseX - px + rep * period;
          if (x + w < -10 || x > W + 10) continue;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.moveTo(x, groundY);
          ctx.bezierCurveTo(x + w * 0.2, groundY - h * 0.5, x + w * 0.4, groundY - h, x + w * 0.5, groundY - h);
          ctx.bezierCurveTo(x + w * 0.6, groundY - h, x + w * 0.8, groundY - h * 0.5, x + w, groundY);
          ctx.closePath();
          ctx.fill();
        }
      };

      drawHill(W * 0.05, 440, 115, "#1c1914");
      drawHill(W * 0.55, 320, 80, "#181510");

      ctx.strokeStyle = "#2c261e";
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, groundY); ctx.lineTo(W, groundY); ctx.stroke();

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

      spawnT -= speed;
      if (spawnT <= 0) {
        obstacles.push({ x: W + 20, w: 16 + Math.random() * 12, h: 22 + Math.random() * 20 });
        const gapRoll = Math.random();
        if (gapRoll < 0.18) {
          spawnT = sessionGapBase * (1.6 + Math.random() * 0.8);
        } else if (gapRoll < 0.34) {
          spawnT = Math.max(120, sessionGapBase * 0.52 + Math.random() * 45);
        } else {
          spawnT = Math.max(sessionGapMin, sessionGapBase + Math.random() * 90 - dist / 220);
        }
      }

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

      popups.forEach((p) => {
        const alpha = p.life / 30;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = "#c9a86a";
        ctx.font = "bold 13px ui-monospace,monospace";
        ctx.textAlign = "center";
        ctx.fillText(`+${p.val}`, p.x, p.y);
        ctx.globalAlpha = 1;
      });

      ctx.textAlign = "right";
      ctx.fillStyle = "#c9a86a";
      ctx.font = "bold 22px ui-monospace,monospace";
      ctx.fillText(String(score).padStart(5, "0"), W - 14, 34);
      ctx.fillStyle = "rgba(179,172,156,0.55)";
      ctx.font = "600 10px ui-monospace,monospace";
      ctx.fillText("BEST " + bestLocal, W - 14, 50);

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
    const STEP = 1000 / 60;

    const loop = (now: number) => {
      if (lastTs > 0) {
        accumulator += Math.min(now - lastTs, 100);
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
      className="fixed inset-0 flex flex-col"
      style={{ backgroundColor: "#0d0a07", zIndex: 55 }}
    >
      {/* Header compatto */}
      <div
        className="flex items-center gap-3 px-4 shrink-0"
        style={{
          paddingTop: "calc(env(safe-area-inset-top) + 10px)",
          paddingBottom: "10px",
          background: "linear-gradient(to bottom, rgba(13,10,7,0.95), transparent)",
          position: "absolute", top: 0, left: 0, right: 0, zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <Link
          href="/game"
          className="p-1 text-white"
          aria-label="Tav Game"
          style={{ pointerEvents: "auto" }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
        <div className="flex-1">
          <p className="font-mono text-[9px] uppercase tracking-[0.22em]" style={{ color: "var(--color-oro)" }}>
            TAV GAME
          </p>
          <p className="font-body font-extrabold text-[1.05rem] uppercase text-white leading-none">
            Corsa
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-[9px] uppercase tracking-[0.14em]" style={{ color: "rgba(255,255,255,0.3)" }}>Record</p>
          <p className="font-mono text-[0.85rem] font-bold" style={{ color: "var(--color-oro)" }}>{best > 0 ? best : "—"}</p>
        </div>
      </div>

      {/* Canvas — riempie tutto lo schermo */}
      <canvas
        ref={canvasRef}
        className="block w-full flex-1 touch-none select-none"
        style={{ minHeight: 0, background: "#0d0a07" }}
        aria-label="Corsa — TAV GAME"
      />

      {/* Score ultima partita — overlay in basso */}
      {lastScore !== null && (
        <div
          className="shrink-0 flex items-center justify-between px-5"
          style={{
            paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)",
            paddingTop: 10,
            background: "linear-gradient(transparent, rgba(13,10,7,0.96))",
            position: "absolute", bottom: 0, left: 0, right: 0,
            pointerEvents: "none",
          }}
        >
          <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>
            Ultima partita
          </p>
          <p className="font-body font-extrabold text-[1.1rem]" style={{ color: newRecord ? "var(--color-oro)" : "white" }}>
            {lastScore}{newRecord && " ★"}
          </p>
        </div>
      )}
    </div>
  );
}
