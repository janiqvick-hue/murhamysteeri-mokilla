import React, { useState, useEffect } from 'react';
import {
  Phone, BookOpen, Key, Compass, Waves, Shield, Box, Lock, Unlock,
  Volume2, VolumeX, Eye, RefreshCw, AlertCircle, HelpCircle, Search,
  Skull, Maximize2, FileText, CheckCircle, MapPin
} from 'lucide-react';
import { LocationId, EvidenceId, Evidence, GameState } from './tyypit';

// Lopen käsikirjoituksen mukaiset 10 virallista todistetta omilla kuvillasi kytkettynä
const CONST_EVIDENCE_ITEMS: Record<EvidenceId, Evidence> = {
  puhelin: {
    id: 'puhelin',
    name: 'Janin puhelin',
    foundAt: 'Laituri (Alku)',
    icon: '📱',
    imageUrl: '/janipuhelin.png',
    description: 'Janin laiturille jättämä älypuhelin. Näyttö on säpäleinä ja kuori kostea, mutta virta menee päälle. Viimeisin otettu kuva esittää vanhaa kivikaivoa huvilan takamaastossa sumun keskellä.',
    secretHint: 'Puhelimen kuva osoittaa suoraan kaivon suuntaan. Jokin on piilotettu sinne.'
  },
  muistilappu: {
    id: 'muistilappu',
    name: 'Märkä muistilappu',
    foundAt: 'Laituri (Alku)',
    icon: '📝',
    imageUrl: '/märkämuistilappu.png',
    description: 'Sateen turmelema paperilappu, josta erottuu hätäinen käsiala: "Puhdas vesi... jokin siinä kutsuu. Äänet kuulostavat tutuilta. Älä seuraa niitä. Vartijat yrittävät suojella meitä ihmisiltä..."',
    secretHint: 'Lappu varmistaa, että Jani kuuli kutsuvia ääniä Lopen puhtaasta järvestä.'
  },
  avain: {
    id: 'avain',
    name: 'Ruostunut avain',
    foundAt: 'Vanha Kaivo',
    icon: '🔑',
    imageUrl: '/ruostunutavain.png',
    description: 'Painava ja umpiruosteinen rautainen avain, johon on lyöty numero "1952". Haisee syvältä mudalta ja kylmältä järvivedeltä.',
    secretHint: 'Vuosiluku 1952 on avain kaikkeen. Tämä sopii selvästi vajan arkkuun.'
  },
  paivakirja_sivu: {
    id: 'paivakirja_sivu',
    name: 'Päiväkirjan sivu',
    foundAt: 'Vanha Kaivo',
    icon: '📄',
    imageUrl: '/paivakirjansivu.png',
    description: 'Repäisty sivu vanhasta muistikirjasta: "Kesä 1952. Emme ole enää turvassa rannalla. Se jokin alhaalta vaatii vaietun verensä. Vartijat yrittävät sulkea totuuden kellariin, mutta se ei pysy siellä..."',
    secretHint: 'Vahvistaa, että Lopen huvilan rannassa tehtiin karu päätös jo vuonna 1952.'
  },
  kartta: {
    id: 'kartta',
    name: 'Märkä kartan pala',
    foundAt: 'Vanha Kaivo',
    icon: '🗺️',
    imageUrl: '/kartanpala.png',
    description: 'Tonttikartta Lopen rannalta. Vanhan kaivon vierestä lähtevä umpeenkasvanut polku on merkitty punaisella ristillä vajan kohdalle.',
    secretHint: 'Kartan polku johdattaa askeleet suoraan vanhaan kuusikkoon metsäpolulle.'
  },
  kirje: {
    id: 'kirje',
    name: 'Kirje',
    foundAt: 'Hylätty Vaja',
    icon: '✉️',
    imageUrl: '/kirje.png',
    description: 'Vajan arkusta löytynyt Janille osoitettu vanha kirje: "Jos jotain tapahtuu minulle Lopella, älkää uskoko kaikkia kartanon vieraita. He kantavat nimeä VARTIJAT. Totuus elää syvällä järvessä."',
    secretHint: 'Kirje varoittaa vartijoista – syyllinen voi olla aivan vieressäsi.'
  },
  lankku: {
    id: 'lankku',
    name: 'Irtonainen lankku',
    foundAt: 'Rantasauna',
    icon: '🪵',
    imageUrl: '/irtonainenlankku.png',
    description: 'Rantasaunan lauteiden alta irtoava vanha lankunpätkä. Sen alapintaan on hiilellä piirretty karu silmäsymboli sekä rujo teksti: "Totuus on piilotettu veden alle. Älä luota kehenkään."',
    secretHint: 'Viesti hiilessä antaa suunnan: tutki laiturin alus veteenhukutun totuuden varalta.'
  },
  merkki: {
    id: 'merkki',
    name: 'Vartijoiden merkki',
    foundAt: 'Rantasauna',
    icon: '🛡️',
    imageUrl: '/vartijoidenmerkki.png',
    description: 'Kupariaikaa nähnyt painava ja vihreäksi hapettunut Vartijoiden metallimerkki. Se esittää tuijottavaa silmää, jonka alla risteää kaksi airon lapaa.',
    secretHint: 'Lopen rannan ja vedessä piilevän salaisuuden vartijoiden aito metallinen tunnus.'
  },
  valokuva: {
    id: 'valokuva',
    name: 'Vanha valokuva',
    foundAt: 'Laiturin Alla',
    icon: '🖼️',
    imageUrl: '/vanhavalokuva.png',
    description: 'Kellastunut mustavalkokuva vuodelta 1952. Siinä joukko miehiä seisoo Lopen rannassa puretun satavuotiaan talon portilla. Yhden henkilön kasvot on raavittu kokonaan pois puukon kärjellä.',
    secretHint: 'Poistetun miehen hahmo piilottaa syyllisen, joka ei halunnut jättää jälkiä.'
  },
  metallirasia: {
    id: 'metallirasia',
    name: 'Metallirasia',
    foundAt: 'Laiturin Alla',
    icon: '📦',
    imageUrl: '/metallirasia.png',
    description: 'Pieni rautainen metallirasia, joka oli upotettu laiturin alle syvään kylmään järveteen. Kanteen on raaputettu viesti: "Varjelkaa totuutta. Älkää avatko kellaria."',
    secretHint: 'Rasian synkkä käsky viittaa huvilan kellarissa odottavaan viimeiseen sähkökaappiin.'
  }
};
interface ThematicImageProps {
  id: LocationId;
  title: string;
}

