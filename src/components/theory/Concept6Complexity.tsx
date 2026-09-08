import React from 'react';
import { motion } from 'motion/react';
import {
  Clock,
  HardDrive,
  ArrowLeft,
  Sparkles,
  TrendingUp,
  Award,
  CheckCircle2,
} from 'lucide-react';

interface Concept6ComplexityProps {
  onNavigatePrev: () => void;
  onCompleteCurriculum?: () => void;
}

export const Concept6Complexity: React.FC<Concept6ComplexityProps> = ({
  onNavigatePrev,
  onCompleteCurriculum,
}) => {
  return (
    <div className="space-y-8">
      {/* ─── 1. HEADER ─── */}
      <div className="p-5 sm:p-6 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-2xl border border-indigo-200/80 dark:border-indigo-900/60 space-y-2.5">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-100/70 dark:bg-indigo-900/60 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
            Theoretical Foundations
          </span>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Concept 06
          </span>
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
          Time &amp; Space Complexity
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          Complexity analysis lets us objectively evaluate and compare the scalability of algorithms regardless of hardware differences.
        </p>
      </div>

      {/* ─── 2. TIME COMPLEXITY ─── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            Time Complexity
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <strong className="text-slate-900 dark:text-white">Time complexity describes how the amount of work performed by an algorithm grows as the input size increases.</strong>
        </p>

        {/* The 3 Core Growth Rates */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/70 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-base font-black text-indigo-600 dark:text-indigo-400">
                O(1)
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400">Constant</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Constant amount of extra work. Runtime remains flat regardless of whether <span className="font-mono">n = 10</span> or <span className="font-mono">n = 1,000,000</span>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/70 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-base font-black text-indigo-600 dark:text-indigo-400">
                O(n)
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400">Linear</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Work grows roughly with the number of elements. Doubling the input size doubles the total number of operations.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/70 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-base font-black text-slate-800 dark:text-slate-200">
                O(n²)
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400">Quadratic</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Work can grow much faster because the algorithm may repeatedly process pairs of elements across nested loops.
            </p>
          </div>
        </div>

        {/* Sorting Time Complexity Table */}
        <div className="pt-4 space-y-3">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Sorting Time Complexity Table
          </h4>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 font-mono">
                  <th className="p-3">Algorithm</th>
                  <th className="p-3">Best Case</th>
                  <th className="p-3">Average Case</th>
                  <th className="p-3">Worst Case</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono font-medium">
                <tr>
                  <td className="p-3 font-bold text-indigo-600 dark:text-indigo-400">Bubble Sort</td>
                  <td className="p-3 text-indigo-600 dark:text-indigo-400 font-bold">O(n)</td>
                  <td className="p-3 text-slate-700 dark:text-slate-300">O(n²)</td>
                  <td className="p-3 text-slate-700 dark:text-slate-300 font-bold">O(n²)</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-indigo-700 dark:text-indigo-300">Selection Sort</td>
                  <td className="p-3 text-slate-700 dark:text-slate-300 font-bold">O(n²)</td>
                  <td className="p-3 text-slate-700 dark:text-slate-300">O(n²)</td>
                  <td className="p-3 text-slate-700 dark:text-slate-300 font-bold">O(n²)</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-purple-700 dark:text-purple-300">Insertion Sort</td>
                  <td className="p-3 text-indigo-600 dark:text-indigo-400 font-bold">O(n)</td>
                  <td className="p-3 text-slate-700 dark:text-slate-300">O(n²)</td>
                  <td className="p-3 text-slate-700 dark:text-slate-300 font-bold">O(n²)</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Explanation of Best, Average, Worst */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-[11px] text-slate-600 dark:text-slate-300">
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
              <span className="font-bold text-indigo-950 dark:text-indigo-200 block mb-0.5">Best Case:</span>
              Occurs when the input is already in ideal sorted order. Bubble Sort and Insertion Sort exit after a single linear O(n) scan.
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
              <span className="font-bold text-indigo-950 dark:text-indigo-200 block mb-0.5">Average Case:</span>
              Occurs on random permutations of input data. All three algorithms require quadratic O(n²) operations on average.
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
              <span className="font-bold text-indigo-950 dark:text-indigo-200 block mb-0.5">Worst Case:</span>
              Occurs when input is reversed (e.g. descending order). Every element must be compared and moved the maximum distance.
            </div>
          </div>
        </div>
      </div>

      {/* ─── 3. SPACE COMPLEXITY ─── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <HardDrive className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            Space Complexity
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <strong className="text-slate-900 dark:text-white">Space complexity describes how much additional memory an algorithm needs while running.</strong>
        </p>

        {/* Space Complexity Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/60 text-center space-y-1">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Bubble Sort</span>
            <div className="font-mono text-xl font-black text-indigo-600 dark:text-indigo-400">O(1)</div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Auxiliary Space</span>
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/60 text-center space-y-1">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Selection Sort</span>
            <div className="font-mono text-xl font-black text-indigo-600 dark:text-indigo-400">O(1)</div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Auxiliary Space</span>
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/60 text-center space-y-1">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Insertion Sort</span>
            <div className="font-mono text-xl font-black text-indigo-600 dark:text-indigo-400">O(1)</div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Auxiliary Space</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-1">
          <span className="font-bold text-slate-900 dark:text-white block">
            What does O(1) auxiliary space mean?
          </span>
          <p>
            An <strong className="text-slate-800 dark:text-slate-200 font-mono">O(1) auxiliary space</strong> complexity means the algorithms require only a constant amount of additional memory apart from the input. They operate <em>in-place</em> by rearranging the elements within the existing array, only using a few scalar variables for loop counters and temporary swap holders.
          </p>
        </div>
      </div>

      {/* ─── 4. CURRICULUM MASTERY REWARD CALLOUT ─── */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
          <Award className="w-6 h-6 text-white" />
        </div>
        <div className="space-y-0.5">
          <h4 className="text-sm font-bold">Curriculum Complete!</h4>
          <p className="text-xs text-indigo-100 leading-relaxed">
            You have finished all 6 foundational concepts: What is Sorting, Bubble Sort, Selection Sort, Insertion Sort, Compare Algorithms, and Complexity.
          </p>
        </div>
      </div>

      {/* ─── 5. PREVIOUS NAVIGATION ─── */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <button
          onClick={onNavigatePrev}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous: Compare the Three Algorithms</span>
        </button>

        <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4" />
          <span>Final Chapter</span>
        </span>
      </div>
    </div>
  );
};
