import type { Partner } from "./types";

import prefeitura from "../assets/partners/prefeitura-niteroi.png";
import secretaria from "../assets/partners/secretaria-esportes.png";
import loterj from "../assets/partners/loterj.png";
import hal from "../assets/partners/hal-alternativa.png";
import conteComRj from "../assets/partners/conte-com-rj.png";
import redeOsorios from "../assets/partners/rede-osorios.png";
import mx from "../assets/partners/mx-logo.png";
import mbw from "../assets/partners/mbw-sports.png";

/** Parceiros as listed on niteroiensefc.com.br/negocios.php */
export const partners: Partner[] = [
  {
    name: "Prefeitura de Niterói",
    logo: prefeitura,
    href: "http://niteroi.rj.gov.br/",
  },
  {
    name: "Secretaria de Esportes de Niterói",
    logo: secretaria,
    href: "http://esporte.niteroi.rj.gov.br/",
  },
  { name: "Loterj", logo: loterj, href: "http://www.loterj.rj.gov.br/" },
  { name: "Conte com RJ", logo: conteComRj, href: "http://contecomrj.com.br/" },
  {
    name: "HAL Alternativa",
    logo: hal,
    href: "http://www.instagram.com/halternativa/",
  },
  {
    name: "Rede Osórios",
    logo: redeOsorios,
    href: "http://www.instagram.com/redeosorios",
  },
  {
    name: "MX Publicidade",
    logo: mx,
    href: "http://mxpublicidade.com/",
  },
  { name: "MBW Sports", logo: mbw, href: "http://www.mbwsports.com.br" },
];
