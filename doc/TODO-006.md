
### TODO-006 — COMPLETE

* Add more 10 quotes from famous musicians/composers to the data set ✅ (Beethoven, Louis Armstrong, Bach, Mozart, Duke Ellington, Tchaikovsky, Miles Davis, Chopin, Stravinsky, Ray Charles)
    * category: "Music" ✅
    * derive a basic hint as a vague desription: do not reveal the author or any other significant word from the puzzle ✅ (enforced by the existing vague-hint + author-not-in-hint tests)

* Add more 10 lyric quotes from famous songs to the data set ✅
    * category: "Lyrics" ✅
    * derive a basic hint as a vague desription: do not reveal the author or any other significant word from the puzzle ✅
    * **Note:** modern song lyrics are copyrighted (enforced even for a single line), so — per your decision — these use **public-domain / traditional songs only** (spirituals, folk songs, and works published before 1929). Provenance recorded in `ASSETS.md`.

* Add more 10 quotes from the Christian Bible to the data set. Use New International Version ✅
    * category: "Religion" ✅
    * author: book of quote per tradition of Biblical references, no chapter/verse ✅ (John, Proverbs, Psalms, Genesis, Matthew, Isaiah, Philippians, Romans, Ecclesiastes, Corinthians)
    * derive a basic hint as a vague desription: do not reveal the author or any other significant word from the puzzle ✅
    * **Note:** the NIV is copyrighted; the required Biblica attribution notice is recorded in `ASSETS.md`.

* When "Next Puzzle" is clicked, shuffle the quotes so that the order is random ✅ (`randomUnseen()` picks a random *unseen* puzzle, so order is random but each puzzle still shows only once until the deck is exhausted; the initial puzzle on load and "Start over" are randomised too)

* bump version to 0.1.6 ✅

**Notes:** 16 → 46 puzzles (15 Philosophy, 1 Humor, 10 Music, 10 Lyrics, 10 Religion). Verified with `npm run check` (0 errors, 344 files), 32 unit tests (added Music/Lyrics/Religion counts + a total-of-46 assertion; the vague-hint and author-not-in-hint invariants cover all 30 new hints), a clean production build, and an end-to-end browser drive: 46 unique puzzles shown in random order, end message fired, `seen` persisted across a reload, and "Start over" cleared storage and reset the board.
