export interface Puzzle {
  id: string;
  locationId: string; // Missä huoneessa pulma on
  question: string; // Pulmateksti / Arvoitus pelaajalle
  correctAnswer: string; // Oikea vastaus (koodi tai sana)
  rewardItemId: string; // Mitä esinettä ratkaisusta saa
  rewardText: string; // Teksti, kun pulma ratkeaa
}

export const HUVILA_PUZZLES: Puzzle[] = [
  {
    id: "paahuvila_paivakirja",
    locationId: "paahuvila",
    question: "Päiväkirjan kanteen on raapustettu vihje: 'Perustamisvuotemme kaksi viimeistä numeroa kerrottuna mökin ikkunoiden määrällä (8)'. Huvilan seinässä olevassa taulussa lukee: 'Villa Kaartjärvi, Est. 1984'. Mikä on 4-numeroinen koodi?",
    correctAnswer: "0672", // 84 * 8 = 672 -> muotoon 0672
    rewardItemId: "messinkiavain",
    rewardText: "Klik! Päiväkirjan lukko aukeaa. Sivujen välistä tippuu vanha, painava messinkiavain! Voit nyt käyttää sitä rantasaunan oven avaamiseen."
  },
  {
    id: "rantasauna_kiuas",
    locationId: "rantasauna",
    question: "Saunan lauteilta löytyy kastunut paperilappu: 'Kiuaskivien joukkoon on piilotettu jotain, mutta se aukeaa vain jos tiedät salasanan. Se on Kaartjärven rannalla huutavan linnun nimi suomeksi, kuudella kirjaimella (pienillä kirjaimilla).' Mikä on lintu?",
    correctAnswer: "kuikka",
    rewardItemId: "sorkkarauta",
    rewardText: "Oikein! Kun lausut sanan, kiukaan alta aukeaa salaluukku, josta löydät ruosteisen mutta vankan Sorkkaraudan! Tälle on varmasti käyttöä liiterissä."
  }
];
   {
    id: "puuvarasto_laatikko",
    locationId: "puuvarasto",
    question: "Liiterin hämärässä nurkassa on vanha lukittu puulaatikko, jonka avaamiseen tarvitset sorkkarautaa. Laatikon kanteen on kaiverrettu arvoitus: 'Kuljet Lopen metsässä ja näet pinon klapeja. Jos pinossa on 12 riviä puita, ja joka rivillä on 12 halkoa, kuinka monta halkoa pinossa on yhteensä?' Mikä on luku?",
    correctAnswer: "144", // 12 * 12 = 144
    rewardItemId: "taskulamppu",
    rewardText: "RÄKS! Väännät laatikon auki sorkkaraudalla. Puupuruista paljastuu tehokas, armeijatason Taskulamppu! Nyt voit tutkia synkkiä ja pimeitä nurkkia, kuten grillikodan kylmää tulipesää..."
  },
  {
    id: "grillikota_loppumysteeri",
    locationId: "grillikota",
    question: "Olet grillikodassa. Sytytät taskulampun ja osoitat valon suoraan pimeään tulipasassa olevaan tuhkaan. Sieltä paljastuu metallinen rasia, jossa on mekaaninen hammasrataslukko ja teksti: 'Pelin lopullinen totuus ja salaisuus aukeaa vain sille, joka tietää Kaartjärven perustamisvuoden (1984) numeroiden SUMMAN kerrottuna kolmella (3).' Mikä on tämä lopullinen koodi?",
    correctAnswer: "66", // (1+9+8+4) = 22 -> 22 * 3 = 66
    rewardItemId: "totuus_paljastunut",
    rewardText: "KLIK-KLAK! Metallirasian hammasrattaat pyörähtävät ympäri ja kansi lennähtää auki! Rasiassa on kirje, joka paljastaa Villa Kaartjärven suuren salaisuuden: 'Uhri tiesi liikaa huvilan alle piilotetusta aarretunnelista...' OLET RATKAISSUT JATKO-OSAN KOKONAISUUDESTAAN! 🎉 Onneksi olkoon, mestarietsivä!"
  }
];
