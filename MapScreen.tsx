import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LOCATIONS } from "./locations";
import { CLUES } from "./clues";
import { SCENARIO_MAP } from "./scenarios";
import { db } from "./firebase";
import { 
  Compass, MapPin, Key, HelpCircle, Lock, CheckCircle, ArrowLeft, FileText, Search, ShieldAlert, Users, Trophy
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
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">
                    Väärennetty nimi / esine
                  </label>
                  <input
                    type="text"
                    value={fakeName}
                    onChange={(e) => setFakeName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-red-500"
                    placeholder="Esim. Tyhjä kahvikuppi"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">
                    Väärennetty vihjeteksti (Mitä muut näkevät)
                  </label>
                  <textarea
                    value={fakeText}
                    onChange={(e) => setFakeText(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-red-500 resize-none leading-normal"
                    placeholder="Kirjoita harhaanjohtava tarina tai havainto..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 bg-red-700 hover:bg-red-600 font-bold rounded-xl text-slate-100 border-none cursor-pointer text-xs uppercase tracking-wider transition-colors disabled:opacity-50 shadow-lg mt-2"
                >
                  {submitting ? "Päivitetään..." : "Tallenna ja Sabotoi ⚡"}
                </button>
              </motion.div>
            )}
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}

// --- PÄÄKOMPONENTTI: MAP SCREEN ---
export default function MapScreen({ playerId, gameCode, isSoloMode, lobbyData, onNextStage }: MapScreenProps) {
  const [showSabotage, setShowSabotage] = useState(false);
  const [sabotagedClues, setSabotagedClues] = useState<Record<string, any>>({});
  const [notifications, setNotifications] = useState<WitnessNotification[]>([]);

  // Kuunnellaan huoneen tapahtumia livenä moninpelissä tai simuloidaan bot-pelissä
  useEffect(() => {
    if (isSoloMode || !gameCode) return;
    const roomRef = ref(db, `rooms/${gameCode}`);
    const unsubscribe = onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        if (data.sabotage) setSabotagedClues(data.sabotage);
        if (data.notifications) setNotifications(Object.values(data.notifications));
        if (data.status === "voting") onNextStage(data.results || null);
      }
    });
    return () => unsubscribe();
  }, [gameCode, isSoloMode, onNextStage]);

  const handleSaveSabotage = async (clueId: string, fakeName: string, fakeText: string) => {
    if (isSoloMode) {
      setSabotagedClues(prev => ({ ...prev, [clueId]: { fakeName, fakeText } }));
    } else {
      const updates: Record<string, any> = {};
      updates[`rooms/${gameCode}/sabotage/${clueId}`] = { fakeName, fakeText, timestamp: Date.now() };
      
      // Luodaan samalla live-ilmoitus tapahtumasta muille mökkiläisille
      const notifId = "n_" + Math.random().toString(36).substr(2, 9);
      updates[`rooms/${gameCode}/notifications/${notifId}`] = {
        id: notifId,
        text: "⚠️ Jotain outoa tapahtui jossain päin mökkiä...",
        type: "sabotage",
        timestamp: Date.now()
      };
      await update(ref(db), updates);
    }
  };

  const myRole = lobbyData?.players?.[playerId]?.role || "vieras";
  const isSyyllinen = myRole === "syyllinen";

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px", fontFamily: "sans-serif", color: "#f8fafc" }}>
      {/* Live-banneri tapahtumille */}
      <WitnessBanner notifications={notifications} />

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-4 shadow-xl">
        <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-full w-fit mx-auto mb-1">
          <Compass className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-xl font-black uppercase tracking-tight">Mökin Tutkimusvaihe</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Liiku mökin eri huoneissa, etsi todistusaineistoja ja tarkkaile muiden mökkiläisten liikkeitä.
        </p>

        {/* Syyllisen sabotaasinappula */}
        {isSyyllinen && (
          <button
            type="button"
            onClick={() => setShowSabotage(true)}
            className="w-full py-2.5 bg-red-950/40 border border-red-900/50 hover:bg-red-900/30 font-bold rounded-xl text-red-400 text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <Skull className="w-4 h-4" />
            <span>Avaa Sabotaasipaneeli</span>
          </button>
        )}

        {/* Eteenpäin äänestykseen (Isännälle tai Solo-botti-pelissä) */}
        {(isSoloMode || lobbyData?.players?.[playerId]?.isHost) && (
          <button
            type="button"
            onClick={async () => {
              if (isSoloMode) {
                onNextStage();
              } else {
                await update(ref(db, `rooms/${gameCode}`), { status: "voting" });
              }
            }}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 font-bold rounded-xl text-slate-100 text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg"
          >
            <Play className="w-4 h-4" />
            <span>Siirry Loppuäänestykseen 🗳️</span>
          </button>
        )}
      </div>

      {/* Sabotaasi-modal */}
      <AnimatePresence>
        {showSabotage && (
          <SabotageModal
            onClose={() => setShowSabotage(false)}
            onSaveSabotage={handleSaveSabotage}
            sabotagedMap={sabotagedClues}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
