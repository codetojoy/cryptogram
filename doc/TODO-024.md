
### TODO-024 — COMPLETE

Please add 10 more puzzles for each of these categories, following past conventions:
* "Philosophy" ✅
* "Lyrics" ✅
* "Religion" ✅
* "General" ✅
* "Chess" ✅
* "Humor" ✅
* "Cuisine" ✅
* "Canada" ✅

* ensure that the "show stats" functionality still works OK and is accurate ✅

* bump version to 0.2.24 ✅

---

### The deck

**115 → 195 puzzles.** Category counts are now Philosophy 25; Lyrics, Religion, General,
Chess, Humor, Cuisine, Canada 20 each; Music, Music [Guitar], Shakespeare untouched at 10.

### Conventions the new data had to satisfy

The puzzle file is policed more tightly than it looks. Four existing rules constrain
every new entry, and two of them are easy to trip when writing quotes by hand:

1. A hint may not contain its attribution (`tests/data/puzzles.test.ts`).
2. **A hint may not share any significant word with its quote** — any word of 4+ letters
   that isn't a stopword. This is TODO-005's vague-hint rule and it was the binding
   constraint: a chess quote about *sacrifice* cannot have a hint that says sacrifice.
3. Ids must be unique **and free of `hashString` collisions** (`tests/domain/rng.test.ts`)
   — that sweep now covers 195 ids instead of 115.
4. Text stays inside the existing character set (letters, space, `. , ' ; ? : - !`).

So the 80 puzzles were authored in a scratchpad module and run through a validator that
re-implements all four rules *before* they were spliced into `data/puzzles.json` — every
violation reported at once, rather than one failed assertion per round-trip.

### "Lyrics" means public domain

Every pre-existing Lyrics puzzle is a traditional/public-domain song — Amazing Grace,
Danny Boy, Greensleeves, Shenandoah, Auld Lang Syne. That is clearly deliberate: this
project is Apache-2.0, and modern song lyrics are copyrighted, so quoting them would be
a licensing problem rather than a style one. The 10 new Lyrics puzzles hold that line
(Oh Susanna, Clementine, Simple Gifts, Rock of Ages, Shall We Gather at the River,
Yankee Doodle, Loch Lomond, Red River Valley, Down in the Valley, Wayfaring Stranger).

**Flagging it** in case "Lyrics" was ever meant to include modern songs — that would need
an explicit decision, and a licensing answer.

### Appended, not interleaved

The new puzzles are **appended as 0116-0195** rather than inserted into their existing
category blocks. Inserting would have renumbered every `display_num` after the first
insert, shifting the "Show Id" reference numbers testers have been quoting. Appending
keeps 0001-0115 byte-for-byte identical (the diff is 640 insertions, **0 deletions**) and
still satisfies TODO-017's "sequential in array order" invariant. The cost is cosmetic:
each grown category now appears in two blocks in the file.

Puzzle **ids** are untouched either way, so no one's `seen`/`solved` progress is disturbed
— those key on `id`, not on position or display number.

### Show Stats accuracy

No code change was needed: the footer reads `puzzles.length`, so "total" became 195 on its
own, and the seen/solved sets are id-keyed so existing progress survives the deck growing.
But that is the claim worth *testing* rather than assuming, so it was tested (below).

---

### Verification

* `npm run check` — 0 errors, 349 files.
* Unit suite — **68 tests pass**. (Down from 70 only because six per-category count
  assertions were consolidated into three; coverage is the same or broader. The
  collision-free-id and hint-leak sweeps now run over all 195 puzzles.)
* Clean production build.
* E2E via headless-Chrome CDP, `scratchpad/stats024.mjs` (**9/9**):
  * the real config checkbox persists `showStats: true`;
  * a fresh profile reads `0 solved · 0 played · **195** total` — the grown deck, not 115;
  * **skipping bumps *played* but NOT *solved*** — still true at 195, the assertion
    TODO-023's whole design exists for;
  * solving bumps both; stats survive a reload;
  * **a pre-TODO-024 profile keeps its progress**: seeding 34 played / 5 solved under ids
    that existed at 0.2.23 still reads `5 solved · 34 played · 195 total`, and the player
    is still dealt a puzzle rather than hitting the end screen.

### Still outstanding

**Board cells fail the ≥48px tap-target requirement** (28px wide), carried over from
TODO-022/023. Unchanged: it needs a deliberate design decision (48px cells mean long
quotes won't fit across a phone; the invisible-hit-area trick backfires because adjacent
cells sit 0.15rem apart, so the hit boxes would overlap), not a drive-by CSS fix.
