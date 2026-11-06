"use client";

import { useRef, useState } from "react";
import { photos } from "@/config";

type Trail = { id: number; x: number; y: number; src: string };

// Cursor image trail over the header: drops a photo every ~70px of pointer travel.
export default function PhotosApp() {
  const [trail, setTrail] = useState<Trail[]>([]);
  const [open, setOpen] = useState<number | null>(null);
  const last = useRef({ x: 0, y: 0, n: 0 });

  return (
    <div className="photos">
      <div
        className="trail-zone"
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - r.left;
          const y = e.clientY - r.top;
          if (Math.hypot(x - last.current.x, y - last.current.y) < 70) return;
          const id = ++last.current.n;
          last.current.x = x;
          last.current.y = y;
          setTrail((t) => [...t.slice(-8), { id, x, y, src: photos[id % photos.length].src }]);
          setTimeout(() => setTrail((t) => t.filter((p) => p.id !== id)), 900);
        }}
      >
        <h1>Photos</h1>
        <p className="muted">move your cursor here</p>
        {trail.map((p) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={p.id} src={p.src} alt="" className="trail-img" style={{ left: p.x, top: p.y }} />
        ))}
      </div>
      <div className="photo-grid">
        {photos.map((p, i) => (
          <button key={p.src} onClick={() => setOpen(i)} aria-label={p.caption}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.src} alt={p.caption} />
          </button>
        ))}
      </div>
      {open !== null && (
        <button className="lightbox" onClick={() => setOpen(null)} aria-label="Close photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photos[open].src} alt={photos[open].caption} />
          <span>{photos[open].caption}</span>
        </button>
      )}
    </div>
  );
}
