import { useState, useEffect, useRef } from "react";

interface Props {
  onCreateGame: (name: string) => Promise<string>;
  onJoinGame: (code: string, name: string) => Promise<void>;
}

const const COTTAGE_IMG = "./C236D35D-A8AA-4FC2-B8B5-BE5961AEB200.jpeg";

// 18 fireflies, golden-angle distribution
const FIREFLIES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  top: 10 + ((i * 53.7) % 62),
  left: 4 + ((i * 61.8) % 88),
  size: 2 + (i % 3) * 0.6,
  dur: 3.2 + (i % 6) * 0.8,
  delay: -(i * 0.9),
  opacity: 0.38 + (i % 4) * 0.16,
  animName: i % 2 === 0 ? "firefly-float" : "firefly-float-b",
}));

// ── Volume levels ─────────────────────────────────────────────────────────────
type VolumeLevel = "low" | "medium" | "immersive";
const VOLUME_CYCLE: VolumeLevel[] = ["low", "medium", "immersive"];
const VOLUME_MULT: Record<VolumeLevel, number> = { low: 0.30, medium: 1.0, immersive: 1.80 };
const VOLUME_ICON: Record<VolumeLevel, string> = { low: "🔈", medium: "🔉", immersive: "🔊" };
const VOLUME_LABEL: Record<VolumeLevel, string> = { low: "Hiljainen", medium: "Normaali", immersive: "Mukaansatempaava" };

