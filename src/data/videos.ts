import type { ImageMetadata } from 'astro'

import golResende from '../assets/media/gol-resende-2024.jpg'
import acaoRiostrense from '../assets/media/acao-riostrense-2024.jpg'
import campoCaac from '../assets/media/campo-caac-2024.jpg'
import campoParaty from '../assets/media/campo-paraty-2024.jpg'
import saoCristovao from '../assets/media/sao-cristovao-2025.jpg'
import carapebus2025 from '../assets/media/carapebus-2025.jpg'
import bonsucesso from '../assets/media/bonsucesso-2025.jpg'
import duqueDeCaxias from '../assets/media/duque-de-caxias-2025.jpg'
import paduano from '../assets/media/paduano-2025.jpg'
import chayNitTv from '../assets/media/chay-nittv-2026.jpg'

/**
 * Niteroiense TV.
 *
 * Every entry here is a real video published on the club's own YouTube channel
 * and listed on niteroiensefc.com.br/videos.php. The still for each one is that
 * video's own frame, so a photograph is never shown next to a match it did not
 * come from.
 */

export interface ClubVideo {
  id: string
  kind: 'melhores-momentos' | 'jogo-completo' | 'bastidores'
  title: string
  subtitle: string
  competition: string
  date: string
  dateLabel: string
  still: ImageMetadata
  stillAlt: string
  /** True when the still is photography from the pitch rather than key art. */
  isPitchPhoto: boolean
}

const watch = (id: string) => `https://www.youtube.com/watch?v=${id}`

export const videos: ClubVideo[] = [
  {
    id: 'qkR4zRYo67g',
    kind: 'melhores-momentos',
    title: 'Niteroiense 3 x 0 EC Resende',
    subtitle: 'Melhores momentos',
    competition: 'Carioca Série C 2024, 9ª rodada',
    date: '2024-07-07',
    dateLabel: '07 jul 2024',
    still: golResende,
    stillAlt: 'Jogadores do Niteroiense de azul comemoram um gol no gramado',
    isPitchPhoto: true,
  },
  {
    id: 'uA8TamrLik4',
    kind: 'melhores-momentos',
    title: 'Niteroiense 2 x 0 Riostrense',
    subtitle: 'Melhores momentos',
    competition: 'Carioca Série C 2024, 7ª rodada',
    date: '2024-06-24',
    dateLabel: '24 jun 2024',
    still: acaoRiostrense,
    stillAlt: 'Jogadores do Niteroiense em movimento durante a partida',
    isPitchPhoto: true,
  },
  {
    id: 'yQoVtg9sjlQ',
    kind: 'melhores-momentos',
    title: 'CAAC Brasil 1 x 4 Niteroiense',
    subtitle: 'Melhores momentos',
    competition: 'Carioca Série C 2024, 8ª rodada',
    date: '2024-06-30',
    dateLabel: '30 jun 2024',
    still: campoCaac,
    stillAlt: 'Lance de ataque com a cidade ao fundo do campo',
    isPitchPhoto: true,
  },
  {
    id: 'ipW7cnefTww',
    kind: 'melhores-momentos',
    title: 'Paraty 1 x 4 Niteroiense',
    subtitle: 'Melhores momentos',
    competition: 'Carioca Série C 2024, 4ª rodada',
    date: '2024-06-02',
    dateLabel: '02 jun 2024',
    still: campoParaty,
    stillAlt: 'Partida em andamento vista da arquibancada',
    isPitchPhoto: true,
  },
  {
    id: 'Dh7kJk-94aM',
    kind: 'bastidores',
    title: 'Apresentação do Chay',
    subtitle: 'Bastidores',
    competition: 'Temporada 2026',
    date: '2026-08-24',
    dateLabel: '24 ago 2026',
    still: chayNitTv,
    stillAlt: 'Chay sorrindo com o agasalho do Niteroiense na apresentação',
    isPitchPhoto: false,
  },
  {
    id: 'eL77bkLFfC4',
    kind: 'jogo-completo',
    title: 'Niteroiense x Paduano',
    subtitle: 'Jogo completo',
    competition: 'Carioca Série B1 2025, 11ª rodada',
    date: '2025-11-08',
    dateLabel: '08 nov 2025',
    still: paduano,
    stillAlt: 'Arte de transmissão da partida entre Niteroiense e Paduano',
    isPitchPhoto: false,
  },
  {
    id: 'aNoCSQJxqzU',
    kind: 'jogo-completo',
    title: 'Niteroiense x Duque de Caxias',
    subtitle: 'Jogo completo',
    competition: 'Carioca Série B1 2025, 10ª rodada',
    date: '2025-11-05',
    dateLabel: '05 nov 2025',
    still: duqueDeCaxias,
    stillAlt: 'Arte de transmissão da partida entre Niteroiense e Duque de Caxias',
    isPitchPhoto: false,
  },
  {
    id: 'Y3RdFFhOkNQ',
    kind: 'jogo-completo',
    title: 'Niteroiense x Bonsucesso',
    subtitle: 'Jogo completo',
    competition: 'Carioca Série B1 2025, 7ª rodada',
    date: '2025-10-18',
    dateLabel: '18 out 2025',
    still: bonsucesso,
    stillAlt: 'Arte de transmissão da partida entre Niteroiense e Bonsucesso',
    isPitchPhoto: false,
  },
  {
    id: 'FO5pRYiex1w',
    kind: 'jogo-completo',
    title: 'Niteroiense x Carapebus',
    subtitle: 'Jogo completo',
    competition: 'Carioca Série B1 2025, 3ª rodada',
    date: '2025-09-20',
    dateLabel: '20 set 2025',
    still: carapebus2025,
    stillAlt: 'Arte de transmissão da partida entre Niteroiense e Carapebus',
    isPitchPhoto: false,
  },
  {
    id: 'KFZv0vqI0k0',
    kind: 'jogo-completo',
    title: 'Niteroiense x São Cristóvão',
    subtitle: 'Jogo completo',
    competition: 'Carioca Série B1 2025, 1ª rodada',
    date: '2025-09-06',
    dateLabel: '06 set 2025',
    still: saoCristovao,
    stillAlt: 'Arte de transmissão da partida entre Niteroiense e São Cristóvão',
    isPitchPhoto: false,
  },
]

export const videoHref = watch

/** Pitch photography only, for places that need a real photograph. */
export const pitchPhotos = videos.filter((v) => v.isPitchPhoto)

/**
 * The clip that plays behind the opening. Real match footage from the club's
 * own channel, so the background of the page is the club actually playing.
 */
export const heroFilm = videos[0]

export const channelUrl = 'https://youtube.com/@niteroiensetv'
export const totalPublished = 17
