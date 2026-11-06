"use client";

import { useRef, useState } from "react";
import { useLiquidGlass } from "@/lib/useLiquidGlass";
import type { AppDef } from "@/apps";
import AppIcon from "./AppIcon";

// macOS-style magnification: icons scale by pointer distance. Transform-only, so the
// glass dock never resizes (a resize would rebake the refraction map every frame).
export default function Dock({ apps, open, onLaunch }: { apps: AppDef[]; open: Set<string>; onLaunch: (a: AppDef) => void }) {
  const ref = useRef<HTMLElement>(null);
  useLiquidGlass(ref);
  const [scales, setScales] = useState<number[]>([]);
  const items = useRef<(HTMLButtonElement | null)[]>([]);

  const magnify = (x: number) =>
    setScales(
      items.current.map((el) => {
        if (!el) return 1;
        // offsetLeft is untransformed, so the hit-test doesn't feed back on the scale.
        const center = el.offsetParent!.getBoundingClientRect().left + el.offsetLeft + el.offsetWidth / 2;
        return 1 + 0.6 * Math.max(0, 1 - Math.abs(x - center) / 140);
      }),
    );

  return (
    <nav ref={ref} className="dock liquid-glass" onPointerMove={(e) => e.pointerType === "mouse" && magnify(e.clientX)} onPointerLeave={() => setScales([])}>
      {apps.map((a, i) => {
        const s = scales[i] ?? 1;
        return (
          <button
            key={a.id}
            ref={(el) => {
              items.current[i] = el;
            }}
            className="dock-item"
            style={{ transform: `translateY(${-(s - 1) * 22}px) scale(${s})` }}
            onClick={() => onLaunch(a)}
            aria-label={a.name}
          >
            <span className="dock-label">{a.name}</span>
            <AppIcon app={a} />
            {open.has(a.id) && <span className="dock-dot" />}
          </button>
        );
      })}
    </nav>
  );
}
