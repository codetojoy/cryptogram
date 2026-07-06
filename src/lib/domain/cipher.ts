/**
 * Monoalphabetic substitution cipher for cryptograms.
 *
 * A `seed` deterministically produces a substitution alphabet (a bijection of
 * A–Z) via the seeded PRNG, so a puzzle enciphered from a given (text, seed)
 * pair is always identical. The substitution is a *derangement* — no letter
 * maps to itself — which is the usual cryptogram convention (a letter standing
 * for itself would be a free giveaway).
 *
 * Pure domain logic: no UI, no I/O. The letter case is normalized to uppercase
 * (cryptograms are shown in uppercase); non-letters pass through unchanged.
 */

export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

/** A substitution alphabet: plaintext letter → cipher letter (both uppercase A–Z). */
export type Substitution = Record<string, string>;

import { createRng, type Rng } from './rng.js';

/** True if `perm` moves every position — i.e. no letter maps to itself. */
function isDerangement(perm: readonly string[]): boolean {
	return perm.every((letter, i) => letter !== ALPHABET[i]);
}

/** Fisher–Yates shuffle of the alphabet using the seeded rng (does not mutate ALPHABET). */
function shuffledAlphabet(rng: Rng): string[] {
	const a = ALPHABET.slice();
	for (let i = a.length - 1; i > 0; i--) {
		const j = rng.int(i + 1);
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

/**
 * Build the substitution alphabet for a seed. Reshuffles (advancing the same
 * rng stream) until the permutation is a derangement — deterministic for a
 * given seed, and fast: ~37% of permutations are derangements, so this takes a
 * couple of tries on average.
 */
export function buildSubstitution(seed: number): Substitution {
	const rng = createRng(seed);
	let cipher = shuffledAlphabet(rng);
	while (!isDerangement(cipher)) {
		cipher = shuffledAlphabet(rng);
	}
	const map: Substitution = {};
	for (let i = 0; i < ALPHABET.length; i++) {
		map[ALPHABET[i]] = cipher[i];
	}
	return map;
}

/** Invert a substitution: cipher letter → plaintext letter. */
export function invert(sub: Substitution): Substitution {
	const out: Substitution = {};
	for (const [plain, cipher] of Object.entries(sub)) {
		out[cipher] = plain;
	}
	return out;
}

/** True for a single A–Z letter (case-insensitive). */
export function isLetter(ch: string): boolean {
	return /^[a-z]$/i.test(ch);
}

/**
 * Encipher `plaintext` with `sub`. Letters are uppercased then substituted;
 * everything else (spaces, punctuation, digits) passes through unchanged.
 */
export function encipher(plaintext: string, sub: Substitution): string {
	let out = '';
	for (const ch of plaintext) {
		if (isLetter(ch)) {
			out += sub[ch.toUpperCase()];
		} else {
			out += ch;
		}
	}
	return out;
}