// OMAN PUBLIC-KANSION KUVAT AUTOMAATTISESTI KYTKETTYNÄ JA VARAJÄRJESTELMÄLLÄ
function ThematicImage({ id, title }: ThematicImageProps) {
  const imageMap: Record<LocationId, string> = {
    laituri: '/kohtaus02_laiturin_hiljaisuus.png',
    kaivo: '/01_aloitusnakyma_vartijat_valvovat.png',
    metsapolku: '/jalanjaljet_metsapolulla.png',
    vaja: '/vaja_ulkopuoli.png',
    vierashuone: '/vierashuone_yleiskuva.png',
    rantasauna: '/C236D35D-A8AA-4FC2-B8B5-BE5961AEB200.jpeg',
    laiturin_alla: '/IMG_1083.jpeg',
    kellari: '/kellari_yleiskuva.png'
  };

  return (
    <div className="relative w-full h-56 rounded-2xl overflow-hidden border border-slate-900 shadow-lg group">
      <img
        src={imageMap[id]}
        alt={title}
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
          e.currentTarget.parentElement!.className += ' bg-slate-900 flex items-center justify-center';
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />
      <div className="absolute bottom-3 left-4">
        <span className="text-[10px] uppercase font-mono text-amber-400 tracking-widest block mb-0.5">Tutkimuskohde</span>
        <h4 className="font-display text-slate-100 font-bold uppercase tracking-wider text-sm">{title}</h4>
      </div>
    </div>
  );
}

