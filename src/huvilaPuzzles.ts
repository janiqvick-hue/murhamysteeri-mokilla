export interface HuvilaPuzzle {
  id: string;
  title: string;
  description: string;
  locationId: string;
  isSolved: boolean;
  type: "code" | "item"; // "code" vaatii koodin syöttämisen, "item" vaatii tavaran repusta
  requiredCode?: string; // e.g. "0672"
  requiredItem?: string; // e.g. "sorkkarauta"
  hint: string;
  rewardItem: string; // e.g. "messinkiavain"
  rewardItemName: string; // e.g. "Messinkiavain"
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
    hint: "Kaiverrus viittaa 'perustamisvuoteen ja kuukauteen'. Jos peruskivi muurattiin kesäkuussa (kuukausi 06) vuonna 1972, kokeile yhdistää nämä numerot (kuukausi + kaksinumeroinen vuosi, eli 06 ja 72).",
    rewardItem: "messinkiavain",
    rewardItemName: "Messinkiavain",
    solveMessage: "Naks! Lukko aukeaa ja päiväkirjan välistä putoaa vanha, painava messinkiavain! Päiväkirjan teksti paljastaa: 'Mökkitontin myynti herättää vastustusta saunan salaseurassa...'"
  },
  {
    id: "puuvarasto_sahalaatikko",
    title: "Varaston lukittu suojakaappi",
    description: "Kylmän puuvaraston metallinen työkaluarkku on lukittu punaiseksi maalatulla koodilukolla. Arkkuun on liimattu varoitustarra: 'Emergency: Syötä kansallinen yleinen hätänumero nähdäksesi raivaustaltat'. Mikä on Suomen ja Euroopan virallinen hätänumero?",
    locationId: "puuvarasto",
    isSolved: false,
    type: "code",
    requiredCode: "112",
    hint: "Kysymyksessä etsitään yleistä virallista hätänumeroa, jota käytetään hätätilanteissa kaikkialla Suomessa ja Euroopassa (kolmenumeroinen klassinen luku).",
    rewardItem: "sorkkarauta",
    rewardItemName: "Raskas terässorkkarauta",
    solveMessage: "Klops! Arkun lukko avautuu kolahtaen. Sisältä löytyy painava, ruosteinen terässorkkarauta. Tällä pystyy murtamaan vaikka jykeviä riippulukkoja tai puuarkkuja!"
  },
  {
    id: "grillikota_arkku",
    title: "Grillikodan vanha rauta-arkku",
    description: "Kodan penkin alle on puoliksi haudattu raskas raudoitettu puuarkku. Se on lukittu paksulla, ruosteisella riippulukolla, jossa ei ole avaimenreikää vaan se vaatisi voimakasta mekaanista vääntövoimaa vipuvarrella.",
    locationId: "grillikota",
    isSolved: false,
    type: "item",
    requiredItem: "sorkkarauta",
    hint: "Tämän ruosteisen riippulukon murtamiseen tarvitset kunnon vipuvarsityökalun. Käy etsimässä puuvarastosta tai muualta sellaista asetta, jolla jumiutuneen raudan voisi vääntää ronskisti auki (esim. sorkkarauta).",
    rewardItem: "perintosormus",
    rewardItemName: "Uhrin kultainen sinettisormus",
    solveMessage: "RÄKS! Käytit sorkkarautaa repiäksesi ruosteisen riippulukon auki voimalla. Arkun sisältä paljastuu Mikaelin perintösormus sekä kirje: 'Tämä sormus todistaa minut Kaartjärven todelliseksi perijäksi, jos Mikaelille käy jotakin...'"
  },
  {
    id: "hirsirantasauna_lattialauta",
    title: "Saunan kiukaan hiilihautalokero",
    description: "Rantasaunan kuuman kiukaan pohjalla on pieni nokeentunut metalliluukku, jonka päällä on kolminumeroinen kiekkolukko. Luukun reunaan on hätäisesti raapustettu vihje: 'Veden kiehumispeste celsiuksina tavallisessa ilmanpaineessa'.",
    locationId: "hirsirantasauna",
    isSolved: false,
    type: "code",
    requiredCode: "100",
    hint: "Mieti, missä celsiusasteessa puhdas vesi alkaa kiehua höyryksi. Se on kolminumeroinen tasaluku kymmenjärjestelmässä.",
    rewardItem: "myrkkyrekisteri",
    rewardItemName: "Tyhjä Kaliumsyanidi-pullo",
    solveMessage: "NAPS! Luukku liukuu sivuun. Nokisesta kolosta paljastuu tyhjä, ruskea apteekkipullo, jonka kyljessä lukee 'Pois lasten ulottuvilta: Potassium Cyanide (Kaliumsyanidi)'. Pullo tuoksuu kitkerältä mantelilta, aivan kuten Mikaelin kristallilasi!"
  }
];
