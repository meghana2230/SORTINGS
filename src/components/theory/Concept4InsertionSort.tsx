import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Layers,
  ArrowRight,
  ArrowLeft,
  Copy,
  Check,
  Play,
  RotateCcw,
  Eye,
  CreditCard,
  ChevronsRight,
} from 'lucide-react';
import { soundEffects } from '../../services/sound';
import { AlgorithmAttributes } from './AlgorithmAttributes';

const INSERTION_ADVANTAGES = [
  'Simple and easy to implement',
  'Efficient for small datasets',
  'Very effective for nearly sorted data',
  'In-place sorting algorithm',
  'Can process data incrementally as it arrives',
];

const INSERTION_DISADVANTAGES = [
  'O(n²) average and worst-case time complexity',
  'Not suitable for large randomly ordered datasets',
  'May require many shifts when elements are far from their correct positions',
];

const INSERTION_APPLICATIONS = [
  'Small datasets',
  'Nearly sorted datasets',
  'Online sorting where data arrives one element at a time',
  'Maintaining a sorted list as new elements are added',
  'As a component of hybrid sorting algorithms',
];

interface Concept4InsertionSortProps {
  onSeeVisualization: () => void;
  onNavigatePrev: () => void;
  onNavigateNext: () => void;
}

type CodeLanguage = 'c' | 'cpp' | 'java' | 'python';

const INSERTION_CODE_SNIPPETS: Record<CodeLanguage, string> = {
  c: `// Insertion Sort in C
#include <stdio.h>

void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i]; // The element we want to insert
        int j = i - 1;

        // Shift elements of arr[0..i-1] that are greater than key to one position ahead
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j]; // Shift right (NOT swapping!)
            j--;
        }
        // Insert key into its correct sorted location
        arr[j + 1] = key;
    }
}

int main() {
    int arr[] = {5, 3, 8, 2};
    int n = sizeof(arr) / sizeof(arr[0]);
    insertionSort(arr, n);
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    return 0;
}`,
  cpp: `// Insertion Sort in C++
#include <iostream>
#include <vector>

void insertionSort(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = 1; i < n; ++i) {
        int key = arr[i];
        int j = i - 1;

        // Shift elements greater than key to the right
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            --j;
        }
        arr[j + 1] = key;
    }
}

int main() {
    std::vector<int> nums = {5, 3, 8, 2};
    insertionSort(nums);
    for (int x : nums) std::cout << x << " ";
    return 0;
}`,
  java: `// Insertion Sort in Java
public class InsertionSort {
    public static void insertionSort(int[] arr) {
        int n = arr.length;
        for (int i = 1; i < n; i++) {
            int key = arr[i];
            int j = i - 1;

            // Shift elements greater than key to the right
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
        }
    }

    public static void main(String[] args) {
        int[] arr = {5, 3, 8, 2};
        insertionSort(arr);
        for (int val : arr) System.out.print(val + " ");
    }
}`,
  python: `# Insertion Sort in Python
def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1

        # Shift elements greater than key to the right
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr

if __name__ == "__main__":
    nums = [5, 3, 8, 2]
    print(insertion_sort(nums))  # Output: [2, 3, 5, 8]`,
};

interface WalkthroughStep {
  stepNumber: number;
  stageTitle: string;
  description: string;
  array: number[];
  keyElement: number | null;
  keyOriginalIdx: number | null;
  sortedCount: number; // 0..sortedCount-1 are sorted
  shiftedIndices: number[];
  actionTaken: string;
}

