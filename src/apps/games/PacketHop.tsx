"use client";

import { useEffect, useRef } from "react";
import { hitsWall } from "./logic";

// Flappy-style: tap/Space to keep a data packet airborne through gaps in firewalls.
export const PACKET_BEST = "packethop-best";
const R = 12; // packet half-size
const WALL_W = 62;
const GROUND = 26;

type Wall = { x: number; gapY: number; passed: boolean };

export default function PacketHop() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    let w = 0;
    let h = 0;
    const fit = () => {
      const dpr = devicePixelRatio || 1;
      w = c.clientWidth;
      h = c.clientHeight;
      c.width = w * dpr;
      c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(c);

    const s = {
      phase: "ready" as "ready" | "play" | "over",
      y: h / 2,
      vy: 0,
      walls: [] as Wall[],
      score: 0,
      best: Number(localStorage.getItem(PACKET_BEST) ?? 0),
      overAt: 0,
      scroll: 0,
    };
    const px = () => Math.max(60, w * 0.26);
    const gap = () => Math.max(118, 168 - s.score * 2);
    const speed = () => Math.min(270, 150 + s.score * 4);

    const flap = () => {
      if (s.phase === "over") {
        if (performance.now() - s.overAt < 500) return; // don't restart from the crash tap
        s.phase = "ready";
        s.y = h / 2;
        s.vy = 0;
        s.walls = [];
        s.score = 0;
        return;
      }
      s.phase = "play";
      s.vy = -360;
    };
    const crash = () => {
      s.phase = "over";
      s.overAt = performance.now();
      if (s.score > s.best) {
        s.best = s.score;
        localStorage.setItem(PACKET_BEST, String(s.score));
      }
    };

    const onPointer = (e: PointerEvent) => {
      e.preventDefault();
      c.focus();
      flap();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "ArrowUp") {
        e.preventDefault();
        flap();
      }
    };
    c.addEventListener("pointerdown", onPointer);
    c.addEventListener("keydown", onKey);
    c.focus();

    let raf = 0;
    let prev = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.033, (now - prev) / 1000);
      prev = now;

      if (s.phase === "play") {
        s.vy += 1250 * dt;
        s.y += s.vy * dt;
        const v = speed();
        s.scroll += v * dt;
        for (const wall of s.walls) wall.x -= v * dt;
        s.walls = s.walls.filter((wall) => wall.x + WALL_W > -10);
        const last = s.walls[s.walls.length - 1];
        if (!last || last.x < w - 240) {
          const g = gap();
          s.walls.push({ x: w + 10, gapY: g / 2 + 30 + Math.random() * Math.max(10, h - GROUND - g - 60), passed: false });
        }
        for (const wall of s.walls) {
          if (hitsWall(px(), s.y, R, wall.x, WALL_W, wall.gapY, gap())) crash();
          if (!wall.passed && wall.x + WALL_W < px() - R) {
            wall.passed = true;
            s.score++;
          }
        }
        if (s.y + R > h - GROUND || s.y - R < 0) crash();
      } else if (s.phase === "ready") {
        s.y = h / 2 + Math.sin(now / 300) * 8; // idle bob
        s.scroll += 60 * dt;
      }

      draw(now);
      raf = requestAnimationFrame(tick);
    };

    const draw = (now: number) => {
      // Background: dark network grid scrolling slower than the walls.
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, "#0b1024");
      bg.addColorStop(1, "#1b2550");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(120,160,255,0.08)";
      ctx.lineWidth = 1;
      const off = (s.scroll * 0.3) % 40;
      for (let x = -off; x < w; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Firewalls: brick columns with glowing edges at the gap.
      const g = gap();
      for (const wall of s.walls) {
        const top = wall.gapY - g / 2;
        const bottom = wall.gapY + g / 2;
        for (const [y0, y1] of [
          [0, top],
          [bottom, h - GROUND],
        ]) {
          ctx.fillStyle = "#4a1f1f";
          ctx.fillRect(wall.x, y0, WALL_W, y1 - y0);
          ctx.strokeStyle = "rgba(0,0,0,0.35)";
          for (let y = y0; y < y1; y += 14) {
            ctx.beginPath();
            ctx.moveTo(wall.x, y);
            ctx.lineTo(wall.x + WALL_W, y);
            ctx.stroke();
            const shift = Math.floor(y / 14) % 2 ? WALL_W / 2 : WALL_W / 4;
            ctx.beginPath();
            ctx.moveTo(wall.x + shift, y);
            ctx.lineTo(wall.x + shift, Math.min(y + 14, y1));
            ctx.stroke();
          }
        }
        ctx.shadowColor = "#ff7a1a";
        ctx.shadowBlur = 14;
        ctx.fillStyle = "#ff9a3c";
        ctx.fillRect(wall.x - 3, top - 8, WALL_W + 6, 8);
        ctx.fillRect(wall.x - 3, bottom, WALL_W + 6, 8);
        ctx.shadowBlur = 0;
      }

      // Ground: a cable with moving dashes.
      ctx.fillStyle = "#0a0e1d";
      ctx.fillRect(0, h - GROUND, w, GROUND);
      ctx.strokeStyle = "#3dd6ff";
      ctx.setLineDash([14, 10]);
      ctx.lineDashOffset = s.scroll % 24;
      ctx.beginPath();
      ctx.moveTo(0, h - GROUND / 2);
      ctx.lineTo(w, h - GROUND / 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Packet: tilts with vertical speed.
      ctx.save();
      ctx.translate(px(), s.y);
      ctx.rotate(Math.max(-0.5, Math.min(0.9, s.vy / 600)));
      ctx.shadowColor = "#3dd6ff";
      ctx.shadowBlur = 16;
      ctx.fillStyle = "#3dd6ff";
      ctx.beginPath();
      ctx.roundRect(-R, -R, R * 2, R * 2, 5);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#06243a";
      ctx.font = "bold 11px ui-monospace, Menlo, monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(Math.floor(now / 250) % 2 ? "01" : "10", 0, 1);
      ctx.restore();

      // HUD
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      ctx.font = "700 36px system-ui, sans-serif"; // canvas can't resolve CSS vars
      if (s.phase !== "ready") ctx.fillText(String(s.score), w / 2, 56);
      ctx.font = "500 15px system-ui, sans-serif";
      if (s.phase === "ready") {
        ctx.fillText("Tap or press Space to send the packet", w / 2, h * 0.3);
        ctx.fillStyle = "rgba(255,255,255,0.6)";
        ctx.fillText(`Best ${s.best}`, w / 2, h * 0.3 + 24);
      }
      if (s.phase === "over") {
        ctx.fillStyle = "rgba(0,0,0,0.45)";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#fff";
        ctx.font = "700 26px system-ui, sans-serif";
        ctx.fillText("Packet dropped", w / 2, h * 0.38);
        ctx.font = "500 15px system-ui, sans-serif";
        ctx.fillText(`Score ${s.score} · Best ${s.best}`, w / 2, h * 0.38 + 30);
        ctx.fillStyle = "rgba(255,255,255,0.6)";
        ctx.fillText("Tap to try again", w / 2, h * 0.38 + 56);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      c.removeEventListener("pointerdown", onPointer);
      c.removeEventListener("keydown", onKey);
    };
  }, []);

  return <canvas ref={ref} className="game-canvas" tabIndex={0} aria-label="Packet Hop game: tap or press Space to fly" />;
}
