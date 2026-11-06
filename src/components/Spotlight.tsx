"use client";

import { useState } from "react";
import { apps, type AppDef } from "@/apps";
import { projects, skills } from "@/config";
import { useDesktop } from "@/lib/desktop";
import AppIcon from "./AppIcon";
import FileIcon from "./FileIcon";

type Item = { key: string; group: string; title: string; subtitle: string; app?: AppDef; folder?: boolean; run: () => void };

export default function Spotlight({ onClose }: { onClose: () => void }) {
  const { open } = useDesktop();
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);

  const all: Item[] = [
    ...apps.map((a) => ({ key: a.id, group: "Applications", title: a.name, subtitle: a.href ? "Link" : "Application", app: a, run: () => open(a.id) })),
    ...projects.map((p) => ({ key: p.name, group: "Projects", title: p.name, subtitle: p.stack, folder: true, run: () => open("finder", { section: "projects", project: p.name }) })),
    ...Object.entries(skills).flatMap(([group, items]) =>
      items.map((s) => ({ key: `${group}:${s}`, group: "Skills", title: s, subtitle: group, run: () => open("code") })),
    ),
  ];
  const needle = q.trim().toLowerCase();
  const results = needle ? all.filter((i) => `${i.title} ${i.subtitle}`.toLowerCase().includes(needle)).slice(0, 12) : all.filter((i) => i.app && !i.app.href);

  const go = (i?: Item) => {
    if (!i) return;
    i.run();
    onClose();
  };

  return (
    <div className="menu-scrim spotlight-scrim" onPointerDown={onClose}>
      <div className="spotlight liquid-glass-menu" onPointerDown={(e) => e.stopPropagation()} role="dialog" aria-label="Spotlight Search">
        <div className="spot-input">
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
            <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M15.5 15.5 21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            autoFocus
            value={q}
            placeholder="Spotlight Search"
            aria-label="Search apps, projects and skills"
            onChange={(e) => {
              setQ(e.target.value);
              setSel(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                e.preventDefault();
                setSel((s) => Math.max(0, Math.min(results.length - 1, s + (e.key === "ArrowDown" ? 1 : -1))));
              } else if (e.key === "Enter") go(results[sel]);
              else if (e.key === "Escape") onClose();
            }}
          />
        </div>
        {results.length > 0 && (
          <ul className="spot-results" role="listbox">
            {results.map((r, i) => (
              <li key={r.key}>
                {r.group !== results[i - 1]?.group && <p className="menu-heading">{r.group}</p>}
                <button className={i === sel ? "active" : ""} role="option" aria-selected={i === sel} onPointerEnter={() => setSel(i)} onClick={() => go(r)}>
                  <span className="spot-icon">{r.app ? <AppIcon app={r.app} /> : r.folder ? <FileIcon kind="folder" size={26} /> : "◆"}</span>
                  <span className="spot-title">{r.title}</span>
                  <span className="spot-sub">{r.subtitle}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        {needle && results.length === 0 && <p className="spot-empty">No results for “{q}”</p>}
      </div>
    </div>
  );
}
