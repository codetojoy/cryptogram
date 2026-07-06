# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A free, open-source cryptogram game — decode a hidden quotation by cracking its letter-substitution cipher. The authoritative project plan is `doc/SPEC.md` — read it before making design decisions; work items arrive as `doc/TODO-*.md` files (each subsequent request follows that format). The stack, styling, project layout, and conventions deliberately mirror the sibling project at `/Users/measter/src/github/codetojoy/forty-fives`, which is **read-only reference** — never modify files there; consult it for how a given concern was solved.

**Current state:** scaffolding only (TODO-001). SvelteKit PWA shell with a home page (`/`) offering **Play** and **Config** (both placeholders) plus an **About** footer link, and a real `/about` page showing build info. There is no game logic, no puzzle content, and no tests yet — the domain layer and `data/` content arrive in later TODOs.

## Node version (required)

Node must satisfy the `engines` range in `package.json` (`^20.19 || ^22.12 || >=24`, mirroring `@sveltejs/vite-plugin-svelte` — note it excludes odd-numbered Node 23). `engine-strict=true` is set in `.npmrc`, so a non-matching Node fails fast — that is deliberate; do not bypass it with `--force`, relax `.npmrc`, or loosen the `engines` range.

## Commands

```sh
npm run dev               # dev server at http://localhost:5173 (hot reload)
npm run check             # svelte-check / typecheck
npm test                  # full Vitest suite, single run (no tests exist yet)
npm run test:unit         # Vitest watch mode
npx vitest --run path/to/file.test.ts   # a single test file (once tests exist)
npx vitest --run -t "name"              # tests matching a name
npm run build             # static production build into build/ (root base path)
npm run build:gh-pages    # build with BASE_PATH=/cryptogram for GitHub Pages
npm run preview           # serve the build at http://localhost:4173
npm run deploy:gh-pages   # build:gh-pages + publish build/ to the gh-pages branch
```

The service worker and PWA install flow only work in the production build (`build`/`build:gh-pages` + `preview`), never in the dev server — SvelteKit's service-worker auto-registration is disabled in `vite.config.ts` and re-registered manually, prod-only, in `src/routes/+layout.svelte`.

## Architecture

Pure client-side PWA: SvelteKit + `@sveltejs/adapter-static`, so **every route is prerendered to static HTML** (`export const prerender = true` in `src/routes/+layout.ts`) and all interactivity is client-side. Svelte 5 **runes mode** is forced project-wide via `compilerOptions.runes` in `vite.config.ts`. There is no backend and no `svelte.config.js` — the SvelteKit config (adapter, base path, service-worker flag) is passed inline to the `sveltekit()` plugin in `vite.config.ts`.

### Design principles inherited from SPEC (load-bearing, enforce as code lands)

- **Domain purity.** `src/lib/domain/` (planned, not yet created) must be pure TypeScript with **zero imports from Svelte/SvelteKit or any UI** — SPEC §7 calls the rules engine the heart of the project and the UI replaceable. UI code (`src/routes/`, `src/lib/ui/`) calls into the domain, never the reverse.
- **Puzzles and ciphers are data, not code.** Puzzle answers and cipher algorithms live in `data/*.json` (`puzzles.json`, `cipher-algos.json` — currently empty stubs), per SPEC §4. Do not encode individual puzzles or cipher variants as `if`-branches in game logic; add data and register it.
- **Immutable state, pure functions.** Game state should be plain JSON-able data; transitions produce new state. Prefer pure functions over classes in domain code (SPEC §9).
- **Privacy first.** No accounts, no analytics, no network calls beyond loading the site. State persists only to `localStorage` (settings, in-progress game). Any module touching `localStorage` must stay SSR-safe (guard with `browser`) because all routes are prerendered.

### Build-time version injection

`vite.config.ts` reads the version from `package.json` and captures the git short-hash and an Atlantic-time build timestamp, injecting all three via Vite `define` as `__APP_VERSION__` / `__BUILD_TIME__` / `__GIT_COMMIT__` (declared in `src/app.d.ts`). The `/about` page (`src/routes/about/+page.svelte`) reads these literals — they are baked into the static HTML, no runtime lookup. Bump the version in `package.json`; the commit hash reflects HEAD at build time. Version is currently `0.0.0`.

### Base path

`BASE_PATH` env var drives subpath hosting. Empty for `npm run dev`/root deploys; `/cryptogram` for GitHub Pages (`build:gh-pages`). `vite.config.ts` normalizes it and passes it to SvelteKit `paths.base`; use `import { base } from '$app/paths'` in links and `${base}/` in the service worker so both root and subpath hosting resolve correctly.

### Styling

The warm print-inspired theme (cream paper, terracotta accents, Lora serif display + Lato body) is defined once as CSS custom properties under `:global(:root)` in `src/routes/+layout.svelte` (`--bg`, `--accent`, `--serif`, etc.). Reuse these tokens; do not hardcode colors. Fonts are self-hosted (`static/fonts/*.woff2`) with `@font-face` rules in `src/app.html` — they live there (not in a component `<style>`) so their `%sveltekit.assets%` URLs are base-path-aware. No runtime font network calls (privacy).

## Constraints worth remembering

- **Accessibility is a hard requirement, not polish** (SPEC §2): ≥48px tap targets (prefer 56+), high-contrast, respect OS font scaling (`font-size: 100%` on `html`, `-webkit-text-size-adjust`).
- **License is Apache 2.0.** Any new visual asset must be CC0/MIT/Apache-compatible and recorded in `ASSETS.md` with its provenance (third-party today: the Lato & Lora font families, SIL OFL; the app icons are project-original).
- When something is genuinely ambiguous or inconsistent with the SPEC, prompt the human rather than guessing (TODO-001 instruction).
