
### TODO-012 — COMPLETE

Add new themes (along with config options): ✅

* Dark ✅
    * Typical dark theme: near-black paper (`--bg #121212`), light-grey ink (`#e8e8e8`), a friendly blue accent (`--accent #6ea8fe` / `--accent-deep #4f8ef0`).
* Bengal ✅
    * Tiger palette: near-black warm paper (`--bg #1a1206`), warm off-white ink (`#ffe9d0`), vivid tiger-orange accents (`--accent #f57c1f` / `--accent-deep #d9631a`) — orange & black.

Both reuse the theme structure from TODO-011: a `:root[data-theme='<id>']` colour-token override block in `src/routes/+layout.svelte`, one `THEMES` entry each in `src/lib/ui/theme.ts` (so the config dropdown offers them automatically), and a matching entry in the anti-flash inline map in `src/app.html` (kept in sync — a `NOTE` in `theme.ts` flags the duplication). Both are dark-background with high-contrast light ink to satisfy the accessibility requirement. Selection stores in localStorage and applies app-wide, exactly like the existing themes.

These theme do not have to be perfect: they are just examples for now, and simply need to be reasonable. ✅

* bump version to 0.2.12 ✅

**Notes:** No new third-party asset (colours are project-original), so `ASSETS.md` is unchanged. Verified with `npm run check` (0 errors, 346 files), 45 unit tests (the registry test now asserts all four labels), a clean production build, and an end-to-end browser drive: the dropdown offers Original/Prince/Dark/Bengal; choosing Dark flips `data-theme='dark'` (body `#121212`, theme-color `#4f8ef0`, persisted `{"theme":"Dark"}`) and Bengal flips `data-theme='bengal'` (body `#1a1206`, theme-color `#d9631a`, persisted `{"theme":"Bengal"}`); a fresh load of `/play` renders each immediately (anti-flash confirmed); resetting to Original reverts and persists.
