import { gsap } from './context'
import { heroFilm } from '../../data/videos'

/**
 * The opening background, running before the page is ever seen.
 *
 * The player is mounted at once, behind the curtain, and reports back when it
 * is actually playing. The entrance waits on that report, so the moment the
 * counter reaches 100% and the curtain opens, the film is already moving: the
 * visitor never watches a still photograph turn into a video.
 *
 * The player is paused whenever the opening leaves the viewport or the tab is
 * hidden, so nothing plays where nobody is looking.
 */

/** Once the embed has loaded, assume playback rather than wait forever. */
const LOAD_GRACE = 2200
/** Nothing about the film may hold the entrance longer than this. */
const HARD_CAP = 5000

export interface HeroFilmHandle {
  /** Resolves when the film is running, or when it is settled that it will not run. */
  playing: Promise<void>
  /** Fade the opening background up. Called as the curtain opens. */
  reveal(): void
}

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

const settled: HeroFilmHandle = { playing: Promise.resolve(), reveal: () => {} }

export function initHeroFilm(): HeroFilmHandle {
  const film = document.querySelector<HTMLElement>('[data-hero-film]')
  if (!film) return settled

  const frame = film.querySelector<HTMLElement>('[data-hero-frame]')
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Reduced motion keeps the still, and the still is already part of the
  // composition: there is nothing to wait for.
  if (reduce) {
    gsap.set(film, { autoAlpha: 1 })
    return settled
  }

  const reveal = () => {
    gsap.to(film, { autoAlpha: 1, duration: 1.4, ease: 'power2.out' })
  }

  if (!frame || connectionIsFrugal()) {
    return { playing: Promise.resolve(), reveal }
  }

  let player: HTMLIFrameElement | null = null

  const command = (func: 'playVideo' | 'pauseVideo') => {
    player?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func, args: [] }), '*')
  }

  const playing = new Promise<void>((resolve) => {
    let done = false
    const finish = () => {
      if (done) return
      done = true
      window.clearTimeout(cap)
      window.removeEventListener('message', onMessage)
      resolve()
    }
    const cap = window.setTimeout(finish, HARD_CAP)

    // The embed reports its own state over postMessage once it is listening.
    // Both message shapes the IFrame API uses are accepted, and only messages
    // from this player are read.
    const onMessage = (event: MessageEvent) => {
      if (!/\byoutube(-nocookie)?\.com$/.test(new URL(event.origin).hostname)) return
      if (player && event.source !== player.contentWindow) return
      let data: unknown = event.data
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data)
        } catch {
          return
        }
      }
      const payload = data as { event?: string; info?: number | { playerState?: number } }
      const state =
        typeof payload?.info === 'number' ? payload.info : payload?.info?.playerState
      if (state === 1) finish()
    }
    window.addEventListener('message', onMessage)

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
      origin: window.location.origin,
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
    gsap.set(player, { autoAlpha: 0 })
    frame.appendChild(player)

    const embed = player
    embed.addEventListener(
      'load',
      () => {
        gsap.to(embed, { autoAlpha: 1, duration: 1.6, ease: 'power2.out' })

        // The IFrame API only starts reporting once it has been greeted, and
        // the greeting can land before the player is listening, so it repeats
        // until the first report arrives.
        const greet = window.setInterval(() => {
          if (done) return window.clearInterval(greet)
          embed.contentWindow?.postMessage(
            JSON.stringify({ event: 'listening', id: 1, channel: 'widget' }),
            '*',
          )
        }, 250)
        window.setTimeout(() => window.clearInterval(greet), LOAD_GRACE)

        // If the report never comes (autoplay refused, API blocked), stop
        // waiting on it rather than holding the entrance.
        window.setTimeout(finish, LOAD_GRACE)
      },
      { once: true },
    )
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

  return { playing, reveal }
}
