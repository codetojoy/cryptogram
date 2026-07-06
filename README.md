# Cryptogram

A simple, free, open-source cryptogram game — decode a hidden quotation letter by letter.

- **No accounts, no ads, no tracking.** Privacy is a feature (SPEC §1).
- **Works offline.** A pure client-side PWA (SvelteKit + `adapter-static`).
- **Open source**, released under the Apache 2.0 license.

See [`doc/SPEC.md`](doc/SPEC.md) for the full project plan and spec.

## Tech stack

- [SvelteKit](https://svelte.dev/docs/kit) 2 + [Svelte](https://svelte.dev) 5 (runes)
- TypeScript
- [Vite](https://vite.dev) 8, [Vitest](https://vitest.dev)
- Static, prerendered PWA (`@sveltejs/adapter-static`) with an offline service worker
- Self-hosted Lato & Lora fonts (no runtime network calls) — see [`ASSETS.md`](ASSETS.md)

## Getting started

```sh
npm install
npm run dev        # start the dev server
npm run build      # production build (to ./build)
npm run preview    # preview the production build
npm run check      # type-check
npm test           # run unit tests
```

## Deploying to GitHub Pages

The app supports subpath hosting via a base path:

```sh
npm run build:gh-pages     # builds with BASE_PATH=/cryptogram
npm run deploy:gh-pages    # build + publish ./build to the gh-pages branch
```

## Project layout

```
src/
  app.html                 # HTML shell (self-hosted @font-face rules)
  routes/                  # pages: home, /play, /config, /about
  lib/
    ui/                    # shared UI components
    assets/                # favicon and other bundled assets
  service-worker.ts        # offline caching
static/                    # icons, fonts, manifest, robots.txt
data/                      # puzzle answers & cipher algorithms (SPEC §4)
doc/                       # spec and incremental TODO notes
```

## License

Code is licensed under [Apache 2.0](LICENSE). Asset provenance and licenses are
documented in [`ASSETS.md`](ASSETS.md).
