import React, { useState } from "react";
import LobbyScreen from "./LobbyScreen";
import RoleRevealScreen from "./RoleRevealScreen";
import MapScreen from "./MapScreen";
import VotingScreen from "./VotingScreen";
import KaartjarviMap from "./KaartjarviMap";

export default function App() {
  const [mode, setMode] = useState<"menu" | "multiplayer" | "kaartjarvi">("menu");
  const [playerId] = useState(() => "p_" + Math.random().toString(36).substr(2, 9));
  const [playerName, setPlayerName] = useState("");
  const [gameCode, setGameCode] = useState("");
  const [isSoloMode, setIsSoloMode] = useState(false);
  const [lobbyData, setLobbyData] = useState<any>(null);
  const [resultsData, setResultsData] = useState<any>(null);
  const [gameState, setGameState] = useState<"lobby" | "reveal" | "investigation" | "voting">("lobby");

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

  const menuButtonStyle = (disabled: boolean, variant: "multi" | "solo"): React.CSSProperties => ({
    width: "100%", padding: "16px", margin: "8px 0",
    backgroundColor: disabled ? "#1e293b" : (variant === "multi" ? "#4f46e5" : "#10b981"),
    border: "none", borderRadius: "12px", color: "#ffffff", fontSize: "14px", fontWeight: "bold",
    cursor: disabled ? "not-allowed" : "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
    opacity: disabled ? 0.4 : 1
  });