const INSERTION_STEPS: WalkthroughStep[] = [
  {
    stepNumber: 1,
    stageTitle: 'Base Case: First element is trivially sorted',
    description: 'Index 0 (value 5) is considered already sorted. Sorted portion: [5]. Unsorted portion: [3, 8, 2].',
    array: [5, 3, 8, 2],
    keyElement: null,
    keyOriginalIdx: null,
    sortedCount: 1,
    shiftedIndices: [],
    actionTaken: 'Sorted portion: [5] | Unsorted: [3, 8, 2]',
  },
  {
    stepNumber: 2,
    stageTitle: 'Pass 1: Pick key = 3 and compare with 5',
    description: 'Pick next element at index 1: key = 3. Compare with 5: 5 > 3, so shift 5 to the right into index 1.',
    array: [5, 5, 8, 2],
    keyElement: 3,
    keyOriginalIdx: 1,
    sortedCount: 1,
    shiftedIndices: [1],
    actionTaken: 'Shifted 5 rightward to open slot for 3.',
  },
  {
    stepNumber: 3,
    stageTitle: 'Pass 1: Insert key = 3 at index 0',
    description: 'We reached the front of the array. Place key 3 into index 0. Sorted portion is now [3, 5].',
    array: [3, 5, 8, 2],
    keyElement: 3,
    keyOriginalIdx: 0,
    sortedCount: 2,
    shiftedIndices: [],
    actionTaken: 'Inserted 3 at index 0 → Sorted portion: [3, 5]',
  },
  {
    stepNumber: 4,
    stageTitle: 'Pass 2: Pick key = 8 and compare with 5',
    description: 'Pick element at index 2: key = 8. Compare with previous element 5: 5 < 8. It is already in correct order! No shifting needed.',
    array: [3, 5, 8, 2],
    keyElement: 8,
    keyOriginalIdx: 2,
    sortedCount: 3,
    shiftedIndices: [],
    actionTaken: '8 is greater than 5 → Instant O(1) insertion! Sorted: [3, 5, 8]',
  },
  {
    stepNumber: 5,
    stageTitle: 'Pass 3: Pick key = 2 and compare with 8, 5, 3',
    description: 'Pick last element: key = 2. 8 > 2 (shift 8 right). 5 > 2 (shift 5 right). 3 > 2 (shift 3 right).',
    array: [3, 3, 5, 8],
    keyElement: 2,
    keyOriginalIdx: 3,
    sortedCount: 3,
    shiftedIndices: [1, 2, 3],
    actionTaken: 'Shifted elements [3, 5, 8] one position right.',
  },
  {
    stepNumber: 6,
    stageTitle: 'Pass 3: Insert key = 2 at index 0 → Complete!',
    description: 'Slot 0 is open. Insert key = 2. Entire array is now sorted: [2, 3, 5, 8].',
    array: [2, 3, 5, 8],
    keyElement: null,
    keyOriginalIdx: null,
    sortedCount: 4,
    shiftedIndices: [],
    actionTaken: 'Inserted 2 at index 0 → Array fully sorted: [2, 3, 5, 8]',
  },
];

