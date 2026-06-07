import { useState } from "react";
import type { Game } from "../types";
import type { GameActions } from "../hooks/useGame";

interface Props {
  game: Game;
  gameCode: string;
  playerId: string;
  isHost: boolean;
  countdownSecsLeft: number;
  actions: GameActions;
}

const COUNTDOWN_OPTIONS = [1, 3, 5, 10] as const;

export default function LobbyScreen({
  game,
  gameCode,
  playerId,
  isHost,
  countdownSecsLeft,
  actions,
}: Props) {
  const [selectedMinutes, setSelectedMinutes] = useState(5);
  const [startError, setStartError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [copied, setCopied] = useState(false);

  const players = Object.entries(game.players ?? {});
  const isCountdown = game.status === "countdown";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(gameCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartNow = async () => {
    setStartError(null);
    setStarting(true);
    try {
      await actions.startNow();
    } catch (e: unknown) {
      setStartError(e instanceof Error ? e.message : "Virhe.");
    } finally {
      setStarting(false);
    }
  };

  const handleStartCountdown = async () => {
    setStartError(null);
    setStarting(true);
    try {
      await actions.startCountdown(selectedMinutes);
    } catch (e: unknown) {
      setStartError(e instanceof Error ? e.message : "Virhe.");
    } finally {
      setStarting(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="screen">
      <div className="rain-overlay" />

      <div className="lobby-header">
        <h1 className="screen-title">Odotushuone</h1>
        <div className="code-display">
          <span className="code-label">Pelikoodi</span>
          <button className="code-badge" onClick={handleCopy} title="Kopioi">
            {gameCode} {copied ? "✓" : "📋"}
          </button>
        </div>
      </div>

      {isCountdown && (
        <div className="countdown-banner">
          <div className="countdown-label">Peli alkaa</div>
          <div className="countdown-time">{formatTime(countdownSecsLeft)}</div>
        </div>
      )}

      <div className="player-list">
        <h2 className="section-label">
          Pelaajat ({players.length})
        </h2>
        <div className="player-items">
          {players.map(([id, p]) => (
            <div key={id} className={`player-item ${id === playerId ? "player-item--me" : ""}`}>
              <span className="player-avatar">{p.name.charAt(0).toUpperCase()}</span>
              <span className="player-name">{p.name}</span>
              {game.hostId === id && (
                <span className="host-badge">Isäntä</span>
              )}
              {id === playerId && <span className="me-badge">Sinä</span>}
            </div>
          ))}
        </div>
      </div>

      {isHost && !isCountdown && (
        <div className="host-controls">
          <h2 className="section-label">Käynnistä peli</h2>

          <div className="countdown-options">
            <span className="field-label">Aikaleima</span>
            <div className="option-row">
              {COUNTDOWN_OPTIONS.map((m) => (
                <button
                  key={m}
                  className={`option-btn ${selectedMinutes === m ? "option-btn--active" : ""}`}
                  onClick={() => setSelectedMinutes(m)}
                >
                  {m} min
                </button>
              ))}
            </div>
          </div>

          {startError && <div className="error-msg">{startError}</div>}

          <div className="btn-group">
            <button
              className="btn btn-primary"
              onClick={handleStartNow}
              disabled={starting || players.length < 2}
            >
              {starting ? "Käynnistetään…" : "⚡ Aloita heti"}
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleStartCountdown}
              disabled={starting || players.length < 2}
            >
              ⏱ Käynnistä ajastin
            </button>
          </div>

          {players.length < 2 && (
            <p className="hint-text">Odotetaan lisää pelaajia…</p>
          )}
        </div>
      )}

      {!isHost && (
        <div className="waiting-msg">
          <div className="waiting-spinner" />
          <p>Odotetaan isäntää käynnistämään peli…</p>
        </div>
      )}

      <button
        className="btn btn-ghost leave-btn"
        onClick={actions.leaveGame}
      >
        ← Poistu
      </button>
    </div>
  );
}
