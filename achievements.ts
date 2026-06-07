import type { Achievement, Game, EndingType } from "../types";
import { CLUE_MAP } from "./clues";

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "mestarietsiva",
    name: "Mestarietsivä",
    icon: "🔍",
    description: "Kaikki tutkijat äänestivät oikein. Täydellinen tutkimus.",
    rarity: "legendary",
  },
  {
    id: "taydellinen_rikollinen",
    name: "Täydellinen Rikollinen",
    icon: "🩸",
    description: "Syyllinen selvisi eikä saanut yhtään ääntä itseään vastaan.",
    rarity: "legendary",
  },
  {
    id: "hiljainen_todistaja",
    name: "Hiljainen Todistaja",
    icon: "👁️",
    description: "Keräsit vähintään 5 vihjettä syyllistämättä ketään.",
    rarity: "rare",
  },
  {
    id: "totuuden_vartija",
    name: "Totuuden Vartija",
    icon: "🗝️",
    description: "Paljastit salaisuutesi oikealla hetkellä — ja tutkijat voittivat.",
    rarity: "rare",
  },
  {
    id: "jarven_vartija",
    name: "Järven Vartija",
    icon: "🏆",
    description: "Keräsit vihjeitä vähintään viidestä eri paikasta.",
    rarity: "common",
  },
  {
    id: "hiljainen_tunnustaja",
    name: "Rohkea Tunnustaja",
    icon: "⚖️",
    description: "Tunnustit ennen kuin sinut tuomittiin.",
    rarity: "common",
  },
];

export const ACHIEVEMENT_MAP: Record<string, Achievement> = Object.fromEntries(
  ACHIEVEMENTS.map((a) => [a.id, a])
);

export function computeEndingType(
  votes: Record<string, string>,
  syyllinenId: string | undefined,
  culpritConfessed: boolean | null,
  playerCount: number
): EndingType {
  if (culpritConfessed) return "culprit_confesses";

  const voteValues = Object.values(votes);
  if (voteValues.length === 0) return "secret_unsolved";

  const voteCounts: Record<string, number> = {};
  for (const v of voteValues) voteCounts[v] = (voteCounts[v] ?? 0) + 1;

  const syyllinenVotes = syyllinenId ? (voteCounts[syyllinenId] ?? 0) : 0;
  const majority = Math.floor(playerCount / 2) + 1;

  if (syyllinenVotes === voteValues.length && voteValues.length === playerCount) {
    return "perfect_investigation";
  }
  if (syyllinenVotes >= majority) return "investigators_win";

  const maxVotes = Math.max(0, ...Object.values(voteCounts));
  const leaders = Object.keys(voteCounts).filter((id) => voteCounts[id] === maxVotes);
  if (leaders.length > 1) return "secret_unsolved";

  return "culprit_escapes";
}

export function computePlayerAchievements(
  game: Game,
  playerId: string,
  endingType: EndingType,
  syyllinenId: string | undefined
): Achievement[] {
  const unlocked: Achievement[] = [];
  const myRole = game.roles?.[playerId];
  const myInventory = Object.keys(game.inventories?.[playerId] ?? {});
  const votes = game.votes ?? {};
  const syyllinenVotesAgainstMe = syyllinenId
    ? Object.values(votes).filter((v) => v === playerId).length
    : 0;

  const myVote = votes[playerId];
  const totalPlayers = Object.keys(game.players ?? {}).length;

  if (
    endingType === "perfect_investigation" &&
    myRole !== "syyllinen" &&
    myVote === syyllinenId
  ) {
    unlocked.push(ACHIEVEMENT_MAP["mestarietsiva"]);
  }

  if (
    myRole === "syyllinen" &&
    (endingType === "culprit_escapes" || endingType === "secret_unsolved") &&
    syyllinenVotesAgainstMe === 0
  ) {
    unlocked.push(ACHIEVEMENT_MAP["taydellinen_rikollinen"]);
  }

  if (myRole !== "syyllinen" && myInventory.length >= 5) {
    unlocked.push(ACHIEVEMENT_MAP["hiljainen_todistaja"]);
  }

  if (
    myRole === "salaisuuden_vartija" &&
    game.secretRevealed &&
    (endingType === "investigators_win" || endingType === "perfect_investigation")
  ) {
    unlocked.push(ACHIEVEMENT_MAP["totuuden_vartija"]);
  }

  const uniqueLocations = new Set(
    myInventory.map((id) => CLUE_MAP[id]?.locationId).filter(Boolean)
  );
  if (uniqueLocations.size >= 5) {
    unlocked.push(ACHIEVEMENT_MAP["jarven_vartija"]);
  }

  if (myRole === "syyllinen" && endingType === "culprit_confesses") {
    unlocked.push(ACHIEVEMENT_MAP["hiljainen_tunnustaja"]);
  }

  return unlocked.filter(Boolean);
}
