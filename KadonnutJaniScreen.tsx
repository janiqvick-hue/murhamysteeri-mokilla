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
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [droneOscillator, setDroneOscillator] = useState<OscillatorNode | null>(null);
  
  // Arvoitusten syötteet
  const [suitcaseCode, setSuitcaseCode] = useState("");
  const [cellarPassword, setCellarPassword] = useState("");

  // Kirjeen dynaaminen kirjoitus
  const [visibleText, setVisibleText] = useState("");
  const [letterStarted, setLetterStarted] = useState(false);

  const finalLetter = `📜 JANIN VIIMEINEN KIRJE...

Kaikki alkoi jo kauan ennen minua.

Joku yritti varoittaa jo vuonna 1952, eikä totuus pääty minuun.

Jos kuulet rannalta äänen, joka kuulostaa tutulta...

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

  // Ambient audio-syntetisaattori (Kovennettu myrsky ja matala humina)
  useEffect(() => {
    if (audioEnabled) {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gainNode = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(48, ctx.currentTime); 
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(120, ctx.currentTime);

        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(0.08, ctx.currentTime); 
        lfoGain.gain.setValueAtTime(0.18, ctx.currentTime); 

        lfo.connect(lfoGain);
        lfoGain.connect(gainNode.gain);
        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        gainNode.gain.setValueAtTime(0.22, ctx.currentTime); 
        osc.start();
        lfo.start();

        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const rainSource = ctx.createBufferSource();
        rainSource.buffer = noiseBuffer;
        rainSource.loop = true;

        const rainFilter = ctx.createBiquadFilter();
        rainFilter.type = 'bandpass';
        rainFilter.frequency.setValueAtTime(380, ctx.currentTime);
        rainFilter.Q.setValueAtTime(1.0, ctx.currentTime);

        const rainGain = ctx.createGain();
        rainGain.gain.setValueAtTime(0.12, ctx.currentTime); 

        rainSource.connect(rainFilter);
        rainFilter.connect(rainGain);
        rainGain.connect(ctx.destination);
        rainSource.start();

        setAudioContext(ctx);
        setDroneOscillator(osc);
      } catch (err) {
        console.error("Audioalustuksen virhe:", err);
      }
    } else {
      if (audioContext) {
        audioContext.close().catch(() => {});
        setAudioContext(null);
        setDroneOscillator(null);
      }
    }
    return () => {
      if (audioContext) {
        audioContext.close().catch(() => {});
      }
    };
  }, [audioEnabled]);
  // Klikkaus-, löytö- ja virheäänet
  const playChime = (type: 'find' | 'unlock' | 'error' | 'click') => {
    if (!audioEnabled || !audioContext) return;
    try {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.connect(gain);
      gain.connect(audioContext.destination);

      if (type === 'find') {
        osc.frequency.setValueAtTime(320, audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(640, audioContext.currentTime + 0.35);
        gain.gain.setValueAtTime(0.55, audioContext.currentTime); 
        gain.gain.linearRampToValueAtTime(0.01, audioContext.currentTime + 0.35);
        osc.start();
        osc.stop(audioContext.currentTime + 0.36);
      } else if (type === 'unlock') {
        osc.frequency.setValueAtTime(440, audioContext.currentTime);
        osc.frequency.setValueAtTime(554, audioContext.currentTime + 0.1);
        osc.frequency.setValueAtTime(659, audioContext.currentTime + 0.2);
        gain.gain.setValueAtTime(0.50, audioContext.currentTime); 
        gain.gain.linearRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        osc.start();
        osc.stop(audioContext.currentTime + 0.4);
      } else if (type === 'error') {
        osc.frequency.setValueAtTime(120, audioContext.currentTime);
        osc.frequency.linearRampToValueAtTime(70, audioContext.currentTime + 0.25);
        gain.gain.setValueAtTime(0.55, audioContext.currentTime); 
        gain.gain.linearRampToValueAtTime(0.01, audioContext.currentTime + 0.25);
        osc.start();
        osc.stop(audioContext.currentTime + 0.26);
      } else {
        osc.frequency.setValueAtTime(400, audioContext.currentTime);
        gain.gain.setValueAtTime(0.30, audioContext.currentTime); 
        gain.gain.linearRampToValueAtTime(0.001, audioContext.currentTime + 0.08);
        osc.start();
        osc.stop(audioContext.currentTime + 0.09);
      }
    } catch (e) {}
  };

  // Puheäänien soitto (volume = 1.0)
  const playAudio = (src: string) => {
    if (!audioEnabled) return;
    const audio = new Audio(src);
    audio.volume = 1.0;
    audio.play().catch(() => console.log("Ääntä ei voitu toistaa."));
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
      onClick={() => { playChime('click'); setShowFolder(true); }}
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

  // SALKKUNÄKYMÄ
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
                  onClick={() => { playChime('click'); setSelectedEvidence(e.id); }}
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
              <button className="btn" style={{ marginTop: "1rem", padding: "4px 12px" }} onClick={() => { playChime('click'); setSelectedEvidence(null); }}>Takaisin listaan</button>
            </div>
          )}

          <button className="btn" onClick={() => { playChime('click'); setShowFolder(false); }} style={{ width: "100%", background: "#8b6f47", marginTop: "1rem" }}>
            Sulje salkku
          </button>
        </div>
      </div>
    );
  }
  // ALKURUUTU
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

          <button className="btn" onClick={() => { setAudioEnabled(true); setStarted(true); setTimeout(() => playAudio("/intro_jani.mp3kovennettu.m4a"), 300); }}>
            Aloita tutkimus
          </button>
        </div>
      </div>
    );
  }

  // STAGES 1-8
  return (
    <div className="screen screen--center">
      <div className="rain-overlay" />
      {folderButton}

      <div style={{ position: "absolute", top: "15px", left: "15px", display: "flex", gap: "10px", zIndex: 10 }}>
        <button onClick={() => setAudioEnabled(!audioEnabled)} style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: "1.2rem" }}>
          {audioEnabled ? "🔊" : "🔇"}
        </button>
        <button onClick={resetGame} style={{ background: "none", border: "none", color: "red", cursor: "pointer", fontSize: "1.2rem" }}>
          🔄
        </button>
      </div>

      {notification && <div className="notification" style={{ background: "#f59e0b", color: "black", padding: "8px 16px", borderRadius: "8px", fontWeight: "bold", position: "fixed", top: "20px" }}>{notification}</div>}

      <div className="config-card" style={{ maxWidth: "500px", width: "95%" }}>
        
        {currentStage === 1 && (
          <>
            <h2>1. Laituri</h2>
            <p>Sade piiskaa Lopen mökin rantaa. Janin katoamisesta on kulunut kolme päivää. Etsi merkkejä hänestä laiturilta.</p>
            {!hasPhone ? (
              <button className="btn" onClick={() => { setHasPhone(true); setHasNote(true); playChime('find'); playAudio("/janin_viesti.mp3"); setNotification("Löysit Janin puhelimen ja märän lapun!"); }}>
                Tutki laituria
              </button>
            ) : (
              <>
                <p style={{ color: "#22c55e", margin: "1rem 0" }}>✓ Janin puhelin löydetty! Viimeinen valokuva esittää vanhaa sammaloitunutta kaivoa metsän reunassa.</p>
                <button className="btn" onClick={() => { playChime('click'); setCurrentStage(2); }}>Suuntaa Kaivolle →</button>
              </>
            )}
          </>
        )}

        {currentStage === 2 && (
          <>
            <h2>2. Vanha kaivo</h2>
            <p>Seuraat puhelimen kuvaa kaivolle. Se on synkkä ja kylmä. Kurkista kaivon sisään löytääksesi vuoden 1952 salaisuuksia.</p>
            {!hasRustyKey ? (
              <button className="btn" onClick={() => { setHasRustyKey(true); setHasMapPiece(true); playChime('find'); setNotification("Löysit ruostuneen avaimen 1952 ja kartan palan!"); }}>
                Kurkista kaivoon
              </button>
            ) : (
              <>
                <p style={{ color: "#22c55e", margin: "1rem 0" }}>✓ Ruostunut avain '1952' löydetty. Kartan pala osoittaa hämärän polun syvälle kuusikkoon.</p>
                <button className="btn" onClick={() => { playChime('click'); setCurrentStage(3); playAudio("/metsapolku_kuiskaus.mp3"); }}>Seuraa metsäpolkua →</button>
              </>
            )}
          </>
        )}

        {currentStage === 3 && (
          <>
            <h2>3. Metsäpolku</h2>
            <p>Sumu tihenee polulla. Kuulet outoa kuisketta puiden välistä. Maassa näkyy tuoreita jalanjälkiä, aivan kuin Jania olisi seurattu.</p>
            {!hasPhoto ? (
              <button className="btn" onClick={() => { setHasPhoto(true); playChime('find'); setNotification("Löysit rikkinäisen valokuvan rannasta!"); }}>
                Tutki jalanjälkiä
              </button>
            ) : (
              <>
                <p style={{ color: "#22c55e", margin: "1rem 0" }}>✓ Jalanjäljet johtavat suoraan huvilan takana olevalle hylätylle vajalle.</p>
                <button className="btn" onClick={() => { playChime('click'); setCurrentStage(4); }}>Mene Vajalle →</button>
              </>
            )}
          </>
        )}

        {currentStage === 4 && (
          <>
            <h2>4. Hylätty vaja</h2>
            <p>Vajan ovi narisee tuulessa. Nurkassa on tukeva rauta-arkku, joka vaatii avaimen. Kirjeessä varoitetaan luottamasta kehenkään.</p>
            {!hasLetter ? (
              <button className="btn" onClick={() => { setHasLetter(true); playChime('unlock'); setNotification("Avasit arkun kaivon avaimella! Löysit kirjeen ja Vierashuoneen avaimen."); }}>
                Avaa lukittu arkku
              </button>
            ) : (
              <>
                <p style={{ color: "#22c55e", margin: "1rem 0" }}>✓ Arkku avattu. Sait avaimen loistohuvilan vierashuoneeseen tutkiaksesi Janin tavaroita.</p>
                <button className="btn" onClick={() => { playChime('click'); setCurrentStage(5); }}>Astu Vierashuoneeseen →</button>
              </>
            )}
          </>
        )}

        {currentStage === 5 && (
          <>
            <h2>5. Huvilan vierashuone</h2>
            <p>Huoneessa vallitsee psykologinen kauhu. Halkeilevaan vanhaan peiliin on raaputettu: <i>'Älä katso taaksesi.'</i> Sängyn alta löytyy lukittu matkalaukku.</p>
            
            <div style={{ margin: "1.5rem 0" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Syötä matkalaukun 4-numeroinen koodi:</label>
              <input
                type="number"
                maxLength={4}
                value={suitcaseCode}
                onChange={(e) => setSuitcaseCode(e.target.value)}
                placeholder="XXXX"
                style={{ padding: "8px", borderRadius: "6px", border: "1px solid #8b6f47", background: "#1a2540", color: "white", textAlign: "center", width: "120px", fontSize: "1.2rem" }}
              />
            </div>

            <button
              className="btn"
              onClick={() => {
                if (suitcaseCode === "1952") {
                  playChime('unlock');
                  setNotification("Koodi oikein! Matkalaukku aukesi ja löysit rantasaunan avaimen.");
                  setCurrentStage(6);
                } else {
                  playChime('error');
                  alert("Väärä koodi! Etsi vihjettä salkun muistilapusta.");
                }
              }}
            >
              Yritä avata matkalaukku
            </button>
          </>
        )}

        {currentStage === 6 && (
          <>
            <h2>6. Rantasauna</h2>
            <p>Astit sisään hämärään rantasaunaan. Lauteiden alta vetää kylmä viima. Etsi salalokeroa, jonne Jani piilotti viimeiset löytönsä.</p>
            {!hasGuardMark ? (
              <button className="btn" onClick={() => { setHasGuardMark(true); setHasPlank(true); playChime('find'); setNotification("Löysit Vartijoiden merkin ja lankun, jossa lukee: 'Totuus on piilotettu veden alle.'"); }}>
                Etsi lauteiden alta
              </button>
            ) : (
              <>
                <p style={{ color: "#22c55e", margin: "1rem 0" }}>✓ Vihje johdattaa sinut takaisin rantaan. Totuus odottaa syvällä veden alla.</p>
                <button className="btn" onClick={() => { playChime('click'); setCurrentStage(7); }}>Palaa Laiturille →</button>
              </>
            )}
          </>
        )}

        {currentStage === 7 && (
          <>
            <h2>7. Laiturin alla</h2>
            <p>Laskeudut kylmään Lopen järviveteen laiturin tolpan juurelle. Kätesi osuu pohjamudassa johonkin metalliseen. Varoitus kuuluu: <i>'Älkää avatko kellaria.'</i></p>
            {!hasMetalBox ? (
              <button className="btn" onClick={() => { setHasMetalBox(true); playChime('find'); setNotification("Noudit vedestä pienen metallirasian ja vuoden 1952 valokuvan!"); }}>
                Kurota veteen tolpan juurelle
              </button>
            ) : (
              <>
                <p style={{ color: "#22c55e", margin: "1rem 0" }}>✓ Metallirasia noudettu järvestä. Viimeinen suljettu paikka on huvilan vanha kellari. Astu sisään omalla vastuulla.</p>
                <button className="btn" onClick={() => { playChime('click'); setCurrentStage(8); }}>Laskeudu Kellariin 🔦 →</button>
              </>
            )}
          </>
        )}

        {currentStage === 8 && (
          <>
            {!hasDiary ? (
              <>
                <h2>8. Kellarin salaisuus</h2>
                <p>Olet kellarin pimeydessä. Seinään on raaputettu: <i>'TOTUUS EI SAA NOUSTA PINTAAN.'</i> Edessäsi on Vartijoiden vanha sähkökaappi, joka vaatii salasanan.</p>
                
                <div style={{ margin: "1.5rem 0" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Syötä Vartijoiden sähkökaapin salasana:</label>
                  <input
                    type="text"
                    value={cellarPassword}
                    onChange={(e) => setCellarPassword(e.target.value.toUpperCase())}
                    placeholder="SALASANA"
                    style={{ padding: "8px", borderRadius: "6px", border: "1px solid #8b6f47", background: "#1a2540", color: "white", textAlign: "center", width: "180px", fontSize: "1.1rem" }}
                  />
                </div>

                <button
                  className="btn"
                  onClick={() => {
                <button
                  className="btn"
                  onClick={() => {
                    if (cellarPassword === "VARTIJAT" || cellarPassword === "1952") {
                      setHasDiary(true);
                      playChime('unlock');
                      playAudio("/loppukirje");
                      setNotification("Sähkökaappi aukesi! Janin kadonnut päiväkirja ja viimeinen viesti paljastuvat.");
                    } else {
                      playChime('error');
                      alert("Väärä salasana! Mikä oli ryhmän nimi vuonna 1952?");
                    }
                  }}
                >
                  Avaa sähkökaappi
                </button>
              </>
            ) : (
              <div 
                style={{
                  background: "#f4eccf",
                  backgroundImage: "radial-gradient(circle, #f2e6bf 0%, #dfcf9d 100%)",
                  color: "#2b1d0c",
                  padding: "2.5rem 1.5rem",
                  borderRadius: "12px",
                  boxShadow: "inset 0 0 40px rgba(139,111,71,0.5), 0 8px 24px rgba(0,0,0,0.5)",
                  fontFamily: "'Caveat', 'Dancing Script', cursive",
                  fontSize: "1.45rem",
                  lineHeight: "1.5",
                  textAlign: "center",
                  border: "2px solid #b3966d",
                  maxHeight: "80svh",
                  overflowY: "auto"
                }}
              >
                <p style={{ whiteSpace: "pre-wrap", fontWeight: "bold" }}>{visibleText}</p>
                
                {visibleText.length >= finalLetter.length && (
                  <button 
                    className="btn" 
                    onClick={() => { playChime('click'); resetGame(); }}
                    style={{ marginTop: "2rem", background: "#5b4328", color: "white", fontFamily: "sans-serif", fontSize: "0.9rem", border: "none" }}
                  >
                    Pelaa uudelleen
                  </button>
                )}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
