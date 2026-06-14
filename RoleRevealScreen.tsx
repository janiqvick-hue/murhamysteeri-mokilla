"use client";
import { useEffect, useState } from "react";

import type { Game, Mission } from "./types";
import type { GameActions } from "./useGame";
import { ROLE_INFO } from "./roles";
import { SCENARIO_MAP } from "./scenarios";

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

  // 6 sekunnin ajastin ennen roolin paljastamista jännityksen luomiseksi
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
    <div className="screen screen--center" style={{ padding: '20px', maxWidth: '500px', margin: '0 auto', fontFamily: 'sans-serif', color: 'white', textAlign: 'center' }}>
      <div className="rain-overlay" />

      {/* Lähtölaskentavaihe ennen paljastusta */}
      {!revealed && (
        <div className="reveal-countdown" style={{ padding: '40px 0' }}>
          <p className="reveal-hint" style={{ fontSize: '20px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Valmistaudu... Roolisi paljastuu…</p>
          <div className="reveal-timer" style={{ fontSize: '72px', fontWeight: 'bold', color: '#dc2626', fontFamily: 'monospace', marginTop: '20px' }}>{secsLeft}</div>
        </div>
      )}

      {/* Roolin paljastusvaihe */}
      {revealed && roleInfo && (
        <div className="role-reveal-layout" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Roolikortti tyylikkäillä väreillä */}
          <div
            className="role-card-v2"
            style={{ background: roleInfo.gradient || '#1e293b', border: `2px solid ${roleInfo.color || '#334155'}`, padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}
          >
            <div className="role-icon-lg" style={{ fontSize: '48px', marginBottom: '10px' }}>{roleInfo.icon}</div>
            <h2 className="role-name-lg" style={{ color: roleInfo.color || '#ffb4ab', fontSize: '28px', textTransform: 'uppercase', margin: '0 0 10px 0', fontWeight: 'bold' }}>
              {roleInfo.name}
            </h2>
            <p className="role-objective-text" style={{ fontSize: '16px', fontWeight: 'bold', color: '#cbd5e1', margin: '0 0 10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>{roleInfo.objective}</p>
            <p className="role-detail-text" style={{ fontSize: '14px', color: '#94a3b8', margin: 0, lineHeight: '1.4' }}>{roleInfo.detail}</p>
          </div>

          {/* Skenaario/Tapaus - Banneri */}
          {scenario && (
            <div className="scenario-badge" style={{ background: '#1e293b', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
              <span className="scenario-badge-label" style={{ display: 'block', fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Aktiivinen tapaus</span>
              <span className="scenario-badge-name" style={{ display: 'block', fontSize: '18px', color: '#ffb4ab', fontWeight: 'bold', margin: '2px 0' }}>{scenario.name}</span>
              <span className="scenario-badge-sub" style={{ display: 'block', fontSize: '13px', color: '#cbd5e1' }}>Uhri: {scenario.victim}</span>
            </div>
          )}

          {/* Syyllisen salaiset tehtävälistat */}
          {isSyyllinen && activeMissions.length > 0 && (
            <div className="missions-panel" style={{ background: '#1e293b', border: '1px solid #dc2626', padding: '15px', borderRadius: '8px', textAlign: 'left' }}>
              <div className="missions-header" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                <span className="missions-icon" style={{ fontSize: '20px' }}>📋</span>
                <h3 className="missions-title" style={{ margin: 0, color: '#ef4444', fontSize: '16px', textTransform: 'uppercase' }}>Salaiset tehtäväsi</h3>
              </div>
              <p className="missions-hint" style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 12px 0' }}>Älä paljasta näitä kenellekään muulle mökkiläiselle.</p>
              <div className="missions-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {activeMissions.map((m) => (
                  <div key={m.id} className="mission-card mission-card--active" style={{ background: '#0f172a', padding: '10px', borderRadius: '6px', borderLeft: '3px solid #ef4444' }}>
                    <div className="mission-title" style={{ fontWeight: 'bold', fontSize: '14px', color: '#cbd5e1' }}>{m.title}</div>
                    <div className="mission-desc" style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>{m.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Salaisuuden Vartijan ikioma mysteeri */}
          {isVartija && scenario && (
            <div className="vartija-secret-panel" style={{ background: '#1e293b', border: '1px solid #ec4899', padding: '15px', borderRadius: '8px', textAlign: 'left' }}>
              <div className="vartija-secret-header" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '20px' }}>🗝️</span>
                <h3 style={{ margin: 0, color: '#ec4899', fontSize: '16px', textTransform: 'uppercase' }}>Sinun salaisuutesi</h3>
              </div>
              <p className="vartija-secret-text" style={{ fontSize: '14px', color: '#cbd5e1', background: '#0f172a', padding: '10px', borderRadius: '6px', margin: '0 0 8px 0', lineHeight: '1.4' }}>{scenario.secretForVartija}</p>
              <p className="missions-hint" style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>
                Voit halutessasi paljastaa tämän tiedon kaikille peliruudun 'Paljasta salaisuus' -napista.
              </p>
            </div>
          )}

          <div className="role-remember" style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic', marginTop: '10px' }}>Muista roolisi ja tavoitteesi — peli alkaa pian.</div>

          {/* Isännän etenemisnappi */}
          {isHost && (
            <button
              className="btn btn-primary"
              onClick={handleAdvance}
              disabled={advancing}
              style={{ background: '#10b981', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}
            >
              {advancing ? "Valmistellaan…" : "→ Aloita tutkimus mökillä"}
            </button>
          )}
          {!isHost && (
            <p className="hint-text" style={{ color: '#94a3b8', fontSize: '14px', marginTop: '10px' }}>Odotetaan, että huoneen isäntä käynnistää tutkimusvaiheen…</p>
          )}
        </div>
      )}
    </div>
  );
}
