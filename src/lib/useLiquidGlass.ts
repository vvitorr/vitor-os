/*!
 * Liquid Glass — refraction hook (React port).
 *
 * The refraction field is a port of the fragment shader in liquid-glass-js
 * (https://github.com/dashersw/liquid-glass-js) — Copyright (c) 2025 Armagan
 * Amcalar, MIT. Permission is hereby granted, free of charge, to any person
 * obtaining a copy of that software to deal in it without restriction,
 * provided this notice travels with it; it is provided "as is", without
 * warranty of any kind. Keep this header on any copy or port.
 *
 * Pair with the `.liquid-glass` class from ../app/liquid-glass.css.
 */
"use client";

import { RefObject, useEffect } from "react";

const CFG = {
  edgeIntensity: 0.015,
  rimIntensity: 0.028,
  edgeDistance: 0.5,
  rimDistance: 1.7,
  cornerBoost: 0.06,
  rippleEffect: 0.26,
  blurRadius: 2,
};
const SUPERSAMPLE = 2;
const MAX_MAP_EDGE = 1400;
const BLUR_STD_PER_RADIUS = 0.35;

type Entry = { id: string; node: SVGFilterElement; refs: number };
const filters = new Map<string, Entry>();
let defs: SVGSVGElement | null = null;
let nextId = 0;

// SVG-referenced backdrop filters render in Chromium only; Safari parses and paints nothing.
function isSupported() {
  const brands = (navigator as Navigator & { userAgentData?: { brands: { brand: string }[] } }).userAgentData?.brands;
  if (brands) return brands.some((b) => /Chromium|Google Chrome|Microsoft Edge/i.test(b.brand));
  return /Chrome\//.test(navigator.userAgent);
}

export function useLiquidGlass(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const host = ref.current;
    if (!host || !isSupported()) return;
    let key: string | null = null;
    let frame = 0;
    let debounce: ReturnType<typeof setTimeout> | undefined;

    const release = () => {
      if (!key) return;
      const e = filters.get(key);
      key = null;
      if (e && --e.refs <= 0) {
        filters.delete(e.node.dataset.key!);
        e.node.remove();
      }
    };
    const rebuild = () => {
      const w = Math.round(host.offsetWidth);
      const h = Math.round(host.offsetHeight);
      if (w < 2 || h < 2) return;
      const cs = getComputedStyle(host).borderTopLeftRadius;
      const rv = parseFloat(cs) || 0;
      const radius = Math.min(cs.trim().endsWith("%") ? (rv / 100) * Math.min(w, h) : rv, Math.min(w, h) / 2);
      const pageW = window.innerWidth;
      const pageH = window.innerHeight;
      const k = [w, h, radius, pageW, pageH].join("|");
      if (k === key) return;
      release();
      host.style.backdropFilter = `url(#${acquire(k, w, h, radius, pageW, pageH).id})`;
      key = k;
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(rebuild);
    };
    const onWin = () => {
      clearTimeout(debounce);
      debounce = setTimeout(schedule, 180);
    };
    const ro = new ResizeObserver(schedule);
    ro.observe(host);
    window.addEventListener("resize", onWin, { passive: true });
    schedule();
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onWin);
      clearTimeout(debounce);
      cancelAnimationFrame(frame);
      release();
    };
  }, [ref]);
}

