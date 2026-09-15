import type { CampaignTotals, Club, Match, MatchdayInfo } from './types'

import niteroienseCrest from '../assets/escudos/niteroiense.jpg'
import serranoCrest from '../assets/escudos/serrano.jpg'
import petropolisCrest from '../assets/escudos/petropolis.jpg'
import novaCidadeCrest from '../assets/escudos/nova-cidade.jpg'
import duqueDeCaxiasCrest from '../assets/escudos/duque-de-caxias.jpg'
import saoCristovaoCrest from '../assets/escudos/sao-cristovao.jpg'
import carapebusCrest from '../assets/escudos/carapebus.jpg'
import goytacazCrest from '../assets/escudos/goytacaz.jpg'
import audaxRioCrest from '../assets/escudos/audax-rio.jpg'
import campoGrandeCrest from '../assets/escudos/campo-grande.jpg'
import artsulCrest from '../assets/escudos/artsul.jpg'
import macaeCrest from '../assets/escudos/macae.jpg'

/**
 * Fixtures, venues and results as published by the club on
 * niteroiensefc.com.br/jogos.php and the per-match pages
 * niteroiensefc.com.br/estatistica_jogo.php?f_id_jogo=<id>.
 *
 * Round numbers follow the published calendar order of the single round-robin
 * (eleven rounds); the club's own matchday artwork labels 05/09 as "1ª Rodada".
 */

const COMPETITION = 'Carioca Série B1 2026'

export const niteroiense: Club = {
  id: 'niteroiense',
  name: 'Niteroiense',
  shortName: 'NIT',
  crest: niteroienseCrest,
}

const serrano: Club = { id: 'serrano', name: 'Serrano', shortName: 'SER', crest: serranoCrest }
const petropolis: Club = { id: 'petropolis', name: 'Petrópolis', shortName: 'PET', crest: petropolisCrest }
const novaCidade: Club = { id: 'nova-cidade', name: 'Nova Cidade', shortName: 'NCI', crest: novaCidadeCrest }
const duqueDeCaxias: Club = { id: 'duque-de-caxias', name: 'Duque de Caxias', shortName: 'DUQ', crest: duqueDeCaxiasCrest }
const saoCristovao: Club = { id: 'sao-cristovao', name: 'São Cristóvão', shortName: 'SCR', crest: saoCristovaoCrest }
const carapebus: Club = { id: 'carapebus', name: 'Carapebus', shortName: 'CAR', crest: carapebusCrest }
const goytacaz: Club = { id: 'goytacaz', name: 'Goytacaz', shortName: 'GOY', crest: goytacazCrest }
const audaxRio: Club = { id: 'audax-rio', name: 'Audax Rio', shortName: 'AUD', crest: audaxRioCrest }
const campoGrande: Club = { id: 'campo-grande', name: 'Campo Grande', shortName: 'CGR', crest: campoGrandeCrest }
const artsul: Club = { id: 'artsul', name: 'Univ. Artsul', shortName: 'ART', crest: artsulCrest }
const macae: Club = { id: 'macae', name: 'Macaé', shortName: 'MAC', crest: macaeCrest }

