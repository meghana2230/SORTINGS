import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FlaskConical,
  Plus,
  Minus,
  Sparkles,
  RotateCcw,
  ArrowUpRight,
  ArrowDownToLine,
  Eye,
  Shuffle,
  Trash2,
  Sliders,
  Layers,
  Binary,
  Code,
  Search,
  CheckCircle2,
  AlertTriangle,
  Info,
  ArrowLeft,
  Zap,
  Play,
  Copy,
  ArrowUpDown,
  History,
  ShieldAlert,
} from 'lucide-react';
import { StackItem, OperationLog, UserProgress } from '../../types';
import { StackVisualizer } from '../common/StackVisualizer';
import { PopZone } from './PopZone';
import { soundEffects } from '../../services/sound';
import { awardXP } from '../../services/storage';

interface InGameLabProps {
  progress: UserProgress;
  onUpdateProgress: (updated: UserProgress | ((prev: UserProgress) => UserProgress)) => void;
  onBackToGame?: () => void;
  onSelectLevel?: (levelId: number) => void;
  hideHeader?: boolean;
}

const PRESET_CAPACITIES = [4, 6, 8, 12, 16, 20];
const QUICK_ELEMENT_CHIPS = [10, 20, 30, 42, 50, 75, 99, 100];

export const InGameLab: React.FC<InGameLabProps> = ({
  progress,
  onUpdateProgress,
  onBackToGame,
  onSelectLevel,
  hideHeader = false,
}) => {
  // Stack items
  const [items, setItems] = useState<StackItem[]>([
    { id: 'lab-init-1', value: 10, addedAt: Date.now() - 3000 },
    { id: 'lab-init-2', value: 20, addedAt: Date.now() - 2000 },
    { id: 'lab-init-3', value: 30, addedAt: Date.now() - 1000 },
  ]);

  // Capacity & sizing (range 2 to 20)
  const [capacity, setCapacity] = useState<number>(8);
  const [customInputValue, setCustomInputValue] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResult, setSearchResult] = useState<{ found: boolean; index?: number; depth?: number; message?: string } | null>(null);

  // Peek highlight
  const [peekedValue, setPeekedValue] = useState<number | string | null>(null);

  // Visualizer representation mode
  const [visualMode, setVisualMode] = useState<'canister' | 'array' | 'experiments'>('canister');
  const [activeExperiment, setActiveExperiment] = useState<'overflow' | 'underflow' | 'inversion' | 'brackets' | 'undo'>('overflow');

  // Interactive feedback
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
  }>({
    type: 'info',
    title: 'In-Game Lab Active',
    message: 'Welcome to the In-Game Stack Experimentation Lab! Adjust capacity, perform operations, and test stack behaviors.',
  });

  // Operation history logs
  const [history, setHistory] = useState<OperationLog[]>([
    {
      id: 'log-init',
      operation: 'CLEAR',
      success: true,
      message: 'Stack initialized with [10, 20, 30] (Capacity: 8)',
      timestamp: new Date(),
      stackSnapshot: [10, 20, 30],
    },
  ]);

  // Bracket simulation state
  const [bracketString, setBracketString] = useState<string>('{ [ ( ) ] }');
  const [bracketStep, setBracketStep] = useState<number>(0);
  const [bracketTokens, setBracketTokens] = useState<string[]>(['{', '[', '(', ')', ']', '}']);
  const [bracketSimStack, setBracketSimStack] = useState<string[]>([]);
  const [bracketSimMessage, setBracketSimMessage] = useState<string>('Click "Step Next" to trace bracket matching.');

  // Undo buffer simulation state
  const [editorText, setEditorText] = useState<string>('Hello World');
  const [undoStack, setUndoStack] = useState<string[]>(['H', 'He', 'Hel', 'Hell', 'Hello', 'Hello ']);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  // Log recorder helper
  const addLog = (
    operation: OperationLog['operation'],
    success: boolean,
    message: string,
    val?: number | string
  ) => {
    const newItems = operation === 'POP' && success ? items.slice(0, -1) : items;
    const newLog: OperationLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      operation,
      value: val,
      success,
      message,
      timestamp: new Date(),
      stackSnapshot: newItems.map((it) => it.value),
    };
    setHistory((prev) => [newLog, ...prev.slice(0, 19)]);
  };

  // ==========================================
  // CAPACITY / SIZING HANDLERS
  // ==========================================
  const handleSetCapacity = (newCap: number) => {
    soundEffects.playClick();
    const clamped = Math.max(2, Math.min(20, newCap));
    if (clamped < items.length) {
      // Safe truncation with warning
      setFeedback({
        type: 'warning',
        title: '⚠️ Capacity Decreased Below Current Size',
        message: `Capacity changed to ${clamped}. Current stack had ${items.length} items. Top elements safely truncated to fit new capacity.`,
      });
      setItems((prev) => prev.slice(0, clamped));
      addLog('RESIZE', true, `Decreased capacity to ${clamped} (truncated top elements)`);
    } else {
      setFeedback({
        type: 'info',
        title: '📏 Stack Capacity Updated',
        message: `Capacity adjusted to ${clamped} slots. Free slots remaining: ${clamped - items.length}.`,
      });
      addLog('RESIZE', true, `Adjusted capacity to ${clamped}`);
    }
    setCapacity(clamped);
  };

  // ==========================================
  // PUSH OPERATION
  // ==========================================
  const handlePush = (valToPush: number | string) => {
    if (valToPush === '' || valToPush === undefined || valToPush === null) {
      soundEffects.playError();
      setFeedback({
        type: 'warning',
        title: 'Empty Value',
        message: 'Please enter or select a value to push onto the stack.',
      });
      return;
    }

    if (items.length >= capacity) {
      soundEffects.playError();
      setFeedback({
        type: 'error',
        title: '⚠️ Stack Overflow Condition!',
        message: `Cannot PUSH [${valToPush}]. Current size (${items.length}) equals maximum capacity (${capacity}). Stacks cannot exceed allocated space without resizing.`,
      });
      addLog('PUSH', false, `Stack Overflow! Failed to push [${valToPush}] at max capacity (${capacity})`, valToPush);
      return;
    }

    soundEffects.playPush();
    const newItem: StackItem = {
      id: `lab-item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      value: valToPush,
      addedAt: Date.now(),
    };

    setItems((prev) => [...prev, newItem]);
    setPeekedValue(null);
    setSearchResult(null);

    setFeedback({
      type: 'success',
      title: `✅ PUSH(${valToPush}) Executed`,
      message: `Pushed [${valToPush}] onto the top of the stack (Index [${items.length}]). TOP pointer shifted up.`,
    });
    addLog('PUSH', true, `Pushed [${valToPush}] onto top (index ${items.length})`, valToPush);
  };

  // ==========================================
  // POP OPERATION
  // ==========================================
  const handlePop = () => {
    if (items.length === 0) {
      soundEffects.playError();
      setFeedback({
        type: 'error',
        title: '⚠️ Stack Underflow Condition!',
        message: 'Cannot POP from an empty stack! Attempting to remove elements when size is 0 produces Stack Underflow.',
      });
      addLog('POP', false, 'Stack Underflow! Attempted to pop from empty stack');
      return;
    }

    soundEffects.playPop();
    const poppedItem = items[items.length - 1];
    setItems((prev) => prev.slice(0, -1));
    setPeekedValue(null);
    setSearchResult(null);

    setFeedback({
      type: 'success',
      title: `✅ POP() Executed: [${poppedItem.value}]`,
      message: `Removed topmost element [${poppedItem.value}] from index [${items.length - 1}]. Stack follows LIFO: newest element leaves first.`,
    });
    addLog('POP', true, `Popped [${poppedItem.value}] from top (index ${items.length - 1})`, poppedItem.value);
  };

  // ==========================================
  // PEEK OPERATION
  // ==========================================
  const handlePeek = () => {
    if (items.length === 0) {
      soundEffects.playError();
      setFeedback({
        type: 'warning',
        title: 'Stack is Empty',
        message: 'PEEK() returns null (or throws EmptyStackException) because there are no elements in the stack.',
      });
      addLog('PEEK', false, 'PEEK failed on empty stack');
      return;
    }

    soundEffects.playClick();
    const topItem = items[items.length - 1];
    setPeekedValue(topItem.value);
    setFeedback({
      type: 'info',
      title: `👁️ PEEK() Top Element: [${topItem.value}]`,
      message: `Inspected TOP item [${topItem.value}] at index [${items.length - 1}]. Stack remains completely unmodified (O(1) time complexity).`,
    });
    addLog('PEEK', true, `Peeked top value: [${topItem.value}]`, topItem.value);
  };

  // ==========================================
  // DUPLICATE (DUP) TOP
  // ==========================================
  const handleDuplicateTop = () => {
    if (items.length === 0) {
      soundEffects.playError();
      setFeedback({
        type: 'warning',
        title: 'Cannot Duplicate',
        message: 'Stack is empty. Push an element first to duplicate it.',
      });
      return;
    }
    if (items.length >= capacity) {
      soundEffects.playError();
      setFeedback({
        type: 'error',
        title: 'Stack Overflow on DUP',
        message: `Cannot duplicate top item: Stack is already at maximum capacity (${capacity}).`,
      });
      return;
    }

    soundEffects.playPush();
    const topVal = items[items.length - 1].value;
    const newItem: StackItem = {
      id: `lab-dup-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      value: topVal,
      addedAt: Date.now(),
    };
    setItems((prev) => [...prev, newItem]);
    setFeedback({
      type: 'success',
      title: `🔄 DUP Executed: [${topVal}]`,
      message: `Duplicated top element [${topVal}] and pushed an identical copy onto the top.`,
    });
    addLog('PUSH', true, `Duplicated top item [${topVal}]`, topVal);
  };

  // ==========================================
  // SWAP TOP TWO
  // ==========================================
  const handleSwapTopTwo = () => {
    if (items.length < 2) {
      soundEffects.playError();
      setFeedback({
        type: 'warning',
        title: 'Cannot Swap',
        message: 'Stack must contain at least 2 elements to perform a SWAP operation.',
      });
      return;
    }

    soundEffects.playClick();
    setItems((prev) => {
      const copy = [...prev];
      const n = copy.length;
      const temp = copy[n - 1];
      copy[n - 1] = copy[n - 2];
      copy[n - 2] = temp;
      return copy;
    });

    const topVal = items[items.length - 1].value;
    const secondVal = items[items.length - 2].value;

    setFeedback({
      type: 'success',
      title: `🔀 SWAP Executed`,
      message: `Exchanged top elements [${topVal}] and [${secondVal}]. New TOP is now [${secondVal}].`,
    });
    addLog('SWAP', true, `Swapped top two items: [${topVal}] <-> [${secondVal}]`);
  };

  // ==========================================
  // REVERSE STACK
  // ==========================================
  const handleReverseStack = () => {
    if (items.length <= 1) {
      soundEffects.playClick();
      setFeedback({
        type: 'info',
        title: 'Reverse Unchanged',
        message: 'Stack has 1 or 0 elements; reversing results in the identical order.',
      });
      return;
    }

    soundEffects.playSuccess();
    setItems((prev) => [...prev].reverse());
    setFeedback({
      type: 'success',
      title: `🔃 Stack Reversal Executed`,
      message: `Inverted the stack order. The old bottom is now the new TOP (demonstrating how 2 stacks reverse order).`,
    });
    addLog('REVERSE', true, `Reversed entire stack ordering`);
  };

  // ==========================================
  // SORT STACK
  // ==========================================
  const handleSortStack = (ascending: boolean = true) => {
    if (items.length <= 1) return;
    soundEffects.playSuccess();
    setItems((prev) => {
      const copy = [...prev];
      copy.sort((a, b) => {
        const numA = Number(a.value);
        const numB = Number(b.value);
        if (!isNaN(numA) && !isNaN(numB)) {
          return ascending ? numA - numB : numB - numA;
        }
        return ascending
          ? String(a.value).localeCompare(String(b.value))
          : String(b.value).localeCompare(String(a.value));
      });
      return copy;
    });

    setFeedback({
      type: 'success',
      title: `📊 Stack Sorted (${ascending ? 'Ascending' : 'Descending'})`,
      message: `Sorted stack elements using auxiliary stack sorting principles.`,
    });
    addLog('SORT', true, `Sorted stack ${ascending ? 'Ascending' : 'Descending'}`);
  };

  // ==========================================
  // ROTATE STACK
  // ==========================================
  const handleRotateStack = () => {
    if (items.length <= 1) return;
    soundEffects.playClick();
    setItems((prev) => {
      const copy = [...prev];
      const bottom = copy.shift()!;
      copy.push(bottom);
      return copy;
    });
    setFeedback({
      type: 'info',
      title: '🔁 Stack Rotated',
      message: 'Moved bottommost element to the TOP of the stack.',
    });
    addLog('ROTATE', true, 'Rotated stack (bottom element moved to TOP)');
  };

  // ==========================================
  // SEARCH STACK
  // ==========================================
  const handleSearchValue = () => {
    if (!searchQuery.trim()) {
      setSearchResult(null);
      return;
    }

    const queryNum = Number(searchQuery);
    let foundIndex = -1;

    for (let i = items.length - 1; i >= 0; i--) {
      if (!isNaN(queryNum) && Number(items[i].value) === queryNum) {
        foundIndex = i;
        break;
      } else if (String(items[i].value).toLowerCase() === searchQuery.toLowerCase()) {
        foundIndex = i;
        break;
      }
    }

    if (foundIndex !== -1) {
      soundEffects.playSuccess();
      const depthFromTop = items.length - 1 - foundIndex;
      setSearchResult({
        found: true,
        index: foundIndex,
        depth: depthFromTop,
        message: `Value [${searchQuery}] found at index [${foundIndex}] (${depthFromTop === 0 ? 'at TOP' : `${depthFromTop} pops below TOP`}).`,
      });
      setFeedback({
        type: 'success',
        title: `🔍 Element Found: [${searchQuery}]`,
        message: `Element exists in stack at index [${foundIndex}]. To access it natively in LIFO, you would need ${depthFromTop} pop() operations.`,
      });
      addLog('SEARCH', true, `Searched for [${searchQuery}]: Found at index ${foundIndex}`, searchQuery);
    } else {
      soundEffects.playError();
      setSearchResult({
        found: false,
        message: `Value [${searchQuery}] was not found in the stack.`,
      });
      setFeedback({
        type: 'warning',
        title: `🔍 Element Not Found`,
        message: `Value [${searchQuery}] does not exist in the current stack.`,
      });
      addLog('SEARCH', false, `Searched for [${searchQuery}]: Not found`, searchQuery);
    }
  };

  // ==========================================
  // BATCH GENERATORS
  // ==========================================
  const handleBatchPush = (preset: 'seq' | 'fib' | 'random' | 'fill') => {
    soundEffects.playSuccess();
    let valuesToAdd: number[] = [];

    if (preset === 'seq') {
      valuesToAdd = [10, 20, 30, 40];
    } else if (preset === 'fib') {
      valuesToAdd = [1, 2, 3, 5, 8];
    } else if (preset === 'random') {
      valuesToAdd = [
        Math.floor(Math.random() * 90) + 10,
        Math.floor(Math.random() * 90) + 10,
        Math.floor(Math.random() * 90) + 10,
      ];
    } else if (preset === 'fill') {
      const needed = capacity - items.length;
      if (needed <= 0) {
        setFeedback({
          type: 'warning',
          title: 'Already Full',
          message: `Stack is already at full capacity (${capacity}/${capacity}).`,
        });
        return;
      }
      for (let i = 0; i < needed; i++) {
        valuesToAdd.push((items.length + i + 1) * 10);
      }
    }

    const availableSlots = capacity - items.length;
    const canAdd = valuesToAdd.slice(0, availableSlots);

    if (canAdd.length === 0) {
      setFeedback({
        type: 'error',
        title: 'Stack Capacity Full',
        message: 'Cannot batch push: No available slots remaining. Increase capacity first.',
      });
      return;
    }

    const newItems: StackItem[] = canAdd.map((val, idx) => ({
      id: `batch-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 5)}`,
      value: val,
      addedAt: Date.now() + idx,
    }));

    setItems((prev) => [...prev, ...newItems]);
    setFeedback({
      type: 'success',
      title: `⚡ Batch Pushed ${canAdd.length} Element${canAdd.length > 1 ? 's' : ''}`,
      message: `Pushed [${canAdd.join(', ')}] onto the stack.`,
    });
    addLog('BATCH_PUSH', true, `Batch pushed [${canAdd.join(', ')}]`);
  };

  // Clear Stack
  const handleClearStack = () => {
    soundEffects.playClick();
    setItems([]);
    setPeekedValue(null);
    setSearchResult(null);
    setFeedback({
      type: 'info',
      title: '🗑️ Stack Cleared',
      message: 'All elements removed. Stack is now empty (Size: 0).',
    });
    addLog('CLEAR', true, 'Cleared all elements from stack');
  };

  // Top Item Helpers
  const topItem = items.length > 0 ? items[items.length - 1] : null;
  const topValue = topItem ? topItem.value : null;
  const isFull = items.length >= capacity;
  const isEmpty = items.length === 0;
  const fullnessPercent = Math.round((items.length / capacity) * 100);

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* ========================================== */}
      {/* 1. TOP HEADER & NAVIGATION BAR (Only in standalone mode) */}
      {/* ========================================== */}
      {!hideHeader && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/70 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                Interactive Lab
              </span>
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                • In-Game Sandbox & Experiment Ground
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
              <FlaskConical className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              Stack Experimentation Lab
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Experiment freely: dynamically resize capacity, push custom data, test LIFO boundaries, and run algorithms.
            </p>
          </div>

          {/* Back to Challenge Mode Action Button */}
          {onBackToGame && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onBackToGame}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 hover:from-blue-800 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm transition-all shadow-sm hover:shadow flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Challenges</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================== */}
      {/* 2. DYNAMIC SIZING & CAPACITY CONTROL BAR */}
      {/* ========================================== */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Dynamic Stack Capacity & Sizing
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Increase or decrease stack capacity to test overflow barriers and memory allocation.
              </p>
            </div>
          </div>

          {/* Quick Capacity Display */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Current Sizing:</span>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 font-mono font-black text-xs text-blue-700 dark:text-blue-300">
              <span>{items.length} Used</span>
              <span className="text-blue-400">/</span>
              <span>{capacity} Max Slots</span>
            </div>
          </div>
        </div>

        {/* Capacity Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Stepper Buttons & Range Slider */}
          <div className="md:col-span-7 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
              <span>Capacity Range (2 to 20 slots)</span>
              <span className="font-mono text-blue-600 dark:text-blue-400 font-black">
                {capacity} Slots
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleSetCapacity(capacity - 1)}
                disabled={capacity <= 2}
                title="Decrease Capacity (-1)"
                className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-black transition-all cursor-pointer active:scale-90 shrink-0"
              >
                <Minus className="w-4 h-4" />
              </button>

              <input
                type="range"
                min={2}
                max={20}
                value={capacity}
                onChange={(e) => handleSetCapacity(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />

              <button
                onClick={() => handleSetCapacity(capacity + 1)}
                disabled={capacity >= 20}
                title="Increase Capacity (+1)"
                className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-black transition-all cursor-pointer active:scale-90 shrink-0"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="md:col-span-5 space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Quick Size Presets:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {PRESET_CAPACITIES.map((cap) => (
                <button
                  key={cap}
                  onClick={() => handleSetCapacity(cap)}
                  className={`px-3 py-1 rounded-xl text-xs font-black font-mono transition-all cursor-pointer ${
                    capacity === cap
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {cap}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Visual Capacity Bar */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span className="text-slate-500">Utilization Bar:</span>
            <div className="flex items-center gap-2">
              {isFull && (
                <span className="text-[10px] font-black uppercase text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/80 px-2 py-0.5 rounded-md border border-red-200 dark:border-red-800 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" /> Stack Full (Overflow Guard Active)
                </span>
              )}
              {isEmpty && (
                <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                  Empty Stack
                </span>
              )}
              <span className="font-mono text-slate-700 dark:text-slate-300">
                {fullnessPercent}% Loaded ({capacity - items.length} free)
              </span>
            </div>
          </div>

          <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex p-0.5">
            <motion.div
              layout
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              style={{ width: `${Math.min(100, (items.length / capacity) * 100)}%` }}
              className={`h-full rounded-full transition-colors ${
                isFull
                  ? 'bg-red-500 dark:bg-red-600'
                  : items.length / capacity > 0.75
                  ? 'bg-amber-500 dark:bg-amber-600'
                  : 'bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600'
              }`}
            />
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 3. OPERATIONS & EXPERIMENT DECK */}
      {/* ========================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Visualizer Canister or Memory Representation (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Mode Switcher Tabs */}
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setVisualMode('canister')}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  visualMode === 'canister'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Canister View</span>
              </button>

              <button
                onClick={() => setVisualMode('array')}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  visualMode === 'array'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Binary className="w-3.5 h-3.5" />
                <span>Array Memory</span>
              </button>

              <button
                onClick={() => setVisualMode('experiments')}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  visualMode === 'experiments'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Guided Labs</span>
              </button>
            </div>

            {/* Clear Button */}
            <button
              onClick={handleClearStack}
              disabled={isEmpty}
              title="Clear Stack"
              className="px-2.5 py-1 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          </div>

          {/* Tab 1: Vertical Stack Canister Visualizer */}
          {visualMode === 'canister' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative">
                <StackVisualizer
                  items={items}
                  capacity={capacity}
                  peekValue={peekedValue}
                  onDropItem={(val) => handlePush(val)}
                  onPopTop={handlePop}
                  allowDragPop={true}
                  customEmptyMessage="Empty stack. Enter a value below or click a quick-chip to PUSH."
                />
              </div>

              {/* Interactive Pop Zone */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                    LIFO POP ZONE (DROP TARGET)
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Drag the top block here or click Pop
                  </span>
                </div>
                <PopZone
                  topElementValue={topValue}
                  onPopSuccess={handlePop}
                  onPopInvalid={() => {
                    soundEffects.playError();
                    setFeedback({
                      type: 'error',
                      title: 'Non-Top Access Prohibited',
                      message: 'Only the TOP element can be dragged into the POP Zone.',
                    });
                  }}
                  disabled={isEmpty}
                />
              </div>
            </div>
          )}

          {/* Tab 2: Array Memory Contiguous Representation */}
          {visualMode === 'array' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Binary className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Contiguous Array Memory Buffer
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Static or dynamic buffer allocated in RAM with indices [0..Capacity-1].
                </p>
              </div>

              <div className="overflow-x-auto pb-2">
                <div className="flex gap-2 min-w-max">
                  {Array.from({ length: capacity }).map((_, idx) => {
                    const item = items[idx];
                    const isTop = idx === items.length - 1;
                    const isAllocated = idx < items.length;

                    return (
                      <div
                        key={idx}
                        className={`w-16 flex flex-col items-center rounded-2xl p-2.5 border transition-all ${
                          isTop
                            ? 'bg-blue-600 text-white border-blue-500 ring-2 ring-blue-300 dark:ring-blue-900 shadow-md scale-105'
                            : isAllocated
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700'
                            : 'bg-slate-50 dark:bg-slate-950/40 text-slate-300 dark:text-slate-700 border-dashed border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        {/* Top Indicator */}
                        <span className="text-[9px] font-mono font-bold tracking-tight h-4">
                          {isTop ? 'TOP (SP)' : ''}
                        </span>

                        {/* Element Value */}
                        <span className="text-base font-mono font-black my-1">
                          {isAllocated ? item.value : '—'}
                        </span>

                        {/* Slot Index */}
                        <span
                          className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md mt-1 ${
                            isTop
                              ? 'bg-blue-700 text-blue-100'
                              : isAllocated
                              ? 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                              : 'bg-transparent text-slate-400 dark:text-slate-600'
                          }`}
                        >
                          [{idx}]
                        </span>

                        {/* Hex Memory Address */}
                        <span className="text-[8px] font-mono text-slate-400 dark:text-slate-500 mt-1">
                          0x{((idx * 4) + 0x1000).toString(16).toUpperCase()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Memory Legend & Statistics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Stack Pointer</span>
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                    {items.length > 0 ? `Index [${items.length - 1}]` : 'NULL (-1)'}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Allocated RAM</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {capacity * 4} Bytes
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Data</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {items.length * 4} Bytes
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">LIFO Integrity</span>
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                    100% Guarded
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Guided Real-World Experiments */}
          {visualMode === 'experiments' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Interactive Real-World Simulations
                </h3>
                <div className="flex items-center gap-1 flex-wrap">
                  <button
                    onClick={() => setActiveExperiment('overflow')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      activeExperiment === 'overflow'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Overflow Test
                  </button>
                  <button
                    onClick={() => setActiveExperiment('underflow')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      activeExperiment === 'underflow'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Underflow Test
                  </button>
                  <button
                    onClick={() => setActiveExperiment('inversion')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      activeExperiment === 'inversion'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    LIFO Inversion
                  </button>
                  <button
                    onClick={() => setActiveExperiment('brackets')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      activeExperiment === 'brackets'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Parentheses Match
                  </button>
                  <button
                    onClick={() => setActiveExperiment('undo')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      activeExperiment === 'undo'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Undo/Redo
                  </button>
                </div>
              </div>

              {/* Experiment 1: Overflow Test */}
              {activeExperiment === 'overflow' && (
                <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs">
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-sm">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Experiment: Stack Overflow Trigger</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    A Stack Overflow occurs when an algorithm calls <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded font-mono font-bold">push()</code> on a stack that is already at maximum capacity.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => {
                        handleSetCapacity(3);
                        setItems([
                          { id: '1', value: 10, addedAt: 1 },
                          { id: '2', value: 20, addedAt: 2 },
                          { id: '3', value: 30, addedAt: 3 },
                        ]);
                        setFeedback({
                          type: 'warning',
                          title: 'Stack Filled to Capacity (3/3)',
                          message: 'Click [+ PUSH(99)] below to trigger the Stack Overflow exception guard.',
                        });
                      }}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Setup 3/3 Full Stack
                    </button>
                    <button
                      onClick={() => handlePush(99)}
                      className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 font-bold rounded-xl text-slate-800 dark:text-white transition-all cursor-pointer"
                    >
                      Attempt Push(99)
                    </button>
                  </div>
                </div>
              )}

              {/* Experiment 2: Underflow Test */}
              {activeExperiment === 'underflow' && (
                <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Experiment: Stack Underflow Trigger</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    A Stack Underflow occurs when an algorithm calls <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded font-mono font-bold">pop()</code> on an empty stack (Size: 0).
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => {
                        handleClearStack();
                        setFeedback({
                          type: 'warning',
                          title: 'Stack Cleared to 0',
                          message: 'Click [Attempt POP()] to observe underflow safety handling.',
                        });
                      }}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Empty the Stack
                    </button>
                    <button
                      onClick={handlePop}
                      className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 font-bold rounded-xl text-slate-800 dark:text-white transition-all cursor-pointer"
                    >
                      Attempt POP()
                    </button>
                  </div>
                </div>
              )}

              {/* Experiment 3: Inversion */}
              {activeExperiment === 'inversion' && (
                <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
                    <ArrowUpDown className="w-4 h-4" />
                    <span>Experiment: LIFO Sequence Inversion</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    By pushing elements in chronological order (A → B → C → D) and popping them sequentially, the original sequence naturally reverses (D → C → B → A).
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => {
                        handleSetCapacity(6);
                        setItems([
                          { id: '1', value: 1, addedAt: 1 },
                          { id: '2', value: 2, addedAt: 2 },
                          { id: '3', value: 3, addedAt: 3 },
                          { id: '4', value: 4, addedAt: 4 },
                        ]);
                        setFeedback({
                          type: 'info',
                          title: 'Input Sequence Loaded: [1, 2, 3, 4]',
                          message: 'Pop elements sequentially or click Reverse to observe LIFO inversion.',
                        });
                      }}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Load [1, 2, 3, 4]
                    </button>
                    <button
                      onClick={handleReverseStack}
                      className="px-3 py-1.5 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 hover:from-blue-800 hover:to-indigo-700 text-white font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Reverse Stack
                    </button>
                  </div>
                </div>
              )}

              {/* Experiment 4: Parentheses Matching */}
              {activeExperiment === 'brackets' && (
                <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      Token Stream: {bracketString}
                    </span>
                    <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">
                      Step {bracketStep}/{bracketTokens.length}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {bracketTokens.map((tok, idx) => (
                      <span
                        key={idx}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-black text-sm border ${
                          idx === bracketStep
                            ? 'bg-blue-600 text-white border-blue-500 ring-2 ring-blue-300 dark:ring-blue-900'
                            : idx < bracketStep
                            ? 'bg-slate-200 dark:bg-slate-700 text-slate-500 border-slate-300 dark:border-slate-600'
                            : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {tok}
                      </span>
                    ))}
                  </div>

                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-mono">
                    {bracketSimMessage}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => {
                        if (bracketStep >= bracketTokens.length) {
                          setBracketStep(0);
                          setBracketSimStack([]);
                          setBracketSimMessage('Reset. Click Step Next to begin.');
                          return;
                        }
                        const token = bracketTokens[bracketStep];
                        if (['(', '[', '{'].includes(token)) {
                          setBracketSimStack((prev) => [...prev, token]);
                          setBracketSimMessage(`Encountered opening '${token}': PUSH('${token}') onto stack.`);
                        } else {
                          const last = bracketSimStack[bracketSimStack.length - 1];
                          const matches =
                            (token === ')' && last === '(') ||
                            (token === ']' && last === '[') ||
                            (token === '}' && last === '{');
                          if (matches) {
                            setBracketSimStack((prev) => prev.slice(0, -1));
                            setBracketSimMessage(`Encountered closing '${token}': Matched top '${last}'! POP('${last}').`);
                          } else {
                            setBracketSimMessage(`Mismatch error! Expected matching pair for '${token}'.`);
                          }
                        }
                        setBracketStep((s) => s + 1);
                      }}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all cursor-pointer"
                    >
                      {bracketStep >= bracketTokens.length ? 'Restart Sim' : 'Step Next Token'}
                    </button>
                  </div>
                </div>
              )}

              {/* Experiment 5: Undo / Redo Buffer */}
              {activeExperiment === 'undo' && (
                <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      Document Buffer: &quot;{editorText}&quot;
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-[11px]">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                      <span className="font-bold text-slate-500 uppercase block mb-1">Undo Stack:</span>
                      <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">
                        [{undoStack.join(', ')}]
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                      <span className="font-bold text-slate-500 uppercase block mb-1">Redo Stack:</span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                        [{redoStack.join(', ') || 'empty'}]
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => {
                        if (undoStack.length === 0) return;
                        const prev = undoStack[undoStack.length - 1];
                        setUndoStack((u) => u.slice(0, -1));
                        setRedoStack((r) => [...r, editorText]);
                        setEditorText(prev);
                        soundEffects.playPop();
                      }}
                      disabled={undoStack.length === 0}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Undo (Ctrl+Z)
                    </button>
                    <button
                      onClick={() => {
                        if (redoStack.length === 0) return;
                        const next = redoStack[redoStack.length - 1];
                        setRedoStack((r) => r.slice(0, -1));
                        setUndoStack((u) => [...u, editorText]);
                        setEditorText(next);
                        soundEffects.playPush();
                      }}
                      disabled={redoStack.length === 0}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Redo (Ctrl+Y)
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Operations Command Deck & Live Trace (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Operation Deck Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div>
              <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Operations Command Deck
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Execute core and algorithmic stack operations.
              </p>
            </div>

            {/* 1. Custom Value PUSH Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Push Custom Value:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. 42 or 'A'"
                  value={customInputValue}
                  onChange={(e) => setCustomInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && customInputValue.trim()) {
                      handlePush(
                        isNaN(Number(customInputValue)) ? customInputValue.trim() : Number(customInputValue)
                      );
                      setCustomInputValue('');
                    }
                  }}
                  className="flex-1 px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-xs sm:text-sm outline-hidden focus:ring-2 focus:ring-blue-500"
                />

                <button
                  onClick={() => {
                    if (customInputValue.trim()) {
                      handlePush(
                        isNaN(Number(customInputValue)) ? customInputValue.trim() : Number(customInputValue)
                      );
                      setCustomInputValue('');
                    }
                  }}
                  disabled={!customInputValue.trim()}
                  className="px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs active:scale-95 flex items-center gap-1.5"
                >
                  <ArrowDownToLine className="w-4 h-4" />
                  <span>PUSH</span>
                </button>
              </div>

              {/* Quick Number Chips */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Quick Chips:</span>
                {QUICK_ELEMENT_CHIPS.map((num) => (
                  <button
                    key={num}
                    onClick={() => handlePush(num)}
                    className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-950/70 text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-300 font-mono font-bold text-xs transition-colors cursor-pointer"
                  >
                    +{num}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Core ADT Buttons Grid */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handlePop}
                disabled={isEmpty}
                className="p-2.5 rounded-2xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-950/80 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/60 font-bold text-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-2xs active:scale-95"
              >
                <ArrowUpRight className="w-4 h-4 text-red-600 dark:text-red-400" />
                <span>POP TOP</span>
              </button>

              <button
                onClick={handlePeek}
                disabled={isEmpty}
                className="p-2.5 rounded-2xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 font-bold text-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-2xs active:scale-95"
              >
                <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>PEEK TOP</span>
              </button>
            </div>

            {/* 3. Advanced Stack Operations Grid */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Extended Stack Algorithms:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                <button
                  onClick={handleDuplicateTop}
                  disabled={isEmpty || isFull}
                  title="Duplicate top element"
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-[11px] disabled:opacity-40 transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>DUP</span>
                </button>

                <button
                  onClick={handleSwapTopTwo}
                  disabled={items.length < 2}
                  title="Swap top two elements"
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-[11px] disabled:opacity-40 transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>SWAP</span>
                </button>

                <button
                  onClick={handleReverseStack}
                  disabled={items.length <= 1}
                  title="Reverse stack order"
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-[11px] disabled:opacity-40 transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  <span>REVERSE</span>
                </button>

                <button
                  onClick={() => handleSortStack(true)}
                  disabled={items.length <= 1}
                  title="Sort elements in ascending order"
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-[11px] disabled:opacity-40 transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <span>SORT ↑</span>
                </button>

                <button
                  onClick={() => handleSortStack(false)}
                  disabled={items.length <= 1}
                  title="Sort elements in descending order"
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-[11px] disabled:opacity-40 transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <span>SORT ↓</span>
                </button>

                <button
                  onClick={handleRotateStack}
                  disabled={items.length <= 1}
                  title="Rotate bottom to top"
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-[11px] disabled:opacity-40 transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <span>ROTATE</span>
                </button>
              </div>
            </div>

            {/* 4. Batch Generators */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Batch Generators:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => handleBatchPush('seq')}
                  className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono font-bold text-[11px] transition-colors cursor-pointer"
                >
                  + [10..40]
                </button>
                <button
                  onClick={() => handleBatchPush('fib')}
                  className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono font-bold text-[11px] transition-colors cursor-pointer"
                >
                  + Fibonacci
                </button>
                <button
                  onClick={() => handleBatchPush('random')}
                  className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono font-bold text-[11px] transition-colors cursor-pointer"
                >
                  🎲 3 Random
                </button>
                <button
                  onClick={() => handleBatchPush('fill')}
                  className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono font-bold text-[11px] transition-colors cursor-pointer"
                >
                  ⚡ Fill Max
                </button>
              </div>
            </div>

            {/* 5. Search Element */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Search Element Depth:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search value..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearchValue();
                  }}
                  className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold outline-hidden focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSearchValue}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Search
                </button>
              </div>

              {searchResult && (
                <div
                  className={`p-2 rounded-xl text-xs font-bold ${
                    searchResult.found
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                  }`}
                >
                  {searchResult.message}
                </div>
              )}
            </div>
          </div>

          {/* Diagnostics & Feedback Card */}
          <div
            className={`p-4 rounded-3xl border transition-all ${
              feedback.type === 'error'
                ? 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800 text-red-900 dark:text-red-200'
                : feedback.type === 'warning'
                ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                : feedback.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                : 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200'
            }`}
          >
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5">
                {feedback.type === 'error' && <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />}
                {feedback.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
                {feedback.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
                {feedback.type === 'info' && <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black uppercase tracking-wider">{feedback.title}</h4>
                <p className="text-xs leading-relaxed opacity-90">{feedback.message}</p>
              </div>
            </div>
          </div>

          {/* Operation History Trace Logs */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                Live Operation Trace
              </span>
              <span className="text-[11px] font-mono text-slate-400 font-bold">
                {history.length} events
              </span>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
              {history.map((log) => (
                <div
                  key={log.id}
                  className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 text-xs flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-black shrink-0 ${
                        log.operation === 'PUSH'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          : log.operation === 'POP'
                          ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                          : log.operation === 'PEEK'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {log.operation}
                    </span>
                    <span className="truncate text-slate-700 dark:text-slate-300 text-[11px]">
                      {log.message}
                    </span>
                  </div>

                  <span className="font-mono text-[10px] text-slate-400 shrink-0">
                    [{log.stackSnapshot.join(',') || 'Ø'}]
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
