// One-time helper: prints a Spotify refresh token for your account.
// 1. Create an app at https://developer.spotify.com/dashboard
//    Redirect URI: http://127.0.0.1:8888/callback
// 2. SPOTIFY_CLIENT_ID=... SPOTIFY_CLIENT_SECRET=... node scripts/spotify-token.mjs
// 3. Open the printed URL, approve, copy the refresh token into .env.local / Vercel.
import http from "node:http";

const { SPOTIFY_CLIENT_ID: id, SPOTIFY_CLIENT_SECRET: secret } = process.env;
if (!id || !secret) throw new Error("Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET");
const redirect = "http://127.0.0.1:8888/callback";
const scope = "user-read-recently-played user-read-currently-playing";
console.log(`Open: https://accounts.spotify.com/authorize?${new URLSearchParams({ client_id: id, response_type: "code", redirect_uri: redirect, scope })}`);

http
  .createServer(async (req, res) => {
    const code = new URL(req.url, redirect).searchParams.get("code");
    if (!code) return res.end("No code");
    const r = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: redirect }),
    });
    const json = await r.json();
    console.log("\nSPOTIFY_REFRESH_TOKEN=" + json.refresh_token);
    res.end("Done. Check your terminal.");
    process.exit(0);
  })
  .listen(8888);
