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
const [showNoteInfo, setShowNoteInfo] = useState(false);
  if (showFolder) {
  return (
    <div className="screen screen--center">
      <div className="rain-overlay" />

      <div className="config-card">
        <h1>🎒 Tutkijan kansio</h1>

        {hasPhone && (
  <button
    className="btn"
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
  src="/IMG_1083.jpeg"
  alt="Vanha kaivo"
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
    className="btn"
    onClick={() => setShowNoteInfo(true)}
  >
    📄 Märkä muistilappu
  </button>
)}

{!hasNote && (
  <p>⬜ Märkä muistilappu</p>
)}
        {showNoteInfo && (
  <div className="config-card">
    <h3>📄 Märkä muistilappu</h3>

    <h1
      style={{
        letterSpacing: "6px",
      }}
    >
      1952
    </h1>

    <p>
      Miksi juuri tämä vuosiluku esiintyy kaikkialla?
    </p>

        <p>{hasPlank ? "☑️" : "⬜"} Irtonainen lankku</p>

<br />

<p>{hasDiary ? "☑️" : "⬜"} Päiväkirjan sivu</p>
<p>{hasRustyKey ? "☑️" : "⬜"} Ruostunut avain</p>

<p>{hasPhoto ? "☑️" : "⬜"} Vanha valokuva</p>
<p>{hasLetter ? "☑️" : "⬜"} Kirje</p>

<br />

<p>{hasGuardMark ? "☑️" : "⬜"} Vartijoiden merkki</p>
<p>{hasMetalBox ? "☑️" : "⬜"} Metallirasia</p>

        <button
          className="btn"
          onClick={() => setShowFolder(false)}
        >
          ⬅️ Takaisin tutkimukseen
        </button>
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
          onClick={() =>
            alert("🌲 Järven Vartijat avautuvat seuraavassa osassa...")
          }
        >
          ➡️ Kohti Järven Vartijoita
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

        <h3>🏆 Murhamysteeri ratkaistu</h3>
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
    if (atWell) {
  return (
    <div className="screen screen--center">
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
    </div>
  );
}
    return (
      <div className="screen screen--center">
        <div className="rain-overlay" />

        <div className="config-card">
         <h1>🌊 Laituri</h1>

<p>
  Janin puhelimen viimeinen sijainti osoittaa vanhalle laiturille.
</p>

<p>
  Tutki ympäristöä löytääksesi ensimmäiset vihjeet.
</p>

<hr />

<h3>📱 Janin puhelin</h3>
<p>
  Näytöllä näkyy kuva vanhasta kaivosta.
</p>

<button
  className="btn"
  onClick={() => {
    setHasPhone(true);
    alert("🎒 Uusi todiste lisätty: Janin puhelin");
  }}
>
  🎒 Lisää tutkijan kansioon
</button>

<h3>📄 Märkä muistilappu</h3>

<p>
  Lapussa lukee vain yksi numero:
  <strong>1952</strong>
</p>

<button
  className="btn"
  onClick={() => {
    setHasNote(true);
    alert("🎒 Uusi todiste lisätty: Märkä muistilappu");
  }}
>
  🎒 Lisää tutkijan kansioon
</button>

<h3>🪵 Irtonainen lankku</h3>

<p>
  Sen alle on kaiverrettu outo symboli: 🌲
</p>

<button
  className="btn"
  onClick={() => {
    setHasPlank(true);
    alert("🎒 Uusi todiste lisätty: Irtonainen lankku");
    setAtWell(true);
  }}
>
  🕳️ Siirry vanhalle kaivolle
</button>

        </div>
      </div>
    );
  }

  return (
    <div className="screen screen--center">
      <div className="rain-overlay" />

      <div className="config-card">
        <h1>🔎 Kadonnut Jani</h1>

        <p>
          Kolme kuukautta murhan ratkaisemisen jälkeen
          Janin puhelin löytyy uudelleen.
        </p>

        <p>
          Puhelimessa on yksi uusi viesti:
        </p>

        <blockquote>
          "Jos luette tämän, olen löytänyt jotain.
          Älkää tulko etsimään minua."
        </blockquote>

        <button
          className="btn"
          onClick={() => setStarted(true)}
        >
          Aloita tutkimus
        </button>
      </div>
    </div>
  );
}
