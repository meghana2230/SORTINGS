import React from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp,
  Sparkles,
  Flame,
  Award,
  Layers,
  BookOpen,
  FlaskConical,
  CheckCircle2,
  Lock,
  ArrowDownToLine,
  AlertTriangle,
  Zap,
  ShieldAlert,
  RotateCcw,
  Play,
} from 'lucide-react';
import { SortGameId, UserProgress, GameStatus } from '../../types';
import { INITIAL_ACHIEVEMENTS } from '../../services/storage';
import { THEORY_LESSONS } from '../../data/theoryData';
import { soundEffects } from '../../services/sound';

interface GameBadgeCard {
  id: SortGameId;
  title: string;
  subtitle: string;
  description: string;
  totalLevels: number;
  xpReward: number;
}

const FIVE_GAME_CARDS: GameBadgeCard[] = [
  {
    id: 'bubble-sort',
    title: 'Bubble Sort',
    subtitle: 'Compare • Decide • Swap',
    description: 'Master Bubble Sort by comparing adjacent cards and swapping them when needed.',
    totalLevels: 5,
    xpReward: 250,
  },
  {
    id: 'selection-sort',
    title: 'Selection Sort',
    subtitle: 'Scan • Minimum • Lock',
    description: 'Scan unsorted partitions to find the minimum card and swap it into its sorted place.',
    totalLevels: 5,
    xpReward: 250,
  },
  {
    id: 'insertion-sort',
    title: 'Insertion Sort',
    subtitle: 'Shift • Insert • Organize',
    description: 'Shift larger cards and insert each element into its correct position.',
    totalLevels: 5,
    xpReward: 250,
  },
  {
    id: 'sorting-battle',
    title: 'Sorting Battle',
    subtitle: 'Algorithm Faceoff • Speed Comparison',
    description: 'Pit Bubble, Selection, and Insertion sort algorithms against each other in real-time.',
    totalLevels: 5,
    xpReward: 250,
  },
  {
    id: 'fix-algorithm',
    title: 'Fix the Algorithm',
    subtitle: 'Bug Hunting • Logic Correction',
    description: 'Identify subtle bugs in broken sorting algorithms and correct comparison operators.',
    totalLevels: 5,
    xpReward: 250,
  },
];

