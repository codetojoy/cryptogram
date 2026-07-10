
### TODO-017 — COMPLETE

* Add a new meta-data field, "display_num", to the puzzles and enumerate each puzzle starting with "0001" and incrementing (e.g. "0002", "0003", etc) ✅
    * Added `"display_num"` (placed right after `id`) to all 105 puzzles in `data/puzzles.json`, zero-padded 4-digit sequence `0001`..`0105` in array order. The `Puzzle` type gained `displayNum: string` and the loader (`src/lib/data/puzzles.ts`) validates it via `asString(o.display_num, …)`, so a missing/blank value fails fast at load.
* When "Show Id" is enabled and the related link is pressed, display a string of format "${display_num}-${id}". e.g. the first puzzle would show "0001-socrates-unexamined-life" ✅
    * The play page's "Puzzle id" reveal now renders a `displayId` derived — `${displayNum}-${id}` looked up from the puzzle list — instead of the bare id.
* The "display_num" field should not be used elsewhere in the app (yet). ✅
    * It is data-only: not added to the domain `GameState`, not read by any gameplay or persistence code. The play page looks it up in the UI purely for the debug string, keeping the domain layer free of this display concern.
* This will make it easier for humans to refer to puzzles, and yet not impact any current values in local storage. ✅
    * localStorage is untouched — the seen-list still keys off the kebab `id` and settings off `theme`/`showId`; `display_num` never touches storage, so in-progress games and seen history are unaffected.

* bump version to 0.2.17 ✅

**Notes:** JSON key stays snake_case (`display_num`) as specified; the TS field is `displayNum`, mapped explicitly in the loader (consistent with the codebase's camelCase). A `Puzzle` fixture in the domain test needed the new required field (caught by `svelte-check`, now fixed). Verified with `npm run check` (0 errors, 346 files) and 48 unit tests — the new data test asserts every `displayNum` is a 4-digit string forming the exact gap-free sequence `0001..0105` with the first being `0001`. End-to-end via headless-Chrome CDP (`scratchpad/displaynum017.mjs`, 2/2): with Show Id on, the reveal shows a `0000-id` string (`0039-genesis-beginning`) that exactly matches `${display_num}-${id}` from the data file. Plus a clean production build.
