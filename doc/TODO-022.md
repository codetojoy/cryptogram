
### TODO-022 — COMPLETE

Three quick wins found by studying the codebase. All three are implemented.

* bump version to 0.2.22 ✅

---

#### 1. Resume an in-progress game (closes a stated SPEC gap) ✅

**Was.** A mid-puzzle reload silently threw away every guess *and* dropped the player
onto a **different** random puzzle — contradicting SPEC §3, which says `localStorage`
persists **"settings, in-progress game"**. Only `cryptogram.seen.v1` and
`cryptogram.settings.v1` existed.

**Now.** New key `cryptogram.game.v1`. A reload resumes exactly where you left off.

**Design: the save holds only `{ puzzleId, guesses }` — not the board.** The
ciphertext and answer key are a deterministic function of the puzzle and the cipher
algorithm (`startGame` folds `hashString(id)` into the seed), so they are re-derived
on load by a new pure domain function:

```ts
restoreGame(puzzle, algorithm, guesses): GameState   // startGame + replay setGuess
```

This is strictly better than persisting the whole `GameState`: a save can never
resurrect a **stale board** if puzzle text or the cipher algo changes; the payload is
small; the answer key never touches localStorage; and replaying the guesses through
`setGuess` re-applies the domain's **injectivity invariant**, so a corrupt or
hand-edited save cannot produce an illegal state (it throws on a non-letter → the
caller discards the save; duplicate plaintext assignments are dropped).

`persistence.ts` stays **dumb** — it shape-validates and returns, and deliberately
does *not* import the puzzle data. The "does this puzzle id still exist?" lookup
happens in the play page, matching how `displayId` already does its lookup
(TODO-018) and keeping the UI/data layering intact.

**Solved games are restored too (per the human's call).** Reloading after a win
brings the "Solved!" banner back rather than dealing a fresh puzzle.

---

#### 2. Kill the flash of the wrong puzzle on every `/play` load ✅

**Was.** `game` was initialised at component-init to `startGame(puzzles[0], …)`.
Because every route is prerendered, **puzzle #1's board was baked into `/play`'s
static HTML** and painted for *every* visitor on *every* load, before `onMount`
swapped in the real puzzle.

**Now.** A `ready` flag (set at the end of `onMount`) gates the board; until then a
"Shuffling the deck…" placeholder renders, sized to roughly the board's height so
hydration doesn't jolt the layout. Verified against the actual build output:
`build/play.html` now contains **0** board cells and **1** placeholder.

The `puzzles[0]` initialiser is retained — it is still needed for type-safety before
mount, it simply never renders now. Making `game` nullable would have churned every
`game.` reference for no gain.

---

#### 3. Test `src/lib/domain/rng.ts` — the one untested domain module ✅

`rng.ts` is load-bearing for determinism, yet had no tests. New `tests/domain/rng.test.ts`
covers `hashString` (determinism, unsigned-32-bit range, **no collisions across all
115 real puzzle ids**) and `createRng` (reproducibility, seed divergence, `next()` ∈
[0,1), `int(n)` ∈ [0,n), `pick` throws on empty).

Critically it pins **golden values** — `hashString('')` = 2166136261 (the FNV offset
basis), `hashString('abc')` = 440920331, and the first three `createRng(1)` draws — so
an accidental change to either algorithm fails loudly instead of silently
re-enciphering the entire catalogue and invalidating every saved game. (These were
computed from the real implementation, not written from memory; both FNV values match
the canonical spec, which is independent confirmation the implementation is honest.)

---

### Deviations from the plan (flagged)

* **The save is NOT cleared on solve, and the restore is NOT guarded by `seen`.** The
  plan had both; restoring the solved banner (the human's call) forces both to change,
  since a solved puzzle is marked seen immediately (TODO-014) and a `!seen.has(id)`
  guard would have blocked exactly the case we want. The save is now cleared only when
  the deck is exhausted (`nextPuzzle` → `ended`), so the end screen sticks across a
  reload instead of resurrecting the last solved board.
* **Restoring a solved board must not replay the victory chime.** Restoring a solved
  game flips `solved` true during hydration, which would have re-fired TODO-020's
  chime on every reload. Fixed by seeding the chime's edge detector
  (`prevSolved = isSolved(resumed)`) in `onMount`. This is correct regardless of
  whether `onMount` or the `$effect` runs first, so it does not depend on Svelte's
  effect ordering.

### Also found — flagged, NOT fixed

**Board cells fail the project's own tap-target requirement.** CLAUDE.md calls
accessibility "a hard requirement, not polish" and specifies **≥48px tap targets
(prefer 56+)**. The cells are `button`s at `width: 1.75rem` (**28px**) and ~44px tall.
The Keypad correctly uses 48px; the board does not.

Left alone deliberately: the fix is a real design tension, not a CSS tweak. 48px-wide
cells mean a long quote won't fit across a phone screen, and the usual invisible
expanded-hit-area trick backfires here because neighbouring cells sit `0.15rem` apart,
so the hit boxes would overlap and make taps ambiguous. Options for a human decision:
accept and document the deviation; grow the cells and let long quotes wrap harder; or
scale cell size to viewport. **Worth deciding deliberately rather than folding into a
batch of quick wins.**

---

### Verification

* `npm run check` — 0 errors, 349 files.
* Unit suite — **68 tests pass** (up from 51: +17 across new `rng.test.ts`, new
  `restoreGame` domain tests, and new saved-game persistence tests).
* Clean production build; `build/play.html` proves the board is no longer prerendered.
* E2E via headless-Chrome CDP:
  * `scratchpad/resume022.mjs` (**9/9**) — a fresh `/play` immediately saves its
    puzzle; a guess is persisted; a reload restores the **same puzzle and the same
    guesses**; solving then reloading restores the **solved board with the banner**;
    "Next puzzle" moves the save on, and that survives a reload too.
  * `scratchpad/chime022.mjs` (**3/3**) — instruments `AudioContext.createOscillator`:
    the solving move plays the 3-note triad, while reloading the solved board restores
    the banner and plays **zero** tones.
