import { TheoryLesson } from '../types';

export const THEORY_LESSONS: TheoryLesson[] = [
  // =========================================================================
  // CONCEPT 01: WHAT IS SORTING?
  // =========================================================================
  {
    id: 1,
    chapterNumber: '01',
    categoryLabel: 'FUNDAMENTALS',
    lessonNumber: 1,
    title: '1. What is Sorting?',
    shortDesc: 'Understand sorting definitions, ascending vs descending order, and inversion pairs.',
    readTime: '3 min read',
    executiveDefinition:
      'Sorting is the algorithmic process of arranging an arbitrary collection of items into a monotonic sequence (typically non-decreasing) according to a defined total order comparison relation.',
    criticalSpecifications: [
      'Monotonic Order: A sequence A is sorted in non-decreasing order if and only if A[i] <= A[i + 1] for all valid 0 <= i < n - 1.',
      'Inversion Definition: An inversion is a pair of indices (i, j) such that i < j but A[i] > A[j]. A sorted array has exactly 0 inversions.',
      'Maximum Inversions: A reverse-sorted array of size n contains n(n - 1) / 2 inversions, representing maximum disorder.',
      'Comparison Model: General-purpose sorting algorithms rely on pairwise comparison operations (a < b, a == b, a > b).',
    ],
    analogy: {
      title: 'Organizing Books on a Library Shelf',
      description:
        'Imagine books returned in random order. To organize them by call number, you repeatedly identify books placed out of order (an inversion) and shift them until every book has a lower or equal call number than the one to its right.',
    },
    example: {
      title: 'Inversion Resolution on [4, 1, 3, 2]',
      description:
        'Consider the sequence [4, 1, 3, 2]. Sorting systematically resolves all inversions to reach [1, 2, 3, 4].',
      steps: [
        'Initial Array: [4, 1, 3, 2] → Inversions: (4,1), (4,3), (4,2), (3,2) = 4 inversions',
        'Step 1: Resolve (4,1) by swapping → [1, 4, 3, 2] (3 inversions remaining)',
        'Step 2: Resolve (4,3) by swapping → [1, 3, 4, 2] (2 inversions remaining)',
        'Step 3: Resolve (4,2) by swapping → [1, 3, 2, 4] (1 inversion remaining)',
        'Step 4: Resolve (3,2) by swapping → [1, 2, 3, 4] (0 inversions → Fully Sorted!)',
      ],
    },
    visualDiagram: {
      type: 'comparison',
      operationLabel: 'Unsorted Array vs Sorted Array & Inversions',
      notes: 'Every adjacent swap of inverted items reduces the total inversion count by exactly 1.',
      diagramText: `  Unsorted Input: [ 34,  12,  89,  25,  05 ]  (Inversions: 7)
                     ↓    ↓    ↓    ↓    ↓
  Pairwise Checks: (34,12)✓ (89,25)✓ (89,05)✓ (34,25)✓ (34,05)✓ (25,05)✓ (12,05)✓
                     ↓    ↓    ↓    ↓    ↓
  Sorted Output:  [ 05,  12,  25,  34,  89 ]  (Inversions: 0)
                  Index: 0    1    2    3    4  [Strictly A[i] <= A[i+1]]`,
    },
    content: `### Why Sorting is Fundamental in Computer Science
Sorting transforms unstructured data into an organized format, drastically accelerating downstream computations:
* **Accelerated Search**: Searching an unsorted list requires **O(n)** linear scan; a sorted list enables **O(log n)** Binary Search.
* **Deduplication & Uniqueness**: Duplicate elements cluster adjacent to one another, detectable in a single **O(n)** pass.
* **Fast Intersection & Union**: Merging two sorted sets of sizes *n* and *m* runs in linear **O(n + m)** time using two pointers.
* **Data Compression**: Sorting frequency distributions underpins Huffman coding and Run-Length Encoding.`,
    codeSnippet: {
      c: `// Count inversions in C using O(n^2) brute force
#include <stdio.h>

int countInversions(int arr[], int n) {
    int inv_count = 0;
    for (int i = 0; i < n - 1; i++) {
        for (int j = i + 1; j < n; j++) {
            if (arr[i] > arr[j]) {
                inv_count++;
            }
        }
    }
    return inv_count;
}`,
      cpp: `// Verify non-decreasing monotonic order in C++
#include <vector>
#include <algorithm>

bool isSorted(const std::vector<int>& arr) {
    for (size_t i = 0; i + 1 < arr.size(); ++i) {
        if (arr[i] > arr[i + 1]) return false;
    }
    return true;
}`,
      python: `# Measure inversions in Python
def count_inversions(arr: list[int]) -> int:
    return sum(1 for i in range(len(arr)) for j in range(i + 1, len(arr)) if arr[i] > arr[j])

def is_sorted(arr: list[int]) -> bool:
    return all(arr[i] <= arr[i + 1] for i in range(len(arr) - 1))`,
      java: `// Verify sorted order in Java
public class SortingBasics {
    public static boolean isSorted(int[] arr) {
        for (int i = 0; i < arr.length - 1; i++) {
            if (arr[i] > arr[i + 1]) return false;
        }
        return true;
    }
}`,
    },
    summaryCards: [
      {
        title: 'Monotonic Order',
        description:
          'Every element is smaller than or equal to its successor (A[i] <= A[i+1]).',
      },
      {
        title: 'Zero Inversions',
        description:
          'A fully sorted list contains exactly zero inverted pairs (i < j with A[i] > A[j]).',
      },
      {
        title: 'Enables Binary Search',
        description:
          'Transforms search lookup times from O(n) linear scan down to O(log n) logarithmic time.',
      },
    ],
  },

  // =========================================================================
  // CONCEPT 02: BUBBLE SORT
  // =========================================================================
  {
    id: 2,
    chapterNumber: '02',
    categoryLabel: 'ALGORITHM 1',
    lessonNumber: 2,
    title: '2. Bubble Sort',
    shortDesc: 'Repeatedly step through the list, compare adjacent pairs, and swap them if out of order.',
    readTime: '4 min read',
    executiveDefinition:
      'Bubble Sort repeatedly iterates through the list, compares adjacent items, and swaps them if they are in the wrong order. After pass k, the k-th largest element has bubbled into its final position at the end.',
    criticalSpecifications: [
      'Outer Loop (Passes): Runs n - 1 times. Pass i places the (i+1)-th largest element at index n - 1 - i.',
      'Inner Loop (Comparisons): Compares arr[j] with arr[j + 1] for 0 <= j < n - 1 - i.',
      'Adaptive Optimization: If a full pass completes with 0 swaps, the array is already sorted; early exit achieves O(n) best-case time.',
      'Stability: Strictly STABLE when using arr[j] > arr[j + 1]. Never swap when values are equal.',
    ],
    analogy: {
      title: 'Bubbles Rising to the Surface in Carbonated Soda',
      description:
        'Heavier (larger) values sink downward, while lighter (smaller) values rise to the top. In standard ascending sorting, the largest remaining value bubbles all the way to the right end of the array on each pass.',
    },
    example: {
      title: 'Bubble Sort Pass on [5, 1, 4, 2, 8]',
      description: 'Pass 1 compares adjacent elements and bubbles 8 to the end slot.',
      steps: [
        'Compare (5, 1): 5 > 1 → SWAP → [1, 5, 4, 2, 8]',
        'Compare (5, 4): 5 > 4 → SWAP → [1, 4, 5, 2, 8]',
        'Compare (5, 2): 5 > 2 → SWAP → [1, 4, 2, 5, 8]',
        'Compare (5, 8): 5 < 8 → NO SWAP → [1, 4, 2, 5, 8] (8 is locked at end!)',
        'Pass 2: Bubbles 5 to index 3 → [1, 2, 4, 5, 8]',
        'Pass 3: 0 swaps occurred → EARLY EXIT! Array is fully sorted.',
      ],
    },
    visualDiagram: {
      type: 'comparison',
      operationLabel: 'Bubble Sort Adjacent Swapping Trace',
      notes: 'Each pass shrinks the unsorted frontier by 1 element on the right.',
      diagramText: `  Pass 1:  [ 64,  34,  25,  12,  22,  11,  90 ]
  (64,34)  →  [ 34,  64,  25,  12,  22,  11,  90 ]  (Swap)
  (64,25)  →  [ 34,  25,  64,  12,  22,  11,  90 ]  (Swap)
  (64,12)  →  [ 34,  25,  12,  64,  22,  11,  90 ]  (Swap)
  (64,22)  →  [ 34,  25,  12,  22,  64,  11,  90 ]  (Swap)
  (64,11)  →  [ 34,  25,  12,  22,  11,  64,  90 ]  (Swap)
  (64,90)  →  [ 34,  25,  12,  22,  11,  64, [90] ] (90 locked in place!)`,
    },
    content: `### How Bubble Sort Works
Bubble Sort is the most intuitive comparison-based sorting algorithm:
1. Compare elements at index **j** and **j + 1**.
2. If **arr[j] > arr[j + 1]**, swap them.
3. Advance to the next adjacent pair.
4. After each pass, the largest unsorted element settles into its correct rightmost position.
5. Track whether any swap occurred with a boolean flag: if no swaps occur during an entire pass, terminate early!`,
    codeSnippet: {
      c: `void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int swapped = 0;
        for (int j = 0; j < n - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = 1;
            }
        }
        if (!swapped) break;
    }
}`,
      cpp: `void bubbleSort(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; ++i) {
        bool swapped = false;
        for (int j = 0; j < n - 1 - i; ++j) {
            if (arr[j] > arr[j + 1]) {
                std::swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
      python: `def bubble_sort(arr: list[int]) -> None:
    n = len(arr)
    for i in range(n - 1):
        swapped = False
        for j in range(n - 1 - i):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break`,
      java: `public static void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        boolean swapped = false;
        for (int j = 0; j < n - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
    },
    summaryCards: [
      {
        title: 'Adjacent Comparisons',
        description: 'Only compares neighboring pairs (j and j+1), swapping when out of order.',
      },
      {
        title: 'Bubbling Effect',
        description: 'The maximum remaining element bubbles to its final right position each pass.',
      },
      {
        title: 'Adaptive Flag',
        description: 'Early termination when 0 swaps occur drops best-case runtime to O(n).',
      },
    ],
  },

  // =========================================================================
  // CONCEPT 03: SELECTION SORT
  // =========================================================================
  {
    id: 3,
    chapterNumber: '03',
    categoryLabel: 'ALGORITHM 2',
    lessonNumber: 3,
    title: '3. Selection Sort',
    shortDesc: 'Repeatedly find the minimum unsorted element and place it at the front of the unsorted segment.',
    readTime: '4 min read',
    executiveDefinition:
      'Selection Sort divides the array into a sorted prefix and unsorted suffix. It repeatedly scans the unsorted portion to select the absolute minimum element and swaps it with the leftmost unsorted element.',
    criticalSpecifications: [
      'Outer Loop: Sets partition boundary i from 0 to n - 2.',
      'Inner Loop: Scans index j from i + 1 to n - 1 to identify the index of the minimum element.',
      'Swap Efficiency: Exactly at most n - 1 total swaps across the entire sorting run.',
      'Stability Warning: Inherently UNSTABLE in standard array implementation due to long-distance swaps.',
    ],
    analogy: {
      title: 'Drafting Players for a Sports Team',
      description:
        'Line up candidates. Walk down the entire row, identify the single best candidate, bring them to the front to take slot 1. Repeat for slot 2, slot 3, and so on.',
    },
    example: {
      title: 'Selection Sort on [64, 25, 12, 22, 11]',
      description: 'Find the minimum and swap into the sorted partition boundary.',
      steps: [
        'Pass 1: Scan [64, 25, 12, 22, 11] → Min is 11 at index 4 → Swap with index 0 → [11 | 25, 12, 22, 64]',
        'Pass 2: Scan [25, 12, 22, 64] → Min is 12 at index 2 → Swap with index 1 → [11, 12 | 25, 22, 64]',
        'Pass 3: Scan [25, 22, 64] → Min is 22 at index 3 → Swap with index 2 → [11, 12, 22 | 25, 64]',
        'Pass 4: Scan [25, 64] → Min is 25 at index 3 → Swap with index 3 (self) → [11, 12, 22, 25, 64]',
      ],
    },
    visualDiagram: {
      type: 'comparison',
      operationLabel: 'Selection Sort Partition & Swap Trace',
      notes: 'Sorted partition [0...i] grows from left to right with exactly 1 swap per pass.',
      diagramText: `  Initial:   [ 64,  25,  12,  22,  11 ]  (Find min in [0..4] -> 11)
  Swap(0,4): [ 11 | 25,  12,  22,  64 ]  (Find min in [1..4] -> 12)
  Swap(1,2): [ 11,  12 | 25,  22,  64 ]  (Find min in [2..4] -> 22)
  Swap(2,3): [ 11,  12,  22 | 25,  64 ]  (Find min in [3..4] -> 25)
  Final:     [ 11,  12,  22,  25,  64 ]  (Fully Sorted with only 3 swaps!)`,
    },
    content: `### How Selection Sort Works
Selection Sort is optimal when write operations are extremely costly:
1. Maintain an unsorted boundary starting at index **0**.
2. Scan the entire remaining unsorted array to locate the minimum element.
3. Perform a single swap between the minimum element and the element at the boundary.
4. Advance the boundary by 1.
5. While comparisons are always **O(n²)**, total swaps are strictly bounded by **O(n)**.`,
    codeSnippet: {
      c: `void selectionSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int min_idx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[min_idx]) {
                min_idx = j;
            }
        }
        if (min_idx != i) {
            int temp = arr[i];
            arr[i] = arr[min_idx];
            arr[min_idx] = temp;
        }
    }
}`,
      cpp: `void selectionSort(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; ++i) {
        int min_idx = i;
        for (int j = i + 1; j < n; ++j) {
            if (arr[j] < arr[min_idx]) min_idx = j;
        }
        if (min_idx != i) std::swap(arr[i], arr[min_idx]);
    }
}`,
      python: `def selection_sort(arr: list[int]) -> None:
    n = len(arr)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        if min_idx != i:
            arr[i], arr[min_idx] = arr[min_idx], arr[i]`,
      java: `public static void selectionSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) minIdx = j;
        }
        if (minIdx != i) {
            int temp = arr[i];
            arr[i] = arr[minIdx];
            arr[minIdx] = temp;
        }
    }
}`,
    },
    summaryCards: [
      {
        title: 'Minimum Element Selection',
        description: 'Scans the entire unsorted partition to identify the absolute minimum.',
      },
      {
        title: 'Minimal Memory Writes',
        description: 'Performs at most n - 1 swaps total, ideal when memory write cycles are costly.',
      },
      {
        title: 'Non-Adaptive Comparisons',
        description: 'Always performs n(n-1)/2 comparisons regardless of initial array ordering.',
      },
    ],
  },

  // =========================================================================
  // CONCEPT 04: INSERTION SORT
  // =========================================================================
  {
    id: 4,
    chapterNumber: '04',
    categoryLabel: 'ALGORITHM 3',
    lessonNumber: 4,
    title: '4. Insertion Sort',
    shortDesc: 'Build the final sorted array one item at a time by shifting larger elements right and inserting each key.',
    readTime: '4 min read',
    executiveDefinition:
      'Insertion Sort builds a sorted array incrementally by consuming one unsorted element per iteration, shifting strictly larger elements in the sorted prefix to the right, and inserting the key into the opened slot.',
    criticalSpecifications: [
      'Sorted Prefix: Array elements [0...i-1] are kept in sorted order at the start of step i.',
      'Key Card: The element arr[i] is extracted into a temporary variable key.',
      'Backward Scan: Scans leftward from i - 1, shifting elements arr[j] > key rightward.',
      'Adaptive Performance: Runs in O(n) best-case time and O(n + d) time where d is the inversion count.',
    ],
    analogy: {
      title: 'Sorting Playing Cards in Your Hand',
      description:
        'Pick up cards one by one from a deck. Hold sorted cards in your left hand. Take the next card with your right hand, scan backwards through the hand, shift larger cards right, and slip the new card into its correct position.',
    },
    example: {
      title: 'Insertion Sort on [12, 11, 13, 5, 6]',
      description: 'Extract key card, shift larger cards right, insert key into vacant position.',
      steps: [
        'Initial: [12 | 11, 13, 5, 6] (Prefix [12] is sorted)',
        'Key = 11: 12 > 11 → Shift 12 right → Insert 11 at [0] → [11, 12 | 13, 5, 6]',
        'Key = 13: 12 < 13 → No shift needed → [11, 12, 13 | 5, 6]',
        'Key = 5:  13, 12, 11 all > 5 → Shift all right → Insert 5 at [0] → [5, 11, 12, 13 | 6]',
        'Key = 6:  13, 12, 11 > 6 → Shift right → Insert 6 at [1] → [5, 6, 11, 12, 13]',
      ],
    },
    visualDiagram: {
      type: 'comparison',
      operationLabel: 'Insertion Sort Shift and Insert Trace',
      notes: 'Elements slide right one slot to make room without full swap overhead.',
      diagramText: `  Sorted Prefix: [ 11,  12,  13 ]   Key = [5] (from index 3)
                   ↓    ↓    ↓
  Shift 13:      [ 11,  12,  --,  13 ]  (13 > 5, shifted right)
  Shift 12:      [ 11,  --,  12,  13 ]  (12 > 5, shifted right)
  Shift 11:      [ --,  11,  12,  13 ]  (11 > 5, shifted right)
  Insert Key:    [  5,  11,  12,  13 ]  (5 placed in opened slot 0)`,
    },
    content: `### How Insertion Sort Works
Insertion Sort is the most efficient elementary algorithm for small or nearly-sorted datasets:
1. The first element at index **0** is trivially sorted.
2. For each index **i** from **1** to **n - 1**, set **key = arr[i]**.
3. Compare **key** with elements to its left (**j = i - 1** down to **0**).
4. Shift any element greater than **key** one position to the right (**arr[j + 1] = arr[j]**).
5. Place **key** into the vacant position (**arr[j + 1] = key**).
6. Runs in linear **O(n)** time on sorted input and is naturally **stable**!`,
    codeSnippet: {
      c: `void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}`,
      cpp: `void insertionSort(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = 1; i < n; ++i) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            --j;
        }
        arr[j + 1] = key;
    }
}`,
      python: `def insertion_sort(arr: list[int]) -> None:
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key`,
      java: `public static void insertionSort(int[] arr) {
    for (int i = 1; i < arr.length; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
    },
    summaryCards: [
      {
        title: 'Incremental Building',
        description: 'Maintains a sorted prefix and inserts one key element at a time.',
      },
      {
        title: 'Adaptive Linear Time',
        description: 'Runs in O(n) time for nearly-sorted data; directly proportional to inversions.',
      },
      {
        title: 'Stable & In-Place',
        description: 'Preserves the relative order of duplicate items with zero auxiliary memory.',
      },
    ],
  },

  // =========================================================================
  // CONCEPT 05: COMPARE THE THREE ALGORITHMS
  // =========================================================================
  {
    id: 5,
    chapterNumber: '05',
    categoryLabel: 'COMPARISON',
    lessonNumber: 5,
    title: '5. Compare the Three Algorithms',
    shortDesc: 'Direct side-by-side comparison of Bubble, Selection, and Insertion sorts on operations, stability, and use-cases.',
    readTime: '5 min read',
    executiveDefinition:
      'While Bubble, Selection, and Insertion sorts all share an O(n²) worst-case time complexity, their internal mechanisms differ significantly: Bubble swaps neighbors, Selection minimizes memory writes, and Insertion shifts elements adaptively.',
    criticalSpecifications: [
      'Bubble Sort: Swaps adjacent inversions; best for detecting already-sorted arrays via flag.',
      'Selection Sort: Scans for minimum; strictly minimizes data writes (at most n-1 swaps), but is unstable.',
      'Insertion Sort: Shifts elements into sorted prefix; optimal for small lists (n < 32) and nearly-sorted inputs.',
      'Stability: Bubble (Stable) vs Selection (Unstable) vs Insertion (Stable).',
    ],
    analogy: {
      title: 'Three Different Strategies for Arranging Books',
      description:
        'Bubble Sort walks along swapping adjacent out-of-order books until no swaps occur. Selection Sort searches the entire shelf for the smallest title and moves it to the front. Insertion Sort pulls one book at a time and slides it into its exact alphabetical place.',
    },
    example: {
      title: 'Operations Comparison on [4, 3, 2, 1]',
      description: 'Side-by-side execution metrics for the reverse-sorted worst-case.',
      steps: [
        'Bubble Sort: 6 comparisons, 6 swaps → Total operations: 12',
        'Selection Sort: 6 comparisons, 2 swaps → Total operations: 8 (Fewest writes!)',
        'Insertion Sort: 6 comparisons, 6 shifts → Total operations: 12 (Fastest in practice due to single assignments)',
      ],
    },
    visualDiagram: {
      type: 'comparison',
      operationLabel: 'Direct Architectural Comparison Matrix',
      notes: 'Choose the algorithm suited for your hardware and data distribution constraints.',
      diagramText: `  Algorithm     | Best Time | Worst Time | Swaps/Writes | Stability | Adaptive?
  -------------------------------------------------------------------------
  Bubble Sort   |   O(n)    |   O(n^2)   |    O(n^2)    |  Stable   | Yes (flag)
  Selection Sort|  O(n^2)   |   O(n^2)   |     O(n)     | Unstable  | No
  Insertion Sort|   O(n)    |   O(n^2)   |  O(n^2) sh   |  Stable   | Yes (adaptive)`,
    },
    content: `### Comparative Engineering Breakdown
| Metric | Bubble Sort | Selection Sort | Insertion Sort |
| :--- | :--- | :--- | :--- |
| **Core Operation** | Adjacent swap | Min element search | Sorted prefix shift |
| **Best Case Time** | O(n) | O(n²) | O(n) |
| **Worst Case Time** | O(n²) | O(n²) | O(n²) |
| **Memory Writes** | High (O(n²)) | Minimal (O(n)) | Medium (shifts) |
| **Stability** | Yes | No | Yes |
| **Best Real Use** | Educational | Flash memory (writes) | Small or nearly sorted arrays |`,
    codeSnippet: {
      c: `// Choosing the right algorithm
// Use Insertion Sort for small n or nearly-sorted data:
if (n <= 32 || is_nearly_sorted) {
    insertionSort(arr, n);
} else if (memory_writes_expensive) {
    selectionSort(arr, n);
}`,
      cpp: `// Selection rule in modern libraries
// Hybrid algorithms like Timsort use Insertion Sort for subarrays of size n <= 32:
if (len <= 32) {
    insertion_sort(begin, end);
}`,
      python: `# Python's built-in sorted() and list.sort() (Timsort)
# internally fall back to Insertion Sort for short runs (minrun <= 64)`,
      java: `// Java's DualPivotQuicksort falls back to Insertion Sort for n < 47
if (right - left < 47) {
    insertionSort(a, left, right);
}`,
    },
    summaryCards: [
      {
        title: 'Bubble Sort',
        description: 'Simple adjacent comparisons; easily detects already-sorted data via swap flag.',
      },
      {
        title: 'Selection Sort',
        description: 'Minimizes memory writes with at most n-1 swaps; inherently unstable.',
      },
      {
        title: 'Insertion Sort',
        description: 'The practical champion among O(n²) sorts; basis for Timsort and hybrid engines.',
      },
    ],
  },

  // =========================================================================
  // CONCEPT 06: TIME & SPACE COMPLEXITY
  // =========================================================================
  {
    id: 6,
    chapterNumber: '06',
    categoryLabel: 'COMPLEXITY',
    lessonNumber: 6,
    title: '6. Time & Space Complexity',
    shortDesc: 'Mathematical analysis of Big-O bounds: best, average, worst-case operations, and auxiliary memory limits.',
    readTime: '4 min read',
    executiveDefinition:
      'Computational complexity quantifies the scaling behavior of sorting algorithms as the input size n approaches infinity. All three elementary algorithms operate in O(1) auxiliary space, but exhibit distinct time complexities based on initial inversion counts.',
    criticalSpecifications: [
      'Big-O Notation: Upper bound on running time and space growth rate.',
      'Comparison Lower Bound: Any comparison-based sorting algorithm requires at least Ω(n log n) comparisons in the worst case.',
      'In-Place Space O(1): Sorting is performed directly in the input array with only temporary pointer and index variables.',
      'Inversion Relationship: Running time of Insertion Sort is tightly bounded by Θ(n + I) where I is the inversion count.',
    ],
    analogy: {
      title: 'Measuring Fuel Consumption on Different Routes',
      description:
        'Just as a car uses fuel depending on distance, traffic, and hills, algorithms consume CPU clock cycles (time complexity) and RAM (space complexity) depending on array size and initial ordering.',
    },
    example: {
      title: 'Operations Scaling for n = 1,000 Elements',
      description: 'Comparing theoretical operation counts between algorithms.',
      steps: [
        'Best Case (Sorted Array): Bubble Sort = ~1,000 ops, Insertion Sort = ~1,000 ops, Selection Sort = ~500,000 ops',
        'Worst Case (Reversed Array): All three algorithms require approximately n(n - 1) / 2 = ~499,500 comparisons',
        'Auxiliary Space: All three algorithms consume exactly O(1) extra space (a few bytes for indices and swap temporary)',
      ],
    },
    visualDiagram: {
      type: 'comparison',
      operationLabel: 'Big-O Growth Curves & Space Footprint',
      notes: 'In-place algorithms require no extra heap or buffer allocations.',
      diagramText: `  Input Size (n)   | O(n) Best Case  | O(n^2) Worst Case | Auxiliary Memory
  ---------------------------------------------------------------------------
  n = 10           | 10 ops          | 100 ops           | O(1) (temp variables)
  n = 100          | 100 ops         | 10,000 ops        | O(1) (in-place)
  n = 1,000        | 1,000 ops       | 1,000,000 ops     | O(1) (zero extra RAM)
  n = 10,000       | 10,000 ops      | 100,000,000 ops   | O(1) (in-place)`,
    },
    content: `### Mathematical Complexity Summary
* **Best-Case Time Complexity**:
  * **Bubble Sort (Optimized)**: **O(n)** — one pass with 0 swaps confirms order.
  * **Insertion Sort**: **O(n)** — each element compared once to its immediate predecessor.
  * **Selection Sort**: **O(n²)** — still scans the full remaining array every pass.
* **Worst-Case & Average-Case Time**:
  * All three are **O(n²)** due to nested iteration over unsorted pairs.
* **Space Complexity**:
  * All three are **in-place** with **O(1)** auxiliary memory.`,
    codeSnippet: {
      c: `// Space complexity verification: only O(1) auxiliary space used
int temp;    // 4 bytes
int i, j;    // 8 bytes
// Total extra memory = 12 bytes regardless of whether n is 10 or 1,000,000`,
      cpp: `// In-place guarantee: no dynamic memory allocations
void verifyInPlace(std::vector<int>& arr) {
    // Operations mutate arr in-place; auxiliary space is O(1)
}`,
      python: `# Space complexity: O(1) auxiliary memory
def memory_profile(n):
    # Only loop counter variables i and j reside on call stack
    pass`,
      java: `// O(1) auxiliary memory footprint
public class InPlaceVerification {
    // Modifies array directly; zero extra arrays created
}`,
    },
    summaryCards: [
      {
        title: 'O(1) Auxiliary Space',
        description: 'All three algorithms sort in-place, using zero extra memory beyond a few variables.',
      },
      {
        title: 'O(n) Best-Case for Adaptive',
        description: 'Bubble and Insertion Sort finish in linear time when the input is already sorted.',
      },
      {
        title: 'O(n²) Worst-Case Bound',
        description: 'When input is reversed, all three require quadratic time to resolve all inversions.',
      },
    ],
  },
];
