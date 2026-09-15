import type { HistoryEntry } from './types'

/**
 * Institutional data. Sources:
 *  - niteroiensefc.com.br/historia.php
 *  - niteroiensefc.com.br/noticias.php?id=2 and ?id=4 (new crest)
 *  - Manual de Marca, niteroiensefc.com.br/docs_transparencia/5.pdf
 */
export const club = {
  name: 'Niteroiense Futebol Clube',
  shortName: 'Niteroiense',
  initials: 'NFC',
  founded: '11 de maio de 1913',
  foundedYear: 1913,
  refoundedYear: 2024,
  nickname: 'Arariboia',
  city: 'Niterói',
  state: 'RJ',
  homeVenue: 'Concha Acústica de Niterói',
  competition: 'Carioca Série B1 2026',
  objective: 'Acesso à Série A2',
  site: 'https://niteroiensefc.com.br',
  colors: {
    itaipu: '#0f2349',
    niteroiense: '#2c65d5',
    branco: '#ffffff',
  },
} as const

export const social = [
  { label: 'Instagram', href: 'https://www.instagram.com/niteroienseoficial' },
  { label: 'YouTube', href: 'https://youtube.com/@niteroiensetv' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@niteroienseoficial' },
  { label: 'Threads', href: 'https://www.threads.com/@niteroienseoficial' },
  { label: 'X', href: 'https://x.com/niteroiensefc' },
  { label: 'Facebook', href: 'https://www.facebook.com/share/18yuEvM1Ud/' },
] as const

export const crestStory = {
  designer: 'Gabriel de Amorim',
  votes: 'mais de mil votos',
  share: '45,2%',
  reference: 'Museu de Arte Contemporânea de Niterói',
  line: 'O escudo muda. A história continua.',
  source: 'https://niteroiensefc.com.br/noticias.php?id=2',
}

export const history: HistoryEntry[] = [
  {
    year: '1913',
    title: 'Nasce o Nictheroyense Football Club',
    detail:
      'Fundado em 11 de maio, entre as agremiações pioneiras do futebol fluminense e um dos fundadores da Liga Sportiva Fluminense.',
  },
  {
    year: '1918',
    title: 'Campeão Fluminense',
    detail:
      'A conquista da principal competição do antigo estado do Rio de Janeiro, o momento mais marcante da primeira era do clube.',
  },
  {
    year: '1943',
    title: 'Niteroiense Futebol Clube',
    detail:
      'O clube adota a grafia oficial do nome da cidade e segue como uma das instituições mais tradicionais do município.',
  },
  {
    year: '1981',
    title: 'As atividades são encerradas',
    detail:
      'Mudanças no futebol brasileiro e dificuldades estruturais interrompem a trajetória. A história permanece na memória da cidade.',
  },
  {
    year: '2024',
    title: 'O nome volta aos gramados',
    detail:
      'Mais de quatro décadas depois, o Niteroiense conquista a Série C do Carioca e a Taça Waldir Amaral, com acesso à Série B2.',
  },
  {
    year: '2026',
    title: 'Série B1, de olho no acesso',
    detail:
      'Nova campanha de destaque leva o clube à Série B1. A temporada 2026 tem um objetivo declarado: o acesso à Série A2.',
  },
]
