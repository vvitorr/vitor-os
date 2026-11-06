import type { AppDef } from "@/apps";

export default function AppIcon({ app }: { app: AppDef }) {
  return (
    <span className="app-icon" style={{ background: app.icon.bg, color: app.icon.fg ?? "#fff" }} aria-hidden>
      {app.icon.glyph}
    </span>
  );
}
