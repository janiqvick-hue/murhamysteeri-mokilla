import { useEffect, useState } from "react";

export default function KadonnutJaniScreen() {
  // Pelin perustilat ja tallennuksen lataus LocalStoragesta
  const [started, setStarted] = useState(() => {
    return localStorage.getItem("jani_started") === "true";
  });
  
  const [currentStage, setCurrentStage] = useState(() => {
    return parseInt(localStorage.getItem("jani_stage") || "1", 10);
  });

  // 10 todistetta tutkijan salkkuun
  const [hasPhone, setHasPhone] = useState(() => localStorage.getItem("jani_hasPhone") === "true");
  const [hasNote, setHasNote] = useState(() => localStorage.getItem("jani_hasNote") === "true");
  const [hasPlank, setHasPlank] = useState(() => localStorage.getItem("jani_hasPlank") === "true");
  const [hasDiary, setHasDiary] = useState(() => localStorage.getItem("jani_hasDiary") === "true");
  const [hasRustyKey, setHasRustyKey] = useState(() => localStorage.getItem("jani_hasRustyKey") === "true");
  const [hasMapPiece, setHasMapPiece] = useState(() => localStorage.getItem("jani_hasMapPiece") === "true");
  const [hasPhoto, setHasPhoto] = useState(() => localStorage.getItem("jani_hasPhoto") === "true");
  const [hasLetter, setHasLetter] = useState(() => localStorage.getItem("jani_hasLetter") === "true");
  const [hasGuardMark, setHasGuardMark] = useState(() => localStorage.getItem("jani_hasGuardMark") === "true");
  const [hasMetalBox, setHasMetalBox] = useState(() => localStorage.getItem("jani_hasMetalBox") === "true");

  // Käyttöliittymän tilat
  const [showFolder, setShowFolder] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<string | null>(null);
  const [notification, setNotification] = useState("");
  const [audioEnabled, setAudioEnabled] = useState(false);
  
  // Arvoitusten syötteet
  const [suitcaseCode, setSuitcaseCode] = useState("");
  const [cellarPassword, setCellarPassword] = useState("");

  // Kirjeen dynaaminen kirjoitus
  const [visibleText, setVisibleText] = useState("");
  const [letterStarted, setLetterStarted] = useState(false);

  const finalLetter = `📜 JANIN VIIMEINEN KIRJE...

Kaikki alkoi jo kauan ennen minua.

Joku yritti varoittaa jo vuonna 1952, eikä totuus pääty minuun.

If kuulet rannalta äänen, joka kuulostaa tutulta...

älä seuraa sitä.

Sillä totuus lepää edelleen järven pohjassa.

Ja joskus...

totuus katsoo takaisin.

VARTIJAT OVAT TÄÄLLÄ.`;

  // Pelitilan automaattinen tallennus
  useEffect(() => {
    localStorage.setItem("jani_started", started.toString());
    localStorage.setItem("jani_stage", currentStage.toString());
    localStorage.setItem("jani_hasPhone", hasPhone.toString());
    localStorage.setItem("jani_hasNote", hasNote.toString());
    localStorage.setItem("jani_hasPlank", hasPlank.toString());
    localStorage.setItem("jani_hasDiary", hasDiary.toString());
    localStorage.setItem("jani_hasRustyKey", hasRustyKey.toString());
    localStorage.setItem("jani_hasMapPiece", hasMapPiece.toString());
    localStorage.setItem("jani_hasPhoto", hasPhoto.toString());
    localStorage.setItem("jani_hasLetter", hasLetter.toString());
    localStorage.setItem("jani_hasGuardMark", hasGuardMark.toString());
    localStorage.setItem("jani_hasMetalBox", hasMetalBox.toString());
  }, [started, currentStage, hasPhone, hasNote, hasPlank, hasDiary, hasRustyKey, hasMapPiece, hasPhoto, hasLetter, hasGuardMark, hasMetalBox]);

  // Äänitiedostojen soitto kovennetulla äänenvoimakkuudella (volume = 1.0)
  const playAudio = (src: string) => {
    if (!audioEnabled) return;
    const audio = new Audio(src);
    audio.volume = 1.0;
    audio.play().catch(() => console.log("Ääntä ei voitu toistaa klikkausrajoituksen vuoksi."));
  };

  // Kirjeen kirjoitusefekti
  useEffect(() => {
    if (currentStage === 8 && !letterStarted) {
      setLetterStarted(true);
      let index = 0;
      const interval = setInterval(() => {
        setVisibleText(finalLetter.slice(0, index));
        index++;
        if (index > finalLetter.length) clearInterval(interval);
      }, 70);
      return () => clearInterval(interval);
    }
  }, [currentStage, letterStarted]);

  // Pelin nollaus
  const resetGame = () => {
    if (window.confirm("Haluatko varmasti aloittaa etsinnät alusta?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // Salkkupainike
  const folderButton = (
    <button
      onClick={() => setShowFolder(true)}
      style={{
        position: "fixed", right: "20px", top: "50%", transform: "translateY(-50%)", zIndex: 9999,
        width: "95px", height: "125px", borderRadius: "16px", border: "2px solid #8b6f47",
        background: "#5b4328", color: "white", cursor: "pointer", boxShadow: "0 6px 18px rgba(0,0,0,0.4)",
        fontWeight: "bold", fontSize: "0.85rem",
      }}
    >
      🧳<br />Tutkijan<br />salkku<br />1952
    </button>
  );

  // TUTKIJAN SALKKU
  if (showFolder) {
    const evidenceList = [
      { id: "phone", name: "📱 Janin puhelin", has: hasPhone, desc: "Löytyi laiturilta märältä lankulta. Näyttö on säröillä, ja viimeinen otettu kuva esittää vanhaa kaivoa." },
      { id: "note", name: "📝 Märkä muistilappu", has: hasNote, desc: "Muste on levinnyt sateessa, mutta vuosi 1952 erottuu selvästi. 'Tämä ei alkanut Janista.'" },
      { id: "key", name: "🔑 Ruostunut avain 1952", has: hasRustyKey, desc: "Löytyi vanhan kaivon uumenista. Kylkeen on kaiverrettu vuosiluku 1952. Sopii vajan arkkuun." },
      { id: "map", name: "🗺️ Märkä kartan pala", has: hasMapPiece, desc: "Kaivosta löytynyt reittikartta, joka osoittaa polun hylätylle vajalle." },
      { id: "photo_beach", name: "🖼️ Valokuva rannasta", has: hasPhoto, desc: "Metsäpolulta löytynyt rikkinäinen kuva mökin rannasta sellaisena kuin se oli ennen loistohuvilaa." },
      { id: "letter", name: "✉️ Salainen kirje vajasta", has: hasLetter, desc: "Arkusta löytynyt varoitus: 'Jos jotain tapahtuu minulle, älkää luottako kaikkiin.'" },
      { id: "mark", name: "🛡️ Vartijoiden merkki", has: hasGuardMark, desc: "Rantasaunan lauteiden salalokerosta noudettu metallinen symboli. Vartijoiden virallinen tunnus." },
      { id: "plank", name: "🪵 Irtonainen lankku", has: hasPlank, desc: "Saunasta löytynyt vihje: 'Totuus on piilotettu veden alle.' Johdattaa takaisin laiturille." },
      { id: "box", name: "📦 Metallirasia", has: hasMetalBox, desc: "Laiturin alta kylmästä järvivedestä pelastettu rasia, joka avaa tien kellariin." },
      { id: "diary", name: "📖 Kadonnut päiväkirja", has: hasDiary, desc: "Kellarin sähkökaapista löytynyt alkuperäinen päiväkirja vuodelta 1952: 'Syyllinen ei ollut ulkopuolinen. Hän oli yksi meistä.'" },
    ];

    return (
      <div className="screen screen--center">
        <div className="rain-overlay" />
        <div className="config-card" style={{ maxWidth: "450px", width: "95%" }}>
          <h2>🎒 Tutkijan salkku 1952</h2>
          <p style={{ fontSize: "0.85rem", opacity: 0.7, marginBottom: "1rem" }}>
            Kerätty: {evidenceList.filter(e => e.has).length} / 10 todistetta
          </p>

          {!selectedEvidence ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "300px", overflowY: "auto", textAlign: "left", padding: "4px" }}>
              {evidenceList.map(e => (
                <button
                  key={e.id}
                  disabled={!e.has}
                  onClick={() => setSelectedEvidence(e.id)}
                  style={{
                    padding: "10px", background: e.has ? "#1a2540" : "rgba(255,255,255,0.05)",
                    color: e.has ? "white" : "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px", cursor: e.has ? "pointer" : "not-allowed", textAlign: "left"
                  }}
                >
                  {e.has ? e.name : "🔒 [Lukittu todiste]"}
                </button>
              ))}
            </div>
          ) : (
            <div style={{ padding: "1rem", background: "rgba(0,0,0,0.3)", borderRadius: "12px", textAlign: "left", marginBottom: "1rem" }}>
              <h3>{evidenceList.find(e => e.id === selectedEvidence)?.name}</h3>
              <p style={{ marginTop: "0.5rem", fontSize: "0.95rem", lineHeight: "1.4" }}>
                {evidenceList.find(e => e.id === selectedEvidence)?.desc}
              </p>
              <button className="btn" style={{ marginTop: "1rem", padding: "4px 12px" }} onClick={() => setSelectedEvidence(null)}>Takaisin listaan</button>
            </div>
          )}

          <button className="btn" onClick={() => setShowFolder(false)} style={{ width: "100%", background: "#8b6f47", marginTop: "1rem" }}>
            Sulje salkku
          </button>
        </div>
      </div>
    );
  }

  // PELIN ALKURUUTU
  if (!started) {
    return (
      <div className="screen screen--center">
        <div className="rain-overlay" />
        <div className="config-card">
          <h1>🔦 Kadonnut Jani</h1>
          <p style={{ margin: "1rem 0" }}>80 tunnin tutkimus ja kauhumysteeri Lopella. Kaikki alkaa sateiselta laiturilta, jossa Jani nähtiin viimeisen kerran.</p>
          
          <div style={{ margin: "1rem 0", display: "flex", gap: "10px", justifyContent: "center" }}>
            <button className={`btn ${audioEnabled ? "" : "btn-secondary"}`} onClick={() => setAudioEnabled(!audioEnabled)}>
              {audioEnabled ? "🔊 Äänet päällä" : "🔇 Äänet pois"}
            </button>
          </div>

          <button className="btn" onClick={() => { setStarted(true); playAudio("/intro_jani.mp3kovennettu.m4a"); }}>
            Aloita tutkimus
          </button>
        </div>
      </div>
    );
  }

  // PELIALUEET (STAGES 1-8)
  return (
    <div className="screen screen--center">
      <div className="rain-overlay" />
      {folderButton}

      <div style={{ position: "absolute", top: "15px", left: "15px", display: "flex", gap: "10px", zIndex: 10 }}>
