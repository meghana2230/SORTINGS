import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Plus,
  Trash2,
  Eye,
  CheckCircle2,
  RotateCcw,
  Shuffle,
  ArrowUpDown,
  Copy,
  Sparkles,
  Search,
  RefreshCw,
  Sliders,
  Play,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { StackItem } from '../../types';

interface LabOperationsDeckProps {
  items: StackItem[];
  capacity: number;
  onPush: (value: number | string) => void;
  onPop: () => void;
  onPeek: () => void;
  onIsEmpty: () => void;
  onIsFull: () => void;
  onClear: () => void;
  onSwapTop: () => void;
  onDupTop: () => void;
  onReverseStack: () => void;
  onSortStack: (ascending: boolean) => void;
  onSearch: (value: string | number) => void;
  onRotate: (direction: 'up' | 'down') => void;
  onBatchPush: (values: (number | string)[]) => void;
  onSetCapacity: (newCap: number) => void;
}

export const LabOperationsDeck: React.FC<LabOperationsDeckProps> = ({
  items,
  capacity,
  onPush,
  onPop,
  onPeek,
  onIsEmpty,
  onIsFull,
  onClear,
  onSwapTop,
  onDupTop,
  onReverseStack,
  onSortStack,
  onSearch,
  onRotate,
  onBatchPush,
  onSetCapacity,
}) => {
  const [activeDeckTab, setActiveDeckTab] = useState<'core' | 'size' | 'experiments'>('core');
  const [customValue, setCustomValue] = useState<string>('');
  const [batchInput, setBatchInput] = useState<string>('10, 20, 30, 40');
  const [searchValue, setSearchValue] = useState<string>('');

  const numberPresets = [10, 25, 42, 77, 99, 128];
  const charPresets = ['A', 'B', 'C', 'X', 'Y', 'Z'];

  const handleCustomPushSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customValue.trim()) return;
    const num = Number(customValue.trim());
    onPush(isNaN(num) ? customValue.trim() : num);
    setCustomValue('');
  };

  const handleBatchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!batchInput.trim()) return;
    const parsed = batchInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map((s) => (isNaN(Number(s)) ? s : Number(s)));
    if (parsed.length > 0) {
      onBatchPush(parsed);
    }
  };

  const handlePushRandom = () => {
    const randomVal = Math.floor(Math.random() * 90) + 10;
    onPush(randomVal);
  };

  const handleGenerateSequence = (type: 'sequential' | 'fibonacci' | 'evens') => {
    let vals: number[] = [];
    const count = Math.min(capacity, 6);
    if (type === 'sequential') {
      vals = Array.from({ length: count }, (_, i) => (i + 1) * 10);
    } else if (type === 'fibonacci') {
      const fib = [1, 2, 3, 5, 8, 13, 21, 34];
      vals = fib.slice(0, count);
    } else if (type === 'evens') {
      vals = Array.from({ length: count }, (_, i) => (i + 1) * 2);
    }
    onClear();
    setTimeout(() => onBatchPush(vals), 50);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col space-y-4">
      {/* Operations Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Operations & Experiment Deck
          </h3>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium w-full sm:w-auto">
          <button
            onClick={() => setActiveDeckTab('core')}
            className={`flex-1 sm:flex-none px-3 py-1 rounded-lg transition-all cursor-pointer ${
              activeDeckTab === 'core'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-2xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Core ADT
          </button>
          <button
            onClick={() => setActiveDeckTab('size')}
            className={`flex-1 sm:flex-none px-3 py-1 rounded-lg transition-all cursor-pointer ${
              activeDeckTab === 'size'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-2xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Size & Capacity
          </button>
          <button
            onClick={() => setActiveDeckTab('experiments')}
            className={`flex-1 sm:flex-none px-3 py-1 rounded-lg transition-all cursor-pointer ${
              activeDeckTab === 'experiments'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-2xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Experiments
          </button>
        </div>
      </div>

      {/* Tab 1: Core Operations */}
      {activeDeckTab === 'core' && (
        <div className="space-y-4">
          {/* Push Input Group */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              1. Push Element onto TOP
            </label>
            <form onSubmit={handleCustomPushSubmit} className="flex gap-2">
              <input
                type="text"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                placeholder="Value (e.g. 55 or 'X')"
                className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={items.length >= capacity}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>PUSH(x)</span>
              </button>
            </form>

            {/* Quick Value Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="text-[10px] text-slate-400 font-medium mr-1">Presets:</span>
              {numberPresets.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => onPush(val)}
                  disabled={items.length >= capacity}
                  className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 text-indigo-700 dark:text-indigo-300 text-[11px] font-mono font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {val}
                </button>
              ))}
              <button
                type="button"
                onClick={handlePushRandom}
                disabled={items.length >= capacity}
                className="px-2 py-1 bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-[11px] font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Shuffle className="w-3 h-3" />
                <span>Random</span>
              </button>
            </div>
          </div>

          {/* Core Operations Grid */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              2. Inspect & Mutate Operations
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={onPop}
                disabled={items.length === 0}
                className="p-3 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/50 disabled:opacity-40 disabled:cursor-not-allowed border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl text-left transition-all cursor-pointer active:scale-95 shadow-2xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-xs">POP()</span>
                  <Trash2 className="w-3.5 h-3.5" />
                </div>
                <p className="text-[10px] text-red-600/80 dark:text-red-400/80 leading-tight">
                  Remove TOP item
                </p>
              </button>

              <button
                onClick={onPeek}
                disabled={items.length === 0}
                className="p-3 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 disabled:opacity-40 disabled:cursor-not-allowed border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 rounded-xl text-left transition-all cursor-pointer active:scale-95 shadow-2xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-xs">PEEK()</span>
                  <Eye className="w-3.5 h-3.5" />
                </div>
                <p className="text-[10px] text-indigo-600/80 dark:text-indigo-400/80 leading-tight">
                  View top without removing
                </p>
              </button>

              <button
                onClick={onIsEmpty}
                className="p-3 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-left transition-all cursor-pointer active:scale-95 shadow-2xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-xs">isEmpty()</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                  Check if size == 0
                </p>
              </button>

              <button
                onClick={onIsFull}
                className="p-3 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-left transition-all cursor-pointer active:scale-95 shadow-2xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-xs">isFull()</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                  Check size &gt;= capacity
                </p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Dynamic Size & Capacity Adjustments */}
      {activeDeckTab === 'size' && (
        <div className="space-y-4">
          {/* Capacity Slider & Presets */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-500" />
                Stack Capacity Limit ({capacity} elements)
              </label>
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                {items.length} / {capacity} ({Math.round((items.length / capacity) * 100)}% Used)
              </span>
            </div>

            <input
              type="range"
              min="2"
              max="20"
              value={capacity}
              onChange={(e) => onSetCapacity(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
            />

            {/* Quick Capacity Presets */}
            <div className="flex items-center gap-2 mt-2.5">
              <span className="text-[10px] text-slate-400 font-medium">Presets:</span>
              {[4, 8, 12, 16, 20].map((capPreset) => (
                <button
                  key={capPreset}
                  onClick={() => onSetCapacity(capPreset)}
                  className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                    capacity === capPreset
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-300'
                  }`}
                >
                  {capPreset}
                </button>
              ))}
            </div>
          </div>

          {/* Batch Push & Sequence Population */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Batch Push / Multi-Element Insert
            </label>
            <form onSubmit={handleBatchSubmit} className="flex gap-2">
              <input
                type="text"
                value={batchInput}
                onChange={(e) => setBatchInput(e.target.value)}
                placeholder="Comma separated values: 10, 20, 30, 40"
                className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Batch Push</span>
              </button>
            </form>

            {/* Sequence Generators */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="text-[10px] text-slate-400 font-medium">Quick Sequences:</span>
              <button
                onClick={() => handleGenerateSequence('sequential')}
                className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                10, 20, 30...
              </button>
              <button
                onClick={() => handleGenerateSequence('fibonacci')}
                className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Fibonacci Sequence
              </button>
              <button
                onClick={() => handleGenerateSequence('evens')}
                className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Even Numbers
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Advanced Stack Experiments */}
      {activeDeckTab === 'experiments' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {/* 1. SWAP TOP 2 */}
            <button
              onClick={onSwapTop}
              disabled={items.length < 2}
              className="p-3 bg-slate-50 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 rounded-xl text-left transition-all cursor-pointer active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400">
                  SWAP()
                </span>
                <ArrowUpDown className="w-3.5 h-3.5 text-indigo-500" />
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Swap top two elements
              </p>
            </button>

            {/* 2. DUP TOP */}
            <button
              onClick={onDupTop}
              disabled={items.length === 0 || items.length >= capacity}
              className="p-3 bg-slate-50 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 rounded-xl text-left transition-all cursor-pointer active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono font-bold text-xs text-purple-600 dark:text-purple-400">
                  DUP()
                </span>
                <Copy className="w-3.5 h-3.5 text-purple-500" />
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Duplicate top element
              </p>
            </button>

            {/* 3. REVERSE STACK */}
            <button
              onClick={onReverseStack}
              disabled={items.length < 2}
              className="p-3 bg-slate-50 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 rounded-xl text-left transition-all cursor-pointer active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">
                  REVERSE()
                </span>
                <RefreshCw className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Invert LIFO ordering
              </p>
            </button>

            {/* 4. SORT ASCENDING */}
            <button
              onClick={() => onSortStack(true)}
              disabled={items.length < 2}
              className="p-3 bg-slate-50 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 rounded-xl text-left transition-all cursor-pointer active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono font-bold text-xs text-blue-600 dark:text-blue-400">
                  SORT ASC
                </span>
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Smallest on Top
              </p>
            </button>

            {/* 5. SORT DESCENDING */}
            <button
              onClick={() => onSortStack(false)}
              disabled={items.length < 2}
              className="p-3 bg-slate-50 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 rounded-xl text-left transition-all cursor-pointer active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono font-bold text-xs text-blue-600 dark:text-blue-400">
                  SORT DESC
                </span>
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Largest on Top
              </p>
            </button>

            {/* 6. ROTATE / ROLL */}
            <button
              onClick={() => onRotate('up')}
              disabled={items.length < 2}
              className="p-3 bg-slate-50 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 rounded-xl text-left transition-all cursor-pointer active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono font-bold text-xs text-amber-600 dark:text-amber-400">
                  ROTATE
                </span>
                <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Shift bottom to TOP
              </p>
            </button>
          </div>

          {/* Search in Stack */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search value depth from TOP (e.g. 25)"
              className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
            />
            <button
              onClick={() => onSearch(isNaN(Number(searchValue)) ? searchValue : Number(searchValue))}
              disabled={!searchValue.trim() || items.length === 0}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 shrink-0"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
