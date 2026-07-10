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
 * that reveals the current puzzle's id.
 */
export interface Settings {
	theme: string;
	showId: boolean;
}

const SETTINGS_KEY = 'cryptogram.settings.v1';

/** The defaults a fresh install (or unavailable storage) falls back to. */
export function defaultSettings(): Settings {
	return { theme: 'Original', showId: false };
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
			showId: typeof parsed.showId === 'boolean' ? parsed.showId : d.showId
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
