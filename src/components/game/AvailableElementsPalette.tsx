import React, { useState } from 'react';
import { Layers, ArrowUp, Plus, Trash2 } from 'lucide-react';

interface AvailableElementsPaletteProps {
  elements?: number[];
  onSelectElement: (value: number, index?: number) => void;
  onPopTop?: () => void;
  currentTopValue?: number | string | null;
  showPopAction?: boolean;
  guidedTargetValue?: number;
  isGuidedSolveActive?: boolean;
  disabled?: boolean;
  allowCustomInput?: boolean;
}

export const AvailableElementsPalette: React.FC<AvailableElementsPaletteProps> = ({
  elements = [],
  onSelectElement,
  onPopTop,
  currentTopValue = null,
  showPopAction = false,
  guidedTargetValue,
  isGuidedSolveActive = false,
  disabled = false,
  allowCustomInput = true,
}) => {
  const [customValue, setCustomValue] = useState<string>('');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled || !customValue.trim()) return;
    const num = Number(customValue.trim());
    if (!isNaN(num)) {
      onSelectElement(num);
      setCustomValue('');
    }
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
            <Layers className="w-4 h-4" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
            AVAILABLE ELEMENTS & ACTIONS
          </span>
        </div>
        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
          Click chip or type to push • Use Pop to remove top
        </span>
      </div>

      {/* Grid / Row of Element Cards */}
      {elements.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {elements.map((val, idx) => {
            const isGuided = isGuidedSolveActive && val === guidedTargetValue;

            return (
              <div
                key={`avail-${val}-${idx}`}
                draggable={!disabled}
                onDragStart={(e) => {
                  if (disabled) return;
                  e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'PUSH', value: val, index: idx }));
                  e.dataTransfer.effectAllowed = 'copy';
                }}
                onClick={() => {
                  if (!disabled) onSelectElement(val, idx);
                }}
                className={`h-11 min-w-[58px] flex-1 max-w-[100px] rounded-xl font-mono font-black text-sm flex items-center justify-center gap-1 transition-all cursor-grab active:cursor-grabbing select-none shadow-2xs ${
                  disabled
                    ? 'opacity-40 bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    : isGuided
                    ? 'bg-amber-400 dark:bg-amber-500 text-slate-950 border-2 border-amber-500 shadow-md ring-4 ring-amber-200 dark:ring-amber-900 scale-105 animate-bounce'
                    : 'bg-slate-50 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-950/80 text-blue-900 dark:text-blue-100 border-2 border-slate-200 hover:border-blue-500 dark:border-slate-700 dark:hover:border-blue-400 hover:scale-102'
                }`}
              >
                <span>{val}</span>
                <ArrowUp className="w-3.5 h-3.5 text-blue-500 opacity-60" />
              </div>
            );
          })}
        </div>
      )}

      {/* Action Bar: Push Custom Input + Quick Pop Top Button */}
      <div className="pt-1 flex flex-wrap sm:flex-nowrap items-center gap-2">
        {allowCustomInput && (
          <form onSubmit={handleCustomSubmit} className="flex items-center gap-2 flex-1 min-w-[200px]">
            <div className="relative flex-1">
              <input
                type="number"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                disabled={disabled}
                placeholder="Type number to push (e.g. 25)..."
                className="w-full h-10 px-3 py-1 text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-950 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={disabled || !customValue.trim()}
              className="h-10 px-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Push</span>
            </button>
          </form>
        )}

        {/* Dedicated Quick Pop Button */}
        {showPopAction && onPopTop && currentTopValue !== null && currentTopValue !== undefined && (
          <button
            type="button"
            onClick={onPopTop}
            disabled={disabled}
            className="h-10 px-3.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shrink-0 shadow-2xs cursor-pointer"
            title="Pop top element from the stack"
          >
            <Trash2 className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <span>POP TOP [{currentTopValue}]</span>
          </button>
        )}
      </div>
    </div>
  );
};
