import { useState } from "react";

import type { Game, Mission } from "./types";
import type { GameActions } from "./useGame";

import { ROLE_INFO } from "./roles";
import { SCENARIO_MAP } from "./scenarios";
import { MISSION_POOL, getMissionStatus, countCompletedMissions } from "./missions";
import { computeEndingType, computePlayerAchievements } from "./achievements";
import { generateStorybookEnding, getEndingLabel, investigatorsWon } from "./endings";

interface Props {
  game: Game;
  playerId: string;
  isHost: boolean;
  activeMissions: Mission[];
  actions: GameActions;
}

export default function EndingScreen({ game, playerId, isHost, activeMissions, actions }: Props) {
  const [marking, setMarking] = useState<string | null>(null);
  const [storybookOpen, setStorybookOpen] = useState(false);

  const players = game.players ?? {};
  const votes = game.votes ?? {};
  const roles = game.roles ?? {};
  const scenario = game.scenarioId ? SCENARIO_MAP[game.scenarioId] : null;

  const syyllinenId = Object.entries(roles).find(([, r]) => r === "syyllinen")?.[0];
  const syyllinenName = syyllinenId ? players[syyllinenId]?.name : "Tuntematon";

  const playerCount = Object.keys(players).length;

  let endingType = computeEndingType(votes, syyllinenId, game.culpritConfessed ?? null, playerCount);

  // Upgrade to perfect_criminal if culprit escapes and completed ≥2 missions
  if (endingType === "culprit_escapes" || endingType === "secret_unsolved") {
    const completedCount = countCompletedMissions(game, activeMissions, syyllinenId);
    if (completedCount >= 2) {
      endingType = "perfect_criminal";
    }
  }

  const endingLabel = getEndingLabel(endingType);
  const invWon = investigatorsWon(endingType);
  const isPerfectCriminal = endingType === "perfect_criminal";

  const voteCounts: Record<string, number> = {};
  for (const accusedId of Object.values(votes)) {
    voteCounts[accusedId] = (voteCounts[accusedId] ?? 0) + 1;
  }
  const sortedVotes = Object.entries(voteCounts).sort((a, b) => b[1] - a[1]);

  const myRole = roles[playerId];
  const myRoleInfo = myRole ? ROLE_INFO[myRole] : null;
  const iAmSyyllinen = myRole === "syyllinen";
  const iWon = invWon ? !iAmSyyllinen : iAmSyyllinen;

  const myAchievements = computePlayerAchievements(game, playerId, endingType, syyllinenId);

  const syyllinenMissions = iAmSyyllinen ? activeMissions : [];
  const completedMissionCount = countCompletedMissions(game, activeMissions, syyllinenId);

  const handleCompleteMission = async (missionId: string) => {
    setMarking(missionId);
    await actions.completeMission(missionId).catch(() => {});
    setMarking(null);
  };

  const storybookText = scenario ? generateStorybookEnding(scenario, endingType) : null;

  return (
    <div className={`screen ending-screen ${isPerfectCriminal ? "ending-screen--perfect-criminal" : ""}`}>
      <div className="rain-overlay" />

      {/* Perfect Criminal hero banner */}
      {isPerfectCriminal && (
        <div className="perfect-criminal-banner">
          <div className="perfect-criminal-glow" />
          <div className="perfect-criminal-content">
            <div className="perfect-criminal-icon">🩸</div>
            <h1 className="perfect-criminal-title">TÄYDELLINEN RIKOLLINEN</h1>
            <p className="perfect-criminal-sub">
              Syyllinen ei jäänyt kiinni — ja suoritti vähintään 2 salaista tehtävää.<br />
              Tämä on harvinaisin voitto pelissä.
            </p>
            <div className="perfect-criminal-name">{syyllinenName} voitti.</div>
          </div>
        </div>
      )}

      {/* Scenario header */}
      {scenario && (
        <div className="ending-scenario">
          <div className="ending-scenario-case">Tapaus</div>
          <div className="ending-scenario-name">{scenario.name}</div>
          <div className="ending-scenario-sub">
            Uhri: {scenario.victim} · Motiivi: {scenario.motive}
          </div>
        </div>
      )}

      {/* Ending type banner */}
      {!isPerfectCriminal && (
        <div
          className="ending-result-banner"
          style={{ borderColor: endingLabel.color + "66", background: endingLabel.color + "15" }}
        >
          <div className="ending-result-icon">{endingLabel.icon}</div>
          <div>
            <div className="ending-result-text" style={{ color: endingLabel.color }}>
              {endingLabel.title}
            </div>
            {endingType === "perfect_investigation" && (
              <div className="ending-result-sub">Kaikki äänestivät oikein — täydellinen suoritus!</div>
            )}
            {endingType === "secret_unsolved" && (
              <div className="ending-result-sub">Äänestys hajosi — totuus jäi piiloon.</div>
            )}
            {endingType === "culprit_confesses" && (
              <div className="ending-result-sub">Syyllinen tunnusti ennen äänestyksen päättymistä.</div>
            )}
          </div>
        </div>
      )}

      {/* Culprit reveal */}
      <div className={`ending-culprit ${isPerfectCriminal ? "ending-culprit--criminal" : ""}`}>
        <div className="ending-culprit-label">Syyllinen oli</div>
        <div className="ending-culprit-name">🩸 {syyllinenName}</div>
        {scenario && (
          <>
            <div className="ending-culprit-method">🗡 Tapa: {scenario.method}</div>
            <div className="ending-culprit-scene">{scenario.setting}</div>
          </>
        )}
      </div>

      {/* Culprit secret missions — shown to everyone at endgame */}
      {activeMissions.length > 0 && (
        <div className="ending-missions">
          <div className="ending-missions-header">
            <span>📋 Salaiset tehtävät</span>
            <span
              className={`missions-score ${completedMissionCount >= 2 ? "missions-score--success" : ""}`}
            >
              {completedMissionCount}/{activeMissions.length} suoritettu
            </span>
          </div>
          <div className="missions-list">
            {activeMissions.map((m) => {
              const status = getMissionStatus(game, m, syyllinenId);
              const isAuto = m.type !== "manual";
              return (
                <div
                  key={m.id}
                  className={`mission-card ${
                    status === true
                      ? "mission-card--done"
                      : status === false
                      ? "mission-card--failed"
                      : "mission-card--pending"
                  }`}
                >
                  <div className="mission-card-top">
                    <span className="mission-title">{m.title}</span>
                    <span className="mission-status-icon">
                      {status === true ? "✓" : status === false ? "✗" : "?"}
                    </span>
                  </div>
                  <div className="mission-desc">{m.description}</div>
                  {!isAuto && status === null && iAmSyyllinen && (
                    <button
                      className="btn btn-accent btn-sm"
                      onClick={() => handleCompleteMission(m.id)}
                      disabled={marking === m.id}
                    >
                      {marking === m.id ? "…" : "✓ Suoritin tämän"}
                    </button>
                  )}
                  {isAuto && (
                    <span className="mission-auto-label">Automaattinen seuranta</span>
                  )}
                </div>
              );
            })}
          </div>
          {!iAmSyyllinen && (
            <p className="hint-text" style={{ marginTop: ".5rem" }}>
              Syyllinen näkee yksityiskohtaisemman tehtävätilaston.
            </p>
          )}
        </div>
      )}

      {/* Vote tally */}
      <div className="ending-vote-summary">
        <div className="section-label">Äänestystulos</div>
        <div className="vote-tally">
          {sortedVotes.map(([id, count]) => (
            <div key={id} className="vote-row">
              <span className="vote-name">
                {players[id]?.name ?? id}
                {id === syyllinenId && " 🩸"}
              </span>
              <div className="vote-bar-wrap">
                <div className="vote-bar" style={{ width: `${Math.min(100, count * 25)}%` }} />
                <span className="vote-count">{count} ääntä</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* My personal result */}
      {myRoleInfo && (
        <div className="my-result-badge" style={{ borderColor: myRoleInfo.color, color: myRoleInfo.color }}>
          {myRoleInfo.icon} {myRoleInfo.name} — {iWon ? "🏆 Voitit!" : "💀 Hävisit."}
        </div>
      )}

      {/* Achievements */}
      {myAchievements.length > 0 && (
        <div className="achievements-panel">
          <div className="achievements-header">🏅 Saavutukset</div>
          <div className="achievements-list">
            {myAchievements.map((ach) => (
              <div key={ach.id} className={`achievement-card achievement-card--${ach.rarity}`}>
                <span className="achievement-icon">{ach.icon}</span>
                <div className="achievement-body">
                  <div className="achievement-name">{ach.name}</div>
                  <div className="achievement-desc">{ach.description}</div>
                </div>
                <span className="achievement-rarity">
                  {ach.rarity === "legendary" ? "⭐" : ach.rarity === "rare" ? "💎" : "✦"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Storybook ending */}
      {storybookText && (
        <div className="storybook-panel">
          <button
            className="storybook-toggle"
            onClick={() => setStorybookOpen((o) => !o)}
          >
            <span className="storybook-toggle-icon">📖</span>
            <span>Mitä todella tapahtui?</span>
            <span className="storybook-chevron">{storybookOpen ? "▲" : "▼"}</span>
          </button>
          {storybookOpen && (
            <div className="storybook-body">
              {scenario && (
                <div className="storybook-secret">
                  <span className="storybook-secret-label">Piilosalaisuus</span>
                  <span>{scenario.hiddenSecret}</span>
                </div>
              )}
              <p className="storybook-text">{storybookText}</p>
            </div>
          )}
        </div>
      )}

      {/* Secret revealed */}
      {game.secretRevealed && (
        <div className="ending-secret">
          <div className="ending-secret-label">🗝️ Paljastettu salaisuus</div>
          <div className="ending-secret-text">{game.secretRevealed}</div>
        </div>
      )}
<div className="ending-secret">
  <div className="ending-secret-label">
    👤 Ratkaisematon mysteeri
  </div>
  <div className="ending-secret-text">
    Murha ratkaistiin.
    <br /><br />
    Mutta yksi kysymys jäi vastaamatta...
    <br /><br />
    Missä Jani on?
    <br /><br />
    Hänen puhelimensa löydettiin laiturilta.
    Häntä ei nähty enää koskaan sinä yönä.
    <br /><br />
    Jatkuu...
  </div>
</div>
      <div className="ending-actions">
        {isHost && (
          <button className="btn btn-primary" onClick={() => actions.resetGame().catch(() => {})}>
            🔄 Pelaa uudelleen
          </button>
        )}
        {!isHost && <p className="hint-text">Isäntä voi aloittaa uuden pelin.</p>}
        <button className="btn btn-ghost" onClick={actions.leaveGame}>
          ← Poistu
        </button>
      </div>
    </div>
  );
}
