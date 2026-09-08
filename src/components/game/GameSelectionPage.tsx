import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Trophy,
  CheckCircle2,
} from 'lucide-react';
import { SortGameId, UserProgress } from '../../types';
import { SORT_GAMES } from '../../data/sortGameData';
import { soundEffects } from '../../services/sound';

interface GameSelectionPageProps {
  progress: UserProgress;
  onSelectGame: (gameId: SortGameId) => void;
}

export const GameSelectionPage: React.FC<GameSelectionPageProps> = ({
  progress,
  onSelectGame,
}) => {
  const getCompletedCount = (gameId: SortGameId): number => {
    const list = progress.sortGameProgress?.[gameId];
    return Array.isArray(list) ? list.length : 0;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* ─── HEADER BANNER ─── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-900/50">
                Interactive DSA Arcade
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-600">•</span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                5 Game Disciplines
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              SORT MASTER
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Learn sorting algorithms by <strong className="font-semibold text-slate-800 dark:text-slate-100">performing them step-by-step</strong>.
              Compare, shift, select, and conquer interactive card challenges with connected level progression.
            </p>
          </div>

          {/* Quick Stats Widget */}
          <div className="flex items-center gap-3.5 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-xs">
              <Trophy className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total XP Earned
              </div>
              <div className="text-lg font-mono font-black text-slate-900 dark:text-white">
                {progress.xp} XP
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 5 INTERACTIVE GAME CARDS (NO ICONS BEFORE ALGORITHM NAMES) ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {SORT_GAMES.map((game, index) => {
          const completedCount = getCompletedCount(game.id);
          const percent = Math.round((completedCount / game.totalLevels) * 100);

          return (
            <motion.div
              key={game.id}
              whileHover={{ y: -3, transition: { duration: 0.18 } }}
              onClick={() => {
                soundEffects.playClick();
                onSelectGame(game.id);
              }}
              className={`group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-600/80 transition-all cursor-pointer flex flex-col justify-between ${
                index === 0 || index === 3 ? 'md:col-span-1' : ''
              }`}
            >
              <div className="space-y-3">
                {/* Top Row: Progress Badge (No icon before algorithm title) */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200/60 dark:border-slate-700/60">
                    <CheckCircle2 className={`w-3 h-3 ${completedCount > 0 ? 'text-emerald-500' : 'text-slate-400'}`} />
                    <span>{completedCount} / {game.totalLevels} Levels</span>
                  </div>

                  <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    {game.totalLevels * 50} XP
                  </span>
                </div>

                {/* Title & Subtitle (Clean, No Icon Before Algorithm Name) */}
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {game.title}
                  </h3>
                  <div className="text-[11px] font-bold tracking-wide text-indigo-600 dark:text-indigo-400 mt-0.5">
                    {game.subtitle}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  "{game.description}"
                </p>
              </div>

              {/* Bottom Row: Progress Bar + Play Button */}
              <div className="pt-3.5 mt-3.5 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                    <span>Progression</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{percent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-0.5">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {completedCount === 0 ? 'Start Level 1' : completedCount === game.totalLevels ? 'Replay Levels' : `Continue Level ${completedCount + 1}`}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
