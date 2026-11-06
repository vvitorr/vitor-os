"use client";

import { useState, useSyncExternalStore } from "react";
import { profile } from "@/config";
import { setHtmlData, useDesktop, useHtmlData } from "@/lib/desktop";

const subscribeClock = (cb: () => void) => {
  const id = setInterval(cb, 15_000);
  return () => clearInterval(id);
};
const readClock = () => {
  const d = new Date();
  return `${d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })} ${d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;
};

export default function MenuBar({ active, onRestart }: { active: string; onRestart: () => void }) {
  const { open, openSpotlight } = useDesktop();
  const theme = useHtmlData("theme", "dark");
  const clock = useSyncExternalStore(subscribeClock, readClock, () => "");
  const [menu, setMenu] = useState(false);

  return (
    <header className="menubar">
      <button className="menu-logo" onClick={() => setMenu((m) => !m)} aria-expanded={menu} aria-label="Main menu">
        V
      </button>
      <strong>{active}</strong>
      <span className="menu-spacer" />
      <button className="menu-icon" onClick={openSpotlight} aria-label="Spotlight Search (⌘K)" title="Spotlight (⌘K)">
        <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden>
          <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2.4" />
          <path d="M15.5 15.5 21 21" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      </button>
      <button
        className="menu-icon"
        onClick={() => setHtmlData("theme", theme === "dark" ? "light" : "dark")}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} appearance`}
        title="Appearance"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden>
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.2" />
          <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" />
        </svg>
      </button>
      <span className="menu-clock">{clock}</span>
      {menu && (
        <>
          <div className="menu-scrim" onPointerDown={() => setMenu(false)} />
          <div className="dropdown liquid-glass-menu" onClick={() => setMenu(false)}>
            <button onClick={() => open("about")}>About {profile.name}</button>
            <hr />
            <button onClick={openSpotlight}>Spotlight… ⌘K</button>
            <button onClick={() => open("terminal")}>Terminal</button>
            <a href={`https://github.com/${profile.github}`} target="_blank" rel="noreferrer">GitHub ↗</a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
            <a href={`mailto:${profile.email}`}>Contact…</a>
            <hr />
            <button onClick={onRestart}>Restart…</button>
          </div>
        </>
      )}
    </header>
  );
}
