import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';
import { SortGameId } from '../../types';

interface GuidedSolveModalProps {
  gameId: SortGameId;
  isOpen: boolean;
  onClose: () => void;
}

export const GuidedSolveModal: React.FC<GuidedSolveModalProps> = ({
  gameId,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const getGuidedSolveContent = () => {
    switch (gameId) {
      case 'bubble-sort':
        return {
          title: 'Bubble Sort — Guided Solve',
          subtitle: 'Step-by-step comparison & swap walkthrough',
          coreQuestions: [
            {
              question: 'Which two elements should be compared?',
              answer:
                'Always compare the two highlighted adjacent elements from left to right (index i and index i + 1). In Bubble Sort, comparisons are strictly between immediate neighbors.',
            },
            {
              question: 'Should they be swapped?',
              answer:
                'Check if the left element is strictly greater than the right element. If Left > Right, select SWAP and drag the greater card rightward. If Left ≤ Right, select KEEP to preserve ascending order.',
            },
            {
              question: 'What is the next comparison?',
              answer:
                'Shift your focus one position to the right and compare the next adjacent pair. Repeat this across the array until you reach the unsorted boundary.',
            },
            {
              question: 'What happens at the end of each pass?',
              answer:
                'The largest unsorted element "bubbles up" all the way to the end and permanently locks. Subsequent passes ignore already locked cards at the right.',
            },
          ],
          gameplayTip:
            'Click the two highlighted cards to inspect them, choose SWAP or KEEP, and if swapping, drag the card into the slot.',
        };

      case 'selection-sort':
        return {
          title: 'Selection Sort — Guided Solve',
          subtitle: 'Step-by-step minimum selection walkthrough',
          coreQuestions: [
            {
              question: 'Which element is currently the minimum?',
              answer:
                'Scan all cards in the unsorted section (cards to the right of the locked sorted boundary). Look for the card with the lowest numerical value.',
            },
            {
              question: 'Where should the minimum element go?',
              answer:
                'The minimum element belongs at the very beginning of the current unsorted section (index i). Swap the minimum card with whatever card is currently sitting in index i.',
            },
            {
              question: 'What should be selected next?',
              answer:
                'Once the swap is made, that slot locks permanently as sorted. Move to the next slot (i + 1) and scan the remaining unsorted cards for the new minimum.',
            },
            {
              question: 'How many swaps occur per pass?',
              answer:
                'Exactly one swap occurs per pass. This makes Selection Sort very economical on memory writes, performing at most O(n) total swaps.',
            },
          ],
          gameplayTip:
            'Click the lowest value card in the unsorted area to select it as the minimum, then swap it into the active target slot.',
        };

      case 'insertion-sort':
        return {
          title: 'Insertion Sort — Guided Solve',
          subtitle: 'Step-by-step element insertion walkthrough',
          coreQuestions: [
            {
              question: 'Which element is being inserted?',
              answer:
                'The "key" element is the first card of the unsorted partition. You lift this card out to find its appropriate place among already sorted elements to its left.',
            },
            {
              question: 'Where should it be placed?',
              answer:
                'Scan the sorted cards to the left from right to left. The key belongs in the slot where every card to its left is smaller and every card to its right is larger.',
            },
            {
              question: 'Which elements need to shift?',
              answer:
                'Every sorted card that is greater than the key must shift one position to the right, opening up an empty slot for the key to drop into.',
            },
            {
              question: 'Why is Insertion Sort adaptive?',
              answer:
                'If an element is already in sorted order relative to its left neighbor, zero shifts are required and it takes O(1) time for that step!',
            },
          ],
          gameplayTip:
            'Inspect the key card, shift any larger items to the right to create space, and insert the key into the vacant position.',
        };

      case 'sorting-battle':
        return {
          title: 'Sorting Battle — Guided Solve',
          subtitle: 'Algorithm race & strategy walkthrough',
          coreQuestions: [
            {
              question: 'How do you choose the winning algorithm?',
              answer:
                'Analyze the initial array pattern: Nearly sorted arrays favor Insertion Sort (O(n)), while randomized arrays can vary. Pick the algorithm with the fewest total operations.',
            },
            {
              question: 'What metrics decide the winner?',
              answer:
                'Total comparisons + total swaps executed. Minimizing both counts secures maximum score and victory.',
            },
          ],
          gameplayTip:
            'Watch the live comparison and swap bars to observe which algorithm reaches the sorted state with fewer operations.',
        };

      case 'fix-the-sort':
        return {
          title: 'Fix the Algorithm — Guided Solve',
          subtitle: 'Debugging & invariant analysis walkthrough',
          coreQuestions: [
            {
              question: 'Where do sorting bugs usually hide?',
              answer:
                'Look for off-by-one errors in inner loop bounds (e.g., n vs n-1), incorrect comparison operators (< instead of >), or forgetting to decrement the boundary.',
            },
            {
              question: 'How do you verify the fix?',
              answer:
                'Step through the code with the provided test cases. Ensure edge cases like reversed arrays and duplicates are sorted correctly.',
            },
          ],
          gameplayTip:
            'Identify the incorrect code line, select the corrected syntax from the choices, and run the test suite.',
        };

      default:
        return {
          title: 'Guided Solve',
          subtitle: 'Step-by-step guidance',
          coreQuestions: [
            {
              question: 'How do I solve this level?',
              answer:
                'Follow the step-by-step instructions on screen, compare elements accurately, and apply the algorithm rules.',
            },
          ],
          gameplayTip: 'Take your time to understand each step.',
        };
    }
  };

  const content = getGuidedSolveContent();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header Banner */}
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-blue-50/70 to-indigo-50/50 dark:from-blue-950/40 dark:to-indigo-950/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <Lightbulb className="w-5 h-5 stroke-[2.4]" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase">
                  Step-by-Step Guidance
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                  {content.title}
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close Guided Solve"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto custom-scrollbar space-y-4">
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {content.subtitle}
            </p>

            {/* Questions & Answers Breakdown */}
            <div className="space-y-3">
              {content.coreQuestions.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 space-y-1.5"
                >
                  <div className="flex items-start gap-2">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center mt-0.5">
                      {idx + 1}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {item.question}
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 pl-7 leading-relaxed font-normal">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>

            {/* Gameplay Tip Box */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-600 dark:text-slate-300">
                <strong className="text-slate-900 dark:text-slate-100 block font-bold mb-0.5">
                  Actionable Gameplay Rule
                </strong>
                {content.gameplayTip}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Guidance tailored to current level
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs hover:shadow-sm transition-all cursor-pointer"
            >
              Got it, let's solve!
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
