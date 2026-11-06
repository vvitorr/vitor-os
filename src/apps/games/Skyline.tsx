"use client";

import { useEffect, useRef } from "react";
import { placeFloor, type Span } from "./logic";

// Stack-style: a crane swings apartment floors; tap/Space to drop. Overhang is cut off,
// a miss costs a life, three perfect drops in a row widen the building again.
export const SKYLINE_BEST = "skyline-best";
const FH = 32; // floor height
const HOOK_Y = 34; // crane jib, in screen px
const CABLE = 64;
const FACADES = ["#e9d8bd", "#c8d7e4", "#f1c7b3", "#d6e4c8", "#e3d1ea", "#f3e1a9"];

type Floor = Span & { color: string };
type Debris = Span & { y: number; vy: number; vx: number; rot: number; vr: number; color: string };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const mix = (c1: number[], c2: number[], t: number) => `rgb(${c1.map((v, i) => Math.round(lerp(v, c2[i], t))).join(",")})`;
// Sky goes day → dusk → night as the building grows.
const SKY: [number[], number[]][] = [
  [[124, 196, 255], [217, 240, 255]],
  [[255, 154, 107], [91, 61, 140]],
  [[11, 16, 48], [29, 43, 90]],
];
function sky(level: number): [string, string] {
  const t = Math.min(2, level / 18);
  const i = Math.min(1, Math.floor(t));
  const f = t - i;
  return [mix(SKY[i][0], SKY[i + 1][0], f), mix(SKY[i][1], SKY[i + 1][1], f)];
}

