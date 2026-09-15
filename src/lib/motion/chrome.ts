import { gsap, ScrollTrigger, refreshPriority } from './context'

/** Header state, mobile menu, back to top. Behaviour, not decoration. */
export function initChrome() {
  initHeader()
  initMobileMenu()
  initBackToTop()
  initSquadFilter()
}

function initHeader() {
  const header = document.querySelector<HTMLElement>('[data-site-header]')
  if (!header) return

  // A sentinel at the very top of the document, watched directly.
  //
  // A ScrollTrigger with an end would hand back control at the bottom of the
  // page and let the header go transparent there; an observer on a sentinel
  // only ever answers one question: is the top of the page still in view.
  const sentinel = document.createElement('div')
  sentinel.setAttribute('aria-hidden', 'true')
  sentinel.style.cssText =
    'position:absolute;top:0;left:0;width:1px;height:80px;pointer-events:none;visibility:hidden'
  document.body.prepend(sentinel)

  // While any part of the first 80px is still on screen the header stays
  // integrated with the opening; past that it is solid, and it stays solid all
  // the way to the end of the document.
  const observer = new IntersectionObserver(
    ([entry]) => header.setAttribute('data-stuck', String(!entry.isIntersecting)),
    { threshold: 0 },
  )
  observer.observe(sentinel)

  initActiveSection(header)
}

/**
 * Which section the reader is in.
 *
 * This deliberately does not use ScrollTrigger: one of these sections is
 * pinned, and a trigger measured around a pin spacer drifts out of step with
 * the section it is supposed to describe. An IntersectionObserver reads the
 * real element box every time, so pinning cannot desynchronise it.
 */
function initActiveSection(header: HTMLElement) {
  const links = Array.from(header.querySelectorAll<HTMLAnchorElement>('[data-nav-link]'))
  const entries = links
    .map((link) => {
      const id = link.getAttribute('href')
      const section = id?.startsWith('#') ? document.querySelector<HTMLElement>(id) : null
      return section ? { link, section } : null
    })
    .filter((entry): entry is { link: HTMLAnchorElement; section: HTMLElement } => entry !== null)

  if (!entries.length) return

  const visible = new Set<Element>()

  let last: (typeof entries)[number] | undefined

  const mark = () => {
    // The first section in document order that crosses the reading band wins,
    // so a long pinned section never loses to the one arriving behind it.
    // Sections that are not in the navigation still sit between the ones that
    // are, so the last match is held rather than clearing the whole bar.
    const current = entries.find((entry) => visible.has(entry.section)) ?? last
    last = current
    for (const entry of entries) {
      const isCurrent = entry === current
      entry.link.setAttribute('aria-current', isCurrent ? 'true' : 'false')
      entry.link.style.color = isCurrent ? '#fff' : ''
    }
  }

  const observer = new IntersectionObserver(
    (records) => {
      for (const record of records) {
        if (record.isIntersecting) visible.add(record.target)
        else visible.delete(record.target)
      }
      mark()
    },
    // A thin band across the middle of the viewport: the line the reader reads.
    { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
  )

  for (const entry of entries) observer.observe(entry.section)
}

function initMobileMenu() {
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]')
  const menu = document.querySelector<HTMLElement>('[data-mobile-menu]')
  if (!toggle || !menu) return

  const setOpen = (open: boolean) => {
    toggle.setAttribute('aria-expanded', String(open))
    menu.setAttribute('data-open', String(open))
    toggle.querySelector('.sr-only')!.textContent = open ? 'Fechar menu' : 'Abrir menu'
  }

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true')
  })

  menu.querySelectorAll('[data-mobile-link]').forEach((link) => {
    link.addEventListener('click', () => setOpen(false))
  })

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false)
      toggle.focus()
    }
  })
}

function initBackToTop() {
  const control = document.querySelector<HTMLButtonElement>('[data-back-to-top]')
  const arena = document.querySelector<HTMLElement>('[data-scene="arena"]')
  const curtain = document.querySelector<HTMLElement>('[data-topo-curtain]')
  if (!control) return

  control.hidden = false

  ScrollTrigger.create({
    trigger: arena ?? document.body,
    start: 'bottom top+=120',
    end: 'max',
    refreshPriority: refreshPriority.chrome,
    onToggle: (self) => control.setAttribute('data-visible', String(self.isActive)),
  })

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  control.addEventListener('click', () => {
    if (reduce || !curtain) {
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
      return
    }
    if (curtain.dataset.busy === 'true') return
    playReturn(curtain)
  })
}

/**
 * Close the curtain over the page through the arc, jump to the top behind it,
 * then open it again. Identical grammar to the loader handover, reversed.
 */
function playReturn(curtain: HTMLElement) {
  const crest = curtain.querySelector<HTMLElement>('.topo-curtain__crest')
  curtain.dataset.busy = 'true'
  curtain.dataset.active = 'true'

  gsap
    .timeline({
      onComplete: () => {
        curtain.removeAttribute('data-active')
        curtain.removeAttribute('data-busy')
        gsap.set(curtain, { clearProps: 'clipPath' })
      },
    })
    // Close: the arc rises from the bottom, the way the loader's opened upward.
    .fromTo(
      curtain,
      { clipPath: 'ellipse(150% 0% at 50% 100%)' },
      { clipPath: 'ellipse(150% 150% at 50% 50%)', duration: 0.62, ease: 'expo.inOut' },
    )
    .fromTo(
      crest,
      { autoAlpha: 0, scale: 1.18 },
      { autoAlpha: 1, scale: 1, duration: 0.42, ease: 'power2.out' },
      '-=0.34',
    )
    // The page is returned while it cannot be seen, so there is no long scroll.
    .add(() => {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
      ScrollTrigger.refresh()
    })
    .to(crest, { autoAlpha: 0, scale: 0.94, duration: 0.34, ease: 'power2.in' }, '+=0.14')
    // Open: the same upward arc the entrance finishes on.
    .to(
      curtain,
      { clipPath: 'ellipse(150% 0% at 50% 0%)', duration: 0.78, ease: 'expo.inOut' },
      '-=0.2',
    )
}

/**
 * The roster filter is the directed interaction of the squad section: choosing
 * a position dims every other group rather than removing it.
 *
 * Nothing is added to or taken out of the list, so its height never changes and
 * the page below it never jumps. The filter is a change of emphasis, not a
 * change of content, and every name stays readable and selectable throughout.
 */
function initSquadFilter() {
  const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-squad-filter]'))
  const groups = Array.from(document.querySelectorAll<HTMLElement>('[data-squad-group]'))
  const list = document.querySelector<HTMLElement>('[data-squad-list]')
  if (!buttons.length || !groups.length) return

  // Hold the natural height once, so a later reflow cannot shrink the block.
  if (list) {
    const lock = () => {
      list.style.minHeight = ''
      list.style.minHeight = `${Math.ceil(list.getBoundingClientRect().height)}px`
    }
    lock()
    let resizeTimer = 0
    window.addEventListener(
      'resize',
      () => {
        window.clearTimeout(resizeTimer)
        resizeTimer = window.setTimeout(lock, 180)
      },
      { passive: true },
    )
  }

  const apply = (value: string) => {
    buttons.forEach((button) =>
      button.setAttribute('aria-pressed', String(button.dataset.squadFilter === value)),
    )
    groups.forEach((group) => {
      const highlighted = value === 'todos' || group.dataset.squadGroup === value
      group.setAttribute('data-dimmed', String(!highlighted))
    })
  }

  buttons.forEach((button) => {
    button.addEventListener('click', () => apply(button.dataset.squadFilter ?? 'todos'))
  })
}
