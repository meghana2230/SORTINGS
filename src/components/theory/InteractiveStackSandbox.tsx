import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, RotateCcw, Shuffle, CheckCircle2, Info, ArrowUpDown } from 'lucide-react';
import { soundEffects } from '../../services/sound';

export interface SortingStep {
  array: number[];
  comparingIndices: [number, number] | null;
  swappingIndices: [number, number] | null;
  sortedIndices: number[];
  description: string;
}

interface InteractiveStackSandboxProps {
  initialItems?: number[];
  capacity?: number;
}

export const InteractiveStackSandbox: React.FC<InteractiveStackSandboxProps> = () => {
  const [array, setArray] = useState<number[]>([45, 12, 85, 32, 89, 22, 60]);
  const [algorithm, setAlgorithm] = useState<'bubble' | 'selection' | 'insertion'>('bubble');
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [steps, setSteps] = useState<SortingStep[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Generate steps for Bubble Sort
  const generateBubbleSteps = (arr: number[]): SortingStep[] => {
    const history: SortingStep[] = [];
    const a = [...arr];
    const n = a.length;
    const sorted: number[] = [];

    history.push({
      array: [...a],
      comparingIndices: null,
      swappingIndices: null,
      sortedIndices: [],
      description: 'Initial unsorted array ready for Bubble Sort.',
    });

    for (let i = 0; i < n - 1; i++) {
      let swapped = false;
      for (let j = 0; j < n - 1 - i; j++) {
        history.push({
          array: [...a],
          comparingIndices: [j, j + 1],
          swappingIndices: null,
          sortedIndices: [...sorted],
          description: `Comparing A[${j}]=${a[j]} and A[${j + 1}]=${a[j + 1]}.`,
        });

        if (a[j] > a[j + 1]) {
          const temp = a[j];
          a[j] = a[j + 1];
          a[j + 1] = temp;
          swapped = true;

          history.push({
            array: [...a],
            comparingIndices: [j, j + 1],
            swappingIndices: [j, j + 1],
            sortedIndices: [...sorted],
            description: `Swapped: ${a[j + 1]} > ${a[j]}, so they exchange places.`,
          });
        }
      }
      sorted.push(n - 1 - i);
      history.push({
        array: [...a],
        comparingIndices: null,
        swappingIndices: null,
        sortedIndices: [...sorted],
        description: `Pass ${i + 1} complete. ${a[n - 1 - i]} is placed in its final sorted position.`,
      });
      if (!swapped) break;
    }

    const allIndices = a.map((_, idx) => idx);
    history.push({
      array: [...a],
      comparingIndices: null,
      swappingIndices: null,
      sortedIndices: allIndices,
      description: '🎉 Array is completely sorted in non-decreasing order!',
    });

    return history;
  };

  // Generate steps for Selection Sort
  const generateSelectionSteps = (arr: number[]): SortingStep[] => {
    const history: SortingStep[] = [];
    const a = [...arr];
    const n = a.length;
    const sorted: number[] = [];

    history.push({
      array: [...a],
      comparingIndices: null,
      swappingIndices: null,
      sortedIndices: [],
      description: 'Initial unsorted array ready for Selection Sort.',
    });

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      for (let j = i + 1; j < n; j++) {
        history.push({
          array: [...a],
          comparingIndices: [minIdx, j],
          swappingIndices: null,
          sortedIndices: [...sorted],
          description: `Scanning: comparing current min A[${minIdx}]=${a[minIdx]} with A[${j}]=${a[j]}.`,
        });
        if (a[j] < a[minIdx]) {
          minIdx = j;
        }
      }

      if (minIdx !== i) {
        const temp = a[i];
        a[i] = a[minIdx];
        a[minIdx] = temp;

        history.push({
          array: [...a],
          comparingIndices: null,
          swappingIndices: [i, minIdx],
          sortedIndices: [...sorted, i],
          description: `Found minimum element ${a[i]} at index ${minIdx}. Swapped into position ${i}.`,
        });
      }
      sorted.push(i);
    }

    const allIndices = a.map((_, idx) => idx);
    history.push({
      array: [...a],
      comparingIndices: null,
      swappingIndices: null,
      sortedIndices: allIndices,
      description: '🎉 Selection Sort complete! Array is fully ordered with minimum swaps.',
    });

    return history;
  };

  // Generate steps for Insertion Sort
  const generateInsertionSteps = (arr: number[]): SortingStep[] => {
    const history: SortingStep[] = [];
    const a = [...arr];
    const n = a.length;
    const sorted: number[] = [0];

    history.push({
      array: [...a],
      comparingIndices: null,
      swappingIndices: null,
      sortedIndices: [0],
      description: 'A[0] is trivially sorted. Starting Insertion Sort from index 1.',
    });

    for (let i = 1; i < n; i++) {
      const key = a[i];
      let j = i - 1;

      history.push({
        array: [...a],
        comparingIndices: [j, i],
        swappingIndices: null,
        sortedIndices: [...sorted],
        description: `Selected Key = ${key} at index ${i}. Finding its insertion slot.`,
      });

      while (j >= 0 && a[j] > key) {
        a[j + 1] = a[j];
        history.push({
          array: [...a],
          comparingIndices: [j, j + 1],
          swappingIndices: [j, j + 1],
          sortedIndices: [...sorted],
          description: `Shifted ${a[j]} right because ${a[j]} > Key (${key}).`,
        });
        j--;
      }
      a[j + 1] = key;
      sorted.push(i);

      history.push({
        array: [...a],
        comparingIndices: null,
        swappingIndices: null,
        sortedIndices: a.slice(0, i + 1).map((_, idx) => idx),
        description: `Inserted Key (${key}) at index ${j + 1}. Prefix A[0..${i}] is now sorted.`,
      });
    }

    history.push({
      array: [...a],
      comparingIndices: null,
      swappingIndices: null,
      sortedIndices: a.map((_, idx) => idx),
      description: '🎉 Insertion Sort complete! Shifted elements into place adaptively.',
    });

    return history;
  };

  // Recompute steps whenever array or algorithm changes
  useEffect(() => {
    let generated: SortingStep[] = [];
    if (algorithm === 'bubble') generated = generateBubbleSteps(array);
    else if (algorithm === 'selection') generated = generateSelectionSteps(array);
    else generated = generateInsertionSteps(array);

    setSteps(generated);
    setCurrentStepIdx(0);
    setIsPlaying(false);
  }, [algorithm, array]);

  // Autoplay ticker
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev < steps.length - 1) {
            soundEffects.playClick();
            return prev + 1;
          } else {
            setIsPlaying(false);
            soundEffects.playSuccess();
            return prev;
          }
        });
      }, 700);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, steps.length]);

  const currentStep = steps[currentStepIdx] || {
    array: array,
    comparingIndices: null,
    swappingIndices: null,
    sortedIndices: [],
    description: 'Ready to sort',
  };

  const handleShuffle = () => {
    soundEffects.playClick();
    setIsPlaying(false);
    const shuffled = [...array].sort(() => Math.random() - 0.5);
    setArray(shuffled);
  };

  const handleReset = () => {
    soundEffects.playClick();
    setIsPlaying(false);
    setCurrentStepIdx(0);
  };

  const handleStepForward = () => {
    if (currentStepIdx < steps.length - 1) {
      soundEffects.playClick();
      setCurrentStepIdx((prev) => prev + 1);
    }
  };

  const maxVal = Math.max(...currentStep.array, 100);

  return (
    <div className="bg-slate-50 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 space-y-5">
      {/* Top Bar: Algorithm Selector & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
            <ArrowUpDown className="w-4 h-4" />
          </span>
          <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
            Algorithm Sandbox:
          </span>
          <div className="flex items-center gap-1 bg-white dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
            {(['bubble', 'selection', 'insertion'] as const).map((algo) => (
              <button
                key={algo}
                onClick={() => {
                  soundEffects.playClick();
                  setAlgorithm(algo);
                }}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg capitalize transition-colors cursor-pointer ${
                  algorithm === algo
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {algo}
              </button>
            ))}
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleShuffle}
            title="Randomize Array"
            className="p-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
          >
            <Shuffle className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            title="Reset to Start"
            className="p-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              soundEffects.playClick();
              setIsPlaying(!isPlaying);
            }}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>
          <button
            onClick={handleStepForward}
            disabled={currentStepIdx >= steps.length - 1}
            title="Step Forward"
            className="p-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Visual Canvas: Array Bars */}
      <div className="h-52 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex items-end justify-center gap-2 sm:gap-4 relative overflow-hidden shadow-inner">
        {currentStep.array.map((val, idx) => {
          const isComparing = currentStep.comparingIndices?.includes(idx);
          const isSwapping = currentStep.swappingIndices?.includes(idx);
          const isSorted = currentStep.sortedIndices?.includes(idx);
          const heightPercent = Math.max(18, Math.round((val / maxVal) * 85));

          let barColor = 'bg-blue-500 dark:bg-blue-600 border-blue-600';
          if (isSwapping) barColor = 'bg-rose-500 border-rose-600 shadow-lg shadow-rose-500/40 animate-pulse';
          else if (isComparing) barColor = 'bg-amber-500 border-amber-600 shadow-md shadow-amber-500/30';
          else if (isSorted) barColor = 'bg-emerald-500 border-emerald-600 shadow-xs';

          return (
            <div key={idx} className="flex flex-col items-center flex-1 max-w-[56px] h-full justify-end">
              <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                {val}
              </span>
              <motion.div
                layout
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className={`w-full rounded-t-lg border-t-2 border-x transition-colors duration-200 ${barColor}`}
                style={{ height: `${heightPercent}%` }}
              />
              <span className="text-[10px] font-mono text-slate-400 mt-1">
                [{idx}]
              </span>
            </div>
          );
        })}
      </div>

      {/* Step Description & Status Tracker */}
      <div className="bg-white dark:bg-slate-800/90 rounded-xl p-3 sm:p-4 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-500 shrink-0" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {currentStep.description}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0 font-mono text-slate-500 dark:text-slate-400 font-bold">
          <span>Step {currentStepIdx + 1} / {steps.length}</span>
        </div>
      </div>

      {/* Color Legend */}
      <div className="flex items-center justify-center gap-4 text-[11px] font-semibold text-slate-600 dark:text-slate-400 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-500" />
          <span>Unsorted</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500" />
          <span>Comparing</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-rose-500" />
          <span>Swapping / Shift</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500" />
          <span>Sorted Position</span>
        </div>
      </div>
    </div>
  );
};
