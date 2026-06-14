import React from "react";
import { motion, AnimatePresence } from "framer-motion"; // KORJATTU: Standardi framer-motion
import { Eye, Bell, ShieldAlert, Sparkles } from "lucide-react";

interface WitnessNotification {
  id: string;
  text: string;
  type: "movement" | "sabotage" | "discovery" | "system";
  timestamp: number;
}

interface WitnessBannerProps {
  notifications: WitnessNotification[];
}

export default function WitnessBanner({ notifications }: WitnessBannerProps) {
  // Järjestetään uusin ensin ja näytetään enintään 2 tuoreinta lokimerkintää
  const activeNotifications = [...notifications]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 2);

  if (activeNotifications.length === 0) return null;

  return (
    <div className="w-full space-y-2 pointer-events-none mb-4">
      <AnimatePresence>
        {activeNotifications.map((notif) => {
          let icon = <Bell className="w-4 h-4 text-amber-400" />;
          let bgColor = "bg-slate-900/95 border-amber-500/20 text-slate-200";

          if (notif.type === "sabotage") {
            icon = <ShieldAlert className="w-4 h-4 text-red-400 animate-pulse" />;
            bgColor = "bg-red-950/90 border-red-500/30 text-red-200";
          } else if (notif.type === "discovery") {
            icon = <Sparkles className="w-4 h-4 text-cyan-400 animate-bounce" />;
            bgColor = "bg-slate-900/95 border-cyan-500/20 text-slate-100";
          } else if (notif.type === "movement") {
            icon = <Eye className="w-4 h-4 text-emerald-400" />;
            bgColor = "bg-slate-900/90 border-slate-800 text-slate-300";
          }

          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: -15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              className={`flex items-center gap-3 p-3 rounded-xl border shadow-lg backdrop-blur-md w-full ${bgColor}`}
            >
              <div className="shrink-0 p-1.5 bg-black/40 rounded-lg">
                {icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold leading-normal truncate">
                  {notif.text}
                </p>
                <span className="text-[9px] text-slate-500 font-mono">
                  {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
