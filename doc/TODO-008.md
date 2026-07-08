
### TODO-008 — COMPLETE

Like "Show Hint" and in proximity to it, add a new link/button called "Crack One". ✅ (a second `text-button` beside "Show hint" in the `.reveal` block)

When "Crack One" is pressed, choose a letter at random and fill it into the puzzle. This is an assist for players who are stuck. ✅
* New pure domain transition `crackOne(state, random = Math.random)` picks at random among the cipher letters not yet guessed correctly (blank *or* wrong) and assigns the true plaintext letter via `setGuess`; returns the state unchanged once solved. Randomness is injected so it stays pure and deterministically testable.
* Revealing a cipher letter fills every occurrence of it (a substitution reveal applies everywhere, exactly like normal play), and — via `setGuess`'s injective rule — it also clears any stray wrong copy of that letter without ever displacing a correct guess.
* The button is disabled exactly when the puzzle is solved (which, since puzzles always have ≥1 letter, is precisely when no crackable letter remains).

* bump version to 0.1.8 ✅

**Notes:** No persistence/`seen` changes — the assist doesn't touch localStorage. Verified with `npm run check` (0 errors, 344 files), 38 unit tests (added 5 `crackOne` tests: reveals exactly one correct guess, honors the injected random source, never introduces a wrong guess across a full solve, corrects a wrong guess, and is a no-op once solved), a clean production build, and an end-to-end browser drive (clicking "Crack One" repeatedly solved the puzzle and the button disabled on solve).
