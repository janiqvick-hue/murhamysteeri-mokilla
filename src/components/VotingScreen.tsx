import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../firebase";
import { ref, update, onValue } from "firebase/database";
import { 
  Users, Check, ShieldAlert, Award, Skull, Vote, Play, AlertCircle, HelpCircle
} from "lucide-react";

interface VotingScreenProps {
  playerId: string;
  gameCode: string;
  isSoloMode: boolean;
  lobbyData: any;
  onNextStage: (resultsData?: any) => void;
}

export default function VotingScreen({
  playerId,
  gameCode,
  isSoloMode,
  lobbyData,
  onNextStage
}: VotingScreenProps) {
  const [selectedTargetId, setSelectedTargetId] = useState("");
  const [hasVoted, setHasVoted] = useState(false);
  const [votesMap, setVotesMap] = useState<Record<string, string>>({});
  const [showConfessConfirm, setShowConfessConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const myPlayer = lobbyData.players[playerId];
  const myRole = myPlayer?.role || "vieras";
  const isHost = myPlayer?.isHost;

  const playerList = Object.values(lobbyData.players || {}) as any[];
  const totalPlayers = playerList.length;
  const votingCandidates = playerList.filter((p: any) => p.id !== playerId);
  const [votedId, setVotedId] = useState("");
  const [confessed, setConfessed] = useState(false);

  // 1. Firebasen reaaliaikainen synkronointi (Moninpeli)
  useEffect(() => {
    if (isSoloMode || !gameCode) return;

    const votesRef = ref(db, `rooms/${gameCode}/votes`);
    const unsubscribe = onValue(votesRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        setVotesMap(val);
      } else {
        setVotesMap({});
      }
    });

    // Kuunnellaan jos joku murtuu ja tunnustaa teon livenä
    const confessRef = ref(db, `rooms/${gameCode}/culpritConfessed`);
    const unsubConfess = onValue(confessRef, (snapshot) => {
      if (snapshot.val() === true) {
        // Jos joku tunnusti, siirrytään suoraan loppunäyttöön
        handleTriggerEnding(true);
      }
    });

    // Kuunnellaan milloin isäntä siirtää pelin lopputuloksiin
    const statusRef = ref(db, `rooms/${gameCode}/status`);
    const unsubStatus = onValue(statusRef, (snapshot) => {
      if (snapshot.val() === "ending") {
        // Haetaan tuorein pelitila loppunäytölle
        onNextStage();
      }
    });

    return () => {
      unsubscribe();
      unsubConfess();
      unsubStatus();
    };
  }, [isSoloMode, gameCode, onNextStage]);

  // 2. Yksinpelin simulaatio (Boteille automaattiäänet)
  useEffect(() => {
    if (!isSoloMode) return;
    
    // Arvotaan boteille satunnaiset anonyymit äänet taustalla
    const simulatedVotes: Record<string, string> = {};
    playerList.forEach((p: any) => {
      if (p.isAI) {
        const potentialTargets = playerList.filter((t: any) => t.id !== p.id);
        const randomTarget = potentialTargets[Math.floor(Math.random() * potentialTargets.length)];
        simulatedVotes[p.id] = randomTarget.id;
      }
    });
    setVotesMap(simulatedVotes);
  }, [isSoloMode]);
  // Äänen rekisteröinti livenä tai simuloituna
  const handleVoteSubmit = async (targetId: string) => {
    if (hasVoted || loading) return;
    setLoading(true);

    if (isSoloMode) {
      setVotedId(targetId);
      setHasVoted(true);

      const nextVotes = {
        ...votesMap,
        [playerId]: targetId
      };
      setVotesMap(nextVotes);

      // Yksinpelissä siirrytään hetken kuluttua laskentaan
      setTimeout(() => {
        handleCalculateAndEnd(nextVotes);
      }, 1500);
    } else {
      try {
        const updates: Record<string, any> = {};
        updates[`rooms/${gameCode}/votes/${playerId}`] = targetId;
        
        // Jos tämä oli viimeinen ääni livenä, isäntä laskee tulokset automaattisesti
        const currentVotedCount = Object.keys(votesMap).length + 1;
        if (currentVotedCount === totalPlayers && isHost) {
          updates[`rooms/${gameCode}/status`] = "ending";
        }

        await update(ref(db), updates);
        setVotedId(targetId);
        setHasVoted(true);
      } catch (err) {
        console.warn("Äänestys epäonnistui:", err);
      }
    }
    setLoading(false);
  };

  // Syyllisen vapaaehtoinen murtuminen ja teon tunnustaminen livenä
  const handleConfessCrime = async () => {
    if (loading) return;
    setLoading(true);

    if (isSoloMode) {
      setConfessed(true);
      setHasVoted(true);
      
      const nextVotes = {
        ...votesMap,
        [playerId]: playerId // Tunnustus merkitään äänestämällä itseään
      };

      setTimeout(() => {
        onNextStage({
          players: playerList,
          votes: nextVotes,
          confessed: true
        });
      }, 1500);
    } else {
      try {
        const updates: Record<string, any> = {};
        updates[`rooms/${gameCode}/culpritConfessed`] = true;
        updates[`rooms/${gameCode}/status`] = "ending";
        
        // Tallennetaan tunnustusääni itseään vastaan
        updates[`rooms/${gameCode}/votes/${playerId}`] = playerId;

        await update(ref(db), updates);
        setConfessed(true);
        setHasVoted(true);
      } catch (err) {
        console.warn("Tunnustus epäonnistui:", err);
      }
    }
    setLoading(false);
  };
  // Pelin päättyminen & äänten matemaattinen laskeminen
  const handleCalculateAndEnd = async (votingData: Record<string, string>) => {
    if (isSoloMode) {
      onNextStage({
        players: playerList,
        votes: votingData,
        confessed: false
      });
    } else {
      if (isHost) {
        try {
          const updates: Record<string, any> = {};
          updates[`rooms/${gameCode}/status`] = "ending";
          await update(ref(db), updates);
        } catch (err) {
          console.warn("Tulosten laskenta epäonnistui:", err);
        }
      }
    }
  };

  const handleTriggerEnding = (wasConfessed: boolean) => {
    onNextStage({
      players: playerList,
      votes: votesMap,
      confessed: wasConfessed
    });
  };
  const totalSlots = totalPlayers;
  const votedCount = Object.keys(votesMap).length;
  const votedRatioPercent = Math.min(100, Math.round((votedCount / totalSlots) * 100));

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] w-full max-w-md mx-auto px-4 py-8 text-slate-100" style={{ fontFamily: "sans-serif" }}>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md overflow-hidden relative"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-600 via-purple-600 to-amber-600 animate-pulse" />

        {/* Otsikko */}
        <div className="text-center mb-6">
          <span className="text-[10px] text-red-500 font-extrabold uppercase tracking-widest block mb-1">
            VAIHE 3: RATKAISU
          </span>
          <h2 className="text-2xl font-black text-slate-100 uppercase tracking-tight flex items-center justify-center gap-1.5">
            <Vote className="w-6 h-6 text-slate-400" />
            Salainen Äänestys
          </h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            Keskustele muiden pelaajien kanssa ja arvioi todisteiden painoarvoa. Kuka mökkiläisistä kantaa murhaajan taakkaa?
          </p>
        </div>
        {/* Reaaliaikainen edistymispalkki */}
        <div className="mb-6 bg-slate-950/80 border border-slate-800 px-4 py-3 rounded-xl">
          <div className="flex justify-between items-center text-xs text-slate-400 font-medium mb-1.5">
            <span>Annetut äänet:</span>
            <span className="font-mono text-slate-100 font-bold">{votedCount} / {totalSlots}</span>
          </div>
          <div className="w-full bg-slate-900 border border-slate-800 h-2.5 rounded-full overflow-hidden">
            <motion.div
              className="bg-emerald-500 h-full"
              initial={{ width: 0 }}
              animate={{ width: `${votedRatioPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Äänestysvaihtoehdot */}
        {!hasVoted ? (
          <div className="space-y-4">
            <div>
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2.5">
                Valitse kenen epäilet tehneen rikoksen:
              </span>
              <div className="space-y-2">
                {votingCandidates.map((cand: any) => (
                  <button
                    key={cand.id}
                    type="button"
                    onClick={() => handleVoteSubmit(cand.id)}
                    disabled={loading}
                    className="w-full p-3.5 bg-slate-950 border border-slate-800 hover:bg-red-950/20 hover:border-red-500/40 rounded-xl text-left font-bold text-slate-200 text-sm flex justify-between items-center transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-slate-700 group-hover:bg-red-500 group-hover:scale-125 transition-all"></div>
                      <span>{cand.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-normal">
                      Aseta Syytetyksi
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Syyllisen erityinen vapaaehtoinen murtuminen */}
            {myRole === "syyllinen" && (
              <div className="pt-4 border-t border-slate-800/60">
                <div className="p-4 bg-red-950/15 border border-red-500/20 rounded-xl text-center space-y-3">
                  <Skull className="w-6 h-6 text-red-500 mx-auto animate-bounce" />
                  <p className="text-xs text-red-300 leading-relaxed font-semibold">
                    Olet syyllinen. Voit milloin tahansa antaa periksi, murtua ja vapaaehtoisesti tunnustaa teon käynnistääksesi dramaattisen katumus-lopun!
                  </p>
                  <button
                    type="button"
                    onClick={handleConfessCrime}
                    disabled={loading}
                    className="px-4 py-2 bg-red-900 hover:bg-red-800 text-slate-100 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-red-900/30 font-semibold"
                  >
                    "Tunnusta teko" (Murtuminen paineen alla)
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Äänestäneen odotustila */
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-emerald-950 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-md font-bold text-slate-200">
                Äänesi on annettu onnistuneesti!
              </h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                Kuponkisi on rekisteröity salaisesti ja anonyymisti. Odotetaan, että loputkin seurueesta saavat päätöksensä tehtyä...
              </p>
            </div>

            {isSoloMode && (
              <div className="text-[10px] text-slate-500 font-mono animate-pulse">
                Lasketaan simuloituja ääniä ja analysoidaan tuloksia...
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
