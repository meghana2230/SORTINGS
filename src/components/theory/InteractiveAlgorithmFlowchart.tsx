import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Play, ArrowDown, ArrowRight, CheckCircle2, AlertTriangle, RotateCcw, Sparkles } from 'lucide-react';
import { soundEffects } from '../../services/sound';

export const InteractiveAlgorithmFlowchart: React.FC = () => {
  const [activeAlgorithm, setActiveAlgorithm] = useState<'push' | 'pop'>('push');
  const [activeStep, setActiveStep] = useState<number>(0);
  const [scenario, setScenario] = useState<'normal' | 'error'>('normal');

  // Push Flowchart Nodes
  const pushStepsNormal = [
    { id: 0, title: 'START', desc: 'Invoke Push(element)', type: 'start' },
    { id: 1, title: 'Check: Is Stack Full?', desc: 'Validate (top == capacity - 1)? Result: NO', type: 'decision' },
    { id: 2, title: 'Increment TOP Pointer', desc: 'Execute TOP = TOP + 1', type: 'action' },
    { id: 3, title: 'Store Element in Slot', desc: 'Execute stack[TOP] = element', type: 'action' },
    { id: 4, title: 'END (Success)', desc: 'Element securely stored in O(1) time', type: 'end' },
  ];

  const pushStepsOverflow = [
    { id: 0, title: 'START', desc: 'Invoke Push(element)', type: 'start' },
    { id: 1, title: 'Check: Is Stack Full?', desc: 'Validate (top == capacity - 1)? Result: YES', type: 'decision' },
    { id: 2, title: '❌ STACK OVERFLOW!', desc: 'Throw error or reject insert. Do NOT modify TOP.', type: 'error' },
    { id: 3, title: 'END (Abort)', desc: 'Operation terminated defensively', type: 'end' },
  ];

  // Pop Flowchart Nodes
  const popStepsNormal = [
    { id: 0, title: 'START', desc: 'Invoke Pop()', type: 'start' },
    { id: 1, title: 'Check: Is Stack Empty?', desc: 'Validate (top == -1)? Result: NO', type: 'decision' },
    { id: 2, title: 'Retrieve & Remove TOP', desc: 'Read value = stack[TOP]', type: 'action' },
    { id: 3, title: 'Decrement TOP Pointer', desc: 'Execute TOP = TOP - 1', type: 'action' },
    { id: 4, title: 'END (Return Value)', desc: 'Yield popped element in O(1) time', type: 'end' },
  ];

  const popStepsUnderflow = [
    { id: 0, title: 'START', desc: 'Invoke Pop()', type: 'start' },
    { id: 1, title: 'Check: Is Stack Empty?', desc: 'Validate (top == -1)? Result: YES', type: 'decision' },
    { id: 2, title: '❌ STACK UNDERFLOW!', desc: 'No items to pop. Throw error or return null.', type: 'error' },
    { id: 3, title: 'END (Abort)', desc: 'Operation terminated defensively', type: 'end' },
  ];

  const currentSteps = activeAlgorithm === 'push'
    ? (scenario === 'normal' ? pushStepsNormal : pushStepsOverflow)
    : (scenario === 'normal' ? popStepsNormal : popStepsUnderflow);

  const handleStepForward = () => {
    soundEffects.playClick();
    if (activeStep < currentSteps.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else {
      setActiveStep(0);
    }
  };

  const handleReset = () => {
    soundEffects.playClick();
    setActiveStep(0);
  };

  const handleSwitchAlgo = (algo: 'push' | 'pop') => {
    soundEffects.playClick();
    setActiveAlgorithm(algo);
    setActiveStep(0);
  };

  const handleSwitchScenario = (sc: 'normal' | 'error') => {
    soundEffects.playClick();
    setScenario(sc);
    setActiveStep(0);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 space-y-5">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Interactive Algorithm Execution Path
          </span>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Trace the deterministic logic branch of Push and Pop step-by-step.
          </p>
        </div>

        {/* Algo & Scenario Toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => handleSwitchAlgo('push')}
              className={`px-3 py-1 text-xs font-bold font-mono rounded-lg transition-all ${
                activeAlgorithm === 'push'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Push Algorithm
            </button>
            <button
              onClick={() => handleSwitchAlgo('pop')}
              className={`px-3 py-1 text-xs font-bold font-mono rounded-lg transition-all ${
                activeAlgorithm === 'pop'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Pop Algorithm
            </button>
          </div>

          <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => handleSwitchScenario('normal')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                scenario === 'normal'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-2xs'
                  : 'text-slate-500'
              }`}
            >
              Normal Path
            </button>
            <button
              onClick={() => handleSwitchScenario('error')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                scenario === 'error'
                  ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-2xs'
                  : 'text-slate-500'
              }`}
            >
              {activeAlgorithm === 'push' ? 'Overflow Path' : 'Underflow Path'}
            </button>
          </div>
        </div>
      </div>

      {/* Execution Stepper Bar */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
            Current Node: {currentSteps[activeStep].title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleStepForward}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{activeStep === currentSteps.length - 1 ? 'Restart Path' : `Next Step (${activeStep + 1}/${currentSteps.length})`}</span>
          </button>
          <button
            onClick={handleReset}
            className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Vertical Animated Flowchart */}
      <div className="flex flex-col items-center gap-2 max-w-md mx-auto py-2">
        {currentSteps.map((node, index) => {
          const isActive = index === activeStep;
          const isPassed = index < activeStep;

          let nodeBg = 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300';
          if (isActive) {
            if (node.type === 'error') {
              nodeBg = 'bg-rose-500 text-white border-rose-600 ring-4 ring-rose-300 animate-pulse';
            } else {
              nodeBg = 'bg-indigo-600 text-white border-indigo-700 ring-4 ring-indigo-300 shadow-md scale-105';
            }
          } else if (isPassed) {
            nodeBg = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300';
          }

          return (
            <React.Fragment key={node.id}>
              <motion.div
                layout
                className={`w-full p-3.5 rounded-xl border font-mono text-center transition-all ${nodeBg}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold opacity-80">
                    Step {index + 1}
                  </span>
                  {isPassed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                </div>
                <div className="text-xs font-bold mt-0.5">{node.title}</div>
                <div className="text-[11px] opacity-90 mt-0.5">{node.desc}</div>
              </motion.div>

              {index < currentSteps.length - 1 && (
                <div className="flex flex-col items-center">
                  <ArrowDown
                    className={`w-4 h-4 transition-colors ${
                      isPassed ? 'text-emerald-500' : 'text-slate-400'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
