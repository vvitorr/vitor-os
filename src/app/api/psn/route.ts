import { cacheLife } from "next/cache";
import {
  exchangeAccessCodeForAuthTokens,
  exchangeNpssoForAccessCode,
  getProfileFromAccountId,
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
    const [profile, titles] = await Promise.all([
      getProfileFromAccountId(auth, summary.accountId),
      getUserTitles(auth, summary.accountId, { limit: 6 }),
    ]);
    return {
      onlineId: profile.onlineId,
      avatar: profile.avatars.at(-1)?.url ?? null,
      isPlus: profile.isPlus,
      level: summary.trophyLevel,
      progress: summary.progress,
      trophies: summary.earnedTrophies,
      games: titles.trophyTitles.map((t) => ({
        name: t.trophyTitleName,
        icon: t.trophyTitleIconUrl,
        platform: t.trophyTitlePlatform,
        progress: t.progress,
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
