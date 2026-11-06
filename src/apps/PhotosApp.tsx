"use client";

import { useRef, useState } from "react";
import { photos } from "@/config";

type Trail = { id: number; x: number; y: number; src: string };

// shortcut: client-side PIN, it only hides the gallery UI; the images in public/photos stay
// reachable by URL. Fine while the site is behind Vercel auth; use a server check if it goes public.
const PIN = "2005";
const UNLOCKED = "photos-unlocked";

function Lock({ onUnlock }: { onUnlock: () => void }) {
  const [code, setCodeState] = useState("");
  const [wrong, setWrong] = useState(false);
  const buf = useRef(""); // keystrokes can arrive faster than re-renders
  const setCode = (fn: (c: string) => string) => {
    buf.current = fn(buf.current);
    setCodeState(buf.current);
  };
  const press = (d: string) => {
    const next = (buf.current + d).slice(0, 4);
    setWrong(false);
    if (next.length < 4) return setCode(() => next);
    setCode(() => "");
    if (next === PIN) {
      sessionStorage.setItem(UNLOCKED, "1");
      onUnlock();
    } else setWrong(true);
  };
  return (
    <div
      className="pin"
      tabIndex={0}
      ref={(el) => el?.focus()}
      onKeyDown={(e) => {
        if (/^[0-9]$/.test(e.key)) press(e.key);
        else if (e.key === "Backspace") setCode((c) => c.slice(0, -1));
      }}
    >
      <span className="pin-lock" aria-hidden>🔒</span>
      <strong>Photos is locked</strong>
      <span className="muted">Enter the PIN to see the photos</span>
      <div className={`pin-dots${wrong ? " wrong" : ""}`} aria-label={`${code.length} of 4 digits entered`}>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={i < code.length ? "on" : ""} />
        ))}
      </div>
      <div className="pin-pad">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"].map((k, i) =>
          k ? (
            <button key={i} onClick={() => (k === "⌫" ? setCode((c) => c.slice(0, -1)) : press(k))} aria-label={k === "⌫" ? "Delete" : k}>
              {k}
            </button>
          ) : (
            <span key={i} />
          ),
        )}
      </div>
    </div>
  );
}

export default function PhotosApp() {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(UNLOCKED) === "1");
  return unlocked ? <Gallery /> : <Lock onUnlock={() => setUnlocked(true)} />;
}

// Cursor image trail over the header: drops a photo every ~70px of pointer travel.
function Gallery() {
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
