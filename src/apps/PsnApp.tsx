"use client";

import { useApi } from "@/lib/useApi";

type Psn = {
  name: string;
  avatar: string | null;
  isPlus: boolean;
  level: string;
  progress: number;
  trophies: { bronze: number; silver: number; gold: number; platinum: number };
  games: { name: string; icon: string | null; platform: string; lastPlayed: string; progress: number | null }[];
};

export default function PsnApp() {
  const p = useApi<Psn>("/api/psn");
  if (p === undefined) return <p className="pad muted">Signing in to PSN…</p>;
  if (p === null) return <p className="pad muted">PlayStation profile is offline right now.</p>;
  return (
    <div className="pad">
      <div className="psn-head">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {p.avatar && <img src={p.avatar} alt="" className="psn-avatar" />}
        <div>
          <h1>{p.name}</h1>
          <p className="muted">Level {p.level} · {p.progress}% to next{p.isPlus ? " · PS Plus" : ""}</p>
        </div>
      </div>
      <div className="chips">
        <span className="liquid-glass-chip">🏆 {p.trophies.platinum} platinum</span>
        <span className="liquid-glass-chip">🥇 {p.trophies.gold}</span>
        <span className="liquid-glass-chip">🥈 {p.trophies.silver}</span>
        <span className="liquid-glass-chip">🥉 {p.trophies.bronze}</span>
      </div>
      <h2>Recently played</h2>
      {p.games.map((g) => (
        <div key={g.name} className="track">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {g.icon ? <img src={g.icon} alt="" /> : <span className="cover" />}
          <span>
            <strong>{g.name}</strong>
            <span className="muted">
              {g.platform} · played {new Date(g.lastPlayed).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
              {g.progress !== null && ` · ${g.progress}% trophies`}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}
