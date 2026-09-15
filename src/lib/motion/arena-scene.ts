import { gsap, refreshPriority } from './context'
import { createArena, type ArenaHandle } from '../three/arena'
import { motion } from '../../config/experience'

/**
 * CORE SCENE 01
 *
 * A single scrubbed timeline drives both the DOM layers and the WebGL camera,
 * so the space and the words are never describing different moments. Reversing
 * the scroll reverses the whole scene, including the arena.
 */
export function initArenaScene(mm: gsap.MatchMedia, ready: Promise<void> = Promise.resolve()) {
  const section = document.querySelector<HTMLElement>('[data-scene="arena"]')
  if (!section) return

  const canvas = section.querySelector<HTMLCanvasElement>('[data-arena-canvas]')
  const fallback = section.querySelector<HTMLElement>('[data-arena-fallback]')

  let arena: ArenaHandle | null = null

  const mountArena = (isMobile: boolean) => {
    if (!canvas) return
    arena = createArena(canvas, isMobile)
    if (arena) {
      fallback?.style.setProperty('opacity', '0')
      const onResize = () => arena?.resize()
      window.addEventListener('resize', onResize, { passive: true })
      window.addEventListener('orientationchange', onResize)
      return () => {
        window.removeEventListener('resize', onResize)
        window.removeEventListener('orientationchange', onResize)
        arena?.dispose()
        arena = null
        fallback?.style.removeProperty('opacity')
      }
    }
    return undefined
  }

  mm.add(
    {
      isDesktop: '(min-width: 1024px)',
      isMobile: '(max-width: 1023.98px)',
      reduceMotion: '(prefers-reduced-motion: reduce)',
    },
    (context) => {
      const { isMobile, reduceMotion } = context.conditions as {
        isDesktop: boolean
        isMobile: boolean
        reduceMotion: boolean
      }

      const disposeArena = mountArena(Boolean(isMobile))

      // Reduced motion keeps the composed frame and lets the three layers read
      // as a normal stacked sequence. No pin, no scrub, nothing hidden.
      if (reduceMotion) {
        arena?.setProgress(0.34)
        arena?.setActive(false)
        return () => {
          disposeArena?.()
        }
      }

      const abertura = section.querySelector<HTMLElement>('[data-arena-layer="abertura"]')!
      const numeros = section.querySelector<HTMLElement>('[data-arena-layer="numeros"]')!
      const partida = section.querySelector<HTMLElement>('[data-arena-layer="partida"]')!
      const crest = section.querySelector<HTMLElement>('[data-arena-crest]')
      const words = gsap.utils.toArray<HTMLElement>('[data-arena-word]', section)
      const meta = section.querySelector<HTMLElement>('[data-arena-meta]')
      const standfirst = section.querySelector<HTMLElement>('[data-arena-standfirst]')
      const numberItems = gsap.utils.toArray<HTMLElement>('[data-arena-number]', section)
      const matchLines = gsap.utils.toArray<HTMLElement>('[data-match-line]', partida)
      const matchBoard = partida.querySelector<HTMLElement>('[data-match-board]')

      gsap.set([numeros, partida], { autoAlpha: 0 })

      // ---- Opening entrance ------------------------------------------------
      // The name of the club arrives from under a mask, the way a broadcast
      // lower third does. Not a fade, and not on every element of the page.
      // Held until the curtain opens, so the opening plays to a visible screen.
      const intro = gsap.timeline({ paused: true, defaults: { ease: motion.ease.athletic } })
      intro
        .from(words, { yPercent: 112, duration: 1.05, stagger: 0.09 })
        .from(meta, { autoAlpha: 0, y: 14, duration: 0.6 }, 0.25)
        .from(standfirst, { autoAlpha: 0, y: 18, duration: 0.7 }, 0.45)

      // The crest is already in place: it was carried here by the loader.
      gsap.set(crest, { autoAlpha: 0.2 })
      ready.then(() => intro.play())

      // ---- The scrubbed transformation ------------------------------------
      const scene = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: motion.scrub.arena,
          refreshPriority: refreshPriority.arena,
          invalidateOnRefresh: true,
          onUpdate: (self) => arena?.setProgress(self.progress),
          onToggle: (self) => arena?.setActive(self.isActive),
        },
      })

      scene
        // Phase 2: the opening lifts away as the camera enters the arena.
        .addLabel('entrada', 0)
        .to(abertura, { yPercent: -18, autoAlpha: 0, duration: 0.26 }, 0.06)
        .to(crest, { scale: 1.6, autoAlpha: 0.07, duration: 0.34 }, 0)

        // Phase 3: the real campaign numbers arrive with weight, laterally,
        // because acceleration is the movement this domain actually owns.
        .addLabel('numeros', 0.28)
        .set(numeros, { autoAlpha: 1 }, 0.28)
        // A shorter travel on a narrow screen: touch scrolling is far more
        // likely to settle mid-tween than a mouse wheel, and a smaller offset
        // means a scroll that stops here still reads as centred rather than
        // sliding in from the side.
        .from(
          numberItems,
          { xPercent: isMobile ? 12 : 34, autoAlpha: 0, duration: 0.09, stagger: 0.028 },
          0.28,
        )
        .to(numeros, { autoAlpha: 0, xPercent: -4, duration: 0.12 }, 0.5)
        .set(numeros, { autoAlpha: 0 }, 0.62)

        // Phase 4 and 5: the arc rises behind, and the same space resolves
        // into the fixture. The two layers never share the frame: the numbers
        // are gone before the fixture arrives, so neither is read through the
        // other. The crest returns quietly as the stage marker.
        .addLabel('partida', 0.64)
        .set(partida, { autoAlpha: 1 }, 0.64)
        .fromTo(partida, { yPercent: 8 }, { yPercent: 0, duration: 0.26, ease: 'power2.out' }, 0.64)
        .from(matchLines, { autoAlpha: 0, y: 20, duration: 0.13, stagger: 0.035 }, 0.66)
        // Both ends of the wipe are stated explicitly: GSAP cannot interpolate
        // an inset() towards the computed `none`, so a from() here would leave
        // the board clipped away entirely.
        .fromTo(
          matchBoard,
          { clipPath: 'inset(0% 100% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.18, ease: 'power2.inOut' },
          0.67,
        )
        .to(crest, { autoAlpha: 0.16, scale: 1.15, duration: 0.22 }, 0.7)

      return () => {
        intro.kill()
        scene.kill()
        disposeArena?.()
      }
    },
  )
}
