import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "./firebase";
import { ref, update, onValue } from "firebase/database";
import { ACHIEVEMENTS } from "./achievements";
import { ROLES } from "./roles";
import { SCENARIO_MAP } from "./scenarios";
import { 
  Users, Check, ShieldAlert, Award, Skull, Vote, Play, AlertCircle, HelpCircle, BarChart2, Star, RotateCcw, CheckCircle, EyeOff, Search, AlertTriangle
} from "lucide-react";

interface VotingScreenProps {
  playerId: string;
  gameCode: string;
  isSoloMode: boolean;
  lobbyData: any;
  onNextStage: (resultsData?: any) => void;
  onResetGame: () => void;
}

export default function VotingScreen({
  playerId,
  gameCode,
  isSoloMode,
  lobbyData,
  onNextStage,
  onResetGame
}: VotingScreenProps) {
  const [votesMap, setVotesMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const myPlayer = lobbyData.players[playerId];
  const myRole = myPlayer?.role || "vieras";
  const isHost = myPlayer?.isHost;

  const playerList = Object.values(lobbyData.players || {}) as any[];
  const totalPlayers = playerList.length;

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

    // Kuunnellaan milloin isäntä siirtää pelin lopputuloksiin
    const statusRef = ref(db, `rooms/${gameCode}/status`);
    const unsubStatus = onValue(statusRef, (snapshot) => {
      if (snapshot.val() === "ending") {
        onNextStage();
      }
    });

    return () => {
      unsubscribe();
      unsubStatus();
    };
  }, [isSoloMode, gameCode, onNextStage]);

  // 2. Yksinpelin simulaatio (Boteille automaattiäänet)
  useEffect(() => {
    if (!isSoloMode) return;
    
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
    if (loading) return;
    setLoading(true);

    if (isSoloMode) {
      const nextVotes = {
        ...votesMap,
        [playerId]: targetId
      };
      setVotesMap(nextVotes);

      // Yksinpelissä siirrytään hetken kuluttua suoraan laskentaan
      setTimeout(() => {
        handleCalculateAndEnd(nextVotes);
      }, 1500);
    } else {
      try {
        const updates: Record<string, any> = {};
        updates[`rooms/${gameCode}/votes/${playerId}`] = targetId;
        
        // Jos tämä oli viimeinen ääni livenä, isäntä siirtää huoneen ending-tilaan
        const currentVotedCount = Object.keys(votesMap).length + 1;
        if (currentVotedCount === totalPlayers && isHost) {
          updates[`rooms/${gameCode}/status`] = "ending";
        }

        await update(ref(db), updates);
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
      const nextVotes = {
        ...votesMap,
        [playerId]: playerId // Tunnustus merkitään äänestämällä itseään
      };
      setVotesMap(nextVotes);

      setTimeout(() => {
        onNextStage({
          votes: nextVotes,
          confessed: true
        });
      }, 1500);
    } else {
      try {
        const updates: Record<string, any> = {};
        updates[`rooms/${gameCode}/status`] = "ending";
        updates[`rooms/${gameCode}/votes/${playerId}`] = playerId;
        updates[`rooms/${gameCode}/confessed`] = true;

        await update(ref(db), updates);
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
        votes: votingData,
        confessed: false
      });
    } else {
      if (isHost) {
        try {
          await update(ref(db, `rooms/${gameCode}`), {
            status: "ending"
          });
        } catch (err) {
          console.warn("Tulosten laskenta epäonnistui:", err);
        }
      }
    }
  };

  const handlePlayAgain = async () => {
    setLoading(true);
    if (isSoloMode) {
      onResetGame();
    } else {
      if (isHost) {
        try {
          const { set } = await import("firebase/database");
          const roomRef = ref(db, `rooms/${gameCode}`);
          
          const resetPlayers: Record<string, any> = {};
          playerList.forEach((p: any) => {
            resetPlayers[p.id] = {
              id: p.id,
              name: p.name,
              isHost: !!p.isHost,
              cluesFoundCount: 0,
              sabotagesAttempted: 0
            };
          });

          await set(roomRef, {
            code: gameCode,
            status: "lobby",
            players: resetPlayers,
            createdAt: Date.now()
          });
        } catch (err) {
          console.warn("Huoneen nollaus epäonnistui", err);
        }
      } else {
        onResetGame();
      }
    }
    setLoading(false);
  };

  const getAchievementIcon = (typeId: string) => {
    switch (typeId) {
      case "mestarietsiva":
        return <Award className="w-4 h-4 text-cyan-400" />;
      case "taydellinen_rikollinen":
        return <Skull className="w-4 h-4 text-red-400" />;
      case "suurin_valehtelija":
        return <AlertTriangle className="w-4 h-4 text-red-300" />;
      case "totuuden_vartija":
        return <Award className="w-4 h-4 text-purple-300" />;
      case "epailyksen_mestari":
        return <ShieldAlert className="w-4 h-4 text-orange-300" />;
      default:
        return <Star className="w-4 h-4 text-amber-400" />;
    }
  };
  // Tarkistetaan onko oma ääni jo annettu
  const hasVoted = !!votesMap[playerId];
  const votedId = votesMap[playerId] || "";

  // Lasketaan dynaamiset prosentit ja odotustilat
  const totalSlots = totalPlayers;
  const votedCount = Object.keys(votesMap).length;
  const votedRatioPercent = Math.min(100, Math.round((votedCount / totalSlots) * 100));

  // --- LOPETUSNÄYTÖN TIEDOT JA MUUTTUJAT ---
  const scenario = lobbyData.scenarioId ? SCENARIO_MAP[lobbyData.scenarioId as keyof typeof SCENARIO_MAP] : null;
  const wasConfessed = lobbyData.status === "ending" && (lobbyData.confessed || false);

  const culpritPlayer = playerList.find((p: any) => p.role === "syyllinen");
  const syyllinenId = culpritPlayer?.id;

  // Äänestystulosten purku loppunäyttöä varten
  const voteValues = Object.values(votesMap);
  const voteCounts: Record<string, number> = {};
  playerList.forEach(p => { voteCounts[p.id] = 0; });
  for (const v of voteValues) {
    if (v) voteCounts[v] = (voteCounts[v] ?? 0) + 1;
  }

  let maxVotes = -1;
  let accusedId = "";
  Object.entries(voteCounts).forEach(([pid, count]) => {
    if (count > maxVotes) {
      maxVotes = count;
      accusedId = pid;
    }
  });

  const accusedPlayer = playerList.find(p => p.id === accusedId);
  const playerAchievementsMap = calculateAchievements(
    playerList.map((p: any) => ({
      id: p.id,
      name: p.name,
      role: p.role || "vieras",
      cluesFoundCount: p.cluesFoundCount || 0,
      sabotagesAttempted: p.sabotagesAttempted || 0
    })),
    votesMap
  );

  let titleText = "Mysteeri ratkeamatta";
  let descText = "Mökkiläiset eivät päässeet yhteisymmärrykseen äänestyksessä. Totuus hukkui myrskyyn.";
  let bgStyle = "from-slate-900 to-zinc-900";

  if (wasConfessed) {
    titleText = "Syyllinen murtui!";
    descText = `${culpritPlayer?.name || "Murhaaja"} ei kestänyt painetta vaan tunnusti teon kaikkien edessä. Oikeus toteutui katumuksen kautta.`;
    bgStyle = "from-red-950 to-slate-900";
  } else if (accusedPlayer?.role === "syyllinen") {
    titleText = "Etsivät voittivat!";
    descText = `Seurue äänesti oikein! ${accusedPlayer.name} todettiin syylliseksi ja hänet eristettiin odottamaan virkavaltaa.`;
    bgStyle = "from-emerald-950 to-slate-900";
  } else if (accusedPlayer) {
    titleText = "Syyllinen pakeni!";
    descText = `Karmea virhe! Seurue tuomitsi viattoman pelaajan (${accusedPlayer.name}). Oikea murhaaja hymyilee varjoissa vapaana.`;
    bgStyle = "from-amber-950 to-slate-900";
  }

  // --- RENDERÖINTI VAIHEEN MUKAAN ---
  if (lobbyData.status === "ending") {
    return (
      <div className="flex flex-col min-h-[85vh] w-full max-w-md mx-auto px-1 py-4 space-y-5 text-slate-100" style={{ fontFamily: "sans-serif" }}>
        {/* Tarinallinen lopputulosbanneri */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`bg-gradient-to-b ${bgStyle} border border-slate-800 rounded-2xl p-6 text-center shadow-2xl relative overflow-hidden`}>
          <span className="text-[10px] text-red-500 font-extrabold uppercase tracking-widest block mb-1">Pelin päätös</span>
          <h2 className="text-3xl font-black uppercase tracking-tight mb-2">{titleText}</h2>
          <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto italic">"{descText}"</p>
        </motion.div>

        {/* Skenaarion paljastus, motiivi ja taustat */}
        {scenario && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-md">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-800 pb-2">
              📖 Rikoksen Taustat & Motiivi
            </h3>
            <div className="space-y-1.5 text-xs">
              <p className="text-slate-300"><span className="font-bold text-slate-400">Murhatapa:</span> {scenario.method}</p>
              <p className="text-slate-300"><span className="font-bold text-slate-400">Salainen motiivi:</span> {scenario.motive}</p>
              <p className="text-slate-400 italic pt-1 border-t border-slate-800/40 leading-relaxed">"{scenario.hiddenSecret}"</p>
            </div>
          </div>
        )}
        {/* Äänten Jakautuminen */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <BarChart2 className="w-5 h-5 text-slate-400" />
            <h3 className="text-sm font-bold uppercase text-slate-100 tracking-wider">Äänten Jakautuminen</h3>
          </div>
          <div className="space-y-2.5">
            {playerList.map((p: any) => {
              const voters = Object.entries(votesMap)
                .filter(([voterId, targetId]) => targetId === p.id)
                .map(([voterId]) => {
                  const voterObj = playerList.find((x: any) => x.id === voterId);
                  return voterObj ? voterObj.name : "Mökkiläinen";
                });
              const isAccused = p.id === accusedId;
              return (
                <div key={p.id} className={`p-3.5 rounded-xl border ${isAccused ? "bg-red-950/20 border-red-500/40 text-slate-100" : "bg-slate-950 border-slate-800 text-slate-300"}`}>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-slate-200">{p.name}</span>
                      {isAccused && <span className="text-[9px] font-bold px-1.5 py-0.5 bg-red-900/30 text-red-400 rounded border border-red-900/50 uppercase leading-none">Syytetyin</span>}
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-300 bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded-md">{voters.length} ääntä</span>
                  </div>
                  <p className="text-[10px] text-slate-400 italic mt-1 leading-snug">
                    {voters.length > 0 ? `Äänestäjät: ${voters.join(", ")}` : "Ei yhtään epäilysääntä."}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Roolit ja Erikoispalkinnot */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-slate-400" />
            <h3 className="text-sm font-bold uppercase text-slate-100 tracking-wider">Roolit & Palkinnot</h3>
          </div>
          <div className="space-y-3.5">
            {playerList.map((p: any) => {
              const roleKey = p.role || "vieras";
              const roleInfo = ROLE_INFO[roleKey as keyof typeof ROLE_INFO] || ROLE_INFO.vieras;
              const achievements = playerAchievementsMap[p.id] || [];
              return (
                <div key={p.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-slate-300">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="block text-xs font-extrabold text-slate-200">{p.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">Etsinnät: {p.cluesFoundCount || 0} löydettyä vihjettä</span>
                    </div>
                    <span style={{ background: roleInfo.gradient, padding: '4px 10px', color: 'white', fontSize: '10px', fontWeight: 'bold', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>{roleInfo.name}</span>
                  </div>
                  {achievements.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-slate-900">
                      {achievements.map((achId) => {
                        const ach = ACHIEVEMENTS.find(a => a.id === achId);
                        if (!ach) return null;
                        return (
                          <div key={achId} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold bg-slate-900 border-slate-800 text-amber-400" title={ach.description}>
                            {getAchievementIcon(achId)}
                            <span>{ach.title}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Uusi peli -painike */}
        <div className="pt-2">
          {isSoloMode || isHost ? (
            <button type="button" onClick={handlePlayAgain} disabled={loading} className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-600 disabled:bg-slate-800 text-slate-100 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer border-none">
              <RotateCcw className="w-4 h-4" /> Luo uusi rinki & pelaa uudestaan!
            </button>
          ) : (
            <div className="text-center py-3 bg-slate-950 border border-slate-800 rounded-xl">
              <p className="text-xs text-slate-400 animate-pulse">Huoneen isäntä valmistelee seuraavaa pelikierrosta...<br /><span className="text-[10px] text-slate-600">Pysy linjoilla!</span></p>
            </div>
          )}
        </div>
      </div>
    );
  }
  // --- VARSINAINEN ÄÄNESTYSKÄYTTÖLIITTYMÄ ---
  const votingCandidates = playerList.filter((p: any) => p.id !== playerId);
  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] w-full max-w-md mx-auto px-4 py-8 text-slate-100" style={{ fontFamily: "sans-serif" }}>
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-600 via-purple-600 to-amber-600 animate-pulse" />
        <div className="text-center mb-6">
          <span className="text-[10px] text-red-500 font-extrabold uppercase tracking-widest block mb-1">VAIHE 3: RATKAISU</span>
          <h2 className="text-2xl font-black text-slate-100 uppercase tracking-tight flex items-center justify-center gap-1.5">
            <EyeOff className="w-6 h-6 text-slate-400" /> Salainen Äänestys
          </h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">Keskustele muiden pelaajien kanssa ja arvioi todisteiden painoarvoa. Kuka kantaa murhaajan taakkaa?</p>
        </div>

        {/* Edistymispalkki */}
        <div className="mb-6 bg-slate-950/80 border border-slate-800 px-4 py-3 rounded-xl">
          <div className="flex justify-between items-center text-xs text-slate-400 font-medium mb-1.5">
            <span>Annetut äänet:</span>
            <span className="font-mono text-slate-100 font-bold">{votedCount} / {totalSlots}</span>
          </div>
          <div className="w-full bg-slate-900 border border-slate-800 h-2.5 rounded-full overflow-hidden">
            <motion.div className="bg-emerald-500 h-full" initial={{ width: 0 }} animate={{ width: `${votedRatioPercent}%` }} transition={{ duration: 0.3 }} />
          </div>
        </div>

        {!hasVoted ? (
          <div className="space-y-4">
            <div>
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2.5">Valitse kenen epäilet tehneen rikoksen:</span>
              <div className="space-y-2">
                {votingCandidates.map((cand: any) => (
                  <button key={cand.id} type="button" onClick={() => handleVoteSubmit(cand.id)} disabled={loading} className="w-full p-3.5 bg-slate-950 border border-slate-800 hover:bg-red-950/20 hover:border-red-500/40 rounded-xl text-left font-bold text-slate-200 text-sm flex justify-between items-center transition-all cursor-pointer group border-none">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-slate-700 group-hover:bg-red-500 group-hover:scale-125 transition-all"></div>
                      <span>{cand.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-normal">Aseta Syytetyksi</span>
                  </button>
                ))}
              </div>
            </div>
            {myRole === "syyllinen" && (
              <div className="pt-4 border-t border-slate-800/60">
                <div className="p-4 bg-red-950/15 border border-red-500/20 rounded-xl text-center space-y-3">
                  <Skull className="w-6 h-6 text-red-500 mx-auto animate-bounce" />
                  <p className="text-xs text-red-300 leading-relaxed font-semibold">Olet syyllinen. Voit milloin tahansa antaa periksi, murtua ja vapaaehtoisesti tunnustaa teon käynnistääksesi dramaattisen katumus-lopun!</p>
                  <button type="button" onClick={handleConfessCrime} disabled={loading} className="px-4 py-2 bg-red-900 hover:bg-red-800 text-slate-100 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md font-semibold border-none">"Tunnusta teko" (Murtuminen)</button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-emerald-950 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
              <Check className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-md font-bold text-slate-200">Äänesi on annettu onnistuneesti!</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">Kuponkisi on rekisteröity salaisesti ja anonyymisti. Odotetaan, että loputkin seurueesta saavat päätöksensä tehtyä...</p>
            </div>
            {isSoloMode && <div className="text-[10px] text-slate-500 font-mono animate-pulse">Lasketaan simuloituja ääniä ja analysoidaan tuloksia...</div>}
          </div>
        )}
      </motion.div>
    </div>
  );
}
