import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, Award, BookOpen, Sparkles, RotateCcw, ArrowRight } from 'lucide-react';
import { soundEffects } from '../../services/sound';

export const InteractiveMasterSummary: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState<boolean>(false);

  const quiz = [
    {
      q: 'What is the theoretical worst-case lower bound for any comparison-based sorting algorithm?',
      options: ['O(n)', 'O(n log n) [Omega(n log n)]', 'O(n²)', 'O(log n)'],
      correct: 1,
      explanation: 'Because an array of size n has n! permutations, a binary decision tree requires height at least ceil(log2(n!)) = Omega(n log n).',
    },
    {
      q: 'Which sorting algorithm guarantees O(n log n) worst-case time and is strictly STABLE?',
      options: ['Quick Sort', 'Heap Sort', 'Merge Sort', 'Selection Sort'],
      correct: 2,
      explanation: 'Merge Sort guarantees O(n log n) in all cases and preserves the relative order of duplicate keys (stable).',
    },
    {
      q: 'Why does Insertion Sort run in O(n) linear time on already-sorted arrays?',
      options: [
        'It uses a hash map to look up items',
        'Each key comparison immediately terminates without shifting any elements',
        'It divides the array using a binary pivot',
        'It counts frequencies in advance',
      ],
      correct: 1,
      explanation: 'On already-sorted inputs, arr[j] > key is immediately false on the first comparison, resulting in exactly n - 1 comparisons and 0 shifts.',
    },
    {
      q: 'Which algorithm requires only O(1) auxiliary space and never degrades to O(n²) worst-case time?',
      options: ['Merge Sort', 'Quick Sort', 'Heap Sort', 'Counting Sort'],
      correct: 2,
      explanation: 'Heap Sort operates strictly in-place inside the array representation of a binary max-heap, bounding runtime to O(n log n) in all cases.',
    },
  ];

  const handleSelect = (qIdx: number, oIdx: number) => {
    soundEffects.playClick();
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: oIdx }));
  };

  const handleCheck = () => {
    soundEffects.playSuccess();
    setShowResults(true);
  };

  const handleReset = () => {
    soundEffects.playClick();
    setSelectedAnswers({});
    setShowResults(false);
  };

  const score = Object.entries(selectedAnswers).filter(
    ([qIdx, optIdx]) => quiz[Number(qIdx)].correct === optIdx
  ).length;

  return (
    <div className="bg-slate-50 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Sorting Algorithms Mastery Assessment</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Test your retention of core sorting paradigms, mathematical bounds, and stability properties.
        </p>
      </div>

      {/* Quiz Questions */}
      <div className="space-y-4">
        {quiz.map((item, qIdx) => {
          const selected = selectedAnswers[qIdx];
          const isAnswered = selected !== undefined;
          const isCorrect = selected === item.correct;

          return (
            <div
              key={qIdx}
              className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3"
            >
              <div className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  {qIdx + 1}
                </span>
                <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                  {item.q}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {item.options.map((opt, oIdx) => {
                  let btnStyle = 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-400';
                  if (selected === oIdx) {
                    btnStyle = 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-700 dark:text-blue-300 font-semibold';
                  }
                  if (showResults) {
                    if (oIdx === item.correct) {
                      btnStyle = 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold';
                    } else if (selected === oIdx) {
                      btnStyle = 'bg-rose-50 dark:bg-rose-950/70 border-rose-500 text-rose-700 dark:text-rose-300';
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      disabled={showResults}
                      onClick={() => handleSelect(qIdx, oIdx)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer disabled:cursor-default flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {showResults && oIdx === item.correct && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 ml-1.5" />
                      )}
                      {showResults && selected === oIdx && !isCorrect && (
                        <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0 ml-1.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {showResults && (
                <div
                  className={`p-3 rounded-lg text-xs leading-relaxed border ${
                    isCorrect
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200'
                      : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <strong>Explanation:</strong> {item.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Controls & Score */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div>
          {showResults && (
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">
                Your Score: {score} / {quiz.length} ({Math.round((score / quiz.length) * 100)}%)
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {showResults ? (
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Assessment</span>
            </button>
          ) : (
            <button
              onClick={handleCheck}
              disabled={Object.keys(selectedAnswers).length === 0}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Check Answers</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
