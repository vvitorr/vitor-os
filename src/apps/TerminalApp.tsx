"use client";

import { useEffect, useRef, useState } from "react";
import { apps } from "@/apps";
import { profile, projects, skills } from "@/config";
import { useDesktop } from "@/lib/desktop";

type Line = { id: number; text: string; kind: "in" | "out" | "err" };
const PROMPT = "vitor@vitor-os ~ %";

const HELP: [string, string][] = [
  ["help", "list commands"],
  ["whoami", "who is this?"],
  ["about", "open About Me"],
  ["projects", "open my projects in Finder"],
  ["skills", "open my skills in Code"],
  ["contact", "how to reach me"],
  ["open <app>", "open an app (e.g. open github)"],
  ["ls", "list files"],
  ["ping <host>", "ICMP echo (simulated)"],
  ["traceroute <host>", "trace the path (simulated)"],
  ["ifconfig", "network interfaces"],
  ["neofetch", "system info"],
  ["date", "current date"],
  ["echo <text>", "print text"],
  ["clear", "clear the screen (or ⌃L)"],
];
const COMMANDS = [...HELP.map(([c]) => c.split(" ")[0]), "sudo", "history"];

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const fakeIp = (host: string) => {
  let h = 0;
  for (const c of host) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return `${(h >>> 24) % 223 + 1}.${(h >>> 16) & 255}.${(h >>> 8) & 255}.${h & 255}`;
};

