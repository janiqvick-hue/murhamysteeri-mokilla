import { useState } from "react";

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

  if (showNoteEvidence) {
  return (
    <div className="screen screen--center">
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
  !showDiaryEvidence
) {
  return (
  <div className="screen screen--center">

    {notification && (
      <div className="notification">
        {notification}
      </div>
    )}

    <div className="rain-overlay" />

    <div className="config-card">
        <h1>🎒 Tutkijan kansio</h1>

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
    onClick={() => setShowDiaryEvidence(true)}
  >
    📖 Päiväkirjan sivu
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
  
  if (showMarkEvidence) {
  return (
    <div className="screen screen--center">
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
  if (showEnding) {
  return (
    <div className="screen screen--center">
      <div className="rain-overlay" />

      <div className="parchment">
        <h2>📜 JANIN VIIMEINEN KIRJE</h2>

        <p><i>
          Jos luet tätä, onnistuit siellä missä minä epäonnistuin.
        </i></p>

        <p>
          Seurasit jälkiäni laiturilta kaivolle,
          metsäpolulle ja kellarin pimeyteen asti.
        </p>

        <p>
          Sinä ratkaisit Janin katoamisen.
        </p>

        <p>
          Mutta totuus ei pääty tähän.
        </p>

        <p>
          Järvi kätkee edelleen vastauksia.
        </p>

        <p>
          <strong>Ja Järven Vartijat odottavat...</strong>
        </p>
        <p
  style={{
    marginTop: "2rem",
    fontStyle: "italic",
    opacity: 0.8,
  }}
>
  Mökillä, syksyllä 1952
</p>

        <p style={{ marginTop: "2rem" }}>
          – Jani
        </p>

        <hr />

        <h3>🌲 JATKUU...</h3>

        <p>
          JÄRVEN VARTIJAT<br />
          Varjojen Perintö
        </p>
        <p
  style={{
    marginTop: "1rem",
    fontStyle: "italic",
  }}
>
  "Totuus lepää järven pohjassa."
</p>
<p
  style={{
    marginTop: "2rem",
    opacity: 0.7,
    fontStyle: "italic",
  }}
>
  Järveltä kuuluu kaukainen huuto...
</p>

<p
  style={{
    fontWeight: "bold",
    letterSpacing: "2px",
  }}
>
  "Vartijat ovat palanneet."
</p>
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
      <div className="rain-overlay" />

      <div className="parchment" style={{ textAlign: "center" }}>
        <h1>🌧️</h1>

        <h2>Totuus lepää järven pohjassa.</h2>

        <p style={{ marginTop: "2rem", opacity: 0.8 }}>
          Vartijat ovat palanneet.
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
  onClick={() => setShowEnding(true)}
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
      <div className="rain-overlay" />

      <div className="config-card">
        <h1>🏚️ Hylätty Vaja</h1>

        <p>
          Vaja näyttää olleen autiona vuosia.
        </p>

        <h3>📦 Lukittu arkku</h3>
        <p>
          Arkun kannessa on numero 1952.
        </p>

        <h3>🧥 Vanha takki</h3>
        <p>
          Taskusta löytyy taiteltu kirje.
        </p>

        <h3>📜 Kirje</h3>
        <p>
          "Jos jotain tapahtuu minulle, älkää luottako kaikkiin."
        </p>

        <h3>🔑 Yläkerran avain</h3>
        <p>
          Avaimessa lukee: Vierashuone.
        </p>
        <h3>🚪 Vierashuone</h3>

<p>
Yläkerran avain sopii vanhan vierashuoneen oveen.
</p>

<button
  className="btn"
  onClick={() => setAtGuestRoom(true)}
>
  🚪 Siirry vierashuoneeseen
</button>
      </div>
    </div>
  );
}
if (atTrail) {
  return (
    <div className="screen screen--center">
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
  onClick={() => setAtShed(true)}
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

        <button
          className="btn"
          onClick={() => setAtTrail(true)}
        >
          👣 Seuraa jalanjälkiä
        </button>
      </div>
    </div>
  );
}
    if (showDockPhone) {
  return (
    <div className="screen screen--center">

      <button
        className="btn"
        onClick={() => setShowFolder(true)}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 1000,
        }}
      >
        🎒 Tutkijan kansio
      </button>

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
    setShowNoteEvidence(true);

    setNotification("📱 Janin puhelin lisätty kansioon");

    setTimeout(() => {
      setNotification("");
    }, 2500);

    setShowDockPhone(false);
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
   if (atWell) {
  return (
    <div className="screen screen--center">

      <button
  className="btn"
  onClick={() => setShowFolder(true)}
  style={{
    position: "absolute",
    top: "20px",
    right: "20px",
    zIndex: 1000,
  }}
>
  🎒 Tutkijan kansio
</button>

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
        <button
  className="btn"
  onClick={() => {
    setHasDiary(true);
    setNotification("📜 Uusi todiste: Päiväkirjan sivu");

    setTimeout(() => {
      setNotification("");
    }, 2500);
  }}
>
  🎒 Lisää tutkijan kansioon
</button>

        <h3>🔑 Ruostunutavain</h3>
        <p>
          Avaimeen on kaiverrettu numero: 1952
        </p>
        <button
  className="btn"
  onClick={() => {
    setHasRustyKey(true);
    setNotification("🔑 Uusi todiste: Ruostunutavain");

    setTimeout(() => {
      setNotification("");
    }, 2500);
  }}
>
  🎒 Lisää tutkijan kansioon
</button>

        <h3>🧭 Kartan kulma</h3>
        <p>
          Metsäpolku
        </p>
        <h3>🌲 Seuraava johtolanka</h3>

<p>
  Kartan kulma osoittaa metsään johtavalle polulle.
</p>

<button
  className="btn"
  onClick={() => setAtTrail(true)}
>
  🌲 Siirry metsäpolulle
</button>
          </div>
  );
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
        background: "rgba(0,0,0,0.55)",
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
    </div>
  );
}