export const fixtures: Match[] = [
  {
    id: 'b1-2026-r1',
    round: 1,
    competition: COMPETITION,
    kickoff: '2026-09-05T14:45:00-03:00',
    kickoffLabel: '14h45',
    dateLabel: '05 set',
    home: niteroiense,
    away: serrano,
    venue: 'Concha Acústica',
    side: 'casa',
    status: 'encerrado',
    score: { home: 2, away: 0 },
    result: 'V',
    note: 'Estreia na Série B1 em casa, com a Vila Niteroiense aberta desde o meio-dia.',
  },
  {
    id: 'b1-2026-r2',
    round: 2,
    competition: COMPETITION,
    kickoff: '2026-09-12T14:45:00-03:00',
    kickoffLabel: '14h45',
    dateLabel: '12 set',
    home: petropolis,
    away: niteroiense,
    venue: 'Ronaldo Nazário',
    side: 'fora',
    status: 'encerrado',
    score: { home: 1, away: 1 },
    result: 'E',
    note: 'Primeiro ponto somado fora de casa na competição.',
  },
  {
    id: 'b1-2026-r3',
    round: 3,
    competition: COMPETITION,
    kickoff: '2026-09-19T14:45:00-03:00',
    kickoffLabel: '14h45',
    dateLabel: '19 set',
    home: niteroiense,
    away: novaCidade,
    venue: 'Concha Acústica',
    side: 'casa',
    status: 'agendado',
  },
  {
    id: 'b1-2026-r4',
    round: 4,
    competition: COMPETITION,
    kickoff: '2026-09-26T14:45:00-03:00',
    kickoffLabel: '14h45',
    dateLabel: '26 set',
    home: duqueDeCaxias,
    away: niteroiense,
    venue: 'Los Larios',
    side: 'fora',
    status: 'agendado',
  },
  {
    id: 'b1-2026-r5',
    round: 5,
    competition: COMPETITION,
    kickoff: '2026-10-03T15:00:00-03:00',
    kickoffLabel: '15h00',
    dateLabel: '03 out',
    home: niteroiense,
    away: saoCristovao,
    venue: 'Concha Acústica',
    side: 'casa',
    status: 'agendado',
  },
  {
    id: 'b1-2026-r6',
    round: 6,
    competition: COMPETITION,
    kickoff: '2026-10-10T15:00:00-03:00',
    kickoffLabel: '15h00',
    dateLabel: '10 out',
    home: carapebus,
    away: niteroiense,
    venue: 'Moacyrzão',
    side: 'fora',
    status: 'agendado',
  },
  {
    id: 'b1-2026-r7',
    round: 7,
    competition: COMPETITION,
    kickoff: '2026-10-17T15:00:00-03:00',
    kickoffLabel: '15h00',
    dateLabel: '17 out',
    home: goytacaz,
    away: niteroiense,
    venue: 'Ary de Oliveira',
    side: 'fora',
    status: 'agendado',
  },
  {
    id: 'b1-2026-r8',
    round: 8,
    competition: COMPETITION,
    kickoff: '2026-10-21T15:00:00-03:00',
    kickoffLabel: '15h00',
    dateLabel: '21 out',
    home: niteroiense,
    away: audaxRio,
    venue: 'Concha Acústica',
    side: 'casa',
    status: 'agendado',
  },
  {
    id: 'b1-2026-r9',
    round: 9,
    competition: COMPETITION,
    kickoff: '2026-10-24T15:00:00-03:00',
    kickoffLabel: '15h00',
    dateLabel: '24 out',
    home: campoGrande,
    away: niteroiense,
    venue: 'Ítalo Del Cima',
    side: 'fora',
    status: 'agendado',
  },
  {
    id: 'b1-2026-r10',
    round: 10,
    competition: COMPETITION,
    kickoff: '2026-10-31T15:00:00-03:00',
    kickoffLabel: '15h00',
    dateLabel: '31 out',
    home: niteroiense,
    away: artsul,
    venue: 'Concha Acústica',
    side: 'casa',
    status: 'agendado',
  },
  {
    id: 'b1-2026-r11',
    round: 11,
    competition: COMPETITION,
    kickoff: '2026-11-07T15:00:00-03:00',
    kickoffLabel: '15h00',
    dateLabel: '07 nov',
    home: macae,
    away: niteroiense,
    venue: 'Moacyrzão',
    side: 'fora',
    status: 'agendado',
  },
]

export const playedMatches = fixtures.filter((m) => m.status === 'encerrado')
export const nextMatch = fixtures.find((m) => m.status === 'agendado')!
export const lastMatch = playedMatches[playedMatches.length - 1]

/** Derived from the published results above, never hand-written. */
export const campaign: CampaignTotals = playedMatches.reduce<CampaignTotals>(
  (totals, match) => {
    if (!match.score) return totals
    const isHome = match.side === 'casa'
    const scored = isHome ? match.score.home : match.score.away
    const conceded = isHome ? match.score.away : match.score.home
    totals.played += 1
    totals.goalsFor += scored
    totals.goalsAgainst += conceded
    if (scored > conceded) {
      totals.wins += 1
      totals.points += 3
    } else if (scored === conceded) {
      totals.draws += 1
      totals.points += 1
    } else {
      totals.losses += 1
    }
    return totals
  },
  { played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
)

/**
 * The full Série B1 table is not published on the club's channels, so the
 * standings are intentionally absent instead of estimated. The interface says so.
 */
export const standingsAvailable = false

/** Matchday operation, as published for the home fixtures at the Concha Acústica. */
export const matchday: MatchdayInfo = {
  gatesOpen: '12h',
  fanZone: {
    name: 'Vila Niteroiense',
    opens: '12h',
    closes: '20h',
    address: 'Rua General Osório, entre a Concha Acústica e o antigo prédio da ENEL',
    attractions: [
      'Show do Samba de Marola',
      'Polo gastronômico com food trucks',
      'Benditta Feira',
      'Recreação infantil e brinquedos infláveis',
    ],
  },
  tickets: {
    full: 'R$ 10,00',
    half: 'R$ 5,00',
    free: 'Crianças até 11 anos',
    salesNote: 'Venda apenas no dia do jogo, no entorno da Concha Acústica, a partir das 12h.',
  },
  access: [
    { label: 'Acesso A', street: 'Rua General Osório', audience: 'Torcida do Niteroiense' },
    { label: 'Acesso B', street: 'Avenida Visconde do Rio Branco', audience: 'Torcida visitante' },
  ],
}
