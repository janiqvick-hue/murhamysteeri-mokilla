import type { Clue } from "../types";
import type { Scenario } from "../types";

// Vihjeluokkien tyylittelyt
export const CATEGORY_LABELS: Record<string, { label: string; color: string; icon: string }> = {
  fyysinen: { label: "Fyysinen todiste", color: "#ef4444", icon: "🗡️" },
  asiakirja: { label: "Dokumentti", color: "#3b82f6", icon: "📄" },
  epailyttava: { label: "Epäilyttävä havainto", color: "#f59e0b", icon: "👀" },
  todistus: { label: "Motiivi / Todistus", color: "#10b981", icon: "⚖️" }
};

export const BASE_CLUES: Clue[] = [
  {
    id: "veitsi",
    locationId: "paamokki",
    name: "Keittiöveitsi",
    category: "fyysinen",
    normalText:
      "Keittiöveitsi löytyi epätavallisesta paikasta – olohuoneen sohvan alta. Terässä on tumma tahra.",
    syyllinenText:
      "Keittiöveitsi on pudonnut sohvan alle. Tahra on vain puolukkamehua.",
    salaisuusHint: "Veitsessä on merkkejä kiireestä – joku yritti piilottaa sen hätäisesti.",
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
    salaisuusHint: "Kirje on kirjoitettu ja tuotu mökille samana päivänä kuin tapahtuma.",
  },
  {
    id: "malja",
    locationId: "paamokki",
    name: "Viskimalja",
    category: "epailyttava",
    normalText:
      "Puolityhjä viskimalja – reunassa vain yksi huulijälki. Toinen malja on koskematon.",
    syyllinenText: "Kaksi maljaa, kaksi juojaa. Normaalia illanviettoa ennen tragediaa.",
    salaisuusHint: "Koskemattomassa maljassa on outo, mantelimainen tuoksu. Myrkkyä?",
  },
  {
    id: "kello",
    locationId: "paamokki",
    name: "Rikkinäinen taskukello",
    category: "fyysinen",
    normalText:
      "Uhrin taskukello löytyi lattialta rikoutuneena. Se on pysähtynyt tasan aikaan 02:15.",
    syyllinenText:
      "Kello oli vanha ja tipahti pöydältä vahingossa. Aika on sattumaa.",
    salaisuusHint: "Kellon lasissa on syviä naarmuja, jotka viittaavat kamppailuun.",
  },
  {
    id: "pyyhe",
    locationId: "sauna",
    name: "Verinen pyyhe",
    category: "fyysinen",
    normalText:
      "Pyyhe on taiteltu huolellisesti kiuaalle. Punertavia tahroja kuiduissa.",
    syyllinenText:
      "Kylpijä on vain raapinut ihoa tai saanut pienen haavan. Ei merkittävää.",
    salaisuusHint: "Pyyhe on taiteltu liian huolellisesti – joku on yrittänyt siivota jälkiä saunalla.",
  },
  {
    id: "polttotahrat",
    locationId: "sauna",
    name: "Polttotahrat",
    category: "fyysinen",
    normalText:
      "Tuoreet polttotahrat lauteilla – kiuas ei ole ollut edes käynnissä tänä iltana.",
    syyllinenText:
      "Joku poltti tulitikkua lauteilla pimeässä. Vanha tapa, ei merkitystä.",
    salaisuusHint: "Tahrat ovat käden muotoiset. Jotain on puristettu kiuasta vasten voimakkaasti.",
  },
  {
    id: "koukku",
    locationId: "sauna",
    name: "Vääntynyt koukku",
    category: "fyysinen",
    normalText:
      "Seinäkoukku on vääntynyt vinoon, ikään kuin jostain raskaasta taakasta.",
    syyllinenText: "Koukku on ollut löysänä jo vuosia. Vanhan mökkirakennuksen vikoja.",
    salaisuusHint: "Koukku on uusi – se on asennettu mökille vasta tänä kesänä.",
  },
  {
    id: "tuhka",
    locationId: "grillikota",
    name: "Palaneet paperit",
    category: "asiakirja",
    normalText:
      "Tuhkassa on palaneen paperin jäänteitä. Palaneessa kulmassa näkyy teksti: '...testamentti...'",
    syyllinenText:
      "Vanhat grillireseptit tai roskat poltettu pois mökin tavan mukaan.",
    salaisuusHint: "Paperi liittyy uhrin perintökiistoihin ystäväpiirin sisällä.",
  },
  {
    id: "pullonkorkit",
    locationId: "grillikota",
    name: "Pullonkorkit",
    category: "todistus",
    normalText:
      "Kymmeniä pullonkorkkeja kaadettuna lattialle – joku vietti pitkään aikaa täällä.",
    syyllinenText: "Koko seurue joi yhdessä – ei ihme että korkkeja löytyy paljon.",
    salaisuusHint: "Yksi korkeista on täysin eri merkkiä, jota kukaan teistä ei tuonut mökille.",
  },
  {
    id: "hiilyveitsi",
    locationId: "grillikota",
    name: "Hiiltynyt veitsi",
    category: "fyysinen",
    normalText:
      "Grillipesässä on hiiltynyt veitsi – se ei kuulu grillikodan varustukseen.",
    syyllinenText:
      "Käytettiin lihan kääntämiseen ja pudotettiin grilliin vahingossa.",
    salaisuusHint: "Veitsen kahvassa on sama uniikki valmistajan merkki kuin keittiön pääveitsessä.",
  },
  {
    id: "koysi",
    locationId: "laituri",
    name: "Katkaistu köysi",
    category: "fyysinen",
    normalText:
      "Laituria pitkin kulkeva köysi on katkaistu terävästi – se ei ole kulunut poikki.",
    syyllinenText:
      "Vene rymähti myrskyyn ja köysi ratkesi kovan tuulen painosta.",
    salaisuusHint: "Katkaisupinnassa on viiltojälki – tehty erittäin terävällä veitsellä.",
  },
  {
    id: "jalanjäljet",
    locationId: "laituri",
    name: "Tuoreet jalanjäljet",
    category: "fyysinen",
    normalText:
      "Märät jalanjäljet laiturilla. Kengännumero on yllättävän pieni.",
    syyllinenText: "Joku kävi uimassa tai hakemassa vettä aiemmin illalla. Normaalia.",
    salaisuusHint: "Jalanjäljet johtavat pimeästä metsästä suoraan laiturille – ei mökin suunnasta.",
  },
  {
    id: "puhelin",
    locationId: "laituri",
    name: "Uhrin puhelin",
    category: "epailyttava",
    normalText:
      "Uhrin lukittu matkapuhelin löytyi laiturin alta kastuneena. Ei verkkoa.",
    syyllinenText: "Hän pudotti sen sinne itse ennen kuolemaansa.",
    salaisuusHint: "Puhelimen näytössä näkyy viimeisin luonnosteltu tekstiviesti: 'Yksi meistä tietää'.",
  },
  {
    id: "vene",
    locationId: "venevaja",
    name: "Siirretty vene",
    category: "epailyttava",
    normalText:
      "Soutuvene on siirretty – märät ja hiekkaiset jäljet lattialla paljastavat sen.",
    syyllinenText: "Venettä siirrettiin aamulla kalastusta varten. Jäi vain eri paikkaan.",
    salaisuusHint: "Vene on siirretty takaisin venevajaan myrskyn alettua – mutta eri asentoon kuin aiemmin.",
  },
  {
    id: "tankki",
    locationId: "venevaja",
    name: "Tyhjä polttoainetankki",
    category: "fyysinen",
    normalText:
      "Perämoottorin polttoainetankki on täysin tyhjä – vaikka se täytettiin vasta eilen.",
    syyllinenText: "Moottori luultavasti vuotaa bensiiniä. Se on pitänyt korjata jo pitkään.",
    salaisuusHint: "Tankin korkki on jätetty auki ja polttoaine on kaadettu maahan pakenemisen estämiseksi.",
  },
  {
    id: "avain",
    locationId: "venevaja",
    name: "Tuntematon avain",
    category: "epailyttava",
    normalText:
      "Naulan kärjessä roikkuu avain, jota kukaan mökkiseurueesta ei tunnista. Merkki: 'M-4'.",
    syyllinenText: "Vanha vara-avain johonkin mökin vanhaan riippulukkoon. Merkityksetön.",
    salaisuusHint: "Avaimen 'M-4' koodi vastaa vanhan ulkovaraston ovea.",
  },
  {
    id: "lehdet",
    locationId: "metsakpolku",
    name: "Käännetyt lehdet",
    category: "fyysinen",
    normalText:
      "Polun varren maasto on sekoitettu – aivan kuin joku olisi kaatunut tai ryöminyt tällä kohdin.",
    syyllinenText: "Myrskytuuli repi puunoksia ja lennätti lehtiä ympäriinsä.",
    salaisuusHint: "Polun vieressä sammalta on yritetty siirtää takaisin hätäisesti täytetyn kuopan päälle.",
  },
  {
    id: "taskulamppu",
    locationId: "metsakpolku",
    name: "Hylätty taskulamppu",
    category: "epailyttava",
    normalText:
      "Taskulamppu on hylätty polun varteen sammutettuna. Paristot ovat yhä täynnä.",
    syyllinenText: "Joku pudotti sen iltakävelyllä pimeässä. Löytyy sieltä usein.",
    salaisuusHint: "Taskulampun pinnassa on outoja mutatahroja – se ei kuulu mökin omiin varusteisiin.",
  },
  {
    id: "saappaat",
    locationId: "metsakpolku",
    name: "Mutaiset saappaat",
    category: "fyysinen",
    normalText:
      "Pari mutaisia kumisaappaita on piilotettu tiheän kuusen alle polun varteen.",
    syyllinenText: "Joku jätti ne sinne kuivumaan sateesta huolimatta.",
    salaisuusHint: "Saappaiden pohjakuvio täsmää täydellisesti laiturilta löytyneisiin jalanjälkiä.",
  }
];

export function getCluesForScenario(scenario: Scenario | null): Clue[] {
  if (!scenario || !scenario.clueOverrides || Object.keys(scenario.clueOverrides).length === 0) {
    return BASE_CLUES;
  }
  return BASE_CLUES.map((clue) => {
    const override = scenario.clueOverrides[clue.id];
    if (override) {
      return { ...clue, ...override };
    }
    return clue;
  });
}
