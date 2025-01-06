# The following are desired in future versions of `galant-js`

## Notes for Spring 2025 Senior Design
If there are two teams, they could work independently on the following two aspects of the project.

### More direct interaction with Cytoscape
* write some smaller standalone apps that feed graphs directly into Cytoscape, modify the graphs, and respond to user interactions with the graph display
* see if the existing code base can be made to interact with Cytoscape directly, starting with minimal functionality
* depending on how the previous steps go, work on a cleaner graph representation
* gradually add features of original implementation
* **Possible deliverable:** a standalone graph editor that handles both gph and sgf files

### Fix various aspects of the user interface, correct bugs, etc.
* going back to original state, except for node movements, when an algorithm is completed: see `animation_and_edit_states.pptx`
* keyboard shortcuts
* saving graph and algorithm files with a file browser instead of downloading them: StackOverflow has some examples of code
* positioning of query popups
* display of messages and using change records for these
* fixing various annoyances of the display

Both teams can move in the direction of handling layered graphs with sorting graphs as a special case.

## High priority

* (Team 2) Maintaining a mapping between physical screen positions of nodes and logical positions recorded in a text file. This will facilitate the following
- allowing an algorithm to query the position of a node to compute, for example, the Euclidian distance of an edge
- implementing algorithms for sorting and layered graphs; these would call for a mapping where logical positions correspond to integer grid points
- ensuring that positions are saved in a edit state when an auto-layout takes place
It is already possible for an algorithm to move nodes - see the implementations of insertion sort and Quicksort.
A mapping, scale factor, is apparently maintained to save positions of nodes moved by the user during algorithm execution, but it may not be based on logical positions defined in the original text file. See
`AlgorithmControlsComponent.jsx`:
```
 const transformedPositions = transformPositions(positions, 1 / graphSnapshot.scalar);
```
for a potential clue.

* (Team 1) The text produced by the `display` function does not appear in this version. Furthermore a `display` call during algorithm execution should generate a change record so that the text is always in sync with the animation. The Java version handled this by making the text display a graph object on par with a node or edge.

* (Team 1) Edits to node/edge labels/weights do not work; nor does adding an edge or deleting a node that has incident edges; these are probably simple oversights.

* More detailed documentation for animators and developers, in the form of Google docs for ease of modification. For the developer, pointers to locations in the code for important functionalities are essential; some of these already exist.
I anticipate being closely involved in the development and will produce some of this documentation as we go, as well as making suggestions about code style and commenting.
Also desirable is a log of design and implementation decisions and the reasoning behind them.

* (Team 1) Better handling of errors. Currently, you have to open "developer tools" in the browser to see the console and get information such as detailed error messages. And the developer messages don't give line numbers for the source code or the input files. Makes debugging difficult (actually, the browser will pop up a window that highlights the location of the error). Syntax errors in graph text simply result in the graph not being loaded - no explanation is given.
On the other hand, runtime errors during algorithm execution are handled well - the graph window gives a line number with a description of the error and marks the offending line; the only quibble I have with it is that the window may need to be expanded and the message window replaces the graph window rather than being a separate popup (as in the Java version)

## Code organization and refactoring

There are many places in the code (and comments) that are awkward and/or hard to understand. Some common issues.
* each file should have an overview comment describing its purpose, how it fits into the overall functionality
* functions should have comments describing not only their parameters, return values, and side effects, but also how they are used (from where they are called)
* `Graph.js` should be written in such a way that outside access is via methods and does not rely on the particulars of the graph data structure
* the interface with Cytoscape is still somewhat mysterious; it appears to require that the nodes are in the form of a list
* there are lots of places where the same functionality is implemented using different mechanisms, e.g., looping through nodes and edges

## Secondary but important

* Most (if not all) of the keyboard shortcuts based on Cmd or Ctrl keys (Mac/Windows) are hijacked by the browser when focus is on a **text edit window** (as opposed to the graph window); these should work as Galant commands, e.g., Cmd-S should save the file, Cmd-O should open one, and Cmd-Q should exit Galant.
- Cmd-S now saves the text file to Downloads, but there is still a popup the prompts the user to save the html file. There are ways to write a JavaScript function that saves a file, as opposed to downloading it.
- Cmd-L for loading a graph or algorithm does not work in Safari but does work in other browsers (Ctrl-L does work, however): probably an easy fix; we had the same issue with Cmd-S
- Cmd-O loads a text file, but the buttons in the graph/algorithm editor go away
- Cmd-Q exits the browser

* Many of the styles for buttons and menus are ad-hoc rather than being standardized and the buttons are not in the most desirable locations; most of this has been taken care of in the current branch.

* Some problems with drop downs and popups have impact on usability
- drop down menus are not always in expected locations and the way their locations are specified is mysterious
- popups during algorithm execution obscure the middle of the graph
- menus that show up when you right click on a node, edge, or on the canvas may go partially off screen
- some of this has been fixed

See the two `.jpg` files for desired locations of buttons.
Location of popups during and at the end of algorithm execution is difficult to control, probably because of the nested contexts in `pages/GraphView/index.jxs`

The `buttons.txt` file list all of the places in the code that impact buttons, drop downs and popups. These come from the code in the main branch. There are some changes in the dev branch, mostly to establish some uniform styles and achieve the desired position for the buttons.

* Use of keyboard to navigate drop downs or popups with buttons is awkward; direct shortcuts for some operations on nodes and edges might be useful, e.g., the following exist in the Java version: (a) showing and hiding of weights/labels; (b) adding or deleting nodes and edges.

* Editor windows persist when the main browser window is closed; they should go away.

* If user presses the Algorithm (editor) button, a new editor window appears even if one already exists. Ideally, the current window should move to the foreground. Same with the graph editor.

* User should be alerted and prompted to save when there are unsaved changes in any of the editor windows (or tabs thereon).

## Other desirable features

### Animation implementation and execution

* `JavaScript` is used directly as the language to implement algorithms; the Java version uses a macro preprocessor that translates a language resembling pseudocode to Java. Some sort of preprocessing would be useful, since Galant is intended for animators with limited programming skills. `JavaScript`, in particular, has syntactic and semantic quirks that present challenges for programmers familiar with traditional languages such as `Java`, `C`, and `Python`. 

* Ability to add or delete nodes/edges during algorithm execution. For most animations this is emulated by hiding and showing. But addition and deletion along with node movement would allow animations of data structures such as search trees and heaps

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
