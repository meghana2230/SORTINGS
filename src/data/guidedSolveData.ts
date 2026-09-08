import { GuidedSolveStep } from '../types';

/**
 * =========================================================================
 * MASTER GUIDED SOLVE CURRICULUM (10 CORE DSA STEPS)
 * =========================================================================
 * Directly implements the 10 pedagogical stages specified in the specification:
 * 1. What is a Stack? (Linear Data Structure, LIFO, Last In First Out)
 * 2. Understand TOP (TOP Pointer & Indexing)
 * 3. Guided PUSH (Adding to Top & Incrementing Pointer)
 * 4. Guided POP (Removing from Top & LIFO Order)
 * 5. Guided PEEK (Inspecting Top without Removal)
 * 6. Guided isEmpty (Empty Stack Check, TOP = -1)
 * 7. Guided isFull (Full Stack Check, TOP = capacity - 1)
 * 8. Guided OVERFLOW (Handling Push on Full Stack)
 * 9. Guided UNDERFLOW (Handling Pop on Empty Stack)
 * 10. Guided DISPLAY (Traversing Elements from TOP down to 0)
 */
export const MASTER_GUIDED_STEPS: GuidedSolveStep[] = [
  // ─── STEP 1: WHAT IS A STACK? ───
  {
    stepNumber: 1,
    totalSteps: 10,
    title: 'WHAT IS A STACK?',
    subtitle: 'Linear Data Structure & LIFO Principle',
    conceptBadge: 'LIFO • LINEAR DATA STRUCTURE',
    stackState: {
      items: [10, 20, 30],
      capacity: 5,
      topIndex: 2,
      highlightTop: true,
      highlightItem: 30,
    },
    explanation:
      'A Stack is a LINEAR DATA STRUCTURE that follows LIFO (Last In, First Out). The last element placed on the stack is always the very first element to be removed.',
    questionPrompt: 'Observe the three numbers added in order (10 → 20 → 30). Where does 30 sit?',
    interactionType: 'info-next',
    hints: [
      'Look at the TOP of the rectangular stack.',
      'Remember: Stack strictly follows LIFO (Last In, First Out).',
      'The last element pushed (30) sits at the TOP and is first in line to be removed.',
    ],
    correctFeedback: {
      title: '✓ Core Principle Mastered',
      explanation: '30 is at the TOP. The last element added is always the first element removed.',
      actionResult: 'LIFO: 10 was pushed 1st (Bottom), 20 was pushed 2nd, 30 was pushed 3rd (Top).',
    },
  },

  // ─── STEP 2: UNDERSTAND TOP ───
  {
    stepNumber: 2,
    totalSteps: 10,
    title: 'UNDERSTAND THE TOP POINTER',
    subtitle: 'Tracking the Active Head of the Stack',
    conceptBadge: 'TOP POINTER (TOP = 2)',
    stackState: {
      items: [10, 20, 30],
      capacity: 5,
      topIndex: 2,
      highlightTop: true,
      highlightItem: 30,
    },
    explanation:
      'The TOP pointer references the index of the uppermost element. In a 0-indexed array, with 3 items at index 0, 1, and 2, TOP = 2 points directly to 30.',
    questionPrompt: 'What does the TOP pointer tell us?',
    interactionType: 'select-choice',
    choices: [
      {
        id: 'choice-top-meaning',
        label: 'TOP tells us the position of the element currently at the top of the stack.',
        isCorrect: true,
        feedback: 'Correct! TOP always references the current active uppermost element.',
      },
      {
        id: 'choice-random',
        label: 'TOP allows us to grab any random item from the middle or bottom.',
        isCorrect: false,
        feedback: 'Not quite. Stacks do not allow random access. Only the TOP element can be accessed!',
      },
      {
        id: 'choice-bottom',
        label: 'TOP points to the bottom-most element (index 0).',
        isCorrect: false,
        feedback: 'Not quite. TOP always points to the uppermost occupied slot, not the bottom.',
      },
    ],
    hints: [
      'Look at the pointer arrow labeled TOP at the top cell.',
      'In array terms: top index = total elements - 1.',
      'All insertions and removals occur strictly at TOP.',
    ],
    correctFeedback: {
      title: '✓ TOP Pointer Identified',
      explanation: 'TOP = 2 points to [30]. Whenever an element is pushed or popped, TOP moves accordingly.',
      actionResult: 'TOP = 2 (points to value 30 at index 2).',
    },
  },

  // ─── STEP 3: GUIDED PUSH ───
  {
    stepNumber: 3,
    totalSteps: 10,
    title: 'GUIDED PUSH OPERATION',
    subtitle: 'Inserting an Element onto the Top',
    conceptBadge: 'PUSH(40) OPERATION',
    stackState: {
      items: [10, 20, 30],
      capacity: 5,
      topIndex: 2,
      highlightTop: true,
    },
    explanation:
      'PUSH adds an element to the TOP of the stack. First, TOP increments (TOP = TOP + 1), and then the new value is stored at stack[TOP].',
    questionPrompt: 'Push 40 onto the stack. Click [ PUSH 40 ] to perform the operation.',
    interactionType: 'click-push',
    pushValue: 40,
    postActionStack: [10, 20, 30, 40],
    hints: [
      'Click the [ PUSH 40 ] button below to insert 40.',
      'Watch how 40 enters from above and lands directly on top of 30.',
      'Notice that TOP updates from index 2 to index 3.',
    ],
    correctFeedback: {
      title: '✓ CORRECT: 40 Pushed Successfully!',
      explanation: '40 was placed on top of 30. TOP is now incremented to index 3 (value 40).',
      actionResult: 'Stack is now [10, 20, 30, 40]. TOP = 3.',
    },
  },

  // ─── STEP 4: GUIDED POP ───
  {
    stepNumber: 4,
    totalSteps: 10,
    title: 'GUIDED POP OPERATION',
    subtitle: 'Removing the Topmost Element (LIFO)',
    conceptBadge: 'POP() OPERATION',
    stackState: {
      items: [20, 30, 40],
      capacity: 5,
      topIndex: 2,
      highlightTop: true,
      highlightItem: 40,
    },
    explanation:
      'POP removes the element currently at the TOP of the stack. Because stacks follow LIFO, only the top element can be removed.',
    questionPrompt: 'Which element will POP from the stack?',
    interactionType: 'select-choice',
    choices: [
      {
        id: 'pop-40',
        label: '40 (The Top Element)',
        isCorrect: true,
        feedback: 'Correct! POP always removes the element currently at TOP.',
      },
      {
        id: 'pop-30',
        label: '30 (The Middle Element)',
        isCorrect: false,
        feedback: 'Not quite. POP always removes the element currently at TOP. 30 is buried below 40!',
      },
      {
        id: 'pop-20',
        label: '20 (The Bottom Element)',
        isCorrect: false,
        feedback: 'Not quite. The bottom element cannot be popped while elements sit above it.',
      },
    ],
    postActionStack: [20, 30],
    hints: [
      'Look at the TOP of the stack.',
      'Remember: Stack follows LIFO (Last In, First Out).',
      '40 was the last item placed on top, so 40 is the first to be popped.',
    ],
    correctFeedback: {
      title: '✓ CORRECT! 40 Popped from TOP',
      explanation: '40 has been removed. TOP shifts down to index 1 (value 30).',
      actionResult: 'Stack becomes [20, 30]. TOP = 1 (points to 30).',
    },
  },

  // ─── STEP 5: GUIDED PEEK ───
  {
    stepNumber: 5,
    totalSteps: 10,
    title: 'GUIDED PEEK OPERATION',
    subtitle: 'Inspecting TOP Without Modifying the Stack',
    conceptBadge: 'PEEK() / TOP()',
    stackState: {
      items: [10, 20, 30],
      capacity: 5,
      topIndex: 2,
      highlightTop: true,
      highlightItem: 30,
    },
    explanation:
      'PEEK (also called top) returns the value of the TOP element WITHOUT removing it. The stack contents and size remain completely unchanged.',
    questionPrompt: 'What is the TOP element returned by PEEK()?',
    interactionType: 'select-choice',
    choices: [
      {
        id: 'peek-30',
        label: '30 (Returns 30 and keeps 30 in the stack)',
        isCorrect: true,
        feedback: 'Correct! PEEK reads value 30 without popping it.',
      },
      {
        id: 'peek-10',
        label: '10 (The bottom element)',
        isCorrect: false,
        feedback: 'Not quite. PEEK inspects the TOP element, not the bottom.',
      },
      {
        id: 'peek-remove',
        label: '30 (And deletes it from the stack)',
        isCorrect: false,
        feedback: 'Not quite! PEEK is non-destructive. Only POP removes elements.',
      },
    ],
    postActionStack: [10, 20, 30],
    hints: [
      'PEEK simply looks at the topmost cell.',
      'The value at index 2 (TOP) is 30.',
      'Unlike POP, PEEK does NOT alter the stack size or contents.',
    ],
    correctFeedback: {
      title: '✓ CORRECT! PEEK Returned 30',
      explanation: 'PEEK returns 30 without removing it. The stack still holds [10, 20, 30].',
      actionResult: 'Peek() = 30. Stack size remains 3.',
    },
  },

  // ─── STEP 6: GUIDED isEmpty ───
  {
    stepNumber: 6,
    totalSteps: 10,
    title: 'GUIDED isEmpty CHECK',
    subtitle: 'Detecting an Empty Stack State',
    conceptBadge: 'isEmpty = true (TOP = -1)',
    stackState: {
      items: [],
      capacity: 5,
      topIndex: -1,
      highlightTop: true,
    },
    explanation:
      'isEmpty checks whether the stack contains zero elements. In array-based stacks, an empty stack is represented by TOP = -1.',
    questionPrompt: 'The stack contains no elements (TOP = -1). Is the stack empty?',
    interactionType: 'yes-no',
    correctChoiceId: 'yes',
    hints: [
      'Look at the stack container: there are 0 elements inside.',
      'When count is 0 and TOP is -1, isEmpty evaluates to true.',
      'Select [ YES ] to confirm the stack is empty.',
    ],
    correctFeedback: {
      title: '✓ CORRECT! isEmpty is TRUE',
      explanation: 'The stack contains no elements, so isEmpty evaluates to true (TOP == -1).',
      actionResult: 'isEmpty() returns true. Stack size is 0.',
    },
  },

  // ─── STEP 7: GUIDED isFull ───
  {
    stepNumber: 7,
    totalSteps: 10,
    title: 'GUIDED isFull CHECK',
    subtitle: 'Checking Fixed Capacity Boundaries',
    conceptBadge: 'isFull = true (TOP = capacity - 1)',
    stackState: {
      items: [10, 20, 30, 40, 50],
      capacity: 5,
      topIndex: 4,
      highlightTop: true,
      highlightItem: 50,
    },
    explanation:
      'In fixed-size stacks, isFull checks whether all allocated slots are occupied. When TOP reaches capacity - 1 (e.g., 5 - 1 = 4), isFull is true.',
    questionPrompt: 'Capacity is 5 and all 5 slots [10, 20, 30, 40, 50] are filled. Is the stack full?',
    interactionType: 'yes-no',
    correctChoiceId: 'yes',
    hints: [
      'Count the elements: exactly 5 out of 5 slots are occupied.',
      'In code: TOP == capacity - 1 (4 == 5 - 1).',
      'Select [ YES ] because the stack has reached maximum capacity.',
    ],
    correctFeedback: {
      title: '✓ CORRECT! isFull is TRUE',
      explanation: 'All five positions are occupied (5/5). The stack cannot accept additional items without overflowing.',
      actionResult: 'isFull() returns true. Stack size equals capacity (5).',
    },
  },

  // ─── STEP 8: GUIDED OVERFLOW ───
  {
    stepNumber: 8,
    totalSteps: 10,
    title: 'GUIDED STACK OVERFLOW',
    subtitle: 'Handling Push on a Full Stack',
    conceptBadge: 'OVERFLOW EXCEPTION',
    stackState: {
      items: [10, 20, 30, 40, 50],
      capacity: 5,
      topIndex: 4,
      highlightTop: true,
      warningState: 'overflow',
    },
    explanation:
      'Stack Overflow occurs when a program attempts to PUSH an element into a stack that is already full. The operation is rejected and the stack remains unchanged.',
    questionPrompt: 'What happens if we try to PUSH 60 when the stack is already full?',
    interactionType: 'overflow-action',
    pushValue: 60,
    postActionStack: [10, 20, 30, 40, 50],
    hints: [
      'The stack capacity is 5 and 5 items are already inside.',
      'A fixed array cannot expand beyond its bound without overflow.',
      'Click [ ATTEMPT PUSH 60 ] to see how the system prevents overflow.',
    ],
    correctFeedback: {
      title: '✓ STACK OVERFLOW PREVENTED',
      explanation:
        'The stack is already full (size 5/5). PUSH 60 was rejected to prevent memory corruption. The stack remains [10, 20, 30, 40, 50].',
      actionResult: 'PUSH 60 → ⚠️ STACK OVERFLOW (Operation Aborted).',
    },
  },

  // ─── STEP 9: GUIDED UNDERFLOW ───
  {
    stepNumber: 9,
    totalSteps: 10,
    title: 'GUIDED STACK UNDERFLOW',
    subtitle: 'Handling Pop on an Empty Stack',
    conceptBadge: 'UNDERFLOW EXCEPTION',
    stackState: {
      items: [],
      capacity: 5,
      topIndex: -1,
      highlightTop: true,
      warningState: 'underflow',
    },
    explanation:
      'Stack Underflow occurs when an algorithm attempts to POP or PEEK from an empty stack (TOP = -1). Since no elements exist to remove, the call triggers an Underflow error.',
    questionPrompt: 'What happens if we attempt to POP from an empty stack?',
    interactionType: 'underflow-action',
    postActionStack: [],
    hints: [
      'Notice that the stack is completely empty (size = 0, TOP = -1).',
      'You cannot take something out of an empty container.',
      'Click [ ATTEMPT POP ] to trigger the underflow check.',
    ],
    correctFeedback: {
      title: '✓ STACK UNDERFLOW DETECTED',
      explanation:
        'POP cannot remove an element because the stack has 0 elements. The system successfully caught the Underflow condition.',
      actionResult: 'POP() on empty stack → ⚠️ STACK UNDERFLOW (Operation Aborted).',
    },
  },

  // ─── STEP 10: GUIDED DISPLAY ───
  {
    stepNumber: 10,
    totalSteps: 10,
    title: 'GUIDED DISPLAY OPERATION',
    subtitle: 'Traversing Elements from TOP to BOTTOM',
    conceptBadge: 'DISPLAY() / TRAVERSAL',
    stackState: {
      items: [10, 20, 30, 40],
      capacity: 5,
      topIndex: 3,
      highlightTop: true,
    },
    explanation:
      'DISPLAY traverses the stack starting from the TOP element down to the base element (index 0). It prints the elements in LIFO order: [40, 30, 20, 10].',
    questionPrompt: 'Click [ DISPLAY STACK ] to print all elements in LIFO order.',
    interactionType: 'click-display',
    displayOutput: [40, 30, 20, 10],
    hints: [
      'Display traverses from index TOP down to index 0.',
      'For stack [10, 20, 30, 40], the top is 40 and the bottom is 10.',
      'Click [ DISPLAY STACK ] to reveal the printed sequence.',
    ],
    correctFeedback: {
      title: '✓ DISPLAY COMPLETE: [40, 30, 20, 10]',
      explanation: 'DISPLAY printed the elements starting from TOP (40) down to the bottom (10) in exact LIFO order.',
      actionResult: 'Display Order: 40 (Top) → 30 → 20 → 10 (Bottom).',
    },
  },
];

