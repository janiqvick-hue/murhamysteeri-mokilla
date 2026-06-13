import React, { useState, useEffect } from 'react';
import {
  Phone, BookOpen, Key, Compass, Waves, Shield, Box, Lock, Unlock,
  Volume2, VolumeX, Eye, RefreshCw, AlertCircle, HelpCircle, Search,
  Skull, Maximize2, FileText, CheckCircle, MapPin
} from 'lucide-react';
import { LocationId, EvidenceId, Evidence, GameState } from './tyypit';

const CONST_EVIDENCE_ITEMS: Record<EvidenceId, Evidence> = {
  puhelin: { id: 'puhelin', name: 'Janin puhelin', foundAt: 'Laituri', icon: '📱', imageUrl: '/janipuhelin.png', description: 'Janin laiturille jättämä älypuhelin. Näyttö on säpäleinä. Viimeisin kuva esittää kaivoa.', secretHint: 'Osoittaa kaivon suuntaan.' },
  muistilappu: { id: 'muistilappu', name: 'Märkä muistilappu', foundAt: 'Laituri', icon: '📝', imageUrl: '/märkämuistilappu.png', description: 'Muste on levinnyt sateessa: "Puhdas vesi... jokin siinä kutsuu. Älä seuraa sitä. Vartijat suojelevat meitä..."', secretHint: 'Äänet kutsuvat järvestä.' },
  avain: { id: 'avain', name: 'Ruostunut avain', foundAt: 'Kaivo', icon: '🔑', imageUrl: '/ruostunutavain.png', description: 'Painava avain, jossa numero "1952". Sopii vajan arkkuun.', secretHint: 'Vuosi 1952 on avain kaikkeen.' },
  paivakirja_sivu: { id: 'paivakirja_sivu', name: 'Päiväkirjan sivu', foundAt: 'Kaivo', icon: '📄', imageUrl: '/paivakirjansivu.png', description: 'Repäisty sivu: "Kesä 1952. Emme ole turvassa. Totuus suljettiin kellariin..."', secretHint: 'Karu päätös tehtiin rannalla.' },
  kartta: { id: 'kartta', name: 'Märkä kartan pala', foundAt: 'Kaivo', icon: '🗺️', imageUrl: '/kartanpala.png', description: 'Kartan pala, joka osoittaa polun vanhaan kuusikkoon vajan kohdalle.', secretHint: 'Johdattaa askeleet vajalle.' },
  kirje: { id: 'kirje', name: 'Kirje', foundAt: 'Vaja', icon: '✉️', imageUrl: '/kirje.png', description: 'Varoitus: "Älä usko kaikkia kartanon vieraita. He kantavat nimeä VARTIJAT. Totuus elää järvessä."', secretHint: 'Syyllinen voi olla vieressäsi.' },
  lankku: { id: 'lankku', name: 'Irtonainen lankku', foundAt: 'Sauna', icon: '🪵', imageUrl: '/irtonainenlankku.png', description: 'Alapinnassa silmäsymboli ja teksti: "Totuus on piilotettu veden alle. Älä luota kehenkään."', secretHint: 'Tutki laiturin alus veteen hukutetun totuuden varalta.' },
  merkki: { id: 'merkki', name: 'Vartijoiden merkki', foundAt: 'Sauna', icon: '🛡️', imageUrl: '/vartijoidenmerkki.png', description: 'Vihreäksi hapettunut metallimerkki. Esittää tuijottavaa silmää ja kahta risteävää airon lapaa.', secretHint: 'Vartijoiden aito tunnus.' },
  valokuva: { id: 'valokuva', name: 'Vanha valokuva', foundAt: 'Laiturin Alla', icon: '🖼️', imageUrl: '/vanhavalokuva.png', description: 'Mustavalkokuva vuodelta 1952. Yhden henkilön kasvot on raavittu kokonaan pois.', secretHint: 'Poistettu hahmo piilottaa syyllisen.' },
  metallirasia: { id: 'metallirasia', name: 'Metallirasia', foundAt: 'Laiturin Alla', icon: '📦', imageUrl: '/metallirasia.png', description: 'Metallirasia laiturin alta järvestä. "Varjelkaa totuutta. Älkää avatko kellaria."', secretHint: 'Viittaa kellarin sähkökaappiin.' }
};

