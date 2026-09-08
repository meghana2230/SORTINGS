import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  BookOpen,
  ArrowRight,
  ArrowUpDown,
  Layers,
  SlidersHorizontal,
  Swords,
  Wrench,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { SortGameId } from '../../types';

interface HowToPlayModalProps {
  gameId: SortGameId;
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({
  gameId,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const getGameContent = () => {
    switch (gameId) {
      case 'bubble-sort':
        return {
          title: 'Bubble Sort',
          subtitle: 'Adjacent Comparison & Swapping',
          icon: <ArrowUpDown className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
          flowSummary: 'Click → Compare → Decide → Drag/Keep → Next Pair',
          steps: [
            {
              title: 'Compare',
              desc: 'Click the two highlighted adjacent cards to inspect their values.',
            },
            {
              title: 'Decide',
              desc: 'Choose whether to SWAP them (if left > right) or KEEP them (if left ≤ right).',
            },
            {
              title: 'Swap',
              desc: 'If a swap is required, physically drag the greater card to the target slot.',
            },
            {
              title: 'Next Pair',
              desc: 'The next adjacent pair is automatically highlighted for comparison.',
            },
            {
              title: 'Complete the Pass',
              desc: 'At the end of each pass, the largest unsorted element locks into its final position.',
            },
            {
              title: 'Repeat',
              desc: 'Continue consecutive passes until all cards are locked and sorted.',
            },
          ],
          criticalNote:
            'Notice: The entire card object physically moves during a swap, not just the number inside it.',
        };

      case 'selection-sort':
        return {
          title: 'Selection Sort',
          subtitle: 'Minimum Searching & Boundary Placement',
          icon: <SlidersHorizontal className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
          flowSummary: 'Find Minimum → Select → Move → Place → Next Position',
          steps: [
            {
              title: 'Find Minimum',
              desc: 'Scan across the unsorted section of cards to identify the card with the lowest value.',
            },
            {
              title: 'Select',
              desc: 'Click the card you have identified as the true minimum candidate.',
            },
            {
              title: 'Move & Place',
              desc: 'Swap the minimum card into the current boundary slot at the front of the unsorted section.',
            },
            {
              title: 'Lock & Advance',
              desc: 'The placed card locks as sorted. The sorted prefix expands from left to right.',
            },
            {
              title: 'Next Position',
              desc: 'Repeat the scan for the remaining unsorted elements until the full list is ordered.',
            },
          ],
          criticalNote:
            'Notice: The complete card physically moves into its position, minimizing total write cycles to at most n - 1 swaps.',
        };

      case 'insertion-sort':
        return {
          title: 'Insertion Sort',
          subtitle: 'Predecessor Inspection & Shifting',
          icon: <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
          flowSummary: 'Select Card → Compare → Shift Cards → Insert → Continue',
          steps: [
            {
              title: 'Select Card',
              desc: 'Pick the current key card from the unsorted section to insert into the sorted prefix.',
            },
            {
              title: 'Compare Predecessors',
              desc: 'Compare the key against sorted cards to its left, moving backwards.',
            },
            {
              title: 'Shift Cards',
              desc: 'If a predecessor card is greater than the key, shift that predecessor one slot to the right.',
            },
            {
              title: 'Insert Key',
              desc: 'When you find a card less than or equal to the key (or reach the front), drop the key into the open slot.',
            },
            {
              title: 'Continue',
              desc: 'The sorted prefix is now one card larger. Advance to the next unsorted card.',
            },
          ],
          criticalNote:
            'Notice: Complete cards physically shift to make room for insertion, mimicking organizing playing cards in your hand.',
        };

      case 'sorting-battle':
        return {
          title: 'Sorting Battle',
          subtitle: 'Constraint Analysis & Strategy Execution',
          icon: <Swords className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
          flowSummary: 'Analyze Scenario → Select Optimal Algorithm → Execute Step by Step',
          steps: [
            {
              title: 'Analyze Constraints',
              desc: 'Read the battlefield scenario carefully: check for nearly-sorted data, hardware write limitations, or reverse arrays.',
            },
            {
              title: 'Choose Strategy',
              desc: 'Select the optimal sorting technique: Bubble Sort (adjacent exchanges), Selection Sort (minimum write swaps), or Insertion Sort (adaptive O(n) prefix shifts).',
            },
            {
              title: 'Execute Step by Step',
              desc: 'Perform the sorting steps accurately without mistakes to maximize your efficiency score.',
            },
            {
              title: 'Conquer the Level',
              desc: 'Lock the entire array to complete the challenge and unlock the next battlefield.',
            },
          ],
          criticalNote:
            'Tip: Consider time complexity and write costs when picking your strategy for each battlefield scenario.',
        };

      case 'fix-algorithm':
        return {
          title: 'Fix the Algorithm',
          subtitle: 'Trace Inspection & Invariant Repair',
          icon: <Wrench className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
          flowSummary: 'Inspect Trace → Identify Flaw → Choose Correction → Verify Fix',
          steps: [
            {
              title: 'Inspect Trace',
              desc: 'Review the recorded execution log and the current configuration of the cards.',
            },
            {
              title: 'Identify Flaw',
              desc: 'Find what went wrong: skipped comparisons, missed minimums, premature stops, or stability violations.',
            },
            {
              title: 'Choose Correction',
              desc: 'Select the correct algorithmic fix from the multiple options.',
            },
            {
              title: 'Verify Fix',
              desc: 'Apply the bug fix to see the cards animate into their correct invariant state.',
            },
          ],
          criticalNote:
            'Tip: Look for algorithm loop invariants: sorted prefix boundaries, pass indices, and strict comparison rules.',
        };

      default:
        return {
          title: 'How to Play',
          subtitle: 'Interactive Sorting Guide',
          icon: <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
          flowSummary: 'Follow the on-screen steps to sort the cards.',
          steps: [],
          criticalNote: '',
        };
    }
  };

  const content = getGameContent();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto custom-scrollbar"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-center shrink-0">
                {content.icon}
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                  HOW TO PLAY
                </h3>
                <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  {content.title} — {content.subtitle}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center cursor-pointer transition-colors"
              aria-label="Close Guide"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Flow Summary Strip */}
          <div className="px-3.5 py-2.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-indigo-950 dark:text-indigo-200 text-xs font-mono font-bold flex items-center gap-2">
            <span className="shrink-0 px-1.5 py-0.5 rounded bg-indigo-200/70 dark:bg-indigo-900/80 text-[10px] uppercase font-sans font-extrabold text-indigo-800 dark:text-indigo-200">
              FLOW
            </span>
            <span className="truncate">{content.flowSummary}</span>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="space-y-3">
            {content.steps.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
              >
                <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-mono font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Critical Educational Physical Movement Note */}
          {content.criticalNote && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
              <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed font-medium">{content.criticalNote}</p>
            </div>
          )}

          {/* Dismiss Button */}
          <div className="flex justify-end pt-1">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Got It, Let&apos;s Play</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
