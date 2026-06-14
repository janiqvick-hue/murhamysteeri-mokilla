import type { Location } from "../types";

export const LOCATIONS: any[] = [
  {
    id: "paamokki",
    name: "Päämökki",
    emoji: "🏠",
    description: "Kodikas olohuone, jossa takka hiillostaa edelleen. Täällä vietettiin iltaa yhdessä ennen tragedioita.",
    color: "amber"
  },
  {
    id: "sauna",
    name: "Sauna",
    emoji: "🔥",
    description: "Hämärä, vielä hieman lämmin puusauna. Kivillä on outo tuoksu ja laudeliina puuttuu.",
    color: "orange"
  },
  {
    id: "grillikota",
    name: "Grillikota",
    emoji: "🪵",
    description: "Pyöreä puukota mökin takapihalla. Tuhkakasa on vielä lämmin, ja täältä kuuluu sateen ropina erityisen lujaa.",
    color: "red"
  },
  {
    id: "laituri",
    name: "Laituri",
    emoji: "⚓",
    description: "Myrskyisä järvenranta. Aallot hakkaavat liukasta puulaituria, johon päättyy epäilyttäviä jälkiä.",
    color: "blue"
  },
  {
    id: "venevaja",
    name: "Venevaja",
    emoji: "🛶",
    description: "Narskuva pimeä suoja vesirajan tuntumassa. Verkkoja roikkuu katosta ja joku on jättänyt oven auki tuuleen.",
    color: "cyan"
  },
  {
    id: "metsakpolku",
    name: "Metsäpolku",
    emoji: "🌲",
    description: "Märkä ja mutainen reitti, joka johtaa syvemmälle synkkään korpeen. Myrskyn kaatamat oksat vaikeuttavat kulkua.",
    color: "emerald"
  },
  {
    id: "vanha_varasto",
    name: "Vanha varasto",
    emoji: "🏚️",
    description: "Mökin perimmäinen lukitsematon varastovaja, täynnä työkaluja, pölyä ja menneisyyden salaisuuksia.",
    color: "slate"
  }
];

export const LOCATION_MAP: Record<string, any> = Object.fromEntries(
  LOCATIONS.map((l) => [l.id, l])
);
