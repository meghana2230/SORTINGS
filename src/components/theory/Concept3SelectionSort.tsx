import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  SlidersHorizontal,
  ArrowRight,
  ArrowLeft,
  Copy,
  Check,
  Play,
  RotateCcw,
  Eye,
  Crosshair,
} from 'lucide-react';
import { soundEffects } from '../../services/sound';
import { AlgorithmAttributes } from './AlgorithmAttributes';

const SELECTION_ADVANTAGES = [
  'Simple and easy to implement',
  'Uses very little extra memory',
  'Performs relatively few swaps',
  'Useful when minimizing writes/swaps is important',
];

const SELECTION_DISADVANTAGES = [
  'O(n²) comparisons even when the array is already sorted',
  'Slow for large datasets',
  'Generally less efficient than insertion sort for small or nearly sorted data',
];

const SELECTION_APPLICATIONS = [
  'Small datasets',
  'Memory-constrained environments',
  'Situations where minimizing swaps is important',
  'Educational demonstrations of selection-based sorting',
];

interface Concept3SelectionSortProps {
  onSeeVisualization: () => void;
  onNavigatePrev: () => void;
  onNavigateNext: () => void;
}

type CodeLanguage = 'c' | 'cpp' | 'java' | 'python';

const SELECTION_CODE_SNIPPETS: Record<CodeLanguage, string> = {
  c: `// Selection Sort in C
#include <stdio.h>

void selectionSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        // Find the index of the minimum element in unsorted portion
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        // Swap found minimum with the first element of unsorted portion
        if (minIdx != i) {
            int temp = arr[i];
            arr[i] = arr[minIdx];
            arr[minIdx] = temp;
        }
    }
}

int main() {
    int arr[] = {5, 3, 8, 2};
    int n = sizeof(arr) / sizeof(arr[0]);
    selectionSort(arr, n);
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    return 0;
}`,
  cpp: `// Selection Sort in C++
#include <iostream>
#include <vector>
#include <utility>

void selectionSort(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; ++i) {
        int minIdx = i;
        for (int j = i + 1; j < n; ++j) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx != i) {
            std::swap(arr[i], arr[minIdx]);
        }
    }
}

int main() {
    std::vector<int> nums = {5, 3, 8, 2};
    selectionSort(nums);
    for (int x : nums) std::cout << x << " ";
    return 0;
}`,
  java: `// Selection Sort in Java
public class SelectionSort {
    public static void selectionSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            int minIdx = i;
            for (int j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIdx]) {
                    minIdx = j;
                }
            }
            if (minIdx != i) {
                int temp = arr[i];
                arr[i] = arr[minIdx];
                arr[minIdx] = temp;
            }
        }
    }

    public static void main(String[] args) {
        int[] arr = {5, 3, 8, 2};
        selectionSort(arr);
        for (int val : arr) System.out.print(val + " ");
    }
}`,
  python: `# Selection Sort in Python
def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        # Find minimum element in unsorted range [i .. n-1]
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        # Swap minimum with first element of unsorted range
        if min_idx != i:
            arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr

if __name__ == "__main__":
    nums = [5, 3, 8, 2]
    print(selection_sort(nums))  # Output: [2, 3, 5, 8]`,
};

interface WalkthroughStep {
  stepNumber: number;
  stageName: string;
  description: string;
  array: number[];
  currentMinIdx: number | null;
  comparingIdx: number | null;
  sortedUpTo: number; // indices 0 .. sortedUpTo - 1 are sorted
  swappingIndices: [number, number] | null;
  actionTaken: string;
}

