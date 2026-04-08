import { useState, useEffect, useRef, useCallback } from 'react';

const SCENES = [
  {
    id: 0,
    duration: 2500,
    caption: 'POV: You let AI dress you for a week...',
    subcaption: null,
    bg: 'from-stone-900 via-stone-800 to-neutral-900',
    textSize: 'text-2xl',
    overlay: 'hook',
  },
  {
    id: 1,
    duration: 3000,
    caption: 'Day 1 — I gave the AI my vibe board.',
    subcaption: 'Neutral tones. Clean lines. No clutter.',
    bg: 'from-stone-800 via-neutral-800 to-stone-900',
    textSize: 'text-xl',
    overlay: 'day',
  },
  {
    id: 2,
    duration: 3000,
    caption: 'It came back with THIS.',
    subcaption: 'Cream ribbed set. Black belt. Gold hoops.',
    bg: 'from-neutral-700 via-stone-800 to-neutral-900',
    textSize: 'text-2xl',
    overlay: 'reveal',
  },
  {
    id: 3,
    duration: 3000,
    caption: 'And the craziest part?',
    subcaption: 'It matched my skin perfectly.',
    bg: 'from-stone-900 via-neutral-800 to-stone-800',
    textSize: 'text-xl',
    overlay: 'emphasis',
  },
  {
    id: 4,
    duration: 3500,
    caption: 'The vitiligo patches?',
    subcaption: 'It styled AROUND them. On purpose.',
    bg: 'from-neutral-900 via-stone-800 to-neutral-800',
    textSize: 'text-xl',
    overlay: 'emphasis',
  },
  {
    id: 5,
    duration: 3000,
    caption: 'I wore it. I got 47 compliments.',
    subcaption: '(I counted.)',
    bg: 'from-stone-800 via-neutral-700 to-stone-900',
    textSize: 'text-2xl',
    overlay: 'stat',
  },
  {
    id: 6,
    duration: 3000,
    caption: 'Built with bolt.diy',
    subcaption: 'AI that actually gets you.',
    bg: 'from-amber-900 via-stone-900 to-neutral-900',
    textSize: 'text-2xl',
    overlay: 'brand',
  },
  {
    id: 7,
    duration: 4000,
    caption: 'Build it. Wear it. Own it.',
    subcaption: '↓ Link in bio to try it yourself ↓',
    bg: 'from-stone-900 via-neutral-900 to-stone-950',
    textSize: 'text-3xl',
    overlay: 'cta',
  },
];

const NOVA_AVATAR = {
  initials: 'N',
  handle: '@nova.voss',
  verified: true,
};

interface OverlayBadgeProps {
  type: string;
}

function OverlayBadge({ type }: OverlayBadgeProps) {
  const badges: Record<string, React.ReactNode> = {
    hook: (
      <span className="bg-white/10 border border-white/20 text-white/70 text-[10px] tracking-widest uppercase px-3 py-1 rounded-full backdrop-blur-sm">
        POV
      </span>
    ),
    day: (
      <span className="bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[10px] tracking-widest uppercase px-3 py-1 rounded-full backdrop-blur-sm">
        Day 1 of 7
      </span>
    ),
    reveal: (
      <span className="bg-white/15 border border-white/25 text-white text-[10px] tracking-widest uppercase px-3 py-1 rounded-full backdrop-blur-sm animate-pulse">
        ✦ Outfit Reveal
      </span>
    ),
    emphasis: null,
    stat: (
      <span className="bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 text-[10px] tracking-widest uppercase px-3 py-1 rounded-full backdrop-blur-sm">
        Real Results
      </span>
    ),
    brand: (
      <span className="bg-amber-500/30 border border-amber-400/50 text-amber-200 text-[10px] tracking-widest uppercase px-3 py-1 rounded-full backdrop-blur-sm">
        Powered by bolt.diy
      </span>
    ),
    cta: (
      <span className="bg-white text-stone-900 text-[10px] tracking-widest uppercase font-bold px-3 py-1 rounded-full">
        Try it free
      </span>
    ),
  };

  return <div className="flex justify-center mb-3">{badges[type] ?? null}</div>;
}

