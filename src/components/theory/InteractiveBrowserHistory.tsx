import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Globe, Plus, RotateCcw } from 'lucide-react';
import { soundEffects } from '../../services/sound';

export const InteractiveBrowserHistory: React.FC = () => {
  const [backStack, setBackStack] = useState<string[]>(['google.com', 'github.com']);
  const [currentPage, setCurrentPage] = useState<string>('stackoverflow.com');
  const [forwardStack, setForwardStack] = useState<string[]>([]);
  const [nextUrl, setNextUrl] = useState('wikipedia.org');

  const handleVisit = () => {
    soundEffects.playPush();
    setBackStack((prev) => [...prev, currentPage]);
    setCurrentPage(nextUrl);
    setForwardStack([]); // Visiting a new page clears the forward stack
    setNextUrl(nextUrl === 'wikipedia.org' ? 'react.dev' : 'wikipedia.org');
  };

  const handleBack = () => {
    if (backStack.length === 0) return;
    soundEffects.playPop();
    const prevPage = backStack[backStack.length - 1];
    setBackStack((prev) => prev.slice(0, -1));
    setForwardStack((prev) => [...prev, currentPage]);
    setCurrentPage(prevPage);
  };

  const handleForward = () => {
    if (forwardStack.length === 0) return;
    soundEffects.playPop();
    const nextP = forwardStack[forwardStack.length - 1];
    setForwardStack((prev) => prev.slice(0, -1));
    setBackStack((prev) => [...prev, currentPage]);
    setCurrentPage(nextP);
  };

  const handleReset = () => {
    setBackStack(['google.com', 'github.com']);
    setCurrentPage('stackoverflow.com');
    setForwardStack([]);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 space-y-5 transition-colors">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Browser Back & Forward Dual-Stack Engine
          </span>
        </div>
        <button
          onClick={handleReset}
          className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Browser Bar Simulation */}
      <div className="p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-2 shadow-2xs">
        <button
          onClick={handleBack}
          disabled={backStack.length === 0}
          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
          title="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button
          onClick={handleForward}
          disabled={forwardStack.length === 0}
          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
          title="Forward"
        >
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 truncate">
          https://{currentPage}
        </div>

        <button
          onClick={handleVisit}
          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" /> Visit {nextUrl}
        </button>
      </div>

      {/* Dual Stacks Side-by-Side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Back Stack */}
        <div className="p-3.5 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>BACK STACK (Size: {backStack.length})</span>
            <span className="text-[10px] text-slate-400 font-mono">TOP at bottom</span>
          </div>
          <div className="min-h-[100px] flex flex-col gap-1.5 p-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800">
            {backStack.length === 0 ? (
              <span className="text-slate-400 text-xs font-mono text-center my-auto">[ Empty ]</span>
            ) : (
              backStack.map((url, idx) => {
                const isTop = idx === backStack.length - 1;
                return (
                  <div
                    key={idx}
                    className={`p-1.5 rounded text-xs font-mono flex items-center justify-between ${
                      isTop
                        ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-200 font-bold border border-indigo-300 dark:border-indigo-800'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span>{url}</span>
                    {isTop && <span className="text-[9px] bg-indigo-600 text-white px-1 rounded">TOP</span>}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Forward Stack */}
        <div className="p-3.5 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>FORWARD STACK (Size: {forwardStack.length})</span>
            <span className="text-[10px] text-slate-400 font-mono">TOP at bottom</span>
          </div>
          <div className="min-h-[100px] flex flex-col gap-1.5 p-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800">
            {forwardStack.length === 0 ? (
              <span className="text-slate-400 text-xs font-mono text-center my-auto">[ Empty ]</span>
            ) : (
              forwardStack.map((url, idx) => {
                const isTop = idx === forwardStack.length - 1;
                return (
                  <div
                    key={idx}
                    className={`p-1.5 rounded text-xs font-mono flex items-center justify-between ${
                      isTop
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 font-bold border border-emerald-300 dark:border-emerald-800'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span>{url}</span>
                    {isTop && <span className="text-[9px] bg-emerald-600 text-white px-1 rounded">TOP</span>}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
