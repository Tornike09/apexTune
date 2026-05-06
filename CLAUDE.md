# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server at http://localhost:3000
npm run build    # Production build
npm run start    # Run the production build
npm run lint     # Run ESLint (flat config in eslint.config.mjs)
```

There is no test runner configured.

## Next.js 16

This project is on **Next.js 16** (App Router, React 19, Tailwind v4). Per `AGENTS.md`, this version has breaking changes from earlier Next.js — APIs, conventions, and file layout may differ from training data. Before writing non-trivial Next.js code, consult the bundled docs at `node_modules/next/dist/docs/` and respect any deprecation notices. Do not assume Next.js 13/14/15 behavior.

## Architecture

- `app/layout.tsx` — root layout. Loads Geist Sans/Mono via `next/font/google` and exposes them as `--font-geist-sans` / `--font-geist-mono`. The `<body>` uses Tailwind utilities (`min-h-full flex flex-col`).
- `app/page.tsx` — single client component (`'use client'`). Currently a near-empty wrapper; styling driven by `page.module.css`.
- `app/globals.css` — global reset (`* { margin: 0; padding: 0; }`). Tailwind v4 is wired through `@tailwindcss/postcss` (see `postcss.config.mjs`).
- `app/page.module.css` — CSS Module with `.wrapper` (column flex) and `.image` (800×400 background-image tile).
- `next.config.ts` — `images.remotePatterns` whitelists `upload.wikimedia.org` for `next/image`. Add new external image hosts here.
- `tsconfig.json` — strict TS with path alias `@/*` → repository root.

Styling mixes Tailwind utility classes (in `layout.tsx`) with CSS Modules (in pages). Both are valid; pick whichever matches the surrounding file.
