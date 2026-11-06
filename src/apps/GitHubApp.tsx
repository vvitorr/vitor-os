"use client";

import { profile } from "@/config";
import { useApi } from "@/lib/useApi";

type Repo = { name: string; description: string | null; language: string | null; stars: number; url: string; homepage: string | null };

export default function GitHubApp() {
  const repos = useApi<Repo[]>("/api/github");
  return (
    <div className="pad">
      <div className="app-head">
        <h1>@{profile.github}</h1>
        <a href={`https://github.com/${profile.github}`} target="_blank" rel="noreferrer" className="liquid-glass-chip">Open profile ↗</a>
      </div>
      {repos === undefined && <p className="muted">Loading repositories…</p>}
      {repos?.length === 0 && <p className="muted">No public repositories yet.</p>}
      {repos === null && <p className="muted">Couldn&apos;t reach GitHub right now.</p>}
      <div className="repo-grid">
        {repos?.map((r) => (
          <a key={r.name} href={r.homepage ?? r.url} target="_blank" rel="noreferrer" className="repo">
            <strong>{r.name}</strong>
            <p className="muted">{r.description ?? "No description"}</p>
            <div className="chips">
              {r.language && <span className="liquid-glass-chip">{r.language}</span>}
              <span className="liquid-glass-chip">★ {r.stars}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
