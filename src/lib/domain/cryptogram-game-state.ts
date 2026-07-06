/**
 * Cryptogram game state and pure transitions.
 *
 * The state is plain, JSON-able data; every transition returns a new state
 * (immutability, SPEC §9). The UI holds one `GameState` and calls into these
 * functions — no game logic lives in the UI.
 *
 * The player works in *cipher space*: they assign a guessed plaintext letter to
 * each distinct cipher letter, and that guess applies to every occurrence of
 * that letter. `guesses` therefore maps cipher letter → guessed plaintext
 * letter. Assigning a plaintext letter that was already used elsewhere moves it,
 * keeping the guess map injective (a real substitution is a bijection).
 */

import { buildSubstitution, encipher, invert, isLetter, type Substitution } from './cipher.js';

/** A puzzle answer, as stored in data/puzzles.json. */
export interface Puzzle {
	id: string;
	/** The solved quotation, in natural case. */
	text: string;
	/** Author or source (e.g. a name, or "Anonymous"). */
	attribution: string;
}

/** A cipher algorithm, as stored in data/cipher-algos.json. */
export interface CipherAlgorithm {
	id: string;
	type: 'substitution';
	/** Deterministic seed for the substitution alphabet. */
	seed: number;
}

export interface GameState {
	puzzleId: string;
	attribution: string;
	/** The puzzle enciphered: uppercase cipher letters with spaces/punctuation intact. */
	ciphertext: string;
	/** Answer key: cipher letter → plaintext letter. */
	solution: Substitution;
	/** Player's assignments: cipher letter → guessed plaintext letter (uppercase). Absent = blank. */
	guesses: Substitution;
}

/** Start a fresh game: encipher the puzzle with the algorithm's seeded substitution. */
export function startGame(puzzle: Puzzle, algorithm: CipherAlgorithm): GameState {
	const substitution = buildSubstitution(algorithm.seed);
	return {
		puzzleId: puzzle.id,
		attribution: puzzle.attribution,
		ciphertext: encipher(puzzle.text, substitution),
		solution: invert(substitution),
		guesses: {}
	};
}

/** The distinct cipher letters that appear in the puzzle, in first-seen order. */
export function cipherLetters(state: GameState): string[] {
	const seen: string[] = [];
	for (const ch of state.ciphertext) {
		if (isLetter(ch) && !seen.includes(ch)) seen.push(ch);
	}
	return seen;
}

/**
 * Assign `plaintextLetter` as the guess for `cipherLetter` (both single A–Z
 * letters). The plaintext letter is removed from any other cipher letter it was
 * assigned to, so the guess map stays injective.
 */
export function setGuess(state: GameState, cipherLetter: string, plaintextLetter: string): GameState {
	if (!isLetter(cipherLetter) || !isLetter(plaintextLetter)) {
		throw new Error(`setGuess expects single letters, got "${cipherLetter}" → "${plaintextLetter}"`);
	}
	const cipher = cipherLetter.toUpperCase();
	const plain = plaintextLetter.toUpperCase();

	const guesses: Substitution = {};
	for (const [c, p] of Object.entries(state.guesses)) {
		// Drop the plaintext letter wherever it was used, and any prior guess for this cipher letter.
		if (c === cipher || p === plain) continue;
		guesses[c] = p;
	}
	guesses[cipher] = plain;
	return { ...state, guesses };
}

/** Remove the guess for `cipherLetter`, if any. */
export function clearGuess(state: GameState, cipherLetter: string): GameState {
	const cipher = cipherLetter.toUpperCase();
	if (!(cipher in state.guesses)) return state;
	const guesses = { ...state.guesses };
	delete guesses[cipher];
	return { ...state, guesses };
}

/** Remove every guess. */
export function clearAll(state: GameState): GameState {
	return { ...state, guesses: {} };
}

/** The player's current attempt: ciphertext rewritten through their guesses (blanks stay as the cipher letter lowercased? no — as a gap). */
export function reconstruct(state: GameState): string {
	let out = '';
	for (const ch of state.ciphertext) {
		if (isLetter(ch)) {
			out += state.guesses[ch] ?? '_';
		} else {
			out += ch;
		}
	}
	return out;
}

/** True once every cipher letter in the puzzle is guessed correctly. */
export function isSolved(state: GameState): boolean {
	const letters = cipherLetters(state);
	return letters.length > 0 && letters.every((c) => state.guesses[c] === state.solution[c]);
}