const SELECTION_STEPS: WalkthroughStep[] = [
  {
    stepNumber: 1,
    stageName: 'Pass 1: Start with unsorted portion',
    description: 'Entire array [5, 3, 8, 2] is unsorted. We set initial minimum candidate to index 0 (value 5).',
    array: [5, 3, 8, 2],
    currentMinIdx: 0,
    comparingIdx: null,
    sortedUpTo: 0,
    swappingIndices: null,
    actionTaken: 'Initial candidate min = 5 at index 0',
  },
  {
    stepNumber: 2,
    stageName: 'Pass 1: Scan unsorted portion for minimum',
    description: 'Compare with 3: 3 < 5 → New minimum is 3! Compare with 8: 8 > 3. Compare with 2: 2 < 3 → Minimum is 2 at index 3!',
    array: [5, 3, 8, 2],
    currentMinIdx: 3,
    comparingIdx: 3,
    sortedUpTo: 0,
    swappingIndices: null,
    actionTaken: 'Found absolute minimum of unsorted portion: 2 (at index 3)',
  },
  {
    stepNumber: 3,
    stageName: 'Pass 1: Swap minimum (2) with first unsorted slot (5)',
    description: 'Swap element 2 with element 5 at index 0. Expand the sorted portion to include index 0.',
    array: [2, 3, 8, 5],
    currentMinIdx: null,
    comparingIdx: null,
    sortedUpTo: 1,
    swappingIndices: [0, 3],
    actionTaken: 'Swapped 2 and 5! [2] is now locked in sorted portion.',
  },
  {
    stepNumber: 4,
    stageName: 'Pass 2: Find minimum in [3, 8, 5]',
    description: 'Unsorted portion is indices 1..3: [3, 8, 5]. Candidate minimum is 3 at index 1. Neither 8 nor 5 is smaller than 3.',
    array: [2, 3, 8, 5],
    currentMinIdx: 1,
    comparingIdx: 1,
    sortedUpTo: 1,
    swappingIndices: null,
    actionTaken: '3 is already in its correct position. No swap needed!',
  },
  {
    stepNumber: 5,
    stageName: 'Pass 2: Expand sorted portion to include 3',
    description: 'Indices 0 and 1 are now permanently sorted: [2, 3].',
    array: [2, 3, 8, 5],
    currentMinIdx: null,
    comparingIdx: null,
    sortedUpTo: 2,
    swappingIndices: null,
    actionTaken: 'Sorted portion is now [2, 3].',
  },
  {
    stepNumber: 6,
    stageName: 'Pass 3: Find minimum in [8, 5]',
    description: 'Unsorted portion is indices 2..3: [8, 5]. Initial min candidate is 8. Comparing with 5 shows 5 < 8 → Minimum is 5 at index 3!',
    array: [2, 3, 8, 5],
    currentMinIdx: 3,
    comparingIdx: 3,
    sortedUpTo: 2,
    swappingIndices: [2, 3],
    actionTaken: 'Swap 5 with 8 → [2, 3, 5, 8]',
  },
  {
    stepNumber: 7,
    stageName: 'Complete: Array is fully sorted',
    description: 'All slots have been selected and locked. Final array: [2, 3, 5, 8]. Exactly 3 passes needed!',
    array: [2, 3, 5, 8],
    currentMinIdx: null,
    comparingIdx: null,
    sortedUpTo: 4,
    swappingIndices: null,
    actionTaken: 'Sorted: [2, 3, 5, 8]',
  },
];

