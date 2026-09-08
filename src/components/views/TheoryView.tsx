import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  BookOpen,
  ListOrdered,
} from 'lucide-react';
import { UserProgress, TheoryLesson } from '../../types';
import { THEORY_LESSONS } from '../../data/theoryData';
import { soundEffects } from '../../services/sound';

// 6 Dedicated Concept Components
import { Concept1WhatIsSorting } from '../theory/Concept1WhatIsSorting';
import { Concept2BubbleSort } from '../theory/Concept2BubbleSort';
import { Concept3SelectionSort } from '../theory/Concept3SelectionSort';
import { Concept4InsertionSort } from '../theory/Concept4InsertionSort';
import { Concept5CompareAlgorithms } from '../theory/Concept5CompareAlgorithms';
import { Concept6Complexity } from '../theory/Concept6Complexity';

// Visualizer Modal for live interactive algorithm simulation
import {
  SortingVisualizerModal,
  VisualizerAlgorithm,
} from '../theory/SortingVisualizerModal';

interface TheoryViewProps {
  progress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
  onNavigateToLab?: () => void;
}

export const TheoryView: React.FC<TheoryViewProps> = ({
  progress,
  onUpdateProgress,
  onNavigateToLab,
}) => {
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const [showMobileToc, setShowMobileToc] = useState<boolean>(false);
  const [activeVisualizerAlgo, setActiveVisualizerAlgo] =
    useState<VisualizerAlgorithm | null>(null);

  const completedChapters = Array.isArray(progress?.completedTheoryChapters)
    ? progress.completedTheoryChapters
    : [];
  const totalChapters = 6; // Exactly 6 concepts
  const completedCount = Math.min(6, completedChapters.length);
  const progressPercentage = Math.min(100, Math.round((completedCount / totalChapters) * 100));

  const currentChapter: TheoryLesson =
    THEORY_LESSONS[activeChapterIndex] || THEORY_LESSONS[0];
  const isCurrentCompleted = completedChapters.includes(currentChapter.id);

  // Scroll smoothly to top on chapter change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeChapterIndex]);

  const handleSelectChapter = (index: number) => {
    soundEffects.playClick();
    setActiveChapterIndex(index);
    setShowMobileToc(false);
  };

  const handleToggleComplete = () => {
    const chapterId = currentChapter.id;
    soundEffects.playSuccess();

    onUpdateProgress((prev) => {
      const alreadyCompleted = Array.isArray(prev?.completedTheoryChapters) && prev.completedTheoryChapters.includes(chapterId);
      let updatedCompleted: number[];
      let xpEarned = 0;

      if (alreadyCompleted) {
        updatedCompleted = prev.completedTheoryChapters.filter((id) => id !== chapterId);
      } else {
        updatedCompleted = [...(prev.completedTheoryChapters || []), chapterId];
        xpEarned = 35;
      }

      return {
        ...prev,
        xp: prev.xp + xpEarned,
        completedTheoryChapters: updatedCompleted,
        history:
          xpEarned > 0
            ? [
                {
                  title: `Completed Concept ${currentChapter.chapterNumber || currentChapter.id}: ${currentChapter.title}`,
                  description: `Finished concept in Theory of Sorting Algorithms`,
                  xpEarned: xpEarned,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
                ...prev.history,
              ]
            : prev.history,
      };
    });
  };

  const handleNextChapter = () => {
    if (activeChapterIndex < THEORY_LESSONS.length - 1) {
      soundEffects.playClick();
      setActiveChapterIndex((prev) => prev + 1);
    }
  };

  const handlePrevChapter = () => {
    if (activeChapterIndex > 0) {
      soundEffects.playClick();
      setActiveChapterIndex((prev) => prev - 1);
    }
  };

  // Render the dedicated pedagogical component for the active concept
  const renderConceptContent = () => {
    switch (activeChapterIndex) {
      case 0:
        return (
          <Concept1WhatIsSorting
            onSelectConcept={(idx) => {
              soundEffects.playClick();
              setActiveChapterIndex(idx);
            }}
          />
        );
      case 1:
        return (
          <Concept2BubbleSort
            onSeeVisualization={() => setActiveVisualizerAlgo('bubble')}
            onNavigatePrev={handlePrevChapter}
            onNavigateNext={handleNextChapter}
          />
        );
      case 2:
        return (
          <Concept3SelectionSort
            onSeeVisualization={() => setActiveVisualizerAlgo('selection')}
            onNavigatePrev={handlePrevChapter}
            onNavigateNext={handleNextChapter}
          />
        );
      case 3:
        return (
          <Concept4InsertionSort
            onSeeVisualization={() => setActiveVisualizerAlgo('insertion')}
            onNavigatePrev={handlePrevChapter}
            onNavigateNext={handleNextChapter}
          />
        );
      case 4:
        return (
          <Concept5CompareAlgorithms
            onNavigatePrev={handlePrevChapter}
            onNavigateNext={handleNextChapter}
            onSelectConcept={(idx) => {
              soundEffects.playClick();
              setActiveChapterIndex(idx);
            }}
          />
        );
      case 5:
        return (
          <Concept6Complexity
            onNavigatePrev={handlePrevChapter}
            onCompleteCurriculum={handleToggleComplete}
          />
        );
      default:
        return (
          <Concept1WhatIsSorting
            onSelectConcept={(idx) => {
              soundEffects.playClick();
              setActiveChapterIndex(idx);
            }}
          />
        );
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-20">
      {/* =========================================================================
          PAGE HEADER & OVERALL PROGRESS
          ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800">
                Visual DSA Learning Module
              </span>
              <span className="text-[11px] font-bold text-slate-400 font-mono">
                6 Interactive Concepts
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase font-mono">
              THEORY OF SORTING ALGORITHMS
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Step-by-step visual lessons designed for high retention: <strong>Definition → Simple Example → Code Snippet → Interactive Simulation → Key Takeaway</strong>.
            </p>
          </div>

          {/* Progress Indicator Card */}
          <div className="bg-slate-50 dark:bg-slate-800/80 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 min-w-[260px] space-y-3">
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
              <span className="text-slate-700 dark:text-slate-200 flex items-center gap-1.5 font-mono">
                <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Curriculum
              </span>
              <span className="text-indigo-600 dark:text-indigo-400 font-mono font-bold">
                {completedCount} / {totalChapters} Concepts ({progressPercentage}%)
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-full rounded-full"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              <span>
                {completedCount === totalChapters
                  ? '🎉 All 6 Concepts Complete!'
                  : `${totalChapters - completedCount} concepts remaining`}
              </span>
              <span className="font-semibold">
                {progressPercentage === 100 ? 'Mastery Level' : 'In Progress'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Chapter Selector (Visible only on small screens) */}
      <div className="lg:hidden">
        <button
          onClick={() => setShowMobileToc(!showMobileToc)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-800 dark:text-slate-100 shadow-2xs cursor-pointer"
        >
          <div className="flex items-center gap-2 truncate font-mono">
            <ListOrdered className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span className="truncate">
              Concept {currentChapter.chapterNumber}: {currentChapter.title}
            </span>
          </div>
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold shrink-0 ml-2">
            {showMobileToc ? 'Close TOC' : 'View All 6 Concepts'}
          </span>
        </button>

        <AnimatePresence>
          {showMobileToc && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-lg max-h-[60vh] overflow-y-auto space-y-1"
            >
              {THEORY_LESSONS.map((ch, idx) => {
                const isCompleted = completedChapters.includes(ch.id);
                const isActive = idx === activeChapterIndex;
                return (
                  <button
                    key={ch.id}
                    onClick={() => handleSelectChapter(idx)}
                    className={`w-full text-left p-3 rounded-xl flex items-start gap-3 transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {ch.chapterNumber || (idx + 1 < 10 ? `0${idx + 1}` : idx + 1)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate">{ch.title}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {ch.shortDesc}
                      </p>
                    </div>
                    {isCompleted && (
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* =========================================================================
          MAIN 2-COLUMN LAYOUT: TABLE OF CONTENTS (LEFT) & CONTENT (RIGHT)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* =====================================================================
            LEFT SIDEBAR: TABLE OF CONTENTS (EXACTLY 6 CONCEPTS)
            ===================================================================== */}
        <aside className="hidden lg:block lg:col-span-4 sticky top-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-4 shadow-xs max-h-[calc(100vh-6rem)] overflow-y-auto space-y-3">
          <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <ListOrdered className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Curriculum (6 Concepts)
              </span>
            </div>
          </div>

          <nav className="space-y-1.5" aria-label="Chapters">
            {THEORY_LESSONS.map((chapter, index) => {
              const isActive = index === activeChapterIndex;
              const isCompleted = completedChapters.includes(chapter.id);
              const chapterNumStr =
                chapter.chapterNumber ||
                (index + 1 < 10 ? `0${index + 1}` : `${index + 1}`);

              return (
                <button
                  key={chapter.id}
                  id={`toc-chapter-${chapter.id}`}
                  onClick={() => handleSelectChapter(index)}
                  className={`w-full text-left p-3 rounded-2xl transition-all relative flex items-start gap-3 cursor-pointer group ${
                    isActive
                      ? 'bg-indigo-50/90 dark:bg-indigo-950/70 border-l-4 border-indigo-600 dark:border-indigo-400 border border-indigo-200/80 dark:border-indigo-900/60 shadow-xs'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {/* Concept Number */}
                  <div
                    className={`font-mono text-xs font-extrabold shrink-0 mt-0.5 px-2 py-0.5 rounded-md ${
                      isActive
                        ? 'bg-gradient-to-tr from-blue-600 to-purple-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900 group-hover:text-indigo-600'
                    }`}
                  >
                    {chapterNumStr}
                  </div>

                  {/* Title & Short Description */}
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <h2
                      className={`text-xs font-bold truncate leading-tight ${
                        isActive
                          ? 'text-slate-900 dark:text-white'
                          : 'text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-300'
                      }`}
                    >
                      {chapter.title}
                    </h2>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 leading-relaxed">
                      {chapter.shortDesc}
                    </p>
                  </div>

                  {/* Status Indicator */}
                  <div className="shrink-0 mt-1">
                    {isCompleted ? (
                      <span
                        className="flex items-center text-indigo-600 dark:text-indigo-400"
                        title="Completed"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    ) : isActive ? (
                      <span
                        className="w-2 h-2 rounded-full bg-purple-500 dark:bg-purple-400 animate-pulse block"
                        title="Active"
                      />
                    ) : (
                      <Circle
                        className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700"
                        title="Not Started"
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* =====================================================================
            RIGHT PANEL: MAIN CHAPTER CONTENT (ACTIVE CONCEPT)
            ===================================================================== */}
        <main className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-7">
            {/* Header Bar: Chapter Label & Read Time */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="font-mono text-xs font-extrabold uppercase tracking-widest text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 px-3 py-1 rounded-lg border border-indigo-100 dark:border-indigo-900/60">
                CONCEPT {currentChapter.chapterNumber} // {currentChapter.categoryLabel || 'SORTING'}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 font-mono">
                <Clock className="w-3.5 h-3.5" />
                <span>{currentChapter.readTime}</span>
              </div>
            </div>

            {/* Chapter Title & Subtitle */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-mono">
                {currentChapter.title}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {currentChapter.shortDesc}
              </p>
            </div>

            {/* Active Concept Component */}
            <div>{renderConceptContent()}</div>

            {/* Completion Bar */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={handleToggleComplete}
                className={`w-full sm:w-auto px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
                  isCurrentCompleted
                    ? 'bg-indigo-950 dark:bg-indigo-950 text-indigo-200 border border-indigo-800'
                    : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white shadow-md shadow-indigo-500/25'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {isCurrentCompleted
                    ? 'Concept Completed ✓ (35 XP Earned)'
                    : 'Mark Concept as Completed (+35 XP)'}
                </span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                <button
                  onClick={handlePrevChapter}
                  disabled={activeChapterIndex === 0}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={handleNextChapter}
                  disabled={activeChapterIndex === THEORY_LESSONS.length - 1}
                  className="px-4 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/80 dark:border-indigo-800 font-bold text-xs text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Next Concept</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Interactive Sorting Visualizer Modal */}
      {activeVisualizerAlgo && (
        <SortingVisualizerModal
          isOpen={activeVisualizerAlgo !== null}
          algorithm={activeVisualizerAlgo}
          onClose={() => setActiveVisualizerAlgo(null)}
          onNavigateToLab={onNavigateToLab}
        />
      )}
    </div>
  );
};
