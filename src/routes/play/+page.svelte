<script lang="ts">
	import { base } from '$app/paths';
	import BackLink from '$lib/ui/BackLink.svelte';
	import Keypad from '$lib/ui/Keypad.svelte';
	import { isLetter } from '$lib/domain/cipher.js';
	import { defaultPuzzle, defaultAlgorithm } from '$lib/data/puzzles.js';
	import {
		startGame,
		setGuess,
		clearGuess,
		clearAll,
		reconstruct,
		isSolved
	} from '$lib/domain/cryptogram-game-state.js';

	type Cell = { letter: true; cipher: string } | { letter: false; ch: string };

	// Group the ciphertext into words (arrays of cells) so a word never breaks
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

	let game = $state(startGame(defaultPuzzle, defaultAlgorithm));
	let selected = $state<string | null>(null);

	const words = $derived(buildWords(game.ciphertext));
	const solved = $derived(isSolved(game));
	const used = $derived(new Set(Object.values(game.guesses)));

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

	function resetGame() {
		game = startGame(defaultPuzzle, defaultAlgorithm);
		selected = null;
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

<main>
	<BackLink href="{base}/" label="Home" />

	<header>
		<h1>Play</h1>
		<p class="subtitle">Every letter stands for another. Crack the substitution to reveal the quote.</p>
	</header>

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
		{#each words as word, wi (wi)}
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
	</section>

	{#if solved}
		<div class="actions">
			<button type="button" class="big-button" onclick={resetGame}>Play again</button>
		</div>
	{:else}
		<Keypad {selected} {used} onletter={assign} onclear={clearSelected} />
		<div class="actions">
			<button type="button" class="text-button" onclick={clearBoard} disabled={Object.keys(game.guesses).length === 0}>
				Clear all
			</button>
		</div>
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

	.actions {
		display: flex;
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
