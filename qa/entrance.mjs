import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const BASE = 'http://localhost:4399/'
const OUT = 'qa/entrance'
mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch({ channel: 'chrome' })

for (const vp of [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844, mobile: true },
]) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    isMobile: Boolean(vp.mobile),
    hasTouch: Boolean(vp.mobile),
  })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))

  await page.goto(BASE, { waitUntil: 'domcontentloaded' })

  // Sample the entrance at close intervals.
  const samples = [120, 400, 700, 1000, 1400, 1900, 2400, 3000, 3800, 5000, 6500]
  let previous = 0
  for (const [i, at] of samples.entries()) {
    await page.waitForTimeout(at - previous)
    previous = at
    await page.screenshot({ path: `${OUT}/${vp.name}-${String(i).padStart(2, '0')}-${at}ms.png` })
  }

  const state = await page.evaluate(() => {
    const pre = document.querySelector('[data-preloader]')
    const film = document.querySelector('[data-hero-film]')
    const iframe = document.querySelector('[data-hero-frame] iframe')
    const crest = document.querySelector('[data-arena-crest] img')
    return {
      preloaderStillInDom: !!pre,
      loadingAttr: document.documentElement.getAttribute('data-loading'),
      filmOpacity: film ? Number(getComputedStyle(film).opacity).toFixed(2) : null,
      iframePresent: !!iframe,
      iframeSrc: iframe ? iframe.src.slice(0, 72) : null,
      heroCrestOpacity: crest ? Number(getComputedStyle(crest.parentElement).opacity).toFixed(2) : null,
      bodyOverflow: document.documentElement.scrollWidth,
      docWidth: document.documentElement.clientWidth,
    }
  })
  console.log(vp.name, JSON.stringify(state))
  console.log(vp.name, 'errors:', errors.slice(0, 4))
  await context.close()
}

await browser.close()
