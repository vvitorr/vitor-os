"use client";

import { useEffect, useState } from "react";

const GLYPHS = "!<>-_\\/[]{}—=+*^?#01";

// Text-scramble boot: each letter cycles random glyphs, then locks in left to right.
export default function BootScreen({ text, onDone }: { text: string; onDone: () => void }) {
  const [shown, setShown] = useState("");
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const start = performance.now();
    const perChar = 70;
    let raf = 0;
    const tick = (now: number) => {
      const locked = Math.floor((now - start - 300) / perChar);
      setShown(
        [...text]
          .map((ch, i) => (ch === " " || i < locked ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join(""),
      );
      if (locked <= text.length) raf = requestAnimationFrame(tick);
      else setTimeout(() => setFading(true), 500);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text]);

  return (
    <div className={`boot${fading ? " fade" : ""}`} onTransitionEnd={onDone} onClick={() => setFading(true)}>
      <span className="boot-logo">V</span>
      <h1 className="boot-text">{shown}</h1>
      <div className="boot-bar"><span /></div>
    </div>
  );
}