export default function KadonnutJaniScreen() {
  const [started, setStarted] = useState(() => localStorage.getItem('jani_started') === 'true');
  const [currentStage, setCurrentStage] = useState(() => Number(localStorage.getItem('jani_stage') || '1'));
  const [currentLocation, setCurrentLocation] = useState<LocationId>('Laituri');
  const [showInventory, setShowInventory] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);
  
  const [foundItems, setFoundItems] = useState<EvidenceId[]>(() => {
    const saved = localStorage.getItem('jani_found_items');
    return saved ? JSON.parse(saved) : [];
  });

  const [inputCode, setInputCode] = useState('');
  const [unlockedChests, setUnlockedChests] = useState<string[]>([]);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    localStorage.setItem('jani_started', started.toString());
    localStorage.setItem('jani_stage', currentStage.toString());
    localStorage.setItem('jani_found_items', JSON.stringify(foundItems));
  }, [started, currentStage, foundItems]);

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
        osc.frequency.setValueAtTime(554, audioContext.currentTime + 0.12);
        osc.frequency.setValueAtTime(659, audioContext.currentTime + 0.24);
        gain.gain.setValueAtTime(0.4, audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        osc.start(); osc.stop(audioContext.currentTime + 0.42);
      } else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, audioContext.currentTime);
        gain.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, audioContext.currentTime + 0.25);
        osc.start(); osc.stop(audioContext.currentTime + 0.26);
      } else {
        osc.frequency.setValueAtTime(400, audioContext.currentTime);
        gain.gain.setValueAtTime(0.15, audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, audioContext.currentTime + 0.08);
        osc.start(); osc.stop(audioContext.currentTime + 0.09);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const collectItem = (id: EvidenceId) => {
    if (!foundItems.includes(id)) {
      setFoundItems([...foundItems, id]);
      playChime('find');
    }
  };
  const checkCode = (requiredCode: string, successStage: number, chestKey?: string) => {
    if (inputCode === requiredCode) {
      playChime('unlock');
      if (chestKey) {
        setUnlockedChests([...unlockedChests, chestKey]);
      }
      if (currentStage === successStage - 1) {
        setCurrentStage(successStage);
      }
      setInputCode('');
      alert('Koodi oikein! Salaisuus paljastui.');
    } else {
      playChime('error');
      alert('Väärä koodi. Mitään ei tapahdu.');
    }
  };

  const changeLocation = (loc: LocationId) => {
    playChime('click');
    setCurrentLocation(loc);
  };

  if (!started) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 text-center">
        <div className="max-w-md bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-2xl space-y-6">
          <Skull className="w-16 h-16 text-red-500 mx-auto animate-pulse" />
          <h1 className="text-3xl font-bold tracking-tight text-red-500">KADONNUT JANI</h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Peli sijoittuu Lopelle, puhtaan järven rannalle rakennettuun loistohuvilaan. Jani katosi 3 päivää sitten. 
            Ratkaise vuoden 1952 salaisuus ennen kuin Vartijat löytävät sinut.
          </p>
          <button
            onClick={() => { enableAudioSystem(); setStarted(true); }}
            className="w-full py-3 bg-red-600 hover:bg-red-700 font-semibold rounded-lg transition shadow-lg shadow-red-900/30 text-white"
          >
            Aloita tutkinta
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Yläpalkki */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center space-y-0 space-x-2">
          <Skull className="w-5 NavIcon text-red-500" />
          <span className="font-bold tracking-wider text-sm md:text-base text-slate-200">KADONNUT JANI</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowInventory(!showInventory)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded border border-slate-700 flex items-center space-x-1"
          >
            <FileText className="w-4 h-4 text-blue-400" />
            <span>Tutkijan kansio ({foundItems.length}/10)</span>
          </button>
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700"
          >
            {audioEnabled ? <Volume2 className="w-4 h-4 text-green-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
        </div>
      </header>

      {/* Pelialueen pääikkuna */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col md:flex-row gap-4">
        {/* Vasen puoli: Tarina ja tutkinta */}
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between shadow-xl min-h-[400px]">
          <div>
            <div className="flex items-center space-x-2 mb-4 border-b border-slate-800 pb-2">
              <MapPin className="w-5 h-5 text-red-400" />
              <h2 className="text-xl font-bold tracking-wide text-slate-100 uppercase">{currentLocation}</h2>
            </div>

            {/* Pelipaikkojen logiikat */}
            {currentLocation === 'Laituri' && (
              <div className="space-y-4">
                <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                  Synkkä ja sateinen ranta. Aallot lyövät raskaasti laiturin tolppiin. Löydät rannalta jotain sateen kastelemaa.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {!foundItems.includes('puhelin') && (
                    <button onClick={() => collectItem('puhelin')} className="px-3 py-2 bg-amber-600/20 border border-amber-500/40 hover:bg-amber-600/30 text-amber-300 rounded text-xs flex items-center gap-1.5">
                      📱 Tutki rikkinäistä puhelinta
                    </button>
                  )}
                  {!foundItems.includes('muistilappu') && (
                    <button onClick={() => collectItem('muistilappu')} className="px-3 py-2 bg-amber-600/20 border border-amber-500/40 hover:bg-amber-600/30 text-amber-300 rounded text-xs flex items-center gap-1.5">
                      📝 Nosta märkä muistilappu
                    </button>
                  )}
                </div>
              </div>
            )}

            {currentLocation === 'Kaivo' && (
              <div className="space-y-4">
                <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                  Vanha 100-vuotias hirsikaivo seisoo synkkänä kuusien katveessa. Puinen kansi rakoilee.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {!foundItems.includes('avain') && (
                    <button onClick={() => collectItem('avain')} className="px-3 py-2 bg-amber-600/20 border border-amber-500/40 hover:bg-amber-600/30 text-amber-300 rounded text-xs flex items-center gap-1.5">
                      🔑 Ongi ruostunut avain kaivosta
                    </button>
                  )}
                  {!foundItems.includes('paivakirja_sivu') && (
                    <button onClick={() => collectItem('paivakirja_sivu')} className="px-3 py-2 bg-amber-600/20 border border-amber-500/40 hover:bg-amber-600/30 text-amber-300 rounded text-xs flex items-center gap-1.5">
                      📄 Poimi revennyt päiväkirjan sivu
                    </button>
                  )}
                  {!foundItems.includes('kartta') && (
                    <button onClick={() => collectItem('kartta')} className="px-3 py-2 bg-amber-600/20 border border-amber-500/40 hover:bg-amber-600/30 text-amber-300 rounded text-xs flex items-center gap-1.5">
                      🗺️ Ota märkä kartan pala vesisäiliöstä
                    </button>
                  )}
                </div>
              </div>
            )}

            {currentLocation === 'Metsäpolku' && (
              <div className="space-y-4">
                <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                  Synkkä polku johtaa syvemmälle Lopen korpeen. Tuoreet jalanjäljet kurassa osoittavat suoraan kohti hylättyä vajaa.
                </p>
                <p className="text-xs text-slate-500 italic">"Joku seurasi meitä metsässä..."</p>
              </div>
            )}

            {currentLocation === 'Hylätty Vaja' && (
              <div className="space-y-4">
                <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                  Hämähäkinseittien peittämä vaja. Nurkassa nököttää vanha, painava rauta-arkku.
                </p>
                <div className="space-y-2 pt-2">
                  {!unlockedChests.includes('vaja_arkku') ? (
                    <div className="flex flex-col space-y-2 max-w-xs bg-slate-950 p-3 rounded border border-slate-800">
                      <span className="text-xs text-slate-400 font-semibold flex items-center gap-1"><Lock className="w-3 h-3" /> Arkku vaatii avaimen (Syötä avaimen vuosiluku):</span>
                      <div className="flex gap-2">
                        <input type="text" placeholder="Koodi..." value={inputCode} onChange={(e) => setInputCode(e.target.value)} className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-100 flex-1" />
                        <button onClick={() => checkCode('1952', 4, 'vaja_arkku')} className="bg-blue-600 hover:bg-blue-700 text-xs px-3 rounded font-semibold text-white">Avaa</button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-950 p-3 rounded border border-green-900/40 space-y-2">
                      <p className="text-xs text-green-400 font-semibold flex items-center gap-1"><Unlock className="w-3 h-3" /> Arkku on avattu!</p>
                      {!foundItems.includes('kirje') && (
                        <button onClick={() => collectItem('kirje')} className="px-2 py-1 bg-amber-600/20 border border-amber-500/40 text-amber-300 rounded text-xs">✉️ Ota Vartijoista varoittava kirje</button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
            {currentLocation === 'Vierashuone' && (
              <div className="space-y-4">
                <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                  Loistohuvilan vierashuoneesta huokuu psykologinen kauhu. Vanhassa peilissä lukee hätäisesti kirjoitettuna: "Älä katso taaksesi." Lattialla on lukittu matkalaukku.
                </p>
                <div className="flex flex-col space-y-2 max-w-xs bg-slate-950 p-3 rounded border border-slate-800">
                  <span className="text-xs text-slate-400 font-semibold flex items-center gap-1"><Lock className="w-3 h-3" /> Matkalaukun numerokoodi (4 numeroa):</span>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Koodi..." value={inputCode} onChange={(e) => setInputCode(e.target.value)} className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-100 flex-1" />
                    <button onClick={() => checkCode('1952', 5, 'matkalaukku')} className="bg-blue-600 hover:bg-blue-700 text-xs px-3 rounded font-semibold text-white">Avaa</button>
                  </div>
                </div>
              </div>
            )}

            {currentLocation === 'Rantasauna' && (
              <div className="space-y-4">
                <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                  Uusi upea rantasauna puhtaan järven rannalla. Lauteiden alta vetoisesta nurkasta paljastuu salalokero, jossa jokin kiiltää metallisena.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {!foundItems.includes('lankku') && (
                    <button onClick={() => collectItem('lankku')} className="px-3 py-2 bg-amber-600/20 border border-amber-500/40 hover:bg-amber-600/30 text-amber-300 rounded text-xs flex items-center gap-1.5">
                      🪵 Tutki irtonainen lankku salalokerosta
                    </button>
                  )}
                  {!foundItems.includes('merkki') && (
                    <button onClick={() => collectItem('merkki')} className="px-3 py-2 bg-amber-600/20 border border-amber-500/40 hover:bg-amber-600/30 text-amber-300 rounded text-xs flex items-center gap-1.5">
                      🛡️ Ota Vartijoiden metallinen merkki
                    </button>
                  )}
                </div>
              </div>
            )}

            {currentLocation === 'Laiturin Alla' && (
              <div className="space-y-4">
                <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                  Vesi on kylmää ja mustaa. Laiturin rakenteiden alta, vedestä puoleksi peittyneenä, löytyy tiiviisti suljettu metallirasia.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {!foundItems.includes('valokuva') && (
                    <button onClick={() => collectItem('valokuva')} className="px-3 py-2 bg-amber-600/20 border border-amber-500/40 hover:bg-amber-600/30 text-amber-300 rounded text-xs flex items-center gap-1.5">
                      🖼️ Vedä esiin vanha valokuva
                    </button>
                  )}
                  {!foundItems.includes('metallirasia') && (
                    <button onClick={() => collectItem('metallirasia')} className="px-3 py-2 bg-amber-600/20 border border-amber-500/40 hover:bg-amber-600/30 text-amber-300 rounded text-xs flex items-center gap-1.5">
                      📦 Avaa metallirasia laiturin alta
                    </button>
                  )}
                </div>
              </div>
            )}

            {currentLocation === 'Kellarin Salaisuus' && (
              <div className="space-y-4">
                <p className="text-slate-300 leading-relaxed text-sm md:text-base font-bold text-red-400">
                  HUVILAN KELLARI — VIIMEINEN SALAISUUS
                </p>
                <p className="text-slate-300 text-xs md:text-sm">
                  Seinässä lukee suurilla verisillä kirjaimilla: <span className="text-red-500 font-bold italic">"TOTUUS EI SAA NOUSTA PINTAAN."</span> Nurkassa seisoo Vartijoiden lopullinen sähkökaappi metallisella lukolla.
                </p>
                <div className="flex flex-col space-y-2 max-w-xs bg-slate-950 p-3 rounded border border-slate-800">
                  <span className="text-xs text-slate-400 font-semibold flex items-center gap-1"><Lock className="w-3 h-3" /> Syötä loppuarvoituksen vuosi kaapin avaamiseksi:</span>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Koodi..." value={inputCode} onChange={(e) => setInputCode(e.target.value)} className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-100 flex-1" />
                    <button onClick={() => checkCode('1952', 8, 'kellari_kaappi')} className="bg-red-600 hover:bg-red-700 text-xs px-3 rounded font-semibold text-white">Ratkaise</button>
                  </div>
                </div>

                {currentStage >= 8 && (
                  <div className="mt-4 p-4 bg-red-950/40 border border-red-800 rounded space-y-3">
                    <p className="text-xs md:text-sm text-red-200 font-bold flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-red-500 animate-pulse" /> Janin viimeinen kirje ja totuus:
                    </p>
                    <p className="text-xs text-slate-300 italic leading-relaxed bg-slate-950 p-3 rounded border border-slate-800">
                      "Kaikki alkoi jo kauan ennen minua... Jos kuulet rannalta äänen, joka kuulostaa tutulta... älä seuraa sitä. Sillä totuus lepää edelleen järven pohjassa. Ja joskus... totuus katsoo takaisin. VARTIJAT OVAT TÄÄLLÄ."
                    </p>
                    <p className="text-xs font-bold text-red-400">Peli päättyi. Löysit kadonneen Janin jäljet ja paljastit salaisuuden.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigointipainikkeet pelialueiden välillä */}
          <div className="mt-6 border-t border-slate-800 pt-4">
            <span className="text-xs font-semibold text-slate-400 block mb-2">Liiku alueesta toiseen:</span>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => changeLocation('Laituri')} className={`px-2.5 py-1 text-xs font-medium rounded transition ${currentLocation === 'Laituri' ? 'bg-blue-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}>Laituri</button>
              <button onClick={() => changeLocation('Kaivo')} className={`px-2.5 py-1 text-xs font-medium rounded transition ${currentLocation === 'Kaivo' ? 'bg-blue-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}>Vanha Kaivo</button>
              <button onClick={() => changeLocation('Metsäpolku')} className={`px-2.5 py-1 text-xs font-medium rounded transition ${currentLocation === 'Metsäpolku' ? 'bg-blue-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}>Metsäpolku</button>
              <button onClick={() => changeLocation('Hylätty Vaja')} className={`px-2.5 py-1 text-xs font-medium rounded transition ${currentLocation === 'Hylätty Vaja' ? 'bg-blue-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}>Hylätty Vaja</button>
              <button onClick={() => changeLocation('Vierashuone')} className={`px-2.5 py-1 text-xs font-medium rounded transition ${currentLocation === 'Vierashuone' ? 'bg-blue-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}>Vierashuone</button>
              <button onClick={() => changeLocation('Rantasauna')} className={`px-2.5 py-1 text-xs font-medium rounded transition ${currentLocation === 'Rantasauna' ? 'bg-blue-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}>Rantasauna</button>
              <button onClick={() => changeLocation('Laiturin Alla')} className={`px-2.5 py-1 text-xs font-medium rounded transition ${currentLocation === 'Laiturin Alla' ? 'bg-blue-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}>Laiturin Alla</button>
              <button onClick={() => changeLocation('Kellarin Salaisuus')} className={`px-2.5 py-1 text-xs font-medium rounded transition ${currentLocation === 'Kellarin Salaisuus' ? 'bg-blue-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}>Kellarin Salaisuus</button>
            </div>
          </div>
        </div>
      </main>
      {/* TUTKIJAN KANSIO MODAALI (Inventory) — KORJATTU JA SUOJATTU VERSIO */}
      {showInventory && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold tracking-wide text-slate-200 uppercase flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-400" /> Tutkijan kansio
              </h3>
              <button onClick={() => { playChime('click'); setShowInventory(false); }} className="text-xs px-2 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-slate-300">
                Sulje
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto space-y-4 flex-1 bg-slate-950/50">
              <p className="text-xs text-slate-400 italic">Kerätyt todisteet Lopen huvilalta ({foundItems.length}/10):</p>
              
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(CONST_EVIDENCE_ITEMS).map((key) => {
                  const item = CONST_EVIDENCE_ITEMS[key as EvidenceId];
                  const isFound = foundItems.includes(key as EvidenceId);
                  
                  if (!item) return null; // Suojatarkistus kaatumista vastaan
                  
                  return (
                    <button
                      key={item.id}
                      disabled={!isFound}
                      onClick={() => { playChime('click'); setSelectedEvidence(item); }}
                      className={`p-2.5 rounded-lg border text-left flex items-center space-x-2 transition ${isFound ? 'bg-slate-900 border-blue-900/40 hover:border-blue-500/50 cursor-pointer' : 'bg-slate-950 border-slate-900 opacity-30 cursor-not-allowed'}`}
                    >
                      <span className="text-xl md:text-2xl">{isFound ? item.icon : '❓'}</span>
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold truncate text-slate-200">{isFound ? item.name : 'Lukittu todiste'}</p>
                        <p className="text-[10px] text-slate-500 truncate">{isFound ? item.foundAt : 'Tuntematon paikka'}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Valitun todisteen tarkempi kuvaus ja esikatselu */}
              {selectedEvidence && foundItems.includes(selectedEvidence.id) && (
                <div className="mt-4 p-3 bg-slate-900 border border-blue-900/30 rounded-lg space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                    <h4 className="text-xs font-bold text-blue-400 uppercase">{selectedEvidence.name}</h4>
                    <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-400">Löydetty: {selectedEvidence.foundAt}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 pt-1">
                    <div className="w-16 h-16 bg-slate-950 border border-slate-800 rounded flex items-center justify-center flex-shrink-0">
                      <img 
                        src={selectedEvidence.imageUrl} 
                        alt={selectedEvidence.name}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        className="max-w-full max-h-full object-contain rounded"
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-slate-300 leading-relaxed">{selectedEvidence.description}</p>
                      <p className="text-[10px] text-red-400 italic">Vihje: {selectedEvidence.secretHint}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
