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

## Note on future assets

SPEC §5 lists remaining assets as TBD. When puzzle content, letter/tile artwork, or any
other visual asset is added, record its provenance here. Use only CC0, MIT, or
Apache-compatible assets (SPEC §6).
