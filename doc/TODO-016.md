
### TODO-016 — COMPLETE

* Add new config setting: "Show Id". This is used for debugging. ✅
    * Extended the `Settings` layer in `src/lib/ui/persistence.ts` with `showId: boolean` (default `false`), merged per-field on load like `theme`. Added a "Show Id" checkbox to the Display fieldset on the config page, with a short "for debugging" note; the `dirty` flag and Save button now cover it too.
* When enabled, add a "Show Id" link near "Show Hint". When pressed, display the id of the current puzzle. ✅
    * The play page reads the setting on mount into `idEnabled`; when on, a "Show Id" / "Hide Id" text-button appears in the reveal row beside Show category / Show hint / Crack one. Pressing it renders the current puzzle's id (`game.puzzleId`) as a "Puzzle id" row inside the existing clue box, alongside category/hint. `idEnabled` gates the link; a per-puzzle `showId` toggle drives the reveal and resets on each new puzzle.

* bump version to 0.2.16 ✅

**Notes:** No anti-flash (`app.html`) or `theme.ts` change — `showId` doesn't affect first paint. Verified with `npm run check` (0 errors, 346 files) and 47 unit tests (the settings tests now assert the `showId: false` default and SSR fallback). Because the reveal link is component behaviour with no jsdom harness (and adding one would mean new deps), it was verified end-to-end via a headless-Chrome CDP drive (`scratchpad/showid016.mjs`, 9/9): with the setting off the link is absent; toggling the real config checkbox + Save persists `showId:true`; back on play the link appears, the id is hidden until pressed, pressing reveals a valid kebab-case id and flips the label to "Hide Id", and Hide removes the row. Plus a clean production build.
