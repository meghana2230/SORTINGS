export type TabType = 'home' | 'theory' | 'lab' | 'game' | 'quiz' | 'progress';

export interface StackItem {
  id: string;
  value: number | string;
  color?: string;
  isTop?: boolean;
  addedAt: number;
}

export type OperationType =
  | 'PUSH'
  | 'POP'
  | 'PEEK'
  | 'ISEMPTY'
  | 'ISFULL'
  | 'CLEAR'
  | 'SWAP'
  | 'DUP'
  | 'REVERSE'
  | 'SORT'
  | 'SEARCH'
  | 'ROTATE'
  | 'RESIZE'
  | 'BATCH_PUSH';

export interface OperationLog {
  id: string;
  operation: OperationType;
  value?: number | string;
  success: boolean;
  message: string;
  timestamp: Date;
  stackSnapshot: (number | string)[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: string;
  category: 'beginner' | 'mastery' | 'speed' | 'quiz';
}

export type GameStatus = 'Not Started' | 'In Progress' | 'Completed';

export interface GameStats {
  status: GameStatus;
  highestScore: number;
  timesPlayed: number;
  completionPercentage: number;
  bestPerformance: string;
  lastPlayedTime: string;
}

export interface UserProgress {
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string;
  completedGameLevels: number[];
  completedTheoryChapters: number[];
  quizCompleted: boolean;
  quizHighScore: number;
  quizTotalQuestionsAnswered: number;
  quizCompletedQuestions?: number[];
  totalPushes: number;
  totalPops: number;
  achievements: string[]; // achievement ids
  awardedEventKeys: string[]; // prevents duplicate XP rewards
  sortGameProgress?: Record<string, number[]>; // gameId -> completed level numbers
  gameStats?: Record<string, GameStats>; // gameId -> game stats
  completedLabs?: number[];
  history: {
    title: string;
    description: string;
    xpEarned: number;
    timestamp: string;
  }[];
}

export type TheoryCategoryKey = '01' | '02' | '03' | '04' | '05';

export interface TheoryLesson {
  id: number;
  chapterNumber?: string;
  categoryLabel?: string;
  categoryId?: string;
  categoryTitle?: string;
  lessonNumber?: number;
  title: string;
  shortDesc: string;
  readTime: string;
  executiveDefinition?: string;
  content: string;
  analogy?: {
    title: string;
    description: string;
    diagram?: string;
  };
  example?: {
    title: string;
    description: string;
    steps?: string[];
  };
  criticalSpecifications?: string[];
  visualDiagram?: {
    type: 'stack-ascii' | 'lifo-sequence' | 'before-after' | 'array-table' | 'linked-list' | 'brackets' | 'callstack' | 'maze' | 'browser' | 'comparison';
    beforeState?: (string | number)[];
    afterState?: (string | number)[];
    operationLabel?: string;
    notes?: string;
    diagramText?: string;
  };
  algorithmSteps?: string[];
  pseudocode?: string;
  codeSnippet?: {
    c?: string;
    cpp?: string;
    java?: string;
    python?: string;
  };
  timeComplexity?: string;
  spaceComplexity?: string;
  keyTakeaway?: string;
  summaryCards?: {
    title: string;
    description: string;
    badge?: string;
  }[];
  interactiveDemoType?:
    | 'lifo'
    | 'push-pop-sandbox'
    | 'top-pointer'
    | 'mini-operations'
    | 'algorithm-flowchart'
    | 'overflow-underflow'
    | 'array-stack'
    | 'linkedlist-stack'
    | 'complexity-table'
    | 'problem-solving'
    | 'real-world'
    | 'quick-summary'
    | 'array-vs-list'
    | 'brackets'
    | 'expression-converter'
    | 'callstack'
    | 'browser-history'
    | 'undo-redo'
    | 'practice-problems';
  practiceQuestions?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

// Backwards compatibility alias
export type TheoryChapter = TheoryLesson;

export interface TheoryCategoryMeta {
  id: TheoryCategoryKey;
  number: string;
  title: string;
  shortTitle: string;
  description: string;
  iconName: string;
  badge: string;
  lessons: TheoryLesson[];
}

export interface GameChallenge {
  id: string;
  challengeNumber: number;
  totalChallengesInLevel: number;
  mode: 'pop' | 'push' | 'build' | 'predict' | 'debug' | 'speed';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  question: string;
  instruction: string;
  initialStack: number[];
  availableElements?: number[];
  targetStack?: number[];
  targetValue?: number;
  capacity?: number;
  operationsTrace?: string[];
  debugSteps?: { id: string; text: string; isFaulty: boolean; errorType?: string; explanation: string }[];
  hint: {
    title: string;
    thoughtPrompt: string;
    clue: string;
  };
  guide: {
    ruleTitle: string;
    ruleDescription: string;
    example: string;
  };
  guidedSolve: {
    stepExplanation: string;
    sourceValue?: number;
    sourceType?: 'top' | 'available' | 'debug-step';
    targetZone: 'pop-zone' | 'push-zone' | 'debug-zone';
    visualPathText: string;
  };
  feedback: {
    correctTitle: string;
    correctActionText: string;
    lifoReason: string;
    incorrectTip: string;
  };
  xpReward: number;
}

export interface GuidedSolveStep {
  stepNumber: number;
  totalSteps?: number;
  title: string;
  subtitle?: string;
  conceptBadge?: string;
  stackState: {
    items: (number | string)[];
    capacity: number;
    topIndex?: number;
    highlightTop?: boolean;
    highlightItem?: number | string;
    warningState?: 'overflow' | 'underflow' | null;
  };
  explanation: string;
  questionPrompt?: string;
  interactionType:
    | 'info-next'
    | 'click-push'
    | 'select-choice'
    | 'click-pop'
    | 'click-peek'
    | 'click-display'
    | 'yes-no'
    | 'underflow-action'
    | 'overflow-action';
  pushValue?: number | string;
  choices?: { id: string; label: string; isCorrect: boolean; feedback: string }[];
  correctChoiceId?: string;
  displayOutput?: (number | string)[];
  hints: string[];
  correctFeedback: {
    title: string;
    explanation: string;
    actionResult?: string;
  };
  incorrectFeedback?: {
    title: string;
    explanation: string;
  };
  postActionStack?: (number | string)[];
}

export interface GameLevelConfig {
  id: number;
  levelNumber: number;
  title: string;
  subtitle: string;
  type:
    | 'lifo'
    | 'push'
    | 'pop'
    | 'peek'
    | 'status'
    | 'overflow'
    | 'underflow'
    | 'display'
    | 'sequence'
    | 'build'
    | 'predict'
    | 'debug'
    | 'speed'
    | 'master';
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  xpReward: number;
  stars: number;
  hints: [string, string, string]; // 1: Concept, 2: Direction, 3: Strong
  guidedSteps?: GuidedSolveStep[];
  challenges: GameChallenge[];
}

export interface QuizQuestion {
  id: number;
  type: 'multiple-choice' | 'predict-output' | 'true-false' | 'scenario' | 'drag-order';
  question: string;
  codeSnippet?: string;
  options?: string[];
  correctAnswer: string | string[]; // string for MCQ/TF, array for drag-order
  explanation: string;
  hints: [string, string, string];
}

// ─── SORT MASTER GAME TYPES ───
export type SortGameId =
  | 'bubble-sort'
  | 'selection-sort'
  | 'insertion-sort'
  | 'sorting-battle'
  | 'fix-algorithm';

export interface SortCardObject {
  id: string; // Unique card identifier (e.g., 'card-7-0')
  value: number;
  position: number;
  isSorted?: boolean;
  isHighlighted?: boolean;
  isMinimum?: boolean;
  isCurrent?: boolean;
  isShifting?: boolean;
}

export interface SortLevelConfig {
  levelNumber: number;
  title: string;
  label: 'LEARN' | 'PRACTICE' | 'CHALLENGE' | 'MASTER' | 'SPEED BOSS';
  description: string;
  initialArray: number[];
  hints: [string, string, string];
  xpReward: number;
  whatYouLearned: string;
}

export interface SortGameMeta {
  id: SortGameId;
  title: string;
  subtitle: string;
  description: string;
  iconName: 'bubble' | 'selection' | 'insertion' | 'battle' | 'fix';
  totalLevels: number;
  accentGradient: string;
  levels: SortLevelConfig[];
}
