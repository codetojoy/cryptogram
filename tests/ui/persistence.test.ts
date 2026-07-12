import { describe, it, expect } from 'vitest';
import {
	loadSeen,
	saveSeen,
	clearSeen,
	loadSettings,
	saveSettings,
	defaultSettings,
	loadGame,
	saveGame,
	clearGame
} from '$lib/ui/persistence.js';

// These run under the node (SSR) test environment, where `browser` is false.
// The persistence layer must be safe there: it returns defaults and never throws,
// since every route is prerendered (CLAUDE.md).
describe('seen-puzzle persistence (SSR-safe)', () => {
	it('loadSeen returns an empty set when storage is unavailable', () => {
		expect(loadSeen()).toEqual(new Set());
	});

	it('saveSeen and clearSeen are no-ops that do not throw', () => {
		expect(() => saveSeen(new Set(['a', 'b']))).not.toThrow();
		expect(() => clearSeen()).not.toThrow();
	});
});

describe('settings persistence (SSR-safe, TODO-010)', () => {
	it('defaults theme "Original", Show Id off, Sound off (TODO-016, TODO-020)', () => {
		expect(defaultSettings()).toEqual({ theme: 'Original', showId: false, sound: false });
	});

	it('loadSettings returns the defaults when storage is unavailable', () => {
		expect(loadSettings()).toEqual({ theme: 'Original', showId: false, sound: false });
	});

	it('saveSettings is a no-op that does not throw', () => {
		expect(() => saveSettings({ theme: 'Original', showId: false, sound: false })).not.toThrow();
	});
});

describe('saved-game persistence (SSR-safe, TODO-022)', () => {
	it('loadGame returns null when storage is unavailable', () => {
		expect(loadGame()).toBeNull();
	});

	it('saveGame and clearGame are no-ops that do not throw', () => {
		expect(() => saveGame('socrates-examined', { A: 'X' })).not.toThrow();
		expect(() => clearGame()).not.toThrow();
	});
});
