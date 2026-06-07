import type { Location } from "../types";

export const LOCATIONS: Location[] = [
  {
    id: "paamokki",
    name: "Päämökki",
    emoji: "🏠",
    description: "Järvimökin päärakennus. Olohuone, keittiö ja makuuhuoneet.",
  },
  {
    id: "sauna",
    name: "Sauna",
    emoji: "🔥",
    description: "Perinteinen savusauna järven rannalla.",
  },
  {
    id: "grillikota",
    name: "Grillikota",
    emoji: "🪵",
    description: "Katettu grillikota mökin takana metsän reunassa.",
  },
  {
    id: "laituri",
    name: "Laituri",
    emoji: "⚓",
    description: "Vanha puulaituri järven rannalla.",
  },
  {
    id: "venevaja",
    name: "Venevaja",
    emoji: "🛶",
    description: "Puuvene ja kajakki säilytetään täällä.",
  },
  {
    id: "metsakpolku",
    name: "Metsäpolku",
    emoji: "🌲",
    description: "Kapea polku mökin takametsään.",
  },
  {
    id: "vanha_varasto",
    name: "Vanha varasto",
    emoji: "🏚️",
    description: "Puoleksi lahonnut varasto vanhoille tavaroille.",
  },
];

export const LOCATION_MAP: Record<string, Location> = Object.fromEntries(
  LOCATIONS.map((l) => [l.id, l]),
);
