export interface HuvilaPOI {
  id: string;
  name: string;
  description: string;
}

export interface HuvilaLocation {
  id: string;
  name: string;
  description: string;
  isLocked: boolean;
  requiredItemId?: string;
  pois: HuvilaPOI[]; // Lista huoneesta löytyvistä tutkimuspisteistä
}

export const HUVILA_LOCATIONS: HuvilaLocation[] = [
  {
    id: "paahuvila",
    name: "🏛️ Suuri Päähuvila",
    description: "Kaksikerroksinen luksushuvila Kaartjärven rannalla. Olohuoneen pöydällä lojuu vanha päiväkirja, jonka lukko on lukittu nelinumeroisella koodilla. Saunan avain näyttää olevan lukon takana.",
    isLocked: false,
    pois: [
      {
        id: "takka",
        name: "Olohuoneen suuri takka",
        description: "Takan reunuksella on vanha valokuvakehys. Kuvassa Henrik Kaartinen poseeraa huvilan edustalla vuonna 1984. Henrik on ympyröinyt kuvaan huvilan eteläsivun ikkunat (niitä on täsmälleen 8)."
      },
      {
        id: "kirjahylly",
        name: "Tamminen kirjahylly",
        description: "Hyllyt ovat täynnä Lopen historiaa käsitteleviä teoksia. Yhden kirjan välistä löytyy muistilappu: 'Muista Henrik, kiukaan salaisuus aukeaa sille, joka tuntee rannan huutavan linnun...'"
      }
    ]
  },
  {
    id: "rantasauna",
    name: "🪵 Hirsirantasauna",
    description: "Perinteinen puulämmitteinen sauna aivan rantaviivassa. Ovi on lukossa. Tarvitset päähuvilasta löytyvän vanhan messinkisen avaimen päästäksesi sisään.",
    isLocked: true,
    requiredItemId: "messinkiavain",
    pois: [
      {
        id: "lauteet",
        name: "Saunan ylälauteet",
        description: "Hämärässä saunassa tuoksuu vanha terva. Lauteiden alta löytyy kastunut paperilappu, jossa puhutaan kiukaan salaisuudesta ja Kaartjärvellä huutavasta linnusta."
      }
    ]
  },
  {
    id: "grillikota",
    name: "🔥 Grillikota",
    description: "Pyöreä kota Kaartjärven pihapiirin laidalla. Keskellä olevassa tulipasassa savuaa vielä. Tuhkasta pilkottaa metallinen rasia, jossa on omituinen hammasratas-pulma.",
    isLocked: false,
    pois: [
      {
        id: "tulipesa",
        name: "Nokeentunut tulipesa",
        description: "Tulipesän pohjalla on kylmää tuhkaa. Jos sinulla on valoa (kuten taskulamppu), näet tuhkasta pilkottavan metallisen rasian, jossa on mekaaninen hammasrataslukko."
      },
      {
        id: "kodan_seinat",
        name: "Kodan hirsiseinät",
        description: "Seinille on ripustettu vanhoja kalastusverkkoja ja Lopen vanhoja karttoja, jotka kuvaavat Kaartjärven pohjan muotoja."
      }
    ]
  },
  {
    id: "puuvarasto",
    name: "🪓 Puuvarasto & Liiteri",
    description: "Hämärä varasto täynnä kuivia klapeja. Työkaluseinällä on tyhjä paikka kirveelle. Seinään on kaiverrettu outoja viivoja, jotka näyttävät numerovihjeeltä.",
    isLocked: false,
    pois: [
      {
        id: "tyokaluseina",
        name: "Varaston työkaluseinä",
        description: "Työkaluseinään on piirretty kirveen ääriviivat, mutta itse kirves puuttuu. Seinälautaan on kaiverrettu luku 12 ja sen viereen risti (X)."
      },
      {
        id: "klapipino",
        name: "Suuri koivuklapipino",
        description: "Pino on ladottu millintarkasti. Laskemalla rivit huomaat, että siinä on täsmälleen 12 riviä puita päällekkäin ja jokaisessa rivissä on 12 halkoa."
      }
    ]
  }
];