export const Concept4InsertionSort: React.FC<Concept4InsertionSortProps> = ({
  onSeeVisualization,
  onNavigatePrev,
  onNavigateNext,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<CodeLanguage>('c');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);

  const step = INSERTION_STEPS[currentStepIdx];

  const handleCopyCode = () => {
    soundEffects.playClick();
    navigator.clipboard.writeText(INSERTION_CODE_SNIPPETS[selectedLanguage]);
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
            Concept 04
          </span>
        </div>
        <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
          Insertion Sort builds the sorted portion one element at a time by inserting each element into its correct position.
        </p>
      </div>

      {/* ─── 2. PLAYING CARD ANALOGY ─── */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xs sm:text-sm">
          <CreditCard className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Real-World Intuition: The Playing Card Analogy</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          Imagine holding playing cards in your hand. You pick up one card from the table at a time. To insert it into your hand in order, you compare it with the cards already in your hand from right to left, shift the larger cards over to create a gap, and insert the new card into its rightful place.
        </p>
      </div>

      {/* ─── 3. STEP-BY-STEP EXAMPLE ON [5, 3, 8, 2] ─── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Step-by-Step Insertion Process: [5, 3, 8, 2]</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Notice the key idea: <strong>Pick → Compare → Shift → Insert</strong>
            </p>
          </div>

          {/* Key Idea Sequence */}
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold">
            <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800">
              1. Pick
            </span>
            <span className="text-slate-300 dark:text-slate-700">→</span>
            <span className="px-2 py-0.5 rounded bg-indigo-200 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-100 border border-indigo-400 dark:border-indigo-700">
              2. Compare
            </span>
            <span className="text-slate-300 dark:text-slate-700">→</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
              3. Shift
            </span>
            <span className="text-slate-300 dark:text-slate-700">→</span>
            <span className="px-2 py-0.5 rounded bg-gradient-to-r from-blue-600 to-indigo-600 text-white border border-indigo-600">
              4. Insert
            </span>
          </div>
        </div>

        {/* Shifting vs Swapping callout */}
        <div className="p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/70 dark:border-indigo-900/50 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
          <ChevronsRight className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="font-bold text-indigo-950 dark:text-indigo-200">Shifting vs. Swapping:</strong> While Bubble and Selection sort perform full 3-step swaps (using temporary variables), Insertion Sort simply shifts elements one position to the right (<code className="font-mono text-[11px] px-1 py-0.2 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-900 dark:text-indigo-200">arr[j+1] = arr[j]</code>), cutting down memory writes by ~66%!
          </p>
        </div>

        {/* Step Navigator - Neutral Background */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Step {step.stepNumber} of {INSERTION_STEPS.length}: {step.stageTitle}
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
                  setCurrentStepIdx((prev) => Math.min(INSERTION_STEPS.length - 1, prev + 1));
                }}
                disabled={currentStepIdx === INSERTION_STEPS.length - 1}
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

          {/* Cards Display - Neutral by default, temporary action highlights only */}
          <div className="py-3 flex flex-col items-center">
            <div className="flex items-center gap-3">
              {step.array.map((val, idx) => {
                const isShifted = step.shiftedIndices?.includes(idx);
                const isKey = step.keyOriginalIdx === idx;

                return (
                  <motion.div
                    key={`${val}-${idx}`}
                    layout
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    className={`w-14 h-18 sm:w-16 sm:h-20 rounded-xl flex flex-col items-center justify-center font-mono font-black shadow-xs relative transition-all ${
                      isKey
                        ? 'bg-indigo-50 dark:bg-indigo-950/70 border-2 border-indigo-400 dark:border-indigo-500 text-indigo-900 dark:text-indigo-100 ring-2 ring-indigo-400/30 scale-105 shadow-md'
                        : isShifted
                        ? 'bg-indigo-100 dark:bg-indigo-900/60 border-2 border-indigo-500 dark:border-indigo-400 text-indigo-950 dark:text-white ring-2 ring-indigo-500/30 scale-105 shadow-md'
                        : 'bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100'
                    }`}
                  >
                    <span className="text-lg sm:text-xl font-black">{val}</span>
                    <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 mt-0.5">
                      Idx {idx}
                    </span>

                    {/* Temporary Key action badge */}
                    {isKey && (
                      <span className="absolute -bottom-2 px-1.5 py-0.2 rounded-full bg-indigo-600 text-white text-[8px] font-bold tracking-wider uppercase">
                        Key
                      </span>
                    )}

                    {/* Temporary Shifted badge */}
                    {isShifted && !isKey && (
                      <span className="absolute -bottom-2 px-1.5 py-0.2 rounded-full bg-purple-600 text-white text-[8px] font-bold tracking-wider uppercase">
                        Shift
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Key element card floating badge if active */}
            {step.keyElement !== null && (
              <div className="mt-3 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 text-xs font-mono font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                <span>Active Key to Insert:</span>
                <span className="px-2 py-0.5 rounded bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-mono font-black">
                  {step.keyElement}
                </span>
              </div>
            )}

            {/* Action Feedback Banner */}
            <div className="mt-4 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-400 shrink-0" />
              <span>{step.actionTaken}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 4. INSERTION SORT CODE IMPLEMENTATION (C, C++, Java, Python) ─── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="font-mono text-indigo-600 dark:text-indigo-400">&lt;/&gt;</span>
              <span>Insertion Sort Code Implementation</span>
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
              insertion_sort.{selectedLanguage === 'python' ? 'py' : selectedLanguage === 'java' ? 'java' : selectedLanguage === 'cpp' ? 'cpp' : 'c'}
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
            <code>{INSERTION_CODE_SNIPPETS[selectedLanguage]}</code>
          </pre>
        </div>
      </div>

      {/* ─── 5. ADVANTAGES, DISADVANTAGES & APPLICATIONS ─── */}
      <AlgorithmAttributes
        advantages={INSERTION_ADVANTAGES}
        disadvantages={INSERTION_DISADVANTAGES}
        applications={INSERTION_APPLICATIONS}
      />

      {/* ─── 7. PREVIOUS / NEXT NAVIGATION ─── */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <button
          onClick={onNavigatePrev}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous: Selection Sort</span>
        </button>

        <button
          onClick={onNavigateNext}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/80 dark:border-indigo-800 font-bold text-xs text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 cursor-pointer transition-colors"
        >
          <span>Next: Compare Algorithms</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
