import { gsap, ScrollTrigger } from './context'
import { motion } from '../../config/experience'

/**
 * The quiet layer. Batched so that everything arriving in the same moment
 * moves together instead of firing a separate tween per element, and used only
 * on the resting sections. The cinematic scenes have their own choreography.
 */
export function initReveals(mm: gsap.MatchMedia) {
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const targets = gsap.utils.toArray<HTMLElement>('[data-reveal]')
    if (!targets.length) return

    const triggers = ScrollTrigger.batch(targets, {
      start: 'top 86%',
      onEnter: (items) => {
        items.forEach((item) => item.classList.add('is-in'))
        gsap.fromTo(
          items,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: motion.duration.base,
            ease: motion.ease.enter,
            stagger: 0.06,
            overwrite: true,
            clearProps: 'transform',
          },
        )
      },
    })

    return () => {
      triggers.forEach((trigger) => trigger.kill())
      targets.forEach((item) => item.classList.add('is-in'))
      gsap.set(targets, { clearProps: 'all' })
    }
  })
}
