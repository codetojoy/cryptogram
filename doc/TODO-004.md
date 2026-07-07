
### TODO-004 — COMPLETE

* Apply these changes to the puzzle meta-data:
    * for each puzzle, include category and hint ✅

* Apply these changes to game play:
    * display category and hint as hidden, but viewable when the user clicks ✅ ("Show hint" disclosure)
    * include the author of the quote in the puzzle itself ✅ (author is enciphered alongside the quote as a byline, decoded to win)

* Using these new rules, add 5 quotes from famous philosophers to the data set ✅ (Socrates, Descartes, Confucius, Nietzsche, Aristotle)
    * category should be "Philosophy" ✅
    * derive a basic hint from the gist of the quote/author ✅

* on any given puzzle, provide a button for "Next Puzzle" ✅ (sequential, wraps around; available during play and on the solved banner)

* initialize version to 0.0.4 ✅

**Notes:** Each puzzle now uses a distinct substitution alphabet (algorithm seed folded with a hash of the puzzle id). Verified with `npm run check` (0 errors), 26 unit tests, a production build, and an end-to-end browser solve of both the quote and the enciphered author.
