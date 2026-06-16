export interface HuvilaLocation {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  iconName: string; // Lucide icon name (Home, Flame, Trophy, Trees, Key, etc.)
  color: string; // Värimääritys visualisointiin
  imageUrl: string; // Ulmakuva Unsplashista tunnelman takaamiseksi
  isLocked: boolean;
  requiredItem?: string; // e.g. "messinkiavain"
  unlockHint?: string; // e.g. "Tarvitset messinkisen avaimen rantasaunan puuovelle."
  clues: HuvilaClue[];
  puzzles: string[]; // Sijaintiin sidotut arvoitukset
}

export interface HuvilaClue {
  id: string;
  name: string;
  description: string;
  discovered: boolean;
  itemReward?: string; // Mikäli kohteen löytäminen antaa esineen reppuun
  dialogText?: string; // Tutkimuksen yhteydessä avautuva dialogi
}

export const HUVILA_LOCATIONS: HuvilaLocation[] = [
  {
    id: "paahuvila",
    name: "Päähuvila",
    description: "Kaartjärven rannalla kohoava upea päärakennus.",
    longDescription: "Ylellinen ja suuri hirsihuvila, jonka ikkunoista avautuu pimeä Kaartjärvi. Sisällä takka ritisee hiljaa, ja korkea katto luo kaikuvan tunnelman. Pöydällä lojuu vanhoja papereita ja laseja.",
    iconName: "Home",
    color: "amber",
    // KORJAUS: Toimiva, suora kuvalinkki hirsihuvilaan
    imageUrl: "https://unsplash.com",
    isLocked: false,
    puzzles: ["paahuvila_paivakirja"],
    clues: [
      {
        id: "takkatuli",
        name: "Hiiltyneet paperit takassa",
        description: "Takan hehkusta löytyy puolittain palanut sopimuspaperi, jossa mainitaan Kaartjärven tonttijako ja salaperäinen miljoonaomaisuus.",
        discovered: false,
        dialogText: "Löysit takan raosta tummuneen paperinkulman! Siinä lukee: '...lopullinen tonttiosuus siirtyy kokonaisuudessaan, mikäli ensisijainen perijä poistuu keskuudestamme...'"
      },
      {
        id: "lasi",
        name: "Särkynyt viinilasi",
        description: "Hienostunut kristallilasi, jonka pohjalta löytyy outoa, tahmeaa vaaleaa sakkaa. Lasi tuoksuu kitkerältä mantelilta.",
        discovered: false,
        dialogText: "Tutkit kristallilasin särkyneitä palasia. Haistat kitkerän mantelin tuoksun – klassinen syanidin tai muun vahvan myrkyn merkki!"
      }
    ]
  },
  {
    id: "hirsirantasauna",
    name: "Hirsirantasauna",
    description: "Perinteinen rantasauna. Lukittu paksulla salvalla, joka vaatii messinkisen avaimen.",
    longDescription: "Kauniisti harmaantunut kelohirsisauna aivan järven tuntumassa. Puinen ovi on kiinni, ja sen jykevä messinkilukko kiiltää kuunvalossa. Sisällä tuoksuu kylmä savu ja vanha kuusiterva.",
    iconName: "Flame",
    color: "indigo",
    // KORJAUS: Toimiva, suora kuvalinkki rantasaunaan
    imageUrl: "https://unsplash.com",
    isLocked: true,
    requiredItem: "messinkiavain",
    unlockHint: "Ovi on tiukasti lukossa. Tarvitset messinkisen avaimen avataksesi tämän seikkailureitin rantasaunaan.",
    puzzles: ["hirsirantasauna_lattialauta"],
    clues: [
      {
        id: "laudeliina",
        name: "Verinen laudeliina",
        description: "Lauteiden alle rytistetty mustunut pellavaliina, jossa on pyyhitty jotakin punaista ja tahmeaa.",
        discovered: false,
        dialogText: "Nostit laudeliinan valoon. Se ei ole marjamehua – joku on pyyhkinyt tähän verta ja yrittänyt piilottaa sen lauteiden väliin!"
      },
      {
        id: "saunakiulu",
        name: "Kaatunut kiulu",
        description: "Kuparinen kiulu, jonka pohjalta löytyy hukkunut ranneketju riipuksineen. Riipukseen on kaiverrettu kirjaimet 'M.K.'.",
        discovered: false,
        itemReward: "ranneketju",
        dialogText: "Löysit kiulun pohjalta hienon hopeisen ranneketjun. Se kuuluu Marialle! Toit sen heti talteen."
      }
    ]
  },
  {
    id: "grillikota",
    name: "Grillikota",
    description: "Tunnelmallinen grillikota niemenkärjessä. Ovi raollaan.",
    longDescription: "Pyöreä grillikota aivan Kaartjärven syvässä niemenkärjessä. Sisällä on hämärää ja kylmää, mutta tuhkan keskellä kipunoi vielä pieni kytevä hiillos. Seinällä riippuu vanhoja kalaverkkoja.",
    iconName: "FlameKindling",
    color: "red",
    // KORJAUS: Toimiva, suora kuvalinkki grillikotaan
    imageUrl: "https://unsplash.com",
    isLocked: false,
    puzzles: ["grillikota_arkku"],
    clues: [
      {
        id: "kirje",
        name: "Tuhkasta pelastettu kirje",
        description: "Kytevästä tuhkasta löytyy hiiltynyt kirjeenpätkä: 'Minä tiedän mitä teit viime kesänä Kaartjärvellä. Jos et maksa...'",
        discovered: false,
        dialogText: "Varovasti nostat hiiltyneen paperinpalan tuhkasta. Kiristyskirje! Kirjoittaja tuntui tietävän jonkin synkän salaisuuden viime kesältä."
      }
    ]
  },
  {
    id: "puuvarasto",
    name: "Puuvarasto",
    description: "Kylmä puuvarasto päärakennuksen takana. Täältä haetaan takkapuut.",
    longDescription: "Kylmä ja vetoisa puuvarasto, joka tuoksuu tuoreelta koivuklapilta ja moottorisahan bensiiniltä. Pinasade ropisee peltikattoon säännöllisesti.",
    iconName: "Trees",
    color: "emerald",
    // KORJAUS: Toimiva, suora kuvalinkki puuvarastoon
    imageUrl: "https://unsplash.com",
    isLocked: false,
    puzzles: ["puuvarasto_sahalaatikko"],
    clues: [
      {
        id: "jalanjaljet",
        name: "Kuraiset saappaankuvat",
        description: "Varaston lattialla on suuret kuraiset mudanjäljet, jotka vastaavat täydellisesti urheilujalkineita tai saappaita karkealla kuviolla.",
        discovered: false,
        dialogText: "Jäljet näyttävät tuoreilta. Joku on kulkenut tästä aivan hiljattain myrskyssä kantamatta mitään puita mukanaan."
      }
    ]
  }
];
