import React, { useState } from "react";
import LobbyScreen from "./LobbyScreen";
import RoleRevealScreen from "./RoleRevealScreen";
import MapScreen from "./MapScreen";
import VotingScreen from "./VotingScreen";
import KaartjarviMap from "./KaartjarviMap";

export default function App() {
  // Pelitila laajennettu sisältämään päävalikon ("menu"), moninpelin ("multiplayer") ja yksinpelin ("kaartjarvi")
  const [mode, setMode] = useState<"menu" | "multiplayer" | "kaartjarvi">("menu");
  
  // Pelaajan anonyymi ID ja valitut perustiedot
  const [playerId] = useState(() => "p_" + Math.random().toString(36).substr(2, 9));
  const [playerName, setPlayerName] = useState("");
  const [gameCode, setGameCode] = useState("");
  const [isSoloMode, setIsSoloMode] = useState(false);
  const [lobbyData, setLobbyData] = useState<any>(null);
  const [resultsData, setResultsData] = useState<any>(null);

  // Moninpelin sisäinen tila: "lobby" (aloitusruutu), "reveal", "investigation", "voting"
  const [gameState, setGameState] = useState<"lobby" | "reveal" | "investigation" | "voting">("lobby");

  const handleGameStarted = (data: any) => {
    setLobbyData(data);
    setGameState("reveal");
  };

  const handleResetGame = () => {
    setGameCode("");
    setLobbyData(null);
    setResultsData(null);
    setGameState("lobby");
    setMode("menu");
    setIsSoloMode(false);
  };

  const currentStage = lobbyData?.status || "lobby";

  // Ohjataan Kaartjärven pelimoottoriin
  if (mode === "kaartjarvi" && playerName.trim()) {
    return (
      <KaartjarviMap 
        playerName={playerName}
        onExitGame={handleResetGame}
      />
    );
  }

  // --- Puhtaat Inline-tyylit päävalikolle ---
  const menuContainerStyle: React.CSSProperties = {
    minHeight: "100vh",
    backgroundColor: "#020617",
    color: "#cbd5e1",
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    boxSizing: "border-box"
  };

  const menuCardStyle: React.CSSProperties = {
    backgroundColor: "#0f172a",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "20px",
    padding: "40px 32px",
    maxWidth: "480px",
    width: "100%",
    boxShadow: "0 20px 40px -15px rgba(0,0,0,0.5)",
    textAlign: "center",
    boxSizing: "border-box"
  };

  const menuTitleStyle: React.CSSProperties = {
    fontSize: "32px",
    fontWeight: 900,
    color: "#ffffff",
    margin: "0 0 8px 0",
    letterSpacing: "-0.02em"
  };

  const menuButtonStyle = (disabled: boolean, variant: "multi" | "solo"): React.CSSProperties => ({
    width: "100%",
    padding: "16px",
    margin: "8px 0",
    backgroundColor: disabled ? "#1e293b" : (variant === "multi" ? "#4f46e5" : "#10b981"),
    border: "none",
    borderRadius: "12px",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: disabled ? "not-allowed" : "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
    opacity: disabled ? 0.4 : 1,
    transition: "all 0.15s ease"
  });
  // --- RENDELÖINTI NÄKYMIEN MUKAAN ---

  // NÄKYMÄ 1: PÄÄVALIKKO JA NIMEN KYSYMINEN
  if (mode === "menu") {
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

          {/* UUSI ETURIVI JATKO-OSALLE */}
          <button 
            disabled={true}
            style={{
              width: "100%",
              padding: "16px",
              margin: "8px 0",
              backgroundColor: "#111827",
              border: "1px dashed rgba(255,255,255,0.1)",
              borderRadius: "12px",
              color: "#4b5563",
              fontSize: "14px",
              fontWeight: "bold",
              cursor: "not-allowed",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              opacity: 0.5
            }}
          >
            <span>🔒 Osa 2: Kaartjärven Verivelka</span>
            <span style={{ fontSize: "11px", fontWeight: "normal", color: "#374151" }}>Tulossa pian... (Uusi rikostutkinta)</span>
          </button>

          {/* JAKO-OSIO MONINPELILLE */}
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

  // NÄKYMÄ 2: KLASSINEN MONINPELI
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#020617", color: "#cbd5e1" }}>
      {gameState === "lobby" && (
        <LobbyScreen
          playerId={playerId}
          playerName={playerName}
          setPlayerName={setPlayerName}
          gameCode={gameCode}
          setGameCode={setGameCode}
          isSoloMode={isSoloMode}
          setIsSoloMode={setIsSoloMode}
          onGameStarted={handleGameStarted}
        />
      )}

      {gameState === "reveal" && currentStage === "reveal" && (
        <RoleRevealScreen
          playerId={playerId}
          gameCode={gameCode}
          isSoloMode={isSoloMode}
          lobbyData={lobbyData}
          onNextStage={() => setGameState("investigation")}
        />
      )}

      {gameState === "investigation" && (
        <MapScreen
          playerId={playerId}
          gameCode={gameCode}
          isSoloMode={isSoloMode}
          lobbyData={lobbyData}
          onNextStage={(results) => {
            if (results) setResultsData(results);
            setGameState("voting");
          }}
        />
      )}

      {gameState === "voting" && (
        <VotingScreen
          playerId={playerId}
          gameCode={gameCode}
          isSoloMode={isSoloMode}
          lobbyData={lobbyData}
          resultsData={resultsData}
          onNextStage={() => {
            if (lobbyData) {
              const updatedLobby = { ...lobbyData, status: "ending" };
              setLobbyData(updatedLobby);
            }
          }}
          onResetGame={handleResetGame}
        />
      )}
    </div>
  );
}
