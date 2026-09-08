import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Cpu,
  Undo2,
  Redo2,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  SkipForward,
  Calculator,
  Braces,
  Sparkles,
  ArrowRight,
  Code2,
} from 'lucide-react';
import { soundEffects } from '../../services/sound';

export const LabSimulationsView: React.FC = () => {
  const [selectedSim, setSelectedSim] = useState<'recursion' | 'undo_redo' | 'parentheses' | 'rpn'>('recursion');

  // 1. RECURSION STATE
  const [recN, setRecN] = useState<number>(4);
  const [recStep, setRecStep] = useState<number>(0);
  // Precomputed call stack steps for factorial(n)
  const getFactorialSteps = (n: number) => {
    const steps: { frames: { fn: string; n: number; phase: 'call' | 'return'; retVal?: number }[]; explanation: string }[] = [];
    steps.push({
      frames: [],
      explanation: `Initial state: Program ready to execute factorial(${n}). Call stack is empty.`,
    });

    const stack: { fn: string; n: number; phase: 'call' | 'return'; retVal?: number }[] = [];
    for (let i = n; i >= 1; i--) {
      stack.push({ fn: `factorial(${i})`, n: i, phase: 'call' });
      steps.push({
        frames: JSON.parse(JSON.stringify(stack)),
        explanation: `PUSH frame: Called factorial(${i}) with parameter n = ${i}. Waiting for factorial(${i - 1}).`,
      });
    }

    // Base condition reached: factorial(1) returns 1
    let curRet = 1;
    for (let i = 1; i <= n; i++) {
      if (i > 1) curRet = curRet * i;
      const popped = stack.pop();
      steps.push({
        frames: JSON.parse(JSON.stringify(stack)),
        explanation: `POP frame: factorial(${i}) finished. Computed return value = ${curRet}. Stack frame unwound.`,
      });
    }

    return steps;
  };

  const recSteps = getFactorialSteps(recN);
  const currentRecStep = recSteps[Math.min(recStep, recSteps.length - 1)];

  // 2. UNDO / REDO STATE
  const [documentText, setDocumentText] = useState<string>('The quick brown fox');
  const [undoStack, setUndoStack] = useState<string[]>(['The', 'The quick', 'The quick brown']);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const [inputText, setInputText] = useState<string>('');

  const handleApplyAction = (word: string) => {
    if (!word.trim()) return;
    soundEffects.playPush();
    setUndoStack((prev) => [...prev, documentText]);
    setRedoStack([]);
    setDocumentText((prev) => (prev ? `${prev} ${word.trim()}` : word.trim()));
    setInputText('');
  };

  const handleUndo = () => {
    if (undoStack.length === 0) {
      soundEffects.playError();
      return;
    }
    soundEffects.playPop();
    const previousState = undoStack[undoStack.length - 1];
    setRedoStack((prev) => [...prev, documentText]);
    setUndoStack((prev) => prev.slice(0, -1));
    setDocumentText(previousState);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) {
      soundEffects.playError();
      return;
    }
    soundEffects.playPush();
    const nextState = redoStack[redoStack.length - 1];
    setUndoStack((prev) => [...prev, documentText]);
    setRedoStack((prev) => prev.slice(0, -1));
    setDocumentText(nextState);
  };

  // 3. PARENTHESES VALIDATOR STATE
  const [bracketExpr, setBracketExpr] = useState<string>('{[()]}');
  const [bracketStep, setBracketStep] = useState<number>(0);

  const getBracketSteps = (expr: string) => {
    const steps: { index: number; char: string; stack: string[]; status: 'neutral' | 'match' | 'mismatch' | 'push'; msg: string }[] = [];
    const stack: string[] = [];
    const pairs: Record<string, string> = { ')': '(', ']': '[', '}': '{' };

    steps.push({
      index: -1,
      char: '',
      stack: [],
      status: 'neutral',
      msg: `Ready to evaluate expression: "${expr}". Stack is currently empty.`,
    });

    let failed = false;
    for (let i = 0; i < expr.length; i++) {
      const char = expr[i];
      if (['(', '[', '{'].includes(char)) {
        stack.push(char);
        steps.push({
          index: i,
          char,
          stack: [...stack],
          status: 'push',
          msg: `Character '${char}' is an opening bracket. PUSH onto stack.`,
        });
      } else if ([')', ']', '}'].includes(char)) {
        const expected = pairs[char];
        if (stack.length === 0) {
          failed = true;
          steps.push({
            index: i,
            char,
            stack: [...stack],
            status: 'mismatch',
            msg: `Syntax Error at index ${i}: Closing bracket '${char}' found but Stack is EMPTY (Underflow).`,
          });
          break;
        }
        const top = stack.pop()!;
        if (top === expected) {
          steps.push({
            index: i,
            char,
            stack: [...stack],
            status: 'match',
            msg: `Matched! '${char}' matches popped '${top}'. Pair eliminated.`,
          });
        } else {
          failed = true;
          steps.push({
            index: i,
            char,
            stack: [...stack],
            status: 'mismatch',
            msg: `Mismatch Error at index ${i}: Expected closing for '${top}', but found '${char}'.`,
          });
          break;
        }
      }
    }

    if (!failed) {
      if (stack.length === 0) {
        steps.push({
          index: expr.length,
          char: 'END',
          stack: [],
          status: 'match',
          msg: `🎉 VALID: All brackets matched and Stack is completely empty!`,
        });
      } else {
        steps.push({
          index: expr.length,
          char: 'END',
          stack: [...stack],
          status: 'mismatch',
          msg: `❌ INVALID: Unclosed brackets remaining in stack: [${stack.join(', ')}].`,
        });
      }
    }

    return steps;
  };

  const bracketSteps = getBracketSteps(bracketExpr);
  const currentBracketStep = bracketSteps[Math.min(bracketStep, bracketSteps.length - 1)];

  // 4. POSTFIX / RPN EVALUATOR STATE
  const [rpnExpr, setRpnExpr] = useState<string>('12 4 / 3 + 5 *');
  const [rpnStep, setRpnStep] = useState<number>(0);

  const getRpnSteps = (expr: string) => {
    const tokens = expr.trim().split(/\s+/).filter(Boolean);
    const steps: { tokenIndex: number; token: string; stack: number[]; msg: string }[] = [];
    const stack: number[] = [];

    steps.push({
      tokenIndex: -1,
      token: '',
      stack: [],
      msg: `Ready to evaluate RPN expression: "${expr}". Left-to-right scan.`,
    });

    for (let i = 0; i < tokens.length; i++) {
      const tok = tokens[i];
      if (!isNaN(Number(tok))) {
        const num = Number(tok);
        stack.push(num);
        steps.push({
          tokenIndex: i,
          token: tok,
          stack: [...stack],
          msg: `Token '${tok}' is an operand. PUSH ${tok} onto stack.`,
        });
      } else if (['+', '-', '*', '/'].includes(tok)) {
        if (stack.length < 2) {
          steps.push({
            tokenIndex: i,
            token: tok,
            stack: [...stack],
            msg: `Error: Operator '${tok}' requires 2 operands, but stack only has ${stack.length}.`,
          });
          break;
        }
        const b = stack.pop()!;
        const a = stack.pop()!;
        let res = 0;
        if (tok === '+') res = a + b;
        if (tok === '-') res = a - b;
        if (tok === '*') res = a * b;
        if (tok === '/') res = Math.floor(a / b);
        stack.push(res);
        steps.push({
          tokenIndex: i,
          token: tok,
          stack: [...stack],
          msg: `Operator '${tok}': POP ${b}, POP ${a}. Computed ${a} ${tok} ${b} = ${res}. PUSH result ${res}.`,
        });
      }
    }

    if (stack.length === 1) {
      steps.push({
        tokenIndex: tokens.length,
        token: 'END',
        stack: [...stack],
        msg: `🎉 Evaluation Complete! Final result on TOP of stack = ${stack[0]}.`,
      });
    }

    return steps;
  };

  const rpnSteps = getRpnSteps(rpnExpr);
  const currentRpnStep = rpnSteps[Math.min(rpnStep, rpnSteps.length - 1)];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
      {/* Simulation Selector Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Stack Real-World Simulation Experiments
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Test how real operating systems, compilers, and applications use stacks under the hood.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setSelectedSim('recursion')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedSim === 'recursion'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-2xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Call Stack (Recursion)</span>
          </button>
          <button
            onClick={() => setSelectedSim('undo_redo')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedSim === 'undo_redo'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-2xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>Undo / Redo Buffer</span>
          </button>
          <button
            onClick={() => setSelectedSim('parentheses')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedSim === 'parentheses'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-2xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Braces className="w-3.5 h-3.5" />
            <span>Bracket Matching</span>
          </button>
          <button
            onClick={() => setSelectedSim('rpn')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedSim === 'rpn'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-2xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Postfix Calculator</span>
          </button>
        </div>
      </div>

      {/* SIMULATION 1: CALL STACK & RECURSION */}
      {selectedSim === 'recursion' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls & Explanation */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Parameter n:
                </span>
                <div className="flex items-center gap-1">
                  {[3, 4, 5].map((val) => (
                    <button
                      key={val}
                      onClick={() => {
                        setRecN(val);
                        setRecStep(0);
                      }}
                      className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg border cursor-pointer ${
                        recN === val
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      n={val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step Navigation Controls */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-xs font-mono text-slate-500">
                  Step {recStep} / {recSteps.length - 1}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      soundEffects.playClick();
                      setRecStep((prev) => Math.max(0, prev - 1));
                    }}
                    disabled={recStep === 0}
                    className="p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 disabled:opacity-30 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      soundEffects.playClick();
                      setRecStep((prev) => Math.min(recSteps.length - 1, prev + 1));
                    }}
                    disabled={recStep >= recSteps.length - 1}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer disabled:opacity-40"
                  >
                    <span>Next Step</span>
                    <SkipForward className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Explanation box */}
            <div className="p-4 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-800/80 text-xs text-indigo-950 dark:text-indigo-200 leading-relaxed">
              <strong className="block mb-1 text-indigo-900 dark:text-indigo-300">
                Runtime Execution Log:
              </strong>
              {currentRecStep.explanation}
            </div>

            {/* Code Snippet */}
            <div className="bg-slate-900 text-slate-200 p-3 rounded-xl font-mono text-[11px] border border-slate-800">
              <pre>{`int factorial(int n) {
  if (n <= 1) return 1; // Base case
  return n * factorial(n - 1); // Push frame
}`}</pre>
            </div>
          </div>

          {/* Visual Call Stack */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
              Call Stack Memory (High to Low Address)
            </span>
            <div className="w-full max-w-sm min-h-[300px] border-x-4 border-b-4 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 rounded-b-2xl p-3 flex flex-col-reverse justify-start gap-2 shadow-inner">
              {currentRecStep.frames.length === 0 ? (
                <div className="h-48 flex items-center justify-center text-center text-xs text-slate-400 italic">
                  Call stack empty. Step forward to push frames.
                </div>
              ) : (
                <AnimatePresence>
                  {currentRecStep.frames.map((frame, idx) => {
                    const isTop = idx === currentRecStep.frames.length - 1;
                    return (
                      <motion.div
                        key={frame.fn + idx}
                        initial={{ scale: 0.9, y: -10, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 10, opacity: 0 }}
                        className={`p-3 rounded-xl border-2 shadow-xs transition-all ${
                          isTop
                            ? 'bg-indigo-600 border-indigo-700 text-white shadow-md'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-xs">
                            {frame.fn}
                          </span>
                          {isTop && (
                            <span className="px-2 py-0.5 bg-white/20 text-white rounded text-[9px] font-bold uppercase">
                              Active Frame
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] mt-1 opacity-80 flex justify-between font-mono">
                          <span>Local: n = {frame.n}</span>
                          <span>SP: 0x7FFF{idx * 32}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SIMULATION 2: UNDO / REDO BUFFER */}
      {selectedSim === 'undo_redo' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Text Editor Area */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Document Editor
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleUndo}
                    disabled={undoStack.length === 0}
                    className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Undo2 className="w-3.5 h-3.5" />
                    <span>Undo ({undoStack.length})</span>
                  </button>
                  <button
                    onClick={handleRedo}
                    disabled={redoStack.length === 0}
                    className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Redo2 className="w-3.5 h-3.5" />
                    <span>Redo ({redoStack.length})</span>
                  </button>
                </div>
              </div>

              {/* Text canvas */}
              <div className="p-4 min-h-[90px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-serif text-slate-800 dark:text-slate-100 text-sm shadow-inner">
                {documentText || <span className="text-slate-400 italic">Empty document...</span>}
              </div>

              {/* Input for next words */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleApplyAction(inputText);
                  }}
                  placeholder="Type word to append (e.g. 'jumps')..."
                  className="flex-1 px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
                <button
                  onClick={() => handleApplyAction(inputText)}
                  className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Append Word
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400">Quick Appends:</span>
                {['jumps', 'over', 'the', 'lazy dog'].map((w) => (
                  <button
                    key={w}
                    onClick={() => handleApplyAction(w)}
                    className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 border border-slate-200 dark:border-slate-700 rounded text-[11px] text-slate-600 dark:text-slate-300 cursor-pointer"
                  >
                    +{w}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stacks Visualizer: Undo Stack vs Redo Stack */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            {/* Undo Stack */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                <Undo2 className="w-3.5 h-3.5" />
                <span>Undo Stack ({undoStack.length})</span>
              </div>
              <div className="w-full min-h-[220px] max-h-[260px] border-x-3 border-b-3 border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/20 dark:bg-indigo-950/20 rounded-b-xl p-2 flex flex-col-reverse justify-start gap-1.5 overflow-y-auto custom-scrollbar">
                {undoStack.length === 0 ? (
                  <div className="h-32 flex items-center justify-center text-[11px] text-slate-400 italic text-center">
                    Undo stack empty
                  </div>
                ) : (
                  undoStack.map((state, idx) => (
                    <div
                      key={idx}
                      className="p-2 bg-white dark:bg-slate-800 border border-indigo-100 dark:border-indigo-900/40 rounded-lg text-xs font-mono text-slate-700 dark:text-slate-300 truncate shadow-2xs"
                    >
                      "{state}"
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Redo Stack */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-xs font-bold text-purple-600 dark:text-purple-400 mb-2">
                <Redo2 className="w-3.5 h-3.5" />
                <span>Redo Stack ({redoStack.length})</span>
              </div>
              <div className="w-full min-h-[220px] max-h-[260px] border-x-3 border-b-3 border-purple-200 dark:border-purple-900/60 bg-purple-50/20 dark:bg-purple-950/20 rounded-b-xl p-2 flex flex-col-reverse justify-start gap-1.5 overflow-y-auto custom-scrollbar">
                {redoStack.length === 0 ? (
                  <div className="h-32 flex items-center justify-center text-[11px] text-slate-400 italic text-center">
                    Redo stack empty
                  </div>
                ) : (
                  redoStack.map((state, idx) => (
                    <div
                      key={idx}
                      className="p-2 bg-white dark:bg-slate-800 border border-purple-100 dark:border-purple-900/40 rounded-lg text-xs font-mono text-slate-700 dark:text-slate-300 truncate shadow-2xs"
                    >
                      "{state}"
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SIMULATION 3: BRACKET VALIDATOR */}
      {selectedSim === 'parentheses' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Expression to Validate:
              </label>
              <input
                type="text"
                value={bracketExpr}
                onChange={(e) => {
                  setBracketExpr(e.target.value);
                  setBracketStep(0);
                }}
                className="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
              />

              <div className="flex flex-wrap gap-1.5">
                <span className="text-[10px] text-slate-400">Presets:</span>
                {['{[()]}', '(([]){})', '{[(])}', '(()))', '()[]{}'].map((ex) => (
                  <button
                    key={ex}
                    onClick={() => {
                      setBracketExpr(ex);
                      setBracketStep(0);
                    }}
                    className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs font-mono text-indigo-600 dark:text-indigo-400 cursor-pointer"
                  >
                    {ex}
                  </button>
                ))}
              </div>

              {/* Step Navigation */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-xs font-mono text-slate-500">
                  Step {bracketStep} / {bracketSteps.length - 1}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      soundEffects.playClick();
                      setBracketStep((prev) => Math.max(0, prev - 1));
                    }}
                    disabled={bracketStep === 0}
                    className="p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 disabled:opacity-30 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      soundEffects.playClick();
                      setBracketStep((prev) => Math.min(bracketSteps.length - 1, prev + 1));
                    }}
                    disabled={bracketStep >= bracketSteps.length - 1}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer disabled:opacity-40"
                  >
                    <span>Next Token</span>
                    <SkipForward className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Step Message */}
            <div
              className={`p-4 rounded-xl border text-xs leading-relaxed ${
                currentBracketStep.status === 'match'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                  : currentBracketStep.status === 'mismatch'
                  ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-950 dark:text-red-200'
                  : 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800 text-indigo-950 dark:text-indigo-200'
              }`}
            >
              <strong>Scanner Status:</strong> {currentBracketStep.msg}
            </div>
          </div>

          {/* Visual Expression & Bracket Stack */}
          <div className="lg:col-span-7 space-y-4 flex flex-col items-center">
            {/* Tokens display with active highlight */}
            <div className="flex items-center gap-2 p-3 bg-slate-100 dark:bg-slate-800/80 rounded-2xl">
              {bracketExpr.split('').map((char, idx) => (
                <div
                  key={idx}
                  className={`w-9 h-9 rounded-xl font-mono text-base font-bold flex items-center justify-center transition-all ${
                    idx === currentBracketStep.index
                      ? 'bg-indigo-600 text-white scale-110 shadow-md ring-2 ring-indigo-300'
                      : idx < currentBracketStep.index
                      ? 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                      : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 shadow-2xs'
                  }`}
                >
                  {char}
                </div>
              ))}
            </div>

            {/* Visual Stack */}
            <div className="w-full max-w-xs min-h-[220px] border-x-4 border-b-4 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 rounded-b-2xl p-3 flex flex-col-reverse justify-start gap-1.5 shadow-inner">
              {currentBracketStep.stack.length === 0 ? (
                <div className="h-32 flex items-center justify-center text-xs text-slate-400 italic">
                  Bracket Stack Empty
                </div>
              ) : (
                currentBracketStep.stack.map((b, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-indigo-600 text-white font-mono font-bold text-center rounded-xl text-base shadow-xs"
                  >
                    {b}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* SIMULATION 4: POSTFIX / RPN EVALUATOR */}
      {selectedSim === 'rpn' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Postfix Expression (Space Separated):
              </label>
              <input
                type="text"
                value={rpnExpr}
                onChange={(e) => {
                  setRpnExpr(e.target.value);
                  setRpnStep(0);
                }}
                className="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
              />

              <div className="flex flex-wrap gap-1.5">
                <span className="text-[10px] text-slate-400">Presets:</span>
                {['12 4 / 3 + 5 *', '10 2 8 * + 3 -', '5 1 2 + 4 * + 3 -'].map((ex) => (
                  <button
                    key={ex}
                    onClick={() => {
                      setRpnExpr(ex);
                      setRpnStep(0);
                    }}
                    className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs font-mono text-indigo-600 dark:text-indigo-400 cursor-pointer"
                  >
                    {ex}
                  </button>
                ))}
              </div>

              {/* Step Navigation */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-xs font-mono text-slate-500">
                  Step {rpnStep} / {rpnSteps.length - 1}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      soundEffects.playClick();
                      setRpnStep((prev) => Math.max(0, prev - 1));
                    }}
                    disabled={rpnStep === 0}
                    className="p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 disabled:opacity-30 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      soundEffects.playClick();
                      setRpnStep((prev) => Math.min(rpnSteps.length - 1, prev + 1));
                    }}
                    disabled={rpnStep >= rpnSteps.length - 1}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer disabled:opacity-40"
                  >
                    <span>Next Token</span>
                    <SkipForward className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Step Explanation */}
            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-950 dark:text-indigo-200 leading-relaxed">
              <strong>Evaluation Engine:</strong> {currentRpnStep.msg}
            </div>
          </div>

          {/* Postfix Tokens & Evaluator Stack */}
          <div className="lg:col-span-7 space-y-4 flex flex-col items-center">
            {/* Tokens Row */}
            <div className="flex flex-wrap items-center justify-center gap-2 p-3 bg-slate-100 dark:bg-slate-800/80 rounded-2xl">
              {rpnExpr.trim().split(/\s+/).map((tok, idx) => (
                <div
                  key={idx}
                  className={`px-3 py-2 rounded-xl font-mono text-sm font-bold flex items-center justify-center transition-all ${
                    idx === currentRpnStep.tokenIndex
                      ? 'bg-purple-600 text-white scale-110 shadow-md ring-2 ring-purple-300'
                      : idx < currentRpnStep.tokenIndex
                      ? 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                      : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 shadow-2xs'
                  }`}
                >
                  {tok}
                </div>
              ))}
            </div>

            {/* Operand Stack */}
            <div className="w-full max-w-xs min-h-[220px] border-x-4 border-b-4 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 rounded-b-2xl p-3 flex flex-col-reverse justify-start gap-1.5 shadow-inner">
              {currentRpnStep.stack.length === 0 ? (
                <div className="h-32 flex items-center justify-center text-xs text-slate-400 italic">
                  Operand Stack Empty
                </div>
              ) : (
                currentRpnStep.stack.map((val, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-purple-600 text-white font-mono font-bold text-center rounded-xl text-base shadow-xs"
                  >
                    {val}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
