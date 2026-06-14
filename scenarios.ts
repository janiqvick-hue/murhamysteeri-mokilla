import type { Scenario } from "../../types";

export const SCENARIOS_POOL: any[] = [
  {
    id: "saunan_salaisuus", // Käytetään tätä id:tä tarinalinkitysten säilyttämiseksi
    name: "Myrkkyä ja Myrskyä",
    subtitle: "Ystävyyssuhteet katkeavat myrkylliseen maljaan",
    victim: "Mikael, mökin varakas perijä",
    victimLocation: "paamokki",
    motive: "Halu estää mökkitontin myynti gryndereille ja sijoittajille hinnalla millä hyvänsä.",
    method: "Keskiyön jälkeen joku lisäsi hänen viskilasiinsa lääkekaapista varastettuja rauhoittavia aineita.",
    hiddenSecret: "Mikael ei juonut yksin. Toinen henkilö huoneessa auttoi siivoamaan pöytää ja on edelleen vapaa.",
    setting: "Mikael oli päättänyt myydä yhteisen mökkitontin ulkopuolisille sijoittajille, mikä herätti raivoa ystävissä. Aamulla hänet löydettiin kuolleena nojatuolistaan.",
    secretForVartija: "Mikael oli laatinut uuden testamentin juuri ennen kuolemaansa. Se hyödyttää vain yhtä henkilöä seurueesta ja se paperi on yhä täällä.",
    clueOverrides: {
      viskimalja: {
        normalText: "Etsijän vihje: Ylellinen lasi, jossa on makea, mantelimainen tuoksu. Tavallinen viski ei tuoksu tältä. Tuoksu viittaa vahvaan kemikaaliin.",
        syyllinenText: "Syyllisen ohje: Tämä on se lasi! Jos joku löytää tämän, väitä että Mikael joi omia uutteitaan tai kärsi pitkään sydänvaivoista."
      },
      pullonkorkit: {
        normalText: "Etsijän vihje: Pöydän alle vierineet sinertävät korkit, jotka sopivat saunan lääkekaapissa säilytettyyn rauhoittavien purkkiin. Joku toi aineen mukanaan.",
        syyllinenText: "Syyllisen ohje: Pudotit nämä hätäpäissäsi takan viereen. Jos joku kysyy, väitä jonkun muun hakeneen päänsärkylääkettä saunalta."
      }
    },
    witnessEventTemplates: [
      {
        id: "ss_event1",
        title: "Kolahdus keittiöstä",
        text: "Mökkiläiset kuulivat oudon lasisen kilahduksen päämökistä noin puoli kahdentoista aikaan yöllä. Se ei kuulostanut tuulen vinkunalta.",
        locationHint: "Päämökki",
        revealDelayMs: 2 * 60 * 1000,
      },
      {
        id: "ss_event2",
        title: "Rantahavainto",
        text: "Saunan lääkekaapin ovi havaittiin olevan raollaan. Joku on selvästi käynyt siellä myrskyn aikana etsimässä jotain.",
        locationHint: "Sauna",
        revealDelayMs: 5 * 60 * 1000,
      },
      {
        id: "ss_event3",
        title: "Palanut suikale",
        text: "Grillikodan tuhkasta löytyi puoleksi palanut paperin pala, jossa lukee: '…summa sovittu, tontti siirtyy…'",
        locationHint: "Grillikota",
        revealDelayMs: 8 * 60 * 1000,
      }
    ],
    redHerringTemplates: [
      {
        id: "ss_rh1",
        locationId: "paamokki",
        name: "Sormenjälkihavainto",
        normalTextTemplate: "Päämökin viskipullon kyljestä löytyi tuore rasvainen sormenjälki, joka muistuttaa pelaajan {target} peukaloa. Oliko hän kaatamassa juomaa?"
      },
      {
        id: "ss_rh2",
        locationId: "grillikota",
        name: "Hermostunut käytös",
        normalTextTemplate: "{target} muuttui hermostuneeksi ja poistui nopeasti paikalta, kun Mikaelin perintöasia mainittiin. Reaktio oli silmiinpistävä."
      }
    ]
  },
  {
    id: "laiturin_varjo",
    name: "Yöllinen Laituritaistelu",
    subtitle: "Pimeässä lohkossa riehunut myrsky hukutti totuuden",
    victim: "Tuomas, seurueen hiljainen tarkkailija",
    victimLocation: "laituri",
    motive: "Kiristyksen kääntäminen hiljaiseksi vedeksi. Tuomas tiesi salaisuuden, jota ei olisi saanut tietää.",
    method: "Tuomas tönäistiin järveen laiturilta kiivaan käsirysyn päätteeksi. Hänen kellonsa pysähtyi iskun voimasta.",
    hiddenSecret: "Tuomas yritti paeta mökistä yöllä rantaan, mutta joku seurasi häntä taskulampun kanssa pimeässä metsässä.",
    setting: "Tuomas oli saanut selville jotain arkaluontoista. Hän lähti yöllä rantaan. Myöhemmin hänet löydettiin hukkuneena rannan matalikosta.",
    secretForVartija: "Tuomas oli ottanut salaa valokuvia illan tapahtumista ennen kuolemaansa. Muistikortti on piilossa ja siinä on kuva syyllisestä laiturilla.",
    clueOverrides: {
      kello: {
        normalText: "Etsijän vihje: Tuomaan särkynyt Rolex. Ranneke on pettänyt ja lasi pirstaleina. Viisarit ovat jumiutuneet osoittamaan kuolinaikaa 02:14.",
        syyllinenText: "Syyllisen ohje: Kello todistaa rikoksen tarkan ajan! Sano, että olit tuolloin jo nukkumassa omassa huoneessasi ja kuulit vain sateen."
      }
    },
    witnessEventTemplates: [
      {
        id: "lv_event1",
        title: "Raskas loiske",
        text: "Mökkiin kuului vaimea huuto ja raskas roiskaus järveltä noin klo 02:15. Ääni hukkui nopeasti ukkosen jyrinään.",
        locationHint: "Laituri",
        revealDelayMs: 2 * 60 * 1000,
      },
      {
        id: "lv_event2",
        title: "Taskulampun välähdys",
        text: "Yksi pelaajista muistaa nähneensä taskulampun valon välähtävän metsäpolulla matkalla rantaan kahden maissa yöllä.",
        locationHint: "Metsäpolku",
        revealDelayMs: 5 * 60 * 1000,
      },
      {
        id: "lv_event3",
        title: "Venevajan havainto",
        text: "Venevajassa on siirretty tavaroita ja lattialla on tuoreita mudan sekaisia jalanjälkiä, jotka johtavat laiturille.",
        locationHint: "Venevaja",
        revealDelayMs: 8 * 60 * 1000,
      }
    ],
    redHerringTemplates: [
      {
        id: "lv_rh1",
        locationId: "laituri",
        name: "Laiturijälki",
        normalTextTemplate: "Laiturin liukkaalla puupinnalla näkyy naarmu, joka vastaa pelaajan {target} kengän metallisolkea. Kävikö hänkin laiturilla?"
      },
      {
        id: "lv_rh2",
        locationId: "metsakpolku",
        name: "Kadotettu esine",
        normalTextTemplate: "Metsäpolulta mustikanvarvukosta löytyi irronnut nappi, joka muistuttaa täsmälleen pelaajan {target} takkia."
      }
    ]
  },
  {
    id: "kadonnut_vieras",
    name: "Sulkutila Venevajassa",
    subtitle: "Laura lukittiin venevajaan myrskyisänä yönä",
    victim: "Laura, menestyvä asianajaja",
    victimLocation: "venevaja",
    motive: "Talousrikosten paljastumisen estäminen ja oman uran pelastaminen hinnalla millä hyvänsä.",
    method: "Laura houkuteltiin venevajaan, ovi vedettiin lukkoon ja hänet kuristettiin tervatulla hamppuköydellä.",
    hiddenSecret: "Tekijä pakeni veneellä rantaan ja yritti tehdä reikiä polttoainetankkeihin lavastaakseen onnettomuuden.",
    setting: "Laura oli saanut selville, että yksi seurueen jäsenistä oli tehnyt vakavan talousrikoksen. Hänet löydettiin aamulla sidottuna venevajasta.",
    secretForVartija: "Laura oli ottanut salkkuunsa mukaan todisteet talousrikoksesta. Salkku on piilotettu päämökkiin ja siellä on syyllisen allekirjoitus.",
    clueOverrides: {
      koysi: {
        normalText: "Etsijän vihje: Tervattu hamppuköysi venevajan seinältä. Köysi on katkaistu hätäisesti. Tekijällä on ollut taskussaan erittäin terävä veitsi.",
        syyllinenText: "Syyllisen ohje: Käytit keittiöveistä köyden katkaisuun venevajassa. Varmista, ettei kukaan muu yhdistä päämökin keittiöveistä sinuun!"
      }
    },
    witnessEventTemplates: [
      {
        id: "kv_event1",
        title: "Oven pamaus",
        text: "Venevajan raskas ovi pamahti ja lukko loksahti kiinni kahden aikaan yöllä. Joku juoksi rannasta takaisin mökkiä kohti.",
        locationHint: "Venevaja",
        revealDelayMs: 2 * 60 * 1000,
      },
      {
        id: "kv_event2",
        title: "Bensiinin haju",
        text: "Ulkona tuulee kovaa, mutta vanhan varaston kulmalla tuoksuu tuore bensiini, aivan kuin kanisteri olisi jätetty auki.",
        locationHint: "Vanha varasto",
        revealDelayMs: 5 * 60 * 1000,
      },
      {
        id: "kv_event3",
        title: "Hiiltynyt paperi",
        text: "Grillikodan tuhkasta löytyi lakiasiakirjan suikale: '...ilmoitus poliisille talousrikoksesta...' Loput tekstit ovat tuhkana.",
        locationHint: "Grillikota",
        revealDelayMs: 8 * 60 * 1000,
      }
    ],
    redHerringTemplates: [
      {
        id: "kv_rh1",
        locationId: "paamokki",
        name: "Kynän jälki",
        normalTextTemplate: "Päämökin pöydältä löytyi paperi, johon {target} oli hätäisesti luonnostellut Lauran nimen ja alleviivannut sen useasti."
      },
      {
        id: "kv_rh2",
        locationId: "vanha_varasto",
        name: "Löydetty työkalu",
        normalTextTemplate: "Vanhan varaston ovelta bensiinikannun vierestä löytyi hanska, joka muistuttaa kooltaan pelaajan {target} kättä."
      }
    ]
  }
];
