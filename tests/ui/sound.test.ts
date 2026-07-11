import { describe, it, expect } from 'vitest';
import { setEnabled, letterPlaced, letterCleared, solved } from '$lib/ui/sound.js';

// Runs under the node (SSR) environment, where `browser` is false and there is no
// Web Audio API. Every cue must be a safe no-op there — routes are prerendered
// (CLAUDE.md), so the module is imported during SSR — and must never touch an
// AudioContext until enabled in a real browser after a user gesture.
describe('sound cues (SSR-safe, TODO-020)', () => {
	it('cues do not throw when sound is disabled (the default)', () => {
		expect(() => {
			letterPlaced();
			letterCleared();
			solved();
		}).not.toThrow();
	});

	it('cues do not throw even after enabling, under SSR (no AudioContext)', () => {
		setEnabled(true);
		expect(() => {
			letterPlaced();
			letterCleared();
			solved();
		}).not.toThrow();
		setEnabled(false);
	});
});
