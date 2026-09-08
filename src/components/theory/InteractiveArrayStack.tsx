import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Minus, ArrowLeft, RotateCcw, Sparkles } from 'lucide-react';
import { soundEffects } from '../../services/sound';

export const InteractiveArrayStack: React.FC = () => {
  const capacity = 5;
  const [items, setItems] = useState<number[]>([10, 20, 30]);
  const [log, setLog] = useState<string>(
    'Initial state: top = 2, arr[2] = 30. Memory is contiguous.'
  );

  const top = items.length - 1;

  const handlePush = () => {
    if (items.length >= capacity) {
      soundEffects.playError();
      setLog(`Cannot push: top == capacity - 1 (${capacity - 1}). Stack is full!`);
      return;
    }
    soundEffects.playPush();
    const nextVal = (items.length + 1) * 10;
    const newItems = [...items, nextVal];
    setItems(newItems);
    setLog(`Executed: arr[++top] = ${nextVal}. top is now ${newItems.length - 1}.`);
  };

  const handlePop = () => {
    if (items.length === 0) {
      soundEffects.playError();
      setLog('Cannot pop: top == -1. Stack is empty!');
      return;
    }
    soundEffects.playPop();
    const popped = items[items.length - 1];
    const newItems = items.slice(0, -1);
    setItems(newItems);
    setLog(`Executed: return arr[top--]. Popped ${popped}. top is now ${newItems.length - 1}.`);
  };

  const handleReset = () => {
    soundEffects.playClick();
    setItems([10, 20, 30]);
    setLog('Reset array stack to [10, 20, 30].');
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Array-Based Memory Representation
          </span>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Elements sit in contiguous zero-indexed memory cells tracked by the integer variable <code>top</code>.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePush}
            disabled={items.length >= capacity}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Push(40)
          </button>
          <button
            onClick={handlePop}
            disabled={items.length === 0}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" /> Pop()
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Memory Grid & Array Index Display */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold font-mono text-slate-700 dark:text-slate-300">
            Array Buffer: <code>int arr[{capacity}]</code> (Contiguous RAM)
          </span>
          <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold">
            top = {top} (Size = {items.length})
          </span>
        </div>

        {/* Array Cells (Vertical stack table & horizontal memory blocks) */}
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: capacity }).map((_, idx) => {
            const hasItem = idx < items.length;
            const isTop = idx === top;
            const val = hasItem ? items[idx] : null;

            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border flex flex-col items-center justify-between text-center transition-all ${
                  isTop
                    ? 'bg-indigo-600 text-white border-indigo-700 ring-2 ring-indigo-400 shadow-md scale-102'
                    : hasItem
                    ? 'bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                    : 'bg-slate-100/60 dark:bg-slate-950/40 border-dashed border-slate-300 dark:border-slate-800 text-slate-400 opacity-60'
                }`}
              >
                <span className="text-[10px] font-mono opacity-80">arr[{idx}]</span>
                <span className="text-base font-bold font-mono my-1">
                  {val !== null ? val : '—'}
                </span>
                <span className="text-[10px] font-mono font-bold">
                  {isTop ? '★ TOP' : hasItem ? 'OCCUPIED' : 'FREE'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Code Action Feedback */}
      <div className="p-3.5 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-xl border border-indigo-200/80 dark:border-indigo-800/80 space-y-1">
        <div className="flex items-center gap-1.5 text-[11px] font-bold font-mono text-indigo-700 dark:text-indigo-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>POINTER & INDEX TRACKER:</span>
        </div>
        <p className="text-xs font-mono text-slate-700 dark:text-slate-300">
          {log}
        </p>
      </div>
    </div>
  );
};
