# vitor-os

Portfolio styled as a macOS desktop. Next.js 16, deployed on Vercel.

- **Desktop:** menu bar, magnifying liquid-glass dock, draggable and resizable windows with maximize and minimize-to-dock.
- **Apps:** Finder (projects, CV, applications), Terminal, Code, GitHub, Photos, Spotify, PlayStation, Bug Hunt.
- **Navigation:** Spotlight (`⌘K` / `Ctrl+K`), and a right-click desktop menu to change the wallpaper and switch light/dark.

## Edit content

Everything personal lives in [`src/config.ts`](src/config.ts): profile, education, projects, skills, photos and wallpapers.
Put real photos in `public/photos/` and list them in `photos`.

## App icons

Drop an image into `public/icons/` named after the app id and it replaces the built-in tile automatically (png, webp, svg or jpg):

`finder` `about` `terminal` `code` `github` `photos` `spotify` `playstation` `bughunt` `linkedin` `mail`

Icons from macosicons.com download as `.icns`. Convert them on macOS with:

```bash
sips -s format png Spotify.icns --out public/icons/spotify.png
```

Check each icon's license or ask its creator before publishing it. macOSicons.com's terms cover personal use on your own devices only.

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

- Wallpapers from [Unsplash](https://unsplash.com) (Unsplash License): Matthew Mentley and Vijayalakshmi Nidugondi (Big Sur), Jenna Beekhuis (sunset), Matt Artz (Mojave), Dan Cutler (Catalina), Jessica Ruscello (Golden Hour).
- Refraction field ported from [liquid-glass-js](https://github.com/dashersw/liquid-glass-js) (MIT, © 2025 Armagan Amcalar).
