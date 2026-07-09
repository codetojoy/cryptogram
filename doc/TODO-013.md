
### TODO-013 — COMPLETE

* Remove the initial Humor quote by Lenny. It was a seed for proof-of-concept and is no longer necessary. ✅
    * Removed the `lenny-duchovny` entry from `data/puzzles.json`. A test now asserts that id is gone.
* Add 10 new quotes with category "Humor". Pull from classic comedians & writers. All quotes should be family friendly. ✅
    * Ten family-friendly quips from classic comedians & writers: Groucho Marx, W. C. Fields, Steven Wright, George Burns, Phyllis Diller, Bob Hope, Will Rogers, Erma Bombeck, Robert Benchley, and Milton Berle (the Milton Berle "committee" line replaced the originally-planned Henny Youngman quote at the human's request).
    * Each hint was hand-crafted to satisfy the always-on invariants: it never contains the author's name, and shares no significant (4+ letter, non-stopword) content word with its own quote — both enforced by the puzzle tests across all 85 puzzles.

Counts: Humor 1 → 10; total 76 → 85.

* bump version to 0.2.13 ✅

**Notes:** `ASSETS.md` updated to list Humor among the categories carried as brief attributed quotations. Verified with `npm run check` (0 errors, 346 files), 46 unit tests (added a Humor-count + retired-seed assertion and updated the total to 85; the vague-hint and author-leak tests validated every new hint), and a clean production build. Content-only change — no UI or logic touched, so no E2E needed.
