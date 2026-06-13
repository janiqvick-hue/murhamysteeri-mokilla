import { useEffect, useState } from "react";

export default function KadonnutJaniScreen() {
const [started, setStarted] = useState(false);

const [atWell, setAtWell] = useState(false);
const [atTrail, setAtTrail] = useState(false);
const [atShed, setAtShed] = useState(false);
const [atGuestRoom, setAtGuestRoom] = useState(false);
const [atSauna, setAtSauna] = useState(false);
const [atUnderDock, setAtUnderDock] = useState(false);
const [atCellar, setAtCellar] = useState(false);

const [hasPhone, setHasPhone] = useState(false);
const [hasNote, setHasNote] = useState(false);
const [hasPlank, setHasPlank] = useState(false);
const [hasDiary, setHasDiary] = useState(false);

const [hasRustyKey, setHasRustyKey] = useState(false);
const [hasMapPiece, setHasMapPiece] = useState(false);

const [hasPhoto, setHasPhoto] = useState(false);
const [hasLetter, setHasLetter] = useState(false);

const [hasGuardMark, setHasGuardMark] = useState(false);
const [hasMetalBox, setHasMetalBox] = useState(false);
const [showEnding, setShowEnding] = useState(false);
const [showFolder, setShowFolder] = useState(false);
const [showPhoneInfo, setShowPhoneInfo] = useState(false);
const [showDockPhone, setShowDockPhone] = useState(false);
const [showCinematic, setShowCinematic] = useState(false);
const [notification, setNotification] = useState("");
const [showPhotoEvidence, setShowPhotoEvidence] = useState(false);
const [showNoteEvidence, setShowNoteEvidence] = useState(false);
const [showPlankEvidence, setShowPlankEvidence] = useState(false);
const [showDiaryEvidence, setShowDiaryEvidence] = useState(false);
const [showKeyEvidence, setShowKeyEvidence] = useState(false);
const [showLetterEvidence, setShowLetterEvidence] = useState(false);
const [showMarkEvidence, setShowMarkEvidence] = useState(false);
const [showMetalEvidence, setShowMetalEvidence] = useState(false);
const [checkedPhone, setCheckedPhone] = useState(false);
const [checkedPlanks, setCheckedPlanks] = useState(false);
const [checkedWater, setCheckedWater] = useState(false);
const [showSymbolPuzzle, setShowSymbolPuzzle] = useState(false);
const [forestUnlocked, setForestUnlocked] = useState(false);
const [guestRoomUnlocked, setGuestRoomUnlocked] = useState(false);
const [showMapPieceEvidence, setShowMapPieceEvidence] = useState(false);
const [mapAnswer, setMapAnswer] = useState("");
const [mapSolved, setMapSolved] = useState(false);

const [openedDiary, setOpenedDiary] = useState(false);
const [openedRustyKey, setOpenedRustyKey] = useState(false);
const [openedMapPiece, setOpenedMapPiece] = useState(false);

const [introPlayed, setIntroPlayed] = useState(false);
const [phoneAudioPlayed, setPhoneAudioPlayed] = useState(false);
const [trailAudioPlayed, setTrailAudioPlayed] = useState(false);
const [endingAudioPlayed, setEndingAudioPlayed] = useState(false);

const [letterStarted, setLetterStarted] = useState(false);
const [visibleText, setVisibleText] = useState("");
  
const finalLetter = `📜 JANIN VIIMEINEN KIRJE

Jos kuulet tämän...

jokin meni pieleen.

Minun piti palata mökiltä jo tunteja sitten.

Aluksi kaikki tuntui tavalliselta.

Vanha mökki.
Laituri.
Metsäpolku.

Mutta sitten aloin löytää asioita, jotka eivät kuuluneet sinne.

Valokuvia ihmisistä, joita kukaan ei enää muistanut.

Päiväkirjan sivuja, jotka oli yritetty piilottaa.

Merkkejä siitä, että joku oli tutkinut samoja asioita ennen minua.

Ja lopulta ymmärsin jotakin, mitä en olisi halunnut koskaan tietää.

Tämä ei alkanut minusta.

Eikä se pääty minuun.

Joku tiesi totuuden jo vuonna 1952.

Joku yritti varoittaa.

Mutta kukaan ei kuunnellut.

Jos päätät jatkaa tästä eteenpäin...

ole varovainen.

Kaikki, mitä löydät, ei halua tulla löydetyksi.

Ja jos kuulet rannalta äänen, joka kuulostaa tutulta...

älä seuraa sitä.

...

Sillä totuus lepää edelleen järven pohjassa.

Ja joskus...

totuus katsoo takaisin.

...

VARTIJAT OVAT TÄÄLLÄ.`;

console.log({
  started,
  showFolder,
  showDockPhone,
  showEnding,
  showCinematic,
  atWell,
  atTrail,
  atShed,
  atGuestRoom,
  atSauna,
  atUnderDock,
  atCellar,
});
  useEffect(() => {
  if (started && !introPlayed) {
    const audio = new Audio("/intro_jani.mp3kovennettu.m4a");

    audio.volume = 1;

    audio.play().catch(() => {
      console.log("Introääntä ei voitu toistaa.");
    });

    setIntroPlayed(true);
  }
}, [started, introPlayed]);
useEffect(() => {
  if (showDockPhone && !phoneAudioPlayed) {
    const audio = new Audio("/janin_viesti.mp3");

    audio.volume = 1;

    audio.play().catch(() => {
      console.log("Puhelinääntä ei voitu toistaa.");
    });

    setPhoneAudioPlayed(true);
  }
}, [showDockPhone, phoneAudioPlayed]);
  useEffect(() => {
  
  if (atTrail && !trailAudioPlayed) {
    const audio = new Audio("/metsapolku_kuiskaus.mp3");

    audio.volume = 0.9;

    audio.play().catch(() => {
      console.log("Metsäpolun ääntä ei voitu toistaa.");
    });

    setTrailAudioPlayed(true);
  }
}, [atTrail, trailAudioPlayed]);
useEffect(() => {
  if (showEnding && !endingAudioPlayed) {

    const audio = new Audio("/loppukirje?v=1");

    audio.volume = 1;

    audio.play().catch(() => {
      console.log("Loppukirjeen ääntä ei voitu toistaa.");
    });

    setEndingAudioPlayed(true);
  }
}, [showEnding, endingAudioPlayed]);

  useEffect(() => {
  if (showEnding && !letterStarted) {
    setVisibleText("");
    setLetterStarted(true);

    let index = 0;

    const interval = setInterval(() => {
      setVisibleText(finalLetter.slice(0, index));
      index++;

      if (index > finalLetter.length) {
        clearInterval(interval);
      }
    }, 90);

    return () => clearInterval(interval);
  }
}, [showEnding, letterStarted]);
  const folderButton = (
  <button
    onClick={() => setShowFolder(true)}
    style={{
      position: "fixed",
      right: "20px",
      top: "50%",
      transform: "translateY(-50%)",
      zIndex: 9999,
      width: "90px",
      height: "120px",
      borderRadius: "16px",
      border: "2px solid #8b6f47",
      background: "#5b4328",
      color: "white",
      cursor: "pointer",
      boxShadow: "0 6px 18px rgba(0,0,0,0.4)",
      fontWeight: "bold",
      fontSize: "0.9rem",
    }}
  >
    🧳
    <br />
    Tutkijan
    <br />
    salkku
    <br />
    1952
  </button>
);

  if (showNoteEvidence) {
  return (
    <div className="screen screen--center">
      {folderButton}
      
      <div className="rain-overlay" />

      <div className="config-card">
        <h2>📝 Märkä muistilappu</h2>

        <img
  src="/märkämuistilappu.png?v=1"
  alt="Märkämuistilappu"
  style={{
    width: "100%",
    borderRadius: "12px",
    marginTop: "1rem",
    marginBottom: "1rem",
  }}
/>

<p>
  Muste on levinnyt sateessa.
  Suurin osa tekstistä on muuttunut lukukelvottomaksi.
</p>

<p>Vain yksi numero erottuu selvästi:</p>

<h2>1952</h2>

<blockquote>
  "Tämä ei alkanut Janista."
</blockquote>

        <button
          className="btn"
          onClick={() => setShowNoteEvidence(false)}
        >
          Sulje
        </button>
      </div>
    </div>
  );
}
  if (
  showFolder &&
  !showNoteEvidence &&
  !showPlankEvidence &&
  !showPhotoEvidence &&
  !showMarkEvidence &&
  !showDiaryEvidence &&
  !showKeyEvidence &&
  !showMetalEvidence &&
  !showLetterEvidence &&
  !showMapPieceEvidence 
) {
  return (
  <div className="screen screen--center">
    {folderButton}

    {notification && (
      <div className="notification">
        {notification}
      </div>
    )}

    <div className="rain-overlay" />

    <div className="config-card">
        <h1>🎒 Tutkijan kansio</h1>
<p>
  📂 Todisteita löydetty:
  {" "}
  {[
    hasPhone,
    hasNote,
    hasPlank,
    hasDiary,
    hasRustyKey,
    hasMapPiece,
    hasPhoto,
    hasLetter,
    hasGuardMark,
    hasMetalBox,
  ].filter(Boolean).length}
  / 10
</p>
      <div
  style={{
    marginBottom: "1.5rem",
    padding: "1rem",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "12px",
  }}
>
  <h3>📝 Tutkijan muistiinpanot</h3>

  <p>• Janin katoaminen ei vaikuta sattumalta.</p>

  {hasPhone && (
    <p>• Janin puhelimessa oli jotain, mitä hän ei ehtinyt kertoa.</p>
  )}

  {hasMapPiece && (
    <p>• Kartan pala viittaa siihen, että joku piilotti johtolankoja tarkoituksella.</p>
  )}

  {hasDiary && (
    <p>• Päiväkirjassa mainitaan, että joku seurasi heitä.</p>
  )}

  {hasRustyKey && (
    <p>• Ruostunut avain avaa vielä tuntemattoman oven.</p>
  )}
</div>
        {hasPhone && (
  <button
    className="evidence-card"
    onClick={() => setShowPhoneInfo(true)}
  >
    📱 Janin puhelin
  </button>
)}

{!hasPhone && (
  <p>⬜ Janin puhelin</p>
)}
        {showPhoneInfo && (
  <div className="config-card">
    <h3>📱 Janin puhelin</h3>

  <img
  src="/janipuhelin.png?v=2"
  alt="Janin puhelin"
  style={{
    width: "100%",
    borderRadius: "12px",
    marginTop: "1rem",
    marginBottom: "1rem"
  }}
/>

<p>
  Jani otti tämän kuvan juuri ennen katoamistaan.
</p>

    <button
      className="btn"
      onClick={() => setShowPhoneInfo(false)}
    >
      Sulje
    </button>
  </div>
)}
        {hasNote && (
  <button
    className="evidence-card"
    onClick={() => setShowNoteEvidence(true)}
  >
    📄 Märkä muistilappu ✨ UUSI!
  </button>
)}

  {hasPlank && (
  <button
    className="evidence-card"
    onClick={() => setShowPlankEvidence(true)}
  >
    🪵 Irtonainen lankku
  </button>
)}

        <br />

        {hasDiary && (
  <button
  className="evidence-card"
  onClick={() => {
    setShowDiaryEvidence(true);
    setOpenedDiary(true);
  }}
>
  📜 Päiväkirjan sivu
</button>
)}
{hasGuardMark && (
  <button
    className="evidence-card"
    onClick={() => setShowMarkEvidence(true)}
  >
    🛡️ Vartijoiden merkki
  </button>
)}
      {hasRustyKey && (
  <button
  className="evidence-card"
  onClick={() => {
    setShowFolder(false);
    setShowKeyEvidence(true);
  }}
  style={{
    width: "100%",
    marginTop: "0.5rem",
    marginBottom: "0.5rem",
    padding: "1rem",
    cursor: "pointer",
    display: "block",
    }}
>
  🔑 Ruostunutavain
</button>
  )}
  {hasMapPiece && (
  <button
    className="evidence-card"
    onClick={() => setShowMapPieceEvidence(true)}
  >
    🗺️ Märkä kartan pala
  </button>
)}  
        <br />

  
  {hasPhoto && (
  <button
    className="evidence-card"
    onClick={() => setShowPhotoEvidence(true)}
  >
    📷 Vanha valokuva
  </button>
)}

{hasLetter && (
  <button
    className="evidence-card"
    onClick={() => setShowLetterEvidence(true)}
  >
    📄 Kirje
  </button>
)}

        <br />

{hasMetalBox && (
  <button
    className="evidence-card"
    onClick={() => setShowMetalEvidence(true)}
  >
    📦 Metallirasia
  </button>
)}

        <button
  className="btn"
  onClick={() => setShowFolder(false)}
>
  ⬅️ Takaisin tutkimukseen
</button>
</div>
</div>
);
}

  if (showPhotoEvidence) {
    return (
    <div className="screen screen--center">
      {folderButton}
      
      <div className="rain-overlay" />

      <div className="config-card">
        <h2>📷 Vanha valokuva</h2>

        <img
          src="/vanhavalokuva.png"
          alt="Vanha valokuva"
          style={{
            width: "100%",
            borderRadius: "12px",
            marginTop: "1rem",
            marginBottom: "1rem",
          }}
        />

        <p>
          Kuvassa näkyy kolme henkilöä mökin rannassa.
          Yksi heistä näyttää katsovan suoraan kameraan...
        </p>

        <button
          className="btn"
          onClick={() => setShowPhotoEvidence(false)}
        >
          Sulje
        </button>
      </div>
    </div>
  );
}
  if (showPlankEvidence) {
  return (
    <div className="screen screen--center">
      {folderButton}

      <div className="rain-overlay" />

      <div className="config-card">
        <h2>🪵 Irtonainen lankku</h2>
        <img
  src="/irtonainenlankku.png"
  alt="Irtonainen lankku"
  style={{
    width: "100%",
    borderRadius: "12px",
    marginTop: "1rem",
    marginBottom: "1rem",
  }}
/>

        <p>
  Lankun alla oli vanha kangaspussi.
</p>

<p>
  Sen sisältä löytyi pieni ruostunutavain,
  metallinen symboli ja repäisty paperinpala.
</p>

<p>
  Kangaspussia ei ole koskettu vuosikymmeniin.
</p>

<blockquote>
  "...kolmas symboli osoittaa tien."
</blockquote>

<p>
  Kuka piilotti nämä? Ja miksi ne oli tarkoitettu
  löydettäväksi vasta nyt?
</p>

        <button
          className="btn"
          onClick={() => setShowPlankEvidence(false)}
        >
          Sulje
        </button>
      </div>
    </div>
  );
}
 if (showDiaryEvidence) {
  return (
    <div className="screen screen--center">
      {folderButton}

      <div className="rain-overlay" />

      <div className="config-card">
        <h2>📖 Päiväkirjan sivu</h2>

        <img
          src="/paivakirjansivu.png"
          alt="Päiväkirjan sivu"
          style={{
            width: "100%",
            borderRadius: "12px",
            marginTop: "1rem",
            marginBottom: "1rem",
          }}
          />
        <p>
  "Kesä 1952. Emme ole enää turvassa."
</p>

<button
  className="btn"
  onClick={() => setShowDiaryEvidence(false)}
>
  Sulje
</button>

</div>
</div>
);
}
          if (showKeyEvidence) {
  return (
    <div className="screen screen--center">
     {folderButton} 

      <div className="rain-overlay" />

      <div className="config-card">
        <h2>🔑 Ruostunutavain</h2>

        <img
          src="/ruostunutavain.png"
          alt="Ruostunutavain"
          style={{
            width: "100%",
            borderRadius: "12px",
            marginTop: "1rem",
            marginBottom: "1rem",
          }}
        />

        <p>
          Vanha avain on pahasti ruostunut.
        </p>

        <p>
          Avaimeen on kaiverrettu numero:
        </p>

        <h2>1952</h2>

        <blockquote>
          "Vierashuone."
        </blockquote>

        <button
          className="btn"
          onClick={() => setShowKeyEvidence(false)}
        >
          Sulje
        </button>
      </div>
    </div>
  );
}
        if (showMetalEvidence) {
  return (
    <div className="screen screen--center">
      {folderButton}

      <div className="rain-overlay" />

      <div className="config-card">
        <h2>📦 Metallirasia</h2>

        <p>
          Pieni metallirasia on kulunut ja sen kannessa näkyy
          sama symboli kuin aiemmin löydetyissä esineissä.
        </p>

        <p>
          Rasian lukko näyttää vanhalta, mutta se saattaa vielä avautua.
        </p>

        <blockquote>
          "Kaikkea ei ole tarkoitettu löydettäväksi liian aikaisin."
        </blockquote>

        <button
          className="btn"
          onClick={() => setShowMetalEvidence(false)}
        >
          Sulje
        </button>
      </div>
    </div>
  );
}
 if (showMapPieceEvidence) {
  return (
    <div className="screen screen--center">
      {folderButton}

      <div className="rain-overlay" />

      <div className="config-card">
        <h2>🗺️ Märkä kartan pala</h2>

        <img
  src="/kartanpala.png"
  alt="Märkä kartan pala"
  style={{
    width: "100%",
    borderRadius: "12px",
    marginTop: "1rem",
    marginBottom: "1rem",
  }}
/>

        <p>
          Kartan pala on pahasti kastunut.
        </p>

        <p>
          Siitä erottuu vain muutama sana:
        </p>

        <blockquote>
          "Missä vesi kohtaa..."
        </blockquote>

        <blockquote>
          "...puun..."
        </blockquote>
        
        <p
  style={{
    marginTop: "1rem",
    fontStyle: "italic",
    opacity: 0.75,
  }}
>
  🌲 Kuvassa polku katoaa puiden varjoihin.
</p>

        <p>
          Loput tekstistä ovat kuluneet pois.
        </p>
        <input
  type="text"
  value={mapAnswer}
  onChange={(e) => setMapAnswer(e.target.value)}
  placeholder="Mikä paikka tulee mieleesi?"
  className="btn"
  style={{ marginBottom: "1rem" }}
/>

<button
  className="btn"
  onClick={() => {
    const answer = mapAnswer.toLowerCase().trim();

    if (
      answer.includes("metsäpolku") ||
      answer.includes("metsä")
    ) {
      setMapSolved(true);
      setNotification("🌲 Oikein! Uusi johtolanka löytyi.");
    } else {
      setNotification("❌ Tämä ei tunnu oikealta.");
    }

    setTimeout(() => {
      setNotification("");
    }, 2500);
  }}
>
  🔍 Tarkista vastaus
</button>
      
{mapSolved && (
  <p style={{ marginTop: "1rem" }}>
    🌲 Kartan pala näyttää osoittavan metsäpolulle.
  </p>
)}
     {mapSolved && (
  <button
  className="btn"
  onClick={() => {
    setShowMapPieceEvidence(false);
    setShowFolder(false);

    setAtWell(false);
    setAtTrail(true);
  }}
  style={{ marginTop: "1rem" }}
>
  🌲 Siirry metsäpolulle
</button>
)}

        <button
          className="btn"
          onClick={() => setShowMapPieceEvidence(false)}
        >
          Sulje
        </button>
      </div>
    </div>
  );
} 
  
  if (showMarkEvidence) {
  return (
    <div className="screen screen--center">
      {folderButton}

      <div className="rain-overlay" />

      <div className="config-card">
        <h2>🛡️ Vartijoiden merkki</h2>

        <p>
          Vanha metallinen tunnusmerkki.
        </p>

        <p>
          Taakse on kaiverrettu sanat:
        </p>

        <h3>"Vartija ei koskaan jätä jälkiä."</h3>

        <button
          className="btn"
          onClick={() => setShowMarkEvidence(false)}
        >
          Sulje
        </button>
      </div>
    </div>
  );
}

useEffect(() => {
  if (showEnding && !letterStarted) {
    setVisibleText("");
    setLetterStarted(true);

    let index = 0;

    const interval = setInterval(() => {
      setVisibleText(finalLetter.slice(0, index));
      index++;

      if (index > finalLetter.length) {
        clearInterval(interval);
      }
    }, 90);

    return () => clearInterval(interval);
  }
}, [showEnding, letterStarted]);
  
  if (showEnding) {
  return (
    <div className="screen screen--center">
      {folderButton}
      
      <div className="rain-overlay" />

      <div className="parchment">
        <h2>📜 JANIN VIIMEINEN KIRJE</h2>

<pre
  style={{
    whiteSpace: "pre-wrap",
    fontFamily: "'Caveat', cursive",
    fontSize: "2rem",
    lineHeight: "1.8",
    textAlign: "left",
  }}
>
  {visibleText}
</pre>
        <button
  className="btn"
  onClick={() => setShowFolder(true)}
>
  🎒 Avaa tutkijan kansio
  </button>
        <button
  className="btn"
  onClick={() => {
    const audio = new AudioContext();

    const osc = audio.createOscillator();
    const gain = audio.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(120, audio.currentTime);
    osc.frequency.exponentialRampToValueAtTime(
      40,
      audio.currentTime + 1.5
    );

    gain.gain.setValueAtTime(0.001, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.6,
      audio.currentTime + 0.05
    );
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      audio.currentTime + 1.5
    );

    osc.connect(gain);
    gain.connect(audio.destination);

    osc.start();
    osc.stop(audio.currentTime + 1.5);

    setTimeout(() => {
  setShowEnding(false);
  setShowCinematic(true);
}, 1600);

  }}
>
  ➡️ Kohti Järven Vartijoita
</button>
      </div>
    </div>
  );
}
  if (showCinematic) {
  return (
    <div className="screen screen--center">
      {folderButton}

      <div className="rain-overlay" />

      <div className="parchment" style={{ textAlign: "center" }}>
        <h1>🌧️</h1>

        <h2>Totuus lepää järven pohjassa.</h2>

        <p style={{ marginTop: "2rem", opacity: 0.8 }}>
  Vartijat ovat täällä.
</p>

        <h3 style={{ marginTop: "3rem" }}>
          🌲 JATKUU Järven Vartijoissa...
        </h3>

        <button
  className="btn"
  style={{ marginTop: "2rem" }}
  onClick={() => window.location.reload()}
>
  ➡️ Avaa Järven Vartijat
</button>
      </div>
    </div>
  );
}
  if (atCellar) {
  return (
    <div className="screen screen--center">
      {folderButton}

      <div className="rain-overlay" />

      <div className="config-card">
        <h1>🕯️ Kellarin salaisuus</h1>

        <p>
          Vanhan kellarin ilma on kylmä. Joku on yrittänyt peittää totuuden vuosikymmeniä.
        </p>

        <h3>📖 Kadonnut päiväkirja</h3>
        <p>
          "Syyllinen ei ollut ulkopuolinen. Hän oli yksi meistä."
        </p>

        <h3>🗝️ Viimeinen avain</h3>
        <p>
          Avain avaa metallikaapin kellarin nurkassa.
        </p>

        <h3>👤 Totuus</h3>
        <p>
          Jani ei kadonnut sattumalta. Hän sai tietää vartijoiden salaisuuden.
        </p>

        <h1>🔦 Kadonnut Jani</h1>
        <p>
          Olet paljastanut mökin vuosikymmeniä kätkemän totuuden.
        </p>

        <button
  className="btn"
  onClick={() => {
  setLetterStarted(false);
  setVisibleText("");
  setEndingAudioPlayed(false);
  setShowEnding(true);
}}
>
  🔎 Paljasta Janin kohtalo
</button>
      </div>
    </div>
  );
}
  if (atUnderDock) {
  return (
    <div className="screen screen--center">
      {folderButton}

      <div className="rain-overlay" />

      <div className="config-card">
        <h1>🌊 Laiturin alla</h1>

        <p>
          Kylmä vesi paljastaa vanhan metallirasian.
        </p>

        <h3>📦 Metallirasia</h3>
        <p>
          Rasian sisältä löytyy vuoden 1952 valokuva.
        </p>

        <h3>📷 Valokuva</h3>
        <p>
          Kuvassa seisoo neljä henkilöä. Yksi heistä on revitty pois kuvasta.
        </p>

        <h3>📜 Viimeinen viesti</h3>
        <p>
          "Varjelkaa totuutta. Älkää avatko kellaria."
        </p>
       <button
  className="btn"
  onClick={() => setAtCellar(true)}
>
  🔐 Avaa kellarin salaisuus
</button>
      </div>
    </div>
  );
}
  if (atSauna) {
  return (
    <div className="screen screen--center">
      {folderButton}
      
      <div className="rain-overlay" />

      <div className="config-card">
        <h1>🧖 Sauna</h1>

        <p>
          Löylyissä tuntuu kuin joku olisi juuri poistunut.
        </p>

        <h3>📖 Märkä päiväkirjan sivu</h3>
        <p>
          "Totuus on piilotettu veden alle."
        </p>

        <h3>🪙 Vartijoiden merkki</h3>
        <p>
          Vanha metallinen tunnus, jossa on sama symboli kuin kaivossa.
        </p>

        <h3>🔑 Salainen avain</h3>
        <p>
          Avaimessa lukee: "Laiturin alle."
        </p>

        <h3>🌊 Seuraava johtolanka</h3>
<p>
  Vanhan laiturin alla on jotain, mitä ei koskaan löydetty.
</p>

<button
  className="btn"
  onClick={() => setAtUnderDock(true)}
>
  🌊 Tutki laiturin alusta
</button>
      </div>
    </div>
  );
}
  if (atGuestRoom) {
  return (
    <div className="screen screen--center">
      {folderButton}
      <div className="rain-overlay" />

      <div className="config-card">
        <h1>🚪 Vierashuone</h1>

        <h3>📷 Vanha valokuva</h3>
        <p>Kuvassa näkyy neljä henkilöä mökin portailla vuonna 1952.</p>

        <h3>📓 Päiväkirja</h3>
        <p>"Vartija katosi sinä yönä."</p>

        <h3>🗺️ Kartan pala</h3>
        <p>Kartta osoittaa kohti saunaa.</p>
        <button
  className="btn"
  onClick={() => setAtSauna(true)}
>
  🔥 Siirry saunalle
</button>
      </div>
    </div>
  );
}
  if (atShed) {
  return (
    <div className="screen screen--center">
      {folderButton}
      <div className="rain-overlay" />

      <div className="config-card">
        <h1>🏚️ Hylätty vaja</h1>

        <img
          src="/vaja_ulkopuoli.png"
          alt="Vaja"
          style={{
            width: "100%",
            borderRadius: "12px",
            marginBottom: "1rem",
          }}
        />

        <p>
          Oven saranat narisevat. Tuntuu kuin joku olisi ollut täällä äskettäin.
        </p>

        <h3>📦 Lukittu arkku</h3>

        <img
          src="/vaja_lukittu_arkku.png"
          alt="Arkku"
          style={{
            width: "100%",
            borderRadius: "12px",
            marginBottom: "1rem",
          }}
        />

        <p>
          Arkun kanteen on kaiverrettu numero 1952.
        </p>

        <h3>📜 Kirje</h3>

        <img
          src="/vaja_kirje.png"
          alt="Kirje"
          style={{
            width: "100%",
            borderRadius: "12px",
            marginBottom: "1rem",
          }}
        />

        <blockquote>
          "Jos jotain tapahtuu minulle,
          älkää luottako kaikkiin."
        </blockquote>

        <h3>🔑 Vierashuoneen avain</h3>

        <img
          src="/vaja_vierashuone_avain.png"
          alt="Vierashuoneen avain"
          style={{
            width: "100%",
            borderRadius: "12px",
            marginBottom: "1rem",
          }}
        />

        <p>
          Avaimessa lukee: "Vierashuone".
        </p>
        <h3>🩸 Verinen muistivihon sivu</h3>

<p>
  Vajan lattialankkujen alta pilkottaa repeytynyt sivu.
</p>

<blockquote>
  "Hän ei ollut se, joksi luulimme häntä.
  Jos löydät tämän...
  älä jää yksin."
</blockquote>

<p
  style={{
    fontStyle: "italic",
    opacity: 0.8,
  }}
>
  Kirjoitus päättyy kesken, kuin kirjoittaja olisi joutunut keskeyttämään.
</p>

        <button
          className="btn"
          onClick={() => {
            setHasLetter(true);

            setNotification("📜 Kirje lisätty kansioon");

            setTimeout(() => {
              setNotification("");
            }, 2500);

            setAtGuestRoom(true);
          }}
        >
          🚪 Siirry vierashuoneeseen
        </button>
      </div>
    </div>
  );
}
  if (atWell) {
  return (
    <div className="screen screen--center">
      {folderButton}
      <div className="rain-overlay" />

      <div className="config-card">

        <h1>🕳️ Vanha Kaivo</h1>

        <p>
          Kaivon reunaan on kaiverrettu sama symboli kuin laiturin lankussa.
        </p>

        <h3>📜 Repeytynyt päiväkirjan sivu</h3>
        <p>
          "Kesä 1952. Emme ole enää turvassa."
        </p>

        <h3>🔑 Ruostunut avain</h3>
        <p>
          Avaimeen on kaiverrettu numero: 1952
        </p>


        <h3>🗺️ Märkä kartan pala</h3>

<p>
  Kaivon pohjalta löytyy märkä ja repeytynyt kartan pala.
</p>

<p
  style={{
    marginTop: "1rem",
    fontStyle: "italic",
    opacity: 0.85,
  }}
>
  💡 Jokin tässä kartanpalassa tuntuu tärkeältä.
  Ehkä seuraava johtolanka löytyy vasta,
  kun ymmärrät mitä se yrittää kertoa.
</p>

<button
  className="btn"
  onClick={() => {
  setHasMapPiece(true);
  setHasDiary(true);
  setHasRustyKey(true);

  setNotification(
    "🗺️ Kartan pala, 📖 päiväkirja ja 🔑 avain lisätty kansioon"
  );

  setTimeout(() => {
    setNotification("");
  }, 2500);

    setAtWell(false);
setAtTrail(true);
}}
>
  🎒 Lisää tutkijan kansioon
</button>
        {!hasMapPiece && (
  <p
    style={{
      marginTop: "1rem",
      opacity: 0.8,
      fontStyle: "italic",
    }}
  >
    🔒 Tunne ei jätä rauhaan.
    Ehkä juuri tämä löytö kätkee seuraavan johtolangan.
  </p>
)}
        
      </div>
    </div>
  );
}
if (atTrail) {
  return (
    <div className="screen screen--center">
      {folderButton}
      <div className="rain-overlay" />

      <div className="config-card">
        <h1>🌲 Metsäpolku</h1>

        <p>
          Polulta löytyy tuoreita jalanjälkiä.
        </p>

        <h3>📷 Rikkinäinen valokuva</h3>
        <p>
          Kuvassa näkyy kolme henkilöä mökin rannassa.
        </p>

        <h3>👣 Jalanjäljet</h3>
        <p>
          Jäljet johtavat kohti vanhaa vajaa.
        </p>

        <h3>📓 Päiväkirjan sivu</h3>
        <p>
          "Joku seurasi meitä metsässä."
        </p>
        <h3>🏚️ Seuraa jalanjälkiä</h3>

<p>
Jäljet päättyvät vanhalle hylätylle vajalle.
</p>

<button
  className="btn"
  onClick={() => {
    setHasPhoto(true);

    setNotification("📷 Vanha valokuva lisätty kansioon");

    setTimeout(() => {
      setNotification("");
    }, 2500);

    setAtShed(true);
  }}
>
  🏚️ Siirry hylätylle vajalle
</button>
      </div>
    </div>
  );
}
  if (started) {
    if (
  !showDockPhone &&
  !atWell &&
  !atTrail &&
  !atShed &&
  !atGuestRoom &&
  !atSauna &&
  !atUnderDock &&
  !atCellar
) {
  return (
    <div className="screen screen--center">
      <div className="rain-overlay" />

      <div className="config-card">
        <h1>🌊 Laituri</h1>

        <p>
          Saavut mökin laiturille. Jani on kadonnut.
          Tutkimus alkaa tästä.
        </p>

       <button
  className="btn"
  onClick={() => setShowDockPhone(true)}
>
  📱 Tutki Janin puhelinta
</button>

  {hasMapPiece && (
  <button
    className="btn"
    onClick={() => setAtTrail(true)}
  >
    👣 Seuraa jalanjälkiä
  </button>
)}
      </div>
    </div>
  );
}
    if (showDockPhone) {
  return (
    <div className="screen screen--center">
      {folderButton}


      <div className="rain-overlay" />

      <div className="config-card">
        <h1>📱 Janin puhelin</h1>

        <img
          src="/janipuhelin.png?v=2"
          alt="Rikkinäinen puhelin"
          style={{
            width: "100%",
            borderRadius: "12px",
            marginTop: "1rem",
            marginBottom: "1rem",
          }}
        />

        <p>
          Puhelimen näyttö on pahasti haljennut.
        </p>

        <p>
          Viimeinen tallennettu kuva on otettu vain
          muutamia minuutteja ennen Janin katoamista.
        </p>

        <p>
          Kuvassa näkyy vanha sammaloitunut kaivo.
        </p>

        <h3>🕚 23:47</h3>

        <p>
          Miksi Jani oli siellä keskellä yötä?
        </p>

        <button
  className="btn"
  onClick={() => {
    setHasPhone(true);
    setHasNote(true);
    // setShowNoteEvidence(true);

    setNotification("📱 Janin puhelin lisätty kansioon");

    setTimeout(() => {
      setNotification("");
    }, 2500);

    setShowDockPhone(false);
setAtWell(true);
  }}
>
  🎒 Lisää tutkijan kansioon
</button>

<br /><br />

<button
  className="btn"
  onClick={() => setShowDockPhone(false)}
>
  Sulje
</button>
      </div>
      </div>
      );
}
}
  return (
  <div className="screen screen--center">

    <img
      src="/01_aloitusnakyma_vartijat_valvovat.png"
      alt="Kadonnut Jani"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
    />

    <div className="rain-overlay" />

    <div
  className="config-card"
  style={{
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  zIndex: 0,
}}
>
      <h1>🔦 Kadonnut Jani</h1>

      <p
        style={{
          fontFamily: "'Caveat', cursive",
          fontSize: "2rem",
          marginBottom: "0.5rem",
        }}
      >
        Jani katosi kolme päivää sitten.
      </p>

      <p
        style={{
          fontFamily: "'Caveat', cursive",
          fontSize: "2rem",
          marginBottom: "1.5rem",
        }}
      >
        Mitä mökillä tapahtui?
      </p>

      <button
        className="btn"
        onClick={() => setStarted(true)}
      >
        🔦 Aloita tutkimus
      </button>
    </div>
  </div>
);

}
