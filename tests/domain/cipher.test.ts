import { describe, it, expect } from 'vitest';
import { ALPHABET, buildSubstitution, encipher, invert, isLetter } from '$lib/domain/cipher.js';

describe('buildSubstitution', () => {
	it('is deterministic for a given seed', () => {
		expect(buildSubstitution(1234)).toEqual(buildSubstitution(1234));
	});

	it('produces different alphabets for different seeds', () => {
		expect(buildSubstitution(1)).not.toEqual(buildSubstitution(2));
	});

	it('is a bijection of A–Z (26 distinct cipher letters)', () => {
		const sub = buildSubstitution(1234);
		const keys = Object.keys(sub).sort();
		const values = Object.values(sub).sort();
		expect(keys).toEqual([...ALPHABET].sort());
		expect(new Set(values).size).toBe(26);
		expect(values).toEqual([...ALPHABET].sort());
	});

	it('is a derangement — no letter maps to itself', () => {
		// Check a spread of seeds so the derangement repair is exercised.
		for (const seed of [0, 1, 2, 3, 42, 1234, 99999]) {
			const sub = buildSubstitution(seed);
			for (const letter of ALPHABET) {
				expect(sub[letter]).not.toBe(letter);
			}
		}
	});
});

describe('invert', () => {
	it('round-trips a substitution back to identity', () => {
		const sub = buildSubstitution(7);
		const inv = invert(sub);
		for (const letter of ALPHABET) {
			expect(inv[sub[letter]]).toBe(letter);
		}
	});
});

describe('encipher', () => {
	const sub = buildSubstitution(1234);

	it('preserves spaces and punctuation, uppercases letters', () => {
		const out = encipher('Hi, there!', sub);
		expect(out).toMatch(/^[A-Z]{2}, [A-Z]{5}!$/);
	});

	it('deciphers back to the uppercased plaintext via the inverse', () => {
		const plain = 'Duchovny does not deserve treats nor place on couch.';
		const cipher = encipher(plain, sub);
		const back = encipher(cipher, invert(sub));
		expect(back).toBe(plain.toUpperCase());
	});

	it('maps equal plaintext letters to equal cipher letters everywhere', () => {
		const cipher = encipher('EEE', sub);
		expect(cipher[0]).toBe(cipher[1]);
		expect(cipher[1]).toBe(cipher[2]);
	});
});

describe('isLetter', () => {
	it('is true only for single A–Z letters', () => {
		expect(isLetter('a')).toBe(true);
		expect(isLetter('Z')).toBe(true);
		expect(isLetter(' ')).toBe(false);
		expect(isLetter('1')).toBe(false);
		expect(isLetter('ab')).toBe(false);
	});
});
