# vitor-os

Portfolio styled as a macOS desktop. Next.js 16, deployed on Vercel.

- **Desktop:** menu bar, magnifying liquid-glass dock, draggable and resizable windows with maximize and minimize-to-dock.
- **Apps:** Finder (projects with tags and Quick Look), About Me, Terminal, Code (skills), Photos, Spotify, PlayStation, Bug Hunt.
- **Navigation:** Spotlight (`⌘K` / `Ctrl+K`), and a right-click desktop menu to change the wallpaper and switch light/dark.

## Edit content

Everything personal lives in [`src/config.ts`](src/config.ts): profile, education, projects, skills, photos and wallpapers.
Each kind of content has one home: projects live in Finder, skills in Code, the profile in About Me. Spotlight and the Terminal only link to them.
Put real photos in `public/photos/` and list them in `photos`.

## App icons

`public/icons/<app id>.png` holds each app's icon. Missing files fall back to a drawn tile.
The current ones are the real macOS icons rendered from the installed apps. LinkedIn and PlayStation come from their App Store artwork, fitted to the macOS icon grid.

App ids: `finder` `about` `terminal` `code` `github` `photos` `spotify` `playstation` `bughunt` `linkedin` `mail`

To render another installed app's icon:

```bash
osascript -l JavaScript scripts/appicon.js "/Applications/Some App.app" public/icons/<id>.png 256
```

## Run

```bash
npm install
npm run dev
```

## Live data (optional)

Copy `.env.example` to `.env.local` and add the same keys in Vercel → Settings → Environment Variables.
Apps show an "offline" message when keys are missing.

- **Spotify**: create an app at developer.spotify.com (Web API, redirect URI `http://127.0.0.1:8888/callback`),
  put its Client ID and Secret in `.env.local`, then run `npm run spotify:token` and approve. The refresh token is saved to `.env.local`.
- **PlayStation**: unofficial API (`psn-api`). Sign in at playstation.com, open
  `https://ca.account.sony.com/api/v1/ssocookie`, copy the `npsso` value into `PSN_NPSSO`. It expires after ~2 months.

## Credits

- Wallpapers and app icons are Apple's and their respective owners' artwork. They are used here for a personal, private site. Wallpapers come from the [512pixels.net archive](https://512pixels.net/projects/default-mac-wallpapers-in-5k/), resized to 2560px.
- Refraction field ported from [liquid-glass-js](https://github.com/dashersw/liquid-glass-js) (MIT, © 2025 Armagan Amcalar).
