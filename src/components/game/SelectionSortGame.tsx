import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ArrowRightLeft,
  Check,
  AlertTriangle,
  RotateCcw,
  Clock,
  Trophy,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
  SlidersHorizontal,
  Lightbulb,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SortCardObject, SortLevelConfig, UserProgress } from '../../types';
import { SortingCard } from './SortingCard';
import { soundEffects } from '../../services/sound';
import { GuidedSolveModal } from './GuidedSolveModal';

interface SelectionSortGameProps {
  level: SortLevelConfig;
  progress: UserProgress;
  onCompleteLevel: (earnedXP: number, earnedScore?: number, performanceMetrics?: string) => void;
  onBackToLevels: () => void;
  onNextLevel?: () => void;
}

type SelectionStep =
  | 'FIND_MINIMUM'
  | 'MINIMUM_FOUND'
  | 'ANIMATING_SWAP'
  | 'PASS_COMPLETE'
  | 'GAME_COMPLETE';

export const SelectionSortGame: React.FC<SelectionSortGameProps> = ({
  level,
  onCompleteLevel,
  onBackToLevels,
  onNextLevel,
}) => {
  const initializeCards = useCallback((arr: number[]): SortCardObject[] => {
    return arr.map((val, idx) => ({
      id: `card-sel-${val}-${idx}-${Date.now()}`,
      value: val,
      position: idx,
      isSorted: false,
    }));
  }, []);

  const [cards, setCards] = useState<SortCardObject[]>(() => initializeCards(level.initialArray));
  const [sortedIndex, setSortedIndex] = useState<number>(0); // cards[0...sortedIndex-1] are sorted
  const [stepState, setStepState] = useState<SelectionStep>('FIND_MINIMUM');
  const [selectedMinIndex, setSelectedMinIndex] = useState<number | null>(null);

  // Guided Solve guide modal state
  const [showGuidedSolve, setShowGuidedSolve] = useState<boolean>(false);

  const handleCloseGuidedSolve = () => {
    setShowGuidedSolve(false);
  };

  // Reset state when level changes
  useEffect(() => {
    setCards(initializeCards(level.initialArray));
    setSortedIndex(0);
    setStepState('FIND_MINIMUM');
    setSelectedMinIndex(null);
    setScore(500);
    setMoves(0);
    setComparisonsCount(0);
    setElapsedSeconds(0);
    setTimerActive(true);
    setHintTier(0);
    setShowResetModal(false);
    setFeedback({
      type: 'info',
      title: `Level ${level.levelNumber}: ${level.title}`,
      message: 'Find and select the minimum card in the unsorted section.',
    });
  }, [level.levelNumber, level.initialArray, initializeCards]);

  // Telemetry
  const [score, setScore] = useState<number>(500);
  const [moves, setMoves] = useState<number>(0);
  const [comparisonsCount, setComparisonsCount] = useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(true);
  const [isShaking, setIsShaking] = useState<boolean>(false);

  // Hints and resets
  const [hintTier, setHintTier] = useState<number>(0);
  const [showHintModal, setShowHintModal] = useState<boolean>(false);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);

  // Contextual feedback
  const [feedback, setFeedback] = useState<{
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
  }>({
    type: 'info',
    title: 'Selection Sort Initialized',
    message: 'Find and select the minimum card in the unsorted section.',
  });

  // Timer
  useEffect(() => {
    if (!timerActive) return;
    const interval = setInterval(() => setElapsedSeconds((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [timerActive]);

  // Compute true minimum in unsorted portion
  const getTrueMinimumIndex = useCallback((): number => {
    let minIdx = sortedIndex;
    for (let i = sortedIndex + 1; i < cards.length; i++) {
      if (cards[i].value < cards[minIdx].value) {
        minIdx = i;
      }
    }
    return minIdx;
  }, [cards, sortedIndex]);

  const triggerShake = () => {
    soundEffects.playError();
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  // Card click handler
  const handleCardClick = (clickedIdx: number) => {
    if (stepState === 'GAME_COMPLETE' || stepState === 'ANIMATING_SWAP') return;

    // Check if clicked in sorted section
    if (clickedIdx < sortedIndex || cards[clickedIdx].isSorted) {
      soundEffects.playError();
      setFeedback({
        type: 'warning',
        title: 'Already in Sorted Section',
        message: '🔒 This card is already locked in the sorted partition. Look at the unsorted cards on the right!',
      });
      return;
    }

    if (stepState === 'FIND_MINIMUM') {
      const trueMinIdx = getTrueMinimumIndex();
      setComparisonsCount((c) => c + (cards.length - sortedIndex));

      if (clickedIdx === trueMinIdx) {
        // Correct minimum selected
        soundEffects.playCorrect();
        setSelectedMinIndex(clickedIdx);
        setStepState('MINIMUM_FOUND');
        setScore((s) => s + 60);
        setFeedback({
          type: 'success',
          title: `Minimum Found: ${cards[clickedIdx].value}`,
          message: `Now click "Place Minimum" to swap ${cards[clickedIdx].value} into the first unsorted position (#${sortedIndex}).`,
        });
      } else {
        // Wrong minimum
        triggerShake();
        setScore((s) => Math.max(100, s - 25));
        setFeedback({
          type: 'error',
          title: 'Not the Minimum',
          message: `❌ ${cards[clickedIdx].value} is not the smallest card in the unsorted section. Compare all numbers carefully!`,
        });
      }
    } else if (stepState === 'MINIMUM_FOUND') {
      // If player clicks the target position directly or clicks the min card
      if (clickedIdx === sortedIndex || clickedIdx === selectedMinIndex) {
        executePlacement();
      }
    }
  };

  // Execute the physical placement/swap
  const executePlacement = () => {
    if (selectedMinIndex === null || stepState !== 'MINIMUM_FOUND') return;

    soundEffects.playPush();
    setStepState('ANIMATING_SWAP');
    setMoves((m) => m + 1);

    const newCards = [...cards];
    const minCard = newCards[selectedMinIndex];
    const targetCard = newCards[sortedIndex];

    // Physically swap
    newCards[sortedIndex] = { ...minCard, isSorted: true, isMinimum: false };
    newCards[selectedMinIndex] = { ...targetCard, isMinimum: false };

    // Update positions
    newCards[sortedIndex].position = sortedIndex;
    newCards[selectedMinIndex].position = selectedMinIndex;

    setCards(newCards);

    const nextSortedIndex = sortedIndex + 1;

    // Check if finished
    if (nextSortedIndex >= cards.length - 1) {
      // All elements sorted
      const allSorted = newCards.map((c) => ({ ...c, isSorted: true, isMinimum: false }));
      setCards(allSorted);
      setSortedIndex(cards.length);
      setStepState('GAME_COMPLETE');
      setTimerActive(false);
      soundEffects.playSuccess();
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      onCompleteLevel(
        level.xpReward,
        score,
        level.levelNumber === 5 ? 'All 5 Levels Mastered • Optimal Min Selection' : undefined
      );
      setFeedback({
        type: 'success',
        title: `Level ${level.levelNumber} Complete!`,
        message:
          level.levelNumber < 5
            ? `Level ${level.levelNumber} cleared! Advancing to Level ${level.levelNumber + 1}...`
            : 'All levels mastered! Returning to level selection...',
      });

      setTimeout(() => {
        if (onNextLevel && level.levelNumber < 5) {
          onNextLevel();
        } else {
          onBackToLevels();
        }
      }, 1100);
      return;
    }

    setFeedback({
      type: 'success',
      title: 'Element Placed!',
      message: `Card ${minCard.value} is now locked in sorted position #${sortedIndex}.`,
    });

    setTimeout(() => {
      setSortedIndex(nextSortedIndex);
      setSelectedMinIndex(null);
      setStepState('FIND_MINIMUM');
      setFeedback({
        type: 'info',
        title: `Pass ${nextSortedIndex + 1}`,
        message: 'Find the minimum card in the remaining unsorted section.',
      });
    }, 600);
  };

  const handleConfirmReset = () => {
    setCards(initializeCards(level.initialArray));
    setSortedIndex(0);
    setStepState('FIND_MINIMUM');
    setSelectedMinIndex(null);
    setScore(500);
    setMoves(0);
    setComparisonsCount(0);
    setElapsedSeconds(0);
    setTimerActive(true);
    setHintTier(0);
    setShowResetModal(false);
    setFeedback({
      type: 'info',
      title: 'Challenge Reset',
      message: 'Find the minimum element in the unsorted section.',
    });
  };

  const handleUseHint = () => {
    soundEffects.playClick();
    const nextTier = Math.min(hintTier + 1, 3);
    setHintTier(nextTier);
    setScore((s) => Math.max(50, s - 20));
    setShowHintModal(true);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* ─── HEADER BAR ─── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundEffects.playClick();
              onBackToLevels();
            }}
            className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer"
          >
            ← Levels
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>SELECTION SORT</span>
              <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                LV {level.levelNumber}
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Task: Find the minimum card and place it at the front of the unsorted section.
            </p>
          </div>
        </div>

        {/* Guided Solve Button + Live Metrics */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              soundEffects.playClick();
              setShowGuidedSolve(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-bold text-xs hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors cursor-pointer"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Guided Solve</span>
          </button>

          <div className="flex items-center gap-4 text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800/80 px-4 py-2 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
              <Trophy className="w-4 h-4" />
              <span>{score} pts</span>
            </div>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{elapsedSeconds}s</span>
            </div>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <div className="text-slate-700 dark:text-slate-300">
              Swaps: <span className="font-mono text-slate-900 dark:text-white">{moves}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── EDUCATIONAL FEEDBACK CALLOUT ─── */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border transition-all ${
          feedback.type === 'error'
            ? 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-100'
            : feedback.type === 'success'
            ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-100'
            : feedback.type === 'warning'
            ? 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-100'
            : 'bg-blue-50/90 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/60 text-blue-900 dark:text-blue-100'
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="mt-0.5 shrink-0">
            {feedback.type === 'error' ? (
              <ShieldAlert className="w-5 h-5 text-rose-600" />
            ) : feedback.type === 'success' ? (
              <Check className="w-5 h-5 text-emerald-600" />
            ) : (
              <Lightbulb className="w-5 h-5 text-blue-600" />
            )}
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold tracking-tight">{feedback.title}</h4>
            <p className="text-xs sm:text-sm opacity-90 mt-0.5 leading-relaxed font-normal">{feedback.message}</p>
          </div>
        </div>
      </div>

      {/* ─── WORKSPACE WITH VISIBLE SORTED/UNSORTED PARTITION ─── */}
      <div
        className={`bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-xs relative ${
          isShaking ? 'animate-shake' : ''
        }`}
      >
        {/* Partition Indicators */}
        <div className="grid grid-cols-2 gap-4 pb-4 mb-6 border-b border-slate-100 dark:border-slate-800 text-xs font-bold">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>SORTED SECTION ({sortedIndex} items)</span>
          </div>
          <div className="flex items-center justify-end gap-2 text-blue-600 dark:text-blue-400">
            <span>UNSORTED SECTION ({cards.length - sortedIndex} items)</span>
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          </div>
        </div>

        {/* Cards Display with Partition Divider */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 py-6 overflow-x-auto custom-scrollbar min-h-[160px]">
          {cards.map((card, idx) => {
            const isMin = selectedMinIndex === idx;
            const isTarget = stepState === 'MINIMUM_FOUND' && idx === sortedIndex;

            return (
              <React.Fragment key={card.id}>
                {/* Visual Partition Divider Line */}
                {idx === sortedIndex && idx > 0 && (
                  <div className="flex flex-col items-center justify-center px-1 shrink-0">
                    <div className="w-0.5 h-24 bg-gradient-to-b from-emerald-500 to-blue-500 rounded-full" />
                    <span className="text-[9px] font-mono font-bold text-slate-400 mt-1">DIVIDER</span>
                  </div>
                )}

                <SortingCard
                  card={{ ...card, isMinimum: isMin }}
                  index={idx}
                  isSelected={isMin}
                  isDropTarget={isTarget}
                  onCardClick={() => handleCardClick(idx)}
                />
              </React.Fragment>
            );
          })}
        </div>

        {/* Action Button: Place Minimum */}
        <AnimatePresence>
          {stepState === 'MINIMUM_FOUND' && selectedMinIndex !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center gap-3"
            >
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Minimum element {cards[selectedMinIndex].value} selected. Commit placement to slot #{sortedIndex}:
              </p>
              <button
                onClick={executePlacement}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-xs shadow-md shadow-blue-500/25 cursor-pointer active:scale-95 transition-all flex items-center gap-2"
              >
                <ArrowRightLeft className="w-4 h-4" />
                <span>Place Minimum ({cards[selectedMinIndex].value} ⇄ {cards[sortedIndex].value})</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── FOOTER CONTROLS ─── */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handleUseHint}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-amber-400 text-slate-700 dark:text-slate-300 hover:text-amber-600 font-bold text-xs shadow-2xs transition-all cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-amber-500" />
          <span>[ HINT ]</span>
        </button>

        <button
          onClick={() => setShowResetModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-rose-400 text-slate-700 dark:text-slate-300 hover:text-rose-600 font-bold text-xs shadow-2xs transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>[ RESET PROBLEM ]</span>
        </button>
      </div>

      {/* ─── HINT MODAL ─── */}
      <AnimatePresence>
        {showHintModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                    Selection Sort Hint (Tier {hintTier}/3)
                  </h3>
                  <p className="text-xs text-slate-500">
                    {hintTier === 1
                      ? 'General Concept'
                      : hintTier === 2
                      ? 'Specific Guidance'
                      : 'Direct Clue'}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {level.hints[hintTier - 1] || level.hints[0]}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setShowHintModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs cursor-pointer"
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── RESET MODAL ─── */}
      <AnimatePresence>
        {showResetModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-3 text-rose-600">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  Reset Current Challenge?
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                This will reset the current array and timer. Your completed levels and overall progress will NOT be affected.
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowResetModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReset}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Reset Challenge
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── GUIDED SOLVE GUIDE MODAL ─── */}
      <GuidedSolveModal
        gameId="selection-sort"
        isOpen={showGuidedSolve}
        onClose={handleCloseGuidedSolve}
      />
    </div>
  );
};
