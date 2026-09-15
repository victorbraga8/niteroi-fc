import { gsap } from './context'
import { heroFilm } from '../../data/videos'

/**
 * Brings the opening background to life the moment the loader hands over.
 *
 * The still and the real footage arrive together at 100%, so the film is
 * already playing by the time the visitor sees the page.
 *
 * The player is paused whenever the opening leaves the viewport or the tab is
 * hidden, so nothing plays where nobody is looking.
 */

const START_DELAY = 0

interface Connection {
  saveData?: boolean
  effectiveType?: string
}

function connectionIsFrugal() {
  const connection = (navigator as Navigator & { connection?: Connection }).connection
  if (!connection) return false
  if (connection.saveData) return true
  return connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g'
}

export function initHeroFilm(ready: Promise<void>) {
  const film = document.querySelector<HTMLElement>('[data-hero-film]')
  if (!film) return

  const frame = film.querySelector<HTMLElement>('[data-hero-frame]')
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // The still is part of the composition either way.
  const reveal = () =>
    gsap.to(film, {
      autoAlpha: 1,
      duration: reduce ? 0 : 1.4,
      ease: 'power2.out',
    })

  if (reduce) {
    gsap.set(film, { autoAlpha: 1 })
    return
  }

  let started = false
  let player: HTMLIFrameElement | null = null

  const startFilm = () => {
    if (started || !frame || connectionIsFrugal()) return
    started = true

    const params = new URLSearchParams({
      autoplay: '1',
      mute: '1',
      loop: '1',
      playlist: heroFilm.id,
      controls: '0',
      modestbranding: '1',
      playsinline: '1',
      rel: '0',
      disablekb: '1',
      fs: '0',
      iv_load_policy: '3',
      cc_load_policy: '0',
      enablejsapi: '1',
      // Skip the opening seconds so the footage starts on the action.
      start: '6',
    })

    player = document.createElement('iframe')
    player.src = `https://www.youtube-nocookie.com/embed/${heroFilm.id}?${params.toString()}`
    player.title = `${heroFilm.subtitle}: ${heroFilm.title}`
    player.setAttribute('allow', 'autoplay; encrypted-media')
    player.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin')
    player.setAttribute('tabindex', '-1')
    player.setAttribute('aria-hidden', 'true')
    player.loading = 'lazy'
    gsap.set(player, { autoAlpha: 0 })
    frame.appendChild(player)

    player.addEventListener(
      'load',
      () => gsap.to(player, { autoAlpha: 1, duration: 1.6, ease: 'power2.out' }),
      { once: true },
    )
  }

  const command = (func: 'playVideo' | 'pauseVideo') => {
    player?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func, args: [] }), '*')
  }

  ready.then(() => {
    reveal()
    gsap.delayedCall(START_DELAY, startFilm)
  })

  // Only play while the opening is actually on screen.
  const observer = new IntersectionObserver(
    ([entry]) => command(entry.isIntersecting ? 'playVideo' : 'pauseVideo'),
    { threshold: 0.05 },
  )
  observer.observe(film)

  document.addEventListener('visibilitychange', () =>
    command(document.hidden ? 'pauseVideo' : 'playVideo'),
  )

  window.addEventListener(
    'pagehide',
    () => {
      observer.disconnect()
      player?.remove()
      player = null
    },
    { once: true },
  )
}
