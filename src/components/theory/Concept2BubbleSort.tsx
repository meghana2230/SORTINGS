import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowUpDown,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Copy,
  Check,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { soundEffects } from '../../services/sound';
import { AlgorithmAttributes } from './AlgorithmAttributes';

const BUBBLE_ADVANTAGES = [
  'Simple and easy to understand',
  'Easy to implement',
  'Optimized version can detect an already sorted array',
  'Useful for learning and demonstrating sorting',
];

const BUBBLE_DISADVANTAGES = [
  'Slow for large datasets',
  'Requires many comparisons and swaps',
  'Not suitable when high performance is required',
  'Average and worst-case time complexity is O(n²)',
];

const BUBBLE_APPLICATIONS = [
  'Educational sorting demonstrations',
  'Small datasets',
  'Situations where simplicity is more important than performance',
  'Checking whether a list is already sorted using an optimized implementation',
];

interface Concept2BubbleSortProps {
  onSeeVisualization: () => void;
  onNavigatePrev: () => void;
  onNavigateNext: () => void;
}

type CodeLanguage = 'c' | 'cpp' | 'java' | 'python';

const BUBBLE_CODE_SNIPPETS: Record<CodeLanguage, string> = {
  c: `// Bubble Sort in C (Optimized with early-exit flag)
#include <stdio.h>
#include <stdbool.h>

void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        // Last i elements are already in sorted position
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
            }
        }
        // If no two elements were swapped, array is sorted
        if (!swapped) break;
    }
}

int main() {
    int arr[] = {5, 3, 8, 2};
    int n = sizeof(arr) / sizeof(arr[0]);
    bubbleSort(arr, n);
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    return 0;
}`,
  cpp: `// Bubble Sort in C++
#include <iostream>
#include <vector>
#include <utility>

void bubbleSort(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; ++i) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; ++j) {
            if (arr[j] > arr[j + 1]) {
                std::swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}

int main() {
    std::vector<int> nums = {5, 3, 8, 2};
    bubbleSort(nums);
    for (int x : nums) std::cout << x << " ";
    return 0;
}`,
  java: `// Bubble Sort in Java
public class BubbleSort {
    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            boolean swapped = false;
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    swapped = true;
                }
            }
            if (!swapped) break;
        }
    }

    public static void main(String[] args) {
        int[] arr = {5, 3, 8, 2};
        bubbleSort(arr);
        for (int val : arr) System.out.print(val + " ");
    }
}`,
  python: `# Bubble Sort in Python
def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        swapped = False
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr

if __name__ == "__main__":
    nums = [5, 3, 8, 2]
    print(bubble_sort(nums))  # Output: [2, 3, 5, 8]`,
};

interface WalkthroughStep {
  stepNumber: number;
  phase: 'COMPARE' | 'SWAP' | 'MOVE' | 'REPEAT';
  title: string;
  description: string;
  array: number[];
  comparingIndices: [number, number] | null;
  swappedIndices: [number, number] | null;
  sortedIndices: number[];
  actionTaken: string;
}

const BUBBLE_STEPS: WalkthroughStep[] = [
  {
    stepNumber: 1,
    phase: 'COMPARE',
    title: 'Pass 1: Compare adjacent pair (5, 3)',
    description: 'We inspect the first pair at index 0 and 1: elements 5 and 3.',
    array: [5, 3, 8, 2],
    comparingIndices: [0, 1],
    swappedIndices: null,
    sortedIndices: [],
    actionTaken: '5 > 3: Out of order! A swap is required.',
  },
  {
    stepNumber: 2,
    phase: 'SWAP',
    title: 'Pass 1: Swap 5 and 3',
    description: 'Swap 5 and 3 so the smaller element moves to the left.',
    array: [3, 5, 8, 2],
    comparingIndices: null,
    swappedIndices: [0, 1],
    sortedIndices: [],
    actionTaken: 'Swapped 5 and 3 → [3, 5, 8, 2]',
  },
  {
    stepNumber: 3,
    phase: 'MOVE',
    title: 'Pass 1: Move to next pair (5, 8)',
    description: 'Advance our comparison pointer to index 1 and 2: elements 5 and 8.',
    array: [3, 5, 8, 2],
    comparingIndices: [1, 2],
    swappedIndices: null,
    sortedIndices: [],
    actionTaken: '5 < 8: Correct order! No swap needed.',
  },
  {
    stepNumber: 4,
    phase: 'MOVE',
    title: 'Pass 1: Move to next pair (8, 2)',
    description: 'Advance pointer to index 2 and 3: elements 8 and 2.',
    array: [3, 5, 8, 2],
    comparingIndices: [2, 3],
    swappedIndices: null,
    sortedIndices: [],
    actionTaken: '8 > 2: Out of order! Swap 8 and 2.',
  },
  {
    stepNumber: 5,
    phase: 'SWAP',
    title: 'Pass 1: Complete Pass 1 (8 is locked!)',
    description: '8 bubbles to the very end. The largest element is now locked into its final sorted slot!',
    array: [3, 5, 2, 8],
    comparingIndices: null,
    swappedIndices: [2, 3],
    sortedIndices: [3],
    actionTaken: '8 is now locked in sorted portion at index 3.',
  },
  {
    stepNumber: 6,
    phase: 'REPEAT',
    title: 'Pass 2: Compare & Swap (5, 2)',
    description: 'We repeat for the unsorted portion [3, 5, 2]. 3 and 5 are compared (ok). Then 5 and 2 are swapped.',
    array: [3, 2, 5, 8],
    comparingIndices: [1, 2],
    swappedIndices: [1, 2],
    sortedIndices: [2, 3],
    actionTaken: '5 bubbles up and is now locked in sorted portion!',
  },
  {
    stepNumber: 7,
    phase: 'REPEAT',
    title: 'Pass 3: Final pass swaps 3 and 2 → Array Sorted!',
    description: 'Only 3 and 2 remain in the unsorted portion. 3 > 2, so swap them. Array is now fully sorted!',
    array: [2, 3, 5, 8],
    comparingIndices: null,
    swappedIndices: [0, 1],
    sortedIndices: [0, 1, 2, 3],
    actionTaken: 'All elements locked! Sorted: [2, 3, 5, 8]',
  },
];

