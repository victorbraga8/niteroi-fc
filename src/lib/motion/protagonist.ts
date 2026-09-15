import { gsap, ScrollTrigger, refreshPriority } from './context'

/**
 * The protagonist introduction. Name and photograph travel in opposite
 * directions as the block arrives, and the photograph is revealed through the
 * arc rather than faded in, so the entrance belongs to the same shape language
 * as the crest and the arena.
 */
export function initProtagonist(mm: gsap.MatchMedia) {
  const block = document.querySelector<HTMLElement>('[data-protagonist]')
  if (!block) return

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const name = block.querySelector<HTMLElement>('[data-protagonist-name]')
    const portrait = block.querySelector<HTMLElement>('[data-protagonist-portrait]')

    const tl = gsap.timeline({
      defaults: { ease: 'expo.out' },
      scrollTrigger: {
        trigger: block,
        start: 'top 78%',
        refreshPriority: refreshPriority.content,
        toggleActions: 'play none none reverse',
      },
    })

    tl.from(portrait, {
      clipPath: 'ellipse(150% 0% at 50% 100%)',
      yPercent: 8,
      duration: 1.1,
    }).from(name, { xPercent: -12, autoAlpha: 0, duration: 0.9 }, 0.12)

    // A short parallax split while the block crosses the viewport: the number
    // of layers stays low, the displacement stays small.
    const drift = gsap.to(portrait, {
      yPercent: -7,
      ease: 'none',
      scrollTrigger: {
        trigger: block,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        refreshPriority: refreshPriority.content,
      },
    })

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
      drift.scrollTrigger?.kill()
      drift.kill()
      gsap.set([name, portrait].filter(Boolean) as HTMLElement[], { clearProps: 'all' })
    }
  })
}

export { ScrollTrigger }
