# vitor-os

Portfolio styled as a macOS desktop: menu bar, magnifying dock, draggable liquid-glass windows.
Next.js 16, deployed on Vercel.

## Edit content

Everything personal lives in [`src/config.ts`](src/config.ts): profile, education, projects, skills, photos.
Put real photos in `public/photos/` and list them in `photos`.

## Run

```bash
npm install
npm run dev
```

## Live data (optional)

Copy `.env.example` to `.env.local` and add the same keys in Vercel → Settings → Environment Variables.
Apps show an "offline" message when keys are missing.

- **GitHub**: works without keys. `GITHUB_TOKEN` only raises the rate limit.
- **Spotify**: create an app at developer.spotify.com (redirect URI `http://127.0.0.1:8888/callback`), then
  `SPOTIFY_CLIENT_ID=... SPOTIFY_CLIENT_SECRET=... node scripts/spotify-token.mjs` and copy the printed refresh token.
- **PlayStation**: unofficial API (`psn-api`). Sign in at playstation.com, open
  `https://ca.account.sony.com/api/v1/ssocookie`, copy the `npsso` value into `PSN_NPSSO`. It expires after ~2 months.

## Credits

Refraction field ported from [liquid-glass-js](https://github.com/dashersw/liquid-glass-js) (MIT, © 2025 Armagan Amcalar).
