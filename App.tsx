import { useState, useEffect } from "react";
import { firebaseConfigured } from "./firebase";
import { useGame } from "./hooks/useGame";
import { loadGameCode } from "./gameCode";
import LandingScreen from "./LandingScreen";
import LobbyScreen from "./LobbyScreen";
import RoleRevealScreen from "./RoleRevealScreen";
import MapScreen from "./MapScreen";
import VotingScreen from "./VotingScreen";
import EndingScreen from "./EndingScreen";
import KadonnutJaniScreen from "./KadonnutJaniScreen";

function NotConfigured() {
  return (
    <div className="screen screen--center">
      <div className="rain-overlay" />
      <div className="config-card">
        <div style={{ fontSize: "3rem" }}>⚙️</div>
        <h2>Firebase ei konfiguroitu</h2>
        <p>Lisää ympäristömuuttujat ja käynnistä palvelin uudelleen.</p>
      </div>
    </div>
  );
}

export default function App() {
  const [gameCode, setGameCode] = useState<string | null>(() => loadGameCode());
  const [selectedGame, setSelectedGame] = useState<"murha" | "jani" | null>(null);

  const {
    game,
    loading,
    error,
    playerId,
    isHost,
    myRole,
    myInventory,
    countdownSecsLeft,
    scenario,
    activeMissions,
    actions,
  } = useGame(gameCode);

  useEffect(() => {
    const handleStorageChange = () => {
      setGameCode(loadGameCode());
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLeave = () => {
    actions.leaveGame();
    setGameCode(null);
  };

  if (!firebaseConfigured) return <NotConfigured />;
  
  if (!selectedGame) {
    return (
      <div className="screen screen--center">
        <div className="config-card">
          <h1>🎮 Valitse peli</h1>
          <div style={{ marginBottom: "2rem" }}>
            <h2>🔪 Murhamysteeri Mökillä</h2>
            <p>Moninpelattava murhamysteeri.</p>
            <button className="btn" onClick={() => setSelectedGame("murha")}>Pelaa</button>
          </div>
          <div>
            <h2>🔦 Kadonnut Jani</h2>
            <p>Yksinpelattava jatkotarina Janin katoamisesta.</p>
            <button className="btn" onClick={() => setSelectedGame("jani")}>Tutki</button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedGame === "jani") {
    return <KadonnutJaniScreen />;
  }

  if (!gameCode) {
    return (
      <LandingScreen
        onCreateGame={async (name) => {
          const code = await actions.createGame(name);
          setGameCode(code);
          return code;
        }}
        onJoinGame={async (code, name) => {
          await actions.joinGame(code, name);
          setGameCode(code);
        }}
      />
    );
  }

  if (loading) {
    return (
      <div className="screen screen--center">
        <div className="rain-overlay" />
        <div className="loading-spinner" />
        <p className="hint-text">Ladataan peliä…</p>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="screen screen--center">
        <div className="rain-overlay" />
        <div className="error-card">
          <p>⚠️ {error ?? "Peliä ei löydy."}</p>
          <button className="btn btn-secondary" onClick={handleLeave}>← Takaisin</button>
        </div>
      </div>
    );
  }

  const wrappedActions = { ...actions, leaveGame: handleLeave };

  switch (game.status) {
    case "lobby":
    case "countdown":
      return (
        <LobbyScreen game={game} gameCode={gameCode} playerId={playerId} isHost={isHost} countdownSecsLeft={countdownSecsLeft} actions={wrappedActions} />
      );
    case "roleReveal":
      return (
        <RoleRevealScreen game={game} playerId={playerId} isHost={isHost} activeMissions={activeMissions} actions={wrappedActions} />
      );
    case "playing":
      return (
        <MapScreen game={game} playerId={playerId} isHost={isHost} myRole={myRole} myInventory={myInventory} activeMissions={activeMissions} actions={wrappedActions} />
      );
    case "voting":
      return (
        <VotingScreen game={game} playerId={playerId} scenario={scenario} actions={wrappedActions} />
      );
    case "ended":
      return (
        <EndingScreen game={game} playerId={playerId} isHost={isHost} activeMissions={activeMissions} actions={wrappedActions} />
      );
    default:
      return null;
  }
}