export default function TerminalApp() {
  const { open } = useDesktop();
  const [lines, setLines] = useState<Line[]>(() => [
    { id: 0, kind: "out", text: `Last login: ${new Date().toString().slice(0, 24)} on ttys000` },
    { id: 1, kind: "out", text: "Type 'help' to see available commands." },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState(-1);
  const nextId = useRef(2);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  // Braces matter: scrollIntoView returns a Promise in recent Chrome, and effects must return nothing.
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [lines]);

  const print = (text: string | string[], kind: Line["kind"] = "out") =>
    setLines((ls) => [...ls, ...(Array.isArray(text) ? text : [text]).map((t) => ({ id: nextId.current++, kind, text: t }))]);
  // Streams lines with a delay, like real network tools.
  const stream = (rows: string[], every: number) =>
    rows.forEach((r, i) => timers.current.push(setTimeout(() => print(r), every * (i + 1))));

  const run = (raw: string) => {
    const [cmd, ...rest] = raw.trim().split(/\s+/);
    const arg = rest.join(" ");
    switch (cmd) {
      case "":
        return;
      case "help":
        return print(HELP.map(([c, d]) => `  ${c.padEnd(20)}${d}`));
      case "whoami":
        return print(`vitor — ${profile.name}, ${profile.role}`);
      case "about":
        open("about");
        return print("Opening About Me…");
      case "projects":
        open("finder", { section: "projects" });
        return print(`Opening Finder → Projects (${projects.length})…`);
      case "skills":
        open("code");
        return print("Opening Code → skills.ts…");
      case "contact":
        return print([`  email     ${profile.email}`, `  linkedin  ${profile.linkedin}`, `  github    https://github.com/${profile.github}`]);
      case "ls":
        return print("Applications/  Documents/  Projects/");
      case "date":
        return print(new Date().toString());
      case "echo":
        return print(arg);
      case "history":
        return print(history.map((h, i) => `  ${String(i + 1).padStart(3)}  ${h}`));
      case "sudo":
        return print("vitor is not in the sudoers file. This incident will be reported.", "err");
      case "open": {
        const app = apps.find((a) => a.id === arg.toLowerCase() || a.name.toLowerCase() === arg.toLowerCase());
        if (!app) return print(`The application "${arg || "?"}" could not be found. Try: ${apps.map((a) => a.id).join(", ")}`, "err");
        open(app.id);
        return print(`Opening ${app.name}…`);
      }
      case "ping": {
        const host = arg || "github.com";
        const ip = fakeIp(host);
        const rtts = [0, 1, 2, 3].map(() => rand(9, 28));
        print(`PING ${host} (${ip}): 56 data bytes`);
        stream(
          [
            ...rtts.map((t, i) => `64 bytes from ${ip}: icmp_seq=${i} ttl=56 time=${t.toFixed(3)} ms`),
            "",
            `--- ${host} ping statistics ---`,
            "4 packets transmitted, 4 packets received, 0.0% packet loss",
            `round-trip min/avg/max = ${Math.min(...rtts).toFixed(3)}/${(rtts.reduce((a, b) => a + b) / 4).toFixed(3)}/${Math.max(...rtts).toFixed(3)} ms`,
          ],
          350,
        );
        return;
      }
      case "traceroute": {
        const host = arg || "github.com";
        const hops = ["gw.home.lan (192.168.1.1)", "100.64.0.1 (100.64.0.1)", "core1.opo.isp.pt (10.20.0.1)", "ix.lis.pt (193.136.250.1)", "ae1.fra.backbone.net (80.81.192.1)", `${host} (${fakeIp(host)})`];
        let t = 0;
        print(`traceroute to ${host} (${fakeIp(host)}), 64 hops max, 52 byte packets`);
        stream(
          hops.map((h, i) => {
            t += rand(1, 9);
            return `${String(i + 1).padStart(2)}  ${h}  ${t.toFixed(3)} ms  ${(t + rand(0, 1)).toFixed(3)} ms  ${(t + rand(0, 1)).toFixed(3)} ms`;
          }),
          420,
        );
        return;
      }
      case "ifconfig":
        return print([
          "lo0: flags=8049<UP,LOOPBACK,RUNNING,MULTICAST> mtu 16384",
          "\tinet 127.0.0.1 netmask 0xff000000",
          "en0: flags=8863<UP,BROADCAST,SMART,RUNNING,SIMPLEX,MULTICAST> mtu 1500",
          "\tether 5c:e9:1e:42:0a:7f",
          "\tinet 192.168.1.42 netmask 0xffffff00 broadcast 192.168.1.255",
          "vlan10: flags=8843<UP,BROADCAST,RUNNING,SIMPLEX,MULTICAST> mtu 1500  # staff WLAN",
          "\tinet 10.10.10.42 netmask 0xffffff00 broadcast 10.10.10.255",
          "\tvlan: 10 parent interface: en0",
        ]);
      case "neofetch":
        return print([
          "   __      __      vitor@vitor-os",
          "   \\ \\    / /      --------------",
          `    \\ \\  / /       OS: vitor-os 2.0 (Next.js)`,
          `     \\ \\/ /        Host: ${profile.location}`,
          `      \\  /         Role: ${profile.role}`,
          `       \\/          Skills: ${Object.values(skills).flat().length}`,
          `                   Projects: ${projects.length}`,
          "                   Shell: zsh (simulated)",
          "                   Theme: Liquid Glass",
        ]);
      case "clear":
        return setLines([]);
      default:
        return print(`zsh: command not found: ${cmd}`, "err");
    }
  };

  return (
    <div className="terminal" onClick={() => inputRef.current?.focus()}>
      {lines.map((l) => (
        <div key={l.id} className={`term-line ${l.kind}`}>
          {l.kind === "in" && <span className="term-prompt">{PROMPT} </span>}
          {l.text}
        </div>
      ))}
      <div className="term-line" ref={endRef}>
        <span className="term-prompt">{PROMPT} </span>
        <input
          ref={inputRef}
          autoFocus
          className="term-input"
          value={input}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          aria-label="Terminal input"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setLines((ls) => [...ls, { id: nextId.current++, kind: "in", text: input }]);
              if (input.trim()) setHistory((h) => [...h, input]);
              setHIdx(-1);
              setInput("");
              run(input);
            } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
              e.preventDefault();
              if (!history.length) return;
              const i = e.key === "ArrowUp" ? (hIdx < 0 ? history.length - 1 : Math.max(0, hIdx - 1)) : hIdx < 0 ? -1 : hIdx + 1;
              const next = i >= history.length ? -1 : i;
              setHIdx(next);
              setInput(next < 0 ? "" : history[next]);
            } else if (e.key === "Tab") {
              e.preventDefault();
              const match = COMMANDS.find((c) => c.startsWith(input.trim()) && input.trim());
              if (match) setInput(match + " ");
            } else if (e.key === "l" && e.ctrlKey) {
              e.preventDefault();
              setLines([]);
            }
          }}
        />
      </div>
    </div>
  );
}