export default function KadonnutJaniScreen() {
  const [started, setStarted] = useState(() => localStorage.getItem('jani_started') === 'true');
  const [currentStage, setCurrentStage] = useState(() => parseInt(localStorage.getItem('jani_stage') || '1', 10));

  const [hasPhone, setHasPhone] = useState(() => localStorage.getItem('jani_hasPhone') === 'true');
  const [hasNote, setHasNote] = useState(() => localStorage.getItem('jani_hasNote') === 'true');
  const [hasPlank, setHasPlank] = useState(() => localStorage.getItem('jani_hasPlank') === 'true');
  const [hasDiary, setHasDiary] = useState(() => localStorage.getItem('jani_hasDiary') === 'true');
  const [hasRustyKey, setHasRustyKey] = useState(() => localStorage.getItem('jani_hasRustyKey') === 'true');
  const [hasMapPiece, setHasMapPiece] = useState(() => localStorage.getItem('jani_hasMapPiece') === 'true');
  const [hasPhoto, setHasPhoto] = useState(() => localStorage.getItem('jani_hasPhoto') === 'true');
  const [hasLetter, setHasLetter] = useState(() => localStorage.getItem('jani_hasLetter') === 'true');
  const [hasGuardMark, setHasGuardMark] = useState(() => localStorage.getItem('jani_hasGuardMark') === 'true');
  const [hasMetalBox, setHasMetalBox] = useState(() => localStorage.getItem('jani_hasMetalBox') === 'true');

  const [showFolder, setShowFolder] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceId | null>(null);
  const [notification, setNotification] = useState("");
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  const [suitcaseCode, setSuitcaseCode] = useState("");
  const [cellarPassword, setCellarPassword] = useState("");
  const [visibleText, setVisibleText] = useState("");
  const [letterStarted, setLetterStarted] = useState(false);

  const finalLetter = `📜 JANIN VIIMEINEN KIRJE...

Kaikki alkoi jo kauan ennen minua.
Joku yritti varoittaa jo vuonna 1952, eikä totuus pääty minuun.
Jos kuulet rannalta äänen, joka kuulostaa tutulta... älä seuraa sitä.
Sillä totuus lepää edelleen järven pohjassa.
Ja joskus... totuus katsoo takaisin.

VARTIJAT OVAT TÄÄLLÄ.`;
  useEffect(() => {
    localStorage.setItem('jani_started', started.toString());
    localStorage.setItem('jani_stage', currentStage.toString());
    localStorage.setItem('jani_hasPhone', hasPhone.toString());
    localStorage.setItem('jani_hasNote', hasNote.toString());
    localStorage.setItem('jani_hasPlank', hasPlank.toString());
    localStorage.setItem('jani_hasDiary', hasDiary.toString());
    localStorage.setItem('jani_hasRustyKey', hasRustyKey.toString());
    localStorage.setItem('jani_hasMapPiece', hasMapPiece.toString());
    localStorage.setItem('jani_hasPhoto', hasPhoto.toString());
    localStorage.setItem('jani_hasLetter', hasLetter.toString());
    localStorage.setItem('jani_hasGuardMark', hasGuardMark.toString());
    localStorage.setItem('jani_hasMetalBox', hasMetalBox.toString());
  }, [started, currentStage, hasPhone, hasNote, hasPlank, hasDiary, hasRustyKey, hasMapPiece, hasPhoto, hasLetter, hasGuardMark, hasMetalBox]);

  const enableAudioSystem = () => {
    setAudioEnabled(true);
    if (!audioContext) {
      setAudioContext(new (window.AudioContext || (window as any).webkitAudioContext)());
    }
  };

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
        osc.start(); osc.stop(audioContext.currentTime + 0.36);
      } else if (type === 'unlock') {
        osc.frequency.setValueAtTime(440, audioContext.currentTime);
        osc.frequency.setValueAtTime(554, audioContext.currentTime + 0.1);
        osc.frequency.setValueAtTime(659, audioContext.currentTime + 0.2);
        gain.gain.setValueAtTime(0.50, audioContext.currentTime); 
        gain.gain.linearRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        osc.start(); osc.stop(audioContext.currentTime + 0.4);
      } else if (type === 'error') {
        osc.frequency.setValueAtTime(120, audioContext.currentTime);
        osc.frequency.linearRampToValueAtTime(70, audioContext.currentTime + 0.25);
        gain.gain.setValueAtTime(0.55, audioContext.currentTime); 
        gain.gain.linearRampToValueAtTime(0.01, audioContext.currentTime + 0.25);
        osc.start(); osc.stop(audioContext.currentTime + 0.26);
      } else {
        osc.frequency.setValueAtTime(400, audioContext.currentTime);
        gain.gain.setValueAtTime(0.30, audioContext.currentTime); 
        gain.gain.linearRampToValueAtTime(0.001, audioContext.currentTime + 0.08);
        osc.start(); osc.stop(audioContext.currentTime + 0.09);
      }
    } catch (e) {}
  };

  const playAudio = (src: string) => {
    if (!audioEnabled) return;
    const audio = new Audio(src);
    audio.volume = 1.0;
    audio.play().catch(() => console.log("Ääntä ei voitu toistaa."));
  };

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

  if (showFolder) {
    const evidenceList: { id: EvidenceId; name: string; has: boolean; desc: string; img: string }[] = [
      { id: 'puhelin', name: '📱 Janin puhelin', has: hasPhone, desc: CONST_EVIDENCE_ITEMS.puhelin.description, img: CONST_EVIDENCE_ITEMS.puhelin.imageUrl || '' },
      { id: 'muistilappu', name: '📝 Märkä muistilappu', has: hasNote, desc: CONST_EVIDENCE_ITEMS.muistilappu.description, img: CONST_EVIDENCE_ITEMS.muistilappu.imageUrl || '' },
      { id: 'avain', name: '🔑 Ruostunut avain', has: hasRustyKey, desc: CONST_EVIDENCE_ITEMS.avain.description, img: CONST_EVIDENCE_ITEMS.avain.imageUrl || '' },
      { id: 'paivakirja_sivu', name: '📄 Päiväkirjan sivu', has: hasDiary, desc: CONST_EVIDENCE_ITEMS.paivakirja_sivu.description, img: CONST_EVIDENCE_ITEMS.paivakirja_sivu.imageUrl || '' },
      { id: 'kartta', name: '🗺️ Märkä kartan pala', has: hasMapPiece, desc: CONST_EVIDENCE_ITEMS.kartta.description, img: CONST_EVIDENCE_ITEMS.kartta.imageUrl || '' },
      { id: 'kirje', name: '✉️ Kirje', has: hasLetter, desc: CONST_EVIDENCE_ITEMS.kirje.description, img: CONST_EVIDENCE_ITEMS.kirje.imageUrl || '' },
      { id: 'lankku', name: '🪵 Irtonainen lankku', has: hasPlank, desc: CONST_EVIDENCE_ITEMS.lankku.description, img: CONST_EVIDENCE_ITEMS.lankku.imageUrl || '' },
      { id: 'merkki', name: '🛡️ Vartijoiden merkki', has: hasGuardMark, desc: CONST_EVIDENCE_ITEMS.merkki.description, img: CONST_EVIDENCE_ITEMS.merkki.imageUrl || '' },
      { id: 'valokuva', name: '🖼️ Vanha valokuva', has: hasPhoto, desc: CONST_EVIDENCE_ITEMS.valokuva.description, img: CONST_EVIDENCE_ITEMS.valokuva.imageUrl || '' },
      { id: 'metallirasia', name: '📦 Metallirasia', has: hasMetalBox, desc: CONST_EVIDENCE_ITEMS.metallirasia.description, img: CONST_EVIDENCE_ITEMS.metallirasia.imageUrl || '' },
    ];

    const currentItem = evidenceList.find(e => e.id === selectedEvidence);

    return (
      <div className="screen screen--center">
        <div className="rain-overlay" />
        <div className="config-card" style={{ maxWidth: "450px", width: "95%" }}>
          <h2>🎒 Tutkijan salkku 1952</h2>
          <p style={{ fontSize: "0.85rem", opacity: 0.7, marginBottom: "1rem" }}>
            Kerätty: {evidenceList.filter(e => e.has).length} / 10 todistetta
          </p>

          {!selectedEvidence ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "250px", overflowY: "auto", textAlign: "left", padding: "4px" }}>
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
              <h3>{currentItem?.name}</h3>
              {currentItem?.img && (
                <img
                  src={currentItem.img}
                  alt={currentItem.name}
                  style={{ width: "100%", maxHeight: "150px", objectFit: "contain", margin: "10px 0", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)" }}
                />
              )}
              <p style={{ marginTop: "0.5rem", fontSize: "0.95rem", lineHeight: "1.4" }}>{currentItem?.desc}</p>
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

  // PELIN KARTTANÄKYMÄ JA VAIHEET 1-4
  return (
    <div className="screen screen--center">
      <div className="rain-overlay" />
      {folderButton}

      {/* Yläpalkki nollaukselle ja äänille */}
      <div style={{ position: "absolute", top: "15px", left: "15px", display: "flex", gap: "10px", zIndex: 10 }}>
        <button onClick={() => setAudioEnabled(!audioEnabled)} style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: "1.2rem" }}>
          {audioEnabled ? "🔊" : "🔇"}
        </button>
        <button onClick={resetGame} style={{ background: "none", border: "none", color: "red", cursor: "pointer", fontSize: "1.2rem" }}>
          🔄
        </button>
      </div>

      {notification && <div className="notification" style={{ background: "#f59e0b", color: "black", padding: "8px 16px", borderRadius: "8px", fontWeight: "bold", position: "fixed", top: "20px", zIndex: 100 }}>{notification}</div>}

      <div className="config-card" style={{ maxWidth: "500px", width: "95%" }}>
        
        {/* VAIHEITTEN VISUAALINEN KARTTAKUVA */}
        {currentStage === 1 && <ThematicImage id="laituri" title="1. Laituri" />}
        {currentStage === 2 && <ThematicImage id="kaivo" title="2. Vanha kaivo" />}
        {currentStage === 3 && <ThematicImage id="metsapolku" title="3. Metsäpolku" />}
        {currentStage === 4 && <ThematicImage id="vaja" title="4. Hylätty vaja" />}
        {currentStage === 5 && <ThematicImage id="vierashuone" title="5. Huvilan vierashuone" />}
        {currentStage === 6 && <ThematicImage id="rantasauna" title="6. Rantasauna" />}
        {currentStage === 7 && <ThematicImage id="laiturin_alla" title="7. Laiturin alla" />}
        {currentStage === 8 && <ThematicImage id="kellari" title="8. Kellarin salaisuus" />}

        <div style={{ marginTop: "1rem" }}>
          {/* 1. LAITURI */}
          {currentStage === 1 && (
            <>
              <p>Sade piiskaa Lopen mökin rantaa. Janin katoamisesta on kulunut kolme päivää. Etsi merkkejä hänestä laiturilta.</p>
              {!hasPhone ? (
                <button className="btn" style={{ marginTop: "1rem" }} onClick={() => { setHasPhone(true); setHasNote(true); playChime('find'); playAudio("/janin_viesti.mp3"); setNotification("Löysit Janin puhelimen ja märän lapun!"); }}>
                  Tutki laituria
                </button>
              ) : (
                <>
                  <p style={{ color: "#22c55e", margin: "1rem 0" }}>✓ Janin puhelin löydetty! Viimeinen valokuva esittää vanhaa sammaloitunutta kaivoa metsän reunassa.</p>
                  <button className="btn" onClick={() => { playChime('click'); setCurrentStage(2); setNotification(""); }}>Suuntaa Kaivolle →</button>
                </>
              )}
            </>
          )}

          {/* 2. VANHA KAIVO */}
          {currentStage === 2 && (
            <>
              <p>Seuraat puhelimen kuvaa kaivolle. Se on synkkä ja kylmä. Kurkista kaivon sisään löytääksesi vuoden 1952 salaisuuksia.</p>
              {!hasRustyKey ? (
                <button className="btn" style={{ marginTop: "1rem" }} onClick={() => { setHasRustyKey(true); setHasMapPiece(true); playChime('find'); setNotification("Löysit ruostuneen avaimen 1952 ja kartan palan!"); }}>
                  Kurkista kaivoon
                </button>
              ) : (
                <>
                  <p style={{ color: "#22c55e", margin: "1rem 0" }}>✓ Ruostunut avain '1952' löydetty. Kartan pala osoittaa hämärän polun syvälle kuusikkoon.</p>
                  <button className="btn" onClick={() => { playChime('click'); setCurrentStage(3); playAudio("/metsäpolku_kuiskaus.mp3"); setNotification(""); }}>Seuraa metsäpolkua →</button>
                </>
              )}
            </>
          )}

          {/* 3. METSÄPOLKU */}
          {currentStage === 3 && (
            <>
              <p>Sumu tihenee polulla. Kuulet outoa kuisketta puiden välistä. Maassa näkyy tuoreita jalanjälkiä, aivan kuin Jania olisi seurattu.</p>
              {!hasPhoto ? (
                <button className="btn" style={{ marginTop: "1rem" }} onClick={() => { setHasPhoto(true); playChime('find'); setNotification("Löysit rikkinäisen valokuvan rannasta!"); }}>
                  Tutki jalanjälkiä
                </button>
              ) : (
                <>
                  <p style={{ color: "#22c55e", margin: "1rem 0" }}>✓ Jalanjäljet johtavat suoraan huvilan takana olevalle hylätylle vajalle.</p>
                  <button className="btn" onClick={() => { playChime('click'); setCurrentStage(4); setNotification(""); }}>Mene Vajalle →</button>
                </>
              )}
            </>
          )}

          {/* 4. HYLÄTTY VAJA */}
          {currentStage === 4 && (
            <>
              <p>Vajan ovi narisee tuulessa. Nurkassa on tukeva rauta-arkku, joka vaatii avaimen. Kirjeessä varoitetaan luottamasta kehenkään.</p>
              {!hasLetter ? (
                <button className="btn" style={{ marginTop: "1rem" }} onClick={() => { setHasLetter(true); playChime('unlock'); setNotification("Avasit arkun kaivon avaimella! Löysit kirjeen ja Vierashuoneen avaimen."); }}>
                  Avaa lukittu arkku
                </button>
              ) : (
                <>
                  <p style={{ color: "#22c55e", margin: "1rem 0" }}>✓ Arkku avattu. Sait avaimen loistohuvilan vierashuoneeseen tutkiaksesi Janin tavaroita.</p>
                  <button className="btn" onClick={() => { playChime('click'); setCurrentStage(5); setNotification(""); }}>Astu Vierashuoneeseen →</button>
                </>
              )}
            </>
          )}
                   {/* 5. VIERASHUONE (ARVOITUS 1952) */}
          {currentStage === 5 && (
            <>
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

          {/* 6. RANTASAUNA */}
          {currentStage === 6 && (
            <>
              <p>Astit sisään hämärään rantasaunaan. Lauteiden alta vetää kylmä viima. Etsi salalokeroa, jonne Jani piilotti viimeiset löytönsä.</p>
              {!hasGuardMark ? (
                <button className="btn" style={{ marginTop: "1rem" }} onClick={() => { setHasGuardMark(true); setHasPlank(true); playChime('find'); setNotification("Löysit Vartijoiden merkin ja lankun, jossa lukee: 'Totuus on piilotettu veden alle.'"); }}>
                  Etsi lauteiden alta
                </button>
              ) : (
                <>
                  <p style={{ color: "#22c55e", margin: "1rem 0" }}>✓ Vihje johdattaa sinut takaisin rantaan. Totuus odottaa syvällä veden alla.</p>
                  <button className="btn" onClick={() => { playChime('click'); setCurrentStage(7); setNotification(""); }}>Palaa Laiturille →</button>
                </>
              )}
            </>
          )}

          {/* 7. LAITURIN ALLA */}
          {currentStage === 7 && (
            <>
              <p>Laskeudut kylmään Lopen järviveteen laiturin tolpan juurelle. Kätesi osuu pohjamudassa johonkin metalliseen. Varoitus kuuluu: <i>'Älkää avatko kellaria.'</i></p>
              {!hasMetalBox ? (
                <button className="btn" style={{ marginTop: "1rem" }} onClick={() => { setHasMetalBox(true); playChime('find'); setNotification("Noudit vedestä pienen metallirasian ja vuoden 1952 valokuvan!"); }}>
                  Kurota veteen tolpan juurelle
                </button>
              ) : (
                <>
                  <p style={{ color: "#22c55e", margin: "1rem 0" }}>✓ Metallirasia noudettu järvestä. Viimeinen suljettu paikka on huvilan vanha kellari. Astu sisään omalla vastuulla.</p>
                  <button className="btn" onClick={() => { playChime('click'); setCurrentStage(8); setNotification(""); }}>Laskeudu Kellariin 🔦 →</button>
                </>
              )}
            </>
          )}

          {/* 8. KELLARIN SALAISUUS (UPEA PERGAMENTTILOPETUS) */}
          {currentStage === 8 && (
            <>
              {!hasDiary ? (
                <>
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
                      if (cellarPassword === "VARTIJAT" || cellarPassword === "1952") {
                        setHasDiary(true);
                        playChime('unlock');
                        playAudio("/loppukirje");
                        setNotification("");
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
    </div>
  );
}
