import { useState } from "react";

export default function KadonnutJaniScreen() {
  const [started, setStarted] = useState(false);
  const [atWell, setAtWell] = useState(false);

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
