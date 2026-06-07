import type { Mission, Game } from "../types";

export const MISSION_POOL: Mission[] = [
  {
    id: "sabotoi",
    title: "Tuhoa todisteet",
    description:
      "Käytä sabotagetoiminto piilottaaksesi tai korvataaksesi jonkun tärkeän vihjeen.",
    type: "use_sabotage",
  },
  {
    id: "valttu_aanestys",
    title: "Vältä epäilyksiä",
    description:
      "Saa korkeintaan yhden äänen äänestyksessä. Johda muita harhaan tehokkaasti.",
    type: "survive_vote",
  },
  {
    id: "keraa_2_vihjetta",
    title: "Kerää todisteita",
    description:
      "Kerää ainakin 2 vihjettä pelin aikana. Näin näytät olevan kiinnostunut tutkimuksesta.",
    type: "collect_n",
    n: 2,
  },
  {
    id: "keraa_3_vihjetta",
    title: "Tutkijaksi tekeytyminen",
    description:
      "Kerää ainakin 3 vihjettä — enemmän kuin monet oikeista tutkijoista.",
    type: "collect_n",
    n: 3,
  },
  {
    id: "kayta_saunalla",
    title: "Käy saunalla",
    description:
      "Vieraile saunalla ainakin kerran pelin aikana. Sinulla on syy tähän.",
    type: "visit_location",
    locationId: "sauna",
  },
  {
    id: "kayta_laiturilla",
    title: "Laiturin alibi",
    description:
      "Käy laiturilla ainakin kerran — ja varmista, että sinulla on uskottava syy sille.",
    type: "visit_location",
    locationId: "laituri",
  },
  {
    id: "alibi_mokissa",
    title: "Luo alibi mökillä",
    description:
      "Ole päämökissä vähintään kerran pelin aikana — se luo uskottavan alibin.",
    type: "visit_location",
    locationId: "paamokki",
  },
  {
    id: "kayta_grillikodassa",
    title: "Hävitä jäljet grillikodassa",
    description:
      "Käy grillikodassa — siellä on jotain, jonka täytyy kadota.",
    type: "visit_location",
    locationId: "grillikota",
  },
  {
    id: "tutki_5_paikkaa",
    title: "Kulje kaikkialle",
    description:
      "Vieraile vähintään 5 eri paikassa. Liika kiire herättää epäilyksiä.",
    type: "visit_n_locations",
    n: 5,
  },
  {
    id: "tutki_3_paikkaa",
    title: "Tutustu ympäristöön",
    description:
      "Vieraile ainakin 3 eri paikassa. Uskottava syyllinen ei jää paikoilleen.",
    type: "visit_n_locations",
    n: 3,
  },
  {
    id: "vakuuta_vaara",
    title: "Harhauta äänestystä",
    description:
      "Vakuuta ainakin yksi pelaaja äänestämään sinua vastaan. Merkitse suoritetuksi kun onnistut.",
    type: "manual",
  },
  {
    id: "keraa_avain",
    title: "Hanki avain",
    description:
      "Kerää venevajan 'Tuntematon avain' ennen kuin muut ehtivät.",
    type: "collect_clue",
    clueId: "avain",
  },
];

export function assignMissions(count: 3 | 4 = 3): Mission[] {
  const shuffled = [...MISSION_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getMissionStatus(
  game: Game,
  mission: Mission,
  syyllinenId: string | undefined
): true | false | null {
  const completed = game.completedMissions ?? {};

  if (mission.type === "use_sabotage") {
    const sab = game.sabotage;
    if (!sab) return null;
    return sab.performedBy === syyllinenId;
  }

  if (mission.type === "collect_clue" && mission.clueId) {
    if (!syyllinenId) return null;
    return !!(game.inventories?.[syyllinenId]?.[mission.clueId]);
  }

  if (mission.type === "collect_n" && mission.n !== undefined) {
    if (!syyllinenId) return null;
    const count = Object.keys(game.inventories?.[syyllinenId] ?? {}).length;
    return count >= mission.n;
  }

  if (mission.type === "visit_location" && mission.locationId) {
    return !!(game.syyllinenVisits?.[mission.locationId]);
  }

  if (mission.type === "visit_n_locations" && mission.n !== undefined) {
    const count = Object.keys(game.syyllinenVisits ?? {}).length;
    return count >= mission.n;
  }

  if (mission.type === "survive_vote") {
    const votes = game.votes ?? {};
    const totalVoters = Object.keys(votes).length;
    if (totalVoters === 0) return null;
    const againstMe = Object.values(votes).filter((v) => v === syyllinenId).length;
    return againstMe <= 1;
  }

  if (mission.type === "manual") {
    return completed[mission.id] ? true : null;
  }

  return null;
}

export function countCompletedMissions(
  game: Game,
  missions: Mission[],
  syyllinenId: string | undefined
): number {
  return missions.filter((m) => getMissionStatus(game, m, syyllinenId) === true).length;
}
