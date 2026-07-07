import { describe, it, expect } from 'vitest';
import { puzzles, algorithms } from '$lib/data/puzzles.js';

describe('puzzle data', () => {
	it('loads at least one puzzle and one algorithm', () => {
		expect(puzzles.length).toBeGreaterThan(0);
		expect(algorithms.length).toBeGreaterThan(0);
	});

	it('every puzzle carries non-empty text, attribution, category and hint', () => {
		for (const p of puzzles) {
			expect(p.text.length, `${p.id} text`).toBeGreaterThan(0);
			expect(p.attribution.length, `${p.id} attribution`).toBeGreaterThan(0);
			expect(p.category.length, `${p.id} category`).toBeGreaterThan(0);
			expect(p.hint.length, `${p.id} hint`).toBeGreaterThan(0);
		}
	});

	it('has unique puzzle ids', () => {
		const ids = puzzles.map((p) => p.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('never leaks the author name inside the hint (TODO-004 tweak)', () => {
		for (const p of puzzles) {
			expect(p.hint.toLowerCase(), `${p.id} hint`).not.toContain(p.attribution.toLowerCase());
		}
	});

	it('includes the five Philosophy puzzles (TODO-004)', () => {
		const philosophy = puzzles.filter((p) => p.category === 'Philosophy');
		expect(philosophy.length).toBe(5);
	});
});
