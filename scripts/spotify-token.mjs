// One-time helper: gets a Spotify refresh token for your account and saves it in .env.local.
// 1. Create an app at https://developer.spotify.com/dashboard (Web API),
//    Redirect URI: http://127.0.0.1:8888/callback
// 2. Put SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env.local
// 3. npm run spotify:token, open the printed link and approve.
//    The refresh token is written to .env.local (never printed).
import { readFileSync, writeFileSync } from "node:fs";
import http from "node:http";

const ENV_FILE = ".env.local";
const { SPOTIFY_CLIENT_ID: id, SPOTIFY_CLIENT_SECRET: secret } = process.env;
if (!id || !secret) throw new Error(`Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in ${ENV_FILE}`);
const redirect = "http://127.0.0.1:8888/callback";
const scope = "user-read-recently-played user-read-currently-playing";
console.log(`Open: https://accounts.spotify.com/authorize?${new URLSearchParams({ client_id: id, response_type: "code", redirect_uri: redirect, scope })}`);

function saveToken(token) {
  const lines = readFileSync(ENV_FILE, "utf8").split("\n").filter((l) => !l.startsWith("SPOTIFY_REFRESH_TOKEN="));
  lines.push(`SPOTIFY_REFRESH_TOKEN=${token}`);
  writeFileSync(ENV_FILE, lines.join("\n").replace(/\n*$/, "\n"), { mode: 0o600 });
}

http
  .createServer(async (req, res) => {
    const url = new URL(req.url, redirect);
    if (url.pathname !== "/callback") return res.end();
    const code = url.searchParams.get("code");
    if (!code) return res.end(`Spotify returned no code: ${url.searchParams.get("error") ?? "unknown error"}`);
    const r = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: redirect }),
    });
    const json = await r.json();
    if (!json.refresh_token) {
      console.error("Token exchange failed:", json.error, json.error_description ?? "");
      res.end("Token exchange failed. Check the terminal.");
      process.exit(1);
    }
    saveToken(json.refresh_token);
    console.log(`Saved SPOTIFY_REFRESH_TOKEN to ${ENV_FILE}.`);
    res.end("Done. You can close this tab.");
    process.exit(0);
  })
  .listen(8888, "127.0.0.1");
