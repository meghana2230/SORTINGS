import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Clock, HardDrive, CheckCircle2, XCircle, ArrowRight, ShieldCheck, ShieldAlert } from 'lucide-react';
import { soundEffects } from '../../services/sound';

export const InteractiveComplexityTable: React.FC = () => {
  const [selectedAlgo, setSelectedAlgo] = useState<string>('quicksort');

  const algorithms = [
    {
      id: 'quicksort',
      name: 'Quick Sort',
      category: 'Divide & Conquer',
      bestTime: 'O(n log n)',
      avgTime: 'O(n log n)',
      worstTime: 'O(n²)',
      space: 'O(log n) aux',
      stable: false,
      explanation: 'In-place partitioning around a pivot. Extremely fast in practice due to CPU cache locality.',
      whyFast: 'Tight inner comparison loops and in-place memory access minimize hardware cache misses.',
      pitfall: 'Degrades to O(n²) if an unbalanced pivot is picked on sorted data (mitigated by randomized/median-of-three pivot).',
    },
    {
      id: 'mergesort',
      name: 'Merge Sort',
      category: 'Divide & Conquer',
      bestTime: 'O(n log n)',
      avgTime: 'O(n log n)',
      worstTime: 'O(n log n)',
      space: 'O(n) aux',
      stable: true,
      explanation: 'Divides array into halves, recursively sorts, and merges using two pointers. Guaranteed O(n log n).',
      whyFast: 'Predictable performance in all scenarios; ideal for linked lists and external disk sorting.',
      pitfall: 'Requires O(n) temporary buffer memory to hold merged subarrays.',
    },
    {
      id: 'heapsort',
      name: 'Heap Sort',
      category: 'Selection / Tree',
      bestTime: 'O(n log n)',
      avgTime: 'O(n log n)',
      worstTime: 'O(n log n)',
      space: 'O(1) aux',
      stable: false,
      explanation: 'Builds an in-place max-heap in O(n) time and repeatedly extracts maximum elements in O(log n).',
      whyFast: 'Guaranteed O(n log n) with strictly O(1) auxiliary memory. Never degrades to quadratic time.',
      pitfall: 'Non-sequential index jumps (2i+1, 2i+2) cause more CPU cache misses than Quick Sort.',
    },
    {
      id: 'insertionsort',
      name: 'Insertion Sort',
      category: 'Elementary / Adaptive',
      bestTime: 'O(n)',
      avgTime: 'O(n²)',
      worstTime: 'O(n²)',
      space: 'O(1) aux',
      stable: true,
      explanation: 'Builds sorted prefix by shifting larger elements right. Runs in linear O(n) time on nearly-sorted data.',
      whyFast: 'Negligible constant overhead. Outperforms O(n log n) sorts on small arrays (n <= 32).',
      pitfall: 'Performs up to O(n²) shifts on reverse-sorted inputs.',
    },
    {
      id: 'selectionsort',
      name: 'Selection Sort',
      category: 'Elementary',
      bestTime: 'O(n²)',
      avgTime: 'O(n²)',
      worstTime: 'O(n²)',
      space: 'O(1) aux',
      stable: false,
      explanation: 'Repeatedly scans unsorted suffix to find minimum element and places it at the front.',
      whyFast: 'Performs at most n - 1 memory writes/swaps, useful when write cycles are physically costly.',
      pitfall: 'Always executes n(n-1)/2 comparisons even if the input is already sorted.',
    },
    {
      id: 'bubblesort',
      name: 'Bubble Sort',
      category: 'Elementary',
      bestTime: 'O(n)',
      avgTime: 'O(n²)',
      worstTime: 'O(n²)',
      space: 'O(1) aux',
      stable: true,
      explanation: 'Repeatedly compares adjacent items and swaps inverted pairs until largest elements bubble to end.',
      whyFast: 'Detects pre-sorted inputs in O(n) with swapped flag check.',
      pitfall: 'Excessive adjacent swaps make it slow for practical large-scale use.',
    },
    {
      id: 'countingsort',
      name: 'Counting Sort',
      category: 'Non-Comparison',
      bestTime: 'O(n + k)',
      avgTime: 'O(n + k)',
      worstTime: 'O(n + k)',
      space: 'O(n + k) aux',
      stable: true,
      explanation: 'Bypasses comparison lower bound by tabulating key frequencies and computing prefix sums.',
      whyFast: 'Achieves true linear O(n) runtime when the key range k is proportional to n.',
      pitfall: 'Unusable if key range k is significantly larger than n (e.g., k = 2^64).',
    },
    {
      id: 'timsort',
      name: 'Timsort (Hybrid)',
      category: 'Production Hybrid',
      bestTime: 'O(n)',
      avgTime: 'O(n log n)',
      worstTime: 'O(n log n)',
      space: 'O(n) aux',
      stable: true,
      explanation: 'Standard in Python, Java, and JavaScript (V8). Detects natural runs, uses binary insertion sort and merges.',
      whyFast: 'Blazingly fast on real-world datasets that contain pre-existing ordered sequences.',
      pitfall: 'Implementation is complex; requires auxiliary memory for run merging.',
    },
  ];

  const current = algorithms.find((a) => a.id === selectedAlgo) || algorithms[0];

  return (
    <div className="bg-slate-50 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Interactive Sorting Complexity &amp; Architecture Matrix</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Compare algorithmic time bounds, auxiliary memory constraints, and stability guarantees.
          </p>
        </div>
      </div>

      {/* Algorithm Pills Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {algorithms.map((algo) => {
          const isSelected = algo.id === selectedAlgo;
          return (
            <button
              key={algo.id}
              onClick={() => {
                soundEffects.playClick();
                setSelectedAlgo(algo.id);
              }}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold truncate">{algo.name}</span>
                {algo.stable ? (
                  <ShieldCheck className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-200' : 'text-emerald-500'}`} title="Stable Sort" />
                ) : (
                  <ShieldAlert className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-200' : 'text-amber-500'}`} title="Unstable Sort" />
                )}
              </div>
              <span className={`text-[10px] block mt-0.5 font-mono ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                Avg: {algo.avgTime}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Algorithm Deep Dive Card */}
      <motion.div
        key={current.id}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 sm:p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700/60 pb-3">
          <div>
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{current.name}</span>
              <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800">
                {current.category}
              </span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              {current.explanation}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono flex items-center gap-1.5 ${
                current.stable
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
              }`}
            >
              {current.stable ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
              <span>{current.stable ? 'Stable' : 'Unstable'}</span>
            </span>
          </div>
        </div>

        {/* Complexity Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Best Case</span>
            <span className="text-xs sm:text-sm font-mono font-black text-emerald-600 dark:text-emerald-400 mt-0.5 block">
              {current.bestTime}
            </span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Average Case</span>
            <span className="text-xs sm:text-sm font-mono font-black text-blue-600 dark:text-blue-400 mt-0.5 block">
              {current.avgTime}
            </span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Worst Case</span>
            <span className="text-xs sm:text-sm font-mono font-black text-rose-600 dark:text-rose-400 mt-0.5 block">
              {current.worstTime}
            </span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Auxiliary Space</span>
            <span className="text-xs sm:text-sm font-mono font-black text-purple-600 dark:text-purple-400 mt-0.5 block">
              {current.space}
            </span>
          </div>
        </div>

        {/* Engineering Takeaways */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
            <strong className="text-emerald-800 dark:text-emerald-300 font-bold block mb-1">
              ⚡ Key Advantage:
            </strong>
            <span className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {current.whyFast}
            </span>
          </div>
          <div className="p-3 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40">
            <strong className="text-amber-800 dark:text-amber-300 font-bold block mb-1">
              ⚠️ Architectural Pitfall:
            </strong>
            <span className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {current.pitfall}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
