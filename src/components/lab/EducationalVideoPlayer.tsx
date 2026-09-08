import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Video,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Upload,
  RefreshCw,
  Layers,
  ArrowRight,
  ArrowDown,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  Film,
  X,
} from 'lucide-react';
import { soundEffects } from '../../services/sound';
import { LessonData, EducationalScene } from '../../data/labVideoData';

export type { LessonData, EducationalScene };

interface EducationalVideoPlayerProps {
  activeLesson: LessonData;
  customVideoUrl: string | null;
  customVideoName: string | null;
  autoPlayTrigger?: number;
  onUploadClick: () => void;
  onLessonComplete?: (lessonId: number) => void;
}

export const EducationalVideoPlayer: React.FC<EducationalVideoPlayerProps> = ({
  activeLesson,
  customVideoUrl,
  customVideoName,
  autoPlayTrigger,
  onUploadClick,
  onLessonComplete,
}) => {
  const [viewMode, setViewMode] = useState<'video' | 'simulation'>('video');
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [videoDuration, setVideoDuration] = useState<number>(activeLesson.duration);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isHoveringVideo, setIsHoveringVideo] = useState<boolean>(false);
  const [fsControlsVisible, setFsControlsVisible] = useState<boolean>(true);
  const [isHoveringControls, setIsHoveringControls] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const nativeVideoRef = useRef<HTMLVideoElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number>(performance.now());
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const currentSceneIdRef = useRef<number>(-1);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Determine active video source
  const effectiveVideoSrc = customVideoUrl || activeLesson.videoSrc;
  const isVideoMode = viewMode === 'video' && !!effectiveVideoSrc;
  const totalDuration = videoDuration > 0 ? videoDuration : activeLesson.duration;

  // Sync lesson switch
  useEffect(() => {
    setCurrentTime(0);
    setIsPlaying(false);
    currentSceneIdRef.current = -1;
    setVideoDuration(activeLesson.duration);

    if (nativeVideoRef.current) {
      nativeVideoRef.current.currentTime = 0;
      nativeVideoRef.current.playbackRate = playbackSpeed;
    }
  }, [activeLesson.id]);

  // Speech synthesis & web audio setup
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

  // Web Audio SFX generator for simulation mode
  const playSfx = useCallback(
    (type: 'push' | 'pop' | 'peek' | 'transition' | 'warning') => {
      if (isMuted || volume === 0 || !audioCtxRef.current) return;
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
        const currentVol = isMuted ? 0 : volume * 0.15;

        if (type === 'push') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(420, now);
          osc.frequency.exponentialRampToValueAtTime(840, now + 0.15);
          gain.gain.setValueAtTime(currentVol, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
          osc.start(now);
          osc.stop(now + 0.2);
        } else if (type === 'pop') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(750, now);
          osc.frequency.exponentialRampToValueAtTime(320, now + 0.16);
          gain.gain.setValueAtTime(currentVol, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.19);
          osc.start(now);
          osc.stop(now + 0.2);
        } else if (type === 'peek') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(650, now);
          osc.frequency.exponentialRampToValueAtTime(980, now + 0.12);
          gain.gain.setValueAtTime(currentVol * 0.8, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
          osc.start(now);
          osc.stop(now + 0.16);
        } else if (type === 'warning') {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(220, now);
          osc.frequency.exponentialRampToValueAtTime(180, now + 0.2);
          gain.gain.setValueAtTime(currentVol * 0.9, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
          osc.start(now);
          osc.stop(now + 0.25);
        } else {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.exponentialRampToValueAtTime(580, now + 0.1);
          gain.gain.setValueAtTime(currentVol * 0.5, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
          osc.start(now);
          osc.stop(now + 0.14);
        }
      } catch {
        // Fallback gracefully
      }
    },
    [isMuted, volume]
  );

  // Find active scene
  const currentSceneIndex = activeLesson.scenes.findIndex(
    (s) => currentTime >= s.timeStart && currentTime < s.timeEnd
  );
  const activeScene =
    activeLesson.scenes[currentSceneIndex >= 0 ? currentSceneIndex : activeLesson.scenes.length - 1];

  // Speech narration when running simulation mode
  useEffect(() => {
    if (isVideoMode || !isPlaying || isMuted || !synthRef.current) return;
    if (activeScene && activeScene.id !== currentSceneIdRef.current) {
      currentSceneIdRef.current = activeScene.id;
      synthRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(activeScene.narration);
      utterance.rate = 1.05 * playbackSpeed;
      utterance.volume = isMuted ? 0 : volume;

      const voices = synthRef.current.getVoices();
      const naturalVoice = voices.find(
        (v) =>
          v?.lang?.startsWith('en') &&
          (v?.name?.includes('Natural') ||
            v?.name?.includes('Google') ||
            v?.name?.includes('Samantha') ||
            v?.name?.includes('Daniel'))
      );
      if (naturalVoice) utterance.voice = naturalVoice;

      synthRef.current.speak(utterance);

      if (activeScene.type === 'push') playSfx('push');
      else if (activeScene.type === 'pop') playSfx('pop');
      else if (activeScene.type === 'peek') playSfx('peek');
      else if (activeScene.type === 'overflow' || activeScene.type === 'underflow') playSfx('warning');
      else playSfx('transition');
    }
  }, [activeScene, isPlaying, isMuted, playbackSpeed, volume, isVideoMode, playSfx]);

  // Simulation mode RAF loop
  useEffect(() => {
    if (isVideoMode) return;

    if (isPlaying) {
      lastTimestampRef.current = performance.now();

      const loop = (timestamp: number) => {
        const delta = (timestamp - lastTimestampRef.current) / 1000;
        lastTimestampRef.current = timestamp;

        setCurrentTime((prev) => {
          const next = prev + delta * playbackSpeed;
          if (next >= totalDuration) {
            setIsPlaying(false);
            if (synthRef.current) synthRef.current.cancel();
            if (onLessonComplete) onLessonComplete(activeLesson.id);
            return totalDuration;
          }
          return next;
        });

        animFrameRef.current = requestAnimationFrame(loop);
      };

      animFrameRef.current = requestAnimationFrame(loop);
    } else {
      if (synthRef.current) synthRef.current.cancel();
    }

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, playbackSpeed, totalDuration, isVideoMode, onLessonComplete, activeLesson.id]);

  // Video element event listeners
  const handleNativeTimeUpdate = () => {
    if (nativeVideoRef.current) {
      setCurrentTime(nativeVideoRef.current.currentTime);
      if (nativeVideoRef.current.ended) {
        setIsPlaying(false);
        if (onLessonComplete) onLessonComplete(activeLesson.id);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (nativeVideoRef.current) {
      const dur = nativeVideoRef.current.duration;
      if (dur && !isNaN(dur) && isFinite(dur) && dur > 0) {
        setVideoDuration(dur);
      }
      nativeVideoRef.current.volume = isMuted ? 0 : volume;
      nativeVideoRef.current.muted = isMuted;
      nativeVideoRef.current.playbackRate = playbackSpeed;
    }
  };

  // Fullscreen controls
  const enterFullscreen = useCallback(() => {
    setIsFullscreen(true);
    setFsControlsVisible(true);
    resetInactivityTimer();
    if (containerRef.current && !document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    }
  }, []);

  const exitFullscreen = useCallback(() => {
    setIsFullscreen(false);
    setFsControlsVisible(true);
    if (typeof document !== 'undefined' && document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  // Handle external autoPlay trigger (e.g. from WATCH LESSON buttons)
  useEffect(() => {
    if (autoPlayTrigger && autoPlayTrigger > 0) {
      enterFullscreen();
      setIsPlaying(true);
      if (nativeVideoRef.current) {
        nativeVideoRef.current.currentTime = 0;
        nativeVideoRef.current.play().catch(() => {});
      }
    }
  }, [autoPlayTrigger, enterFullscreen]);

  // Play / Pause handler
  const handleTogglePlay = () => {
    soundEffects.playClick();
    if (isVideoMode && nativeVideoRef.current) {
      if (isPlaying) {
        nativeVideoRef.current.pause();
        setIsPlaying(false);
      } else {
        if (nativeVideoRef.current.ended || currentTime >= totalDuration - 0.2) {
          nativeVideoRef.current.currentTime = 0;
          setCurrentTime(0);
        }
        enterFullscreen();
        nativeVideoRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            setIsPlaying(false);
          });
      }
    } else {
      if (!isPlaying && currentTime >= totalDuration) {
        setCurrentTime(0);
        currentSceneIdRef.current = -1;
      }
      if (!isPlaying) {
        enterFullscreen();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Restart video
  const handleRestart = () => {
    soundEffects.playClick();
    setCurrentTime(0);
    currentSceneIdRef.current = -1;
    enterFullscreen();
    if (isVideoMode && nativeVideoRef.current) {
      nativeVideoRef.current.currentTime = 0;
      nativeVideoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          enterFullscreen();
        })
        .catch(() => {});
    } else {
      setIsPlaying(true);
    }
  };

  // Step 5s backward or forward
  const handleSkipTime = (seconds: number) => {
    soundEffects.playClick();
    const newTime = Math.min(totalDuration, Math.max(0, currentTime + seconds));
    setCurrentTime(newTime);
    currentSceneIdRef.current = -1;
    if (isVideoMode && nativeVideoRef.current) {
      nativeVideoRef.current.currentTime = newTime;
    }
  };

  // Seek timeline
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    currentSceneIdRef.current = -1;
    if (isVideoMode && nativeVideoRef.current) {
      nativeVideoRef.current.currentTime = seekTime;
    }
  };

  // Scene jumper
  const handleJumpScene = (sceneIndex: number) => {
    if (sceneIndex >= 0 && sceneIndex < activeLesson.scenes.length) {
      soundEffects.playClick();
      const targetTime = activeLesson.scenes[sceneIndex].timeStart;
      setCurrentTime(targetTime);
      currentSceneIdRef.current = -1;
      if (isVideoMode && nativeVideoRef.current) {
        nativeVideoRef.current.currentTime = targetTime;
      }
      enterFullscreen();
      setIsPlaying(true);
    }
  };

  // Speed change
  const handleSpeedChange = (speed: number) => {
    soundEffects.playClick();
    setPlaybackSpeed(speed);
    if (nativeVideoRef.current) {
      nativeVideoRef.current.playbackRate = speed;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val > 0) setIsMuted(false);
    if (nativeVideoRef.current) {
      nativeVideoRef.current.volume = val;
      nativeVideoRef.current.muted = false;
    }
  };

  const handleToggleMute = useCallback(() => {
    soundEffects.playClick();
    setIsMuted((prev) => {
      const nextMuted = !prev;
      if (nativeVideoRef.current) {
        nativeVideoRef.current.muted = nextMuted;
      }
      return nextMuted;
    });
  }, []);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    soundEffects.playClick();
    if (!containerRef.current) return;
    if (!document.fullscreenElement && !isFullscreen) {
      enterFullscreen();
    } else {
      exitFullscreen();
    }
  }, [enterFullscreen, exitFullscreen, isFullscreen]);

  useEffect(() => {
    const handleFsChange = () => {
      const isFs = !!document.fullscreenElement;
      setIsFullscreen(isFs);
      setFsControlsVisible(true);
      if (isFs) {
        resetInactivityTimer();
      }
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Keyboard shortcut listeners when focused or in fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleSkipTime(-5);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleSkipTime(5);
      } else if (e.key.toLowerCase() === 'm') {
        e.preventDefault();
        handleToggleMute();
      } else if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'Escape' && isFullscreen) {
        e.preventDefault();
        exitFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isVideoMode, totalDuration, currentTime, isFullscreen, exitFullscreen, toggleFullscreen, handleToggleMute]);

  const formatTime = (secs: number) => {
    if (isNaN(secs) || !isFinite(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressTrackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const seekFromPointer = useCallback(
    (clientX: number) => {
      if (!progressTrackRef.current) return;
      const rect = progressTrackRef.current.getBoundingClientRect();
      const clampedX = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const ratio = rect.width > 0 ? clampedX / rect.width : 0;
      const seekTime = Math.max(0, Math.min(ratio * totalDuration, totalDuration));
      setCurrentTime(seekTime);
      currentSceneIdRef.current = -1;
      if (isVideoMode && nativeVideoRef.current) {
        nativeVideoRef.current.currentTime = seekTime;
      }
    },
    [totalDuration, isVideoMode]
  );

  // Auto-hide fullscreen controls timer logic
  const resetInactivityTimer = useCallback(() => {
    setFsControlsVisible(true);
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    // Only auto-hide if in fullscreen AND actively playing AND not dragging AND not hovering over controls
    if (isFullscreen && isPlaying && !isHoveringControls && !isDragging) {
      hideTimerRef.current = setTimeout(() => {
        setFsControlsVisible(false);
      }, 2500);
    }
  }, [isFullscreen, isPlaying, isHoveringControls, isDragging]);

  useEffect(() => {
    resetInactivityTimer();
    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    };
  }, [isFullscreen, isPlaying, isHoveringControls, isDragging, resetInactivityTimer]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    resetInactivityTimer();
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    seekFromPointer(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    resetInactivityTimer();
    seekFromPointer(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      resetInactivityTimer();
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
      } catch {}
    }
  };

  // Video screen click handler:
  // - In fullscreen: clicking the video screen area while playing toggles control visibility
  //   without pausing or restarting playback, and without exiting fullscreen.
  //   Clicking while paused starts playback.
  // - In normal mode: clicking toggles play/pause.
  const handleVideoAreaClick = (e: React.MouseEvent) => {
    if (isFullscreen) {
      if (isPlaying) {
        setFsControlsVisible((prev) => {
          const next = !prev;
          if (next) {
            resetInactivityTimer();
          } else {
            if (hideTimerRef.current) {
              clearTimeout(hideTimerRef.current);
              hideTimerRef.current = null;
            }
          }
          return next;
        });
      } else {
        handleTogglePlay();
      }
    } else {
      handleTogglePlay();
    }
  };

  const progressPercent =
    totalDuration > 0 ? Math.min(100, Math.max(0, (currentTime / totalDuration) * 100)) : 0;

  const sceneProgress = activeScene
    ? Math.min(
        1,
        Math.max(0, (currentTime - activeScene.timeStart) / (activeScene.timeEnd - activeScene.timeStart || 1))
      )
    : 0;

  return (
    <div
      ref={containerRef}
      onMouseMove={() => {
        if (isFullscreen) {
          resetInactivityTimer();
        }
      }}
      onTouchStart={() => {
        if (isFullscreen) {
          resetInactivityTimer();
        }
      }}
      onTouchMove={() => {
        if (isFullscreen) {
          resetInactivityTimer();
        }
      }}
      className={`rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden flex flex-col transition-all duration-300 ${
        isFullscreen
          ? `fixed inset-0 z-50 rounded-none w-screen h-screen bg-black p-0 flex flex-col justify-between ${
              !fsControlsVisible && isPlaying ? 'cursor-none' : 'cursor-default'
            }`
          : 'p-5 sm:p-7'
      }`}
    >
      {/* ─── 1. VIDEO HEADER BAR (Normal Mode) ─── */}
      {!isFullscreen && (
        <div className="flex items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Video className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 dark:text-slate-400 uppercase">
                  {activeLesson.lessonNumber}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-800">
                  <Film className="w-2.5 h-2.5" /> Source Video
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight uppercase">
                {activeLesson.title}
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* ─── 2. VIDEO DISPLAY SCREEN / INTERACTIVE STAGE ─── */}
      <div
        onMouseEnter={() => setIsHoveringVideo(true)}
        onMouseLeave={() => setIsHoveringVideo(false)}
        className={`w-full overflow-hidden relative flex items-center justify-center select-none ${
          isFullscreen
            ? 'w-full h-full bg-black'
            : 'rounded-2xl bg-slate-950 border border-slate-800/90 aspect-video max-h-[500px] shadow-inner'
        }`}
      >
        {isVideoMode && effectiveVideoSrc ? (
          <div
            className="relative w-full h-full flex items-center justify-center bg-black cursor-pointer group"
            onClick={handleVideoAreaClick}
          >
            <video
              ref={nativeVideoRef}
              src={effectiveVideoSrc}
              onTimeUpdate={handleNativeTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => {
                setIsPlaying(false);
                if (onLessonComplete) onLessonComplete(activeLesson.id);
              }}
              playsInline
              controls={false}
              className="w-full h-full object-cover object-center bg-black pointer-events-none"
            />

            {/* Glowing Big Center Play Button overlay when paused */}
            {!isPlaying && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleTogglePlay();
                }}
                className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-opacity cursor-pointer z-10"
              >
                <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.7)] transform transition-transform group-hover:scale-110 active:scale-95">
                  <Play className="w-8 h-8 sm:w-9 sm:h-9 fill-current ml-1" />
                </div>
              </div>
            )}

            {/* Floating Top Mini HUD */}
            <div
              className={`absolute top-3 left-3 right-3 sm:top-5 sm:left-6 sm:right-6 flex items-center justify-between transition-opacity duration-200 z-30 ${
                isFullscreen
                  ? fsControlsVisible
                    ? 'opacity-100 pointer-events-auto'
                    : 'opacity-0 pointer-events-none'
                  : isHoveringVideo || !isPlaying
                  ? 'opacity-100 pointer-events-auto'
                  : 'opacity-0 pointer-events-none'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md text-white text-xs font-mono font-bold border border-white/15 shadow-md">
                  {activeLesson.title}
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md text-indigo-200 text-xs font-mono font-bold border border-white/15 shadow-md">
                  {formatTime(currentTime)} / {formatTime(totalDuration)}
                </span>
              </div>

              {isFullscreen && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    exitFullscreen();
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md font-sans text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg active:scale-95 transition-all"
                  title="Exit Fullscreen (Esc or F)"
                  aria-label="Exit Fullscreen"
                >
                  <X className="w-4 h-4" />
                  <span className="hidden sm:inline">Exit Fullscreen</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* ─── HIGH-FIDELITY ANIMATED EDUCATIONAL ENGINE ─── */
          <div
            onClick={handleVideoAreaClick}
            className="w-full h-full relative overflow-hidden bg-radial from-slate-900 via-slate-950 to-black flex flex-col justify-between p-4 sm:p-6 text-slate-100 cursor-pointer"
          >
            {/* Background grid matrix effect */}
            <div
              className="absolute inset-0 opacity-[0.07] pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(circle, #6366f1 1px, transparent 1px)`,
                backgroundSize: '24px 24px',
              }}
            />

            {/* Top Scene HUD Header */}
            <div
              className={`relative z-30 flex items-center justify-between gap-2 transition-opacity duration-200 ${
                isFullscreen
                  ? fsControlsVisible
                    ? 'opacity-100 pointer-events-auto'
                    : 'opacity-0 pointer-events-none'
                  : 'opacity-100 pointer-events-auto'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 text-[10px] font-mono font-bold uppercase tracking-wider">
                  SCENE {activeScene?.id || 1}/{activeLesson.scenes.length}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border ${
                    activeScene?.badgeColor || ''
                  }`}
                >
                  {activeScene?.badge}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-400 font-semibold px-2 py-0.5 rounded-md bg-black/60 border border-white/10">
                  {formatTime(currentTime)} / {formatTime(totalDuration)}
                </span>
                {isFullscreen && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      exitFullscreen();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md text-xs font-bold flex items-center gap-1 cursor-pointer"
                    title="Exit Fullscreen"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[11px]">Exit</span>
                  </button>
                )}
              </div>
            </div>

            {/* Middle Stage: Dynamic Visual Renderers based on Lesson & Scene */}
            <div className="relative z-10 flex-1 flex items-center justify-center py-2 min-h-0">
              {/* ─── LESSON 01 VISUALIZERS: STACK DATA STRUCTURE ─── */}
              {activeLesson.id === 1 && (
                <div className="w-full max-w-xl flex flex-col items-center justify-center animate-fadeIn">
                  <div className="flex flex-col items-center gap-2">
                    {/* TOP Indicator Arrow */}
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/50 text-indigo-300 font-mono text-xs font-bold animate-pulse">
                      <span>TOP</span>
                      <ArrowDown className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="text-[10px] text-indigo-400">stack[3]</span>
                    </div>

                    {/* Vertical Stack Frame */}
                    <div className="w-48 sm:w-56 border-2 border-t-0 border-indigo-400/80 rounded-b-2xl p-2 flex flex-col gap-1.5 bg-slate-950/80 shadow-2xl shadow-indigo-950/50">
                      {[
                        { val: 40, label: 'TOP (Index 3)', highlight: true },
                        { val: 30, label: 'Index 2', highlight: false },
                        { val: 20, label: 'Index 1', highlight: false },
                        { val: 10, label: 'BOTTOM (Index 0)', highlight: false },
                      ].map((item, idx) => (
                        <div
                          key={item.val}
                          className={`py-2 px-3 rounded-xl flex items-center justify-between font-mono text-xs sm:text-sm font-bold border transition-all duration-300 ${
                            item.highlight
                              ? 'bg-indigo-600 text-white border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.5)]'
                              : 'bg-slate-900/90 text-slate-200 border-slate-700/80'
                          }`}
                        >
                          <span className="text-[10px] opacity-75 font-mono">[{3 - idx}]</span>
                          <span className="text-sm sm:text-base font-black">{item.val}</span>
                          <span className="text-[9px] uppercase tracking-wider text-indigo-300">
                            {idx === 0 ? 'TOP' : idx === 3 ? 'BASE' : ''}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* BOTTOM Label & LIFO Principle Chips */}
                    <span className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                      BOTTOM (Index 0)
                    </span>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-950/70 border border-indigo-800/80 text-indigo-300 text-xs font-mono font-bold">
                        LIFO: Last In, First Out
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono">
                        Direct Access: TOP Only
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* ─── LESSON 02 VISUALIZERS: STACK OPERATIONS ─── */}
              {activeLesson.id === 2 && (
                <div className="w-full max-w-lg flex flex-col items-center justify-center">
                  <div className="flex items-center gap-6 sm:gap-10">
                    {/* Left Pointer Column */}
                    <div className="flex flex-col items-end justify-end h-44 py-1 text-xs font-mono text-slate-400">
                      <div
                        className={`transition-all duration-300 flex items-center gap-1 font-bold ${
                          activeScene?.type === 'push'
                            ? 'text-emerald-400 translate-y-[-10px]'
                            : activeScene?.type === 'pop'
                            ? 'text-rose-400 translate-y-[20px]'
                            : activeScene?.type === 'peek'
                            ? 'text-amber-300'
                            : 'text-indigo-400'
                        }`}
                      >
                        <span>TOP ➔</span>
                      </div>
                    </div>

                    {/* Stack Cylinder Container */}
                    <div className="w-32 sm:w-36 h-48 border-x-4 border-b-4 border-indigo-500/80 rounded-b-2xl bg-slate-900/90 p-2 flex flex-col-reverse gap-1.5 shadow-2xl relative">
                      <div className="w-full py-2 bg-indigo-950/80 border border-indigo-800/80 rounded-xl text-center font-mono font-bold text-xs sm:text-sm text-slate-300">
                        10 <span className="text-[9px] text-slate-500">[0]</span>
                      </div>

                      <div className="w-full py-2 bg-indigo-900/70 border border-indigo-700/80 rounded-xl text-center font-mono font-bold text-xs sm:text-sm text-slate-200">
                        20 <span className="text-[9px] text-slate-500">[1]</span>
                      </div>

                      <div className="w-full py-2 bg-indigo-800/80 border border-indigo-600/80 rounded-xl text-center font-mono font-bold text-xs sm:text-sm text-slate-100">
                        30 <span className="text-[9px] text-slate-400">[2]</span>
                      </div>

                      {activeScene?.type === 'push' && (
                        <div
                          className="w-full py-2 bg-emerald-600 border border-emerald-400 rounded-xl text-center font-mono font-bold text-xs sm:text-sm text-white shadow-[0_0_18px_rgba(52,211,153,0.6)] transition-all duration-500"
                          style={{
                            transform: `translateY(${(1 - sceneProgress) * -40}px)`,
                            opacity: sceneProgress,
                          }}
                        >
                          40 <span className="text-[9px] text-emerald-200">[3]</span>
                        </div>
                      )}

                      {activeScene?.type === 'peek' && (
                        <div className="w-full py-2 bg-amber-500 border border-amber-300 rounded-xl text-center font-mono font-bold text-xs sm:text-sm text-slate-950 shadow-[0_0_20px_rgba(251,191,36,0.8)] animate-pulse">
                          40 <span className="text-[9px] text-amber-950 font-bold">[PEEKED]</span>
                        </div>
                      )}

                      {activeScene?.type === 'pop' && (
                        <div
                          className="w-full py-2 bg-rose-600 border border-rose-400 rounded-xl text-center font-mono font-bold text-xs sm:text-sm text-white shadow-[0_0_18px_rgba(244,63,94,0.6)] transition-all duration-500"
                          style={{
                            transform: `translateY(${sceneProgress * -50}px)`,
                            opacity: 1 - sceneProgress * 0.7,
                          }}
                        >
                          40 <span className="text-[9px] text-rose-200">[POPPED]</span>
                        </div>
                      )}

                      {activeScene?.type === 'overflow' && (
                        <div className="w-full py-1.5 bg-red-950/80 border border-red-500/80 rounded-xl text-center font-mono font-bold text-[10px] text-red-300 flex items-center justify-center gap-1 animate-bounce">
                          <AlertTriangle className="w-3 h-3" /> FULL
                        </div>
                      )}
                    </div>

                    {/* Right Operation Callout */}
                    <div className="flex flex-col gap-1.5 text-xs font-mono max-w-[130px]">
                      {activeScene?.type === 'push' && (
                        <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-600/70 text-emerald-300">
                          <span className="font-bold block">PUSH(40)</span>
                          <span className="text-[10px] text-emerald-400">Enters at TOP</span>
                        </div>
                      )}
                      {activeScene?.type === 'peek' && (
                        <div className="p-2 rounded-xl bg-amber-950/80 border border-amber-600/70 text-amber-300">
                          <span className="font-bold block">PEEK()</span>
                          <span className="text-[10px] text-amber-400">Reads 40 safely</span>
                        </div>
                      )}
                      {activeScene?.type === 'pop' && (
                        <div className="p-2 rounded-xl bg-rose-950/80 border border-rose-600/70 text-rose-300">
                          <span className="font-bold block">POP()</span>
                          <span className="text-[10px] text-rose-400">Extracts 40 (LIFO)</span>
                        </div>
                      )}
                      {activeScene?.type === 'stack-lifo' && (
                        <div className="p-2 rounded-xl bg-indigo-950/80 border border-indigo-600/70 text-indigo-300">
                          <span className="font-bold block">LIFO ORDER</span>
                          <span className="text-[10px] text-indigo-400">Last In, First Out</span>
                        </div>
                      )}
                      {activeScene?.type === 'overflow' && (
                        <div className="p-2 rounded-xl bg-purple-950/80 border border-purple-600/70 text-purple-300">
                          <span className="font-bold block">O(1) BOUNDS</span>
                          <span className="text-[10px] text-purple-400">Defensive guards</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ─── 3. VIDEO CONTROLS & FLOATING TOOLBAR ─── */}
      <div
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onMouseEnter={() => {
          setIsHoveringControls(true);
          setFsControlsVisible(true);
          if (hideTimerRef.current) {
            clearTimeout(hideTimerRef.current);
            hideTimerRef.current = null;
          }
        }}
        onMouseLeave={() => {
          setIsHoveringControls(false);
          resetInactivityTimer();
        }}
        onFocusCapture={() => setFsControlsVisible(true)}
        className={`w-full transition-all duration-300 ${
          isFullscreen
            ? `absolute bottom-4 left-4 right-4 sm:left-8 sm:right-8 z-30 p-4 sm:p-5 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-white/15 shadow-2xl text-white transition-opacity duration-200 ${
                fsControlsVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              }`
            : 'pt-5 mt-2 space-y-3'
        }`}
      >
        {/* TOP PROGRESS BAR (Draggable Scrubber + Circular Thumb) */}
        <div className="w-full select-none">
          <div
            ref={progressTrackRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="relative w-full h-6 flex items-center cursor-pointer group touch-none"
            role="slider"
            aria-label="Seek Video Timeline"
            aria-valuemin={0}
            aria-valuemax={totalDuration}
            aria-valuenow={currentTime}
          >
            {/* Horizontal Track Background */}
            <div
              className={`w-full h-1.5 sm:h-2 rounded-full transition-all relative overflow-hidden ${
                isFullscreen
                  ? 'bg-white/20 group-hover:h-2.5'
                  : 'bg-slate-200 dark:bg-slate-800 group-hover:h-2.5'
              }`}
            >
              {/* Accent Fill */}
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-[width] duration-75"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Circular Draggable Scrubber Thumb */}
            <div
              className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full border-2 border-indigo-600 dark:border-indigo-400 bg-white shadow-md transition-transform duration-75 pointer-events-none ${
                isDragging ? 'scale-125 ring-4 ring-indigo-500/30' : 'group-hover:scale-110'
              }`}
              style={{ left: `calc(${progressPercent}% - 8px)` }}
            />
          </div>

          {/* TIME DISPLAY (Left: Current, Right: Total) */}
          <div className="flex items-center justify-between font-mono text-xs sm:text-sm font-semibold pt-1">
            <span
              className={
                isFullscreen ? 'text-white font-bold' : 'text-slate-900 dark:text-slate-100 font-bold'
              }
            >
              {formatTime(currentTime)}
            </span>
            <span
              className={
                isFullscreen ? 'text-slate-400 font-medium' : 'text-slate-500 dark:text-slate-400 font-medium'
              }
            >
              {formatTime(totalDuration)}
            </span>
          </div>
        </div>

        {/* CONTROLS TOOLBAR */}
        <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 pt-1">
          {/* Left: Rewind 10s, Pause/Play, Forward 10s */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Rewind 10s */}
            <button
              onClick={() => handleSkipTime(-10)}
              className={`p-2.5 sm:p-3 rounded-2xl font-bold transition-all flex items-center justify-center cursor-pointer active:scale-95 shadow-2xs group ${
                isFullscreen
                  ? 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80'
              }`}
              title="Rewind 10 seconds"
              aria-label="Rewind 10 seconds"
            >
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-rotate-12 transition-transform" />
            </button>

            {/* Central Play/Pause Button */}
            <button
              onClick={handleTogglePlay}
              className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer tracking-wide"
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                  <span>PAUSE</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-0.5" />
                  <span>PLAY</span>
                </>
              )}
            </button>

            {/* Forward 10s */}
            <button
              onClick={() => handleSkipTime(10)}
              className={`p-2.5 sm:p-3 rounded-2xl font-bold transition-all flex items-center justify-center cursor-pointer active:scale-95 shadow-2xs group ${
                isFullscreen
                  ? 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80'
              }`}
              title="Forward 10 seconds"
              aria-label="Forward 10 seconds"
            >
              <RotateCw className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform" />
            </button>
          </div>

          {/* Middle: Playback Speed Selector (0.5x, 1x, 1.5x, 2x) */}
          <div
            className={`flex items-center rounded-2xl p-1 font-mono text-xs ${
              isFullscreen
                ? 'bg-white/10 border border-white/15'
                : 'bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80'
            }`}
          >
            {[0.5, 1, 1.5, 2].map((spd) => (
              <button
                key={spd}
                onClick={() => handleSpeedChange(spd)}
                className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  playbackSpeed === spd
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xs'
                    : isFullscreen
                    ? 'text-slate-300 hover:text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
                aria-label={`Set playback speed to ${spd}x`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Right: Volume Slider & Fullscreen */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Volume Control */}
            <div
              className={`flex items-center gap-2 rounded-2xl px-3 py-2 ${
                isFullscreen
                  ? 'bg-white/10 border border-white/15 text-white'
                  : 'bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-300'
              }`}
            >
              <button
                onClick={handleToggleMute}
                className="hover:text-indigo-500 transition-colors cursor-pointer"
                title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.02}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                aria-label="Volume Slider"
                className="w-16 sm:w-20 h-1.5 rounded-full accent-indigo-600 dark:accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className={`p-2.5 sm:p-3 rounded-2xl font-bold transition-all flex items-center justify-center cursor-pointer active:scale-95 shadow-2xs ${
                isFullscreen
                  ? 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80'
              }`}
              title={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
              aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
