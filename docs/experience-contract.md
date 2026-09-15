# Core Experience Contract — Niteroiense FC

This document exists so that later local fixes do not quietly dismantle the
concept. Spacing, timing and copy can move. The decisions below cannot, unless
there is evidence that the concept itself is wrong.

---

## Concept

**NITERÓI EM CAMPO**

The visitor should not feel they opened an institutional club website. They
should feel they entered the current sporting moment of the Niteroiense.

Four forces run through everything, never as four literal sections:
**clube × cidade × competição × comunidade**.

---

## Pillars

- **Clube** — 1913, interrupted in 1981, back on the pitch since 2024.
- **Cidade** — Niterói is not scenery. The crest carries the MAC, the home
  ground is the Concha Acústica, the supporters chose the crest and the kits.
- **Competição** — Carioca Série B1 2026, eleven rounds, one declared
  objective: access to Série A2.
- **Comunidade** — the club has been making decisions with its supporters all
  year. That is a fact about this club, not a slogan.

---

## The entrance

The page opens on a full field of Azul Itaipu holding the crest, a real
progress read-out and the MAC arc filling underneath it. At 100% the crest is
measured onto the crest that lives behind the opening scene and travels there,
and the curtain opens through the same arc. The loader does not disappear: it
becomes the background of the hero.

It is held for a minimum of 2.1s so the moment can be read on a warm cache, and
is capped at 7s so a slow network is never held back by it. Under reduced
motion, or without scripting, there is no curtain at all.

## The film

Behind the opening runs **real match footage from the club's own channel**:
*Melhores momentos, Niteroiense 3 x 0 EC Resende, Série C 2024*. It arrives
last, about 2.6s after the entrance lands, so the composition is complete before
any bandwidth is spent on it.

Its own frame is the still underneath, so nothing about the layout depends on
the player loading. It is muted, has no controls, is tinted into Azul Itaipu
and softened so it reads as depth rather than as a second thing to look at, and
it pauses whenever the opening leaves the viewport or the tab is hidden. It is
skipped entirely under reduced motion or on a metered connection.

## Editorial grammar

Content is ordered by sporting relevance, never by media format. There is no
"Notícias / Vídeos / Últimos jogos" spine.

1. **Agora** — the current moment, resolving into the next fixture.
2. **Dia de jogo** — matchday operation, only while it is useful (see modes).
3. **A campanha** — the season as a trajectory.
4. **Niteroiense TV** — the visual record of the campaigns that got the club here.
5. **Quem joga** — the protagonist, the pitch, then the announced group.
6. **Niterói** — the city, and the edited news under it.
7. **Dentro do clube** — history, identity, institutional material.
8. **Quem joga junto** — partners, closing the light band.

**Temporal modes** live in `src/config/experience.ts` as a single `pageMode`
value: `SEASON | PRE_MATCH | MATCHDAY | POST_MATCH`. They change emphasis and
copy; they never produce four different websites. The page currently runs in
`PRE_MATCH`.

---

## Sourcing rule (non-negotiable)

Every fact, name, score, date, venue, price and photograph on the page comes
from the club's own published material (`niteroiensefc.com.br`, including the
Manual de Marca PDF in Transparência).

- Nothing is invented to fill a composition.
- The full Série B1 table is not published by the club, so the page **says so**
  instead of estimating it (`standingsAvailable` in `src/data/season.ts`).
- The club publishes no shirt numbers and one athlete photograph for this
  squad, so there are no numbers and no placeholder faces. Names carry the
  roster.
- Campaign totals are derived in code from the published results, so they can
  never drift away from the fixtures they come from.

---

## Visual grammar

- **Palette** is the official one, unchanged: Azul Itaipu `#0f2349`, Azul
  Niteroiense `#2c65d5`, branco `#ffffff`. Depth is built by stepping between
  them (`--surface-abyss` through `--surface-light`), never by introducing a
  new brand colour. One accent, used identically everywhere.
- **Theme** is locked dark, with exactly **one** deliberate light zone: the
  white central stripe of the official club flag, which carries Niterói and the
  editorial. That switch is a composition device, not a section-by-section
  inversion.
- **Typography** is two families. Display **Archivo** stands in for Geoform, the
  official display face, and reproduces the marca's regressive weight grade
  (`NI` heavy down to `FC` light). Text **Manrope** stands in for Creato
  Display. The condensed sports face suggested in the brief was dropped: the
  official identity is a wide geometric, and a condensed display would have
  fought it.
- **Numbers are visual language**, not statistic cards. `04 PONTOS` is set at
  display scale in the opening scene because it is true, not because a card
  needed filling.
- **Photography** is real club material only. The pitch photography comes from
  the club's own broadcasts on Niteroiense TV, and **every still stays attached
  to the match it was actually filmed at** — a 2024 photograph is never shown
  against a 2026 fixture. Where the club has no photograph, the architecture
  holds and an abstract, brand-derived surface stands in. The page never fakes a
  player, a crowd or a stadium.
- **The opening is centred.** With footage behind it, the composition reads as a
  broadcast title card: meta, headline, statement, commitment and the match
  object all sit on one axis.
- **Photography carries the grounds.** Matchday, the campaign and the footer sit
  on real match photography, duotoned into the brand and credited in place, so
  no two dark sections read as the same flat field.
