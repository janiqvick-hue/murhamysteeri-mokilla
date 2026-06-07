import { useEffect, useState } from "react";
import type { Game, Mission } from "../types";
import type { GameActions } from "../hooks/useGame";
import { ROLE_INFO } from "../content/roles";
import { SCENARIO_MAP } from "../content/scenarios";

interface Props {
  game: Game;
  playerId: string;
  isHost: boolean;
  activeMissions: Mission[];
  actions: GameActions;
}

const REVEAL_SECS = 6;

export default function RoleRevealScreen({
  game,
  playerId,
  isHost,
  activeMissions,
  actions,
}: Props) {
  const [secsLeft, setSecsLeft] = useState(REVEAL_SECS);
  const [revealed, setRevealed] = useState(false);
  const [advancing, setAdvancing] = useState(false);

  const myRole = game.roles?.[playerId];
  const roleInfo = myRole ? ROLE_INFO[myRole] : null;
  const isSyyllinen = myRole === "syyllinen";
  const isVartija = myRole === "salaisuuden_vartija";
  const scenario = game.scenarioId ? SCENARIO_MAP[game.scenarioId] : null;

  useEffect(() => {
    const timer = setInterval(() => {
      setSecsLeft((s) => {
        if (s <= 1) {
          clearInterval(timer);
          setRevealed(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAdvance = async () => {
    if (!isHost || advancing) return;
    setAdvancing(true);
    try {
      await actions.startPlaying();
    } catch {
      // ignore
    }
    setAdvancing(false);
  };

  return (
    <div className="screen screen--center">
      <div className="rain-overlay" />

      {!revealed && (
        <div className="reveal-countdown">
          <p className="reveal-hint">Roolisi paljastuu…</p>
          <div className="reveal-timer">{secsLeft}</div>
        </div>
      )}

      {revealed && roleInfo && (
        <div className="role-reveal-layout">
          {/* Role card */}
          <div
            className="role-card-v2"
            style={{ background: roleInfo.gradient, borderColor: roleInfo.color }}
          >
            <div className="role-icon-lg">{roleInfo.icon}</div>
            <h2 className="role-name-lg" style={{ color: roleInfo.color }}>
              {roleInfo.name}
            </h2>
            <p className="role-objective-text">{roleInfo.objective}</p>
            <p className="role-detail-text">{roleInfo.detail}</p>
          </div>

          {/* Scenario banner */}
          {scenario && (
            <div className="scenario-badge">
              <span className="scenario-badge-label">Tapaus</span>
              <span className="scenario-badge-name">{scenario.name}</span>
              <span className="scenario-badge-sub">Uhri: {scenario.victim}</span>
            </div>
          )}

          {/* Syyllinen missions */}
          {isSyyllinen && activeMissions.length > 0 && (
            <div className="missions-panel">
              <div className="missions-header">
                <span className="missions-icon">📋</span>
                <h3 className="missions-title">Salaiset tehtäväsi</h3>
              </div>
              <p className="missions-hint">Älä paljasta näitä kenellekään.</p>
              <div className="missions-list">
                {activeMissions.map((m) => (
                  <div key={m.id} className="mission-card mission-card--active">
                    <div className="mission-title">{m.title}</div>
                    <div className="mission-desc">{m.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Salaisuuden Vartija secret */}
          {isVartija && scenario && (
            <div className="vartija-secret-panel">
              <div className="vartija-secret-header">
                <span>🗝️</span>
                <h3>Sinun salaisuutesi</h3>
              </div>
              <p className="vartija-secret-text">{scenario.secretForVartija}</p>
              <p className="missions-hint">
                Voit paljastaa tämän pelaamalla 'Paljasta salaisuutesi' -painiketta.
              </p>
            </div>
          )}

          <div className="role-remember">Muista roolisi — tämä näyttö sulkeutuu pian.</div>

          {isHost && (
            <button
              className="btn btn-primary"
              onClick={handleAdvance}
              disabled={advancing}
            >
              {advancing ? "…" : "→ Aloita tutkimus"}
            </button>
          )}
          {!isHost && (
            <p className="hint-text">Isäntä käynnistää tutkimuksen…</p>
          )}
        </div>
      )}
    </div>
  );
}
