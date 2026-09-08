import React from 'react';
import { Check, AlertCircle, Layers } from 'lucide-react';

interface AlgorithmAttributesProps {
  advantages: string[];
  disadvantages: string[];
  applications: string[];
}

export const AlgorithmAttributes: React.FC<AlgorithmAttributesProps> = ({
  advantages,
  disadvantages,
  applications,
}) => {
  return (
    <div className="space-y-4 pt-1">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-mono font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-100/70 dark:bg-indigo-900/60 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
          Core Analysis
        </span>
        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
          Advantages, Disadvantages &amp; Applications
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* ─── 1. ADVANTAGES ─── */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-3.5 flex flex-col">
          <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200/60 dark:border-indigo-900/60">
              <Check className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Advantages</h4>
              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">Key Strengths</span>
            </div>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 flex-1">
            {advantages.map((adv, idx) => (
              <li key={idx} className="flex items-start gap-2 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 shrink-0 mt-1.5" />
                <span>{adv}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ─── 2. DISADVANTAGES ─── */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-3.5 flex flex-col">
          <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center border border-slate-200 dark:border-slate-700">
              <AlertCircle className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Disadvantages</h4>
              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">Key Limitations</span>
            </div>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 flex-1">
            {disadvantages.map((dis, idx) => (
              <li key={idx} className="flex items-start gap-2 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 shrink-0 mt-1.5" />
                <span>{dis}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ─── 3. APPLICATIONS ─── */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-3.5 flex flex-col">
          <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200/60 dark:border-indigo-900/60">
              <Layers className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Applications</h4>
              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">Practical Use Cases</span>
            </div>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 flex-1">
            {applications.map((app, idx) => (
              <li key={idx} className="flex items-start gap-2 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 shrink-0 mt-1.5" />
                <span>{app}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
