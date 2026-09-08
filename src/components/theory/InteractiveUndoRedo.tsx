import React, { useState } from 'react';
import { Undo, Redo, Type, RotateCcw } from 'lucide-react';
import { soundEffects } from '../../services/sound';

export const InteractiveUndoRedo: React.FC = () => {
  const [undoStack, setUndoStack] = useState<string[]>(['Hello', 'Hello World']);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const [currentText, setCurrentText] = useState('Hello World!');

  const handleType = (word: string) => {
    soundEffects.playPush();
    setUndoStack((prev) => [...prev, currentText]);
    setCurrentText((prev) => (prev ? `${prev} ${word}` : word));
    setRedoStack([]);
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    soundEffects.playPop();
    const prevText = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [...prev, currentText]);
    setCurrentText(prevText);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    soundEffects.playPop();
    const nextText = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    setUndoStack((prev) => [...prev, currentText]);
    setCurrentText(nextText);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 space-y-4 transition-colors">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Undo / Redo Text Editor Dual-Stack Engine
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleUndo}
            disabled={undoStack.length === 0}
            className="px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700 flex items-center gap-1 cursor-pointer"
          >
            <Undo className="w-3.5 h-3.5" /> Undo (Ctrl+Z)
          </button>
          <button
            onClick={handleRedo}
            disabled={redoStack.length === 0}
            className="px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700 flex items-center gap-1 cursor-pointer"
          >
            <Redo className="w-3.5 h-3.5" /> Redo (Ctrl+Y)
          </button>
        </div>
      </div>

      {/* Editor Box */}
      <div className="p-4 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
        <span className="text-[10px] font-mono uppercase text-slate-400">Active Document Buffer:</span>
        <div className="min-h-[48px] p-3 bg-slate-50 dark:bg-slate-900 rounded-lg font-mono text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center">
          {currentText || <span className="text-slate-400 italic">[ Empty Document ]</span>}
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          {['🚀', 'Coding', 'DSA', 'Stack'].map((word) => (
            <button
              key={word}
              onClick={() => handleType(word)}
              className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-bold border border-indigo-200 dark:border-indigo-800 cursor-pointer"
            >
              + Type "{word}"
            </button>
          ))}
        </div>
      </div>

      {/* Stacks Snapshot */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-2.5 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
          <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
            Undo Stack ({undoStack.length})
          </span>
          <div className="text-[11px] font-mono text-slate-500 truncate">
            {undoStack.length > 0 ? undoStack.join(' → ') : '[ Empty ]'}
          </div>
        </div>
        <div className="p-2.5 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
          <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
            Redo Stack ({redoStack.length})
          </span>
          <div className="text-[11px] font-mono text-slate-500 truncate">
            {redoStack.length > 0 ? redoStack.join(' → ') : '[ Empty ]'}
          </div>
        </div>
      </div>
    </div>
  );
};
