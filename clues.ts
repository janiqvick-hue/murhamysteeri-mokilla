import type { Clue } from "../types";
import type { Scenario } from "../types";

const BASE_CLUES: Clue[] = [
  {
    id: "veitsi",
    locationId: "paamokki",
    name: "Keittiöveitsi",
    category: "fyysinen",
    normalText:
      "Keittiöveitsi löytyi epätavallisesta paikasta – olohuoneen sohvan alta. Terässä on tumma tahra.",
    syyllinenText:
      "Keittiöveitsi on pudonnut sohvan alle. Tahra on vain puolukkamehua.",
    salaisuusHint: "Veitsessä on merkkejä kiireestä – joku yritti piilottaa sen.",
  },
  {
    id: "kirje",
    locationId: "paamokki",
    name: "Repaleinen kirje",
    category: "asiakirja",
    normalText:
      "Repaleinen kirje, jossa vieras käsiala: 'Emme voi enää jatkaa – sinä tiedät miksi.'",
    syyllinenText:
      "Kirje on vanha rakkauskirje. Ei liity tähän iltaan mitenkään.",
    salaisuusHint: "Kirje on kirjoitettu samana päivänä kuin tapahtuma.",
  },
  {
    id: "malja",
    locationId: "paamokki",
    name: "Viskimalja",
    category: "epailyttava",
    normalText:
      "Puolityhjä viskimalja – reunassa vain yksi huulijälki. Toinen malja on koskematon.",
    syyllinenText: "Kaksi maljaa, kaksi juojaa. Normaalia illanviettoa.",
    salaisuusHint: "Koskemattomassa maljassa ei ole juotu lainkaan.",
  },
  {
    id: "pyyhe",
    locationId: "sauna",
    name: "Verinen pyyhe",
    category: "fyysinen",
    normalText:
      "Pyyhe on taiteltu huolellisesti kiuaalle. Punertavia tahroja pyyhkeessä.",
    syyllinenText:
      "Tahrat ovat hilsemäistä epidermiä – kylpijä on vain raapinut ihoa.",
    salaisuusHint: "Pyyhe on taiteltu liian huolellisesti – joku on järjestellyt paikan.",
  },
  {
    id: "polttotahrat",
    locationId: "sauna",
    name: "Polttotahrat",
    category: "fyysinen",
    normalText:
      "Tuoreet polttotahrat laudeilla – kiuas ei ole ollut edes käynnissä tänä iltana.",
    syyllinenText:
      "Joku poltti kynnettä kiuaalle, se on vanha tapa. Ei merkittävää.",
    salaisuusHint: "Tahrat ovat käden muotoiset. Jotain on puristettu kiuasta vasten.",
  },
  {
    id: "koukku",
    locationId: "sauna",
    name: "Vääntynyt koukku",
    category: "fyysinen",
    normalText:
      "Seinäkoukku on vääntynyt vinoon, ikään kuin jostain raskaasta on roikkutettu.",
    syyllinenText: "Koukku on ollut lopsakkana jo vuosia. Vanhan rakennuksen vika.",
    salaisuusHint: "Koukku on uusi – se on asennettu tänä kesänä.",
  },
  {
    id: "tuhka",
    locationId: "grillikota",
    name: "Palaneet paperit",
    category: "asiakirja",
    normalText:
      "Tuhkassa on palaneen paperin jäänteitä. Palonumerossa näkyy katkelma: '...sopimus...'",
    syyllinenText:
      "Vanhat grillireseptit poltettu pois – mökin vanhan tavan mukaan.",
    salaisuusHint: "Paperin kulmat ovat suorat – se on poltettu kiireessä.",
  },
  {
    id: "pullonkorkit",
    locationId: "grillikota",
    name: "Pullonkorkit",
    category: "todistus",
    normalText:
      "Kymmeniä pullonkorkkeja kaadettuna lattialle – joku juhli pitkään yksin.",
    syyllinenText: "Koko porukka joi – ei ihme että korkkeja on paljon.",
    salaisuusHint: "Yksi korkeista on eri merkkiä kuin muut.",
  },
  {
    id: "hiilyveitsi",
    locationId: "grillikota",
    name: "Hiiltynyt veitsi",
    category: "fyysinen",
    normalText:
      "Grillissä on hiiltynyt veitsi – se ei kuulu grillikotaan. Terä on ehjä.",
    syyllinenText:
      "Käytettiin lihasien leikkaamiseen, pudotettiin grilliin vahingossa.",
    salaisuusHint: "Veitsessä on sama merkki kuin keittiöveitsessä.",
  },
  {
    id: "koysi",
    locationId: "laituri",
    name: "Katkaistu köysi",
    category: "fyysinen",
    normalText:
      "Laituria pitkin kulkeva köysi on katkaistu terävästi – ei kulunut poikki.",
    syyllinenText:
      "Vene oli rymähtänyt kovaan myrskyyn, köysi ratkesi tuulen painosta.",
    salaisuusHint: "Katkaisupinnassa on terävä kulma – saksilla tai veitsellä tehty.",
  },
  {
    id: "jalanjäljet",
    locationId: "laituri",
    name: "Tuoreet jalanjäljet",
    category: "fyysinen",
    normalText:
      "Märät jalanjäljet laiturilla. Kengännumero on pienempi kuin miltä henkilöltä odottaisi.",
    syyllinenText: "Joku kävi uimassa aiemmin illalla. Täysin normaalia.",
    salaisuusHint: "Jalanjäljet tulevat metsästä – ei mökin suunnasta.",
  },
  {
    id: "kolikko",
    locationId: "laituri",
    name: "Harvinainen kolikko",
    category: "epailyttava",
    normalText:
      "Harvinainen vanhan liiton markka löytyi laudan halkeamasta.",
    syyllinenText: "Joku tiputti kolikon sattumalta. Ei merkitystä.",
    salaisuusHint: "Kolikko on tasoitettu etupuolelta – se on käytetty avaamiseen.",
  },
  {
    id: "vene",
    locationId: "venevaja",
    name: "Siirretty vene",
    category: "epailyttava",
    normalText:
      "Toinen vene on siirretty – märät jäljet kostealla lattialla osoittavat sen.",
    syyllinenText: "Siirsimme veneen aamulla kalastusta varten. Jäi unohtuneeseen paikkaan.",
    salaisuusHint: "Vene on siirretty takaisin – mutta eri asentoon kuin aamulla.",
  },
  {
    id: "tankki",
    locationId: "venevaja",
    name: "Tyhjä polttoainetankki",
    category: "fyysinen",
    normalText:
      "Polttoainetankki on tyhjä – se täytettiin vasta eilen.",
    syyllinenText: "Moottori vuotaa. On pitänyt korjata jo pitkään.",
    salaisuusHint: "Tankin korkki on auki – polttoaine on kaadettu muualle.",
  },
  {
    id: "avain",
    locationId: "venevaja",
    name: "Tuntematon avain",
    category: "epailyttava",
    normalText:
      "Naulan kärjessä roikkuu avain, jota kukaan ei tunnista. Merkki: 'KS-7'.",
    syyllinenText: "Vanha varaosa jostain lukosta. Täysin merkityksetön.",
    salaisuusHint: "KS-7 on varasto numero 7:n koodi.",
  },
  {
    id: "lehdet",
    locationId: "metsakpolku",
    name: "Käännetyt lehdet",
    category: "fyysinen",
    normalText:
      "Polun maalehdot on sekoitettu käsin – joku on kaatunut tai ryöminyt tällä kohdin.",
    syyllinenText: "Kuusi putosi tuuleen täällä aiemmin. Lehdet lentelivät.",
    salaisuusHint: "Polun vieressä on kaivettu kuoppa – se on täytetty uudelleen.",
  },
  {
    id: "taskulamppu",
    locationId: "metsakpolku",
    name: "Sammutettu taskulamppu",
    category: "epailyttava",
    normalText:
      "Taskulamppu on hylätty polun varteen sammutettuna. Paristot ovat täynnä.",
    syyllinenText:
      "Joku lähti kävelylle, jätti lampun vahingossa. Löytyy aina.",
    salaisuusHint: "Lampussa on vieraita sormenjälkiä – se ei kuulu mökin varusteisiin.",
  },
  {
    id: "hihna",
    locationId: "metsakpolku",
    name: "Katkaistu hihna",
    category: "fyysinen",
    normalText:
      "Katkaistu koiran hihna roikkuu havupuun oksalla. Omistajaa ei näy.",
    syyllinenText: "Naapurin koira karkasi viime viikolla täältä.",
    salaisuusHint: "Hihna on katkaistu samaan tapaan kuin laiturinkköysi.",
  },
  {
    id: "lukko",
    locationId: "vanha_varasto",
    name: "Murrettu lukko",
    category: "fyysinen",
    normalText:
      "Riippulukko on murrettu – sala on rikki sisältäpäin.",
    syyllinenText: "Vanha lukko hajosi jo vuosia sitten. Ei murrettu.",
    salaisuusHint: "Lukon murtoviiva on tuore – se on tehty tällä viikolla.",
  },
  {
    id: "kaappi",
    locationId: "vanha_varasto",
    name: "Raaputettu kaappi",
    category: "asiakirja",
    normalText:
      "Kaapinlevyssä on raapimisia – joku on yrittänyt avata sitä väkisin.",
    syyllinenText: "Kaappi on ollut jumissa – reissulta palatessa se auki väkipakolla.",
    salaisuusHint: "Kaapissa on vedoksia asiakirjoista.",
  },
  {
    id: "suksi",
    locationId: "vanha_varasto",
    name: "Siirretty suksi",
    category: "epailyttava",
    normalText:
      "Vanhan suksiparin alla on tumma jälki lattialla – joku on siirtänyt suksen äskettäin.",
    syyllinenText: "Siivosin varastoa aamulla. Siirsin myös sukset.",
    salaisuusHint: "Lätäkön muoto vastaa astiaa, ei verta.",
  },
];

