# Version history of galant-js

Features and bug fixes implemented as version 2.0 by the Spring 2025 Teams of Heath Dyer, Jacob Friend, Rishi Gupta, Ethan Haske, Henry Morris, Ravi Pavuluri, Michael Richardson, Krisjan Smith, Jacob Usher, and Ziyu Wang are marked S25.

Features and bug fixes implemented by the Fall 2024 Senior Design Team of Harshica Balu, Shlok Dave, Ethan Godwin, Andrew Lanning, and Somya Pandey are marked F24. The major accomplishment of this team was on the back end: the implementation of ***change records***, which make the code more transparent and allow separation of logical and physical representation of the graph.

Features and bug fixes implemented as v1.0 by the Spring 2024 Senior Design Team of Christina Albores, Vitesh Kambara, Julian Madrigal, Neha Ramesh, and Minghong Zou are marked S24.

Features in the original galant-js implemented by the Fall 2023 Senior Design Team of Ryan Bruce, Charlie Fligg, Emma Holincheck, and Sudhanshu Moghe are marked F23. This is a prerelease, v0.9.

------------------------
(1) (S25) Major refactoring of the code base.
(2) (S25) Screen positions of nodes map consistently to coordinates in the text representation (logical positions), so that saving to the text representation maintains the scale
(3) (S25) A snap to grid feature with visible grid when logical coordinates are small integers.
(4) (S25) Support for layered graphs (See, e.g., DiBattista et al., Graph Drawing, Prentice Hall, 1999, chapter 9).
(5) (S25) Better reporting of errors, both during graph loading and algorithm execution.
(6) (S25) Improved keyboard shortcuts.
(7) (S25) Automatic detection and assignment of file names during downloads.


------------------------
(1) (F24) Auto layout is now treated as a single edit step. This also fixes a bug wherein an auto layout followed by movement of a node led to strange rearrangement of the graph.

------------------------
(1) (S24) Galant-js now has popup windows for algorithms and graphs; each popup has tabs for different algorithms/graphs. The main graph window is resized as a browser window.

(2) (S24) Additional display attributes such as radius and shading (fill) for nodes, thickness for both nodes and edges (of boundary in case of nodes), and shapes.

(3) (S24) Implementations of more algorithms, including sorting algorithms and some of the research algorithms, adding features as needed. Sorting and layered graph algorithms require controlled movement of nodes. This now works for at least two sorting algorithms - insertion sort and Quicksort.

(4) (S24) The developer documentation gives a good overview, but it still needs more ...
- detailed information about where and how each feature is implemented
- a log of design and implementation decisions and the reasoning behind them

(5) (S24) Keyboard shortcuts for most operations. Still needed
- `Cmd-o` and `Cmd-s` on all browsers; may require keeping browser from hijacking keystrokes
- `Cmd-q` to close all Galant windows

(6) (S24) A mechanism to save the current state of a graph

(7) (S24) Ability to edit graphs online in real time in the display or by editing the text version. In the main window, ***canvas**, properties of individual nodes and edges can be edited by right clicking on them; they can also be deleted in this way. New nodes/edges can be created by right clicking on the canvas. To create an edge, you have to specify the destination before clicking "New Edge".

(8) (S24) Algorithms have the ability to move nodes. Two options for node positioning
    - nodes can be moved by user during editing and algorithm execution; user controlled changes in node positions during algorithm execution persist when execution terminates
    - nodes cannot be moved by the user or moved only in limited fashion; any move by the user during algorithm execution is undone by the next step, whether forward or backward; 

In the Java version an algorithm is able to specify/declare which type of node positioning is desired. The second is important for algorithms that move nodes. In the (S24) implementation, the following incantation is used for algorithms that move nodes.
```
Algorithm.configure({
    controlNodePosition: true
})
```

-------------------------

(1) (F23) A usable implementation that emulates many of the features of the Java version within a single browser window.

(2) (F23) Use of Cytoscape to display graphs enables many features not present in the Java version: panning and zooming and auto-layout among the most useful.

(3) (F23) User documentation that incorporates both the user and programmer documentation, designated as *programmer documentation*. The Java version has three forms of documentation ...
    - **user** for a user who simply wants to run existing algorithms on predefined graphs or those created by the user
    - **programmer/animator** for a user/programmer who wants to write their own algorithms
    - **developer** for a programmer who wants to add features or eliminate bugs in the implementation
