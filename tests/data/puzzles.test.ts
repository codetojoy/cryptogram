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

	// TODO-025 added ten more to six categories on top of TODO-024's eight.
	// Philosophy now 35; the five categories in both rounds are at 30; Lyrics and
	// Chess (grown only in TODO-024) hold at 20; the untouched three stay at 10.
	const count = (category: string) => puzzles.filter((p) => p.category === category).length;

	it('retired the proof-of-concept seed (TODO-013)', () => {
		expect(puzzles.some((p) => p.id === 'lenny-duchovny')).toBe(false);
	});

	it('includes thirty-five Philosophy puzzles (TODO-005, TODO-024, TODO-025)', () => {
		expect(count('Philosophy')).toBe(35);
	});

	it('includes thirty each of the five categories grown by TODO-025', () => {
		for (const category of ['Religion', 'General', 'Humor', 'Cuisine', 'Canada']) {
			expect(count(category), category).toBe(30);
		}
	});

	it('leaves Lyrics and Chess at twenty (grown in TODO-024, not TODO-025)', () => {
		expect(count('Lyrics'), 'Lyrics').toBe(20);
		expect(count('Chess'), 'Chess').toBe(20);
	});

	it('leaves Music, Music [Guitar] and Shakespeare at ten (TODO-006, TODO-007, TODO-015)', () => {
		expect(count('Music'), 'Music').toBe(10);
		expect(count('Music [Guitar]'), 'Music [Guitar]').toBe(10);
		expect(count('Shakespeare'), 'Shakespeare').toBe(10);
	});

	it('has two hundred and fifty-five puzzles in total (TODO-025)', () => {
		expect(puzzles.length).toBe(255);
	});

	it('numbers every puzzle 0001.. sequentially in array order (TODO-017)', () => {
		const nums = puzzles.map((p) => p.displayNum);
		// Each is a 4-digit, zero-padded string.
		for (const n of nums) expect(n).toMatch(/^\d{4}$/);
		// The sequence is exactly 0001..(length) with no gaps or dupes.
		const expected = puzzles.map((_, i) => String(i + 1).padStart(4, '0'));
		expect(nums).toEqual(expected);
		expect(puzzles[0].displayNum).toBe('0001');
	});
});
