"use client";
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

  // Kopioidaan pelikoodi suoraan puhelimen leikepöydälle
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
    <div className="screen lobby-screen" style={{ padding: '20px', maxWidth: '500px', margin: '0 auto', fontFamily: 'sans-serif', color: 'white' }}>
      <div className="rain-overlay" />

      <div className="lobby-header" style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 className="screen-title" style={{ color: '#ffb4ab', fontSize: '28px', textTransform: 'uppercase', margin: '0 0 10px 0' }}>Mökin Odotushuone</h1>
        <div className="code-display" style={{ background: '#1e293b', padding: '12px', borderRadius: '8px', border: '1px solid #334155', display: 'inline-block' }}>
          <span className="code-label" style={{ display: 'block', fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Pelikoodi</span>
          <button 
            className="code-badge" 
            onClick={handleCopy} 
            title="Kopioi koodi"
            style={{ background: '#0f172a', border: '1px solid #475569', color: '#f59e0b', padding: '8px 16px', borderRadius: '6px', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto' }}
          >
            {gameCode} <span style={{ fontSize: '14px', color: copied ? '#10b981' : '#94a3b8' }}>{copied ? "✓ Kopioitu" : "📋"}</span>
          </button>
        </div>
      </div>

      {isCountdown && (
        <div className="countdown-banner" style={{ background: '#7f1d1d', border: '1px solid #dc2626', padding: '15px', borderRadius: '8px', textAlign: 'center', marginBottom: '20px' }}>
          <div className="countdown-label" style={{ color: '#fcd34d', fontSize: '14px', textTransform: 'uppercase', fontWeight: 'bold' }}>Mysteeri käynnistyy</div>
          <div className="countdown-time" style={{ fontSize: '32px', fontWeight: 'bold', fontFamily: 'monospace', marginTop: '5px' }}>{formatTime(countdownSecsLeft)}</div>
        </div>
      )}

      {/* Pelaajalista */}
      <div className="player-list" style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155', marginBottom: '25px' }}>
        <h2 className="section-label" style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#ffb4ab', borderBottom: '1px solid #334155', paddingBottom: '5px' }}>
          Mökille saapuneet pelaajat ({players.length})
        </h2>
        <div className="player-items" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {players.map(([id, p]) => (
            <div 
              key={id} 
              className={`player-item ${id === playerId ? "player-item--me" : ""}`}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', background: id === playerId ? '#2d3748' : '#0f172a', padding: '10px', borderRadius: '8px', border: id === playerId ? '1px solid #ffb4ab' : '1px solid #1e293b' }}
            >
              <span className="player-avatar" style={{ width: '32px', height: '32px', background: '#dc2626', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white' }}>
                {p.name.charAt(0).toUpperCase()}
              </span>
              <span className="player-name" style={{ fontWeight: 'bold', fontSize: '16px' }}>{p.name}</span>
              
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '5px' }}>
                {game.hostId === id && (
                  <span className="host-badge" style={{ background: '#f59e0b', color: 'black', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Isäntä 👑</span>
                )}
                {id === playerId && (
                  <span className="me-badge" style={{ background: '#3b82f6', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Sinä</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Isännän hallintapaneeli */}
      {isHost && !isCountdown && (
        <div className="host-controls" style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155', marginBottom: '20px' }}>
          <h2 className="section-label" style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#ffb4ab' }}>Käynnistä murhamysteeri</h2>

          <div className="countdown-options" style={{ marginBottom: '20px' }}>
            <span className="field-label" style={{ display: 'block', fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>Valitse tutkimusaika (keskustelu):</span>
            <div className="option-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {COUNTDOWN_OPTIONS.map((m) => (
                <button
                  key={m}
                  className={`option-btn ${selectedMinutes === m ? "option-btn--active" : ""}`}
                  onClick={() => setSelectedMinutes(m)}
                  style={{ background: selectedMinutes === m ? '#dc2626' : '#0f172a', color: 'white', border: selectedMinutes === m ? '1px solid #ffb4ab' : '1px solid #475569', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
                >
                  {m} min
                </button>
              ))}
            </div>
          </div>

          {startError && <div className="error-msg" style={{ color: '#ef4444', marginBottom: '15px', fontWeight: 'bold', fontSize: '14px' }}>{startError}</div>}

          {/* Vähintään 4 pelaajaa vaaditaan roolijakoa varten */}
          <div className="btn-group" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              className="btn btn-primary"
              onClick={handleStartNow}
              disabled={starting || players.length < 4}
              style={{ background: '#10b981', color: 'white', border: 'none', padding: '14px', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: (starting || players.length < 4) ? 'not-allowed' : 'pointer', opacity: (starting || players.length < 4) ? 0.5 : 1 }}
            >
              {starting ? "Käynnistetään…" : "⚡ Aloita heti ja jaa roolit"}
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleStartCountdown}
              disabled={starting || players.length < 4}
              style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: (starting || players.length < 4) ? 'not-allowed' : 'pointer', opacity: (starting || players.length < 4) ? 0.5 : 1 }}
            >
              ⏱ Käynnistä lähtölaskenta
            </button>
          </div>

          {players.length < 4 && (
            <p className="hint-text" style={{ color: '#ef4444', fontSize: '13px', textAlign: 'center', marginTop: '10px', fontWeight: 'bold' }}>
              Mysteeri vaatii vähintään 4 pelaajaa (roolien jakoa varten).
            </p>
          )}
        </div>
      )}

      {/* Muiden kuin isännän näkymä */}
      {!isHost && (
        <div className="waiting-msg" style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155', textAlign: 'center', marginBottom: '20px' }}>
          <div className="waiting-spinner" style={{ width: '24px', height: '24px', border: '3px solid #94a3b8', borderTopColor: '#ffb4ab', borderRadius: '50%', margin: '0 auto 10px auto', animation: 'spin 1s linear infinite' }} />
          <p style={{ margin: 0, color: '#cbd5e1' }}>Odotetaan, että isäntä valitsee peliajan ja käynnistää pelin…</p>
        </div>
      )}

      <button
        className="btn btn-ghost leave-btn"
        onClick={actions.leaveGame}
        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '14px', padding: '10px', width: '100%', textAlign: 'center' }}
      >
        ← Poistu mökistä
      </button>
    </div>
  );
}
