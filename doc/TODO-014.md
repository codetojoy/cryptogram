
### TODO-014 — COMPLETE

Mark a puzzle "seen" as soon as it is solved.

**Problem:** Today a puzzle is only added to the seen-list when the player clicks **Next puzzle** (`nextPuzzle()` in `src/routes/play/+page.svelte` is the sole writer of `saveSeen`). Solving a puzzle does not record it, and neither does "Play again". So a player who solves a puzzle and then simply reloads the page — instead of clicking Next — finds that puzzle still in the unseen pool, and the random picker can serve it up again. This is a real source of the "I keep seeing repeats" reports (the other being incognito/private mode, where localStorage never persists across sessions — out of scope here).

**Task:**

* When a puzzle becomes solved, mark its id seen and persist it immediately — so a reload after solving will not resurface it. Do this at the moment the board reaches the solved state, not only on Next puzzle. ✅
    * Added a `markSeen(id)` helper (idempotent — a `seen.has` early-return) and a `$effect(() => { if (solved) markSeen(game.puzzleId); })` that records the id the instant the derived `solved` flag flips true, regardless of how it was solved (typing, Crack one, etc.). The idempotent guard also means the effect can't loop when it writes back to `seen`.
* Keep the current behaviour intact: ✅
    * "Next puzzle" still advances to a random unseen puzzle — it now calls the same `markSeen` helper (removing the duplicated inline add/save), and the "no puzzles left" end state is unchanged.
    * "Play again" still replays the *same* puzzle from scratch — `resetGame`/`loadPuzzle` never touch `seen`, so the mark persists; replaying an already-solved puzzle does not error.
    * "Start over" still clears the whole seen-list.
* An unsolved puzzle the player skips past with **Next puzzle** is still marked seen (unchanged). ✅

**Constraints:**

* Persistence stayed SSR-safe — the change lives in the component; `src/lib/ui/persistence.ts` was not touched, so the `browser`-guarded contract is intact. ✅
* No new dependencies; no domain-layer change (`isSolved` already existed). ✅

* bump version to 0.2.14 ✅

**Notes on testing:** The seen-on-solve logic lives in the `.svelte` component, and the project's Vitest setup has only a `node` (SSR) test project — there is no jsdom/component harness, and adding one (`@testing-library/svelte` + jsdom) would violate the "no new dependencies" constraint. So, consistent with how the earlier UI TODOs (009–012) were verified, this was confirmed end-to-end via a headless-Chrome CDP drive (`scratchpad/seen014.mjs`): starting from an empty seen-list, solving a puzzle with **Crack one** (no Next click) records exactly one id; **Play again** keeps that id; and a **reload** serves a *different* puzzle while retaining the original — 6/6 assertions passed. Also verified `npm run check` (0 errors, 346 files), the full unit suite (46 passed), and a clean production build.
