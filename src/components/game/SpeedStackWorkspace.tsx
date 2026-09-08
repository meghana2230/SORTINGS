import React from 'react';
import { Clock, Zap, Trophy, Trash2, ArrowUp, Flame } from 'lucide-react';
import { StackItem } from '../../types';
import { StackVisualizer } from '../common/StackVisualizer';

interface SpeedStackWorkspaceProps {
  isRunning: boolean;
  timeLeft: number;
  score: number;
  combo: number;
  currentPromptIndex: number;
  totalPrompts: number;
  activePromptText: string;
  activePromptAction: 'PUSH' | 'POP';
  stack: StackItem[];
  availableElements: number[];
  onStartSpeed: () => void;
  onPushValue: (val: number) => void;
  onPopTop: () => void;
}

export const SpeedStackWorkspace: React.FC<SpeedStackWorkspaceProps> = ({
  isRunning,
  timeLeft,
  score,
  combo,
  currentPromptIndex,
  totalPrompts,
  activePromptText,
  activePromptAction,
  stack,
  availableElements,
  onStartSpeed,
  onPushValue,
  onPopTop,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-5">
      {/* Top Speed Status Bar: Timer, Combo Multiplier, Score */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
        <div className="flex items-center gap-2">
          <Clock className={`w-5 h-5 ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-blue-600 dark:text-blue-400'}`} />
          <span className="text-xs font-bold text-slate-500 uppercase">Time:</span>
          <span className={`text-xl font-mono font-black ${timeLeft <= 10 ? 'text-red-600 animate-pulse' : 'text-slate-900 dark:text-white'}`}>
            {timeLeft}s
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
          <span className="text-xs font-bold text-slate-500 uppercase">Combo:</span>
          <span className="text-xl font-mono font-black text-amber-600 dark:text-amber-400">
            {combo}x
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span className="text-xs font-bold text-slate-500 uppercase">Score:</span>
          <span className="text-xl font-mono font-black text-blue-600 dark:text-blue-400">
            {score}
          </span>
        </div>

        {!isRunning && timeLeft > 0 && (
          <button
            onClick={onStartSpeed}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs shadow-xs transition-colors cursor-pointer"
          >
            Start Speed Run
          </button>
        )}
      </div>

      {/* Target Action Banner */}
      {isRunning && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 text-white text-center shadow-md animate-pulse">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Flame className="w-4 h-4 text-amber-300 fill-amber-300" />
            <span className="text-[10px] uppercase font-black tracking-widest bg-white/20 px-2 py-0.5 rounded">
              SPEED TRIAL {currentPromptIndex + 1} / {totalPrompts}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black font-mono tracking-tight">
            {activePromptText}
          </h3>
        </div>
      )}

      {/* Interactive Controls & Stack Visualizer Grid */}
      {isRunning ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Quick Push Palette */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                PUSH PALETTE (Tap to Push):
              </span>
              <div className="grid grid-cols-5 gap-2">
                {availableElements.map((val) => (
                  <button
                    key={val}
                    onClick={() => onPushValue(val)}
                    className="h-12 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 rounded-xl font-mono font-bold text-xs text-slate-900 dark:text-white transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Pop Button */}
            <button
              onClick={onPopTop}
              className="w-full py-4 bg-red-50 hover:bg-red-100 dark:bg-red-950/50 dark:hover:bg-red-900/60 border-2 border-red-200 dark:border-red-800 rounded-2xl text-red-700 dark:text-red-300 font-black text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-2xs active:scale-98"
            >
              <Trash2 className="w-5 h-5" />
              <span>POP TOP ELEMENT</span>
            </button>
          </div>

          {/* Live Stack Column (6 cols) */}
          <div className="lg:col-span-6">
            <StackVisualizer
              items={stack}
              capacity={6}
              allowDragPop={false}
              customEmptyMessage="Speed stack empty. Follow active trial prompt."
            />
          </div>
        </div>
      ) : (
        <div className="text-center py-8 space-y-3">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Test your reaction time and LIFO mastery. Complete rapid push & pop actions before time runs out.
          </p>
          <button
            onClick={onStartSpeed}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-sm shadow-sm transition-all cursor-pointer"
          >
            Start Speed Run Challenge
          </button>
        </div>
      )}
    </div>
  );
};
