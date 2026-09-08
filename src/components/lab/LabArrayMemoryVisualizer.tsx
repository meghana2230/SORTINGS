import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowDown, CornerDownRight, Plus, Trash2 } from 'lucide-react';
import { StackItem } from '../../types';

interface LabArrayMemoryVisualizerProps {
  items: StackItem[];
  capacity: number;
  onPush: (value: number | string) => void;
  onPop: () => void;
  peekValue?: number | string | null;
}

export const LabArrayMemoryVisualizer: React.FC<LabArrayMemoryVisualizerProps> = ({
  items,
  capacity,
  onPush,
  onPop,
  peekValue,
}) => {
  const topIndex = items.length - 1;
  const baseAddress = 0x1000;

  // Build array of length = capacity
  const slots = Array.from({ length: capacity }, (_, i) => {
    const item = items[i] || null;
    const isTop = i === topIndex;
    const isPeeked = peekValue !== null && item && item.value === peekValue && isTop;
    const addressHex = `0x${(baseAddress + i * 4).toString(16).toUpperCase()}`;

    return {
      index: i,
      item,
      isTop,
      isPeeked,
      addressHex,
    };
  });

  return (
    <div className="w-full flex flex-col items-center space-y-4">
      {/* Title & Legend */}
      <div className="w-full flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700 dark:text-slate-300">
            Contiguous Memory Buffer Array
          </span>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-mono">
            T[0..{capacity - 1}]
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-indigo-600 inline-block" /> Occupied
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded border border-dashed border-slate-300 dark:border-slate-700 inline-block" /> Free
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-purple-500 inline-block" /> Stack Pointer (SP)
          </span>
        </div>
      </div>

      {/* Array Cells Grid / Row */}
      <div className="w-full overflow-x-auto custom-scrollbar pb-3 pt-6">
        <div className="flex items-end justify-center gap-2 min-w-max px-4">
          {slots.map(({ index, item, isTop, isPeeked, addressHex }) => (
            <div key={index} className="flex flex-col items-center space-y-1.5">
              {/* Pointer Indicator above Top */}
              <div className="h-6 flex items-center justify-center">
                {isTop ? (
                  <motion.div
                    initial={{ y: -4, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex flex-col items-center"
                  >
                    <span className="text-[10px] font-extrabold text-purple-600 dark:text-purple-400 font-mono tracking-tighter">
                      SP / TOP
                    </span>
                    <ArrowDown className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                  </motion.div>
                ) : index === topIndex + 1 && items.length < capacity ? (
                  <span className="text-[9px] text-slate-400 font-mono opacity-60">
                    (Next)
                  </span>
                ) : null}
              </div>

              {/* Memory Cell */}
              <motion.div
                layout
                whileHover={{ scale: 1.04 }}
                className={`w-14 sm:w-16 h-16 sm:h-20 rounded-xl border-2 flex flex-col items-center justify-center relative transition-all select-none ${
                  item
                    ? isPeeked
                      ? 'bg-amber-100 dark:bg-amber-950/80 border-amber-500 shadow-md ring-2 ring-amber-300'
                      : isTop
                      ? 'bg-linear-to-b from-indigo-500 to-purple-600 border-indigo-700 text-white shadow-md'
                      : 'bg-white dark:bg-slate-800 border-indigo-200 dark:border-indigo-800/80 text-slate-900 dark:text-white shadow-xs'
                    : 'bg-slate-50/50 dark:bg-slate-900/40 border-dashed border-slate-300 dark:border-slate-800 text-slate-300 dark:text-slate-600'
                }`}
              >
                {item ? (
                  <>
                    <span
                      className={`font-mono font-extrabold text-base sm:text-lg ${
                        isTop ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'
                      }`}
                    >
                      {item.value}
                    </span>
                    {isTop && (
                      <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-100">
                        TOP
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-[10px] font-mono text-slate-300 dark:text-slate-600">
                    NULL
                  </span>
                )}

                {/* Index badge inside bottom */}
                <div
                  className={`absolute bottom-1 right-1 px-1 rounded text-[8px] font-mono ${
                    isTop
                      ? 'bg-black/20 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  [{index}]
                </div>
              </motion.div>

              {/* Memory Address Offset */}
              <div className="text-[9px] font-mono text-slate-400 text-center">
                {addressHex}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Array Representation Explanation */}
      <div className="w-full p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
        <CornerDownRight className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Array Implementation Note:</strong> Elements reside in consecutive memory addresses (
          <code className="text-indigo-600 dark:text-indigo-400 font-bold">Base + i × 4B</code>). Pushing increments the Stack Pointer (<code className="font-bold">top++</code>), and Popping decrements it (<code className="font-bold">top--</code>) in strictly <code className="font-bold">O(1)</code> time.
        </p>
      </div>
    </div>
  );
};
