import type { Role, RoleInfo } from "../types";

export const ROLE_INFO: Record<Role, RoleInfo> = {
  syyllinen: {
    id: "syyllinen",
    name: "Syyllinen",
    icon: "🩸",
    objective: "Sekoita muiden tutkintaa, siirrä epäilykset muualle ja selviä loppuäänestyksestä houkuttelemalla muut äänestämään jotakuta viatonta.",
    detail: "Sabotaasikyky: Voit valehdella ja väärentää vihjeitä sijoittamalla valelöydöksiä valitsemiisi huoneisiin ilman, että peli paljastaa sinua. Sinun käsissäsi on verinen totuus.",
    color: "#f87171",
    gradient: "linear-gradient(135deg, #5f1e1e 0%, #3a0f0f 100%)"
  },
  salaisuuden_vartija: {
    id: "salaisuuden_vartija",
    name: "Salaisuuden Vartija",
    icon: "🗝️",
    objective: "Suojelemökin vanhaa salaisuutta ja estä kaikkien salaisuuksien paljastuminen. Sinä et ole murhaaja, mutta sinulla on omat syysi pitää totuus piilossa.",
    detail: "Piilotettu Vihje: Tiedät yhden ratkaisevan salaisuuden tarkan sijainnin, jota muut eivät ole vielä huomanneet. Mökin seiniin kätkeytyy salaisuus, joka ei liity suoraan tähän murhaan, mutta sen julkitulo tuhoaisi elämäsi.",
    color: "#fbbf24",
    gradient: "linear-gradient(135deg, #4a3200 0%, #2d1e00 100%)"
  },
  tutkija: {
    id: "tutkija",
    name: "Tutkija",
    icon: "🔍",
    objective: "Kerää mökiltä vihjeitä, vertaa eri henkilöiden muistikuvia ja johdata keskustelua löytääksesi ja paljastaaksesi aidon Syyllisen loppuäänestyksessä.",
    detail: "Etsivävaisto: Saat tutkinnan alussa yhden ylimääräisen johtolangan/vihjeen suoraan puhelimeesi. Olet tarkka ja looginen. Otat tilanteen hallitusti haltuun silloin, kun muut hätääntyvät.",
    color: "#60a5fa",
    gradient: "linear-gradient(135deg, #1e3a5f 0%, #0f2340 100%)"
  },
  todistaja: {
    id: "todistaja",
    name: "Todistaja",
    icon: "👁️",
    objective: "Auta Tutkijaa löytämään aito Syyllinen jakamalla muistikuviasi ja paljastamalla mahdolliset ristiriidat.",
    detail: "Silminnäkijähavainto: Näet yhden murhayön avaintapahtuman osittain oikein ja osaat kertoa, missä muut valehtelevat. Näännyttävä myrsky herätti sinut yöllä, ja näit sateessa vilauksen jostakin.",
    color: "#a78bfa",
    gradient: "linear-gradient(135deg, #2d1b5e 0%, #1a0f3a 100%)"
  },
  vieras: {
    id: "vieras",
    name: "Mökkivieras",
    icon: "👤",
    objective: "Selviä hengissä myrskyisestä yöstä ja yritä erottaa totuus valheista salapoliisien lomaan soluttautuen. Äänestä syyllistä muiden mukana.",
    detail: "Tarkkailija: Ei erityisiä erikoiskykyjä, mutta voit vapaasti liikkua mökillä ja pitää korvasi auki ristiriitaisuuksille. Tulit mökille vain viettämään viikonloppua ja rentoutumaan.",
    color: "#94a3b8",
    gradient: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"
  }
};

export function assignRoles(playerIds: string[]): Record<string, Role> {
  const shuffledIds = [...playerIds].sort(() => Math.random() - 0.5);
  const rolesAssignment: Record<string, Role> = {};

  const requiredRoles: Role[] = ["syyllinen", "tutkija", "salaisuuden_vartija", "todistaja"];

  shuffledIds.forEach((id, index) => {
    if (index < requiredRoles.length) {
      rolesAssignment[id] = requiredRoles[index];
    } else {
      rolesAssignment[id] = "vieras";
    }
  });

  return rolesAssignment;
}
