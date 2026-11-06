"use client";

import { useState, type ComponentType } from "react";
import BugHuntApp from "../BugHuntApp";
import PacketHop, { PACKET_BEST } from "./PacketHop";
import Skyline, { SKYLINE_BEST } from "./Skyline";

const GAMES: { id: string; name: string; blurb: string; cover: string; glyph: string; bestKey: string; Game: ComponentType }[] = [
  { id: "skyline", name: "Skyline", blurb: "A crane swings apartment floors. Drop them straight — the overhang gets cut off.", cover: "linear-gradient(160deg,#ffb36b,#6a4bd1)", glyph: "🏗️", bestKey: SKYLINE_BEST, Game: Skyline },
  { id: "packethop", name: "Packet Hop", blurb: "Tap to keep a data packet in the air through the gaps in each firewall.", cover: "linear-gradient(160deg,#22d3ee,#1e3a8a)", glyph: "📦", bestKey: PACKET_BEST, Game: PacketHop },
  { id: "bughunt", name: "Bug Hunt", blurb: "Squash as many bugs crawling over the code as you can in 30 seconds.", cover: "linear-gradient(160deg,#34d399,#065f46)", glyph: "🐞", bestKey: "bughunt-best", Game: BugHuntApp },
];

export default function GamesApp() {
  const [playing, setPlaying] = useState<string | null>(null);
  const game = GAMES.find((g) => g.id === playing);

  if (game) {
    return (
      <div className="games">
        <div className="games-bar">
          <button className="liquid-glass-chip" onClick={() => setPlaying(null)}>‹ Library</button>
          <strong>{game.name}</strong>
          <span />
        </div>
        <div className="games-stage">
          <game.Game />
        </div>
      </div>
    );
  }

  return (
    <div className="games pad">
      <h1>Library</h1>
      <div className="games-grid">
        {GAMES.map((g) => (
          <button key={g.id} className="game-card" onClick={() => setPlaying(g.id)}>
            <span className="game-cover" style={{ background: g.cover }} aria-hidden>
              {g.glyph}
            </span>
            <strong>{g.name}</strong>
            <span className="muted">{g.blurb}</span>
            <span className="game-meta">
              <span className="muted">Best {localStorage.getItem(g.bestKey) ?? 0}</span>
              <span className="game-play">Play</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
