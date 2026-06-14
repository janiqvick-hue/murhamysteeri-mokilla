import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LOCATIONS } from "./utils/locations";
import { BASE_CLUES } from "./utils/clues";
import { SCENARIO_MAP } from "./utils/scenarios";
import { db } from "./firebase";
import { ref, update, onValue } from "firebase/database";
import {
  Compass, MapPin, Eye, Bell, ShieldAlert, Sparkles, BookOpen, Clock, Skull, Search, Play, ChevronRight, User, X
} from "lucide-react";

// --- WITNESS BANNER UPOTETTU SUORAAN TÄHÄN JUURITASOLLE ---
interface WitnessNotification {
  id: string;
  text: string;
  type: "movement" | "sabotage" | "discovery" | "system";
  timestamp: number;
}

function WitnessBanner({ notifications }: { notifications: WitnessNotification[] }) {
  const activeNotifications = [...notifications]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 2);

  if (activeNotifications.length === 0) return null;

  return (
    <div className="w-full space-y-2 pointer-events-none mb-4">
      <AnimatePresence>
        {activeNotifications.map((notif) => {
          let icon = <Bell className="w-4 h-4 text-amber-400" />;
          let bgColor = "bg-slate-900/95 border-amber-500/20 text-slate-200";

          if (notif.type === "sabotage") {
            icon = <ShieldAlert className="w-4 h-4 text-red-400 animate-pulse" />;
            bgColor = "bg-red-950/90 border-red-500/30 text-red-200";
          } else if (notif.type === "discovery") {
            icon = <Sparkles className="w-4 h-4 text-cyan-400" />;
            bgColor = "bg-slate-900/95 border-cyan-500/20 text-slate-100";
          } else if (notif.type === "movement") {
            icon = <Eye className="w-4 h-4 text-emerald-400" />;
            bgColor = "bg-slate-900/90 border-slate-800 text-slate-300";
          }

          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: -15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              className={`flex items-center gap-3 p-3 rounded-xl border shadow-lg backdrop-blur-md w-full ${bgColor}`}
            >
              <div className="shrink-0 p-1.5 bg-black/40 rounded-lg">{icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold leading-normal truncate">{notif.text}</p>
                <span className="text-[9px] text-slate-500 font-mono">
                  {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

// --- MAP SCREEN PROPS MÄÄRITTELYT ---
interface MapScreenProps {
  playerId: string;
  gameCode: string;
  isSoloMode: boolean;
  lobbyData: any;
  onNextStage: (resultsData?: any) => void;
}
// --- SABOTAGE MODAL UPOTETTU SUORAAN TÄHÄN JUURITASOLLE ---
interface SabotageModalProps {
  onClose: () => void;
  onSaveSabotage: (clueId: string, fakeName: string, fakeText: string) => void;
  sabotagedMap: Record<string, any>;
}

function SabotageModal({ onClose, onSaveSabotage, sabotagedMap }: SabotageModalProps) {
  const [selectedClueId, setSelectedClueId] = useState("");
  const [fakeName, setFakeName] = useState("");
  const [fakeText, setFakeText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const selectedClue = BASE_CLUES.find(c => c.id === selectedClueId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClueId || !fakeName.trim() || !fakeText.trim()) return;

    setSubmitting(true);
    onSaveSabotage(selectedClueId, fakeName.trim(), fakeText.trim());
    setSuccess(true);
    
    setTimeout(() => {
      setSuccess(false);
      setSubmitting(false);
      onClose();
    }, 1500);
  };

  const handleClueSelect = (id: string) => {
    setSelectedClueId(id);
    const existing = sabotagedMap[id];
    if (existing) {
      setFakeName(existing.fakeName);
      setFakeText(existing.fakeText || existing.fakeDescription);
    } else {
      const original = BASE_CLUES.find(c => c.id === id);
      setFakeName(original ? original.name : "");
      setFakeText("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, y: 15 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 10 }}
        className="bg-slate-900 border border-red-900/40 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-600 to-amber-600" />

        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <Skull className="w-5 h-5 text-red-500 animate-pulse" />
            <h3 className="text-md font-bold text-slate-100 uppercase tracking-wide">
              Syyllisen Sabotaasipaneeli
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          Kuulut murhaajiin. Voit väärentää minkä tahansa mökin vihjeen syöttämällä valheellista tietoa etsivien puhelimiin.
        </p>

        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-12 flex flex-col items-center text-center justify-center space-y-3"
          >
            <div className="p-3 bg-red-900/30 border border-red-500/50 rounded-full text-red-400 animate-bounce">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h4 className="text-sm font-bold text-red-400 uppercase tracking-widest">Vihje Sabotoitu livenä!</h4>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">
                Valitse väärennettävä vihje
              </label>
              <select
                value={selectedClueId}
                onChange={(e) => handleClueSelect(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-red-500 cursor-pointer"
                required
              >
                <option value="">-- Valitse johto-lanka --</option>
                {BASE_CLUES.map((clue) => {
                  const loc = LOCATIONS.find(l => l.id === clue.locationId);
                  const isAlreadySabotaged = !!sabotagedMap[clue.id];
                  return (
                    <option key={clue.id} value={clue.id}>
                      {clue.name} ({loc ? loc.name : ""}) {isAlreadySabotaged ? "🛑" : ""}
                    </option>
                  );
                })}
              </select>
            </div>

            {selectedClueId && (
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl">
                  <span className="block text-[10px] text-amber-500/80 font-bold uppercase tracking-wider mb-0.5">Alkuperäinen esine:</span>
                  <p className="text-xs font-bold text-slate-300 mb-1">{selectedClue?.name}</p>
                  <p className="text-[11px] text-slate-500 italic leading-snug">"{selectedClue?.normalText}"</p>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Väärennetty nimi (Valenimi)</label>
                  <input
                    type="text"
                    maxLength={35}
                    value={fakeName}
                    onChange={(e) => setFakeName(e.target.value)}
                    placeholder="Esim. Tyhjä lasi ilman jälkiä"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Uusi valeselitys</label>
                  <textarea
                    rows={3}
                    maxLength={160}
                    value={fakeText}
                    onChange={(e) => setFakeText(e.target.value)}
                    placeholder="Mitä haluat kertoa etsiville tästä esineestä?..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-red-500 resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 bg-red-800 hover:bg-red-700 disabled:bg-slate-800 text-slate-100 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-red-950/25 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                  Käynnistä huijaus
                </button>
              </motion.div>
            )}
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}

// --- MAIN MAP SCREEN COMPONENT ALKAA ---
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
  const [timeLeft, setTimeLeft] = useState(180);

  const scenario = lobbyData.scenarioId ? SCENARIO_MAP[lobbyData.scenarioId as keyof typeof SCENARIO_MAP] : null;
  const myPlayer = lobbyData.players[playerId];
  const myRole = myPlayer?.role || "vieras";
  const isHost = myPlayer?.isHost;

  const activeLocation = LOCATIONS.find(l => l.id === activeLocationId) || LOCATIONS[0];

  useEffect(() => {
    if (isSoloMode || !gameCode) return;

    const playersRef = ref(db, `rooms/${gameCode}/players`);
    const unsubPlayers = onValue(playersRef, (snapshot) => {
      const val = snapshot.val();
      if (val) setRoomPlayers(Object.values(val));
    });

    const sabotageRef = ref(db, `rooms/${gameCode}/sabotagedClues`);
    const unsubSabotage = onValue(sabotageRef, (snapshot) => {
      const val = snapshot.val();
      setSabotagedClues(val || {});
    });

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

    const statusRef = ref(db, `rooms/${gameCode}/status`);
    const unsubStatus = onValue(statusRef, (snapshot) => {
      if (snapshot.val() === "voting") onNextStage();
    });

    return () => {
      unsubPlayers();
      unsubSabotage();
      unsubNotif();
      unsubStatus();
    };
  }, [isSoloMode, gameCode, onNextStage]);

  useEffect(() => {
    if (!isSoloMode) return;

    const initialSims = Object.values(lobbyData.players).map((p: any) => ({
      ...p,
      activeLocationId: p.activeLocationId || LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)].id
    }));
    setRoomPlayers(initialSims);

    if (myRole === "tutkija") {
      const tutorClue = BASE_CLUES.find(c => c.locationId === "paamokki");
      if (tutorClue) setFoundClues([tutorClue.id]);
    }
  }, [isSoloMode, myRole, lobbyData.players]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleProceedToVoting();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
      if (isSoloMode && Math.random() < 0.15) {
        simulateAIMovement();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isSoloMode]);

  const simulateAIMovement = () => {
    setRoomPlayers(prev => {
      const next = [...prev];
      const aiPlayers = next.filter(p => p.isAI);
      if (aiPlayers.length === 0) return prev;
      const targetAI = aiPlayers[Math.floor(Math.random() * aiPlayers.length)];
      
      const newLoc = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
      targetAI.activeLocationId = newLoc.id;

      const possibleClues = BASE_CLUES.filter(c => c.locationId === newLoc.id && !foundClues.includes(c.id));
      const textType = Math.random() < 0.4 ? "discovery" : "movement";

      let text = `${targetAI.name} siirtyi alueelle ${newLoc.name}.`;
      if (textType === "discovery" && possibleClues.length > 0) {
        const found = possibleClues[Math.floor(Math.random() * possibleClues.length)];
        text = `${targetAI.name} löysi esineen "${found.name}" alueelta ${newLoc.name}.`;
        targetAI.cluesFoundCount = (targetAI.cluesFoundCount || 0) + 1;
      }

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
      try {
        const { push } = await import("firebase/database");
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
    const roomClues = BASE_CLUES.filter(c => c.locationId === activeLocationId);
    const undiscovered = roomClues.filter(c => !foundClues.includes(c.id));

    if (undiscovered.length > 0) {
      const selected = undiscovered[Math.floor(Math.random() * undiscovered.length)];
      const updatedList = [...foundClues, selected.id];
      setFoundClues(updatedList);
      setSelectedClueForDetail(selected);

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
          const currentCount = myPlayer?.cluesFoundCount || 0;
          await update(ref(db, `rooms/${gameCode}/players/${playerId}`), {
            cluesFoundCount: currentCount + 1
          });

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
    } else {
      alert("Tämä huone on jo tutkittu perusteellisesti. Ei uusia vihjeitä!");
    }
  };

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

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  return (
    <div className="flex flex-col min-h-[85vh] w-full max-w-lg mx-auto px-1 py-4 text-slate-100" style={{ fontFamily: "sans-serif" }}>
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
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl mb-4 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowRoleBrief(!showRoleBrief)}
            className="w-full px-4 py-2.5 flex justify-between items-center text-left text-xs font-bold text-slate-300 hover:bg-slate-800/50 transition-colors uppercase tracking-wider cursor-pointer border-none bg-transparent"
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
                <div className="space-y-2 pt-2">
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

      {/* Witness Log Banner upotettuna */}
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
              return (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => handleMoveToLocation(loc.id)}
                  className={`relative p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-[80px] cursor-pointer group ${
                    isActive 
                      ? "bg-red-950/20 border-red-500/80 text-slate-100 shadow-md shadow-red-950/10" 
                      : "bg-slate-950 border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <div className="flex justify-between items-start w-full">
                    <span className="text-xs font-bold leading-tight group-hover:text-red-400 transition-colors">
                      {loc.name}
                    </span>
                    {countOfPeople > 0 && (
                      <span className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 bg-slate-800 text-slate-300 border border-slate-750 font-bold rounded-lg leading-none">
                        <User className="w-2.5 h-2.5 shrink-0 text-slate-400" />
                        {countOfPeople}
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] text-slate-500 leading-none">
                    {isActive ? "📍 Tutkitaan" : "Mene huoneeseen"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
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
              type="button"
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
              type="button"
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

            const sabotage = sabotagedClues[clueId];
            const isSabotaged = !!sabotage;
            
            const override = scenario?.clueOverrides?.[clueId];
            const shownName = isSabotaged ? sabotage.fakeName : (override?.name || originalClue.name);

            return (
              <button
                key={clueId}
                type="button"
                onClick={() => setSelectedClueForDetail(originalClue)}
                className="w-full p-3 rounded-xl border text-left flex justify-between items-center bg-slate-950 hover:bg-slate-900 border-slate-800 cursor-pointer"
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
        </div>
      </div>

      {/* Manual progression trigger */}
      {(isSoloMode || isHost) && (
        <button
          type="button"
          onClick={handleProceedToVoting}
          className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/80 rounded-xl font-bold text-xs flex items-center justify-center gap-2 tracking-wide cursor-pointer text-center"
        >
          <Play className="w-3.5 h-3.5" />
          Keskeytä and siirry loppuäänestykseen
        </button>
      )}

      {/* Clue DETAIL Dynamic Overlay Dialog */}
      <AnimatePresence>
        {selectedClueForDetail && (() => {
          const clueId = selectedClueForDetail.id;
          const sabotage = sabotagedClues[clueId];
          const isSabotaged = !!sabotage;
          
          const override = scenario?.clueOverrides?.[clueId];
          const shownName = isSabotaged ? sabotage.fakeName : (override?.name || selectedClueForDetail.name);
          const shownText = isSabotaged ? sabotage.fakeText : (override?.normalText || selectedClueForDetail.normalText);
          const roleOverrideText = !isSabotaged ? (myRole === "syyllinen" ? override?.syyllinenText : override?.normalText) : null;

          return (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedClueForDetail(null)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 15 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative overflow-hidden"
                onClick={e => e.stopPropagation()}
              >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-red-800" />
                <h3 className="text-lg font-extrabold text-slate-100 mb-2 truncate">{shownName}</h3>
                <span className="inline-block text-[10px] px-2.5 py-0.5 bg-slate-950 border border-slate-800 font-bold text-red-400 uppercase tracking-widest rounded mb-4">
                  Sijainti: {LOCATIONS.find(l => l.id === selectedClueForDetail.locationId)?.name}
                </span>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl mb-4 shadow-inner">
                  <p className="text-xs text-slate-300 leading-relaxed italic">"{shownText}"</p>
                </div>

                {roleOverrideText && (
                  <div className="p-3 bg-indigo-950/30 border border-indigo-500/20 rounded-xl mb-4">
                    <p className="text-[10px] text-indigo-400 font-semibold">💡 Huomio: {roleOverrideText}</p>
                  </div>
                )}

                <button
                  type="button" onClick={() => setSelectedClueForDetail(null)}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 rounded-xl font-bold text-xs cursor-pointer"
                >
                  Sulje merkintä
                </button>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      <AnimatePresence>
        {sabotageOpen && (
          <SabotageModal onClose={() => setSabotageOpen(false)} onSaveSabotage={handleSaveSabotage} sabotagedMap={sabotagedClues} />
        )}
      </AnimatePresence>
    </div>
  );
}
