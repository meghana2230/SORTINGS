import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Clock,
  Award,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  Layers,
  Flame,
  Gamepad2,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Lightbulb,
} from 'lucide-react';
import { GameMetaData } from '../../data/gameMeta';
import { MiniStackPreview } from './MiniStackPreview';
import { soundEffects } from '../../services/sound';

interface GamePreviewModalProps {
  game: GameMetaData | null;
  isOpen: boolean;
  isCompleted: boolean;
  isInProgress: boolean;
  currentChallengeProgress?: { current: number; total: number };
  onClose: () => void;
  onStartGame: (gameId: number) => void;
  onOpenGuidedSolve?: (gameId: number) => void;
}

export const GamePreviewModal: React.FC<GamePreviewModalProps> = ({
  game,
  isOpen,
  isCompleted,
  isInProgress,
  currentChallengeProgress,
  onClose,
  onStartGame,
  onOpenGuidedSolve,
}) => {
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);

  if (!isOpen || !game) return null;

  const handleStart = () => {
    soundEffects.playClick();
    onStartGame(game.id);
  };

  const handleGuidedSolve = () => {
    soundEffects.playClick();
    if (onOpenGuidedSolve) {
      onOpenGuidedSolve(game.id);
    }
  };

  const difficultyColor =
    game.difficulty === 'Beginner'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800'
      : game.difficulty === 'Intermediate'
      ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/70 dark:text-blue-300 dark:border-blue-800'
      : 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/70 dark:text-indigo-300 dark:border-indigo-800';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 max-w-xl w-full shadow-2xl space-y-5 my-8 transition-all animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Close and Tag */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                Level 0{game.levelNumber}
              </span>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${difficultyColor}`}>
                {game.difficulty}
              </span>
              {isCompleted && (
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Completed
                </span>
              )}
              {!isCompleted && isInProgress && (
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800 flex items-center gap-1">
                  <Flame className="w-3 h-3" /> In Progress
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {game.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              {game.subtitle}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            title="Close Preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Metadata Bar */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 py-2 px-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
          <div className="flex flex-col items-center justify-center p-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">Duration</span>
            <div className="flex items-center gap-1 text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              <span>{game.duration}</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-1 border-x border-slate-200 dark:border-slate-700/60">
            <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">XP Reward</span>
            <div className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 mt-0.5">
              <Sparkles className="w-3.5 h-3.5 fill-amber-500" />
              <span>+{game.xpReward} XP</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">Hints</span>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>3 Stages</span>
            </div>
          </div>
        </div>

        {/* Short Explanation & Objective */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Challenge Objective
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
            {game.detailedObjective}
          </p>
        </div>

        {/* Skills Learned Pill List */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Skills Mastered
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {game.skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-blue-50/70 dark:bg-blue-950/50 border border-blue-200/70 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Miniature Interactive Stack Preview */}
        <MiniStackPreview game={game} />

        {/* How to play Accordion / Drawer */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all">
          <button
            onClick={() => {
              soundEffects.playClick();
              setShowHowToPlay((prev) => !prev);
            }}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>HOW TO PLAY ({game.shortTitle})</span>
            </div>
            {showHowToPlay ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {showHowToPlay && (
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-2.5 text-xs text-slate-600 dark:text-slate-300 animate-in fade-in duration-150">
              {game.howToPlay.map((step) => (
                <div key={step.stepNumber} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {step.stepNumber}
                  </span>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {step.title}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                      {step.description}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
          <button
            onClick={() => {
              soundEffects.playClick();
              setShowHowToPlay((prev) => !prev);
            }}
            className="w-full sm:w-auto px-3.5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>{showHowToPlay ? 'Hide Rules' : 'How to Play'}</span>
          </button>

          {onOpenGuidedSolve && (
            <button
              onClick={handleGuidedSolve}
              className="w-full sm:w-auto px-4 py-3 rounded-xl border border-amber-300 dark:border-amber-700/80 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-200 text-xs font-extrabold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-[0.99]"
            >
              <Lightbulb className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>GUIDED SOLVE</span>
            </button>
          )}

          <button
            onClick={handleStart}
            className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 hover:from-blue-800 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md hover:shadow-blue-500/20 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
          >
            <Gamepad2 className="w-4 h-4 text-amber-300" />
            <span>{isCompleted ? 'PLAY AGAIN' : isInProgress ? 'CONTINUE CHALLENGE' : 'START GAME'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
