import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HUVILA_LOCATIONS, HuvilaLocation } from "./huvilaLocations";
import { HUVILA_PUZZLES, Puzzle } from "./huvilaPuzzles";
import { 
  Compass, MapPin, Key, BookOpen, HelpCircle, Lock, Unlock, CheckCircle, ArrowLeft, RefreshCw
} from "lucide-react";

interface KaartjarviMapProps {
  playerId: string;
  playerName: string;
  onExitGame: () => void; // Painike, jolla pääsee takaisin päävalikkoon
}

export default function KaartjarviMap({
  playerId,
  playerName,
  onExitGame
}: KaartjarviMapProps) {
  // Pelitilat yksinpeliä varten
  const [currentLocId, setCurrentLocId] = useState("paahuvila");
  const [unlockedLocations, setUnlockedLocations] = useState<string[]>(["paahuvila", "grillikota", "puuvarasto"]);
  const [inventory, setInventory] = useState<string[]>([]);
  const [solvedPuzzles, setSolvedPuzzles] = useState<string[]>([]);
  
  // Pulmansyöttötilat
  const [inputAnswer, setInputAnswer] = useState("");
  const [puzzleError, setPuzzleError] = useState("");
  const [puzzleSuccessText, setPuzzleSuccessText] = useState("");

  // Haetaan nykyisen huoneen tiedot ja mahdolliset pulmat
  const currentLoc = HUVILA_LOCATIONS.find(l => l.id === currentLocId) || HUVILA_LOCATIONS[0];
  const roomPuzzle = HUVILA_PUZZLES.find(p => p.locationId === currentLocId && !solvedPuzzles.includes(p.id));
  // Sijainnista toiseen liikkumisen logiikka
  const handleMove = (locId: string) => {
    const targetLoc = HUVILA_LOCATIONS.find(l => l.id === locId);
    if (!targetLoc) return;

    // Tarkistetaan onko paikka lukittu (kuten rantasauna)
    if (targetLoc.isLocked && !unlockedLocations.includes(locId)) {
      // Katsotaan löytyykö pelaajan repusta vaadittu esine (messinkiavain)
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

    // Jos paikka on auki, siirrytään sinne suoraan
    setCurrentLocId(locId);
    setPuzzleError("");
    setPuzzleSuccessText("");
    setInputAnswer("");
  };

  // Pulman vastaustarkistus (Koodilukko)
  const handleVerifyAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomPuzzle || !inputAnswer.trim()) return;

    // Verrataan syötettyä vastausta oikeaan (esim. "0672")
    if (inputAnswer.trim() === roomPuzzle.correctAnswer) {
      setSolvedPuzzles(prev => [...prev, roomPuzzle.id]);
      
      // Lisätään palkintoesine reppuun (esim. "messinkiavain")
      if (roomPuzzle.rewardItemId) {
        setInventory(prev => [...prev, roomPuzzle.rewardItemId]);
      }
      
      setPuzzleSuccessText(roomPuzzle.rewardText);
      setInputAnswer("");
      setPuzzleError("");
    } else {
      setPuzzleError("Väärä koodi tai ratkaisu! Lukko ei hievahdakaan. Tutki vihjeitä tarkemmin.");
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
          className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-slate-200 font-bold text-xs shadow-inner cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Päävalikko</span>
        </button>
      </div>

      {/* Pelaajan reppu / Tasku (Inventory) */}
      <div className="bg-slate-950 border border-slate-900 p-3 rounded-xl mb-4 flex items-center gap-3">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
          💼 Reppusi sisältö:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {inventory.map((item, idx) => (
            <span
              key={idx}
              className="text-[10px] px-2.5 py-1 rounded-full border bg-amber-950/30 border-amber-900/60 text-amber-300 font-medium flex items-center gap-1"
            >
              <Key className="w-3 h-3 text-amber-400" />
              {item === "messinkiavain" ? "Messinkiavain" : item}
            </span>
          ))}
          {inventory.length === 0 && (
            <span className="text-xs text-slate-600 italic">Reppusi on vielä tyhjä. Löydä esineitä ratkomalla pulmia!</span>
          )}
        </div>
      </div>

      {/* Päätapahtuma-alue jaettu kahteen osaan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {/* Vasen puoli: Sijaintien valintapainikkeet */}
        <div className="bg-slate-900/45 border border-slate-800/80 rounded-2xl p-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            Tutki ympäristöä
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {HUVILA_LOCATIONS.map((loc) => {
              const isActive = loc.id === currentLocId;
              const isLockedNow = loc.isLocked && !unlockedLocations.includes(loc.id);

              return (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => handleMove(loc.id)}
                  className={`relative p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-[80px] cursor-pointer group ${
                    isActive 
                      ? "bg-amber-950/20 border-amber-500/80 text-slate-100 shadow-md shadow-amber-950/10" 
                      : "bg-slate-950 border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <div className="flex justify-between items-start w-full">
                    <span className="text-xs font-bold leading-tight group-hover:text-amber-400 transition-colors">
                      {loc.name}
                    </span>
                    {isLockedNow && (
                      <Lock className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                    )}
                  </div>
                  <span className="text-[9px] text-slate-500 leading-none">
                    {isActive ? "📍 Olet tässä" : isLockedNow ? "🔒 Lukittu" : "Tutki kohdetta"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        {/* Oikea puoli: Valitun huoneen tiedot ja pulmat */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-amber-500 mb-2">
              <MapPin className="w-5 h-5" />
              <h3 className="text-lg font-extrabold text-slate-100">
                {currentLoc.name}
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {currentLoc.description}
            </p>

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
                    <span>Arvoitus ratkaistu!</span>
                  </div>
                  <p className="leading-relaxed italic">"{puzzleSuccessText}"</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Arvoitus / Koodilukko-osio, jos huoneessa on ratkaisematon pulma */}
            {roomPuzzle && !puzzleSuccessText && (
              <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-4">
                <div className="flex gap-2 items-start">
                  <HelpCircle className="w-4.5 h-4.5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-[11px] font-bold text-amber-500 uppercase tracking-wider mb-1">
                      Koodilukon arvoitus:
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed italic">
                      "{roomPuzzle.question}"
                    </p>
                  </div>
                </div>

                {/* Vastauslomake */}
                <form onSubmit={handleVerifyAnswer} className="flex gap-2">
                  <input
                    type="text"
                    maxLength={10}
                    value={inputAnswer}
                    onChange={(e) => setInputAnswer(e.target.value)}
                    placeholder="Syötä koodi tai ratkaisu..."
                    className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-amber-500"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-700 hover:bg-amber-600 text-slate-100 font-bold text-xs rounded-xl transition-all cursor-pointer border-none"
                  >
                    Kokeile lukkoa
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
