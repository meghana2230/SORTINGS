import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Check,
  Lock,
  Play,
  Trophy,
  ChevronRight,
} from 'lucide-react';
import { SortGameId, UserProgress } from '../../types';
import { SORT_GAMES } from '../../data/sortGameData';
import { soundEffects } from '../../services/sound';

interface ConnectedLevelMapProps {
  gameId: SortGameId;
  progress: UserProgress;
  onBackToGames: () => void;
  onSelectLevel: (levelNumber: number) => void;
}

export const ConnectedLevelMap: React.FC<ConnectedLevelMapProps> = ({
  gameId,
  progress,
  onBackToGames,
  onSelectLevel,
}) => {
  const game = SORT_GAMES.find((g) => g.id === gameId) || SORT_GAMES[0];
  const completedLevels = Array.isArray(progress?.sortGameProgress?.[gameId])
    ? progress.sortGameProgress[gameId]
    : [];

  // Progression checks: Level 1 always unlocked, Level N unlocked if Level N-1 completed
  const isLevelUnlocked = (lvlNum: number): boolean => {
    if (lvlNum === 1) return true;
    return completedLevels.includes(lvlNum - 1);
  };

  const isLevelCompleted = (lvlNum: number): boolean => {
    return completedLevels.includes(lvlNum);
  };

  const currentActiveLevel =
    game.levels.find(
      (lvl) => isLevelUnlocked(lvl.levelNumber) && !isLevelCompleted(lvl.levelNumber)
    )?.levelNumber || (completedLevels.length >= game.totalLevels ? game.totalLevels : 1);

  return (
    <div className="space-y-5 max-w-5xl mx-auto pb-16">
      {/* ─── TOP BAR: BACK NAVIGATION & STATS ─── */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            soundEffects.playClick();
            onBackToGames();
          }}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-bold text-xs shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>All Games</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <Trophy className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>
            {completedLevels.length} of {game.totalLevels} Completed
          </span>
        </div>
      </div>

      {/* ─── COMPACT ALGORITHM HEADER CARD (NO ICON BEFORE TITLE) ─── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-200/60 dark:border-blue-900/50">
                {game.subtitle}
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Level Selection
              </span>
            </div>
            {/* Title with NO icon before algorithm name */}
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              {game.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl font-normal leading-relaxed">
              {game.description} Select an unlocked level below to begin.
            </p>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-slate-100 dark:border-slate-800 pt-2 sm:pt-0 shrink-0">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Progression</span>
            <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">
              {Math.round((completedLevels.length / game.totalLevels) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* ─── COMPACT LEVEL CARDS ─── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden">
        {/* Section Header */}
        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Levels
            </span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Choose Level
            </span>
          </div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
            <span>Click any unlocked level</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>

        {/* Compact Horizontal Level Cards Container */}
        <div className="w-full overflow-x-auto custom-scrollbar p-4 sm:p-5">
          <div className="flex items-center gap-3 min-w-max mx-auto justify-start sm:justify-center">
            {game.levels.map((level, idx) => {
              const unlocked = isLevelUnlocked(level.levelNumber);
              const completed = isLevelCompleted(level.levelNumber);
              const isCurrent = level.levelNumber === currentActiveLevel && !completed;
              const hasNext = idx < game.levels.length - 1;

              return (
                <React.Fragment key={level.levelNumber}>
                  {/* Compact Level Card */}
                  <motion.div
                    whileHover={unlocked ? { y: -2 } : {}}
                    whileTap={unlocked ? { scale: 0.98 } : {}}
                    onClick={() => {
                      if (unlocked) {
                        soundEffects.playClick();
                        onSelectLevel(level.levelNumber);
                      }
                    }}
                    className={`relative w-36 sm:w-40 p-3.5 rounded-xl border transition-all select-none flex flex-col justify-between ${
                      unlocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                    } ${
                      isCurrent
                        ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700 ring-2 ring-blue-500/20 shadow-xs'
                        : completed
                        ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                        : unlocked
                        ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800'
                    }`}
                  >
                    {/* Top Row: Level Number + Status Icon */}
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className="text-[11px] font-mono font-extrabold uppercase text-slate-700 dark:text-slate-300">
                        L{level.levelNumber}
                      </span>
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs ${
                          completed
                            ? 'bg-emerald-500 text-white'
                            : isCurrent
                            ? 'bg-blue-600 text-white shadow-xs'
                            : unlocked
                            ? 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                        }`}
                      >
                        {completed ? (
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        ) : unlocked ? (
                          <Play className="w-3 h-3 fill-current ml-0.5" />
                        ) : (
                          <Lock className="w-3 h-3" />
                        )}
                      </div>
                    </div>

                    {/* Level Title */}
                    <div className="space-y-1 mb-2">
                      <span
                        className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                          completed
                            ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300'
                            : isCurrent
                            ? 'bg-blue-100 dark:bg-blue-900/70 text-blue-700 dark:text-blue-300'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {level.label}
                      </span>
                      <h4 className="text-[11px] font-bold text-slate-800 dark:text-slate-200 line-clamp-1 leading-tight">
                        {level.title}
                      </h4>
                    </div>

                    {/* Footer Row: XP & Status */}
                    <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 dark:border-slate-700/60 text-[10px]">
                      <span className="font-mono font-semibold text-amber-600 dark:text-amber-400">
                        +{level.xpReward} XP
                      </span>
                      <span
                        className={`font-bold ${
                          completed
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : isCurrent
                            ? 'text-blue-600 dark:text-blue-400'
                            : unlocked
                            ? 'text-slate-600 dark:text-slate-300'
                            : 'text-slate-400'
                        }`}
                      >
                        {completed ? 'Done' : isCurrent ? 'Play' : unlocked ? 'Ready' : 'Locked'}
                      </span>
                    </div>
                  </motion.div>

                  {/* Compact connector */}
                  {hasNext && (
                    <div
                      className={`hidden sm:block w-3 h-0.5 rounded-full shrink-0 ${
                        isLevelUnlocked(game.levels[idx + 1].levelNumber)
                          ? 'bg-blue-400 dark:bg-blue-600'
                          : 'bg-slate-200 dark:bg-slate-700'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
