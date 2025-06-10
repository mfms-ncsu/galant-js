# System tests

TODO:
- [later] The showPositions() and showIndexes() methods only set the weights; they don't actually show them; the setWeights() method accomplishes that; probably should rename these methods
- [later] see if it's possible to get headers when content in a json file === null; have to be careful about <ul></ul> pairs
- test using all platform/browser combinations
- merge dev into main and get rid of all console logs
- publish version 2.1.1

## Test for speed

## New release

### Steps

- merge changes from a working branch into `dev`
- perform the tests below in `dev`
- merge changes into `main`
- get rid of console.log statements (should devise a script for this)
- add notes to version-history.md
- push changes, create version on github.com site
- deploy the version on the galant.csc.ncsu.edu site

## Testing overview

These tests should be carried out with the following platform/brower combinations. You may have to reload the main page or even clear browser history (Opera, in particular, forces you to do this). For most tests the Mac/Chrome combination is sufficient. All combinations should be tested for those marked with (!). These should be tested with keyboard shortcuts. Files marked with + are in the `src/testing` directory.

Tests should be done in the dev branch with console.log's added as needed. The logs should be removed in the main branch before deployment.

* Mac/Chrome
* Mac/Firefox
* Mac/Safari
* Mac/Opera
* Mac/Brave (oddly, the main page sometimes "jiggles")

* Linux/Chrome
* Linux/Firefox
* Linux/Opera

* Windows/Chrome
* Windows/Firefox
* Windows/Edge

Make sure there are tests that use keyboard shortcuts as well as buttons.

## Current bugs and inconveniences based on tests

### Editing

1. The drop down when right clicking on a node to make changes goes off screen if the node is too close to the bottom.
2. Labels/weights on nodes should change size with changes in node radius but they don't do that consistently.

### Algorithm execution

1. Node movements for algorithms that move nodes behave unexpectedly. They should not persist when user stops algorithm. And the impact on the algorithm should be consistent. It appears that the barycenter uses the new ordering to do its sorting, but does not count crossings correctly.

### Error handling

1. Graph load error messages could be a lot more specific about cause of error and line number.
2. Duplicate edges are not flagged as errors.
3. Parallel edges in opposite directions are rendered too close to each other.
4. Nodes with the same coordinates should be highlighted; this is also an issue during editing,
5. Layered graphs: edges connecting nodes on the same layer or on nonadjacent layers are not flagged as errors.
6. Nodes with the same layer and position do not cause a shift as they do during editing.

## Testing: Upload and Download

### (!) Simple upload/download in editor window

1. Upload a graph (e.g., triangle).
2. Make a few minor changes in the `Edit` window: add a node and edge, change a position, color a node/edge, change shape, add a weight and label
3. Download to a different name/location, close the window, focus on a different graph, and upload again

### Uploads with different node and edge attributes/variations; graphs are in src/testing

1. Load opposite-edge. There should be parallel edges 1,2 and 2,1. Check both directed and undirected.
2. Load attributes. The graph should be displayed as indicated in the text.

### (!) Saving graph after edits in main window

1. Upload and load a graph, e.g., dt-11 from Examples
2. Do a sequence of edit operations that include an auto-layout followed by node move
4. Make sure you can backtrack (z shortcut) from at least two auto-layouts with intervening node moves.
3. Save the result to the edit window, checking that changes took effect

### (!) Exporting a graph

1. Upload and load a graph (dt-11); do the same for a simple algorithm (bfs from Examples)
2. Run the algorithm for a few steps
3. Export the graph to a file
4. Upload and load the exported graph and check that the export was correct

## Testing: Running algorithms
 * run at least one algorithm on all platform/browser combinations; dfs-scc on g-12 is a good choice (see item 3 below)

### Graph searches

Run these on both undirected and directed graphs; dfs-scc forces the graph to be directed. Make sure both the back and forward buttons/arrow keys work.

1. Run bfs on g-12; start at any node if undirected; at node 1 if directed; bfs does not have restart capability when some nodes are unreachable; also, the messages are a little out of sync with the algorithm actions.
2. Run dfs on g-12; start anywhere if undirected; start at nodes 7, 4, and 1; also try an illegal starting point before choosing 4 (e.g. 11); dfs could be more informative about the edges it is exploring; and it could let you know when it's done (same for other search algorithms)
3. Run dfs-scc on g-12, starting at node 3, then 1.
4. During all of these runs, move nodes to see if the positions are preserved.

### Shortest paths

1. Run dijkstra on weighted_6 using node A as the starting point; results will differ if graph is undirected versus directed. If undirected, the shortest path to D is A-C-D; if directed, it is A-D.
2. Run shortest_path on weighted_6 using node A as start node and node E as destination. Algorithm should stop when destination is found.
(3.) [currently does not work] Try changing some edge weights before they are accessed. They should at least remain changed after algorithm execution. (apparently the only edits allowed are node movements)

### Minimum spanning trees

1. Run prim on g-10 starting at node 2, then node 7. Results will differ. The first run includes edge 2,9; the second edge 7,9
2. Run kruskal on g-10.

### Layered graphs

1. Load ex_20 and check if window resizing changes shape of graph
1. Run barycenter on ex_20; stop after one pass - minima reached at iteration 6: 32 crossings, 6 bottleneck; run again and continue with two passes; min at iteration 12 with 30 crossings, bottleneck 6
2. (!) Run layered-graph-stats on two_unequal_layers (Examples): crossings = 0, nonverticality and bottleneck verticality = 1; move node 4 to position 0: crossings = bottleneck = 2; nonverticality = 5, bottleneck = 4
3. Run layered-graph-stats on n42-t48v150: total crossings = 48, bottleneck crossings = 7, nonverticality = 150, and bottleneck verticality = 16
4. Move some nodes of n42-t48v150 to see if they shift correctly; do this both in edit mode and during algorithm execution
5. (!) Load shift-test. Move node B into position 4, occupied by E. Then move node J into position 1, occupied by G.

## Error handling

### Graph input

1. (!) Load all of of the graphs in the `src/testing` directory except for opposite-edge, same-coordinates, same-position, shift-test, triangle, and two-unequal layers. There should be error messages reflecting what's wrong with these graphs. [!!! duplicate edge should result in an error, but des not !!!] [!!! errors on layered graphs are not detected !!!]
3. (!) Load same-coordinates. Instead of an error, the nodes should land on top of each other and allow user to fix this by editing.
4. (!) Load same-position. In this case nodes should shift appropriately: node 3 should end up in position 1 of layer 0. [!!! does not work !!!]

### Algorithm execution

1. (!) Run `color-nonexistent-node.js` on triangle (or any other graph); check console.
2. (!) Run `infinite-loop.js` on triangle
