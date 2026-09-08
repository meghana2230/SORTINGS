import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Minus, ArrowRight } from 'lucide-react';
import { soundEffects } from '../../services/sound';

export const InteractiveArrayVsList: React.FC = () => {
  const [items, setItems] = useState<number[]>([10, 20, 30]);

  const handlePush = () => {
    if (items.length >= 5) return;
    soundEffects.playPush();
    setItems((prev) => [...prev, (prev.length + 1) * 10]);
  };

  const handlePop = () => {
    if (items.length === 0) return;
    soundEffects.playPop();
    setItems((prev) => prev.slice(0, -1));
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 space-y-5 transition-colors">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Side-by-Side Architectural Visualizer
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePush}
            disabled={items.length >= 5}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Push
          </button>
          <button
            onClick={handlePop}
            disabled={items.length === 0}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" /> Pop
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Model 1: Array-based Contiguous Memory */}
        <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              Array Stack (Contiguous RAM)
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              TOP Index: {items.length - 1}
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            {[4, 3, 2, 1, 0].map((idx) => {
              const hasVal = idx < items.length;
              const val = hasVal ? items[idx] : null;
              const isTop = idx === items.length - 1;

              return (
                <div
                  key={idx}
                  className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-mono transition-all ${
                    isTop
                      ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-500 text-indigo-900 dark:text-indigo-200 font-bold'
                      : hasVal
                      ? 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                      : 'border-dashed border-slate-200 dark:border-slate-800 text-slate-400 bg-transparent opacity-60'
                  }`}
                >
                  <span className="w-12 text-[10px] text-slate-400">Idx [{idx}]</span>
                  <span className="flex-1 font-bold">{hasVal ? `Value: ${val}` : '[ Empty Cell ]'}</span>
                  {isTop && (
                    <span className="text-[9px] bg-indigo-600 text-white px-1.5 py-0.5 rounded font-bold">
                      TOP
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            Contiguous indexed buffer. Changing \`top\` index is instantaneous.
          </p>
        </div>

        {/* Model 2: Linked List Dynamic Nodes */}
        <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              Linked List Stack (Dynamic Heap Nodes)
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              TOP Pointer: {items.length > 0 ? `Node(${items[items.length - 1]})` : 'NULL'}
            </span>
          </div>

          <div className="flex flex-col gap-2 min-h-[190px] justify-center">
            {items.length === 0 ? (
              <div className="text-center text-xs font-mono text-slate-400 py-6">
                TOP → NULL (Empty Stack)
              </div>
            ) : (
              [...items].reverse().map((val, idx) => {
                const isTopNode = idx === 0;
                const isBottomNode = idx === items.length - 1;

                return (
                  <motion.div
                    key={`${val}-${idx}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2"
                  >
                    <div
                      className={`flex-1 p-2 rounded-lg border text-xs font-mono flex items-center justify-between ${
                        isTopNode
                          ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold'
                          : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isTopNode && (
                          <span className="text-[9px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-bold">
                            TOP
                          </span>
                        )}
                        <span>Node: {val}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        next → {isBottomNode ? 'NULL' : 'Node'}
                      </span>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            Nodes are linked dynamically in memory. No fixed capacity constraints.
          </p>
        </div>
      </div>
    </div>
  );
};
