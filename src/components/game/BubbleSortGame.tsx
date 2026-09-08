import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ArrowRightLeft,
  Check,
  AlertTriangle,
  RotateCcw,
  Lightbulb,
  Clock,
  Trophy,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
  BookOpen,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SortCardObject, SortLevelConfig, UserProgress } from '../../types';
import { SortingCard } from './SortingCard';
import { soundEffects } from '../../services/sound';
import { GuidedSolveModal } from './GuidedSolveModal';

interface BubbleSortGameProps {
  level: SortLevelConfig;
  progress: UserProgress;
  onCompleteLevel: (earnedXP: number, earnedScore?: number, performanceMetrics?: string) => void;
  onBackToLevels: () => void;
  onNextLevel?: () => void;
}

type BubbleStep =
  | 'HIGHLIGHT_PAIR'
  | 'WAIT_FOR_SECOND_CLICK'
  | 'COMPARE_DECIDE'
  | 'WAIT_FOR_DRAG_SWAP'
  | 'ANIMATING_SWAP'
  | 'PASS_COMPLETE'
  | 'GAME_COMPLETE';

export const BubbleSortGame: React.FC<BubbleSortGameProps> = ({
  level,
  onCompleteLevel,
  onBackToLevels,
  onNextLevel,
}) => {
  // ─── SINGLE SOURCE OF TRUTH: BUBBLE SORT STATE ───
  // Cards representation: each card has a stable ID, numeric value, and position
  const initializeCards = useCallback((arr: number[]): SortCardObject[] => {
    return arr.map((val, idx) => ({
      id: `card-${val}-${idx}-${Date.now()}`,
      value: val,
      position: idx,
      isSorted: false,
    }));
  }, []);

  const [cards, setCards] = useState<SortCardObject[]>(() => initializeCards(level.initialArray));

  // Current pass: 1-indexed (e.g. 1 to totalPasses)
  const [currentPass, setCurrentPass] = useState<number>(1);
  // Current comparison: 0-indexed within current pass
  const [currentComparison, setCurrentComparison] = useState<number>(0);
  // sortedBoundary = number of elements finalized by COMPLETED passes.
  // CRITICAL RULE: Starts strictly at 0. NO element is sorted at start of Pass 1.
  // After Pass 1 completes: sortedBoundary = 1 (only the last element is locked).
  // After Pass 2 completes: sortedBoundary = 2.
  const [sortedBoundary, setSortedBoundary] = useState<number>(0);
  // Current step state in interaction cycle
  const [currentAction, setCurrentAction] = useState<BubbleStep>('HIGHLIGHT_PAIR');
  // Selected cards in current comparison pair
  const [selectedElements, setSelectedElements] = useState<number[]>([]);
  // Game complete flag
  const [gameComplete, setGameComplete] = useState<boolean>(false);

  // Derived algorithm metrics
  const totalPasses = Math.max(1, cards.length - 1);
  const totalComparisonsInPass = Math.max(1, cards.length - currentPass);
  const currentPairLeftIndex = currentComparison;
  const currentPairRightIndex = currentComparison + 1;
  const leftCard = cards[currentPairLeftIndex];
  const rightCard = cards[currentPairRightIndex];

  // Element sorted determination strictly from sortedBoundary state
  const isElementSorted = useCallback(
    (idx: number): boolean => {
      if (gameComplete) return true;
      if (sortedBoundary <= 0) return false;
      return idx >= cards.length - sortedBoundary;
    },
    [gameComplete, sortedBoundary, cards.length]
  );

  // Rendered cards with dynamically computed sorted status
  const renderedCards: SortCardObject[] = cards.map((card, idx) => ({
    ...card,
    position: idx,
    isSorted: isElementSorted(idx),
  }));

  // Guided Solve guide modal state
  const [showGuidedSolve, setShowGuidedSolve] = useState<boolean>(false);

  const handleCloseGuidedSolve = () => {
    setShowGuidedSolve(false);
  };

  // Reset state when level changes
  useEffect(() => {
    setCards(initializeCards(level.initialArray));
    setCurrentPass(1);
    setCurrentComparison(0);
    setSortedBoundary(0);
    setCurrentAction('HIGHLIGHT_PAIR');
    setSelectedElements([]);
    setGameComplete(false);
    setMoves(0);
    setComparisonsCount(0);
    setElapsedSeconds(0);
    setTimerActive(true);
    setHintTier(0);
    setShowResetModal(false);
    setFeedback({
      type: 'info',
      title: `Level ${level.levelNumber}: ${level.title}`,
      message: 'Click the two highlighted adjacent cards to compare them.',
    });
  }, [level.levelNumber, level.initialArray, initializeCards]);

  // Telemetry & scoring
  const [score, setScore] = useState<number>(500);
  const [moves, setMoves] = useState<number>(0);
  const [comparisonsCount, setComparisonsCount] = useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(true);

  // Contextual feedback & educational messaging
  const [feedback, setFeedback] = useState<{
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
  }>({
    type: 'info',
    title: 'Bubble Sort Initialized',
    message: 'Compare the highlighted adjacent elements to begin.',
  });

  const [isShaking, setIsShaking] = useState<boolean>(false);

  // Hints system
  const [hintTier, setHintTier] = useState<number>(0);
  const [showHintModal, setShowHintModal] = useState<boolean>(false);
  const [hintsUsed, setHintsUsed] = useState<number>(0);

  // Reset confirmation modal
  const [showResetModal, setShowResetModal] = useState<boolean>(false);

  // Timer effect
  useEffect(() => {
    if (!timerActive) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive]);

  // Shake trigger helper
  const triggerShake = () => {
    soundEffects.playError();
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  // Card click handler (enforcing strict state machine)
  const handleCardClick = (clickedIdx: number) => {
    if (
      currentAction === 'GAME_COMPLETE' ||
      currentAction === 'ANIMATING_SWAP' ||
      currentAction === 'PASS_COMPLETE'
    ) {
      return;
    }

    // Check if clicked card is already locked / sorted
    if (isElementSorted(clickedIdx)) {
      soundEffects.playError();
      setFeedback({
        type: 'warning',
        title: 'Element Already Sorted',
        message: '🔒 This element is already in its final sorted position.',
      });
      return;
    }

    // Check if clicked card is outside the current adjacent comparison pair
    if (clickedIdx !== currentPairLeftIndex && clickedIdx !== currentPairRightIndex) {
      triggerShake();
      setFeedback({
        type: 'error',
        title: 'Adjacent Comparison Rule',
        message: '⚠️ Bubble Sort compares adjacent elements only. Click the highlighted pair!',
      });
      return;
    }

    // If waiting for first or second click
    if (currentAction === 'HIGHLIGHT_PAIR') {
      soundEffects.playClick();
      setSelectedElements([clickedIdx]);
      setCurrentAction('WAIT_FOR_SECOND_CLICK');
      const otherIdx = clickedIdx === currentPairLeftIndex ? currentPairRightIndex : currentPairLeftIndex;
      setFeedback({
        type: 'info',
        title: 'Card Selected',
        message: `Now click the second highlighted card (${cards[otherIdx]?.value}) to compare them.`,
      });
    } else if (currentAction === 'WAIT_FOR_SECOND_CLICK') {
      if (selectedElements?.includes(clickedIdx)) {
        // Clicked same card twice
        setFeedback({
          type: 'warning',
          title: 'Select Second Card',
          message: 'Click the other highlighted card to form the comparison pair.',
        });
        return;
      }

      soundEffects.playClick();
      setSelectedElements([currentPairLeftIndex, currentPairRightIndex]);
      setComparisonsCount((c) => c + 1);
      setCurrentAction('COMPARE_DECIDE');

      const isGreater = leftCard.value > rightCard.value;
      setFeedback({
        type: 'info',
        title: `Comparing ${leftCard.value} and ${rightCard.value}`,
        message: isGreater
          ? `${leftCard.value} is greater than ${rightCard.value}. In ascending order, what should you do?`
          : `${leftCard.value} is less than or equal to ${rightCard.value}. In ascending order, what should you do?`,
      });
    }
  };

  // Handle player decision: SWAP vs KEEP
  const handleDecision = (decision: 'SWAP' | 'KEEP') => {
    if (currentAction !== 'COMPARE_DECIDE') return;

    const needsSwap = leftCard.value > rightCard.value;

    if (decision === 'KEEP') {
      if (needsSwap) {
        // Incorrect decision
        triggerShake();
        setScore((s) => Math.max(100, s - 25));
        setFeedback({
          type: 'error',
          title: 'Incorrect Decision',
          message: `Not quite! ${leftCard.value} is greater than ${rightCard.value}, so they need to be swapped to achieve ascending order.`,
        });
      } else {
        // Correct KEEP
        soundEffects.playCorrect();
        setScore((s) => s + 50);
        setMoves((m) => m + 1);
        setFeedback({
          type: 'success',
          title: 'Correct! No Swap Needed',
          message: `${leftCard.value} is already smaller than or equal to ${rightCard.value}, so no swap is needed.`,
        });
        advanceToNextPair(cards);
      }
    } else if (decision === 'SWAP') {
      if (!needsSwap) {
        // Incorrect decision
        triggerShake();
        setScore((s) => Math.max(100, s - 25));
        setFeedback({
          type: 'error',
          title: 'Incorrect Decision',
          message: `No swap needed! ${leftCard.value} is already smaller than ${rightCard.value}. Keep them in this order to avoid breaking stability.`,
        });
      } else {
        // Correct SWAP decision: prompt manual swap action
        soundEffects.playCorrect();
        setScore((s) => s + 35);
        setCurrentAction('WAIT_FOR_DRAG_SWAP');
        setFeedback({
          type: 'info',
          title: 'Perform the Swap',
          message: `Now drag or click the greater number (${leftCard.value}) to physically swap it with ${rightCard.value}.`,
        });
      }
    }
  };

  // Physically perform the swap of complete card objects
  const executeCardSwap = () => {
    if (currentAction !== 'WAIT_FOR_DRAG_SWAP') return;

    soundEffects.playPush();
    setCurrentAction('ANIMATING_SWAP');
    setMoves((m) => m + 1);
    setScore((s) => s + 40);

    // Swap the cards at currentPairLeftIndex and currentPairRightIndex
    const newCards = [...cards];
    const temp = newCards[currentPairLeftIndex];
    newCards[currentPairLeftIndex] = newCards[currentPairRightIndex];
    newCards[currentPairRightIndex] = temp;

    // Update positions
    newCards[currentPairLeftIndex] = { ...newCards[currentPairLeftIndex], position: currentPairLeftIndex };
    newCards[currentPairRightIndex] = { ...newCards[currentPairRightIndex], position: currentPairRightIndex };

    setCards(newCards);

    setFeedback({
      type: 'success',
      title: 'Swap Successful!',
      message: `${temp.value} and ${newCards[currentPairLeftIndex].value} were swapped. The greater number moved right.`,
    });

    // Advance to next pair using the freshly swapped card array
    setTimeout(() => {
      advanceToNextPair(newCards);
    }, 600);
  };

  // Advance pointer to next pair or finish pass
  const advanceToNextPair = (latestCards: SortCardObject[]) => {
    setSelectedElements([]);
    const nextComp = currentComparison + 1;
    const totalComps = latestCards.length - currentPass;

    // Check if pass is finished
    if (nextComp >= totalComps) {
      // Pass is COMPLETE!
      // Increment sortedBoundary: this unlocks the newly finalized rightmost position
      const newSortedBoundary = sortedBoundary + 1;
      setSortedBoundary(newSortedBoundary);

      const isArraySorted = latestCards.every((c, i, arr) => i === 0 || arr[i - 1].value <= c.value);
      const isFinalPass = currentPass >= totalPasses && isArraySorted;

      if (isFinalPass) {
        // All passes complete -> Entire array is sorted!
        setGameComplete(true);
        setCurrentAction('GAME_COMPLETE');
        setTimerActive(false);
        soundEffects.playSuccess();
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        onCompleteLevel(
          level.xpReward,
          score,
          level.levelNumber === 5 ? 'All 5 Levels Mastered • Flawless Bubble Sort' : undefined
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
        }, 800);
        return;
      }

      // Pass completed!
      setCurrentAction('PASS_COMPLETE');
      soundEffects.playCorrect();
      const lockedIdx = latestCards.length - newSortedBoundary;
      const lockedVal = latestCards[lockedIdx]?.value;
      setFeedback({
        type: 'success',
        title: `Pass ${currentPass} Complete!`,
        message: `The largest unsorted element (${lockedVal}) has reached its final sorted position at index ${lockedIdx}.`,
      });

      // Advance to next pass after brief celebration
      setTimeout(() => {
        setCurrentPass((p) => p + 1);
        setCurrentComparison(0);
        setSelectedElements([]);
        setCurrentAction('HIGHLIGHT_PAIR');
        setFeedback({
          type: 'info',
          title: `Starting Pass ${currentPass + 1}`,
          message: 'Compare the first adjacent pair in the remaining unsorted section.',
        });
      }, 1200);
    } else {
      // Continue next pair in current pass
      setCurrentComparison(nextComp);
      setCurrentAction('HIGHLIGHT_PAIR');
      setFeedback({
        type: 'info',
        title: `Pass ${currentPass} • Comparison ${nextComp + 1} / ${totalComps}`,
        message: 'Click the two highlighted adjacent cards to compare them.',
      });
    }
  };

  // Reset current problem
  const handleConfirmReset = () => {
    setCards(initializeCards(level.initialArray));
    setCurrentPass(1);
    setCurrentComparison(0);
    setSortedBoundary(0);
    setCurrentAction('HIGHLIGHT_PAIR');
    setSelectedElements([]);
    setGameComplete(false);
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
      message: 'Array reset to initial state. Compare the highlighted pair.',
    });
  };

  // Provide contextual hint
  const handleUseHint = () => {
    soundEffects.playClick();
    const nextTier = Math.min(hintTier + 1, 3);
    setHintTier(nextTier);
    setHintsUsed((h) => h + 1);
    setScore((s) => Math.max(50, s - 20));
    setShowHintModal(true);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* ─── GAME HEADER BAR ─── */}
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
              <span>BUBBLE SORT</span>
              <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                LV {level.levelNumber}
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Task: Sort elements in ascending order step-by-step.
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
              Moves: <span className="font-mono text-slate-900 dark:text-white">{moves}</span>
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
            ) : feedback.type === 'warning' ? (
              <AlertTriangle className="w-5 h-5 text-amber-600" />
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

      {/* ─── MAIN INTERACTIVE CARDS WORKSPACE ─── */}
      <div
        className={`bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-xs relative transition-transform ${
          isShaking ? 'animate-shake' : ''
        }`}
      >
        {/* Pass & Comparison Tracker Banner */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 text-xs font-bold text-slate-700 dark:text-slate-300">
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono">
              Pass: {currentPass} / {totalPasses}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono">
              Comparison: {Math.min(currentComparison + 1, totalComparisonsInPass)} / {totalComparisonsInPass}
            </span>
          </div>

          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {currentAction === 'COMPARE_DECIDE'
              ? 'Decide Action: SWAP or KEEP'
              : currentAction === 'WAIT_FOR_DRAG_SWAP'
              ? 'Action Required: Drag Greater Card'
              : 'Click Highlighted Pair'}
          </div>
        </div>

        {/* Physical Animated Cards Row */}
        <div className="flex items-center justify-center gap-2 sm:gap-3.5 py-6 overflow-x-auto custom-scrollbar min-h-[160px]">
          {renderedCards.map((card, idx) => {
            const isPairMember = idx === currentPairLeftIndex || idx === currentPairRightIndex;
            const isSelected = selectedElements?.includes(idx);
            const isDragTarget = currentAction === 'WAIT_FOR_DRAG_SWAP' && idx === currentPairRightIndex;
            const isDragItem = currentAction === 'WAIT_FOR_DRAG_SWAP' && idx === currentPairLeftIndex;

            return (
              <SortingCard
                key={card.id}
                card={card}
                index={idx}
                isSelected={isSelected}
                isPairHighlighted={isPairMember && !card.isSorted}
                isDragCandidate={isDragItem}
                isDropTarget={isDragTarget}
                onCardClick={() => {
                  if (currentAction === 'WAIT_FOR_DRAG_SWAP' && isDragItem) {
                    executeCardSwap();
                  } else {
                    handleCardClick(idx);
                  }
                }}
              />
            );
          })}
        </div>

        {/* Action Decision Control Bar */}
        <AnimatePresence>
          {currentAction === 'COMPARE_DECIDE' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center gap-3"
            >
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                In ascending order, the greater number should move to the right. What should you do?
              </p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleDecision('SWAP')}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/25 cursor-pointer active:scale-95 transition-all flex items-center gap-2"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                  <span>[ SWAP ]</span>
                </button>
                <button
                  onClick={() => handleDecision('KEEP')}
                  className="px-6 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-extrabold text-xs cursor-pointer active:scale-95 transition-all flex items-center gap-2"
                >
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>[ KEEP ]</span>
                </button>
              </div>
            </motion.div>
          )}

          {currentAction === 'WAIT_FOR_DRAG_SWAP' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center gap-3 text-center"
            >
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs">
                <ArrowRight className="w-4 h-4 animate-pulse" />
                <span>Now drag or click the greater card ({leftCard.value}) to physically swap with {rightCard.value}!</span>
              </div>
              <button
                onClick={executeCardSwap}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-xs shadow-md shadow-blue-500/30 cursor-pointer active:scale-95 transition-all flex items-center gap-2"
              >
                <ArrowRightLeft className="w-4 h-4" />
                <span>Perform Swap ({leftCard.value} ⇄ {rightCard.value})</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── FOOTER CONTROLS: HINT & RESET PROBLEM ─── */}
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
                    Contextual Hint (Tier {hintTier}/3)
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
                  Got It, Continue
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── RESET CONFIRMATION MODAL ─── */}
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
                This will reset the current array, moves, and timer back to the starting state. Your completed levels and overall progress will NOT be affected.
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
        gameId="bubble-sort"
        isOpen={showGuidedSolve}
        onClose={handleCloseGuidedSolve}
      />
    </div>
  );
};
