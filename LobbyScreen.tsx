import React, { useState } from "react";
import { db } from "./firebase";
import { ref, set, onValue, update } from "firebase/database";
import { assignRoles } from "./roles";
import { Users, Copy, Check, Play, Compass } from "lucide-react";
import KaartjarviMap from "./KaartjarviMap";

const pickRandomScenario = () => {
  return Math.floor(Math.random() * 3) + 1;
};

interface LobbyScreenProps {
  playerId: string;
  playerName: string;
  setPlayerName: (name: string) => void;
  gameCode: string;
  setGameCode: (code: string) => void;
  isSoloMode: boolean;
  setIsSoloMode: (solo: boolean) => void;
  onGameStarted: (data: any) => void;
}

export default function LobbyScreen({
  playerId,
  playerName,
  setPlayerName,
  gameCode,
  setGameCode,
  isSoloMode,
  setIsSoloMode,
  onGameStarted,
}: LobbyScreenProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // Jos pelaaja valitsee yksinpelin, ohjataan hänet suoraan uuteen pelimoottoriin
  const [startSoloAdventure, setStartSoloAdventure] = useState(false);

  if (startSoloAdventure && playerName.trim()) {
    return (
      <KaartjarviMap 
        playerName={playerName}
        onExitGame={() => {
          setStartSoloAdventure(false);
          setIsSoloMode(false);
        }}
      />
    );
  }
  const handleCreateGame = async () => {
    if (!playerName.trim()) {
      setError("Kirjoita ensin nimesi!");
      return;
    }
    
    if (isSoloMode) {
      setStartSoloAdventure(true);
      return;
    }

    setLoading(true);
    setError("");
    const code = Math.random().toString(36).substring(2, 6).toUpperCase();
    setGameCode(code);

    try {
      const lobbyRef = ref(db, `lobbies/${code}`);
      const initialData = {
        code,
        status: "lobby",
        createdAt: Date.now(),
        scenarioId: pickRandomScenario(),
        players: {
          [playerId]: {
            id: playerId,
            name: playerName,
            isHost: true,
            ready: true,
          },
        },
      };
      await set(lobbyRef, initialData);
      
      onValue(lobbyRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          onGameStarted(data);
        }
      });
    } catch (err) {
      setError("Pelin luominen epäonnistui. Tarkista Firebase-yhteys.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGame = async () => {
    if (!playerName.trim() || !gameCode.trim()) {
      setError("Täytä sekä nimesi että pelikoodi!");
      return;
    }
    setLoading(true);
    setError("");
    const code = gameCode.trim().toUpperCase();

    try {
      const lobbyRef = ref(db, `lobbies/${code}`);
      onValue(lobbyRef, async (snapshot) => {
        const data = snapshot.val();
        if (!data) {
          setError("Pelihuonetta ei löytynyt!");
          setLoading(false);
          return;
        }
        if (data.status !== "lobby") {
          setError("Peli on jo alkanut!");
          setLoading(false);
          return;
        }
        
        const playerRef = ref(db, `lobbies/${code}/players/${playerId}`);
        await set(playerRef, {
          id: playerId,
          name: playerName,
          isHost: false,
          ready: true,
        });
      }, { onlyOnce: true });
    } catch (err) {
      setError("Huoneeseen liittyminen epäonnistui.");
      setLoading(false);
    }
  };

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    padding: "20px",
    boxSizing: "border-box"
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: "#0f172a",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "16px",
    padding: "32px 24px",
    maxWidth: "420px",
    width: "100%",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
    boxSizing: "border-box"
  };
  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <span style={{ fontSize: "40px", display: "block", marginBottom: "8px" }}>🏡🔍</span>
          <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#ffffff", margin: 0 }}>Mökkimysteeri</h2>
          <p style={{ fontSize: "13px", color: "#64748b", margin: "4px 0 0 0" }}>Etsi todisteet ja paljasta murhaaja</p>
        </div>

        {error && (
          <div style={{ padding: "10px", backgroundColor: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "8px", color: "#f87171", fontSize: "12px", marginBottom: "16px", textAlign: "center" }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: "bold", color: "#94a3b8", textTransform: "uppercase", marginBottom: "6px" }}>Pelaajan nimi</label>
            <input
              type="text"
              placeholder="Kirjoita nimesi..."
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              style={{ width: "100%", padding: "10px", backgroundColor: "#020617", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#ffffff", fontSize: "14px", boxSizing: "border-box" }}
            />
          </div>

          {/* YKSINPELIN VALINTAPAINIKE */}
          <div 
            onClick={() => setIsSoloMode(!isSoloMode)}
            style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px", backgroundColor: isSoloMode ? "rgba(245, 158, 11, 0.1)" : "rgba(255,255,255,0.02)", border: isSoloMode ? "1px solid #f59e0b" : "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", cursor: "pointer", transition: "all 0.2s" }}
          >
            <span style={{ fontSize: "20px" }}>🕵️‍♂️</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "13px", fontWeight: "bold", color: isSoloMode ? "#f59e0b" : "#ffffff" }}>Pelaa yksinpelinä</div>
              <div style={{ fontSize: "11px", color: "#64748b" }}>Kaartjärven Huvilan Varjot -tarina</div>
            </div>
            <input type="checkbox" checked={isSoloMode} readOnly style={{ cursor: "pointer" }} />
          </div>

          {!isSoloMode && (
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: "bold", color: "#94a3b8", textTransform: "uppercase", marginBottom: "6px" }}>Pelikoodi (Liity huoneeseen)</label>
              <input
                type="text"
                placeholder="Esim. AB12"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                style={{ width: "100%", padding: "10px", backgroundColor: "#020617", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#ffffff", fontSize: "14px", textTransform: "uppercase", boxSizing: "border-box" }}
              />
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
            <button
              onClick={handleCreateGame}
              disabled={loading}
              style={{ width: "100%", padding: "12px", backgroundColor: isSoloMode ? "#f59e0b" : "#4f46e5", color: "#ffffff", border: "none", borderRadius: "8px", fontWeight: "bold", fontSize: "14px", cursor: "pointer", opacity: loading ? 0.7 : 1 }}
            >
              {isSoloMode ? "Aloita tarinaseikkailu" : "Luo uusi pelihuone"}
            </button>

            {!isSoloMode && (
              <button
                onClick={handleJoinGame}
                disabled={loading}
                style={{ width: "100%", padding: "12px", backgroundColor: "#1e293b", color: "#ffffff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontWeight: "bold", fontSize: "14px", cursor: "pointer", opacity: loading ? 0.7 : 1 }}
              >
                Liity huoneeseen koodilla
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
