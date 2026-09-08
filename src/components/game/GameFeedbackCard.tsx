import React from 'react';
import { CheckCircle2, AlertTriangle, ArrowRight, Sparkles, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GameFeedbackCardProps {
  status: 'correct' | 'incorrect' | null;
  title: string;
  actionText: string;
  lifoReason: string;
  xpEarned?: number;
  onNextChallenge?: () => void;
  onRetry?: () => void;
  isLastChallenge?: boolean;
}

export const GameFeedbackCard: React.FC<GameFeedbackCardProps> = ({
  status,
  title,
  actionText,
  lifoReason,
  xpEarned,
  onNextChallenge,
  onRetry,
  isLastChallenge = false,
}) => {
  if (!status) return null;

  const isCorrect = status === 'correct';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.98 }}
        className={`p-4 sm:p-5 rounded-2xl border-2 transition-all shadow-sm ${
          isCorrect
            ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-100'
            : 'bg-red-50 dark:bg-red-950/50 border-red-300 dark:border-red-700 text-red-950 dark:text-red-100'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                isCorrect
                  ? 'bg-emerald-500 text-white'
                  : 'bg-red-500 text-white'
              }`}
            >
              {isCorrect ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                <AlertTriangle className="w-6 h-6" />
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-extrabold tracking-tight">
                  {title}
                </h4>
                {isCorrect && xpEarned && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-200/80 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-700 dark:text-emerald-300" />
                    +{xpEarned} XP
                  </span>
                )}
              </div>

              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                {actionText}
              </p>

              <p className="text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong>Why?</strong> {lifoReason}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            {!isCorrect && onRetry && (
              <button
                onClick={onRetry}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/60 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>
            )}

            {isCorrect && onNextChallenge && (
              <button
                onClick={onNextChallenge}
                className="px-4 py-2.5 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>{isLastChallenge ? 'Complete Level' : 'Next Challenge'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
