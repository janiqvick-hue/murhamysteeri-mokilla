import React, { useState, useEffect } from "react";
import LobbyScreen from "./LobbyScreen";
import RoleRevealScreen from "./RoleRevealScreen";
import MapScreen from "./MapScreen";
import VotingScreen from "./VotingScreen";
import KaartjarviMap from "./kaartjarvi/KaartjarviMap"; // UUSI KYTKENTÄ KAARTJÄRVELLE
import { Compass, Skull, HelpCircle } from "lucide-react";

export default function App() {
  // Pelaajan anonyymi ID ja valittu pelityyppi
  const [playerId] = useState(() => "p_" + Math.random().toString(36).substr(2, 9));
  const [playerName, setPlayerName] = useState("");
  const [gameCode, setGameCode] = useState("");
  const [isSoloMode, setIsSoloMode] = useState(false);
  const [lobbyData, setLobbyData] = useState<any>(null);
  const [resultsData, setResultsData] = useState<any>(null);

  // Pelitila: "menu" (päävalikko), "lobby", "reveal", "investigation", "voting", "ending", "kaartjarvi"
  const [gameState, setGameState] = useState<"menu" | "lobby" | "reveal" | "investigation" | "voting" | "ending" | "kaartjarvi">("menu");

  const handleGameStarted = (data: any) => {
    setLobbyData(data);
    setGameState("reveal");
  };
  const handleResetGame = () => {
    setGameCode("");
    setLobbyData(null);
    setResultsData(null);
    setGameState("menu");
  };

  // --- REPRENTAATIO VAIHEEN MUKAAN ---
  if (gameState === "menu") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[85vh] w-full max-w-md mx-auto px-4 py-8 text-slate-100" style={{ fontFamily: "sans-serif" }}>
        <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden text-center space-y-6">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-600 via-amber-600 to-purple-600" />
          
          <div>
            <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-full w-fit mx-auto mb-3">
              <Compass className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-slate-100">MysteeriPelit Mökillä</h1>
            <p className="text-xs text-slate-400 mt-1">Valitse pelattava tarina tai pelimuoto alta</p>
          </div>

          <div className="space-y-3 pt-2 text-left">
            {/* Vaihtoehto 1: Klassinen Mökkimysteeri */}
            <button
              type="button"
              onClick={() => setGameState("lobby")}
              className="w-full p-4 bg-slate-950 border border-slate-800 hover:border-red-500/40 rounded-xl flex items-center justify-between transition-all cursor-pointer group border-none"
            >
              <div>
                <span className="block text-sm font-bold text-slate-200 group-hover:text-red-400 transition-colors">🩸 1. Mökkimysteeri</span>
                <span className="text-[11px] text-slate-500 block mt-0.5">4–8 pelaajaa livenä tai Solo botteja vastaan. Löydä murhaaja!</span>
              </div>
            </button>

            {/* Vaihtoehto 2: UUSI Kaartjärven Huvila */}
            <button
              type="button"
              onClick={() => setGameState("kaartjarvi")}
              className="w-full p-4 bg-slate-950 border border-slate-800 hover:border-amber-500/40 rounded-xl flex items-center justify-between transition-all cursor-pointer group border-none"
            >
              <div>
                <span className="block text-sm font-bold text-slate-200 group-hover:text-amber-400 transition-colors">🏛️ 2. Kaartjärven Huvila</span>
                <span className="text-[11px] text-slate-500 block mt-0.5">Yksinpeli-pulmapeli. Ratko arvoituksia Lopen upeassa huvilamiljöössä!</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }
  // --- LIITTYVÄT REPRENTAATIOT MUILLE PELITILOILLE ---
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

      {(gameState === "investigation" || currentStage === "investigation") && (
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

      {(gameState === "voting" || currentStage === "voting" || currentStage === "ending") && (
        <VotingScreen
          playerId={playerId}
          gameCode={gameCode}
          isSoloMode={isSoloMode}
          lobbyData={lobbyData}
          resultsData={resultsData}
          onNextStage={() => {
            // Jos Firebase päivittää tilaksi ending, haetaan tuorein data
            if (lobbyData) {
              const updatedLobby = { ...lobbyData, status: "ending" };
              setLobbyData(updatedLobby);
            }
          }}
          onResetGame={handleResetGame}
        />
      )}

      {gameState === "kaartjarvi" && (
        <KaartjarviMap
          playerId={playerId}
          playerName={playerName || "Seikkailija"}
          onExitGame={handleResetGame}
        />
      )}
    </div>
  );
}
