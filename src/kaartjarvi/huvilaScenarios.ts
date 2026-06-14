export interface HuvilaScenario {
  id: string;
  name: string;
  victim: string;
  method: string;
  motive: string;
  setting: string;
  hiddenSecret: string;
}

export const HUVILA_SCENARIO: HuvilaScenario = {
  id: "kaartjarven_varjo",
  name: "Kaartjärven Varjo",
  victim: "Patruuna Henrik Kaartinen",
  method: "Myrkytetty iltatee rantasaunalla",
  motive: "Huvilan alle kätketyn vanhan aarretunnelin sijainti ja salainen testamentti.",
  setting: "Ukkosmyrsky piiskaa Lopen Kaartjärveä. Suuren päähuvilan sähköt ovat räpsähdelleet koko illan. Sukunsa päämies, upporikas Henrik Kaartinen, löydettiin tajuttomana rantasaunan pukuhuoneesta. Ennen murtumistaan hän ehti piilottaa jotain tärkeää päähuvilan lukittuun päiväkirjaan.",
  hiddenSecret: "Henrik oli muuttamassa testamenttiaan sellaiseksi, että huvila ja sen alla oleva historiallinen aarretunneli olisi siirtynyt suojelusäätiölle, mikä raivostutti perinnön tavoittelijat."
};

export const HUVILA_CLUE_DETAILS = {
  messinkiavain: {
    title: "Messinkiavain",
    text: "Rantasaunan ovi aukeaa tämän avulla. Avaimen perään on kaiverrettu kirjaimet 'H.K.' – se kuului uhrille itselleen."
  },
  sorkkarauta: {
    title: "Ruosteinen sorkkarauta",
    text: "Löytyi kiukaan alta. Työkaluun on tarttunut vaaleaa maalia, joka täsmää liiterin takana olevan lukitun laatikon suojamaaliin."
  },
  taskulamppu: {
    title: "Armeijatason taskulamppu",
    text: "Erittäin tehokas valokeila. Tämän avulla pimeimmätkin paikat, kuten grillikodan kylmä ja nokeentunut tulipesä, paljastavat salaisuutensa."
  },
  totuus_paljastunut: {
    title: "Henrikin salainen kirje",
    text: "Kirje paljastaa totuuden: 'Jos luet tätä, minuun on jo koskettu. Aarretunnelin kartta on saunan lauteiden alla. Älä luota kehenkään sukunsa jäseneen...'"
  }
};
