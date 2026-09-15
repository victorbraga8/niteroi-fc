import type { Story } from './types'

import elenco from '../assets/editorial/elenco-2026.jpg'
import estreia from '../assets/editorial/estreia-serrano.jpg'
import chay from '../assets/editorial/chay.jpg'
import sub20 from '../assets/editorial/sub20.jpg'
import escudoOficial from '../assets/editorial/escudo-oficial.jpg'
import escudoVotacao from '../assets/editorial/escudo-votacao.jpg'
import uniformes from '../assets/editorial/uniformes-torcida.jpg'
import assembleia from '../assets/editorial/assembleia.jpg'

const base = 'https://niteroiensefc.com.br/noticias.php'

/** Published news, ordered by date. Headlines and standfirsts are the club's own. */
export const stories: Story[] = [
  {
    id: 'elenco-2026',
    kicker: 'Temporada',
    title: 'Temporada 2026: Elenco, Comissão Técnica e Diretoria',
    standfirst:
      'Clube oficializa o grupo que representará o Niteroiense na temporada, com foco na disputa do Carioca Série B1 e na busca pelo acesso à Série A2.',
    date: '2026-09-04',
    dateLabel: '04 de setembro de 2026',
    image: elenco,
    imageAlt: 'Arte oficial do Niteroiense com a bandeira do clube e a chamada Conheça nossa equipe',
    href: `${base}?id=9`,
  },
  {
    id: 'estreia-serrano',
    kicker: 'Matchday',
    title: 'Niteroiense estreia na Série B1 contra o Serrano, na Concha Acústica',
    standfirst:
      'Primeiro jogo do clube em casa pela competição, às 14h45; Vila Niteroiense terá programação especial a partir das 12h.',
    date: '2026-09-02',
    dateLabel: '02 de setembro de 2026',
    image: estreia,
    imageAlt: 'Arte de jogo com os escudos de Niteroiense e Serrano pela 1ª rodada da Série B1',
    href: `${base}?id=8`,
  },
  {
    id: 'chay',
    kicker: 'Reforço',
    title: 'Chay é o novo reforço do Niteroiense para a Série B1',
    standfirst:
      'Meia-atacante de 35 anos, destaque do acesso do Botafogo em 2021, foi apresentado à torcida na Praia de Icaraí.',
    date: '2026-08-23',
    dateLabel: '23 de agosto de 2026',
    image: chay,
    imageAlt: 'Arte de boas-vindas a Chay, com o jogador de uniforme azul do Niteroiense',
    href: `${base}?id=7`,
  },
  {
    id: 'sub20',
    kicker: 'Base',
    title: 'Niteroiense abre inscrições para avaliações da equipe Sub-20',
    standfirst:
      'Avaliações na Concha Acústica, às segundas, quartas e sextas, para atletas nascidos entre 2007 e 2009.',
    date: '2026-07-15',
    dateLabel: '15 de julho de 2026',
    image: sub20,
    imageAlt: 'Arte de divulgação da avaliação da equipe Sub-20 do Niteroiense',
    href: `${base}?id=6`,
  },
  {
    id: 'escudo-oficial',
    kicker: 'Identidade',
    title: 'Niteroiense oficializa novo escudo escolhido pela torcida',
    standfirst:
      'Símbolo vencedor da votação popular passa a representar oficialmente o clube dentro e fora de campo.',
    date: '2026-05-21',
    dateLabel: '21 de maio de 2026',
    image: escudoOficial,
    imageAlt: 'Novo escudo do Niteroiense sobre padronagem azul com a marca do clube',
    href: `${base}?id=4`,
  },
  {
    id: 'uniformes',
    kicker: 'Torcida',
    title: 'Torcida poderá criar os uniformes do Niteroiense para a temporada 2026',
    standfirst:
      'Concurso aberto para propostas de uniforme principal e reserva, com votação pública para escolher os vencedores.',
    date: '2026-05-22',
    dateLabel: '22 de maio de 2026',
    image: uniformes,
    imageAlt: 'Arte do concurso de uniformes com a chamada Os novos mantos começam com vocês',
    href: `${base}?id=3`,
  },
  {
    id: 'escudo-votacao',
    kicker: 'Identidade',
    title: 'Niteroiense apresenta novo escudo após votação popular',
    standfirst:
      'Projeto de Gabriel de Amorim venceu com 45,2% e traz o Museu de Arte Contemporânea de Niterói de forma estilizada.',
    date: '2026-04-03',
    dateLabel: '03 de abril de 2026',
    image: escudoVotacao,
    imageAlt: 'Escudo do Niteroiense em branco sobre fundo Azul Niteroiense',
    href: `${base}?id=2`,
  },
  {
    id: 'assembleia',
    kicker: 'Institucional',
    title: 'Convocação para Assembleia Geral Extraordinária',
    standfirst:
      'Associados convocados para deliberar sobre a mudança de sede para Niterói e a mudança de escudo.',
    date: '2026-05-11',
    dateLabel: '11 de maio de 2026',
    image: assembleia,
    imageAlt: 'Comunicado institucional do Niteroiense Futebol Clube',
    href: `${base}?id=5`,
  },
]

export const leadStory = stories[0]
export const secondaryStories = [stories[1], stories[2], stories[3]]
export const institutionalStories = [stories[4], stories[6], stories[5], stories[7]]
