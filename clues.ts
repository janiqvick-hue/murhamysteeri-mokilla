import type { Clue } from "../types";

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
    name: "Verinen keittiöveitsi",
    category: "fyysinen",
    normalText: "Keittiötasolta kadonnut suuri veitsi, jossa on tuoreita jälkiä takan vieressä. Terä on pesty kiireessä, mutta kahvassa on vielä jotain punaista.",
    syyllinenText: "Keittiöveitsi on pesty hyvin. Punainen tahra kahvassa on vain maalia kunnostusprojektista.",
    salaisuusHint: "Veitsen kahvassa on merkkejä siitä, että joku yritti pyyhkiä sormenjälkiä hätäisesti."
  },
  {
    id: "kirje",
    locationId: "paamokki",
    name: "Repaleinen uhkauskirje",
    category: "asiakirja",
    normalText: "Kirje, jossa uhataan paljastaa vanha petos, jos vaadittua summaa ei makseta. Allekirjoitettu salaperäisellä 'X'-kirjaimella.",
    syyllinenText: "Tämä on pelkkää vanhaa pilailua ystävien kesken vuosia sitten.",
    salaisuusHint: "Kirjeen paperilaatu täsmää päämökin työpöydällä olevaan lehtiöön."
  },
  {
    id: "viskimalja",
    locationId: "paamokki",
    name: "Klassinen viskilasi",
    category: "epailyttava",
    normalText: "Lasi olohuoneen pöydällä, jonka pohjalla on sentti hienoa rusehtavaa nestettä. Tuoksu on omituisen mantelimainen, mikä viittaa syanidiin.",
    syyllinenText: "Lasi on täysin normaalia ja puhdasta viskiä illanvietosta.",
    salaisuusHint: "Mantelin tuoksu on voimakas – tähän lasiin on selvästi sekoitettu jotain vierasta."
  },
  {
    id: "kello",
    locationId: "laituri",
    name: "Särkynyt kultakello",
    category: "fyysinen",
    normalText: "Laatukello, jonka lasi on pirstaleina ja viisarit pysähtyneet tasan kello 02:14. Ranneke on revennyt väkivaltaisesti.",
    syyllinenText: "Kello hajosi kun se tipahti laiturille vahingossa aiemmin päivällä.",
    salaisuusHint: "Rannekkeen repeämä paljastaa, että kello on kiskottu ranteesta voimalla."
  },
  {
    id: "pyyhe",
    locationId: "sauna",
    name: "Märkä, tuoksuva pyyhe",
    category: "fyysinen",
    normalText: "Lölyhuoneen nurkkaan mytätty pyyhe, joka tuoksuu petrolilta ja bensiiniltä, ei suinkaan saunaöljyltä.",
    syyllinenText: "Pyyhkeellä puhdistettiin vain moottorin osia aamupäivällä.",
    salaisuusHint: "Pyyhkeessä on myös tummia noki- ja kuitujälkiä, jotka viittaavat polttamiseen."
  },
  {
    id: "polttotahrat",
    locationId: "grillikota",
    name: "Muoviset polttotahrat",
    category: "fyysinen",
    normalText: "Kota-tulen loimussa sulaneen muovin jättämät tummat läikät penkillä. Joku on yrittänyt hävittää täällä jotain synteettistä.",
    syyllinenText: "Grillatessa tipahti vahingossa muovinen pakkaus pussista nuotioon.",
    salaisuusHint: "Sulanut muovi haisee erittäin pistävältä, aivan kuin jokin synteettinen vaate tai lompakko olisi poltettu."
  },
  {
    id: "tuhka",
    locationId: "grillikota",
    name: "Hienon paperin tuhka",
    category: "asiakirja",
    normalText: "Tulisijassa palaneen paksun paperin jäänteet. Suikaleesta erottuu sanoja ja leima, joka viittaa viralliseen lääkäritodistukseen.",
    syyllinenText: "Tuhka on vain vanhoja sanomalehtiä, joita käytettiin sytytyksenä.",
    salaisuusHint: "Leiman jäänteet paljastavat todistuksen olleen salainen ja tuore."
  },
  {
    id: "pullonkorkit",
    locationId: "grillikota",
    name: "Lääkekapselin korkit",
    category: "todistus",
    normalText: "Pöydän alle vieraiden silmiltä vierineet pullokorkit. Ne kuuluvat vahvoille rauhoittaville lääkkeille, joita ei pitäisi sekoittaa alkoholiin.",
    syyllinenText: "Nämä ovat vanhoja vitamiinipullon korkkeja mökin varastoista.",
    salaisuusHint: "Korkeissa on tuoretta lääkepölyä – purkki on avattu hiljattain."
  },
  {
    id: "hiilyveitsi",
    locationId: "grillikota",
    name: "Puoliksi hiiltynyt retkiveitsi",
    category: "fyysinen",
    normalText: "Hiilien joukosta pilkottava metallikahvainen retkiveitsi. Sen terässä on syviä uria ja iskujälkiä, aivan kuin sitä olisi käytetty lukkojen murtamiseen.",
    syyllinenText: "Veitsellä vain pilkottiin puita ja se unohdettiin hiillokseen.",
    salaisuusHint: "Iskujäljet täsmäävät täydellisesti vanhan varaston murrettuun lukkoon."
  },
  {
    id: "koysi",
    locationId: "venevaja",
    name: "Karkea tervaköysi",
    category: "fyysinen",
    normalText: "Venevajan tukihirrestä katkaistu köysi. Pätkä puuttuu, ja leikkausjälki on tehty erittäin tylpällä tai sahahampaisella terällä.",
    syyllinenText: "Köysi katkesi itsestään kovan rasituksen ja painon vuoksi.",
    salaisuusHint: "Katkaisupinnassa näkyy sahausjälkiä – se on katkaistu tahallaan retkiveitsellä."
  },
  {
    id: "jalanjäljet",
    locationId: "metsakpolku",
    name: "Kuraiset jalanjäljet",
    category: "fyysinen",
    normalText: "Isot, karkeakuvioiset saappaiden jäljet, jotka johtavat tontin laidalta suoraan laituria kohti ja palaavat metsään kierrosreittiä pitkin.",
    syyllinenText: "Joku kävi vain hakemassa polttopuita metsästä aiemmin sateessa.",
    salaisuusHint: "Jäljet on tehty erittäin kiireessä, sillä askelväli on poikkeuksellisen pitkä."
  },
  {
    id: "puhelin",
    locationId: "metsakpolku",
    name: "Lätäkössä lojuva puhelin",
    category: "epailyttava",
    normalText: "Kallis älypuhelin, joka on upotettu veteen. Akku on revitty irti ja heitetty erikseen. Puhelimen SIM-korttipaikka on tyhjä.",
    syyllinenText: "Puhelin tippui taskusta lätäkköön ja hajosi vahingossa.",
    salaisuusHint: "SIM-kortin puuttuminen todistaa, että puhelin haluttiin mykistää pysyvästi."
  },
  {
    id: "vene",
    locationId: "laituri",
    name: "Puinen soutuvene",
    category: "epailyttava",
    normalText: "Mökin rannassa oleva soutuvene, joka keikkuu aallokossa. Huomattavaa on, että molemmat airot ja lukitustappi ovat poissa.",
    syyllinenText: "Airot vietiin venevajaan suojaan myrskyltä, kuten kuuluukin.",
    salaisuusHint: "Lukitustappi on katkaistu väkivalloin, veneellä yritettiin lähteä kiireessä."
  },
  {
    id: "tankki",
    locationId: "vanha_varasto",
    name: "Tyhjä bensiinikannu",
    category: "fyysinen",
    normalText: "Vihreä 5 litran peltitankki, joka tuoksuu tuoreelta bensiiniltä. Korkki on jätetty auki ja kanisterissa on tuore naarmu saunan avaimenperästä.",
    syyllinenText: "Kannu on ollut tyhjänä varastossa jo viime kesästä lähtien.",
    salaisuusHint: "Kannun pohjalla on vielä muutama tippa tuoretta polttoainetta, jota käytettiin saunalla."
  },
  {
    id: "avain",
    locationId: "vanha_varasto",
    name: "Ruosteinen varaston avain",
    category: "epailyttava",
    normalText: "Rengasavaimen perään hätäisesti liitetty kulunut avain, joka sopii päämökin lukittuun isännänkaappiin.",
    syyllinenText: "Tämä on vain vanha hylätty avain, joka ei sovi mihinkään mökin lukkoon.",
    salaisuusHint: "Avain on putsattu äskettäin öljyllä, sitä on käytetty tänä yönä."
  },
  {
    id: "lehdet",
    locationId: "paamokki",
    name: "Vieraskirjan revityt sivut",
    category: "asiakirja",
    normalText: "Mökin vieraskirja hyllyssä, mutta siitä on revitty irti koko edellisen vuoden sivut. Viimeinen jäljellä oleva merkintä on vihjaileva saatesana.",
    syyllinenText: "Sivut repiytyivät kun kirja putosi maahan remontin yhteydessä.",
    salaisuusHint: "Sivut on leikattu siististi veitsellä – joku halusi pyyhkiä historian."
  },
  {
    id: "taskulamppu",
    locationId: "metsakpolku",
    name: "Rikkoutunut taskulamppu",
    category: "epailyttava",
    normalText: "Märästä mustikanvarvukosta löytynyt metallinen taskulamppu. Paristolokero on täynnä järvivettä, ja lasissa on verta.",
    syyllinenText: "Taskulamppu unohtui metsään ja joku astui sen päälle.",
    salaisuusHint: "Verijäljet lasissa viittaavat siihen, että taskulamppua käytettiin lyömäaseena."
  },
  {
    id: "saappaat",
    locationId: "sauna",
    name: "Ylimääräiset kumisaappaat",
    category: "fyysinen",
    normalText: "Pukuhuoneen penkin alla olevat saappaat, kokoa 44. Pohjiin on tarttunut tuoretta turvetta ja pienenpieniä lasinsirpaleita päämökin lasista.",
    syyllinenText: "Saappaat kuuluvat mökin omistajalle, niitä käytetään pihatöissä.",
    salaisuusHint: "Lasinsirpaleet täsmäävät täydellisesti olohuoneen rikkoutuneeseen viskilasiin."
  }
];

export const CLUE_MAP: Record<string, Clue> = Object.fromEntries(
  BASE_CLUES.map((c) => [c.id, c])
);

export function getCluesForScenario(scenario: any): Clue[] {
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
