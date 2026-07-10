
### TODO-015 — COMPLETE

* Add 10 more quotes from famous chefs to the data set ✅
    * category: "Cuisine" ✅
    * ensure these data tests pass: vague-hint + author-not-in-hint ✅
    * Chefs: Julia Child, James Beard, Anthony Bourdain, Wolfgang Puck, Auguste Escoffier, Paul Prudhomme, Alice Waters, Fernand Point, Thomas Keller, and Marco Pierre White.

* Add 10 more quotes from Shakespeare plays to the data set ✅
    * category: "Shakespeare" ✅
    * ensure these data tests pass: vague-hint + author-not-in-hint ✅
    * Lines from *Hamlet* (×2), *Romeo and Juliet*, *Julius Caesar*, *As You Like It*, *Macbeth*, *Twelfth Night*, *The Merchant of Venice*, *King Lear*, and *Richard III*; all attributed to William Shakespeare (d. 1616, public domain).

Counts: Cuisine 0 → 10; Shakespeare 0 → 10; total 85 → 105.

* bump version to 0.2.15 ✅

**Notes:** Each of the 20 hints was hand-crafted to satisfy the two always-on invariants — it never contains its author's attribution, and shares no significant (4+ letter, non-stopword) content word with its own quote — both enforced across all 105 puzzles by the existing `tests/data/puzzles.test.ts` suite (the vague-hint and author-leak tests). Added a Cuisine + Shakespeare count assertion and updated the total to 105. `ASSETS.md` now lists Cuisine among the attributed-quotation categories and records Shakespeare separately as public-domain play excerpts. Verified with `npm run check` (0 errors, 346 files), 47 unit tests, and a clean production build. Content-only change — no UI or logic touched, so no E2E needed.
