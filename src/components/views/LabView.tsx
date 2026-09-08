import React, { useState, useRef, useEffect } from 'react';
import {
  Film,
  Play,
  CheckCircle2,
  Upload,
  Loader2,
} from 'lucide-react';
import { UserProgress } from '../../types';
import { soundEffects } from '../../services/sound';
import {
  VISUALIZE_ALGORITHMS,
  VisualizeAlgorithmConfig,
} from '../../data/visualizeData';
import {
  VisualizeAlgoId,
  getAllVideosFromStorage,
  saveVideoToStorage,
  clearAllVideosFromStorage,
  cleanVideoTitle,
} from '../../services/videoStorage';
import {
  AlgorithmVideoPlayer,
  VideoState,
} from '../lab/AlgorithmVideoPlayer';

const cleanAlgoTitles: Record<VisualizeAlgoId, string> = {
  bubble: 'Bubble Sort Video',
  insertion: 'Insertion Sort Video',
  selection: 'Selection Sort Video',
};

// Global cache for videos in Visualize section so they remain available across navigation
let permanentVideosCache: Record<VisualizeAlgoId, VideoState> | null = null;

function getInitialVideos(): Record<VisualizeAlgoId, VideoState> {
  if (permanentVideosCache) {
    return permanentVideosCache;
  }

  return {
    bubble: {
      file: null,
      url: null,
      name: '',
    },
    insertion: {
      file: null,
      url: null,
      name: '',
    },
    selection: {
      file: null,
      url: null,
      name: '',
    },
  };
}

interface LabViewProps {
  progress: UserProgress;
  onUpdateProgress: (updated: UserProgress | ((prev: UserProgress) => UserProgress)) => void;
}

