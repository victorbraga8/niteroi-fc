import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }

/** True when the visitor has asked the interface to calm down. */
export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const isMobileViewport = () => window.matchMedia('(max-width: 1023.98px)').matches

/**
 * ScrollTriggers must be created in page order so their refresh order matches
 * the document, otherwise pin spacing is computed against stale layout. Each
 * scene declares where it sits.
 */
export const refreshPriority = {
  arena: -3,
  journey: -2,
  content: -1,
  chrome: 0,
} as const

/**
 * Layout changes that ScrollTrigger cannot see on its own: fonts swapping in
 * and images arriving late both move every trigger below them.
 */
export function scheduleRefreshes() {
  const refresh = () => ScrollTrigger.refresh()

  if (document.fonts?.ready) {
    document.fonts.ready.then(refresh).catch(() => {})
  }

  window.addEventListener('load', refresh, { once: true })
}
