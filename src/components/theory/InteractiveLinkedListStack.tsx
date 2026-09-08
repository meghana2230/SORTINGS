import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, ArrowRight, ArrowDown, RotateCcw, Sparkles } from 'lucide-react';
import { soundEffects } from '../../services/sound';

export const InteractiveLinkedListStack: React.FC = () => {
  const [nodes, setNodes] = useState<number[]>([30, 20, 10]);
  const [log, setLog] = useState<string>(
    'TOP pointer references head node [30]. Node [10] points to NULL.'
  );

  const handlePush = () => {
    soundEffects.playPush();
    const nextVal = (nodes.length + 1) * 10;
    const newNodes = [nextVal, ...nodes];
    setNodes(newNodes);
    setLog(`Allocated Node(${nextVal}). Linked: newNode->next = TOP, TOP = Node(${nextVal}).`);
  };

  const handlePop = () => {
    if (nodes.length === 0) {
      soundEffects.playError();
      setLog('Cannot pop: TOP is NULL (Stack Underflow).');
      return;
    }
    soundEffects.playPop();
    const popped = nodes[0];
    const newNodes = nodes.slice(1);
    setNodes(newNodes);
    setLog(
      newNodes.length > 0
        ? `Popped Node(${popped}). TOP shifted to next node [${newNodes[0]}].`
        : `Popped Node(${popped}). Stack is now empty: TOP = NULL.`
    );
  };

  const handleReset = () => {
    soundEffects.playClick();
    setNodes([30, 20, 10]);
    setLog('Reset Linked List stack to [30] -> [20] -> [10] -> NULL.');
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Linked List Dynamic Node Chain
          </span>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Each element is stored in a discrete heap-allocated Node with a <code>data</code> field and a <code>next</code> pointer.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePush}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Push Node
          </button>
          <button
            onClick={handlePop}
            disabled={nodes.length === 0}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" /> Pop Node
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* TOP Pointer Indicator */}
      <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
        <span>TOP Pointer</span>
        <ArrowRight className="w-3.5 h-3.5" />
        <span className="bg-indigo-100 dark:bg-indigo-950 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
          {nodes.length > 0 ? `Head Node [${nodes[0]}]` : 'NULL (Empty)'}
        </span>
      </div>

      {/* Linked Nodes Visual Horizontal Chain */}
      <div className="overflow-x-auto pb-2">
        <div className="flex items-center gap-2 min-w-max py-2">
          {nodes.length === 0 ? (
            <div className="p-4 bg-white dark:bg-slate-950 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 text-xs font-mono text-slate-400">
              TOP = NULL [Empty Linked List Stack]
            </div>
          ) : (
            nodes.map((val, idx) => {
              const isHead = idx === 0;
              const isTail = idx === nodes.length - 1;

              return (
                <React.Fragment key={`${idx}-${val}`}>
                  <motion.div
                    layout
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`flex rounded-xl overflow-hidden border shadow-xs transition-all ${
                      isHead
                        ? 'border-indigo-600 ring-2 ring-indigo-400'
                        : 'border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {/* Node Data Part */}
                    <div
                      className={`px-3 py-2 text-center font-mono font-bold text-xs ${
                        isHead
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      <span className="text-[9px] block opacity-75">DATA</span>
                      <span>{val}</span>
                    </div>

                    {/* Node Next Pointer Part */}
                    <div
                      className={`px-2.5 py-2 border-l text-center font-mono text-xs flex flex-col justify-center ${
                        isHead
                          ? 'bg-indigo-700 text-white border-indigo-500'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      <span className="text-[9px] block opacity-75">NEXT</span>
                      <span>•</span>
                    </div>
                  </motion.div>

                  {/* Arrow to next node or NULL */}
                  <div className="flex items-center text-slate-400">
                    <ArrowRight className="w-4 h-4 text-indigo-500" />
                  </div>
                </React.Fragment>
              );
            })
          )}

          {/* Terminal NULL Block */}
          <div className="px-3 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-mono text-xs font-bold border border-slate-300 dark:border-slate-700">
            NULL
          </div>
        </div>
      </div>

      {/* Dynamic Trace Log */}
      <div className="p-3.5 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-xl border border-indigo-200/80 dark:border-indigo-800/80 space-y-1">
        <div className="flex items-center gap-1.5 text-[11px] font-bold font-mono text-indigo-700 dark:text-indigo-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>HEAP DYNAMICS:</span>
        </div>
        <p className="text-xs font-mono text-slate-700 dark:text-slate-300">
          {log}
        </p>
      </div>
    </div>
  );
};
