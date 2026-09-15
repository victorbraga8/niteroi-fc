import { chromium } from 'playwright'
const browser = await chromium.launch({ channel: 'chrome' })
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage()
await page.goto('http://localhost:4399/', { waitUntil: 'networkidle' })
await page.waitForTimeout(1200)
const out = await page.evaluate(() => {
  const lum = (c) => { const [r,g,b]=c.map(v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4)}); return 0.2126*r+0.7152*g+0.0722*b }
  const parse = (s) => (s.match(/\d+(\.\d+)?/g)||[0,0,0]).slice(0,3).map(Number)
  const bgOf = (el) => { let n=el; while(n){ const b=getComputedStyle(n).backgroundColor; if(b && !b.includes('rgba(0, 0, 0, 0)') && !b.includes('transparent')) return parse(b); n=n.parentElement } return [6,12,28] }
  const results=[]
  for (const el of document.querySelectorAll('p,span,a,button,dd,dt,li,h1,h2,h3,h4,time,strong,footer *')) {
    const hasText=[...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim().length>2)
    if(!hasText) continue
    const r=el.getBoundingClientRect(); if(!r.width||!r.height) continue
    const s=getComputedStyle(el)
    if (Number(s.opacity)<0.5 || s.visibility==='hidden') continue
    const fg=parse(s.color), bg=bgOf(el)
    const L1=lum(fg), L2=lum(bg)
    const ratio=(Math.max(L1,L2)+0.05)/(Math.min(L1,L2)+0.05)
    const size=parseFloat(s.fontSize); const bold=Number(s.fontWeight)>=700
    const large = size>=24 || (size>=18.66 && bold)
    const need = large?3:4.5
    if (ratio < need) results.push({ ratio:+ratio.toFixed(2), need, size, text: el.textContent.trim().slice(0,40), cls:(el.className||'').toString().slice(0,40) })
  }
  const seen=new Set()
  return results.filter(r=>{const k=r.cls+r.ratio; if(seen.has(k))return false; seen.add(k); return true})
})
console.log(JSON.stringify(out, null, 1))
await browser.close()
