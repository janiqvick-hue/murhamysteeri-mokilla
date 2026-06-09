import { useState } from "react";

export default function KadonnutJaniScreen() {
  const [started, setStarted] = useState(false);
  const [atWell, setAtWell] = useState(false);
  const [atTrail, setAtTrail] = useState(false);
  const [atShed, setAtShed] = useState(false);
  const [atGuestRoom, setAtGuestRoom] = useState(false);
  const [atSauna, setAtSauna] = useState(false);
  const [atUnderDock, setAtUnderDock] = useState(false);
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
  onClick={() => setAtUnderDock(true)}
>
  🌊 Tutki laiturin alusta
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
  onClick={() => alert("Jatkuu seuraavassa luvussa...")}
>
  🔐 Avaa kellarin salaisuus
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

          <h3>📄 Märkä muistilappu</h3>
          <p>
            Lapussa lukee vain yksi numero:
            <strong> 1952 </strong>
          </p>

          <h3>🪵 Irtonainen lankku</h3>
          <p>
            Sen alle on kaiverrettu outo symboli: 🌲
          </p>
          <button
  className="btn"
  onClick={() => setAtWell(true)}
>
  Siirry vanhalle kaivolle
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