/**
 * =========================================================================
 * LEVEL-SPECIFIC GUIDED SOLVE CONFIGURATIONS (LEVELS 1 - 10)
 * =========================================================================
 */
export const LEVEL_GUIDED_STEPS: Record<number, GuidedSolveStep[]> = {
  // ─── LEVEL 1: POP MASTER (LIFO Basics) ───
  1: [
    {
      stepNumber: 1,
      totalSteps: 3,
      title: 'LEVEL 1 GUIDED SOLVE: LIFO POPPING',
      subtitle: 'Identify TOP and Remove the Uppermost Block',
      conceptBadge: 'LIFO POP RULE',
      stackState: {
        items: [10, 20, 30, 40, 50],
        capacity: 6,
        topIndex: 4,
        highlightTop: true,
        highlightItem: 50,
      },
      explanation:
        'In Level 1, your goal is to pop the TOP element. Stack holds [10, 20, 30, 40, 50]. 50 is at the topmost position (TOP = 4).',
      questionPrompt: 'Which element is currently at the TOP and must be popped?',
      interactionType: 'select-choice',
      choices: [
        {
          id: 'choice-50',
          label: '50 (The Top Element)',
          isCorrect: true,
          feedback: 'Correct! 50 is at TOP and will be popped first.',
        },
        {
          id: 'choice-10',
          label: '10 (The Bottom Element)',
          isCorrect: false,
          feedback: 'Incorrect. 10 is at the bottom. You cannot pop 10 while other items sit above it.',
        },
        {
          id: 'choice-30',
          label: '30 (The Middle Element)',
          isCorrect: false,
          feedback: 'Incorrect. 30 is trapped under 40 and 50.',
        },
      ],
      postActionStack: [10, 20, 30, 40],
      hints: [
        'Look at the top of the stack labeled TOP ↓.',
        '50 is the uppermost block in the container.',
        'Select 50 to confirm you understand LIFO.',
      ],
      correctFeedback: {
        title: '✓ 50 is at TOP',
        explanation: 'Popping 50 leaves [10, 20, 30, 40] with 40 as the new TOP.',
        actionResult: 'Pop(50) executed successfully.',
      },
    },
    {
      stepNumber: 2,
      totalSteps: 3,
      title: 'LEVEL 1 STEP 2: SEQUENTIAL POPPING',
      subtitle: 'Observing the TOP Pointer Moving Down',
      conceptBadge: 'TOP SHIFTING',
      stackState: {
        items: [10, 20, 30, 40],
        capacity: 6,
        topIndex: 3,
        highlightTop: true,
        highlightItem: 40,
      },
      explanation:
        'Now that 50 was removed, 40 is immediately uncovered as the new TOP element. To reach 30, 40 must be popped next.',
      questionPrompt: 'Click [ POP 40 ] to remove the active TOP.',
      interactionType: 'click-pop',
      postActionStack: [10, 20, 30],
      hints: [
        'Click [ POP 40 ] to remove the current top block.',
        'Watch TOP move from index 3 down to index 2.',
        '30 will become the new TOP.',
      ],
      correctFeedback: {
        title: '✓ 40 Popped Successfully',
        explanation: '40 has been popped. TOP now points to 30.',
        actionResult: 'Stack size is now 3. Active TOP = 30.',
      },
    },
    {
      stepNumber: 3,
      totalSteps: 3,
      title: 'LEVEL 1 STEP 3: LIFO MASTERY RECAP',
      subtitle: 'Ready to Solve Independently',
      conceptBadge: 'CHALLENGE STRATEGY',
      stackState: {
        items: [10, 20, 30],
        capacity: 6,
        topIndex: 2,
        highlightTop: true,
      },
      explanation:
        'In the actual challenge, simply drag the TOP element into the POP ZONE on the right (or click the Pop button) for each round to earn full XP!',
      questionPrompt: 'Click [ NEXT STEP ] to finish this guide and try the challenge yourself.',
      interactionType: 'info-next',
      hints: [
        'Always check the TOP arrow before dragging.',
        'Never drag from the middle or bottom.',
        'Solve all 4 rounds in Level 1 to unlock Level 2.',
      ],
      correctFeedback: {
        title: '✓ Strategy Clear',
        explanation: 'You are ready to solve Level 1 independently!',
      },
    },
  ],

  // ─── LEVEL 2: PUSH MASTER (Insertion) ───
  2: [
    {
      stepNumber: 1,
      totalSteps: 3,
      title: 'LEVEL 2 GUIDED SOLVE: PUSH MECHANICS',
      subtitle: 'Inserting Elements from the Palette',
      conceptBadge: 'PUSH TO TOP',
      stackState: {
        items: [10, 20],
        capacity: 5,
        topIndex: 1,
        highlightTop: true,
      },
      explanation:
        'In Level 2, the challenge asks you to push a specific value (e.g. 30) from the Available Elements palette onto the top of the stack.',
      questionPrompt: 'Push 30 onto the stack. Click [ PUSH 30 ].',
      interactionType: 'click-push',
      pushValue: 30,
      postActionStack: [10, 20, 30],
      hints: [
        'Click [ PUSH 30 ] below.',
        'Notice how 30 enters from above and becomes the new TOP.',
        'TOP index increases from 1 to 2.',
      ],
      correctFeedback: {
        title: '✓ 30 Pushed onto TOP',
        explanation: '30 is now at TOP (index 2). Stack size grew to 3.',
        actionResult: 'Push(30) succeeded. Capacity remaining: 2 slots.',
      },
    },
    {
      stepNumber: 2,
      totalSteps: 3,
      title: 'LEVEL 2 STEP 2: MULTI-STEP PUSHING',
      subtitle: 'Building Towards Full Capacity',
      conceptBadge: 'CAPACITY BOUNDARY',
      stackState: {
        items: [10, 20, 30],
        capacity: 5,
        topIndex: 2,
        highlightTop: true,
      },
      explanation:
        'Next, if the challenge asks to push 40 and 50, each push increases the stack size until the stack reaches its maximum capacity (5/5).',
      questionPrompt: 'Push 40 onto the stack.',
      interactionType: 'click-push',
      pushValue: 40,
      postActionStack: [10, 20, 30, 40],
      hints: [
        'Click [ PUSH 40 ].',
        'Stack will contain [10, 20, 30, 40].',
        'One more slot will remain before the stack is full.',
      ],
      correctFeedback: {
        title: '✓ 40 Pushed onto Stack',
        explanation: 'Stack now holds [10, 20, 30, 40]. TOP points to 40.',
        actionResult: 'Stack size = 4 of 5.',
      },
    },
    {
      stepNumber: 3,
      totalSteps: 3,
      title: 'LEVEL 2 STEP 3: PLAYING STRATEGY',
      subtitle: 'Ready to Solve Level 2',
      conceptBadge: 'READY TO PLAY',
      stackState: {
        items: [10, 20, 30, 40],
        capacity: 5,
        topIndex: 3,
        highlightTop: true,
      },
      explanation:
        'In Level 2, inspect the target number in the question, click or drag that number chip into the PUSH ZONE above the stack, and repeat for all rounds!',
      questionPrompt: 'Click [ NEXT STEP ] to finish guide.',
      interactionType: 'info-next',
      hints: [
        'Select the exact requested chip from the palette.',
        'Watch the capacity meter so you do not exceed bounds.',
        'Complete all rounds to unlock Level 3.',
      ],
      correctFeedback: {
        title: '✓ Ready for Push Master',
        explanation: 'You understand how PUSH operates and how to select elements.',
      },
    },
  ],

  // ─── LEVEL 3: POP MASTER (Extended Target Construction / LIFO Ordering) ───
  3: [
    {
      stepNumber: 1,
      totalSteps: 3,
      title: 'LEVEL 3 GUIDED SOLVE: BUILD THE STACK',
      subtitle: 'Bottom-Up Construction from Scrambled Numbers',
      conceptBadge: 'BOTTOM-UP ASSEMBLY',
      stackState: {
        items: [],
        capacity: 4,
        topIndex: -1,
      },
      explanation:
        'Target stack is [10 (Bottom) → 20 → 30 → 40 (Top)]. To build this, you must push the bottom-most element FIRST (10), followed by 20, 30, and finally 40.',
      questionPrompt: 'Which element must be pushed FIRST onto the empty stack?',
      interactionType: 'select-choice',
      choices: [
        {
          id: 'choice-10-base',
          label: '10 (The Bottom Foundation Element)',
          isCorrect: true,
          feedback: 'Correct! The bottom element of the target must be pushed first.',
        },
        {
          id: 'choice-40-top',
          label: '40 (The Top Element)',
          isCorrect: false,
          feedback: 'Incorrect! If you push 40 first, it will end up trapped at the bottom!',
        },
      ],
      postActionStack: [10],
      hints: [
        'In a stack, the FIRST element pushed ends up at the BOTTOM.',
        'Look at the target: 10 is at the bottom.',
        'Always push the base element first.',
      ],
      correctFeedback: {
        title: '✓ 10 Pushed as Base',
        explanation: '10 is now at index 0. Next, push 20, then 30, then 40 to complete the target.',
        actionResult: 'Base established: [10].',
      },
    },
    {
      stepNumber: 2,
      totalSteps: 3,
      title: 'LEVEL 3 STEP 2: FINISHING THE STACK',
      subtitle: 'Ascending Insertion to Top',
      conceptBadge: 'TARGET MATCHING',
      stackState: {
        items: [10, 20, 30],
        capacity: 4,
        topIndex: 2,
        highlightTop: true,
      },
      explanation:
        'With [10, 20, 30] in place, push 40 to finish the target stack structure.',
      questionPrompt: 'Click [ PUSH 40 ] to complete the stack.',
      interactionType: 'click-push',
      pushValue: 40,
      postActionStack: [10, 20, 30, 40],
      hints: [
        'Click [ PUSH 40 ].',
        '40 sits on top of 30.',
        'The stack matches the target: [10, 20, 30, 40].',
      ],
      correctFeedback: {
        title: '✓ Target Stack Matched!',
        explanation: 'The stack order is [10, 20, 30, 40] with 40 at TOP.',
        actionResult: 'Assembly matches Target Stack perfectly.',
      },
    },
    {
      stepNumber: 3,
      totalSteps: 3,
      title: 'LEVEL 3 STEP 3: UNDO / POP CAPABILITY',
      subtitle: 'Correcting Mistakes with Pop',
      conceptBadge: 'POP / UNDO',
      stackState: {
        items: [10, 20, 30, 40],
        capacity: 4,
        topIndex: 3,
        highlightTop: true,
      },
      explanation:
        'If you ever push the wrong number in Level 3, simply drag the top item into the POP / UNDO ZONE to return it to the palette and try again!',
      questionPrompt: 'Click [ NEXT STEP ] to start solving Level 3.',
      interactionType: 'info-next',
      hints: [
        'Analyze the target stack diagram first.',
        'Push from bottom to top.',
        'Use Pop to undo if needed.',
      ],
      correctFeedback: {
        title: '✓ Ready for Level 3',
        explanation: 'You are ready to construct exact target stacks.',
      },
    },
  ],

  // ─── LEVEL 4: PEEK CHALLENGE (Trace / Mental Model) ───
  4: [
    {
      stepNumber: 1,
      totalSteps: 3,
      title: 'LEVEL 4 GUIDED SOLVE: PEEK & TRACE',
      subtitle: 'Mentally Simulating Sequential Push & Pop Operations',
      conceptBadge: 'MENTAL TRACE',
      stackState: {
        items: [10, 20],
        capacity: 5,
        topIndex: 1,
        highlightTop: true,
      },
      explanation:
        'In Level 4, you are given a sequence of code operations: Push(10) → Push(20) → Pop() → Push(30). Trace the stack state after each line.',
      questionPrompt: 'After Push(10) and Push(20), a Pop() is executed. What remains in the stack?',
      interactionType: 'select-choice',
      choices: [
        {
          id: 'trace-10',
          label: '[10] (20 was popped, leaving 10)',
          isCorrect: true,
          feedback: 'Correct! Pop() removes the top item (20), leaving [10].',
        },
        {
          id: 'trace-20',
          label: '[20] (10 was popped)',
          isCorrect: false,
          feedback: 'Incorrect. Stacks follow LIFO: 20 was on top, so 20 is popped, not 10.',
        },
      ],
      postActionStack: [10],
      hints: [
        'Trace line by line: 10 in, 20 in, 20 out.',
        'Only 10 survives the pop.',
        'Then Push(30) will add 30 on top of 10.',
      ],
      correctFeedback: {
        title: '✓ Trace Step Correct',
        explanation: 'Popping 20 left [10]. Next line is Push(30), making the final stack [10, 30].',
        actionResult: 'Intermediate State: [10].',
      },
    },
    {
      stepNumber: 2,
      totalSteps: 3,
      title: 'LEVEL 4 STEP 2: PEEK AT FINAL TOP',
      subtitle: 'Non-Destructive Inspection',
      conceptBadge: 'PEEK() INSPECTION',
      stackState: {
        items: [10, 30],
        capacity: 5,
        topIndex: 1,
        highlightTop: true,
        highlightItem: 30,
      },
      explanation:
        'Now that Push(30) is executed, the stack is [10, 30]. PEEK() returns the current TOP without altering the stack.',
      questionPrompt: 'What value does PEEK() return for stack [10, 30]?',
      interactionType: 'select-choice',
      choices: [
        {
          id: 'peek-30-ans',
          label: '30',
          isCorrect: true,
          feedback: 'Correct! 30 is at the top of the stack.',
        },
        {
          id: 'peek-10-ans',
          label: '10',
          isCorrect: false,
          feedback: 'Incorrect. 10 is at the bottom. PEEK reads the top.',
        },
      ],
      postActionStack: [10, 30],
      hints: [
        'Look at the TOP arrow pointing to 30.',
        'PEEK returns the uppermost value.',
      ],
      correctFeedback: {
        title: '✓ PEEK = 30',
        explanation: 'PEEK returns 30 and leaves [10, 30] intact.',
      },
    },
    {
      stepNumber: 3,
      totalSteps: 3,
      title: 'LEVEL 4 STEP 3: PLAYING STRATEGY',
      subtitle: 'Ready to Solve Level 4',
      conceptBadge: 'READY TO PLAY',
      stackState: {
        items: [10, 30],
        capacity: 5,
        topIndex: 1,
        highlightTop: true,
      },
      explanation:
        'In Level 4, read the code execution trace, drag surviving elements into the stack, and click submit to verify your prediction!',
      questionPrompt: 'Click [ NEXT STEP ] to start Level 4.',
      interactionType: 'info-next',
      hints: [
        'Write down the stack after each line on scratch paper if needed.',
        'Match the final stack state.',
      ],
      correctFeedback: {
        title: '✓ Ready for Predict Challenge',
        explanation: 'You are ready to trace and reconstruct stack states.',
      },
    },
  ],

  // ─── LEVEL 5: STACK STATUS (isEmpty & isFull / Debug Violations) ───
  5: [
    {
      stepNumber: 1,
      totalSteps: 3,
      title: 'LEVEL 5 GUIDED SOLVE: BOUNDARY INVARIANTS',
      subtitle: 'Detecting Illegal Operations & Underflow',
      conceptBadge: 'UNDERFLOW CHECK',
      stackState: {
        items: [],
        capacity: 4,
        topIndex: -1,
        warningState: 'underflow',
      },
      explanation:
        'In Level 5 (Debug), you analyze code traces for runtime violations. If code calls Pop() when the stack is empty (size = 0), it crashes with Stack Underflow!',
      questionPrompt: 'Stack size is 0. What happens if line "Pop()" executes?',
      interactionType: 'select-choice',
      choices: [
        {
          id: 'underflow-crash',
          label: 'Crash: Stack Underflow (Cannot pop an empty stack)',
          isCorrect: true,
          feedback: 'Correct! Popping an empty stack triggers an Underflow exception.',
        },
        {
          id: 'underflow-safe',
          label: 'Valid: Returns 0 and continues normally',
          isCorrect: false,
          feedback: 'Incorrect! In a strict stack, popping empty without checking isEmpty causes a fatal Underflow.',
        },
      ],
      hints: [
        'When TOP == -1, isEmpty is true.',
        'Calling Pop() on an empty stack is an illegal operation.',
      ],
      correctFeedback: {
        title: '✓ Underflow Identified',
        explanation: 'Always verify !isEmpty() before calling Pop() in production code.',
      },
    },
    {
      stepNumber: 2,
      totalSteps: 3,
      title: 'LEVEL 5 STEP 2: OVERFLOW INVARIANT',
      subtitle: 'Detecting Push on Full Stacks',
      conceptBadge: 'OVERFLOW CHECK',
      stackState: {
        items: [10, 20, 30, 40],
        capacity: 4,
        topIndex: 3,
        warningState: 'overflow',
      },
      explanation:
        'Similarly, if capacity is 4 and 4 items are inside, calling Push(50) triggers Stack Overflow.',
      questionPrompt: 'Capacity is 4. The stack already has 4 items. What happens if Push(50) runs?',
      interactionType: 'select-choice',
      choices: [
        {
          id: 'overflow-crash',
          label: 'Crash: Stack Overflow (Exceeds fixed capacity)',
          isCorrect: true,
          feedback: 'Correct! Pushing onto a full stack triggers Stack Overflow.',
        },
        {
          id: 'overflow-ok',
          label: 'Valid: Replaces the bottom element automatically',
          isCorrect: false,
          feedback: 'Incorrect! Fixed-size stacks cannot overwrite or expand without overflow.',
        },
      ],
      hints: [
        'Check capacity limit: 4 slots max.',
        'When TOP == capacity - 1, isFull is true.',
      ],
      correctFeedback: {
        title: '✓ Overflow Identified',
        explanation: 'Always verify !isFull() before pushing into a bounded stack.',
      },
    },
    {
      stepNumber: 3,
      totalSteps: 3,
      title: 'LEVEL 5 STEP 3: PLAYING STRATEGY',
      subtitle: 'Ready to Debug',
      conceptBadge: 'READY TO PLAY',
      stackState: {
        items: [10, 20, 30, 40],
        capacity: 4,
        topIndex: 3,
      },
      explanation:
        'In Level 5, click on the faulty line that causes an Underflow or Overflow to diagnose the bug and earn maximum XP!',
      questionPrompt: 'Click [ NEXT STEP ] to start Level 5.',
      interactionType: 'info-next',
      hints: [
        'Track the stack size as you read down the lines of code.',
        'Look for Pop when size == 0 or Push when size == capacity.',
      ],
      correctFeedback: {
        title: '✓ Ready to Debug',
        explanation: 'You are equipped to detect stack boundary violations.',
      },
    },
  ],

  // ─── LEVEL 6: SPEED STACK (Rapid-Fire Mastery) ───
  6: [
    {
      stepNumber: 1,
      totalSteps: 3,
      title: 'LEVEL 6 GUIDED SOLVE: RAPID LIFO REFLEXES',
      subtitle: 'High-Speed Operations Under Time Pressure',
      conceptBadge: 'SPEED & STREAK',
      stackState: {
        items: [10, 20, 30],
        capacity: 5,
        topIndex: 2,
        highlightTop: true,
      },
      explanation:
        'In Level 6 (Speed Stack), commands appear rapidly on screen (e.g. PUSH [40] or POP TOP). Execute them immediately to build a 3x combo multiplier.',
      questionPrompt: 'A prompt says "POP TOP". What action should you take?',
      interactionType: 'click-pop',
      postActionStack: [10, 20],
      hints: [
        'Click [ POP TOP ] immediately.',
        'Popping the top maintains your speed streak.',
      ],
      correctFeedback: {
        title: '✓ Fast Reflexes!',
        explanation: '30 was popped instantly. Multiplier combo maintained!',
        actionResult: 'Speed prompt executed with 0 latency.',
      },
    },
    {
      stepNumber: 2,
      totalSteps: 3,
      title: 'LEVEL 6 STEP 2: RAPID PUSH ACTION',
      subtitle: 'Instant Target Selection',
      conceptBadge: 'FAST PUSH',
      stackState: {
        items: [10, 20],
        capacity: 5,
        topIndex: 1,
        highlightTop: true,
      },
      explanation:
        'When the banner flashes "PUSH 50", click the [50] chip instantly to push it onto the top.',
      questionPrompt: 'Click [ PUSH 50 ] to complete the speed prompt.',
      interactionType: 'click-push',
      pushValue: 50,
      postActionStack: [10, 20, 50],
      hints: [
        'Click [ PUSH 50 ].',
        'Stack becomes [10, 20, 50].',
      ],
      correctFeedback: {
        title: '✓ 3x Multiplier Active!',
        explanation: '50 is now at TOP. Fast response scored maximum points.',
      },
    },
    {
      stepNumber: 3,
      totalSteps: 3,
      title: 'LEVEL 6 STEP 3: SPEED ARENA READY',
      subtitle: 'Final Challenge Level',
      conceptBadge: 'ARENA READY',
      stackState: {
        items: [10, 20, 50],
        capacity: 5,
        topIndex: 2,
        highlightTop: true,
      },
      explanation:
        'You have 45 seconds to complete 6 rapid directives. Keep your focus sharp and your hands fast!',
      questionPrompt: 'Click [ NEXT STEP ] to launch Speed Stack.',
      interactionType: 'info-next',
      hints: [
        'Read the banner instruction.',
        'Click Push or Pop without hesitation.',
        'Finish all 6 rounds to achieve Stack Mastery!',
      ],
      correctFeedback: {
        title: '✓ Ready for the Speed Challenge!',
        explanation: 'Launch the arena and achieve your high score.',
      },
    },
  ],
};
