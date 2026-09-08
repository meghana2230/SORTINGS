import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowDown, AlertCircle, Sparkles } from 'lucide-react';
import { StackItem } from '../../types';

interface StackVisualizerProps {
  items: StackItem[];
  capacity: number;
  isDragOver?: boolean;
  onDropItem?: (value: number | string) => void;
  onPopTop?: () => void;
  onInvalidPopAttempt?: (value: number | string) => void;
  allowDragPop?: boolean;
  highlightTop?: boolean;
  peekValue?: number | string | null;
  customEmptyMessage?: string;
}

export const StackVisualizer: React.FC<StackVisualizerProps> = ({
  items,
  capacity,
  isDragOver = false,
  onDropItem,
  onPopTop,
  onInvalidPopAttempt,
  allowDragPop = true,
  highlightTop = true,
  peekValue = null,
  customEmptyMessage,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to top so the newest elements and TOP pointer are always visible
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, [items.length]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain') || e.dataTransfer.getData('application/json');
    if (data && onDropItem) {
      try {
        const parsed = JSON.parse(data);
        onDropItem(parsed.value ?? parsed);
      } catch {
        onDropItem(isNaN(Number(data)) ? data : Number(data));
      }
    }
  };

  const isFull = items.length >= capacity;
  const isEmpty = items.length === 0;

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      {/* Top Header Status & Capacity */}
      <div className="w-full flex items-center justify-between mb-3 px-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Stack Status
          </span>
          {isFull ? (
            <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 rounded-full border border-amber-200 dark:border-amber-800/80 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-amber-600 dark:text-amber-400" /> Full (Overflow)
            </span>
          ) : isEmpty ? (
            <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full border border-slate-200 dark:border-slate-700">
              Empty
            </span>
          ) : (
            <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded-full border border-indigo-200 dark:border-indigo-800/80">
              Active ({items.length} items)
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
            {items.length} / {capacity}
          </span>
          <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
            <div
              className={`h-full transition-all duration-300 ${
                isFull ? 'bg-amber-500' : 'bg-indigo-600 dark:bg-indigo-500'
              }`}
              style={{ width: `${Math.min(100, (items.length / capacity) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* TOP Pointer Indicator - Sleek Interface Theme */}
      <div className="h-10 flex flex-col items-center justify-center w-full relative mb-1">
        <AnimatePresence>
          {!isEmpty && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center gap-0.5"
            >
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">
                TOP [{items.length - 1}]
              </span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-indigo-600 dark:text-indigo-400">
                <path d="M12 4L12 20M12 20L6 14M12 20L18 14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Stack Container Wall (3-sided container - Sleek Theme) */}
      <div
        id="stack-drop-target"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`w-full relative transition-colors duration-200 rounded-b-3xl border-x-4 border-b-4 ${
          isDragOver
            ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-inner ring-4 ring-indigo-50 dark:ring-indigo-950/60'
            : isFull
            ? 'border-amber-400 dark:border-amber-600 bg-amber-50/20 dark:bg-amber-950/20 shadow-sm'
            : 'border-slate-300 dark:border-slate-700 bg-slate-100/30 dark:bg-slate-900/40 shadow-sm'
        } p-2.5 min-h-[320px] max-h-[400px] flex flex-col justify-end overflow-hidden`}
      >
        {/* Drop zone indicator when dragging */}
        {isDragOver && !isFull && (
          <div className="absolute inset-x-4 top-3 border-2 border-dashed border-indigo-400 dark:border-indigo-500 bg-indigo-50/90 dark:bg-indigo-950/90 rounded-xl p-3 flex items-center justify-center gap-2 text-indigo-700 dark:text-indigo-300 text-xs font-bold z-20 animate-pulse">
            <ArrowDown className="w-4 h-4" /> Drop value here to PUSH onto TOP
          </div>
        )}

        {/* Scrollable container for items */}
        <div
          ref={containerRef}
          className="w-full flex flex-col-reverse gap-1.5 overflow-y-auto max-h-[330px] px-1 py-1 custom-scrollbar"
        >
          {isEmpty ? (
            <div className="h-48 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white/60 dark:bg-slate-900/60">
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-2">
                <ArrowDown className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                STACK EMPTY
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 max-w-[220px]">
                {customEmptyMessage || 'Drag elements from the input source to perform a PUSH.'}
              </p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {items.map((item, index) => {
                const isTopItem = index === items.length - 1;
                const isPeeked = peekValue !== null && String(item.value) === String(peekValue) && isTopItem;

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{
                      opacity: 0,
                      y: -75,
                      scale: 0.88,
                      filter: 'blur(2px)',
                    }}
                    animate={
                      isPeeked
                        ? {
                            opacity: 1,
                            y: 0,
                            scale: [1, 1.02, 1],
                            filter: 'blur(0px)',
                            transition: {
                              scale: { repeat: Infinity, duration: 1.4, ease: 'easeInOut' },
                              type: 'spring',
                              stiffness: 400,
                              damping: 24,
                            },
                          }
                        : {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            filter: 'blur(0px)',
                          }
                    }
                    exit={{
                      opacity: 0,
                      y: -85,
                      scale: 0.82,
                      filter: 'blur(3px)',
                      transition: {
                        duration: 0.28,
                        ease: [0.32, 0, 0.67, 0],
                      },
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 420,
                      damping: 25,
                      mass: 0.75,
                    }}
                    whileHover={
                      isTopItem && allowDragPop
                        ? { y: -2, scale: 1.01, transition: { duration: 0.15 } }
                        : undefined
                    }
                    whileTap={
                      isTopItem && allowDragPop
                        ? { scale: 0.98 }
                        : undefined
                    }
                    draggable={allowDragPop}
                    onDragStart={(e) => {
                      if (!isTopItem) {
                        e.preventDefault();
                        if (onInvalidPopAttempt) {
                          onInvalidPopAttempt(item.value);
                        }
                        return;
                      }
                      e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'POP', value: item.value }));
                      e.dataTransfer.effectAllowed = 'move';
                    }}
                    className={`relative w-full h-12 rounded-xl flex items-center justify-between px-4 transition-colors duration-200 ${
                      isTopItem && highlightTop
                        ? isPeeked
                          ? 'bg-amber-500 text-white border-2 border-amber-600 shadow-md ring-4 ring-amber-100 dark:ring-amber-950/80 font-bold'
                          : 'bg-white dark:bg-slate-800 border-2 border-indigo-500 dark:border-indigo-400 rounded-xl shadow-lg font-bold text-indigo-600 dark:text-indigo-400 ring-4 ring-indigo-50 dark:ring-indigo-950/60 cursor-grab active:cursor-grabbing'
                        : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 shadow-xs'
                    }`}
                  >
                    {/* Element Index badge */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[11px] font-mono px-2 py-0.5 rounded-md font-semibold ${
                          isTopItem && highlightTop
                            ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300'
                            : 'bg-slate-100 dark:bg-slate-700/80 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {String(index).padStart(2, '0')}
                      </span>
                      {isTopItem && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded">
                          TOP
                        </span>
                      )}
                    </div>

                    {/* Central Value */}
                    <span className="text-base font-bold font-mono tracking-tight text-slate-800 dark:text-slate-100">
                      {item.value}
                    </span>

                    {/* Drag out hint for top */}
                    {isTopItem && allowDragPop ? (
                      <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-950/70 px-2 py-0.5 rounded-md">
                        Drag to POP
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium font-mono">
                        Slot {index + 1}
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Sleek Size / Cap Capsule */}
      <div className="mt-4 flex gap-4 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
        <div className="flex flex-col items-center bg-white dark:bg-slate-900 px-6 py-2 rounded-full shadow-sm border border-slate-100 dark:border-slate-800">
          <span className="text-slate-800 dark:text-slate-100 font-mono text-sm font-extrabold">{items.length} / {capacity}</span>
          <span className="text-[9px] opacity-60">Size / Cap</span>
        </div>
      </div>
    </div>
  );
};
