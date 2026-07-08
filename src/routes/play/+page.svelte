<script lang="ts">
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import BackLink from '$lib/ui/BackLink.svelte';
	import Keypad from '$lib/ui/Keypad.svelte';
	import { isLetter } from '$lib/domain/cipher.js';
	import { puzzles, defaultAlgorithm } from '$lib/data/puzzles.js';
	import { loadSeen, saveSeen, clearSeen } from '$lib/ui/persistence.js';
	import {
		startGame,
		setGuess,
		clearGuess,
		clearAll,
		reconstruct,
		isSolved,
		type Puzzle
	} from '$lib/domain/cryptogram-game-state.js';

	type Cell = { letter: true; cipher: string } | { letter: false; ch: string };

	// Group a cipher string into words (arrays of cells) so a word never breaks
	// across lines; spaces become the gaps between word groups.
	function buildWords(text: string): Cell[][] {
		const words: Cell[][] = [];
		let cur: Cell[] = [];
		for (const ch of text) {
			if (ch === ' ') {
				if (cur.length) words.push(cur);
				cur = [];
			} else if (isLetter(ch)) {
				cur.push({ letter: true, cipher: ch });
			} else {
				cur.push({ letter: false, ch });
			}
		}
		if (cur.length) words.push(cur);
		return words;
	}

	let game = $state(startGame(puzzles[0], defaultAlgorithm));
	let selected = $state<string | null>(null);
	let showHint = $state(false);
	// Ids of puzzles already moved past; loaded from localStorage on mount so each
	// puzzle is shown once (TODO-005). Empty during SSR/prerender.
	let seen = $state<Set<string>>(new Set());
	// True once every puzzle has been seen — the end-of-game state.
	let ended = $state(false);

	const words = $derived(buildWords(game.ciphertext));
	const authorWords = $derived(buildWords(game.attributionCiphertext));
	const solved = $derived(isSolved(game));
	const used = $derived(new Set(Object.values(game.guesses)));

	/** The first puzzle (in data order) the player hasn't moved past yet. */
	function firstUnseen(): Puzzle | undefined {
		return puzzles.find((p) => !seen.has(p.id));
	}

	/** Show a puzzle and reset all per-puzzle UI state. */
	function loadPuzzle(puzzle: Puzzle) {
		game = startGame(puzzle, defaultAlgorithm);
		selected = null;
		showHint = false;
		ended = false;
	}

	// On the client, honour previously-seen puzzles: resume at the first unseen
	// one, or show the end state if they've all been played.
	onMount(() => {
		seen = loadSeen();
		const next = firstUnseen();
		if (next) loadPuzzle(next);
		else ended = true;
	});

	function selectCell(cipher: string) {
		if (solved) return;
		selected = selected === cipher ? null : cipher;
	}

	function assign(letter: string) {
		if (selected === null) return;
		game = setGuess(game, selected, letter);
		// Drop the selection highlight once the puzzle is complete.
		if (isSolved(game)) selected = null;
	}

	function clearSelected() {
		if (selected === null) return;
		game = clearGuess(game, selected);
	}

	/** Restart the current puzzle from scratch (does not mark it seen). */
	function resetGame() {
		const current = puzzles.find((p) => p.id === game.puzzleId);
		if (current) loadPuzzle(current);
	}

	// Mark the current puzzle seen (persisted) and advance; when none are left,
	// show the end-of-game message.
	function nextPuzzle() {
		const updated = new Set(seen);
		updated.add(game.puzzleId);
		seen = updated;
		saveSeen(seen);
		const next = firstUnseen();
		if (next) loadPuzzle(next);
		else ended = true;
	}

	/** Forget all progress and begin again from the first puzzle. */
	function startOver() {
		clearSeen();
		seen = new Set();
		loadPuzzle(puzzles[0]);
	}

	function clearBoard() {
		game = clearAll(game);
	}

	// Physical-keyboard support (desktop / accessibility): with a cell selected,
	// a letter key assigns it, Backspace/Delete clears it, Escape deselects.
	function onKeydown(e: KeyboardEvent) {
		if (solved || selected === null) return;
		if (e.key === 'Escape') {
			selected = null;
		} else if (e.key === 'Backspace' || e.key === 'Delete') {
			clearSelected();
			e.preventDefault();
		} else if (e.key.length === 1 && isLetter(e.key)) {
			assign(e.key.toUpperCase());
			e.preventDefault();
		}
	}
</script>

