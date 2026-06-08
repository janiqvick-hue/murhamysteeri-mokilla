import { useState, useEffect } from "react";
import type { Game, Clue, WitnessEvent, Mission } from "../types";
import type { GameActions } from "../hooks/useGame";
import { LOCATIONS } from "./locations";
import { CATEGORY_LABELS, getCluesForScenario } from "../content/clues";
import { ROLE_INFO } from "../content/roles";
import { SCENARIO_MAP } from "../content/scenarios";
import { getMissionStatus } from "../content/missions";
import type { Scenario } from "../types";
import InventoryPanel from "./InventoryPanel";

interface Props {
  game: Game;
  playerId: string;
  isHost: boolean;
  myRole: import("../types").Role | null;
  myInventory: string[];
  activeMissions: Mission[];
  actions: GameActions;
}

interface SabotageState {
  open: boolean;
  clueId: string | null;
  type: "remove" | "replace";
  fakeText: string;
  submitting: boolean;
  error: string | null;
}

export default function MapScreen({
  game,
  playerId,
  isHost,
  myRole,
  myInventory,
  activeMissions,
  actions,
}: Props) {
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [missionsOpen, setMissionsOpen] = useState(false);
  const [startingVote, setStartingVote] = useState(false);
  const [justPicked, setJustPicked] = useState<string | null>(null);
  const [dismissedEvents, setDismissedEvents] = useState<Set<string>>(new Set());
  const [now, setNow] = useState(Date.now);
  const [sabotage, setSabotage] = useState<SabotageState>({
    open: false,
    clueId: null,
    type: "remove",
    fakeText: "",
    submitting: false,
    error: null,
  });

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(interval);
  }, []);

  const myLocation = game.players?.[playerId]?.location ?? LOCATIONS[0].id;
  const roleInfo = myRole ? ROLE_INFO[myRole] : null;
  const isSyyllinen = myRole === "syyllinen";
  const isVartija = myRole === "salaisuuden_vartija";
  const scenario: Scenario | null = game.scenarioId
    ? (SCENARIO_MAP[game.scenarioId] ?? null)
    : null;

  const activeClues = getCluesForScenario(scenario);
  const locationClues = activeClues.filter((c) => c.locationId === myLocation);
  const locationRedHerrings = Object.values(game.redHerringClues ?? {}).filter(
    (rh) => rh.locationId === myLocation
  );
  const gameSubtitle = scenario
    ? `${scenario.name} · Uhri: ${scenario.victim}`
    : null;

  const players = Object.entries(game.players ?? {});
  const isSabotageDone = !!game.sabotage;
  const isSecretRevealed = !!game.secretRevealed;

  const elapsed = game.gameStartedAt ? now - game.gameStartedAt : 0;
  const revealedEvents: WitnessEvent[] = Object.values(game.witnessEvents ?? {})
    .filter((e) => elapsed >= e.revealDelayMs)
    .sort((a, b) => b.revealDelayMs - a.revealDelayMs);
  const activeEvent = revealedEvents.find((e) => !dismissedEvents.has(e.id)) ?? null;

  // Mission progress for syyllinen
  const syyllinenId = isSyyllinen
    ? playerId
    : Object.entries(game.roles ?? {}).find(([, r]) => r === "syyllinen")?.[0];

  const missionStatuses = activeMissions.map((m) => getMissionStatus(game, m, syyllinenId));
  const completedCount = missionStatuses.filter((s) => s === true).length;
  const totalMissions = activeMissions.length;

  const handleMove = async (locationId: string) => {
    if (locationId === myLocation) return;
    await actions.moveToLocation(locationId).catch(() => {});
  };

  const handlePickUp = async (clueId: string) => {
    if (myInventory.includes(clueId)) return;
    setJustPicked(clueId);
    setTimeout(() => setJustPicked(null), 1200);
    await actions.pickUpClue(clueId).catch(() => {});
  };

  const handleStartVoting = async () => {
    setStartingVote(true);
    await actions.startVoting().catch(() => {});
    setStartingVote(false);
  };

  const handleRevealSecret = async () => {
    await actions.revealSecret().catch(() => {});
  };

  const handleCompleteMission = async (missionId: string) => {
    await actions.completeMission(missionId).catch(() => {});
  };

  const handleSabotageSubmit = async () => {
    if (!sabotage.clueId) return;
    if (sabotage.type === "replace" && !sabotage.fakeText.trim()) {
      setSabotage((s) => ({ ...s, error: "Kirjoita väärä tieto." }));
      return;
    }
    setSabotage((s) => ({ ...s, submitting: true, error: null }));
    try {
      await actions.sabotageClue(
        sabotage.clueId,
        sabotage.type,
        sabotage.type === "remove" ? "[Vihje poistettu]" : sabotage.fakeText.trim()
      );
      setSabotage({ open: false, clueId: null, type: "remove", fakeText: "", submitting: false, error: null });
    } catch (e: unknown) {
      setSabotage((s) => ({
        ...s,
        submitting: false,
        error: e instanceof Error ? e.message : "Virhe.",
      }));
    }
  };

  const getClueText = (clue: Clue): string => {
    const sab = game.sabotage;
    if (sab?.clueId === clue.id && sab.type === "replace" && myRole !== "syyllinen") {
      return sab.fakeText;
    }
    if (myRole === "syyllinen") return clue.syyllinenText;
    if (myRole === "salaisuuden_vartija" && clue.salaisuusHint) {
      return clue.normalText + "\n\n🗝 Vartijan havainto: " + clue.salaisuusHint;
    }
    return clue.normalText;
  };

  const isClueHidden = (clue: Clue): boolean => {
    const sab = game.sabotage;
    return sab?.clueId === clue.id && sab.type === "remove" && myRole !== "syyllinen";
  };

  const isClueReplaced = (clue: Clue): boolean => {
    const sab = game.sabotage;
    return sab?.clueId === clue.id && sab.type === "replace" && myRole !== "syyllinen";
  };

  const isClueSabotaged = (clue: Clue): boolean =>
    game.sabotage?.clueId === clue.id && myRole === "syyllinen";

  const visibleClues = locationClues.filter((c) => !isClueHidden(c));
  const currentLoc = LOCATIONS.find((l) => l.id === myLocation);

  const allSabotageTargets = [
    ...locationClues,
    ...locationRedHerrings.map((rh) => ({ id: rh.id, name: rh.name })),
  ];

  const progressPct = totalMissions > 0 ? (completedCount / totalMissions) * 100 : 0;

  return (
    <div className="screen">
      <div className="rain-overlay" />

      {/* Witness event banner */}
      {activeEvent && (
        <div className="witness-banner">
          <div className="witness-banner-head">
            <span className="witness-banner-icon">📣</span>
            <span className="witness-banner-title">{activeEvent.title}</span>
            <span className="witness-banner-hint">📍 {activeEvent.locationHint}</span>
            <button
              className="witness-dismiss"
              onClick={() => setDismissedEvents((s) => new Set([...s, activeEvent.id]))}
            >
              ✕
            </button>
          </div>
          <p className="witness-banner-text">{activeEvent.text}</p>
        </div>
      )}

      {/* Secret revealed banner */}
      {isSecretRevealed && (
        <div className="secret-banner">
          <span className="secret-banner-icon">🗝️</span>
          <div className="secret-banner-body">
            <div className="secret-banner-label">Salaisuus paljastettu!</div>
            <div className="secret-banner-text">{game.secretRevealed}</div>
          </div>
        </div>
      )}

      <div className="map-header">
        <div>
          <div className="map-role-badge" style={{ color: roleInfo?.color ?? "#f1f5f9" }}>
            {roleInfo?.icon} {roleInfo?.name}
          </div>
          {gameSubtitle && <div className="map-scenario-sub">{gameSubtitle}</div>}
        </div>
        <div className="map-actions">
          <button className="inv-btn" onClick={() => setInventoryOpen(true)}>
            🎒 <span className="inv-count">{myInventory.length}</span>
          </button>
          {isSyyllinen && !isSabotageDone && (
            <button
              className="btn btn-danger btn-sm"
              onClick={() => setSabotage((s) => ({ ...s, open: true }))}
            >
              🔪 Sabotoi
            </button>
          )}
          {isSyyllinen && isSabotageDone && (
            <span className="sabotage-done-badge">🔒 Sabotatoitu</span>
          )}
          {isVartija && !isSecretRevealed && (
            <button className="btn btn-amber btn-sm" onClick={handleRevealSecret}>
              🗝️ Paljasta
            </button>
          )}
          {isHost && (
            <button
              className="btn btn-danger btn-sm"
              onClick={handleStartVoting}
              disabled={startingVote}
            >
              {startingVote ? "…" : "🗳 Äänestys"}
            </button>
          )}
        </div>
      </div>

      <div className="map-grid">
        {LOCATIONS.map((loc) => {
          const isHere = myLocation === loc.id;
          const playersHere = players.filter(([, p]) => p.location === loc.id);
          return (
            <button
              key={loc.id}
              className={`loc-tile ${isHere ? "loc-tile--active" : ""}`}
              onClick={() => handleMove(loc.id)}
            >
              <span className="loc-emoji">{loc.emoji}</span>
              <span className="loc-name">{loc.name}</span>
              {playersHere.length > 0 && (
                <div className="loc-avatars">
                  {playersHere.slice(0, 3).map(([id, p]) => (
                    <span
                      key={id}
                      className={`loc-avatar ${id === playerId ? "loc-avatar--me" : ""}`}
                      title={p.name}
                    >
                      {p.name.charAt(0).toUpperCase()}
                    </span>
                  ))}
                  {playersHere.length > 3 && (
                    <span className="loc-avatar">+{playersHere.length - 3}</span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Culprit mission HUD */}
      {isSyyllinen && activeMissions.length > 0 && (
        <div className={`missions-hud ${missionsOpen ? "missions-hud--open" : ""}`}>
          <button
            className="missions-hud-toggle"
            onClick={() => setMissionsOpen((o) => !o)}
          >
            <span className="missions-hud-icon">📋</span>
            <span className="missions-hud-label">Salaiset tehtävät</span>
            <div className="missions-hud-progress-wrap">
              <div className="missions-hud-progress-bar">
                <div
                  className="missions-hud-progress-fill"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="missions-hud-count">
                {completedCount}/{totalMissions}
              </span>
            </div>
            <span className="missions-hud-chevron">{missionsOpen ? "▼" : "▲"}</span>
          </button>

          {missionsOpen && (
            <div className="missions-hud-body">
              {activeMissions.map((m, i) => {
                const status = missionStatuses[i];
                return (
                  <div
                    key={m.id}
                    className={`missions-hud-item ${status === true ? "missions-hud-item--done" : ""}`}
                  >
                    <span className="missions-hud-item-icon">
                      {status === true ? "✓" : "○"}
                    </span>
                    <div className="missions-hud-item-body">
                      <div className="missions-hud-item-title">{m.title}</div>
                      <div className="missions-hud-item-desc">{m.description}</div>
                    </div>
                    {m.type === "manual" && status === null && (
                      <button
                        className="btn btn-accent btn-sm"
                        onClick={() => handleCompleteMission(m.id)}
                      >
                        ✓
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="location-panel">
        <h2 className="location-panel-title">
          {currentLoc?.emoji} {currentLoc?.name}
        </h2>
        <p className="location-desc">{currentLoc?.description}</p>

        <div className="clue-list">
          {visibleClues.length === 0 && locationRedHerrings.length === 0 && (
            <p className="hint-text">Ei vihjeitä täällä.</p>
          )}

          {visibleClues.map((clue) => {
            const picked = myInventory.includes(clue.id);
            const replaced = isClueReplaced(clue);
            const sabotaged = isClueSabotaged(clue);
            const catInfo = CATEGORY_LABELS[clue.category];
            const isNew = justPicked === clue.id;
            return (
              <div
                key={clue.id}
                className={`clue-card ${picked ? "clue-card--picked" : ""} ${sabotaged ? "clue-card--sabotaged" : ""} ${isNew ? "clue-card--new" : ""}`}
              >
                <div className="clue-card-header">
                  <div className="clue-meta">
                    <span className="clue-name">🔎 {clue.name}</span>
                    <span className="clue-category" style={{ color: catInfo?.color }}>
                      {catInfo?.icon} {catInfo?.label}
                    </span>
                  </div>
                  <div className="clue-actions">
                    {sabotaged && (
                      <span className="sabotage-badge">
                        {game.sabotage?.type === "remove" ? "🗑 Poistettu" : "✏️ Korvattu"}
                      </span>
                    )}
                    {replaced && !picked && <span className="replaced-badge">⚠️ Muutettu</span>}
                    {!picked && !sabotaged && (
                      <button className="btn btn-sm btn-accent" onClick={() => handlePickUp(clue.id)}>
                        + Ota
                      </button>
                    )}
                    {picked && <span className="picked-label">✓ Kerätty</span>}
                  </div>
                </div>
                <p className="clue-text">{getClueText(clue)}</p>
              </div>
            );
          })}

          {locationRedHerrings.map((rh) => {
            const picked = myInventory.includes(rh.id);
            const isNew = justPicked === rh.id;
            return (
              <div
                key={rh.id}
                className={`clue-card clue-card--red-herring ${picked ? "clue-card--picked" : ""} ${isNew ? "clue-card--new" : ""}`}
              >
                <div className="clue-card-header">
                  <div className="clue-meta">
                    <span className="clue-name">🔎 {rh.name}</span>
                    <span className="clue-category" style={{ color: "#ef4444" }}>
                      {isSyyllinen ? "⚠️ Harhaanjohto" : "❓ Epäilyttävä esine"}
                    </span>
                  </div>
                  <div className="clue-actions">
                    {!picked && (
                      <button className="btn btn-sm btn-accent" onClick={() => handlePickUp(rh.id)}>
                        + Ota
                      </button>
                    )}
                    {picked && <span className="picked-label">✓ Kerätty</span>}
                  </div>
                </div>
                <p className="clue-text">
                  {isSyyllinen
                    ? `[Harhaanjohto] Osoittaa kohti: ${rh.targetPlayerName}. Voit käyttää tätä eduksesi.`
                    : rh.normalText}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {inventoryOpen && (
        <InventoryPanel
          myInventory={myInventory}
          myRole={myRole}
          game={game}
          onClose={() => setInventoryOpen(false)}
        />
      )}

      {sabotage.open && (
        <div className="modal-overlay" onClick={() => setSabotage((s) => ({ ...s, open: false }))}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">🔪 Sabotoi vihje</h2>
              <button className="inv-close" onClick={() => setSabotage((s) => ({ ...s, open: false }))}>✕</button>
            </div>
            <p className="hint-text">Voit käyttää tämän vain kerran koko pelissä.</p>
            <div className="sabotage-section">
              <div className="section-label">Valitse vihje</div>
              <div className="sabotage-clue-list">
                {allSabotageTargets.length === 0 && (
                  <p className="hint-text">Ei vihjeitä tässä paikassa. Siirry toisaalle.</p>
                )}
                {allSabotageTargets.map((clue) => (
                  <button
                    key={clue.id}
                    className={`sabotage-clue-btn ${sabotage.clueId === clue.id ? "sabotage-clue-btn--active" : ""}`}
                    onClick={() => setSabotage((s) => ({ ...s, clueId: clue.id }))}
                  >
                    🔎 {clue.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="sabotage-section">
              <div className="section-label">Toiminto</div>
              <div className="option-row">
                <button
                  className={`option-btn ${sabotage.type === "remove" ? "option-btn--active" : ""}`}
                  onClick={() => setSabotage((s) => ({ ...s, type: "remove" }))}
                >
                  🗑 Poista vihje
                </button>
                <button
                  className={`option-btn ${sabotage.type === "replace" ? "option-btn--active" : ""}`}
                  onClick={() => setSabotage((s) => ({ ...s, type: "replace" }))}
                >
                  ✏️ Korvaa väärällä
                </button>
              </div>
            </div>
            {sabotage.type === "replace" && (
              <div className="sabotage-section">
                <div className="section-label">Väärä tieto</div>
                <textarea
                  className="field-input sabotage-textarea"
                  placeholder="Kirjoita harhaanjohtava teksti…"
                  value={sabotage.fakeText}
                  onChange={(e) => setSabotage((s) => ({ ...s, fakeText: e.target.value }))}
                  rows={3}
                />
              </div>
            )}
            {sabotage.error && <div className="error-msg">{sabotage.error}</div>}
            <button
              className="btn btn-danger"
              onClick={handleSabotageSubmit}
              disabled={!sabotage.clueId || sabotage.submitting || allSabotageTargets.length === 0}
            >
              {sabotage.submitting ? "Sabotoidaan…" : "⚡ Vahvista sabotaasi"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
