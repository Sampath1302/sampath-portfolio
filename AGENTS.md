<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# Project Guidelines & Coding Standards

## Project overview
- **Name**: Sampath Kumar MS, cybersecurity portfolio
- **Audience**: SOC / security operations hiring managers and recruiters (entry-level roles, Bengaluru or remote)
- **Positioning**: "SOC analyst, detection and response". Keep claims honest: CPT and Microsoft Cybersecurity Architect Expert are in progress; the Azure Sentinel lab was built with AI assistance and Sampath is still learning KQL, so never present it as hands-on KQL experience.

## Design system ("night shift")
- Calm, credible dark UI. No neon, glow, glassmorphism, particle backgrounds or scattered entrance animations.
- Colour tokens live in `app/globals.css` (`@theme`): `night` #0E141C (page), `surface` #151E29, `raised` #1B2633, `line` #263345, `ink` #E4E9F0, `muted` #8B98AA, `faint` #66758A.
- Semantic colours only: `signal` amber #F0B43C = in progress / needs attention (also the primary button and focus ring); `resolved` teal #4FC3A1 = complete / held; `threat` #E5604F; `info` #7AA7FF (demo components).
- Type: IBM Plex Sans (body, `font-sans`), IBM Plex Sans Condensed (name and headings, `font-display`), IBM Plex Mono only for real data such as IDs, code and log output (`font-mono`). Fonts are loaded with `next/font/google` in `app/layout.tsx`.
- Copy: sentence case, plain verbs, no all-caps labels, no arrows appended to links.
- The one signature element is the hero "case queue" (`components/ui/CaseQueue.tsx`). It is the only thing that animates on load.

## Tech stack
- Next.js 16 (App Router) + React 19 + TypeScript, Tailwind CSS v4 (configured in CSS; `tailwind.config.ts` is not used), Framer Motion.

## Where things live
- **Content**: all text, projects, experience and certifications are in `lib/content.ts`; personal links in `lib/siteConfig.ts`. Edit content there, not in components.
- **Home page sections**: `components/sections/` (Hero, Capabilities, CaseFiles, Experience, Certifications, Achievements, Contact).
- **Shared UI**: `components/ui/` (Nav, CaseQueue, StatusTag, SectionHeading, ProjectWriteup, ProjectPage, ProjectClip).
- **Project pages**: `app/projects/<slug>/page.tsx`, built on `ProjectWriteup`. Interactive demos in `components/project-demo/`; the two simulations are loaded with `next/dynamic` and `ssr: false` because they use random values and timers.
- **Project clips**: `public/media/<slug>.webm|.mp4|-poster.jpg`, shown by `ProjectClip`. They are screen recordings of each walkthrough animation (opened via "Open the live version"), cropped to the animation panel only, recorded at a 640px viewport and encoded at 1152px wide, 30 fps, BT.709. Each clip keeps its own aspect ratio, listed in `ProjectClip`. Re-record them if an animation changes.

## Architecture rules
1. All routes live in `/app`. Do not create `/src/app`.
2. Keep pages thin; put reusable pieces in `components/ui/` and content in `lib/content.ts`.
3. Strict TypeScript, no `any`. Mobile first; check phone width and `lg`.
4. Accessibility: visible focus (global `:focus-visible` style), respect `prefers-reduced-motion`, semantic headings and lists.
5. Never commit keys or credentials. External links use `target="_blank"` with `rel="noopener noreferrer"`.
6. Before finishing a change, run `npm run lint`, `npx tsc --noEmit` and `npm run build`.
