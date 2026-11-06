"use client";

import { useEffect, useState } from "react";
import { apps } from "@/apps";
import AppIcon from "@/components/AppIcon";
import FileIcon from "@/components/FileIcon";
import { education, languages, profile, projects, skills } from "@/config";
import { useDesktop, type OpenArgs } from "@/lib/desktop";

type Section = "projects" | "documents" | "applications";
const SECTIONS: { id: Section; label: string; glyph: string }[] = [
  { id: "projects", label: "Projects", glyph: "📁" },
  { id: "documents", label: "Documents", glyph: "📄" },
  { id: "applications", label: "Applications", glyph: "🅰" },
];

function QuickLook({ item, onClose }: { item: string; onClose: () => void }) {
  const p = projects.find((x) => x.name === item);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="ql-scrim" onClick={onClose}>
      <article className="ql" onClick={(e) => e.stopPropagation()} aria-label={`Quick Look: ${item}`}>
        <header className="ql-head">
          <strong>{p ? p.name : "Vitor_Carneiro_CV"}</strong>
          <button onClick={onClose} aria-label="Close Quick Look">✕</button>
        </header>
        <div className="ql-body">
          {p ? (
            <>
              <p className="muted">{p.date}</p>
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
              {p.url && (
                <a href={p.url} target="_blank" rel="noreferrer" className="ql-link">View on GitHub ↗</a>
              )}
            </>
          ) : (
            <div className="resume">
              <h1>{profile.name}</h1>
              <p className="muted">{profile.role} · {profile.location}</p>
              <p className="muted">
                <a href={`mailto:${profile.email}`}>{profile.email}</a> · <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a> ·{" "}
                <a href={`https://github.com/${profile.github}`} target="_blank" rel="noreferrer">github.com/{profile.github}</a>
              </p>
              <h2>Profile</h2>
              <p>{profile.bio}</p>
              <h2>Education</h2>
              {education.map((e) => (
                <p key={e.school}>
                  <strong>{e.degree}</strong> — {e.school} <span className="muted">({e.dates})</span>
                </p>
              ))}
              <h2>Projects</h2>
              {projects.map((x) => (
                <p key={x.name}>
                  <strong>{x.name}</strong> <span className="muted">· {x.stack} · {x.date}</span>
                </p>
              ))}
              <h2>Technical Skills</h2>
              {Object.entries(skills).map(([g, items]) => (
                <p key={g}>
                  <strong>{g.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase())}:</strong> {items.join(", ")}
                </p>
              ))}
              <h2>Languages</h2>
              <p>{languages.map((l) => `${l.name}: ${l.level}`).join(" · ")}</p>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}

export default function FinderApp({ args }: { args?: OpenArgs }) {
  const { open } = useDesktop();
  const initial = args?.project ?? args?.file ?? null;
  const [section, setSection] = useState<Section>((args?.section as Section) ?? "projects");
  const [sel, setSel] = useState<string | null>(initial);
  const [look, setLook] = useState<string | null>(initial);

  const items =
    section === "projects"
      ? projects.map((p) => ({ key: p.name, label: p.name, icon: <FileIcon kind="folder" /> }))
      : section === "documents"
        ? [{ key: "cv", label: "Vitor_Carneiro_CV", icon: <FileIcon kind="doc" /> }]
        : apps.map((a) => ({ key: a.id, label: a.name, icon: <AppIcon app={a} /> }));

  const activate = (key: string) => (section === "applications" ? open(key) : setLook(key));

  return (
    <div className="finder">
      <aside className="finder-side">
        <p className="side-heading">Favorites</p>
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            className={s.id === section ? "active" : ""}
            onClick={() => {
              setSection(s.id);
              setSel(null);
            }}
          >
            <span aria-hidden>{s.glyph}</span> {s.label}
          </button>
        ))}
        <p className="side-heading">Links</p>
        <button onClick={() => open("github")}><span aria-hidden>🐙</span> GitHub</button>
        <button onClick={() => open("linkedin")}><span aria-hidden>🔗</span> LinkedIn</button>
      </aside>
      <div className="finder-main">
        <div className="finder-bar">
          <strong>{SECTIONS.find((s) => s.id === section)!.label}</strong>
          <span className="muted">{items.length} items · double-click or press Space</span>
        </div>
        <div
          className="finder-grid"
          tabIndex={0}
          onKeyDown={(e) => {
            if (!sel) return;
            if (e.key === " ") {
              e.preventDefault(); // Space = Quick Look, like macOS
              if (section === "applications") open(sel);
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
              <span className="finder-label">{it.label}</span>
            </button>
          ))}
        </div>
        {look && section !== "applications" && <QuickLook item={look} onClose={() => setLook(null)} />}
      </div>
    </div>
  );
}
