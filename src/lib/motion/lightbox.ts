import GLightbox from 'glightbox'
import 'glightbox/dist/css/glightbox.css'

// GLightbox renders YouTube through Plyr. Both are bundled with the site rather
// than pulled from a CDN at runtime, so the lightbox has no third-party
// dependency at open time and cannot fail because someone else's host is down.
import plyrCss from 'plyr/dist/plyr.css?url'
import plyrJs from 'plyr/dist/plyr.min.js?url'

/**
 * One lightbox for the whole page.
 *
 * Films open the real video from the club's channel; photographs open the full
 * frame with the match they came from as the caption. Both are marked up as
 * ordinary links first, so the destination stays reachable, shareable and
 * middle-clickable even when the script never runs.
 */
export function initLightbox() {
  if (!document.querySelector('[data-lightbox]')) return

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const lightbox = GLightbox({
    selector: '[data-lightbox]',
    touchNavigation: true,
    loop: false,
    zoomable: false,
    draggable: true,
    openEffect: reduce ? 'none' : 'zoom',
    closeEffect: reduce ? 'none' : 'zoom',
    slideEffect: reduce ? 'none' : 'slide',
    videosWidth: '1280px',
    closeButton: true,
    moreText: 'Ver mais',
    plyr: {
      css: plyrCss,
      js: plyrJs,
      config: {
        ratio: '16:9',
        youtube: { noCookie: true, rel: 0, iv_load_policy: 3 },
      },
    },
  })

  window.addEventListener('pagehide', () => lightbox.destroy(), { once: true })

  return lightbox
}
