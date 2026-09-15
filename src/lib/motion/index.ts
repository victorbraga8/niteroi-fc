import { gsap, scheduleRefreshes } from './context'
import { initArenaScene } from './arena-scene'
import { initSeasonJourney } from './journey'
import { initReveals } from './reveal'
import { initChrome } from './chrome'
import { initProtagonist } from './protagonist'
import { initPreloader } from './preloader'
import { initHeroFilm } from './hero-film'
import { initLightbox } from './lightbox'

/**
 * Single entry point for every piece of choreography on the page.
 *
 * Scenes are registered in document order so ScrollTrigger refreshes them in
 * the order they appear, which is what keeps pin spacing correct. One shared
 * matchMedia owns every breakpoint and reduced-motion branch, so switching
 * between them reverts the previous set of animations automatically.
 */
export function initMotion() {
  const mm = gsap.matchMedia()

  // The entrance runs first and hands the opening scene a signal, so the hero
  // does not start playing to a covered screen.
  const { ready } = initPreloader()
  initHeroFilm(ready)

  initArenaScene(mm, ready) // 1. opening scene
  initSeasonJourney(mm) // 2. the campaign
  initProtagonist(mm) // 3. the protagonist
  initReveals(mm) // everything resting in between
  initChrome() // header, menu, filter, back to top
  initLightbox() // films and photographs open in place

  scheduleRefreshes()

  window.addEventListener(
    'pagehide',
    () => {
      mm.revert()
    },
    { once: true },
  )
}
