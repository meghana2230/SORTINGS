import React from 'react';
import { motion } from 'motion/react';
import {
  Layers,
  Cpu,
  ShieldCheck,
  Zap,
  Maximize2,
  Minimize2,
  HardDrive,
  Activity,
  Plus,
  Minus,
} from 'lucide-react';
import { StackItem } from '../../types';

interface LabMetricsBarProps {
  items: StackItem[];
  capacity: number;
  onIncreaseSize?: () => void;
  onDecreaseSize?: () => void;
  onSetCapacity?: (newCap: number) => void;
}

export const LabMetricsBar: React.FC<LabMetricsBarProps> = ({
  items,
  capacity,
  onIncreaseSize,
  onDecreaseSize,
  onSetCapacity,
}) => {
  const size = items.length;
  const topIndex = size - 1;
  const topValue = size > 0 ? items[topIndex].value : 'None (Empty)';
  const memoryPerElement = 4; // 4 bytes for standard 32-bit int
  const usedMemory = size * memoryPerElement;
  const totalAllocatedMemory = capacity * memoryPerElement;
  const fillPercentage = Math.min(100, Math.round((size / capacity) * 100));

  // Simulated base memory address
  const baseAddress = 0x1000;
  const spAddress = size > 0 ? `0x${(baseAddress + topIndex * 4).toString(16).toUpperCase()}` : '0x0FFE (NULL)';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 shadow-xs">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 1. Size & Capacity Gauge */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200/70 dark:border-slate-700/70 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              Stack Size
            </span>
            <span className="font-mono text-indigo-600 dark:text-indigo-400">
              {size} / {capacity}
            </span>
          </div>

          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <motion.div
              initial={false}
              animate={{ width: `${fillPercentage}%` }}
              transition={{ duration: 0.3 }}
              className={`h-full rounded-full ${
                size >= capacity
                  ? 'bg-amber-500'
                  : size === 0
                  ? 'bg-slate-400'
                  : 'bg-linear-to-r from-indigo-500 to-purple-600'
              }`}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>{size === 0 ? 'Empty' : size >= capacity ? 'Full (Max)' : `${capacity - size} free`}</span>
            <span className="font-mono">{fillPercentage}%</span>
          </div>
        </div>

        {/* 2. Top Pointer Metric */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200/70 dark:border-slate-700/70 space-y-1">
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400">
            <Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>TOP Pointer</span>
          </div>
          <p className="text-base font-extrabold font-mono text-slate-900 dark:text-white truncate">
            {topIndex >= 0 ? `Index [${topIndex}]` : 'Index [-1]'}
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
            Value: <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{String(topValue)}</span>
          </p>
        </div>

        {/* 3. Stack Pointer (SP) Hardware Register */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200/70 dark:border-slate-700/70 space-y-1">
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400">
            <Cpu className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Stack Pointer (SP)</span>
          </div>
          <p className="text-sm font-extrabold font-mono text-purple-600 dark:text-purple-300">
            {spAddress}
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">
            Base: <span className="font-mono">0x1000</span>
          </p>
        </div>

        {/* 4. Memory Footprint */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200/70 dark:border-slate-700/70 space-y-1">
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400">
            <HardDrive className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Memory Usage</span>
          </div>
          <p className="text-sm font-extrabold font-mono text-slate-900 dark:text-white">
            {usedMemory} / {totalAllocatedMemory} B
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">
            {size} items × 4 bytes
          </p>
        </div>

        {/* 5. LIFO Protocol Status */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200/70 dark:border-slate-700/70 space-y-1">
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>LIFO Protocol</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">Active</span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">
            O(1) Push / Pop time
          </p>
        </div>

        {/* 6. Quick Size Experiment Actions */}
        <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] font-bold text-indigo-900 dark:text-indigo-300">
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              Quick Adjust
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <button
              onClick={onDecreaseSize}
              disabled={size === 0}
              title="Pop 1 Item"
              className="flex-1 py-1 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
            >
              <Minus className="w-3 h-3" />
            </button>
            <button
              onClick={onIncreaseSize}
              disabled={size >= capacity}
              title="Push Random Value"
              className="flex-1 py-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
