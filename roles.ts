import type { Role, RoleInfo } from "../types";

export const ROLE_INFO: Record<Role, RoleInfo> = {
  tutkija: {
    id: "tutkija",
    name: "Tutkija",
    icon: "🔍",
    objective: "Kerää vihjeitä ja tunnista Syyllinen ennen äänestystä.",
    detail:
      "Sinulla on yksi mahdollisuus. Kysy oikeita kysymyksiä, arvioi todisteet kriittisesti — ja luota vaistoihisi.",
    color: "#60a5fa",
    gradient: "linear-gradient(135deg, #1e3a5f 0%, #0f2340 100%)",
  },
  todistaja: {
    id: "todistaja",
    name: "Todistaja",
    icon: "👁️",
    objective: "Tiedät jotain. Auta Tutkijaa — mutta pidä osa itsellään.",
    detail:
      "Sinulla on oma syysi pysyä hiljaa. Paljasta juuri sen verran, että ohjaat muita — mutta ei niin paljon, että vaarannat itsesi.",
    color: "#a78bfa",
    gradient: "linear-gradient(135deg, #2d1b5e 0%, #1a0f3a 100%)",
  },
  salaisuuden_vartija: {
    id: "salaisuuden_vartija",
    name: "Salaisuuden Vartija",
    icon: "🗝️",
    objective: "Tiedät totuuden. Päätä milloin — ja jos — paljastat sen.",
    detail:
      "Sinulla on tieto joka voi ratkaista kaiken. Käytä 'Paljasta salaisuutesi' -painiketta oikealla hetkellä. Paljastaminen voi kääntää pelin — tai vaaranltu oman asemasi.",
    color: "#fbbf24",
    gradient: "linear-gradient(135deg, #4a3200 0%, #2d1e00 100%)",
  },
  syyllinen: {
    id: "syyllinen",
    name: "Syyllinen",
    icon: "🩸",
    objective: "Vältä tunnistusta. Johda harhaan. Selviydy.",
    detail:
      "Sinulla on salaisia tehtäviä ja yksi sabotaasimahdollisuus. Käytä ne viisaasti. Jos äänestys osuu muualle — voitat.",
    color: "#f87171",
    gradient: "linear-gradient(135deg, #5f1e1e 0%, #3a0f0f 100%)",
  },
};

export function assignRoles(playerIds: string[]): Record<string, Role> {
  const shuffled = [...playerIds].sort(() => Math.random() - 0.5);
  const roles: Record<string, Role> = {};
  const n = shuffled.length;

  shuffled.forEach((id, i) => {
    if (i === 0) {
      roles[id] = "syyllinen";
    } else if (i === 1 && n >= 3) {
      roles[id] = "salaisuuden_vartija";
    } else if (i % 2 === 0) {
      roles[id] = "tutkija";
    } else {
      roles[id] = "todistaja";
    }
  });

  return roles;
}
