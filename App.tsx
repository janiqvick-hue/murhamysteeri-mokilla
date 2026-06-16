import React, { useState } from "react";
import LobbyScreen from "./LobbyScreen";
import RoleRevealScreen from "./RoleRevealScreen";
import MapScreen from "./MapScreen";
import VotingScreen from "./VotingScreen";
import KaartjarviMap from "./KaartjarviMap";

export default function App() {
  // Pelitila laajennettu sisältämään päävalikon ("menu") ja yksinpelin ("kaartjarvi")
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
  };

  const currentStage = lobbyData?.status || "lobby";

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

  const menuButtonStyle = (variant: "multi" | "solo"): React.CSSProperties => ({
    width: "100%",
    padding: "16px",
    margin: "8px 0",
    backgroundColor: variant === "multi" ? "#4f46e5" : "#1e293b",
    border: variant === "multi" ? "none" : "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
    transition: "transform 0.15s ease"
  });

  const nameInputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px",
    backgroundColor: "#020617",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "8px",
    color: "#ffffff",
    fontSize: "14px",
    textAlign: "center",
    marginBottom: "16px",
    fontWeight: "bold"
  };

  // --- RENDELÖINTI NÄKYMIEN MUKAAN ---

  // NÄKYMÄ 1: PÄÄVALIKKO
  if (mode === "menu") {
    return (
      <div style={menuContainerStyle}>
        <div style={menuCardStyle}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>🌲🏡🔍</div>
          <h1 style={menuTitleStyle}>Mökkimysteeri</h1>
          <p style={{ fontSize: "14px", color: "#94a3b8", margin: "0 0 32px 0", lineHeight: "1.5" }}>
            Valitse pelitila alta. Voit pelata ystäviesi kanssa moninpelinä tai ratkaista Kaartjärven huvilan murhan yksinpelinä.
          </p>

          <button 
            onClick={() => setMode("multiplayer")}
            style={menuButtonStyle("multi")}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#4338ca"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#4f46e5"}
          >
            <span>👥 Klassinen Moninpeli</span>
            <span style={{ fontSize: "11px", fontWeight: "normal", color: "#c7d2fe" }}>Pelaa ryhmässä puhelimilla (vaatii huoneen)</span>
          </button>

          <button 
            onClick={() => setMode("kaartjarvi")}
            style={menuButtonStyle("solo")}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#334155"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#1e293b"}
          >
            <span>🕵️ Kaartjärven Huvila (Yksinpeli)</span>
            <span style={{ fontSize: "11px", fontWeight: "normal", color: "#94a3b8" }}>Tarinarikas rikostutkinta, arvoituksia ja esineitä</span>
          </button>
        </div>
      </div>
    );
  }

  // NÄKYMÄ 2: KAARTJÄRVI (YKSINPELI)
  if (mode === "kaartjarvi") {
    // Jos nimeä ei ole vielä annettu, kysytään se tyylikkäästi ennen pelin alkua
    if (!playerName) {
      return (
        <div style={menuContainerStyle}>
          <div style={menuCardStyle}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>👔📜</div>
            <h2 style={{ ...menuTitleStyle, fontSize: "24px", marginBottom: "16px" }}>Kirjoita etsivän nimesi</h2>
            <input 
              type="text"
              placeholder="Esim. Etsivä Koskinen"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              style={nameInputStyle}
            />
            <div style={{ display: "flex", gap: "10px" }}>
              <button 
                onClick={() => setMode("menu")}
                style={{ flex: 1, padding: "12px", backgroundColor: "#1e293b", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", fontSize: "13px" }}
              >
                Peruuta
              </button>
              <button 
                disabled={!playerName.trim()}
                onClick={() => {}} // Nimi tallennettu tilaan, renderöi pelin seuraavalla kierroksella
                style={{ flex: 1, padding: "12px", backgroundColor: "#10b981", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", fontSize: "13px", opacity: playerName.trim() ? 1 : 0.5 }}
              >
                Aloita tutkinta
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <KaartjarviMap 
        playerName={playerName}
        onExitGame={() => {
          setPlayerName(""); // Nollataan nimi seuraavaa kertaa varten
          setMode("menu");
        }}
      />
    );
  }

  // NÄKYMÄ 3: KLASSINEN MONINPELI (Alkuperäinen logiikka täysin koskemattomana)
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
