import React from 'react';
import {
  ArrowRight,
  Lightbulb,
  BookOpen,
  Star,
  Rocket,
  Target,
  Sigma,
  Puzzle,
  ArrowUpDown,
  Zap,
  FolderGit2,
  Globe,
  Split,
  Layers,
  Sparkles,
} from 'lucide-react';
import { TabType, UserProgress } from '../../types';
import { soundEffects } from '../../services/sound';
import { AlgoLearnLogo } from '../common/AlgoLearnLogo';

interface HomeDashboardProps {
  progress: UserProgress;
  onSelectTab: (tab: TabType) => void;
  onSelectGameLevel: (levelId: number) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onSelectTab,
}) => {
  const handleStartLearning = () => {
    soundEffects.playClick();
    onSelectTab('theory');
  };

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      {/* ─── HERO CARD: SORTING ALGORITHMS & PARADIGMS ─── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 lg:p-10 shadow-xs transition-colors">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2.5 flex-wrap">
              <AlgoLearnLogo size="sm" showSubtitle={false} />
              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
              <span className="text-[11px] sm:text-xs font-bold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">
                THEORY CURRICULUM • MODULE 01 • CHAPTER 01
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-none">
              Sorting &amp; <br className="hidden sm:inline" />
              Algorithms
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl font-normal">
              Learn how sorting algorithms organize collections, how comparisons and partitions work, and the mathematical principles that power high-performance systems.
            </p>
          </div>

          {/* Right Column: Graphic Animation of Sorted Array Bars */}
          <div className="lg:col-span-5 flex items-center justify-center gap-4 sm:gap-6 py-2">
            {/* Center Sort Icon */}
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/25 shrink-0">
              <ArrowUpDown className="w-10 h-10 stroke-[2.2]" />
            </div>

            {/* Connecting Pointer Curves (SVG) */}
            <div className="hidden sm:flex flex-col justify-center text-indigo-400 dark:text-indigo-500 shrink-0">
              <svg width="42" height="110" viewBox="0 0 42 110" fill="none" className="stroke-indigo-400 dark:stroke-indigo-500">
                <path d="M 0 55 C 20 55, 20 15, 38 15" strokeDasharray="3 3" strokeWidth="2" fill="none" />
                <path d="M 38 15 L 34 11 M 38 15 L 34 19" strokeWidth="2" />
                
                <path d="M 0 55 L 38 55" strokeDasharray="3 3" strokeWidth="2" fill="none" />
                <path d="M 38 55 L 34 51 M 38 55 L 34 59" strokeWidth="2" />

                <path d="M 0 55 C 20 55, 20 95, 38 95" strokeDasharray="3 3" strokeWidth="2" fill="none" />
                <path d="M 38 95 L 34 91 M 38 95 L 34 99" strokeWidth="2" />
              </svg>
            </div>

            {/* Visual Sorted Array Bars */}
            <div className="flex flex-col items-center shrink-0">
              <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 tracking-wider flex flex-col items-center mb-1">
                <span>SORTED</span>
                <span className="text-indigo-600 dark:text-indigo-400 text-sm font-black -mt-1">↓</span>
              </div>

              <div className="w-28 sm:w-32 h-28 rounded-xl border-2 border-indigo-500 bg-white dark:bg-slate-900 p-2 flex items-end justify-center gap-1.5 shadow-xs">
                {[
                  { height: '25%', val: 12, col: 'bg-indigo-400' },
                  { height: '45%', val: 28, col: 'bg-indigo-500' },
                  { height: '65%', val: 49, col: 'bg-indigo-600' },
                  { height: '85%', val: 75, col: 'bg-purple-500' },
                  { height: '100%', val: 92, col: 'bg-purple-600' },
                ].map((bar, bIdx) => (
                  <div key={bIdx} className="flex-1 flex flex-col items-center justify-end h-full">
                    <span className="text-[9px] font-mono font-bold text-slate-700 dark:text-slate-300">
                      {bar.val}
                    </span>
                    <div
                      className={`w-full rounded-t-sm ${bar.col} transition-all duration-300`}
                      style={{ height: bar.height }}
                    />
                  </div>
                ))}
              </div>

              <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 tracking-wider mt-1.5 font-mono">
                A[0] ≤ ... ≤ A[n-1]
              </div>
            </div>
          </div>
        </div>

        {/* 3 Quick Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-100 dark:border-slate-800/80">
          {/* Card 1: Core Idea */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20">
                <Target className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">Core Idea</h4>
                <p className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                  <span className="font-bold">Total Ordering</span>: Inversion Reduction.
                </p>
              </div>
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800/60 leading-tight">
              <div className="flex items-start gap-1.5">
                <span className="text-indigo-500 font-bold">•</span>
                <span>Transform permutation into sorted sequence</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-indigo-500 font-bold">•</span>
                <span><strong className="text-slate-800 dark:text-slate-200 font-semibold">Comparisons</strong> resolve relative ordering</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-indigo-500 font-bold">•</span>
                <span><strong className="text-slate-800 dark:text-slate-200 font-semibold">Stability</strong> preserves equal-key arrival order</span>
              </div>
            </div>
          </div>

          {/* Card 2: Key Formula */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20">
                <Sigma className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">Key Formula</h4>
                <p className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                  <span className="font-bold">Lower Bound</span>: Ω(n log n).
                </p>
              </div>
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800/60 leading-tight">
              <div className="flex items-start gap-1.5">
                <span className="text-indigo-500 font-bold">•</span>
                <span><strong className="text-slate-800 dark:text-slate-200 font-semibold">Elementary</strong>: Bubble, Select, Insert: O(n²)</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-indigo-500 font-bold">•</span>
                <span><strong className="text-slate-800 dark:text-slate-200 font-semibold">Divide &amp; Conquer</strong>: Merge, Quick: O(n log n)</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-indigo-500 font-bold">•</span>
                <span><strong className="text-slate-800 dark:text-slate-200 font-semibold">Non-Comparison</strong>: Counting, Radix: O(n + k)</span>
              </div>
            </div>
          </div>

          {/* Card 3: Main Challenge */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20">
                <Puzzle className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">Engineering Tradeoffs</h4>
                <p className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                  Time, Auxiliary Space &amp; Stability.
                </p>
              </div>
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800/60 leading-tight">
              <div className="flex items-start gap-1.5">
                <span className="text-indigo-500 font-bold">•</span>
                <span>In-Place Memory: <strong className="text-slate-800 dark:text-slate-200 font-semibold">O(1) aux vs O(n) aux</strong></span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-indigo-500 font-bold">•</span>
                <span>Worst-case pivots: <strong className="text-slate-800 dark:text-slate-200 font-semibold">O(n²) mitigation</strong></span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-indigo-500 font-bold">•</span>
                <span>Cache Locality: <strong className="text-slate-800 dark:text-slate-200 font-semibold">Hardware sequential access</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 1. MAIN IDEA ─── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 lg:p-10 shadow-xs transition-colors">
        {/* Section Heading */}
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-xs">
            <Lightbulb className="w-4 h-4 stroke-[2.4]" />
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            1. Main Idea
          </h2>
        </div>

        {/* Main Idea Card */}
        <div className="bg-indigo-50/40 dark:bg-indigo-950/30 rounded-2xl border border-indigo-200/70 dark:border-indigo-900/50 p-5 sm:p-6">
          <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
            Sorting means rearranging data into a desired order by comparing elements and placing them in their correct positions.
          </p>
        </div>
      </div>

      {/* ─── 2. CONCEPT ROADMAP ─── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 lg:p-10 shadow-xs transition-colors">
        {/* Section Heading */}
        <div className="flex items-center gap-3 mb-8 sm:mb-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-xs">
            <BookOpen className="w-4 h-4 stroke-[2.4]" />
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            2. Concept Roadmap
          </h2>
        </div>

        {/* 6-Node Timeline with Dotted Connecting Line */}
        <div className="relative px-2 sm:px-4">
          {/* Dotted Line */}
          <div className="hidden sm:block absolute top-[13px] left-[7%] right-[7%] h-[2px] border-t-2 border-dashed border-indigo-200 dark:border-indigo-800/80 z-0" />

          {/* 6 Nodes */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-3 relative z-10">
            {/* Step 01: Sorting Fundamentals */}
            <div className="flex flex-col items-center text-center">
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 mb-3 border border-indigo-200/60 dark:border-indigo-800">
                01
              </span>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 mb-2">
                <ArrowUpDown className="w-5 h-5 stroke-[2.2]" />
              </div>
              <strong className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                Sorting <br /> Fundamentals
              </strong>
            </div>

            {/* Step 02: Bubble Sort */}
            <div className="flex flex-col items-center text-center">
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 mb-3 border border-indigo-200/60 dark:border-indigo-800">
                02
              </span>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 mb-2">
                <Layers className="w-5 h-5 stroke-[2.2]" />
              </div>
              <strong className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                Bubble <br /> Sort
              </strong>
            </div>

            {/* Step 03: Insertion Sort */}
            <div className="flex flex-col items-center text-center">
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 mb-3 border border-indigo-200/60 dark:border-indigo-800">
                03
              </span>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 mb-2">
                <Split className="w-5 h-5 stroke-[2.2]" />
              </div>
              <strong className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                Insertion <br /> Sort
              </strong>
            </div>

            {/* Step 04: Selection Sort */}
            <div className="flex flex-col items-center text-center">
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 mb-3 border border-indigo-200/60 dark:border-indigo-800">
                04
              </span>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 mb-2">
                <Puzzle className="w-5 h-5 stroke-[2.2]" />
              </div>
              <strong className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                Selection <br /> Sort
              </strong>
            </div>

            {/* Step 05: Comparison */}
            <div className="flex flex-col items-center text-center">
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 mb-3 border border-indigo-200/60 dark:border-indigo-800">
                05
              </span>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 mb-2">
                <Sparkles className="w-5 h-5 stroke-[2.2]" />
              </div>
              <strong className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                Comparison
              </strong>
            </div>

            {/* Step 06: Time and Space Complexity */}
            <div className="flex flex-col items-center text-center">
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 mb-3 border border-indigo-200/60 dark:border-indigo-800">
                06
              </span>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 mb-2">
                <Sigma className="w-5 h-5 stroke-[2.2]" />
              </div>
              <strong className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                Time and Space <br /> Complexity
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 3. WHY THIS TOPIC MATTERS ─── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 lg:p-10 shadow-xs transition-colors">
        {/* Section Heading */}
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-xs">
            <Star className="w-4 h-4 stroke-[2.4]" />
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            3. Why Sorting Mastery Matters
          </h2>
        </div>

        {/* 3 Color-Coded Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {/* Card 1: Fast Searching & Locality */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-indigo-300 dark:hover:border-indigo-700/60 transition-all">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center mb-4 shadow-md shadow-indigo-500/20">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1.5">
              Unlocks O(log n) Search
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Sorting enables binary search, two-pointer sweeps, interval scheduling, and optimal CPU cache spatial locality.
            </p>
          </div>

          {/* Card 2: Fundamental Subroutine */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-indigo-300 dark:hover:border-indigo-700/60 transition-all">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center mb-4 shadow-md shadow-indigo-500/20">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1.5">
              Advanced DSA Preprocessing
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Kruskal's MST, Graham scan convex hull, Huffman encoding, and Dijkstra priority queues all rely on sorted ordering.
            </p>
          </div>

          {/* Card 3: Real-World Use */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-indigo-300 dark:hover:border-indigo-700/60 transition-all">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center mb-4 shadow-md shadow-indigo-500/20">
              <Globe className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1.5">
              Production Operating Systems
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Database ORDER BY queries, search engine ranking pipelines, and the Linux kernel scheduler run on sorted structures.
            </p>
          </div>
        </div>
      </div>

      {/* ─── 4. READY TO START? ─── */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-indigo-200/80 dark:border-indigo-900/60 p-6 sm:p-8 lg:p-10 shadow-xs transition-colors flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Left Graphic & Text */}
        <div className="flex items-center gap-5 sm:gap-6 text-center sm:text-left">
          {/* Rocket Icon Container */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/25 shrink-0">
            <Rocket className="w-9 h-9 stroke-[2.2]" />
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              4. Ready to Master Sorting?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-md">
              Begin your journey by understanding comparisons, divide-and-conquer, and modern hybrid sorting engines.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleStartLearning}
          className="w-full sm:w-auto px-6 sm:px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold text-sm shadow-md shadow-indigo-500/25 transition-all flex items-center justify-center gap-2.5 group cursor-pointer active:scale-95 shrink-0"
        >
          <span>Start Learning</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