- **The light band runs to the end of the page.** Niterói, the editorial and the
  partners share it; the dark returns only for Dentro do clube between them.

---

## Shape language

The crest is **a ring standing over an arc** — the NFC monogram inside a circle,
with the Museu de Arte Contemporânea stylised beneath it. That is the whole
formal system:

| Form | Where it appears |
|---|---|
| Ring | crest at architectural scale, crest badges, filter pills, chevrons, play and zoom affordances, back to top |
| Arc | section seams between the dark field and the light band, the protagonist photo mask, the objective card, the WebGL horizon |
| Flag bands | the macro rhythm of the page: dark, white, dark |

The building is never pasted into the interface as a silhouette. It is a
language, not tourism.

---

## Motion grammar

Three distinct grammars, because three different things are being said.

- **Competition** (opening scene, campaign): scrubbed, lateral, decisive.
  Acceleration and travel. Every step reverses.
- **Editorial rest** (matchday, news, history): a single batched arrival. No
  repeated fade-up on every element, no ambient motion.
- **Return** (back to top): the entrance, replayed. The curtain closes over the
  page through the MAC arc, the page is returned behind it, and the curtain
  opens again. The way back is the way in.

The page alternates tension → rest → tension → content → emotion → information.
Exactly **two** pinned experiences exist, and there is no marquee on the page. Motion is gated through one
`gsap.matchMedia()`, so breakpoint and reduced-motion branches revert cleanly.

**Reduced motion** removes scrubbing, camera travel and drift. It removes no
content: the opening scene's three layers simply stack in document order over a
composed static arena, and the campaign becomes a readable grid.

---

## Spatial language

**One** WebGL scene, one canvas, for the whole page: the **Arena Niteroiense**
(`src/lib/three/arena.ts`).

It is built from the crest's own forms — the ring repeated into a tunnel, the
MAC arc rising at the end of the travel to become the stage the fixture stands
on, and a sparse, slow crowd of particles. There is no ground grid: with real
footage behind the opening, a second perspective floor fought it.

Its role is narrative, not decorative: a single normalized progress value is
written by the opening scene's scroll timeline, so the space is always at the
same moment as the words. It composes its first frame immediately, stops
rendering when it leaves the viewport, drops ring count, particle count and
pixel ratio on mobile, and disposes every geometry, material and renderer on
teardown.

There is no rotating ball, no stadium model, no floating trophy, and no second
canvas anywhere in the project.

---

## Core scenes

**Scene 01 — Agora (pinned, ~170svh mobile / ~210svh desktop)**
One continuous transformation, not a hero followed by a section:

1. Identity establishes: `NITERÓI EM CAMPO`, the crest at architectural scale.
2. The camera enters the arena; the opening lifts away.
3. The real campaign numbers arrive laterally, with impact.
4. The arc rises; the geometry reorganises into a stage.
5. The same space resolves into **PRÓXIMO DESAFIO** and the fixture.

**Scene 02 — A campanha (pinned horizontal, desktop)**
Vertical scroll drives a horizontal traverse of the eleven rounds. Played rounds
read as settled, the next fixture is the only one allowed to carry tension, open
rounds stay outlined and quiet, and the traverse terminates on the objective.
A focus band marks whichever round is under the reading axis.

---

## Mobile intent

Mobile is not the desktop scaled down. The intent is preserved; the geometry is
reinterpreted.

- Scene 01 keeps all five phases, over a shorter scroll budget, with the
  composition centred so the protagonist of each phase stays in the visual
  middle rather than drifting to the bottom edge.
- Scene 02 drops the horizontal pan entirely and becomes a vertical rail with
  staggered arrivals. Forcing the pan onto a phone would fight the thumb.
- The arena halves its rings, cuts particles to roughly a quarter, and caps
  pixel ratio at 1.35.
- The header does not compress the desktop navigation; it becomes a compact bar
  with a full-size touch menu.
- Everything uses `svh`, so the iOS address bar cannot resize the scene
  mid-timeline.

---

## Non-negotiables

1. Nothing on the page may be invented. If it is not published by the club, it
   is absent or explicitly marked unavailable. A photograph never migrates to a
   match it did not come from.
2. The palette stays the three official colours. No fourth brand colour.
3. One theme, one deliberate light band. No section-level inversion.
4. One WebGL canvas. One coherent arena. It must keep a narrative function.
5. Exactly two pinned experiences. Nothing else pins.
6. The opening must remain a single continuous transformation. Never cut it
   into a hero plus a separate match centre.
7. The crest is never redrawn, recoloured outside the manual's monochrome
   variants, stretched or partially used.
8. Competition motion and community motion stay different grammars.
9. All user-facing copy stays in Brazilian Portuguese.
10. Every timeline must reverse, and every scene must clean up after itself.
11. The entrance hands over to the hero. It must never simply fade out, and it
    must never be able to trap the page if a request hangs.
12. The background film is background. It stays muted, controlless, tinted,
    softened, paused off screen, and absent under reduced motion.
13. The header is integrated with the opening only while the opening is at the
    top. Once the page is scrolled it is solid, and it stays solid to the very
    bottom of the document.
14. Filtering the squad changes emphasis, never content: every name stays
    rendered, the block's height is locked, and the page below it never jumps.
15. Films and photographs open in place through the lightbox, but every one of
    them is a real link first, so the destination survives without scripting.
