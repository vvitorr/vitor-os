"use client";

import { wallpapers } from "@/config";
import { setHtmlData, useDesktop, useHtmlData } from "@/lib/desktop";

export default function ContextMenu({ x, y, onClose }: { x: number; y: number; onClose: () => void }) {
  const { open } = useDesktop();
  const theme = useHtmlData("theme", "dark");
  const wallpaper = useHtmlData("wallpaper", "tahoe");
  const run = (fn: () => void) => () => {
    fn();
    onClose();
  };
  return (
    <div className="menu-scrim" onPointerDown={onClose} onContextMenu={(e) => (e.preventDefault(), onClose())}>
      <div
        className="ctx-menu liquid-glass-menu"
        style={{ left: Math.min(x, innerWidth - 240), top: Math.min(y, innerHeight - 320) }}
        onPointerDown={(e) => e.stopPropagation()}
        role="menu"
      >
        <p className="menu-heading">Change Wallpaper</p>
        {wallpapers.map((w) => (
          <button key={w.id} role="menuitemradio" aria-checked={w.id === wallpaper} onClick={run(() => setHtmlData("wallpaper", w.id))}>
            <span className="check">{w.id === wallpaper ? "✓" : ""}</span>
            {w.label}
          </button>
        ))}
        <hr />
        <button role="menuitem" onClick={run(() => setHtmlData("theme", theme === "dark" ? "light" : "dark"))}>
          <span className="check" />
          Use {theme === "dark" ? "Light" : "Dark"} Appearance
        </button>
        <button role="menuitem" onClick={run(() => open("terminal"))}>
          <span className="check" />
          Open Terminal
        </button>
        <button role="menuitem" onClick={run(() => open("about"))}>
          <span className="check" />
          About This Site
        </button>
      </div>
    </div>
  );
}