export const LabView: React.FC<LabViewProps> = ({
  progress,
  onUpdateProgress,
}) => {
  // Default Selection: Bubble Sort selected by default
  const [selectedAlgoId, setSelectedAlgoId] = useState<VisualizeAlgoId>('bubble');

  // Video state map for each of the 3 algorithms (bubble, insertion, selection)
  const [videos, setVideos] = useState<Record<VisualizeAlgoId, VideoState>>(getInitialVideos);

  // Track storage loading state on initial mount so we never flash upload dropzone for locked videos
  const [isLoadingStorage, setIsLoadingStorage] = useState<boolean>(() => !permanentVideosCache);

  const playerContainerRef = useRef<HTMLDivElement>(null);
  const bubbleFileInputRef = useRef<HTMLInputElement>(null);
  const [isBubbleUploading, setIsBubbleUploading] = useState<boolean>(false);
  const [bubbleUploadProgress, setBubbleUploadProgress] = useState<number>(0);
  const [bubbleUploadError, setBubbleUploadError] = useState<string | null>(null);

  // Load uploaded videos from permanent IndexedDB storage on mount and cache in memory
  useEffect(() => {
    if (permanentVideosCache) {
      setVideos(permanentVideosCache);
      setIsLoadingStorage(false);
      return;
    }

    let isMounted = true;
    getAllVideosFromStorage()
      .then((records) => {
        if (!isMounted) return;

        const bubbleRecord = records.bubble;
        const insertionRecord = records.insertion;
        const selectionRecord = records.selection;

        const bubbleUrl = (bubbleRecord && (bubbleRecord.isLocked || bubbleRecord.locked) && bubbleRecord.url)
          ? bubbleRecord.url
          : null;
        const insertionUrl = insertionRecord?.url || (insertionRecord?.blob ? URL.createObjectURL(insertionRecord.blob) : null);
        const selectionUrl = selectionRecord?.url || (selectionRecord?.blob ? URL.createObjectURL(selectionRecord.blob) : null);

        const loadedVideos: Record<VisualizeAlgoId, VideoState> = {
          bubble: {
            file: null,
            url: bubbleUrl,
            name: bubbleUrl ? cleanVideoTitle(bubbleRecord?.name, cleanAlgoTitles.bubble) : '',
            size: bubbleRecord?.size,
          },
          insertion: {
            file: null,
            url: insertionUrl,
            name: cleanVideoTitle(insertionRecord?.name, cleanAlgoTitles.insertion),
            size: insertionRecord?.size,
          },
          selection: {
            file: null,
            url: selectionUrl,
            name: cleanVideoTitle(selectionRecord?.name, cleanAlgoTitles.selection),
            size: selectionRecord?.size,
          },
        };

        permanentVideosCache = loadedVideos;
        setVideos(loadedVideos);
        setIsLoadingStorage(false);
      })
      .catch((err) => {
        console.warn('[LabView] Failed to load stored videos:', err);
        if (isMounted) {
          setIsLoadingStorage(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleUploadVideo = async (
    algoId: VisualizeAlgoId,
    file: File,
    onProgress: (percent: number) => void
  ) => {
    // Guard: Once a video is uploaded, it is permanently locked and cannot be replaced or modified
    if (videos[algoId]?.url) {
      console.warn(`[LabView] Video for "${algoId}" is permanently locked.`);
      return;
    }

    // 1. Save video file to permanent backend storage with progress updates
    const record = await saveVideoToStorage(algoId, file, onProgress);

    // 2. Generate video URL for immediate playback
    const url = record.url || (algoId === 'bubble' ? '/api/videos/visualizeVideos/sorting/bubble-sort' : (record.blob ? URL.createObjectURL(record.blob) : `/api/videos/${algoId}`));
    const cleanName = cleanVideoTitle(record.name, cleanAlgoTitles[algoId]);

    const updatedState: VideoState = {
      file: null,
      url,
      name: cleanName,
      size: record.size,
    };

    // 3. Update React state and memory cache
    setVideos((prev) => {
      const next = {
        ...prev,
        [algoId]: updatedState,
      };
      permanentVideosCache = next;
      return next;
    });

    // 4. Play success audio feedback
    soundEffects.playSuccess();
  };

  const handleBubbleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate video file
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    const validExtensions = ['mp4', 'webm', 'mov', 'avi', 'm4v', 'mkv'];
    const isVideo = file.type.startsWith('video/') || validExtensions.includes(extension);
    if (!isVideo) {
      setBubbleUploadError('Please select a valid video file (MP4, MOV, WebM, AVI).');
      e.target.value = '';
      return;
    }

    setIsBubbleUploading(true);
    setBubbleUploadProgress(0);
    setBubbleUploadError(null);
    setSelectedAlgoId('bubble');

    try {
      await handleUploadVideo('bubble', file, (percent) => {
        setBubbleUploadProgress(percent);
      });
      setIsBubbleUploading(false);
      setBubbleUploadProgress(100);
    } catch (err: unknown) {
      console.warn('[LabView] Bubble card upload failed:', err);
      setIsBubbleUploading(false);
      const msg = err instanceof Error ? err.message : 'Upload failed. Please try again.';
      setBubbleUploadError(msg);
    } finally {
      e.target.value = '';
    }
  };

  const completedLabs = Array.isArray(progress?.completedLabs) ? progress.completedLabs : [];

  // Map algorithm id to numerical lab ID for progress/XP tracking
  const getAlgoNumericId = (algoId: VisualizeAlgoId): number => {
    switch (algoId) {
      case 'bubble':
        return 1;
      case 'insertion':
        return 2;
      case 'selection':
        return 3;
    }
  };

  // Handle selecting an algorithm tab/card
  const handleSelectAlgorithm = (algoId: VisualizeAlgoId) => {
    if (selectedAlgoId === algoId) return;
    soundEffects.playClick();
    setSelectedAlgoId(algoId);

    if (playerContainerRef.current) {
      playerContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  // Award progress when user watches/starts video
  const handleVideoStarted = (algoId: VisualizeAlgoId) => {
    const numericId = getAlgoNumericId(algoId);
    if (!completedLabs.includes(numericId)) {
      onUpdateProgress((prev) => ({
        ...prev,
        completedLabs: [...(prev.completedLabs || []), numericId],
        xp: prev.xp + 50,
      }));
    }
  };

  // Currently active algorithm configuration
  const activeAlgorithm: VisualizeAlgorithmConfig =
    VISUALIZE_ALGORITHMS.find((a) => a.id === selectedAlgoId) || VISUALIZE_ALGORITHMS[0];

  return (
    <div className="visualize-container space-y-8 pb-16 max-w-6xl mx-auto">
      {/* ─── VISUALIZE SECTION HEADING ─── */}
      <div className="visualize-heading">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
          VISUALIZE
        </h1>
      </div>

      {/* ─── THREE SORTING ALGORITHM CARDS: BUBBLE SORT, INSERTION SORT, SELECTION SORT ─── */}
      <div className="visualize-cards-grid grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 items-stretch">
        {VISUALIZE_ALGORITHMS.map((algo) => {
          const isSelected = selectedAlgoId === algo.id;
          const numericId = getAlgoNumericId(algo.id);
          const isCompleted = completedLabs.includes(numericId);

          return (
            <div
              key={algo.id}
              onClick={() => handleSelectAlgorithm(algo.id)}
              className={`bg-white dark:bg-slate-900 rounded-3xl border p-5 sm:p-6 shadow-xs flex flex-col justify-between transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-md shadow-indigo-500/10'
                  : 'border-slate-200/90 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="space-y-4">
                {/* Top Row: Algorithm Order & Video Status Badge */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wider border border-slate-200/80 dark:border-slate-700/80">
                      ALGO {algo.orderNumber}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800/80">
                      Video Lesson
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isCompleted && (
                      <span
                        className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-300/60 dark:border-emerald-800"
                        title="Completed (+50 XP)"
                      >
                        <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                      </span>
                    )}
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-xs">
                      {algo.id === 'bubble' && !videos.bubble?.url ? (
                        <Upload className="w-4 h-4 stroke-[2.2]" />
                      ) : (
                        <Film className="w-4 h-4 stroke-[2.2]" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Algorithm Title & Description */}
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight uppercase">
                    {algo.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed font-normal">
                    {algo.description}
                  </p>
                </div>

                {/* Algorithm Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {algo.chips.map((chip, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700/70"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Action Controls: View Tab or Upload Trigger for Bubble Sort */}
              <div className="pt-5 mt-5 border-t border-slate-100 dark:border-slate-800">
                {algo.id === 'bubble' && !videos.bubble?.url ? (
                  <div className="space-y-2">
                    <input
                      ref={bubbleFileInputRef}
                      type="file"
                      id="bubble-sort-video-input"
                      accept="video/mp4,video/webm,video/quicktime,video/x-msvideo,.mp4,.mov,.webm,.avi,.m4v,video/*"
                      className="hidden"
                      onChange={handleBubbleFileInputChange}
                    />
                    <button
                      type="button"
                      id="bubble-sort-upload-btn"
                      disabled={isBubbleUploading}
                      onClick={(e) => {
                        e.stopPropagation();
                        bubbleFileInputRef.current?.click();
                      }}
                      className="w-full py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-500/20 active:scale-[0.99] disabled:opacity-60"
                      title="Upload Bubble Sort Video"
                    >
                      {isBubbleUploading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Uploading ({bubbleUploadProgress}%)...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 stroke-[2.2]" />
                          <span>Upload Bubble Sort Video</span>
                        </>
                      )}
                    </button>
                    {bubbleUploadError && (
                      <p className="text-[11px] text-rose-500 font-medium text-center">
                        {bubbleUploadError}
                      </p>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectAlgorithm(algo.id);
                    }}
                    className={`w-full py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.99] ${
                      isSelected
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                        : 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200/60 dark:border-indigo-800/60'
                    }`}
                  >
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                    <span>
                      {isSelected ? `${algo.name.toUpperCase()} ACTIVE` : `WATCH ${algo.name.toUpperCase()}`}
                    </span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── DIRECTLY BELOW: ACTIVE ALGORITHM VIDEO PLAYER ─── */}
      <div ref={playerContainerRef} className="visualize-player-wrapper pt-2">
        <AlgorithmVideoPlayer
          key={selectedAlgoId}
          algorithm={activeAlgorithm}
          videoState={videos[selectedAlgoId]}
          isLoading={isLoadingStorage}
          onVideoStarted={() => handleVideoStarted(selectedAlgoId)}
          onUploadVideo={
            videos[selectedAlgoId]?.url
              ? undefined
              : (file, onProgress) => handleUploadVideo(selectedAlgoId, file, onProgress)
          }
        />
      </div>
    </div>
  );
};
