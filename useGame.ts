import { useEffect, useRef, useState } from "react";
import {
  ref,
  onValue,
  set,
  update,
  type Unsubscribe,
} from "firebase/database";
import { db, firebaseConfigured } from "./firebase";
import type { Game, Role, SabotageAction, WitnessEvent, RedHerringClue, Scenario } from "./types";
import { assignRoles } from "./roles";
import { LOCATIONS } from "./locations";
import { CLUE_MAP } from "./clues";
import { MISSION_POOL, assignMissions } from "./missions";
import { pickRandomScenario, SCENARIO_MAP } from "./scenarios";
import type { Mission } from "./types";

import {
  generateGameCode,
  getOrCreatePlayerId,
  saveGameCode,
  clearGameCode,
} from "./gameCode";

export interface GameActions {
  createGame: (playerName: string) => Promise<string>;
  joinGame: (code: string, playerName: string) => Promise<void>;
  startNow: () => Promise<void>;
  startCountdown: (minutes: number) => Promise<void>;
  startPlaying: () => Promise<void>;
  moveToLocation: (locationId: string) => Promise<void>;
  pickUpClue: (clueId: string) => Promise<void>;
  sabotageClue: (clueId: string, type: "remove" | "replace", fakeText: string) => Promise<void>;
  completeMission: (missionId: string) => Promise<void>;
  revealSecret: () => Promise<void>;
  confessAsCulprit: () => Promise<void>;
  submitVote: (accusedId: string) => Promise<void>;
  startVoting: () => Promise<void>;
  resetGame: () => Promise<void>;
  leaveGame: () => void;
}

export interface UseGameReturn {
  game: Game | null;
  loading: boolean;
  error: string | null;
  playerId: string;
  isHost: boolean;
  myRole: Role | null;
  myInventory: string[];
  countdownSecsLeft: number;
  scenario: Scenario | null;
  activeMissions: Mission[];
  actions: GameActions;
}

function buildWitnessEvents(scenario: Scenario): Record<string, WitnessEvent> {
  return Object.fromEntries(scenario.witnessEventTemplates.map((t) => [t.id, t]));
}

function buildRedHerringClues(
  scenario: Scenario,
  playerIds: string[],
  roles: Record<string, Role>,
  players: Record<string, { name: string; location: string; ready: boolean }>
): Record<string, RedHerringClue> {
  const innocents = playerIds.filter((id) => roles[id] !== "syyllinen");
  if (innocents.length === 0) return {};
  const shuffled = [...innocents].sort(() => Math.random() - 0.5);
  const result: Record<string, RedHerringClue> = {};
  scenario.redHerringTemplates.forEach((template, i) => {
    const targetId = shuffled[i % shuffled.length];
    const targetName = players[targetId]?.name ?? "Tuntematon";
    result[template.id] = {
      id: template.id,
      locationId: template.locationId,
      name: template.name,
      normalText: template.normalTextTemplate.replace("{target}", targetName),
      targetPlayerId: targetId,
      targetPlayerName: targetName,
    };
  });
  return result;
}

function buildGameStart(game: Game, playerIds: string[]) {
  const roles = assignRoles(playerIds);
  const scenario = pickRandomScenario();
  const missionCount: 3 | 4 = playerIds.length >= 5 ? 4 : 3;
  const missions = assignMissions(missionCount);
  const missionIds = Object.fromEntries(missions.map((m) => [m.id, true]));
  const witnessEvents = buildWitnessEvents(scenario);
  const redHerringClues = buildRedHerringClues(scenario, playerIds, roles, game.players);
  return {
    status: "roleReveal" as const,
    roles,
    scenarioId: scenario.id,
    missionIds,
    completedMissions: {},
    sabotage: null,
    secretRevealed: null,
    secretRevealedAt: null,
    culpritConfessed: null,
    gameStartedAt: null,
    witnessEvents,
    redHerringClues,
    syyllinenVisits: null,
  };
}

