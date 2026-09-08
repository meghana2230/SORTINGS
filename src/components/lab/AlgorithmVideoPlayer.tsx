import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Film,
  Sparkles,
  CheckCircle2,
  Upload,
  Loader2,
  AlertCircle,
  RefreshCw,
  X,
} from 'lucide-react';
import { VisualizeAlgorithmConfig } from '../../data/visualizeData';
import { cleanVideoTitle } from '../../services/videoStorage';

export interface VideoState {
  file: File | null;
  url: string | null;
  name: string;
  size?: number;
}

interface AlgorithmVideoPlayerProps {
  algorithm: VisualizeAlgorithmConfig;
  videoState: VideoState | undefined;
  isLoading?: boolean;
  onVideoStarted?: () => void;
  onVideoEnded?: () => void;
  onUploadVideo?: (file: File, onProgress: (percent: number) => void) => Promise<void> | void;
}

export const AlgorithmVideoPlayer: React.FC<AlgorithmVideoPlayerProps> = ({
  algorithm,
  videoState,
  isLoading = false,
  onVideoStarted,
  onVideoEnded,
  onUploadVideo,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [videoDimensions, setVideoDimensions] = useState<{ width: number; height: number } | null>(null);
  const [isHoveringControls, setIsHoveringControls] = useState<boolean>(false);
  const [controlsTimeout, setControlsTimeout] = useState<boolean>(false);

  // Upload Progress & State Management
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);
  const [lastSelectedFile, setLastSelectedFile] = useState<File | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hideControlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isDragging, setIsDragging] = useState<boolean>(false);

  const isBubbleSort = algorithm.algorithmId === 'bubble-sort' || algorithm.id === 'bubble';
  const effectiveVideoUrl = videoState?.url || undefined;
  const hasVideo = Boolean(effectiveVideoUrl);

  // Handle uploading and saving video with validation, progress, and error recovery
  const handleProcessUpload = async (file: File) => {
    if (!file) return;
    setLastSelectedFile(file);
    setUploadError(null);
    setUploadSuccessMessage(null);

    // Accept common video formats: MP4, MOV, AVI, WebM, M4V, MKV
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    const validExtensions = ['mp4', 'webm', 'mov', 'avi', 'm4v', 'mkv'];
    const isVideo = file.type.startsWith('video/') || validExtensions.includes(extension);

    if (!isVideo) {
      setUploadError('Invalid format. Please select an MP4, MOV, WebM, or AVI video file.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      if (onUploadVideo) {
        await onUploadVideo(file, (percent) => {
          setUploadProgress(percent);
        });
      }
      setIsUploading(false);
      setUploadProgress(100);
      setUploadSuccessMessage(`Uploaded "${file.name}" successfully!`);
      setTimeout(() => setUploadSuccessMessage(null), 4000);
    } catch (err: unknown) {
      console.warn('Upload info:', err);
      setIsUploading(false);
      const msg = err instanceof Error ? err.message : 'An error occurred while uploading the video. Please try again.';
      setUploadError(msg);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessUpload(file);
    }
    // Clear value so the same file can be re-selected if needed
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessUpload(file);
    }
  };

  // Format seconds to mm:ss
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Reset play state when video URL changes or algorithm switches
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      if (videoRef.current.videoWidth && videoRef.current.videoHeight) {
        setVideoDimensions({
          width: videoRef.current.videoWidth,
          height: videoRef.current.videoHeight,
        });
        setDuration(videoRef.current.duration || 0);
      }
    }
  }, [videoState?.url]);

  // Fullscreen change event listener across browsers
  useEffect(() => {
    const handleFullscreenChange = () => {
      const fsElement =
        document.fullscreenElement ||
        (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement ||
        (document as unknown as { mozFullScreenElement?: Element }).mozFullScreenElement ||
        (document as unknown as { msFullscreenElement?: Element }).msFullscreenElement;
      
      const isNowFullscreen = Boolean(fsElement);
      setIsFullscreen(isNowFullscreen);
      if (isNowFullscreen) {
        document.body.classList.add('video-fullscreen-active');
        document.documentElement.classList.add('video-fullscreen-active');
      } else {
        document.body.classList.remove('video-fullscreen-active');
        document.documentElement.classList.remove('video-fullscreen-active');
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
      document.body.classList.remove('video-fullscreen-active');
      document.documentElement.classList.remove('video-fullscreen-active');
    };
  }, []);

  // Fullscreen toggle: requests native browser fullscreen with viewport-filling fullscreen styling
  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      setIsFullscreen(true);
      document.body.classList.add('video-fullscreen-active');
      document.documentElement.classList.add('video-fullscreen-active');
      try {
        const el = containerRef.current;
        if (el.requestFullscreen) {
          await el.requestFullscreen();
        } else if ((el as unknown as { webkitRequestFullscreen?: () => Promise<void> }).webkitRequestFullscreen) {
          await (el as unknown as { webkitRequestFullscreen: () => Promise<void> }).webkitRequestFullscreen();
        } else if ((el as unknown as { mozRequestFullScreen?: () => Promise<void> }).mozRequestFullScreen) {
          await (el as unknown as { mozRequestFullScreen: () => Promise<void> }).mozRequestFullScreen();
        } else if ((el as unknown as { msRequestFullscreen?: () => Promise<void> }).msRequestFullscreen) {
          await (el as unknown as { msRequestFullscreen: () => Promise<void> }).msRequestFullscreen();
        } else if (videoRef.current && (videoRef.current as unknown as { webkitEnterFullscreen?: () => void }).webkitEnterFullscreen) {
          (videoRef.current as unknown as { webkitEnterFullscreen: () => void }).webkitEnterFullscreen();
        }
      } catch (err) {
        console.warn('Native requestFullscreen encountered an error:', err);
      }
    } else {
      setIsFullscreen(false);
      document.body.classList.remove('video-fullscreen-active');
      document.documentElement.classList.remove('video-fullscreen-active');
      try {
        const fsDoc = document as unknown as {
          exitFullscreen?: () => Promise<void>;
          webkitExitFullscreen?: () => Promise<void>;
          mozCancelFullScreen?: () => Promise<void>;
          msExitFullscreen?: () => Promise<void>;
          fullscreenElement?: Element;
          webkitFullscreenElement?: Element;
          mozFullScreenElement?: Element;
          msFullscreenElement?: Element;
        };
        if (
          document.fullscreenElement ||
          fsDoc.webkitFullscreenElement ||
          fsDoc.mozFullScreenElement ||
          fsDoc.msFullscreenElement
        ) {
          if (fsDoc.exitFullscreen) {
            await fsDoc.exitFullscreen();
          } else if (fsDoc.webkitExitFullscreen) {
            await fsDoc.webkitExitFullscreen();
          } else if (fsDoc.mozCancelFullScreen) {
            await fsDoc.mozCancelFullScreen();
          } else if (fsDoc.msExitFullscreen) {
            await fsDoc.msExitFullscreen();
          }
        }
      } catch {
        // Ignore exit error
      }
    }
  }, [isFullscreen]);

  // Keyboard shortcut listener when watching video
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!hasVideo) return;
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handleSeekRelative(-5);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleSeekRelative(5);
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        toggleMute();
      } else if (e.code === 'KeyF') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.code === 'Escape' && isFullscreen) {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasVideo, isPlaying, isMuted, volume, isFullscreen, toggleFullscreen]);

  // Auto-hide controls in fullscreen or playback after inactivity
  const handleMouseMove = () => {
    setControlsTimeout(false);
    if (hideControlsTimerRef.current) clearTimeout(hideControlsTimerRef.current);
    if (isPlaying) {
      hideControlsTimerRef.current = setTimeout(() => {
        if (!isHoveringControls && isPlaying) {
          setControlsTimeout(true);
        }
      }, 2600);
    }
  };

  // Play / Pause toggle
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused || videoRef.current.ended) {
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          onVideoStarted?.();
        })
        .catch((err) => {
          console.warn('Video play interrupted:', err);
        });
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [onVideoStarted]);

  // Relative seeking
  const handleSeekRelative = (deltaSeconds: number) => {
    if (!videoRef.current) return;
    const newTime = Math.max(0, Math.min(duration || 0, videoRef.current.currentTime + deltaSeconds));
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Scrubber seek handler
  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  // Volume slider change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
    }
    setIsMuted(val === 0);
  };

  // Toggle Mute
  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    videoRef.current.muted = nextMuted;
    if (!nextMuted && volume === 0) {
      setVolume(0.5);
      videoRef.current.volume = 0.5;
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Video Section Card */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className={`relative transition-all duration-200 ${
          isFullscreen
            ? 'fixed inset-0 z-[99999999] w-screen h-screen w-full h-full bg-black flex flex-col justify-center items-center p-0 m-0 border-0 rounded-none overflow-hidden'
            : 'rounded-3xl border bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-lg overflow-hidden'
        }`}
      >
        {/* Header Bar when NOT fullscreen: Clean title with video controls */}
        {!isFullscreen && (
          <div className="px-5 sm:px-7 py-4 sm:py-5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-900/70">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-xs shrink-0">
                <Film className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">
                    {algorithm.videoLabel}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800/80">
                    {algorithm.name}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Interactive visual sorting demonstration and algorithmic walkthrough
                </p>
              </div>
            </div>

            {/* Header Right: Video Title Badge & Upload/Change Action */}
            <div className="flex items-center gap-2 flex-wrap">
              {hasVideo && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 text-xs font-mono">
                  <Film className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span className="truncate max-w-[160px] sm:max-w-[200px]">
                    {cleanVideoTitle(videoState?.name, algorithm.videoLabel)}
                  </span>
                </div>
              )}
              {onUploadVideo && !hasVideo && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                  title="Upload video for this algorithm"
                >
                  <Upload className="w-3.5 h-3.5 stroke-[2.2]" />
                  <span>Upload Video</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Video Player Canvas / Stage: Compact, Responsive, Centered Normal Height */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          style={
            !isFullscreen
              ? {
                  aspectRatio: '16 / 9',
                  maxHeight: '380px',
                }
              : undefined
          }
          className={`relative w-full flex items-center justify-center group overflow-hidden bg-black ${
            isFullscreen ? 'w-full h-full w-screen h-screen flex-1' : 'w-full max-h-[340px] sm:max-h-[380px] aspect-video mx-auto'
          }`}
        >
          {/* Active Drag Overlay */}
          {isDragging && (
            <div className="absolute inset-0 z-50 bg-indigo-950/90 border-2 border-dashed border-indigo-400 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-150">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/30 flex items-center justify-center text-indigo-300 mb-3 shadow-lg">
                <Upload className="w-7 h-7 stroke-[2.2] animate-bounce" />
              </div>
              <h4 className="text-white font-bold text-base">Drop Video Here</h4>
              <p className="text-indigo-200 text-xs mt-1">
                Release to upload new video for {algorithm.name}
              </p>
            </div>
          )}
          {/* Upload Progress Loading Overlay */}
          {isUploading && (
            <div className="absolute inset-0 z-40 bg-slate-950/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/25 border border-indigo-500/40 flex items-center justify-center text-indigo-400 mb-4 shadow-lg shadow-indigo-500/20">
                <Loader2 className="w-7 h-7 animate-spin stroke-[2.5]" />
              </div>

              <div className="max-w-xs w-full space-y-3">
                <div>
                  <h4 className="text-white font-bold text-sm tracking-wide">
                    Uploading {algorithm.name} Video...
                  </h4>
                  <p className="text-slate-400 text-xs truncate mt-0.5" title={lastSelectedFile?.name}>
                    {lastSelectedFile?.name || 'Processing file...'}
                  </p>
                </div>

                {/* Animated Progress Bar */}
                <div className="w-full bg-slate-800/90 rounded-full h-2.5 overflow-hidden border border-slate-700/80">
                  <div
                    className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-full transition-all duration-300 ease-out rounded-full"
                    style={{ width: `${Math.max(5, uploadProgress)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-0.5">
                  <span>Saving to storage</span>
                  <span className="text-indigo-300 font-bold">{uploadProgress}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Upload Error Overlay with Retry */}
          {uploadError && !isUploading && (
            <div className="absolute inset-0 z-40 bg-slate-950/92 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 mb-3 shadow-lg shadow-rose-500/10">
                <AlertCircle className="w-7 h-7 stroke-[2.2]" />
              </div>

              <div className="max-w-md space-y-2">
                <h4 className="text-white font-bold text-base">Upload Failed</h4>
                <p className="text-rose-300 text-xs leading-relaxed max-w-sm mx-auto">{uploadError}</p>

                <div className="flex items-center justify-center gap-2.5 pt-3 flex-wrap">
                  {lastSelectedFile && (
                    <button
                      type="button"
                      onClick={() => handleProcessUpload(lastSelectedFile)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/30 active:scale-95 transition-all"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Retry Upload</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setUploadError(null);
                      fileInputRef.current?.click();
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer transition-all active:scale-95"
                  >
                    Select Another Video
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadError(null)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
                    title="Dismiss"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Upload Success Banner */}
          {uploadSuccessMessage && !isUploading && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-xl bg-emerald-600/95 text-white text-xs font-bold shadow-xl backdrop-blur-xs flex items-center gap-2 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
              <span className="truncate max-w-[280px]">{uploadSuccessMessage}</span>
            </div>
          )}

          {hasVideo ? (
            <>
              {/* Native HTML5 Video element: Scales proportionally with object-fit: cover to fill container */}
              <video
                ref={videoRef}
                src={effectiveVideoUrl}
                preload="metadata"
                playsInline
                autoPlay={false}
                loop={false}
                onClick={togglePlay}
                onTimeUpdate={() => {
                  if (videoRef.current) {
                    setCurrentTime(videoRef.current.currentTime);
                  }
                }}
                onLoadedMetadata={() => {
                  if (videoRef.current) {
                    setDuration(videoRef.current.duration);
                    videoRef.current.volume = volume;
                    videoRef.current.muted = isMuted;
                  }
                }}
                onPlay={() => {
                  setIsPlaying(true);
                  onVideoStarted?.();
                }}
                onPause={() => setIsPlaying(false)}
                onEnded={() => {
                  setIsPlaying(false);
                  onVideoEnded?.();
                }}
                className="absolute inset-0 w-full h-full object-contain bg-black cursor-pointer block"
                style={{
                  objectFit: 'contain',
                  objectPosition: 'center',
                }}
              />

              {/* Prominent Floating Top-Right Fullscreen Shortcut Button */}
              <button
                type="button"
                onClick={toggleFullscreen}
                className={`absolute top-4 right-4 z-30 p-2 sm:p-2.5 rounded-xl bg-black/60 hover:bg-black/85 backdrop-blur-md border border-white/20 text-white transition-opacity duration-200 cursor-pointer shadow-lg active:scale-95 flex items-center gap-1.5 ${
                  controlsTimeout && isPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
                title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Fullscreen (F)'}
                aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    <span className="hidden sm:inline text-[11px] font-mono font-bold tracking-wider">EXIT</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    <span className="hidden sm:inline text-[11px] font-mono font-bold tracking-wider">FULLSCREEN</span>
                  </>
                )}
              </button>

              {/* Big Center Play / Pause Button Overlay on Hover or Pause */}
              {(!isPlaying || !controlsTimeout) && (
                <button
                  type="button"
                  onClick={togglePlay}
                  className={`absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-900/80 hover:bg-indigo-600 backdrop-blur-md text-white flex items-center justify-center transition-all duration-200 transform shadow-xl cursor-pointer ${
                    isPlaying ? 'opacity-0 group-hover:opacity-90 scale-95' : 'opacity-100 scale-100'
                  }`}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause className="w-7 h-7 sm:w-8 sm:h-8 fill-current" />
                  ) : (
                    <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1" />
                  )}
                </button>
              )}

              {/* Standard Clean Controls Bar */}
              <div
                onMouseEnter={() => setIsHoveringControls(true)}
                onMouseLeave={() => setIsHoveringControls(false)}
                className={`absolute bottom-0 inset-x-0 z-30 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-4 sm:p-5 pt-8 transition-opacity duration-300 ${
                  controlsTimeout && isPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
              >
                {/* Interactive Scrubbing Progress Bar */}
                <div className="relative mb-3 flex items-center group/scrubber">
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    step={0.1}
                    value={currentTime}
                    onChange={handleScrubberChange}
                    className="w-full h-1.5 sm:h-2 bg-white/25 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 focus:outline-hidden transition-all"
                    aria-label="Video Progress Scrubber"
                  />
                  {/* Visual filled track */}
                  <div
                    className="absolute left-0 top-0 h-1.5 sm:h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg pointer-events-none"
                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>

                {/* Bottom Controls Row: Play/Pause, Elapsed/Total Time, Volume, Clearly Visible Fullscreen */}
                <div className="flex items-center justify-between gap-3 text-white">
                  {/* Left: Play/Pause & Time Display */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    <button
                      type="button"
                      onClick={togglePlay}
                      className="p-2 sm:p-2.5 rounded-xl hover:bg-white/15 text-white transition-colors cursor-pointer flex items-center justify-center"
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5 fill-current" />
                      ) : (
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      )}
                    </button>

                    <div className="text-xs font-mono text-slate-300 pl-1 select-none">
                      <span className="text-white font-bold">{formatTime(currentTime)}</span>
                      <span className="mx-1.5 text-slate-500">/</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Right: Volume & Clearly Visible Fullscreen Button */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    {/* Volume Control */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={toggleMute}
                        className="p-2 sm:p-2.5 rounded-xl hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title={isMuted ? 'Unmute' : 'Mute'}
                        aria-label={isMuted ? 'Unmute' : 'Mute'}
                      >
                        {isMuted || volume === 0 ? (
                          <VolumeX className="w-5 h-5 text-rose-400" />
                        ) : (
                          <Volume2 className="w-5 h-5" />
                        )}
                      </button>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.05}
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-14 sm:w-20 h-1 sm:h-1.5 bg-white/25 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        aria-label="Volume Slider"
                      />
                    </div>

                    {/* Clearly Visible Fullscreen Button */}
                    <button
                      type="button"
                      onClick={toggleFullscreen}
                      className="p-2 sm:p-2.5 px-3 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white transition-all cursor-pointer flex items-center gap-1.5 font-semibold text-xs active:scale-95 shadow-xs"
                      title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Enter Fullscreen (F)'}
                      aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                    >
                      {isFullscreen ? (
                        <>
                          <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5 text-white stroke-[2.2]" />
                          <span className="hidden sm:inline text-[11px] font-mono font-bold tracking-wider">EXIT</span>
                        </>
                      ) : (
                        <>
                          <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5 text-white stroke-[2.2]" />
                          <span className="hidden sm:inline text-[11px] font-mono font-bold tracking-wider">FULLSCREEN</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : isLoading ? (
            /* Loading Stored Video State (Persistent recovery) */
            <div className="w-full h-full min-h-[280px] sm:min-h-[340px] max-h-[380px] flex flex-col items-center justify-center text-white gap-3 bg-black">
              <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
              <span className="text-xs text-slate-400 font-medium">Loading {algorithm.name} video...</span>
            </div>
          ) : (
            /* Dedicated Upload Video Option & Dropzone (Shown ONLY when no video has been uploaded) */
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDragging(false);
              }}
              onDrop={handleDrop}
              onClick={() => !isUploading && fileInputRef.current?.click()}
              className={`w-full h-full min-h-[280px] sm:min-h-[340px] max-h-[380px] flex flex-col items-center justify-center text-white gap-4 p-6 text-center cursor-pointer transition-all border-2 border-dashed ${
                isDragging
                  ? 'border-indigo-400 bg-indigo-950/50 shadow-inner'
                  : 'border-slate-800 hover:border-indigo-500/80 bg-slate-950 hover:bg-slate-900/90'
              }`}
            >
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-md group-hover:scale-105 transition-transform">
                <Upload className="w-8 h-8 stroke-[2.2]" />
              </div>

              <div className="max-w-md space-y-1.5">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Upload {algorithm.name} Video
                </h3>
                <p className="text-xs sm:text-sm text-slate-400">
                  Select or drag & drop a video file (MP4, MOV, WebM, or AVI) to visualize this algorithm.
                </p>
              </div>

              <button
                type="button"
                disabled={isUploading}
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="mt-1 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md shadow-indigo-500/25 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Uploading ({uploadProgress}%)...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Upload Video</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Hidden File Input for Video Upload: rendered ONLY when video is not uploaded */}
          {!hasVideo && (
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime,video/x-msvideo,.mp4,.mov,.webm,.avi,.m4v,video/*"
              className="hidden"
              onChange={handleFileChange}
            />
          )}
        </div>

        {/* Bottom Educational / Concept Summary Strip: Shown ONLY when NOT fullscreen */}
        {!isFullscreen && (
          <div className="p-5 sm:p-6 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200/80 dark:border-slate-800">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Time Complexity
                </span>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">
                  {algorithm.timeComplexity}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Space Complexity
                </span>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">
                  {algorithm.spaceComplexity} In-Place
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Algorithm Stability
                </span>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {algorithm.stability}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-800/80 space-y-2">
              <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Key Architectural Principles:
              </span>
              <ul className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {algorithm.keyTakeaways.map((takeaway, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2 bg-white dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
