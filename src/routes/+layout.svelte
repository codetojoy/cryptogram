<script lang="ts">
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { base } from '$app/paths';
	import favicon from '$lib/assets/favicon.svg';
	import { loadSettings } from '$lib/ui/persistence.js';
	import { applyTheme } from '$lib/ui/theme.js';

	let { children } = $props();

	onMount(() => {
		// Honour the saved theme (TODO-011) on every page load / direct navigation.
		// An inline script in app.html already sets data-theme pre-paint to avoid a
		// flash; this re-asserts it once the app hydrates and keeps SPA nav in sync.
		applyTheme(loadSettings().theme);

		// Register the service worker ourselves, production-only. SvelteKit's
		// auto-registration is disabled (serviceWorker.register: false in vite.config.ts)
		// because it also fires in dev as a module worker that Chrome can't evaluate.
		// The built worker is a classic script served at `${base}/service-worker.js`.
		if (!dev && 'serviceWorker' in navigator) {
			navigator.serviceWorker.register(`${base}/service-worker.js`);
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

<style>
	/*
	 * The self-hosted @font-face rules live in src/app.html so their URLs can be
	 * base-path-aware via %sveltekit.assets% (CSS url() in a component <style> is
	 * not rewritten for the base path). Fonts: Lato & Lora, both SIL OFL,
	 * no runtime network calls (privacy, SPEC §3); provenance in ASSETS.md.
	 */
	:global(*, *::before, *::after) {
		box-sizing: border-box;
	}

	:global(html) {
		/* Respect OS font-size accessibility settings (SPEC §7). */
		font-size: 100%;
	}

	/*
	 * Design tokens. Fonts are shared across all themes; the colour tokens are
	 * the "Original" theme (warm print-inspired: cream paper, terracotta accents,
	 * hairline rules). Additional themes override only the colour tokens via a
	 * :root[data-theme='<id>'] block below (TODO-011). Components consume the
	 * tokens, so switching data-theme re-skins the whole app.
	 */
	:global(:root) {
		--bg: #f7f2e7;
		--panel: #fffdf6;
		--ink: #3d3a35;
		--muted: #6f6758;
		--accent: #b0503a;
		--accent-deep: #9c4632;
		/* Translucent accent wash for the selected cell (must match --accent). */
		--accent-tint: rgba(176, 80, 58, 0.12);
		--rule: #ddd5c4;
		--focus: #9c4632;
		--good: #2c6e3f;
		--bad: #b3261e;
		--serif: 'Lora', Georgia, 'Times New Roman', serif;
		--sans:
			'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
	}

	/*
	 * "Prince" theme (TODO-011): dark royal purple per the artist's aesthetic —
	 * deep aubergine paper, lavender-white ink, vivid violet accents, with gold
	 * as the secondary (focus rings / highlights). Overrides colour tokens only.
	 */
	:global(:root[data-theme='prince']) {
		--bg: #241436;
		--panel: #2d1b45;
		--ink: #f3ecff;
		--muted: #b9a7d4;
		--accent: #9d4edd;
		--accent-deep: #7b2cbf;
		--accent-tint: rgba(157, 78, 221, 0.22);
		--rule: #4a3568;
		--focus: #e8b84b;
		--good: #4ade80;
		--bad: #f87171;
	}

	:global(body) {
		margin: 0;
		min-height: 100vh;
		background: var(--bg);
		color: var(--ink);
		font-family: var(--sans);
		line-height: 1.5;
		-webkit-text-size-adjust: 100%;
	}
</style>
