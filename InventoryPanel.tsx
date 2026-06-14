"use client";
import { useEffect } from "react";
import { CLUES, CATEGORY_LABELS, getCluesForScenario } from "./clues";
import { LOCATION_MAP } from "./locations";
import { ROLE_INFO } from "./roles";
import { SCENARIO_MAP } from "./scenarios";
import type { Role, Game } from "./types";

interface Props {
  myInventory: string[];
  myRole: Role | null;
  game: Game;
  onClose: () => void;
}

export default function InventoryPanel({ myInventory, myRole, game, onClose }: Props) {
  // Suljetaan paneeli Escape-näppäimestä
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

  // Lasketaan vihjeteksti roolin ja mahdollisten sabotaasien mukaan mökkiteemassa
  const getClueText = (clue: (typeof CLUES)[0]) => {
    const sab = game.sabotage;
    
    // Jos syyllinen on väärentänyt vihjeen, näytetään muille väärää tietoa
    if (sab?.clueId === clue.id && sab.type === "replace" && myRole !== "syyllinen") {
      return sab.fakeText;
    }
    
    // Syyllinen näkee aina totuuden ja omat tietonsa
    if (myRole === "syyllinen") return clue.syyllinenText;
    
    // Salaisuuden Vartija näkee normaalin vihjeen lisäksi oman piilotetun havaintonsa
    if (myRole === "salaisuuden_vartija" && clue.salaisuusHint)
      return clue.normalText + "\n\n🗝 Vartijan lisähavainto mökistä: " + clue.salaisuusHint;
      
    return clue.normalText;
  };

  const roleInfo = myRole ? ROLE_INFO[myRole] : null;

  return (
    <div className="inv-overlay" onClick={onClose} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', zIndex: 1000 }}>
      <div className="inv-panel" onClick={(e) => e.stopPropagation()} style={{ background: '#1e293b', width: '100%', maxWidth: '500px', borderTopLeftRadius: '16px', borderTopRightRadius: '16px', padding: '20px', maxHeight: '85vh', overflowY: 'auto', border: '1px solid #334155', color: 'white' }}>
        <div className="inv-handle" style={{ width: '40px', height: '4px', background: '#475569', borderRadius: '2px', margin: '0 auto 15px auto' }} />
        
        <div className="inv-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid #334155', paddingBottom: '10px' }}>
          <h2 className="inv-title" style={{ margin: 0, fontSize: '20px', color: '#ffb4ab' }}>📱 Etsivän muistikirja</h2>
          {roleInfo && (
            <span className="inv-role" style={{ color: roleInfo.color, fontWeight: 'bold', fontSize: '14px', background: '#0f172a', padding: '4px 8px', borderRadius: '6px' }}>
              {roleInfo.icon} {roleInfo.name}
            </span>
          )}
          <button className="inv-close" onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '20px', cursor: 'pointer' }}>✕</button>
        </div>

        {collectedClues.length === 0 ? (
          <div className="inv-empty" style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
            <p style={{ fontSize: '16px' }}>Et ole löytänyt vihjeitä vielä tähän puhelimeen.</p>
            <p className="hint-text" style={{ fontSize: '13px', color: '#64748b' }}>Tutki mökin huoneita ja poimi todisteita talteen.</p>
          </div>
        ) : (
          <div className="inv-items" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {collectedClues.map((clue) => {
              const loc = LOCATION_MAP[clue.locationId];
              const catInfo = CATEGORY_LABELS[clue.category];
              const isSabotaged = game.sabotage?.clueId === clue.id && myRole === "syyllinen";
              
              return (
                <div key={clue.id} className={`inv-clue-card ${isSabotaged ? "inv-clue-card--sabotaged" : ""}`} style={{ background: '#0f172a', padding: '15px', borderRadius: '8px', border: isSabotaged ? '1px solid #ef4444' : '1px solid #334155' }}>
                  <div className="inv-clue-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', flexWrap: 'wrap', gap: '5px' }}>
                    <span className="inv-clue-name" style={{ fontWeight: 'bold', color: '#f59e0b' }}>🔎 {clue.name}</span>
                    <div className="inv-clue-meta" style={{ display: 'flex', gap: '10px', fontSize: '12px' }}>
                      <span className="inv-clue-loc" style={{ color: '#cbd5e1' }}>
                        {loc?.emoji} {loc?.name}
                      </span>
                      <span className="inv-clue-cat" style={{ color: catInfo?.color }}>
                        {catInfo?.icon} {catInfo?.label}
                      </span>
                    </div>
                  </div>
                  <p className="inv-clue-text" style={{ fontSize: '14px', color: '#e2e8f0', margin: '5px 0', lineHeight: '1.4', whiteSpace: 'pre-line' }}>{getClueText(clue)}</p>
                  
                  {isSabotaged && (
                    <div className="sabotage-badge" style={{ color: '#ef4444', fontSize: '11px', fontWeight: 'bold', marginTop: '5px', textTransform: 'uppercase' }}>
                      {game.sabotage?.type === "remove" ? "🗑 Poistettu muilta pelaajilta" : "✏️ Korvattu väärällä tiedolla muille"}
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
