
### TODO-007 — COMPLETE

* Add more 10 famous quotes to the data set ✅ (Gandhi, Eleanor Roosevelt, Mark Twain, Oscar Wilde, Maya Angelou, Churchill, Steve Jobs, Mandela, Einstein, Theodore Roosevelt)
    * category: "General" ✅
    * derive a basic hint as a vague desription: do not reveal the author or any other significant word from the puzzle ✅ (enforced by the existing vague-hint + author-not-in-hint tests)

* Add more 10 quotes from famous chess players to the data set ✅ (Fischer, Kasparov, Lasker, Tartakower, Steinitz, Nimzowitsch, Tarrasch, Capablanca, Tal, Alekhine)
    * category: "Chess" ✅
    * derive a basic hint as a vague desription: do not reveal the author or any other significant word from the puzzle ✅

* Add more 10 quotes from famous guitarists to the data set ✅ (Hendrix, B.B. King, Clapton, Segovia, Django Reinhardt, Les Paul, Chuck Berry, Santana, Stevie Ray Vaughan, Keith Richards)
    * category: "Music [Guitar]" ✅ (used verbatim, brackets included; kept distinct from the existing "Music" category)
    * derive a basic hint as a vague desription: do not reveal the author or any other significant word from the puzzle ✅

* bump version to 0.1.7 ✅

**Notes:** 46 → 76 puzzles (15 Philosophy, 1 Humor, 10 Music, 10 Lyrics, 10 Religion, 10 General, 10 Chess, 10 Music [Guitar]). Data-only change — no gameplay/UI edits, as the TODO-006 random-pick and `seen` machinery already scale to any puzzle count. Provenance note in `ASSETS.md` extended to the new categories (short attributed quotations). Verified with `npm run check` (0 errors, 344 files), 33 unit tests (added General/Chess/Music [Guitar] counts + a total-of-76 assertion; the vague-hint and author-not-in-hint invariants iterate all 76 puzzles), and a clean production build.
