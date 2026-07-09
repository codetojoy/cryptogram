
### TODO-010 — COMPLETE

Introduce a config setting on the config page: "Theme". ✅

Available themes should be a drop-down list. For now, there is only one option "Original". It is selected by default. ✅
* New SSR-safe settings layer in `src/lib/ui/persistence.ts`: `Settings { theme }`, `defaultSettings()` (`{ theme: 'Original' }`), `loadSettings()` (per-field merge onto defaults so a save predating a future setting stays valid) and `saveSettings()`, keyed `cryptogram.settings.v1`. Mirrors the forty-fives settings pattern; theme is a plain string so adding a theme later is a data change, not a type change.
* Config page (`src/routes/config/+page.svelte`) replaces the placeholder with a form: a **Theme** `<select>` bound to `prefs.theme` (options come from a `THEMES` array, currently just `Original`, default-selected), plus a **Save** button and a `Saved / Unsaved changes` `aria-live` indicator driven by a `dirty` derived flag — the same edit/save model as the reference project.

No change to styling or UI. ✅
* No new palette or theme CSS — the page reuses the existing design tokens (`--panel`, `--rule`, `--accent`, `--bg`, `--focus`, …) and the established `.big-button` / form conventions. Selecting the (only) theme applies no visual change; this TODO just introduces the setting.

* bump version to 0.1.10 ✅

**Notes:** Verified with `npm run check` (0 errors, 344 files), 41 unit tests (added 3 settings tests: default is `Original`, `loadSettings` returns defaults under SSR, `saveSettings` is a safe no-op), a clean production build, and an end-to-end browser drive of `/config` — the dropdown offers exactly `["Original"]` with `Original` selected on load, Save is disabled in the clean state, and the indicator reads "Saved". With a single option the dirty→Save path can't yet be exercised through the UI; it activates as soon as a second theme is added.
