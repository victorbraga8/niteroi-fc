/**
 * Single source of truth for how the home page behaves right now.
 * No backend, no CMS: one typed object that shifts editorial emphasis.
 */

export type PageMode = 'SEASON' | 'PRE_MATCH' | 'MATCHDAY' | 'POST_MATCH'

/**
 * The next fixture is Niteroiense x Nova Cidade, 19/09/2026, and the previous
 * round was played on 12/09. The week belongs to the build-up, so the page runs
 * in PRE_MATCH: the confrontation leads, the campaign supports it.
 */
export const pageMode: PageMode = 'PRE_MATCH'

interface ModeCopy {
  /** Short state label used by the header chip and the mobile menu. */
  navLabel: string
  /** Context line above the match object. Never repeats the headline. */
  matchKicker: string
  /** Line the opening scene resolves into. */
  matchHeadline: string
  /** One short sentence of context under the match object. */
  matchSupport: string
  /** Whether matchday operations (gates, tickets, fan zone) get their own block. */
  showMatchdayOperations: boolean
  /** Relative weight of the campaign block versus the match block. */
  campaignEmphasis: 'lead' | 'support'
}

export const modeCopy: Record<PageMode, ModeCopy> = {
  SEASON: {
    navLabel: 'Próximo jogo',
    matchKicker: 'Calendário da Série B1',
    matchHeadline: 'A campanha continua',
    matchSupport: 'O calendário completo da Série B1, rodada a rodada.',
    showMatchdayOperations: false,
    campaignEmphasis: 'lead',
  },
  PRE_MATCH: {
    navLabel: 'Próximo jogo',
    matchKicker: 'Sábado, na Concha Acústica',
    matchHeadline: 'Próximo desafio',
    matchSupport: 'Terceira rodada da Série B1, com a Vila Niteroiense aberta desde o meio-dia.',
    showMatchdayOperations: true,
    campaignEmphasis: 'support',
  },
  MATCHDAY: {
    navLabel: 'Hoje',
    matchKicker: 'Hoje, na Concha Acústica',
    matchHeadline: 'É dia de Niteroiense',
    matchSupport: 'Portões e Vila Niteroiense abertos desde o meio-dia.',
    showMatchdayOperations: true,
    campaignEmphasis: 'support',
  },
  POST_MATCH: {
    navLabel: 'Fim de jogo',
    matchKicker: 'Rodada encerrada',
    matchHeadline: 'O que ficou da rodada',
    matchSupport: 'O resultado, a reação e o próximo passo da campanha.',
    showMatchdayOperations: false,
    campaignEmphasis: 'lead',
  },
}

export const currentMode = modeCopy[pageMode]

/**
 * Motion constants. Scene lengths are expressed in viewport heights so the
 * scroll budget of each pinned experience lives in one place.
 */
export const motion = {
  /** Core Scene 01: opening identity that becomes the match object. */
  arenaSceneVh: { desktop: 210, mobile: 170 },
  /** Core Scene 02: the season read as a trajectory. */
  journeySceneVh: { desktop: 270, mobile: 0 },
  /** Scrub smoothing, in seconds of catch-up. */
  scrub: { arena: 0.8, journey: 0.6 },
  /** Shared easing vocabulary. */
  ease: {
    enter: 'power3.out',
    exit: 'power2.in',
    athletic: 'expo.out',
    linear: 'none',
  },
  duration: {
    fast: 0.35,
    base: 0.6,
    slow: 1.1,
  },
  /** Community tracks: base speed in pixels per second, per track. */
  communityTrackSpeed: [26, -18, 22],
} as const

export const breakpoints = {
  desktop: '(min-width: 1024px)',
  tablet: '(min-width: 768px) and (max-width: 1023.98px)',
  mobile: '(max-width: 767.98px)',
  reduceMotion: '(prefers-reduced-motion: reduce)',
} as const

/**
 * While the experience is served from its own deployment, nothing leaves it
 * for the institutional site at niteroiensefc.com.br: headlines, documents and
 * fixtures are shown here without an outbound link. The source URLs stay in
 * the data as provenance. Set this to true to hand the links back.
 */
export const linkOutToOfficialSite = false

/** WebGL budget. The arena is one scene; it gets cheaper, never duplicated. */
export const arena = {
  maxPixelRatio: { desktop: 1.75, mobile: 1.35 },
  rings: { desktop: 22, mobile: 12 },
  particles: { desktop: 1100, mobile: 320 },
} as const
