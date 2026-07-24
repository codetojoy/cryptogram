
### TODO-025 — COMPLETE

Please add 10 more puzzles for each of these categories, following past conventions:
* "Philosophy" ✅
* "Religion" ✅
* "General" ✅
* "Humor" ✅
* "Cuisine" ✅
* "Canada" ✅

* ensure that the "show stats" functionality still works OK and is accurate ✅

* bump version to 0.2.25 ✅

---

### The deck

**195 → 255 puzzles.** Category counts are now Philosophy 35; Religion, General, Humor,
Cuisine, Canada 30 each; Lyrics and Chess hold at 20 (grown only in TODO-024); Music,
Music [Guitar], Shakespeare untouched at 10.

### Conventions the new data had to satisfy

Same machinery as TODO-024. The 60 puzzles were authored in a scratchpad module and run
through a validator that re-implements every rule the test suite enforces — reporting all
violations at once — *before* they were spliced into `data/puzzles.json`:

1. A hint may not contain its attribution.
2. **A hint may not share any significant word (4+ letters, non-stopword) with its quote**
   — TODO-005's vague-hint rule, the binding constraint. It caught three leaks on the
   first pass (`toward`, `keeps`, `four`), each reworded before the data was touched.
3. Ids unique **and** free of `hashString` (FNV-1a) collisions — that `rng.test.ts` sweep
   now runs over all 255 ids.
4. Text stays inside the existing character set (letters, space, `. , ' ; ? : - !`).
5. **New this round: no quote may duplicate one of the existing 195.** The validator
   normalizes and compares every new quote against the full existing set (and against the
   rest of the batch). Repeating an *author* is fine and matches the existing data
   (e.g. a third Julia Child, a second Confucius) — only repeating a *quote* is not.

### Quote vetting (beyond what the tests can check)

These strings are shown to players as real attributed quotations, so a fabrication or
misattribution is a quality bug the validator cannot catch. A first draft was rewritten
after review to remove:

* **Two lines I had effectively constructed myself** — a Roch Carrier "cathedral" line and
  a Tom Thomson "the north is a feeling" line — neither a verifiable verbatim quote.
* **A copyrighted song lyric** (Gordon Lightfoot, *If You Could Read My Mind*) filed as a
  spoken quote. This is the same public-domain discipline the existing Lyrics category
  keeps; a copyrighted lyric doesn't belong here regardless of category. Replaced with a
  spoken Oscar Peterson quote.
* **Well-known apocrypha** — "Be kind, everyone is fighting a hard battle" (not actually
  Plato), "predict your future / create it" (not reliably Lincoln), "what lies within us"
  (not reliably Emerson) — swapped for solidly-sourced quotes from the same or similar
  figures.
* **Two polarizing figures** — Jordan Peterson, and Jean Vanier (whose reputation
  collapsed posthumously) — dropped to keep the tone of a wholesome puzzle game. Replaced
  with Chris Hadfield and Louise Penny.

The Religion set is entirely genuine scripture verses; the Philosophy/Cuisine/Humor
picks are well-documented (Wittgenstein's *Tractatus*, Aurelius's *Meditations*,
Cervantes via *Don Quixote*, Woolf via *A Room of One's Own*, etc.).

### Appended, not interleaved

The new puzzles are **appended as 0196-0255** rather than inserted into their category
blocks. Same reasoning as TODO-024: inserting would renumber every `display_num` after
the first insert, shifting the "Show Id" reference numbers testers quote. Appending keeps
0001-0195 byte-for-byte identical (the diff is 480 insertions, **0 deletions**) and still
satisfies TODO-017's sequential-in-array-order invariant. Puzzle **ids** are untouched, so
no one's `seen`/`solved` progress is disturbed.

### Show Stats accuracy

No code change was needed — the footer reads `puzzles.length`, so "total" became 255 on
its own, and the seen/solved sets are id-keyed so existing progress survives. That is the
claim worth testing rather than assuming, so it was tested (below).

---

### Verification

* `npm run check` — 0 errors, 349 files.
* Unit suite — **69 tests pass**. The collision-free-id and hint-leak sweeps now run over
  all 255 puzzles; category-count assertions updated (Philosophy 35; the five TODO-025
  categories 30; Lyrics/Chess 20; total 255).
* Clean production build.
* E2E via headless-Chrome CDP, `scratchpad/stats025.mjs` (**9/9**):
  * the real config checkbox persists `showStats: true`;
  * a fresh profile reads `0 solved · 0 played · **255** total` — the grown deck, not 195;
  * **skipping bumps *played* but NOT *solved*** — still true at 255, the assertion
    TODO-023's design exists for;
  * solving bumps both; stats survive a reload;
  * **a pre-TODO-025 profile keeps its progress**: seeding 34 played / 7 solved under ids
    that existed at 0.2.24 (a mix from across the deck, including TODO-024's own puzzles)
    still reads `7 solved · 34 played · 255 total`, and the player is still dealt a puzzle
    rather than hitting the end screen.

### Still outstanding

**Board cells fail the ≥48px tap-target requirement** (28px wide), carried over from
TODO-022/023/024. Unchanged: it needs a deliberate design decision (48px cells mean long
quotes won't fit across a phone; the invisible-hit-area trick backfires because adjacent
cells sit 0.15rem apart, so hit boxes would overlap), not a drive-by CSS fix.
