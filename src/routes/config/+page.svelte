<script lang="ts">
	import { base } from '$app/paths';
	import BackLink from '$lib/ui/BackLink.svelte';
</script>

<svelte:head>
	<title>Config — Cryptogram</title>
	<meta name="description" content="Display and interaction preferences for Cryptogram." />
</svelte:head>

<main>
	<BackLink href="{base}/" label="Home" />

	<header>
		<h1>Config</h1>
		<p class="subtitle">Display &amp; interaction preferences.</p>
	</header>

	<section class="placeholder">
		<p>Settings are coming soon.</p>
	</section>
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

	.placeholder {
		border: 1px solid var(--rule);
		border-left: 4px solid var(--accent);
		border-radius: 6px;
		background: var(--panel);
		padding: 1.5rem;
		font-size: 1.1rem;
		color: var(--muted);
		box-shadow: 0 1px 3px rgba(61, 58, 53, 0.08);
	}

	.placeholder p {
		margin: 0;
	}
</style>