export default function Skyline() {
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

    const ground = () => h - 36; // world y of the ground; camera shifts everything down as the tower grows
    const startW = () => Math.min(170, w * 0.42);
    const s = {
      phase: "ready" as "ready" | "play" | "over",
      tower: [] as Floor[],
      curW: 0,
      falling: null as null | { x: number; y: number; vy: number },
      debris: [] as Debris[],
      lives: 3,
      combo: 0,
      best: Number(localStorage.getItem(SKYLINE_BEST) ?? 0),
      cam: 0,
      t: 0,
      popup: { text: "", until: 0 },
      overAt: 0,
    };
    const reset = () => {
      const bw = startW();
      s.tower = [{ x: w / 2 - bw / 2, w: bw, color: "#8e9aa8" }]; // lobby / foundation
      s.curW = bw;
      s.falling = null;
      s.debris = [];
      s.lives = 3;
      s.combo = 0;
      s.cam = 0;
      s.t = 0;
    };
    reset();
    const floors = () => s.tower.length - 1;
    const topY = () => ground() - s.tower.length * FH; // world y of the tower's top surface
    const hangX = () => w / 2 + Math.min(w * 0.33, 170) * Math.sin(s.t * (1.5 + Math.min(1.6, floors() * 0.06)));

    const act = () => {
      if (s.phase === "over") {
        if (performance.now() - s.overAt < 600) return;
        reset();
        s.phase = "ready";
        return;
      }
      if (s.phase === "ready") s.phase = "play";
      if (s.falling) return;
      s.falling = { x: hangX() - s.curW / 2, y: HOOK_Y + CABLE - s.cam, vy: 0 };
    };

    const land = (x: number) => {
      const top = s.tower[s.tower.length - 1];
      const color = FACADES[floors() % FACADES.length];
      const r = placeFloor(top, x, s.curW);
      if (r.miss) {
        s.debris.push({ x, w: s.curW, y: topY() - FH, vy: 0, vx: (x < top.x ? -1 : 1) * 60, rot: 0, vr: x < top.x ? -2 : 2, color });
        s.combo = 0;
        s.lives--;
        s.popup = { text: s.lives > 0 ? "Missed!" : "", until: performance.now() + 900 };
        if (s.lives <= 0) {
          s.phase = "over";
          s.overAt = performance.now();
          if (floors() > s.best) {
            s.best = floors();
            localStorage.setItem(SKYLINE_BEST, String(s.best));
          }
        }
        return;
      }
      for (const cut of r.cuts) {
        const left = cut.x < r.kept.x;
        s.debris.push({ ...cut, y: topY() - FH, vy: 0, vx: left ? -40 : 40, rot: 0, vr: left ? -1.5 : 1.5, color });
      }
      const kept = { ...r.kept };
      if (r.perfect) {
        s.combo++;
        if (s.combo % 3 === 0) {
          const grown = Math.min(startW(), kept.w + 14);
          kept.x -= (grown - kept.w) / 2;
          kept.w = grown;
        }
        s.popup = { text: s.combo > 1 ? `Perfect ×${s.combo}` : "Perfect!", until: performance.now() + 900 };
      } else s.combo = 0;
      s.tower.push({ ...kept, color });
      s.curW = kept.w;
    };

    const onPointer = (e: PointerEvent) => {
      e.preventDefault();
      c.focus();
      act();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        act();
      }
    };
    c.addEventListener("pointerdown", onPointer);
    c.addEventListener("keydown", onKey);
    c.focus();

    const drawFloor = (f: Floor, y: number, level: number, night: boolean) => {
      ctx.fillStyle = f.color;
      ctx.fillRect(f.x, y, f.w, FH);
      ctx.fillStyle = "rgba(0,0,0,0.18)";
      ctx.fillRect(f.x, y + FH - 3, f.w, 3); // slab line
      const n = Math.max(1, Math.floor(f.w / 24));
      const gapX = f.w / n;
      for (let i = 0; i < n; i++) {
        const lit = night && (i * 7 + level * 3) % 5 !== 0;
        ctx.fillStyle = lit ? "#ffd970" : "rgba(40,60,90,0.55)";
        ctx.fillRect(f.x + i * gapX + gapX / 2 - 5, y + 8, 10, 13);
      }
    };

    let raf = 0;
    let prev = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.033, (now - prev) / 1000);
      prev = now;
      s.t += dt;

      if (s.falling) {
        s.falling.vy += 1900 * dt;
        s.falling.y += s.falling.vy * dt;
        if (s.falling.y + FH >= topY()) {
          const x = s.falling.x;
          s.falling = null;
          land(x);
        }
      }
      for (const d of s.debris) {
        d.vy += 1600 * dt;
        d.y += d.vy * dt;
        d.x += d.vx * dt;
        d.rot += d.vr * dt;
      }
      s.debris = s.debris.filter((d) => d.y + s.cam < h + 200);
      // Keep the top of the tower around the middle of the screen.
      const want = Math.max(0, ground() - topY() - h * 0.5);
      s.cam += (want - s.cam) * Math.min(1, dt * 4);

      // Sky, sun/stars, city skyline
      const level = floors();
      const [top, bottom] = sky(level);
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, top);
      g.addColorStop(1, bottom);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      const night = level > 24;
      if (level > 18) {
        ctx.fillStyle = `rgba(255,255,255,${Math.min(0.9, (level - 18) / 10)})`;
        for (let i = 0; i < 40; i++) ctx.fillRect((i * 97) % w, (i * 53) % (h * 0.7), 2, 2);
      }
      const cityY = ground() + s.cam;
      ctx.fillStyle = "rgba(40,50,80,0.35)";
      for (let i = 0; i < w; i += 46) ctx.fillRect(i, cityY - 40 - ((i * 37) % 70), 38, 200);
      ctx.fillStyle = "#4b5563";
      ctx.fillRect(0, cityY, w, 400); // ground

      // Tower
      s.tower.forEach((f, i) => {
        const y = ground() - (i + 1) * FH + s.cam;
        if (y > h || y + FH < 0) return;
        if (i === 0) {
          ctx.fillStyle = f.color;
          ctx.fillRect(f.x, y, f.w, FH);
          ctx.fillStyle = "#3b4350";
          ctx.fillRect(f.x + f.w / 2 - 9, y + 10, 18, FH - 10); // door
        } else drawFloor(f, y, i, night);
      });

      // Falling floor + debris
      const nextColor = FACADES[level % FACADES.length];
      if (s.falling) drawFloor({ x: s.falling.x, w: s.curW, color: nextColor }, s.falling.y + s.cam, level + 1, night);
      for (const d of s.debris) {
        ctx.save();
        ctx.translate(d.x + d.w / 2, d.y + s.cam + FH / 2);
        ctx.rotate(d.rot);
        drawFloor({ x: -d.w / 2, w: d.w, color: d.color }, -FH / 2, 0, night);
        ctx.restore();
      }

      // Crane: jib across the top, trolley above the swinging floor
      ctx.fillStyle = "#f2b705";
      ctx.fillRect(0, HOOK_Y - 10, w, 8);
      ctx.strokeStyle = "#b88a00";
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 16) {
        ctx.beginPath();
        ctx.moveTo(x, HOOK_Y - 10);
        ctx.lineTo(x + 8, HOOK_Y - 2);
        ctx.stroke();
      }
      if (s.phase !== "over" && !s.falling) {
        const cx = hangX();
        ctx.fillStyle = "#333";
        ctx.fillRect(cx - 10, HOOK_Y - 4, 20, 8);
        ctx.strokeStyle = "#222";
        ctx.beginPath();
        ctx.moveTo(cx, HOOK_Y + 4);
        ctx.lineTo(cx, HOOK_Y + CABLE);
        ctx.stroke();
        drawFloor({ x: cx - s.curW / 2, w: s.curW, color: nextColor }, HOOK_Y + CABLE, level + 1, night);
      }

      // HUD
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = night ? "#fff" : "#1d1d1f";
      ctx.font = "700 18px system-ui, sans-serif"; // canvas can't resolve CSS vars
      ctx.fillText(`${level} floors`, 14, HOOK_Y + 32);
      ctx.font = "15px system-ui, sans-serif";
      ctx.fillText("♥".repeat(Math.max(0, s.lives)) + "♡".repeat(3 - Math.max(0, s.lives)), 14, HOOK_Y + 52);
      ctx.textAlign = "right";
      ctx.fillText(`Best ${s.best}`, w - 14, HOOK_Y + 32);
      if (now < s.popup.until && s.popup.text) {
        ctx.textAlign = "center";
        ctx.font = "800 22px system-ui, sans-serif";
        ctx.fillStyle = s.popup.text.startsWith("Perfect") ? "#ffcf33" : "#ff6b6b";
        ctx.fillText(s.popup.text, w / 2, HOOK_Y + CABLE + FH + 40);
      }
      ctx.textAlign = "center";
      if (s.phase === "ready") {
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.font = "500 15px system-ui, sans-serif";
        ctx.fillText("Tap or press Space to drop the floor", w / 2, h * 0.62);
      }
      if (s.phase === "over") {
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#fff";
        ctx.font = "700 26px system-ui, sans-serif";
        ctx.fillText(`${level} floors built`, w / 2, h * 0.4);
        ctx.font = "500 15px system-ui, sans-serif";
        ctx.fillText(`Best ${s.best}`, w / 2, h * 0.4 + 28);
        ctx.fillStyle = "rgba(255,255,255,0.65)";
        ctx.fillText("Tap to build again", w / 2, h * 0.4 + 54);
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      c.removeEventListener("pointerdown", onPointer);
      c.removeEventListener("keydown", onKey);
    };
  }, []);

  return <canvas ref={ref} className="game-canvas" tabIndex={0} aria-label="Skyline game: tap or press Space to drop a floor" />;
}
