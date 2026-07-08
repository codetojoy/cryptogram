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

	// Common function words that may harmlessly appear in both a quote and a hint;
	// only significant *content* words leaking would spoil the puzzle (TODO-005).
	const STOPWORDS = new Set([
		'the', 'and', 'but', 'nor', 'not', 'you', 'your', 'that', 'this', 'with', 'what',
		'when', 'then', 'than', 'from', 'have', 'has', 'had', 'does', 'did', 'done', 'our',
		'his', 'her', 'its', 'one', 'all', 'any', 'can', 'how', 'why', 'who', 'was', 'are',
		'for', 'only', 'into', 'out', 'off', 'yourself'
	]);
	const words = (s: string) =>
		s
			.toLowerCase()
			.split(/[^a-z]+/)
			.filter((w) => w.length >= 4 && !STOPWORDS.has(w));

	it('hints reveal no significant word from their quote (TODO-005 vague-hint rule)', () => {
		for (const p of puzzles) {
			const quoteWords = new Set(words(p.text));
			const leaked = words(p.hint).filter((w) => quoteWords.has(w));
			expect(leaked, `${p.id} hint leaks: ${leaked.join(', ')}`).toEqual([]);
		}
	});

	it('includes fifteen Philosophy puzzles (TODO-004 + TODO-005)', () => {
		const philosophy = puzzles.filter((p) => p.category === 'Philosophy');
		expect(philosophy.length).toBe(15);
	});

	it('includes ten each of Music, Lyrics and Religion (TODO-006)', () => {
		const count = (category: string) => puzzles.filter((p) => p.category === category).length;
		expect(count('Music'), 'Music').toBe(10);
		expect(count('Lyrics'), 'Lyrics').toBe(10);
		expect(count('Religion'), 'Religion').toBe(10);
	});

	it('includes ten each of General, Chess and Music [Guitar] (TODO-007)', () => {
		const count = (category: string) => puzzles.filter((p) => p.category === category).length;
		expect(count('General'), 'General').toBe(10);
		expect(count('Chess'), 'Chess').toBe(10);
		expect(count('Music [Guitar]'), 'Music [Guitar]').toBe(10);
	});

	it('has seventy-six puzzles in total (TODO-007)', () => {
		expect(puzzles.length).toBe(76);
	});
});
