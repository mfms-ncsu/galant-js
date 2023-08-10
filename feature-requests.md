# The following are desired in a future version of galant-js

1. Panel sizes are fixed in the current implementation. Ideally, the graph and the algorithm would be in separate resizeable popup windows. Failing that, there should be a way to give most of the space to the graph when it is being manipulated or the animation is running.

2. Functions for accessing/modifying arbitrary attributes are not yet implemented.

3. Radiuses of nodes increase and decrease as you zoom in and out. Sometimes you want them to stay the same. The panning and zooming in general is sometimes awkward.

4. The mapping from positions in the text description of a graph to the display is not always transparent.

5. The developer documentation gives a good overview, but it lacks
- detailed information about where and how each feature is implemented
- a log of design and implementation decisions and the reasoning behind them

6. In order to run an animation, a user must upload the algorithm (which automatcally initiates the animation). Each graph must be uploaded as well and neither graph nor algorithm persist.