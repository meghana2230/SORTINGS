import React, { useState } from 'react';
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { soundEffects } from '../../services/sound';

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface InteractiveProblemQuizProps {
  questions: Question[];
}

export const InteractiveProblemQuiz: React.FC<InteractiveProblemQuizProps> = ({ questions }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState<Record<number, boolean>>({});

  const handleSelect = (qIdx: number, optIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
    setShowResults((prev) => ({ ...prev, [qIdx]: true }));

    const isCorrect = optIdx === questions[qIdx].correctIndex;
    if (isCorrect) {
      soundEffects.playSuccess();
    } else {
      soundEffects.playError();
    }
  };

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
        <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
        <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
          Knowledge Check & Practice
        </span>
      </div>

      {questions.map((q, qIdx) => {
        const selected = selectedAnswers[qIdx];
        const isAnswered = showResults[qIdx];
        const isCorrect = selected === q.correctIndex;

        return (
          <div
            key={qIdx}
            className="p-4 bg-slate-50 dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3"
          >
            <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100">
              {qIdx + 1}. {q.question}
            </p>

            <div className="space-y-2">
              {q.options.map((opt, optIdx) => {
                const isThisSelected = selected === optIdx;
                const isThisCorrect = optIdx === q.correctIndex;

                let btnStyle =
                  'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-700';

                if (isAnswered) {
                  if (isThisCorrect) {
                    btnStyle =
                      'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
                  } else if (isThisSelected && !isCorrect) {
                    btnStyle =
                      'bg-rose-50 dark:bg-rose-950/80 border-rose-500 text-rose-900 dark:text-rose-200 font-bold';
                  }
                }

                return (
                  <button
                    key={optIdx}
                    disabled={isAnswered}
                    onClick={() => handleSelect(qIdx, optIdx)}
                    className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isAnswered && isThisCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                    {isAnswered && isThisSelected && !isCorrect && (
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <div
                className={`p-3 rounded-lg text-xs leading-relaxed ${
                  isCorrect
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-900'
                    : 'bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-900'
                }`}
              >
                <span className="font-bold">{isCorrect ? 'Correct! ' : 'Incorrect: '}</span>
                {q.explanation}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
