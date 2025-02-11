# Bugs and Issues in Galant-js

In this document, some current bugs and issues in the galant-js
project are described. The purpose of this document is to record
these issues so that they can be fixed at a later date. If you fix
one of these bugs or issues, please delete it from this document. If
you discover a new bug or issue, please add it to this document. You
don't have to use the same format I used to record a bug, but please
add at least some kind of description of how to recreate the bug or
where to find the issue.

## List of Bugs and Issues

### Prompts can occur twice

**Date:** 2/11/25

**Author:** Krisjian Smith

**Classification:** Bug

**Severity:** Minor

**Description:** Sometimes, the prompt that asks which node to start on
in Djikstra's algorithm displays twice.

**Steps to recreate:**
1. Load the NCSU logo graph with the Djikstra's Shortest Path
algorithm
2. Step forward in the algorithm until the "Enter starting node:" prompt
appears
3. Click the forward button again, without entering anything in the
prompt box. Visually, nothing should change, but a message will be
displayed in the developer console
4. Enter "q" in the prompt and click "Submit"

**Expected result:** The prompt should disappear and the algorithm
should begin executing

**Actual result:** Another empty prompt box appears. Whatever you enter
in this box is ignored, and when you click "Submit," the algorithm begins
as you would expect.

### Inconsistent syntax with the other() method in Djikstra's algorithm

**Date:** 2/11/25

**Author:** Krisjian Smith

**Classification:** Algorithm Bug

**Severity:** Minor

**Description:** In Djikstra's algorithm, on lines 91 and 97, the syntax
of the "other" method is inconsistent. On line 91, it is used as
`other(edge, node)`, but on line 97, it is used as `other(node, edge)`.
I'm not sure if this is intended or not, but it would make sense to only
allow one order of the arguments to this method.

### Unable to edit or delete edges

**Date:** 2/11/25

**Author:** Krisjian Smith

**Classification:** Missing Functionality

**Severity:** Major

**Description:** There is currently no way to delete or edit edges in
a graph. With nodes, you can left-click the node and edit or delete the
node. With edges, however, no menu appears, meaning you cannot delete
the edge or add weights to edges.

### Djikstra's algorithm does not exit after failing to add all nodes

**Date:** 2/11/25

**Author:** Krisjian Smith

**Classification:** Algorithm Bug

**Severity:** Minor

**Description:** In Djikstra's algorithm, the algorithm can fail to add
all nodes. This is expected, as graphs can be disconnected. When the
algorithm fails to add all nodes, however, it does not stop the
algorithm, despite the fact that there is code in the algorithm to
detect this scenario. The algorithm will continue to try to run, throwing
errors into the console.

**Suggested Fix:** Add a `stop()` method that the algorithm can use to
stop its execution gracefully if it runs into an error state like this

### Hacky code in AlgorithmControlsComponent

**Date:** 2/11/25

**Author:** Krisjian Smith

**Classification:** Poor code practice

**Severity:** Minor

**Location:** src/pages/GraphView/GraphOverlay/AlgorithmControls/AlgorithmControlsComponent.jsx, lines 32 and 44

**Description:** In AlgorithmControlsComponent, specifically the 
`frontButtonPress()` and `backButtonPress()` methods, there was a
race condition caused by the fact that the algorithm happens in
another thread. This meant that the `updateStepText()` method returned
the information for the previous step, not the current step. I fixed
this by adding a timeout, which makes the method wait 10 ms before
calling `updateStepText()`. This 10 ms of wait is enough time for the
algorithm to update, and the correct information is returned. This works,
but the `setTimeout()` feels like poor code practice. There must be
a more elegant solution for this problem.

### Loading a new graph doesn't reset the algorithm steps

**Date:** 2/11/25

**Author:** Krisjian Smith

**Classification:** Bug

**Severity:** Medium

**Description:** When a new graph is loaded, the algorithmChangeManager
used by the graph is not reset. This means that the ChangeManager will
allow you to attempt to undo changes that happened with a previous
graph.

**Steps to recreate:**
1. Load the NCSU Logo graph and Djikstra's Shortest Path algorithm
2. Step forward until step 10 (Any other step number works too)
3. Load the 10 Node Planar graph

**Expected result:** The algorithm should stop executing when the new
graph is loaded. The step counter should either disappear or reset to 0.

**Actual result:** The step counter remains on 10. Attempting to step
forward or backwards will throw several errors into the developer 
console, as the ChangeManager is trying to modify the nodes and edges
of the previous graph, not the current graph.

### Exit and Skip to End buttons are not implemented

**Date:** 2/11/25

**Author:** Krisjian Smith

**Classification:** Unimplemented feature

**Severity:** Low

**Description:** When executing an algorithm, an "Exit" and "Skip to End"
button appear in the bottom left corner. When clicked, these buttons
only throw errors into the console. The methods these buttons are
trying to use are not implemented yet.

### Auto Camera and Auto Layout buttons do not work

**Date:** 2/11/25

**Author:** Krisjian Smith

**Classification:** Unimplemented feature

**Severity:** Low

**Description:** In the upper right hand corner, there is a "Layout"
button. When clicked, this opens up a menu with two buttons, "Auto
Camera" and "Auto Layout." Neither of these buttons work. The "Auto
Layout" button does nothing, and the "Auto Camera" button just throws
errors into the console.

### Inconsistent starting page for the Graph and Algorithm Editors

**Date:** 2/11/25

**Author:** Krisjian Smith

**Classification:** Inconsistent Features

**Severity:** Very low

**Description:** When the algorithm editor is first opened, it will
automatically open the last algorithm you loaded. When the graph editor
is opened, however, it will not automatically open anything. By default,
it just has a blank screen until you select a graph to open or click
the "new" tab. This feels inconsistent, and I think the graph editor
should open the last graph you loaded by default. This is just a minor
annoyance, however.

### Messages are not displayed

**Date:** 2/11/25

**Author:** Krisjian Smith

**Classification:** Unimplemented feature

**Severity:** Medium

**Description:** One of the methods an algorithm can call is
`display()`. This method should show a message on the screen. Currently,
the functionality for this is not implemented. The method only prints a
message into the console, but does not print anything onto the screen
for the user to see

