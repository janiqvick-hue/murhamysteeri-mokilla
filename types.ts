export type GameStatus =
  | "lobby"
  | "countdown"
  | "roleReveal"
  | "playing"
  | "voting"
  | "ended";

export type Role =
  | "tutkija"
  | "todistaja"
  | "salaisuuden_vartija"
  | "syyllinen";

export type ClueCategory =
  | "fyysinen"
  | "todistus"
  | "asiakirja"
  | "epailyttava";

export type EndingType =
  | "perfect_investigation"
  | "investigators_win"
  | "culprit_escapes"
  | "culprit_confesses"
  | "secret_unsolved"
  | "perfect_criminal";

export interface Player {
  name: string;
  location: string;
  ready: boolean;
}

export interface SabotageAction {
  type: "remove" | "replace";
  clueId: string;
  locationId: string;
  fakeText: string;
  performedBy: string;
  performedAt: number;
}

export interface WitnessEvent {
  id: string;
  title: string;
  text: string;
  locationHint: string;
  revealDelayMs: number;
}

export interface RedHerringTemplate {
  id: string;
  locationId: string;
  name: string;
  normalTextTemplate: string;
}

export interface RedHerringClue {
  id: string;
  locationId: string;
  name: string;
  normalText: string;
  targetPlayerId: string;
  targetPlayerName: string;
}

export interface Game {
  hostId: string;
  status: GameStatus;
  countdownMinutes: number;
  countdownEnd: number | null;
  createdAt: number;
  scenarioId: string | null;
  players: Record<string, Player>;
  roles: Record<string, Role>;
  votes: Record<string, string>;
  inventories: Record<string, Record<string, true>>;
  missionIds: Record<string, true>;
  completedMissions: Record<string, true>;
  sabotage: SabotageAction | null;
  secretRevealed: string | null;
  secretRevealedAt: number | null;
  culpritConfessed: boolean | null;
  gameStartedAt: number | null;
  witnessEvents: Record<string, WitnessEvent> | null;
  redHerringClues: Record<string, RedHerringClue> | null;
  syyllinenVisits: Record<string, true> | null;
}

export interface Location {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

export interface Clue {
  id: string;
  locationId: string;
  name: string;
  category: ClueCategory;
  normalText: string;
  syyllinenText: string;
  salaisuusHint?: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  type:
    | "use_sabotage"
    | "collect_clue"
    | "collect_n"
    | "visit_location"
    | "visit_n_locations"
    | "survive_vote"
    | "manual";
  clueId?: string;
  locationId?: string;
  n?: number;
}

export interface Scenario {
  id: string;
  name: string;
  subtitle: string;
  victim: string;
  victimLocation: string;
  motive: string;
  method: string;
  hiddenSecret: string;
  setting: string;
  secretForVartija: string;
  clueOverrides: Partial<Record<string, { normalText?: string; syyllinenText?: string }>>;
  witnessEventTemplates: WitnessEvent[];
  redHerringTemplates: RedHerringTemplate[];
}

export interface Achievement {
  id: string;
  name: string;
  icon: string;
  description: string;
  rarity: "common" | "rare" | "legendary";
}

export interface RoleInfo {
  id: Role;
  name: string;
  icon: string;
  objective: string;
  color: string;
  gradient: string;
  detail: string;
}
