import { gsap, ScrollTrigger } from './context'

/**
 * The entrance, and the handover into the opening scene.
 *
 * Progress is read from real work: fonts resolving, the images the opening
 * scene actually needs, and the hero film reaching playback. A slow tail keeps
 * the counter moving while the network is quiet, so the number never freezes
 * and never lies about being finished.
 *
 * At 100% the loader crest is matched onto the crest that lives behind the
 * hero, using the measured difference between the two, and the curtain opens
 * through the same arc the rest of the page is built from. The loader does not
 * vanish: it turns into the background.
 */

export interface PreloaderResult {
  /** Resolves when the opening scene is free to start its own entrance. */
  ready: Promise<void>
}

const CURTAIN_DONE = 'preloader:done'

/**
 * How long the entrance is held at minimum.
 *
 * On a warm cache there is genuinely nothing to wait for, and a counter that
 * flicks from 0 to 100 in one frame reads as a glitch rather than as an
 * entrance. The floor gives the moment time to be read; the ceiling below makes
 * sure a slow network is never held back by it.
 */
const MIN_ENTRANCE = 2100

/**
 * @param gates Work that must land before the curtain opens, beyond the page
 *   load itself. Each one also counts toward the visible progress. They are
 *   expected to settle on their own; the hard stop below is the last resort.
 */
export function initPreloader(gates: Promise<unknown>[] = []): PreloaderResult {
  const root = document.querySelector<HTMLElement>('[data-preloader]')
  const heroCrest = document.querySelector<HTMLElement>('[data-arena-crest]')

  if (!root) return { ready: Promise.resolve() }

  const crest = root.querySelector<HTMLElement>('[data-preloader-crest]')!
  const countEl = root.querySelector<HTMLElement>('[data-preloader-count]')!
  const arc = root.querySelector<SVGPathElement>('[data-preloader-arc]')!

  document.documentElement.setAttribute('data-loading', 'true')

  const state = { value: 0 }
  const render = () => {
    const shown = Math.min(100, Math.round(state.value))
    countEl.textContent = String(shown).padStart(2, '0')
    arc.style.strokeDashoffset = String(1 - shown / 100)
  }
  render()

  const ready = new Promise<void>((resolve) => {
    // ---- Real progress ---------------------------------------------------
    const assets = Array.from(
      document.querySelectorAll<HTMLImageElement>('[data-arena-crest] img, [data-hero-poster] img'),
    )
    const jobs: Promise<unknown>[] = [
      document.fonts?.ready ?? Promise.resolve(),
      ...assets.map(
        (img) =>
          img.complete
            ? Promise.resolve()
            : new Promise((done) => {
                img.addEventListener('load', done, { once: true })
                img.addEventListener('error', done, { once: true })
              }),
      ),
      ...gates,
    ]

    let settled = 0
    const step = 100 / (jobs.length + 1)
    const advance = () => {
      settled += 1
      gsap.to(state, {
        value: Math.min(92, settled * step),
        duration: 0.5,
        ease: 'power2.out',
        onUpdate: render,
        overwrite: 'auto',
      })
    }
    jobs.forEach((job) => Promise.resolve(job).then(advance, advance))

    // A slow drift so the counter keeps moving between real events, and a hard
    // ceiling so it can never claim to be finished before the work is.
    const drift = gsap.to(state, {
      value: 88,
      duration: 2.4,
      ease: 'power1.out',
      onUpdate: render,
    })

    let closed = false
    const finish = () => {
      if (closed) return
      closed = true
      drift.kill()
      gsap.killTweensOf(state)
      gsap
        .timeline({ defaults: { ease: 'power2.inOut' } })
        .to(state, { value: 100, duration: 0.7, onUpdate: render })
        .add(() => handover(root, crest, heroCrest, resolve), '+=0.28')
    }

    const start = performance.now()
    const whenLoaded = () => {
      const elapsed = performance.now() - start
      window.setTimeout(finish, Math.max(0, MIN_ENTRANCE - elapsed))
    }

    const pageLoaded =
      document.readyState === 'complete'
        ? Promise.resolve()
        : new Promise((done) => window.addEventListener('load', done, { once: true }))

    // The curtain waits for the page and for every gate, so 100% means the
    // opening is genuinely ready to be watched.
    Promise.all([pageLoaded, ...gates]).then(whenLoaded, whenLoaded)

    // Nothing may hold the page hostage if a request hangs.
    window.setTimeout(finish, 7000)
  })

  return { ready }
}

/**
 * Move the loader crest onto the hero crest, then open the curtain.
 * The two are measured rather than guessed, so the match holds at any viewport.
 */
function handover(
  root: HTMLElement,
  crest: HTMLElement,
  heroCrest: HTMLElement | null,
  resolve: () => void,
) {
  const timeline = gsap.timeline({
    onComplete: () => {
      root.setAttribute('data-done', 'true')
      document.documentElement.removeAttribute('data-loading')
      root.remove()
      ScrollTrigger.refresh()
      resolve()
      document.dispatchEvent(new CustomEvent(CURTAIN_DONE))
    },
  })

  timeline.to(root.querySelector('.preloader__meter'), {
    autoAlpha: 0,
    y: 12,
    duration: 0.32,
    ease: 'power2.in',
  })

  const target = heroCrest?.querySelector('img')
  if (target) {
    const from = crest.getBoundingClientRect()
    const to = target.getBoundingClientRect()
    timeline.to(
      crest,
      {
        x: to.left + to.width / 2 - (from.left + from.width / 2),
        y: to.top + to.height / 2 - (from.top + from.height / 2),
        scale: to.width / from.width,
        duration: 1.05,
        ease: 'expo.inOut',
      },
      '-=0.12',
    )
  }

  // The curtain opens through the MAC arc, not through a fade.
  timeline
    .to(
      root,
      {
        clipPath: 'ellipse(150% 0% at 50% 0%)',
        duration: 0.95,
        ease: 'expo.inOut',
      },
      '-=0.62',
    )
    .to(crest, { autoAlpha: 0, duration: 0.3, ease: 'power2.out' }, '-=0.5')
}

export { CURTAIN_DONE }
