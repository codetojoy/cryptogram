/**
 * Optional sound effects (TODO-020), synthesized live via the Web Audio API — no
 * asset files, no network (privacy, SPEC §3). This is the single UI-layer
 * chokepoint for audio: the domain never imports it. Cues are gentle and always
 * *redundant* reinforcement of the on-screen state (SPEC §2), never the only
 * signal, and off by default.
 *
 * SSR-safe: every entry point no-ops when `browser` is false (routes are
 * prerendered) or when sound is disabled. The AudioContext is created lazily on
 * the first cue — every cue follows a tap, so the iOS/Safari gesture-unlock
 * requirement is satisfied without extra plumbing.
 *
 * Deliberately NOT told whether a guess is correct: the place/clear cues are
 * neutral, so audio can never become a solution oracle. Only an actual solve
 * makes a positive sound.
 */

import { browser } from '$app/environment';

let enabled = false;
let ctx: AudioContext | null = null;

/** Reflect the persisted "Sound" setting. Cheap; call on the play screen's mount. */
export function setEnabled(on: boolean): void {
	enabled = on;
}

/** Lazily create (and resume) the shared AudioContext, or null if unavailable. */
function context(): AudioContext | null {
	if (!browser) return null;
	if (!ctx) {
		const Ctor =
			window.AudioContext ??
			(window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
		if (!Ctor) return null;
		try {
			ctx = new Ctor();
		} catch {
			return null;
		}
	}
	// WKWebView/Safari start the context suspended until a user gesture; every cue
	// follows a tap, so resuming here is permitted.
	if (ctx.state === 'suspended') void ctx.resume();
	return ctx;
}

/** One short, envelope-shaped tone (quick attack, exponential decay). */
function tone(
	ac: AudioContext,
	freq: number,
	start: number,
	dur: number,
	peak: number,
	type: OscillatorType = 'sine'
): void {
	const osc = ac.createOscillator();
	const gain = ac.createGain();
	osc.type = type;
	osc.frequency.value = freq;
	gain.gain.setValueAtTime(0.0001, start);
	gain.gain.linearRampToValueAtTime(peak, start + 0.005);
	gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
	osc.connect(gain).connect(ac.destination);
	osc.start(start);
	osc.stop(start + dur + 0.02);
}

/** A neutral tick when a letter is placed. */
export function letterPlaced(): void {
	if (!browser || !enabled) return;
	const ac = context();
	if (ac) tone(ac, 660, ac.currentTime, 0.06, 0.08);
}

/** A slightly lower tick when a letter is cleared. */
export function letterCleared(): void {
	if (!browser || !enabled) return;
	const ac = context();
	if (ac) tone(ac, 415, ac.currentTime, 0.06, 0.07);
}

/** A gentle rising triad when the puzzle is solved. */
export function solved(): void {
	if (!browser || !enabled) return;
	const ac = context();
	if (!ac) return;
	const t = ac.currentTime;
	tone(ac, 523.25, t, 0.18, 0.09, 'triangle'); // C5
	tone(ac, 659.25, t + 0.1, 0.18, 0.09, 'triangle'); // E5
	tone(ac, 783.99, t + 0.2, 0.3, 0.1, 'triangle'); // G5
}
