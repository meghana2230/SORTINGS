import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Play, RotateCcw, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';
import { soundEffects } from '../../services/sound';

export const InteractiveBrackets: React.FC = () => {
  const SAMPLES = [
    { expr: '{ [ ( ) ] }', valid: true, name: 'Valid Balanced Nested' },
    { expr: '{ [ ( ] ) }', valid: false, name: 'Invalid Mismatched Order' },
    { expr: '( ( ( ) )', valid: false, name: 'Invalid Unclosed Opener' },
  ];

  const [selectedSampleIdx, setSelectedSampleIdx] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [charStack, setCharStack] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'running' | 'valid' | 'invalid'>('idle');
  const [stepMessage, setStepMessage] = useState('Click "Next Step" to trace bracket validation.');

  const expr = SAMPLES[selectedSampleIdx].expr.replace(/\s+/g, '');

  const handleSelectSample = (idx: number) => {
    setSelectedSampleIdx(idx);
    setCurrentStep(0);
    setCharStack([]);
    setStatus('idle');
    setStepMessage('Click "Next Step" to trace bracket validation.');
  };

  const handleNextStep = () => {
    if (status === 'valid' || status === 'invalid') return;

    if (currentStep >= expr.length) {
      // Finished scanning string
      if (charStack.length === 0) {
        soundEffects.playSuccess();
        setStatus('valid');
        setStepMessage('✅ Evaluation Complete: Stack is empty! All brackets matched perfectly.');
      } else {
        soundEffects.playError();
        setStatus('invalid');
        setStepMessage(`❌ Evaluation Complete: Unbalanced! ${charStack.length} unclosed opener(s) remain.`);
      }
      return;
    }

    const char = expr[currentStep];
    soundEffects.playClick();

    if (['(', '[', '{'].includes(char)) {
      const nextStack = [...charStack, char];
      setCharStack(nextStack);
      setStepMessage(`👉 Character '${char}' is an OPENER: PUSH onto stack.`);
      setCurrentStep((prev) => prev + 1);
    } else {
      // Closer
      if (charStack.length === 0) {
        soundEffects.playError();
        setStatus('invalid');
        setStepMessage(`❌ Character '${char}' is a CLOSER, but Stack is EMPTY! No matching opener exists.`);
        return;
      }

      const topChar = charStack[charStack.length - 1];
      const isMatch =
        (topChar === '(' && char === ')') ||
        (topChar === '[' && char === ']') ||
        (topChar === '{' && char === '}');

      if (isMatch) {
        setCharStack((prev) => prev.slice(0, -1));
        setStepMessage(`✨ Closer '${char}' matches top opener '${topChar}': POP '${topChar}' from stack.`);
        setCurrentStep((prev) => prev + 1);
      } else {
        soundEffects.playError();
        setStatus('invalid');
        setStepMessage(`❌ Mismatch Error! Closer '${char}' does NOT match top opener '${topChar}'.`);
      }
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setCharStack([]);
    setStatus('idle');
    setStepMessage('Click "Next Step" to trace bracket validation.');
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 space-y-5 transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Balanced Parentheses Step Tracer
          </span>
        </div>

        {/* Sample selector */}
        <div className="flex items-center gap-1.5">
          {SAMPLES.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectSample(idx)}
              className={`px-2.5 py-1 text-[11px] font-mono font-bold rounded-lg transition-all cursor-pointer ${
                selectedSampleIdx === idx
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* String Stream Visualizer */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono uppercase text-slate-400">Expression Stream:</span>
        <div className="flex items-center gap-2 p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
          {expr.split('').map((c, idx) => {
            const isScanned = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div
                key={idx}
                className={`w-9 h-9 rounded-lg flex items-center justify-center font-mono font-bold text-sm transition-all ${
                  isCurrent
                    ? 'bg-indigo-600 text-white ring-4 ring-indigo-200 dark:ring-indigo-900 scale-110'
                    : isScanned
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 opacity-60'
                    : 'bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                }`}
              >
                {c}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Bracket Character Stack (5 cols) */}
        <div className="md:col-span-5 flex flex-col items-center">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
            Character Opener Stack
          </span>
          <div className="w-full max-w-[180px] min-h-[160px] rounded-b-2xl border-x-4 border-b-4 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-2 flex flex-col-reverse gap-1.5 shadow-inner">
            {charStack.length === 0 ? (
              <div className="h-32 flex items-center justify-center text-slate-400 font-mono text-xs">
                [ Empty ]
              </div>
            ) : (
              charStack.map((ch, idx) => (
                <motion.div
                  key={`${ch}-${idx}`}
                  initial={{ y: -15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 border border-indigo-300 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 font-mono font-bold text-xs flex items-center justify-center"
                >
                  {ch}
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Step Controls & Message (7 cols) */}
        <div className="md:col-span-7 space-y-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleNextStep}
              disabled={status === 'valid' || status === 'invalid'}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" /> Next Scan Step
            </button>
            <button
              onClick={handleReset}
              className="px-3.5 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          <div
            className={`p-3.5 rounded-xl border text-xs leading-relaxed transition-all ${
              status === 'valid'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                : status === 'invalid'
                ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200'
                : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <span className="font-mono">{stepMessage}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
