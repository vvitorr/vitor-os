"use client";

import { useApi } from "@/lib/useApi";

type Track = { name: string; artist: string; cover: string | null; url: string };

function Row({ t }: { t: Track }) {
  return (
    <a href={t.url} target="_blank" rel="noreferrer" className="track">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {t.cover ? <img src={t.cover} alt="" /> : <span className="cover" />}
      <span>
        <strong>{t.name}</strong>
        <span className="muted">{t.artist}</span>
      </span>
    </a>
  );
}

export default function SpotifyApp() {
  const data = useApi<{ nowPlaying: Track | null; recent: Track[] }>("/api/spotify");
  if (data === undefined) return <p className="pad muted">Loading…</p>;
  if (data === null) return <p className="pad muted">Spotify isn&apos;t connected yet.</p>;
  return (
    <div className="pad">
      <h2>{data.nowPlaying ? "Now playing" : "Not playing right now"}</h2>
      {data.nowPlaying && <Row t={data.nowPlaying} />}
      <h2>Recently played</h2>
      {data.recent.map((t, i) => (
        <Row key={i} t={t} />
      ))}
    </div>
  );
}
