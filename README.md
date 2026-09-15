# Niteroiense FC — Niterói em campo

Digital experience for the 2026 Série B1 season of Niteroiense Futebol Clube.

Astro 7, TypeScript, Tailwind CSS v4, GSAP + ScrollTrigger, Three.js,
GLightbox + Plyr (both self-hosted, no CDN at runtime).
No backend, no CMS: all content is typed data in `src/data/`.

## Running it

```sh
npm install
npm run dev        # development
npm run build      # production build into dist/
npm run preview    # serve the build
npm run check      # astro check (types + templates)
```

## What is where

```text
src/
  config/       pageMode (SEASON | PRE_MATCH | MATCHDAY | POST_MATCH), motion constants, navigation
  data/         club, season/fixtures, squad, stories, videos, partners, and the shared types
  components/   layout, navigation, sections, match, season, three, ui
  lib/motion/   one entry point; one gsap.matchMedia owns every scene
  lib/three/    the single WebGL scene (Arena Niteroiense)
  styles/       tokens.css (official brand palette) and global.css
docs/
  experience-contract.md   the concept, and what must not change during refinements
qa/
  screenshot and audit scripts used for the pre-delivery gate
```

## Content policy

Everything on the page is sourced from the club's own published material
(`niteroiensefc.com.br`, including the Manual de Marca in Transparência, and the
official Niteroiense TV channel for match photography and the hero film).
Nothing is invented. Where the club publishes nothing — the full Série B1
table, shirt numbers, individual squad photographs — the interface says so or
leaves it out. See `docs/experience-contract.md`.

## Changing the temporal state

`src/config/experience.ts` holds a single `pageMode`. Changing it shifts the
editorial emphasis of the home page (which copy leads, whether the matchday
operations block appears) without producing a different site.

## QA

```sh
npm run build
node qa/serve.mjs          # serves dist/ on :4399
node qa/entrance.mjs       # samples the loading screen and the hero film frame by frame
node qa/features.mjs       # header, squad filter, chevrons, lightbox, back to top
node qa/shoot.mjs          # screenshots at 1440x900, 1366x768, 390x844, 360x800
node qa/behaviour.mjs      # reduced motion, no-JS, keyboard, reverse scroll, a11y
node qa/contrast.mjs       # WCAG AA check on every visible text node
node qa/overflow.mjs       # horizontal overflow trace
```

Screenshots land in `qa/shots/`.
