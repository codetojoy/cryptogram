<!-- On-screen A–Z keypad for assigning a plaintext letter to the selected cipher
     letter (TODO-002). Purely presentational: it reports taps via callbacks and
     lets the page own the game state. -->
<script lang="ts">
	import { ALPHABET } from '$lib/domain/cipher.js';

	interface Props {
		/** The cipher letter currently selected on the board, or null. */
		selected: string | null;
		/** Plaintext letters already assigned somewhere (shown as "used"). */
		used: Set<string>;
		/** Assign a plaintext letter to the selected cipher letter. */
		onletter: (letter: string) => void;
		/** Clear the selected cipher letter's guess. */
		onclear: () => void;
	}

	let { selected, used, onletter, onclear }: Props = $props();
	const disabled = $derived(selected === null);
</script>

<div class="keypad" role="group" aria-label="Letter keypad">
	{#each ALPHABET as letter (letter)}
		<button
			type="button"
			class="key"
			class:used={used.has(letter)}
			{disabled}
			aria-label={`Assign ${letter}${used.has(letter) ? ' (already used)' : ''}`}
			onclick={() => onletter(letter)}
		>
			{letter}
		</button>
	{/each}
	<button
		type="button"
		class="key clear"
		{disabled}
		aria-label="Clear the selected letter"
		onclick={onclear}
	>
		⌫
	</button>
</div>

<style>
	.keypad {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(48px, 1fr));
		gap: 0.4rem;
		max-width: 34rem;
		margin: 0 auto;
	}

	.key {
		min-height: 48px;
		min-width: 48px;
		font-family: var(--sans);
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--ink);
		background: var(--panel);
		border: 1px solid var(--rule);
		border-radius: 6px;
		cursor: pointer;
	}

	.key:hover:not(:disabled) {
		border-color: var(--accent);
	}

	.key:focus-visible {
		outline: 4px solid var(--focus);
		outline-offset: 2px;
	}

	.key:disabled {
		opacity: 0.45;
		cursor: default;
	}

	/* A letter already used elsewhere: dimmed but still tappable (re-assigning moves it). */
	.key.used:not(:disabled) {
		color: var(--muted);
		background: var(--bg);
	}

	.key.clear {
		color: var(--accent-deep);
		font-size: 1.1rem;
	}
</style>
