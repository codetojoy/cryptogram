/**
 * Small seedable PRNG (mulberry32) so cipher generation is deterministic:
 * a given algorithm `seed` always yields the same substitution alphabet
 * (mirrors the sibling forty-fives project's rng).
 */

export interface Rng {
	/** Float in [0, 1). */
	next(): number;
	/** Integer in [0, n). */
	int(n: number): number;
	/** Uniformly random element. */
	pick<T>(items: readonly T[]): T;
}

/**
 * Deterministic 32-bit hash of a string (FNV-1a). Used to fold a puzzle's id
 * into its cipher seed so each puzzle gets a distinct substitution alphabet
 * regardless of its position in the list.
 */
export function hashString(str: string): number {
	let h = 0x811c9dc5;
	for (let i = 0; i < str.length; i++) {
		h ^= str.charCodeAt(i);
		h = Math.imul(h, 0x01000193);
	}
	return h >>> 0;
}

export function createRng(seed: number = Date.now() >>> 0): Rng {
	let state = seed >>> 0;
	const next = (): number => {
		state = (state + 0x6d2b79f5) >>> 0;
		let t = state;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
	return {
		next,
		int: (n) => Math.floor(next() * n),
		pick: (items) => {
			if (items.length === 0) throw new Error('Cannot pick from an empty list');
			return items[Math.floor(next() * items.length)];
		}
	};
}
