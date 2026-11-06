"use client";

import { createContext, useContext, useSyncExternalStore } from "react";

export type OpenArgs = Record<string, string>;

type DesktopApi = {
  open: (id: string, args?: OpenArgs) => void;
  openSpotlight: () => void;
  icons: Record<string, string>; // app id -> /icons/<file>, only for files that exist
};

export const DesktopContext = createContext<DesktopApi | null>(null);
export const useDesktop = () => useContext(DesktopContext)!;

// Theme + wallpaper live on <html data-*> (set before paint by the inline script in layout.tsx).
const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

export function useHtmlData(key: "theme" | "wallpaper", fallback: string) {
  return useSyncExternalStore(subscribe, () => document.documentElement.dataset[key] ?? fallback, () => fallback);
}

export function setHtmlData(key: "theme" | "wallpaper", value: string) {
  document.documentElement.dataset[key] = value;
  localStorage.setItem(key, value);
  listeners.forEach((l) => l());
}
