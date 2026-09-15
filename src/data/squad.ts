import type { PositionGroup, Protagonist, StaffMember } from './types'
import chayPortrait from '../assets/editorial/chay-retrato.jpg'

/**
 * Squad, technical staff and board exactly as announced by the club on
 * 04/09/2026: niteroiensefc.com.br/noticias.php?id=9
 *
 * The club does not publish shirt numbers or individual photographs for this
 * squad, so neither is invented here. Names carry the section.
 */

export const squadSize = 31

export const squad: PositionGroup[] = [
  {
    id: 'goleiros',
    label: 'Goleiros',
    players: ['Pedro Campanelli', 'Marcão', 'Bryan', 'Pedro'],
  },
  {
    id: 'zagueiros',
    label: 'Zagueiros',
    players: ['Gustavo Índio', 'Nunes', 'João Amancio', 'Rodrigão'],
  },
  {
    id: 'laterais-direitos',
    label: 'Laterais-direitos',
    players: ['Brenin', 'Pedro Viana', 'Júnior'],
  },
  {
    id: 'laterais-esquerdos',
    label: 'Laterais-esquerdos',
    players: ['Guilherme', 'Berriel'],
  },
  {
    id: 'volantes',
    label: 'Volantes',
    players: ['Caio Miranda', 'Russo', 'Borges'],
  },
  {
    id: 'meio-campistas',
    label: 'Meio-campistas',
    players: ['Matheuzinho', 'Thiaguinho', 'Ruan Santos', 'Jefinho', 'Diguinho', 'Gallo', 'Chay', 'Ryanzin'],
  },
  {
    id: 'atacantes',
    label: 'Atacantes',
    players: ['Sassá', 'Dos Santos', 'VT', 'Wandinho', 'Talisson', 'Guilherme Silveira', 'Lekinho'],
  },
]

export const headCoach = 'Thiago Thomaz'

export const staff: StaffMember[] = [
  { name: 'Thiago Thomaz', role: 'Treinador' },
  { name: 'Henrique Junior', role: 'Auxiliar técnico' },
  { name: 'Charles Pais', role: 'Treinador de goleiros' },
  { name: 'Julio Sá', role: 'Preparador físico' },
  { name: 'Ary Costa', role: 'Auxiliar de preparação física' },
  { name: 'Lucas Gideão', role: 'Auxiliar de preparação de goleiros' },
  { name: 'Olivia Gomide', role: 'Médica' },
  { name: 'Pedro Feijó', role: 'Fisioterapeuta' },
  { name: 'Gabriel Veiga', role: 'Nutricionista' },
]

export const board: StaffMember[] = [
  { name: 'André Luiz Silva', role: 'Presidente' },
  { name: 'Michel Cravo', role: 'Gerente de futebol' },
  { name: 'Clever Felix', role: 'Gerente de comunicação' },
  { name: 'Fabiano Valadão', role: 'Supervisor' },
]

/**
 * The only 2026 signing the club presented individually, with the only
 * published photograph of an athlete in this squad.
 * Source: niteroiensefc.com.br/noticias.php?id=7 (23/08/2026)
 */
export const protagonist: Protagonist = {
  name: 'Chay',
  role: 'Meia-atacante',
  age: 35,
  origin: 'Niterói',
  signedOn: '13 de agosto de 2026',
  portrait: chayPortrait,
  portraitAlt: 'Chay com a camisa azul do Niteroiense na apresentação oficial',
  quote: 'Eu tenho uma identificação gigantesca com a cidade. Então é uma volta para casa.',
  quoteContext: 'Apresentação na Praia de Icaraí, 23 de agosto de 2026',
  background: [
    'Criado em Niterói desde os três anos de idade',
    'Peça do acesso do Botafogo na Série B de 2021',
    'Passagens por Bonsucesso, Cruzeiro, Ceará, Volta Redonda e Portuguesa-RJ',
  ],
  source: 'https://niteroiensefc.com.br/noticias.php?id=7',
}
