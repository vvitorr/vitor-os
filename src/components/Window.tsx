"use client";

import { ReactNode, useRef, useState } from "react";

type Props = {
  title: string;
  z: number;
  index: number;
  width: number;
  height: number;
  focused: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
  children: ReactNode;
};

export default function Window({ title, z, index, width, height, focused, onClose, onMinimize, onFocus, children }: Props) {
  const [pos, setPos] = useState(() => ({
    x: Math.max(12, Math.min(innerWidth - width - 12, innerWidth / 2 - width / 2 + index * 28 - 60)),
    y: Math.max(40, Math.min(innerHeight - height - 100, 70 + index * 28)),
  }));
  const drag = useRef<{ dx: number; dy: number } | null>(null);

  return (
    <section
      className={`window liquid-glass liquid-glass--modal${focused ? " focused" : ""}`}
      style={{ zIndex: z, left: pos.x, top: pos.y, width, height }}
      onPointerDown={onFocus}
      role="dialog"
      aria-label={title}
    >
      <header
        className="titlebar"
        onPointerDown={(e) => {
          if ((e.target as HTMLElement).closest("button")) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          drag.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y };
        }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          setPos({
            x: Math.min(innerWidth - 80, Math.max(80 - width, e.clientX - drag.current.dx)),
            y: Math.min(innerHeight - 60, Math.max(28, e.clientY - drag.current.dy)),
          });
        }}
        onPointerUp={() => (drag.current = null)}
      >
        <div className="lights">
          <button className="light close" aria-label="Close" onClick={onClose} />
          <button className="light min" aria-label="Minimize" onClick={onMinimize} />
          <span className="light max" aria-hidden />
        </div>
        <span className="title">{title}</span>
      </header>
      <div className="window-body">{children}</div>
    </section>
  );
}
