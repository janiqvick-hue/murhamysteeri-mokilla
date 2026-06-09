import { useState } from "react";

export default function KadonnutJaniScreen() {
  const [started, setStarted] = useState(false);
  const [atWell, setAtWell] = useState(false);
  const [atTrail, setAtTrail] = useState(false);
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
