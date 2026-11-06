"use client";

import { useState } from "react";
import { apps, type AppDef } from "@/apps";
import { profile } from "@/config";
import BootScreen from "./BootScreen";
import Dock from "./Dock";
import LightRays from "./LightRays";
import MenuBar from "./MenuBar";
import Window from "./Window";

type Win = { id: string; z: number; minimized: boolean; index: number };

export default function Desktop() {
  // Repeat visits: an inline script in layout sets html[data-booted] before paint and CSS hides the boot.
  const [boot, setBoot] = useState(0);
  const [booting, setBooting] = useState(true);
  const [wins, setWins] = useState<Win[]>([]);
  const [top, setTop] = useState(10);

  const focus = (id: string) => {
    setTop((t) => t + 1);
    setWins((ws) => ws.map((w) => (w.id === id ? { ...w, z: top + 1, minimized: false } : w)));
  };

  const launch = (app: AppDef) => {
    if (app.href) {
      if (app.href.startsWith("mailto:")) location.href = app.href;
      else window.open(app.href, "_blank", "noopener");
      return;
    }
    if (wins.some((w) => w.id === app.id)) return focus(app.id);
    setTop((t) => t + 1);
    setWins((ws) => [...ws, { id: app.id, z: top + 1, minimized: false, index: ws.length }]);
  };

  const visible = wins.filter((w) => !w.minimized);
  const focused = visible.reduce<Win | null>((a, w) => (!a || w.z > a.z ? w : a), null);
  const activeName = apps.find((a) => a.id === focused?.id)?.name ?? "Desktop";

  return (
    <main className="desktop liquid-glass-backdrop">
      <LightRays />
      <MenuBar
        active={activeName}
        onAbout={() => launch(apps.find((a) => a.id === "about")!)}
        onRestart={() => {
          setWins([]);
          sessionStorage.removeItem("booted");
          delete document.documentElement.dataset.booted;
          setBoot((b) => b + 1);
          setBooting(true);
        }}
      />
      <div className="desktop-hint">
        <h1>{profile.name}</h1>
        <p>{profile.role}</p>
      </div>
      {wins.map((w) => {
        const app = apps.find((a) => a.id === w.id)!;
        const C = app.Component!;
        return (
          <div key={w.id} hidden={w.minimized}>
            <Window
              title={app.name}
              z={w.z}
              index={w.index}
              width={app.width ?? 600}
              height={app.height ?? 440}
              focused={focused?.id === w.id}
              onFocus={() => focused?.id !== w.id && focus(w.id)}
              onClose={() => setWins((ws) => ws.filter((x) => x.id !== w.id))}
              onMinimize={() => setWins((ws) => ws.map((x) => (x.id === w.id ? { ...x, minimized: true } : x)))}
            >
              <C />
            </Window>
          </div>
        );
      })}
      <Dock apps={apps} open={new Set(wins.map((w) => w.id))} onLaunch={launch} />
      {booting && (
        <BootScreen
          key={boot}
          text={profile.name}
          onDone={() => {
            sessionStorage.setItem("booted", "1");
            setBooting(false);
          }}
        />
      )}
    </main>
  );
}
