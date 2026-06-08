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

function NotConfigured() {
  return (
    <div className="screen screen--center">
      <h2>Firebase ei konfiguroitu</h2>
    </div>
  );
}

export default function App() {
  const [gameCode, setGameCode] = useState<string | null>(() => loadGameCode());

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

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLeave = () => {
    actions.leaveGame();
    setGameCode(null);
  };

  if (!firebaseConfigured) {
    return <NotConfigured />;
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
        <p>Ladataan peliä...</p>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="screen screen--center">
        <p>{error ?? "Peliä ei löydy."}</p>
        <button onClick={handleLeave}>Takaisin</button>
      </div>
    );
  }

  const wrappedActions = {
    ...actions,
    leaveGame: handleLeave,
  };

  switch (game.status) {
    case "lobby":
    case "countdown":
      return (
        <LobbyScreen
          game={game}
          gameCode={gameCode}
          playerId={playerId}
          isHost={isHost}
          countdownSecsLeft={countdownSecsLeft}
          actions={wrappedActions}
        />
      );

    case "roleReveal":
      return (
        <RoleRevealScreen
          game={game}
          playerId={playerId}
          isHost={isHost}
          activeMissions={activeMissions}
          actions={wrappedActions}
        />
      );

    case "playing":
      return (
        <MapScreen
          game={game}
          playerId={playerId}
          isHost={isHost}
          myRole={myRole}
          myInventory={myInventory}
          activeMissions={activeMissions}
          actions={wrappedActions}
        />
      );

    case "voting":
      return (
        <VotingScreen
          game={game}
          playerId={playerId}
          scenario={scenario}
          actions={wrappedActions}
        />
      );

    case "ended":
      return (
        <EndingScreen
          game={game}
          playerId={playerId}
          isHost={isHost}
          activeMissions={activeMissions}
          actions={wrappedActions}
        />
      );

    default:
      return null;
  }
}
