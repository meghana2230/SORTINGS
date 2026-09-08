import React from 'react';
import { motion } from 'motion/react';
import {
  Scale,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Zap,
  Layers,
  Sparkles,
  SlidersHorizontal,
  ArrowUpDown,
} from 'lucide-react';

interface Concept5CompareAlgorithmsProps {
  onNavigatePrev: () => void;
  onNavigateNext: () => void;
  onSelectConcept: (conceptIndex: number) => void;
}

export const Concept5CompareAlgorithms: React.FC<Concept5CompareAlgorithmsProps> = ({
  onNavigatePrev,
  onNavigateNext,
  onSelectConcept,
}) => {
  return (
    <div className="space-y-8">
      {/* ─── 1. HEADER / DEFINITION ─── */}
      <div className="p-5 sm:p-6 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-2xl border border-indigo-200/80 dark:border-indigo-900/60 space-y-2.5">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-100/70 dark:bg-indigo-900/60 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
            Comprehensive Analysis
          </span>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Concept 05
          </span>
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
          Compare Bubble Sort, Selection Sort &amp; Insertion Sort
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          While all three algorithms are elementary quadratic-time comparisons that run in-place, their internal mechanics produce vastly different execution efficiency across different input patterns.
        </p>
      </div>

      {/* ─── 2. COMPARISON TABLE ─── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Full Comparison Matrix</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Side-by-side breakdown of operational characteristics, Big-O metrics, and memory constraints:
            </p>
          </div>
        </div>

        {/* Responsive Table Container */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs border-collapse font-sans">
            <thead>
              <tr className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800">
                <th className="p-3.5 font-bold font-mono uppercase tracking-wider text-[11px]">Feature</th>
                <th className="p-3.5 font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                  Bubble Sort
                </th>
                <th className="p-3.5 font-bold text-indigo-700 dark:text-indigo-300 font-mono">
                  Selection Sort
                </th>
                <th className="p-3.5 font-bold text-purple-700 dark:text-purple-300 font-mono">
                  Insertion Sort
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {/* Basic Idea */}
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100 font-mono text-[11px]">
                  Basic Idea
                </td>
                <td className="p-3.5 text-slate-700 dark:text-slate-300">
                  Compare adjacent elements and swap
                </td>
                <td className="p-3.5 text-slate-700 dark:text-slate-300">
                  Find minimum and place it
                </td>
                <td className="p-3.5 text-slate-700 dark:text-slate-300">
                  Insert element into correct position
                </td>
              </tr>

              {/* Best Case */}
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100 font-mono text-[11px]">
                  Best Case
                </td>
                <td className="p-3.5">
                  <span className="font-mono font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                    O(n) *
                  </span>
                </td>
                <td className="p-3.5">
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                    O(n²)
                  </span>
                </td>
                <td className="p-3.5">
                  <span className="font-mono font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                    O(n)
                  </span>
                </td>
              </tr>

              {/* Average Case */}
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100 font-mono text-[11px]">
                  Average Case
                </td>
                <td className="p-3.5 font-mono text-slate-700 dark:text-slate-300 font-bold">O(n²)</td>
                <td className="p-3.5 font-mono text-slate-700 dark:text-slate-300 font-bold">O(n²)</td>
                <td className="p-3.5 font-mono text-slate-700 dark:text-slate-300 font-bold">O(n²)</td>
              </tr>

              {/* Worst Case */}
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100 font-mono text-[11px]">
                  Worst Case
                </td>
                <td className="p-3.5 font-mono text-slate-700 dark:text-slate-300 font-bold">O(n²)</td>
                <td className="p-3.5 font-mono text-slate-700 dark:text-slate-300 font-bold">O(n²)</td>
                <td className="p-3.5 font-mono text-slate-700 dark:text-slate-300 font-bold">O(n²)</td>
              </tr>

              {/* Auxiliary Space */}
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100 font-mono text-[11px]">
                  Auxiliary Space
                </td>
                <td className="p-3.5 font-mono text-indigo-600 dark:text-indigo-400 font-bold">O(1)</td>
                <td className="p-3.5 font-mono text-indigo-600 dark:text-indigo-400 font-bold">O(1)</td>
                <td className="p-3.5 font-mono text-indigo-600 dark:text-indigo-400 font-bold">O(1)</td>
              </tr>

              {/* Stable */}
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100 font-mono text-[11px]">
                  Stable
                </td>
                <td className="p-3.5 text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Yes</span>
                </td>
                <td className="p-3.5 text-slate-500 dark:text-slate-400 font-semibold">
                  Generally No (Swaps can jump over equals)
                </td>
                <td className="p-3.5 text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Yes</span>
                </td>
              </tr>

              {/* In-place */}
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100 font-mono text-[11px]">
                  In-place
                </td>
                <td className="p-3.5 text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Yes</span>
                </td>
                <td className="p-3.5 text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Yes</span>
                </td>
                <td className="p-3.5 text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Yes</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
          * Note: Bubble Sort achieves an <strong className="text-slate-700 dark:text-slate-300">O(n)</strong> best case when using the optimized version with an early-exit swapped flag.
        </p>
      </div>

      {/* ─── 3. QUICK DIFFERENCE CARDS ─── */}
      <div className="space-y-3">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
          Quick Difference Summary
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div
            onClick={() => onSelectConcept(1)}
            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all cursor-pointer space-y-2 group"
          >
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Bubble Sort
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
              <strong>Compare neighboring elements.</strong> Swaps adjacent pairs across repeated passes.
            </p>
          </div>

          <div
            onClick={() => onSelectConcept(2)}
            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all cursor-pointer space-y-2 group"
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Selection Sort
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
              <strong>Find the minimum element.</strong> Places the minimum directly into the sorted position.
            </p>
          </div>

          <div
            onClick={() => onSelectConcept(3)}
            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all cursor-pointer space-y-2 group"
          >
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Insertion Sort
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
              <strong>Insert element into correct position.</strong> Shifts elements and inserts into the sorted portion.
            </p>
          </div>
        </div>
      </div>

      {/* ─── 4. WHEN TO USE ─── */}
      <div className="p-5 sm:p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-4">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>When to Use Each Algorithm</span>
        </h3>

        <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <span className="font-bold text-indigo-950 dark:text-indigo-200 block mb-1">
              When to use Insertion Sort:
            </span>
            <p className="leading-relaxed">
              <strong>Insertion Sort is particularly useful when data is already or nearly sorted.</strong> On nearly sorted lists or incoming data streams, it requires almost zero shifts and finishes in near-instant <strong>O(n)</strong> linear time. It is also the algorithm of choice for small subarrays (e.g. within hybrid algorithms like Timsort and IntroSort).
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <span className="font-bold text-indigo-950 dark:text-indigo-200 block mb-1">
              When to use Selection Sort:
            </span>
            <p className="leading-relaxed">
              Selection Sort makes at most <strong>n - 1 total swaps</strong>. It is optimal when memory write operations are extremely costly compared to reads (e.g., writing to EEPROM or Flash memory).
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <span className="font-bold text-indigo-950 dark:text-indigo-200 block mb-1">
              When to use Bubble Sort:
            </span>
            <p className="leading-relaxed">
              Bubble Sort is primarily celebrated for education and introductory computer science curricula due to its conceptual simplicity. With the swapped-flag optimization, it can reliably detect an already-sorted array in a single pass.
            </p>
          </div>
        </div>
      </div>

      {/* ─── 5. PREVIOUS / NEXT NAVIGATION ─── */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <button
          onClick={onNavigatePrev}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous: Insertion Sort</span>
        </button>

        <button
          onClick={onNavigateNext}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/80 dark:border-indigo-800 font-bold text-xs text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 cursor-pointer transition-colors"
        >
          <span>Next: Time &amp; Space Complexity</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
