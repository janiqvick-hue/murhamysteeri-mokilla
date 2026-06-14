"use client";
import { useState } from "react";
import type { Game } from "../types";
import type { GameActions } from "../hooks/useGame";
import type { Scenario } from "../types";

interface Props {
  game: Game;
  playerId: string;
  scenario: Scenario | null;
  actions: GameActions;
}

export default function VotingScreen({ game, playerId, scenario, actions }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confessing, setConfessing] = useState(false);
  const [confirmConfess, setConfirmConfess] = useState(false);

  const players = Object.entries(game.players ?? {});
  const others = players.filter(([id]) => id !== playerId);
  const myVote = game.votes?.[playerId];
  const totalVotes = Object.keys(game.votes ?? {}).length;
  const totalPlayers = players.length;
  const myRole = game.roles?.[playerId];
  const isSyyllinen = myRole === "syyllinen";

  const hasVoted = !!myVote;

  const handleSubmit = async () => {
    if (!selected || submitting) return;
    setSubmitting(true);
    try {
      await actions.submitVote(selected);
    } catch (e: unknown) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfess = async () => {
    setConfessing(true);
    try {
      await actions.confessAsCulprit();
    } catch {
      setConfessing(false);
    }
  };

  // NÄKYMÄ: Kun pelaaja on jo antanut oman salaisen äänensä
  if (hasVoted) {
    return (
      <div className="screen screen--center" style={{ padding: '40px', background: '#0f172a', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="rain-overlay" />
        <div className="vote-waiting" style={{ background: '#1e293b', padding: '30px', borderRadius: '12px', maxWidth: '400px', width: '100%', border: '1px solid #334155' }}>
          <div className="vote-check" style={{ fontSize: '48px', color: '#10b981', marginBottom: '15px' }}>✓</div>
          <h2 className="vote-sent-title" style={{ margin: '0 0 10px 0', fontSize: '22px', color: '#ffb4ab' }}>Ääni lähetetty salaisesti</h2>
          <p className="hint-text" style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '20px' }}>Odotetaan muita mökkiläisiä… ({totalVotes}/{totalPlayers})</p>
          
          {/* Reaaliaikainen edistymispalkki */}
          <div className="vote-progress" style={{ width: '100%', height: '8px', background: '#0f172a', borderRadius: '4px', overflow: 'hidden' }}>
            <div
              className="vote-progress-fill"
              style={{ width: `${(totalVotes / totalPlayers) * 100}%`, height: '100%', background: '#10b981', transition: 'width 0.3s ease' }}
            />
          </div>
        </div>
      </div>
    );
  }

  // NÄKYMÄ: Varsinainen äänestysruutu
  return (
    <div className="screen voting-screen" style={{ padding: '20px', maxWidth: '500px', margin: '0 auto', fontFamily: 'sans-serif', color: 'white' }}>
      <div className="rain-overlay" />

      <div className="voting-header" style={{ textAlign: 'center', marginBottom: '25px' }}>
        <h1 className="screen-title" style={{ color: '#ffb4ab', fontSize: '28px', textTransform: 'uppercase', margin: '0 0 5px 0' }}>🗳️ Loppuäänestys</h1>
        {scenario ? (
          <>
            <p className="voting-case" style={{ color: '#f59e0b', fontWeight: 'bold', margin: '0 0 5px 0' }}>{scenario.name}</p>
            <p className="voting-hint" style={{ color: '#cbd5e1', fontSize: '15px', margin: 0 }}>Kuka seurueesta murhasi henkilön {scenario.victim}?</p>
          </>
        ) : (
          <p className="voting-hint" style={{ color: '#cbd5e1', fontSize: '15px', margin: 0 }}>Kuka teistä on Syyllinen?</p>
        )}
      </div>

      {/* Epäiltyjen lista (Muut pelaajat huoneessa) */}
      <div className="suspect-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '25px' }}>
        {others.map(([id, p]) => (
          <button
            key={id}
            className={`suspect-card ${selected === id ? "suspect-card--selected" : ""}`}
            onClick={() => setSelected(id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '15px', width: '100%', padding: '15px', borderRadius: '10px', border: selected === id ? '2px solid #ef4444' : '1px solid #334155',
              background: selected === id ? '#2d1f21' : '#1e293b', color: 'white', cursor: 'pointer', textAlign: 'left', fontSize: '16px', fontWeight: 'bold', transition: '0.2s'
            }}
          >
            <span className="suspect-avatar" style={{ width: '36px', height: '36px', background: '#dc2626', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              {p.name.charAt(0).toUpperCase()}
            </span>
            <span className="suspect-name" style={{ flex: 1 }}>{p.name}</span>
            {selected === id && <span className="suspect-check" style={{ color: '#ef4444', fontSize: '20px' }}>✓</span>}
          </button>
        ))}
      </div>

      <div className="vote-footer" style={{ textAlign: 'center' }}>
        <button
          className="btn btn-danger btn-lg"
          onClick={handleSubmit}
          disabled={!selected || submitting}
          style={{
            width: '100%', background: '#dc2626', color: 'white', border: 'none', padding: '14px', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold',
            cursor: (!selected || submitting) ? 'not-allowed' : 'pointer', opacity: (!selected || submitting) ? 0.5 : 1, marginBottom: '15px'
          }}
        >
          {submitting ? "Lähetetään syytöstä…" : "⚖️ Syytä tätä henkilöä"}
        </button>

        {/* Syyllisen salainen tunnustuspaneeli */}
        {isSyyllinen && !confirmConfess && (
          <button
            className="btn btn-ghost"
            onClick={() => setConfirmConfess(true)}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '14px', textDecoration: 'underline' }}
          >
            🔓 Tunnusta syyllisyytesi
          </button>
        )}

        {isSyyllinen && confirmConfess && (
          <div className="confess-confirm" style={{ background: '#2d1f21', border: '1px solid #ef4444', padding: '15px', borderRadius: '8px', marginTop: '10px', textAlign: 'center' }}>
            <p className="confess-warn" style={{ color: '#ef4444', fontSize: '13px', fontWeight: 'bold', margin: '0 0 12px 0' }}>Tunnustus on peruuttamaton. Peli päättyy välittömästi tutkijoiden voittoon.</p>
            <div className="confess-btns" style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                className="btn btn-danger"
                onClick={handleConfess}
                disabled={confessing}
                style={{ background: '#dc2626', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                {confessing ? "Tunnustetaan…" : "🩸 Kyllä, tunnustan"}
              </button>
              <button 
                className="btn btn-ghost" 
                onClick={() => setConfirmConfess(false)}
                style={{ background: '#334155', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}
              >
                Peruuta
              </button>
            </div>
          </div>
        )}

        <p className="hint-text" style={{ color: '#94a3b8', fontSize: '13px', marginTop: '15px' }}>{totalVotes}/{totalPlayers} ääntä annettu livenä</p>
      </div>
    </div>
  );
}
