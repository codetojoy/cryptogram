/**
 * Typed, validated access to the puzzle and cipher-algorithm data files
 * (data/*.json, SPEC §4). Kept out of the domain layer so the domain stays a
 * pure function of the data it's handed; this module is the single place that
 * knows where the data lives and validates it at load time (fail fast on a
 * malformed file, mirroring forty-fives' scheme loader).
 */

import type { CipherAlgorithm, Puzzle } from '$lib/domain/cryptogram-game-state.js';
import puzzlesData from '../../../data/puzzles.json';
import algosData from '../../../data/cipher-algos.json';

function asString(value: unknown, where: string): string {
	if (typeof value !== 'string' || value.length === 0) {
		throw new Error(`Invalid data: expected non-empty string at ${where}, got ${JSON.stringify(value)}`);
	}
	return value;
}

function toPuzzle(raw: unknown, i: number): Puzzle {
	const o = raw as Record<string, unknown>;
	return {
		id: asString(o.id, `puzzles[${i}].id`),
		displayNum: asString(o.display_num, `puzzles[${i}].display_num`),
		text: asString(o.text, `puzzles[${i}].text`),
		attribution: asString(o.attribution, `puzzles[${i}].attribution`),
		category: asString(o.category, `puzzles[${i}].category`),
		hint: asString(o.hint, `puzzles[${i}].hint`)
	};
}

function toAlgorithm(raw: unknown, i: number): CipherAlgorithm {
	const o = raw as Record<string, unknown>;
	if (o.type !== 'substitution') {
		throw new Error(`Invalid data: algorithms[${i}].type must be "substitution", got ${JSON.stringify(o.type)}`);
	}
	if (typeof o.seed !== 'number' || !Number.isFinite(o.seed)) {
		throw new Error(`Invalid data: algorithms[${i}].seed must be a number, got ${JSON.stringify(o.seed)}`);
	}
	return { id: asString(o.id, `algorithms[${i}].id`), type: 'substitution', seed: o.seed };
}

export const puzzles: Puzzle[] = (puzzlesData.puzzles as unknown[]).map(toPuzzle);
export const algorithms: CipherAlgorithm[] = (algosData.algorithms as unknown[]).map(toAlgorithm);

if (puzzles.length === 0) throw new Error('data/puzzles.json has no puzzles');
if (algorithms.length === 0) throw new Error('data/cipher-algos.json has no algorithms');

// Puzzle ids must be unique — they key the "seen" persistence (TODO-005), so a
// duplicate would silently hide two puzzles behind one id. Fail fast at load.
const seenIds = new Set<string>();
for (const p of puzzles) {
	if (seenIds.has(p.id)) throw new Error(`data/puzzles.json has a duplicate puzzle id: "${p.id}"`);
	seenIds.add(p.id);
}

/** The puzzle and algorithm shown by the single-game MVP (TODO-002): the first of each. */
export const defaultPuzzle: Puzzle = puzzles[0];
export const defaultAlgorithm: CipherAlgorithm = algorithms[0];