export function useGame(code: string | null): UseGameReturn {
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countdownSecsLeft, setCountdownSecsLeft] = useState(0);
  const playerId = getOrCreatePlayerId();
  const unsubRef = useRef<Unsubscribe | null>(null);
  const gameRef =
  firebaseConfigured && code
    ? ref(db, `games/${code}`)
    : null;

  useEffect(() => {
    if (!firebaseConfigured || !code) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const gRef = ref(db, `games/${code}`);
    const unsubscribe = onValue(
      gRef,
      (snapshot) => {
        const data = snapshot.val() as Game | null;
        if (!data) {
          setError("Peliä ei löydy koodilla: " + code);
          setGame(null);
        } else {
          setGame(data);
          setError(null);
        }
        setLoading(false);
      },
      (err) => {
        setError("Firebase-virhe: " + err.message);
        setLoading(false);
      }
    );
    unsubRef.current = unsubscribe;
    return () => unsubscribe();
  }, [code]);

  const isHost = !!game && game.hostId === playerId;

  useEffect(() => {
    if (!game || game.status !== "countdown" || !game.countdownEnd) {
      setCountdownSecsLeft(0);
      return;
    }
    const tick = () => {
      const left = Math.max(0, Math.ceil((game.countdownEnd! - Date.now()) / 1000));
      setCountdownSecsLeft(left);
      if (left === 0 && isHost && gameRef) {
        const playerIds = Object.keys(game.players ?? {});
        update(gameRef, buildGameStart(game, playerIds));
      }
    };
    tick();
    const interval = setInterval(tick, 500);
    return () => clearInterval(interval);
  }, [game?.status, game?.countdownEnd, isHost]);

  const myRole: Role | null = (game?.roles?.[playerId] as Role | undefined) ?? null;

  const myInventory: string[] = game?.inventories?.[playerId]
    ? Object.keys(game.inventories[playerId])
    : [];

  const scenario: Scenario | null = game?.scenarioId
    ? (SCENARIO_MAP[game.scenarioId] ?? null)
    : null;

  const activeMissions: Mission[] = game?.missionIds
    ? MISSION_POOL.filter((m) => game.missionIds?.[m.id])
    : [];

  const actions: GameActions = {
    createGame: async (playerName: string) => {
      const newCode = generateGameCode();
      const newGameRef = ref(db, `games/${newCode}`);
      const newGame: Game = {
        hostId: playerId,
        status: "lobby",
        countdownMinutes: 5,
        countdownEnd: null,
        createdAt: Date.now(),
        scenarioId: null,
        players: {
          [playerId]: { name: playerName, location: LOCATIONS[0].id, ready: false },
        },
        roles: {},
        votes: {},
        inventories: {},
        missionIds: {},
        completedMissions: {},
        sabotage: null,
        secretRevealed: null,
        secretRevealedAt: null,
        culpritConfessed: null,
        gameStartedAt: null,
        witnessEvents: null,
        redHerringClues: null,
        syyllinenVisits: null,
      };
      await set(newGameRef, newGame);
      saveGameCode(newCode);
      return newCode;
    },

    joinGame: async (joinCode: string, playerName: string) => {
      const target = ref(db, `games/${joinCode}`);
      const snap = await new Promise<Game | null>((resolve) => {
        onValue(target, (s) => resolve(s.val()), { onlyOnce: true });
      });
      if (!snap) throw new Error("Peliä ei löydy koodilla: " + joinCode);
      if (snap.status !== "lobby")
        throw new Error("Peli on jo käynnissä. Et voi liittyä.");
      await update(ref(db, `games/${joinCode}/players/${playerId}`), {
        name: playerName,
        location: LOCATIONS[0].id,
        ready: false,
      });
      saveGameCode(joinCode);
    },

    startNow: async () => {
      if (!gameRef || !game) return;
      const playerIds = Object.keys(game.players ?? {});
      if (playerIds.length < 2) throw new Error("Tarvitaan vähintään 2 pelaajaa.");
      await update(gameRef, buildGameStart(game, playerIds));
    },

    startCountdown: async (minutes: number) => {
      if (!gameRef || !game) return;
      const playerIds = Object.keys(game.players ?? {});
      if (playerIds.length < 2) throw new Error("Tarvitaan vähintään 2 pelaajaa.");
      await update(gameRef, {
        countdownMinutes: minutes,
        countdownEnd: Date.now() + minutes * 60 * 1000,
        status: "countdown",
      });
    },

    startPlaying: async () => {
      if (!gameRef) return;
      await update(gameRef, { status: "playing", gameStartedAt: Date.now() });
    },

    moveToLocation: async (locationId: string) => {
      if (!code) return;
      const updates: Record<string, unknown> = {
        [`games/${code}/players/${playerId}/location`]: locationId,
      };
      if (myRole === "syyllinen") {
        updates[`games/${code}/syyllinenVisits/${locationId}`] = true;
      }
      await update(ref(db), updates);
    },

    pickUpClue: async (clueId: string) => {
      if (!code) return;
      await set(ref(db, `games/${code}/inventories/${playerId}/${clueId}`), true);
    },

    sabotageClue: async (clueId: string, type: "remove" | "replace", fakeText: string) => {
      if (!gameRef || !game) return;
      const clue = CLUE_MAP[clueId];
      if (!clue) throw new Error("Vihje ei löydy.");
      const action: SabotageAction = {
        type,
        clueId,
        locationId: clue.locationId,
        fakeText,
        performedBy: playerId,
        performedAt: Date.now(),
      };
      await update(gameRef, { sabotage: action });
    },

    completeMission: async (missionId: string) => {
      if (!code) return;
      await set(ref(db, `games/${code}/completedMissions/${missionId}`), true);
    },

    revealSecret: async () => {
      if (!gameRef || !game?.scenarioId) return;
      const sc = SCENARIO_MAP[game.scenarioId];
      if (!sc) return;
      await update(gameRef, {
        secretRevealed: sc.secretForVartija,
        secretRevealedAt: Date.now(),
      });
    },

    confessAsCulprit: async () => {
      if (!gameRef) return;
      await update(gameRef, { culpritConfessed: true, status: "ended" });
    },

    submitVote: async (accusedId: string) => {
      if (!code || !game) return;
      await set(ref(db, `games/${code}/votes/${playerId}`), accusedId);
      const newVotes = { ...(game.votes ?? {}), [playerId]: accusedId };
      const playerCount = Object.keys(game.players ?? {}).length;
      if (Object.keys(newVotes).length >= playerCount && gameRef) {
        await update(gameRef, { status: "ended" });
      }
    },

    startVoting: async () => {
      if (!gameRef) return;
      await update(gameRef, { status: "voting" });
    },

    resetGame: async () => {
      if (!gameRef || !game) return;
      await update(gameRef, {
        status: "lobby",
        countdownEnd: null,
        roles: {},
        votes: {},
        inventories: {},
        scenarioId: null,
        missionIds: {},
        completedMissions: {},
        sabotage: null,
        secretRevealed: null,
        secretRevealedAt: null,
        culpritConfessed: null,
        gameStartedAt: null,
        witnessEvents: null,
        redHerringClues: null,
        syyllinenVisits: null,
        players: Object.fromEntries(
          Object.entries(game.players ?? {}).map(([id, p]) => [
            id,
            { ...p, location: LOCATIONS[0].id, ready: false },
          ])
        ),
      });
    },

    leaveGame: () => {
      if (unsubRef.current) unsubRef.current();
      clearGameCode();
      setGame(null);
      setLoading(false);
      setError(null);
    },
  };

  return {
    game,
    loading,
    error,
    playerId,
    isHost,
    myRole,
    myInventory,
    countdownSecsLeft,
    scenario,
    activeMissions,
    actions,
  };
}
