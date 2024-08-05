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
