# System tests

TODO:
- [later] The showPositions() and showIndexes() methods for layered graphs only set the weights; they don't actually show them; the setWeights() method accomplishes that; probably should rename these methods
- [later] see if it's possible to get headers when content in a json file === null; have to be careful about <ul></ul> pairs
- test using all platform/browser combinations
- merge dev into main and get rid of all console logs
- publish version 3.0

## New release

### Steps

- merge changes from a working branch into `dev`
- perform the tests below in `dev`
- add notes to version-history.md
- put version number in the help page: see https://docs.google.com/document/d/1_CX-rv_dFlnWL3BacHnernQ4tapzhmhPUzUx2cWaBc0/view
- merge changes into `main`
- get rid of console.log statements (should devise a script for this)
- push changes, create version on github.com site
- add version history notes to the comments on the version
- to deploy, log on to `galant.csc.ncsu.edu` and follow commands in `deploy.sh` by hand
    the path to the repository clone is `/var/www/galant-js`
- make changes in user documentation and bugs document as needed

## Testing overview

These tests should be carried out with the following platform/brower combinations. You may have to reload the main page or even clear browser history (Opera, in particular, forces you to do this). For most tests the Mac/Chrome combination is sufficient.
All combinations should be tested for those marked with (!). These should be tested with keyboard shortcuts.
Files not included in the examples are marked (+) and are in the `0-system-test-files` directory.

Tests should be done in the dev branch with console.log's added as needed. The logs should be removed in the main branch before deployment.

* Mac/Chrome
* Mac/Firefox
* Mac/Safari

* Linux/Chrome
* Linux/Firefox
* Linux/Opera

* Windows/Chrome
* Windows/Firefox
* Windows/Edge

Make sure there are tests that use keyboard shortcuts as well as buttons.

## Testing: Upload and Download

### ***(!) Simple upload/download in editor window***

1. Upload (+) `triangle`.
2. Make a few minor changes in the `Edit` window: add a node and edge, change a position, color a node/edge, change shape, add a weight and label
2'. Make some changes in the main window and save (`s`)
3. Download to a different name/location, close the window, focus on a different graph, and upload again

### Uploads with different node and edge attributes/variations; graphs are in `0-system-test-files`

1. Load (+) opposite-edge. There should be parallel edges 1,2 and 2,1. Check both directed and undirected.
2. Load (+) attributes. The graph should be displayed as indicated in the text.

### ***(!) Saving graph after edits in main window***

1. Load a graph, e.g., dt-11 from Examples
2. Do a sequence of edit operations that include an auto-layout followed by node move
3. Make sure you can undo (z shortcut) and redo (y shortcut) several times after at least two auto-layouts with intervening node moves.
4. Set the label and set/change the weight of a node and of an edge.
5. Save the result to the edit window, checking that changes took effect

### ***(!) Exporting a graph***

1. Reload graph `dt-11` from Examples and algorithm `bfs` from Examples
2. Run the algorithm for a few steps
3. Export the graph to a file
4. Upload and load the exported graph and check that the export was correct

## ***(!) Testing: Keyboard shortcuts***

1. Try out all four `Ctrl-Shift` keyboard shortcuts in the two edit windows.
2. Also try out the corresponding buttons.
3. Note any irregularities in the bugs-and-annoyances document.
 
## Testing: Running algorithms

### Simple algorithms

1. Run (+) `position-test.js` on `for-position-test.gph`
- the first step lines up nodes 0, 1, 2 in the respective positions along the y = 0 line
- second step puts nodes 2, 0 in positions 0, 2, respectively along y = 1
- the third step puts nodes 0, 1 in positions 1, 2 along y = 2 

2. Run `mark-targets.js` on any graph with more than three edges. The algorithm higlights each edge and marks its target unless it's already marked, in which case it unmarks it

### Graph searches

Run these on both undirected and directed graphs; dfs-scc forces the graph to be directed. Make sure both the back and forward buttons/arrow keys work. The restart feature does not work consistently for some reason. This may be slow reaction for algorithms that ask for a start node.

1. Run bfs on g-12; start at any node if undirected; at node 1 if directed; bfs does not have restart capability when some nodes are unreachable. ***Displayed messages may persist when an algorithm terminates, sometines resulting in strange behavior.***
2. Run dfs on g-12; start anywhere if undirected; if directed, start at nodes 7, 4, and 1; also try an illegal starting point before choosing 4 (e.g. 11); dfs could be more informative about the edges it is exploring; and it could let you know when it's done (same for other search algorithms)
3. ***(!) Run dfs-scc on g-12,*** starting at node 3, then 1. Use the restart feature to do a second run with a different sequence. *Restart will ignore changes to the graph*, e.g., changing directedness of edges [restart may not work if you run the algorithm to the end; not clear why]
4. ***(!) During at least one of these runs,*** move nodes to see if the positions are preserved.

### Shortest paths

1. Run dijkstra on weighted_6 using node A as the starting point; results will differ if graph is undirected versus directed. If undirected, the shortest path to D is A-C-D; if directed, it is A-D.
2. Run shortest_path on weighted_6 using node A as start node and node E as destination. Algorithm should stop when destination is found.
(3.) [currently does not work] Try changing some edge weights before they are accessed. They should at least remain changed after algorithm execution. (apparently the only edits allowed are node movements)

### Minimum spanning trees

