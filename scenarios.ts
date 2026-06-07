import type { Scenario } from "../types";

export const SCENARIOS: Scenario[] = [
  {
    id: "saunan_salaisuus",
    name: "Saunan Salaisuus",
    subtitle: "Uhri löytyi saunan rappusilta",
    victim: "Arvo Mäkinen",
    victimLocation: "sauna",
    motive: "Perintöriita — uhri oli muuttanut testamentin viime hetkellä.",
    method: "Tyrmäys ja hukkuminen yhdistettynä — tapaus lavastettiin onnettomuudeksi.",
    hiddenSecret:
      "Arvo Mäkinen ei ollut yksin saunassa. Toinen henkilö auttoi peittämään jäljet — ja on edelleen vapaa.",
    setting:
      "Ilta oli alkanut hyvin — viski virtasi ja sauna lämpeni. Aamulla löytyi ruumis saunan rappusilta. Kaikki olivat paikalla. Kukaan ei myöntänyt mitään.",
    secretForVartija:
      "Arvo Mäkinen oli laatinut uuden testamentin juuri ennen kuolemaansa. Se hyödyttää vain yhtä henkilöä.",
    clueOverrides: {
      pyyhe: {
        normalText:
          "Pyyhe on taiteltu huolellisesti kiuaalle. Punertavia tahroja pyyhkeessä — ja haju, joka ei ole peräisin saunasta.",
        syyllinenText:
          "Tahrat ovat hilsemäistä epidermiä. Haju on vain saunan lämmön tuoma.",
      },
      polttotahrat: {
        normalText:
          "Kiuas ei ole ollut käynnissä tänä iltana, mutta sen pinnalla on tuoreita polttotahroja. Käden muotoisia.",
        syyllinenText: "Joku poltti kynnettä kiuaalle — vanha tapa. Ei merkittävää.",
      },
    },
    witnessEventTemplates: [
      {
        id: "ss_event1",
        title: "Ääni saunasta",
        text: "Kahdesta pelaajasta kuullaan, että he kuulivat kolahduksen saunan suunnalta noin puoli kahdentoista aikaan. Kolahdus ei kuulostanut puun natinaalta.",
        locationHint: "Sauna",
        revealDelayMs: 2 * 60 * 1000,
      },
      {
        id: "ss_event2",
        title: "Ranta havainto",
        text: "Laiturilla on märkä jälki, joka ei selity sadalla tai uimisella. Jälki alkaa saunasta ja päättyy veteen.",
        locationHint: "Laituri",
        revealDelayMs: 5 * 60 * 1000,
      },
      {
        id: "ss_event3",
        title: "Repaleinen muistio",
        text: "Grillikodan tuhkasta löytyi puoleksi palanut paperin pala. Siinä lukee: '…summa sovittu, ei jätä todisteit…'",
        locationHint: "Grillikota",
        revealDelayMs: 8 * 60 * 1000,
      },
    ],
    redHerringTemplates: [
      {
        id: "ss_rh1",
        locationId: "sauna",
        name: "Epäilyttävä vaate",
        normalTextTemplate:
          "Löidään saunasta kangasnäyte, joka muistuttaa väreiltään {target}:n tänä iltana käyttämää paitaa. Voisiko hän olla ollut täällä?",
      },
      {
        id: "ss_rh2",
        locationId: "paamokki",
        name: "Viestivihje",
        normalTextTemplate:
          "{target} poistui nopeasti tilasta kun Arvon nimi mainittiin. Reaktio oli silmiinpistävä — ja kenties liian nopea.",
      },
    ],
  },
  {
    id: "laiturin_varjo",
    name: "Laiturin Varjo",
    subtitle: "Uhri katosi laiturista",
    victim: "Siiri Leinonen",
    victimLocation: "laituri",
    motive: "Siiri tiesi liian paljon — hän oli kuvannut jotain mitä ei olisi pitänyt nähdä.",
    method: "Hukkuminen — köysi katkaistiin, vene liikutettiin, jäljet siivottiin.",
    hiddenSecret:
      "Siirin kamera löytyi järvestä — mutta muistikortti on jossakin mökin sisällä, tallenteineen.",
    setting:
      "Siiri Leinonen kävi sanomassa hyvää yötä ja lähti kohti laituria. Kukaan ei nähnyt häntä enää elävänä. Vene oli koskematon — mutta joku oli käyttänyt sitä.",
    secretForVartija:
      "Siiri Leinonen oli ottanut valokuvia illan tapahtumista. Muistikortti on piilossa — ja siinä on kuva syyllisestä.",
    clueOverrides: {
      koysi: {
        normalText:
          "Köysi on katkaistu terävästi laiturin päässä. Märät jäljet johtavat poispäin järvestä.",
        syyllinenText:
          "Vene oli rymähtänyt kovaan myrskyyn, köysi ratkesi tuulen painosta.",
      },
      jalanjäljet: {
        normalText:
          "Laiturin laudoilla on kaksi eri jalanjälkiparia — yksi menee, toinen tulee. Vain toinen palasi.",
        syyllinenText: "Joku kävi uimassa aiemmin. Jälkiä on kaikkialla järvenrannalla.",
      },
    },
    witnessEventTemplates: [
      {
        id: "lv_event1",
        title: "Ääni järveltä",
        text: "Kaksi pelaajaa kertoo kuulleensa roiskauksen järveltä noin puolen yön jälkeen. Ääni ei kuulostanut kalan hyppäämiseltä.",
        locationHint: "Laituri",
        revealDelayMs: 2 * 60 * 1000,
      },
      {
        id: "lv_event2",
        title: "Metsäpolun löytö",
        text: "Metsäpolulta löytyi repaleinen huivi — samanlainen kuin Siirillä oli illalla päässään. Huivi on märkä.",
        locationHint: "Metsäpolku",
        revealDelayMs: 5 * 60 * 1000,
      },
      {
        id: "lv_event3",
        title: "Venevaajan havainto",
        text: "Venevajassa on tuore öljytahra lattialla, jota ei ollut aamulla. Joku on käyttänyt moottorivenettä tänä yönä.",
        locationHint: "Venevaja",
        revealDelayMs: 8 * 60 * 1000,
      },
    ],
    redHerringTemplates: [
      {
        id: "lv_rh1",
        locationId: "laituri",
        name: "Jalanjälkihavainto",
        normalTextTemplate:
          "Laiturin laudoilla näkyy jalanjälki, joka vastaa kooltaan {target}:n jalkaa. Jälki on tuore — tehty viimeisten tuntien aikana.",
      },
      {
        id: "lv_rh2",
        locationId: "metsakpolku",
        name: "Kangasnäyte",
        normalTextTemplate:
          "Metsäpolulta löytyi irronnut kangaspala, joka muistuttaa {target}:n tänä iltana käyttämää vaatetta. Kangaspala roikkuu oksan kärjessä.",
      },
    ],
  },
  {
    id: "kadonnut_vieras",
    name: "Kadonnut Vieras",
    subtitle: "Kutsumaton vieras hävisi yön aikana",
    victim: "Petteri Salo",
    victimLocation: "paamokki",
    motive: "Petteri oli yksityisetsivä — hän tuli kiristämään. Hänen tutkimuksensa osui liian lähelle.",
    method: "Myrkytys — juomaan lisätty aine aiheutti kooman. Ruumis on piilotettu.",
    hiddenSecret:
      "Petteri Salon toimisto löysi hänen muistiinpanonsa. Siellä on kaikkien teillä olevien nimet — ja yksi on alleviivattu.",
    setting:
      "Petteri Salo saapui kutsumattomana. Yön aikana hän katosi. Aamulla löytyi vain hänen laukunsa ja särkynyt puhelimen näyttö.",
    secretForVartija:
      "Petteri Salo oli yksityisetsivä. Hän tuli tutkimaan jotakuta teistä — ja löysi jotain.",
    clueOverrides: {
      kirje: {
        normalText:
          "Repaleinen kirje: 'Tiedän mitä teit. Maksa tai seuraukset.' Kirjoitettu tänä iltana.",
        syyllinenText:
          "Kirje on Petterin oma — osa hänen kiristysstrategiaansa. Ei liity kuolemaan.",
      },
      malja: {
        normalText:
          "Kolme viskimaljaa pöydällä. Kaksi on käytetty. Kolmas — Petterin — on koskematon. Hän ei koskaan istunut pöydässä.",
        syyllinenText:
          "Kolmas malja oli Petterin. Hän ei juonut, koska tiesi olevansa vaarassa.",
      },
    },
    witnessEventTemplates: [
      {
        id: "kv_event1",
        title: "Särkynyt puhelin",
        text: "Petteri Salon puhelimesta on irrotettu SIM-kortti ennen kuin se rikottiin. Joku ei halunnut hänen olevan tavoitettavissa.",
        locationHint: "Päämökki",
        revealDelayMs: 2 * 60 * 1000,
      },
      {
        id: "kv_event2",
        title: "Varastohuoneen ovi",
        text: "Vanha varasto on ollut lukittuna koko kesän — mutta nyt lukko on auki. Sisällä on jotain, jota ei siellä pitäisi olla.",
        locationHint: "Vanha varasto",
        revealDelayMs: 5 * 60 * 1000,
      },
      {
        id: "kv_event3",
        title: "Kirjekuori",
        text: "Grillikodan tuhkasta löytyi puoleksi palaneena: 'Sinun toimeksiantosi on valmis. Maksamme kun—' Loput ovat tuhkana.",
        locationHint: "Grillikota",
        revealDelayMs: 8 * 60 * 1000,
      },
    ],
    redHerringTemplates: [
      {
        id: "kv_rh1",
        locationId: "paamokki",
        name: "Petterin muistiinpano",
        normalTextTemplate:
          "Petterin laukussa oli käsinkirjoitettu lappu: '{target} tietää enemmän kuin sanoo.' Kirjoitettu lyijykynällä, painokkaasti.",
      },
      {
        id: "kv_rh2",
        locationId: "grillikota",
        name: "Tallennettu numero",
        normalTextTemplate:
          "Grillikodan pöydällä on raaputettu paperi, jossa näkyy puhelinnumeron loppunumerot — samat kuin {target}:n numerossa.",
      },
    ],
  },
];

export const SCENARIO_MAP: Record<string, Scenario> = Object.fromEntries(
  SCENARIOS.map((s) => [s.id, s])
);

export function pickRandomScenario(): Scenario {
  return SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
}
