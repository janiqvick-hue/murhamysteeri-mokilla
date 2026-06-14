import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ROLE_INFO } from "./src/utils/roles";
import { SCENARIO_MAP } from "./src/utils/scenarios";
import { db } from "./firebase";
import { ref, update } from "firebase/database";
import { 
  Lock, Skull, ShieldAlert, Award, Eye, Info, CheckCircle, Unlock
} from "lucide-react";

interface RoleRevealScreenProps {
  playerId: string;
  gameCode: string;
  isSoloMode: boolean;
  lobbyData: any;
  onNextStage: () => void;
}

export default function RoleRevealScreen({
  playerId,
  gameCode,
  isSoloMode,
  lobbyData,
  onNextStage
}: RoleRevealScreenProps) {
  const [countdown, setCountdown] = useState(6);
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(false);

  const myPlayer = lobbyData.players[playerId];
  const myRoleKey = myPlayer?.role || "vieras";
  
  const role = ROLE_INFO[myRoleKey as keyof typeof ROLE_INFO] || ROLE_INFO.vieras;
  const scenario = lobbyData.scenarioId ? SCENARIO_MAP[lobbyData.scenarioId as keyof typeof SCENARIO_MAP] : null;

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setRevealed(true);
    }
  }, [countdown]);

  const handleContinue = async () => {
    setLoading(true);
    if (isSoloMode) {
      onNextStage();
    } else {
      if (myPlayer?.isHost) {
        try {
          await update(ref(db, `rooms/${gameCode}`), {
            status: "investigation",
            stageStartTime: Date.now()
          });
        } catch (err) {
          console.error("Epäonnistui siirtyminen tutkimusvaiheeseen", err);
        }
      }
    }
    setLoading(false);
  };

  const getScenarioHint = () => {
    if (!scenario) return "Myrsky on katkaissut sähköt and tietoliikenneyhteydet.";
    
    switch (role.id) {
      case "syyllinen":
        return scenario.syyllinenText || `Tiedät, että uhri on ${scenario.victim}. Tekosi motiivi on: "${scenario.motive}". Voit väärentää vihjeitä huoneissa käyttämällä sabotaasipaneelia.`;
      case "salaisuuden_vartija":
        return scenario.secretForVartija || `Mökin vanha salaisuus painaa harteillasi. Huolehdi, ettei kukaan löydä vihjeitä, jotka voivat paljastaa mökin salat.`;
      case "tutkija":
        return `Etsivävaistosi ansiosta saat tutkimuksen edetessä runsaasti tietoa. Tarkkaile ristiriitoja. Uhri on ${scenario.victim} ja johtolangat odottavat tutkimusalueilla.`;
      case "todistaja":
        return `Näännyttävä myrsky herätti sinut yöllä, ja näit sateessa vilauksen jostakin liikehdinnästä. Muistat sen selvästi, ja jokin todiste saattaa liittyä tekoon.`;
      default:
        return scenario.normalText || `Olet viaton mökkivieras. Auta tutkijaa hahmottamaan tapahtumien kulku ja paljasta syyllinen ennen kuin on liian myöhäistä.`;
    }
  };

  const isHost = myPlayer?.isHost;
  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] w-full max-w-md mx-auto px-4 py-6 text-slate-100" style={{ fontFamily: 'sans-serif' }}>
      <AnimatePresence mode="wait">
        {!revealed ? (
          <motion.div
            key="countdown"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="w-full bg-slate-950 border border-slate-900 rounded-2xl p-8 shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-red-950/15 pointer-events-none" />

            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-full border-4 border-red-900/30 border-t-red-500 flex items-center justify-center" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Lock className="w-8 h-8 text-red-500" />
              </div>
            </div>

            <h2 className="text-xl font-bold text-slate-200 uppercase tracking-widest mb-2">
              Jännitys tiivistyy...
            </h2>
            <p className="text-xs text-slate-400 max-w-xs mb-8">
              Rooli arvotaan ja ladataan turvallisesti. Älä paljasta ruutuasi muille ja pitkitä bluffiasi salassa.
            </p>

            <span className="text-5xl font-extrabold text-red-500 mb-2 font-mono">
              {countdown}
            </span>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
              Sekuntia roolin paljastumiseen
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Visual Header */}
            <div style={{ background: role.gradient, padding: '24px', color: '#e2e8f6' }} className="relative">
              <div className="absolute top-4 right-4 p-1.5 bg-black/40 border border-white/15 rounded-lg">
                {role.id === "syyllinen" ? (
                  <Skull className="w-5 h-5 text-red-400" />
                ) : role.id === "tutkija" ? (
                  <Award className="w-5 h-5 text-cyan-400" />
                ) : role.id === "salaisuuden_vartija" ? (
                  <ShieldAlert className="w-5 h-5 text-purple-400" />
                ) : (
                  <Eye className="w-5 h-5 text-emerald-400" />
                )}
              </div>

              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
                Oma salainen roolisi
              </span>
              <h2 className="text-3xl font-black tracking-tight mt-1 mb-2">
                {role.name}
              </h2>
              <p className="text-xs text-slate-200/90 leading-relaxed font-medium">
                {role.detail}
              </p>
            </div>

            {/* Roolikortin tehtävät ja salat */}
            <div className="p-6 space-y-5 bg-slate-950">
              <div className="flex gap-3">
                <div className="p-2 h-fit bg-slate-900 rounded-xl border border-slate-800">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Voittotavoitteesi (Objective)
                  </h4>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {role.objective}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="p-2 h-fit bg-slate-900 rounded-xl border border-slate-800">
                  <Unlock className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Erikoiskykysi livenä
                  </h4>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {role.detail}
                  </p>
                </div>
              </div>

              {/* Dynaaminen skenaario-ohjeistus */}
              <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl relative overflow-hidden">
                <div className="flex gap-2.5 items-start">
                  <Info className="w-4.5 h-4.5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-[11px] font-bold text-red-400 uppercase tracking-wider mb-0.5">
                      Roolitiedot & Havainnot (Detail):
                    </h5>
                    <p className="text-xs text-slate-300 leading-normal italic">
                      "{getScenarioHint()}"
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                {isHost || isSoloMode ? (
                  <button
                    disabled={loading}
                    onClick={handleContinue}
                    className="w-full py-2.5 bg-red-800 hover:bg-red-700 disabled:bg-slate-800 text-slate-100 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer border-none"
                  >
                    {loading ? "Ladataan..." : "Jatka tutkimukseen"}
                  </button>
                ) : (
                  <div className="text-center py-2.5 bg-slate-900 border border-slate-800 rounded-xl">
                    <p className="text-[11px] text-slate-400 animate-pulse">
                      Odotetaan, että isäntä siirtää pelin tutkimusvaiheeseen...
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
