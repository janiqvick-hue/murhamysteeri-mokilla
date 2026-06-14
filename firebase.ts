import { initializeApp, type FirebaseApp } from "firebase/app";
import { getDatabase, type Database } from "firebase/database";

// Luetaan Firebase-tunnukset turvallisesti ympäristömuuttujista
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
const databaseURL = import.meta.env.VITE_FIREBASE_DATABASE_URL;
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
const appId = import.meta.env.VITE_FIREBASE_APP_ID;

// Tarkistetaan, että tarvittavat asetukset löytyvät julkaisualustalta
export const firebaseConfigured =
  !!apiKey &&
  apiKey !== "your_api_key_here" &&
  !!databaseURL &&
  databaseURL !== "your_database_url_here";

let _app: FirebaseApp | null = null;
let _db: Database | null = null;

if (firebaseConfigured) {
  _app = initializeApp({
    apiKey,
    authDomain,
    databaseURL,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
  });
  _db = getDatabase(_app);
} else {
  console.warn("⚠️ Firebase-yhteyden ympäristömuuttujat puuttuvat tai ovat oletusarvoisia. Varmista asetukset Vercelissä / .env-tiedostossa.");
}

// Estetään sovelluksen kaatuminen build-vaiheessa antamalla turvallinen varatila, jos _db on null
export const db = _db as Database;
