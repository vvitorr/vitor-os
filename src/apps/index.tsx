import type { ComponentType } from "react";
import { profile } from "@/config";
import type { OpenArgs } from "@/lib/desktop";
import AboutApp from "./AboutApp";
import BugHuntApp from "./BugHuntApp";
import CodeApp from "./CodeApp";
import FinderApp from "./FinderApp";
import PhotosApp from "./PhotosApp";
import PsnApp from "./PsnApp";
import SpotifyApp from "./SpotifyApp";
import TerminalApp from "./TerminalApp";

export type AppDef = {
  id: string; // also the icon filename: public/icons/<id>.png
  name: string;
  icon: { bg: string; glyph: string; fg?: string }; // fallback tile when no icon file exists
  href?: string; // link apps open a new tab instead of a window
  Component?: ComponentType<{ args?: OpenArgs }>;
  width?: number;
  height?: number;
};

export const apps: AppDef[] = [
  { id: "finder", name: "Finder", icon: { bg: "linear-gradient(160deg,#6cc4ff,#1a73e8)", glyph: "📁" }, Component: FinderApp, width: 760, height: 480 },
  { id: "about", name: "About Me", icon: { bg: "linear-gradient(160deg,#fbbf24,#f97316)", glyph: "👋" }, Component: AboutApp, width: 460, height: 440 },
  { id: "terminal", name: "Terminal", icon: { bg: "linear-gradient(160deg,#3a3a3c,#0b0b0c)", glyph: ">_" }, Component: TerminalApp, width: 640, height: 420 },
  { id: "code", name: "Code", icon: { bg: "linear-gradient(160deg,#3b9cf5,#0d47a1)", glyph: "{ }" }, Component: CodeApp, width: 760, height: 480 },
  { id: "photos", name: "Photos", icon: { bg: "linear-gradient(160deg,#fff,#e5e7eb)", glyph: "🌸" }, Component: PhotosApp, width: 700, height: 520 },
  { id: "spotify", name: "Spotify", icon: { bg: "linear-gradient(160deg,#1ed760,#128c3e)", glyph: "♫", fg: "#000" }, Component: SpotifyApp, width: 420, height: 540 },
  { id: "playstation", name: "PlayStation", icon: { bg: "linear-gradient(160deg,#0070d1,#00246b)", glyph: "🎮" }, Component: PsnApp, width: 480, height: 520 },
  { id: "bughunt", name: "Bug Hunt", icon: { bg: "linear-gradient(160deg,#34d399,#047857)", glyph: "🐞" }, Component: BugHuntApp, width: 640, height: 480 },
  { id: "github", name: "GitHub", icon: { bg: "linear-gradient(160deg,#3b434b,#161b22)", glyph: "</>" }, href: `https://github.com/${profile.github}` },
  { id: "linkedin", name: "LinkedIn", icon: { bg: "linear-gradient(160deg,#2b86e0,#0a4f99)", glyph: "in" }, href: profile.linkedin },
  { id: "mail", name: "Mail", icon: { bg: "linear-gradient(160deg,#5ac8fa,#1d6fe0)", glyph: "✉" }, href: `mailto:${profile.email}` },
];

export const appById = (id: string) => apps.find((a) => a.id === id);