function acquire(key: string, w: number, h: number, radius: number, pageW: number, pageH: number): Entry {
  let e = filters.get(key);
  if (e && e.node.isConnected) {
    e.refs++;
    return e;
  }
  const { mapUrl, scale } = buildMap(w, h, radius, pageW, pageH);
  const id = `liquid-glass-${nextId++}`;
  const ns = "http://www.w3.org/2000/svg";
  const filter = document.createElementNS(ns, "filter");
  filter.setAttribute("id", id);
  const margin = scale / 2 + 3 * CFG.blurRadius * BLUR_STD_PER_RADIUS;
  const mx = (margin / w) * 100;
  const my = (margin / h) * 100;
  filter.setAttribute("x", `${-mx}%`);
  filter.setAttribute("y", `${-my}%`);
  filter.setAttribute("width", `${100 + 2 * mx}%`);
  filter.setAttribute("height", `${100 + 2 * my}%`);
  filter.setAttribute("color-interpolation-filters", "sRGB");
  filter.dataset.key = key;

  const img = document.createElementNS(ns, "feImage");
  for (const [a, v] of Object.entries({ href: mapUrl, x: "0", y: "0", width: String(w), height: String(h), preserveAspectRatio: "none", result: "map" }))
    img.setAttribute(a, v);
  const disp = document.createElementNS(ns, "feDisplacementMap");
  for (const [a, v] of Object.entries({ in: "SourceGraphic", in2: "map", scale: String(scale), xChannelSelector: "R", yChannelSelector: "G", result: "displaced" }))
    disp.setAttribute(a, v);
  const blur = document.createElementNS(ns, "feGaussianBlur");
  blur.setAttribute("in", "displaced");
  blur.setAttribute("stdDeviation", String(CFG.blurRadius * BLUR_STD_PER_RADIUS));
  filter.append(img, disp, blur);

  if (!defs || !defs.isConnected) {
    defs = document.createElementNS(ns, "svg");
    defs.setAttribute("width", "0");
    defs.setAttribute("height", "0");
    defs.setAttribute("aria-hidden", "true");
    defs.style.position = "fixed";
    defs.appendChild(document.createElementNS(ns, "defs"));
    document.body.appendChild(defs);
  }
  defs.querySelector("defs")!.appendChild(filter);
  e = { id, node: filter, refs: 1 };
  filters.set(key, e);
  return e;
}

function buildMap(w: number, h: number, radius: number, pageW: number, pageH: number) {
  const ss = Math.max(0.25, Math.min(SUPERSAMPLE, MAX_MAP_EDGE / Math.max(w, h)));
  const bw = Math.max(1, Math.round(w * ss));
  const bh = Math.max(1, Math.round(h * ss));
  const r = radius * ss;
  const minDim = Math.min(w, h);
  const dx = new Float32Array(bw * bh);
  const dy = new Float32Array(bw * bh);
  let maxAbs = 0;
  for (let py = 0; py < bh; py++) {
    for (let px = 0; px < bw; px++) {
      const cx = (px + 0.5) / bw;
      const cy = (py + 0.5) / bh;
      const tx = Math.abs(px + 0.5 - bw / 2) - (bw / 2 - r);
      const ty = Math.abs(py + 0.5 - bh / 2) - (bh / 2 - r);
      const distPx = Math.max(-(Math.hypot(Math.max(tx, 0), Math.max(ty, 0)) + Math.min(Math.max(tx, ty), 0) - r), 0) / ss;
      const rimFall = Math.exp(-distPx * CFG.rimDistance);
      const total = Math.exp(-distPx * CFG.edgeDistance) * CFG.edgeIntensity + rimFall * CFG.rimIntensity;
      let nx = cx - 0.5;
      let ny = cy - 0.5;
      const len = Math.hypot(nx, ny);
      if (len > 0) {
        nx /= len;
        ny /= len;
      }
      const corner = Math.exp(-Math.max(Math.min(cx, 1 - cx), Math.min(cy, 1 - cy)) * minDim * 0.3) * CFG.cornerBoost;
      const ripple = Math.sin((distPx / minDim) * 25) * CFG.rippleEffect * rimFall;
      const fx = (nx * (total + corner) - ny * ripple) * pageW;
      const fy = (ny * (total + corner) + nx * ripple) * pageH;
      const i = py * bw + px;
      dx[i] = fx;
      dy[i] = fy;
      maxAbs = Math.max(maxAbs, Math.abs(fx), Math.abs(fy));
    }
  }
  const scale = Math.max(maxAbs * 2, 1e-4);
  // feDisplacementMap decodes b as scale*(b/255-0.5); 128 isn't neutral, so pre-subtract the bias.
  const bias = scale * (128 / 255 - 0.5);
  const canvas = document.createElement("canvas");
  canvas.width = bw;
  canvas.height = bh;
  const ctx = canvas.getContext("2d")!;
  const image = ctx.createImageData(bw, bh);
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  for (let i = 0; i < bw * bh; i++) {
    image.data[i * 4] = clamp(255 * (0.5 + (dx[i] - bias) / scale));
    image.data[i * 4 + 1] = clamp(255 * (0.5 + (dy[i] - bias) / scale));
    image.data[i * 4 + 2] = 128;
    image.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(image, 0, 0);
  return { mapUrl: canvas.toDataURL("image/png"), scale };
}
