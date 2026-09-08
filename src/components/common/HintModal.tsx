import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lightbulb, ChevronRight, X, Sparkles, HelpCircle } from 'lucide-react';
import { soundEffects } from '../../services/sound';

interface HintModalProps {
  isOpen: boolean;
  onClose: () => void;
  hints: [string, string, string]; // [Concept, Direction, Strong]
  contextHint?: string | null;
}

export const HintModal: React.FC<HintModalProps> = ({
  isOpen,
  onClose,
  hints,
  contextHint,
}) => {
  const [revealedLevel, setRevealedLevel] = useState<number>(1);

  if (!isOpen) return null;

  const handleRevealNext = () => {
    soundEffects.playClick();
    if (revealedLevel < 3) {
      setRevealedLevel((prev) => prev + 1);
    }
  };

  const hintStages = [
    {
      level: 1,
      name: 'Stage 1: Concept Reminder',
      text: hints[0] || 'Remember the fundamental LIFO principle of Stacks.',
      badge: 'Concept',
      color: 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200',
    },
    {
      level: 2,
      name: 'Stage 2: Directional Guidance',
      text: hints[1] || 'Focus on how the operation interacts with the TOP index.',
      badge: 'Direction',
      color: 'bg-amber-50 dark:bg-amber-950/70 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200',
    },
    {
      level: 3,
      name: 'Stage 3: Direct Solution Clue',
      text: hints[2] || 'Identify the specific value at the TOP and execute the target action.',
      badge: 'Strong',
      color: 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200',
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">3-Stage Progressive Hint System</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Unlocks gentle conceptual hints to direct clues</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Dynamic Context Hint if triggered by user action */}
            {contextHint && (
              <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-200 text-xs flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-0.5">Live Context Observation:</span>
                  <span>{contextHint}</span>
                </div>
              </div>
            )}

            {/* Stages */}
            {hintStages.map((stage) => {
              const isUnlocked = revealedLevel >= stage.level;

              return (
                <div
                  key={stage.level}
                  className={`p-4 rounded-xl border transition-all ${
                    isUnlocked
                      ? stage.color
                      : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold flex items-center gap-1.5">
                      {isUnlocked ? (
                        <Lightbulb className="w-3.5 h-3.5" />
                      ) : (
                        <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                      )}
                      {stage.name}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        isUnlocked ? 'bg-white/80 dark:bg-slate-900/80 text-slate-900 dark:text-slate-100' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {isUnlocked ? stage.badge : 'Locked'}
                    </span>
                  </div>

                  {isUnlocked ? (
                    <p className="text-xs leading-relaxed font-medium">{stage.text}</p>
                  ) : (
                    <p className="text-xs text-slate-400 dark:text-slate-500 italic">
                      Click below to reveal this progressive clue if needed.
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Revealed {revealedLevel} of 3 hints
            </span>

            <div className="flex items-center gap-2">
              {revealedLevel < 3 && (
                <button
                  onClick={handleRevealNext}
                  className="px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100 dark:hover:bg-indigo-900/70 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  Reveal Next Hint ({revealedLevel + 1}/3)
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={onClose}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Got It, Return to Game
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
