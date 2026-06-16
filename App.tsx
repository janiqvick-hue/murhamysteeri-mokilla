  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#020617", color: "#cbd5e1", fontFamily: "sans-serif" }}>
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
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#020617", color: "#cbd5e1", fontFamily: "sans-serif" }}>
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
