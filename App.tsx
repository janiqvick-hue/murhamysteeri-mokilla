import React, { useState, useEffect } from 'react';
import {
  Phone,
  BookOpen,
  Key,
  Compass,
  Waves,
  Shield,
  Box,
  Lock,
  Unlock,
  Volume2,
  VolumeX,
  Eye,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  Search,
  Skull,
  Maximize2,
  FileText,
  CheckCircle,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LocationId, EvidenceId, Evidence, GameState } from './types';

// The 10 official evidence items requested in the Lopen manuscript
const CONST_EVIDENCE_ITEMS: Record<EvidenceId, Evidence> = {
  puhelin: {
    id: 'puhelin',
    name: 'Janin puhelin',
    foundAt: 'Laituri (Alku)',
    icon: '📱',
    description: 'Janin laiturille jättämä älypuhelin. Näyttö on säpäleinä ja kuori kostea, mutta virta menee päälle. Viimeisin otettu kuva esittää vanhaa kivikaivoa huvilan takamaastossa sumun keskellä.',
    secretHint: 'Puhelimen kuva osoittaa suoraan kaivon suuntaan. Jotain on piilotettu sinne.'
  },
  muistilappu: {
    id: 'muistilappu',
    name: 'Märkä muistilappu',
    foundAt: 'Laituri (Alku)',
    icon: '📝',
    description: 'Sateen turmelema paperilappu, josta erottuu hätäinen käsiala: "Puhdas vesi... jokin siinä kutsuu. Äänet kuulostavat tutuilta. Älä seuraa niitä. Vartijat yrittävät suojella meitä ihmisiltä..."',
    secretHint: 'Lappu varmistaa, että Jani kuuli kutsuvia ääniä Lopen puhtaasta järvestä.'
  },
  avain: {
    id: 'avain',
    name: 'Ruostunut avain',
    foundAt: 'Vanha Kaivo',
    icon: '🔑',
    description: 'Painava ja umpiruosteinen rautainen avain, johon on lyöty numero "1952". Haisee syvältä mudalta ja kylmältä järvivedeltä.',
    secretHint: 'Vuosiluku 1952 on avain kaikkeen. Tämä sopii selvästi vajan arkkuun.'
  },
  paivakirja_sivu: {
    id: 'paivakirja_sivu',
    name: 'Päiväkirjan sivu',
    foundAt: 'Vanha Kaivo',
    icon: '📄',
    description: 'Repäisty sivu vanhasta muistikirjasta: "Kesä 1952. Emme ole enää turvassa rannalla. Se jokin alhaalta vaatii vaietun verensä. Vartijat yrittivät sulkea totuuden kellariin, mutta se ei pysy siellä..."',
    secretHint: 'Vahvistaa, että Lopen huvilan rannassa tehtiin karu päätös jo vuonna 1952.'
  },
  kartta: {
    id: 'kartta',
    name: 'Märkä kartan pala',
    foundAt: 'Vanha Kaivo',
    icon: '🗺️',
    description: 'Tonttikartta Lopen rannalta. Vanhan kaivon vierestä lähtevä umpeenkasvanut polku on merkitty punaisella ristillä vajan kohdalle.',
    secretHint: 'Kartan polku johdattaa askeleet suoraan vanhaan kuusikkoon metsäpolulle.'
  },
  kirje: {
    id: 'kirje',
    name: 'Kirje',
    foundAt: 'Hylätty Vaja',
    icon: '✉️',
    description: 'Vajan arkusta löytynyt Janille osoitettu vanha kirje: "Jos jotain tapahtuu minulle Lopella, älkää uskoko kaikkia kartanon vieraita. He kantavat nimeä VARTIJAT. Totuus elää syvällä järvessä."',
    secretHint: 'Kirje varoittaa vartijoista – syyllinen voi olla aivan vieressäsi.'
  },
  lankku: {
    id: 'lankku',
    name: 'Irtonainen lankku',
    foundAt: 'Rantasauna',
    icon: '🪵',
    description: 'Rantasaunan lauteiden alta irtoava vanha lankunpätkä. Sen alapintaan on hiilellä piirretty karu silmäsymboli sekä rujo teksti: "Totuus on piilotettu veden alle. Älä luota kehenkään."',
    secretHint: 'Viesti hiilessä antaa suunnan: tutki laiturin alus veteenhukutun totuuden varalta.'
  },
  merkki: {
    id: 'merkki',
    name: 'Vartijoiden merkki',
    foundAt: 'Rantasauna',
    icon: '🛡️',
    description: 'Kupariaikaa nähnyt painava ja vihreäksi hapettunut Vartijoiden metallimerkki. Se esittää tuijottavaa silmää, jonka alla risteää kaksi airon lapaa.',
    secretHint: 'Lopen rannan ja vedessä piilevän salaisuuden vartijoiden aito metallinen tunnus.'
  },
  valokuva: {
    id: 'valokuva',
    name: 'Vanha valokuva',
    foundAt: 'Laiturin Alla',
    icon: '🖼️',
    description: 'Kellastunut mustavalkokuva vuodelta 1952. Siinä joukko miehiä seisoo Lopen rannassa puretun satavuotiaan talon portilla. Yhden henkilön kasvot on raavittu kokonaan pois puukon kärjellä.',
    secretHint: 'Poistetun miehen hahmo piilottaa syyllisen, joka ei halunnut jättää jälkiä.'
  },
  metallirasia: {
    id: 'metallirasia',
    name: 'Metallirasia',
    foundAt: 'Laiturin Alla',
    icon: ' canisters ',
    description: 'Pieni rautainen metallirasia, joka oli upotettu laiturin alle syvään kylmään järveteen. Kanteen on raaputettu viesti: "Varjelkaa totuutta. Älkää avatko kellaria."',
    secretHint: 'Rasian synkkä käsky viittaa huvilan kellarissa odottavaan viimeiseen sähkökaappiin.'
  }
};

// Component to handle thematic location images with multiple failsafes and fallbacks
interface ThematicImageProps {
  id: LocationId;
  title: string;
}

function ThematicImage({ id, title }: ThematicImageProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [errorCount, setErrorCount] = useState<number>(0);

  useEffect(() => {
    // Reset and try the first source when location changes
    setImgSrc(`/${id}.jpg`);
    setErrorCount(0);
  }, [id]);

  const handleError = () => {
    if (errorCount === 0) {
      // Try png if jpg failed
      setImgSrc(`/${id}.png`);
      setErrorCount(1);
    } else if (errorCount === 1) {
      // Try subfolder
      setImgSrc(`/images/${id}.jpg`);
      setErrorCount(2);
    } else if (errorCount === 2) {
      // Try subfolder png
      setImgSrc(`/images/${id}.png`);
      setErrorCount(3);
    } else {
      // Complete fallback
      setImgSrc(null);
    }
  };

  if (!imgSrc) {
    // Render beautiful cinematic CSS backup
    const gradientMap: Record<LocationId, string> = {
      laituri: 'from-slate-900 via-[#0e1626] to-[#040810]',
      kaivo: 'from-emerald-950/20 via-[#0a1a16] to-[#040c0b]',
      metsapolku: 'from-zinc-900 via-[#10141c] to-[#05070c]',
      vaja: 'from-amber-950/20 via-[#1a140d] to-[#0c0a07]',
      vierashuone: 'from-purple-950/20 via-[#140e1e] to-[#09060f]',
      rantasauna: 'from-red-955/20 via-[#261010] to-[#0f0404]',
      laiturin_alla: 'from-teal-950/20 via-[#0d1e1c] to-[#060e0d]',
      kellari: 'from-red-950/30 via-[#220d0f] to-[#0c0405]'
    };

    const iconMap: Record<LocationId, React.ReactNode> = {
      laituri: <Waves className="w-16 h-16 text-blue-500/40 animate-pulse" />,
      kaivo: <Compass className="w-16 h-16 text-emerald-400/40 animate-spin-slow" />,
      metsapolku: <Compass className="w-16 h-16 text-zinc-500/40" />,
      vaja: <Box className="w-16 h-16 text-amber-505/40" />,
      vierashuone: <Eye className="w-16 h-16 text-purple-400/40" />,
      rantasauna: <Waves className="w-16 h-16 text-red-400/40 animate-pulse" />,
      laiturin_alla: <Waves className="w-16 h-16 text-teal-400/40 animate-bounce" />,
      kellari: <Skull className="w-16 h-16 text-red-500/40" />
    };

    return (
      <div className={`relative w-full h-56 rounded-2xl overflow-hidden bg-gradient-to-b ${gradientMap[id]} border border-slate-900 shadow-inner flex flex-col items-center justify-center`}>
        {/* Animated Rain Overlay */}
        <div className="absolute inset-0 opacity-15 overflow-hidden pointer-events-none">
          <div className="w-[200%] h-[200%] animate-pulse bg-repeat" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)' }} />
        </div>
        <div className="relative z-10 flex flex-col items-center text-center p-4 space-y-2">
          {iconMap[id]}
          <p className="text-sm font-display tracking-widest text-slate-300 font-semibold uppercase">{title}</p>
          <p className="text-[10px] text-slate-505 font-mono">ÄÄNET KÄYNNISSÄ // ILTA LOPELTA</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-56 rounded-2xl overflow-hidden border border-slate-900 shadow-lg group">
      <img
        src={imgSrc}
        alt={title}
        onError={handleError}
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-955 via-transparent to-black/30" />
      <div className="absolute bottom-3 left-4">
        <span className="text-[10px] uppercase font-mono text-blue-400 tracking-widest block mb-0.5">Tutkimuskohde</span>
        <h4 className="font-display text-slate-100 font-bold uppercase tracking-wider text-sm">{title}</h4>
      </div>
    </div>
  );
}

