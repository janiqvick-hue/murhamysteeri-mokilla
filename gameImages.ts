// gameImages.ts - Projektin universaali ja huoltovapaa kuvapankki

// Universaalit tunnelmagradientit, jotka piirtyvät heti, jos nettilinkit estetään
export const GAME_GRADIENTS = {
  paahuvila: "linear-gradient(135deg, #1e1b4b 0%, #451a03 100%)",      // Lämmin hirsituli
  hirsirantasauna: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)", // Kylmä terva ja järvi
  grillikota: "linear-gradient(135deg, #1c1917 0%, #7c2d12 100%)",      // Noki ja kytevä hiillos
  puuvarasto: "linear-gradient(135deg, #022c22 0%, #0f172a 100%)",      // Metsäinen klapivarasto
  popupDefault: "linear-gradient(135deg, #020617 0%, #1e293b 100%)"     // Synkkä tutkintapöytä
};

// Suuret emojit ja symbolit graafiseen ilmeeseen
export const GAME_SYMBOLS = {
  paahuvila: "🌲🏡",
  hirsirantasauna: "🌊🧖‍♂️",
  grillikota: "⛺🔥",
  puuvarasto: "🪵🪓",
  // Todisteet
  takkatuli: "🔥📄",
  lasi: "🍷🧪",
  laudeliina: "🧣🩸",
  saunakiulu: "🪣📿",
  kirje: "✉️🍂",
  jalanjaljet: "🥾👣",
  default: "🔍"
};

// Varmat, suorat kuvatiedosto-osoitteet
export const LOCATION_IMAGES = {
  paahuvila: "https://unsplash.com",
  hirsirantasauna: "https://unsplash.com",
  grillikota: "https://unsplash.com",
  puuvarasto: "https://unsplash.com"
};

export const CLUE_IMAGES = {
  takkatuli: "https://unsplash.com",
  lasi: "https://unsplash.com",
  laudeliina: "https://unsplash.com",
  saunakiulu: "https://unsplash.com",
  kirje: "https://unsplash.com",
  jalanjaljet: "https://unsplash.com"
};
