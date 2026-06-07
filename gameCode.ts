const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const PLAYER_ID_KEY = "murha_player_id";
const GAME_CODE_KEY = "murha_game_code";

export function generateGameCode(): string {
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return code;
}

export function getOrCreatePlayerId(): string {
  let id = localStorage.getItem(PLAYER_ID_KEY);
  if (!id) {
    id = `p_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
    localStorage.setItem(PLAYER_ID_KEY, id);
  }
  return id;
}

export function saveGameCode(code: string): void {
  localStorage.setItem(GAME_CODE_KEY, code);
}

export function loadGameCode(): string | null {
  return localStorage.getItem(GAME_CODE_KEY);
}

export function clearGameCode(): void {
  localStorage.removeItem(GAME_CODE_KEY);
}
