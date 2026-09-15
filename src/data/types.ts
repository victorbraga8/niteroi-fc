import type { ImageMetadata } from 'astro'

/**
 * Domain model for the Niteroiense experience.
 *
 * Every field here is meant to be filled with verified club information only.
 * Anything that cannot be confirmed stays `undefined` and the UI renders an
 * explicit unavailable state instead of inventing a value.
 */

export type MatchStatus = 'encerrado' | 'agendado'
export type MatchVenueSide = 'casa' | 'fora'
export type MatchResult = 'V' | 'E' | 'D'

export interface Club {
  id: string
  name: string
  shortName: string
  crest?: ImageMetadata
}

export interface MatchScore {
  home: number
  away: number
}

export interface Match {
  id: string
  round: number
  competition: string
  kickoff: string
  /** Local kickoff time as published by the club, e.g. "14h45". */
  kickoffLabel: string
  dateLabel: string
  home: Club
  away: Club
  venue: string
  side: MatchVenueSide
  status: MatchStatus
  score?: MatchScore
  /** Result from the Niteroiense point of view. */
  result?: MatchResult
  /** Short editorial note. Only written when there is verified material. */
  note?: string
  source?: string
}

export interface CampaignTotals {
  played: number
  wins: number
  draws: number
  losses: number
  goalsFor: number
  goalsAgainst: number
  points: number
}

export interface MatchdayInfo {
  gatesOpen: string
  fanZone: {
    name: string
    opens: string
    closes: string
    address: string
    attractions: string[]
  }
  tickets: {
    full: string
    half: string
    free: string
    salesNote: string
  }
  access: { label: string; street: string; audience: string }[]
}

export interface Player {
  name: string
  position: PositionGroupId
}

export type PositionGroupId =
  | 'goleiros'
  | 'laterais-direitos'
  | 'laterais-esquerdos'
  | 'zagueiros'
  | 'volantes'
  | 'meio-campistas'
  | 'atacantes'

export interface PositionGroup {
  id: PositionGroupId
  label: string
  players: string[]
}

export interface StaffMember {
  name: string
  role: string
}

export interface Protagonist {
  name: string
  role: string
  age: number
  origin: string
  signedOn: string
  portrait: ImageMetadata
  portraitAlt: string
  quote: string
  quoteContext: string
  background: string[]
  source: string
}

export interface Story {
  id: string
  title: string
  standfirst: string
  date: string
  dateLabel: string
  image: ImageMetadata
  imageAlt: string
  href: string
  kicker: string
}

export interface Partner {
  name: string
  logo: ImageMetadata
  href?: string
}

export interface HistoryEntry {
  year: string
  title: string
  detail: string
}
