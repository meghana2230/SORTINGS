export interface GameMetaData {
  id: number;
  levelNumber: number;
  title: string;
  shortTitle: string;
  subtitle: string;
  tagline: string;
  description: string;
  detailedObjective: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  xpReward: number;
  skills: string[];
  interactionType: string;
  hintAvailability: string;
  iconName: 'pop' | 'push' | 'build' | 'predict' | 'debug' | 'speed';
  howToPlay: {
    stepNumber: number;
    title: string;
    description: string;
  }[];
  previewData: {
    stackItems?: (number | string)[];
    targetStack?: (number | string)[];
    operationsTrace?: string[];
    debugStep?: { text: string; isError: boolean };
    topPointer?: number;
    popZoneLabel?: string;
  };
}

export const GAME_CATALOG: GameMetaData[] = [
  {
    id: 1,
    levelNumber: 1,
    title: 'POP MASTER',
    shortTitle: 'Pop Master',
    subtitle: 'LIFO Removal & Top Pointer Mastery',
    tagline: 'Master the core rule of LIFO: Only the TOP element can be removed.',
    description: 'Identify the TOP element and drag it into the POP Zone.',
    detailedObjective:
      'Learn how the TOP pointer dictates stack accessibility. Understand why buried elements cannot be accessed without first popping overhead elements.',
    difficulty: 'Beginner',
    duration: '2–3 min',
    xpReward: 50,
    skills: ['LIFO Principle', 'TOP Pointer', 'POP Operation', 'Stack Underflow Safety'],
    interactionType: 'Drag-and-drop to POP Zone',
    hintAvailability: '3-stage guided hints available',
    iconName: 'pop',
    howToPlay: [
      {
        stepNumber: 1,
        title: 'Read the Challenge',
        description: 'Review the current objective and target element specified in the prompt.',
      },
      {
        stepNumber: 2,
        title: 'Inspect the Stack',
        description: 'Locate the top of the stack indicated by the TOP pointer arrow.',
      },
      {
        stepNumber: 3,
        title: 'Drag to POP Zone',
        description: 'Click and drag the topmost item directly into the designated POP Zone.',
      },
      {
        stepNumber: 4,
        title: 'Verify LIFO Feedback',
        description: 'Observe the step-by-step algorithmic feedback and earn instant XP rewards.',
      },
    ],
    previewData: {
      stackItems: [20, 30, 40, 50],
      topPointer: 50,
      popZoneLabel: 'POP ZONE (DROP HERE)',
    },
  },
  {
    id: 2,
    levelNumber: 2,
    title: 'PUSH MASTER',
    shortTitle: 'Push Master',
    subtitle: 'Sequential Insertion & Top Placement',
    tagline: 'Learn how elements are pushed onto the top and how capacity limits operate.',
    description: 'Drag the correct value into the TOP of the Stack and build it step by step.',
    detailedObjective:
      'Practice top-placement mechanics. Select the requested element from the Available Elements palette and push it onto the top of the stack.',
    difficulty: 'Beginner',
    duration: '2–3 min',
    xpReward: 50,
    skills: ['PUSH Operation', 'Top Pointer Shifting', 'Stack Capacity Limits', 'Stack Overflow Safety'],
    interactionType: 'Palette selection & Push drop',
    hintAvailability: '3-stage guided hints available',
    iconName: 'push',
    howToPlay: [
      {
        stepNumber: 1,
        title: 'Check Requested Value',
        description: 'Examine the instruction for the specific value to push onto the stack.',
      },
      {
        stepNumber: 2,
        title: 'Select From Palette',
        description: 'Locate the requested value card from the Available Elements palette.',
      },
      {
        stepNumber: 3,
        title: 'Push to TOP',
        description: 'Click or drag the value into the PUSH ZONE directly above the active stack.',
      },
      {
        stepNumber: 4,
        title: 'Monitor Capacity',
        description: 'Observe the updated TOP pointer and ensure stack capacity boundaries are respected.',
      },
    ],
    previewData: {
      stackItems: [10, 20],
      topPointer: 20,
      popZoneLabel: 'PUSH TO TOP ZONE',
    },
  },
  {
    id: 3,
    levelNumber: 3,
    title: 'BUILD THE STACK',
    shortTitle: 'Build the Stack',
    subtitle: 'Construct Exact Target Stack Orders',
    tagline: 'Arrange scrambled numbers in the correct sequence to build the Target Stack.',
    description: 'Arrange scrambled values in the correct order using the LIFO principle.',
    detailedObjective:
      'Understand bottom-up construction. Determine which element must be pushed first (the base) so that the final top matches the target structure.',
    difficulty: 'Intermediate',
    duration: '3–5 min',
    xpReward: 75,
    skills: ['Bottom-Up Assembly', 'Target Matching', 'Sequence Inversion', 'Algorithmic Order'],
    interactionType: 'Sequential element ordering',
    hintAvailability: '3-stage guided hints available',
    iconName: 'build',
    howToPlay: [
      {
        stepNumber: 1,
        title: 'Analyze Target Structure',
        description: 'Examine the Target Stack diagram showing the required bottom-to-top order.',
      },
      {
        stepNumber: 2,
        title: 'Determine Base Element',
        description: 'Identify the element that must sit at the very bottom and push it first.',
      },
      {
        stepNumber: 3,
        title: 'Push Remaining Items',
        description: 'Push subsequent elements in precise ascending sequence towards the top.',
      },
      {
        stepNumber: 4,
        title: 'Validate Assembly',
        description: 'Match the full stack structure against the target to complete the round.',
      },
    ],
    previewData: {
      stackItems: [10, 20],
      targetStack: [10, 20, 30, 40],
      topPointer: 20,
    },
  },
  {
    id: 4,
    levelNumber: 4,
    title: 'PREDICT THE STACK',
    shortTitle: 'Predict the Stack',
    subtitle: 'Trace Operations & Reconstruct Final State',
    tagline: 'Mentally trace sequential Push & Pop operations and reconstruct the final stack.',
    description: 'Follow a sequence of Stack operations and predict the final Stack state.',
    detailedObjective:
      'Strengthen mental trace modeling. Given code sequences with interleaved Push and Pop calls, trace the transient elements and assemble the surviving stack state.',
    difficulty: 'Intermediate',
    duration: '3–5 min',
    xpReward: 75,
    skills: ['Code Tracing', 'Mental Simulation', 'Transient Element Tracking', 'State Reconstruction'],
    interactionType: 'Code trace analysis & build',
    hintAvailability: '3-stage guided hints available',
    iconName: 'predict',
    howToPlay: [
      {
        stepNumber: 1,
        title: 'Read Code Execution Trace',
        description: 'Study the sequential instructions: Push(10), Push(20), Pop(), Push(30)...',
      },
      {
        stepNumber: 2,
        title: 'Track Internal State',
        description: 'Mentally maintain the stack contents after each push and pop line.',
      },
      {
        stepNumber: 3,
        title: 'Assemble Final Stack',
        description: 'Drag the remaining surviving elements into the stack in correct LIFO order.',
      },
      {
        stepNumber: 4,
        title: 'Submit Prediction',
        description: 'Verify your mental model against the compiler output.',
      },
    ],
    previewData: {
      operationsTrace: [
        'Push(10)',
        'Push(20)',
        'Pop()',
        'Push(30)',
      ],
      stackItems: [10, 30],
      topPointer: 30,
    },
  },
  {
    id: 5,
    levelNumber: 5,
    title: 'DEBUG THE STACK',
    shortTitle: 'Debug the Stack',
    subtitle: 'Detect Illegal Underflow & Boundary Violations',
    tagline: 'Analyze faulty program execution traces and identify fatal runtime violations.',
    description: 'Find invalid Stack operations and identify errors such as Overflow and Underflow.',
    detailedObjective:
      'Diagnose critical runtime violations including Stack Underflow (popping an empty stack), Stack Overflow (exceeding fixed capacity), and illegal random-index accesses.',
    difficulty: 'Advanced',
    duration: '4–6 min',
    xpReward: 100,
    skills: ['Stack Underflow', 'Stack Overflow', 'Single-Ended Invariant', 'Defensive Programming'],
    interactionType: 'Interactive line selection & diagnosis',
    hintAvailability: '3-stage guided hints available',
    iconName: 'debug',
    howToPlay: [
      {
        stepNumber: 1,
        title: 'Examine Program Trace',
        description: 'Review the numbered sequence of code lines and track active stack size.',
      },
      {
        stepNumber: 2,
        title: 'Spot Invariant Violation',
        description: 'Look for illegal operations like Pop() on empty stack or exceeding capacity.',
      },
      {
        stepNumber: 3,
        title: 'Select Faulty Line',
        description: 'Click or drag the buggy instruction directly into the Debug Analysis Zone.',
      },
      {
        stepNumber: 4,
        title: 'Learn Exception Invariants',
        description: 'Review the technical explanation of why the line crashes in production.',
      },
    ],
    previewData: {
      debugStep: {
        text: '5. Pop() // ⚠️ CRASH: Cannot pop when stack size is 0 (Underflow)',
        isError: true,
      },
    },
  },
  {
    id: 6,
    levelNumber: 6,
    title: 'SPEED STACK',
    shortTitle: 'Speed Stack',
    subtitle: 'Rapid-fire LIFO Mastery against the Clock',
    tagline: 'Execute rapid-fire Push and Pop commands before time runs out to earn combo multipliers.',
    description: 'Complete Stack operations accurately before the timer runs out.',
    detailedObjective:
      'Test your automatic intuition. Under time pressure, process rapid Push and Pop directives while maintaining accuracy to achieve the maximum 3x combo multiplier.',
    difficulty: 'Advanced',
    duration: '1–2 min',
    xpReward: 100,
    skills: ['Rapid LIFO Reflexes', 'High-Speed Push/Pop', 'Streak Multipliers', 'Zero-Latency Decisions'],
    interactionType: 'Rapid-fire timed action prompts',
    hintAvailability: '3-stage guided hints available',
    iconName: 'speed',
    howToPlay: [
      {
        stepNumber: 1,
        title: 'Start Timer (45s)',
        description: 'Press Start when ready to commence the high-speed challenge.',
      },
      {
        stepNumber: 2,
        title: 'Read Active Prompt',
        description: 'Instantly read the flashing banner directive (e.g. PUSH [40] or POP TOP).',
      },
      {
        stepNumber: 3,
        title: 'Execute Instantly',
        description: 'Perform the action immediately to preserve your streak multiplier.',
      },
      {
        stepNumber: 4,
        title: 'Maximize Score',
        description: 'Reach a 3x combo streak and complete all prompts before the buzzer sounds.',
      },
    ],
    previewData: {
      stackItems: [10, 20, 30],
      topPointer: 30,
    },
  },
];
