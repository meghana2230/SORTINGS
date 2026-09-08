import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sliders,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  HardDrive,
  Check,
  RefreshCw,
  Shuffle,
  Info,
} from 'lucide-react';
import { soundEffects } from '../../services/sound';

export type VisualizerAlgorithm = 'bubble' | 'selection' | 'insertion';

export interface SortingVisualizerModalProps {
  isOpen: boolean;
  algorithm: VisualizerAlgorithm;
  onClose: () => void;
  onNavigateToLab?: () => void;
}

interface VisualizerStep {
  array: number[];
  comparingIndices: number[];
  swappingIndices: number[];
  sortedIndices: number[];
  specialIndex?: number;
  keyVal?: number | null;
  pointers: { name: string; index: number; color: 'blue' | 'amber' | 'rose' | 'emerald' | 'purple' }[];
  description: string;
  stageBadge: 'Initial' | 'Comparing' | 'Swapping' | 'Shifting' | 'Inserting' | 'Sorted' | 'Completed';
  activeCodeLine: number;
  comparisonCount: number;
  swapCount: number;
}

const ALGORITHM_CONFIGS: Record<
  VisualizerAlgorithm,
  {
    name: string;
    bestCase: string;
    worstCase: string;
    space: string;
    stable: boolean;
    shortConcept: string;
    pseudocode: string[];
  }
> = {
  bubble: {
    name: 'Bubble Sort',
    bestCase: 'O(n)',
    worstCase: 'O(n²)',
    space: 'O(1)',
    stable: true,
    shortConcept: 'Repeatedly steps through the list, compares adjacent elements, and swaps them if in wrong order.',
    pseudocode: [
      'for i = 0 to n - 1:',
      '    swapped = false',
      '    for j = 0 to n - i - 2:',
      '        if arr[j] > arr[j + 1]:',
      '            swap(arr[j], arr[j + 1])',
      '            swapped = true',
      '    if not swapped: break',
    ],
  },
  selection: {
    name: 'Selection Sort',
    bestCase: 'O(n²)',
    worstCase: 'O(n²)',
    space: 'O(1)',
    stable: false,
    shortConcept: 'Finds the minimum element from the unsorted portion and swaps it with the first unsorted position.',
    pseudocode: [
      'for i = 0 to n - 1:',
      '    min_idx = i',
      '    for j = i + 1 to n - 1:',
      '        if arr[j] < arr[min_idx]:',
      '            min_idx = j',
      '    if min_idx != i: swap(arr[i], arr[min_idx])',
    ],
  },
  insertion: {
    name: 'Insertion Sort',
    bestCase: 'O(n)',
    worstCase: 'O(n²)',
    space: 'O(1)',
    stable: true,
    shortConcept: 'Builds sorted array element-by-element by picking key and shifting larger elements to the right.',
    pseudocode: [
      'for i = 1 to n - 1:',
      '    key = arr[i]',
      '    j = i - 1',
      '    while j >= 0 and arr[j] > key:',
      '        arr[j + 1] = arr[j]  // shift right',
      '        j = j - 1',
      '    arr[j + 1] = key        // insert key',
    ],
  },
};

const PRESET_ARRAYS = [
  { label: 'Default', array: [5, 3, 8, 4, 2, 7, 1, 6] },
  { label: 'Small [5, 3, 8, 2]', array: [5, 3, 8, 2] },
  { label: 'Nearly Sorted', array: [2, 3, 1, 5, 6, 8, 7, 9] },
  { label: 'Reversed (Worst)', array: [9, 8, 7, 6, 5, 4, 3, 2] },
  { label: 'Already Sorted', array: [1, 2, 3, 4, 5, 6, 7, 8] },
];

