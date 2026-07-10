
### TODO-019 — COMPLETE

* Add 10 quotes from famous Canadians to the data set ✅
    * category: "Canada" ✅
    * continue patterns for "display_num", "id", etc ✅
    * ensure these data tests pass: vague-hint + author-not-in-hint ✅
    * The ten: Wayne Gretzky, Terry Fox, Margaret Atwood, Marshall McLuhan, Lucy Maud Montgomery, Tommy Douglas, Jim Carrey, Chris Hadfield, Pierre Elliott Trudeau, and Alice Munro (hockey, activism, literature ×3 incl. a Nobel laureate, media theory, politics ×2, comedy/film, and space). `display_num` continues `0106`..`0115`; ids follow the existing `person-keyword` kebab pattern; keys ordered id, display_num, text, attribution, category, hint.

Counts: Canada 0 → 10; total 105 → 115.

* bump version to 0.2.19 ✅

**Notes:** Each hint was hand-crafted to satisfy the two always-on invariants — it never contains its author's attribution, and shares no significant (4+ letter, non-stopword) content word with its own quote. The append script self-checked both invariants (plus id uniqueness and the `display_num` sequence) before writing, and the committed suite re-validates them across all 115 puzzles. Added a Canada count assertion and updated the total to 115. `ASSETS.md` now lists Canada among the attributed-quotation categories and notes the L. M. Montgomery line is from *Anne of Green Gables* (1908, public domain); the rest are short attributed remarks (spoken/prose — no copyrighted song lyrics). Verified with `npm run check` (0 errors, 346 files), 49 unit tests, and a clean production build. Content-only change — no UI or logic touched, so no E2E needed.
