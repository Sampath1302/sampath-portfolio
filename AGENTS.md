<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# Project Guidelines & Coding Standards

## 🎯 Project Overview
- **Name**: Sampath Kumar MS - Cybersecurity Portfolio
- **Domain**: Cybersecurity Engineering (SOC Operations, Threat Detection, Incident Response, SIEM, Security Automation)
- **Design Theme**: Terminal & Cyberpunk aesthetic (Base: `#05050A`, Neon Accent: `#CCFF00` / `#00EBC7`, Border: `border-white/10`, Glassmorphism)

---

## 🛠️ Tech Stack & Conventions
- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS v4 + PostCSS
- **Animations**: Framer Motion
- **Fonts**: Space Grotesk (`var(--font-space)`) for UI text & JetBrains Mono (`var(--font-mono)`) for code/terminals

---

## 📐 Architecture Rules
1. **App Directory**: 
   - All routes and pages belong in `/app` (e.g., `app/page.tsx`, `app/layout.tsx`).
   - Do **not** use or create files in `/src/app` to prevent route conflicts.
2. **Components**:
   - Reusable components must be placed in `components/ui/` (e.g., `GlassCard.tsx`, `Reveal.tsx`) or `components/background/` (e.g., `ParticleNetwork.tsx`).
   - Import components cleanly into pages rather than inlining large components inside `app/page.tsx`.
3. **TypeScript & Code Quality**:
   - Strive for strict typing. Avoid `any` types (e.g., define explicit interfaces for canvas particles and project data).
   - Ensure responsive layout support (mobile first, verified on `md` and `lg` viewports).
4. **Security & Integrity**:
   - Never commit sensitive keys, API secrets, or credentials.
   - External links (GitHub, LinkedIn, live demos) must include `rel="noopener noreferrer"` and `target="_blank"` where appropriate.

