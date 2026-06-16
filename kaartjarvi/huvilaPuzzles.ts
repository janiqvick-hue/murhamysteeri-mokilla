export interface HuvilaPuzzle {
  id: string;
  title: string;
  description: string;
  locationId: string;
  isSolved: boolean;
  type: "code" | "item";
  requiredCode?: string;
  requiredItem?: string;
  hint: string;
  rewardItem: string;
  rewardItemName: string;
  solveMessage: string;
}

export const HUVILA_PUZZLES: HuvilaPuzzle[] = [
  {
    id: "paahuvila_paivakirja",
    title: "Mikaelin nahkainen työpöydän päiväkirja",
    description: "Päähuvilan työpöydällä lojuu Mikaelin lukittu päiväkirja. Kannen messinkisessä numerolukossa on neljä numeroa. Päiväkirjan pinnassa lukee kaiverrus: 'Perustamisvuoteni ja kuukauteni'. Vanhoista papereista selviää, että huvilan peruskivi muurattiin kesäkuussa (06) vuonna 1972.",
    locationId: "paahuvila",
    isSolved: false,
    type: "code",
    requiredCode: "0672",
    hint: "Kaiverrus viittaa 'perustamisvuoteen ja kuukauteen'. Kokeile yhdistää kuukausi 06 ja kaksinumeroinen vuosi 72.",
    rewardItem: "messinkiavain",
    rewardItemName: "Messinkiavain",
    solveMessage: "Naks! Lukko aukeaa ja päiväkirjan välistä putoaa vanha, painava messinkiavain!"
  },
  {
    id: "puuvarasto_sahalaatikko",
    title: "Varaston lukittu suojakaappi",
    description: "Kylmän puuvaraston metallinen työkaluarkku on lukittu punaiseksi maalatulla koodilukolla. Arkkuun on liimattu varoitustarra: 'Emergency: Syötä kansallinen yleinen hätänumero nähdäksesi raivaustaltat'.",
    locationId: "puuvarasto",
    isSolved: false,
    type: "code",
    requiredCode: "112",
    hint: "Kysymyksessä etsitään yleistä virallista hätänumeroa, jota käytetään hätätilanteissa kaikkialla Suomessa.",
    rewardItem: "sorkkarauta",
    rewardItemName: "Raskas terässorkkarauta",
    solveMessage: "Klops! Arkun lukko avautuu kolahtaen. Sisältä löytyy painava terässorkkarauta!"
  },
  {
    id: "grillikota_arkku",
    title: "Grillikodan vanha rauta-arkku",
    description: "Kodan penkin alle on puoliksi haudattu raskas raudoitettu puuarkku. Se on lukittu paksulla, ruosteisella riippulukolla, joka vaatisi voimakasta mekaanista vääntövoimaa vipuvarrella.",
    locationId: "grillikota",
    isSolved: false,
    type: "item",
    requiredItem: "sorkkarauta",
    hint: "Tämän ruosteisen riippulukon murtamiseen tarvitset kunnon vipuvarsityökalun puuvarastosta (esim. sorkkarauta).",
    rewardItem: "perintosormus",
    rewardItemName: "Uhrin kultainen sinettisormus",
    solveMessage: "RÄKS! Käytit sorkkarautaa repiäksesi ruosteisen riippulukon auki voimalla."
  },
  {
    id: "hirsirantasauna_lattialauta",
    title: "Saunan kiukaan hiilihautalokero",
    description: "Rantasaunan kuuman kiukaan pohjalla on pieni nokeentunut metalliluukku, jonka päällä on kolminumeroinen kiekkolukko. Luukun reunaan on hätäisesti raapustettu vihje: 'Veden kiehumispiste celsiuksina'.",
    locationId: "hirsirantasauna",
    isSolved: false,
    type: "code",
    requiredCode: "100",
    hint: "Mieti, missä celsiusasteessa puhdas vesi alkaa kiehua höyryksi.",
    rewardItem: "myrkkyrekisteri",
    rewardItemName: "Tyhjä Kaliumsyanidi-pullo",
    solveMessage: "NAPS! Luukku liukuu sivuun. Nokisesta kolosta paljastuu tyhjä apteekkipullo!"
  }
];
