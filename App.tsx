import React, { useState } from "react";
import LobbyScreen from "./LobbyScreen";
import RoleRevealScreen from "./RoleRevealScreen";
import MapScreen from "./MapScreen";
import VotingScreen from "./VotingScreen";

export default function App() {
  // Pelaajan anonyymi ID ja valitut perustiedot
  const [playerId] = useState(() => "p_" + Math.random().toString(36).substr(2, 9));
  const [playerName, setPlayerName] = useState("");
  const [gameCode, setGameCode] = useState("");
  const [isSoloMode, setIsSoloMode] = useState(false);
  const [lobbyData, setLobbyData] = useState<any>(null);
  const [resultsData, setResultsData] = useState<any>(null);

  // Pelitila: "lobby" (aloitusruutu), "reveal", "investigation", "voting"
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
  };

  const currentStage = lobbyData?.status || "lobby";

  return (
    <div className="min-h-screen bg-slate-950 font-sans antialiased text-slate-200">
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
