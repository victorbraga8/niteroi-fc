import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const BASE = process.env.QA_URL ?? 'http://localhost:4399/'
const OUT = process.env.QA_OUT ?? 'qa/shots'
mkdirSync(OUT, { recursive: true })

const viewports = [
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'desktop-1366', width: 1366, height: 768 },
  { name: 'mobile-390', width: 390, height: 844, mobile: true },
  { name: 'mobile-360', width: 360, height: 800, mobile: true },
]

// Scroll fractions of the total page height worth looking at.
const stops = [0, 0.03, 0.05, 0.07, 0.1, 0.15, 0.22, 0.3, 0.42, 0.55, 0.66, 0.78, 0.9, 1]

const browser = await chromium.launch({
  channel: 'chrome',
  args: ['--force-color-profile=srgb', '--disable-lcd-text'],
})

const problems = []

for (const vp of viewports) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
    isMobile: Boolean(vp.mobile),
    hasTouch: Boolean(vp.mobile),
    locale: 'pt-BR',
  })
  const page = await context.newPage()

  const consoleErrors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text())
  })
  page.on('pageerror', (err) => consoleErrors.push(`pageerror: ${err.message}`))

  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.waitForTimeout(5200) // let the entrance finish

  const totalHeight = await page.evaluate(() => document.documentElement.scrollHeight)

  for (const [i, fraction] of stops.entries()) {
    const y = Math.round((totalHeight - vp.height) * fraction)
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y)
    await page.waitForTimeout(1600)
    await page.screenshot({
      path: `${OUT}/${vp.name}-${String(i).padStart(2, '0')}.png`,
      animations: 'disabled',
    })
  }

  // Horizontal overflow audit at rest.
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await page.waitForTimeout(400)
  const overflow = await page.evaluate(() => {
    const docWidth = document.documentElement.clientWidth
    const offenders = []
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect()
      if (r.width === 0 || r.height === 0) continue
      if (r.right > docWidth + 2 || r.left < -2) {
        const style = getComputedStyle(el)
        if (style.position === 'fixed') continue
        offenders.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.className || '').toString().slice(0, 70),
          left: Math.round(r.left),
          right: Math.round(r.right),
        })
      }
    }
    return {
      docWidth,
      scrollWidth: document.documentElement.scrollWidth,
      bodyScrollWidth: document.body.scrollWidth,
      offenders: offenders.slice(0, 12),
    }
  })

  // Tiny-text audit: visible text rendered below 13px.
  const tinyText = await page.evaluate(() => {
    const found = new Map()
    for (const el of document.querySelectorAll('body *')) {
      if (!el.childNodes.length) continue
      const hasText = Array.from(el.childNodes).some(
        (n) => n.nodeType === 3 && n.textContent.trim().length > 1,
      )
      if (!hasText) continue
      const r = el.getBoundingClientRect()
      if (r.width === 0 || r.height === 0) continue
      const size = parseFloat(getComputedStyle(el).fontSize)
      if (size < 13) {
        const key = `${el.tagName}.${(el.className || '').toString().slice(0, 40)}|${size}`
        if (!found.has(key))
          found.set(key, { size, text: el.textContent.trim().slice(0, 50), cls: (el.className || '').toString().slice(0, 50) })
      }
    }
    return Array.from(found.values())
  })

  problems.push({ viewport: vp.name, totalHeight, overflow, tinyText, consoleErrors })
  await context.close()
}

await browser.close()
console.log(JSON.stringify(problems, null, 2))
