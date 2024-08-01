# The following are desired in a future version of galant-js

Ones that have been accomplished by the Fall 2023 Senior Design Team of Ryan Bruce, Charlie Fligg, Emma Holincheck, and Sudhanshu Moghe are turned into bullet items and marked F23.

Those that have been implemented by the Spring 2024 Senior Design Team of Christina Albores, Vitesh Kambara, Julian Madrigal, Neha Ramesh, and Minghong Zou are bulleted and marked S24.

Other feature requests are highlighted.

* (1) (S24) Graph and the algorithm in separate resizeable popup windows. Failing that, some way to give most of the space to the graph when it is being manipulated or the animation is running. *Galant-js now has popup windows for algorithms and graphs; each popup has tabs for different algorithms/graphs*

* (2) (S24) Functions for accessing/modifying arbitrary attributes. Additional display attributes such as radius and shading (fill) for nodes, thickness for both nodes and edges (of boundary in case of nodes), and shapes.

* (3) (S24) Implementations of more algorithms, including sorting algorithms and some of the research algorithms, adding features as needed. Sorting and layered graph algorithms will require controlled movement of nodes. This now works for at least two sorting algorithms - insertion sort and Quicksort. Layered graph algorithms are future work, but *can actually be implemented using the current infrastructure and tricks similar to those used in the Quicksort animation*.

***Implementation suggestion for graphs that are used in algorithms that move nodes:*** Ability to move nodes should really be a property of the **graph** rather than the algorithm. This would be obvious for sgf format. Why does this matter?

When these graphs are manipulated by an algorithm, the positions should be treated as ***logical*** (consecutive integers for layered graphs) rather than physical (the Cytoscape rendering, which can be updated as needed). Sorting graphs could be a special case of layered graphs with only one layer. Currently, sorting algorithms begin with a `lineUpNodes` method to scale properly. Using sgf format for both layered and sorting graphs would make this unnecessary.

* (4) (S24) The developer documentation gives a good overview, but it needs more ...
- detailed information about where and how each feature is implemented
- a log of design and implementation decisions and the reasoning behind them

* (5) (F23) User documentation. The important details are in the current programmer documentation.

* (S24) Keyboard shortcuts for most operations would be great. Still to do
- `Cmd-o` and `Cmd-s` on all browsers; may require keeping browser from hijacking keystrokes
- `Cmd-q` to close all Galant windows

* (6) (S24) A mechanism to save the current state of a graph; already done for edited algorithm.

* (7) (S24) Ability to edit graphs online in real time. For graphs, this should be done in the display or by editing the text version. In the main window, ***canvas**, properties of individual nodes and edges can be edited by right clicking on them; they can also be deleted in this way. New nodes/edges can be created by right clicking on the canvas. To create an edge, you have to specify the destination before clicking "New Edge".

8. A preferences panel/menu that allows the user to specify, e.g., default fonts (sizes are most important), default node radiuses, default locations of graphs and algorithms, etc. The Java version has an (unnecessarily) elaborate set of options. ***Node radiuses can be controlled in real time; other default settings not implemented***

Partially implemented by (S24)

* (9) (F23) Radiuses of nodes increase and decrease as you zoom in and out. Sometimes you want them to stay the same. The panning and zooming in general is sometimes awkward.

10. It would be nice (for my own graph drawing research) to be able to draw sgf files and animate layered graph algorithms. The local version is already capable of reading sgf files, but it would be nice to scale horizontal and vertical coordinates proportional to window dimensions, as is done in the Java version. A classic example is the graph n42-t48v150.
    - n42-t48v150.sgf can be uploaded into galant-js
    - what it should look like (rotated 90 degrees) is n42-t48v150.png
This can be done easily, but the scaling is wrong for many layered graphs. The layers should be evenly spaced in the window instead of using absolute coordinates.
   
# Some unfinished business
## Backend

11. Adding modules/classes that can be accessed/imported from any part of the JS code. The most obvious applications are ***data structure implementations, debug printing, and utilities for special types of graphs.*** Putting this in Thread.js is undesirable for two reasons: much of it needs to be accessed from other parts of the code; and Thread.js should not become cluttered.

12. There are two use cases for `step`. If there is a sequence of steps within a step, the current behavior executes the inner steps one at a time; this makes sense for depth first search. Another use case is if you write a function that does several things within a step and you want to make a sequence of calls to the function as a single step. Would be could to have a declaration for the latter. 

## Frontend

* (13) (S24) Put buttons in different places, use different colors for text and background, different defaults for text fonts and sizes, etc.

Partially implemented. Could use some tuning, but easy to expand.

