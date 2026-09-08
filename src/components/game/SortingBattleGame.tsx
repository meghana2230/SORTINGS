import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Swords,
  Shield,
  Zap,
  Check,
  AlertCircle,
  ArrowRight,
  Trophy,
  Sparkles,
  RotateCcw,
  Lightbulb,
} from 'lucide-react';
import { SortLevelConfig, UserProgress } from '../../types';
import { BubbleSortGame } from './BubbleSortGame';
import { SelectionSortGame } from './SelectionSortGame';
import { InsertionSortGame } from './InsertionSortGame';
import { soundEffects } from '../../services/sound';
import { GuidedSolveModal } from './GuidedSolveModal';

interface SortingBattleGameProps {
  level: SortLevelConfig;
  progress: UserProgress;
  onCompleteLevel: (earnedXP: number, score?: number, performanceMetrics?: string) => void;
  onBackToLevels: () => void;
  onNextLevel?: () => void;
}

type AlgorithmChoice = 'bubble' | 'selection' | 'insertion';

export const SortingBattleGame: React.FC<SortingBattleGameProps> = ({
  level,
  progress,
  onCompleteLevel,
  onBackToLevels,
  onNextLevel,
}) => {
  const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmChoice | null>(null);
  const [inBattleMode, setInBattleMode] = useState<boolean>(false);
  const [analysisFeedback, setAnalysisFeedback] = useState<string | null>(null);
  const [isOptimalChoice, setIsOptimalChoice] = useState<boolean>(true);

  // Guided Solve guide modal state
  const [showGuidedSolve, setShowGuidedSolve] = useState<boolean>(false);

  const handleCloseGuidedSolve = () => {
    setShowGuidedSolve(false);
  };

  // Reset state on level change
  useEffect(() => {
    setSelectedAlgo(null);
    setInBattleMode(false);
    setAnalysisFeedback(null);
    setIsOptimalChoice(true);
  }, [level.levelNumber]);

  // Level-specific optimal algorithm evaluations
  const getAlgoEvaluation = (choice: AlgorithmChoice): { isOptimal: boolean; note: string } => {
    if (level.levelNumber === 2) {
      // Nearly sorted
      if (choice === 'insertion') {
        return {
          isOptimal: true,
          note: 'Optimal Strategy: Insertion Sort takes O(n) linear time on nearly-sorted arrays with minimal shifts.',
        };
      } else if (choice === 'selection') {
        return {
          isOptimal: false,
          note: 'Suboptimal: Selection Sort will still execute O(n²) comparisons even though the array is almost sorted.',
        };
      } else {
        return {
          isOptimal: false,
          note: 'Suboptimal: Bubble Sort can detect sortedness with an early-exit flag, but Insertion Sort is far more cache-optimal.',
        };
      }
    } else if (level.levelNumber === 3) {
      // Hardware write cycles
      if (choice === 'selection') {
        return {
          isOptimal: true,
          note: 'Optimal Strategy: Selection Sort makes at most n - 1 total swaps, drastically reducing Flash EEPROM wear.',
        };
      } else {
        return {
          isOptimal: false,
          note: 'Warning: This algorithm performs numerous swaps, accelerating flash wear. Selection Sort minimizes writes to n - 1 swaps.',
        };
      }
    } else {
      // General or tournament
      return {
        isOptimal: true,
        note: `Algorithm Selected: Execute ${choice.toUpperCase()} SORT step-by-step to conquer the battlefield.`,
      };
    }
  };

  const handleSelectAlgo = (choice: AlgorithmChoice) => {
    soundEffects.playClick();
    setSelectedAlgo(choice);
    const evalResult = getAlgoEvaluation(choice);
    setIsOptimalChoice(evalResult.isOptimal);
    setAnalysisFeedback(evalResult.note);
  };

  const handleStartBattle = () => {
    if (!selectedAlgo) return;
    soundEffects.playSuccess();
    setInBattleMode(true);
  };

  if (inBattleMode && selectedAlgo) {
    if (selectedAlgo === 'bubble') {
      return (
        <BubbleSortGame
          level={level}
          progress={progress}
          onCompleteLevel={onCompleteLevel}
          onBackToLevels={() => setInBattleMode(false)}
          onNextLevel={onNextLevel}
        />
      );
    } else if (selectedAlgo === 'selection') {
      return (
        <SelectionSortGame
          level={level}
          progress={progress}
          onCompleteLevel={onCompleteLevel}
          onBackToLevels={() => setInBattleMode(false)}
          onNextLevel={onNextLevel}
        />
      );
    } else {
      return (
        <InsertionSortGame
          level={level}
          progress={progress}
          onCompleteLevel={onCompleteLevel}
          onBackToLevels={() => setInBattleMode(false)}
          onNextLevel={onNextLevel}
        />
      );
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* ─── HEADER BAR ─── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundEffects.playClick();
              onBackToLevels();
            }}
            className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer"
          >
            ← Levels
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>SORTING BATTLE</span>
              <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                LV {level.levelNumber}
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Analyze constraints, choose the right algorithm, and execute to victory.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
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

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold font-mono">
            +{level.xpReward} XP Reward
          </div>
        </div>
      </div>

      {/* ─── SCENARIO BRIEF CARD ─── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-amber-600 dark:text-amber-400 tracking-wider">
          <Shield className="w-4 h-4" />
          <span>BATTLEFIELD SCENARIO</span>
        </div>

        <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
          {level.title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          {level.description}
        </p>

        {/* Challenge Array Cards Display */}
        <div className="pt-3">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Target Array Sequence
          </div>
          <div className="flex items-center gap-2 overflow-x-auto py-2">
            {level.initialArray.map((val, idx) => (
              <div
                key={idx}
                className="w-14 h-16 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center font-mono shrink-0 shadow-2xs"
              >
                <span className="text-[9px] text-slate-400 font-semibold">#{idx}</span>
                <span className="text-lg font-black text-slate-900 dark:text-slate-100">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── ALGORITHM SELECTION GRID ─── */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          Choose Your Sorting Strategy:
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Bubble Sort Option */}
          <div
            onClick={() => handleSelectAlgo('bubble')}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
              selectedAlgo === 'bubble'
                ? 'bg-blue-50/80 dark:bg-blue-950/60 border-blue-500 ring-2 ring-blue-400/40 shadow-md'
                : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-blue-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">Bubble Sort</span>
              {selectedAlgo === 'bubble' && <Check className="w-4 h-4 text-blue-600" />}
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Adjacent Swaps</h4>
            <p className="text-xs text-slate-500 mt-1">Bubble larger cards rightward via continuous adjacent exchanges.</p>
          </div>

          {/* Selection Sort Option */}
          <div
            onClick={() => handleSelectAlgo('selection')}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
              selectedAlgo === 'selection'
                ? 'bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-500 ring-2 ring-indigo-400/40 shadow-md'
                : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-indigo-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">Selection Sort</span>
              {selectedAlgo === 'selection' && <Check className="w-4 h-4 text-indigo-600" />}
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Minimum Placement</h4>
            <p className="text-xs text-slate-500 mt-1">Scan unsorted region for minimum and swap into place. (≤ n - 1 writes).</p>
          </div>

          {/* Insertion Sort Option */}
          <div
            onClick={() => handleSelectAlgo('insertion')}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
              selectedAlgo === 'insertion'
                ? 'bg-emerald-50/80 dark:bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-400/40 shadow-md'
                : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-emerald-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">Insertion Sort</span>
              {selectedAlgo === 'insertion' && <Check className="w-4 h-4 text-emerald-600" />}
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Predecessor Shifting</h4>
            <p className="text-xs text-slate-500 mt-1">Shift larger predecessor cards and drop in key. Adaptive O(n) best case.</p>
          </div>
        </div>
      </div>

      {/* ─── ANALYSIS & CONFIRMATION BUTTON ─── */}
      <AnimatePresence>
        {selectedAlgo && analysisFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-2xl border ${
              isOptimalChoice
                ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-200 text-emerald-900 dark:text-emerald-100'
                : 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-200 text-amber-900 dark:text-amber-100'
            }`}
          >
            <div className="flex items-start gap-2.5">
              <Zap className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" />
              <p className="text-xs sm:text-sm font-medium leading-relaxed">{analysisFeedback}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-end pt-2">
        <button
          disabled={!selectedAlgo}
          onClick={handleStartBattle}
          className={`px-7 py-3 rounded-2xl font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer ${
            selectedAlgo
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-amber-500/25 active:scale-95'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Swords className="w-4 h-4" />
          <span>ENTER BATTLE & EXECUTE ALGORITHM</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* ─── GUIDED SOLVE GUIDE MODAL ─── */}
      <GuidedSolveModal
        gameId="sorting-battle"
        isOpen={showGuidedSolve}
        onClose={handleCloseGuidedSolve}
      />
    </div>
  );
};
