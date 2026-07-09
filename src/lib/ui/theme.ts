/**
 * Theme registry and application (TODO-011). The palette itself lives as CSS
 * custom properties in src/routes/+layout.svelte: the base `:root` is the
 * "Original" theme, and each additional theme is a `:root[data-theme='<id>']`
 * override. This module just names the themes and toggles the `data-theme`
 * attribute the CSS keys off.
 *
 * The stored preference (Settings.theme) is the human label — "Original" /
 * "Prince" — so the config dropdown and the persisted value line up; the slug
 * used in the DOM/CSS is derived here.
 */

import { browser } from '$app/environment';

export interface ThemeOption {
	/** CSS slug used as the `data-theme` attribute value. */
	id: string;
	/** Human label shown in the config dropdown and stored in settings. */
	label: string;
	/** Browser-chrome colour (`<meta name="theme-color">`) for this theme. */
	themeColor: string;
}

export const THEMES: ThemeOption[] = [
	{ id: 'original', label: 'Original', themeColor: '#9c4632' },
	{ id: 'prince', label: 'Prince', themeColor: '#7b2cbf' }
];

const DEFAULT_THEME = THEMES[0];

/** The theme for a stored label, falling back to the default (Original). */
export function themeFor(label: string): ThemeOption {
	return THEMES.find((t) => t.label === label) ?? DEFAULT_THEME;
}

/** The `data-theme` slug for a stored label (default 'original'). */
export function themeId(label: string): string {
	return themeFor(label).id;
}

/**
 * Apply a theme to the document: set the `data-theme` attribute the palette
 * keys off and update the browser-chrome theme colour. Browser-only (no-op
 * under SSR/prerender), since it touches the live DOM.
 */
export function applyTheme(label: string): void {
	if (!browser) return;
	const theme = themeFor(label);
	document.documentElement.dataset.theme = theme.id;
	const meta = document.querySelector('meta[name="theme-color"]');
	if (meta) meta.setAttribute('content', theme.themeColor);
}
