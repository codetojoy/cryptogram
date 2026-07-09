
### TODO-009 — COMPLETE

Split "Show hint" into "Show category" and "Show hint". ✅

Clearly, these show the respective meta-data fields. In this way, the user can be informed in a gradual way. ✅
* Two independent toggles in the `.reveal` block, ordered for gradual reveal: **Show category / Hide category** (new `showCategory` state) then **Show hint / Hide hint** (existing `showHint` state); **Crack one** stays as the third button.
* The `.clue` panel now renders when *either* is on, with the Category `dt/dd` gated on `showCategory` and the Hint `dt/dd` on `showHint` — so revealing only the category shows a single Category row, and hiding one leaves the other in place. No CSS changes.
* Each toggle carries its own `aria-expanded`; both reset to concealed in `loadPuzzle()` so every new puzzle starts fully hidden.

* bump version to 0.1.9 ✅

**Notes:** UI-only change — domain and data layers untouched, so no unit-test changes. Verified with `npm run check` (0 errors, 344 files), 38 unit tests pass, a clean production build, and an end-to-end browser drive confirming the toggles are independent: Show category → Category only; Show hint → Category + Hint; Hide category → Hint remains; Hide hint → panel gone; `aria-expanded` tracks each button's state.
