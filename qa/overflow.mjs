import { chromium } from 'playwright'

const browser = await chromium.launch({ channel: 'chrome' })
for (const width of [390, 360]) {
  const context = await browser.newContext({
    viewport: { width, height: 844 },
    isMobile: true,
    hasTouch: true,
  })
  const page = await context.newPage()
  await page.goto('http://localhost:4399/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500)

  const result = await page.evaluate(() => {
    const docWidth = document.documentElement.clientWidth
    const offenders = []
    const walk = (el) => {
      for (const child of el.children) {
        const r = child.getBoundingClientRect()
        if (r.width === 0 && r.height === 0) {
          walk(child)
          continue
        }
        const style = getComputedStyle(child)
        const clipped =
          style.overflowX === 'hidden' || style.overflowX === 'clip' || style.overflowX === 'auto'
        if (r.right > docWidth + 0.5) {
          offenders.push({
            tag: child.tagName.toLowerCase(),
            id: child.id,
            cls: (child.className || '').toString().slice(0, 80),
            right: Math.round(r.right),
            clipsOwnChildren: clipped,
            pos: style.position,
          })
        }
        if (!clipped && style.position !== 'fixed') walk(child)
      }
    }
    walk(document.body)
    return { docWidth, scrollWidth: document.documentElement.scrollWidth, offenders }
  })
  console.log(width, JSON.stringify(result, null, 1))
  await context.close()
}
await browser.close()
