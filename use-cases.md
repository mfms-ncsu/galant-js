# The following currently do not work as desired, can be test cases as well

## Autolayout

In the following sequence, moving the node destroys the effect of the auto-layout.
* load a graph
* apply auto-layout
* use mouse to move a node
* save the graph

The following should work as well, with auto-layout treated as a single edit state.
* load a graph
* apply a sequence of node movements with some auto-layouts included
* do some undo/redo sequences
* save the graph at various points in the sequence

## Scaling with respect to the original graph
* load a graph
* move a single node x, noticeably far from its original position
* save the graph
The nodes other than x should retain their positions in the text version of the graph and the position of x should be scaled appropriately.
Currently, (it appears that) the coordinates in the saved text file reflect physical positions of nodes on the screen at the time of loading.
Coordinates are constrained to be integer, so rounding may be required.
Sorting graphs and layered graphs are special cases: their coordinates represent integer grid points, typically with x- and y-coordinates sequential starting at 0 or 1. These graphs are not included in this use-case.

## Sorting without use of artificial gaps
* rewrite insertion sort and Quicksort without `HORIZONTAL_GAP` and `VERTICAL_GAP`, adding or subtracting `1` to cooedinates instead 
* load a sorting graph
* run each of the algorithms
Success here shows that the scaling is maintained during algorithm execution.
And it allows design of animations using grid points for placement of nodes.

## Graphs with nodes on integer grid points
Graphs with nodes having small x- and y-coordinates present a special challenge when it comes to the scaling of node positions. A problem arises when node movement ends up putting two or more nodes at the same scaled location (this situation can arise even with larger coordinates). There are three possible approaches.
* abandon scaling and use physical locations, alerting user that this has happened, so that they can undo and try again
* alert the user to a conflict and do nothing
* adjust positions of nodes to make room
The last option is desirable for sorting graphs and layered graphs. The user may want to rearrange the order of nodes with the same y-coordinate. Suppose, for example, nodes 1, 2, 3, and 4 appear in that order. The user wishes the order to be 1, 4, 2, 3. To accomplish this, they move node 4 to a position between nodes 1 and 2, closer to 2. The graph editor would shift nodes 2 and 3 to the left and insert node 4.
Another way to handle this situation would be possible if there were a way to select and move a group of nodes. The Cytoscape user interface has this capability but it may have to be implemented "by hand" in Galant.