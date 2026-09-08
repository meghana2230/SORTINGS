import React, { useState } from 'react';
import { Lightbulb, Sparkles } from 'lucide-react';
import { GameChallenge } from '../../types';

interface QuestionCardProps {
  challenge: GameChallenge;
  onOpenGuidedSolve?: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ challenge, onOpenGuidedSolve }) => {
  const [showHint, setShowHint] = useState<boolean>(false);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-2">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2.5 py-0.5 rounded-md border border-blue-200 dark:border-blue-800">
            {challenge.mode.toUpperCase()} MODE
          </span>

          {onOpenGuidedSolve && (
            <button
              onClick={onOpenGuidedSolve}
              className="text-xs font-bold text-amber-800 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 px-2.5 py-0.5 rounded-md border border-amber-200 dark:border-amber-800 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>GUIDED SOLVE</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {challenge.hint && (
            <button
              onClick={() => setShowHint((prev) => !prev)}
              className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Lightbulb className="w-3 h-3 text-slate-500" />
              <span>{showHint ? 'Hide Hint' : 'Hint'}</span>
            </button>
          )}

          <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
            <Sparkles className="w-3 h-3 fill-amber-500" />
            +{challenge.xpReward} XP
          </span>
        </div>
      </div>

      <div>
        <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
          {challenge.question}
        </h2>
        <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
          {challenge.instruction}
        </p>
      </div>

      {showHint && challenge.hint && (
        <div className="mt-2 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-900 dark:text-amber-200 animate-in fade-in duration-150 space-y-1">
          <div className="font-bold flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>Hint:</span>
          </div>
          <p>{challenge.hint.thoughtPrompt}</p>
        </div>
      )}
    </div>
  );
};
