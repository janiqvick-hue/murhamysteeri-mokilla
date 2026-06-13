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

  // ─── AMBIENT AUDIO-SYNTETISAATTORI (KOVENNETTU MYRSKY- JA HUMINA-EFEKTI) ───
  useEffect(() => {
    if (audioEnabled) {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Matala humina (pahaenteinen drone-ääni)
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

        // Taustasateen kohina
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
