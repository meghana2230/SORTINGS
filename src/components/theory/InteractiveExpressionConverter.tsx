import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Play, RotateCcw, Calculator } from 'lucide-react';
import { soundEffects } from '../../services/sound';

export const InteractiveExpressionConverter: React.FC = () => {
  const tokens = ['5', '3', '+', '2', '*']; // (5 + 3) * 2 = 16
  const [step, setStep] = useState(0);
  const [stack, setStack] = useState<number[]>([]);
  const [message, setMessage] = useState('Postfix expression: 5 3 + 2 * → Equivalent to (5 + 3) * 2');

  const handleNext = () => {
    if (step >= tokens.length) return;
    const token = tokens[step];
    soundEffects.playClick();

    if (!isNaN(Number(token))) {
      // Number operand
      const val = Number(token);
      setStack((prev) => [...prev, val]);
      setMessage(`👉 Token '${token}' is an Operand: PUSH onto operand stack.`);
    } else {
      // Operator
      const op2 = stack[stack.length - 1];
      const op1 = stack[stack.length - 2];
      let res = 0;
      if (token === '+') res = op1 + op2;
      if (token === '*') res = op1 * op2;

      setStack((prev) => [...prev.slice(0, -2), res]);
      setMessage(`✨ Operator '${token}': Pop ${op2} & ${op1}, compute ${op1} ${token} ${op2} = ${res}, PUSH ${res}.`);
    }

    setStep((prev) => prev + 1);
  };

  const handleReset = () => {
    setStep(0);
    setStack([]);
    setMessage('Postfix expression: 5 3 + 2 * → Equivalent to (5 + 3) * 2');
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 space-y-4 transition-colors">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Postfix Expression Evaluator
          </span>
        </div>
        <button
          onClick={handleReset}
          className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Token stream */}
      <div className="flex items-center gap-2">
        {tokens.map((t, idx) => (
          <div
            key={idx}
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm ${
              idx === step - 1
                ? 'bg-indigo-600 text-white ring-4 ring-indigo-200 dark:ring-indigo-900'
                : idx < step
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                : 'bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
            }`}
          >
            {t}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        {/* Operand Stack */}
        <div className="p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Operand Stack:</span>
          <div className="h-28 flex flex-col-reverse justify-start gap-1 p-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800">
            {stack.length === 0 ? (
              <span className="text-xs text-slate-400 font-mono my-auto text-center">[ Empty ]</span>
            ) : (
              stack.map((v, i) => (
                <div
                  key={i}
                  className="px-3 py-1 rounded bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 font-mono font-bold text-xs flex justify-between"
                >
                  <span>{v}</span>
                  {i === stack.length - 1 && <span className="text-[9px] text-indigo-500">TOP</span>}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Action button & Log */}
        <div className="space-y-3">
          <button
            onClick={handleNext}
            disabled={step >= tokens.length}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" /> {step >= tokens.length ? 'Evaluation Finished' : 'Evaluate Next Token'}
          </button>
          <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300">
            {message}
          </div>
        </div>
      </div>
    </div>
  );
};
