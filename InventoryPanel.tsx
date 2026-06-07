import { useEffect } from "react";
import { CLUES, CATEGORY_LABELS, getCluesForScenario } from "../content/clues";
import { LOCATION_MAP } from "../content/locations";
import { ROLE_INFO } from "../content/roles";
import { SCENARIO_MAP } from "../content/scenarios";
import type { Role, Game } from "../types";

interface Props {
  myInventory: string[];
  myRole: Role | null;
  game: Game;
  onClose: () => void;
}

export default function InventoryPanel({ myInventory, myRole, game, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const scenario = game.scenarioId ? (SCENARIO_MAP[game.scenarioId] ?? null) : null;
  const activeClues = getCluesForScenario(scenario);
  const collectedClues = activeClues.filter((c) => myInventory.includes(c.id));

  const getClueText = (clue: (typeof CLUES)[0]) => {
    const sab = game.sabotage;
    if (sab?.clueId === clue.id && sab.type === "replace" && myRole !== "syyllinen") {
      return sab.fakeText;
    }
    if (myRole === "syyllinen") return clue.syyllinenText;
    if (myRole === "salaisuuden_vartija" && clue.salaisuusHint)
      return clue.normalText + "\n\n🗝 Vartijan havainto: " + clue.salaisuusHint;
    return clue.normalText;
  };

  const roleInfo = myRole ? ROLE_INFO[myRole] : null;

  return (
    <div className="inv-overlay" onClick={onClose}>
      <div className="inv-panel" onClick={(e) => e.stopPropagation()}>
        <div className="inv-handle" />
        <div className="inv-header">
          <h2 className="inv-title">🎒 Inventaario</h2>
          {roleInfo && (
            <span className="inv-role" style={{ color: roleInfo.color }}>
              {roleInfo.icon} {roleInfo.name}
            </span>
          )}
          <button className="inv-close" onClick={onClose}>✕</button>
        </div>

        {collectedClues.length === 0 ? (
          <div className="inv-empty">
            <p>Et ole kerännyt vihjeitä vielä.</p>
            <p className="hint-text">Liiku paikkoihin ja poimi vihjeitä.</p>
          </div>
        ) : (
          <div className="inv-items">
            {collectedClues.map((clue) => {
              const loc = LOCATION_MAP[clue.locationId];
              const catInfo = CATEGORY_LABELS[clue.category];
              const isSabotaged = game.sabotage?.clueId === clue.id && myRole === "syyllinen";
              return (
                <div key={clue.id} className={`inv-clue-card ${isSabotaged ? "inv-clue-card--sabotaged" : ""}`}>
                  <div className="inv-clue-header">
                    <span className="inv-clue-name">🔎 {clue.name}</span>
                    <div className="inv-clue-meta">
                      <span className="inv-clue-loc">
                        {loc?.emoji} {loc?.name}
                      </span>
                      <span className="inv-clue-cat" style={{ color: catInfo?.color }}>
                        {catInfo?.icon} {catInfo?.label}
                      </span>
                    </div>
                  </div>
                  <p className="inv-clue-text">{getClueText(clue)}</p>
                  {isSabotaged && (
                    <div className="sabotage-badge">
                      {game.sabotage?.type === "remove" ? "🗑 Poistettu muilta" : "✏️ Korvattu väärällä tiedolla"}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
