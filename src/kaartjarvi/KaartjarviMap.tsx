import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Home, 
  Flame, 
  FlameKindling, 
  Trees, 
  Lock, 
  Unlock, 
  Key, 
  Search, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Briefcase, 
  ArrowLeft, 
  Trophy, 
  Sparkles, 
  Info,
  HelpCircle,
  Hash,
  Compass
} from "lucide-react";
import { HUVILA_LOCATIONS, HuvilaLocation, HuvilaClue } from "./huvilaLocations";
import { HUVILA_PUZZLES, HuvilaPuzzle } from "./huvilaPuzzles";

// Kauniit ja tunnelmalliset Unsplash-lähikuvat löydetyille todisteille popup-ikkunaan
const getClueImage = (clueId: string) => {
  switch (clueId) {
    case "takkatuli":
      return "https://unsplash.com"; // Hehkuva hiillos
    case "lasi":
      return "https://unsplash.com"; // Särkynyt kristalli
    case "laudeliina":
      return "https://unsplash.com"; // Punertava tekstiili
    case "saunakiulu":
      return "https://unsplash.com"; // Kuparinkiulun vesiheijastukset
    case "kirje":
      return "https://unsplash.com"; // Uhkauskirjeen kulma tuhkassa
    case "jalanjaljet":
      return "https://unsplash.com"; // Mudanjäljet
    default:
      return "https://unsplash.com";
  }
};

const getItemIconBadge = (item: string) => {
  switch (item.toLowerCase()) {
    case "messinkiavain": return "🔑";
    case "sorkkarauta": return "⚒️";
    case "ranneketju": return "📿";
    case "perintosormus": return "💍";
    case "myrkkyrekisteri": return "🧪";
    default: return "📦";
  }
};

const getItemDisplayName = (item: string) => {
  switch (item.toLowerCase()) {
    case "messinkiavain": return "Messinkiavain";
    case "sorkkarauta": return "Raskas sorkkarauta";
    case "ranneketju": return "Marian hopeaketju";
    case "perintosormus": return "Mikaelin kultainen sinettisormus";
    case "myrkkyrekisteri": return "Kaliumsyanidi-pullo";
    default: return item;
  }
};

interface KaartjarviMapProps {
  onBackToLobby?: () => void;
  onExitGame?: () => void;
  playerName: string;
}

