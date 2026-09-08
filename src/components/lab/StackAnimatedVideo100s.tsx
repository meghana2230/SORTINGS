import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Layers,
  ArrowDown,
  ArrowUp,
  AlertTriangle,
  Zap,
  CheckCircle2,
} from 'lucide-react';

export interface SceneData {
  id: number;
  timeStart: number;
  timeEnd: number;
  title: string;
  keyword: string;
  keywordColor: string;
  keywordDesc: string;
  narration: string;
  cameraZoom: number;
  cameraY: number;
  cameraX: number;
  activeOperation: 'intro' | 'lifo' | 'top' | 'push' | 'peek' | 'pop' | 'overflow' | 'underflow' | 'complexity' | 'recap';
  statusBadge: { text: string; color: string };
  keyConcept: string;
}

const SCENES: SceneData[] = [
  {
    id: 1,
    timeStart: 0,
    timeEnd: 10,
    title: 'Stack Introduction',
    keyword: 'STACK',
    keywordColor: 'text-indigo-400 border-indigo-500/60 bg-indigo-950/80 shadow-[0_0_20px_rgba(99,102,241,0.35)]',
    keywordDesc: 'Linear Data Structure',
    narration: 'A Stack is a linear data structure that stores elements vertically, one on top of another in sequential order.',
    cameraZoom: 1.0,
    cameraY: 0,
    cameraX: 0,
    activeOperation: 'intro',
    statusBadge: { text: 'Linear Collection (Base at Index 0)', color: 'text-indigo-300 bg-indigo-950/80 border-indigo-700/80' },
    keyConcept: 'Elements are organized vertically in contiguous logical order.',
  },
  {
    id: 2,
    timeStart: 10,
    timeEnd: 20,
    title: 'LIFO Principle',
    keyword: 'LIFO',
    keywordColor: 'text-indigo-300 border-indigo-500/60 bg-indigo-950/80 shadow-[0_0_20px_rgba(99,102,241,0.35)]',
    keywordDesc: 'Last In, First Out',
    narration: 'It strictly follows the LIFO principle: Last In, First Out. The most recently added element is always the first one to be removed.',
    cameraZoom: 1.04,
    cameraY: -10,
    cameraX: 0,
    activeOperation: 'lifo',
    statusBadge: { text: 'Last In → First Out Rule', color: 'text-indigo-300 bg-indigo-950/80 border-indigo-700/80' },
    keyConcept: 'New items enter at the top; items are extracted only from the top.',
  },
  {
    id: 3,
    timeStart: 20,
    timeEnd: 30,
    title: 'The TOP Pointer',
    keyword: 'TOP',
    keywordColor: 'text-indigo-300 border-indigo-500/60 bg-indigo-950/80 shadow-[0_0_20px_rgba(99,102,241,0.35)]',
    keywordDesc: 'Current Top Index Pointer',
    narration: 'All operations occur at a single accessible end, tracked continuously by an animated pointer called TOP.',
    cameraZoom: 1.1,
    cameraY: -25,
    cameraX: 0,
    activeOperation: 'top',
    statusBadge: { text: 'TOP = Index 2 (Value 30)', color: 'text-indigo-300 bg-indigo-950/80 border-indigo-700/80' },
    keyConcept: 'TOP tracks the uppermost active element. No middle access is permitted.',
  },
  {
    id: 4,
    timeStart: 30,
    timeEnd: 40,
    title: 'Push Operation',
    keyword: 'PUSH',
    keywordColor: 'text-emerald-400 border-emerald-500/60 bg-emerald-950/80 shadow-[0_0_20px_rgba(52,211,153,0.35)]',
    keywordDesc: 'Insert Element onto Stack',
    narration: 'Push is used to add an element. Notice block 40 smoothly entering the top position, and TOP moving up to 40.',
    cameraZoom: 1.06,
    cameraY: -20,
    cameraX: 0,
    activeOperation: 'push',
    statusBadge: { text: 'PUSH(40) → TOP: 30 ➔ 40', color: 'text-emerald-300 bg-emerald-950/80 border-emerald-700/80' },
    keyConcept: 'Increment TOP pointer, then store value at stack[TOP].',
  },
  {
    id: 5,
    timeStart: 40,
    timeEnd: 50,
    title: 'Peek Operation',
    keyword: 'PEEK',
    keywordColor: 'text-amber-300 border-amber-500/60 bg-amber-950/80 shadow-[0_0_20px_rgba(251,191,36,0.35)]',
    keywordDesc: 'Inspect Top without Removal',
    narration: 'Peek inspects the current TOP element without removing it. Block 40 illuminates while remaining securely in place.',
    cameraZoom: 1.15,
    cameraY: -35,
    cameraX: 0,
    activeOperation: 'peek',
    statusBadge: { text: 'PEEK() Returns 40 (Size Unchanged)', color: 'text-amber-300 bg-amber-950/80 border-amber-700/80' },
    keyConcept: 'Inspect stack[TOP] without decrementing pointer or modifying state.',
  },
  {
    id: 6,
    timeStart: 50,
    timeEnd: 60,
    title: 'Pop Operation',
    keyword: 'POP',
    keywordColor: 'text-rose-400 border-rose-500/60 bg-rose-950/80 shadow-[0_0_20px_rgba(244,63,94,0.35)]',
    keywordDesc: 'Remove & Return Top Element',
    narration: 'Pop removes the top element. Watch block 40 lift away from the stack, while TOP returns to 30.',
    cameraZoom: 1.05,
    cameraY: -15,
    cameraX: 0,
    activeOperation: 'pop',
    statusBadge: { text: 'POP() → 40 Removed, TOP: 40 ➔ 30', color: 'text-rose-300 bg-rose-950/80 border-rose-700/80' },
    keyConcept: 'Retrieve value at stack[TOP], then decrement TOP pointer.',
  },
  {
    id: 7,
    timeStart: 60,
    timeEnd: 70,
    title: 'Stack Overflow',
    keyword: 'OVERFLOW',
    keywordColor: 'text-red-400 border-red-500/60 bg-red-950/80 shadow-[0_0_20px_rgba(239,68,68,0.4)]',
    keywordDesc: 'Push into Full Stack Error',
    narration: 'Stack Overflow occurs when attempting to push into a stack that has already reached its maximum capacity limit.',
    cameraZoom: 1.0,
    cameraY: 5,
    cameraX: 0,
    activeOperation: 'overflow',
    statusBadge: { text: 'ERROR: Stack Overflow (Capacity 5 Reached)', color: 'text-red-300 bg-red-950/80 border-red-700/80' },
    keyConcept: 'Condition: TOP >= MAX_CAPACITY - 1 when attempting PUSH.',
  },
  {
    id: 8,
    timeStart: 70,
    timeEnd: 80,
    title: 'Stack Underflow',
    keyword: 'UNDERFLOW',
    keywordColor: 'text-orange-400 border-orange-500/60 bg-orange-950/80 shadow-[0_0_20px_rgba(249,115,22,0.4)]',
    keywordDesc: 'Pop from Empty Stack Error',
    narration: 'Stack Underflow happens when attempting to pop or peek from an empty stack where TOP equals minus one.',
    cameraZoom: 1.0,
    cameraY: 10,
    cameraX: 0,
    activeOperation: 'underflow',
    statusBadge: { text: 'ERROR: Stack Underflow (TOP = -1)', color: 'text-orange-300 bg-orange-950/80 border-orange-700/80' },
    keyConcept: 'Condition: TOP == -1 when attempting POP or PEEK.',
  },
  {
    id: 9,
    timeStart: 80,
    timeEnd: 90,
    title: 'Time Complexity',
    keyword: 'O(1)',
    keywordColor: 'text-emerald-300 border-emerald-400/60 bg-emerald-950/80 shadow-[0_0_20px_rgba(52,211,153,0.35)]',
    keywordDesc: 'Constant Time Efficiency',
    narration: 'Push, Pop, and Peek all execute in constant O(1) time because operations only touch the single TOP element.',
    cameraZoom: 1.04,
    cameraY: -5,
    cameraX: 0,
    activeOperation: 'complexity',
    statusBadge: { text: 'Push: O(1) | Pop: O(1) | Peek: O(1)', color: 'text-emerald-300 bg-emerald-950/80 border-emerald-700/80' },
    keyConcept: 'Direct index access at TOP requires zero shifting or iteration.',
  },
  {
    id: 10,
    timeStart: 90,
    timeEnd: 100,
    title: 'Visual Mastery',
    keyword: 'MASTERY',
    keywordColor: 'text-indigo-300 border-indigo-400/60 bg-indigo-950/80 shadow-[0_0_20px_rgba(99,102,241,0.35)]',
    keywordDesc: 'Complete 100s Stack Mastery',
    narration: 'Congratulations! You have mastered Stack fundamentals: LIFO ordering, TOP pointer mechanics, and O(1) performance.',
    cameraZoom: 0.96,
    cameraY: 0,
    cameraX: 0,
    activeOperation: 'recap',
    statusBadge: { text: '100s Animated DSA Mastery Complete', color: 'text-indigo-300 bg-indigo-950/80 border-indigo-700/80' },
    keyConcept: 'Stalls, recursion, syntax parsers, and undo buffers all rely on Stacks.',
  },
];

