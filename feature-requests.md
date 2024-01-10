# The following are desired in a future version of galant-js
Ones that have been accomplished are turned into bullet items. Others are highlighted.

* (1) Graph and the algorithm in separate resizeable popup windows. Failing that, some way to give most of the space to the graph when it is being manipulated or the animation is running. *Galant-js now has popup windows for algorithms and graphs; each popup has (or will have) tabs for different algorithms/graphs*

2. ***Functions for accessing/modifying arbitrary attributes.*** Additional display attributes such as radius and shading (fill) for nodes, thickness for both nodes and edges (of boundary in case of nodes)

3. Implementations of more algorithms, including sorting algorithms and some of the research algorithms, adding features as needed. ***Sorting and layered graph algorithms will require controlled movement of nodes***

4. The developer documentation gives a good overview, but it needs more ...
- detailed information about where and how each feature is implemented
- a log of design and implementation decisions and the reasoning behind them

* (5) User documentation. The important details are in the current programmer documentation. ***Keyboard shortcuts for most operations would be great.***  

6. A mechanism to save the current state of a graph; already done for edited algorithm.

7. Ability to edit graphs online in real time. For graphs, this should be done in the display or by editing the text version.

8. A preferences panel/menu that allows the user to specify, e.g., default fonts (sizes are most important), default node radiuses, default locations of graphs and algorithms, etc. The Java version has an (unnecessarily) elaborate set of options. ***Node radiuses can be controlled in real time; other default settings not implemented***

* (9) Radiuses of nodes increase and decrease as you zoom in and out. Sometimes you want them to stay the same. The panning and zooming in general is sometimes awkward.

10. It would be nice (for my own graph drawing research) to be able to draw sgf files and animate layered graph algorithms. The local version is already capable of reading sgf files, but it would be nice to scale horizontal and vertical coordinates proportional to window dimensions, as is done in the Java version. A classic example is the graph n42-t48v150.
    - n42-t48v150.sgf can be uploaded into galant-js
    - what it should look like (rotated 90 degrees) is n42-t48v150.png
***Major unfinished business here. More details below***   

   
# Some unfinished business
## Backend
11. Adding modules/classes that can be accessed/imported from any part of the JS code. The most obvious applications are data structure implementations, debug printing, and utilities for special types of graphs. Putting this in Thread.js is undesirable for two reasons: much of it needs to be accessed from other parts of the code; and Thread.js should not become cluttered.

## Frontend
12. Scaling of graph based on both height and width of window. Cytoscape's ability to pan and Zoom is sufficient in almost all situations, but layered graphs, sorting graphs, and the corresponding algorithms require special treatment. The desired behavior is hard to explain - you need to load a layered graph or run a sorting algorithm in the Java version.

13. Put buttons in different places, use different colors for text and background, different defaults for text fonts and sizes, etc.

## Both ends
14. Algorithms should have the ability to move nodes. Two options for node positioning
    - nodes can be moved by user during editing and algorithm execution; user controlled changes in node positions during algorithm execution persist when execution terminates
    - nodes cannot be moved by the user or moved only in limited fashion; any move by the user during algorithm execution is undone by the next step, whether forward or backward; ***algorithms are capable of moving nodes***
In the Java version an algorithm is able to specify/declare which type of node positioning is desired. The second is important for algorithms that move nodes.

# Annoyances

1. Save file for algorithms does not work as expected. The file defaults to *Tab-Number*.txt instead of the name (and directory) of the file that was uploaded. And Cmd-S or Ctrl-S saves the website, not the file.

2. When a prompt window pops up, focus does not automatically go to that window, so an extra mouse click is required.

3. There are no functions that return the position of a node, e.g., getX() or getY()

4. You have to open "developer tools" in the browser to see the console and get information such as detailed error messages. And the developer messages don't give line numbers for the algorithms. Makes debugging difficult.

A particular bug I have been unable to track down: If you run `dijsktra.js` on `unweighted_10.txt` and make the latter directed, the algorithm crashes with a `null` node after a few steps.

5. There is no easy way to print information about various objects (nodes, edges, lists); again, debugging would be much easier if there were

6. If you click Algorithm Editor or Graph Editor, the algorithm(s) or graph(s) that were uploaded go away.

7. The Algorithm Editor and Graph Editor windows persist after the application is terminated by closing the main window or a Ctrl-C from the terminal.
