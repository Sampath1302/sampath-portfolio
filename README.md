# Sampath Kumar MS — cybersecurity portfolio

Personal portfolio for SOC analyst and security operations roles: four project write-ups with
interactive walkthroughs, internship experience, certifications and contact details.

The design is called "night shift": a calm dark slate UI set in IBM Plex, where amber means
in progress / needs attention and teal means complete / held. The hero shows the projects as a
SIEM-style case queue.

## Stack

- Next.js 16 (App Router), React 19, TypeScript (strict)
- Tailwind CSS v4, configured in `app/globals.css` (`tailwind.config.ts` is not used)
- Framer Motion for the case queue and the project walkthroughs

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

Before committing a change:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Where things live

| What | Where |
| --- | --- |
| All site text: projects, experience, certifications, recognition | `lib/content.ts` |
| Name, email, links, site URL and page title | `lib/siteConfig.ts` |
| Home page sections | `components/sections/` |
| Shared UI (nav, case queue, status tags, project write-up layout) | `components/ui/` |
| Project pages | `app/projects/<slug>/page.tsx` |
| Walkthrough animations and interactive simulations | `components/project-demo/` |
| Looping project clips and posters | `public/media/` |
| Favicon, Apple touch icon, link-preview image | `app/icon.svg`, `app/apple-icon.png`, `app/opengraph-image.tsx` |
| Colour tokens | `app/globals.css` |

Edit text in `lib/content.ts` and `lib/siteConfig.ts`, not in components.
`AGENTS.md` holds the full design and coding rules.

## Motion

The site behaves like a live SOC: a faint background network where amber alerts travel to a node
and are resolved in teal, a case queue that ingests and triages its rows, and a "last event"
ticker built from the site content. Scroll effects play once, and everything has a still version
for reduced motion. `AGENTS.md` describes each piece.

The background is kept faint on purpose so muted text stays readable over it. If you change its
colours or opacity, rerun the check:

```bash
node scripts/check-background-contrast.mjs
```

## Project clips

Each project has a short silent loop (`<slug>.mp4`, `<slug>.webm`, `<slug>-poster.jpg`) recorded from
its walkthrough ("Open the live version" on the project page). They are cropped to the animation
panel only, recorded at a 640px viewport so the text stays readable at card size, and encoded at
1152px wide, 30 fps, BT.709. If an animation changes, re-record its clip and update the clip's
size in `components/ui/ProjectClip.tsx`.

## Before deploying

- Set `url` in `lib/siteConfig.ts` to the real domain. It is currently the placeholder
  `https://sampathkumar.example`, and link previews (LinkedIn, Slack, X) are built from it.
- After deploying, check the preview with LinkedIn's Post Inspector.

## Fonts

IBM Plex is served through `next/font/google`. The link-preview image needs static TTF files, so
IBM Plex Sans Condensed is also kept in `assets/fonts/` (SIL Open Font License).
