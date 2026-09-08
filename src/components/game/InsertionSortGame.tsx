import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Layers,
  ArrowRightLeft,
  Check,
  AlertTriangle,
  RotateCcw,
  Clock,
  Trophy,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
  MoveRight,
  ArrowDown,
  Lightbulb,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SortCardObject, SortLevelConfig, UserProgress } from '../../types';
import { SortingCard } from './SortingCard';
import { soundEffects } from '../../services/sound';
import { GuidedSolveModal } from './GuidedSolveModal';

interface InsertionSortGameProps {
  level: SortLevelConfig;
  progress: UserProgress;
  onCompleteLevel: (earnedXP: number, earnedScore?: number, performanceMetrics?: string) => void;
  onBackToLevels: () => void;
  onNextLevel?: () => void;
}

type InsertionStep =
  | 'PICK_KEY'
  | 'COMPARE_PREDECESSOR'
  | 'SHIFT_REQUIRED'
  | 'INSERT_KEY'
  | 'GAME_COMPLETE';

export const InsertionSortGame: React.FC<InsertionSortGameProps> = ({
  level,
  onCompleteLevel,
  onBackToLevels,
  onNextLevel,
}) => {
  const initializeCards = useCallback((arr: number[]): SortCardObject[] => {
    return arr.map((val, idx) => ({
      id: `card-ins-${val}-${idx}-${Date.now()}`,
      value: val,
      position: idx,
      isSorted: idx === 0, // First card is trivially sorted
    }));
  }, []);

  const [cards, setCards] = useState<SortCardObject[]>(() => initializeCards(level.initialArray));
  const [currentIndex, setCurrentIndex] = useState<number>(1); // Index of the key to insert
  const [scanIndex, setScanIndex] = useState<number>(0); // Points to the predecessor being compared
  const [stepState, setStepState] = useState<InsertionStep>('COMPARE_PREDECESSOR');

  // Guided Solve guide modal state
  const [showGuidedSolve, setShowGuidedSolve] = useState<boolean>(false);

  const handleCloseGuidedSolve = () => {
    setShowGuidedSolve(false);
  };

  // Reset state when level changes
  useEffect(() => {
    setCards(initializeCards(level.initialArray));
    setCurrentIndex(1);
    setScanIndex(0);
    setStepState('COMPARE_PREDECESSOR');
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
      message: 'Compare the highlighted card against its predecessor.',
    });
  }, [level.levelNumber, level.initialArray, initializeCards]);

  // Telemetry
  const [score, setScore] = useState<number>(500);
  const [moves, setMoves] = useState<number>(0); // Shifts count
  const [comparisonsCount, setComparisonsCount] = useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(true);
  const [isShaking, setIsShaking] = useState<boolean>(false);

  // Modals & hints
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
    title: 'Insertion Sort Initialized',
    message: `Card #${currentIndex} (${cards[currentIndex]?.value}) is selected. Compare it backwards against sorted cards.`,
  });

  useEffect(() => {
    if (!timerActive) return;
    const interval = setInterval(() => setElapsedSeconds((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [timerActive]);

  const currentKeyCard = cards[currentIndex];
  const predecessorCard = cards[scanIndex];

  const triggerShake = () => {
    soundEffects.playError();
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  // Compare decision: SHIFT vs INSERT HERE
  const handleShiftDecision = (decision: 'SHIFT' | 'INSERT') => {
    if (stepState !== 'COMPARE_PREDECESSOR') return;

    setComparisonsCount((c) => c + 1);
    const predecessorVal = predecessorCard.value;
    const currentVal = currentKeyCard.value;
    const needsShift = predecessorVal > currentVal;

    if (decision === 'SHIFT') {
      if (!needsShift) {
        // Predecessor is <= current key -> should NOT shift
        triggerShake();
        setScore((s) => Math.max(100, s - 25));
        setFeedback({
          type: 'error',
          title: 'No Shift Needed',
          message: `❌ ${predecessorVal} is already <= ${currentVal}. We have found the correct position! Insert here.`,
        });
      } else {
        // Correct shift decision!
        soundEffects.playCorrect();
        setScore((s) => s + 40);
        setStepState('SHIFT_REQUIRED');
        setFeedback({
          type: 'info',
          title: 'Shift Required',
          message: `${predecessorVal} is greater than ${currentVal}. Click "Execute Shift" to move ${predecessorVal} one slot right.`,
        });
      }
    } else if (decision === 'INSERT') {
      if (needsShift) {
        // Predecessor is > current key -> MUST shift
        triggerShake();
        setScore((s) => Math.max(100, s - 25));
        setFeedback({
          type: 'error',
          title: 'Cannot Insert Yet',
          message: `❌ ${predecessorVal} is greater than ${currentVal}. You must shift ${predecessorVal} to the right first!`,
        });
      } else {
        // Correct insert decision!
        soundEffects.playCorrect();
        setScore((s) => s + 50);
        commitInsert(scanIndex + 1);
      }
    }
  };

  // Execute shift of predecessor card to the right
  const executeShift = () => {
    if (stepState !== 'SHIFT_REQUIRED') return;

    soundEffects.playPush();
    setMoves((m) => m + 1);

    // Physically shift predecessor one position right
    // In our array, we swap scanIndex and scanIndex + 1 (where the key or bubble is)
    const newCards = [...cards];
    const temp = newCards[scanIndex];
    newCards[scanIndex] = newCards[scanIndex + 1];
    newCards[scanIndex + 1] = temp;

    // Update positions
    newCards[scanIndex].position = scanIndex;
    newCards[scanIndex + 1].position = scanIndex + 1;

    setCards(newCards);

    const nextScanIndex = scanIndex - 1;

    if (nextScanIndex < 0) {
      // Reached the very front (index 0) of the array!
      // The key has bubbled all the way to index 0.
      setScanIndex(0);
      commitInsert(0, newCards);
    } else {
      // Move to inspect the next predecessor to the left
      setScanIndex(nextScanIndex);
      setCurrentIndex((idx) => idx - 1);
      setStepState('COMPARE_PREDECESSOR');
      setFeedback({
        type: 'info',
        title: 'Compare Next Predecessor',
        message: `Compare ${currentKeyCard.value} with ${newCards[nextScanIndex].value}. Does it need to shift?`,
      });
    }
  };

  // Commit insertion and lock prefix
  const commitInsert = (insertedPos: number, updatedCards?: SortCardObject[]) => {
    const activeCards = updatedCards || cards;
    const targetIdx = currentIndex;

    // Mark sorted prefix from 0 up to targetIdx as sorted
    const newCards = activeCards.map((c, i) => (i <= targetIdx ? { ...c, isSorted: true } : c));
    setCards(newCards);

    soundEffects.playPush();
    const nextCurrentIndex = targetIdx + 1;

    if (nextCurrentIndex >= cards.length) {
      // All sorted!
      const allSorted = newCards.map((c) => ({ ...c, isSorted: true }));
      setCards(allSorted);
      setStepState('GAME_COMPLETE');
      setTimerActive(false);
      soundEffects.playSuccess();
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      onCompleteLevel(
        level.xpReward,
        score,
        level.levelNumber === 5 ? 'All 5 Levels Mastered • Minimal Shifts' : undefined
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
      title: 'Card Inserted!',
      message: `Card ${newCards[targetIdx].value} is now locked in sorted order.`,
    });

    setTimeout(() => {
      setCurrentIndex(nextCurrentIndex);
      setScanIndex(nextCurrentIndex - 1);
      setStepState('COMPARE_PREDECESSOR');
      setFeedback({
        type: 'info',
        title: `Inserting Card #${nextCurrentIndex} (${newCards[nextCurrentIndex]?.value})`,
        message: `Compare against predecessor (${newCards[nextCurrentIndex - 1]?.value}).`,
      });
    }, 700);
  };

  const handleConfirmReset = () => {
    setCards(initializeCards(level.initialArray));
    setCurrentIndex(1);
    setScanIndex(0);
    setStepState('COMPARE_PREDECESSOR');
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
      message: 'Compare card #1 against predecessor #0.',
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
            className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer"
          >
            ← Levels
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>INSERTION SORT</span>
              <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                LV {level.levelNumber}
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Task: Shift larger cards right and insert each card into its correct position.
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
              Shifts: <span className="font-mono text-slate-900 dark:text-white">{moves}</span>
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
            : 'bg-teal-50/90 dark:bg-teal-950/40 border-teal-200 dark:border-teal-900/60 text-teal-900 dark:text-teal-100'
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="mt-0.5 shrink-0">
            {feedback.type === 'error' ? (
              <ShieldAlert className="w-5 h-5 text-rose-600" />
            ) : feedback.type === 'success' ? (
              <Check className="w-5 h-5 text-emerald-600" />
            ) : (
              <Lightbulb className="w-5 h-5 text-teal-600" />
            )}
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold tracking-tight">{feedback.title}</h4>
            <p className="text-xs sm:text-sm opacity-90 mt-0.5 leading-relaxed font-normal">{feedback.message}</p>
          </div>
        </div>
      </div>

      {/* ─── WORKSPACE WITH CARDS ─── */}
      <div
        className={`bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-xs relative ${
          isShaking ? 'animate-shake' : ''
        }`}
      >
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-slate-800 text-xs font-bold">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 font-mono">
              Sorted Prefix: [0...{Math.max(0, currentIndex - 1)}]
            </span>
          </div>
          <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
            <span className="px-2 py-0.5 rounded-md bg-teal-100 dark:bg-teal-950/80 font-mono">
              Key Card: #{currentIndex} ({currentKeyCard?.value})
            </span>
          </div>
        </div>

        {/* Physical Cards Row */}
        <div className="flex items-center justify-center gap-2 sm:gap-3.5 py-6 overflow-x-auto custom-scrollbar min-h-[160px]">
          {cards.map((card, idx) => {
            const isCurrentKey = idx === currentIndex;
            const isScanTarget = idx === scanIndex && stepState !== 'GAME_COMPLETE';
            const isShifting = stepState === 'SHIFT_REQUIRED' && isScanTarget;

            return (
              <SortingCard
                key={card.id}
                card={{
                  ...card,
                  isCurrent: isCurrentKey,
                  isShifting: isShifting,
                }}
                index={idx}
                isSelected={isCurrentKey || isScanTarget}
                isPairHighlighted={isScanTarget}
              />
            );
          })}
        </div>

        {/* Decision Controls */}
        <AnimatePresence>
          {stepState === 'COMPARE_PREDECESSOR' && predecessorCard && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center gap-3"
            >
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Comparing predecessor <strong className="text-slate-900 dark:text-slate-100">{predecessorCard.value}</strong> with key <strong className="text-teal-600 dark:text-teal-400">{currentKeyCard.value}</strong>.
              </p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleShiftDecision('SHIFT')}
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-md shadow-teal-500/25 cursor-pointer active:scale-95 transition-all flex items-center gap-2"
                >
                  <MoveRight className="w-4 h-4" />
                  <span>[ SHIFT {predecessorCard.value} RIGHT ]</span>
                </button>
                <button
                  onClick={() => handleShiftDecision('INSERT')}
                  className="px-6 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-extrabold text-xs cursor-pointer active:scale-95 transition-all flex items-center gap-2"
                >
                  <ArrowDown className="w-4 h-4 text-emerald-500" />
                  <span>[ INSERT {currentKeyCard.value} HERE ]</span>
                </button>
              </div>
            </motion.div>
          )}

          {stepState === 'SHIFT_REQUIRED' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center gap-3 text-center"
            >
              <div className="text-xs font-bold text-teal-600 dark:text-teal-400">
                Predecessor {predecessorCard.value} is larger than key {currentKeyCard.value}.
              </div>
              <button
                onClick={executeShift}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-extrabold text-xs shadow-md shadow-teal-500/30 cursor-pointer active:scale-95 transition-all flex items-center gap-2"
              >
                <MoveRight className="w-4 h-4" />
                <span>Execute Physical Shift ({predecessorCard.value} ➔ Right)</span>
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
                    Insertion Sort Hint (Tier {hintTier}/3)
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
                  className="px-5 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs cursor-pointer"
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
        gameId="insertion-sort"
        isOpen={showGuidedSolve}
        onClose={handleCloseGuidedSolve}
      />
    </div>
  );
};