interface ProgressViewProps {
  progress: UserProgress;
  onResetProgress: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  progress,
  onResetProgress,
}) => {
  const nextLevelXP = progress.level * 250;
  const currentBaseXP = (progress.level - 1) * 250;
  const xpInLevel = progress.xp - currentBaseXP;
  const xpPercent = Math.min(100, Math.max(0, Math.round((xpInLevel / 250) * 100)));

  const completedGamesCount = FIVE_GAME_CARDS.filter(
    (c) =>
      (progress.sortGameProgress?.[c.id]?.length || 0) >= c.totalLevels ||
      progress.gameStats?.[c.id]?.status === 'Completed'
  ).length;

  const totalModules = THEORY_LESSONS.length + FIVE_GAME_CARDS.length + 1;
  const completedModules =
    (progress.completedTheoryChapters?.length || 0) + completedGamesCount + (progress.quizCompleted ? 1 : 0);
  const overallPercentage = Math.min(100, Math.round((completedModules / totalModules) * 100));

  const getAchievementIcon = (name: string) => {
    switch (name) {
      case 'ArrowDownToLine': return <ArrowDownToLine className="w-5 h-5" />;
      case 'Layers': return <Layers className="w-5 h-5" />;
      case 'AlertTriangle': return <AlertTriangle className="w-5 h-5" />;
      case 'Zap': return <Zap className="w-5 h-5" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5" />;
      case 'FlaskConical': return <FlaskConical className="w-5 h-5" />;
      case 'Award': return <Award className="w-5 h-5" />;
      case 'Flame': return <Flame className="w-5 h-5" />;
      default: return <Award className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-xs">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">
              Learning Analytics & EXP Telemetry
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track your mastery rank, achievements, learning streak, and activity milestones.
          </p>
        </div>

        <button
          onClick={() => {
            soundEffects.playClick();
            onResetProgress();
          }}
          title="Total Reset"
          aria-label="Total Reset"
          className="p-2.5 bg-slate-100 hover:bg-red-50 hover:text-red-700 dark:bg-slate-800 dark:hover:bg-red-950/50 dark:hover:text-red-400 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center cursor-pointer shadow-2xs active:scale-95 shrink-0"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Main Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Completion */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Overall Progress</span>
            <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{overallPercentage}%</span>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">{completedModules}/{totalModules} Modules</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600" style={{ width: `${overallPercentage}%` }} />
          </div>
        </div>

        {/* Level */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Mastery Level</span>
            <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">L{progress.level}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Sorting Master</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600" style={{ width: `${xpPercent}%` }} />
          </div>
        </div>

        {/* Total XP */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total EXP</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{progress.xp}</span>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-bold">XP</span>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2">
            {250 - xpInLevel} XP until Level {progress.level + 1}
          </p>
        </div>

        {/* Daily Streak */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Daily Streak</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{progress.streakDays}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Days Active</span>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2">
            Keep practicing daily to grow your streak!
          </p>
        </div>
      </div>

      {/* Achievement Badges Section - Refactored to match Game Card Style */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Achievement Badges & Milestones
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Unlock badges by mastering sorting operations, challenges, and quizzes.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {FIVE_GAME_CARDS.map((card) => {
            const stats = progress?.gameStats?.[card.id];
            const completedList = Array.isArray(progress?.sortGameProgress?.[card.id])
              ? progress.sortGameProgress[card.id]
              : [];
            const completedCount = completedList.length;

            const isCompleted = stats?.status === 'Completed' || completedCount >= card.totalLevels;
            const status: GameStatus = isCompleted
              ? 'Completed'
              : stats?.status === 'In Progress' || completedCount > 0 || (stats?.timesPlayed || 0) > 0
              ? 'In Progress'
              : 'Not Started';

            const completionPercentage = isCompleted
              ? 100
              : typeof stats?.completionPercentage === 'number' && stats.completionPercentage > 0
              ? stats.completionPercentage
              : Math.min(100, Math.round((completedCount / card.totalLevels) * 100));

            const highestScore =
              typeof stats?.highestScore === 'number' && stats.highestScore > 0
                ? stats.highestScore
                : completedCount * 50;

            const timesPlayed =
              typeof stats?.timesPlayed === 'number'
                ? stats.timesPlayed
                : completedCount > 0
                ? completedCount
                : 0;

            const bestPerformance =
              stats?.bestPerformance &&
              stats.bestPerformance !== 'None' &&
              stats.bestPerformance !== 'No attempts yet'
                ? stats.bestPerformance
                : isCompleted
                ? `100% Mastered • High Score: ${highestScore} pts`
                : completedCount > 0
                ? `${completedCount}/5 Levels Cleared`
                : 'No attempts yet';

            const lastPlayedTime =
              stats?.lastPlayedTime && stats.lastPlayedTime !== 'Not played yet'
                ? stats.lastPlayedTime
                : 'Not played yet';

            return (
              <motion.div
                key={card.id}
                whileHover={{ y: -3, transition: { duration: 0.18 } }}
                className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-600/80 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Row: Status Badge & Highest Score / XP */}
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border transition-colors ${
                        status === 'Completed'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                          : status === 'In Progress'
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200/60 dark:border-slate-700/60'
                      }`}
                    >
                      <CheckCircle2
                        className={`w-3 h-3 ${
                          status === 'Completed'
                            ? 'text-emerald-500'
                            : status === 'In Progress'
                            ? 'text-amber-500'
                            : 'text-slate-400'
                        }`}
                      />
                      <span>{status}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300">
                        Score: <span className="text-indigo-600 dark:text-indigo-400">{highestScore}</span>
                      </span>
                      <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/80 px-2 py-0.5 rounded-md border border-indigo-100 dark:border-indigo-900/50">
                        +{card.xpReward} XP
                      </span>
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {card.title}
                    </h3>
                    <div className="text-[11px] font-bold tracking-wide text-indigo-600 dark:text-indigo-400 mt-0.5">
                      {card.subtitle}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    "{card.description}"
                  </p>

                  {/* Telemetry Metrics: Times Played, Best Performance, Last Played */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-1 text-[11px]">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Times Played:</span>
                      <span className="font-semibold font-mono text-slate-800 dark:text-slate-200">
                        {timesPlayed} {timesPlayed === 1 ? 'time' : 'times'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Best Performance:</span>
                      <span
                        className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[170px]"
                        title={bestPerformance}
                      >
                        {bestPerformance}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Last Played:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300 text-[10px] truncate max-w-[170px]">
                        {lastPlayedTime}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Progress Bar + Status */}
                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                      <span>Completion</span>
                      <span
                        className={`font-mono font-bold ${
                          status === 'Completed'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {completionPercentage}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          status === 'Completed'
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600'
                        }`}
                        style={{ width: `${completionPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-0.5">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {status === 'Completed'
                        ? 'Completed'
                        : status === 'In Progress'
                        ? `In Progress (${completedCount}/5 Levels)`
                        : 'Not Started'}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                        status === 'Completed'
                          ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white'
                          : status === 'In Progress'
                          ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {status === 'Completed' ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : status === 'In Progress' ? (
                        <Play className="w-3 h-3 fill-current" />
                      ) : (
                        <Lock className="w-3.5 h-3.5" />
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Historical Milestones Log */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Learning Event Timeline
        </h2>

        <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
          {(progress.history || []).map((event, idx) => {
            let displayTitle = event?.title || '';
            let displayDesc = event?.description || '';
            if (/whatsapp\s*video(\s*2026-09-06)?/i.test(displayTitle)) {
              displayTitle = 'Sorting Algorithm Video';
            }
            if (/whatsapp\s*video(\s*2026-09-06)?/i.test(displayDesc)) {
              displayDesc = displayDesc.replace(/whatsapp\s*video(\s*2026-09-06)?/gi, 'Sorting Video');
            }
            return (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs flex items-start justify-between gap-3"
              >
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                    {displayTitle}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">
                    {displayDesc}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block font-mono">
                    {event.timestamp}
                  </span>
                </div>

                {event.xpEarned > 0 && (
                  <span className="shrink-0 text-xs font-bold px-2 py-1 bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 rounded-lg">
                    +{event.xpEarned} XP
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
