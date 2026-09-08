import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X, Sparkles, Layers, BookOpen, Gamepad2, HelpCircle, Flame } from 'lucide-react';
import { soundEffects } from '../../services/sound';

interface ResetConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReset: () => void;
}

export const ResetConfirmationModal: React.FC<ResetConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirmReset,
}) => {
  const cancelBtnRef = useRef<HTMLButtonElement>(null);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        soundEffects.playClick();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Autofocus the Cancel button when the modal opens for safety & keyboard accessibility
    const timeout = setTimeout(() => {
      cancelBtnRef.current?.focus();
    }, 50);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timeout);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs transition-opacity"
        onClick={(e) => {
          // Backdrop click closes the modal safely without resetting
          if (e.target === e.currentTarget) {
            soundEffects.playClick();
            onClose();
          }
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="reset-modal-title"
        aria-describedby="reset-modal-description"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 12 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden flex flex-col transition-colors select-none"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 flex items-center justify-center border border-red-200 dark:border-red-900/60 shrink-0 shadow-2xs">
                <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-600 dark:text-red-400 block">
                  Warning • Permanent Action
                </span>
                <h2
                  id="reset-modal-title"
                  className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight uppercase"
                >
                  RESET EVERYTHING?
                </h2>
              </div>
            </div>

            <button
              onClick={() => {
                soundEffects.playClick();
                onClose();
              }}
              title="Close modal (Esc)"
              aria-label="Close modal"
              className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-4">
            <p
              id="reset-modal-description"
              className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed"
            >
              This will permanently reset all your learning progress, including:
            </p>

            {/* List of items that will be cleared */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3.5 border border-slate-200/70 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>XP / EXP</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                <Layers className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                <span>Level progress</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                <BookOpen className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span>Completed lessons</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                <Gamepad2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Game progress</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                <HelpCircle className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span>Quiz progress</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                <Flame className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span>Achievements / streaks</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-red-50/80 dark:bg-red-950/40 border border-red-200/80 dark:border-red-900/40 text-red-700 dark:text-red-300 text-xs font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 animate-pulse" />
              <span>This action cannot be undone.</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-4 bg-slate-50/80 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800/80 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
            <button
              ref={cancelBtnRef}
              type="button"
              onClick={() => {
                soundEffects.playClick();
                onClose();
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold text-xs sm:text-sm border border-slate-300/80 dark:border-slate-700 transition-all cursor-pointer active:scale-95 shadow-2xs text-center"
            >
              CANCEL
            </button>

            <button
              type="button"
              onClick={() => {
                onConfirmReset();
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-black text-xs sm:text-sm tracking-wide transition-all cursor-pointer active:scale-95 shadow-xs flex items-center justify-center gap-2 text-center"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>RESET ALL</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