export const SortingVisualizerModal: React.FC<SortingVisualizerModalProps> = ({
  isOpen,
  algorithm: initialAlgorithm,
  onClose,
  onNavigateToLab,
}) => {
  const [currentAlgo, setCurrentAlgo] = useState<VisualizerAlgorithm>(initialAlgorithm);
  const [baseArray, setBaseArray] = useState<number[]>([5, 3, 8, 4, 2, 7, 1, 6]);
  const [customInput, setCustomInput] = useState<string>('5, 3, 8, 4, 2, 7, 1, 6');
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);

  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 0.5x, 1x, 2x, 3x

  // Sync algorithm when prop changes
  useEffect(() => {
    setCurrentAlgo(initialAlgorithm);
    setCurrentStepIdx(0);
    setIsPlaying(false);
  }, [initialAlgorithm]);

  // Generate trace steps based on current array and algorithm
  const steps = useMemo<VisualizerStep[]>(() => {
    const arr = [...baseArray];
    const n = arr.length;
    const generated: VisualizerStep[] = [];

    let comparisons = 0;
    let swaps = 0;

    if (n <= 1) {
      return [
        {
          array: [...arr],
          comparingIndices: [],
          swappingIndices: [],
          sortedIndices: arr.map((_, i) => i),
          pointers: [],
          description: 'Array is trivially sorted.',
          stageBadge: 'Completed',
          activeCodeLine: 0,
          comparisonCount: 0,
          swapCount: 0,
        },
      ];
    }

    if (currentAlgo === 'bubble') {
      // Step 0: Initial state
      generated.push({
        array: [...arr],
        comparingIndices: [],
        swappingIndices: [],
        sortedIndices: [],
        pointers: [],
        description: 'Initial array state. Ready to begin Bubble Sort.',
        stageBadge: 'Initial',
        activeCodeLine: 0,
        comparisonCount: 0,
        swapCount: 0,
      });

      const sortedIndicesList: number[] = [];

      for (let i = 0; i < n; i++) {
        let swapped = false;

        for (let j = 0; j < n - i - 1; j++) {
          comparisons++;
          // Compare step
          const willSwap = arr[j] > arr[j + 1];

          generated.push({
            array: [...arr],
            comparingIndices: [j, j + 1],
            swappingIndices: [],
            sortedIndices: [...sortedIndicesList],
            pointers: [
              { name: 'j', index: j, color: 'blue' },
              { name: 'j+1', index: j + 1, color: 'amber' },
            ],
            description: `Comparing arr[${j}] (${arr[j]}) and arr[${j + 1}] (${arr[j + 1]}). ${
              willSwap
                ? `${arr[j]} > ${arr[j + 1]} → Needs swap!`
                : `${arr[j]} ≤ ${arr[j + 1]} → Already in order.`
            }`,
            stageBadge: 'Comparing',
            activeCodeLine: 3,
            comparisonCount: comparisons,
            swapCount: swaps,
          });

          if (willSwap) {
            swaps++;
            const temp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = temp;
            swapped = true;

            generated.push({
              array: [...arr],
              comparingIndices: [],
              swappingIndices: [j, j + 1],
              sortedIndices: [...sortedIndicesList],
              pointers: [
                { name: 'swapped', index: j, color: 'rose' },
                { name: 'swapped', index: j + 1, color: 'rose' },
              ],
              description: `Swapped ${arr[j + 1]} and ${arr[j]}. Greater value moved rightward.`,
              stageBadge: 'Swapping',
              activeCodeLine: 4,
              comparisonCount: comparisons,
              swapCount: swaps,
            });
          }
        }

        // Element at n - i - 1 is now locked in sorted place
        sortedIndicesList.push(n - i - 1);
        generated.push({
          array: [...arr],
          comparingIndices: [],
          swappingIndices: [],
          sortedIndices: [...sortedIndicesList],
          pointers: [{ name: 'locked', index: n - i - 1, color: 'emerald' }],
          description: `Pass ${i + 1} complete: Element ${arr[n - i - 1]} locked at sorted position index ${n - i - 1}.`,
          stageBadge: 'Sorted',
          activeCodeLine: 0,
          comparisonCount: comparisons,
          swapCount: swaps,
        });

        if (!swapped) {
          generated.push({
            array: [...arr],
            comparingIndices: [],
            swappingIndices: [],
            sortedIndices: arr.map((_, idx) => idx),
            pointers: [],
            description: 'Early exit triggered! No swaps were needed during this pass; array is fully sorted.',
            stageBadge: 'Completed',
            activeCodeLine: 6,
            comparisonCount: comparisons,
            swapCount: swaps,
          });
          break;
        }
      }

      // Final completed step
      generated.push({
        array: [...arr],
        comparingIndices: [],
        swappingIndices: [],
        sortedIndices: arr.map((_, idx) => idx),
        pointers: [],
        description: `Bubble Sort finished! Total comparisons: ${comparisons}, Total swaps: ${swaps}.`,
        stageBadge: 'Completed',
        activeCodeLine: 0,
        comparisonCount: comparisons,
        swapCount: swaps,
      });
    } else if (currentAlgo === 'selection') {
      // Step 0: Initial state
      generated.push({
        array: [...arr],
        comparingIndices: [],
        swappingIndices: [],
        sortedIndices: [],
        pointers: [],
        description: 'Initial array state. Ready to begin Selection Sort.',
        stageBadge: 'Initial',
        activeCodeLine: 0,
        comparisonCount: 0,
        swapCount: 0,
      });

      const sortedIndicesList: number[] = [];

      for (let i = 0; i < n; i++) {
        let minIdx = i;

        generated.push({
          array: [...arr],
          comparingIndices: [i],
          swappingIndices: [],
          sortedIndices: [...sortedIndicesList],
          specialIndex: minIdx,
          pointers: [
            { name: 'i', index: i, color: 'blue' },
            { name: 'min', index: minIdx, color: 'purple' },
          ],
          description: `Pass ${i + 1}: Starting search for minimum element from index ${i}. Initial min is arr[${i}] = ${arr[i]}.`,
          stageBadge: 'Comparing',
          activeCodeLine: 1,
          comparisonCount: comparisons,
          swapCount: swaps,
        });

        for (let j = i + 1; j < n; j++) {
          comparisons++;
          const isSmaller = arr[j] < arr[minIdx];

          generated.push({
            array: [...arr],
            comparingIndices: [j, minIdx],
            swappingIndices: [],
            sortedIndices: [...sortedIndicesList],
            specialIndex: minIdx,
            pointers: [
              { name: 'j', index: j, color: 'amber' },
              { name: 'min', index: minIdx, color: 'purple' },
            ],
            description: `Comparing arr[${j}] (${arr[j]}) with current min arr[${minIdx}] (${arr[minIdx]}). ${
              isSmaller
                ? `Found new minimum: ${arr[j]} at index ${j}!`
                : `${arr[j]} ≥ ${arr[minIdx]}, keep current min.`
            }`,
            stageBadge: 'Comparing',
            activeCodeLine: 3,
            comparisonCount: comparisons,
            swapCount: swaps,
          });

          if (isSmaller) {
            minIdx = j;
            generated.push({
              array: [...arr],
              comparingIndices: [],
              swappingIndices: [],
              sortedIndices: [...sortedIndicesList],
              specialIndex: minIdx,
              pointers: [
                { name: 'i', index: i, color: 'blue' },
                { name: 'new min', index: minIdx, color: 'purple' },
              ],
              description: `Updated minimum index to ${minIdx} (value: ${arr[minIdx]}).`,
              stageBadge: 'Comparing',
              activeCodeLine: 4,
              comparisonCount: comparisons,
              swapCount: swaps,
            });
          }
        }

        if (minIdx !== i) {
          swaps++;
          const temp = arr[i];
          arr[i] = arr[minIdx];
          arr[minIdx] = temp;

          generated.push({
            array: [...arr],
            comparingIndices: [],
            swappingIndices: [i, minIdx],
            sortedIndices: [...sortedIndicesList],
            pointers: [
              { name: 'swap', index: i, color: 'rose' },
              { name: 'swap', index: minIdx, color: 'rose' },
            ],
            description: `Swapped minimum element ${arr[i]} into slot ${i} with ${arr[minIdx]}.`,
            stageBadge: 'Swapping',
            activeCodeLine: 5,
            comparisonCount: comparisons,
            swapCount: swaps,
          });
        }

        sortedIndicesList.push(i);
        generated.push({
          array: [...arr],
          comparingIndices: [],
          swappingIndices: [],
          sortedIndices: [...sortedIndicesList],
          pointers: [{ name: 'sorted', index: i, color: 'emerald' }],
          description: `Index ${i} (${arr[i]}) is now confirmed in sorted order.`,
          stageBadge: 'Sorted',
          activeCodeLine: 0,
          comparisonCount: comparisons,
          swapCount: swaps,
        });
      }

      generated.push({
        array: [...arr],
        comparingIndices: [],
        swappingIndices: [],
        sortedIndices: arr.map((_, idx) => idx),
        pointers: [],
        description: `Selection Sort completed! Total comparisons: ${comparisons}, Total swaps: ${swaps}.`,
        stageBadge: 'Completed',
        activeCodeLine: 0,
        comparisonCount: comparisons,
        swapCount: swaps,
      });
    } else if (currentAlgo === 'insertion') {
      // Step 0: Initial state
      generated.push({
        array: [...arr],
        comparingIndices: [],
        swappingIndices: [],
        sortedIndices: [0],
        pointers: [{ name: 'sorted', index: 0, color: 'emerald' }],
        description: `Initial state: First element arr[0] (${arr[0]}) is considered already sorted.`,
        stageBadge: 'Initial',
        activeCodeLine: 0,
        comparisonCount: 0,
        swapCount: 0,
      });

      for (let i = 1; i < n; i++) {
        const key = arr[i];
        let j = i - 1;

        generated.push({
          array: [...arr],
          comparingIndices: [i],
          swappingIndices: [],
          sortedIndices: Array.from({ length: i }, (_, k) => k),
          keyVal: key,
          specialIndex: i,
          pointers: [
            { name: 'key', index: i, color: 'purple' },
            { name: 'j', index: j, color: 'blue' },
          ],
          description: `Picked key = ${key} at index ${i}. Will compare with elements in sorted portion (0 to ${j}).`,
          stageBadge: 'Comparing',
          activeCodeLine: 1,
          comparisonCount: comparisons,
          swapCount: swaps,
        });

        while (j >= 0 && arr[j] > key) {
          comparisons++;
          swaps++; // shifting count

          // Shift arr[j] to arr[j+1]
          arr[j + 1] = arr[j];

          generated.push({
            array: [...arr],
            comparingIndices: [j],
            swappingIndices: [j + 1],
            sortedIndices: Array.from({ length: i }, (_, k) => k),
            keyVal: key,
            specialIndex: j + 1,
            pointers: [
              { name: 'shifted', index: j + 1, color: 'rose' },
              { name: 'j', index: j, color: 'blue' },
            ],
            description: `${arr[j]} > ${key}: Shifted element ${arr[j]} rightward to index ${j + 1}.`,
            stageBadge: 'Shifting',
            activeCodeLine: 4,
            comparisonCount: comparisons,
            swapCount: swaps,
          });

          j--;
        }

        if (j >= 0) {
          comparisons++;
        }

        arr[j + 1] = key;

        generated.push({
          array: [...arr],
          comparingIndices: [],
          swappingIndices: [],
          sortedIndices: Array.from({ length: i + 1 }, (_, k) => k),
          keyVal: null,
          specialIndex: j + 1,
          pointers: [{ name: 'inserted', index: j + 1, color: 'emerald' }],
          description: `Inserted key ${key} into its correct sorted location at index ${j + 1}. Sorted portion now: [0..${i}].`,
          stageBadge: 'Inserting',
          activeCodeLine: 6,
          comparisonCount: comparisons,
          swapCount: swaps,
        });
      }

      generated.push({
        array: [...arr],
        comparingIndices: [],
        swappingIndices: [],
        sortedIndices: arr.map((_, idx) => idx),
        pointers: [],
        description: `Insertion Sort completed! Total comparisons: ${comparisons}, Total shifts: ${swaps}.`,
        stageBadge: 'Completed',
        activeCodeLine: 0,
        comparisonCount: comparisons,
        swapCount: swaps,
      });
    }

    return generated;
  }, [baseArray, currentAlgo]);

  // Handle Playback Interval
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      const intervalMs = Math.max(150, 1000 / playbackSpeed);
      timerRef.current = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev < steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, steps.length]);

  const currentStep = steps[currentStepIdx] || steps[0];
  const maxVal = Math.max(...(currentStep?.array || [10]), 1);

  const handleStepForward = () => {
    soundEffects.playClick();
    setIsPlaying(false);
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx((prev) => prev + 1);
    }
  };

  const handleStepBackward = () => {
    soundEffects.playClick();
    setIsPlaying(false);
    if (currentStepIdx > 0) {
      setCurrentStepIdx((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    soundEffects.playClick();
    setIsPlaying(false);
    setCurrentStepIdx(0);
  };

  const handleTogglePlay = () => {
    soundEffects.playClick();
    if (currentStepIdx >= steps.length - 1) {
      setCurrentStepIdx(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleApplyCustomArray = () => {
    soundEffects.playClick();
    try {
      const parsed = customInput
        .split(',')
        .map((x) => parseInt(x.trim(), 10))
        .filter((n) => !isNaN(n));
      if (parsed.length >= 2 && parsed.length <= 16) {
        setBaseArray(parsed);
        setCurrentStepIdx(0);
        setIsPlaying(false);
        setShowCustomInput(false);
      }
    } catch {
      // Keep existing array
    }
  };

  const handleRandomize = () => {
    soundEffects.playClick();
    const len = baseArray.length || 8;
    const randomArr = Array.from({ length: len }, () => Math.floor(Math.random() * 89) + 10);
    setBaseArray(randomArr);
    setCustomInput(randomArr.join(', '));
    setCurrentStepIdx(0);
    setIsPlaying(false);
  };

  if (!isOpen) return null;

  const currentConfig = ALGORITHM_CONFIGS[currentAlgo];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
      >
        {/* ─── MODAL HEADER ─── */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-mono">
                  {currentConfig.name} Visualizer
                </h2>
                <span className="text-[10px] uppercase font-mono font-extrabold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800">
                  Interactive Simulation
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                {currentConfig.shortConcept}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onNavigateToLab && (
              <button
                onClick={() => {
                  soundEffects.playClick();
                  onClose();
                  onNavigateToLab();
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Go to Visualizer Lab"
              >
                <span>Lab View</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={() => {
                soundEffects.playClick();
                onClose();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ─── ALGORITHM SWITCHER TABS & METRICS ─── */}
        <div className="px-4 sm:px-6 py-2.5 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          {/* Algorithm Toggle Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
            {(['bubble', 'selection', 'insertion'] as VisualizerAlgorithm[]).map((algo) => {
              const isActive = currentAlgo === algo;
              return (
                <button
                  key={algo}
                  onClick={() => {
                    soundEffects.playClick();
                    setCurrentAlgo(algo);
                    setCurrentStepIdx(0);
                    setIsPlaying(false);
                  }}
                  className={`px-3 py-1 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {algo === 'bubble' ? 'Bubble' : algo === 'selection' ? 'Selection' : 'Insertion'}
                </button>
              );
            })}
          </div>

          {/* Complexity Badges */}
          <div className="flex items-center gap-2 text-[11px] font-mono">
            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700">
              Best: <strong className="text-slate-800 dark:text-slate-200">{currentConfig.bestCase}</strong>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700">
              Worst: <strong className="text-slate-800 dark:text-slate-200">{currentConfig.worstCase}</strong>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700">
              Space: <strong className="text-indigo-600 dark:text-indigo-400">{currentConfig.space}</strong>
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700">
              Stable: <strong className="text-indigo-600 dark:text-indigo-400">{currentConfig.stable ? 'Yes' : 'No'}</strong>
            </span>
          </div>
        </div>

        {/* ─── MODAL BODY ─── */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Preset Buttons & Array Customizer Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-400 font-mono text-[11px] mr-1">Presets:</span>
              {PRESET_ARRAYS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => {
                    soundEffects.playClick();
                    setBaseArray(preset.array);
                    setCustomInput(preset.array.join(', '));
                    setCurrentStepIdx(0);
                    setIsPlaying(false);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-mono text-[11px] border transition-colors cursor-pointer ${
                    JSON.stringify(baseArray) === JSON.stringify(preset.array)
                      ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700 font-bold'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {preset.label}
                </button>
              ))}

              <button
                onClick={handleRandomize}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg font-mono text-[11px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
                title="Randomize Values"
              >
                <Shuffle className="w-3 h-3" />
                <span>Random</span>
              </button>
            </div>

            <button
              onClick={() => setShowCustomInput(!showCustomInput)}
              className="text-[11px] font-mono font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              {showCustomInput ? 'Hide Custom Input' : 'Custom Input Array'}
            </button>
          </div>

          {/* Collapsible Custom Input Form */}
          {showCustomInput && (
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-2">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="e.g. 15, 3, 99, 42, 8, 23"
                className="flex-1 w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleApplyCustomArray}
                className="w-full sm:w-auto px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-xs"
              >
                Apply Array
              </button>
            </div>
          )}

          {/* ─── LIVE VISUALIZATION BAR CANVAS ─── */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 min-h-[220px] flex flex-col justify-end">
            {/* Color Legend */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-mono font-semibold mb-4 text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-xs bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700" />
                Neutral
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-xs bg-indigo-100 border border-indigo-400" />
                Comparing
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-xs bg-indigo-200 border border-indigo-500" />
                Swapping / Shifted
              </span>
              {currentAlgo === 'selection' && (
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-xs bg-purple-100 border border-purple-500" />
                  Min Candidate
                </span>
              )}
              {currentAlgo === 'insertion' && (
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-xs bg-indigo-100 border border-indigo-500" />
                  Current Key
                </span>
              )}
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-xs bg-slate-200 dark:bg-slate-700 border border-slate-400" />
                Sorted
              </span>
            </div>

            {/* Bars & Pointers Container */}
            <div className="flex items-end justify-center gap-2 sm:gap-3 h-44 sm:h-52 px-2">
              {currentStep.array.map((val, idx) => {
                const isComparing = currentStep.comparingIndices?.includes(idx);
                const isSwapping = currentStep.swappingIndices?.includes(idx);
                const isSorted = currentStep.sortedIndices?.includes(idx);
                const isSpecial = currentStep.specialIndex === idx;

                let barColor = 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200';
                if (isSorted) {
                  barColor = 'bg-slate-100 dark:bg-slate-800/90 border-2 border-slate-400 dark:border-slate-600 text-slate-900 dark:text-slate-100 shadow-2xs';
                } else if (isSwapping) {
                  barColor = 'bg-indigo-100 dark:bg-indigo-900/60 border-2 border-indigo-500 dark:border-indigo-400 text-indigo-950 dark:text-white shadow-2xs';
                } else if (isSpecial) {
                  barColor = 'bg-purple-50 dark:bg-purple-950/70 border-2 border-purple-400 dark:border-purple-500 text-purple-950 dark:text-purple-100 shadow-2xs';
                } else if (isComparing) {
                  barColor = 'bg-indigo-50 dark:bg-indigo-950/70 border-2 border-indigo-400 dark:border-indigo-500 text-indigo-950 dark:text-indigo-100 shadow-2xs';
                }

                const heightPercent = Math.max(16, Math.round((val / maxVal) * 100));

                // Check pointer matching this index
                const matchingPointers = currentStep.pointers.filter((p) => p.index === idx);

                return (
                  <div key={idx} className="flex-1 max-w-[56px] flex flex-col items-center justify-end h-full relative">
                    {/* Pointer Labels Above Bar */}
                    <div className="absolute -top-7 flex flex-col items-center gap-0.5">
                      {matchingPointers.map((p, pIdx) => (
                        <span
                          key={pIdx}
                          className={`text-[9px] font-mono font-black uppercase px-1 py-0.2 rounded ${
                            p.color === 'blue'
                              ? 'bg-indigo-600 text-white'
                              : p.color === 'amber'
                              ? 'bg-indigo-700 text-white'
                              : p.color === 'rose'
                              ? 'bg-slate-900 text-indigo-200 border border-indigo-700'
                              : p.color === 'purple'
                              ? 'bg-purple-700 text-white'
                              : 'bg-indigo-900 text-white border border-indigo-600'
                          }`}
                        >
                          {p.name}
                        </span>
                      ))}
                    </div>

                    {/* The Bar */}
                    <motion.div
                      layout
                      style={{ height: `${heightPercent}%` }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      className={`w-full rounded-t-xl border-t-2 border-x flex flex-col items-center justify-between p-1 transition-colors duration-150 ${barColor}`}
                    >
                      <span className="font-mono font-black text-xs sm:text-sm mt-0.5">
                        {val}
                      </span>
                    </motion.div>

                    {/* Bottom Index Tag */}
                    <div className="w-full text-center py-1 text-[10px] font-mono text-slate-400 dark:text-slate-500 border-t border-slate-200 dark:border-slate-800">
                      [{idx}]
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Active Key indicator for Insertion Sort */}
            {currentAlgo === 'insertion' && currentStep.keyVal !== null && currentStep.keyVal !== undefined && (
              <div className="mt-3 flex items-center justify-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                  Active Key Being Inserted:
                </span>
                <span className="px-3 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-mono font-black text-xs shadow-xs">
                  {currentStep.keyVal}
                </span>
              </div>
            )}
          </div>

          {/* ─── LIVE STEP EXPLANATION & PSEUDOCODE HIGHLIGHTER ─── */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Step Explanation Banner */}
            <div className="md:col-span-7 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                      currentStep.stageBadge === 'Comparing'
                        ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                        : currentStep.stageBadge === 'Swapping' || currentStep.stageBadge === 'Shifting'
                        ? 'bg-slate-900 text-indigo-200 border-indigo-800'
                        : currentStep.stageBadge === 'Sorted' || currentStep.stageBadge === 'Completed'
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                        : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                    }`}
                  >
                    Action: {currentStep.stageBadge}
                  </span>

                  <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                    Step {currentStepIdx + 1} of {steps.length}
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 leading-relaxed min-h-[44px]">
                  {currentStep.description}
                </p>
              </div>

              {/* Step Metrics Counter */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
                <span>
                  Comparisons: <strong className="text-slate-800 dark:text-slate-200">{currentStep.comparisonCount}</strong>
                </span>
                <span>
                  {currentAlgo === 'insertion' ? 'Shifts' : 'Swaps'}:{' '}
                  <strong className="text-slate-800 dark:text-slate-200">{currentStep.swapCount}</strong>
                </span>
                <span>
                  Elements: <strong className="text-slate-800 dark:text-slate-200">{baseArray.length}</strong>
                </span>
              </div>
            </div>

            {/* Pseudocode Highlighter */}
            <div className="md:col-span-5 p-3 rounded-2xl bg-slate-950 text-slate-200 font-mono text-[11px] border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider pb-1 border-b border-slate-800">
                Algorithm Pseudocode
              </div>
              <div className="space-y-0.5 pt-1">
                {currentConfig.pseudocode.map((line, idx) => {
                  const isHighlighted = idx === currentStep.activeCodeLine;
                  return (
                    <div
                      key={idx}
                      className={`px-2 py-0.5 rounded transition-colors whitespace-pre ${
                        isHighlighted
                          ? 'bg-indigo-950 text-indigo-300 border-l-2 border-indigo-400 font-bold'
                          : 'text-slate-400'
                      }`}
                    >
                      {line}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ─── MODAL CONTROLS & TIMELINE FOOTER ─── */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Progress Slider */}
          <div className="w-full sm:w-64 flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-400">0%</span>
            <input
              type="range"
              min={0}
              max={steps.length - 1}
              value={currentStepIdx}
              onChange={(e) => {
                setIsPlaying(false);
                setCurrentStepIdx(parseInt(e.target.value, 10));
              }}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <span className="text-[11px] font-mono text-slate-400">100%</span>
          </div>

          {/* Central Playback Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundEffects.playClick();
                setIsPlaying(false);
                setCurrentStepIdx(0);
              }}
              disabled={currentStepIdx === 0}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              title="First step"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={handleStepBackward}
              disabled={currentStepIdx === 0}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              title="Previous step"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={handleTogglePlay}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold text-xs shadow-md shadow-indigo-500/25 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>{currentStepIdx >= steps.length - 1 ? 'Replay' : 'Play'}</span>
                </>
              )}
            </button>

            <button
              onClick={handleStepForward}
              disabled={currentStepIdx === steps.length - 1}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              title="Next step"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                soundEffects.playClick();
                setIsPlaying(false);
                setCurrentStepIdx(steps.length - 1);
              }}
              disabled={currentStepIdx === steps.length - 1}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              title="Last step"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              onClick={handleReset}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center gap-1 text-xs font-mono">
            <span className="text-slate-400 mr-1 text-[11px]">Speed:</span>
            {[0.5, 1, 2, 3].map((spd) => (
              <button
                key={spd}
                onClick={() => {
                  soundEffects.playClick();
                  setPlaybackSpeed(spd);
                }}
                className={`px-2 py-1 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                  playbackSpeed === spd
                    ? 'bg-gradient-to-tr from-blue-600 to-purple-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
