import { cacheLife } from "next/cache";
import { profile } from "@/config";

async function getRepos() {
  "use cache";
  cacheLife("hours");
  const headers: HeadersInit = process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {};
  const res = await fetch(`https://api.github.com/users/${profile.github}/repos?sort=updated&per_page=30`, { headers });
  if (!res.ok) return [];
  const repos: { name: string; description: string | null; language: string | null; stargazers_count: number; html_url: string; homepage: string | null; fork: boolean; updated_at: string }[] = await res.json();
  return repos
    .filter((r) => !r.fork)
    .map((r) => ({ name: r.name, description: r.description, language: r.language, stars: r.stargazers_count, url: r.html_url, homepage: r.homepage || null, updated: r.updated_at }));
}

export async function GET() {
  return Response.json(await getRepos());
}