// ── Web Audio engine ──────────────────────────────────────────────────────────
function useCinematicAudio() {
  const ctxRef      = useRef<AudioContext | null>(null);
  const masterRef   = useRef<GainNode | null>(null);
  const owlTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const noiseRef    = useRef<AudioBufferSourceNode | null>(null);
  const windRef     = useRef<AudioBufferSourceNode | null>(null);
  const droneRef    = useRef<OscillatorNode | null>(null);

  const stopAll = () => {
    owlTimerRef.current && clearTimeout(owlTimerRef.current);
    try { noiseRef.current?.stop(); } catch { /* ok */ }
    try { windRef.current?.stop(); }  catch { /* ok */ }
    try { droneRef.current?.stop(); } catch { /* ok */ }
    noiseRef.current = null; windRef.current = null; droneRef.current = null;
    ctxRef.current?.close();
    ctxRef.current = null; masterRef.current = null;
  };

  const setVolume = (level: VolumeLevel) => {
    if (!masterRef.current) return;
    const t = masterRef.current.context.currentTime;
    masterRef.current.gain.setTargetAtTime(VOLUME_MULT[level], t, 0.5);
  };

  // ── Shared noise buffer factory ─────────────────────────────────────────────
  const makeNoiseBuf = (ctx: AudioContext, seconds = 4) => {
    const len = ctx.sampleRate * seconds;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + w * 0.0555179;
      b1 = 0.99332 * b1 + w * 0.0750759;
      b2 = 0.96900 * b2 + w * 0.1538520;
      d[i] = (b0 + b1 + b2 + w * 0.5362) * 0.11;
    }
    return buf;
  };

  // ── Single owl hoot (FM synthesis) ─────────────────────────────────────────
  const playHoot = (ctx: AudioContext, dest: AudioNode, startT: number, pitch = 1, peak = 0.36) => {
    const mod = ctx.createOscillator();
    mod.frequency.value = 55 * pitch;
    const modGain = ctx.createGain();
    modGain.gain.value = 245;
    mod.connect(modGain);
    const carrier = ctx.createOscillator();
    carrier.frequency.value = 210 * pitch;
    modGain.connect(carrier.frequency);
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, startT);
    env.gain.linearRampToValueAtTime(peak, startT + 0.14);
    env.gain.setValueAtTime(peak, startT + 0.46);
    env.gain.exponentialRampToValueAtTime(0.001, startT + 1.2);
    carrier.connect(env).connect(dest);
    mod.start(startT); carrier.start(startT);
    mod.stop(startT + 1.4); carrier.stop(startT + 1.4);
  };

  const start = (initialLevel: VolumeLevel) => {
    if (ctxRef.current) return;
    const ctx = new AudioContext();
    ctxRef.current = ctx;

    // Master — ramps to the chosen level over 3 s
    const master = ctx.createGain();
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(VOLUME_MULT[initialLevel], ctx.currentTime + 3.0);
    master.connect(ctx.destination);
    masterRef.current = master;

    // ── 1. Lake ambience: pink noise → low-pass 380 Hz ──────────────────────
    const lakeSrc = ctx.createBufferSource();
    lakeSrc.buffer = makeNoiseBuf(ctx, 4);
    lakeSrc.loop = true;
    const lakeLp = ctx.createBiquadFilter();
    lakeLp.type = "lowpass"; lakeLp.frequency.value = 380;
    const lakeGain = ctx.createGain();
    lakeGain.gain.value = 0.076; // was 0.042, +81%
    lakeSrc.connect(lakeLp).connect(lakeGain).connect(master);
    lakeSrc.start();
    noiseRef.current = lakeSrc;

    // ── 2. Wind / forest ambience: noise → band-pass 240 Hz ─────────────────
    const windSrc = ctx.createBufferSource();
    windSrc.buffer = makeNoiseBuf(ctx, 6);
    windSrc.loop = true;
    windSrc.playbackRate.value = 0.72; // slower = deeper, more wind-like
    const windBp = ctx.createBiquadFilter();
    windBp.type = "bandpass"; windBp.frequency.value = 240; windBp.Q.value = 0.6;
    // Slow amplitude modulation — wind gusts (3.5 s cycle)
    const windMod = ctx.createOscillator();
    windMod.frequency.value = 1 / 3.5;
    const windModGain = ctx.createGain();
    windModGain.gain.value = 0.012;
    windMod.connect(windModGain);
    const windGain = ctx.createGain();
    windGain.gain.value = 0.032; // forest wind, +100%
    windModGain.connect(windGain.gain); // LFO modulates gain
    windSrc.connect(windBp).connect(windGain).connect(master);
    windSrc.start(); windMod.start();
    windRef.current = windSrc;

    // ── 3. Suspense drone: triangle osc → slow LP sweep ─────────────────────
    const drone = ctx.createOscillator();
    drone.type = "triangle"; drone.frequency.value = 52;
    const droneLp = ctx.createBiquadFilter();
    droneLp.type = "lowpass";
    droneLp.frequency.setValueAtTime(90, ctx.currentTime);
    droneLp.frequency.linearRampToValueAtTime(185, ctx.currentTime + 9);
    droneLp.frequency.linearRampToValueAtTime(90,  ctx.currentTime + 18);
    const droneGain = ctx.createGain();
    droneGain.gain.value = 0.032; // was 0.016, +100%
    drone.connect(droneLp).connect(droneGain).connect(master);
    drone.start();
    droneRef.current = drone;

    // Continuous drone filter sweep after initial ramp
    let sweepDir = 1;
    const sweepDrone = () => {
      if (!ctxRef.current) return;
      sweepDir *= -1;
      droneLp.frequency.linearRampToValueAtTime(sweepDir > 0 ? 195 : 85, ctx.currentTime + 9);
      owlTimerRef.current = setTimeout(sweepDrone, 9000);
    };
    setTimeout(sweepDrone, 18000);

    // ── 4. Owl calls ─────────────────────────────────────────────────────────
    const scheduleOwl = () => {
      const delay = 20000 + Math.random() * 40000; // 20–60 s
      owlTimerRef.current = setTimeout(() => {
        if (!ctxRef.current) return;
        const t = ctx.currentTime;
        const pitch = 0.90 + Math.random() * 0.20;
        playHoot(ctx, master, t,        pitch);           // first hoot
        playHoot(ctx, master, t + 1.75, pitch * 0.96);   // second hoot
        scheduleOwl();
      }, delay);
    };
    scheduleOwl();

    // ── 5. First-visit intro: wave swell + close owl ─────────────────────────
    // Routes directly to destination (bypass master ramp) so it's heard immediately
    const introGain = ctx.createGain();
    introGain.gain.value = VOLUME_MULT[initialLevel] * 0.8;
    introGain.connect(ctx.destination);

    // Lake wave swell
    const waveSrc = ctx.createBufferSource();
    waveSrc.buffer = makeNoiseBuf(ctx, 3);
    const waveBp = ctx.createBiquadFilter();
    waveBp.type = "bandpass"; waveBp.frequency.value = 480; waveBp.Q.value = 0.7;
    const waveEnv = ctx.createGain();
    const wt = ctx.currentTime + 0.15;
    waveEnv.gain.setValueAtTime(0, wt);
    waveEnv.gain.linearRampToValueAtTime(0.28, wt + 0.6);
    waveEnv.gain.setValueAtTime(0.28, wt + 1.2);
    waveEnv.gain.exponentialRampToValueAtTime(0.001, wt + 2.8);
    waveSrc.connect(waveBp).connect(waveEnv).connect(introGain);
    waveSrc.start(wt); waveSrc.stop(wt + 3.2);

    // Close owl at t+1.8 s — louder and more present
    const owlT = ctx.currentTime + 1.8;
    playHoot(ctx, introGain, owlT,        1.0, 0.52);
    playHoot(ctx, introGain, owlT + 1.8,  0.96, 0.44);
  };

  return { start, stopAll, setVolume };
}

