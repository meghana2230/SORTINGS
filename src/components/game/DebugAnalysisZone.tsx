import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, Bug, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface DebugStep {
  id: string;
  text: string;
  isFaulty: boolean;
  errorType?: string;
  explanation: string;
}

interface DebugAnalysisZoneProps {
  debugSteps: DebugStep[];
  onIdentifiedError: (step: DebugStep) => void;
  onWrongStepSelected: (step: DebugStep) => void;
  identifiedStep: DebugStep | null;
  wrongStepAttempted: DebugStep | null;
  isGuidedSolveActive?: boolean;
}

export const DebugAnalysisZone: React.FC<DebugAnalysisZoneProps> = ({
  debugSteps,
  onIdentifiedError,
  onWrongStepSelected,
  identifiedStep,
  wrongStepAttempted,
  isGuidedSolveActive = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const data = e.dataTransfer.getData('text/plain');
    if (!data) return;

    try {
      const parsed: DebugStep = JSON.parse(data);
      if (parsed.isFaulty) {
        onIdentifiedError(parsed);
      } else {
        onWrongStepSelected(parsed);
      }
    } catch {
      // Fallback find step by text
      const found = debugSteps.find((s) => s.text === data || s.id === data);
      if (found) {
        if (found.isFaulty) onIdentifiedError(found);
        else onWrongStepSelected(found);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full">
      {/* Execution Trace Steps Column (6 cols) */}
      <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <Bug className="w-4 h-4" />
            </span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
              Program Execution Trace
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Drag or Click Faulty Line
          </span>
        </div>

        <div className="space-y-2">
          {debugSteps.map((step) => {
            const isFaultyTarget = isGuidedSolveActive && step.isFaulty;
            const isSuccess = identifiedStep?.id === step.id;

            return (
              <div
                key={step.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', JSON.stringify(step));
                  e.dataTransfer.effectAllowed = 'copy';
                }}
                onClick={() => {
                  if (step.isFaulty) onIdentifiedError(step);
                  else onWrongStepSelected(step);
                }}
                className={`p-3.5 rounded-xl border-2 font-mono text-xs transition-all cursor-grab active:cursor-grabbing flex items-center justify-between gap-2 shadow-2xs select-none ${
                  isSuccess
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold'
                    : isFaultyTarget
                    ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-500 text-amber-950 dark:text-amber-200 ring-4 ring-amber-200 dark:ring-amber-900 animate-pulse font-bold'
                    : 'bg-slate-50 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-950/50 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-blue-400'
                }`}
              >
                <span>{step.text}</span>
                <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded bg-white/80 dark:bg-slate-700/80 text-slate-500 dark:text-slate-400 shrink-0">
                  {isSuccess ? '✓ Faulty Line' : 'Drag to Debug'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Debug Analysis Target Zone (6 cols) */}
      <div className="lg:col-span-6 flex flex-col justify-center">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`w-full min-h-[220px] rounded-2xl border-3 border-dashed p-6 text-center transition-all flex flex-col items-center justify-center relative overflow-hidden ${
            identifiedStep
              ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200'
              : wrongStepAttempted
              ? 'border-red-500 bg-red-50/80 dark:bg-red-950/70 text-red-900 dark:text-red-200'
              : isDragOver || isGuidedSolveActive
              ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-950/70 text-blue-900 dark:text-blue-200 ring-4 ring-blue-200 dark:ring-blue-900'
              : 'border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 hover:border-blue-400'
          }`}
        >
          {identifiedStep ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-3 max-w-sm"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300 block">
                ✓ Root Cause Confirmed: {identifiedStep.errorType || 'Fatal Error'}
              </span>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                {identifiedStep.text}
              </p>
              <p className="text-xs font-medium text-emerald-900 dark:text-emerald-200 bg-white dark:bg-slate-800 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800 text-left">
                {identifiedStep.explanation}
              </p>
            </motion.div>
          ) : wrongStepAttempted ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-3 max-w-sm"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 flex items-center justify-center mx-auto shadow-xs">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-red-700 dark:text-red-300 block">
                ✕ That Instruction is Valid!
              </span>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                {wrongStepAttempted.text} executes safely without violating stack invariants.
              </p>
              <span className="text-[11px] text-red-600 dark:text-red-400 font-semibold block">
                Look for the step where the Stack is empty or capacity is exceeded!
              </span>
            </motion.div>
          ) : (
            <div className="space-y-2.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto shadow-2xs border border-blue-200 dark:border-blue-800">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 block">
                DEBUG ANALYSIS ZONE
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
                Drop the invalid instruction here to run root-cause diagnosis.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
