import React, { useState, useEffect } from "react";
import { Key, Lock, Compass, Terminal, ExternalLink, ShieldAlert, Activity, HelpCircle, ArrowLeft } from "lucide-react";
import LobbyScreen from "./LobbyScreen";
import RoleRevealScreen from "./RoleRevealScreen";
import MapScreen from "./MapScreen";
import VotingScreen from "./VotingScreen";
import KaartjarviMap from "./KaartjarviMap";

export default function App() {
  const [mode, setMode] = useState<"menu" | "multiplayer" | "kaartjarvi">("menu");
  const [playerName, setPlayerName] = useState("");
  const [gameCode, setGameCode] = useState("");
  const [isSoloMode, setIsSoloMode] = useState(false);
  const [lobbyData, setLobbyData] = useState<any>(null);
  const [resultsData, setResultsData] = useState<any>(null);
  const [gameState, setGameState] = useState<"lobby" | "reveal" | "investigation" | "voting">("lobby");
  
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [simulatedAir, setSimulatedAir] = useState(100);
  const [playerId] = useState(() => "p_" + Math.random().toString(36).substr(2, 9));

  useEffect(() => {
    const logs = [
      "SYSTEM INIT: Lopen Salaisuudet Launcher active...",
      "LOADING: Asset management framework...",
      "STATUS: Ready to pipe location vectors.",
      "LOCATION DATA: Loppi Kirkonkylä, Finland"
    ];
    setTerminalLogs(logs);

    const interval = setInterval(() => {
      setSimulatedAir((prev) => (prev > 5 ? prev - 1 : 100));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const handleGameStarted = (data: any) => {
    setLobbyData(data);
    setGameState("reveal");
  };

  const handleResetGame = () => {
    setGameCode(""); setLobbyData(null); setResultsData(null);
    setGameState("lobby"); setMode("menu"); setIsSoloMode(false);
  };

  if (mode === "kaartjarvi" && playerName.trim()) {
    return <KaartjarviMap playerName={playerName} onExitGame={handleResetGame} />;
  }

  const menuContainerStyle: React.CSSProperties = {
    minHeight: "100vh", backgroundColor: "#020617", color: "#cbd5e1",
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", boxSizing: "border-box"
  };

  const menuCardStyle: React.CSSProperties = {
    backgroundColor: "#0f172a", border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "20px", padding: "40px 32px", maxWidth: "480px", width: "100%",
    boxShadow: "0 20px 40px -15px rgba(0,0,0,0.5)", textAlign: "center", boxSizing: "border-box"
  };

  const menuTitleStyle: React.CSSProperties = { fontSize: "32px", fontWeight: 900, color: "#ffffff", margin: "0 0 8px 0" };

  const menuButtonStyle = (disabled: boolean, variant: "multi" | "solo" | "vr" | "laby"): React.CSSProperties => ({
    width: "100%", padding: "16px", margin: "8px 0",
    backgroundColor: disabled ? "#1e293b" : (variant === "multi" ? "#4f46e5" : (variant === "vr" ? "#db2777" : (variant === "laby" ? "#6366f1" : "#10b981"))),
    border: "none", borderRadius: "12px", color: "#ffffff", fontSize: "14px", fontWeight: "bold",
    cursor: disabled ? "not-allowed" : "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
    opacity: disabled ? 0.4 : 1
  });
  // --- RENDELÖINTI NÄKYMIEN MUKAAN ---

  const isNameEmpty = !playerName.trim();
  
  return (
    <div style={menuContainerStyle}>
      <div style={menuCardStyle}>
        <div style={{ fontSize: "40px", marginBottom: "12px" }}>🌲🏡🔍</div>
        <h1 style={menuTitleStyle}>Mökkimysteeri</h1>
        <p style={{ fontSize: "14px", color: "#94a3b8", margin: "0 0 24px 0", lineHeight: "1.5" }}>
          Tervetuloa! Kirjoita alta etsivän nimesi, ja valitse sen jälkeen haluamasi rikostapaus tai pelitila.
        </p>

        {/* NIMIKENTTÄ */}
        <div style={{ marginBottom: "24px", textAlign: "left" }}>
          <label style={{ display: "block", fontSize: "11px", fontWeight: "bold", color: "#94a3b8", textTransform: "uppercase", marginBottom: "6px", letterSpacing: "0.05em" }}>
            Etsivän / Pelaajan nimi
          </label>
          <input 
            type="text"
            placeholder="Kirjoita nimesi tähän..."
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            style={{ width: "100%", padding: "12px", backgroundColor: "#020617", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px", color: "#ffffff", fontSize: "14px", textAlign: "center", fontWeight: "bold", boxSizing: "border-box" }}
          />
        </div>

        {/* JAKO-OSIO YKSINPELEILLE */}
        <div style={{ textAlign: "left", margin: "16px 0 8px 0", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "6px" }}>
          <span style={{ fontSize: "11px", fontWeight: "bold", color: "#fbbf24", textTransform: "uppercase", letterSpacing: "0.05em" }}>🕵️‍♂️ Yksinpelitapaukset</span>
        </div>

        <button 
          disabled={isNameEmpty}
          onClick={() => setMode("kaartjarvi")}
          style={menuButtonStyle(isNameEmpty, "solo")}
        >
          <span>Osa 1: Huvilan Varjot</span>
          <span style={{ fontSize: "11px", fontWeight: "normal", color: isNameEmpty ? "#64748b" : "#a7f3d0" }}>Ratkaise Kaartjärven huvilan murha</span>
        </button>

        {/* UUSI LOPEN SEIKKAILU -PAINIKE */}
        <button 
          disabled={isNameEmpty}
          onClick={() => { window.location.href = "/labyrintti.html"; }}
          style={menuButtonStyle(isNameEmpty, "laby")}
        >
          <span>🎮 Osa 4: Lopen Salaisuudet</span>
          <span style={{ fontSize: "11px", fontWeight: "normal", color: isNameEmpty ? "#64748b" : "#c7d2fe" }}>Uusi eloisa maisemaseikkailu Lopen kirkonkylässä</span>
        </button>

        {/* JAKO-OSIO NEXT-GEN VR-PELILLE */}
        <div style={{ textAlign: "left", margin: "24px 0 8px 0", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "6px" }}>
          <span style={{ fontSize: "11px", fontWeight: "bold", color: "#ec4899", textTransform: "uppercase", letterSpacing: "0.05em" }}>🥽 Virtuaalitodellisuus 3D</span>
        </div>

        <button 
          disabled={isNameEmpty}
          onClick={() => { window.location.href = "/vr.html"; }}
          style={menuButtonStyle(isNameEmpty, "vr")}
        >
          <span>🥽 Avaa Ultra-VR-Pakohuone</span>
          <span style={{ fontSize: "11px", fontWeight: "normal", color: isNameEmpty ? "#64748b" : "#fbcfe8" }}>Mikaelin aito kivikellari Meta Questille</span>
        </button>

        {/* JAKO-OSIO SEURAPELILLE */}
        <div style={{ textAlign: "left", margin: "24px 0 8px 0", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "6px" }}>
          <span style={{ fontSize: "11px", fontWeight: "bold", color: "#818cf8", textTransform: "uppercase", letterSpacing: "0.05em" }}>👥 Seurapeli</span>
        </div>

        <button 
          disabled={isNameEmpty}
          onClick={() => setMode("multiplayer")}
          style={menuButtonStyle(isNameEmpty, "multi")}
        >
          <span>👥 Klassinen Moninpeli</span>
          <span style={{ fontSize: "11px", fontWeight: "normal", color: isNameEmpty ? "#64748b" : "#c7d2fe" }}>Pelaa ryhmässä ystävien kanssa</span>
        </button>

      </div>
    </div>
  );
}
