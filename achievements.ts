import type { Achievement, Game, EndingType } from "../types";
import { BASE_CLUES } from "./clues";

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "mestarietsiva",
    name: "Mestarietsivä",
    icon: "🔍",
    description: "Kaikki tutkijat äänestivät oikein. Täydellinen tutkimus mökillä.",
    rarity: "legendary",
  },
  {
    id: "taydellinen_rikollinen",
    name: "Täydellinen Rikollinen",
    icon: "🩸",
    description: "Syyllinen selvisi loppuäänestyksestä ilman yhtäkään ääntä itseään vastaan.",
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
    description: "Paljastit mökin salaisuuden oikealla hetkellä — ja tutkijat voittivat.",
    rarity: "rare",
  },
  {
    id: "jarven_vartija",
    name: "Järven Vartija",
    icon: "🌲",
    description: "Keräsit todisteita vähintään viidestä eri mökkialueesta.",
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
  
  // Lasketaan kuinka moni äänesti pelaajaa (jos pelaaja on syyllinen, nämä ovat häntä vastaan annetut äänet)
  const votesAgainstMe = Object.values(votes).filter((v) => v === playerId).length;
  const myVote = votes[playerId];

  // 1. Mestarietsivä: Kaikki äänestivät oikein ja pelaaja oli mukana äänestämässä syyllistä
  if (
    endingType === "perfect_investigation" &&
    myRole !== "syyllinen" &&
    myVote === syyllinenId
  ) {
    unlocked.push(ACHIEVEMENT_MAP["mestarietsiva"]);
  }

  // 2. Täydellinen rikollinen: Syyllinen pääsee karkuun ilman yhtäkään epäilystä
  if (
    myRole === "syyllinen" &&
    (endingType === "culprit_escapes" || endingType === "secret_unsolved") &&
    votesAgainstMe === 0
  ) {
    unlocked.push(ACHIEVEMENT_MAP["taydellinen_rikollinen"]);
  }

  // 3. Hiljainen todistaja: Keräsi vähintään 5 vihjettä, mutta jätti äänestämättä ketään (tyhjä ääni tai 'none')
  if (myRole !== "syyllinen" && myInventory.length >= 5 && (!myVote || myVote === "none")) {
    unlocked.push(ACHIEVEMENT_MAP["hiljainen_todistaja"]);
  }

  // 4. Totuuden Vartija: Salaisuuden vartija paljasti tiedon ja tutkijat voittivat
  if (
    myRole === "salaisuuden_vartija" &&
    game.secretRevealed &&
    (endingType === "investigators_win" || endingType === "perfect_investigation")
  ) {
    unlocked.push(ACHIEVEMENT_MAP["totuuden_vartija"]);
  }

  // 5. Järven Vartija: Keräsi vihjeitä vähintään 5 eri mökkialueesta livenä
  const uniqueLocations = new Set(
    myInventory.map((id) => BASE_CLUES.find(c => c.id === id)?.locationId).filter(Boolean)
  );
  if (uniqueLocations.size >= 5) {
    unlocked.push(ACHIEVEMENT_MAP["jarven_vartija"]);
  }

  // 6. Rohkea Tunnustaja: Syyllinen tunnustaa teon ennen äänestystä
  if (myRole === "syyllinen" && endingType === "culprit_confesses") {
    unlocked.push(ACHIEVEMENT_MAP["rohkea_tunnustaja"]);
  }

  return unlocked.filter(Boolean);
}