<svelte:head>
	<title>Play — Cryptogram</title>
	<meta name="description" content="Decode the hidden quotation by cracking its cipher." />
</svelte:head>

<svelte:window onkeydown={onKeydown} />

{#snippet letters(wordList: Cell[][])}
	{#each wordList as word, wi (wi)}
		<span class="word">
			{#each word as cell, ci (ci)}
				{#if cell.letter}
					<button
						type="button"
						class="cell"
						class:active={selected === cell.cipher}
						class:filled={!!game.guesses[cell.cipher]}
						disabled={solved}
						aria-label={`Cipher letter ${cell.cipher}, ${game.guesses[cell.cipher] ? 'guess ' + game.guesses[cell.cipher] : 'no guess'}`}
						aria-pressed={selected === cell.cipher}
						onclick={() => selectCell(cell.cipher)}
					>
						<span class="guess">{game.guesses[cell.cipher] ?? ''}</span>
						<span class="cipher">{cell.cipher}</span>
					</button>
				{:else}
					<span class="sym" aria-hidden="true">{cell.ch}</span>
				{/if}
			{/each}
		</span>
	{/each}
{/snippet}

<main>
	<BackLink href="{base}/" label="Home" />

	<header>
		<h1>Play</h1>
		<p class="subtitle">Every letter stands for another. Crack the substitution to reveal the quote — and who said it.</p>
	</header>

	{#if ended}
		<div class="banner end" role="status">
			<p class="banner-title">That's every puzzle! 🏁</p>
			<p>You've reached the end of the game — you've played every cryptogram.</p>
			<div class="actions">
				<button type="button" class="big-button" onclick={startOver}>Start over</button>
			</div>
		</div>
	{:else}
		{#if solved}
			<div class="banner" role="status">
				<p class="banner-title">Solved! 🎉</p>
				<p class="quote">“{reconstruct(game)}”</p>
				<p class="attribution">— {game.attribution}</p>
			</div>
		{:else}
			<p class="hint" aria-live="polite">
				{#if selected}
					Cipher letter <strong>{selected}</strong> selected — choose its real letter below.
				{:else}
					Tap a letter in the puzzle, then pick its real letter on the keypad.
				{/if}
			</p>
		{/if}

		<section class="board" class:done={solved} aria-label="Cryptogram puzzle">
			{@render letters(words)}
		</section>

		<div class="byline board" class:done={solved} aria-label="Quote author (enciphered)">
			<span class="sym dash" aria-hidden="true">—</span>
			{@render letters(authorWords)}
		</div>

		<div class="reveal">
			<button
				type="button"
				class="text-button"
				aria-expanded={showHint}
				onclick={() => (showHint = !showHint)}
			>
				{showHint ? 'Hide hint' : 'Show hint'}
			</button>
			{#if showHint}
				<dl class="clue">
					<dt>Category</dt>
					<dd>{game.category}</dd>
					<dt>Hint</dt>
					<dd>{game.hint}</dd>
				</dl>
			{/if}
		</div>

		{#if solved}
			<div class="actions">
				<button type="button" class="big-button" onclick={resetGame}>Play again</button>
				<button type="button" class="big-button" onclick={nextPuzzle}>Next puzzle</button>
			</div>
		{:else}
			<Keypad {selected} {used} onletter={assign} onclear={clearSelected} />
			<div class="actions">
				<button type="button" class="text-button" onclick={clearBoard} disabled={Object.keys(game.guesses).length === 0}>
					Clear all
				</button>
				<button type="button" class="text-button" onclick={nextPuzzle}>Next puzzle</button>
			</div>
		{/if}
	{/if}
</main>

<style>
	main {
		max-width: 40rem;
		margin: 0 auto;
		padding: 1rem 1rem 3rem;
	}

	header {
		margin-bottom: 1.25rem;
		padding-bottom: 1rem;
		border-bottom: 2px solid var(--accent);
	}

	h1 {
		font-family: var(--serif);
		font-weight: 600;
		font-size: 1.8rem;
		margin: 0;
		color: var(--accent);
	}

	.subtitle {
		margin: 0.25rem 0 0;
		font-family: var(--serif);
		font-style: italic;
		color: var(--muted);
	}

	.hint {
		min-height: 1.5rem;
		margin: 0 0 1rem;
		font-size: 1rem;
		color: var(--muted);
		text-align: center;
	}

	.hint strong {
		color: var(--accent-deep);
	}

	.board {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem 1rem;
		justify-content: center;
		margin-bottom: 1.75rem;
	}

	.word {
		display: inline-flex;
		gap: 0.15rem;
		align-items: flex-end;
	}

	.cell {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.15rem;
		width: 1.75rem;
		padding: 0.1rem 0;
		background: transparent;
		border: none;
		cursor: pointer;
		font-family: var(--sans);
	}

	.cell:disabled {
		cursor: default;
	}

	.guess {
		font-size: 1.35rem;
		font-weight: 700;
		line-height: 1.1;
		min-height: 1.5rem;
		color: var(--ink);
		border-bottom: 2px solid var(--rule);
		width: 100%;
		text-align: center;
	}

	.cell.filled .guess {
		color: var(--accent-deep);
	}

	.cell.active .guess {
		border-bottom-color: var(--accent);
		background: rgba(176, 80, 58, 0.12);
	}

	.cell:focus-visible {
		outline: 4px solid var(--focus);
		outline-offset: 2px;
		border-radius: 4px;
	}

	.cipher {
		font-size: 0.85rem;
		font-weight: 700;
		letter-spacing: 0.05em;
		color: var(--muted);
	}

	.cell.active .cipher {
		color: var(--accent);
	}

	.sym {
		font-size: 1.35rem;
		font-weight: 700;
		line-height: 1.1;
		align-self: flex-start;
		color: var(--ink);
	}

	.board.done .guess {
		color: var(--good);
		border-bottom-color: transparent;
	}

	.board.done .cipher {
		visibility: hidden;
	}

	/* The enciphered author line: same cipher cells as the quote, set apart as a byline. */
	.byline {
		gap: 0.35rem 0.75rem;
		margin-top: -0.75rem;
		margin-bottom: 1.5rem;
	}

	.dash {
		align-self: flex-end;
		padding-bottom: 0.1rem;
		color: var(--muted);
	}

	.reveal {
		text-align: center;
		margin-bottom: 1.5rem;
	}

	.clue {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.25rem 0.75rem;
		max-width: 28rem;
		margin: 0.75rem auto 0;
		padding: 0.75rem 1rem;
		border: 1px solid var(--rule);
		border-left: 4px solid var(--accent);
		border-radius: 6px;
		background: var(--panel);
		text-align: left;
	}

	.clue dt {
		font-family: var(--sans);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--muted);
		align-self: baseline;
	}

	.clue dd {
		margin: 0;
		font-family: var(--serif);
		color: var(--ink);
	}

	.banner {
		border: 1px solid var(--rule);
		border-left: 4px solid var(--good);
		border-radius: 6px;
		background: var(--panel);
		padding: 1.25rem 1.5rem;
		margin-bottom: 1.5rem;
		text-align: center;
		box-shadow: 0 1px 3px rgba(61, 58, 53, 0.08);
	}

	.banner-title {
		margin: 0 0 0.5rem;
		font-size: 1.3rem;
		font-weight: 700;
		color: var(--good);
	}

	.quote {
		margin: 0;
		font-family: var(--serif);
		font-size: 1.2rem;
		font-style: italic;
	}

	.attribution {
		margin: 0.4rem 0 0;
		font-family: var(--serif);
		color: var(--muted);
	}

	.banner.end p {
		margin: 0;
		font-family: var(--serif);
		color: var(--muted);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem 1.5rem;
		justify-content: center;
		margin-top: 1.25rem;
	}

	.big-button {
		min-height: 56px;
		padding: 0.75rem 2rem;
		font-size: 1.2rem;
		font-weight: 700;
		border: 1px solid var(--rule);
		border-radius: 6px;
		background: var(--panel);
		color: var(--ink);
		cursor: pointer;
		box-shadow: 0 1px 3px rgba(61, 58, 53, 0.08);
	}

	.big-button:hover {
		border-color: var(--accent);
	}

	.big-button:focus-visible {
		outline: 4px solid var(--focus);
		outline-offset: 2px;
	}

	.text-button {
		min-height: 48px;
		padding: 0 1rem;
		font-size: 1rem;
		font-weight: 700;
		color: var(--accent-deep);
		background: transparent;
		border: none;
		cursor: pointer;
	}

	.text-button:hover:not(:disabled) {
		text-decoration: underline;
	}

	.text-button:focus-visible {
		outline: 4px solid var(--focus);
		outline-offset: 2px;
		border-radius: 8px;
	}

	.text-button:disabled {
		opacity: 0.45;
		cursor: default;
	}
</style>
