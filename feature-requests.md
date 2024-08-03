# The following are desired in future versions of `galant-js`

## High priority

* Maintaining a mapping between physical screen positions of nodes and logical positions recorded in a text file. This will facilitate the following
- allowing an algorithm to query the position of a node to compute, for example, the Euclidian distance of an edge
- implementing algorithms for sorting and layered graphs; these would call for a mapping where logical positions correspond to integer grid points
- ensuring that positions are saved in a edit state when an auto-layout takes place
It is already possible for an algorithm to move nodes - see the implementations of insertion sort and Quicksort.
A mapping, scale factor, is apparently maintained to save positions of nodes moved by the user during algorithm execution, but it may not be based on logical positions defined in the original text file. See
`AlgorithmControlsComponent.jsx`:
```
 const transformedPositions = transformPositions(positions, 1 / graphSnapshot.scalar);
```
for a potential clue. part of the code may explain why a workaround for saving an auto-layout is to start an algorithm and exit.
Note: If user moves an individual node, a new edit state is created, see
pages/GraphView/GraphEditOverlay/ContextMenus/ContextMenu.jsx
This should also happen when an auto-layout is performed.

* More detailed documentation for animators and developers, in the form of Google docs for ease of modification. For the developer, pointers to locations in the code for important functionalities are essential; some of these already exist.
I anticipate being closely involved in the development and will produce some of this documentation as we go, as well as making suggestions about code style and commenting.
Also desirable is a log of design and implementation decisions and the reasoning behind them.

* Better handling of errors. Currently, you have to open "developer tools" in the browser to see the console and get information such as detailed error messages. And the developer messages don't give line numbers for the source code or the input files. Makes debugging difficult (actually, the browser will pop up a window that highlights the location of the error). Syntax errors in graph text simply result in the graph not being loaded - no explanation is given.
On the other hand, runtime errors during algorithm execution are handled well - the graph window gives a line number with a description of the error and marks the offending line; the only quibble I have with it is that the window may need to be expanded and the message window replaces the graph window rather than being a separate popup (as in the Java version)

## Secondary but important

* Most (if not all) of the keyboard shortcuts based on Cmd or Ctrl keys (Mac/Windows) are hijacked by the browser when focus is on a text edit window; these should work as Galant commands, e.g., Cmd-S should save the file, Cmd-O should open one, and Cmd-Q should exit Galant.

* Many of the styles for buttons and menus are ad-hoc rather than being standardized and the buttons are not in the most desirable locations; some of this has been taken care of in the dev branch.

* Some problems with drop downs and popups have serious impact on usability
- drop down menus are not always in expected locations and the way their locations are specified is mysterious
- popups during algorithm execution obscure the middle of the graph
- menus that show up when you right click on a node, edge, or on the canvas may go partially off screen.

See the two `.jpg` files for desired locations of buttons.
Location of popups during and at the end of algorithm execution is difficult to control, probably because of the nested contexts in `pages/GraphView/index.jxs`

* Use of keyboard to navigate drop downs or popups with buttons is awkward; direct shortcuts for some operations on nodes and edges might be useful, e.g., the following exist in the Java version: (a) show and hide of weights/labels; (b) add or delete nodes and edges.

* Editor windows persist when the main browser window is closed; they should go away.

* User should be alerted and prompted to save when there are unsaved changes in any of the editor windows (or tabs thereon).

## Other desirable features

### Animation implementation and execution

* `JavaScript` is used directly as the language to implement algorithms; the Java version uses a macro preprocessor that translates a language resembling pseudocode to Java. Some sort of preprocessing would be useful, since Galant is intended for animators with limited programming skills. `JavaScript`, in particular, has syntactic and semantic quirks that present challenges for programmers familiar with traditional languages such as `Java`, `C`, and `Python`. 

* Ability to add or delete nodes/edges during algorithm execution. For most animations this is emulated by hinding and showing. But addition and deletion along with node movement would allow animations of data structures such as search trees and heaps

* The ability for an algorithm to direct an edge, whether or not the graph is currently directed. This would be useful in at least two settings:
- vertex_cover: direct an edge toward a vertex that covers it
- max flow: direct edges backwards when they are saturated

* Adding modules/classes that can be accessed/imported from any part of the JS code. The most obvious applications are ***data structure implementations, debug printing, and utilities for special types of graphs.*** Putting this in Thread.js is undesirable for two reasons: much of it needs to be accessed from other parts of the code; and Thread.js should not become cluttered.

* There are two use cases for `step`. If there is a sequence of steps within a step, the current behavior executes the inner steps one at a time; this makes sense for depth first search. Another use case is if you write a function that does several things within a step and you want to make a sequence of calls to the function as a single step. Would be could to have a declaration for the latter.

* Logical attributes that can be mapped to physical ones such as shape or sound under user control via a preference panel (see below); obvious starting points are `mark` and `highlight`. For example, a programmer could define several different modes of highlighting for nodes and/or edges and have these mapped to both color/shape changes and spoken text. The modes might have names such as "visited", "in_tree", etc.

* Fully functional implementation of layered graphs with associated algorithms with sorting graphs and algorithms as a special case. An algorithm can specify whether nodes are to be evenly spaced on each layer or placed in specified integer positions; the Java version makes the decision based on whether or not position numbers are consecutive: evenly spaced if yes, specific integer positions if no; there are advantages either way.

### User interface

* A general preferences panel to control fonts/sizes of text in various contexts; others based on those in the Java version.

* When you bring up the graph or algorithm editor, it brings you to the same tab each time, not the one for the most recently loaded graph or algorithm. This behavior should change or be a user preference.

* **Stretch goal for accessibility.** Ability to add declarations connecting logical attributes with both visual effects and speech/sound.
