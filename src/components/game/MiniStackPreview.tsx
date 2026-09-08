import React from 'react';
import { ArrowDown, ArrowUp, ArrowRight, Zap, Bug, Sparkles, Layers } from 'lucide-react';
import { GameMetaData } from '../../data/gameMeta';

interface MiniStackPreviewProps {
  game: GameMetaData;
}

export const MiniStackPreview: React.FC<MiniStackPreviewProps> = ({ game }) => {
  return (
    <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-4 sm:p-5 flex flex-col items-center justify-center min-h-[190px]">
      {/* Visual Header */}
      <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-700/60 text-xs text-slate-500 dark:text-slate-400">
        <span className="font-bold uppercase tracking-wider text-[10px] text-slate-400 dark:text-slate-500">
          Interactive Mechanism Preview
        </span>
        <span className="font-mono text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
          {game.interactionType}
        </span>
      </div>

      {/* GAME 1: POP MASTER MINI PREVIEW */}
      {game.id === 1 && (
        <div className="w-full max-w-sm flex items-center justify-center gap-6 sm:gap-8 py-2">
          {/* Stack column */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 mb-1.5 animate-bounce">
              <span>TOP</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </div>
            <div className="w-24 sm:w-28 border-x-2 border-b-2 border-slate-400 dark:border-slate-600 rounded-b-xl p-1.5 flex flex-col-reverse gap-1.5 bg-white dark:bg-slate-900 shadow-2xs">
              <div className="h-7 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-mono font-bold text-xs text-slate-700 dark:text-slate-300">
                20
              </div>
              <div className="h-7 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-mono font-bold text-xs text-slate-700 dark:text-slate-300">
                30
              </div>
              <div className="h-7 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-mono font-bold text-xs text-slate-700 dark:text-slate-300">
                40
              </div>
              <div className="h-7 rounded-lg bg-indigo-600 text-white border border-indigo-500 flex items-center justify-center font-mono font-bold text-xs shadow-xs ring-2 ring-indigo-200 dark:ring-indigo-900/50">
                50
              </div>
            </div>
          </div>

          {/* Drag arrow */}
          <div className="flex flex-col items-center text-slate-400 dark:text-slate-500">
            <ArrowRight className="w-5 h-5 text-indigo-600 dark:text-indigo-400 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider mt-1 text-slate-400">Drag TOP</span>
          </div>

          {/* POP Zone */}
          <div className="flex flex-col items-center">
            <div className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Target</div>
            <div className="w-24 sm:w-28 h-28 border-2 border-dashed border-indigo-400 dark:border-indigo-500/70 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 flex flex-col items-center justify-center p-2 text-center">
              <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 uppercase leading-tight">
                POP ZONE
              </span>
              <span className="text-[9px] text-slate-500 dark:text-slate-400 mt-1">
                Drop [50] here
              </span>
            </div>
          </div>
        </div>
      )}

      {/* GAME 2: PUSH MASTER MINI PREVIEW */}
      {game.id === 2 && (
        <div className="w-full max-w-sm flex flex-col items-center gap-3 py-1">
          {/* Incoming element */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500">Available:</span>
            <div className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-mono font-bold text-xs shadow-xs flex items-center gap-1.5">
              <span>30</span>
              <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
            </div>
          </div>

          {/* Stack with slot on top */}
          <div className="w-32 border-x-2 border-b-2 border-slate-400 dark:border-slate-600 rounded-b-xl p-1.5 flex flex-col-reverse gap-1.5 bg-white dark:bg-slate-900 shadow-2xs">
            <div className="h-7 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-mono font-bold text-xs text-slate-700 dark:text-slate-300">
              10
            </div>
            <div className="h-7 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-mono font-bold text-xs text-slate-700 dark:text-slate-300">
              20
            </div>
            <div className="h-7 rounded-lg border-2 border-dashed border-indigo-400 dark:border-indigo-500/70 bg-indigo-50/50 dark:bg-indigo-950/30 flex items-center justify-center font-mono font-bold text-[11px] text-indigo-700 dark:text-indigo-300">
              + PUSH HERE
            </div>
          </div>
        </div>
      )}

      {/* GAME 3: BUILD THE STACK MINI PREVIEW */}
      {game.id === 3 && (
        <div className="w-full max-w-md flex items-center justify-center gap-6 sm:gap-8 py-2">
          {/* Target Reference */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold uppercase text-slate-400 mb-1.5">Required Target</span>
            <div className="w-24 sm:w-28 border-x-2 border-b-2 border-slate-300 dark:border-slate-700 rounded-b-xl p-1.5 flex flex-col-reverse gap-1 bg-slate-100 dark:bg-slate-800/40 opacity-80">
              <div className="h-6 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-mono text-[11px] font-bold text-slate-600 dark:text-slate-300">10 (Bottom)</div>
              <div className="h-6 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-mono text-[11px] font-bold text-slate-600 dark:text-slate-300">20</div>
              <div className="h-6 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-mono text-[11px] font-bold text-slate-600 dark:text-slate-300">30</div>
              <div className="h-6 rounded bg-indigo-200 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300 flex items-center justify-center font-mono text-[11px] font-bold">40 (Top)</div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Match ➔</span>
            <span className="text-[10px] text-slate-400 mt-1">Bottom to Top</span>
          </div>

          {/* Scrambled input cards */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold uppercase text-slate-400 mb-1.5">Scrambled Cards</span>
            <div className="grid grid-cols-2 gap-1.5">
              <div className="w-10 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center font-mono font-bold text-xs text-indigo-700 dark:text-indigo-300 shadow-2xs">30</div>
              <div className="w-10 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center font-mono font-bold text-xs text-indigo-700 dark:text-indigo-300 shadow-2xs">10</div>
              <div className="w-10 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center font-mono font-bold text-xs text-indigo-700 dark:text-indigo-300 shadow-2xs">40</div>
              <div className="w-10 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center font-mono font-bold text-xs text-indigo-700 dark:text-indigo-300 shadow-2xs">20</div>
            </div>
          </div>
        </div>
      )}

      {/* GAME 4: PREDICT THE STACK MINI PREVIEW */}
      {game.id === 4 && (
        <div className="w-full max-w-md flex flex-col sm:flex-row items-center justify-center gap-4 py-1">
          {/* Operations snippet */}
          <div className="bg-slate-900 text-slate-100 p-2.5 rounded-xl font-mono text-[11px] space-y-1 w-44 shadow-xs">
            <div className="text-emerald-400">Push(10)</div>
            <div className="text-emerald-400">Push(20)</div>
            <div className="text-amber-400 line-through">Pop() // 20</div>
            <div className="text-emerald-400 font-bold">Push(30)</div>
          </div>

          <ArrowRight className="w-4 h-4 text-indigo-600 dark:text-indigo-400 hidden sm:block" />

          {/* Resulting stack */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase mb-1">Resulting Stack</span>
            <div className="w-24 border-x-2 border-b-2 border-slate-400 dark:border-slate-600 rounded-b-xl p-1 flex flex-col-reverse gap-1 bg-white dark:bg-slate-900">
              <div className="h-6 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-mono font-bold text-[11px] text-slate-700 dark:text-slate-300">
                10
              </div>
              <div className="h-6 rounded bg-indigo-600 text-white border border-indigo-500 flex items-center justify-center font-mono font-bold text-[11px]">
                30 (Top)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GAME 5: DEBUG THE STACK MINI PREVIEW */}
      {game.id === 5 && (
        <div className="w-full max-w-md space-y-1.5 py-1">
          <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-[11px] flex items-center justify-between text-slate-600 dark:text-slate-300">
            <span>1. Push(10) // size = 1</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">VALID</span>
          </div>
          <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-[11px] flex items-center justify-between text-slate-600 dark:text-slate-300">
            <span>2. Pop()     // size = 0</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">VALID</span>
          </div>
          <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/50 border-2 border-red-300 dark:border-red-800 font-mono text-[11px] flex items-center justify-between text-red-900 dark:text-red-300 shadow-xs">
            <span className="font-bold">3. Pop() // ⚠️ UNDERFLOW</span>
            <span className="text-red-600 dark:text-red-400 font-bold text-[10px] bg-red-100 dark:bg-red-900/60 px-1.5 py-0.5 rounded">
              FAULTY LINE
            </span>
          </div>
        </div>
      )}

      {/* GAME 6: SPEED STACK MINI PREVIEW */}
      {game.id === 6 && (
        <div className="w-full max-w-sm flex items-center justify-around py-2">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase mb-1">Time Remaining</span>
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 flex flex-col items-center justify-center text-indigo-700 dark:text-indigo-300 shadow-xs">
              <span className="text-lg font-black font-mono">45s</span>
              <span className="text-[9px] uppercase font-bold text-indigo-500">Timer</span>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase mb-1">Multiplier</span>
            <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800 flex flex-col items-center justify-center text-amber-700 dark:text-amber-300 shadow-xs">
              <span className="text-lg font-black font-mono">3x</span>
              <span className="text-[9px] uppercase font-bold text-amber-600 flex items-center gap-0.5">
                <Zap className="w-2.5 h-2.5" /> Combo
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase mb-1">Rapid Directive</span>
            <div className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center shadow-xs">
              <span className="block text-[11px] font-bold text-slate-900 dark:text-white">PUSH [30]</span>
              <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">Rapid Reflex</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