export const Concept2BubbleSort: React.FC<Concept2BubbleSortProps> = ({
  onSeeVisualization,
  onNavigatePrev,
  onNavigateNext,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<CodeLanguage>('c');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);

  const step = BUBBLE_STEPS[currentStepIdx];

  const handleCopyCode = () => {
    soundEffects.playClick();
    navigator.clipboard.writeText(BUBBLE_CODE_SNIPPETS[selectedLanguage]);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const getPhaseBadge = (phase: WalkthroughStep['phase']) => {
    switch (phase) {
      case 'COMPARE':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800';
      case 'SWAP':
        return 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-indigo-500 shadow-sm';
      case 'MOVE':
        return 'bg-slate-800 text-slate-200 border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
      case 'REPEAT':
        return 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700';
    }
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
            Concept 02
          </span>
        </div>
        <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
          Bubble Sort repeatedly compares adjacent elements and swaps them when they are in the wrong order.
        </p>
      </div>

      {/* ─── 2. STEP-BY-STEP EXAMPLE ON [5, 3, 8, 2] ─── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Step-by-Step Example: [5, 3, 8, 2]</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Notice the 4 visual states: <strong>Compare → Swap → Move → Repeat</strong>
            </p>
          </div>

          {/* Visual State Cycle Badges */}
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold">
            <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800">
              1. Compare
            </span>
            <span className="text-slate-300 dark:text-slate-700">→</span>
            <span className="px-2 py-0.5 rounded bg-gradient-to-r from-blue-600 to-indigo-600 text-white border border-indigo-600">
              2. Swap
            </span>
            <span className="text-slate-300 dark:text-slate-700">→</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
              3. Move
            </span>
            <span className="text-slate-300 dark:text-slate-700">→</span>
            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
              4. Repeat
            </span>
          </div>
        </div>

        {/* Interactive Step Navigator Banner - Neutral Background */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded border ${getPhaseBadge(step.phase)}`}>
                {step.phase}
              </span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Step {step.stepNumber} of {BUBBLE_STEPS.length}: {step.title}
              </span>
            </div>

            {/* Step Controls */}
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
                  setCurrentStepIdx((prev) => Math.min(BUBBLE_STEPS.length - 1, prev + 1));
                }}
                disabled={currentStepIdx === BUBBLE_STEPS.length - 1}
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
                title="Reset steps"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Step description */}
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {step.description}
          </p>

          {/* Cards Display - Neutral by default, temporary action highlights only */}
          <div className="py-3 flex flex-col items-center">
            {/* Cards Row */}
            <div className="flex items-center gap-3">
              {step.array.map((val, idx) => {
                const isComparing = step.comparingIndices?.includes(idx);
                const isSwapped = step.swappedIndices?.includes(idx);

                return (
                  <motion.div
                    key={`${val}-${idx}`}
                    layout
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    className={`w-14 h-18 sm:w-16 sm:h-20 rounded-xl flex flex-col items-center justify-center font-mono font-black shadow-xs relative transition-all ${
                      isComparing
                        ? 'bg-indigo-50 dark:bg-indigo-950/70 border-2 border-indigo-400 dark:border-indigo-500 text-indigo-900 dark:text-indigo-100 scale-105 shadow-md ring-2 ring-indigo-400/30'
                        : isSwapped
                        ? 'bg-indigo-100 dark:bg-indigo-900/60 border-2 border-indigo-500 dark:border-indigo-400 text-indigo-950 dark:text-white scale-105 shadow-md ring-2 ring-indigo-500/30'
                        : 'bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100'
                    }`}
                  >
                    <span className="text-lg sm:text-xl font-black">{val}</span>
                    <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 mt-0.5">
                      Idx {idx}
                    </span>

                    {/* Temporary Action Status Pill */}
                    {isComparing && (
                      <span className="absolute -bottom-2 px-1.5 py-0.2 rounded-full bg-indigo-600 text-white text-[8px] font-bold tracking-wider uppercase">
                        Compare
                      </span>
                    )}
                    {isSwapped && (
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

      {/* ─── 3. BUBBLE SORT CODE IMPLEMENTATION (C, C++, Java, Python) ─── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="font-mono text-indigo-600 dark:text-indigo-400">&lt;/&gt;</span>
              <span>Bubble Sort Code Implementation</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select a programming language to view the clean, documented source:
            </p>
          </div>

          {/* Language Selector: C | C++ | Java | Python */}
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

        {/* Code Block with Copy Option */}
        <div className="relative rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs overflow-hidden border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800">
            <span className="text-[11px] text-slate-400 font-mono">
              bubble_sort.{selectedLanguage === 'python' ? 'py' : selectedLanguage === 'java' ? 'java' : selectedLanguage === 'cpp' ? 'cpp' : 'c'}
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
            <code>{BUBBLE_CODE_SNIPPETS[selectedLanguage]}</code>
          </pre>
        </div>
      </div>

      {/* ─── 4. ADVANTAGES, DISADVANTAGES & APPLICATIONS ─── */}
      <AlgorithmAttributes
        advantages={BUBBLE_ADVANTAGES}
        disadvantages={BUBBLE_DISADVANTAGES}
        applications={BUBBLE_APPLICATIONS}
      />
    </div>
  );
};
