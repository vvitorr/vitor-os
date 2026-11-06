"use client";

import { ReactNode, useState } from "react";
import { education, profile, projects, skills } from "@/config";

const K = ({ c }: { c: string }) => <span className="tk-kw">{c}</span>;
const S = ({ c }: { c: string }) => <span className="tk-str">&quot;{c}&quot;</span>;
const P = ({ c }: { c: string }) => <span className="tk-prop">{c}</span>;
const C = ({ c }: { c: string }) => <span className="tk-com">{c}</span>;
const H = ({ c }: { c: string }) => <span className="tk-kw">{c}</span>;

const files: Record<string, ReactNode[]> = {
  "skills.ts": [
    <C key="c" c={`// ${profile.name} — technical skills`} />,
    <>
      <K c="export const" /> <P c="skills" /> = {"{"}
    </>,
    ...Object.entries(skills).map(([group, items]) => (
      <>
        {"  "}
        <P c={group} />: [
        {items.map((s, i) => (
          <span key={s}>
            <S c={s} />
            {i < items.length - 1 ? ", " : ""}
          </span>
        ))}
        ],
      </>
    )),
    <>{"}"} <K c="as const" />;</>,
  ],
  "projects.md": projects.flatMap((p) => [
    <H key={p.name} c={`## ${p.name}`} />,
    <C key={p.name + "s"} c={`${p.stack} · ${p.date}`} />,
    ...p.points.map((pt) => <>- {pt}</>),
    <></>,
  ]),
  "about.md": [
    <H key="h" c={`# ${profile.name}`} />,
    <C key="r" c={`${profile.role} · ${profile.location}`} />,
    <></>,
    <>{profile.bio}</>,
    <></>,
    <H key="e" c="## Education" />,
    ...education.map((e) => <>- {e.degree} — {e.school} ({e.dates})</>),
  ],
};

export default function CodeApp() {
  const [file, setFile] = useState("skills.ts");
  return (
    <div className="code">
      <aside className="code-tree">
        <p className="muted">EXPLORER</p>
        <p className="muted">▾ portfolio</p>
        {Object.keys(files).map((f) => (
          <button key={f} className={f === file ? "active" : ""} onClick={() => setFile(f)}>
            {f.endsWith(".ts") ? "🟦" : "📝"} {f}
          </button>
        ))}
      </aside>
      <div className="code-main">
        <div className="code-tabs">
          <span className="code-tab">{file}</span>
        </div>
        <pre className="code-body">
          {files[file].map((line, i) => (
            <div key={i} className="code-line">
              <span className="ln">{i + 1}</span>
              <span>{line}</span>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}
