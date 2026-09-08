import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, Eye, ListFilter, RotateCcw, Check, Sparkles, AlertCircle } from 'lucide-react';
import { soundEffects } from '../../services/sound';

export const InteractiveMiniOperationsLab: React.FC = () => {
  const [items, setItems] = useState<number[]>([10, 20, 40]);
  const [highlightedIndices, setHighlightedIndices] = useState<number[]>([]);
  const [peekHighlight, setPeekHighlight] = useState<boolean>(false);
  const [actionLog, setActionLog] = useState<{ title: string; message: string; type: 'push' | 'pop' | 'peek' | 'display' | 'reset' }>({
    title: 'Ready for Operations',
    message: 'Try clicking [PUSH], [POP], [PEEK], [DISPLAY], or [RESET] below.',
    type: 'reset',
  });

  const capacity = 5;

  const handlePush = () => {
    if (items.length >= capacity) {
      soundEffects.playError();
      setActionLog({
        title: 'Stack Overflow',
        message: `Capacity (${capacity}) reached. Cannot push!`,
        type: 'pop',
      });
      return;
    }
    soundEffects.playPush();
    const nextVal = (items.length + 1) * 15;
    const newItems = [...items, nextVal];
    setItems(newItems);
    setHighlightedIndices([]);
    setPeekHighlight(false);
    setActionLog({
      title: `PUSH(${nextVal})`,
      message: `${nextVal} enters at TOP. Size is now ${newItems.length}.`,
      type: 'push',
    });
  };

  const handlePop = () => {
    if (items.length === 0) {
      soundEffects.playError();
      setActionLog({
        title: 'Stack Underflow',
        message: 'Stack is empty (Size 0). Nothing to pop!',
        type: 'pop',
      });
      return;
    }
    soundEffects.playPop();
    const popped = items[items.length - 1];
    const newItems = items.slice(0, -1);
    setItems(newItems);
    setHighlightedIndices([]);
    setPeekHighlight(false);
    setActionLog({
      title: `POP() → ${popped}`,
      message: `${popped} leaves TOP. New TOP is ${newItems.length > 0 ? newItems[newItems.length - 1] : 'None (Empty)'}.`,
      type: 'pop',
    });
  };

  const handlePeek = () => {
    if (items.length === 0) {
      soundEffects.playError();
      setActionLog({
        title: 'PEEK() Failed',
        message: 'Stack is empty. No element at TOP to inspect.',
        type: 'pop',
      });
      return;
    }
    soundEffects.playSuccess();
    const topVal = items[items.length - 1];
    setPeekHighlight(true);
    setHighlightedIndices([]);
    setTimeout(() => setPeekHighlight(false), 2000);
    setActionLog({
      title: `PEEK() → TOP = ${topVal}`,
      message: `Inspected TOP value (${topVal}). The stack remains completely unchanged!`,
      type: 'peek',
    });
  };

  const handleDisplay = () => {
    if (items.length === 0) {
      soundEffects.playError();
      setActionLog({
        title: 'DISPLAY()',
        message: 'Stack is empty: [ ]',
        type: 'display',
      });
      return;
    }
    soundEffects.playSuccess();
    setHighlightedIndices(items.map((_, i) => i));
    setPeekHighlight(false);
    setTimeout(() => setHighlightedIndices([]), 2500);
    setActionLog({
      title: 'DISPLAY() → Stack Contents',
      message: `[ ${items.slice().reverse().join(' → ')} ] (Shown from TOP to BOTTOM without popping).`,
      type: 'display',
    });
  };

  const handleReset = () => {
    soundEffects.playClick();
    setItems([10, 20, 40]);
    setHighlightedIndices([]);
    setPeekHighlight(false);
    setActionLog({
      title: 'RESET',
      message: 'Stack reset to initial elements: [10, 20, 40].',
      type: 'reset',
    });
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 space-y-5">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Mini Operations Laboratory
          </span>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Execute all fundamental Stack operations and observe live container state.
          </p>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={handlePush}
            disabled={items.length >= capacity}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> PUSH
          </button>
          <button
            onClick={handlePop}
            disabled={items.length === 0}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" /> POP
          </button>
          <button
            onClick={handlePeek}
            disabled={items.length === 0}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" /> PEEK
          </button>
          <button
            onClick={handleDisplay}
            disabled={items.length === 0}
            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
          >
            <ListFilter className="w-3.5 h-3.5" /> DISPLAY
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> RESET
          </button>
        </div>
      </div>

      {/* Main Stage */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Stack Container */}
        <div className="md:col-span-6 flex flex-col items-center">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
            TOP of Stack (Open Access)
          </span>

          <div className="w-full max-w-[240px] min-h-[220px] rounded-b-2xl border-x-4 border-b-4 border-indigo-300 dark:border-indigo-800 bg-white dark:bg-slate-950 p-3 flex flex-col-reverse gap-2 shadow-inner relative">
            {items.length === 0 ? (
              <div className="h-44 flex flex-col items-center justify-center text-xs font-mono text-slate-400">
                [ Empty Stack ]
              </div>
            ) : (
              items.map((val, idx) => {
                const isTop = idx === items.length - 1;
                const isPeeked = isTop && peekHighlight;
                const isDisplayHighlighted = highlightedIndices?.includes(idx);

                return (
                  <motion.div
                    key={`${idx}-${val}`}
                    layout
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className={`h-11 rounded-xl flex items-center justify-between px-3 text-xs font-bold font-mono shadow-xs transition-all ${
                      isPeeked
                        ? 'bg-amber-500 text-white ring-4 ring-amber-300 animate-pulse scale-105'
                        : isDisplayHighlighted
                        ? 'bg-purple-600 text-white ring-2 ring-purple-300'
                        : isTop
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span>[{val}]</span>
                    <span className="text-[10px] opacity-80">
                      {isTop ? 'TOP' : `idx ${idx}`}
                    </span>
                  </motion.div>
                );
              })
            )}
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mt-1">
            Closed Bottom (Base)
          </span>
        </div>

        {/* Operation Output Card */}
        <div className="md:col-span-6 space-y-3">
          <div className="p-4 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-indigo-600 dark:text-indigo-400 uppercase">
                {actionLog.title}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                Size: {items.length}
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-mono leading-relaxed">
              {actionLog.message}
            </p>
          </div>

          {/* Quick Operation Rules Checklist */}
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900/60">
              <span className="font-bold text-indigo-700 dark:text-indigo-300 block">PUSH(x)</span>
              <span className="text-slate-600 dark:text-slate-400 text-[10px]">Add to TOP [O(1)]</span>
            </div>
            <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-100 dark:border-rose-900/60">
              <span className="font-bold text-rose-700 dark:text-rose-300 block">POP()</span>
              <span className="text-slate-600 dark:text-slate-400 text-[10px]">Remove TOP [O(1)]</span>
            </div>
            <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-100 dark:border-amber-900/60">
              <span className="font-bold text-amber-700 dark:text-amber-300 block">PEEK()</span>
              <span className="text-slate-600 dark:text-slate-400 text-[10px]">View TOP [O(1)]</span>
            </div>
            <div className="p-2.5 bg-purple-50 dark:bg-purple-950/40 rounded-xl border border-purple-100 dark:border-purple-900/60">
              <span className="font-bold text-purple-700 dark:text-purple-300 block">DISPLAY()</span>
              <span className="text-slate-600 dark:text-slate-400 text-[10px]">Traverse all [O(n)]</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
