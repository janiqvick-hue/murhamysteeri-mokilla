import type { Scenario, EndingType } from "../types";

const STORYBOOK: Record<string, Record<EndingType, string>> = {
  saunan_salaisuus: {
    perfect_investigation:
      "Jokainen osoitti samaan suuntaan — ja tällä kertaa suunta oli oikea. Testamenttiasia, verinen pyyhe, käden muotoiset polttotahrat: todisteet puhuivat selkeämpää kieltä kuin kukaan osasi pelätä. Syyllinen ei pystynyt kiistämään mitään. Arvo Mäkisen kuolema sai vastauksen, ja Kaartjärvi sai rauhansa.",
    investigators_win:
      "Äänten enemmistö osui oikeaan. Syyllinen yritti vielä viime hetkellä kiistää kaiken, mutta sauna piti salaisuutensa vain hetken. Arvo Mäkinen sai oikeuden — ei ehkä täydellisesti, mutta riittävästi.",
    culprit_escapes:
      "Äänestys meni pieleen. Syyllinen katsoi rauhallisena kun tuomio lankesi muualle — hän tiesi saunan salaisuuden jäävän järven pohjaan. Arvo Mäkisen kuolema jää virallisesti selvittämättä, ja tekijä jatkaa elämäänsä vapaan ihmisen lailla.",
    culprit_confesses:
      "Tunnustus tuli yllättäen, äänestyksen keskeltä. Syyllinen nousi seisomaan ja kertoi kaiken — testamentista, katkeruuden vuosista, ja siitä yöstä saunan rappusilta. Se ei palauta Arvoa, mutta sulkee tapauksen.",
    secret_unsolved:
      "Äänet jakautuivat tasan, eikä enemmistöä löytynyt. Arvo Mäkisen kuolema jää virallisesti selvittämättä — sauna ja sen salaisuudet elävät edelleen mökin muistona järven rannalla.",
    perfect_criminal:
      "Rikoksen arkkitehtuuri oli täydellinen. Syyllinen liikkui oikeissa paikoissa, keräsi oikeat todisteet, ja johti muita harhaan niin taitavasti, ettei kukaan uskonut tosiasiaa. Arvo Mäkinen makaa haudassaan — ja tappaja saa elää vapaan ihmisen elämää. Toistaiseksi.",
  },
  laiturin_varjo: {
    perfect_investigation:
      "Kaikki näkivät saman asian laiturin laudoilla — kaksi jalanjälkiparia, joista vain toinen palasi. Syyllinen ei pystynyt selittämään poissaoloaan. Siiri Leinosen muistikortti löytyi myöhemmin piilosta, ja se kertoi kaiken mitä jäljellä ei enää ollut.",
    investigators_win:
      "Enemmistö seurasi jälkiä oikeaan suuntaan. Syyllinen kiisti kaiken, mutta katkaistu köysi ja märät jalanjäljet puhuivat selkeämpää kieltä. Siiri Leinonen sai oikeuden.",
    culprit_escapes:
      "Järvi piti salaisuutensa. Äänestys osui väärään henkilöön, ja syyllinen jäi vapaaksi. Siiri Leinosen katoaminen on onnettomuus — virallisesti. Epävirallisesti, yksi meistä tietää totuuden.",
    culprit_confesses:
      "Laiturilla seisominen kävi liian raskaaksi. Syyllinen tunnusti ennen äänestystä: vene, yö, köysi. Siirin viimeiset sanat kuolivat järven selkään — mutta ainakin nyt tiedetään mitä tapahtui.",
    secret_unsolved:
      "Äänestys hajosi — kenelläkään ei ollut enemmistöä. Laiturin varjo verhosi totuuden, ja Siiri Leinosen katoaminen jää Kaartjärven pohjavedeksi, ikuisesti.",
    perfect_criminal:
      "Laituri and sen varjot pitivät salaisuutensa. Syyllinen kävi oikeissa paikoissa, keräsi oikeat vihjeet, ja varmisti että jokainen katse osoitti muualle. Siiri Leinosen tarina päättyi ilman selitystä — ja tekijä lähti kotiin seuraavana aamuna kuin mitään ei olisi tapahtunut.",
  },
  kadonnut_vieras: {
    perfect_investigation:
      "Petteri Salon tutkimus ei mennyt täysin hukkaan — vaikka häneltä menikin henki. Hänen keräämänsä tieto johti oikeaan henkilöön, ja jokainen äänesti samoin. Oikeus toteutui kalliilla hinnalla.",
    investigators_win:
      "Enemmistö näki totuuden Petterin jäljistä. Vaikka hän oli kutsumaton, hän toi mukanaan todisteet jotka olivat tarpeeksi. Tapaus suljettu.",
    culprit_escapes:
      "Petteri Salon kiristysyritys päättyi traagisesti — ja hänen tappajansa vapautui äänten osuttua väärälle. Mökin salaisuus elää edelleen, samoin kuin sen kantaja.",
    culprit_confesses:
      "Syyllinen tunnusti ennen kuin äänestyslomakkeita jaettiin. Petteri Salon muistiinpanot olivat lopulta liiaksi — ja tunnustus oli ainoa jäljellä oleva ulospääsy.",
    secret_unsolved:
      "Äänestys jakautui. Petteri Salon kuolema jää mysteeriksi — kuten hänen tutkimuksensa kohdekin. Joku sai jäädä vapaaksi. Tällä kertaa.",
    perfect_criminal:
      "Petteri Salon viimeinen toimeksianto epäonnistui — koska vastapuoli oli häntä parempi. Syyllinen liikkui salassa, peitti jälkensä, ja varmisti ettei kukaan kuullut hänen nimeään äänestyshuoneessa. Petteri makaa tuntemattomassa paikassa. Tekijä on jo matkalla kotiin.",
  },
};

const ENDING_LABELS: Record<EndingType, { title: string; icon: string; color: string }> = {
  perfect_investigation: {
    title: "Täydellinen tutkimus",
    icon: "⭐",
    color: "#fbbf24",
  },
  investigators_win: {
    title: "Tutkijat voittivat",
    icon: "⚖️",
    color: "#3b82f6",
  },
  culprit_escapes: {
    title: "Syyllinen selvisi",
    icon: "🩸",
    color: "#ef4444",
  },
  culprit_confesses: {
    title: "Syyllinen tunnusti",
    icon: "🔓",
    color: "#8b5cf6",
  },
  secret_unsolved: {
    title: "Tapaus selvittämättä",
    icon: "❓",
    color: "#94a3b8",
  },
  perfect_criminal: {
    title: "Täydellinen Rikollinen",
    icon: "🩸",
    color: "#ef4444",
  },
};

export function getEndingLabel(type: EndingType) {
  return ENDING_LABELS[type];
}

export function generateStorybookEnding(
  scenario: Scenario,
  endingType: EndingType
): string {
  const fallback =
    "Tapauksen totuus jäi järven pohjaan. Kukaan ei puhunut. Kukaan ei myöntänyt. Yö sulki suunsa.";
  return STORYBOOK[scenario.id]?.[endingType] ?? fallback;
}

export function investigatorsWon(endingType: EndingType): boolean {
  return (
    endingType === "perfect_investigation" || endingType === "investigators_win"
  );
}
