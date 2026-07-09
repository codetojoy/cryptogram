# Asset provenance

Per SPEC §6, every visual asset in this repository is listed here with its origin and
license. The only third-party assets are the two bundled font families (SIL OFL) —
Apache-compatible; everything else is original to this project.

| Asset | Origin | License |
|---|---|---|
| `static/fonts/lato-400.woff2`, `lato-400-italic.woff2`, `lato-700.woff2` | [Lato](https://fonts.google.com/specimen/Lato) by Łukasz Dziedzic; latin-subset woff2 files obtained via Google Fonts, self-hosted so the app makes no network calls (SPEC §3) | SIL Open Font License 1.1 |
| `static/fonts/lora-600.woff2`, `lora-400-italic.woff2` | [Lora](https://fonts.google.com/specimen/Lora) by Cyreal; latin-subset woff2 files obtained via Google Fonts, self-hosted | SIL Open Font License 1.1 |
| `src/lib/assets/favicon.svg`, `static/icon.svg` | Original app icon — an "A=Z" substitution motif over three cipher blanks, hand-written SVG in the project's terracotta/cream theme | Apache 2.0 (project license) |
| `static/icon-192.png`, `static/icon-512.png`, `static/apple-touch-icon.png` | Rendered from `static/icon.svg` | Apache 2.0 (project license) |

## Note on the theme and fonts

The visual theme (colors, typography, layout) and the self-hosted font pipeline are
carried over from the sibling project [forty-fives](https://github.com/codetojoy/forty-fives),
which sourced Lato and Lora from Google Fonts under the SIL OFL 1.1. No forty-fives
source files are copied verbatim except where noted; the shared UI primitives are
re-authored for this project.

## Puzzle text content

The quotations in `data/puzzles.json` are short excerpts used as game answers. Their
provenance by category:

- **Humor / Philosophy / Music / General / Chess / Music [Guitar]** — brief attributed
  quotations (aphorisms, quips and remarks). Short factual quotations attributed to their
  author; used here as puzzle answers.
- **Lyrics** — lines from **public-domain / traditional songs only** (spirituals, folk
  songs, and works published before 1929): *Swing Low, Sweet Chariot*; *Amazing Grace*
  (John Newton, 1779); *Danny Boy* (Weatherly, 1913); *Home on the Range*; *Scarborough
  Fair*; *The Water Is Wide*; *Shenandoah*; *Auld Lang Syne* (Burns, 1788); *When the
  Saints Go Marching In*; *Greensleeves*. No lyrics under current copyright are used.
- **Religion** — verses quoted from the **New International Version (NIV)**. Required
  attribution notice:

  > Scripture quotations taken from The Holy Bible, New International Version® NIV®.
  > Copyright © 1973, 1978, 1984, 2011 by Biblica, Inc.™ Used by permission. All rights
  > reserved worldwide.

  Fewer than 500 verses are quoted and they do not constitute a complete book of the
  Bible, within Biblica's standard permission terms for the NIV.

## Note on future assets

SPEC §5 lists remaining assets as TBD. When puzzle content, letter/tile artwork, or any
other visual asset is added, record its provenance here. Use only CC0, MIT, or
Apache-compatible assets (SPEC §6).
