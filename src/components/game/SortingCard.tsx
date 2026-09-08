import React from 'react';
import { motion } from 'motion/react';
import { Lock, Check, Sparkles, ArrowRightLeft, MoveRight } from 'lucide-react';
import { SortCardObject } from '../../types';

interface SortingCardProps {
  card: SortCardObject;
  index: number;
  isSelected?: boolean;
  isPairHighlighted?: boolean;
  isDragCandidate?: boolean;
  isDropTarget?: boolean;
  onCardClick?: () => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export const SortingCard: React.FC<SortingCardProps> = ({
  card,
  index,
  isSelected = false,
  isPairHighlighted = false,
  isDragCandidate = false,
  isDropTarget = false,
  onCardClick,
}) => {
  // Compute badge label
  let badgeLabel: string | null = null;
  if (card.isSorted) {
    badgeLabel = 'SORTED';
  } else if (card.isMinimum) {
    badgeLabel = 'MINIMUM';
  } else if (card.isCurrent) {
    badgeLabel = 'CURRENT';
  } else if (card.isShifting) {
    badgeLabel = 'SHIFTING';
  } else if (isPairHighlighted) {
    badgeLabel = 'COMPARE';
  }

  // Dynamic styling based on physical card state
  let cardStyles = 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-xs';
  if (card.isSorted) {
    cardStyles = 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-600 text-emerald-900 dark:text-emerald-100 shadow-xs';
  } else if (card.isMinimum) {
    cardStyles = 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-400 dark:border-amber-500 text-amber-900 dark:text-amber-100 shadow-md ring-2 ring-amber-400/40';
  } else if (card.isCurrent) {
    cardStyles = 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 dark:border-indigo-400 text-indigo-900 dark:text-indigo-100 shadow-md ring-2 ring-indigo-500/40';
  } else if (isDragCandidate) {
    cardStyles = 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-900 dark:text-blue-100 shadow-lg ring-3 ring-blue-500/50 animate-pulse';
  } else if (isPairHighlighted || isSelected) {
    cardStyles = 'bg-blue-50/80 dark:bg-blue-950/50 border-blue-400 dark:border-blue-500 text-blue-950 dark:text-blue-100 shadow-md ring-2 ring-blue-400/50';
  } else if (isDropTarget) {
    cardStyles = 'bg-blue-50/50 dark:bg-blue-950/40 border-blue-400 text-blue-900 dark:text-blue-100 border-dashed border-2';
  }

  return (
    <motion.div
      layout
      layoutId={card.id}
      transition={{
        type: 'spring',
        stiffness: 350,
        damping: 25,
        mass: 0.8,
      }}
      whileHover={!card.isSorted ? { y: -4, scale: 1.02 } : {}}
      whileTap={!card.isSorted ? { scale: 0.96 } : {}}
      onClick={onCardClick}
      className={`relative select-none flex flex-col items-center justify-between p-3 sm:p-4 w-18 sm:w-22 h-26 sm:h-32 rounded-2xl border-2 transition-colors cursor-pointer shrink-0 ${cardStyles}`}
      id={`card-${card.id}`}
    >
      {/* Top Bar: Index & Status Tag */}
      <div className="w-full flex items-center justify-between text-[10px] font-mono">
        <span className="text-slate-400 dark:text-slate-500 font-bold">
          #{index}
        </span>
        {card.isSorted ? (
          <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[2.5]" />
        ) : isDragCandidate ? (
          <ArrowRightLeft className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 animate-spin" />
        ) : (
          <span className="text-[9px] font-mono text-slate-400">id:{card.id.split('-')[1]}</span>
        )}
      </div>

      {/* Center: Large Card Value */}
      <div className="flex flex-col items-center justify-center my-auto">
        <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight leading-none">
          {card.value}
        </span>
      </div>

      {/* Bottom: State Label Badge */}
      <div className="w-full flex justify-center">
        {badgeLabel ? (
          <span
            className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md leading-none ${
              card.isSorted
                ? 'bg-emerald-100 dark:bg-emerald-900/80 text-emerald-700 dark:text-emerald-300'
                : card.isMinimum
                ? 'bg-amber-100 dark:bg-amber-900/80 text-amber-800 dark:text-amber-200'
                : card.isCurrent
                ? 'bg-indigo-100 dark:bg-indigo-900/80 text-indigo-800 dark:text-indigo-200'
                : isDragCandidate
                ? 'bg-blue-600 text-white animate-bounce'
                : 'bg-blue-100 dark:bg-blue-900/80 text-blue-700 dark:text-blue-300'
            }`}
          >
            {badgeLabel}
          </span>
        ) : (
          <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold">
            Unsorted
          </span>
        )}
      </div>

      {/* Visual lock watermark for sorted items */}
      {card.isSorted && (
        <div className="absolute top-1.5 right-1.5 opacity-20 pointer-events-none">
          <Lock className="w-4 h-4 text-emerald-600" />
        </div>
      )}
    </motion.div>
  );
};