export default function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('kadonnut_jani_state_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && 'currentLocation' in parsed) {
          return parsed;
        }
      } catch (e) {}
    }
    return {
      currentLocation: 'laituri',
      unlockedLocations: ['laituri'],
      collectedEvidence: [],
      suitcaseCodeEntered: '',
      suitcaseUnlocked: false,
      chestUnlocked: false,
      cabinetUnlocked: false,
      gameCompleted: false,
      journalReadCount: 0,
      gameStarted: false
    };
  });

  const [activeTab, setActiveTab] = useState<'peli' | 'salkku' | 'kartta'>('peli');
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);
  const [narrativeLog, setNarrativeLog] = useState<string[]>([
    'Saavut puhtaan Lopen järven rantaan loistohuvilalle. Ilta on synkkä, sateinen ja tuulinen.',
    'Vanhan satavuotiaan puretun kartanon tilalle pystytetty huvila on hiljainen. Jani katosi täällä 3 päivää sitten.',
    'Valmistaudu tutkimaan paikkoja huolellisesti ja keräämään 10 ratkaisevaa todistetta Janin salkkuun.'
  ]);

  const [suitcaseCode, setSuitcaseCode] = useState<string>('');
  const [cabinetPassword, setCabinetPassword] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [droneOscillator, setDroneOscillator] = useState<OscillatorNode | null>(null);

  useEffect(() => {
    localStorage.setItem('kadonnut_jani_state_v2', JSON.stringify(gameState));
  }, [gameState]);

  // Ambient audio synthesizer to produce a spine-chilling sound scene
  useEffect(() => {
    if (soundEnabled) {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Eerie ambient low-frequency pulsing drone representing dark Finnish depths
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gainNode = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(48, ctx.currentTime); // G0-G#0 low humming water tone
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(120, ctx.currentTime);

        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(0.08, ctx.currentTime); // ultra slow underwater cycle
        lfoGain.gain.setValueAtTime(0.12, ctx.currentTime);

        lfo.connect(lfoGain);
        lfoGain.connect(gainNode.gain);

        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
        osc.start();
        lfo.start();

        // Background gentle rain synth rattle
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
        rainGain.gain.setValueAtTime(0.015, ctx.currentTime); // subtle rainfall overlay

        rainSource.connect(rainFilter);
        rainFilter.connect(rainGain);
        rainGain.connect(ctx.destination);
        rainSource.start();

        setAudioContext(ctx);
        setDroneOscillator(osc);
      } catch (err) {
        console.error("Audio initialization failed:", err);
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
  }, [soundEnabled]);

  const addLog = (msg: string) => {
    setNarrativeLog(prev => [...prev, msg].slice(-15));
  };

  const playChime = (type: 'find' | 'unlock' | 'error' | 'click') => {
    if (!soundEnabled || !audioContext) return;
    try {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.connect(gain);
      gain.connect(audioContext.destination);

      if (type === 'find') {
        osc.frequency.setValueAtTime(320, audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(640, audioContext.currentTime + 0.35);
        gain.gain.setValueAtTime(0.12, audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, audioContext.currentTime + 0.35);
        osc.start();
        osc.stop(audioContext.currentTime + 0.36);
      } else if (type === 'unlock') {
        osc.frequency.setValueAtTime(440, audioContext.currentTime);
        osc.frequency.setValueAtTime(554, audioContext.currentTime + 0.1);
        osc.frequency.setValueAtTime(659, audioContext.currentTime + 0.2);
        gain.gain.setValueAtTime(0.1, audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        osc.start();
        osc.stop(audioContext.currentTime + 0.4);
      } else if (type === 'error') {
        osc.frequency.setValueAtTime(120, audioContext.currentTime);
        osc.frequency.linearRampToValueAtTime(70, audioContext.currentTime + 0.25);
        gain.gain.setValueAtTime(0.15, audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, audioContext.currentTime + 0.25);
        osc.start();
        osc.stop(audioContext.currentTime + 0.26);
      } else {
        osc.frequency.setValueAtTime(400, audioContext.currentTime);
        gain.gain.setValueAtTime(0.05, audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, audioContext.currentTime + 0.08);
        osc.start();
        osc.stop(audioContext.currentTime + 0.09);
      }
    } catch (e) {}
  };

  const handleResetGame = () => {
    if (confirm('Haluatko varmasti palauttaa kaikki Lopen tutkimukset aluksi? Kaikki askeleet ja todisteet salkusta nollataan.')) {
      const resetState: GameState = {
        currentLocation: 'laituri',
        unlockedLocations: ['laituri'],
        collectedEvidence: [],
        suitcaseCodeEntered: '',
        suitcaseUnlocked: false,
        chestUnlocked: false,
        cabinetUnlocked: false,
        gameCompleted: false,
        journalReadCount: 0,
        gameStarted: true
      };
      setGameState(resetState);
      setNarrativeLog([
        'Myrsky nousee jälleen Lopen ylle rannassa. Kaikki tiedot pyyhitty.',
        'Aloitat tutkimukset uudestaan märältä laiturilta.'
      ]);
      setSelectedEvidence(null);
      setSuitcaseCode('');
      setCabinetPassword('');
      setActiveTab('peli');
      playChime('unlock');
    }
  };

  const getCollectedEvidenceList = (): Evidence[] => {
    if (!gameState.collectedEvidence) return [];
    return gameState.collectedEvidence
      .map(id => CONST_EVIDENCE_ITEMS[id])
      .filter((item): item is Evidence => !!item);
  };

  const selectLocation = (id: LocationId) => {
    if (gameState.unlockedLocations.includes(id)) {
      setGameState(prev => ({ ...prev, currentLocation: id }));
      playChime('click');
      const titles: Record<LocationId, string> = {
        laituri: 'Laituri (Alku)',
        kaivo: 'Vanha Kaivo',
        metsapolku: 'Metsäpolku',
        vaja: 'Hylätty Vaja',
        vierashuone: 'Vierashuone (Huvilan sisällä)',
        rantasauna: 'Rantasauna',
        laiturin_alla: 'Laiturin Alla',
        kellari: 'Kellarin Salaisuus'
      };
      addLog(`Siirryit kohteeseen: ${titles[id]}.`);
    } else {
      playChime('error');
      addLog('Tämä paikka on lukittu. Tutki nykyistä aluetta löytääksesi reitin eteenpäin.');
    }
  };

  // Perform area investigation and add evidence to case
  const handleInvestigateArea = () => {
    const loc = gameState.currentLocation;
    playChime('click');

    if (loc === 'laituri') {
      let updated = [...gameState.collectedEvidence];
      let added = false;
      if (!updated.includes('puhelin')) {
        updated.push('puhelin');
        added = true;
      }
      if (!updated.includes('muistilappu')) {
        updated.push('muistilappu');
        added = true;
      }

      if (added) {
        setGameState(prev => ({
          ...prev,
          collectedEvidence: updated,
          unlockedLocations: prev.unlockedLocations.includes('kaivo') 
            ? prev.unlockedLocations 
            : [...prev.unlockedLocations, 'kaivo']
        }));
        playChime('find');
        addLog('Löysit rannasta Janin kastuneen ja rikkoontuneen älypuhelimen rinnalla sateessa säilyneen märän muistilapun!');
        addLog('• Salkkuun lisätty: Janin puhelin ja Märkä muistilappu.');
        addLog('• Viimeisin puhelimen valokuva paljastaa vanhan sammaloituneen kaivon. Reitti Vanhalle Kaivolle avautui!');
      } else {
        addLog('Ranta on perinpohjaisesti ratsattu. Laiturin tyhjät laudat valuvat vettä.');
      }
    }

    else if (loc === 'kaivo') {
      let updated = [...gameState.collectedEvidence];
      let added = false;
      if (!updated.includes('avain')) {
        updated.push('avain');
        added = true;
      }
      if (!updated.includes('paivakirja_sivu')) {
        updated.push('paivakirja_sivu');
        added = true;
      }
      if (!updated.includes('kartta')) {
        updated.push('kartta');
        added = true;
      }

      if (added) {
        setGameState(prev => ({
          ...prev,
          collectedEvidence: updated,
          unlockedLocations: prev.unlockedLocations.includes('metsapolku')
            ? prev.unlockedLocations
            : [...prev.unlockedLocations, 'metsapolku']
        }));
        playChime('find');
        addLog('Tutkittuasi kivisen kaivon mätien lehtien seasta vedät ylös ruosteisen avaimen ("1952"), märän tonttikartan sekä päiväkirjan repaleisen sivun!');
        addLog('• Salkkuun lohjennut: Ruostunut avain, Päiväkirjan sivu ja Märkä kartan pala.');
        addLog('• Karttapalat kuvaavat polkua kaivolta synkkään metsätiheikköön. Metsäpolku on auki!');
      } else {
        addLog('Kaivon pohjalla on vain tummaa kylmää soraa. Kaikki oleellinen vietiin jo.');
      }
    }

    else if (loc === 'metsapolku') {
      // Examining footprint doesn't give any concrete numbered inventory item, but unlocks progressive path to the Shed
      if (!gameState.unlockedLocations.includes('vaja')) {
        setGameState(prev => ({
          ...prev,
          unlockedLocations: [...prev.unlockedLocations, 'vaja']
        }));
        playChime('unlock');
        addLog('Seuraat metsää pitkin mutaisia askeleita ja puiden välistä roikkuvia vaatteiden repaleita. Löydät tuoreet saappaiden jalanjäljet, joita toiset, epäluonnollisen valtavat jalanjäljet ovat varjostaneet.');
        addLog('• Lokimerkintä: "Joku seurasi Jania metsässä kuusien suojassa." Jäljet johtavat suoraan Hylätylle Vajalle!');
        addLog('• Hylätty Vaja on nyt lisätty kartallesi!');
      } else {
        addLog('Synkässä polkumaisemassa humisee vain kuusien hiljainen ja pahaenteinen laulu sateessa.');
      }
    }

    else if (loc === 'vaja') {
      if (!gameState.chestUnlocked) {
        addLog('Kohtaat vajassa vanhan massiivisen rauta-arkun. Arkku on erittäin tukevasti lukossa. Tarvitset sopivan ruosteisen metalliavaimen avataksesi tämän sijoituskirstun.');
      } else {
        addLog('Lankkuarkku on auki. Sen mustat hirsiseinät seisovat sateessa hylättynä.');
      }
    }

    else if (loc === 'vierashuone') {
      addLog('Katselet tyhjässä vierashuoneeseen olevaa vanhaa murtunutta seinäpeiliä. Pintaan on kuivuneella mudalla sutaistu karmaiseva teksti: "Älä katso taaksesi." Koko kehoasi puistattaa kylmyys.');
    }

    else if (loc === 'rantasauna') {
      addLog('Hämärä rantasauna tuoksuu vanhalta puulta ja vesikaivon seokselta. Kiukaan kylmissä hiilissä on poltettua paperia. Alalauteiden alla seisoo lukittu osasto.');
    }

    else if (loc === 'laiturin_alla') {
      let updated = [...gameState.collectedEvidence];
      let added = false;
      if (!updated.includes('valokuva')) {
        updated.push('valokuva');
        added = true;
      }
      if (!updated.includes('metallirasia')) {
        updated.push('metallirasia');
        added = true;
      }

      if (added) {
        setGameState(prev => ({
          ...prev,
          collectedEvidence: updated,
          unlockedLocations: prev.unlockedLocations.includes('kellari')
            ? prev.unlockedLocations
            : [...prev.unlockedLocations, 'kellari']
        }));
        playChime('find');
        addLog('Laskeudut laiturin alapuolelle kylmään rantaveteen ja kurotat kätesi mustaan pohjamutaan. Löydät hukkuneen pienen Metallirasian sekä sen sisällä säilyneen Kellastuneen Valokuvan vuodelta 1952 varoituksella!');
        addLog('• Salkkuun lisätty: Metallirasia ja Vanha valokuva (Varoitus: "Varjelkaa totuutta. Älkää avatko kellaria.")');
        addLog('• Salaiset askeleesi ohjaavat nyt takaisin sisään huvilaan, johon kellariluukku on vihdoin auki!');
      } else {
        addLog('Laiturin pimeät vedenalaiset paalut seisovat tyhjässä rannassa sateen pilkkujen peittäessä järven.');
      }
    }

    else if (loc === 'kellari') {
      if (!gameState.cabinetUnlocked) {
        addLog('Kellarissa seisoo sähköisesti lukittu Vartijoiden suojakaappi. Sinun on syötettävä sen salainen ohituskaava tai tarvittava salasana paljastaaksesi lopullisen päiväkirjan.');
      } else {
        addLog('Sähkökaappi on tyhjä, sen rautaovi roikkuu auki. Löysit täältä kadonneen päiväkirjan.');
      }
    }
  };

  const handleOpenChestWithKey = () => {
    if (gameState.collectedEvidence.includes('avain')) {
      setGameState(prev => {
        const list = [...prev.collectedEvidence];
        if (!list.includes('kirje')) {
          list.push('kirje');
        }
        return {
          ...prev,
          chestUnlocked: true,
          collectedEvidence: list,
          unlockedLocations: prev.unlockedLocations.includes('vierashuone')
            ? prev.unlockedLocations
            : [...prev.unlockedLocations, 'vierashuone']
        };
      });
      playChime('unlock');
      addLog('Kierrät Vanhasta Kaivosta löytämäsi kuonaisen Ruostuneen Avaimen vajan lankkuarkun rasvaiseen lukkoon... KLIK!');
      addLog('• Arkun pohjalta paljastuu Janin kätkemä Salainen Kirje ("Jos jotain tapahtuu minulle Lopella, älkää luottako kaikkiin...") sekä loistohuvilan Vierashuoneen vara-avain!');
      addLog('• Vierashuone on nyt avattu huvilan toisesta kerroksesta!');
    } else {
      playChime('error');
      addLog('Sinulla ei ole mitään avainta salkussasi, joka sopisi tähän vankan rauta-arkun lukkoon.');
    }
  };

  const handleUnlockSuitcase = () => {
    if (suitcaseCode.trim() === '1952') {
      setGameState(prev => ({
        ...prev,
        suitcaseUnlocked: true,
        unlockedLocations: prev.unlockedLocations.includes('rantasauna')
          ? prev.unlockedLocations
          : [...prev.unlockedLocations, 'rantasauna']
      }));
      playChime('unlock');
      addLog('KRAKS! Matkalaukun messinkinen numerolukko aukeaa koodilla 1952!');
      addLog('• Laukun pohjalta poimit Janin jättämän märkivän muistikirjan sivun, jossa vihjataan paniikinomaisesta paosta kylmälle rantasaunalle.');
      addLog('• Matkalaukusta löytyi myös rantasaunan rujo avain! Reitti Rantasaunalle rannassa on auki!');
      setSuitcaseCode('');
    } else {
      playChime('error');
      addLog('Numerolukko ei värähdäkkään. Koodi on väärä. Tarvitset jonkun historiallisen merkitsevän vuoden tai vihjeen.');
      setSuitcaseCode('');
    }
  };

  const handleOpenSaunaCompartment = () => {
    let updated = [...gameState.collectedEvidence];
    let added = false;
    if (!updated.includes('merkki')) {
      updated.push('merkki');
      added = true;
    }
    if (!updated.includes('lankku')) {
      updated.push('lankku');
      added = true;
    }

    if (added) {
      setGameState(prev => ({
        ...prev,
        collectedEvidence: updated,
        unlockedLocations: prev.unlockedLocations.includes('laiturin_alla')
          ? prev.unlockedLocations
          : [...prev.unlockedLocations, 'laiturin_alla']
      }));
      playChime('unlock');
      addLog('Löysit saunan takalauteen pimeästä salaraosta hiilellä koristetun salalokeron ja poistit sen lankun!');
      addLog('• Salkkuun lisätty kaksi todistetta: Vartijoiden merkki sekä Irtonainen lankku.');
      addLog('• Lankun takana luki hiilellä poltettuna: "Totuus on piilotettu veden alle." Kaikki merkit viittaavat laiturin alla olevaan järviveteen!');
      addLog('• Laiturin alaisen kylmän vesialueen reitti on nyt vapaa tutkittavaksi!');
    } else {
      addLog('Salalokero lauteiden takana on nuhruinen ja tyhjä.');
    }
  };

  const handleUnlockCabinet = () => {
    const attempted = cabinetPassword.trim().toUpperCase();
    if (attempted === 'VARTIJAT' || attempted === '1952') {
      setGameState(prev => ({
        ...prev,
        cabinetUnlocked: true,
        gameCompleted: true
      }));
      playChime('unlock');
      addLog('RASKAS metallinen sähkökaappi särähtää kipinöiden ja sen paksut ovet ponnahtavat auki!');
      addLog('• Löysit kaapin periltä tahrattoman kadonneen punakantisen päiväkirjan! Jani oli piilottanut sen tänne valloittajilta.');
      addLog('• Päiväkirjan viimeisessä merkinnässä lukee heristäen: "Syyllinen ei ollut ulkopuolinen. Hän oli yksi meistä."');
      addLog('• Kellarin halkeilevassa tiiliseinässä on kirjoitettu verenvärisellä maalilla suurin kirjaimin: "TOTUUS EI SAA NOUSTA PINTAAN."');
    } else {
      playChime('error');
      addLog('Väärä salasana. Sähköovi antaa pienen sähköiskun. Muista: Vartijat piirsivät nimensä ja vuotensa rannan puulle.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-905 text-slate-100 flex flex-col font-sans relative selection:bg-red-950 selection:text-red-200">
      
      {/* Visual Ambient Mist/Water effect */}
      <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden z-0">
        <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-blue-950/30 via-slate-905 to-transparent animate-pulse" />
      </div>

      {/* Main Bar Info */}
      <header className="border-b border-slate-900 bg-slate-905/90 backdrop-blur z-20 sticky top-0">
        <div className="max-w-4xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Skull className="w-6 h-6 text-red-600 animate-pulse" />
            <div>
              <h1 className="font-display font-extrabold tracking-widest text-slate-100 text-sm md:text-base">KADONNUT JANI</h1>
              <p className="text-[9px] text-red-500/80 font-mono tracking-widest uppercase font-semibold">Salaliitto Lopella // Vuosi 1952</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              id="btn_sound_toggle"
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                playChime('click');
              }}
              className={`p-2 rounded-xl border text-xs font-mono transition flex items-center space-x-1.5 ${
                soundEnabled 
                  ? 'bg-red-950/40 border-red-900 text-red-400' 
                  : 'bg-slate-955 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title={soundEnabled ? 'Sammuta horror-tausta' : 'Käynnistä horror-tausta'}
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-red-500 animate-bounce" />
                  <span className="hidden sm:inline text-[10px]">ÄÄNET PÄÄLLÄ</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-slate-500" />
                  <span className="hidden sm:inline text-[10px]">ÄÄNET POIS</span>
                </>
              )}
            </button>

            <button
              id="btn_reset"
              onClick={handleResetGame}
              className="p-2 bg-slate-955 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-950 rounded-xl transition"
              title="Aloita alusta"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Start screen */}
      {!gameState.gameStarted ? (
        <div className="flex-1 max-w-xl mx-auto px-4 py-12 flex flex-col justify-center text-center z-10 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-3"
          >
            <div className="w-20 h-20 bg-gradient-to-tr from-red-950/40 to-slate-900 border border-slate-800 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-2xl relative">
              <span className="relative z-10">👁️</span>
              <div className="absolute inset-0 bg-red-650/10 rounded-3xl blur-md" />
            </div>
            <h2 className="text-4xl font-display font-extrabold tracking-tight text-slate-100">Kadonnut Jani</h2>
            <p className="text-xs font-mono text-red-500 uppercase tracking-widest font-semibold">Tutkimusmysteeri Lopen järvellä // 1952</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="p-6 bg-slate-955 border border-slate-900 rounded-2xl text-left space-y-4 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute -right-4 -bottom-4 opacity-5 text-red-500 font-display text-8xl font-black">1952</div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Jani katosi mystisesti 3 päivää sitten Lopella sijaitsevalta loistohuvilalta. Paikalle seisoi ennen vanha, 100-vuotias purettu hirsitalo rantoineen. Janin huoneesta paljastui merkintöjä, joiden mukaan hän oli päässyt vuoden <span className="text-red-400 font-bold">1952 vaietun salaisuuden</span> jäljille.
            </p>
            <p className="text-sm text-slate-355 leading-relaxed">
              Vedessä on jotain outoa ja synkkää... Jotain, miltä "Vartijat"-niminen muinainen ryhmä on yrittänyt epätoivoisesti suojella ihmisiä vuosikymmenen ajan.
            </p>
            <p className="text-xs text-slate-400 border-l border-red-900/50 pl-3 italic">
              Saavut rannalle sateen rummuttaessa hiekkaa. Sinun on edettävä loogisesti paikka kerrallaan, ratkaistava kokeet ja kerättävä salkkuusi kaikki <span className="font-semibold text-blue-400">10 kadonnutta todistetta</span>.
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            id="btn_begin_investigation"
            onClick={() => {
              setGameState(prev => ({ ...prev, gameStarted: true }));
              playChime('unlock');
            }}
            className="w-full py-4 bg-red-700 hover:bg-red-600 active:bg-red-800 font-display tracking-widest text-[#05080f] font-bold rounded-2xl transition duration-150 transform hover:-translate-y-0.5 text-center shadow-xl shadow-red-950/20 uppercase"
          >
            Aloita tutkimukset rannalta
          </motion.button>
        </div>
      ) : (
        <div className="flex-1 max-w-4xl w-full mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-6 z-10 min-h-0">
          
          {/* Main gameplay view column */}
          <div className="md:col-span-2 flex flex-col space-y-5 min-h-0">
            
            {/* Tabs Controller */}
            <div className="flex border-b border-slate-900 bg-slate-955/60 p-1 rounded-2xl">
              <button
                id="tab_peli_select"
                onClick={() => { playChime('click'); setActiveTab('peli'); }}
                className={`flex-1 py-3 text-center rounded-xl font-bold font-mono text-xs tracking-wider uppercase transition flex items-center justify-center space-x-2 ${
                  activeTab === 'peli'
                    ? 'bg-slate-905 border border-slate-800 text-slate-100 shadow-lg'
                    : 'text-slate-505 hover:text-slate-300'
                }`}
              >
                <Compass className="w-4 h-4 text-red-500" />
                <span>1. Tutki Alueita</span>
              </button>
              
              <button
                id="tab_salkku_select"
                onClick={() => { 
                  playChime('click'); 
                  setActiveTab('salkku');
                  const list = getCollectedEvidenceList();
                  if (list.length > 0 && !selectedEvidence) {
                    setSelectedEvidence(list[0]);
                  }
                }}
                className={`flex-1 py-3 text-center rounded-xl font-bold font-mono text-xs tracking-wider uppercase transition flex items-center justify-center space-x-1.5 ${
                  activeTab === 'salkku'
                    ? 'bg-slate-905 border border-slate-800 text-slate-100 shadow-lg'
                    : 'text-slate-505 hover:text-slate-300'
                }`}
              >
                <FileText className="w-4 h-4 text-blue-500" />
                <span>2. Salkku</span>
                <span className="bg-blue-950 text-blue-300 border border-blue-900 text-[9px] px-1.5 py-0.5 rounded-full font-bold ml-1 font-mono">
                  {gameState.collectedEvidence.length}/10
                </span>
              </button>

              <button
                id="tab_kartta_select"
                onClick={() => { playChime('click'); setActiveTab('kartta'); }}
                className={`flex-1 py-3 text-center rounded-xl font-bold font-mono text-xs tracking-wider uppercase transition flex items-center justify-center space-x-1.5 ${
                  activeTab === 'kartta'
                    ? 'bg-slate-905 border border-slate-800 text-slate-100 shadow-lg'
                    : 'text-slate-505 hover:text-slate-300'
                }`}
              >
                <MapPin className="w-4 h-4 text-purple-500" />
                <span>3. Lopen Kartta</span>
              </button>
            </div>

            {/* Active Workspace / Tab Details */}
            <div className="flex-1 bg-slate-955/80 border border-slate-900 rounded-3xl p-5 md:p-6 flex flex-col justify-between shadow-2xl relative min-h-[460px]">
              
              {activeTab === 'peli' && (
                <div className="space-y-5 h-full flex flex-col justify-between">
                  
                  {/* Horizon locations list */}
                  <div className="space-y-2 text-left">
                    <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block font-semibold">Valitse Aluekartalta kohde:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-0.5">
                      {(['laituri', 'kaivo', 'metsapolku', 'vaja', 'vierashuone', 'rantasauna', 'laiturin_alla', 'kellari'] as LocationId[]).map((locId, idx) => {
                        const unlocked = gameState.unlockedLocations.includes(locId);
                        const active = gameState.currentLocation === locId;
                        const label: Record<LocationId, string> = {
                          laituri: 'Laituri',
                          kaivo: 'Vanha Kaivo',
                          metsapolku: 'Metsäpolku',
                          vaja: 'Hylätty Vaja',
                          vierashuone: 'Vierashuone',
                          rantasauna: 'Sauna',
                          laiturin_alla: 'Laiturin alla',
                          kellari: 'Kellari'
                        };

                        return (
                          <button
                            id={`loc_select_${locId}`}
                            key={locId}
                            onClick={() => selectLocation(locId)}
                            className={`py-2 px-2.5 text-xs font-mono rounded-xl border text-left flex items-center justify-between transition ${
                              active
                                ? 'bg-red-950/25 border-red-700 text-red-200 font-bold'
                                : unlocked
                                ? 'bg-slate-900 border-slate-800 text-slate-350 hover:bg-slate-800/60'
                                : 'bg-slate-955/10 border-slate-955 text-slate-700 cursor-not-allowed opacity-45 shadow-inner'
                            }`}
                            disabled={!unlocked}
                          >
                            <span className="truncate">{idx + 1}. {label[locId]}</span>
                            <span>{!unlocked ? '🔒' : ''}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Location Area Scene Render */}
                  <div className="space-y-4 flex-1 pt-1">
                    
                    {/* Location Image helper with elegant fallback if empty */}
                    <ThematicImage 
                      id={gameState.currentLocation} 
                      title={
                        gameState.currentLocation === 'laituri' ? 'Laituri (Ranta)' :
                        gameState.currentLocation === 'kaivo' ? 'Vanha Kivikaivo' :
                        gameState.currentLocation === 'metsapolku' ? 'Metsäpolku (Kuusikko)' :
                        gameState.currentLocation === 'vaja' ? 'Hylätty hirsivaja' :
                        gameState.currentLocation === 'vierashuone' ? 'Huvilan vierashuone' :
                        gameState.currentLocation === 'rantasauna' ? 'Rantasaunan lauteet' :
                        gameState.currentLocation === 'laiturin_alla' ? 'Vedenalainen laiturinpuolikas' : 'Kellarikerroksen sähkökaappi'
                      }
                    />

                    {/* Description Text */}
                    <div className="text-left bg-slate-905/60 p-4 rounded-2xl border border-slate-900 text-xs md:text-sm text-slate-300 leading-relaxed">
                      {gameState.currentLocation === 'laituri' && (
                        <p>
                          Laituri nuolee Lopen sateista järveä. Myrskytuuli ulvoo ja sade piiskaa tyhjiä harmaita lankkuja. Jani katosi rannasta kolme päivää sitten. Hänen kenkiensä jäljet mudassa päättyvät tähän kovaan soralaituriin.
                        </p>
                      )}
                      {gameState.currentLocation === 'kaivo' && (
                        <p>
                          Sammaloitunut sata vuotta vanha kaivonreunus häämöttää kuusien synkässä kainalossa huvilan takana. Sade rämisee kaivon katolla. Janin puhelimen viimeinen otos osoitti suoraan tänne pohjattomaan kivisilmään.
                        </p>
                      )}
                      {gameState.currentLocation === 'metsapolku' && (
                        <p>
                          Usvainen ja villiintynyt polku kuusien syvyyksissä. Puiden oksat hankaavat toisiaan raskaasti tuulessa. Polulla näkyy lennokkaita lenkkarinjälkiä, mutta jokin toinen, raskas askel on seurannut niitä varjoksi metsässä.
                        </p>
                      )}
                      {gameState.currentLocation === 'vaja' && (
                        <p>
                          Lokin paska ja vanha puu haisevat tässä hylätyssä puuvajassa. Ovi repsottaa naristen. Pöydällä lojuu piirroksia, verisiä pyyhkeitä ja keskellä vajaa seisoo ikivanha massiivinen ja raudoitettu lankkuarkku paksuin lukoin.
                        </p>
                      )}
                      {gameState.currentLocation === 'vierashuone' && (
                        <p>
                          Olet hiipinyt varovasti loistohuvilan sisätiloihin, tyhjään ja pimeään vierashuoneeseen. Huoneessa vallitsee lamaannuttava hiljaisuus ja murtuneen peilin heijastus tuntuu vääristyvän pimeyden varjoissa. Sängyn alta näkyy vanha nahkainen säilytyslaukku.
                        </p>
                      )}
                      {gameState.currentLocation === 'rantasauna' && (
                        <p>
                          Veden päällä seisova harmaa rantasauna on kylmä ja sen löylyhuone sumuinen. Lauteet ovat täynnä kosteaa hiekkaa. Janin päiväkirjassa piirrettiin suuria kauneuskyyneliä rannasta ja salalokerosta lauteiden raossa.
                        </p>
                      )}
                      {gameState.currentLocation === 'laiturin_alla' && (
                        <p>
                          Olet laskeutunut pieneen lankon alaosaan rannassa. Kylmä järvivesi yltää reisiisi ja sade rummuttaa puukantta ylhäälläsi. Vedenalainen pohjamuta peittää vanhoja laiturin ankkuritukia sekä salattua totuutta.
                        </p>
                      )}
                      {gameState.currentLocation === 'kellari' && (
                        <p>
                          Loistohuvilan kylmä kellarisyvyys. Jääkaappimainen ilma haisee homeelta ja vanhalta kiveltä. Harmaassa tiilirakenteessa on suuria verihyytymiä, ja keskiseinässä seisoo sähköisesti suojattu rujo Vartijakaappi.
                        </p>
                      )}
                    </div>

                    {/* Area Interactive Options */}
                    <div className="pt-2 text-left">
                      {gameState.currentLocation === 'laituri' && (
                        <div className="grid grid-cols-1 gap-2">
                          {!gameState.collectedEvidence.includes('puhelin') ? (
                            <button
                              id="btn_laituri_doc"
                              onClick={handleInvestigateArea}
                              className="w-full p-3.5 bg-red-950/40 hover:bg-red-900/30 border border-red-900 text-red-100 rounded-2xl transition flex items-center justify-between text-xs sm:text-sm group"
                            >
                              <span className="font-bold flex items-center space-x-2">
                                <Search className="w-4.5 h-4.5 text-red-500 shrink-0 group-hover:scale-110 transition" />
                                <span>Kierrä ja tutki laiturin sateista laitaa</span>
                              </span>
                              <span className="text-[10px] text-red-400 font-mono tracking-widest font-semibold">TUTKI</span>
                            </button>
                          ) : (
                            <p className="text-xs text-slate-500 italic bg-slate-905/30 p-3 rounded-xl text-center border border-slate-900/60 leading-relaxed">
                              ✓ Löysit jo puhelimen ja märän muistilapun laiturin laidalta. Puhelimen kivikaivokuva opasti tiesi Vanhalle Kaivolle vapaaksi.
                            </p>
                          )}
                        </div>
                      )}

                      {gameState.currentLocation === 'kaivo' && (
                        <div className="grid grid-cols-1 gap-2">
                          {!gameState.collectedEvidence.includes('avain') ? (
                            <button
                              id="btn_kaivo_well"
                              onClick={handleInvestigateArea}
                              className="w-full p-3.5 bg-emerald-950/40 hover:bg-emerald-900/25 border border-emerald-900/80 text-emerald-100 rounded-2xl transition flex items-center justify-between text-xs sm:text-sm group"
                            >
                              <span className="font-bold flex items-center space-x-2">
                                <Search className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                                <span>Tutki sammaloituneen kaivon uumenia ja asioita</span>
                              </span>
                              <span className="text-[10px] text-emerald-400 font-mono tracking-widest font-semibold">HARAVOI</span>
                            </button>
                          ) : (
                            <p className="text-xs text-slate-505 italic bg-slate-905/30 p-3 rounded-xl text-center border border-slate-900/60">
                              ✓ Kaivon uumenista otettiin jo ruosteinen avain, vanha Lopen tonttikartta sekä vuoden 1952 päiväkirjan sivu.
                            </p>
                          )}
                        </div>
                      )}

                      {gameState.currentLocation === 'metsapolku' && (
                        <div className="grid grid-cols-1 gap-2">
                          {!gameState.unlockedLocations.includes('vaja') ? (
                            <button
                              id="btn_polku_search"
                              onClick={handleInvestigateArea}
                              className="w-full p-3.5 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 text-slate-100 rounded-2xl transition flex items-center justify-between text-xs sm:text-sm group"
                            >
                              <span className="font-bold flex items-center space-x-2">
                                <Search className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                                <span>Tutki ja seuraa mutaisia jalanjälkiä kuusikkoon</span>
                              </span>
                              <span className="text-[10px] text-zinc-550 font-mono">SEURAA</span>
                            </button>
                          ) : (
                            <p className="text-xs text-slate-500 italic bg-slate-905/30 p-3 rounded-xl text-center border border-slate-900/60">
                              ✓ Seurasit mutaisia jalanjälkiä puiden väliin. Reitti johti suoraan Hylätylle Vajalle!
                            </p>
                          )}
                        </div>
                      )}

                      {gameState.currentLocation === 'vaja' && (
                        <div className="space-y-4">
                          <div className="border border-slate-900 bg-slate-955/60 p-4 rounded-2xl space-y-3.5 shadow-md">
                            <div className="flex items-center space-x-3 text-left">
                              <div className={`p-2.5 rounded-xl ${gameState.chestUnlocked ? 'bg-emerald-950/40 text-emerald-400' : 'bg-amber-950/40 text-amber-500 animate-pulse'}`}>
                                {gameState.chestUnlocked ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                              </div>
                              <div>
                                <span className="font-bold text-slate-200 text-sm block">Vajan raskas lankkuarkku</span>
                                <span className="text-xs text-slate-405 block">Rautainen massiivinen lukko vaatii Ruostuneen avaimen kaivolta.</span>
                              </div>
                            </div>

                            {!gameState.chestUnlocked ? (
                              <button
                                id="btn_unlock_chest"
                                onClick={handleOpenChestWithKey}
                                className="w-full py-2.5 bg-amber-900/30 hover:bg-amber-905/55 text-amber-200 border border-amber-800/60 rounded-xl transition text-xs font-mono font-bold tracking-widest uppercase"
                              >
                                Avaa lukko Ruostuneella avaimella
                              </button>
                            ) : (
                              <div className="bg-emerald-950/20 border border-emerald-900/40 p-3 rounded-xl text-xs text-emerald-400 space-y-1">
                                <p className="font-bold">✓ ARKKU SEPPOSEN SELÄLLÄÄN!</p>
                                <p className="text-slate-300">Arkusta lohkesi Janin salainen Kirje sekä huvilan Vierashuoneen vara-avain.</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {gameState.currentLocation === 'vierashuone' && (
                        <div className="space-y-4">
                          <button
                            id="btn_mirror_interact"
                            onClick={handleInvestigateArea}
                            className="w-full p-3 bg-purple-950/20 hover:bg-purple-950/30 border border-purple-900/50 text-purple-200 rounded-xl transition text-xs font-mono font-bold text-center flex items-center justify-center space-x-2"
                          >
                            <Eye className="w-4 h-4 text-purple-400" />
                            <span>Koputa seinäpeilin pintaa</span>
                          </button>

                          <div className="border border-slate-900 bg-slate-955/60 p-4 rounded-2xl space-y-3 shadow-md">
                            <div className="flex items-center space-x-3 text-left">
                              <div className={`p-2.5 rounded-xl ${gameState.suitcaseUnlocked ? 'bg-emerald-950/40 text-emerald-400' : 'bg-purple-950/40 text-purple-400'}`}>
                                {gameState.suitcaseUnlocked ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                              </div>
                              <div>
                                <span className="font-bold text-slate-200 text-sm block">Sängyn alta vetämäsi matkalaukku</span>
                                <span className="text-xs text-slate-405 block">Lukko vaatii 4-numeroisen suojakoodin (vaiettu vuosiluku).</span>
                              </div>
                            </div>

                            {!gameState.suitcaseUnlocked ? (
                              <div className="flex space-x-2">
                                <input
                                  id="input_suitcase_code"
                                  type="text"
                                  maxLength={4}
                                  placeholder="19XX"
                                  value={suitcaseCode}
                                  onChange={(e) => setSuitcaseCode(e.target.value.replace(/\D/g, ''))}
                                  className="w-24 px-3 py-2 bg-slate-905 border border-slate-800 rounded-xl text-center text-slate-100 font-mono font-bold text-base focus:outline-none focus:border-purple-650"
                                />
                                <button
                                  id="btn_try_suitcase"
                                  onClick={handleUnlockSuitcase}
                                  className="flex-1 py-2 px-3 bg-purple-950/30 hover:bg-purple-900/30 text-purple-200 border border-purple-900 rounded-xl transition text-xs font-semibold uppercase tracking-wider"
                                >
                                  Syötä koodi
                                </button>
                              </div>
                            ) : (
                              <div className="bg-emerald-950/20 border border-emerald-900/40 p-3 rounded-xl text-xs text-emerald-400 space-y-1">
                                <p className="font-bold">✓ MATKALAUKKU ON AUKEUTUNUT (KOODI: 1952)!</p>
                                <p className="text-slate-300">Sisältä otit Janin paosta muistuttavan muistikirjan sivun sekä rantasaunan avaimen.</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {gameState.currentLocation === 'rantasauna' && (
                        <div className="space-y-4">
                          <button
                            id="btn_sauna_stove"
                            onClick={handleInvestigateArea}
                            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-805 rounded-xl transition text-xs font-mono font-bold text-center"
                          >
                            Kaivele kiukaan viilentyneitä kierteitä
                          </button>

                          <div className="border border-slate-900 bg-slate-955/60 p-4 rounded-2xl space-y-3 shadow-md">
                            <div className="flex items-center space-x-3 text-left">
                              <div className={`p-2.5 rounded-xl bg-orange-950/40 text-orange-400`}>
                                <Lock className="w-5 h-5 text-orange-400 animate-pulse" />
                              </div>
                              <div>
                                <span className="font-bold text-slate-200 text-sm block">Lauteiden alainen pimeä salaliitolokerikko</span>
                                <span className="text-xs text-slate-405 block">Rantasaunan lauteista irrotettava osasto vaatii sen avaimen matkalaukusta.</span>
                              </div>
                            </div>

                            {!gameState.collectedEvidence.includes('merkki') ? (
                              <button
                                id="btn_sauna_bench_open"
                                onClick={handleOpenSaunaCompartment}
                                className="w-full py-2.5 bg-orange-950/40 hover:bg-orange-900/30 text-orange-200 border border-orange-800 rounded-xl transition text-xs font-mono font-bold tracking-widest uppercase"
                              >
                                Avaa osasto matkalaukusta saadulla avaimella
                              </button>
                            ) : (
                              <div className="bg-emerald-950/20 border border-emerald-900/40 p-3 rounded-xl text-xs text-emerald-400">
                                <p className="font-bold">✓ SALALOKERO TUTKITTU!</p>
                                <p className="text-slate-300">Lokeron pohjalta poimit talteen Vartijoiden merkin sekä irtoavan lankun veret.</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {gameState.currentLocation === 'laiturin_alla' && (
                        <div className="grid grid-cols-1 gap-2">
                          {!gameState.collectedEvidence.includes('valokuva') ? (
                            <button
                              id="btn_laituri_water_search"
                              onClick={handleInvestigateArea}
                              className="w-full p-3.5 bg-teal-950/40 hover:bg-teal-900/25 border border-teal-905 text-teal-100 rounded-2xl transition flex items-center justify-between text-xs sm:text-sm group"
                            >
                              <span className="font-bold flex items-center space-x-2">
                                <Waves className="w-4.5 h-4.5 text-teal-400 shrink-0" />
                                <span>Rämmi rantaveteen ja haro upotettuja tolpankujia</span>
                              </span>
                              <span className="text-[10px] text-teal-400 font-mono tracking-widest font-semibold">ETSINKÄ</span>
                            </button>
                          ) : (
                            <p className="text-xs text-slate-500 italic bg-slate-905/30 p-3 rounded-xl text-center border border-slate-900/60">
                              ✓ Sait vedestä ylös runnellun Vuoden 1952 valokuvan sekä pienen rautaisen Metallirasian.
                            </p>
                          )}
                        </div>
                      )}

                      {gameState.currentLocation === 'kellari' && (
                        <div className="border border-slate-900 bg-slate-955/70 p-4 rounded-2xl space-y-4 shadow-xl">
                          <div className="flex items-center space-x-3 text-left">
                            <div className={`p-2.5 rounded-xl ${gameState.cabinetUnlocked ? 'bg-emerald-950/40 text-emerald-400' : 'bg-red-950/40 text-red-500 animate-pulse'}`}>
                              <Skull className="w-5 h-5 text-red-500" />
                            </div>
                            <div>
                                <span className="font-bold text-slate-200 text-sm block">Vartijoiden suojattu rujo sähkösalkku</span>
                                <span className="text-xs text-slate-405 block">Sähköisesti varmistettu lokerikko vaatii ratkaisevan syvyystunnuksen.</span>
                            </div>
                          </div>

                          {!gameState.cabinetUnlocked ? (
                            <div className="space-y-2">
                              <p className="text-[11px] text-slate-400 leading-relaxed text-left">
                                <span className="font-bold text-red-400">Vihje:</span> Puiden pintaan ja saunan Hiilellä piirretty ranta-avaimen suomenkielinen nimi SUURAAKKOSILLA tai historian musta vuosiluku salkussasi.
                              </p>
                              <div className="flex space-x-2">
                                <input
                                  id="input_cabinet_pass"
                                  type="text"
                                  placeholder="SYÖTÄ TUNNUS"
                                  value={cabinetPassword}
                                  onChange={(e) => setCabinetPassword(e.target.value)}
                                  className="flex-1 px-3 py-2 bg-slate-905 border border-slate-800 rounded-xl text-slate-100 font-mono font-bold max-w-xs focus:outline-none focus:border-red-650 text-sm uppercase"
                                />
                                <button
                                  id="btn_submit_cabinet_pass"
                                  onClick={handleUnlockCabinet}
                                  className="px-4 py-2 bg-red-950/50 hover:bg-red-900/40 text-red-200 border border-red-900 rounded-xl font-bold font-mono text-xs uppercase"
                                >
                                  Avaa ovi
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="p-3 bg-emerald-950/20 border border-emerald-900/40 rounded-xl text-xs text-emerald-400 text-left space-y-1">
                              <p className="font-bold">✓ VARTIJAT-KAAPPI AVATTU!</p>
                              <p className="text-slate-300">Löysit sieltä Janin Kadonneen Alkuperäisen päiväkirjan. Tarina on ratkaistu!</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )}

              {activeTab === 'salkku' && (
                <div className="space-y-4 text-left">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-900">
                    <h3 className="font-display font-bold text-slate-100 text-base flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-blue-500" />
                      <span>Tutkijan salkku ({getCollectedEvidenceList().length}/10 todistetta)</span>
                    </h3>
                    <span className="text-[10px] text-slate-500 font-mono">TUTKI SÄILYTYSTÄ</span>
                  </div>

                  {getCollectedEvidenceList().length === 0 ? (
                    <div className="py-12 text-center bg-slate-905/50 border border-slate-900 rounded-2xl space-y-4">
                      <AlertCircle className="w-12 h-12 text-slate-700 mx-auto" />
                      <div>
                        <p className="text-sm font-bold text-slate-400">Salkku on tyhjä.</p>
                        <p className="text-xs text-slate-500 max-w-xs mx-auto pt-1 leading-relaxed">
                          Aloita tutkimukset rannalta Laiturilta kohdataksesi Janin hylkäämän puhelimen ja märän muistilapun.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      
                      {/* Left half: item buttons list */}
                      <div className="md:col-span-2 space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                        {getCollectedEvidenceList().map(item => (
                          <button
                            id={`btn_inspect_${item.id}`}
                            key={item.id}
                            onClick={() => { playChime('click'); setSelectedEvidence(item); }}
                            className={`w-full p-2.5 rounded-xl border text-left flex items-center space-x-2.5 transition ${
                              selectedEvidence?.id === item.id
                                ? 'bg-blue-955 border-blue-800 text-blue-105'
                                : 'bg-slate-900/60 border-slate-900 text-slate-350 hover:bg-slate-800/40'
                            }`}
                          >
                            <span className="text-2xl shrink-0">{item.icon}</span>
                            <div className="truncate text-xs">
                              <span className="font-bold block tracking-wide">{item.name}</span>
                              <span className="text-[9px] text-slate-505 block uppercase">Löytöpaikka: {item.foundAt}</span>
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Right half: Detailed inspection screen */}
                      <div className="md:col-span-3 border border-slate-900 rounded-2xl p-4 bg-slate-955/90 flex flex-col justify-between shadow-inner min-h-[220px]">
                        {selectedEvidence ? (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                              <div className="flex items-center space-x-2">
                                <span className="text-3xl">{selectedEvidence.icon}</span>
                                <div>
                                  <h4 className="font-display font-extrabold text-xs text-slate-100 uppercase tracking-widest">{selectedEvidence.name}</h4>
                                  <span className="text-[9px] text-slate-505 block font-mono">TUTKIJA // SALKKUTODISTE</span>
                                </div>
                              </div>
                              <span className="text-[9px] text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 px-2 py-0.5 rounded font-mono">OK</span>
                            </div>

                            <p className="text-xs md:text-sm text-slate-300 leading-relaxed bg-slate-905/60 p-3 rounded-xl border border-slate-900">
                              {selectedEvidence.description}
                            </p>

                            <div className="p-2.5 bg-blue-955 border border-blue-900/60 rounded-xl text-xs space-y-1">
                              <span className="font-bold text-blue-400 uppercase tracking-widest text-[10px] block">Vihje Tutkijalle:</span>
                              <p className="text-slate-300 text-[11px] leading-relaxed italic">"{selectedEvidence.secretHint}"</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-600 p-4">
                            <HelpCircle className="w-10 h-10 text-slate-800 animate-pulse mb-2" />
                            <p className="text-xs">Valitse vasemmalta jokin esine, niin voit lukea sen pikkutarkat havainnot.</p>
                          </div>
                        )}
                      </div>

                    </div>
                  )}
                </div>
              )}

              {activeTab === 'kartta' && (
                <div className="space-y-4 text-left">
                  <div className="border-b border-slate-900 pb-1 flex items-center justify-between">
                    <h3 className="font-display font-bold text-slate-100 text-base flex items-center space-x-2">
                      <Compass className="w-5 h-5 text-purple-500" />
                      <span>Lopen loistohuvilan sijaintipisteet</span>
                    </h3>
                    <span className="text-[10px] text-purple-400 font-mono uppercase tracking-widest">AALTOKARTTA 1952</span>
                  </div>

                  <div className="bg-slate-905 p-4 rounded-2xl border border-slate-900 space-y-3">
                    <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                      Lopen ranta pitää sisällään salaisia polkuja. Puretun satavuotiaan hirsitontin tilalle rakennettu huvila houkutteli Jania syvälle sen sateiseen historiaan ja Vartijoiden verkon ympärille.
                    </p>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px] font-mono">
                      {[
                        { id: 'laituri', n: '1. Laituri', s: 'Ranta-alku' },
                        { id: 'kaivo', n: '2. Vanha kaivo', s: 'Metsän reuna' },
                        { id: 'metsapolku', n: '3. Metsäpolku', s: 'Kuusikkoa' },
                        { id: 'vaja', n: '4. Hylätty vaja', s: 'Lautarakennus' },
                        { id: 'vierashuone', n: '5. Vierashuone', s: 'Huvilan yläkerta' },
                        { id: 'rantasauna', n: '6. Rantasauna', s: 'Lauteet vedellä' },
                        { id: 'laiturin_alla', n: '7. Laiturin alla', s: 'Vedenalainen' },
                        { id: 'kellari', n: '8. Kellariluukku', s: 'Syvyys' }
                      ].map((item, idx) => {
                        const unlocked = gameState.unlockedLocations.includes(item.id as LocationId);
                        return (
                          <div 
                            key={idx} 
                            className={`p-2.5 border rounded-xl flex flex-col justify-between ${
                              unlocked
                                ? 'bg-slate-955 border-slate-800 text-slate-205'
                                : 'bg-slate-905/30 border-slate-955 text-slate-600 opacity-40'
                            }`}
                          >
                            <span className="font-bold tracking-wide">{item.n}</span>
                            <span className="text-[9px] text-slate-505 block pt-0.5">{unlocked ? item.s : 'Lukittu 🔒'}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-purple-955/35 border border-purple-900/40 p-3.5 rounded-2xl text-xs text-purple-355 leading-relaxed">
                    <span className="font-bold text-purple-400 block mb-1">Miten edetä pelissä?</span>
                    Peli kulkee tasolta tasolle! Avaa uudet kohteet haravoimalla nykyistä aluettasi (klikkaa <span className="font-bold">Tutki aluetta</span> tai ratkaise lukitukset). Jokaisesta paikasta poimitaan ratkaisevat todisteet tutkijan salkkuun. Salkkuasi tarkastelemalla löydät sähkökaapin ja arkun koodit!
                  </div>
                </div>
              )}

            </div>

            {/* Narrative Live History Log scroll overlay */}
            <div className="p-4 bg-slate-955/60 border border-slate-900 rounded-2xl flex flex-col space-y-2.5 text-left shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-900/60 pb-1.5">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-650 animate-ping shrink-0" />
                  <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest font-semibold">TUTKIJAN HAVAINNOT JA LOKI</span>
                </div>
                <span className="text-[9px] text-slate-605 font-mono uppercase">REALTIME FEED</span>
              </div>
              <div className="max-h-[110px] overflow-y-auto space-y-1.5 text-xs font-mono text-slate-350 scrollbar-thin pr-1">
                {narrativeLog.slice().reverse().map((log, index) => (
                  <div key={index} className="border-l border-red-950 pl-2.5 py-0.5 leading-relaxed text-slate-300">
                    {log}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar right Column section */}
          <div className="space-y-5 flex flex-col">
            
            {/* Quick Salkku Grid Summary */}
            <div className="bg-slate-955/90 border border-slate-900 rounded-2xl p-4 flex flex-col space-y-3 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-bold">SALKKUPAKKA ({gameState.collectedEvidence.length}/10)</span>
                <Compass className="w-4 h-4 text-slate-500 animate-spin-slow" />
              </div>

              {gameState.collectedEvidence.length === 0 ? (
                <p className="text-xs text-slate-600 py-4 font-mono text-center">Ei kerättyjä todisteita vielä.</p>
              ) : (
                <div className="grid grid-cols-5 gap-2">
                  {(['puhelin', 'muistilappu', 'avain', 'paivakirja_sivu', 'kartta', 'kirje', 'lankku', 'merkki', 'valokuva', 'metallirasia'] as EvidenceId[]).map((id) => {
                    const isFound = gameState.collectedEvidence.includes(id);
                    const item = CONST_EVIDENCE_ITEMS[id];
                    
                    return (
                      <button
                        id={`quick_slot_${id}`}
                        key={id}
                        onClick={() => {
                          if (isFound && item) {
                            playChime('click');
                            setActiveTab('salkku');
                            setSelectedEvidence(item);
                          }
                        }}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition border ${
                          isFound
                            ? 'bg-slate-900 border-blue-900 hover:bg-slate-800'
                            : 'bg-slate-905 border-slate-900/60 opacity-25 cursor-not-allowed'
                        }`}
                        title={isFound && item ? item.name : 'Ei vielä löydetty'}
                        disabled={!isFound}
                      >
                        {isFound && item ? item.icon : '❓'}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Climax Epilogue (Shows up only after complete victory!) */}
            {gameState.gameCompleted && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-950/20 border border-red-900/85 rounded-3xl p-5 text-left space-y-3.5 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute right-2 top-2">
                  <Skull className="w-12 h-12 text-red-900/25 rotate-12" />
                </div>
                
                <div className="flex items-center space-x-2 text-red-500">
                  <Skull className="w-5 h-5 animate-spin" />
                  <span className="font-display font-black text-xs tracking-wider uppercase">PELIN HUIPENNUSTEKSTI</span>
                </div>
                
                <div className="bg-black/50 p-4 rounded-2xl border border-red-950 text-xs text-slate-205 leading-relaxed space-y-1.5 relative z-10 font-mono">
                  <p className="font-bold text-red-400">KUULET JANIN ÄÄNEN SUMUSTA:</p>
                  <p className="italic font-display text-slate-100 text-sm tracking-wide py-1">
                    "Kaikki alkoi jo kauan ennen minua... Jos kuulet rannalta äänen, joka kuulostaa tutulta... älä seuraa sitä."
                  </p>
                  <p className="italic text-slate-300">
                    "Sillä totuus lepää edelleen järven pohjassa. Ja joskus... totuus katsoo takaisin. VARTIJAT OVAT TÄÄLLÄ."
                  </p>
                </div>

                <div className="text-xs text-emerald-400 font-mono flex items-center space-x-1.5">
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>Onneksi olkoon, ratkaisit Lopen mysteerin!</span>
                </div>

                <button
                  id="btn_play_again"
                  onClick={handleResetGame}
                  className="w-full py-2.5 bg-red-900/50 hover:bg-red-900/70 text-[#0c0405] text-xs font-mono font-bold rounded-xl transition uppercase tracking-widest bg-red-300"
                >
                  Pelaa uudelleen alusta tontilla
                </button>
              </motion.div>
            )}

            {/* Little aesthetic widget */}
            <div className="p-4 bg-slate-955/20 border border-slate-900 rounded-2xl text-left space-y-1.5 shadow-sm">
              <span className="text-[9px] text-slate-505 font-mono uppercase tracking-widest font-bold">TUTKIJAN TIEDOTTEET:</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Huvila sijoittuu Loppijärven puhtaalle rannalle. Jani löysi paikalta merkkejä joissa viitataan "elävään veteen" sateessa. Löydät kaikki vastaukset salkustasi.
              </p>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
