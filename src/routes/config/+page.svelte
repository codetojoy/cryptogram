<script lang="ts">
	import { base } from '$app/paths';
	import BackLink from '$lib/ui/BackLink.svelte';
	import { loadSettings, saveSettings, type Settings } from '$lib/ui/persistence.js';
	import { THEMES, applyTheme } from '$lib/ui/theme.js';

	// Editable prefs plus a snapshot of what's in storage, to detect unsaved changes.
	let prefs = $state<Settings>(loadSettings());
	let saved = $state<Settings>({ ...prefs });

	const dirty = $derived(prefs.theme !== saved.theme || prefs.showId !== saved.showId);

	function save() {
		saveSettings({ ...prefs });
		saved = { ...prefs };
		// Apply the chosen theme app-wide immediately (TODO-011).
		applyTheme(prefs.theme);
	}
</script>

<svelte:head>
	<title>Config — Cryptogram</title>
	<meta name="description" content="Display and interaction preferences for Cryptogram." />
</svelte:head>

<main>
	<BackLink href="{base}/" label="Home" />

	<header>
		<h1>Config</h1>
		<p class="subtitle">Display &amp; interaction preferences. Always editable. Save to apply.</p>
	</header>

	<form onsubmit={(e) => { e.preventDefault(); save(); }}>
		<fieldset>
			<legend>Display</legend>
			<div class="setting">
				<label class="setting-desc" for="theme">Theme</label>
				<select id="theme" class="control" bind:value={prefs.theme}>
					{#each THEMES as theme (theme.id)}
						<option value={theme.label}>{theme.label}</option>
					{/each}
				</select>
			</div>
			<div class="setting">
				<label class="setting-desc" for="show-id">
					Show Id
					<span class="setting-note">Reveals a link on the play screen to show the current puzzle's id (for debugging).</span>
				</label>
				<input id="show-id" class="toggle" type="checkbox" bind:checked={prefs.showId} />
			</div>
		</fieldset>

		<div class="actions">
			<button type="submit" class="big-button" disabled={!dirty}>Save</button>
			<span class="save-state" class:dirty aria-live="polite">
				{dirty ? 'Unsaved changes' : 'Saved'}
			</span>
		</div>
	</form>
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

	fieldset {
		border: 1px solid var(--rule);
		border-radius: 6px;
		margin: 0 0 1.25rem;
		padding: 0.75rem 1rem 1rem;
		background: var(--panel);
	}

	legend {
		padding: 0 0.5rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		font-size: 0.9rem;
		color: var(--accent-deep);
	}

	.setting {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		min-height: 56px;
		padding: 0.5rem 0;
	}

	.setting-desc {
		font-size: 1.1rem;
		font-weight: 600;
	}

	.setting-note {
		display: block;
		margin-top: 0.15rem;
		font-size: 0.85rem;
		font-weight: 400;
		font-style: italic;
		color: var(--muted);
	}

	.toggle {
		flex: none;
		width: 28px;
		height: 28px;
		accent-color: var(--accent);
		cursor: pointer;
	}

	.toggle:focus-visible {
		outline: 4px solid var(--focus);
		outline-offset: 2px;
	}

	.control {
		min-height: 48px;
		padding: 0 0.75rem;
		font-size: 1.05rem;
		font-weight: 700;
		font-family: var(--sans);
		color: var(--ink);
		background: var(--bg);
		border: 1px solid var(--rule);
		border-radius: 6px;
		cursor: pointer;
	}

	.control:focus-visible {
		outline: 4px solid var(--focus);
		outline-offset: 2px;
	}

	.actions {
		display: flex;
		align-items: center;
		gap: 1rem;
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

	.big-button:hover:not(:disabled) {
		border-color: var(--accent);
	}

	.big-button:focus-visible {
		outline: 4px solid var(--focus);
		outline-offset: 2px;
	}

	.big-button:disabled {
		opacity: 0.45;
		cursor: default;
	}

	.save-state {
		font-size: 1rem;
		font-style: italic;
		color: var(--muted);
	}

	.save-state.dirty {
		color: var(--accent-deep);
		font-style: normal;
		font-weight: 700;
	}
</style>
