"use client";

import type { AppDef } from "@/apps";
import { useDesktop } from "@/lib/desktop";

// Uses public/icons/<id>.* when present (full macOS-style artwork, padding included),
// otherwise a squircle tile drawn at the same visual size.
export default function AppIcon({ app }: { app: AppDef }) {
  const src = useDesktop().icons[app.id];
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt="" className="app-icon" draggable={false} />;
  }
  return (
    <span className="app-icon" aria-hidden>
      <span className="app-tile" style={{ background: app.icon.bg, color: app.icon.fg ?? "#fff" }}>
        {app.icon.glyph}
      </span>
    </span>
  );
}
