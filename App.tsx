import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Key, 
  Lock, 
  Compass, 
  Terminal, 
  ExternalLink, 
  Award, 
  Activity, 
  ShieldAlert, 
  HelpCircle, 
  ArrowRight,
  Tv,
  Gamepad2,
  FolderLock
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'launcher' | 'preview'>('launcher');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [simulatedAir, setSimulatedAir] = useState(100);

  // Simuloitu dynaaminen järjestelmänvalvoja-terminaali luomaan aitoa tunnelmaa
  useEffect(() => {
    const logs = [
      "SYSTEM INIT: Mikaelin Salakellari [Next-Gen VR v1.6.0]...",
      "LOADING: A-Frame Engine & WebVR rendering subroutines...",
      "STATUS: Ready to bound on port 3000.",
      "O2 RECOVERY: Running on backup underground vents...",
      "SECURITY PROTOCOL: Active (C-1954-N)",
      "PNEUMATIC SEAL: Pressurized at 8.4 BAR (LOCK_ENGAGED)",
      "TITANIUM SAFE CORES: Aligned.",
      "WEBXR DEVICE DISCOVERY: Waiting for VR Headset / HMD input..."
    ];

    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < logs.length) {
        setTerminalLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${logs[currentIdx]}`]);
        currentIdx++;
      } else {
        clearInterval(interval);
      }
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  // Simuloitu ilmamäärä-hupenema tehostamaan peliä stimuloivasti
  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedAir(prev => {
        if (prev <= 12) return 100; // Nollaa takaisin harrasteeksi
        return prev - 1;
      });
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-slate-900">
      
      {/* KORKEATERÄINEN SIVUSTON YLÄPALKKI */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur sticky top-0 z-50 px-6 py-4 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Compass className="w-5 h-5 text-slate-100 animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
              Mikaelin Salakellari
            </h1>
            <p className="text-xs text-slate-400 font-mono">Next-Gen VR Escape Room v1.6.0</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            id="btn-tab-launch"
            onClick={() => setActiveTab('launcher')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
              activeTab === 'launcher' 
                ? 'bg-slate-900 text-sky-400 border border-sky-500/30 shadow-[0_0_15px_rgba(14,165,233,0.1)]' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            Ohjauspaneeli
          </button>
          
          <button 
            id="btn-tab-preview"
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
              activeTab === 'preview' 
                ? 'bg-slate-900 text-sky-400 border border-sky-500/30 shadow-[0_0_15px_rgba(14,165,233,0.1)]' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <Tv className="w-4 h-4" />
            Välitön Demo-Esikatselu
          </button>

          <a 
            href="/vr.html"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-sky-500 hover:bg-sky-400 text-slate-950 flex items-center gap-2 shadow-lg shadow-sky-500/10 hover:shadow-sky-500/20 transition-all duration-200 whitespace-nowrap"
          >
            Avaa Koko Ruudussa
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </header>

      {/* PÄÄASIAN SISÄLTÖALUE */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LAUNCHER & CONFIGURATION PANEL */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          <AnimatePresence mode="wait">
            {activeTab === 'launcher' ? (
              <motion.div
                key="launcher"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-8"
              >
                {/* HERO ESITTELYKORTTI */}
                <div id="hero-card" className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-900 p-8 flex flex-col justify-between min-h-[340px] shadow-2xl">
                  {/* Koristeellinen taustakuvitus tai hehku */}
                  <div className="absolute right-0 bottom-0 w-80 h-80 bg-sky-500/5 rounded-full filter blur-[80px]" />
                  <div className="absolute left-1/3 top-10 w-60 h-60 bg-indigo-600/5 rounded-full filter blur-[60px]" />

                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-500/10 text-sky-400 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border border-sky-500/10">
                      <Activity className="w-3.5 h-3.5 animate-pulse" />
                      3D WebXR -Yhteensopiva
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 text-slate-100 font-sans">
                      Mikaelin Salakellari: <span className="bg-gradient-to-r from-sky-450 to-indigo-400 bg-clip-text text-transparent">Next-Gen VR</span>
                    </h2>
                    
                    <p className="text-slate-400 text-base max-w-2xl leading-relaxed mb-6">
                      Astu virtuaalitodellisuuden mestariteokseen suoraan selaimessasi. Seikkaile hämärän arkiston, salaperäisen kemiallisen laboratorion ja suojatun titaanisalibunkkerin läpi. Etsi ratkaisut, vältä ansoja ja kerää kaikki lahjusaineistot Mikaelin valvovan silmän alla!
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4 items-center mt-4">
                    <a 
                      href="/vr.html"
                      className="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-lg font-bold bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-slate-950 transition-all duration-300 shadow-xl shadow-sky-500/20 active:scale-95"
                    >
                      <Play className="w-6 h-6 fill-current" />
                      Aloita Laatumatka (Full VR)
                    </a>

                    <button 
                      onClick={() => setActiveTab('preview')}
                      className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-md font-semibold bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 transition-all"
                    >
                      Pika-esikatselu tässä
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* BENTO-GRID PELIN ALUEET */}
                <div>
                  <h3 className="text-lg font-bold text-slate-300 mb-4 font-sans tracking-wide">
                    Pakoseikkailun Kolme Haastavaa Sektoria
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Alue 1 */}
                    <div id="sector-1" className="bg-slate-900/50 border border-slate-900 rounded-xl p-5 hover:border-slate-800 transition-all duration-200">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
                        <Key className="w-5 h-5 text-amber-500" />
                      </div>
                      <h4 className="font-bold text-slate-200 mb-1">1. Salainen Arkisto</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Löydä salainen keltainen avain, tiirikoi Mikaelin antiikkinen rauta-arkku ja selvitä elektronisen lukon ovikoodi.
                      </p>
                      <div className="mt-4 text-[11px] font-mono text-amber-500 bg-amber-550/10 px-2 py-1 rounded inline-block">
                        Kohde: Keltainen Avain
                      </div>
                    </div>

                    {/* Alue 2 */}
                    <div id="sector-2" className="bg-slate-900/50 border border-slate-900 rounded-xl p-5 hover:border-slate-800 transition-all duration-200">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4">
                        <Activity className="w-5 h-5 text-purple-400" />
                      </div>
                      <h4 className="font-bold text-slate-200 mb-1">2. Kemian Laboratorio</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Aktivoi reagenssi Catalyst-X dynaamisessa purppurapullossa, laukaise pneumaattinen sulkusuhina ja poista paineet ovesta.
                      </p>
                      <div className="mt-4 text-[11px] font-mono text-purple-450 bg-purple-550/10 px-2 py-1 rounded inline-block">
                        Kohde: Purppura Reagenssi
                      </div>
                    </div>

                    {/* Alue 3 */}
                    <div id="sector-3" className="bg-slate-900/50 border border-slate-900 rounded-xl p-5 hover:border-slate-800 transition-all duration-200">
                      <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4">
                        <FolderLock className="w-5 h-5 text-cyan-400" />
                      </div>
                      <h4 className="font-bold text-slate-200 mb-1">3. Suojattu Turvaholvi</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Pyöritä titaanisen ohjauspilarin hammasratasta, avaa massiiviset kassakaapin ovet ja kerää salaimet lahjustodisteet.
                      </p>
                      <div className="mt-4 text-[11px] font-mono text-cyan-400 bg-cyan-550/10 px-2 py-1 rounded inline-block">
                        Kohde: Lahjusraportti
                      </div>
                    </div>
                  </div>
                </div>

                {/* HISTORIA JA TARINA */}
                <div className="bg-slate-900/20 border border-slate-900/60 rounded-xl p-6">
                  <h4 className="font-bold text-slate-300 text-sm mb-2 uppercase tracking-wider">Tehtävän Tausta (Mission Briefing)</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Mikael on rakentanut salaisen valtakunnan syvälle peruskallioon suojatakseen hämäriä tonttikauppasopimuksiaan ja lahjuskeräyksiään. Sinä olet soluttautuja, jonka tehtävänä on kerätä raskauttavat todisteaineet suoraan hänen titaanikaapistaan. Hän ei saa tietää tästä! Käytä VR-silmälaseja tai tietokoneen näppäilyohjausta ja pakoile ansoja.
                  </p>
                </div>

              </motion.div>
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-4"
              >
                {/* LIVE ESIKATSELU IFRAMELLA */}
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-2 flex flex-col overflow-hidden shadow-2xl">
                  <div className="flex justify-between items-center px-4 py-2 bg-slate-950 rounded-lg mb-2 border border-slate-900">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      <span className="text-xs font-mono font-bold text-emerald-400">3D ENGINE RUNNING OK</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">Iframe-esikatselu (Harkitse koko ruudun tilaa täydelle VR-ohjainkokemukselle)</span>
                    </div>
                  </div>

                  {/* A-Frame iframe ilman embedded sanaa, peli pyörii laajassa tilassa */}
                  <div className="aspect-video relative bg-slate-950 rounded-xl overflow-hidden border border-slate-950">
                    <iframe 
                      id="game-iframe"
                      src="/vr.html" 
                      className="w-full h-full border-none absolute inset-0"
                      allow="accelerometer; magnetometer; gyroscope; camera; microphone; xr-spatial-tracking; vr"
                    />
                  </div>

                  <div className="flex justify-between items-center p-3 mt-1 text-xs text-slate-400">
                    <span>💡 <b>Tietokoneella:</b> Klikkaa kuvaa, ota hiiriohjaus (Pointer Lock) ja liiku WASD-painikoilla. Esc palauttaa hiiren.</span>
                    <a 
                      href="/vr.html" 
                      target="_blank" 
                      className="text-sky-400 hover:underline flex items-center gap-1.5 font-semibold"
                    >
                      Avaa uudessa välilehdessä <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* SIDEBAR STATUS & STATISTICS */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* O2 HAPPI STATUSBAR */}
          <div className="bg-slate-900/60 border border-slate-900 rounded-xl p-5 shadow-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-sky-405" />
                Underground O2 Level
              </span>
              <span className={`text-xs font-mono font-bold ${simulatedAir < 35 ? 'text-rose-500 animate-pulse' : 'text-sky-400'}`}>
                {simulatedAir}%
              </span>
            </div>
            
            <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-900">
              <div 
                className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 transition-all duration-1000" 
                style={{ width: `${simulatedAir}%` }} 
              />
            </div>
            
            <p className="text-[11px] text-slate-500 mt-2">
              Syvissä kellareissa ilma on raskasta. Ratkaise peli ennen kuin happisylinteri ehtyy! (Simuloitukenttä)
            </p>
          </div>

          {/* DYNAMIC SYSTEM LOGGER TERMINAL */}
          <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-5 flex flex-col gap-3 shadow-lg">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Terminal className="w-4 h-4 text-sky-400" />
              Live Server Logit
            </h3>
            
            <div className="bg-slate-950 rounded-lg p-4 font-mono text-[10px] text-sky-400/80 h-48 overflow-y-auto flex flex-col gap-2 border border-slate-900/50">
              {terminalLogs.length === 0 && (
                <span className="text-slate-600">Alustetaan signaalia...</span>
              )}
              {terminalLogs.map((log, index) => (
                <div key={index} className="leading-relaxed border-b border-slate-900/30 pb-1 last:border-0">
                  <span className="text-slate-500">{log.substring(0, 10)}</span>
                  <span className="text-sky-200">{log.substring(10)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* LUKITUVIHJEET JA OHJAIMET */}
          <div className="bg-slate-900/50 border border-slate-900 rounded-xl p-5 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-500" />
              Pikapelaajan Käsikirja
            </h3>

            <div className="text-xs text-slate-400 flex flex-col gap-3">
              <div className="flex border-b border-slate-800/60 pb-2">
                <span className="font-bold text-slate-300 w-24">Vihje 1:</span>
                <span>Kerää maasta keltainen avain ja klikkaa pöydällä olevaa arkun kantta käyttääksesi sen.</span>
              </div>
              
              <div className="flex border-b border-slate-800/60 pb-2">
                <span className="font-bold text-slate-300 w-24">Vihje 2:</span>
                <span>Ovikoodi 1954 löytyy arkun sisältä. Paina numpad-näppäimiä ja paina OK vahvistaaksesi.</span>
              </div>

              <div className="flex border-b border-slate-800/60 pb-2">
                <span className="font-bold text-slate-300 w-24">Vihje 3:</span>
                <span>Klikkaa Catalyst-X purppurapulloa jotta kakkoshuoneen ovi sihahtaa ylös.</span>
              </div>

              <div className="flex pb-1">
                <span className="font-bold text-slate-300 w-24">Vihje 4:</span>
                <span>Kassakaappi aukeaa klikkaamalla pilarin metallista ohjauspyörää.</span>
              </div>
            </div>
          </div>

          {/* CREDITS BLOCK */}
          <div className="text-center p-2">
            <span className="text-[10px] text-slate-650 font-mono tracking-wider">
              MAALAIN SALAKELLARI © 2026 • WORKSPACE-VR ENGINES
            </span>
          </div>

        </div>

      </main>
    </div>
  );
}
