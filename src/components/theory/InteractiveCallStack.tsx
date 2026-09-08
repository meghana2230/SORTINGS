import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Play, RotateCcw, Cpu } from 'lucide-react';
import { soundEffects } from '../../services/sound';

export const InteractiveCallStack: React.FC = () => {
  const STEPS = [
    { frame: 'main()', action: 'push', message: 'Program starts: main() frame pushed to call stack.' },
    { frame: 'factorial(3)', action: 'push', message: 'main() calls factorial(3) [Frame pushed].' },
    { frame: 'factorial(2)', action: 'push', message: 'factorial(3) calls factorial(2) [Frame pushed].' },
    { frame: 'factorial(1)', action: 'push', message: 'factorial(2) calls factorial(1) [Base case hit: returns 1].' },
    { frame: 'factorial(1)', action: 'pop', message: 'factorial(1) pops and returns 1 to caller.' },
    { frame: 'factorial(2)', action: 'pop', message: 'factorial(2) computes 2 * 1 = 2 and pops.' },
    { frame: 'factorial(3)', action: 'pop', message: 'factorial(3) computes 3 * 2 = 6 and pops.' },
    { frame: 'main()', action: 'pop', message: 'main() receives 6. Execution completed!' },
  ];

  const [stepIndex, setStepIndex] = useState(0);
  const [frames, setFrames] = useState<string[]>(['main()']);

  const handleNext = () => {
    if (stepIndex >= STEPS.length - 1) return;
    const nextIdx = stepIndex + 1;
    const nextStep = STEPS[nextIdx];

    soundEffects.playClick();
    if (nextStep.action === 'push') {
      setFrames((prev) => [...prev, nextStep.frame]);
    } else {
      setFrames((prev) => prev.slice(0, -1));
    }
    setStepIndex(nextIdx);
  };

  const handleReset = () => {
    setStepIndex(0);
    setFrames(['main()']);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 space-y-4 transition-colors">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Runtime CPU Call Stack Tracer (factorial(3))
          </span>
        </div>
        <button
          onClick={handleReset}
          className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Visual Stack Frame Column */}
        <div className="md:col-span-5 flex flex-col items-center">
          <span className="text-[10px] font-mono text-slate-400 mb-1">
            Top of Call Stack (Active Frame)
          </span>
          <div className="w-full max-w-[200px] min-h-[170px] rounded-b-2xl border-x-4 border-b-4 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-2 flex flex-col-reverse gap-1.5 shadow-inner">
            {frames.length === 0 ? (
              <span className="text-xs font-mono text-slate-400 my-auto text-center">[ Call Stack Empty ]</span>
            ) : (
              frames.map((f, idx) => {
                const isActive = idx === frames.length - 1;
                return (
                  <motion.div
                    key={`${f}-${idx}`}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className={`h-8 rounded-lg px-2.5 flex items-center justify-between font-mono text-xs font-bold ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <span>{f}</span>
                    {isActive && <span className="text-[9px] bg-white/20 px-1 rounded">EXEC</span>}
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Step log & controls */}
        <div className="md:col-span-7 space-y-3">
          <button
            onClick={handleNext}
            disabled={stepIndex >= STEPS.length - 1}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" /> Next Execution Step ({stepIndex + 1}/{STEPS.length})
          </button>
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300">
            {STEPS[stepIndex].message}
          </div>
        </div>
      </div>
    </div>
  );
};
