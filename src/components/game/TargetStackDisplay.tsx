import React from 'react';
import { Target, Terminal, ArrowDown } from 'lucide-react';

interface TargetStackDisplayProps {
  targetStack?: number[];
  operationsTrace?: string[];
  title?: string;
  description?: string;
}

export const TargetStackDisplay: React.FC<TargetStackDisplayProps> = ({
  targetStack,
  operationsTrace,
  title,
  description,
}) => {
  if (!targetStack && !operationsTrace) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
          {operationsTrace ? <Terminal className="w-4 h-4" /> : <Target className="w-4 h-4" />}
        </span>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            {title || (operationsTrace ? 'Execution Code Trace' : 'Target Stack Arrangement')}
          </h3>
          {description && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Operations Trace Console */}
      {operationsTrace && (
        <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs space-y-1.5 shadow-inner border border-slate-800">
          <div className="text-[10px] text-slate-400 font-sans uppercase font-bold tracking-wider mb-1 border-b border-slate-800 pb-1">
            Program Trace Log
          </div>
          {operationsTrace.map((op, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-2 ${
                op?.includes('Pop()')
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              <span className="text-slate-600 select-none">{idx + 1}.</span>
              <span>{op}</span>
            </div>
          ))}
        </div>
      )}

      {/* Target Stack Visual Box */}
      {targetStack && (
        <div className="flex flex-col items-center">
          <div className="w-48 border-x-4 border-b-4 border-blue-500/80 dark:border-blue-400/80 p-2.5 rounded-b-2xl bg-blue-50/20 dark:bg-blue-950/20 flex flex-col-reverse gap-1.5 shadow-2xs">
            {targetStack.map((val, idx) => {
              const isTop = idx === targetStack.length - 1;
              return (
                <div
                  key={idx}
                  className={`h-10 rounded-xl flex items-center justify-between px-3 font-mono font-bold text-xs transition-all ${
                    isTop
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <span className="text-[10px] opacity-70">
                    {idx === 0 ? 'Bottom' : isTop ? 'TOP' : `Slot ${idx}`}
                  </span>
                  <span className="text-sm">{val}</span>
                  {isTop ? (
                    <span className="text-[10px] bg-white/20 px-1 rounded">Top</span>
                  ) : (
                    <span className="w-4" />
                  )}
                </div>
              );
            })}
          </div>
          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 mt-2 uppercase tracking-wider">
            Target Final Structure
          </span>
        </div>
      )}
    </div>
  );
};
