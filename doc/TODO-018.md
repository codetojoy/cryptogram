
### TODO-018 — COMPLETE

* When "Show Id" is enabled and the related link is pressed, change the display to a string of format "${display_num}-${category}". e.g. the first puzzle would show "0001-Philosophy" ✅
    * Updated the `displayId` derived in `src/routes/play/+page.svelte` from `${displayNum}-${id}` to `${displayNum}-${category}`. `displayNum` still comes from the puzzle lookup (it lives only on `Puzzle`, not `GameState`); the category is read from the same lookup.
* In this way, if the user has not seen the puzzle before, they do not see implicit hints from the `id` field. ✅
    * The `id` is a kebab of the author plus a quote word (e.g. `socrates-unexamined-life`), which would spoil an unseen puzzle. The category (e.g. `Philosophy`) leaks nothing that isn't already available via the existing "Show category" toggle.

* bump version to 0.2.18 ✅

**Notes:** Value-only change — no data, type, loader, or persistence edits; the `display_num` field, the "Show Id" config setting, and the reveal button/label ("Puzzle id") all stay as they were (kept per the agreed small notes). Verified with `npm run check` (0 errors, 346 files), 48 unit tests (unaffected — `displayId` is component-only), and a clean production build. End-to-end via headless-Chrome CDP (`scratchpad/displaycat018.mjs`, 6/6): across 4 distinct puzzles the reveal shows a `NNNN-Category` string (`0083-Humor`, `0089-Cuisine`, `0087-Cuisine`, `0026-Lyrics`), each matching `${display_num}-${category}` from the data file and never the `${display_num}-${id}` form — every revealed tail is a real category, confirming no id leak.
