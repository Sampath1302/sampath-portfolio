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

## Design system ("command deck")
- A modern SOC command centre with the polish of a premium tech product. Restraint everywhere except the hero. Accents stay subtle: no neon, no strong glows.
- Colour tokens live in `app/globals.css` (`@theme`): `graphite` #101318 (page, never pure black), `surface` #161A21, `raised` #1D222B, `line` #262B34; hairlines are white at 6–10% (`border-white/[0.06]`). Text: `ink` #ECEEF2 (body), `muted` #AEB4BF (secondary), `meta` #858C98 (meta and labels).
- Accents: `mint` #98DCC2 (with `mint-hi` #C4EEDD, `on-mint` #0E2219) is the primary: buttons, the prompt, the panel edge, focus ring, and "complete" / "held". `blue` #82A6E6 is the secondary: "in progress" and second chart series; its tint `blue-text` #AEC5F0 is for blue text. `threat` #E5604F is for demos only.
- Type: Chakra Petch (name and headings, `font-display`), IBM Plex Sans (body, `font-sans`), JetBrains Mono (terminal, small labels, log text, IDs, `font-mono`). All loaded with `next/font/google` in `app/layout.tsx`. The link-preview image (`app/opengraph-image.tsx`) reads Chakra Petch TTFs from `assets/fonts/`.
- Surfaces: `.glass` panels (faint white fill, 7% hairline edge, lit top edge) for project rows, capabilities, experience, certifications, recognition, contact, the project-page facts and clips. `.btn-mint` is the primary button, `.btn-glass` the secondary. No `backdrop-filter`.
- Headings: `SectionHeading` puts a small mono label (`01 / skills`) with a mint-to-blue rule above a Chakra Petch heading. Status: `StatusTag` pills, mint for complete / held, blue for in progress.
- Copy: sentence case, plain verbs, no arrows appended to links. Uppercase only for small mono labels (project categories, "Command deck").
- The signature element is the hero: the terminal line, the brushed-metal name (`.metal`, the only gradient text) and the "Command deck" panel (`components/ui/CommandDeck.tsx`) over the SOC wall (`components/ui/SocWall.tsx`).

## Honesty
- Every number and line in the command deck comes from `lib/content.ts`: gauges count held certifications, projects and internships, and each ring fills to a real share (held of all certifications, projects complete, internships finished). The status log (`statusLog`) only restates facts from that file.
- The SOC wall's log lines are illustrative ambience: made-up hosts, masked IPs, `aria-hidden`. They never mention Sampath or claim anything about him.

## Motion
Motion CSS lives in `app/globals.css`. Mint = complete / held, blue = in progress.
- **Hero, once on load (CSS, matches the server HTML)**: the terminal command types in with `clip-path` steps while the caret follows, then the caret blinks; the name, role and buttons rise; the deck panel rises, its gauges draw to their real values and the status log lines arrive one by one. A slow sheen crosses the panel and the "online" LED breathes.
- **SOC wall** (`SocWall.tsx`, server-rendered with fixed data; `WallPause.tsx` is the only client code): six panels in 3D perspective (event-rate chart, two log streams, alert heatmap, histogram, triage ring), two drifting light pools and static film grain, faded out on the left, top and bottom. Only `transform` and `opacity` animate. It pauses (`data-paused`) when off-screen or the tab is hidden. Phones (under 768px) get a flat, still wall with only the chart and heatmap behind an even veil. `node scripts/check-hero-contrast.mjs` (with `next start -p 3200` running) screenshots the hero over several moments of the loop with the text hidden and fails if any hero text drops under 4.5:1 (3:1 for large text). Rerun it after changing the wall, pools, fades or hero colours.
- **Scroll, once each** (`components/ui/MotionLayer.tsx`, opted into with `data-enter`): the Experience rail draws down, certification statuses tick in, QURIK evaluation numbers count up (`data-count-to`), project clips settle into their frame. Only elements below the fold at load animate; without JS nothing is hidden.
- **Feedback**: magnetic primary button (`data-magnetic`, fine pointers only), cursor spotlight on deck and project rows (`data-spotlight`), sweeping link underlines (`.link-sweep`). The mint focus ring is never removed.
- **Navigation**: project titles share a React `<ViewTransition>` name between the home page row and the project page; everything else crossfades.
- **Still banned**: anything moving outside the hero except the scroll-once effects above; fade-up reveals on every section; animating layout properties (`width`, `height`, `top`, `left`) or `filter`; `backdrop-filter` or `mix-blend-mode` over animated layers; neon, strong glows and coloured halos; gradient text other than the name; smooth-scroll libraries; custom cursors; anything looping in front of text; Three.js for decoration.
- **Reduced motion**: one still frame. The global rule in `globals.css` lands every animation on its final frame (gauges filled, command typed, solid caret, log visible), the wall's animations are switched off and view transitions are off.

## Tech stack
- Next.js 16 (App Router) + React 19 + TypeScript, Tailwind CSS v4 (configured in CSS; `tailwind.config.ts` is not used), Framer Motion.

## Where things live
- **Content**: all text, projects, experience and certifications are in `lib/content.ts`; personal links in `lib/siteConfig.ts`. Edit content there, not in components.
- **Home page sections**: `components/sections/` (Hero, Capabilities, CaseFiles, Experience, Certifications, Achievements, Contact).
- **Shared UI**: `components/ui/` (Nav, CommandDeck, SocWall, WallPause, StatusTag, SectionHeading, ProjectWriteup, ProjectPage, ProjectClip, MotionLayer).
- **Project pages**: `app/projects/<slug>/page.tsx`, built on `ProjectWriteup`. Interactive demos in `components/project-demo/`; the two simulations are loaded with `next/dynamic` and `ssr: false` because they use random values and timers.
- **Project clips**: `public/media/<slug>.webm|.mp4|-poster.jpg`, shown by `ProjectClip`. They are screen recordings of each walkthrough animation (opened via "Open the live version"), cropped to the animation panel only, recorded at a 640px viewport and encoded at 1152px wide, 30 fps, BT.709. Each clip keeps its own aspect ratio, listed in `ProjectClip`. Re-record them if an animation changes. The walkthrough animations keep their own data colours (teal, blue, amber, red) so the clips still match them; only their frame follows the command deck look.

## Architecture rules
1. All routes live in `/app`. Do not create `/src/app`.
2. Keep pages thin; put reusable pieces in `components/ui/` and content in `lib/content.ts`.
3. Strict TypeScript, no `any`. Mobile first; check phone width and `lg`.
4. Accessibility: visible focus (global `:focus-visible` style), respect `prefers-reduced-motion`, semantic headings and lists.
5. Never commit keys or credentials. External links use `target="_blank"` with `rel="noopener noreferrer"`.
6. Before finishing a change, run `npm run lint`, `npx tsc --noEmit` and `npm run build`.
