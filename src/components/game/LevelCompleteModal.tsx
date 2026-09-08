import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Star, ArrowRight, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import { GameLevelConfig } from '../../types';

interface LevelCompleteModalProps {
  isOpen: boolean;
  level: GameLevelConfig;
  xpEarned: number;
  mistakes: number;
  hasNextLevel: boolean;
  onNextLevel: () => void;
  onReplayLevel: () => void;
  onClose: () => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  isOpen,
  level,
  xpEarned,
  mistakes,
  hasNextLevel,
  onNextLevel,
  onReplayLevel,
  onClose,
}) => {
  if (!isOpen) return null;

  const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5"
        >
          {/* Trophy Header Badge */}
          <div className="w-18 h-18 rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-amber-200 dark:shadow-amber-950/60">
            <Trophy className="w-9 h-9" />
          </div>

          <div>
            <span className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
              Level Mastered!
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-2">
              {level.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {level.subtitle}
            </p>
          </div>

          {/* Stars Rating */}
          <div className="flex items-center justify-center gap-2 py-1">
            {Array.from({ length: 3 }).map((_, idx) => (
              <Star
                key={idx}
                className={`w-7 h-7 ${
                  idx < stars
                    ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                    : 'text-slate-200 dark:text-slate-700'
                }`}
              />
            ))}
          </div>

          {/* Stats Box */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 grid grid-cols-2 gap-4">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Reward
              </span>
              <span className="text-lg font-black text-indigo-600 dark:text-indigo-400 font-mono flex items-center justify-center gap-1 mt-0.5">
                <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                +{xpEarned} XP
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Accuracy
              </span>
              <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 block">
                {mistakes === 0 ? '100% (Flawless)' : `${Math.max(60, 100 - mistakes * 15)}%`}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2.5 pt-2">
            {hasNextLevel ? (
              <button
                onClick={onNextLevel}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl text-xs sm:text-sm font-black uppercase tracking-wide transition-all shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <span>NEXT LEVEL</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs sm:text-sm font-black uppercase tracking-wide transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>FINISH ALL CHALLENGES</span>
              </button>
            )}

            <div className="flex gap-2">
              <button
                onClick={onReplayLevel}
                className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Replay Level</span>
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Back to Levels
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
