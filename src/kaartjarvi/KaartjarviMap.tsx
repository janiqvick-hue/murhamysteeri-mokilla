import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HUVILA_LOCATIONS, HuvilaLocation } from "./huvilaLocations";
import { HUVILA_PUZZLES, Puzzle } from "./huvilaPuzzles";
import { HUVILA_SCENARIO, HUVILA_CLUE_DETAILS } from "./huvilaScenarios"; // UUDET IMPORTIT
import { 
  Compass, MapPin, Key, BookOpen, HelpCircle, Lock, Unlock, CheckCircle, ArrowLeft, Info, FileText
} from "lucide-react";

interface KaartjarviMapProps {
  playerId: string;
  playerName: string;
  onExitGame: () => void;
}

export default function KaartjarviMap({
  playerId,
  playerName,
  onExitGame
}: KaartjarviMapProps) {
  const [currentLocId, setCurrentLocId] = useState("paahuvila");
  const [unlockedLocations, setUnlockedLocations] = useState<string[]>(["paahuvila", "grillikota", "puuvarasto"]);
  const [inventory, setInventory] = useState<string[]>([]);
  const [solvedPuzzles, setSolvedPuzzles] = useState<string[]>([]);
  const [showStoryBrief, setShowStoryBrief] = useState(true);
  const [selectedClueForDetail, setSelectedClueForDetail] = useState<any | null>(null);
  
  const [inputAnswer, setInputAnswer] = useState("");
  const [puzzleError, setPuzzleError] = useState("");
  const [puzzleSuccessText, setPuzzleSuccessText] = useState("");

  const currentLoc = HUVILA_LOCATIONS.find(l => l.id === currentLocId) || HUVILA_LOCATIONS[0];
  const roomPuzzle = HUVILA_PUZZLES.find(p => p.locationId === currentLocId && !solvedPuzzles.includes(p.id));

  const handleMove = (locId: string) => {
    const targetLoc = HUVILA_LOCATIONS.find(l => l.id === locId);
    if (!targetLoc) return;

    if (targetLoc.isLocked && !unlockedLocations.includes(locId)) {
      if (targetLoc.requiredItemId && inventory.includes(targetLoc.requiredItemId)) {
        setUnlockedLocations(prev => [...prev, locId]);
        setCurrentLocId(locId);
        alert(`Käytit esineen: ${targetLoc.requiredItemId}. Ovi avautui onnistuneesti!`);
      } else {
        setPuzzleError("Ovi on visusti lukossa. Tarvitset sopivan avaimen avataksesi sen.");
        setTimeout(() => setPuzzleError(""), 3000);
      }
      return;
    }

    setCurrentLocId(locId);
    setPuzzleError("");
    setPuzzleSuccessText("");
    setInputAnswer("");
  };

  const handleVerifyAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomPuzzle || !inputAnswer.trim()) return;

    if (inputAnswer.trim() === roomPuzzle.correctAnswer) {
      setSolvedPuzzles(prev => [...prev, roomPuzzle.id]);
      if (roomPuzzle.rewardItemId) {
        setInventory(prev => [...prev, roomPuzzle.rewardItemId]);
      }
      setPuzzleSuccessText(roomPuzzle.rewardText);
      setInputAnswer("");
      setPuzzleError("");
    } else {
      setPuzzleError("Väärä koodi tai ratkaisu! Lukko ei hievahdakaan.");
      setTimeout(() => setPuzzleError(""), 4000);
    }
  };
  return (
    <div className="flex flex-col min-h-[85vh] w-full max-w-lg mx-auto px-1 py-4 text-slate-100" style={{ fontFamily: "sans-serif" }}>
      {/* Yläpalkki ja Kaartjärvi-info */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-4 flex justify-between items-center shadow-md">
        <div>
          <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest leading-none mb-1">
            LOPEN KAARTJÄRVI: ARVOITUS HUVILALLA
          </p>
          <h2 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-slate-400" />
            Yksinpeli-seikkailu
          </h2>
        </div>

        {/* Takaisin päävalikkoon -nappi */}
        <button
          type="button"
          onClick={onExitGame}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-slate-200 font-bold text-xs shadow-inner cursor-pointer border-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Päävalikko</span>
        </button>
      </div>

      {/* Alustava dynaaminen Tarinalaatikko (Story Brief) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl mb-4 overflow-hidden shadow-md">
        <button
          type="button"
          onClick={() => setShowStoryBrief(!showStoryBrief)}
          className="w-full px-4 py-2.5 flex justify-between items-center text-left text-xs font-bold text-slate-300 hover:bg-slate-800/50 transition-colors uppercase tracking-wider cursor-pointer border-none bg-transparent"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>Huvilan Taustatarina & Tilanne</span>
          </div>
          <span className="text-[10px] text-slate-500">
            {showStoryBrief ? "Piilota ▲" : "Näytä ▼"}
          </span>
        </button>
        
        <AnimatePresence initial={false}>
          {showStoryBrief && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="px-4 pb-3 pt-1 border-t border-slate-800"
            >
              <div className="space-y-2 pt-2 text-xs">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 border-b border-slate-800 pb-1.5 mb-1.5">
                  <span>Mysteeri: <span className="text-amber-400">{HUVILA_SCENARIO.name}</span></span>
                  <span>Uhri: <span className="text-slate-200">{HUVILA_SCENARIO.victim}</span></span>
                </div>
                <p className="text-slate-300 leading-relaxed italic border-l-2 border-amber-500/40 pl-2">
                  {HUVILA_SCENARIO.setting}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
        {/* Oikea puoli: Valitun huoneen kuvaus ja pulmat */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-md">
          <div>
            <div className="flex items-center gap-2 text-amber-500 mb-2">
              <MapPin className="w-5 h-5" />
              <h3 className="text-lg font-extrabold text-slate-100">{currentLoc.name}</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">{currentLoc.description}</p>

            {/* Virhe- ja onnistumisilmoitukset */}
            <AnimatePresence mode="wait">
              {puzzleError && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-3 bg-red-950/20 border border-red-500/20 rounded-xl mb-3 flex items-center gap-2 text-xs text-red-400">
                  <Lock className="w-4 h-4 shrink-0" />
                  <span>{puzzleError}</span>
                </motion.div>
              )}

              {puzzleSuccessText && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-xl mb-3 space-y-2 text-xs text-emerald-300">
                  <div className="flex items-center gap-2 font-bold uppercase tracking-wider">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Mysteeri Ratkesi!</span>
                  </div>
                  <p className="leading-relaxed italic">"{puzzleSuccessText}"</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Koodilukko-osio */}
            {roomPuzzle && !puzzleSuccessText && (
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-4 shadow-inner">
                <div className="flex gap-2 items-start">
                  <HelpCircle className="w-4.5 h-4.5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-[11px] font-bold text-amber-500 uppercase tracking-wider mb-1">Koodilukon arvoitus:</h4>
                    <p className="text-xs text-slate-300 leading-relaxed italic">"{roomPuzzle.question}"</p>
                  </div>
                </div>

                <form onSubmit={handleVerifyAnswer} className="flex gap-2">
                  <input
                    type="text"
                    maxLength={15}
                    value={inputAnswer}
                    onChange={(e) => setInputAnswer(e.target.value)}
                    placeholder="Syötä ratkaisu..."
                    className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-amber-500"
                    required
                  />
                  <button type="submit" className="px-4 py-2 bg-amber-700 hover:bg-amber-600 text-slate-100 font-bold text-xs rounded-xl transition-all cursor-pointer border-none">
                    Kokeile
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Esineen DETAIL Popup-ikkuna */}
      <AnimatePresence>
        {selectedClueForDetail && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedClueForDetail(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative overflow-hidden text-center"
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-amber-600" />
              <div className="p-2.5 bg-amber-950/20 border border-amber-500/20 rounded-full w-fit mx-auto mb-3 text-amber-400">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-100 mb-1">{selectedClueForDetail.title}</h3>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-4">Johtolangan analyysi</p>
              
              <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl mb-4 shadow-inner text-left">
                <p className="text-xs text-slate-300 leading-relaxed italic">"{selectedClueForDetail.text}"</p>
              </div>

              <button
                type="button" onClick={() => setSelectedClueForDetail(null)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 rounded-xl font-bold text-xs cursor-pointer border-none"
              >
                Sulje tarkastelu
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
