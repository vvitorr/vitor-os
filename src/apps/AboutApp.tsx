"use client";

import { education, languages, profile } from "@/config";
import { useDesktop } from "@/lib/desktop";

export default function AboutApp() {
  const { open } = useDesktop();
  const initials = profile.name.split(" ").map((p) => p[0]).join("");
  return (
    <div className="about">
      <div className="avatar">{initials}</div>
      <h1>{profile.name}</h1>
      <p className="muted">{profile.role} · {profile.location}</p>
      <p>{profile.bio}</p>
      <h2>Education</h2>
      {education.map((e) => (
        <div key={e.school} className="row">
          <strong>{e.degree}</strong>
          <span className="muted">{e.school} · {e.dates}</span>
        </div>
      ))}
      <h2>Languages</h2>
      <p className="muted">{languages.map((l) => `${l.name} (${l.level})`).join(" · ")}</p>
      <div className="links">
        <button className="liquid-glass-chip" onClick={() => open("finder")}>Projects</button>
        <button className="liquid-glass-chip" onClick={() => open("code")}>Skills</button>
        <a href={`https://github.com/${profile.github}`} target="_blank" rel="noreferrer" className="liquid-glass-chip">GitHub</a>
        <a href={profile.linkedin} target="_blank" rel="noreferrer" className="liquid-glass-chip">LinkedIn</a>
        <a href={`mailto:${profile.email}`} className="liquid-glass-chip">Email</a>
      </div>
    </div>
  );
}
