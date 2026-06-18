import React, { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

interface KaartjarviVRProps {
  onExitGame: () => void;
  playerName?: string;
}

export default function KaartjarviVR({ onExitGame, playerName = "Serlokki" }: KaartjarviVRProps) {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "exitGame") {
        onExitGame();
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [onExitGame]);

  return (
    <div className="relative w-full h-[85vh] bg-[#020205] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
      {/* Fallback header just in case they can't click internal exit button */}
      <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex justify-between items-center z-10">
        <button
          onClick={onExitGame}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white rounded-lg text-xs font-semibold border border-slate-800/80 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Palaa päävalikkoon
        </button>
        <div className="text-xs font-bold text-slate-400 font-mono">Pelaaja: {playerName}</div>
      </div>

      <iframe
        src="/vr.html"
        title="Mikaelin Salakellari"
        className="w-full flex-grow border-none"
        allow="autoplay; fullscreen; microphone; camera; geolocation"
      />
    </div>
  );
}
