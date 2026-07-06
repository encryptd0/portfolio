/* DSA Roadmap — static problem catalog (the only data source).
   Assigns one frozen object to window.DSA_DATA. Loaded with a <script> tag
   so the site works over file:// with no server and no fetch(). */
(function () {
  'use strict';

  function p(title, slug, difficulty, isPremium) {
    return {
      title: title,
      slug: slug,
      url: 'https://leetcode.com/problems/' + slug + '/',
      difficulty: difficulty,
      isPremium: !!isPremium
    };
  }

  var categories = [
    {
      id: 'arrays-hashing',
      title: 'Arrays & Hashing',
      order: 1,
      blurb: 'The foundation of everything else: arrays, hash maps and hash sets. Master lookups, counting and de-duplication before moving on.',
      unlocks: ['two-pointers', 'stack'],
      problems: [
        p('Contains Duplicate', 'contains-duplicate', 'Easy'),
        p('Valid Anagram', 'valid-anagram', 'Easy'),
        p('Two Sum', 'two-sum', 'Easy'),
        p('Group Anagrams', 'group-anagrams', 'Medium'),
        p('Top K Frequent Elements', 'top-k-frequent-elements', 'Medium'),
        p('Encode and Decode Strings', 'encode-and-decode-strings', 'Medium', true),
        p('Product of Array Except Self', 'product-of-array-except-self', 'Medium'),
        p('Valid Sudoku', 'valid-sudoku', 'Medium'),
        p('Longest Consecutive Sequence', 'longest-consecutive-sequence', 'Medium')
      ]
    },
    {
      id: 'two-pointers',
      title: 'Two Pointers',
      order: 2,
      blurb: 'Walk two indices toward or away from each other to turn quadratic scans into linear ones. A prerequisite for sliding window and many array tricks.',
      unlocks: ['binary-search', 'sliding-window', 'linked-list'],
      problems: [
        p('Valid Palindrome', 'valid-palindrome', 'Easy'),
        p('Two Sum II - Input Array Is Sorted', 'two-sum-ii-input-array-is-sorted', 'Medium'),
        p('3Sum', '3sum', 'Medium'),
        p('Container With Most Water', 'container-with-most-water', 'Medium'),
        p('Trapping Rain Water', 'trapping-rain-water', 'Hard')
      ]
    },
    {
      id: 'stack',
      title: 'Stack',
      order: 3,
      blurb: 'Last-in, first-out. Stacks handle matching pairs, monotonic sequences and deferred work — a small tool that shows up everywhere.',
      unlocks: [],
      problems: [
        p('Valid Parentheses', 'valid-parentheses', 'Easy'),
        p('Min Stack', 'min-stack', 'Medium'),
        p('Evaluate Reverse Polish Notation', 'evaluate-reverse-polish-notation', 'Medium'),
        p('Generate Parentheses', 'generate-parentheses', 'Medium'),
        p('Daily Temperatures', 'daily-temperatures', 'Medium'),
        p('Car Fleet', 'car-fleet', 'Medium'),
        p('Largest Rectangle in Histogram', 'largest-rectangle-in-histogram', 'Hard')
      ]
    },
    {
      id: 'binary-search',
      title: 'Binary Search',
      order: 4,
      blurb: 'Halve the search space on every step. Beyond sorted arrays, learn to binary-search the answer itself.',
      unlocks: ['trees'],
      problems: [
        p('Binary Search', 'binary-search', 'Easy'),
        p('Search a 2D Matrix', 'search-a-2d-matrix', 'Medium'),
        p('Koko Eating Bananas', 'koko-eating-bananas', 'Medium'),
        p('Find Minimum in Rotated Sorted Array', 'find-minimum-in-rotated-sorted-array', 'Medium'),
        p('Search in Rotated Sorted Array', 'search-in-rotated-sorted-array', 'Medium'),
        p('Time Based Key-Value Store', 'time-based-key-value-store', 'Medium'),
        p('Median of Two Sorted Arrays', 'median-of-two-sorted-arrays', 'Hard')
      ]
    },
    {
      id: 'sliding-window',
      title: 'Sliding Window',
      order: 5,
      blurb: 'Maintain a moving range over an array or string instead of recomputing from scratch. The go-to pattern for “longest / shortest subarray such that…” problems.',
      unlocks: [],
      problems: [
        p('Best Time to Buy and Sell Stock', 'best-time-to-buy-and-sell-stock', 'Easy'),
        p('Longest Substring Without Repeating Characters', 'longest-substring-without-repeating-characters', 'Medium'),
        p('Longest Repeating Character Replacement', 'longest-repeating-character-replacement', 'Medium'),
        p('Permutation in String', 'permutation-in-string', 'Medium'),
        p('Minimum Window Substring', 'minimum-window-substring', 'Hard'),
        p('Sliding Window Maximum', 'sliding-window-maximum', 'Hard')
      ]
    },
    {
      id: 'linked-list',
      title: 'Linked List',
      order: 6,
      blurb: 'Pointer manipulation without random access: reversal, fast & slow pointers, and merging. Great practice for careful, off-by-one-free code.',
      unlocks: ['trees'],
      problems: [
        p('Reverse Linked List', 'reverse-linked-list', 'Easy'),
        p('Merge Two Sorted Lists', 'merge-two-sorted-lists', 'Easy'),
        p('Reorder List', 'reorder-list', 'Medium'),
        p('Remove Nth Node From End of List', 'remove-nth-node-from-end-of-list', 'Medium'),
        p('Copy List with Random Pointer', 'copy-list-with-random-pointer', 'Medium'),
        p('Add Two Numbers', 'add-two-numbers', 'Medium'),
        p('Linked List Cycle', 'linked-list-cycle', 'Easy'),
        p('Find the Duplicate Number', 'find-the-duplicate-number', 'Medium'),
        p('LRU Cache', 'lru-cache', 'Medium'),
        p('Merge k Sorted Lists', 'merge-k-sorted-lists', 'Hard'),
        p('Reverse Nodes in k-Group', 'reverse-nodes-in-k-group', 'Hard')
      ]
    },
    {
      id: 'trees',
      title: 'Trees',
      order: 7,
      blurb: 'Recursion made visible. Traversals, depth, balance and binary search trees — the single most common interview topic.',
      unlocks: ['tries', 'heap-priority-queue', 'backtracking'],
      problems: [
        p('Invert Binary Tree', 'invert-binary-tree', 'Easy'),
        p('Maximum Depth of Binary Tree', 'maximum-depth-of-binary-tree', 'Easy'),
        p('Diameter of Binary Tree', 'diameter-of-binary-tree', 'Easy'),
        p('Balanced Binary Tree', 'balanced-binary-tree', 'Easy'),
        p('Same Tree', 'same-tree', 'Easy'),
        p('Subtree of Another Tree', 'subtree-of-another-tree', 'Easy'),
        p('Lowest Common Ancestor of a Binary Search Tree', 'lowest-common-ancestor-of-a-binary-search-tree', 'Medium'),
        p('Binary Tree Level Order Traversal', 'binary-tree-level-order-traversal', 'Medium'),
        p('Binary Tree Right Side View', 'binary-tree-right-side-view', 'Medium'),
        p('Count Good Nodes in Binary Tree', 'count-good-nodes-in-binary-tree', 'Medium'),
        p('Validate Binary Search Tree', 'validate-binary-search-tree', 'Medium'),
        p('Kth Smallest Element in a BST', 'kth-smallest-element-in-a-bst', 'Medium'),
        p('Construct Binary Tree from Preorder and Inorder Traversal', 'construct-binary-tree-from-preorder-and-inorder-traversal', 'Medium'),
        p('Binary Tree Maximum Path Sum', 'binary-tree-maximum-path-sum', 'Hard'),
        p('Serialize and Deserialize Binary Tree', 'serialize-and-deserialize-binary-tree', 'Hard')
      ]
    },
    {
      id: 'tries',
      title: 'Tries',
      order: 8,
      blurb: 'Prefix trees: store strings character by character for fast prefix lookups, autocomplete and word search on grids.',
      unlocks: [],
      problems: [
        p('Implement Trie (Prefix Tree)', 'implement-trie-prefix-tree', 'Medium'),
        p('Design Add and Search Words Data Structure', 'design-add-and-search-words-data-structure', 'Medium'),
        p('Word Search II', 'word-search-ii', 'Hard')
      ]
    },
    {
      id: 'heap-priority-queue',
      title: 'Heap / Priority Queue',
      order: 9,
      blurb: 'Always know the smallest or largest element in O(log n). Essential for top-k problems, scheduling and streaming medians.',
      unlocks: ['intervals', 'greedy', 'advanced-graphs'],
      problems: [
        p('Kth Largest Element in a Stream', 'kth-largest-element-in-a-stream', 'Easy'),
        p('Last Stone Weight', 'last-stone-weight', 'Easy'),
        p('K Closest Points to Origin', 'k-closest-points-to-origin', 'Medium'),
        p('Kth Largest Element in an Array', 'kth-largest-element-in-an-array', 'Medium'),
        p('Task Scheduler', 'task-scheduler', 'Medium'),
        p('Design Twitter', 'design-twitter', 'Medium'),
        p('Find Median from Data Stream', 'find-median-from-data-stream', 'Hard')
      ]
    },
    {
      id: 'backtracking',
      title: 'Backtracking',
      order: 10,
      blurb: 'Systematically explore every choice, undoing dead ends as you go. Subsets, permutations and constraint puzzles all live here.',
      unlocks: ['graphs', '1d-dp'],
      problems: [
        p('Subsets', 'subsets', 'Medium'),
        p('Combination Sum', 'combination-sum', 'Medium'),
        p('Permutations', 'permutations', 'Medium'),
        p('Subsets II', 'subsets-ii', 'Medium'),
        p('Combination Sum II', 'combination-sum-ii', 'Medium'),
        p('Word Search', 'word-search', 'Medium'),
        p('Palindrome Partitioning', 'palindrome-partitioning', 'Medium'),
        p('Letter Combinations of a Phone Number', 'letter-combinations-of-a-phone-number', 'Medium'),
        p('N-Queens', 'n-queens', 'Hard')
      ]
    },
    {
      id: 'graphs',
      title: 'Graphs',
      order: 11,
      blurb: 'BFS, DFS, topological sort and union-find on grids and adjacency lists. Model the problem as nodes and edges, then walk it.',
      unlocks: ['advanced-graphs', '2d-dp', 'math-geometry'],
      problems: [
        p('Number of Islands', 'number-of-islands', 'Medium'),
        p('Clone Graph', 'clone-graph', 'Medium'),
        p('Max Area of Island', 'max-area-of-island', 'Medium'),
        p('Pacific Atlantic Water Flow', 'pacific-atlantic-water-flow', 'Medium'),
        p('Surrounded Regions', 'surrounded-regions', 'Medium'),
        p('Rotting Oranges', 'rotting-oranges', 'Medium'),
        p('Walls and Gates', 'walls-and-gates', 'Medium', true),
        p('Course Schedule', 'course-schedule', 'Medium'),
        p('Course Schedule II', 'course-schedule-ii', 'Medium'),
        p('Redundant Connection', 'redundant-connection', 'Medium'),
        p('Number of Connected Components in an Undirected Graph', 'number-of-connected-components-in-an-undirected-graph', 'Medium', true),
        p('Graph Valid Tree', 'graph-valid-tree', 'Medium', true),
        p('Word Ladder', 'word-ladder', 'Hard')
      ]
    },
    {
      id: '1d-dp',
      title: '1-D Dynamic Programming',
      order: 12,
      blurb: 'Break a problem into overlapping subproblems along one dimension. Learn to spot the recurrence, then cache it.',
      unlocks: ['2d-dp', 'bit-manipulation'],
      problems: [
        p('Climbing Stairs', 'climbing-stairs', 'Easy'),
        p('Min Cost Climbing Stairs', 'min-cost-climbing-stairs', 'Easy'),
        p('House Robber', 'house-robber', 'Medium'),
        p('House Robber II', 'house-robber-ii', 'Medium'),
        p('Longest Palindromic Substring', 'longest-palindromic-substring', 'Medium'),
        p('Palindromic Substrings', 'palindromic-substrings', 'Medium'),
        p('Decode Ways', 'decode-ways', 'Medium'),
        p('Coin Change', 'coin-change', 'Medium'),
        p('Maximum Product Subarray', 'maximum-product-subarray', 'Medium'),
        p('Word Break', 'word-break', 'Medium'),
        p('Longest Increasing Subsequence', 'longest-increasing-subsequence', 'Medium'),
        p('Partition Equal Subset Sum', 'partition-equal-subset-sum', 'Medium')
      ]
    },
    {
      id: 'advanced-graphs',
      title: 'Advanced Graphs',
      order: 13,
      blurb: 'Shortest paths and spanning trees: Dijkstra, Prim, Kruskal, Bellman-Ford and Eulerian paths for when plain BFS is not enough.',
      unlocks: [],
      problems: [
        p('Reconstruct Itinerary', 'reconstruct-itinerary', 'Hard'),
        p('Min Cost to Connect All Points', 'min-cost-to-connect-all-points', 'Medium'),
        p('Network Delay Time', 'network-delay-time', 'Medium'),
        p('Swim in Rising Water', 'swim-in-rising-water', 'Hard'),
        p('Alien Dictionary', 'alien-dictionary', 'Hard', true),
        p('Cheapest Flights Within K Stops', 'cheapest-flights-within-k-stops', 'Medium')
      ]
    },
    {
      id: '2d-dp',
      title: '2-D Dynamic Programming',
      order: 14,
      blurb: 'The same idea with a grid of subproblems: two sequences, two indices, or a matrix. The hardest classics on the list live here.',
      unlocks: [],
      problems: [
        p('Unique Paths', 'unique-paths', 'Medium'),
        p('Longest Common Subsequence', 'longest-common-subsequence', 'Medium'),
        p('Best Time to Buy and Sell Stock with Cooldown', 'best-time-to-buy-and-sell-stock-with-cooldown', 'Medium'),
        p('Coin Change II', 'coin-change-ii', 'Medium'),
        p('Target Sum', 'target-sum', 'Medium'),
        p('Interleaving String', 'interleaving-string', 'Medium'),
        p('Longest Increasing Path in a Matrix', 'longest-increasing-path-in-a-matrix', 'Hard'),
        p('Distinct Subsequences', 'distinct-subsequences', 'Hard'),
        p('Edit Distance', 'edit-distance', 'Medium'),
        p('Burst Balloons', 'burst-balloons', 'Hard'),
        p('Regular Expression Matching', 'regular-expression-matching', 'Hard')
      ]
    },
    {
      id: 'bit-manipulation',
      title: 'Bit Manipulation',
      order: 15,
      blurb: 'AND, OR, XOR and shifts. A small bag of tricks that turns some “impossible without extra memory” problems into one-liners.',
      unlocks: ['math-geometry'],
      problems: [
        p('Single Number', 'single-number', 'Easy'),
        p('Number of 1 Bits', 'number-of-1-bits', 'Easy'),
        p('Counting Bits', 'counting-bits', 'Easy'),
        p('Reverse Bits', 'reverse-bits', 'Easy'),
        p('Missing Number', 'missing-number', 'Easy'),
        p('Sum of Two Integers', 'sum-of-two-integers', 'Medium'),
        p('Reverse Integer', 'reverse-integer', 'Medium')
      ]
    },
    {
      id: 'greedy',
      title: 'Greedy',
      order: 16,
      blurb: 'Take the locally best choice and prove it stays globally best. Short solutions, tricky correctness arguments.',
      unlocks: [],
      problems: [
        p('Maximum Subarray', 'maximum-subarray', 'Medium'),
        p('Jump Game', 'jump-game', 'Medium'),
        p('Jump Game II', 'jump-game-ii', 'Medium'),
        p('Gas Station', 'gas-station', 'Medium'),
        p('Hand of Straights', 'hand-of-straights', 'Medium'),
        p('Merge Triplets to Form Target Triplet', 'merge-triplets-to-form-target-triplet', 'Medium'),
        p('Partition Labels', 'partition-labels', 'Medium'),
        p('Valid Parenthesis String', 'valid-parenthesis-string', 'Medium')
      ]
    },
    {
      id: 'intervals',
      title: 'Intervals',
      order: 17,
      blurb: 'Sort by start, then sweep: merging, inserting and scheduling overlapping ranges. Calendar math, done properly.',
      unlocks: [],
      problems: [
        p('Insert Interval', 'insert-interval', 'Medium'),
        p('Merge Intervals', 'merge-intervals', 'Medium'),
        p('Non-overlapping Intervals', 'non-overlapping-intervals', 'Medium'),
        p('Meeting Rooms', 'meeting-rooms', 'Easy', true),
        p('Meeting Rooms II', 'meeting-rooms-ii', 'Medium', true),
        p('Minimum Interval to Include Each Query', 'minimum-interval-to-include-each-query', 'Hard')
      ]
    },
    {
      id: 'math-geometry',
      title: 'Math & Geometry',
      order: 18,
      blurb: 'Matrix rotation, spirals and number tricks — the grab-bag of problems that reward careful simulation over clever theory.',
      unlocks: [],
      problems: [
        p('Rotate Image', 'rotate-image', 'Medium'),
        p('Spiral Matrix', 'spiral-matrix', 'Medium'),
        p('Set Matrix Zeroes', 'set-matrix-zeroes', 'Medium'),
        p('Happy Number', 'happy-number', 'Easy'),
        p('Plus One', 'plus-one', 'Easy'),
        p('Pow(x, n)', 'powx-n', 'Medium'),
        p('Multiply Strings', 'multiply-strings', 'Medium'),
        p('Detect Squares', 'detect-squares', 'Medium')
      ]
    }
  ];

  var total = 0;
  categories.forEach(function (c) {
    c.count = c.problems.length;
    total += c.count;
  });

  window.DSA_DATA = Object.freeze({
    meta: {
      source: 'NeetCode 150 roadmap (neetcode.io)',
      note: 'All problems link out to LeetCode; this site hosts no problem content.',
      total: total
    },
    categories: categories
  });
})();
