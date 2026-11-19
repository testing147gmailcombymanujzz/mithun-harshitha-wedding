# Mithun & Harshitha — Wedding Invitation

A responsive React and Vite wedding invitation site. Wedding names, dates, timings, family details, addresses, venue, and countdown target live in `src/data/weddingDetails.js`.

## Requirements and local development

- Node.js 20.19+ or 22.12+
- npm

```bash
npm install
npm run dev
```

Vite prints the local URL (usually `http://localhost:5173`).

## Production and assets

```bash
npm run build
npm run preview
```

The production site is written to `dist/`. Calendar downloads are in `public/calendar/`. The music player uses the owner-provided looping MP3 in `public/audio/wedding-instrumental.mp3` and attempts playback three seconds after the page opens. Browsers may block audible autoplay; the manual control remains available if that happens. The original generated tanpura-inspired WAV remains as an alternate asset and can be regenerated with `npm run generate:audio`.

## Project structure

```text
public/                 Static audio, calendar, favicon, and illustration files
src/
  animations/           Shared Framer Motion variants and Intersection Observer reveal hook
  assets/               Imported custom SVG artwork
  components/           Navigation, cards, countdown, music control, and shared UI
  data/                 Central weddingDetails.js invitation copy and event data
  sections/             Hero, save date, couple, events, venue, and closing
  styles/               Global visual design system and responsive styling
  App.jsx                Top-level page composition
  main.jsx               React entry point
index.html               SEO metadata and Vite HTML shell
vercel.json              Vite build and output settings for Vercel
scripts/                 Original audio generator and headless Edge QA runner
```

The ceremony countdown uses the explicit `+05:30` IST offset. Reception and muhurtham calendars use `Asia/Kolkata`; the reception invitation has no end time because none was supplied.

## Upload to GitHub

Create an empty GitHub repository first, then run these commands in the project directory. Replace the username and repository URL with the values for that repository:

```bash
git init
git add .
git commit -m "Prepare Mithun and Harshitha wedding invitation"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/mithun-harshitha-wedding-invitation.git
git push -u origin main
```

## Import into Vercel

1. Sign in to Vercel and choose **Add New → Project**.
2. Connect GitHub if needed, then import the wedding invitation repository.
3. Vercel detects Vite. Confirm build command `npm run build` and output directory `dist` (also set in `vercel.json`).
4. Choose **Deploy** when you are ready to publish.

No GitHub upload or Vercel deployment is performed by these local project changes.

## Production QA (Windows / Microsoft Edge)

Build and serve the production bundle in one terminal:

```bash
npm run build
npm run preview -- --host 127.0.0.1 --port 4180
```

In another terminal, run `node scripts/qa-browser.mjs`. It checks the seven requested desktop, tablet, and mobile widths, accessibility basics, reduced motion, assets, calendar details, and browser errors. It requires Microsoft Edge to be installed.
