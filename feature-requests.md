# The following are desired in a future version of galant-js
Ones that have been accomplished by the Fall 2023 Senior Design Team of Ryan Bruce, Charlie Fligg, Emma Holincheck, and Sudhanshu Moghe are turned into bullet items. These are yet to be merged into this repository. Other feature requests are highlighted.

* 1. Graph and the algorithm in separate resizeable popup windows. Failing that, some way to give most of the space to the graph when it is being manipulated or the animation is running. *Galant-js now has popup windows for algorithms and graphs; each popup has (or will have) tabs for different algorithms/graphs*

2. ***Functions for accessing/modifying arbitrary attributes.*** Additional display attributes such as radius and shading (fill) for nodes, thickness for both nodes and edges (of boundary in case of nodes)

3. Implementations of more algorithms, including sorting algorithms and some of the research algorithms, adding features as needed. ***Partially done: research algorithms have not been implemented***

* 4. The developer documentation gives a good overview, but it lacks
- detailed information about where and how each feature is implemented
- a log of design and implementation decisions and the reasoning behind them

* 5. User documentation. The important details are in the current programmer documentation. ***Keyboard shortcuts for most operations would be great.*** 

* 6. A mechanism to save the current state of a graph. ***Will be done in the final iteration; already done for edited algorithm.***

* 7. Ability to edit graphs and algorithms online in real time. For graphs, this can be done in the display or by editing the text version. For algorithms, it makes more sense to pop up a program editor specified as an option by the user. ***Nicely done!***

8. A preferences panel/menu that allows the user to specify, e.g., default fonts (sizes are most important), default node radiuses, default locations of graphs and algorithms, etc. The Java version has an (unnecessarily) elaborate set of options. ***Node radiuses can be controlled in real time; other default settings not implemented***

* 9. Radiuses of nodes increase and decrease as you zoom in and out. Sometimes you want them to stay the same. The panning and zooming in general is sometimes awkward. The issue with node radiuses is particularly problematic for layered graphs - see item 10. ***Real time adjustment of radiuses takes care of this***

10. It would be nice (for my own graph drawing research) to be able to draw sgf files and animate layered graph algorithms. The local version is already capable of reading sgf files, but it would be nice to scale horizontal and vertical coordinates proportional to window dimensions, as is done in the Java version. A classic example is the graph n42-t48v150.
    - n42-t48v150.sgf can be uploaded into galant-js
    - what it should look like (rotated 90 degrees) is n42-t48v150.png
***Major unfinished business here. More details below***   
   
# Some unfinished business
## Backend
11. Adding modules/classes that can be accessed/imported from any part of the JS code. The most obvious applications are ***data structure implementations, debug printing, and utilities for special types of graphs.*** Putting this in Thread.js is undesirable for two reasons: much of it needs to be accessed from other parts of the code; and Thread.js should not become cluttered.

## Frontend
12. ***Scaling of graph based on both height and width of window.*** Cytoscape's ability to pan and Zoom is sufficient in almost all situations, but layered graphs, sorting graphs, and the corresponding algorithms require special treatment. The desired behavior is hard to explain - you need to load a layered graph or run a sorting algorithm in the Java version.
13. Put buttons in different places, use different colors for text and background, different defaults for text fonts and sizes, etc.
14. ***Keyboard shortcuts*** for all actions that currently require a mouse. Ideally, these would be defined in one place. The following shortcuts are important: ability to press `return` instead of an `okay` button, file uploading,loading, and saving, and toggles for visibility of weights, labels, and directedness.

## Both ends
14. ***Algorithms should have the ability to move nodes.*** Two options for node positioning
    - nodes can be moved by user during editing and algorithm execution; nodes stay in where the user puts them
    - nodes cannot be moved by the user or moved only in limited fashion; any move by the user during algorithm execution is undone by the next step, whether forward or backward
   

