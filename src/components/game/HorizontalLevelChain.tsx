import React from 'react';
import { ArrowLeft, Check, Lock } from 'lucide-react';
import { soundEffects } from '../../services/sound';

interface HorizontalLevelChainProps {
  gameTitle: string;
  totalLevels: number;
  activeLevelNumber: number;
  completedLevels: number[];
  onSelectLevel: (levelNumber: number) => void;
  onBackToGames: () => void;
}

export const HorizontalLevelChain: React.FC<HorizontalLevelChainProps> = ({
  gameTitle,
  totalLevels,
  activeLevelNumber,
  completedLevels = [],
  onSelectLevel,
  onBackToGames,
}) => {
  const safeCompleted = Array.isArray(completedLevels) ? completedLevels : [];
  const levels = Array.from({ length: totalLevels }, (_, i) => i + 1);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-3.5 sm:p-4 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-3.5 border-b border-slate-100 dark:border-slate-800">
        {/* Left: Back button + Game Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundEffects.playClick();
              onBackToGames();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Games</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                {gameTitle}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800">
                Level {activeLevelNumber} / {totalLevels}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Progression status summary */}
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-2 self-end sm:self-auto">
          <span>Completed:</span>
          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
            {safeCompleted.length} / {totalLevels}
          </span>
        </div>
      </div>

      {/* ─── HORIZONTAL LEVEL PROGRESSION CHAIN ─── */}
      <div className="pt-3 pb-1 flex items-center justify-center">
        <div className="flex items-center justify-center w-full max-w-lg px-2 sm:px-4">
          {levels.map((lvl, index) => {
            const isCompleted = safeCompleted.includes(lvl);
            const isActive = activeLevelNumber === lvl;
            const isUnlocked = lvl === 1 || safeCompleted.includes(lvl - 1);
            const isLocked = !isUnlocked;
            const isLast = index === levels.length - 1;

            // Connector line state
            const isLineColored = isCompleted;

            return (
              <React.Fragment key={lvl}>
                {/* Circular Level Node */}
                <div className="flex flex-col items-center group relative">
                  <button
                    disabled={isLocked}
                    onClick={() => {
                      if (!isLocked && lvl !== activeLevelNumber) {
                        soundEffects.playClick();
                        onSelectLevel(lvl);
                      }
                    }}
                    title={
                      isLocked
                        ? `Level ${lvl} (Locked - Complete Level ${lvl - 1} first)`
                        : isCompleted
                        ? `Level ${lvl} (Completed - Click to play)`
                        : `Level ${lvl} (Playable)`
                    }
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all relative select-none ${
                      isActive
                        ? 'bg-blue-600 text-white border-2 border-blue-300 ring-4 ring-blue-500/25 shadow-md shadow-blue-500/25 scale-105 cursor-default'
                        : isCompleted
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-2 border-emerald-400 shadow-xs cursor-pointer active:scale-95'
                        : isUnlocked
                        ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border-2 border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 shadow-xs cursor-pointer active:scale-95'
                        : 'bg-slate-100 dark:bg-slate-800/60 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700/60 cursor-not-allowed opacity-60'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : isLocked ? (
                      <Lock className="w-3.5 h-3.5" />
                    ) : (
                      <span>{lvl}</span>
                    )}
                  </button>

                  {/* Level label underneath circular node */}
                  <span
                    className={`text-[10px] font-bold mt-1 tracking-tight whitespace-nowrap ${
                      isActive
                        ? 'text-blue-600 dark:text-blue-400'
                        : isCompleted
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : isLocked
                        ? 'text-slate-400 dark:text-slate-600'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    L{lvl}
                  </span>
                </div>

                {/* Horizontal Connecting Line between circular nodes */}
                {!isLast && (
                  <div className="flex-1 mx-1.5 sm:mx-2.5 -mt-3.5">
                    <div
                      className={`h-1 w-full rounded-full transition-colors duration-300 ${
                        isLineColored
                          ? 'bg-emerald-500'
                          : 'bg-slate-200 dark:bg-slate-700/60'
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