interface StackAnimatedVideoProps {
  initialSceneIndex?: number;
}

export const StackAnimatedVideo100s: React.FC<StackAnimatedVideoProps> = ({
  initialSceneIndex = 0,
}) => {
  const [currentTime, setCurrentTime] = useState<number>(initialSceneIndex * 10);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showCaptions, setShowCaptions] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const currentSceneIdRef = useRef<number>(-1);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize Speech Synthesis & Audio Context
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis || null;
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
  }, []);

  // Web Audio Synthesized Sound Effects
  const playSfx = useCallback(
    (type: 'push' | 'pop' | 'peek' | 'warning' | 'success' | 'transition') => {
      if (isMuted || !audioCtxRef.current) return;
      try {
        if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
        }
        const ctx = audioCtxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        const now = ctx.currentTime;
        if (type === 'push') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(320, now);
          osc.frequency.exponentialRampToValueAtTime(580, now + 0.12);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
          osc.start(now);
          osc.stop(now + 0.15);
        } else if (type === 'pop') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(580, now);
          osc.frequency.exponentialRampToValueAtTime(240, now + 0.14);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
          osc.start(now);
          osc.stop(now + 0.16);
        } else if (type === 'peek') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(587.33, now); // D5
          osc.frequency.setValueAtTime(880, now + 0.08); // A5
          gain.gain.setValueAtTime(0.18, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
          osc.start(now);
          osc.stop(now + 0.22);
        } else if (type === 'warning') {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(190, now);
          osc.frequency.setValueAtTime(140, now + 0.08);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
          osc.start(now);
          osc.stop(now + 0.25);
        } else if (type === 'success') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(523.25, now); // C5
          osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
          osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
          gain.gain.setValueAtTime(0.18, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
          osc.start(now);
          osc.stop(now + 0.3);
        } else if (type === 'transition') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(400, now);
          osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
          osc.start(now);
          osc.stop(now + 0.12);
        }
      } catch {
        // Autoplay restrictions guard
      }
    },
    [isMuted]
  );

  // Compute Current Scene
  const currentSceneIndex = Math.min(
    Math.floor(currentTime / 10),
    SCENES.length - 1
  );
  const currentScene = SCENES[currentSceneIndex] || SCENES[0];
  const sceneProgress = (currentTime % 10) / 10; // 0.0 to 1.0 within 10s scene

  // Voice Narration trigger
  useEffect(() => {
    if (isPlaying && !isMuted && currentScene.id !== currentSceneIdRef.current) {
      currentSceneIdRef.current = currentScene.id;
      playSfx('transition');

      if (synthRef.current) {
        synthRef.current.cancel();
        const utterance = new SpeechSynthesisUtterance(currentScene.narration);
        utterance.rate = 1.0 * playbackSpeed;
        utterance.pitch = 1.0;
        synthRef.current.speak(utterance);
      }
    }
  }, [currentScene.id, isPlaying, isMuted, playbackSpeed, currentScene.narration, playSfx]);

  // Main 60fps Animation Clock
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (synthRef.current) synthRef.current.cancel();
      return;
    }

    lastTimeRef.current = performance.now();

    const loop = (now: number) => {
      const delta = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      setCurrentTime((prev) => {
        const next = prev + delta * playbackSpeed;
        if (next >= 100) {
          setIsPlaying(false);
          return 100;
        }
        return next;
      });

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, playbackSpeed]);

  // Timed SFX Cues across the 100s timeline
  const lastSecTrigger = useRef<number>(-1);
  useEffect(() => {
    const sec = Math.floor(currentTime);
    if (sec !== lastSecTrigger.current && isPlaying) {
      lastSecTrigger.current = sec;
      if (sec === 32) playSfx('push');
      if (sec === 42) playSfx('peek');
      if (sec === 52) playSfx('pop');
      if (sec === 62) playSfx('warning');
      if (sec === 72) playSfx('warning');
      if (sec === 82) playSfx('success');
      if (sec === 92) playSfx('success');
    }
  }, [currentTime, isPlaying, playSfx]);

  // Controls Handlers
  const handleTogglePlay = () => {
    if (currentTime >= 100) {
      setCurrentTime(0);
      currentSceneIdRef.current = -1;
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    currentSceneIdRef.current = -1;
    if (synthRef.current) synthRef.current.cancel();
  };

  const handleJumpScene = (sceneIndex: number) => {
    const target = sceneIndex * 10;
    setCurrentTime(target);
    currentSceneIdRef.current = -1;
    if (synthRef.current) synthRef.current.cancel();
  };

  const handleRestart = () => {
    setCurrentTime(0);
    currentSceneIdRef.current = -1;
    if (synthRef.current) synthRef.current.cancel();
    setIsPlaying(true);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Compute Animated Continuous Physical Stack Elements per Scene
  let displayedBlocks: {
    id: number;
    val: number;
    opacity: number;
    translateY: number;
    scale: number;
    highlight?: boolean;
    isNew?: boolean;
    isDeparting?: boolean;
  }[] = [];

  let isPushing40 = false;
  let isPeeking40 = false;
  let isPopping40 = false;

  if (currentScene.id === 4) {
    // PUSH 40 Scene (30s - 40s)
    isPushing40 = true;
    const pushP = sceneProgress; // 0.0 to 1.0
    // 0-30% of scene (0-3s): 40 floats above stack
    // 30-70% of scene (3-7s): 40 glides smoothly down into top position
    // 70-100%: securely docked
    let block40Y = -120;
    let block40Opacity = 1;

    if (pushP < 0.3) {
      block40Y = -120;
      block40Opacity = Math.min(1, pushP / 0.15);
    } else if (pushP < 0.7) {
      const glideProgress = (pushP - 0.3) / 0.4;
      block40Y = -120 + glideProgress * 120;
    } else {
      block40Y = 0;
    }

    displayedBlocks = [
      { id: 1, val: 10, opacity: 1, translateY: 0, scale: 1 },
      { id: 2, val: 20, opacity: 1, translateY: 0, scale: 1 },
      { id: 3, val: 30, opacity: 1, translateY: 0, scale: 1 },
      { id: 4, val: 40, opacity: block40Opacity, translateY: block40Y, scale: 1, isNew: true },
    ];
  } else if (currentScene.id === 5) {
    // PEEK Scene (40s - 50s)
    isPeeking40 = true;
    displayedBlocks = [
      { id: 1, val: 10, opacity: 1, translateY: 0, scale: 1 },
      { id: 2, val: 20, opacity: 1, translateY: 0, scale: 1 },
      { id: 3, val: 30, opacity: 1, translateY: 0, scale: 1 },
      { id: 4, val: 40, opacity: 1, translateY: 0, scale: 1.04, highlight: true },
    ];
  } else if (currentScene.id === 6) {
    // POP 40 Scene (50s - 60s)
    isPopping40 = true;
    const popP = sceneProgress;
    // 0-25%: 40 prepares to pop
    // 25-70%: 40 floats up and right, fading away
    // 70-100%: settled back on 30
    let pop40Y = 0;
    let pop40Opacity = 1;

    if (popP < 0.25) {
      pop40Y = 0;
      pop40Opacity = 1;
    } else if (popP < 0.7) {
      const exitP = (popP - 0.25) / 0.45;
      pop40Y = -exitP * 140;
      pop40Opacity = Math.max(0, 1 - exitP);
    } else {
      pop40Opacity = 0;
    }

    displayedBlocks = [
      { id: 1, val: 10, opacity: 1, translateY: 0, scale: 1 },
      { id: 2, val: 20, opacity: 1, translateY: 0, scale: 1 },
      { id: 3, val: 30, opacity: 1, translateY: 0, scale: 1 },
    ];
    if (pop40Opacity > 0) {
      displayedBlocks.push({
        id: 4,
        val: 40,
        opacity: pop40Opacity,
        translateY: pop40Y,
        scale: 1.02,
        isDeparting: true,
      });
    }
  } else if (currentScene.id === 7) {
    // OVERFLOW Scene (60s - 70s): 5 elements [10, 20, 30, 40, 50] + rejected 60
    displayedBlocks = [
      { id: 1, val: 10, opacity: 1, translateY: 0, scale: 1 },
      { id: 2, val: 20, opacity: 1, translateY: 0, scale: 1 },
      { id: 3, val: 30, opacity: 1, translateY: 0, scale: 1 },
      { id: 4, val: 40, opacity: 1, translateY: 0, scale: 1 },
      { id: 5, val: 50, opacity: 1, translateY: 0, scale: 1 },
    ];
  } else if (currentScene.id === 8) {
    // UNDERFLOW Scene (70s - 80s): Empty stack
    displayedBlocks = [];
  } else {
    // Standard baseline [10, 20, 30]
    displayedBlocks = [
      { id: 1, val: 10, opacity: 1, translateY: 0, scale: 1 },
      { id: 2, val: 20, opacity: 1, translateY: 0, scale: 1 },
      { id: 3, val: 30, opacity: 1, translateY: 0, scale: 1 },
    ];
  }

  // Active top block
  const activeTopBlock = displayedBlocks.filter((b) => b.opacity > 0.5).slice(-1)[0];

  return (
    <div
      ref={containerRef}
      className="w-full bg-[#020617] rounded-3xl border border-slate-800/90 shadow-2xl overflow-hidden text-slate-100 flex flex-col relative select-none font-sans"
    >
      {/* ─── VIDEO SCREEN CANVAS (100% DARK THEME) ─── */}
      <div className="relative aspect-video w-full bg-[#020617] overflow-hidden flex items-center justify-center">
        
        {/* Deep Tech Grid & Subtle Starfields */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #6366f1 1px, transparent 0)`,
            backgroundSize: '28px 28px',
          }}
        />

        {/* Dark Navy Radial Depth Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-950/25 via-[#020617]/70 to-[#020617] pointer-events-none" />

        {/* TOP STATUS HEADER BAR */}
        <div className="absolute top-4 left-6 right-6 flex items-center justify-between z-20 pointer-events-none">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono font-black px-3 py-1 rounded-md bg-indigo-950/90 border border-indigo-500/50 text-indigo-300 tracking-wider shadow-sm backdrop-blur-md">
              SCENE {currentScene.id < 10 ? `0${currentScene.id}` : currentScene.id} / 10
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-200 tracking-tight drop-shadow-sm">
              {currentScene.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-400 bg-slate-900/90 px-3 py-1 rounded-md border border-slate-800 backdrop-blur-md">
              {formatTime(currentTime)} / 01:40
            </span>
          </div>
        </div>

        {/* DYNAMIC ANIMATED KEYWORD BANNER */}
        <div className="absolute top-16 left-6 z-20 pointer-events-none transition-all duration-500">
          <div
            className={`inline-flex items-center gap-2.5 px-4 py-1.5 rounded-xl border text-sm sm:text-base font-black font-mono tracking-widest uppercase shadow-xl backdrop-blur-md ${currentScene.keywordColor}`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{currentScene.keyword}</span>
          </div>
          <span className="block text-[11px] font-mono text-slate-400 mt-1 pl-1 font-medium">
            {currentScene.keywordDesc}
          </span>
        </div>

        {/* STATUS BADGE (Top Right) */}
        {currentScene.statusBadge && (
          <div className="absolute top-16 right-6 z-20 pointer-events-none transition-all duration-500">
            <div
              className={`px-4 py-1.5 rounded-xl border text-xs sm:text-sm font-mono font-bold tracking-tight shadow-lg backdrop-blur-md ${currentScene.statusBadge.color}`}
            >
              {currentScene.statusBadge.text}
            </div>
          </div>
        )}

        {/* ─── SCENE 2 LIFO FLOW OVERLAYS ─── */}
        {currentScene.id === 2 && (
          <div className="absolute inset-x-8 top-28 flex justify-between z-10 pointer-events-none text-xs font-mono">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-950/70 border border-indigo-500/40 text-indigo-300 animate-pulse">
              <ArrowDown className="w-4 h-4 text-indigo-400" />
              <span>1. Last item arrives at TOP</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-950/70 border border-indigo-500/40 text-indigo-300 animate-pulse">
              <ArrowUp className="w-4 h-4 text-indigo-400" />
              <span>2. First item retrieved from TOP</span>
            </div>
          </div>
        )}

        {/* ─── SCENE 9 O(1) COMPLEXITY OVERLAYS ─── */}
        {currentScene.id === 9 && (
          <div className="absolute top-28 right-8 z-10 pointer-events-none bg-emerald-950/80 border border-emerald-500/50 rounded-2xl p-4 shadow-xl backdrop-blur-md font-mono text-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-300 font-bold">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>TIME COMPLEXITY</span>
            </div>
            <div className="space-y-1 text-slate-300 text-[11px]">
              <div className="flex justify-between gap-4">
                <span>PUSH(item):</span>
                <span className="text-emerald-400 font-bold">O(1) Constant</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>POP():</span>
                <span className="text-emerald-400 font-bold">O(1) Constant</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>PEEK():</span>
                <span className="text-emerald-400 font-bold">O(1) Constant</span>
              </div>
            </div>
          </div>
        )}

        {/* ─── SCENE 10 MASTERY BADGES OVERLAY ─── */}
        {currentScene.id === 10 && (
          <div className="absolute top-28 left-8 right-8 flex justify-between z-10 pointer-events-none">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 shadow-md">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-mono">LIFO Principle Verified</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 shadow-md">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-mono">O(1) Mechanics Mastered</span>
            </div>
          </div>
        )}

        {/* ─── CORE ANIMATED STACK CONTAINER (CAMERA RIG) ─── */}
        <div
          className="relative flex flex-col items-center justify-end h-[340px] w-[320px] transition-transform duration-700 ease-out"
          style={{
            transform: `scale(${currentScene.cameraZoom}) translateY(${currentScene.cameraY}px) translateX(${currentScene.cameraX}px)`,
          }}
        >
          {/* TOP POINTER INDICATOR */}
          <div
            className="flex flex-col items-center mb-2 transition-all duration-500 ease-out z-20"
            style={{
              opacity: activeTopBlock ? 1 : 0.2,
            }}
          >
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/95 border border-indigo-400/70 shadow-[0_0_18px_rgba(99,102,241,0.4)] text-indigo-300 text-xs font-mono font-black animate-pulse">
              <span>TOP</span>
              <span className="text-[10px] text-indigo-400">
                {activeTopBlock ? `(idx: ${displayedBlocks.length - 1})` : '(-1)'}
              </span>
            </div>
            <div className="w-0.5 h-4 bg-gradient-to-b from-indigo-400 to-purple-400 shadow-[0_0_8px_#818cf8]" />
            <div className="w-0 h-0 border-x-4 border-x-transparent border-t-6 border-t-purple-400" />
          </div>

          {/* PHYSICAL STACK CONTAINER FRAME */}
          <div className="relative w-48 min-h-[220px] rounded-b-2xl border-x-4 border-b-4 border-indigo-600/70 bg-gradient-to-b from-indigo-950/10 via-indigo-950/30 to-indigo-950/70 shadow-[0_0_35px_rgba(79,70,229,0.3)] flex flex-col justify-end p-3 gap-2 backdrop-blur-xs">
            
            {/* OVERFLOW REJECTION BARRIER (Scene 7) */}
            {currentScene.activeOperation === 'overflow' && (
              <div className="absolute -top-12 inset-x-0 mx-auto w-52 p-2 rounded-xl bg-red-950/95 border-2 border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.6)] text-center animate-bounce z-30">
                <div className="flex items-center justify-center gap-1.5 text-xs font-mono font-black text-red-300">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span>OVERFLOW BLOCKED</span>
                </div>
                <span className="text-[9px] text-red-400/90 font-mono">
                  Stack Full (Capacity 5)
                </span>
              </div>
            )}

            {/* UNDERFLOW EMPTY CONTAINER NOTICE (Scene 8) */}
            {currentScene.activeOperation === 'underflow' && (
              <div className="my-auto text-center p-3.5 rounded-xl bg-orange-950/80 border border-orange-500/70 shadow-[0_0_20px_rgba(249,115,22,0.35)] animate-pulse">
                <span className="text-xs font-mono font-bold text-orange-300 block">
                  ⚠️ EMPTY STACK (TOP = -1)
                </span>
                <span className="text-[10px] text-orange-400/90 mt-1 block">
                  Underflow: No items to pop
                </span>
              </div>
            )}

            {/* RENDERED STACK BLOCKS */}
            {displayedBlocks.map((block, idx) => {
              const isTop = idx === displayedBlocks.length - 1;
              return (
                <div
                  key={block.id}
                  className={`w-full h-11 rounded-xl flex items-center justify-between px-4 font-mono font-bold text-base transition-all duration-300 select-none ${
                    block.highlight
                      ? 'bg-amber-950/95 border-2 border-amber-400 text-amber-100 shadow-[0_0_25px_rgba(251,191,36,0.7)] ring-2 ring-amber-400/40'
                      : block.isNew
                      ? 'bg-emerald-950/95 border-2 border-emerald-400 text-emerald-100 shadow-[0_0_22px_rgba(52,211,153,0.6)]'
                      : block.isDeparting
                      ? 'bg-rose-950/95 border-2 border-rose-400 text-rose-100 shadow-[0_0_22px_rgba(244,63,94,0.6)]'
                      : isTop
                      ? 'bg-[#0f172a] border-2 border-indigo-400 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)] ring-1 ring-indigo-400/30'
                      : 'bg-[#0b1329] border border-indigo-600/60 text-slate-200 shadow-sm'
                  }`}
                  style={{
                    opacity: block.opacity,
                    transform: `translateY(${block.translateY}px) scale(${block.scale})`,
                  }}
                >
                  <span className="text-xs font-medium text-indigo-300">
                    [{idx}]
                  </span>
                  <span className="text-lg font-black tracking-wider text-white drop-shadow-sm">
                    {block.val}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {isTop ? 'TOP' : ''}
                  </span>
                </div>
              );
            })}

            {/* BASE LABEL */}
            <div className="absolute -bottom-7 inset-x-0 text-center">
              <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">
                STACK BASE (INDEX 0)
              </span>
            </div>
          </div>
        </div>

        {/* ─── LIVE SYNCHRONIZED CAPTION SUBTITLE BAR ─── */}
        {showCaptions && (
          <div className="absolute bottom-4 inset-x-6 z-20 flex justify-center pointer-events-none">
            <div className="max-w-2xl px-5 py-2.5 rounded-2xl bg-black/90 border border-slate-700/80 shadow-[0_0_30px_rgba(0,0,0,0.85)] backdrop-blur-md text-center transition-all duration-300">
              <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed tracking-wide drop-shadow-md">
                {currentScene.narration}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ─── TIMELINE SCRUBBER & CHAPTER CONTROLS ─── */}
      <div className="p-4 sm:p-5 bg-[#050b18] border-t border-slate-800 space-y-3">
        
        {/* Scrub Bar */}
        <div className="space-y-1.5">
          <div className="relative flex items-center">
            <input
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 rounded-lg bg-slate-800 accent-indigo-500 cursor-pointer appearance-none focus:outline-none transition-all"
              style={{
                background: `linear-gradient(to right, #4f46e5 0%, #7c3aed ${(currentTime / 100) * 100}%, #1e293b ${(currentTime / 100) * 100}%, #1e293b 100%)`,
              }}
            />
          </div>

          {/* 10 Scene Chapter Markers */}
          <div className="grid grid-cols-10 gap-1 pt-1">
            {SCENES.map((scene, idx) => {
              const isActive = currentSceneIndex === idx;
              return (
                <button
                  key={scene.id}
                  onClick={() => handleJumpScene(idx)}
                  title={`Scene ${scene.id}: ${scene.title}`}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-400 shadow-[0_0_8px_#818cf8] scale-y-125'
                      : currentTime >= scene.timeEnd
                      ? 'bg-indigo-700/70 hover:bg-indigo-500'
                      : 'bg-slate-800 hover:bg-slate-700'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Media Control Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Left: Play / Pause / Restart / Scene Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleTogglePlay}
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 hover:opacity-90 text-white flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all active:scale-95 cursor-pointer"
              title={isPlaying ? 'Pause (100s Video)' : 'Play (100s Video)'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            <button
              onClick={handleRestart}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-all cursor-pointer"
              title="Restart from 0:00"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <div className="hidden sm:flex items-center gap-1 border-l border-slate-800 pl-2">
              <button
                onClick={() => handleJumpScene(Math.max(0, currentSceneIndex - 1))}
                disabled={currentSceneIndex === 0}
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-300 transition-all cursor-pointer"
                title="Previous Scene"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleJumpScene(Math.min(SCENES.length - 1, currentSceneIndex + 1))}
                disabled={currentSceneIndex === SCENES.length - 1}
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-300 transition-all cursor-pointer"
                title="Next Scene"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="font-mono text-xs font-semibold text-slate-300 pl-2">
              <span>{formatTime(currentTime)}</span>
              <span className="text-slate-500"> / 01:40</span>
            </div>
          </div>

          {/* Right: Narration Audio, Speed, Captions, Fullscreen */}
          <div className="flex items-center gap-2">
            {/* Speed Selector */}
            <div className="flex items-center bg-slate-900 rounded-xl p-0.5 border border-slate-800 text-xs font-mono">
              {[1, 1.25, 1.5].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                    playbackSpeed === speed
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            {/* Audio Voice Narration Toggle */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isMuted
                  ? 'bg-red-950/40 border-red-800/60 text-red-400'
                  : 'bg-slate-800 border-slate-700 text-indigo-400 hover:bg-slate-700'
              }`}
              title={isMuted ? 'Unmute Audio Narration & SFX' : 'Mute Audio Narration'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Captions Toggle */}
            <button
              onClick={() => setShowCaptions(!showCaptions)}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                showCaptions
                  ? 'bg-indigo-950/60 border-indigo-600/60 text-indigo-300'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
              title="Toggle Subtitles / Captions"
            >
              CC
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 10 Scene Jump Chips */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {SCENES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => handleJumpScene(idx)}
              className={`whitespace-nowrap px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium transition-all cursor-pointer border ${
                currentSceneIndex === idx
                  ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300 shadow-xs'
                  : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {s.id}. {s.keyword}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
