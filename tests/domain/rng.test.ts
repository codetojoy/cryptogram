import { describe, it, expect } from 'vitest';
import { hashString, createRng } from '$lib/domain/rng.js';
import { puzzles } from '$lib/data/puzzles.js';

/**
 * The rng is load-bearing for determinism (TODO-022): `startGame` folds
 * `hashString(puzzle.id)` into the algorithm seed, so each puzzle's substitution
 * alphabet is a pure function of these two. If either drifted, EVERY puzzle would
 * silently re-encipher — and every saved in-progress game would decode against a
 * different alphabet. The golden values below exist to make such a change fail
 * loudly instead of quietly.
 */
describe('hashString (FNV-1a)', () => {
	it('is deterministic', () => {
		expect(hashString('socrates-examined')).toBe(hashString('socrates-examined'));
	});

	it('returns an unsigned 32-bit integer', () => {
		for (const s of ['', 'a', 'hello world', 'socrates-examined']) {
			const h = hashString(s);
			expect(Number.isInteger(h)).toBe(true);
			expect(h).toBeGreaterThanOrEqual(0);
			expect(h).toBeLessThanOrEqual(0xffffffff);
		}
	});

	// Golden values: the standard FNV-1a 32-bit results. The empty string must
	// yield the FNV offset basis, and "abc" its canonical hash.
	it('matches the canonical FNV-1a golden values', () => {
		expect(hashString('')).toBe(2166136261);
		expect(hashString('abc')).toBe(440920331);
	});

	it('gives every real puzzle id a distinct seed (no collisions)', () => {
		const hashes = new Set(puzzles.map((p) => hashString(p.id)));
		expect(hashes.size).toBe(puzzles.length);
	});
});

describe('createRng (mulberry32)', () => {
	it('is reproducible: the same seed yields the same sequence', () => {
		const draw = (seed: number) => {
			const rng = createRng(seed);
			return [rng.next(), rng.next(), rng.next(), rng.next()];
		};
		expect(draw(12345)).toEqual(draw(12345));
	});

	it('different seeds yield different sequences', () => {
		const a = createRng(1);
		const b = createRng(2);
		expect([a.next(), a.next(), a.next()]).not.toEqual([b.next(), b.next(), b.next()]);
	});

	// Golden value: pins the exact mulberry32 stream. Changing the PRNG would
	// re-encipher the entire catalogue, so that must never happen silently.
	it('matches the golden mulberry32 stream for seed 1', () => {
		const rng = createRng(1);
		expect([rng.next(), rng.next(), rng.next()]).toEqual([
			0.6270739405881613, 0.002735721180215478, 0.5274470399599522
		]);
	});

	it('next() stays in [0, 1)', () => {
		const rng = createRng(99);
		for (let i = 0; i < 1000; i++) {
			const n = rng.next();
			expect(n).toBeGreaterThanOrEqual(0);
			expect(n).toBeLessThan(1);
		}
	});

	it('int(n) stays in [0, n) and is an integer', () => {
		const rng = createRng(7);
		for (let i = 0; i < 1000; i++) {
			const n = rng.int(26);
			expect(Number.isInteger(n)).toBe(true);
			expect(n).toBeGreaterThanOrEqual(0);
			expect(n).toBeLessThan(26);
		}
	});

	it('pick returns an element of the list, and throws on an empty one', () => {
		const rng = createRng(3);
		const items = ['a', 'b', 'c'] as const;
		for (let i = 0; i < 50; i++) {
			expect(items).toContain(rng.pick(items));
		}
		expect(() => rng.pick([])).toThrow(/empty/i);
	});
});
