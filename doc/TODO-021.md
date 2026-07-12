
### TODO-021 — COMPLETE

Human beta-testers report the following in the UI:
* words are not quite spaced far enough apart: they tend to run together
* the line underneath letters is hard to read and not clear

Please correct for these issues.

* bump version to 0.2.21 ✅

**Fixes (CSS-only, all in the `<style>` block of `src/routes/play/+page.svelte`):**

* **Word spacing.** ✅ Words are laid out as flex groups; the *inter-word* gap was
  `1rem` while *intra-word* letters sit `0.15rem` apart. With each cell `1.75rem`
  wide, a 1rem word gap read as barely wider than a single letter, so words ran
  together. Widened the board's column gap `1rem → 1.75rem` (and the row gap
  `0.35rem → 0.45rem` so wrapped lines breathe); the enciphered author `.byline`
  column gap went `0.75rem → 1.25rem` to match. The tight `0.15rem` intra-word gap
  was left as-is — keeping letters within a word close reinforces the grouping now
  that words are clearly separated.
* **Answer underline.** ✅ The slot the player writes into was drawn with
  `border-bottom: 2px solid var(--rule)` — but `--rule` is the theme's faint
  *hairline* token (`#ddd5c4` on cream paper), meant for panel borders, so the slot
  nearly vanished. Switched to `var(--muted)`, which has solid contrast in all four
  themes (cream/purple/dark/amber) and is still a design token (no hardcoded colour,
  per CLAUDE.md). The selected-cell (`--accent`) and solved (`--good`/transparent)
  underline states were already legible and are unchanged.

**Notes:** Pure presentation change — no domain, data, persistence, or markup edits;
no new dependencies or assets. Verified with `npm run check` (0 errors) and the full
unit suite (51 tests, unaffected). Word-spacing and contrast are ultimately
subjective, so a quick `npm run dev` eyeball across a couple of themes is the real
acceptance test.
