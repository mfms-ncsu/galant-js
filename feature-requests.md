# The following are desired in a future version of galant-js

1. Graph and the algorithm in separate resizeable popup windows. Failing that, some way to give most of the space to the graph when it is being manipulated or the animation is running.

2. Functions for accessing/modifying arbitrary attributes.

3. Implementations of more algorithms, including sorting algorithms and some of the research algorithms, adding features as needed.

3. Radiuses of nodes increase and decrease as you zoom in and out. Sometimes you want them to stay the same. The panning and zooming in general is sometimes awkward. The issue with node radiuses is particularly problematic for layered graphs - see item 4

4. It would be nice (for my own graph drawing research) to be able to draw sgf files and animate layered graph algorithms. The local version is already capable of reading sgf files, but it would be nice to scale horizontal and vertical coordinates proportional to window dimensions, as is done in the Java version. A classic example is the graph n42-t48v150.
    - n42-t48v150.sgf can be uploaded into galant-js.
    - what is should look like (rotated 90 degrees) is n42-t48v150.png

5. The developer documentation gives a good overview, but it lacks
- detailed information about where and how each feature is implemented
- a log of design and implementation decisions and the reasoning behind them

6. User documentation. The important details are in the current programmer documentation. Keyboard shortcuts for most operations would be great. 

7. A mechanism to save the current state of a graph.

8. Additional display attributes such as radius and shading (fill) for nodes, thickness for both nodes and edges (of boundary in case of nodes)
