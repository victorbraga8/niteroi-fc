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

  // The film mounts first and runs behind the curtain; the entrance waits for
  // it, so the counter only reaches 100% once the opening is already moving.
  const film = initHeroFilm()
  const { ready } = initPreloader([film.playing])
  ready.then(film.reveal)

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
