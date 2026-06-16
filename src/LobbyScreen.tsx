import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { db } from "./firebase";
import { ref, set, onValue, update } from "firebase/database";
import { pickRandomScenario } from "./utils/scenarios";
import { assignRoles } from "./utils/roles";
import { Compass, Users, Play } from "lucide-react";

interface LobbyScreenProps {
  playerId: string;
  playerName: string;
  setPlayerName: (name: string) => void;
  gameCode: string;
  setGameCode: (code: string) => void;
  isSoloMode: boolean;
  setIsSoloMode: (solo: boolean) => void;
  onGameStarted: (lobbyData: any) => void;
}

export default function LobbyScreen({
  playerId,
  playerName,
  setPlayerName,
  gameCode,
  setGameCode,
  isSoloMode,
  setIsSoloMode,
  onGameStarted
}: LobbyScreenProps) {
  const [inputName, setInputName] = useState(playerName || "");
  const [inLobby, setInLobby] = useState(false);
  const [lobbyPlayers, setLobbyPlayers] = useState<any[]>([]);
  const [isHost, setIsHost] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const generateRoomCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 4; i++) { 
      code += chars.charAt(Math.floor(Math.random() * chars.length)); 
    }
    return code;
  };

  useEffect(() => {
    if (!inLobby || !gameCode || isSoloMode) return;
    const roomRef = ref(db, `rooms/${gameCode}`);
    const unsubscribe = onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        if (data.status === "reveal") { 
          onGameStarted(data); 
          return; 
        }
        const playersList = Object.values(data.players || {}) as any[];
        setLobbyPlayers(playersList);
        const me = playersList.find((p: any) => p.id === playerId);
        if (me?.isHost) setIsHost(true);
      } else {
        setErrorMessage("Huonetta ei enää löytynyt.");
        setInLobby(false);
      }
    });
    return () => unsubscribe();
  }, [inLobby, gameCode, isSoloMode, playerId, onGameStarted]);

  const handleCreateGame = async (solo: boolean) => {
    if (!inputName.trim()) { 
      setErrorMessage("Syötä nimi ensin!"); 
      return; 
    }
    setLoading(true); 
    setErrorMessage("");
    const finalName = inputName.trim(); 
    setPlayerName(finalName); 
    setIsSoloMode(solo);
    const code = generateRoomCode(); 
    setGameCode(code);

    if (solo) {
      const hostPlayer = { id: playerId, name: finalName, isHost: true, cluesFoundCount: 0, sabotagesAttempted: 0 };
      setLobbyPlayers([
        hostPlayer,
        { id: "ai_1", name: "Kalle (Bot)", isHost: false, isAI: true, cluesFoundCount: 0, sabotagesAttempted: 0 },
        { id: "ai_2", name: "Sanna (Bot)", isHost: false, isAI: true, cluesFoundCount: 0, sabotagesAttempted: 0 },
        { id: "ai_3", name: "Ville (Bot)", isHost: false, isAI: true, cluesFoundCount: 0, sabotagesAttempted: 0 }
      ]);
      setIsHost(true); 
      setInLobby(true);
    } else {
      try {
        await set(ref(db, `rooms/${code}`), {
          code, 
          status: "lobby", 
          scenarioId: pickRandomScenario().id,
          players: { [playerId]: { id: playerId, name: finalName, isHost: true, cluesFoundCount: 0, sabotagesAttempted: 0 } },
          createdAt: Date.now()
        });
        setIsHost(true); 
        setInLobby(true);
      } catch (err: any) { 
        setErrorMessage("Virhe: " + err.message); 
      }
    }
    setLoading(false);
  };

  const handleStartSoloGame = () => {
    const assigned = assignRoles(lobbyPlayers.map(p => p.id));
    const finalPlayers: Record<string, any> = {};
    
    lobbyPlayers.forEach(p => {
      finalPlayers[p.id] = {
        ...p,
        role: assigned[p.id]
      };
    });

    const mockLobbyData = {
      code: gameCode,
      status: "reveal",
      scenarioId: pickRandomScenario().id,
      players: finalPlayers
    };
    onGameStarted(mockLobbyData);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] w-full max-w-md mx-auto px-4 py-8 text-slate-100" style={{ fontFamily: "sans-serif" }}>
      {!inLobby ? (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="w-full bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center space-y-4 shadow-2xl">
          <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-full w-fit mx-auto">
            <Compass className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight">Murhamysteeri Mökillä</h1>
          <input 
            type="text" 
            placeholder="Kirjoita oma nimesi..." 
            value={inputName} 
            onChange={(e) => setInputName(e.target.value)} 
            className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm text-center focus:outline-none focus:border-red-500" 
          />
          <button 
            type="button" 
            disabled={loading}
            onClick={() => handleCreateGame(false)} 
            className="w-full py-2.5 bg-red-700 hover:bg-red-600 text-slate-100 font-bold rounded-xl text-sm border-none cursor-pointer transition-colors disabled:opacity-50"
          >
            {loading ? "Luodaan..." : "Luo uusi live-peli 🌐"}
          </button>
          <button 
            type="button" 
            disabled={loading}
            onClick={() => handleCreateGame(true)} 
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold rounded-xl text-xs border-none cursor-pointer transition-colors disabled:opacity-50"
          >
            Kokeile yksin (AI Botit) 🤖
          </button>
          {errorMessage && <p className="text-xs text-red-400">⚠️ {errorMessage}</p>}
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center space-y-4 shadow-2xl">
          <div className="flex items-center justify-center gap-2 text-red-500 font-bold">
            <Users className="w-5 h-5" />
            <h2 className="text-lg font-bold">
              {isSoloMode ? "Bot-pelin odotushuone" : `Odotushuone livenä (${gameCode})`}
            </h2>
          </div>
          <div className="space-y-2 text-left bg-slate-950 p-4 rounded-xl border border-slate-800 max-h-48 overflow-y-auto">
            {lobbyPlayers.map((p, idx) => (
              <div key={idx} className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 py-0.5">
                <span>👤</span> 
                <span>{p.name}</span> 
                {p.isHost && <span className="text-[10px] bg-red-950 text-red-400 px-1.5 py-0.5 rounded border border-red-900/40">Isäntä</span>}
              </div>
            ))}
          </div>
          {isHost && (
            <button 
              type="button" 
              onClick={async () => {
                if (isSoloMode) {
                  handleStartSoloGame();
                } else {
                  const assigned = assignRoles(lobbyPlayers.map(p => p.id));
                  const updates: Record<string, any> = {};
                  lobbyPlayers.forEach(p => { 
                    updates[`rooms/${gameCode}/players/${p.id}/role`] = assigned[p.id]; 
                  });
                  updates[`rooms/${gameCode}/status`] = "reveal";
                  updates[`rooms/${gameCode}/scenarioId`] = pickRandomScenario().id;
                  await update(ref(db), updates);
                }
              }} 
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-100 font-bold rounded-xl text-sm border-none cursor-pointer shadow-lg transition-colors flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              <span>Aloita peli 🚀</span>
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}