export function UGCVideo() {
  const [currentScene, setCurrentScene] = useState(0);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [ended, setEnded] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const sceneRef = useRef(0);

  const totalDuration = SCENES.reduce((a, s) => a + s.duration, 0);

  const clearTimers = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const runScene = useCallback(
    (sceneIdx: number) => {
      if (sceneIdx >= SCENES.length) {
        setEnded(true);
        setPlaying(false);
        clearTimers();
        return;
      }

      sceneRef.current = sceneIdx;
      setCurrentScene(sceneIdx);
      setTextVisible(false);

      setTimeout(() => setTextVisible(true), 120);

      startTimeRef.current = Date.now();
      const sceneDuration = SCENES[sceneIdx].duration;

      clearTimers();
      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        const sceneProgress = Math.min(elapsed / sceneDuration, 1);
        const totalElapsed = SCENES.slice(0, sceneIdx).reduce((a, s) => a + s.duration, 0) + elapsed;
        setProgress(Math.min((totalElapsed / totalDuration) * 100, 100));

        if (sceneProgress >= 1) {
          clearTimers();
          runScene(sceneIdx + 1);
        }
      }, 30);
    },
    [clearTimers, totalDuration],
  );

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  const handlePlay = () => {
    if (ended) {
      setEnded(false);
      setProgress(0);
    }
    setPlaying(true);
    runScene(0);
  };

  const handlePause = () => {
    setPlaying(false);
    clearTimers();
  };

  const scene = SCENES[currentScene];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-950 font-sans px-4 py-8">
      {/* Header */}
      <div className="mb-6 text-center">
        <p className="text-stone-400 text-xs tracking-widest uppercase mb-1">Nova Voss · UGC Character</p>
        <h1 className="text-white text-xl font-light tracking-wide">
          "I let AI dress me for a week"
        </h1>
        <p className="text-stone-500 text-xs mt-1">TikTok · 28s · Fashion × Tech</p>
      </div>

      {/* Phone Mockup */}
      <div className="relative" style={{ width: 300, height: 580 }}>
        {/* Phone shell */}
        <div
          className="absolute inset-0 rounded-[44px] border-2 border-stone-700 shadow-2xl shadow-black/80 overflow-hidden"
          style={{ background: '#0a0a0a' }}
        >
          {/* Notch */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-50" />

          {/* Video area */}
          <div className={`absolute inset-0 bg-gradient-to-b ${scene.bg} transition-colors duration-500`}>
            {/* Grain texture overlay */}
            <div
              className="absolute inset-0 opacity-[0.03] z-10"
              style={{
                backgroundImage:
                  'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")',
              }}
            />

            {/* Center vitiligo silhouette — decorative */}
            <div className="absolute inset-0 flex items-center justify-center z-10 opacity-10">
              <div
                className="rounded-full bg-white"
                style={{
                  width: 140,
                  height: 200,
                  borderRadius: '60% 60% 50% 50% / 60% 60% 50% 50%',
                  filter: 'blur(40px)',
                }}
              />
            </div>

            {/* Caption area */}
            <div
              className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-28 px-5"
              style={{
                transition: 'opacity 0.15s ease',
                opacity: textVisible ? 1 : 0,
              }}
            >
              <OverlayBadge type={scene.overlay} />
              <p
                className={`text-white font-semibold text-center leading-snug drop-shadow-lg ${scene.textSize}`}
                style={{ textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}
              >
                {scene.caption}
              </p>
              {scene.subcaption && (
                <p
                  className="text-white/70 text-sm text-center mt-2 leading-relaxed"
                  style={{ textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}
                >
                  {scene.subcaption}
                </p>
              )}
            </div>

            {/* Right-side TikTok actions */}
            <div className="absolute right-3 bottom-36 z-20 flex flex-col gap-4 items-center">
              {[
                { icon: '♥', label: '47k' },
                { icon: '💬', label: '1.2k' },
                { icon: '↗', label: 'Share' },
              ].map((action) => (
                <div key={action.label} className="flex flex-col items-center gap-0.5">
                  <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white text-base border border-white/10">
                    {action.icon}
                  </div>
                  <span className="text-white/60 text-[9px]">{action.label}</span>
                </div>
              ))}
            </div>

            {/* Bottom creator bar */}
            <div className="absolute bottom-0 left-0 right-0 z-20 px-4 pb-5 pt-3 bg-gradient-to-t from-black/70 to-transparent">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center text-white text-xs font-bold border border-white/30 flex-shrink-0">
                  {NOVA_AVATAR.initials}
                </div>
                <span className="text-white text-xs font-semibold">{NOVA_AVATAR.handle}</span>
                {NOVA_AVATAR.verified && (
                  <span className="text-amber-400 text-xs">✦</span>
                )}
              </div>
              <p className="text-white/50 text-[9px] truncate">
                Build it. Wear it. Own it. #UGC #AIFashion #bolt
              </p>
            </div>

            {/* Progress bar */}
            <div className="absolute top-10 left-3 right-3 z-30 flex gap-0.5">
              {SCENES.map((s, i) => {
                const segTotal = totalDuration;
                const segWidth = (s.duration / segTotal) * 100;
                const elapsedPct = (SCENES.slice(0, i).reduce((a, sc) => a + sc.duration, 0) / segTotal) * 100;
                const fill =
                  i < currentScene
                    ? 100
                    : i === currentScene
                      ? Math.min(((progress - elapsedPct) / (segWidth)) * 100, 100)
                      : 0;
                return (
                  <div
                    key={s.id}
                    className="h-0.5 rounded-full bg-white/20 overflow-hidden flex-1"
                  >
                    <div
                      className="h-full bg-white rounded-full transition-all duration-75"
                      style={{ width: `${fill}%` }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Play / Pause overlay */}
            {!playing && !ended && (
              <button
                onClick={handlePlay}
                className="absolute inset-0 z-30 flex items-center justify-center"
                aria-label="Play video"
              >
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-xl">
                  <div className="w-0 h-0 ml-1" style={{ borderTop: '12px solid transparent', borderBottom: '12px solid transparent', borderLeft: '20px solid white' }} />
                </div>
              </button>
            )}

            {/* Replay overlay */}
            {ended && (
              <button
                onClick={handlePlay}
                className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-black/50 backdrop-blur-sm"
                aria-label="Replay video"
              >
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-xl text-white text-2xl">
                  ↺
                </div>
                <span className="text-white/80 text-sm tracking-wide">Watch again</span>
              </button>
            )}

            {/* Pause button while playing */}
            {playing && (
              <button
                onClick={handlePause}
                className="absolute top-16 left-4 z-30 w-7 h-7 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                aria-label="Pause"
              >
                <div className="flex gap-1">
                  <div className="w-1 h-4 bg-white rounded-full" />
                  <div className="w-1 h-4 bg-white rounded-full" />
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Phone side buttons */}
        <div className="absolute -right-1 top-24 w-1 h-10 bg-stone-700 rounded-r-sm" />
        <div className="absolute -left-1 top-20 w-1 h-7 bg-stone-700 rounded-l-sm" />
        <div className="absolute -left-1 top-32 w-1 h-10 bg-stone-700 rounded-l-sm" />
        <div className="absolute -left-1 top-46 w-1 h-10 bg-stone-700 rounded-l-sm" />
      </div>

      {/* Script card below phone */}
      <div className="mt-8 w-full max-w-sm">
        <div className="rounded-2xl border border-stone-800 bg-stone-900/60 backdrop-blur-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-stone-400 text-[10px] tracking-widest uppercase">Video Script</span>
            <span className="text-amber-400/70 text-[10px]">28s · TikTok / Reels</span>
          </div>
          <div className="space-y-2">
            {SCENES.map((s, i) => (
              <div
                key={s.id}
                className={`flex gap-3 items-start rounded-lg px-3 py-2 transition-colors ${i === currentScene && playing ? 'bg-white/5 border border-white/10' : 'border border-transparent'}`}
              >
                <span className="text-stone-600 text-[10px] font-mono pt-0.5 flex-shrink-0 w-6">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <p className={`text-sm leading-snug ${i === currentScene && playing ? 'text-white' : 'text-stone-400'}`}>
                    {s.caption}
                  </p>
                  {s.subcaption && (
                    <p className="text-stone-600 text-xs mt-0.5">{s.subcaption}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nova info footer */}
        <div className="mt-4 flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center text-white text-[10px] font-bold">
              N
            </div>
            <span className="text-stone-500 text-xs">Nova Voss · UGC Character</span>
          </div>
          <span className="text-stone-600 text-[10px]">bolt.diy</span>
        </div>
      </div>
    </div>
  );
}
