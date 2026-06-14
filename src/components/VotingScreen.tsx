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
// --- LOPETUSNÄYTTÖ UPOTETTU SUORAAN TÄHÄN ---
interface EndingScreenProps {
  playerId: string;
  gameCode: string;
  isSoloMode: boolean;
  lobbyData: any;
  resultsData: any;
  onResetGame: () => void;
}

export function EndingScreen({
  playerId,
  gameCode,
  isSoloMode,
  lobbyData,
  resultsData,
  onResetGame
}: EndingScreenProps) {
  const players = Object.values(lobbyData.players || {}) as any[];
  const votes = resultsData?.votes || lobbyData.votes || {};
  const wasConfessed = resultsData?.confessed || lobbyData.confessed || false;

  const culpritPlayer = players.find((p: any) => p.role === "syyllinen");
  const syyllinenId = culpritPlayer?.id;

  // Käytetään aiemmin luotua achievements-laskentaa
  const voteValues = Object.values(votes);
  const voteCounts: Record<string, number> = {};
  for (const v of voteValues) {
    const vid = v as string;
    voteCounts[vid] = (voteCounts[vid] ?? 0) + 1;
  }

  // Selvitetään kuka sai eniten ääniä
  let maxVotes = 0;
  let accusedId = "";
  Object.entries(voteCounts).forEach(([pid, count]) => {
    if (count > maxVotes) {
      maxVotes = count;
      accusedId = pid;
    }
  });

  const accusedPlayer = players.find(p => p.id === accusedId);
  
  // Määritetään lopputulos tekstinä
  let titleText = "Mysteeri ratkeamatta";
  let descText = "Mökkiläiset eivät päässeet yhteisymmärrykseen äänestyksessä. Totuus hukkui myrskyyn.";
  let bgStyle = "from-slate-900 to-zinc-900";

  if (wasConfessed) {
    titleText = "Syyllinen murtui!";
    descText = `${culpritPlayer?.name || "Murhaaja"} ei kestänyt painetta vaan tunnusti teon kaikkien edessä. Oikeus toteutui katumuksen kautta.`;
    bgStyle = "from-red-950 to-slate-900";
  } else if (accusedPlayer?.role === "syyllinen") {
    titleText = "Etsivät voittivat!";
    descText = `Seurue äänesti oikein! ${accusedPlayer.name} todettiin syylliseksi ja hänet sidottiin odottamaan poliisin tuloa.`;
    bgStyle = "from-emerald-950 to-slate-900";
  } else if (accusedPlayer) {
    titleText = "Syyllinen pakeni!";
    descText = `Karmea virhe! Seurue tuomitsi viattoman pelaajan (${accusedPlayer.name}). Oikea murhaaja hymyilee varjoissa ja pääsee pälkähästä.`;
    bgStyle = "from-amber-950 to-slate-900";
  }
  // Valmistellaan tilastot saavutusten matemaattista laskentaa varten
  const playerStatsForAchievements = players.map((p: any) => ({
    id: p.id,
    name: p.name,
    role: p.role || "vieras",
    cluesFoundCount: p.cluesFoundCount || 0,
    sabotagesAttempted: p.sabotagesAttempted || 0
  }));

  // Lasketaan kaikille pelaajille heidän loppusaavutuksensa pelin perusteella
  const playerAchievementsMap = calculateAchievements(playerStatsForAchievements, votes);
  const handlePlayAgain = async () => {
    setLoading(true);
    if (isSoloMode) {
      onResetGame();
    } else {
      if (myPlayer?.isHost) {
        try {
          const { set } = await import("firebase/database");
          const roomRef = ref(db, `rooms/${gameCode}`);
          
          const resetPlayers: Record<string, any> = {};
          players.forEach((p: any) => {
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
          console.warn("Huoneen nollaus tietokannassa epäonnistui", err);
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
      default:
        return <Star className="w-4 h-4 text-amber-400" />;
    }
  };
  return (
    <div className="flex flex-col min-h-[85vh] w-full max-w-md mx-auto px-1 py-4 space-y-5 text-slate-100" style={{ fontFamily: "sans-serif" }}>
      {/* Tarinallinen lopputulosbanneri upotettuna */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-gradient-to-b ${bgStyle} border border-slate-800 rounded-2xl p-6 text-center shadow-2xl relative overflow-hidden`}
      >
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
        <span className="text-[10px] text-red-500 font-extrabold uppercase tracking-widest block mb-1">Pelin päätös</span>
        <h2 className="text-3xl font-black uppercase tracking-tight mb-2">{titleText}</h2>
        <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto italic">"{descText}"</p>
      </motion.div>

      {/* Skenaarion paljastus, motiivi ja tehtävien yhteenveto upotettuna */}
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

      {/* Epäilyksien ja sormenosoitusten jakautuminen (Äänestystulokset) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md">
        <div className="flex items-center gap-2 mb-3">
          <BarChart2 className="w-5 h-5 text-slate-400" />
          <h3 className="text-sm font-bold uppercase text-slate-100 tracking-wider">
            Äänten Jakautuminen
          </h3>
        </div>

        <div className="space-y-2.5">
          {players.map((p: any) => {
            const voters = Object.entries(votes)
              .filter(([voterId, votedId]) => votedId === p.id)
              .map(([voterId]) => {
                const voterObj = players.find((x: any) => x.id === voterId);
                return voterObj ? voterObj.name : "Mökkiläinen";
              });

            const isAccused = p.id === accusedId;

            return (
              <div 
                key={p.id} 
                className={`p-3.5 rounded-xl border ${
                  isAccused 
                    ? "bg-red-950/20 border-red-500/40 text-slate-100" 
                    : "bg-slate-950 border-slate-800 text-slate-300"
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-slate-200">{p.name}</span>
                    {isAccused && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 bg-red-900/30 text-red-400 rounded border border-red-900/50 uppercase leading-none">
                        Äänestetyin syytetty
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-300 bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded-md">
                    {voters.length} ääntä
                  </span>
                </div>
                {voters.length > 0 ? (
                  <p className="text-[10px] text-slate-400 italic mt-1 leading-snug">
                    Äänestäjät: {voters.join(", ")}
                  </p>
                ) : (
                  <p className="text-[10px] text-slate-500 italic mt-1 leading-snug">
                    Ei yhtään epäilysääntä.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Kaikkien pelaajien roolien paljastus ja erikoispalkinnot (Achievements) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-5 h-5 text-slate-400" />
          <h3 className="text-sm font-bold uppercase text-slate-100 tracking-wider">
            Roolit ja Erikoispalkinnot
          </h3>
        </div>
        <div className="space-y-3.5">
          {players.map((p: any) => {
            const roleKey = p.role || "vieras";
            const roleInfo = ROLE_INFO[roleKey as keyof typeof ROLE_INFO] || ROLE_INFO.vieras;
            const achievements = playerAchievementsMap[p.id] || [];

            return (
              <div key={p.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-slate-300">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="block text-xs font-extrabold text-slate-200">
                      {p.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Etsinnät: {p.cluesFoundCount || 0} löydettyä vihjettä
                    </span>
                  </div>
                  <span 
                    style={{ background: roleInfo.gradient, padding: '4px 10px', color: 'white', fontSize: '10px', fontWeight: 'bold', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    {roleInfo.name}
                  </span>
                </div>

                {/* Saavutuspalluraosio */}
                {achievements.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-slate-900">
                    {achievements.map((achId) => {
                      const ach = ACHIEVEMENTS.find(a => a.id === achId);
                      if (!ach) return null;
                      return (
                        <div 
                          key={achId}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold bg-slate-900 border-slate-800 text-amber-400"
                          title={ach.description}
                        >
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

      {/* Pelaa uudestaan -nappi tai odotusteksti */}
      <div className="pt-2">
        {isSoloMode || isHost ? (
          <button
            type="button"
            onClick={handlePlayAgain}
            disabled={loading}
            className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-600 disabled:bg-slate-800 text-slate-100 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-all cursor-pointer border-none"
          >
            <RotateCcw className="w-4 h-4" />
            Luo uusi rinki & pelaa uudestaan!
          </button>
        ) : (
          <div className="text-center py-3 bg-slate-950 border border-slate-800 rounded-xl">
            <p className="text-xs text-slate-400 animate-pulse">
              Huoneen isäntä valmistelee seuraavaa pelikierrosta...
              <br />
              <span className="text-[10px] text-slate-600">Pysy linjoilla!</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
