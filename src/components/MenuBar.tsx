"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { profile } from "@/config";
import { useLiquidGlass } from "@/lib/useLiquidGlass";

const subscribeClock = (cb: () => void) => {
  const id = setInterval(cb, 15_000);
  return () => clearInterval(id);
};
const readClock = () => {
  const d = new Date();
  return `${d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })} ${d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;
};

export default function MenuBar({ active, onAbout, onRestart }: { active: string; onAbout: () => void; onRestart: () => void }) {
  const ref = useRef<HTMLElement>(null);
  useLiquidGlass(ref);
  const clock = useSyncExternalStore(subscribeClock, readClock, () => "");
  const [menu, setMenu] = useState(false);

  return (
    <header ref={ref} className="menubar liquid-glass">
      <button className="menu-logo" onClick={() => setMenu((m) => !m)} aria-expanded={menu} aria-label="Main menu">
        V
      </button>
      <strong>{active}</strong>
      <span className="menu-spacer" />
      <span className="menu-clock">
        {clock}
      </span>
      {menu && (
        <div className="dropdown liquid-glass-menu" onClick={() => setMenu(false)}>
          <button onClick={onAbout}>About {profile.name}</button>
          <hr />
          <a href={`https://github.com/${profile.github}`} target="_blank" rel="noreferrer">GitHub ↗</a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
          <a href={`mailto:${profile.email}`}>Contact…</a>
          <hr />
          <button onClick={onRestart}>Restart…</button>
        </div>
      )}
    </header>
  );
}
