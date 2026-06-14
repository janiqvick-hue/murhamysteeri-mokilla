"use client";
import React from 'react';

interface HeaderProps {
  isPerfectCriminal: boolean;
  syyllinenName: string;
  endingType: string;
}

export default function EndingHeader({ isPerfectCriminal, syyllinenName, endingType }: HeaderProps) {
  const getMokkiEndingDetails = () => {
    switch (endingType) {
      case "perfect_investigation":
        return { title: "TÄYDELLINEN TUTKINTA", desc: "Koko mökkiseurue äänesti oikeaa syyllistä — totuus tuli julki!", color: "#10b981", icon: "⚖️" };
      case "culprit_escapes":
        return { title: "MURHAAJA PAKENI", desc: "Viaton mökkivieras tuomittiin. Todellinen murhaaja pakeni myrskyn silmään.", color: "#ef4444", icon: "🚪" };
      case "secret_unsolved":
        return { title: "MYSTEERI JÄI RATKEAMATTA", desc: "Äänestys jakautui tasan. Syyllinen piileskelee yhä mökissä teidän keskellänne.", color: "#f59e0b", icon: "🕵️‍♂️" };
      case "culprit_confesses":
        return { title: "SYYLLINEN TUNNUSTI", desc: "Paine kävi liian suureksi ja murhaaja murtui ennen loppuäänestystä.", color: "#ec4899", icon: "💬" };
      default:
        return { title: "PELI PÄÄTTYNYT", desc: "Mökin tapahtumat on käyty läpi.", color: "#94a3b8", icon: "🌲" };
    }
  };

  const mokkiEnding = getMokkiEndingDetails();

  return (
    <>
      {isPerfectCriminal && (
        <div style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #450a0a 100%)", padding: "20px", borderRadius: "12px", marginBottom: '20px', textAlign: 'center', border: '2px solid #ef4444' }}>
          <div style={{ fontSize: '40px' }}>🩸</div>
          <h1 style={{ color: '#ef4444', margin: '10px 0' }}>TÄYDELLINEN RIKOLLINEN</h1>
          <p style={{ color: '#cbd5e1', fontSize: '14px' }}>
            Syyllinen ei jäänyt kiinni — ja suoritti vähintään 2 salaista tehtävää.<br />
            Tämä on mökkimysteerin harvinaisin lopputulos.
          </p>
          <div style={{ fontWeight: 'bold', fontSize: '18px', marginTop: '10px', color: '#fcd34d' }}>{syyllinenName} voitti pelin.</div>
        </div>
      )}

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ textTransform: 'uppercase', fontSize: '12px', color: '#94a3b8' }}>Tapauksen loppuraportti</div>
        <div style={{ fontSize: '24px', color: '#dc2626', fontWeight: 'bold' }}>Murhamysteeri Mökillä</div>
        <div style={{ color: '#cbd5e1', fontSize: '14px', marginTop: '5px' }}>Yön kauheudet ovat ohi · Myrsky laantuu hiljalleen</div>
      </div>

      {!isPerfectCriminal && (
        <div style={{ border: `1px solid ${mokkiEnding.color}`, background: `${mokkiEnding.color}15`, padding: '15px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
          <div style={{ fontSize: '30px' }}>{mokkiEnding.icon}</div>
          <div>
            <div style={{ color: mokkiEnding.color, fontWeight: 'bold', fontSize: '18px' }}>{mokkiEnding.title}</div>
            <div style={{ color: '#cbd5e1', fontSize: '14px' }}>{mokkiEnding.desc}</div>
          </div>
        </div>
      )}

      <div style={{ background: '#1e293b', padding: '15px', borderRadius: '8px', textAlign: 'center', marginBottom: '20px', border: '1px solid #334155' }}>
        <div style={{ color: '#94a3b8', fontSize: '14px' }}>Mökin todellinen murhaaja oli</div>
        <div style={{ fontSize: '22px', color: '#ef4444', fontWeight: 'bold', margin: '5px 0' }}>🩸 {syyllinenName}</div>
      </div>
    </>
  );
}
"use client";
import React from 'react';
import type { Game, Mission } from '../types';
import { getMissionStatus, countCompletedMissions } from '../missions';

interface MissionsProps {
  game: Game;
  activeMissions: Mission[];
  syyllinenId: string | undefined;
  iAmSyyllinen: boolean;
  marking: string | null;
  handleCompleteMission: (id: string) => void;
}

