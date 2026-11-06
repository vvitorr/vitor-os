"use client";

import { useEffect, useState } from "react";
import { apps } from "@/apps";
import AppIcon from "@/components/AppIcon";
import FileIcon from "@/components/FileIcon";
import { projects, type ProjectTag } from "@/config";
import { useDesktop, type OpenArgs } from "@/lib/desktop";

type Section = "projects" | "applications" | ProjectTag;
const TAG_COLORS: Record<ProjectTag, string> = { Software: "#0a84ff", Networking: "#30d158", Web: "#ff9f0a" };
const TAGS = Object.keys(TAG_COLORS) as ProjectTag[];

function QuickLook({ name, onClose }: { name: string; onClose: () => void }) {
  const p = projects.find((x) => x.name === name);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [onClose]);
  if (!p) return null;
  return (
    <div className="ql-scrim" onClick={onClose}>
      <article className="ql" onClick={(e) => e.stopPropagation()} aria-label={`Quick Look: ${p.name}`}>
        <header className="ql-head">
          <strong>{p.name}</strong>
          <button onClick={onClose} aria-label="Close Quick Look">✕</button>
        </header>
        <div className="ql-body">
          <p className="muted">
            {p.period} · {p.role}
          </p>
          <p>{p.summary}</p>
          <div className="chips">
            {p.stack.split(", ").map((s) => (
              <span key={s} className="liquid-glass-chip">{s}</span>
            ))}
          </div>
          <ul>
            {p.points.map((pt) => (
              <li key={pt}>{pt}</li>
            ))}
          </ul>
          <div className="links">
            {p.url && (
              <a href={p.url} target="_blank" rel="noreferrer" className="ql-link">View on GitHub ↗</a>
            )}
            {p.live && (
              <a href={p.live} target="_blank" rel="noreferrer" className="ql-link">Live site ↗</a>
            )}
            {!p.url && !p.live && <span className="muted">Private repository</span>}
          </div>
        </div>
      </article>
    </div>
  );
}

export default function FinderApp({ args }: { args?: OpenArgs }) {
  const { open } = useDesktop();
  const [section, setSection] = useState<Section>(args?.section === "applications" ? "applications" : "projects");
  const [sel, setSel] = useState<string | null>(args?.project ?? null);
  const [look, setLook] = useState<string | null>(args?.project ?? null);

  const isApps = section === "applications";
  const shown = section === "projects" ? projects : projects.filter((p) => p.tags.includes(section as ProjectTag));
  const items = isApps
    ? apps.map((a) => ({ key: a.id, label: a.name, icon: <AppIcon app={a} />, tags: [] as ProjectTag[] }))
    : shown.map((p) => ({ key: p.name, label: p.name, icon: <FileIcon kind="folder" />, tags: p.tags }));
  const activate = (key: string) => (isApps ? open(key) : setLook(key));
  const pick = (s: Section) => {
    setSection(s);
    setSel(null);
  };

  return (
    <div className="finder">
      <aside className="finder-side">
        <p className="side-heading">Favorites</p>
        <button className={section === "projects" ? "active" : ""} onClick={() => pick("projects")}>
          <span aria-hidden>📁</span> Projects
        </button>
        <button className={isApps ? "active" : ""} onClick={() => pick("applications")}>
          <span aria-hidden>🅰</span> Applications
        </button>
        <p className="side-heading">Tags</p>
        {TAGS.map((t) => (
          <button key={t} className={section === t ? "active" : ""} onClick={() => pick(t)}>
            <span className="tag-dot" style={{ background: TAG_COLORS[t] }} aria-hidden /> {t}
          </button>
        ))}
      </aside>
      <div className="finder-main">
        <div className="finder-bar">
          <strong>{isApps ? "Applications" : section === "projects" ? "Projects" : section}</strong>
          <span className="muted">{items.length} items · double-click or press Space</span>
        </div>
        <div
          className="finder-grid"
          tabIndex={0}
          onKeyDown={(e) => {
            if (!sel) return;
            if (e.key === " ") {
              e.preventDefault(); // Space = Quick Look, like macOS
              if (isApps) open(sel);
              else setLook(look ? null : sel);
            } else if (e.key === "Enter") activate(sel);
          }}
        >
          {items.map((it) => (
            <button
              key={it.key}
              className={`finder-item${sel === it.key ? " selected" : ""}`}
              onClick={(e) => {
                setSel(it.key);
                if (e.detail === 0 || matchMedia("(pointer: coarse)").matches) activate(it.key);
              }}
              onDoubleClick={() => activate(it.key)}
            >
              <span className="finder-icon">{it.icon}</span>
              <span className="finder-label">
                {it.tags.map((t) => (
                  <span key={t} className="tag-dot" style={{ background: TAG_COLORS[t] }} aria-hidden />
                ))}
                {it.label}
              </span>
            </button>
          ))}
        </div>
        {look && !isApps && <QuickLook name={look} onClose={() => setLook(null)} />}
      </div>
    </div>
  );
}
