import { describe, it, expect } from 'vitest';
import { THEMES, themeFor, themeId, applyTheme } from '$lib/ui/theme.js';

// Runs under the node (SSR) environment, where `browser` is false — applyTheme
// must be a safe no-op there, since every route is prerendered (CLAUDE.md).
describe('theme registry (TODO-011)', () => {
	it('offers Original, Prince, Dark and Bengal', () => {
		expect(THEMES.map((t) => t.label)).toEqual(['Original', 'Prince', 'Dark', 'Bengal']);
	});

	it('maps a stored label to its data-theme slug', () => {
		expect(themeId('Original')).toBe('original');
		expect(themeId('Prince')).toBe('prince');
	});

	it('falls back to Original for an unknown label', () => {
		expect(themeId('Nonsense')).toBe('original');
		expect(themeFor('Nonsense')).toBe(THEMES[0]);
	});

	it('applyTheme is an SSR-safe no-op that does not throw', () => {
		expect(() => applyTheme('Prince')).not.toThrow();
	});
});
