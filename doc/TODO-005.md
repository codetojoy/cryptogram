
### TODO-005 — COMPLETE

* Apply these changes to the puzzle meta-data:
    * for each puzzle, include unique id ✅ (already present; loader now fails fast on a duplicate id)

* Apply these changes to game play:
    * when "Next Puzzle" is clicked, then store the id for the current puzzle so that it is not shown again. local storage on the device is appropriate ✅ (`cryptogram.seen.v1`, browser-guarded)
    * if the user clicks "Next Puzzle", and there are no more puzzles, display a message saying that they have reached the end of the game ✅ (end panel + a "Start over" button that clears saved progress)

* Add more 10 quotes from famous philosophers to the data set ✅ (Plato, Aristotle, Confucius, Nietzsche, Socrates, Descartes, Kant, Epictetus, Seneca, Lao Tzu → 15 Philosophy total)
    * category: "Philosophy" ✅
    * derive a basic hint but, as before, use a vague desription: do not reveal the author or any other significant word from the puzzle ✅ (enforced by a test that asserts no content word from a quote appears in its hint)

* bump version to 0.1.5 (this bumps minor version as well) ✅

**Notes:** `seen` is loaded on mount (SSR-safe) so each puzzle is shown once; skipping via "Next puzzle" also burns a puzzle. Verified with `npm run check` (0 errors), 30 unit tests, a production build, and an end-to-end browser drive: 16 unique puzzles shown, end message fired, `seen` persisted across a reload, and "Start over" reset to the first puzzle with storage cleared.

