export interface NavItem {
  label: string
  href: string
  /** External links point at pages of the official site that are not rebuilt here. */
  external?: boolean
}

/** Ordered by sporting relevance, not by media format. */
export const primaryNav: NavItem[] = [
  { label: 'Agora', href: '#agora' },
  { label: 'A campanha', href: '#campanha' },
  { label: 'Quem joga', href: '#quem-joga' },
  { label: 'Niterói', href: '#niteroi' },
  { label: 'O clube', href: '#clube' },
]

/** Sections of the official site that still live there. */
export const officialLinks: NavItem[] = [
  { label: 'Jogos', href: 'https://niteroiensefc.com.br/jogos.php', external: true },
  { label: 'Notícias', href: 'https://niteroiensefc.com.br/noticias.php', external: true },
  { label: 'Vídeos', href: 'https://niteroiensefc.com.br/videos.php', external: true },
  { label: 'Transparência', href: 'https://niteroiensefc.com.br/transparencia.php', external: true },
]