export const Concept3SelectionSort: React.FC<Concept3SelectionSortProps> = ({
  onSeeVisualization,
  onNavigatePrev,
  onNavigateNext,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<CodeLanguage>('c');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);

  const step = SELECTION_STEPS[currentStepIdx];

  const handleCopyCode = () => {
    soundEffects.playClick();
    navigator.clipboard.writeText(SELECTION_CODE_SNIPPETS[selectedLanguage]);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* ─── 1. DEFINITION ─── */}
      <div className="p-5 sm:p-6 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-2xl border border-indigo-200/80 dark:border-indigo-900/60 space-y-2.5">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-100/70 dark:bg-indigo-900/60 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
            Definition
          </span>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Concept 03
          </span>
        </div>
        <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
          Selection Sort repeatedly finds the minimum element from the unsorted portion and places it in its correct position.
        </p>
      </div>

      {/* ─── 2. STEP-BY-STEP EXAMPLE ON [5, 3, 8, 2] ─── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Step-by-Step Selection Process: [5, 3, 8, 2]</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Notice how the minimum element is targeted and swapped into the sorted front:
            </p>
          </div>

          {/* Core Principle Badges */}
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold">
            <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800">
              Find Min
            </span>
            <span className="text-slate-300 dark:text-slate-700">→</span>
            <span className="px-2 py-0.5 rounded bg-gradient-to-r from-blue-600 to-indigo-600 text-white border border-indigo-600">
              Swap to Front
            </span>
            <span className="text-slate-300 dark:text-slate-700">→</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
              Lock & Repeat
            </span>
          </div>
        </div>

        {/* Step Interactive Navigator - Neutral Background */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Step {step.stepNumber} of {SELECTION_STEPS.length}: {step.stageName}
            </span>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setCurrentStepIdx((prev) => Math.max(0, prev - 1));
                }}
                disabled={currentStepIdx === 0}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                title="Previous step"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setCurrentStepIdx((prev) => Math.min(SELECTION_STEPS.length - 1, prev + 1));
                }}
                disabled={currentStepIdx === SELECTION_STEPS.length - 1}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                title="Next step"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setCurrentStepIdx(0);
                }}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-indigo-600 cursor-pointer"
                title="Reset"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {step.description}
          </p>

          {/* Visual Cards Row - Neutral by default, temporary action highlights only */}
          <div className="py-3 flex flex-col items-center">
            <div className="flex items-center gap-3">
              {step.array.map((val, idx) => {
                const isMin = step.currentMinIdx === idx;
                const isSwapping = step.swappingIndices?.includes(idx);

                return (
                  <motion.div
                    key={`${val}-${idx}`}
                    layout
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    className={`w-14 h-18 sm:w-16 sm:h-20 rounded-xl flex flex-col items-center justify-center font-mono font-black shadow-xs relative transition-all ${
                      isMin
                        ? 'bg-indigo-50 dark:bg-indigo-950/70 border-2 border-indigo-400 dark:border-indigo-500 text-indigo-900 dark:text-indigo-100 ring-2 ring-indigo-400/30 scale-105 shadow-md'
                        : isSwapping
                        ? 'bg-indigo-100 dark:bg-indigo-900/60 border-2 border-indigo-500 dark:border-indigo-400 text-indigo-950 dark:text-white ring-2 ring-indigo-500/30 scale-105 shadow-md'
                        : 'bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100'
                    }`}
                  >
                    <span className="text-lg sm:text-xl font-black">{val}</span>
                    <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 mt-0.5">
                      Idx {idx}
                    </span>

                    {/* Temporary Minimum target badge */}
                    {isMin && (
                      <span className="absolute -bottom-2 px-1.5 py-0.2 rounded-full bg-indigo-600 text-white text-[8px] font-bold tracking-wider uppercase flex items-center gap-0.5">
                        <Crosshair className="w-2.5 h-2.5" />
                        <span>Min</span>
                      </span>
                    )}

                    {/* Temporary Swap badge */}
                    {isSwapping && !isMin && (
                      <span className="absolute -bottom-2 px-1.5 py-0.2 rounded-full bg-purple-600 text-white text-[8px] font-bold tracking-wider uppercase">
                        Swap
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Action Feedback Banner */}
            <div className="mt-4 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-400 shrink-0" />
              <span>{step.actionTaken}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 3. SELECTION SORT CODE IMPLEMENTATION (C, C++, Java, Python) ─── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="font-mono text-indigo-600 dark:text-indigo-400">&lt;/&gt;</span>
              <span>Selection Sort Code Implementation</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select a programming language to view the clean, documented source:
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {(['c', 'cpp', 'java', 'python'] as CodeLanguage[]).map((lang) => {
              const labels: Record<CodeLanguage, string> = {
                c: 'C',
                cpp: 'C++',
                java: 'Java',
                python: 'Python',
              };
              const isActive = selectedLanguage === lang;

              return (
                <button
                  key={lang}
                  onClick={() => {
                    soundEffects.playClick();
                    setSelectedLanguage(lang);
                  }}
                  className={`px-3 py-1 text-xs font-mono font-bold rounded-lg transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {labels[lang]}
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs overflow-hidden border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800">
            <span className="text-[11px] text-slate-400 font-mono">
              selection_sort.{selectedLanguage === 'python' ? 'py' : selectedLanguage === 'java' ? 'java' : selectedLanguage === 'cpp' ? 'cpp' : 'c'}
            </span>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-indigo-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          <pre className="p-4 sm:p-5 overflow-x-auto text-xs sm:text-[13px] leading-relaxed text-indigo-200">
            <code>{SELECTION_CODE_SNIPPETS[selectedLanguage]}</code>
          </pre>
        </div>
      </div>

      {/* ─── 4. ADVANTAGES, DISADVANTAGES & APPLICATIONS ─── */}
      <AlgorithmAttributes
        advantages={SELECTION_ADVANTAGES}
        disadvantages={SELECTION_DISADVANTAGES}
        applications={SELECTION_APPLICATIONS}
      />

      {/* ─── 6. PREVIOUS / NEXT NAVIGATION ─── */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <button
          onClick={onNavigatePrev}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous: Bubble Sort</span>
        </button>

        <button
          onClick={onNavigateNext}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/80 dark:border-indigo-800 font-bold text-xs text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 cursor-pointer transition-colors"
        >
          <span>Next: Insertion Sort</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
