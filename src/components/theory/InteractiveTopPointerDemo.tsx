import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Minus, ArrowLeft, ArrowDown, HelpCircle, Sparkles } from 'lucide-react';
import { soundEffects } from '../../services/sound';

export const InteractiveTopPointerDemo: React.FC = () => {
  const [items, setItems] = useState<number[]>([20, 30, 40]);
  const [lastAction, setLastAction] = useState<string>(
    'TOP is currently pointing to index 2 (value: 40).'
  );
  const capacity = 5;

  const handlePush = () => {
    if (items.length >= capacity) {
      soundEffects.playError();
      setLastAction(`Stack is full (Capacity ${capacity})! Cannot push.`);
      return;
    }
    soundEffects.playPush();
    const nextVal = (items.length + 1) * 10 + 10;
    const newItems = [...items, nextVal];
    setItems(newItems);
    setLastAction(`Pushed ${nextVal}. TOP pointer shifted UP to index ${newItems.length - 1}.`);
  };

  const handlePop = () => {
    if (items.length === 0) {
      soundEffects.playError();
      setLastAction('Stack is empty! TOP = -1. Cannot pop.');
      return;
    }
    soundEffects.playPop();
    const popped = items[items.length - 1];
    const newItems = items.slice(0, -1);
    setItems(newItems);
    setLastAction(
      newItems.length > 0
        ? `Popped ${popped}. When the current TOP is removed, the next element (${newItems[newItems.length - 1]}) becomes TOP at index ${newItems.length - 1}.`
        : `Popped ${popped}. Stack is now empty. TOP pointer resets to -1.`
    );
  };

  const topIndex = items.length - 1;
  const topValue = items.length > 0 ? items[topIndex] : null;

  return (
    <div className="bg-slate-50 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Dynamic TOP Pointer & Stack Anatomy
          </span>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Watch how the TOP index pointer dynamically updates on every Push and Pop.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePush}
            disabled={items.length >= capacity}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Push
          </button>
          <button
            onClick={handlePop}
            disabled={items.length === 0}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" /> Pop
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-2.5 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">TOP Index</span>
          <span className="text-sm font-bold font-mono text-indigo-600 dark:text-indigo-400">
            {topIndex >= 0 ? `[ ${topIndex} ]` : '-1 (Empty)'}
          </span>
        </div>
        <div className="p-2.5 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">TOP Value</span>
          <span className="text-sm font-bold font-mono text-indigo-600 dark:text-indigo-400">
            {topValue !== null ? topValue : 'None'}
          </span>
        </div>
        <div className="p-2.5 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">Current Size</span>
          <span className="text-sm font-bold font-mono text-slate-800 dark:text-slate-200">
            {items.length} / {capacity}
          </span>
        </div>
        <div className="p-2.5 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">Bottom Index</span>
          <span className="text-sm font-bold font-mono text-slate-800 dark:text-slate-200">
            {items.length > 0 ? '0' : 'None'}
          </span>
        </div>
      </div>

      {/* Dynamic Stack Layout with Animated Pointer */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        <div className="md:col-span-6 flex flex-col items-center">
          <div className="w-full max-w-[260px] min-h-[220px] rounded-b-2xl border-x-4 border-b-4 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-3 flex flex-col-reverse gap-2 shadow-inner relative">
            {items.length === 0 ? (
              <div className="h-44 flex flex-col items-center justify-center text-xs font-mono text-slate-400 text-center">
                <span>[ Empty Stack Container ]</span>
                <span className="text-[10px] text-slate-400 mt-1">TOP = -1</span>
              </div>
            ) : (
              items.map((val, idx) => {
                const isTop = idx === topIndex;
                const isBottom = idx === 0;
                return (
                  <motion.div
                    key={`${idx}-${val}`}
                    layout
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`h-11 rounded-xl flex items-center justify-between px-3 text-xs font-bold font-mono shadow-xs relative transition-all ${
                      isTop
                        ? 'bg-indigo-600 text-white ring-2 ring-indigo-400 shadow-md'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/20 font-mono">
                        idx {idx}
                      </span>
                      <span>[{val}]</span>
                    </div>

                    {isTop && (
                      <div className="flex items-center gap-1 text-[10px] bg-white text-indigo-700 dark:bg-slate-900 dark:text-indigo-300 px-2 py-0.5 rounded-md font-extrabold tracking-wider animate-pulse">
                        <ArrowLeft className="w-3 h-3" />
                        <span>TOP</span>
                      </div>
                    )}

                    {!isTop && isBottom && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        BOTTOM
                      </span>
                    )}
                  </motion.div>
                );
              })
            )}
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mt-1.5">
            Base Foundation (Index 0)
          </span>
        </div>

        {/* Right Explanation Card */}
        <div className="md:col-span-6 space-y-3">
          <div className="p-4 bg-indigo-50/80 dark:bg-indigo-950/40 rounded-xl border border-indigo-200/80 dark:border-indigo-800/80 space-y-2">
            <div className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300 text-xs font-bold font-mono">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>KEY PRINCIPLE OF TOP</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
              "When the current TOP is removed, the element immediately underneath it automatically becomes the new TOP."
            </p>
          </div>

          <div className="p-3.5 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
              Pointer Movement Feedback:
            </span>
            <p className="text-xs font-mono text-indigo-700 dark:text-indigo-300">
              {lastAction}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
