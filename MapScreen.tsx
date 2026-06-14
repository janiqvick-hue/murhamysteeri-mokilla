import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion"; // KORJATTU: Standardi framer-motion
import { LOCATIONS } from "../utils/locations";
import { BASE_CLUES } from "../utils/clues"; // KORJATTU: Oikea vihjemuuttuja
import { SCENARIO_MAP } from "../utils/scenarios"; // KORJATTU: Oikea skenaariomappi
import { db } from "../firebase";
import { ref, update, onValue, set } from "firebase/database";
import WitnessBanner from "./map/WitnessBanner";
import SabotageModal from "./map/SabotageModal";
import {
  Compass, MapPin, Eye, BookOpen, Clock, Skull, Search, Lock, Unlock, HelpCircle, AlertTriangle, Play, ChevronRight, CheckCircle2, User, Volume2, ShieldAlert
} from "lucide-react";

interface MapScreenProps {
  playerId: string;
  gameCode: string;
  isSoloMode: boolean;
  lobbyData: any;
  onNextStage: (resultsData?: any) => void;
}

export default function MapScreen({
  playerId,
  gameCode,
  isSoloMode,
  lobbyData,
  onNextStage
}: MapScreenProps) {
  const [activeLocationId, setActiveLocationId] = useState("paamokki");
  const [searching, setSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [foundClues, setFoundClues] = useState<string[]>([]);
  const [roomPlayers, setRoomPlayers] = useState<any[]>([]);
  const [sabotageOpen, setSabotageOpen] = useState(false);
  const [sabotagedClues, setSabotagedClues] = useState<Record<string, any>>({});
  const [notifications, setNotifications] = useState<any[]>([]);
  const [selectedClueForDetail, setSelectedClueForDetail] = useState<any | null>(null);
  const [showRoleBrief, setShowRoleBrief] = useState(true);
  
  // Timer: 180 seconds default (3 minutes)
  const [timeLeft, setTimeLeft] = useState(180);

  const scenario = lobbyData.scenarioId ? SCENARIO_MAP[lobbyData.scenarioId as keyof typeof SCENARIO_MAP] : null;
  const myPlayer = lobbyData.players[playerId];
  const myRole = myPlayer?.role || "vieras";
  const isHost = myPlayer?.isHost;

  // Active Location object
  const activeLocation = LOCATIONS.find(l => l.id === activeLocationId) || LOCATIONS[0];

  // 1. Firebase Listeners (for multiplayer)
  useEffect(() => {
    if (isSoloMode || !gameCode) return;

    // Listen to players state to map current locations
    const playersRef = ref(db, `rooms/${gameCode}/players`);
    const unsubPlayers = onValue(playersRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        setRoomPlayers(Object.values(val));
      }
    });

    // Listen to sabotaged secrets
    const sabotageRef = ref(db, `rooms/${gameCode}/sabotagedClues`);
    const unsubSabotage = onValue(sabotageRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        setSabotagedClues(val);
      } else {
        setSabotagedClues({});
      }
    });

    // Listen to notifications / witness logs
    const notifRef = ref(db, `rooms/${gameCode}/notifications`);
    const unsubNotif = onValue(notifRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        const list = Object.entries(val).map(([k, v]: [string, any]) => ({
          id: k,
          ...v
        }));
        setNotifications(list);
      }
    });

    // Listen to stage updates (if host triggers voting, other clients will transition)
    const statusRef = ref(db, `rooms/${gameCode}/status`);
    const unsubStatus = onValue(statusRef, (snapshot) => {
      const statusValue = snapshot.val();
      if (statusValue === "voting") {
        onNextStage();
      }
    });

    return () => {
      unsubPlayers();
      unsubSabotage();
      unsubNotif();
      unsubStatus();
    };
  }, [isSoloMode, gameCode, onNextStage]);

  // 2. Solo Simulation Timer & AI moves
  useEffect(() => {
    if (!isSoloMode) return;

    // Fill simulated players initial locations
    const initialSims = Object.values(lobbyData.players).map((p: any) => ({
      ...p,
      activeLocationId: p.activeLocationId || LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)].id
    }));
    setRoomPlayers(initialSims);

    // Initial hint for investigator
    if (myRole === "tutkija") {
      const tutorClue = BASE_CLUES.find(c => c.locationId === "paamokki");
      if (tutorClue) {
        setFoundClues([tutorClue.id]);
      }
    }
  }, [isSoloMode, myRole, lobbyData.players]);

  // Handle countdown Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      handleProceedToVoting();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
      // AI simulation movements & discoveries (every 12 seconds)
      if (isSoloMode && Math.random() < 0.15) {
        simulateAIMovement();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isSoloMode]);

  // Helper: AI Simulation Movements
  const simulateAIMovement = () => {
    setRoomPlayers(prev => {
      const next = [...prev];
      // Pick random simulated AI player
      const aiPlayers = next.filter(p => p.isAI);
      if (aiPlayers.length === 0) return prev;
      const targetAI = aiPlayers[Math.floor(Math.random() * aiPlayers.length)];
      
      const newLoc = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
      targetAI.activeLocationId = newLoc.id;

      // Maybe they found a clue!
      const possibleClues = BASE_CLUES.filter(c => c.locationId === newLoc.id && !foundClues.includes(c.id));
      const textType = Math.random() < 0.4 ? "discovery" : "movement";

      let text = `${targetAI.name} siirtyi alueelle ${newLoc.name}.`;
      if (textType === "discovery" && possibleClues.length > 0) {
        const found = possibleClues[Math.floor(Math.random() * possibleClues.length)];
        text = `${targetAI.name} löysi esineen "${found.name}" alueelta ${newLoc.name}.`;
        
        // Give AI more items
        targetAI.cluesFoundCount = (targetAI.cluesFoundCount || 0) + 1;
      }

      // Add a simulated log
      const newNotif = {
        id: Math.random().toString(),
        text,
        type: textType,
        timestamp: Date.now()
      };
      setNotifications(old => [newNotif, ...old]);

      return next;
    });
  };

  // Move our actual player to selected room
  const handleMoveToLocation = async (locId: string) => {
    setActiveLocationId(locId);

    const logText = `${myPlayer?.name || "Etsivä"} siirtyi alueelle ${LOCATIONS.find(l => l.id === locId)?.name}.`;

    if (isSoloMode) {
      setRoomPlayers(prev => prev.map(p => p.id === playerId ? { ...p, activeLocationId: locId } : p));
      setNotifications(old => [{
        id: Math.random().toString(),
        text: logText,
        type: "movement",
        timestamp: Date.now()
      }, ...old]);
    } else {
      // Sync DB
      try {
        const { push } = await import("firebase/database"); // KORJATTU: dynaaminen push-tuki varmistukseksi
        await update(ref(db, `rooms/${gameCode}/players/${playerId}`), {
          activeLocationId: locId
        });
        const notifRef = ref(db, `rooms/${gameCode}/notifications`);
        await push(notifRef, {
          text: logText,
          type: "movement",
          timestamp: Date.now()
         });
      } catch (err) {
        console.error("Virhe synkronoitaessa sijaintia:", err);
      }
    }
  };
  // Searching action simulation
  const handleSearchClues = () => {
    if (searching) return;
    setSearching(true);
    setSearchProgress(0);

    const interval = setInterval(() => {
      setSearchProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          finishSearch();
          return 100;
        }
        return prev + 10;
      });
    }, 250);
  };

  const finishSearch = async () => {
    setSearching(false);

    // Pick clues corresponding to active room
    const roomClues = BASE_CLUES.filter(c => c.locationId === activeLocationId);
    
    // Filter out already discovered
    const undiscovered = roomClues.filter(c => !foundClues.includes(c.id));

    if (undiscovered.length > 0) {
      const selected = undiscovered[Math.floor(Math.random() * undiscovered.length)];
      const updatedList = [...foundClues, selected.id];
      setFoundClues(updatedList);
      setSelectedClueForDetail(selected);

      // Increment counters
      if (isSoloMode) {
        setRoomPlayers(prev => prev.map(p => p.id === playerId ? { ...p, cluesFoundCount: (p.cluesFoundCount || 0) + 1 } : p));
        setNotifications(old => [{
          id: Math.random().toString(),
          text: `${myPlayer?.name} löysi esineen "${selected.name}" kohteesta ${activeLocation.name}.`,
          type: "discovery",
          timestamp: Date.now()
        }, ...old]);
      } else {
        try {
          const { push } = await import("firebase/database");
          // Increment cluesCount
          const currentCount = myPlayer?.cluesFoundCount || 0;
          await update(ref(db, `rooms/${gameCode}/players/${playerId}`), {
            cluesFoundCount: currentCount + 1
          });

          // Add public log
          const notifRef = ref(db, `rooms/${gameCode}/notifications`);
          await push(notifRef, {
            text: `${myPlayer?.name} löysi esineen "${selected.name}" kohteesta ${activeLocation.name}.`,
            type: "discovery",
            timestamp: Date.now()
          });
        } catch (err) {
          console.warn("DB write failed", err);
        }
      }
    }
  };
  // Syyllinen saves a sabotage
  const handleSaveSabotage = async (clueId: string, fakeName: string, fakeText: string) => {
    if (isSoloMode) {
      setSabotagedClues(prev => ({
        ...prev,
        [clueId]: { fakeName, fakeText, authorId: playerId }
      }));
      setNotifications(old => [{
        id: Math.random().toString(),
        text: "Korkeajännitteinen vilkunta sähkötaulussa... Myrsky yltyy.",
        type: "sabotage",
        timestamp: Date.now()
      }, ...old]);
      setRoomPlayers(prev => prev.map(p => p.id === playerId ? { ...p, sabotagesAttempted: (p.sabotagesAttempted || 0) + 1 } : p));
    } else {
      try {
        const { push } = await import("firebase/database");
        await update(ref(db, `rooms/${gameCode}/sabotagedClues/${clueId}`), {
          fakeName,
          fakeText,
          authorId: playerId
        });

        // Also update player count
        const currentCount = myPlayer?.sabotagesAttempted || 0;
        await update(ref(db, `rooms/${gameCode}/players/${playerId}`), {
          sabotagesAttempted: currentCount + 1
        });

        const notifRef = ref(db, `rooms/${gameCode}/notifications`);
        await push(notifRef, {
          text: "Ulkona välähtää salama... Valot räpsähtävät sekunniksi.",
          type: "sabotage",
          timestamp: Date.now()
        });
      } catch (err) {
        console.warn("Sabotaasin tallennus epäonnistui:", err);
      }
    }
  };
  // Moving game state to manual voting
  const handleProceedToVoting = async () => {
    if (isSoloMode) {
      onNextStage({
        players: roomPlayers,
        foundClues,
        sabotagedClues
      });
    } else {
      if (isHost) {
        try {
          await update(ref(db, `rooms/${gameCode}`), {
            status: "voting",
            stageStartTime: Date.now()
          });
        } catch (err) {
          console.warn("Virhe äänestykseen siirryttäessä:", err);
        }
      }
    }
  };

  // Format countdown clock
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <div className="flex flex-col min-h-[85vh] w-full max-w-lg mx-auto px-1 py-4">
      {/* Investigation Bar Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-4 flex justify-between items-center shadow-md">
        <div>
          <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest leading-none mb-1">
            ETSI VIHJEITÄ MÖKILTÄ
          </p>
        <h2 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-slate-400" />
            Mökkialueet & Todisteet
          </h2>
        </div>

        {/* Timer UI */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-red-400 font-mono font-bold text-xs shadow-inner">
          <Clock className="w-3.5 h-3.5" />
          <span>{formattedTime}</span>
        </div>
      </div>

      {/* Collapsible Role Story Brief banner */}
      {scenario && (
        <div className="bg-slate-900/90 border border-slate-850 rounded-xl mb-4 overflow-hidden">
          <button
            onClick={() => setShowRoleBrief(!showRoleBrief)}
            className="w-full px-4 py-2.5 flex justify-between items-center text-left text-xs font-bold text-slate-300 hover:bg-slate-800/50 transition-colors uppercase tracking-wider cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>Oma tehtäväksesianto & Tarina</span>
            </div>
            <span className="text-[10px] text-slate-500">
              {showRoleBrief ? "Piilota ▲" : "Näytä ▼"}
            </span>
          </button>
          
          <AnimatePresence initial={false}>
            {showRoleBrief && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="px-4 pb-3 pt-1 border-t border-slate-800"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400">
                      Skenaario: <span className="text-red-400">{scenario.name}</span>
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      Uhri: <span className="text-slate-200">{scenario.victim}</span>
                    </span>
                  </div>
                  
                  <p className="text-xs text-slate-300 leading-relaxed italic border-l-2 border-red-500/40 pl-2">
                    {myRole === "syyllinen" 
                      ? (scenario.syyllinenText || scenario.setting) 
                      : (scenario.normalText || scenario.setting)}
                  </p>
                  
                  {myRole === "salaisuuden_vartija" && (
                    <div className="text-[11px] text-purple-400 font-semibold bg-purple-950/20 border border-purple-500/20 p-2 rounded">
                      🛡️ Salaisuuden vartija: Muista suojella vanhoja todisteita ja sumentaa muiden tutkintaa!
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Witness Log Banner */}
      <WitnessBanner notifications={notifications} />

      {/* Primary content layout split in areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {/* Left pane: Area selection cards */}
        <div className="bg-slate-900/45 border border-slate-800/80 rounded-2xl p-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            Valitse tutkimusalue ({LOCATIONS.length})
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {LOCATIONS.map((loc) => {
              const isActive = loc.id === activeLocationId;
              const countOfPeople = roomPlayers.filter(p => p.activeLocationId === loc.id).length;
        {/* Right pane / Bottom pane: Selected Area actions */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-red-400 mb-2">
              <MapPin className="w-5 h-5" />
              <h3 className="text-lg font-extrabold text-slate-100">
                {activeLocation.name}
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {activeLocation.description}
            </p>

            {/* Players in this room listing */}
            <div className="mb-4">
              <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Pelaajat tässä huoneessa:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {roomPlayers.filter(p => p.activeLocationId === activeLocationId).map(p => (
                  <span
                    key={p.id}
                    className={`text-[10px] px-2.5 py-1 rounded-full border flex items-center gap-1 font-medium ${
                      p.id === playerId
                        ? "bg-red-950/30 border-red-900/60 text-red-300"
                        : "bg-slate-950 border-slate-800 text-slate-400"
                    }`}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    {p.name}
                  </span>
                ))}
                {roomPlayers.filter(p => p.activeLocationId === activeLocationId).length === 0 && (
                  <span className="text-xs text-slate-500 italic">Huoneessa ei ole ketään muuta.</span>
                )}
              </div>
            </div>
          </div>

          {/* Action triggers inside specific room */}
          <div className="space-y-3">
            <button
              onClick={handleSearchClues}
              disabled={searching}
              className="w-full py-3 bg-red-800 hover:bg-red-700 disabled:bg-slate-800 text-slate-100 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-red-950/25"
            >
              {searching ? (
                <>
<div className="w-4 h-4 rounded-full border-2 border-slate-300 border-t-red-400 animate-spin" />
                  Etsitään ({searchProgress}%)
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Tutki paikkaa vihjeiden varalta
                </>
              )}
            </button>

            {searching && (
              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                <motion.div
                  className="bg-red-500 h-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${searchProgress}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Journal and Syyllisen Panel Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-5 flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            Löydetyt vihjeet ja muistiinpanot ({foundClues.length})
          </h3>

          {/* Exclusive button for Syyllinen role */}
          {myRole === "syyllinen" && (
            <button
              onClick={() => setSabotageOpen(true)}
              className="px-3 py-1.5 bg-purple-950 border border-purple-500/40 hover:bg-purple-900 rounded-xl text-purple-300 text-xs font-bold flex items-center gap-1.5 shadow-lg cursor-pointer transition-colors"
            >
              <ShieldAlert className="w-4.5 h-4.5 text-red-400 animate-bounce" />
              Sabotoi todiste
            </button>
          )}
        </div>

        <div className="space-y-2 overflow-y-auto max-h-[170px] pr-1 scrollbar-thin">
          {foundClues.map((clueId) => {
            const originalClue = BASE_CLUES.find(c => c.id === clueId);
            if (!originalClue) return null;
            // Check if this clue has been sabotaged/falsified
            const sabotage = sabotagedClues[clueId];
            const isSabotaged = !!sabotage;
            
            // Apply scenario override if not sabotaged
            const override = scenario?.clueOverrides?.[clueId];
            const shownName = isSabotaged 
              ? sabotage.fakeName 
              : (override?.name || originalClue.name);

            return (
              <button
                key={clueId}
                onClick={() => setSelectedClueForDetail(originalClue)}
                className="w-full p-3 rounded-xl border text-left flex justify-between items-center bg-slate-950 hover:bg-slate-900 border-slate-850 cursor-pointer"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    {shownName}
                    {isSabotaged && myRole === "syyllinen" && (
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 bg-red-950 text-red-400 rounded border border-red-900/60 uppercase">
                        SABOTOITU
                      </span>
                    )}
                  </h4>
                  <span className="text-[10px] text-slate-500">
                    Sijainti: {LOCATIONS.find(l => l.id === originalClue.locationId)?.name}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </button>
            );
          })}
          {foundClues.length === 0 && (
            <div className="text-center py-6 border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
              Mökkiä ei ole vielä tutkittu kävellen. Kulje huoneissa ja etsi esineitä etsivän puhelimeen!
            </div>
          )}
        </div>
      </div>

      {/* Manual progression trigger (for developer/host quick control) */}
      {(isSoloMode || isHost) && (
        <button
          onClick={handleProceedToVoting}
          className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/80 rounded-xl font-bold text-xs flex items-center justify-center gap-2 tracking-wide cursor-pointer text-center"
        >
          <Play className="w-3.5 h-3.5" />
          Keskeytä ja siirry loppuäänestykseen
        </button>
      )}

      {/* Clue DETAIL Dynamic Overlay Dialog */}
      <AnimatePresence>
        {selectedClueForDetail && (() => {
          const clueId = selectedClueForDetail.id;
          const sabotage = sabotagedClues[clueId];
          const isSabotaged = !!sabotage;
          
          // Apply scenario override if not sabotaged
          const override = scenario?.clueOverrides?.[clueId];
          const shownName = isSabotaged ? sabotage.fakeName : (override?.name || selectedClueForDetail.name);
          
          // KORJATTU: Käytetään normalText-kenttää descriptionin sijasta
          const shownText = isSabotaged ? sabotage.fakeText : (myRole === "syyllinen" ? originalClueText?.syyllinenText : selectedClueForDetail.normalText);

          // Get role-specific helpful insights defined in scenario.clueOverrides
          const roleOverrideText = !isSabotaged
            ? (myRole === "syyllinen" ? override?.syyllinenText : override?.normalText)
            : null;

          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
              onClick={() => setSelectedClueForDetail(null)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 10 }}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative overflow-hidden"
                onClick={e => e.stopPropagation()} // Stop bubbling
              >
                {/* Upper line accent matching location */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-red-800" />

                <h3 className="text-lg font-extrabold text-slate-100 mb-2 truncate">
                  {shownName}
                </h3>
                <span className="inline-block text-[10px] px-2.5 py-0.5 bg-slate-950 border border-slate-800 font-bold text-red-400 uppercase tracking-widest rounded mb-4">
                  Sijainti: {LOCATIONS.find(l => l.id === selectedClueForDetail.locationId)?.name}
                </span>
                <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl mb-4 shadow-inner">
                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    "{shownText}"
                  </p>
                </div>

                {roleOverrideText && (
                  <div className="p-3 bg-indigo-950/30 border border-indigo-500/20 rounded-xl mb-4">
                    <p className="text-[10px] text-indigo-400 font-semibold leading-normal">
                      💡 {myRole === "syyllinen" ? "Syyllisen ohje" : "Erityishavainto"}: {roleOverrideText}
                    </p>
                  </div>
                )}

                {isSabotaged && myRole === "syyllinen" && (
                  <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-xl mb-4">
                    <p className="text-[10px] text-red-400 font-semibold leading-normal">
                      ⚠️ AI-muistutus: Olet väärentänyt tämän vihjeen! Muut pelaajat lukevat oheisen valheellisen merkinnän alkuperäisen sijaan.
                    </p>
                  </div>
                )}

                <button
                  onClick={() => setSelectedClueForDetail(null)}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 rounded-xl font-bold text-xs cursor-pointer"
                >
                  Sulje merkintä
                </button>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* Sabotage overlay trigger */}
      <AnimatePresence>
        {sabotageOpen && (
          <SabotageModal
            onClose={() => setSabotageOpen(false)}
            onSaveSabotage={handleSaveSabotage}
            sabotagedMap={sabotagedClues}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
