import type { Achievement, Game, EndingType } from "../types";
import { BASE_CLUES } from "./clues";

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "mestarietsiva",
    name: "Mestarietsivä",
    icon: "🔍",
    description: "Löysi eniten vihjeitä mökiltä ja auttoi merkittävästi totuuden paljastamisessa.",
    rarity: "legendary",
  },
  {
    id: "taydellinen_rikollinen",
    name: "Täydellinen Rikollinen",
    icon: "🩸",
    description: "Syyllinen selvisi loppuäänestyksestä saamatta yhtäkään ääntä itseään vastaan.",
    rarity: "legendary",
  },
  {
    id: "hiljainen_todistaja",
    name: "Hiljainen Todistaja",
    icon: "👁️",
    description: "Keräsit vähintään 5 vihjettä äänestämättä ketään (jätit tyhjän äänen).",
    rarity: "rare",
  },
  {
    id: "totuuden_vartija",
    name: "Totuuden Vartija",
    icon: "🗝️",
    description: "Kykeni pitämään omat ja mökin synkimmät salaisuudet visusti piilossa.",
    rarity: "rare",
  },
  {
    id: "jarven_vartija",
    name: "Järven Vartija",
    icon: "🌲",
    description: "Keräsit todisteita vähintään viidestä eri mökkialueesta livenä.",
    rarity: "common",
  },
  {
    id: "rohkea_tunnustaja",
    name: "Rohkea Tunnustaja",
    icon: "⚖️",
    description: "Tunnustit murhan livenä ennen kuin sinut tuomittiin äänestyksessä.",
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
  
  const votesAgainstMe = Object.values(votes).filter((v) => v === playerId).length;
  const myVote = votes[playerId];

  // 1. Mestarietsivä (Lasketaan kuka keräsi eniten vihjeitä tutkijoista)
  let maxCluesFound = 0;
  Object.entries(game.inventories ?? {}).forEach(([pid, inv]) => {
    if (game.roles?.[pid] !== "syyllinen") {
      const count = Object.keys(inv).length;
      if (count > maxCluesFound) maxCluesFound = count;
    }
  });

  const myCluesCount = myInventory.length;
  if (myRole !== "syyllinen" && myCluesCount === maxCluesFound && myCluesCount > 0) {
    unlocked.push(ACHIEVEMENT_MAP["mestarietsiva"]);
  }

  // 2. Täydellinen rikollinen
  if (
    myRole === "syyllinen" &&
    (endingType === "culprit_escapes" || endingType === "secret_unsolved") &&
    votesAgainstMe === 0
  ) {
    unlocked.push(ACHIEVEMENT_MAP["taydellinen_rikollinen"]);
  }

  // 3. Hiljainen todistaja
  if (myRole !== "syyllinen" && myCluesCount >= 5 && (!myVote || myVote === "none")) {
    unlocked.push(ACHIEVEMENT_MAP["hiljainen_todistaja"]);
  }

  // 4. Totuuden vartija
  if (myRole === "salaisuuden_vartija" && !game.secretRevealed && votesAgainstMe <= 1) {
    unlocked.push(ACHIEVEMENT_MAP["totuuden_vartija"]);
  }

  // 5. Järven vartija
  const uniqueLocations = new Set(
    myInventory.map((id) => BASE_CLUES.find(c => c.id === id)?.locationId).filter(Boolean)
  );
  if (uniqueLocations.size >= 5) {
    unlocked.push(ACHIEVEMENT_MAP["jarven_vartija"]);
  }

  // 6. Rohkea tunnustaja
  if (myRole === "syyllinen" && endingType === "culprit_confesses") {
    unlocked.push(ACHIEVEMENT_MAP["rohkea_tunnustaja"]);
  }

  return unlocked.filter(Boolean);
}