export default function KaartjarviMap({ onBackToLobby, onExitGame, playerName }: KaartjarviMapProps) {
  
  const handleExit = () => {
    if (onExitGame) onExitGame();
    else if (onBackToLobby) onBackToLobby();
  };

  // --- Pelitilat ---
  const [locations, setLocations] = useState<HuvilaLocation[]>(HUVILA_LOCATIONS);
  const [puzzles, setPuzzles] = useState<HuvilaPuzzle[]>(HUVILA_PUZZLES);
  const [inventory, setInventory] = useState<string[]>([]);
  const [activeLocId, setActiveLocId] = useState<string>("paahuvila");
  
  // Dialogi & todisteruutu
  const [clueOverlay, setClueOverlay] = useState<{
    id?: string;
    title: string;
    description: string;
    dialog: string;
    itemEarned?: string;
  } | null>(null);

  // Arvoituksen ratkaisutila
  const [solvingPuzzleId, setSolvingPuzzleId] = useState<string | null>(null);
  const [codeInputValue, setCodeInputValue] = useState<string>("");
  const [puzzleError, setPuzzleError] = useState<string>("");

  // Oikeuskäsittely & Syyte
  const [isAccusationMode, setIsAccusationMode] = useState<boolean>(false);
  const [selectedAccused, setSelectedAccused] = useState<string>("");
  const [endingResult, setEndingResult] = useState<{
    success: boolean;
    title: string;
    explanation: string;
    detectiveRank: string;
    score: number;
  } | null>(null);

  // Tutkintaloki
  const [atmosphericLogs, setAtmosphericLogs] = useState<string[]>([
    "Kaartjärven rannalla tuulee kovaa. Sade piiskaa huvilan mustia ikkunoita.",
    "Olet yksin kokeneena etsivänä. Sinun täytyy ratkaista, kuka myrkytti Mikaelin."
  ]);

  const logAtmosphere = (msg: string) => {
    setAtmosphericLogs(prev => [msg, ...prev.slice(0, 5)]);
  };

  const currentLoc = locations.find(l => l.id === activeLocId) || locations[0];
  const currentLoc = locations.find(l => l.id === activeLocId) || locations[0];

  const handleTravelTo = (locId: string) => {
    const loc = locations.find(l => l.id === locId);
    if (!loc) return;

    if (loc.isLocked) {
      if (loc.requiredItem && inventory.includes(loc.requiredItem)) {
        setLocations(prev => prev.map(l => l.id === locId ? { ...l, isLocked: false } : l));
        setActiveLocId(locId);
        logAtmosphere(`🔓 Avasit kohteen ${loc.name} repustasi löytyvällä esineellä: ${loc.requiredItem}!`);
        setClueOverlay({
          title: `Kohde ${loc.name} avattu!`,
          description: `Käytit esineen: ${loc.requiredItem}.`,
          dialog: `Lukkopesä naksahtaa vaivattomasti auki kuunvalossa. Astut sisään varovasti...`
        });
      } else {
        logAtmosphere(`🔒 ${loc.name} on lukittu. ${loc.unlockHint || "Tarvitset oikean esineen avataksesi oven."}`);
        setClueOverlay({
          title: "Kohde lukittu!",
          description: loc.unlockHint || "Ovi vaatii sopivan avaimen tai tarvikkeen.",
          dialog: "Yrität painaa oven kahvaa, mutta se ei hievahdakaan. Sinun täytyy etsiä jostain muualta sopivia esineitä tai ratkaista salaiset arvoitukset päästäksesi sisään."
        });
      }
    } else {
      setActiveLocId(locId);
      logAtmosphere(`👣 Siirryit kohteeseen: ${loc.name}.`);
    }
  };

  const handleInspectClue = (clue: HuvilaClue) => {
    setLocations(prev => prev.map(loc => {
      if (loc.id === activeLocId) {
        return {
          ...loc,
          clues: loc.clues.map(c => c.id === clue.id ? { ...c, discovered: true } : c)
        };
      }
      return loc;
    }));

    if (clue.itemReward && !inventory.includes(clue.itemReward)) {
      setInventory(prev => [...prev, clue.itemReward!]);
      logAtmosphere(`🎒 Lisätty reppuun: ${getItemDisplayName(clue.itemReward)}`);
    }

    setClueOverlay({
      id: clue.id,
      title: clue.name,
      description: clue.description,
      dialog: clue.dialogText || "Tutkit kohdetta tarkemmin ja huomaat jotakin epäilyttävää.",
      itemEarned: clue.itemReward
    });

    logAtmosphere(`🔍 Tutkit todistetta: ${clue.name}.`);
  };

  const handleOpenPuzzle = (puzzleId: string) => {
    const p = puzzles.find(x => x.id === puzzleId);
    if (!p) return;
    setSolvingPuzzleId(puzzleId);
    setCodeInputValue("");
    setPuzzleError("");
  };

  const handleClosePuzzle = () => {
    setSolvingPuzzleId(null);
  };

  const handleUseItemForPuzzle = (puzzle: HuvilaPuzzle, item: string) => {
    if (puzzle.requiredItem === item) {
      setPuzzles(prev => prev.map(p => p.id === puzzle.id ? { ...p, isSolved: true } : p));
      if (puzzle.rewardItem && !inventory.includes(puzzle.rewardItem)) {
        setInventory(prev => [...prev, puzzle.rewardItem]);
      }
      setSolvingPuzzleId(null);
      setClueOverlay({
        title: `Pähkinä ratkaistu: ${puzzle.title}`,
        description: puzzle.solveMessage,
        dialog: `Sait haltuusi esineen: ${puzzle.rewardItemName}! Tämä auttaa sinua pääsemään pidemmälle rikospaikalla.`
      });
      logAtmosphere(`🏆 Ratkaisit pulman "${puzzle.title}" käyttämällä esineen ${getItemDisplayName(item)}!`);
    } else {
      setPuzzleError("Kyseinen esine ei sovi tähän lukkoon tai ei tehoa siihen.");
    }
  };

  const handleSubmitCodePuzzle = (puzzle: HuvilaPuzzle) => {
    if (codeInputValue.trim() === puzzle.requiredCode) {
      setPuzzles(prev => prev.map(p => p.id === puzzle.id ? { ...p, isSolved: true } : p));
      if (puzzle.rewardItem && !inventory.includes(puzzle.rewardItem)) {
        setInventory(prev => [...prev, puzzle.rewardItem]);
      }
      setSolvingPuzzleId(null);
      setClueOverlay({
        title: `Pikakoodi oikein!`,
        description: puzzle.solveMessage,
        dialog: `Upeaa päättelykykyä! Sait haltuusi esineen: ${puzzle.rewardItemName}. Rikostutkintasi etenee huimasti.`
      });
      logAtmosphere(`🏆 Ratkaisit pulman "${puzzle.title}" koodilla ${codeInputValue}!`);
    } else {
      setPuzzleError("Väärä numerokoodi! Kokeile uudestaan tai tarkista sijaintien vihjeet ja huoneet.");
    }
  };

  const totalCluesCount = locations.reduce((sum, loc) => sum + loc.clues.length, 0);
  const foundCluesCount = locations.reduce((sum, loc) => 
    sum + loc.clues.filter(c => c.discovered).length, 0
  );
  const solvedPuzzlesCount = puzzles.filter(p => p.isSolved).length;

  const handleAccuse = (accusedId: string) => {
    setSelectedAccused(accusedId);
    let success = false;
    let title = "";
    let explanation = "";
    let detectiveRank = "Aloitteleva etsivä";
    let score = Math.round(((foundCluesCount + (solvedPuzzlesCount * 2)) / (totalCluesCount + 4)) * 100);

    if (accusedId === "maria") {
      success = true;
      title = "Paljastus rantasaunalla: Maria murtuu kyyneleihin!";
      explanation = `Tarkat etsiväsi loivat kiistattoman todistusketjun! Etsivä ${playerName || "Salapoliisi"}, olet täydellinen mestari. Viskilasin karvasmantelin haju paljasti syanidimyrkytyksen. Rantasaunan kuparikiulusta löytyi hopeaketju, jossa oli nimikirjaimet 'M.K.' (Maria Koskela). Kun löysit herra Mikaelin salaisen perintösormuksen grillikodassa sijainneesta rauta-arkusta sorkkarautaasi käyttäen, kävi ilmi Marian motiivi: hän halusi Kaartjärven tilukset itselleen estääkseen Mikaelia myymästä niitä ulkomaisille gryndereille. Maria tunnustaa murtuen paineen alla ja suurselvitys rannalla päättyy poliisin saapuessa!`;
      
      if (score >= 90) {
        detectiveRank = "Mestarietsivä (100% Ratkaissut)";
      } else if (score >= 60) {
        detectiveRank = "Kokenut tutkija";
      } else {
        detectiveRank = "Sinnikäs poliisipäällikkö";
      }
    } else if (accusedId === "ville") {
      title = "Huti! Villellä on täydellinen pankkialibi";
      explanation = "Syyte epäonnistui! Ville oli syyllistynyt talousrikoksiin, ja tähän sorkkarauta ja tuhkakirje viittasivatkin, mutta hänellä oli aukoton puhelin-alibi Helsinkiin koko murhayölle. Maria Koskela pääsee pakenemaan paikalta aamun ensisäteillä mukanansa Kaartjärven perintörahat.";
    } else {
      title = "Huti! Heikki vain tarkkaili tilannetta";
      explanation = "Syyte epäonnistui! Naapuri Heikki oli hiippaillut rannassa ja jättänyt suuret kurajäljet puuvarastoon, mutta hän oli vain kiinnostunut ostamaan Lopen kylätontit rehellisesti. Hänellä ei ollut mitään tekemistä Mikaelin myrkyltä tuoksuvan viskilasin kanssa.";
    }

    setEndingResult({ success, title, explanation, detectiveRank, score });
  };

  const handleRestartAdventure = () => {
    setLocations(HUVILA_LOCATIONS.map(l => ({ ...l, isLocked: l.id === "hirsirantasauna", clues: l.clues.map(c => ({ ...c, discovered: false })) })));
    setPuzzles(HUVILA_PUZZLES.map(p => ({ ...p, isSolved: false })));
    setInventory([]);
    setActiveLocId("paahuvila");
    setClueOverlay(null);
    setSolvingPuzzleId(null);
    setIsAccusationMode(false);
    setSelectedAccused("");
    setEndingResult(null);
    logAtmosphere("Aloitit uuden rikospaikkatutkinnan Lopen Kaartjärvellä.");
  };

  const getIcon = (name: string) => {
    switch (name) {
      case "Home": return <Home style={{ width: '20px', height: '20px', color: '#fbbf24' }} />;
      case "Flame": return <Flame style={{ width: '20px', height: '20px', color: '#818cf8' }} />;
      case "FlameKindling": return <FlameKindling style={{ width: '20px', height: '20px', color: '#f87171' }} />;
      case "Trees": return <Trees style={{ width: '20px', height: '20px', color: '#34d399' }} />;
      default: return <Compass style={{ width: '20px', height: '20px', color: '#60a5fa' }} />;
    }
  };

  // --- Puhtaat Inline-kauneustyylit helpolle integraatiolle ilman Tailwind riippuvuuksia ---
  const containerStyle: React.CSSProperties = {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '24px 16px',
    color: '#f1f5f9',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    background: '#090d16',
    minHeight: '100vh',
    boxSizing: 'border-box'
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '24px',
    background: 'rgba(15, 23, 42, 0.75)',
    padding: '20px',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(8px)',
    flexWrap: 'wrap'
  };

  const badgeStyle: React.CSSProperties = {
    padding: '4px 8px',
    backgroundColor: 'rgba(52, 211, 153, 0.15)',
    border: '1px solid rgba(52, 211, 153, 0.3)',
    color: '#34d399',
    fontSize: '10px',
    fontWeight: 'bold',
    borderRadius: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  };

  const codeBadgeStyle: React.CSSProperties = {
    fontSize: '10px',
    color: '#818cf8',
    fontFamily: 'monospace',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginLeft: '8px'
  };
  const titleStyle: React.CSSProperties = {
    fontSize: '28px',
    fontWeight: 900,
    margin: 0,
    color: '#ffffff',
    letterSpacing: '-0.02em',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const exitButtonStyle: React.CSSProperties = {
    padding: '10px 16px',
    backgroundColor: '#1e293b',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#cbd5e1',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s ease-in-out'
  };

  const responsiveGrid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: typeof window !== 'undefined' && window.innerWidth > 768 ? '1.25fr 1fr' : '1fr',
    gap: '20px',
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: '#0f172a',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
    marginBottom: '20px',
    position: 'relative'
  };

  const locationImageWrapper: React.CSSProperties = {
    width: '100%',
    height: '220px',
    borderRadius: '12px',
    overflow: 'hidden',
    marginBottom: '16px',
    position: 'relative',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  };

  const locationImageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  };

  const imageOvertextOverlay: React.CSSProperties = {
    position: 'absolute',
    bottom: '12px',
    left: '12px',
    backgroundColor: 'rgba(2, 6, 17, 0.85)',
    color: '#fbbf24',
    fontFamily: 'monospace',
    fontSize: '9px',
    fontWeight: 'bold',
    padding: '4px 8px',
    borderRadius: '6px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  };

  const subHeaderStyle: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#e2e8f0',
    letterSpacing: '0.05em',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  };

  const interactiveListStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '20px'
  };

  const clueItemStyle = (discovered: boolean): React.CSSProperties => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    backgroundColor: discovered ? 'rgba(30, 41, 59, 0.6)' : '#1e293b',
    border: discovered ? '1px dashed rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  });

  const travelGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px'
  };

  const mapItemStyle = (active: boolean, locked: boolean): React.CSSProperties => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '14px',
    backgroundColor: active ? 'rgba(99, 102, 241, 0.15)' : '#1a2236',
    border: active ? '2.5px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '12px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s ease',
    opacity: locked ? 0.75 : 1
  });

  const sidebarLogContainer: React.CSSProperties = {
    padding: '12px',
    backgroundColor: '#020617',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '10px',
    fontSize: '11px',
    fontFamily: 'monospace',
    color: '#a1a1aa',
    height: '110px',
    overflowY: 'auto',
    lineHeight: '1.5',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  };

  const inventoryGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
    gap: '8px'
  };

  const inventoryItemStyle: React.CSSProperties = {
    padding: '8px 12px',
    backgroundColor: '#121b2e',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#cbd5e1',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  };

  const overlayBackdrop: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(2, 6, 17, 0.9)',
    zIndex: 999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    backdropFilter: 'blur(4px)',
    boxSizing: 'border-box'
  };

  const popupBoxStyle: React.CSSProperties = {
    backgroundColor: '#0f172a',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '24px',
    borderRadius: '16px',
    maxWidth: '420px',
    width: '100%',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    boxSizing: 'border-box',
    position: 'relative'
  };

  const progressBarStyle: React.CSSProperties = {
    height: '6px',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: '10px',
    width: '100%',
    overflow: 'hidden',
    margin: '10px 0'
  };

  const statsBadgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 10px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#cbd5e1'
  };

  if (!currentLoc || typeof currentLoc.clues === 'undefined') return null;

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={badgeStyle}>Yksinpeliseikkailu</span>
            <span style={{ fontSize: '10px', color: '#475569' }}>•</span>
            <span style={codeBadgeStyle}>Lopen Kaartjärvi</span>
          </div>
          <h1 style={titleStyle}>Huvilan Varjot</h1>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '6px 0 0 0' }}>
            Etsivä <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>{playerName || "Salapoliisi"}</span>, ratkaise murha!
          </p>
        </div>
        <button onClick={handleExit} style={exitButtonStyle}>
          <ArrowLeft style={{ width: '14px', height: '14px' }} />
          Lopeta peli
        </button>
      </div>

      <div style={{ ...cardStyle, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ flex: '1 1 250px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 'bold', color: '#cbd5e1' }}>
            <span>Etsivän edistyminen</span>
            <span>{foundCluesCount} / {totalCluesCount} Löydetty</span>
          </div>
          <div style={progressBarStyle}>
            <div style={{ height: '100%', backgroundColor: '#10b981', width: `${totalCluesCount ? (foundCluesCount / totalCluesCount) * 100 : 0}%`, transition: 'width 0.4s' }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={statsBadgeStyle}><Search style={{ width: '13px', height: '13px' }} /> {foundCluesCount}/{totalCluesCount}</div>
          <div style={statsBadgeStyle}><Trophy style={{ width: '13px', height: '13px' }} /> {solvedPuzzlesCount}/4</div>
          <button onClick={() => setIsAccusationMode(true)} style={{ padding: '6px 14px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>Haasta Syyllinen</button>
        </div>
      </div>
      <div style={responsiveGrid}>
        <div>
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              {getIcon(currentLoc.iconName)}
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>{currentLoc.name}</h2>
            </div>
            <div style={locationImageWrapper}>
              <img src={currentLoc.imageUrl} alt={currentLoc.name} style={locationImageStyle} referrerPolicy="no-referrer" />
              <span style={imageOvertextOverlay}><span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#fbbf24' }} />Ulkokamera</span>
            </div>
            <p style={{ fontSize: '13px', color: '#cbd5e1', fontStyle: 'italic', borderLeft: '2px solid #fbbf24', paddingLeft: '12px' }}>"{currentLoc.longDescription}"</p>
            
            <h3 style={subHeaderStyle}><Search style={{ width: '14px', height: '14px' }} />Tutki kohteita</h3>
            <div style={interactiveListStyle}>
              {currentLoc.clues.map((clue) => (
                <div key={clue.id} onClick={() => handleInspectClue(clue)} style={clueItemStyle(clue.discovered)}>
                  <span style={{ fontSize: '13px', fontWeight: 'bold' }}>{clue.name}</span>
                  <span>{clue.discovered ? "✅" : "🔍"}</span>
                </div>
              ))}
            </div>

            {currentLoc.puzzles.length > 0 && (
              <div>
                <h3 style={subHeaderStyle}><HelpCircle style={{ width: '14px', height: '14px' }} />Alueen arvoitukset</h3>
                {currentLoc.puzzles.map(puzId => {
                  const puz = puzzles.find(p => p.id === puzId);
                  if (!puz) return null;
                  return (
                    <div key={puz.id} onClick={() => !puz.isSolved && handleOpenPuzzle(puz.id)} style={{ padding: '12px', backgroundColor: '#1e293b', borderRadius: '8px', marginBottom: '6px', cursor: puz.isSolved ? 'default' : 'pointer' }}>
                      <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{puz.title} {puz.isSolved ? "✅" : "🧩"}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={cardStyle}>
            <h3 style={subHeaderStyle}><Compass style={{ width: '14px', height: '14px' }} />Tonttikartta</h3>
            <div style={travelGridStyle}>
              {locations.map((loc) => (
                <button key={loc.id} onClick={() => handleTravelTo(loc.id)} style={mapItemStyle(loc.id === activeLocId, loc.isLocked)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    {getIcon(loc.iconName)}
                    {loc.isLocked ? <Lock style={{ width: '12px' }} /> : <Unlock style={{ width: '12px' }} />}
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', marginTop: '4px' }}>{loc.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={cardStyle}>
            <h3 style={subHeaderStyle}><Briefcase style={{ width: '14px', height: '14px' }} />Reppu</h3>
            {inventory.length === 0 ? <p style={{ fontSize: '11px', color: '#64748b' }}>Reppu on tyhjä.</p> : 
              <div style={inventoryGridStyle}>
                {inventory.map((item, idx) => <div key={idx} style={inventoryItemStyle}>{getItemIconBadge(item)} {getItemDisplayName(item)}</div>)}
              </div>
            }
          </div>

          <div style={cardStyle}>
            <h3 style={subHeaderStyle}><Info style={{ width: '14px', height: '14px' }} />Tutkinnan loki</h3>
            <div style={sidebarLogContainer}>
              {atmosphericLogs.map((log, index) => <div key={index} style={{ color: index === 0 ? '#fbbf24' : '#8e9aa8' }}>{log}</div>)}
            </div>
          </div>
        </div>
      </div>
      {/* CLUE POPUP */}
      <AnimatePresence>
        {clueOverlay && (
          <div style={overlayBackdrop}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} style={popupBoxStyle}>
              <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 10px 0' }}><Sparkles style={{ width: '14px', height: '14px' }} /> Löydetty todiste</h3>
              {clueOverlay.id && (
                <div style={{ width: '100%', height: '120px', borderRadius: '8px', overflow: 'hidden', marginBottom: '10px' }}>
                  <img src={getClueImage(clueOverlay.id)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} referrerPolicy="no-referrer" />
                </div>
              )}
              <p style={{ fontSize: '12px', fontStyle: 'italic' }}>"{clueOverlay.description}"</p>
              <p style={{ fontSize: '13px' }}>{clueOverlay.dialog}</p>
              <button onClick={() => setClueOverlay(null)} style={{ width: '100%', padding: '8px', backgroundColor: '#6366f1', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Jatka tutkimusta</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PUZZLE POPUP */}
      <AnimatePresence>
        {solvingPuzzleId && (() => {
          const puz = puzzles.find(p => p.id === solvingPuzzleId);
          if (!puz) return null;
          return (
            <div style={overlayBackdrop}>
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} style={popupBoxStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: 'bold' }}>Arvoitus: {puz.title}</h3>
                  <button onClick={handleClosePuzzle} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}>X</button>
                </div>
                <p style={{ fontSize: '12px' }}>{puz.description}</p>
                <p style={{ fontSize: '11px', color: '#fbbf24' }}>Vihje: {puz.hint}</p>
                {puz.type === "code" ? (
                  <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                    <input type="text" value={codeInputValue} onChange={(e) => setCodeInputValue(e.target.value)} placeholder="Koodi" style={{ flex: 1, padding: '6px', background: '#020617', border: '1px solid #334155', color: '#fff', borderRadius: '6px', textAlign: 'center' }} />
                    <button onClick={() => handleSubmitCodePuzzle(puz)} style={{ padding: '6px 12px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Syötä</button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '10px' }}>
                    {inventory.map((item, idx) => (
                      <button key={idx} onClick={() => handleUseItemForPuzzle(puz, item)} style={{ padding: '8px', background: '#020617', border: '1px solid #334155', color: '#fff', borderRadius: '6px', cursor: 'pointer', textAlign: 'left' }}>
                        {getItemIconBadge(item)} Käytä: {getItemDisplayName(item)}
                      </button>
                    ))}
                  </div>
                )}
                {puzzleError && <p style={{ color: '#f87171', fontSize: '11px', marginTop: '6px' }}>{puzzleError}</p>}
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* ACCUSATION MODAL */}
      <AnimatePresence>
        {isAccusationMode && !endingResult && (
          <div style={overlayBackdrop}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} style={popupBoxStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold' }}>Valitse syyllinen!</h3>
                <button onClick={() => setIsAccusationMode(false)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>X</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { id: "maria", name: "Maria Koskela", desc: "Mikaelin serkku. Rantasaunan hopeaketju." },
                  { id: "ville", name: "Ville Lindström", desc: "Veljenpoika. Grillikodan kiristyskirje." },
                  { id: "heikki", name: "Heikki Nieminen", desc: "Sijoittajanaapuri. Puuvaraston jalanjäljet." }
                ].map(sus => (
                  <div key={sus.id} style={{ padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{sus.name}</div>
                      <div style={{ fontSize: '10px', color: '#64748b' }}>{sus.desc}</div>
                    </div>
                    <button onClick={() => handleAccuse(sus.id)} style={{ padding: '4px 10px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}>Syyte</button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ENDING MODAL */}
      <AnimatePresence>
        {endingResult && (
          <div style={overlayBackdrop}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} style={{ ...popupBoxStyle, border: endingResult.success ? '2px solid #10b981' : '2px solid #ef4444' }}>
              <div style={{ textAlign: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '32px' }}>{endingResult.success ? "🏆" : "🚨"}</span>
                <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: '6px 0' }}>{endingResult.title}</h2>
                <div style={{ fontSize: '11px', color: '#fbbf24' }}>{endingResult.detectiveRank} (Pisteet: {endingResult.score}%)</div>
              </div>
              <p style={{ fontSize: '12px', lineHeight: '1.5', backgroundColor: '#020617', padding: '10px', borderRadius: '8px' }}>{endingResult.explanation}</p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                <button onClick={handleRestartAdventure} style={{ flex: 1, padding: '10px', background: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Yritä uudelleen</button>
                <button onClick={handleExit} style={{ flex: 1, padding: '10px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Päävalikkoon</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
