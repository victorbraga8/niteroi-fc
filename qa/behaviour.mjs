import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const BASE = 'http://localhost:4399/'
const OUT = 'qa/behaviour'
mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch({ channel: 'chrome' })
const log = (...args) => console.log(...args)

/* ---------------------------------------------------------------- 1. reduced motion */
{
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1800)

  const state = await page.evaluate(() => {
    const layers = [...document.querySelectorAll('[data-arena-layer]')].map((el) => {
      const s = getComputedStyle(el)
      return {
        layer: el.dataset.arenaLayer,
        opacity: Number(s.opacity).toFixed(2),
        visibility: s.visibility,
        height: Math.round(el.getBoundingClientRect().height),
      }
    })
    const hidden = [...document.querySelectorAll('[data-reveal]')].filter(
      (el) => Number(getComputedStyle(el).opacity) < 0.9,
    ).length
    return {
      motionReadyClass: document.documentElement.classList.contains('motion-ready'),
      layers,
      revealsHidden: hidden,
      pageHeight: document.documentElement.scrollHeight,
      hasPinnedSpacer: !!document.querySelector('.pin-spacer'),
    }
  })
  log('REDUCED MOTION:', JSON.stringify(state))
  await page.screenshot({ path: `${OUT}/reduced-top.png` })
  await page.evaluate(() => window.scrollTo(0, 1500))
  await page.waitForTimeout(800)
  await page.screenshot({ path: `${OUT}/reduced-scrolled.png` })
  log('  pageerrors:', errors)
  await context.close()
}

/* ---------------------------------------------------------------- 2. no scripting */
{
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    javaScriptEnabled: false,
  })
  const page = await context.newPage()
  await page.goto(BASE, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(1200)
  const state = await page.evaluate(() => 1).catch(() => null)
  await page.screenshot({ path: `${OUT}/nojs-top.png`, fullPage: false })
  log('NO SCRIPTING: screenshot captured', state)
  await context.close()
}

/* ---------------------------------------------------------------- 3. interaction */
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
  const page = await context.newPage()
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500)

  // mobile menu
  await page.click('[data-menu-toggle]')
  await page.waitForTimeout(400)
  const menuOpen = await page.evaluate(() => ({
    expanded: document.querySelector('[data-menu-toggle]').getAttribute('aria-expanded'),
    visible: getComputedStyle(document.querySelector('[data-mobile-menu]')).display,
  }))
  log('MOBILE MENU open:', JSON.stringify(menuOpen))
  await page.screenshot({ path: `${OUT}/menu-open.png` })
  await page.keyboard.press('Escape')
  await page.waitForTimeout(300)
  log(
    'MOBILE MENU after Escape:',
    await page.evaluate(() => document.querySelector('[data-menu-toggle]').getAttribute('aria-expanded')),
  )
  await context.close()
}

/* ---------------------------------------------------------------- 4. squad filter */
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1200)
  await page.locator('[data-squad-filter="goleiros"]').scrollIntoViewIfNeeded()
  await page.waitForTimeout(700)
  await page.click('[data-squad-filter="goleiros"]')
  await page.waitForTimeout(700)
  const filtered = await page.evaluate(() => ({
    pressed: [...document.querySelectorAll('[data-squad-filter]')]
      .filter((b) => b.getAttribute('aria-pressed') === 'true')
      .map((b) => b.dataset.squadFilter),
    visibleGroups: [...document.querySelectorAll('[data-squad-group]')]
      .filter((g) => !g.hidden)
      .map((g) => g.dataset.squadGroup),
  }))
  log('SQUAD FILTER:', JSON.stringify(filtered))
  await page.screenshot({ path: `${OUT}/squad-filtered.png` })
  await context.close()
}

/* ---------------------------------------------------------------- 5. reverse scroll */
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1200)
  for (const y of [900, 2600, 6000, 9000, 6000, 2600, 900, 0]) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y)
    await page.waitForTimeout(500)
  }
  await page.waitForTimeout(1600)
  const back = await page.evaluate(() => {
    const abertura = document.querySelector('[data-arena-layer="abertura"]')
    const s = getComputedStyle(abertura)
    return {
      scrollY: window.scrollY,
      aberturaOpacity: Number(s.opacity).toFixed(2),
      aberturaVisibility: s.visibility,
      headerStuck: document.querySelector('[data-site-header]').dataset.stuck,
      backToTop: document.querySelector('[data-back-to-top]').dataset.visible,
    }
  })
  log('REVERSE SCROLL back at top:', JSON.stringify(back), 'errors:', errors)
  await page.screenshot({ path: `${OUT}/after-reverse.png` })
  await context.close()
}

/* ---------------------------------------------------------------- 6. accessibility */
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1200)

  const a11y = await page.evaluate(() => {
    const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => ({
      level: Number(h.tagName[1]),
      text: h.textContent.trim().replace(/\s+/g, ' ').slice(0, 48),
    }))
    const order = []
    let prev = 0
    for (const h of headings) {
      if (prev && h.level > prev + 1) order.push(`skip ${prev} -> ${h.level}: ${h.text}`)
      prev = h.level
    }
    const imagesWithoutAlt = [...document.querySelectorAll('img')].filter(
      (i) => i.getAttribute('alt') === null,
    ).length
    const emptyLinks = [...document.querySelectorAll('a')].filter(
      (a) => !a.textContent.trim() && !a.getAttribute('aria-label') && !a.querySelector('img[alt]:not([alt=""])'),
    ).length
    const smallTargets = [...document.querySelectorAll('a,button')]
      .map((el) => ({ el, r: el.getBoundingClientRect() }))
      .filter(({ r }) => r.width > 0 && r.height > 0 && r.height < 24).length
    const emDashes = document.body.innerText.includes('—') || document.body.innerText.includes('–')
    return {
      h1Count: headings.filter((h) => h.level === 1).length,
      headingOrderProblems: order,
      imagesWithoutAlt,
      emptyLinks,
      shortTargets: smallTargets,
      emDashesPresent: emDashes,
      lang: document.documentElement.lang,
      title: document.title,
    }
  })
  log('A11Y:', JSON.stringify(a11y, null, 1))

  // Keyboard: skip link first, then focus ring visible.
  await page.keyboard.press('Tab')
  const firstFocus = await page.evaluate(() => {
    const el = document.activeElement
    return { tag: el.tagName, text: el.textContent.trim().slice(0, 40), outline: getComputedStyle(el).outlineWidth }
  })
  log('FIRST TAB STOP:', JSON.stringify(firstFocus))
  await page.screenshot({ path: `${OUT}/focus-skiplink.png`, clip: { x: 0, y: 0, width: 600, height: 140 } })
  await context.close()
}

await browser.close()
