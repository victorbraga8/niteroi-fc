import { gsap, ScrollTrigger, refreshPriority } from './context'
import { motion } from '../../config/experience'

/**
 * CORE SCENE 02
 *
 * Vertical scroll drives a horizontal traverse of the season. The pan is a
 * plain linear tween, as required for scroll position and horizontal position
 * to stay in step, and the section is exactly as tall as the traverse needs.
 *
 * A focus band in the middle of the viewport marks whichever round is being
 * looked at, so crossing the campaign feels like crossing rounds rather than
 * sliding a carousel.
 */
export function initSeasonJourney(mm: gsap.MatchMedia) {
  const section = document.querySelector<HTMLElement>('[data-scene="journey"]')
  if (!section) return

  const viewport = section.querySelector<HTMLElement>('[data-journey-viewport]')
  const track = section.querySelector<HTMLElement>('[data-journey-track]')
  if (!viewport || !track) return

  // Small screens keep the vertical rail. Rounds reveal as they arrive; the
  // trajectory is read downward instead of sideways.
  mm.add('(max-width: 1023.98px) and (prefers-reduced-motion: no-preference)', () => {
    const rounds = gsap.utils.toArray<HTMLElement>('[data-journey-round]', section)
    const batch = ScrollTrigger.batch(rounds, {
      start: 'top 88%',
      onEnter: (items) =>
        gsap.to(items, {
          autoAlpha: 1,
          y: 0,
          duration: motion.duration.base,
          stagger: 0.07,
          ease: motion.ease.enter,
          overwrite: true,
        }),
    })
    gsap.set(rounds, { autoAlpha: 0, y: 26 })

    return () => {
      batch.forEach((trigger) => trigger.kill())
      gsap.set(rounds, { clearProps: 'all' })
    }
  })

  mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth)

    const pan = gsap.to(track, {
      x: () => -distance(),
      ease: 'none', // required: keeps scroll and horizontal position 1:1
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${distance() + window.innerHeight * 0.4}`,
        pin: viewport,
        scrub: motion.scrub.journey,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        refreshPriority: refreshPriority.journey,
      },
    })

    // Which round is currently under the reading axis.
    const rounds = gsap.utils.toArray<HTMLElement>('[data-journey-round]', section)
    const focusTriggers = rounds.map((round) =>
      ScrollTrigger.create({
        trigger: round,
        containerAnimation: pan,
        start: 'left 62%',
        end: 'right 38%',
        refreshPriority: refreshPriority.journey,
        onToggle: (self) => round.setAttribute('data-focus', String(self.isActive)),
      }),
    )

    // ---- Chevrons ---------------------------------------------------------
    // The traverse is driven by page scroll, so stepping through it means
    // scrolling the page by the distance one screen of rounds occupies. That
    // keeps one source of truth: there is no second position to fall out of
    // sync with the scrub.
    const prev = section.querySelector<HTMLButtonElement>('[data-journey-prev]')
    const next = section.querySelector<HTMLButtonElement>('[data-journey-next]')
    const trigger = pan.scrollTrigger

    const stepSize = () => {
      const cell = track.querySelector<HTMLElement>('.journey-cell')
      const width = cell ? cell.getBoundingClientRect().width + 20 : 340
      // Move about one viewport of cards, snapped to whole cards.
      const perScreen = Math.max(1, Math.floor((window.innerWidth * 0.8) / width))
      return width * perScreen
    }

    const syncButtons = () => {
      if (!trigger || !prev || !next) return
      const { start, end } = trigger
      const y = window.scrollY
      prev.disabled = y <= start + 2
      next.disabled = y >= end - 2
    }

    const step = (direction: 1 | -1) => {
      if (!trigger) return
      const travel = distance() || 1
      // Scroll distance per pixel of horizontal travel.
      const ratio = (trigger.end - trigger.start) / travel
      const target = gsap.utils.clamp(
        trigger.start,
        trigger.end,
        window.scrollY + direction * stepSize() * ratio,
      )
      window.scrollTo({ top: target, behavior: 'smooth' })
    }

    const onPrev = () => step(-1)
    const onNext = () => step(1)
    prev?.addEventListener('click', onPrev)
    next?.addEventListener('click', onNext)

    const buttonSync = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: () => `+=${distance() + window.innerHeight * 0.4}`,
      refreshPriority: refreshPriority.journey,
      onUpdate: syncButtons,
      onToggle: syncButtons,
    })
    syncButtons()

    return () => {
      prev?.removeEventListener('click', onPrev)
      next?.removeEventListener('click', onNext)
      buttonSync.kill()
      focusTriggers.forEach((t) => t.kill())
      pan.scrollTrigger?.kill()
      pan.kill()
      gsap.set([track, viewport], { clearProps: 'all' })
      rounds.forEach((round) => round.removeAttribute('data-focus'))
    }
  })
}
