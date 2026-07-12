/**
 * localStorage persistence for the cryptogram game (SPEC §3: state is in-memory,
 * persisted to localStorage; privacy-first, no network). Currently tracks which
 * puzzles the player has already moved past ("seen"), so each is shown once
 * (TODO-005).
 *
 * Safe to call during SSR/prerender — every function guards on `browser` and
 * returns a default, and all storage access is wrapped so a disabled or full
 * localStorage (private browsing) degrades to "nothing remembered" rather than
 * throwing.
 */

import { browser } from '$app/environment';

const SEEN_KEY = 'cryptogram.seen.v1';

/** The ids of puzzles the player has already moved past (won't be shown again). */
export function loadSeen(): Set<string> {
	if (!browser) return new Set();
	try {
		const raw = localStorage.getItem(SEEN_KEY);
		if (!raw) return new Set();
		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed)) return new Set();
		return new Set(parsed.filter((id): id is string => typeof id === 'string'));
	} catch {
		return new Set();
	}
}

export function saveSeen(seen: Set<string>): void {
	if (!browser) return;
	try {
		localStorage.setItem(SEEN_KEY, JSON.stringify([...seen]));
	} catch {
		// Storage may be unavailable (private browsing); the game still works,
		// it just won't remember which puzzles were seen.
	}
}

/** Forget every seen puzzle (the "Start over" action). */
export function clearSeen(): void {
	if (!browser) return;
	try {
		localStorage.removeItem(SEEN_KEY);
	} catch {
		// Nothing to do — storage is unavailable.
	}
}

/**
 * Display & interaction preferences (TODO-010). The theme is a plain string
 * (not a union) so adding a theme later is a data change, not a type change.
 * `showId` is a debug toggle (TODO-016): when on, the play screen offers a link
 * that reveals the current puzzle's id. `sound` toggles the optional audio cues
 * (TODO-020); off by default.
 */
export interface Settings {
	theme: string;
	showId: boolean;
	sound: boolean;
}

const SETTINGS_KEY = 'cryptogram.settings.v1';

/** The defaults a fresh install (or unavailable storage) falls back to. */
export function defaultSettings(): Settings {
	return { theme: 'Original', showId: false, sound: false };
}

/**
 * Load saved preferences, merged per-field onto the defaults so a save that
 * predates a newly-added setting still yields a complete, valid Settings.
 * SSR-safe: returns the defaults when storage is unavailable.
 */
export function loadSettings(): Settings {
	const d = defaultSettings();
	if (!browser) return d;
	try {
		const raw = localStorage.getItem(SETTINGS_KEY);
		if (!raw) return d;
		const parsed = JSON.parse(raw);
		if (typeof parsed !== 'object' || parsed === null) return d;
		return {
			theme: typeof parsed.theme === 'string' ? parsed.theme : d.theme,
			showId: typeof parsed.showId === 'boolean' ? parsed.showId : d.showId,
			sound: typeof parsed.sound === 'boolean' ? parsed.sound : d.sound
		};
	} catch {
		return d;
	}
}

export function saveSettings(settings: Settings): void {
	if (!browser) return;
	try {
		localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
	} catch {
		// Storage may be unavailable (private browsing); preferences just
		// won't persist across sessions.
	}
}

/**
 * The in-progress (or just-solved) game (TODO-022, closing the SPEC §3 gap:
 * localStorage persists "settings, in-progress game").
 *
 * Only the puzzle id and the player's guesses are stored — *not* the board. The
 * ciphertext and answer key are a deterministic function of the puzzle and the
 * cipher algorithm, so they are re-derived on load (see `restoreGame`); that
 * keeps the payload small and means a save can never resurrect a stale board.
 */
export interface SavedGame {
	puzzleId: string;
	/** Cipher letter → guessed plaintext letter. */
	guesses: Record<string, string>;
}

const GAME_KEY = 'cryptogram.game.v1';

export function saveGame(puzzleId: string, guesses: Record<string, string>): void {
	if (!browser) return;
	try {
		localStorage.setItem(GAME_KEY, JSON.stringify({ puzzleId, guesses } satisfies SavedGame));
	} catch {
		// Storage may be unavailable (private browsing); the game still works,
		// it just won't survive a reload.
	}
}

/**
 * The saved game, or null if there isn't a well-formed one. This validates
 * *shape* only — it deliberately does not know whether the puzzle id still
 * exists, so persistence stays independent of the puzzle data. The caller
 * resolves the id against `puzzles` and discards the save if it no longer
 * matches (puzzle content can change between visits).
 */
export function loadGame(): SavedGame | null {
	if (!browser) return null;
	try {
		const raw = localStorage.getItem(GAME_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (typeof parsed !== 'object' || parsed === null) return null;
		if (typeof parsed.puzzleId !== 'string' || !parsed.puzzleId) return null;
		const g = parsed.guesses;
		if (typeof g !== 'object' || g === null || Array.isArray(g)) return null;
		const guesses: Record<string, string> = {};
		for (const [cipher, plain] of Object.entries(g)) {
			if (typeof plain === 'string') guesses[cipher] = plain;
		}
		return { puzzleId: parsed.puzzleId, guesses };
	} catch {
		return null;
	}
}

/** Forget the saved game (no puzzle in play). */
export function clearGame(): void {
	if (!browser) return;
	try {
		localStorage.removeItem(GAME_KEY);
	} catch {
		// Nothing to do — storage is unavailable.
	}
}
