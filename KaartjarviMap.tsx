import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  Flame, 
  FlameKindling, 
  Trees, 
  Lock, 
  Unlock, 
  Key, 
  Search, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Briefcase, 
  ArrowLeft, 
  Trophy, 
  Sparkles, 
  Info,
  HelpCircle,
  Hash,
  Compass
} from "lucide-react";

// Haetaan datatiedostot sieltä kaartjarvi-kansiosta
import { HUVILA_LOCATIONS, HuvilaLocation, HuvilaClue } from "./kaartjarvi/huvilaLocations";
import { HUVILA_PUZZLES, HuvilaPuzzle } from "./kaartjarvi/huvilaPuzzles";

// Tunnelmalliset Unsplash-lähikuvat löydetyille todisteille
const getClueImage = (clueId: string) => {
  switch (clueId) {
    case "takkatuli": return "https://unsplash.com";
    case "lasi": return "https://unsplash.com";
    case "laudeliina": return "https://unsplash.com";
    case "saunakiulu": return "https://unsplash.com";
    case "kirje": return "https://unsplash.com";
    case "jalanjaljet": return "https://unsplash.com";
    default: return "https://unsplash.com";
  }
};

const getItemIconBadge = (item: string) => {
  switch (item.toLowerCase()) {
    case "messinkiavain": return "🔑";
    case "sorkkarauta": return "⚒️";
    case "ranneketju": return "📿";
    case "perintosormus": return "💍";
    case "myrkkyrekisteri": return "🧪";
    default: return "📦";
  }
};

const getItemDisplayName = (item: string) => {
  switch (item.toLowerCase()) {
    case "messinkiavain": return "Messinkiavain";
    case "sorkkarauta": return "Raskas sorkkarauta";
    case "ranneketju": return "Marian hopeaketju";
    case "perintosormus": return "Mikaelin kultainen sinettisormus";
    case "myrkkyrekisteri": return "Kaliumsyanidi-pullo";
    default: return item;
  }
};

interface KaartjarviMapProps {
  onBackToLobby?: () => void;
  onExitGame?: () => void;
  playerName: string;
}

export default function KaartjarviMap({ onBackToLobby, onExitGame, playerName }: KaartjarviMapProps) {
  const handleExit = () => {
    if (onExitGame) onExitGame();
    else if (onBackToLobby) onBackToLobby();
  };

  const [locations, setLocations] = useState<HuvilaLocation[]>(HUVILA_LOCATIONS);
  const [puzzles, setPuzzles] = useState<HuvilaPuzzle[]>(HUVILA_PUZZLES);
  const [inventory, setInventory] = useState<string[]>([]);
  const [activeLocId, setActiveLocId] = useState<string>("paahuvila");
  
  const [clueOverlay, setClueOverlay] = useState<{
    id?: string;
    title: string;
    description: string;
    dialog: string;
    itemEarned?: string;
  } | null>(null);

  const [solvingPuzzleId, setSolvingPuzzleId] = useState<string | null>(null);
  const [codeInputValue, setCodeInputValue] = useState<string>("");
  const [puzzleError, setPuzzleError] = useState<string>("");

  const [isAccusationMode, setIsAccusationMode] = useState<boolean>(false);
  const [selectedAccused, setSelectedAccused] = useState<string>("");
  const [endingResult, setEndingResult] = useState<{
    success: boolean;
    title: string;
    explanation: string;
    detectiveRank: string;
    score: number;
  } | null>(null);

  const [atmosphericLogs, setAtmosphericLogs] = useState<string[]>([
    "Kaartjärven rannalla tuulee kovaa. Sade piissaa huvilan mustia ikkunoita.",
    "Olet yksin kokeneena etsivänä. Sinun täytyy ratkaista, kuka myrkytti Mikaelin."
  ]);

  const logAtmosphere = (msg: string) => {
    setAtmosphericLogs(prev => [msg, ...prev.slice(0, 5)]);
  };
