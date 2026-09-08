import { VisualizeAlgoId } from '../services/videoStorage';

export interface VisualizeAlgorithmConfig {
  id: VisualizeAlgoId;
  algorithmId: string;
  mappingKey?: string;
  orderNumber: string;
  name: string;
  subtitle: string;
  description: string;
  chips: string[];
  uploadLabel: string;
  videoLabel: string;
  timeComplexity: string;
  spaceComplexity: string;
  stability: string;
  keyTakeaways: string[];
}

export const VISUALIZE_ALGORITHMS: VisualizeAlgorithmConfig[] = [
  {
    id: 'bubble',
    algorithmId: 'bubble-sort',
    mappingKey: 'visualizeVideos/sorting/bubble-sort',
    orderNumber: '01',
    name: 'Bubble Sort',
    subtitle: 'Adjacent pair comparison & bubbling',
    description:
      'Repeatedly steps through the list, compares adjacent element pairs, and swaps them if they are in the wrong order until the array is fully sorted.',
    chips: ['O(n²) Worst Time', 'O(1) Space', 'Stable', 'Adjacent Swapping'],
    uploadLabel: 'Upload Bubble Sort Video',
    videoLabel: 'Bubble Sort Video',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    stability: 'Stable',
    keyTakeaways: [
      'The largest unsorted element "bubbles" to its permanent rightmost position in each pass.',
      'Adjacent pair swaps preserve relative order of equal items, ensuring stability.',
      'Best-case runtime is linear O(n) when already sorted with an early-exit swapped flag.',
    ],
  },
  {
    id: 'insertion',
    algorithmId: 'insertion-sort',
    mappingKey: 'visualizeVideos/sorting/insertion-sort',
    orderNumber: '02',
    name: 'Insertion Sort',
    subtitle: 'Adaptive shifting into sorted prefix',
    description:
      'Builds the sorted array one element at a time by picking each key and shifting preceding larger elements to insert it into its exact ordered position.',
    chips: ['O(n²) Worst Time', 'O(1) Space', 'Stable', 'Adaptive Shifting'],
    uploadLabel: 'Upload Insertion Sort Video',
    videoLabel: 'Insertion Sort Video',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    stability: 'Stable',
    keyTakeaways: [
      'Grows a sorted partition on the left, shifting larger elements one index right.',
      'Highly adaptive: takes linear O(n) time on nearly sorted or reverse-pre-filtered lists.',
      'Serves as the high-speed base sort for small blocks in production Timsort and Introsort.',
    ],
  },
  {
    id: 'selection',
    algorithmId: 'selection-sort',
    mappingKey: 'visualizeVideos/sorting/selection-sort',
    orderNumber: '03',
    name: 'Selection Sort',
    subtitle: 'Scan minimum & swap into position',
    description:
      'Divides the array into sorted and unsorted regions, repeatedly scans the unsorted region to find the minimum value, and swaps it into place.',
    chips: ['O(n²) Time Always', 'O(1) Space', 'Unstable', 'Minimum Selection'],
    uploadLabel: 'Upload Selection Sort Video',
    videoLabel: 'Selection Sort Video',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    stability: 'Unstable',
    keyTakeaways: [
      'Executes at most n - 1 total swaps across the entire sorting lifecycle.',
      'Always performs O(n²) comparisons even if the array is already completely sorted.',
      'Unstable in its standard implementation due to long-distance swaps over equal values.',
    ],
  },
];
