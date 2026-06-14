import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ROLE_INFO } from "./utils/roles";
import { SCENARIO_MAP } from "./utils/scenarios";
import { db } from "./firebase";
import { ref, update } from "firebase/database";
import { Lock, Skull, Award, ShieldAlert, Eye, Info } from "lucide-react";

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

  const myPlayer = lobbyData.players[playerId];
  const myRoleKey = myPlayer?.role || "vieras";
  const role = ROLE_INFO[myRoleKey as keyof typeof ROLE_INFO] || ROLE_INFO.vieras;
  const scenario = lobbyData.scenarioId ? SCENARIO_MAP[lobbyData.scenarioId as keyof typeof SCENARIO_MAP] : null;

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else { setRevealed(true); }
  }, [countdown]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] w-full max-w-md mx-auto px-4 text-slate-100" style={{ fontFamily: 'sans-serif' }}>
      <AnimatePresence mode="wait">
        {!revealed ? (
          <motion.div key="count" className="w-full bg-slate-950 border border-slate-900 rounded-2xl p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full border-2 border-red-500 flex items-center justify-center mx-auto"><Lock className="w-6 h-6 text-red-500" /></div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Arvotaan rooleja...</h2>
            <span className="text-5xl font-mono font-black text-red-500 block">{countdown}</span>
          </motion.div>
        ) : (
          <motion.div key="reveal" className="w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div style={{ background: role.gradient }} className="p-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Salainen roolisi</span>
              <h2 className="text-2xl font-black mt-1">{role.name}</h2>
              <p className="text-xs text-slate-100/90 mt-1 leading-relaxed">{role.detail}</p>
            </div>
            <div className="p-6 bg-slate-950 space-y-4 text-xs">
              <p><span className="font-bold text-slate-400 uppercase block mb-0.5">Tavoite:</span> {role.objective}</p>
              {scenario && (
                <div className="p-3 bg-slate-900 border border-slate-850 rounded-xl italic text-slate-300">
                  "{myRoleKey === "syyllinen" ? scenario.syyllinenText : scenario.normalText}"
                </div>
              )}
              <button type="button" onClick={async () => {
                if (isSoloMode) { onNextStage(); } else if (myPlayer?.isHost) {
                  await update(ref(db, `rooms/${gameCode}`), { status: "investigation", stageStartTime: Date.now() });
                }
              }} className="w-full py-2.5 bg-red-800 hover:bg-red-700 font-bold rounded-xl text-slate-100 border-none cursor-pointer">Aloita tutkimus 🔎</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
