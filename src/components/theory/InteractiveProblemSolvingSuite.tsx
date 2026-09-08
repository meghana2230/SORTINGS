import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, ArrowRight, Play, RotateCcw, Sparkles, Terminal } from 'lucide-react';
import { soundEffects } from '../../services/sound';

export const InteractiveProblemSolvingSuite: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'brackets' | 'expression' | 'callstack' | 'backtrack'>('brackets');

  // 1. Brackets State
  const [bracketExpr, setBracketExpr] = useState<string>('{[()]}');
  const [bracketStack, setBracketStack] = useState<string[]>([]);
  const [bracketStep, setBracketStep] = useState<number>(0);
  const [bracketStatus, setBracketStatus] = useState<string>('Click "Step Through" to validate.');

  // 2. Expression State
  const [infixExpr] = useState<string>('A + B * C');
  const [exprType, setExprType] = useState<'postfix' | 'prefix'>('postfix');

  // 3. Callstack State
  const [callStack, setCallStack] = useState<string[]>(['main()']);

  // 4. Backtracking State
  const [path, setPath] = useState<string[]>(['Start', 'Room A', 'Room B']);
  const [isDeadEnd, setIsDeadEnd] = useState<boolean>(true);

  // Handle Brackets Step
  const handleBracketNext = () => {
    soundEffects.playClick();
    if (bracketStep >= bracketExpr.length) {
      if (bracketStack.length === 0) {
        setBracketStatus('✅ Valid & Balanced! Stack is empty at termination.');
        soundEffects.playSuccess();
      } else {
        setBracketStatus('❌ Invalid: Unclosed opening brackets remain in stack.');
        soundEffects.playError();
      }
      return;
    }

    const char = bracketExpr[bracketStep];
    if (['(', '{', '['].includes(char)) {
      setBracketStack((prev) => [...prev, char]);
      setBracketStatus(`Pushed opening bracket '${char}' onto stack.`);
    } else {
      const map: Record<string, string> = { ')': '(', '}': '{', ']': '[' };
      if (bracketStack.length === 0) {
        setBracketStatus(`❌ Invalid: Closing bracket '${char}' with empty stack.`);
        soundEffects.playError();
        return;
      }
      const top = bracketStack[bracketStack.length - 1];
      if (top === map[char]) {
        setBracketStack((prev) => prev.slice(0, -1));
        setBracketStatus(`Matched '${top}' with '${char}'. Popped from stack!`);
      } else {
        setBracketStatus(`❌ Mismatch: Found '${char}' but TOP was '${top}'.`);
        soundEffects.playError();
        return;
      }
    }
    setBracketStep((prev) => prev + 1);
  };

  const handleBracketReset = () => {
    soundEffects.playClick();
    setBracketStack([]);
    setBracketStep(0);
    setBracketStatus('Ready. Click "Step Through" to validate.');
  };

  // Handle CallStack
  const handleCallPush = (fnName: string) => {
    if (callStack.length >= 4) return;
    soundEffects.playPush();
    setCallStack((prev) => [...prev, fnName]);
  };

  const handleCallPop = () => {
    if (callStack.length <= 1) return;
    soundEffects.playPop();
    setCallStack((prev) => prev.slice(0, -1));
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 space-y-5">
      {/* Header Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Interactive Problem Solving Patterns
          </span>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Explore the 4 primary problem archetypes solved using LIFO stacks.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-800 p-1 rounded-xl flex-wrap">
          <button
            onClick={() => setActiveTab('brackets')}
            className={`px-3 py-1 text-xs font-bold font-mono rounded-lg transition-all ${
              activeTab === 'brackets' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            1. Brackets
          </button>
          <button
            onClick={() => setActiveTab('expression')}
            className={`px-3 py-1 text-xs font-bold font-mono rounded-lg transition-all ${
              activeTab === 'expression' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            2. Expressions
          </button>
          <button
            onClick={() => setActiveTab('callstack')}
            className={`px-3 py-1 text-xs font-bold font-mono rounded-lg transition-all ${
              activeTab === 'callstack' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            3. Call Stack
          </button>
          <button
            onClick={() => setActiveTab('backtrack')}
            className={`px-3 py-1 text-xs font-bold font-mono rounded-lg transition-all ${
              activeTab === 'backtrack' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            4. Backtracking
          </button>
        </div>
      </div>

      {/* 1. BRACKETS TAB */}
      {activeTab === 'brackets' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono">
              Validating String:{' '}
              <span className="font-bold text-indigo-600 dark:text-indigo-400 tracking-widest text-sm bg-white dark:bg-slate-950 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                {bracketExpr.split('').map((ch, i) => (
                  <span
                    key={i}
                    className={`${i === bracketStep ? 'bg-amber-300 text-black px-1 rounded' : ''}`}
                  >
                    {ch}
                  </span>
                ))}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleBracketNext}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> Step Through
              </button>
              <button
                onClick={handleBracketReset}
                className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            {/* Visual Bracket Stack */}
            <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center">
              <span className="text-[10px] font-mono uppercase text-slate-400 mb-1">
                Openers Stack
              </span>
              <div className="w-28 h-32 rounded-b-xl border-x-2 border-b-2 border-slate-300 dark:border-slate-700 p-2 flex flex-col-reverse gap-1 shadow-inner">
                {bracketStack.length === 0 ? (
                  <span className="m-auto text-[10px] font-mono text-slate-400">[ Empty ]</span>
                ) : (
                  bracketStack.map((b, idx) => (
                    <div
                      key={idx}
                      className="h-8 rounded bg-indigo-600 text-white font-mono font-bold flex items-center justify-center text-sm shadow-xs"
                    >
                      {b}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Status Feedback */}
            <div className="p-4 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
                Validation Status:
              </span>
              <p className="text-xs font-mono text-slate-700 dark:text-slate-300 leading-relaxed">
                {bracketStatus}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. EXPRESSIONS TAB */}
      {activeTab === 'expression' && (
        <div className="space-y-4">
          <div className="p-4 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="text-xs font-mono font-bold text-slate-500 uppercase">
              Mathematical Notation Comparison
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block">INFIX (Human)</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">A + B * C</span>
                <span className="text-[10px] text-slate-400 block mt-1">Needs operator precedence</span>
              </div>
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg border border-indigo-200 dark:border-indigo-800">
                <span className="text-[10px] text-indigo-500 block">POSTFIX (RPN)</span>
                <span className="font-bold text-indigo-700 dark:text-indigo-300 text-sm">A B C * +</span>
                <span className="text-[10px] text-indigo-400 block mt-1">Evaluated by Stack [O(n)]</span>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-lg border border-purple-200 dark:border-purple-800">
                <span className="text-[10px] text-purple-500 block">PREFIX (Polish)</span>
                <span className="font-bold text-purple-700 dark:text-purple-300 text-sm">+ A * B C</span>
                <span className="text-[10px] text-purple-400 block mt-1">Operator comes first</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. CALL STACK TAB */}
      {activeTab === 'callstack' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
              CPU Function Execution Stack Frame
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleCallPush(`func${String.fromCharCode(65 + callStack.length - 1)}()`)}
                disabled={callStack.length >= 4}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                Call Function
              </button>
              <button
                onClick={handleCallPop}
                disabled={callStack.length <= 1}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                Return / Pop Frame
              </button>
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col-reverse gap-2 max-w-sm mx-auto">
            {callStack.map((fn, idx) => {
              const isTop = idx === callStack.length - 1;
              return (
                <div
                  key={idx}
                  className={`p-2.5 rounded-lg text-xs font-mono font-bold flex items-center justify-between ${
                    isTop
                      ? 'bg-indigo-600 text-white ring-2 ring-indigo-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>{fn}</span>
                  <span className="text-[10px] opacity-80">{isTop ? '★ ACTIVE FRAME' : 'PAUSED'}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. BACKTRACKING TAB */}
      {activeTab === 'backtrack' && (
        <div className="space-y-4">
          <div className="p-4 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="text-xs font-mono font-bold text-slate-500 uppercase">
              Maze / Decision Tree Backtracking
            </div>
            <div className="flex items-center gap-2 font-mono text-xs flex-wrap">
              <span className="p-2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                START
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="p-2 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-bold">
                Step A
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="p-2 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-bold">
                Step B
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="p-2 rounded bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-bold flex items-center gap-1">
                <X className="w-3 h-3" /> DEAD END
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="p-2 rounded bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 font-bold">
                ↩ POP & BACKTRACK → Step A
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">
              Popping from the exploration stack restores state to the most recent untried branch instantly.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
