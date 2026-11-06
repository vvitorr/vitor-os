import { cacheLife } from "next/cache";
import {
  exchangeAccessCodeForAuthTokens,
  exchangeNpssoForAccessCode,
  getProfileFromAccountId,
  getProfileFromUserName,
  getRecentlyPlayedGames,
  getUserTitles,
  getUserTrophyProfileSummary,
} from "psn-api";

// Unofficial PSN API. PSN_NPSSO is the "npsso" cookie from ca.account.sony.com (expires ~2 months).
async function getPsn() {
  "use cache";
  cacheLife("hours");
  const npsso = process.env.PSN_NPSSO;
  if (!npsso) return null;
  try {
    const auth = await exchangeAccessCodeForAuthTokens(await exchangeNpssoForAccessCode(npsso));
    // The profile endpoint rejects "me"; the trophy summary returns the real account id.
    const summary = await getUserTrophyProfileSummary(auth, "me");
    const [profile, titles, recent] = await Promise.all([
      getProfileFromAccountId(auth, summary.accountId),
      getUserTitles(auth, summary.accountId, { limit: 50 }),
      // Sorted by last played (trophy titles are sorted by last trophy earned).
      getRecentlyPlayedGames(auth, { limit: 6, categories: ["ps4_game", "ps5_native_game"] }),
    ]);
    // Trophy % by game name; store and trophy names differ in ™/®/’ marks.
    const key = (n: string) => n.toLowerCase().replace(/[™®©]/g, "").replace(/[’‘]/g, "'").trim();
    const progress = new Map(titles.trophyTitles.map((t) => [key(t.trophyTitleName), t.progress]));
    // Real name (shared on the PSN profile) instead of the username; legacy endpoint keyed by online id.
    const detail = (await getProfileFromUserName(auth, profile.onlineId)).profile.personalDetail;
    return {
      name: [detail?.firstName, detail?.lastName].filter(Boolean).join(" ") || profile.onlineId,
      avatar: profile.avatars.at(-1)?.url ?? null,
      isPlus: profile.isPlus,
      level: summary.trophyLevel,
      progress: summary.progress,
      trophies: summary.earnedTrophies,
      games: recent.data.gameLibraryTitlesRetrieve.games.map((g) => ({
        name: g.name,
        icon: g.image?.url ?? null,
        platform: g.platform,
        lastPlayed: g.lastPlayedDateTime,
        progress: progress.get(key(g.name)) ?? null,
      })),
    };
  } catch (e) {
    console.error("PSN fetch failed", e);
    return null;
  }
}

export async function GET() {
  return Response.json(await getPsn());
}
