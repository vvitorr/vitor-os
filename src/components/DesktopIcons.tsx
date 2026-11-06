"use client";

import { ReactNode, useRef, useState, useSyncExternalStore } from "react";

export type DesktopItem = { id: string; label: string; icon: ReactNode; activate: () => void };
type Pos = { x: number; y: number };

// Icon positions persist in localStorage; read through an external store so SSR and hydration agree.
const KEY = "desktop-positions";
const EMPTY: Record<string, Pos> = {};
const listeners = new Set<() => void>();
let raw: string | null = null;
let cache: Record<string, Pos> = EMPTY;
const read = () => {
  const r = localStorage.getItem(KEY);
  if (r !== raw) {
    raw = r;
    try {
      cache = r ? JSON.parse(r) : EMPTY;
    } catch {
      cache = EMPTY;
    }
  }
  return cache;
};
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};
const save = (id: string, p: Pos) => {
  localStorage.setItem(KEY, JSON.stringify({ ...read(), [id]: p }));
  listeners.forEach((l) => l());
};

const SLOT = 96; // default column spacing, top-right like macOS

export default function DesktopIcons({ items, selected, onSelect }: { items: DesktopItem[]; selected: string | null; onSelect: (id: string) => void }) {
  const saved = useSyncExternalStore(subscribe, read, () => EMPTY);
  const [drag, setDrag] = useState<{ id: string; x: number; y: number } | null>(null);
  const start = useRef<{ id: string; px: number; py: number; ox: number; oy: number; moved: boolean } | null>(null);
  const moved = useRef(false); // suppresses the click/double-click that ends a drag

  return (
    <>
      {items.map((d, i) => {
        const p = drag?.id === d.id ? drag : saved[d.id];
        const style = p ? { left: p.x, top: p.y } : { right: 14, top: 44 + i * SLOT };
        return (
          <button
            key={d.id}
            className={`desktop-icon${selected === d.id ? " selected" : ""}${drag?.id === d.id ? " dragging" : ""}`}
            style={style}
            onPointerDown={(e) => {
              if (e.button !== 0) return;
              const r = e.currentTarget.getBoundingClientRect();
              start.current = { id: d.id, px: e.clientX, py: e.clientY, ox: r.left, oy: r.top, moved: false };
              moved.current = false;
              e.currentTarget.setPointerCapture(e.pointerId);
              onSelect(d.id);
            }}
            onPointerMove={(e) => {
              const s = start.current;
              if (!s) return;
              const dx = e.clientX - s.px;
              const dy = e.clientY - s.py;
              if (!s.moved && Math.hypot(dx, dy) < 4) return;
              s.moved = moved.current = true;
              setDrag({
                id: s.id,
                x: Math.max(0, Math.min(innerWidth - 96, s.ox + dx)),
                y: Math.max(30, Math.min(innerHeight - 110, s.oy + dy)),
              });
            }}
            onPointerUp={() => {
              if (drag && start.current?.moved) save(drag.id, { x: drag.x, y: drag.y });
              start.current = null;
              setDrag(null);
            }}
            onClick={(e) => {
              if (moved.current) return;
              // Touch screens and keyboard (detail 0) open on a single activation.
              if (e.detail === 0 || matchMedia("(pointer: coarse)").matches) d.activate();
            }}
            onDoubleClick={() => !moved.current && d.activate()}
          >
            <span className="desktop-icon-art">{d.icon}</span>
            <span className="desktop-icon-label">{d.label}</span>
          </button>
        );
      })}
    </>
  );
}
