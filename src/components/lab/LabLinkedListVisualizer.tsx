import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, CornerDownRight, ShieldCheck } from 'lucide-react';
import { StackItem } from '../../types';

interface LabLinkedListVisualizerProps {
  items: StackItem[];
  peekValue?: number | string | null;
}

export const LabLinkedListVisualizer: React.FC<LabLinkedListVisualizerProps> = ({
  items,
  peekValue,
}) => {
  // In linked list stack: Top is at items[items.length - 1] (HEAD points to TOP)
  // Reversing so TOP is displayed first on the left:
  const reversedNodes = [...items].reverse();

  return (
    <div className="w-full flex flex-col items-center space-y-4">
      {/* Legend & Header */}
      <div className="w-full flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700 dark:text-slate-300">
            Dynamic Linked Nodes (Heap Pointers)
          </span>
          <span className="px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 text-[10px] font-mono">
            Node Count: {items.length}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Dynamic sizing — No fixed capacity limits</span>
        </div>
      </div>

      {/* Linked Nodes Horizontal Chain */}
      <div className="w-full overflow-x-auto custom-scrollbar py-6">
        <div className="flex items-center min-w-max px-4 gap-3">
          {/* Head / Top Pointer */}
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-center px-3 py-2 bg-purple-600 text-white rounded-xl shadow-sm">
              <span className="text-[10px] font-extrabold tracking-wider uppercase font-mono">
                HEAD / TOP
              </span>
              <span className="text-[9px] opacity-80 font-mono">
                {items.length > 0 ? '*node_0' : 'NULL'}
              </span>
            </div>
            <ArrowRight className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0" />
          </div>

          {/* Node Chain */}
          {items.length === 0 ? (
            <div className="px-4 py-3 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-400 font-mono text-xs">
              NULL (Empty Stack)
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <AnimatePresence>
                {reversedNodes.map((item, idx) => {
                  const isTop = idx === 0;
                  const isPeeked = peekValue !== null && item.value === peekValue && isTop;
                  const heapAddress = `0x7FFF${(idx * 16 + 128).toString(16).toUpperCase()}`;

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ scale: 0.8, opacity: 0, x: -10 }}
                      animate={{ scale: 1, opacity: 1, x: 0 }}
                      exit={{ scale: 0.8, opacity: 0, x: 10 }}
                      layout
                      className="flex items-center gap-3"
                    >
                      {/* Node Box with DATA and NEXT sections */}
                      <div
                        className={`rounded-xl border-2 overflow-hidden shadow-xs select-none transition-all ${
                          isPeeked
                            ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/80 ring-2 ring-amber-300'
                            : isTop
                            ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                        }`}
                      >
                        {/* Heap Address Tag */}
                        <div className="bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 text-[8px] font-mono text-slate-400 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                          <span>{heapAddress}</span>
                          {isTop && <span className="font-bold text-indigo-600 dark:text-indigo-400">TOP</span>}
                        </div>

                        <div className="flex items-stretch">
                          {/* Data compartment */}
                          <div className="px-4 py-3 flex flex-col items-center justify-center min-w-[56px]">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                              data
                            </span>
                            <span className="font-mono font-extrabold text-base text-slate-900 dark:text-white">
                              {item.value}
                            </span>
                          </div>

                          {/* Divider */}
                          <div className="w-[1px] bg-slate-200 dark:border-slate-800" />

                          {/* Next pointer compartment */}
                          <div className="px-2.5 py-3 bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center justify-center min-w-[48px]">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                              next
                            </span>
                            <span className="text-[9px] font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                              {idx < reversedNodes.length - 1 ? `*ptr` : 'NULL'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Pointer Arrow to Next Node */}
                      <div className="flex items-center">
                        <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-600" />
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* End of list NULL */}
              <div className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                NULL
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Linked List Explanation */}
      <div className="w-full p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
        <CornerDownRight className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Linked List Implementation Note:</strong> Each push dynamically allocates a new heap node where <code className="text-indigo-600 dark:text-indigo-400 font-bold">newNode-&gt;next = top</code>, and sets <code className="font-bold">top = newNode</code>. This provides unlimited dynamic scaling, though with 8-byte pointer overhead per node.
        </p>
      </div>
    </div>
  );
};
