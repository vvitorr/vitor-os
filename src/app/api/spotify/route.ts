import { cacheLife } from "next/cache";

type Track = { name: string; artists: { name: string }[]; album: { images: { url: string }[] }; external_urls: { spotify: string } };
const toTrack = (t: Track) => ({
  name: t.name,
  artist: t.artists.map((a) => a.name).join(", "),
  cover: t.album.images.at(-1)?.url ?? null,
  url: t.external_urls.spotify,
});

// Needs SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN (see scripts/spotify-token.mjs).
async function getSpotify() {
  "use cache";
  cacheLife("minutes");
  const { SPOTIFY_CLIENT_ID: id, SPOTIFY_CLIENT_SECRET: secret, SPOTIFY_REFRESH_TOKEN: refresh } = process.env;
  if (!id || !secret || !refresh) return null;
  try {
    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refresh }),
    });
    if (!tokenRes.ok) throw new Error(`token ${tokenRes.status}`);
    const headers = { Authorization: `Bearer ${(await tokenRes.json()).access_token}` };
    const [nowRes, recentRes] = await Promise.all([
      fetch("https://api.spotify.com/v1/me/player/currently-playing", { headers }),
      fetch("https://api.spotify.com/v1/me/player/recently-played?limit=20", { headers }),
    ]);
    const now = nowRes.status === 200 ? await nowRes.json() : null;
    const recent = recentRes.ok ? await recentRes.json() : { items: [] };
    return {
      nowPlaying: now?.item && now.is_playing ? toTrack(now.item) : null,
      // Same song played several times shows once.
      recent: [...new Map((recent.items as { track: Track }[]).map((i) => toTrack(i.track)).map((t) => [`${t.name}|${t.artist}`, t])).values()],
    };
  } catch (e) {
    console.error("Spotify fetch failed", e);
    return null;
  }
}

export async function GET() {
  return Response.json(await getSpotify());
}
