
### TODO-020 — COMPLETE

Add optional sound effects: a neutral cue when a letter is placed, a distinct cue
when a letter is cleared, and a positive chime when the puzzle is solved. Gated by
a new "Sound" setting, off by default.

**Design decisions (settled in brainstorming):**

* **Neutral place/clear, NOT a correct/incorrect oracle.** ✅ The place/clear cues are
  identical regardless of correctness; `sound.ts` is never handed `GameState.solution`,
  so audio can't become a solve-by-ear oracle. Only an actual solve makes a positive
  sound.
* **Synthesized, not shipped files.** ✅ Cues are generated live with the Web Audio API —
  no asset files, no network, nothing new in `ASSETS.md`. Gentle envelope-shaped tones
  (short attack, exponential decay, low gain): place ≈ 660 Hz blip, clear ≈ 415 Hz blip,
  solved ≈ a soft C5–E5–G5 triad.

**Task:**

* `src/lib/ui/sound.ts` chokepoint ✅ — SSR-safe (every cue no-ops when `browser` is
  false or sound is disabled), lazily creates/resumes a shared `AudioContext` on the
  first cue (handles the `webkitAudioContext` prefix; every cue follows a tap so the
  gesture-unlock is free), exposes `setEnabled`, `letterPlaced`, `letterCleared`,
  `solved`. The domain does not import it.
* `sound: boolean` added to `Settings` (default `false`), merged per-field on load. ✅
* "Sound" toggle in the config Display fieldset, mirroring "Show Id" (bind, `dirty`,
  Save). ✅ Read on the play screen's mount via `sound.setEnabled(loadSettings().sound)`.
* Play-page wiring ✅ — `assign()` → `letterPlaced()`; `clearSelected()` →
  `letterCleared()`; `crackLetter()` → `letterPlaced()`; the solved transition →
  `solved()`, edge-triggered on `solved` via a plain flag so it fires once per solve
  and a re-run of the effect (while already solved) can't re-fire.

**Deviations from the draft (small, flagged):**

* **Solve chime is edge-triggered per solve transition, not once-ever-per-puzzle.** The
  draft suggested guarding "like markSeen" (no re-fire on "Play again"), but that means
  a replay solve is silent, which feels broken. Edge-triggering satisfies "fired once
  when solved flips true" and chimes on every genuine solve, including replays — better
  UX. Easy to switch to once-ever if preferred.
* **The place cue is skipped on the move that solves** (both in `assign` and
  `crackLetter`) so the solve chime stands alone instead of a tick-then-chime overlap.
* **"Clear all" stays silent** (out of the per-letter scope); the per-letter clear cue
  only fires when a guess actually existed in the cell.

* bump version to 0.2.20 ✅

**Notes:** No `ASSETS.md` change (synthesized, no third-party audio) and no anti-flash/
theme change. Verified with `npm run check` (0 errors, 348 files) and 51 unit tests
(new `sound.test.ts` asserts the cues are SSR-safe no-ops enabled or not; persistence
tests now include `sound: false`). End-to-end via headless-Chrome CDP
(`scratchpad/sound020.mjs`, 5/5), instrumenting `AudioContext.prototype.createOscillator`
to count synthesized tones: with Sound **off** placing a letter makes **0** oscillators;
with it **on** a placement makes **1** (the place cue); each non-solving Crack One makes
**1** and the solving move makes **3** (the triad); and the config "Sound" checkbox
persists `sound:true`. Plus a clean production build.
