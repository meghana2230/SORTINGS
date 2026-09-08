import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowUpDown,
  ArrowRight,
  Sparkles,
  SlidersHorizontal,
  Layers,
  Search,
  Database,
  Cpu,
  CheckCircle2,
} from 'lucide-react';

interface Concept1WhatIsSortingProps {
  onSelectConcept: (conceptIndex: number) => void;
}

export const Concept1WhatIsSorting: React.FC<Concept1WhatIsSortingProps> = ({
  onSelectConcept,
}) => {
  const [activeTab, setActiveTab] = useState<'both' | 'before' | 'after'>('both');

  const unsortedArray = [5, 2, 8, 1, 3];
  const sortedArray = [1, 2, 3, 5, 8];

  return (
    <div className="space-y-8">
      {/* ─── 1. SORTING DEFINITION ─── */}
      <div className="p-5 sm:p-6 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-2xl border border-indigo-200/80 dark:border-indigo-900/60 space-y-2.5">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-100/70 dark:bg-indigo-900/60 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
            Definition
          </span>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Core Concept
          </span>
        </div>
        <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
          Sorting is the process of arranging a collection of data in a specific order so that it becomes easier to search, organize, and process.
        </p>
      </div>

      {/* ─── 2. SIMPLE EXAMPLE: BEFORE & AFTER ─── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Simple Example</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Visualizing unordered input transforming into an ordered sequence:
            </p>
          </div>

          {/* Quick visual toggle */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('both')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'both'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Side-by-Side
            </button>
            <button
              onClick={() => setActiveTab('before')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'before'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Before
            </button>
            <button
              onClick={() => setActiveTab('after')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'after'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              After
            </button>
          </div>
        </div>

        {/* Before / After Arrays */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 sm:gap-6 py-2">
          {/* Before Box */}
          {(activeTab === 'both' || activeTab === 'before') && (
            <div className="w-full md:w-auto flex-1 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 flex flex-col items-center">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono uppercase tracking-wider mb-2">
                Before Sorting
              </span>
              <div className="flex items-center gap-2">
                {unsortedArray.map((val, idx) => (
                  <motion.div
                    key={`unsorted-${idx}`}
                    whileHover={{ scale: 1.05 }}
                    className="w-10 h-12 rounded-lg bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center font-mono font-black text-slate-800 dark:text-slate-100 shadow-xs"
                  >
                    {val}
                  </motion.div>
                ))}
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-2">
                [5, 2, 8, 1, 3] • Unordered
              </span>
            </div>
          )}

          {/* Connecting Arrow */}
          {activeTab === 'both' && (
            <div className="shrink-0 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-950/80 flex items-center justify-center shadow-xs">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          )}

          {/* After Box - Neutral cards and background */}
          {(activeTab === 'both' || activeTab === 'after') && (
            <div className="w-full md:w-auto flex-1 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 flex flex-col items-center">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono uppercase tracking-wider mb-2">
                After Sorting
              </span>
              <div className="flex items-center gap-2">
                {sortedArray.map((val, idx) => (
                  <motion.div
                    key={`sorted-${idx}`}
                    whileHover={{ scale: 1.05 }}
                    className="w-10 h-12 rounded-lg bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center font-mono font-black text-slate-800 dark:text-slate-100 shadow-xs"
                  >
                    {val}
                  </motion.div>
                ))}
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-2">
                [1, 2, 3, 5, 8] • Ascending Order
              </span>
            </div>
          )}
        </div>

        {/* Why sorting is useful in computer science */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 space-y-2">
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Why Sorting is Crucial in Computer Science</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/60 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-1">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Binary Search</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Searching an unsorted list takes linear <strong className="font-semibold">O(n)</strong> time. On a sorted array, Binary Search finds any item in rapid <strong className="font-semibold text-indigo-600 dark:text-indigo-400">O(log n)</strong> time.
              </p>
            </div>

            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/60 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-1">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Databases &amp; Joins</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Database query engines use sorting to accelerate <code className="font-mono text-[10px] px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800">ORDER BY</code> clauses, detect duplicates, and merge large datasets.
              </p>
            </div>

            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/60 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-1">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Human Readability</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Users expect alphabetical contact lists, numerical price sorting, and chronological feeds in every modern application.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 3. TYPES OF SORTING (EXACTLY 3 CARDS: BUBBLE, SELECTION, INSERTION) ─── */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            Types of Sorting
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Click any algorithm card below to explore its step-by-step interactive lesson:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Bubble Sort */}
          <motion.div
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            onClick={() => onSelectConcept(1)} // Concept 2 (0-indexed 1)
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200/60 dark:border-indigo-900/50 shadow-2xs group-hover:scale-105 transition-transform">
                  <ArrowUpDown className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span className="text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/70 px-2 py-0.5 rounded">
                  Concept 02
                </span>
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  Bubble Sort
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed font-normal">
                  Bubble Sort repeatedly compares adjacent elements and swaps them when they are in the wrong order.
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <div className="text-[11px] font-mono font-semibold text-slate-400 dark:text-slate-500">
                Example:
              </div>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                [5, 3, 8, 2] → [3, 5, 8, 2] → ... → [2, 3, 5, 8]
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 pt-1 group-hover:translate-x-1 transition-transform">
                <span>Explore Bubble Sort</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </motion.div>

          {/* Card 2: Selection Sort */}
          <motion.div
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            onClick={() => onSelectConcept(2)} // Concept 3 (0-indexed 2)
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200/60 dark:border-indigo-900/50 shadow-2xs group-hover:scale-105 transition-transform">
                  <SlidersHorizontal className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span className="text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/70 px-2 py-0.5 rounded">
                  Concept 03
                </span>
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  Selection Sort
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed font-normal">
                  Selection Sort repeatedly finds the minimum element from the unsorted portion and places it in its correct position.
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <div className="text-[11px] font-mono font-semibold text-slate-400 dark:text-slate-500">
                Example:
              </div>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                [5, 3, 8, 2] → [2, 3, 8, 5] → ... → [2, 3, 5, 8]
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 pt-1 group-hover:translate-x-1 transition-transform">
                <span>Explore Selection Sort</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </motion.div>

          {/* Card 3: Insertion Sort */}
          <motion.div
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            onClick={() => onSelectConcept(3)} // Concept 4 (0-indexed 3)
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200/60 dark:border-indigo-900/50 shadow-2xs group-hover:scale-105 transition-transform">
                  <Layers className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span className="text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/70 px-2 py-0.5 rounded">
                  Concept 04
                </span>
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  Insertion Sort
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed font-normal">
                  Insertion Sort builds the sorted portion one element at a time by inserting each element into its correct position.
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <div className="text-[11px] font-mono font-semibold text-slate-400 dark:text-slate-500">
                Example:
              </div>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                [5, 3, 8, 2] → [3, 5, 8, 2] → ... → [2, 3, 5, 8]
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 pt-1 group-hover:translate-x-1 transition-transform">
                <span>Explore Insertion Sort</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ─── 4. WHY DIFFERENT SORTING ALGORITHMS? ─── */}
      <div className="p-5 sm:p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
          Why Different Sorting Algorithms?
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          Different sorting algorithms use different approaches to arrange data. There is no single "magic" algorithm that is best in every situation. Each has a distinct strategy:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 space-y-1">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              Bubble Sort
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
              Compare adjacent elements and swap them if they are out of order.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 space-y-1">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              Selection Sort
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
              Find the minimum element in the unsorted portion and place it directly into its correct slot.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 space-y-1">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              Insertion Sort
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
              Insert each element into its correct relative position within the already sorted portion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
