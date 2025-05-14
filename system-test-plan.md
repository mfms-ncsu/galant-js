# System tests

TODO:
- figure out whether src/pages/Algorithms is used; it's referred to in index.js
- develop a system test plan, record it in system-test-plan.md [in progress]
- fix some of the glitches in the algorithms, especially lack of an ending announcement
- redo json file for the graphs using a file list
- redo json file for algorithms (file list already exists)
- look into whether memory can be garbage collected after algorithm execution; this should improve performance, but runs the risk of failure to save important information
- test using all platform/browser combinations
- publish version 2.1

These tests should be carried out with the following platform/brower combinations. You may have to reload the main page or even clear browser history (Opera, in particular, forces you to do this).

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

## Upload and Download

### Simple upload/download in editor window

1. Upload a graph
2. Make a few minor changes
3. Download to a different name/location and upload again
4. Do 1-3 with an algorithm

### Saving graph after edits in main window

1. Upload and load a graph
2. Do a sequence of edit operations that include an auto-layout followed by node move
3. Save the result to the edit window, checking that changes took effect
4. Download the graph and upload it again

### Exporting a graph

1. Upload and load a graph; do the same for a simple algorithm
2. Run the algorithm for a few steps
3. Export the graph to a file
4. Upload and load the exported graph and check that the export was correct

## Running algorithms

### Graph searches

Run these on both undirected and directed graphs; dfs-scc forces the graph to be directed. Make sure both the back and forward buttons/arrow keys work.

1. Run bfs on g-12; start at any node if undirected; at node 1 if directed; bfs does not have restart capability when some nodes are unreachable; also, the messages are a little out of sync with the algorithm actions.
2. Run dfs on g-12; start anywhere if undirected; start at nodes 7, 4, and 1; also try an illegal starting point before choosing 4 (e.g. 11); dfs could be more informative about the edges it is exploring; and it could let you know when it's done (same for other search algorithms)
3. Run dfs-scc on g-12, starting at node 3, then 1.

### Shortest paths

1. Run dijkstra on weighted_6 using node A as the starting point; results will differ if graph is undirected versus directed.
2. Run shortest_path on weighted_6 using node A as start node and node E as destination.

### Minimum spanning trees

1. Run prim on g-10 starting at node 2, then node 7. Results will differ.
2. Run kruskal on g-10.
