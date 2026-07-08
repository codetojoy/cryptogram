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
