export interface EducationalScene {
  id: number;
  timeStart: number;
  timeEnd: number;
  title: string;
  badge: string;
  badgeColor: string;
  narration: string;
  keyConcept: string;
  type: 'concept' | 'array' | 'linkedlist' | 'stack-queue' | 'stack-lifo' | 'push' | 'peek' | 'pop' | 'overflow' | 'underflow' | 'complexity';
}

export interface LessonData {
  id: number;
  lessonNumber: string;
  title: string;
  description: string;
  chips: string[];
  filename: string;
  videoSrc?: string;
  duration: number; // in seconds
  scenes: EducationalScene[];
}

export const LESSONS_DATA: LessonData[] = [
  {
    id: 1,
    lessonNumber: 'LESSON 01',
    title: 'COMPARISON-BASED SORTING',
    description: 'Master Bubble Sort, Selection Sort, and Insertion Sort: observe adjacent pair swaps, minimum element selection, and adaptive shifting.',
    chips: ['Comparison Sorts', 'Bubble Sort', 'Selection Sort', 'Insertion Sort'],
    filename: 'bubble.mp4',
    videoSrc: '/api/videos/visualizeVideos/sorting/bubble-sort',
    duration: 59,
    scenes: [
      {
        id: 1,
        timeStart: 0,
        timeEnd: 10,
        title: 'Pairwise Comparisons & Inversions',
        badge: 'PAIRWISE COMPARISON: A[j] vs A[j+1]',
        badgeColor: 'text-indigo-400 bg-indigo-950/80 border-indigo-600/70',
        narration: 'Comparison sorts inspect pairs of elements to identify inversions where a left element is strictly larger than its right neighbor.',
        keyConcept: 'Every swap of an inverted adjacent pair strictly reduces the total inversion count by 1.',
        type: 'concept',
      },
      {
        id: 2,
        timeStart: 10,
        timeEnd: 20,
        title: 'The Bubbling Mechanism (Bubble Sort)',
        badge: 'BUBBLE SORT: LARGEST BUBBLES RIGHT',
        badgeColor: 'text-indigo-400 bg-indigo-950/80 border-indigo-600/70',
        narration: 'In Bubble Sort, repeated passes float the largest remaining value to the right boundary of the array.',
        keyConcept: 'After pass i, the i-th largest element is locked into its permanent sorted index.',
        type: 'push',
      },
      {
        id: 3,
        timeStart: 20,
        timeEnd: 30,
        title: 'Minimum Element Selection (Selection Sort)',
        badge: 'SELECTION SORT: SCAN MIN & SWAP',
        badgeColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-600/70',
        narration: 'Selection Sort scans the unsorted suffix to locate the minimum element, executing at most n - 1 total swaps across the entire sort.',
        keyConcept: 'Minimizes memory write operations, making it valuable when storage writes are physically costly.',
        type: 'peek',
      },
      {
        id: 4,
        timeStart: 30,
        timeEnd: 40,
        title: 'Adaptive Shifting (Insertion Sort)',
        badge: 'INSERTION SORT: SHIFT & INSERT',
        badgeColor: 'text-purple-400 bg-purple-950/80 border-purple-600/70',
        narration: 'Insertion Sort shifts larger preceding elements one slot right and drops the key into its sorted slot, running in linear O(n) time on nearly sorted data.',
        keyConcept: 'Online and adaptive: ideal base sort for small arrays (n <= 32) in Timsort and Introsort.',
        type: 'array',
      },
      {
        id: 5,
        timeStart: 40,
        timeEnd: 50,
        title: 'Elementary Complexity Bounds & Stability',
        badge: 'COMPLEXITY: O(n²) WORST | O(1) SPACE',
        badgeColor: 'text-amber-400 bg-amber-950/80 border-amber-600/70',
        narration: 'While elementary sorts require O(1) auxiliary space, their O(n²) worst-case time requires divide-and-conquer strategies for large scale datasets.',
        keyConcept: 'Bubble and Insertion Sort are naturally stable; Selection Sort is inherently unstable.',
        type: 'complexity',
      },
    ],
  },
  {
    id: 2,
    lessonNumber: 'LESSON 02',
    title: 'DIVIDE & CONQUER SORTING',
    description: 'Master Merge Sort and Quick Sort: explore recursive array splitting, two-pointer merging, pivot partitioning, and O(n log n) efficiency.',
    chips: ['Divide & Conquer', 'Merge Sort', 'Quick Sort', 'O(n log n) Efficiency'],
    filename: 'Stack Operations.mp4',
    duration: 50,
    scenes: [
      {
        id: 1,
        timeStart: 0,
        timeEnd: 10,
        title: 'Divide & Conquer Recursion',
        badge: 'DIVIDE: T(n) = 2T(n/2) + O(n)',
        badgeColor: 'text-indigo-400 bg-indigo-950/80 border-indigo-600/70',
        narration: 'Divide and conquer breaks down a problem into independent subproblems, sorts them recursively, and combines the results.',
        keyConcept: 'Halving the problem log2(n) times avoids quadratic O(n²) pair comparisons.',
        type: 'concept',
      },
      {
        id: 2,
        timeStart: 10,
        timeEnd: 20,
        title: 'Two-Pointer Merging (Merge Sort)',
        badge: 'MERGE SUBROUTINE: TWO POINTERS',
        badgeColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-600/70',
        narration: 'Two pointers step across both sorted halves, selecting the smaller element into an auxiliary buffer in linear O(n) time.',
        keyConcept: 'Strictly stable and guaranteed O(n log n) in all cases, using O(n) temporary space.',
        type: 'push',
      },
      {
        id: 3,
        timeStart: 20,
        timeEnd: 30,
        title: 'Pivot Partitioning (Quick Sort)',
        badge: 'LOMUTO & HOARE PARTITIONS',
        badgeColor: 'text-indigo-400 bg-indigo-950/80 border-indigo-600/70',
        narration: 'Quick Sort chooses a pivot element and rearranges elements in-place: smaller elements to the left, larger to the right.',
        keyConcept: 'Once partitioned, the pivot element is in its final sorted position with 0 extra memory allocated.',
        type: 'peek',
      },
      {
        id: 4,
        timeStart: 30,
        timeEnd: 40,
        title: 'Pivot Pitfalls & Defenses',
        badge: 'MEDIAN-OF-THREE & INTROSORT',
        badgeColor: 'text-amber-400 bg-amber-950/80 border-amber-600/70',
        narration: 'Picking extreme pivots on pre-sorted data causes O(n²) degradation. Median-of-three and randomized pivots protect performance.',
        keyConcept: 'Introsort monitors recursion depth and falls back to Heap Sort if quicksort partitions are unbalanced.',
        type: 'overflow',
      },
      {
        id: 5,
        timeStart: 40,
        timeEnd: 50,
        title: 'The O(n log n) Master Theorem Bound',
        badge: 'MASTER THEOREM: THETA(n log n)',
        badgeColor: 'text-purple-400 bg-purple-950/80 border-purple-600/70',
        narration: 'With log2(n) recursion levels and O(n) work per level, Merge Sort and Quick Sort achieve optimal O(n log n) time.',
        keyConcept: 'Matches the theoretical comparison lower bound Omega(n log n) proven by decision tree models.',
        type: 'complexity',
      },
    ],
  },
];
