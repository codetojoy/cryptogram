import { describe, it, expect } from 'vitest';
import {
	startGame,
	setGuess,
	clearGuess,
	clearAll,
	cipherLetters,
	reconstruct,
	isSolved,
	type Puzzle,
	type CipherAlgorithm
} from '$lib/domain/cryptogram-game-state.js';
import { invert, buildSubstitution, isLetter } from '$lib/domain/cipher.js';
import { hashString } from '$lib/domain/rng.js';

const puzzle: Puzzle = {
	id: 'test',
	text: 'Bee to bee.',
	attribution: 'Test',
	category: 'Test category',
	hint: 'Test hint'
};

/** The seed startGame derives for a puzzle: the algorithm seed mixed with the id hash. */
const seedFor = (p: Puzzle) => (algorithm.seed ^ hashString(p.id)) >>> 0;
const algorithm: CipherAlgorithm = { id: 'a', type: 'substitution', seed: 1234 };

/** Solve a state fully by assigning the correct plaintext for every cipher letter. */
function solve(state = startGame(puzzle, algorithm)) {
	let s = state;
	for (const c of cipherLetters(s)) s = setGuess(s, c, s.solution[c]);
	return s;
}

describe('startGame', () => {
	it('enciphers the puzzle, keeping length and non-letters', () => {
		const s = startGame(puzzle, algorithm);
		expect(s.ciphertext).toHaveLength(puzzle.text.length);
		expect(s.ciphertext).toMatch(/^[A-Z]{3} [A-Z]{2} [A-Z]{3}\.$/);
		expect(s.guesses).toEqual({});
		expect(isSolved(s)).toBe(false);
	});

	it('solution is the inverse of the per-puzzle seed substitution', () => {
		const s = startGame(puzzle, algorithm);
		expect(s.solution).toEqual(invert(buildSubstitution(seedFor(puzzle))));
	});

	it('enciphers the author with the same substitution', () => {
		const s = startGame(puzzle, algorithm);
		expect(s.attributionCiphertext).toMatch(/^[A-Z]{4}$/); // "Test"
		expect(reconstruct(s, s.attributionCiphertext)).toBe('____'); // blank until guessed
		expect(s.category).toBe('Test category');
		expect(s.hint).toBe('Test hint');
	});

	it('uses a distinct substitution per puzzle id', () => {
		const a = startGame({ ...puzzle, id: 'one' }, algorithm);
		const b = startGame({ ...puzzle, id: 'two' }, algorithm);
		expect(a.solution).not.toEqual(b.solution);
	});
});

describe('setGuess', () => {
	it('records the guess and applies it to every occurrence via reconstruct', () => {
		let s = startGame(puzzle, algorithm);
		const cipherForB = s.ciphertext[0]; // 'B' of "Bee"
		s = setGuess(s, cipherForB, 'b');
		// "Bee to bee." → all three B's become 'B'
		expect(reconstruct(s)).toBe('B__ __ B__.');
		expect(s.guesses[cipherForB]).toBe('B');
	});

	it('keeps the guess map injective — reassigning a plaintext letter moves it', () => {
		let s = startGame(puzzle, algorithm);
		const [c1, c2] = cipherLetters(s);
		s = setGuess(s, c1, 'X');
		s = setGuess(s, c2, 'X'); // X now belongs to c2, not c1
		expect(s.guesses[c1]).toBeUndefined();
		expect(s.guesses[c2]).toBe('X');
	});

	it('rejects non-letter arguments', () => {
		const s = startGame(puzzle, algorithm);
		expect(() => setGuess(s, '1', 'A')).toThrow();
		expect(() => setGuess(s, 'A', ' ')).toThrow();
	});

	it('does not mutate the previous state', () => {
		const s0 = startGame(puzzle, algorithm);
		const s1 = setGuess(s0, s0.ciphertext[0], 'B');
		expect(s0.guesses).toEqual({});
		expect(s1).not.toBe(s0);
	});
});

describe('clearGuess / clearAll', () => {
	it('clearGuess removes a single assignment', () => {
		let s = solve();
		const c = cipherLetters(s)[0];
		s = clearGuess(s, c);
		expect(s.guesses[c]).toBeUndefined();
		expect(isSolved(s)).toBe(false);
	});

	it('clearAll empties all guesses', () => {
		const s = clearAll(solve());
		expect(s.guesses).toEqual({});
	});
});

describe('isSolved', () => {
	it('is false with an incomplete or wrong mapping', () => {
		let s = startGame(puzzle, algorithm);
		expect(isSolved(s)).toBe(false);
		const c = cipherLetters(s)[0];
		s = setGuess(s, c, s.solution[c] === 'Z' ? 'Y' : 'Z'); // deliberately wrong
		expect(isSolved(s)).toBe(false);
	});

	it('is true once every cipher letter is guessed correctly', () => {
		const s = solve();
		expect(isSolved(s)).toBe(true);
		expect(reconstruct(s)).toBe(puzzle.text.toUpperCase());
	});

	it('is not solved until the enciphered author is also decoded', () => {
		let s = startGame(puzzle, algorithm);
		// Solve only the cipher letters that occur in the quote.
		const quoteCiphers = [...new Set([...s.ciphertext].filter(isLetter))];
		for (const c of quoteCiphers) s = setGuess(s, c, s.solution[c]);
		expect(reconstruct(s)).toBe(puzzle.text.toUpperCase()); // quote reads correctly
		expect(isSolved(s)).toBe(false); // author has a letter ('S') not in the quote
		// Finish the author byline.
		for (const c of cipherLetters(s)) s = setGuess(s, c, s.solution[c]);
		expect(isSolved(s)).toBe(true);
		expect(reconstruct(s, s.attributionCiphertext)).toBe('TEST');
	});
});
