import type { ComponentType } from "react";
import { profile } from "@/config";
import AboutApp from "./AboutApp";
import GitHubApp from "./GitHubApp";
import PhotosApp from "./PhotosApp";
import CodeApp from "./CodeApp";
import BugHuntApp from "./BugHuntApp";
import SpotifyApp from "./SpotifyApp";
import PsnApp from "./PsnApp";

export type AppDef = {
  id: string;
  name: string;
  icon: { bg: string; glyph: string; fg?: string };
  href?: string; // link apps open a new tab instead of a window
  Component?: ComponentType;
  width?: number;
  height?: number;
};

export const apps: AppDef[] = [
  { id: "about", name: "About Me", icon: { bg: "linear-gradient(160deg,#fbbf24,#f97316)", glyph: "👋" }, Component: AboutApp, width: 460, height: 420 },
  { id: "github", name: "GitHub", icon: { bg: "linear-gradient(160deg,#3b434b,#161b22)", glyph: "</>" }, Component: GitHubApp, width: 720, height: 520 },
  { id: "code", name: "Code", icon: { bg: "linear-gradient(160deg,#3b9cf5,#0d47a1)", glyph: "{ }" }, Component: CodeApp, width: 760, height: 480 },
  { id: "photos", name: "Photos", icon: { bg: "linear-gradient(160deg,#fff,#e5e7eb)", glyph: "🌸" }, Component: PhotosApp, width: 700, height: 520 },
  { id: "spotify", name: "Spotify", icon: { bg: "linear-gradient(160deg,#1ed760,#128c3e)", glyph: "♫", fg: "#000" }, Component: SpotifyApp, width: 420, height: 540 },
  { id: "psn", name: "PlayStation", icon: { bg: "linear-gradient(160deg,#0070d1,#00246b)", glyph: "🎮" }, Component: PsnApp, width: 480, height: 520 },
  { id: "bughunt", name: "Bug Hunt", icon: { bg: "linear-gradient(160deg,#34d399,#047857)", glyph: "🐞" }, Component: BugHuntApp, width: 640, height: 480 },
  { id: "linkedin", name: "LinkedIn", icon: { bg: "linear-gradient(160deg,#2b86e0,#0a4f99)", glyph: "in" }, href: profile.linkedin },
  { id: "mail", name: "Mail", icon: { bg: "linear-gradient(160deg,#5ac8fa,#1d6fe0)", glyph: "✉" }, href: `mailto:${profile.email}` },
];