1. Run prim on g-10 starting at node 2, then starting on node 7. Results will differ. The first run includes edge 2,9; the second edge 7,9
2. Run kruskal on g-10.

### Sorting

***(!) Load sorting_13*** and run both insertion_sort and ***(!)quicksort*** on it.

### Layered graphs

1. Load ex_20 and check if window resizing changes shape of graph
2. Run barycenter on ex_20; stop after one pass - minima reached at iteration 6: 32 crossings, min bottleneck is 6 at iteration 0; run again and continue with two passes; min at iteration 12 with 30 crossings; min bottleneck is still 6.
3. ***(!) Run layered-graph-stats on (+) two_unequal_layers***: crossings = 0, nonverticality and bottleneck verticality = 1; move node 4 to position 0: crossings = bottleneck = 2; nonverticality = 5, bottleneck = 4
4. Run layered-graph-stats on n42-t48v150: total crossings = 48, bottleneck crossings = 7, nonverticality = 150, and bottleneck verticality = 16
5. Move some nodes of n42-t48v150 to see if they shift correctly; do this both in edit mode and during algorithm execution; during algorithm execution, check that positions revert to those specified by algorithm at the next step, and see what happens on algorithm completion
6. ***(!) Load (+) shift-test.*** Move node B into position 4, occupied by E. Then move node J into position 1, occupied by G. Move F into position occupied by H and D into position occupied by E. Try various other moves, both those resulting in shifts and moving into empy spaces.

## Trees

### Arbitrary trees

#### ***(!) Run (+) `sequencing.js` on (+) `empty.tree`***
- should create four nodes: 0, 1, 2, 3
- nodes 1, 2, 3 will become children of 0 in that order
- the order is changed to 2, 1, 3
- the order is changed to 3, 1, 2
- the order is changed to 3, 2, 1 (`setChildren` works with a subset of the children)
- an error occurs: no edge from 1 to 0
- it is still possible to step back (but not necessarily forward)

#### Preorder and postorder

Run `preorder_traversal.js` and `postorder_traversal.js` on (+) `tree-for-traversals.tree`

### Binary search trees

#### Insertion

start with (+) `empty.tree`

7
4,3 - insert left twice
5 - insert right with left present
6 - insert right
9 - insert right with left present
10,11 - insert right twice
8 - insert left with right present

#### deletion

create tree with insertion sequence 7,1,8,5,3,2,4 or use (+) `bs-test-example.tree`
(-7) - finding greatest predecessor and shifting with right dummy
(-1) - shift with left dummy
(-4) - leaf

### Red/black trees

#### insertion sequence 
- see Goodrich and Tamassia, *Algorithm Design*, pp. 175-6
- or Goodrich, Tamassia and Golwasser *Data Structures & Algorithms*, pp. 515-6

* 4, 7
* 12 - rotate so 7 becomes root (LL)
* 15 - recolor so that 15 only is red
* 3, 5
* 14 - rotate so 14 has 12 and 15 as children (RL)
* 18 - recolor 12 and 15 black
* 16 - rotate so 16 has 15 and 18 as children (LR)
* 17 - a recolor followed by a rotation that puts 14 at the root (RR)

#### deletion sequence
 - see Goodrich and Tamassia, *Algorithm Design*, pp. 182-3

Start with tree from insertion sequence, saved as (+) `rb-test-example.tree`

* -3
* -12 double black => restructure with subtree [4,5,7]
* -17
* -18 double black => recolor
* -15
* -16 double black => adjustment followed by recoloring


## Error handling

### Graph input

1. ***(!) Load all of of the (+) graphs with prefix `bad`*** (there are six). There should be error messages reflecting what's wrong with these graphs. You should be able to select and upload all of these at once.
2. Load (+) same-coordinates. Instead of an error, node 3 will land on top of 0 and allow user to fix by moving 3. Ideally, node 3 should be marked in some way or a warning message be given. Detection requires iterating through all nodes with a set of known coordinates.
3. Load (+) same-position. In this case nodes should shift appropriately: node 3 should end up in position 1 of layer 0. [!!! does not work !!!]
4. Load (+) `edge-connecting-nonadjacent-layers` and `edge=on-same-layer`; should result in relevant error messages

### Algorithm execution

In both of these runs, it should be possible to undo previous steps.

1. ***(!) Run (+) `color-nonexistent-node.js` on (+) triangle*** (or any other graph); check console.
2. ***(!) Run (+) `infinite-loop.js` on triangle***

-----------------------------------

## Current bugs and inconveniences based on tests

### Keyboard shortcuts

- Ctrl-Shift-L does not work on Linux/Chrome in the algorithm editor; it does work in the graph editor; other shortcuts are finicky in both editors

### Editing

1. The drop down when right clicking on a node to make changes goes off screen if the node is too close to the bottom. Workaround is to pan and zoom.

### Algorithm execution

1. Node movements for algorithms that move nodes behave unexpectedly. They should not persist when user stops algorithm. And the impact on the algorithm should be consistent. It appears that the barycenter uses the new ordering to do its sorting, but does not count crossings correctly.

### Error handling

1. Parallel edges in opposite directions are rendered too close to each other.
2. Nodes with the same coordinates should be highlighted or a warning issued; this is also an issue during editing,
3. Nodes with the same layer and position do not cause a shift as they do during editing.
