import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { db } from "./firebase"; // KORJATTU: polku juureen
import { ref, set, onValue, update } from "firebase/database";
import { pickRandomScenario } from "../utils/scenarios";
import { assignRoles } from "../utils/roles";
import { Users, Copy, Check, Play, Compass } from "lucide-react";

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
  const [inputCode, setInputCode] = useState(gameCode || "");
  const [inLobby, setInLobby] = useState(false);
  const [lobbyPlayers, setLobbyPlayers] = useState<any[]>([]);
  const [isHost, setIsHost] = useState(false);
  const [copied, setCopied] = useState(false);
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
    }, (error) => {
      console.warn("Firebase synkronointivirhe:", error);
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
      const simulatedPlayers = [
        hostPlayer,
        { id: "ai_1", name: "Kalle (Bot)", isHost: false, isAI: true, cluesFoundCount: 0, sabotagesAttempted: 0 },
        { id: "ai_2", name: "Sanna (Bot)", isHost: false, isAI: true, cluesFoundCount: 0, sabotagesAttempted: 0 },
        { id: "ai_3", name: "Ville (Bot)", isHost: false, isAI: true, cluesFoundCount: 0, sabotagesAttempted: 0 },
        { id: "ai_4", name: "Laura (Bot)", isHost: false, isAI: true, cluesFoundCount: 0, sabotagesAttempted: 0 }
      ];
      setLobbyPlayers(simulatedPlayers);
      setIsHost(true);
      setInLobby(true);
    } else {
      try {
        const roomRef = ref(db, `rooms/${code}`);
        const initialRoom = {
          code: code,
          status: "lobby",
          scenarioId: pickRandomScenario().id,
          players: {
            [playerId]: { id: playerId, name: finalName, isHost: true, cluesFoundCount: 0, sabotagesAttempted: 0 }
          },
          createdAt: Date.now()
        };
        await set(roomRef, initialRoom);
        setIsHost(true);
        setInLobby(true);
      } catch (err: any) {
        setErrorMessage("Firebase-yhteysvirhe. Voit pelata Solona: " + err.message);
      }
    }
    setLoading(false);
  };

  const handleJoinGame = async () => {
    if (!inputName.trim()) {
      setErrorMessage("Syötä nimi ensin!");
      return;
    }
    if (!inputCode.trim()) {
      setErrorMessage("Syötä 4-merkkinen pelikoodi!");
      return;
    }
    setLoading(true);
    setErrorMessage("");
    const finalName = inputName.trim();
    const finalCode = inputCode.trim().toUpperCase();
    setPlayerName(finalName);
    setIsSoloMode(false);

    try {
      const newPlayer = { id: playerId, name: finalName, isHost: false, cluesFoundCount: 0, sabotagesAttempted: 0 };
      await set(ref(db, `rooms/${finalCode}/players/${playerId}`), newPlayer);
      setGameCode(finalCode);
      setIsHost(false);
      setInLobby(true);
    } catch (err: any) {
      setErrorMessage("Pelikoodia ei löytynyt tai yhteys epäonnistui. Varmista koodi!");
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(gameCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartGame = async () => {
    if (lobbyPlayers.length < 4) {
      setErrorMessage("Mysteeri vaatii vähintään 4 pelaajaa roolijakoa varten!");
      return;
    }

    const playerIds = lobbyPlayers.map(p => p.id);
    const assigned = assignRoles(playerIds);
    const scenario = pickRandomScenario();

    if (isSoloMode) {
      const updatedPlayers: Record<string, any> = {};
      lobbyPlayers.forEach(p => {
        updatedPlayers[p.id] = { ...p, role: assigned[p.id] };
      });

      onGameStarted({
        code: gameCode,
        status: "reveal",
        scenarioId: scenario.id,
        players: updatedPlayers,
        stageStartTime: Date.now()
      });
    } else {
      try {
        const updates: Record<string, any> = {};
        lobbyPlayers.forEach(p => {
          updates[`rooms/${gameCode}/players/${p.id}/role`] = assigned[p.id];
        });
        updates[`rooms/${gameCode}/status`] = "reveal";
        updates[`rooms/${gameCode}/scenarioId`] = scenario.id;
        updates[`rooms/${gameCode}/stageStartTime`] = Date.now();

        await update(ref(db), updates);
      } catch (err: any) {
        setErrorMessage("Käynnistys epäonnistui: " + err.message);
      }
    }
  };

  const handleLeaveLobby = () => {
    setInLobby(false);
    setLobbyPlayers([]);
    setIsHost(false);
  };
  return (
    <div className="screen screen--center" style={{ width: '100%', maxWidth: '450px', margin: '0 auto', padding: '20px', color: 'white' }}>
      {!inLobby ? (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#141e2e', border: '1px solid #243352', padding: '25px', borderRadius: '16px', textAlign: 'center' }}>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ padding: '12px', background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '12px', display: 'inline-block' }}>
              <Compass style={{ width: '32px', height: '32px', color: '#ef4444' }} />
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: 'bold', margin: '10px 0 0 0' }}>Murhamysteeri Mökillä</h1>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left' }}>
            <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#7a8fb5' }}>NIMIMERKKISI</label>
            <input type="text" placeholder="Kirjoita oma nimesi..." value={inputName} onChange={(e) => setInputName(e.target.value)} style={{ width: '100%', padding: '12px', background: '#0b1120', border: '1px solid #243352', borderRadius: '8px', color: 'white', fontSize: '15px' }} />
            <button onClick={() => handleCreateGame(false)} style={{ background: '#dc2626', color: 'white', padding: '12px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Luo uusi live-peli 🌐</button>
            <button onClick={() => handleCreateGame(true)} style={{ background: '#1e293b', color: '#e2e8f6', padding: '10px', border: '1px solid #243352', borderRadius: '8px', cursor: 'pointer' }}>Kokeile heti yksin (AI Botit) 🤖</button>
            <input type="text" placeholder="4-merkkinen koodi" maxLength={4} value={inputCode} onChange={(e) => setInputCode(e.target.value)} style={{ width: '100%', padding: '12px', background: '#0b1120', border: '1px solid #243352', borderRadius: '8px', color: 'white', textTransform: 'uppercase', textAlign: 'center' }} />
            <button onClick={handleJoinGame} style={{ background: '#2563eb', color: 'white', padding: '12px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Liity peliin</button>
            {errorMessage && <p style={{ color: '#ef4444', fontSize: '13px', textAlign: 'center' }}>⚠️ {errorMessage}</p>}
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ background: '#141e2e', border: '1px solid #243352', padding: '25px', borderRadius: '16px', textAlign: 'center' }}>
          <h2>Odotushuone livenä</h2>
          <div style={{ background: '#0b1120', padding: '15px', borderRadius: '12px', margin: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>{gameCode}</span>
            <button onClick={copyToClipboard} style={{ background: '#1a2540', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}>{copied ? "Kopioitu!" : "Kopioi"}</button>
          </div>
          <div style={{ textAlign: 'left', marginBottom: '20px' }}>
            <h3>👤 Paikalla seurueessa ({lobbyPlayers.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {lobbyPlayers.map((p, idx) => (
                <div key={idx} style={{ background: '#0b1120', padding: '10px 12px', borderRadius: '8px', border: '1px solid #243352', display: 'flex', justifyContent: 'space-between' }}>
                  <span>👤 {p.name}</span>
                  {p.isHost && <span style={{ color: '#f59e0b', fontSize: '11px', fontWeight: 'bold' }}>Isäntä</span>}
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleLeaveLobby} style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '12px', borderRadius: '8px', flex: 1, cursor: 'pointer' }}>Poistu</button>
            {isHost && <button onClick={handleStartGame} style={{ background: '#22c55e', color: 'white', padding: '12px', border: 'none', borderRadius: '8px', flex: 2, fontWeight: 'bold', cursor: 'pointer' }}>Aloita peli</button>}
          </div>
        </motion.div>
      )}
    </div>
  );
}