export function getCluesForScenario(scenario: Scenario | null): Clue[] {
  if (!scenario || Object.keys(scenario.clueOverrides).length === 0) {
    return BASE_CLUES;
  }
  return BASE_CLUES.map((clue) => {
    const override = scenario.clueOverrides[clue.id];
    if (!override) return clue;
    return { ...clue, ...override };
  });
}

export const CLUES = BASE_CLUES;

export const CLUES_BY_LOCATION: Record<string, Clue[]> = {};
for (const clue of BASE_CLUES) {
  if (!CLUES_BY_LOCATION[clue.locationId]) {
    CLUES_BY_LOCATION[clue.locationId] = [];
  }
  CLUES_BY_LOCATION[clue.locationId].push(clue);
}

export const CLUE_MAP: Record<string, Clue> = Object.fromEntries(
  BASE_CLUES.map((c) => [c.id, c])
);

export const CATEGORY_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  fyysinen:    { label: "Fyysinen todiste",   icon: "🔬", color: "#3b82f6" },
  todistus:    { label: "Todistajanlausunto", icon: "👁️", color: "#8b5cf6" },
  asiakirja:   { label: "Salainen asiakirja", icon: "📜", color: "#f59e0b" },
  epailyttava: { label: "Epäilyttävä esine",  icon: "❓", color: "#ef4444" },
};
