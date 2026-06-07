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

  if (hasVoted) {
    return (
      <div className="screen screen--center">
        <div className="rain-overlay" />
        <div className="vote-waiting">
          <div className="vote-check">✓</div>
          <h2 className="vote-sent-title">Ääni lähetetty</h2>
          <p className="hint-text">Odotetaan muita… ({totalVotes}/{totalPlayers})</p>
          <div className="vote-progress">
            <div
              className="vote-progress-fill"
              style={{ width: `${(totalVotes / totalPlayers) * 100}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="rain-overlay" />

      <div className="voting-header">
        <h1 className="screen-title">🗳 Äänestys</h1>
        {scenario ? (
          <>
            <p className="voting-case">{scenario.name}</p>
            <p className="voting-hint">Kuka murhasi {scenario.victim}?</p>
          </>
        ) : (
          <p className="voting-hint">Kuka on Syyllinen?</p>
        )}
      </div>

      <div className="suspect-list">
        {others.map(([id, p]) => (
          <button
            key={id}
            className={`suspect-card ${selected === id ? "suspect-card--selected" : ""}`}
            onClick={() => setSelected(id)}
          >
            <span className="suspect-avatar">{p.name.charAt(0).toUpperCase()}</span>
            <span className="suspect-name">{p.name}</span>
            {selected === id && <span className="suspect-check">✓</span>}
          </button>
        ))}
      </div>

      <div className="vote-footer">
        <button
          className="btn btn-danger btn-lg"
          onClick={handleSubmit}
          disabled={!selected || submitting}
        >
          {submitting ? "Lähetetään…" : "⚖️ Syytä tätä henkilöä"}
        </button>

        {isSyyllinen && !confirmConfess && (
          <button
            className="btn btn-ghost"
            onClick={() => setConfirmConfess(true)}
          >
            🔓 Tunnustaa syyllisyytensä
          </button>
        )}

        {isSyyllinen && confirmConfess && (
          <div className="confess-confirm">
            <p className="confess-warn">Tunnustus on peruuttamaton. Peli päättyy välittömästi.</p>
            <div className="confess-btns">
              <button
                className="btn btn-danger"
                onClick={handleConfess}
                disabled={confessing}
              >
                {confessing ? "Tunnustetaan…" : "🩸 Kyllä, tunnustan"}
              </button>
              <button className="btn btn-ghost" onClick={() => setConfirmConfess(false)}>
                Peruuta
              </button>
            </div>
          </div>
        )}

        <p className="hint-text">{totalVotes}/{totalPlayers} ääntä annettu</p>
      </div>
    </div>
  );
}
