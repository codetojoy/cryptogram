
### TODO-023 — COMPLETE

Human beta-testers would like stats about how many puzzles have been solved (according to local storage).

Goals
* add a new config option "Show Stats" which is a boolean ✅
* if "Show Stats" is enabled, then display a footer on the game page ✅
    * the footer should discreetly display:
        * # of puzzles solved ✅
        * total # of puzzles ✅

* bump version to 0.2.23 ✅

---

### The catch: `seen` is NOT `solved`

The existing `cryptogram.seen.v1` set could not answer this question. `markSeen` was
called from **two** places: the solved transition *and* `nextPuzzle` — which fires
when the player **skips** an unsolved puzzle. So `seen` = solved ∪ skipped, with no
way to tell them apart after the fact.

Reporting `seen.size` as "solved" would therefore have counted every puzzle the
player *gave up on* as a win. For a stats display that is the worst failure mode:
it **flatters**, and the player cannot tell it's lying. (This also ruled out
back-filling `solved` from `seen` for existing players — that is the same overcount,
just relabelled as an achievement.)

So solved is now tracked properly, in its own key, from this version forward.

---

### Implementation

* **`cryptogram.solved.v1`** (`persistence.ts`) — a `Set` of solved puzzle ids, with
  `loadSolved` / `saveSolved` / `clearSolved`, mirroring the seen-set functions
  (`browser` guard + `try`/`catch`, SSR-safe). A Set of ids rather than a counter, so
  re-solving a puzzle via "Play again" cannot inflate the total.
* **`markSolved(id)`** (play page) — called **only** from the solved transition, never
  from `nextPuzzle`. That single restriction is what keeps the stat honest.
* **`showStats: boolean`** added to `Settings`, merged per-field on load, **default
  `false`** (human's call — consistent with `showId` and `sound`, which are also
  opt-in).
* **"Show Stats" toggle** in the config Display fieldset, mirroring "Show Id" / "Sound".
* **Stats footer** on the play page, gated on `showStats` *and* on TODO-022's `ready`
  flag (it reads localStorage, which is empty until hydration).
* **"Start over" resets both** solved and played (human's call — it reads as a full
  reset).

### Deviation from the brief (flagged, deliberate)

**The footer shows "played" as well as "solved"** — `3 solved · 34 played · 115 total`
— where the brief asked only for solved + total.

The reason is the zero problem: solve-tracking starts in 0.2.23, so an established
beta-tester who has genuinely played 34 puzzles opens the footer and sees **0 solved**.
In isolation that reads as a bug and gets reported as one. Next to `34 played` it reads
as what it is — the two numbers explain each other. "Played" is also the genuinely
useful progress stat (how much of the deck is left), and it costs nothing: the `seen`
set is already loaded on the play page. Easy to drop back to two numbers if unwanted.

---

### Verification

* `npm run check` — 0 errors, 349 files.
* Unit suite — **70 tests pass** (new SSR-safe solved-set tests; settings tests now
  include `showStats: false`).
* Clean production build.
* E2E via headless-Chrome CDP:
  * `scratchpad/stats023.mjs` (**13/13**) — Show Stats off ⇒ no footer; the real config
    checkbox persists `showStats:true` and the footer appears; a fresh profile reads
    `0 solved · 0 played · 115 total`; **skipping a puzzle bumps *played* but NOT
    *solved*** (the assertion this whole design exists for); solving bumps both; stats
    survive a reload; and re-solving the same puzzle does not double-count.
  * `scratchpad/startover023.mjs` (**8/8**) — seeds all 115 ids as seen with 42 solved
    to reach the end screen, clicks the **real "Start over" button**, and confirms both
    counters reset to zero, the footer re-reads as zeroed, a fresh puzzle is dealt, and
    the reset persists across a reload.

**Harness note (not a product bug):** the first E2E run failed to drive the config
checkbox. `/config` is prerendered, so the input exists in the static HTML *before*
Svelte hydrates, and a click landing pre-hydration toggles the native checkbox without
Svelte ever seeing it. The test now re-activates the checkbox until the Save button
becomes enabled — a true hydration signal. (The play-page assertions were never
exposed to this race: thanks to TODO-022's `ready` gate, `button.cell` only exists
*after* hydration.)

### Still outstanding, from TODO-022

**Board cells fail the ≥48px tap-target requirement** (28px wide). Unchanged; still
needs a deliberate design decision rather than a drive-by fix.
