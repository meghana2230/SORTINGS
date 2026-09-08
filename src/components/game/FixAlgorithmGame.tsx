import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wrench,
  Check,
  AlertTriangle,
  RotateCcw,
  Clock,
  Trophy,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
  Bug,
  Sparkles,
  Lightbulb,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SortCardObject, SortLevelConfig, UserProgress } from '../../types';
import { SortingCard } from './SortingCard';
import { soundEffects } from '../../services/sound';
import { GuidedSolveModal } from './GuidedSolveModal';

interface FixAlgorithmGameProps {
  level: SortLevelConfig;
  progress: UserProgress;
  onCompleteLevel: (earnedXP: number, score?: number, performanceMetrics?: string) => void;
  onBackToLevels: () => void;
  onNextLevel?: () => void;
}

interface QuestionScenario {
  prompt: string;
  operationsTrace: string[];
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
    resultingArray: number[];
  }[];
}

export const FixAlgorithmGame: React.FC<FixAlgorithmGameProps> = ({
  level,
  onCompleteLevel,
  onBackToLevels,
  onNextLevel,
}) => {
  // Generate level-specific scenarios
  const getScenario = (levelNum: number): QuestionScenario => {
    switch (levelNum) {
      case 1:
        return {
          prompt: 'Bubble Sort Pass 1 is partially executed on [5, 9, 3, 7]. The pointer just finished comparing and swapping elements at indices 1 and 2. What operation must execute NEXT?',
          operationsTrace: [
            '1. Compare index 0 (5) and index 1 (9) -> 5 <= 9, KEEP.',
            '2. Compare index 1 (9) and index 2 (3) -> 9 > 3, SWAPPED to [5, 3, 9, 7].',
          ],
          options: [
            {
              id: 'opt-a',
              text: 'Compare index 2 (9) and index 3 (7), and swap them since 9 > 7.',
              isCorrect: true,
              explanation: 'Correct! The Bubble Sort inner loop pointer advances from j=1 to j=2, comparing arr[2] (9) and arr[3] (7). Since 9 > 7, they swap to [5, 3, 7, 9].',
              resultingArray: [5, 3, 7, 9],
            },
            {
              id: 'opt-b',
              text: 'Lock element 9 at index 2 as permanently sorted.',
              isCorrect: false,
              explanation: 'Incorrect. Elements only lock at the end of the full pass (index 3), not mid-array!',
              resultingArray: [5, 3, 9, 7],
            },
            {
              id: 'opt-c',
              text: 'Immediately restart from index 0 comparing 5 and 3.',
              isCorrect: false,
              explanation: 'Incorrect. Bubble Sort does not restart early; it finishes the current pass all the way to the unsorted boundary.',
              resultingArray: [5, 3, 9, 7],
            },
          ],
        };
      case 2:
        return {
          prompt: 'Selection Sort on [8, 29, 14, 37, 10] with sorted section [8]. A buggy function picked 14 as the minimum for Pass 2. What is the true minimum of the unsorted segment?',
          operationsTrace: [
            'Sorted prefix: [8] (index 0).',
            'Unsorted section to scan: [29, 14, 37, 10] (indices 1..4).',
            'Buggy scan prematurely selected 14.',
          ],
          options: [
            {
              id: 'opt-a',
              text: 'Card 10 at index 4 is the true minimum; swap 10 with 29 at index 1.',
              isCorrect: true,
              explanation: 'Correct! 10 < 14 and 10 < 29. Selection Sort must check all elements in the unsorted section before committing.',
              resultingArray: [8, 10, 14, 37, 29],
            },
            {
              id: 'opt-b',
              text: 'Card 14 is already correct because it appeared earlier in the array.',
              isCorrect: false,
              explanation: 'Incorrect! Selection sort looks for absolute minimum value, not first occurrence.',
              resultingArray: [8, 29, 14, 37, 10],
            },
            {
              id: 'opt-c',
              text: 'Card 8 should be swapped again with 10.',
              isCorrect: false,
              explanation: 'Incorrect! Card 8 is in the already sorted prefix and should never be altered.',
              resultingArray: [8, 29, 14, 37, 10],
            },
          ],
        };
      default:
        return {
          prompt: 'Insertion Sort on prefix [8, 15, 27] when key is 12. The program shifted 27 but stopped without comparing 15. What is the necessary fix?',
          operationsTrace: [
            'Sorted prefix: [8, 15, 27]. Key element: 12.',
            'Step 1: 27 > 12 -> shifted 27 to the right.',
            'Bug: Program attempted to drop 12 before testing 15!',
          ],
          options: [
            {
              id: 'opt-a',
              text: 'Compare 15 with 12; since 15 > 12, shift 15 right as well, then place 12 after 8.',
              isCorrect: true,
              explanation: 'Correct! The while loop must continue while (j >= 0 && arr[j] > key). Since 15 > 12, 15 must shift right before 12 can be inserted.',
              resultingArray: [8, 12, 15, 27],
            },
            {
              id: 'opt-b',
              text: 'Swap 12 with 8 directly to save operations.',
              isCorrect: false,
              explanation: 'Incorrect. 8 <= 12, so 8 must stay to the left of 12.',
              resultingArray: [8, 15, 27, 12],
            },
            {
              id: 'opt-c',
              text: 'Leave 12 at the end and run Quick Sort instead.',
              isCorrect: false,
              explanation: 'Incorrect. Insertion Sort must maintain the invariant of a sorted prefix on every iteration.',
              resultingArray: [8, 15, 27, 12],
            },
          ],
        };
    }
  };

  const scenario = getScenario(level.levelNumber);

  const [cards, setCards] = useState<SortCardObject[]>(() =>
    level.initialArray.map((val, idx) => ({
      id: `fix-card-${val}-${idx}-${Date.now()}`,
      value: val,
      position: idx,
    }))
  );

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [isSolved, setIsSolved] = useState<boolean>(false);

  // Guided Solve guide modal state
  const [showGuidedSolve, setShowGuidedSolve] = useState<boolean>(false);

  const handleCloseGuidedSolve = () => {
    setShowGuidedSolve(false);
  };

  // Reset state when level changes
  useEffect(() => {
    setCards(
      level.initialArray.map((val, idx) => ({
        id: `fix-card-${val}-${idx}-${Date.now()}`,
        value: val,
        position: idx,
      }))
    );
    setSelectedOptionId(null);
    setIsAnswerSubmitted(false);
    setIsSolved(false);
    setScore(500);
    setElapsedSeconds(0);
    setTimerActive(true);
    setHintTier(0);
    setShowResetModal(false);
  }, [level.levelNumber, level.initialArray]);

  // Scoring
  const [score, setScore] = useState<number>(500);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(true);
  const [hintTier, setHintTier] = useState<number>(0);
  const [showHintModal, setShowHintModal] = useState<boolean>(false);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);

  useEffect(() => {
    if (!timerActive) return;
    const interval = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [timerActive]);

  const handleSelectOption = (optId: string) => {
    if (isSolved) return;
    soundEffects.playClick();
    setSelectedOptionId(optId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOptionId || isAnswerSubmitted) return;

    const chosen = scenario.options.find((o) => o.id === selectedOptionId);
    if (!chosen) return;

    setIsAnswerSubmitted(true);

    if (chosen.isCorrect) {
      soundEffects.playCorrect();
      setScore((s) => s + 80);
      setIsSolved(true);
      setTimerActive(false);

      // Animate the resulting fixed array directly on the physical cards!
      const newCards = chosen.resultingArray.map((val, idx) => ({
        id: `fix-card-${val}-${idx}-${Date.now()}`,
        value: val,
        position: idx,
        isSorted: true,
      }));
      setCards(newCards);

      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      onCompleteLevel(
        level.xpReward,
        score + 80,
        level.levelNumber === 5 ? 'All 5 Levels Mastered • Bug Eliminator' : undefined
      );

      setTimeout(() => {
        if (onNextLevel && level.levelNumber < 5) {
          onNextLevel();
        } else {
          onBackToLevels();
        }
      }, 1200);
    } else {
      soundEffects.playError();
      setScore((s) => Math.max(100, s - 30));
    }
  };

  const handleRetryQuestion = () => {
    setSelectedOptionId(null);
    setIsAnswerSubmitted(false);
  };

  const handleConfirmReset = () => {
    setCards(
      level.initialArray.map((val, idx) => ({
        id: `fix-card-${val}-${idx}-${Date.now()}`,
        value: val,
        position: idx,
      }))
    );
    setSelectedOptionId(null);
    setIsAnswerSubmitted(false);
    setIsSolved(false);
    setScore(500);
    setElapsedSeconds(0);
    setTimerActive(true);
    setShowResetModal(false);
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
            className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer"
          >
            ← Levels
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>FIX THE ALGORITHM</span>
              <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                LV {level.levelNumber}
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Detect algorithm anomalies, invariant violations, and execute the correction.
            </p>
          </div>
        </div>

        {/* Guided Solve Button + Metrics */}
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
          </div>
        </div>
      </div>

      {/* ─── PROBLEM SCENARIO & TRACE CARD ─── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-rose-600 dark:text-rose-400 tracking-wider">
          <Bug className="w-4 h-4" />
          <span>EXECUTION TRACE & BUG DETECTION</span>
        </div>

        <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100">
          {scenario.prompt}
        </h2>

        {/* Operations Trace Log Box */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60 font-mono text-xs space-y-1.5 text-slate-700 dark:text-slate-300">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Execution History:</div>
          {scenario.operationsTrace.map((trace, i) => (
            <div key={i} className="leading-relaxed">{trace}</div>
          ))}
        </div>

        {/* Current State Cards Row */}
        <div className="pt-2">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Current Physical Cards:
          </div>
          <div className="flex items-center justify-center gap-2.5 py-4 overflow-x-auto">
            {cards.map((card, idx) => (
              <SortingCard
                key={card.id}
                card={card}
                index={idx}
                isSelected={isSolved}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ─── MULTIPLE CHOICE DEBUG OPTIONS ─── */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          Select the Algorithmic Fix:
        </h3>

        <div className="space-y-3">
          {scenario.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            const showFeedback = isAnswerSubmitted && isSelected;

            return (
              <div
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? isAnswerSubmitted
                      ? opt.isCorrect
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500'
                        : 'bg-rose-50 dark:bg-rose-950/60 border-rose-500'
                      : 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-500 ring-2 ring-rose-400/40'
                    : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
                    {opt.text}
                  </span>
                  {isSelected && (
                    <div className="shrink-0 mt-0.5">
                      {isAnswerSubmitted ? (
                        opt.isCorrect ? (
                          <Check className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-rose-600" />
                        )
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-rose-600" />
                      )}
                    </div>
                  )}
                </div>

                {showFeedback && (
                  <p className={`text-xs mt-2.5 font-medium leading-relaxed ${opt.isCorrect ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`}>
                    {opt.explanation}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── SUBMIT OR RETRY BUTTON ─── */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handleUseHint}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-amber-400 text-slate-700 dark:text-slate-300 hover:text-amber-600 font-bold text-xs shadow-2xs transition-all cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-amber-500" />
          <span>[ HINT ]</span>
        </button>

        <div className="flex items-center gap-3">
          {isAnswerSubmitted && !isSolved && (
            <button
              onClick={handleRetryQuestion}
              className="px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
            >
              Try Another Option
            </button>
          )}

          {!isSolved && (
            <button
              disabled={!selectedOptionId || isAnswerSubmitted}
              onClick={handleSubmitAnswer}
              className={`px-7 py-3 rounded-2xl font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer ${
                selectedOptionId && !isAnswerSubmitted
                  ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-rose-500/25 active:scale-95'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>APPLY BUG FIX</span>
            </button>
          )}
        </div>
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
                    Algorithm Fix Hint (Tier {hintTier}/3)
                  </h3>
                  <p className="text-xs text-slate-500">
                    {hintTier === 1 ? 'General Concept' : hintTier === 2 ? 'Specific Guidance' : 'Direct Clue'}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {level.hints[hintTier - 1] || level.hints[0]}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setShowHintModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs cursor-pointer"
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── GUIDED SOLVE GUIDE MODAL ─── */}
      <GuidedSolveModal
        gameId="fix-the-algorithm"
        isOpen={showGuidedSolve}
        onClose={handleCloseGuidedSolve}
      />
    </div>
  );
};
