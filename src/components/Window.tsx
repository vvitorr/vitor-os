"use client";

import { ReactNode, useLayoutEffect, useRef, useState } from "react";

type Props = {
  id: string;
  title: string;
  z: number;
  index: number;
  width: number;
  height: number;
  focused: boolean;
  minimized: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
  children: ReactNode;
};

const MIN_W = 340;
const MIN_H = 240;

// Genie-lite: fly the window to/from its dock icon with the Web Animations API.
function fly(el: HTMLElement | null, id: string, dir: "in" | "out") {
  const icon = document.querySelector(`[data-dock="${id}"]`);
  if (!el || !icon || matchMedia("(prefers-reduced-motion: reduce)").matches) return Promise.resolve();
  el.getAnimations().forEach((a) => a.cancel());
  const a = el.getBoundingClientRect();
  const b = icon.getBoundingClientRect();
  const away = {
    transform: `translate(${b.left + b.width / 2 - (a.left + a.width / 2)}px, ${b.top + b.height / 2 - (a.top + a.height / 2)}px) scale(0.08)`,
    opacity: 0,
  };
  const home = { transform: "none", opacity: 1 };
  return el
    .animate(dir === "in" ? [away, home] : [home, away], { duration: 340, easing: "cubic-bezier(.2,.8,.2,1)", fill: dir === "out" ? "forwards" : "none" })
    .finished.then(() => undefined, () => undefined);
}

export default function Window({ id, title, z, index, width, height, focused, minimized, onClose, onMinimize, onFocus, children }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [rect, setRect] = useState(() => {
    const w = Math.min(width, innerWidth - 24);
    const h = Math.min(height, innerHeight - 140);
    return {
      x: Math.max(12, Math.min(innerWidth - w - 12, innerWidth / 2 - w / 2 + index * 28 - 60)),
      y: Math.max(40, Math.min(innerHeight - h - 100, 64 + index * 28)),
      w,
      h,
    };
  });
  const [max, setMax] = useState(false);
  const [snapping, setSnapping] = useState(false);
  const drag = useRef<{ mode: "move" | "r" | "b" | "rb"; sx: number; sy: number; start: typeof rect } | null>(null);

  // Runs on open and on restore from the dock; layout effect so the first frame is already animating.
  useLayoutEffect(() => {
    if (!minimized) fly(ref.current, id, "in");
  }, [minimized, id]);

  const toggleMax = () => {
    setSnapping(true); // animate left/top/size only for this toggle, not while dragging
    setMax((m) => !m);
    setTimeout(() => setSnapping(false), 300);
  };

  // Title bar drags (no data-rz); edge handles resize (data-rz = r | b | rb).
  const begin = (e: React.PointerEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).closest("button") || e.button !== 0) return;
    const mode = (e.currentTarget.dataset.rz ?? "move") as "move" | "r" | "b" | "rb";
    e.currentTarget.setPointerCapture(e.pointerId);
    let start = rect;
    if (max) {
      // Dragging a maximized window restores it under the cursor, like macOS.
      const w = rect.w;
      start = { ...rect, x: e.clientX - w / 2, y: 30 };
      setRect(start);
      setMax(false);
    }
    drag.current = { mode, sx: e.clientX, sy: e.clientY, start };
  };

  const move = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    const s = d.start;
    if (d.mode === "move") {
      setRect({ ...s, x: Math.min(innerWidth - 80, Math.max(80 - s.w, s.x + dx)), y: Math.min(innerHeight - 60, Math.max(30, s.y + dy)) });
    } else {
      setRect({
        ...s,
        w: d.mode === "b" ? s.w : Math.max(MIN_W, Math.min(innerWidth - s.x, s.w + dx)),
        h: d.mode === "r" ? s.h : Math.max(MIN_H, Math.min(innerHeight - s.y, s.h + dy)),
      });
    }
  };

  const end = () => (drag.current = null);
  const style = max ? { zIndex: z } : { zIndex: z, left: rect.x, top: rect.y, width: rect.w, height: rect.h };

  return (
    <section
      ref={ref}
      className={`window${focused ? " focused" : ""}${max ? " max" : ""}${snapping ? " snapping" : ""}`}
      style={style}
      onPointerDown={onFocus}
      role="dialog"
      aria-label={title}
    >
      <header className="titlebar" onPointerDown={begin} onPointerMove={move} onPointerUp={end} onDoubleClick={toggleMax}>
        <div className="lights">
          <button className="light close" aria-label="Close" onClick={onClose} />
          <button className="light min" aria-label="Minimize" onClick={() => fly(ref.current, id, "out").then(onMinimize)} />
          <button className="light zoom" aria-label={max ? "Restore" : "Maximize"} onClick={toggleMax} />
        </div>
        <span className="title">{title}</span>
      </header>
      <div className="window-body">{children}</div>
      {!max &&
        (["r", "b", "rb"] as const).map((m) => (
          <div key={m} data-rz={m} className={`rz rz-${m}`} onPointerDown={begin} onPointerMove={move} onPointerUp={end} aria-hidden />
        ))}
    </section>
  );
}
