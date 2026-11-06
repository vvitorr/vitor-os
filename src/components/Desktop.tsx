"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { appById, apps } from "@/apps";
import { profile } from "@/config";
import { DesktopContext, type OpenArgs } from "@/lib/desktop";
import BootScreen from "./BootScreen";
import ContextMenu from "./ContextMenu";
import Dock from "./Dock";
import AppIcon from "./AppIcon";
import DesktopIcons from "./DesktopIcons";
import FileIcon from "./FileIcon";
import MenuBar from "./MenuBar";
import Spotlight from "./Spotlight";
import Window from "./Window";

type Win = { id: string; z: number; minimized: boolean; index: number; args?: OpenArgs };

const nextZ = (ws: Win[]) => Math.max(10, ...ws.map((w) => w.z)) + 1;

export default function Desktop({ icons }: { icons: Record<string, string> }) {
  // Repeat visits: the inline script in layout sets html[data-booted] before paint and CSS hides the boot.
  const [boot, setBoot] = useState(0);
  const [booting, setBooting] = useState(true);
  const [wins, setWins] = useState<Win[]>([]);
  const [spotlight, setSpotlight] = useState(false);
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const open = useCallback((id: string, args?: OpenArgs) => {
    const app = appById(id);
    if (!app) return;
    if (app.href) {
      if (app.href.startsWith("mailto:")) location.href = app.href;
      else window.open(app.href, "_blank", "noopener");
      return;
    }
    setWins((ws) => {
      const z = nextZ(ws);
      if (ws.some((w) => w.id === id)) return ws.map((w) => (w.id === id ? { ...w, z, minimized: false, args: args ?? w.args } : w));
      return [...ws, { id, z, minimized: false, index: ws.length, args }];
    });
  }, []);

  const api = useMemo(() => ({ open, openSpotlight: () => setSpotlight(true), icons }), [open, icons]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSpotlight((s) => !s);
      } else if (e.key === "Escape") {
        setSpotlight(false);
        setMenu(null);
      }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);

  const focus = (id: string) => setWins((ws) => ws.map((w) => (w.id === id ? { ...w, z: nextZ(ws) } : w)));
  const visible = wins.filter((w) => !w.minimized);
  const focused = visible.reduce<Win | null>((a, w) => (!a || w.z > a.z ? w : a), null);

  return (
    <DesktopContext.Provider value={api}>
      <main
        className="desktop"
        onContextMenu={(e) => {
          if ((e.target as HTMLElement).closest(".window, .dock, .menubar")) return;
          e.preventDefault();
          setMenu({ x: e.clientX, y: e.clientY });
        }}
        onPointerDown={(e) => e.target === e.currentTarget && setSelected(null)}
      >
        <div className="wallpaper" aria-hidden />
        <MenuBar
          active={appById(focused?.id ?? "")?.name ?? "Finder"}
          onRestart={() => {
            setWins([]);
            sessionStorage.removeItem("booted");
            delete document.documentElement.dataset.booted;
            setBoot((b) => b + 1);
            setBooting(true);
          }}
        />
        <div className="desktop-icons">
          <DesktopIcons
            selected={selected}
            onSelect={setSelected}
            items={[
              { id: "projects", label: "Projects", icon: <FileIcon kind="folder" />, activate: () => open("finder", { section: "projects" }) },
              ...apps.filter((a) => a.desktop).map((a) => ({ id: a.id, label: a.name, icon: <AppIcon app={a} />, activate: () => open(a.id) })),
            ]}
          />
        </div>
        {wins.map((w) => {
          const app = appById(w.id)!;
          const C = app.Component!;
          return (
            <div key={w.id} hidden={w.minimized}>
              <Window
                id={w.id}
                title={app.name}
                z={w.z}
                index={w.index}
                width={app.width ?? 600}
                height={app.height ?? 440}
                focused={focused?.id === w.id}
                minimized={w.minimized}
                onFocus={() => focused?.id !== w.id && focus(w.id)}
                onClose={() => setWins((ws) => ws.filter((x) => x.id !== w.id))}
                onMinimize={() => setWins((ws) => ws.map((x) => (x.id === w.id ? { ...x, minimized: true } : x)))}
              >
                {/* New args (e.g. Spotlight picking another project) remount the app at that spot. */}
                <C key={JSON.stringify(w.args ?? {})} args={w.args} />
              </Window>
            </div>
          );
        })}
        <Dock
          apps={[...apps.filter((a) => !a.desktop), ...apps.filter((a) => a.desktop && wins.some((w) => w.id === a.id))]}
          open={new Set(wins.map((w) => w.id))}
          onLaunch={(a) => open(a.id)}
        />
        {spotlight && <Spotlight onClose={() => setSpotlight(false)} />}
        {menu && <ContextMenu x={menu.x} y={menu.y} onClose={() => setMenu(null)} />}
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
    </DesktopContext.Provider>
  );
}