// ─────────────────────────────────────────────────────────────────────────────

export default function LandingScreen({ onCreateGame, onJoinGame }: Props) {
  const [name,        setName]        = useState(() => localStorage.getItem("murha_name") ?? "");
  const [joinMode,    setJoinMode]    = useState(false);
  const [joinCode,    setJoinCode]    = useState("");
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [audioStarted, setAudioStarted] = useState(false);
  const [volumeLevel,  setVolumeLevel]  = useState<VolumeLevel>("medium");
  const { start, stopAll, setVolume } = useCinematicAudio();

  useEffect(() => stopAll, []);

  // Title entrance
  const [titleIn, setTitleIn] = useState(false);
  useEffect(() => { const t = setTimeout(() => setTitleIn(true), 80); return () => clearTimeout(t); }, []);

  const saveName = (v: string) => { setName(v); localStorage.setItem("murha_name", v); };

  const startAmbience = () => {
    if (audioStarted) return;
    try { start(volumeLevel); setAudioStarted(true); } catch { /* ignore */ }
  };

  const handleVolumeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const idx  = VOLUME_CYCLE.indexOf(volumeLevel);
    const next = VOLUME_CYCLE[(idx + 1) % VOLUME_CYCLE.length];
    setVolumeLevel(next);
    if (!audioStarted) {
      try { start(next); setAudioStarted(true); } catch { /* ignore */ }
    } else {
      setVolume(next);
    }
  };

  const handleCreate = async () => {
    if (!name.trim()) { setError("Kirjoita nimesi ensin."); return; }
    setError(null); setLoading(true);
    try { await onCreateGame(name.trim()); }
    catch (e: unknown) { setError(e instanceof Error ? e.message : "Virhe pelin luomisessa."); }
    finally { setLoading(false); }
  };

  const handleJoin = async () => {
    if (!name.trim()) { setError("Kirjoita nimesi ensin."); return; }
    if (!joinCode.trim()) { setError("Anna pelikoodi."); return; }
    setError(null); setLoading(true);
    try { await onJoinGame(joinCode.trim().toUpperCase(), name.trim()); }
    catch (e: unknown) { setError(e instanceof Error ? e.message : "Virhe peliin liittymisessä."); }
    finally { setLoading(false); }
  };

  return (
    <div className="landing-cinematic" onClick={startAmbience} onTouchStart={startAmbience}>

      {/* ── Hero photo ── */}
      <div className="landing-bg" style={{ backgroundImage: `url(${COTTAGE_IMG})` }} />

      {/* ── Overlays ── */}
      <div className="landing-overlay" />
      <div className="landing-overlay-vignette" />

      {/* ── Fog layers ── */}
      <div className="fog-layer fog-1" />
      <div className="fog-layer fog-2" />
      <div className="fog-layer fog-3" />
      <div className="fog-layer fog-4" />
      <div className="fog-layer fog-5" />

      {/* ── Cottage elements ── */}
      <div className="cottage-glow" />
      <div className="window-flicker wf-left" />
      <div className="window-flicker wf-right" />

      {/* ── Lake reflection shimmer (soft, blurred, 10-15% opacity max) ── */}
      <div className="lake-reflection lr-1" />
      <div className="lake-reflection lr-2" />

      {/* ── Fireflies ── */}
      {FIREFLIES.map((f) => (
        <div
          key={f.id}
          className="firefly"
          style={{
            top: `${f.top}%`, left: `${f.left}%`,
            width: `${f.size}px`, height: `${f.size}px`,
            opacity: f.opacity,
            animationName: f.animName,
            animationDuration: `${f.dur}s`,
            animationDelay: `${f.delay}s`,
          }}
        />
      ))}

      {/* ── Volume level button ── */}
      <button
        className="volume-btn"
        onClick={handleVolumeClick}
        title={VOLUME_LABEL[volumeLevel]}
        aria-label={VOLUME_LABEL[volumeLevel]}
      >
        <span className="volume-icon">{VOLUME_ICON[volumeLevel]}</span>
        {audioStarted && <span className="volume-label">{VOLUME_LABEL[volumeLevel]}</span>}
      </button>

      {/* ── Content ── */}
      <div className="landing-content-cinematic">
        <header className={`landing-hero-text${titleIn ? " title-in" : ""}`}>
          <div className="landing-lightning">⚡</div>
          <h1 className="landing-title-cinematic">Murhamysteeri Mökillä</h1>
          <p className="landing-subtitle-cinematic">Salaisuuksia järven äärellä</p>
        </header>

        <div className="landing-glass-card">
          <div className="field-group">
            <label className="field-label">Nimesi</label>
            <input
              className="field-input"
              type="text"
              placeholder="Kirjoita nimesi…"
              value={name}
              maxLength={24}
              onChange={(e) => saveName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !joinMode) handleCreate();
                if (e.key === "Enter" && joinMode)  handleJoin();
              }}
            />
          </div>

          {joinMode && (
            <div className="field-group">
              <label className="field-label">Pelikoodi</label>
              <input
                className="field-input code-input"
                type="text"
                placeholder="esim. KXVB"
                value={joinCode}
                maxLength={4}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase().slice(0, 4))}
                onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                autoFocus
              />
            </div>
          )}

          {error && <div className="error-msg">{error}</div>}

          <div className="btn-group">
            {!joinMode ? (
              <>
                <button className="btn btn-primary" onClick={handleCreate} disabled={loading}>
                  {loading ? "Luodaan…" : "🏚️ Luo uusi peli"}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => { setJoinMode(true); setError(null); }}
                  disabled={loading}
                >
                  🔑 Liity peliin
                </button>
              </>
            ) : (
              <>
                <button className="btn btn-primary" onClick={handleJoin} disabled={loading}>
                  {loading ? "Liitytään…" : "→ Liity"}
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={() => { setJoinMode(false); setJoinCode(""); setError(null); }}
                  disabled={loading}
                >
                  ← Takaisin
                </button>
              </>
            )}
          </div>
        </div>

        <p className="landing-footer-hint">
          {audioStarted
            ? "Jopa 8 pelaajaa · Rikostutkimus · Kaikki suomeksi"
            : "Napauta näyttöä käynnistääksesi äänet · Jopa 8 pelaajaa"}
        </p>
      </div>
    </div>
  );
}
