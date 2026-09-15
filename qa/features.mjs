import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const BASE = 'http://localhost:4399/'
const OUT = 'qa/features'
mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch({ channel: 'chrome' })
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await context.newPage()
const errors = []
page.on('pageerror', (e) => errors.push(e.message))
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))

await page.goto(BASE, { waitUntil: 'networkidle' })
await page.waitForTimeout(5200)

const at = async (sel) => {
  await page.locator(sel).first().scrollIntoViewIfNeeded()
  await page.waitForTimeout(900)
}

/* ---- header stays solid, including at the very bottom ---- */
const headerStates = {}
for (const [name, y] of [['top', 0], ['mid', 4000], ['bottom', 999999]]) {
  await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y)
  await page.waitForTimeout(800)
  headerStates[name] = await page.evaluate(() => ({
    stuck: document.querySelector('[data-site-header]').dataset.stuck,
    scrimOpacity: Number(
      getComputedStyle(document.querySelector('[data-header-scrim]')).opacity,
    ).toFixed(2),
  }))
}
console.log('HEADER:', JSON.stringify(headerStates))

/* ---- squad filter dims instead of hiding, and height is locked ---- */
await at('[data-squad-filter="goleiros"]')
const before = await page.evaluate(() => {
  const list = document.querySelector('[data-squad-list]')
  return {
    height: Math.round(list.getBoundingClientRect().height),
    minHeight: list.style.minHeight,
    names: document.querySelectorAll('[data-squad-name]').length,
  }
})
await page.click('[data-squad-filter="goleiros"]')
await page.waitForTimeout(700)
const after = await page.evaluate(() => {
  const list = document.querySelector('[data-squad-list]')
  const groups = [...document.querySelectorAll('[data-squad-group]')]
  return {
    height: Math.round(list.getBoundingClientRect().height),
    namesStillRendered: document.querySelectorAll('[data-squad-name]').length,
    hiddenGroups: groups.filter((g) => g.hidden).length,
    dimmed: groups.filter((g) => g.dataset.dimmed === 'true').length,
    highlighted: groups.filter((g) => g.dataset.dimmed === 'false').map((g) => g.dataset.squadGroup),
  }
})
console.log('SQUAD before:', JSON.stringify(before))
console.log('SQUAD after :', JSON.stringify(after), 'heightDelta:', after.height - before.height)
await page.screenshot({ path: `${OUT}/squad-filtered.png` })

/* ---- chevrons move the campaign ---- */
await at('[data-journey-next]')
const chevron = { before: await page.evaluate(() => Math.round(window.scrollY)) }
await page.click('[data-journey-next]')
await page.waitForTimeout(1400)
chevron.afterNext = await page.evaluate(() => Math.round(window.scrollY))
await page.click('[data-journey-prev]')
await page.waitForTimeout(1400)
chevron.afterPrev = await page.evaluate(() => Math.round(window.scrollY))
chevron.disabledStates = await page.evaluate(() => ({
  prev: document.querySelector('[data-journey-prev]').disabled,
  next: document.querySelector('[data-journey-next]').disabled,
}))
console.log('CHEVRONS:', JSON.stringify(chevron))

/* ---- lightbox opens for a film and for a photograph ---- */
await at('[data-lightbox="nittv"]')
await page.locator('[data-lightbox="nittv"]').first().click()
await page.waitForTimeout(1600)
const filmBox = await page.evaluate(() => {
  const box = document.querySelector('.glightbox-container')
  return {
    open: !!box && getComputedStyle(box).opacity !== '0',
    hasIframe: !!document.querySelector('.glightbox-container iframe'),
    title: (document.querySelector('.gslide.current') ?? document)
      .querySelector('.gslide-title')?.textContent?.trim() ?? null,
  }
})
console.log('LIGHTBOX film:', JSON.stringify(filmBox))
await page.screenshot({ path: `${OUT}/lightbox-film.png` })
await page.keyboard.press('Escape')
await page.waitForTimeout(700)

await at('[data-lightbox="campo"]')
await page.locator('[data-lightbox="campo"]').first().click()
await page.waitForTimeout(1400)
const photoBox = await page.evaluate(() => {
  const slide = document.querySelector('.gslide.current') ?? document
  return {
    open: !!document.querySelector('.glightbox-container'),
    hasImage: !!slide.querySelector('img'),
    title: slide.querySelector('.gslide-title')?.textContent?.trim() ?? null,
    desc: slide.querySelector('.gslide-desc')?.textContent?.trim() ?? null,
  }
})
console.log('LIGHTBOX photo:', JSON.stringify(photoBox))
await page.screenshot({ path: `${OUT}/lightbox-photo.png` })
await page.keyboard.press('Escape')
await page.waitForTimeout(600)

/* ---- back to top replays the entrance ---- */
await page.evaluate(() => window.scrollTo({ top: 9000, behavior: 'instant' }))
await page.waitForTimeout(900)
await page.click('[data-back-to-top]')
await page.waitForTimeout(500)
await page.screenshot({ path: `${OUT}/return-curtain.png` })
await page.waitForTimeout(2400)
const returned = await page.evaluate(() => ({
  scrollY: Math.round(window.scrollY),
  curtainActive: document.querySelector('[data-topo-curtain]')?.dataset.active ?? null,
}))
console.log('BACK TO TOP:', JSON.stringify(returned))

console.log('ERRORS:', errors.slice(0, 5))
await browser.close()