export default function EndingMissions({ game, activeMissions, syyllinenId, iAmSyyllinen, marking, handleCompleteMission }: MissionsProps) {
  if (activeMissions.length === 0) return null;
  const completedCount = countCompletedMissions(game, activeMissions, syyllinenId);

  return (
    <div style={{ background: '#1e293b', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #334155' }}>
      <div style={{ display: 'flex', marginBottom: '10px', borderBottom: '1px solid #334155', paddingBottom: '5px' }}>
        <span style={{ fontWeight: 'bold' }}>📋 Syyllisen salaiset tavoitteet</span>
        <span style={{ color: completedCount >= 2 ? '#10b981' : '#f59e0b', marginLeft: 'auto', fontWeight: 'bold' }}>
          {completedCount}/{activeMissions.length} suoritettu
        </span>
      </div>
      <div>
        {activeMissions.map((m) => {
          const status = getMissionStatus(game, m, syyllinenId);
          const isAuto = m.type !== "manual";
          return (
            <div key={m.id} style={{ background: '#0f172a', padding: '10px', borderRadius: '6px', margin: '8px 0', borderLeft: status === true ? '4px solid #10b981' : '4px solid #334155' }}>
              <div style={{ display: 'flex', fontWeight: 'bold', fontSize: '14px' }}>
                <span>{m.title}</span>
                <span style={{ marginLeft: 'auto' }}>{status === true ? "✅" : status === false ? "❌" : "⏳"}</span>
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '3px' }}>{m.description}</div>
              
              {!isAuto && status === null && iAmSyyllinen && (
                <button
                  onClick={() => handleCompleteMission(m.id)}
                  disabled={marking === m.id}
                  style={{ marginTop: '8px', background: '#f59e0b', color: 'black', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                >
                  {marking === m.id ? "…" : "✓ Suoritin tämän mökillä"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
"use client";
import React, { useState } from "react";
import type { Game, Mission } from "./types";
import type { GameActions } from "./useGame";
import { countCompletedMissions } from "./missions";
import { computeEndingType, computePlayerAchievements } from "./achievements";

// Tuodaan uudet pilkotut komponentit
import EndingHeader from "./ending/EndingHeader";
import EndingMissions from "./ending/EndingMissions";

interface Props {
  game: Game;
  playerId: string;
  isHost: boolean;
  activeMissions: Mission[];
  actions: GameActions;
}

export default function EndingScreen({ game, playerId, isHost, activeMissions, actions }: Props) {
  const [marking, setMarking] = useState<string | null>(null);

  const players = game.players ?? {};
  const votes = game.votes ?? {};
  const roles = game.roles ?? {};

  const syyllinenId = Object.entries(roles).find(([, r]) => r === "syyllinen")?.[0];
  const syyllinenName = syyllinenId ? players[syyllinenId]?.name : "Tuntematon";
  const playerCount = Object.keys(players).length;

  let endingType = computeEndingType(votes, syyllinenId, game.culpritConfessed ?? null, playerCount);

  if (endingType === "culprit_escapes" || endingType === "secret_unsolved") {
    const completedCount = countCompletedMissions(game, activeMissions, syyllinenId);
    if (completedCount >= 2) endingType = "perfect_criminal";
  }

  const isPerfectCriminal = endingType === "perfect_criminal";

  // Lasketaan äänet
  const voteCounts: Record<string, number> = {};
  for (const accusedId of Object.values(votes)) {
    voteCounts[accusedId] = (voteCounts[accusedId] ?? 0) + 1;
  }
  const sortedVotes = Object.entries(voteCounts).sort((a, b) => b[1] - a[1]);

  const myRole = roles[playerId];
  const iAmSyyllinen = myRole === "syyllinen";
  const myAchievements = computePlayerAchievements(game, playerId, endingType, syyllinenId);

  const handleCompleteMission = async (missionId: string) => {
    setMarking(missionId);
    await actions.completeMission(missionId).catch(() => {});
    setMarking(null);
  };

  return (
    <div className={`screen ending-screen ${isPerfectCriminal ? "ending-screen--perfect-criminal" : ""}`}>
      <div className="rain-overlay" />

      {/* OSA 1: Yläosiot ja Bännerit */}
      <EndingHeader isPerfectCriminal={isPerfectCriminal} syyllinenName={syyllinenName} endingType={endingType} />

      {/* OSA 2: Salaiset Tehtävät */}
      <EndingMissions game={game} activeMissions={activeMissions} syyllinenId={syyllinenId} iAmSyyllinen={iAmSyyllinen} marking={marking} handleCompleteMission={handleCompleteMission} />

      {/* OSA 3: Äänestystilasto ja Saavutukset */}
      <div style={{ background: '#1e293b', padding: '15px', borderRadius: '8px', border: '1px solid #334155' }}>
        <div style={{ fontWeight: 'bold', color: '#f59e0b', borderBottom: '1px solid #334155', paddingBottom: '5px', marginBottom: '10px' }}>Äänestystulokset mökillä:</div>
        <div>
          {sortedVotes.map(([id, count]) => (
            <div key={id} style={{ display: 'flex', padding: '5px 0', borderBottom: '1px dashed #334155' }}>
              <span>👤 {players[id]?.name ?? id} {id === syyllinenId && " 🩸 (Syyllinen)"}</span>
              <span style={{ marginLeft: 'auto', fontWeight: 'bold' }}>{count} ääntä</span>
            </div>
          ))}
        </div>
      </div>

      {myAchievements && myAchievements.length > 0 && (
        <div style={{ marginTop: '20px', background: '#13141f', padding: '15px', borderRadius: '8px', border: '1px solid #ec4899', textAlign: 'center' }}>
          <h4 style={{ color: '#ec4899', margin: '0 0 5px 0' }}>🏆 Henkilökohtaiset saavutuksesi:</h4>
          {myAchievements.map((ach, idx) => (
            <div key={idx} style={{ fontWeight: 'bold', color: '#fcd34d', fontSize: '16px' }}>✨ {ach}</div>
          ))}
        </div>
      )}
    </div>
  );
}
