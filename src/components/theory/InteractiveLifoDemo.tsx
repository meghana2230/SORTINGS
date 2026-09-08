import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, RotateCcw, ArrowRight, ArrowDown, Check, Sparkles } from 'lucide-react';
import { soundEffects } from '../../services/sound';

export const InteractiveLifoDemo: React.FC = () => {
  const [step, setStep] = useState<number>(0);
  const [historyLog, setHistoryLog] = useState<string[]>([
    'Ready. Click "Next Step" to trace LIFO sequence.',
  ]);

  // Steps:
  // 0: Empty stack
  // 1: Push 10
  // 2: Push 20
  // 3: Push 30 (Top is 30)
  // 4: Pop() -> 30 leaves first! (LIFO demonstrated)
  // 5: Pop() -> 20 leaves second
  // 6: Pop() -> 10 leaves last

  const stepsData = [
    {
      title: 'Initial State',
      action: 'Stack is empty',
      items: [],
      popped: null,
      note: 'No elements. TOP = -1',
      badge: 'EMPTY',
    },
    {
      title: 'Step 1: PUSH(10)',
      action: '10 is pushed first',
      items: [10],
      popped: null,
      note: '10 enters bottom. TOP = 10',
      badge: 'FIRST IN',
    },
    {
      title: 'Step 2: PUSH(20)',
      action: '20 is pushed second',
      items: [10, 20],
      popped: null,
      note: '20 stacks on top of 10. TOP = 20',
      badge: 'MIDDLE',
    },
    {
      title: 'Step 3: PUSH(30)',
      action: '30 is pushed LAST',
      items: [10, 20, 30],
      popped: null,
      note: '30 is the MOST RECENT element. TOP = 30',
      badge: 'LAST IN',
    },
    {
      title: 'Step 4: POP() → 30 Returns!',
      action: 'POP() removes the TOP element',
      items: [10, 20],
      popped: 30,
      note: '★ 30 was LAST IN, so it is FIRST OUT!',
      badge: 'FIRST OUT ★',
    },
    {
      title: 'Step 5: POP() → 20 Returns',
      action: 'Next POP() removes 20',
      items: [10],
      popped: 20,
      note: '20 was in the middle, leaves second.',
      badge: 'SECOND OUT',
    },
    {
      title: 'Step 6: POP() → 10 Returns',
      action: 'Final POP() removes 10',
      items: [],
      popped: 10,
      note: '10 was FIRST IN, so it leaves LAST.',
      badge: 'LAST OUT',
    },
  ];

  const current = stepsData[step];

  const handleNext = () => {
    soundEffects.playClick();
    if (step < stepsData.length - 1) {
      const nextStep = step + 1;
      setStep(nextStep);
      setHistoryLog((prev) => [stepsData[nextStep].action, ...prev.slice(0, 4)]);
      if (nextStep === 4) soundEffects.playSuccess();
    } else {
      setStep(0);
      setHistoryLog(['Sequence reset to start.']);
    }
  };

  const handleReset = () => {
    soundEffects.playClick();
    setStep(0);
    setHistoryLog(['Reset to Step 0.']);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Interactive LIFO Demonstration
          </span>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Trace how elements enter and leave in reverse order.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleNext}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{step === stepsData.length - 1 ? 'Restart Trace' : `Next Step (${step + 1}/${stepsData.length})`}</span>
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Prominent LIFO Banner */}
      <div className="bg-linear-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 dark:from-indigo-950/50 dark:via-purple-950/50 dark:to-indigo-950/50 p-3.5 rounded-xl border border-indigo-200/80 dark:border-indigo-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <div>
            <div className="text-xs font-extrabold tracking-wider uppercase text-indigo-700 dark:text-indigo-300 font-mono">
              LIFO = LAST IN, FIRST OUT
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-300">
              The newest element (30) arrives last and is popped first!
            </div>
          </div>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-600 text-white shadow-2xs">
          {current.badge}
        </span>
      </div>

      {/* Visual Animation Stage */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Left: Interactive Stack Chamber */}
        <div className="md:col-span-6 flex flex-col items-center">
          <div className="flex items-center gap-1 text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-bold mb-1">
            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
            <span>TOP (Only Point of Access)</span>
          </div>

          <div className="w-full max-w-[200px] h-[200px] rounded-b-2xl border-x-4 border-b-4 border-indigo-300 dark:border-indigo-800 bg-white dark:bg-slate-950 p-2.5 flex flex-col-reverse gap-2 shadow-inner relative">
            {current.items.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs font-mono text-slate-400">
                [ Empty Stack ]
              </div>
            ) : (
              current.items.map((val, idx) => {
                const isTop = idx === current.items.length - 1;
                return (
                  <motion.div
                    key={val}
                    initial={{ y: -20, opacity: 0, scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ type: 'spring', damping: 15 }}
                    className={`h-11 rounded-xl flex items-center justify-between px-3 text-xs font-bold font-mono shadow-xs transition-colors ${
                      isTop
                        ? 'bg-indigo-600 text-white ring-2 ring-indigo-400 dark:ring-indigo-300'
                        : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-800'
                    }`}
                  >
                    <span>[{val}]</span>
                    <span className="text-[10px] font-normal opacity-90">
                      {isTop ? 'TOP' : `idx ${idx}`}
                    </span>
                  </motion.div>
                );
              })
            )}
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mt-1">
            Solid Closed Bottom
          </span>
        </div>

        {/* Right: Step Explanation & Popped Zone */}
        <div className="md:col-span-6 space-y-3">
          <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
              Active Step ({step + 1} of {stepsData.length})
            </span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {current.title}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {current.note}
            </p>

            {current.popped !== null && (
              <div className="mt-2 p-2.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Popped Value: {current.popped} (Returned to caller)</span>
              </div>
            )}
          </div>

          {/* History Feed */}
          <div className="p-3 bg-slate-100 dark:bg-slate-800/80 rounded-xl space-y-1">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-500">
              Execution Log:
            </span>
            <div className="space-y-1">
              {historyLog.map((log, lIdx) => (
                <div key={lIdx} className="text-[11px] font-mono text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <ArrowRight className="w-2.5 h-2.5 text-indigo-500 shrink-0" />
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
