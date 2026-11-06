"use client";

import { useEffect, useRef, useState } from "react";

// Original mini-game: squash bugs crawling over code before the 30s timer ends.
type Bug = { x: number; y: number; vx: number; vy: number; a: number };
const ROUND = 30;
const BEST_KEY = "bughunt-best";
const LINES = ["function deploy() {", "  if (!tests.pass) {", "    throw new Bug();", "  }", "  return ship();", "}", "", "// TODO: fix later", "while (true) {", "  coffee++;", "}"];

export default function BugHuntApp() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const bugs = useRef<Bug[]>([]);
  const scoreRef = useRef(0);
  const roundTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [score, setScore] = useState(0);
  const [left, setLeft] = useState(ROUND);
  const [playing, setPlaying] = useState(false);
  const [done, setDone] = useState(false);
  // Only rendered client-side (windows open on click), so localStorage is available.
  const [best, setBest] = useState(() => Number(localStorage.getItem(BEST_KEY) ?? 0));

  const spawn = (w: number, h: number): Bug => {
    const a = Math.random() * Math.PI * 2;
    const sp = 60 + Math.random() * 90;
    return { x: 20 + Math.random() * (w - 40), y: 20 + Math.random() * (h - 40), vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, a };
  };

  useEffect(() => {
    const c = canvas.current!;
    const ctx = c.getContext("2d")!;
    let raf = 0;
    let prev = performance.now();
    const fit = () => {
      c.width = c.clientWidth * devicePixelRatio;
      c.height = c.clientHeight * devicePixelRatio;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(c);
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      const w = c.clientWidth;
      const h = c.clientHeight;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.font = "13px ui-monospace, Menlo, monospace"; // canvas can't resolve CSS vars
      ctx.fillStyle = "rgba(255,255,255,.18)";
      LINES.forEach((l, i) => ctx.fillText(l, 16, 28 + i * 22));
      ctx.font = "26px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (const b of bugs.current) {
        if (Math.random() < 0.02) {
          b.a += (Math.random() - 0.5) * 2;
          const sp = Math.hypot(b.vx, b.vy);
          b.vx = Math.cos(b.a) * sp;
          b.vy = Math.sin(b.a) * sp;
        }
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        if (b.x < 14 || b.x > w - 14) b.vx *= -1;
        if (b.y < 14 || b.y > h - 14) b.vy *= -1;
        b.x = Math.max(14, Math.min(w - 14, b.x));
        b.y = Math.max(14, Math.min(h - 14, b.y));
        ctx.fillText("🐞", b.x, b.y);
      }
      ctx.textAlign = "start";
      ctx.textBaseline = "alphabetic";
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setLeft((l) => Math.max(0, l - 1)), 1000);
    return () => clearInterval(id);
  }, [playing]);

  useEffect(() => () => clearTimeout(roundTimer.current), []);

  const finish = () => {
    setPlaying(false);
    setDone(true);
    setLeft(0);
    bugs.current = [];
    const s = scoreRef.current;
    if (s > Number(localStorage.getItem(BEST_KEY) ?? 0)) {
      localStorage.setItem(BEST_KEY, String(s));
      setBest(s);
    }
  };

  const start = () => {
    const c = canvas.current!;
    bugs.current = Array.from({ length: 5 }, () => spawn(c.clientWidth, c.clientHeight));
    scoreRef.current = 0;
    setScore(0);
    setLeft(ROUND);
    setDone(false);
    setPlaying(true);
    clearTimeout(roundTimer.current);
    roundTimer.current = setTimeout(finish, ROUND * 1000);
  };

  return (
    <div className="bughunt">
      <div className="bh-hud">
        <span>Score {score}</span>
        <span>⏱ {left}s</span>
        <span className="muted">Best {best}</span>
      </div>
      <canvas
        ref={canvas}
        onPointerDown={(e) => {
          if (!playing) return;
          const r = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - r.left;
          const y = e.clientY - r.top;
          const i = bugs.current.findIndex((b) => Math.hypot(b.x - x, b.y - y) < 22);
          if (i < 0) return;
          bugs.current[i] = spawn(r.width, r.height);
          // a new bug joins every 5 squashes
          scoreRef.current++;
          if (scoreRef.current % 5 === 0) bugs.current.push(spawn(r.width, r.height));
          setScore(scoreRef.current);
        }}
      />
      {!playing && (
        <div className="bh-overlay">
          <h1>Bug Hunt</h1>
          <p className="muted">{done ? `Time! You squashed ${score} bugs.` : "Squash as many bugs as you can in 30 seconds."}</p>
          <button className="liquid-glass-chip" onClick={start}>{done ? "Play again" : "Start"}</button>
        </div>
      )}
    </div>
  );
}
