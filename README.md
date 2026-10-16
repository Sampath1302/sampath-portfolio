# Sampath Kumar MS — cybersecurity portfolio

Personal portfolio for SOC analyst and security operations roles: four project write-ups with
interactive walkthroughs, internship experience, certifications and contact details.

The design is called "command deck": a modern SOC command centre on cool graphite, set in Chakra
Petch, IBM Plex Sans and JetBrains Mono, where mint means complete / held and soft blue means in
progress. The hero shows a "Command deck" panel of real counts and the projects over a "live SOC
wall" of illustrative panels.

## Stack

- Next.js 16 (App Router), React 19, TypeScript (strict)
- Tailwind CSS v4, configured in `app/globals.css` (`tailwind.config.ts` is not used)
- Framer Motion for the project walkthroughs

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
| Shared UI (nav, command deck, SOC wall, status tags, project write-up layout) | `components/ui/` |
| Project pages | `app/projects/<slug>/page.tsx` |
| Walkthrough animations and interactive simulations | `components/project-demo/` |
| Looping project clips and posters | `public/media/` |
| Favicon, Apple touch icon, link-preview image | `app/icon.svg`, `app/apple-icon.png`, `app/opengraph-image.tsx` |
| Colour tokens | `app/globals.css` |

Edit text in `lib/content.ts` and `lib/siteConfig.ts`, not in components.
`AGENTS.md` holds the full design and coding rules.

## Motion

The hero is the only part that keeps moving: a terminal line types `whoami --brief`, and the
"Command deck" panel draws its gauges from real counts in `lib/content.ts` in front of a "live SOC
wall" of illustrative SIEM panels. The wall uses only CSS transforms and opacity, pauses off-screen
and in hidden tabs, is static on phones and is a still frame under reduced motion. Elsewhere,
scroll effects play once. `AGENTS.md` describes each piece.

The wall is faded behind the text on purpose. If you change its colours, opacity or fades, rerun
the contrast check against a production server:

```bash
npm run build && npx next start -p 3200
node scripts/check-hero-contrast.mjs
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

Chakra Petch, IBM Plex Sans and JetBrains Mono are served through `next/font/google`. The
link-preview image needs static TTF files, so Chakra Petch is also kept in `assets/fonts/` (SIL Open
Font License).