* (14) (S24) Keyboard shortcuts for all actions that currently require a mouse. Ideally, these would be defined in one place. The following shortcuts are important: ability to press `return` instead of an `okay` button, file uploading, loading, and saving, and toggles for visibility of weights, labels, and directedness.

**Still needed:**

- there are no shortcuts for uploading or downloading graphs and algorithms if you're in the relevant window; the obvious `Cmd-O and Cmd-S` are hijacked by the browser (except for Firefox, oddly); I don't know how ReAct can intercept them; an advantage in the Java version was that we could deal with any Ctrl/Cmd (depending on platform) key combinations
- once you pop up one of the preference panels, there are no further shortcuts; the Java version uses `w` for showing weights and `l` for labels, for example; **(S24) has a workaround** - you can tab to different toggles once the panel is popped up
- there are no shortcuts for adding nodes or edges

15. Ideally the user should be prompted if there are unsaved changes when an editor window is closed.

## Both ends
* (15) (S24) Algorithms should have the ability to move nodes. Two options for node positioning
    - nodes can be moved by user during editing and algorithm execution; user controlled changes in node positions during algorithm execution persist when execution terminates
    - nodes cannot be moved by the user or moved only in limited fashion; any move by the user during algorithm execution is undone by the next step, whether forward or backward; 

In the Java version an algorithm is able to specify/declare which type of node positioning is desired. The second is important for algorithms that move nodes. In the (S24) implementation, the following incantation is used for algorithms that move nodes.
```
Algorithm.configure({
    controlNodePosition: true
})
```

A related issue is the ***ability to get the position of a node.*** This is useful not only for algorithms that move nodes, but also for computing Euclidian distance when an algorithm that requires edge weights is run on a graph that does not specify them.
See the line
```
const transformedPositions = transformPositions(positions, 1 / graphSnapshot.scalar);
```
in `AlgorithmControlsComponent.jsx`

16. Algorithms should have the ability to add/delete nodes and edges (true in the Java version). This, along with ability to move nodes, would make it possible to animate data structures such as search trees and heaps.

17. The ability for an algorithm to direct an edge, whether or not the graph is currently directed. This would be useful in at least two settings.
- vertex_cover: direct an edge toward a vertex that covers it
- max flow: direct edges backwards when they are saturated

18. **Stretch goal for accessibility.** Ability to add declarations connecting logical attributes with both visual effects and speech/sound. For example, a programmer could define several different modes of highlighting for nodes and/or edges and have these mapped to both color changes and spoken text. The modes could have names such as "visited", "in_tree", etc.

# Annoyances

1. There are no functions that return the position of a node, e.g., getX() or getY(); this is difficult with Cytoscape and not really needed unless the algorithm moves nodes; even then, the (S24) team has implement an `incrementPosition()` method that accomplishes most of what's needed; except for swapping, which would be nice. A clean separation between logical and physical positions for algorithms that move nodes would be the best solution.

2. You have to open "developer tools" in the browser to see the console and get information such as detailed error messages. And the developer messages don't give line numbers for the algorithms. Makes debugging difficult (actually, the browser will pop up a window that highlights the location of the error). Syntax errors in graph text simply result in the graph not being loaded - no explanation is given.

3. There is no easy way to print information about various objects (nodes, edges, lists); again, debugging would be much easier if there were; but the `display()` method works pretty well

4. The Algorithm Editor and Graph Editor windows persist after the application is terminated by closing the main window or a Ctrl-C from the terminal.

5. If you do auto-layout and then move a node manually, weird things happen, i.e., all the nodes move unpredicatably; maybe the auto-layout algorithm runs again. There appears to be no way to save the positions of an auto-layout. This is vary annoying if the coordinates of the nodes are initially random, as they are for some graphs.
Note: If user moves an individual node, a new edit state is created, see
pages/GraphView/GraphEditOverlay/ContextMenus/ContextMenu.jsx
This should also happen when an auto-layout is performed.

A workaround is to start an algorithm after you do auto-layout and then move the nodes.

6. Somewhat related to (5): If you do delete nodes before starting an algorithm, the algorithm starts with the original graph. You probably have to save the graph first, which is not that bad.

7. The menu when you right click a node sometimes goes off screen and you have to move the node to see all of it.

8. There is no indication whether a graph or algorithm has been saved. So the user has to remember to download if they make changes.

9. In Firefox (not the case in other browsers and not always true) the left and right arrow keys also move the focus of the window, shifting the graph in the opposite direction.

10. When you bring up the graph or algorithm editor, it brings you to the same tab each time, not the one for the most recently loaded graph or algorithm.

# minor adjustments, easy fixes

- for consistency, there should be a `setColor` method
- "destionation" -> "destination"
