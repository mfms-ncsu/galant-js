# Notes for developers

More detailed information is in the [developer guide](https://docs.google.com/document/d/1ibreDziizk5vVKjoF42YXN7GGJSG4H8oOu0iwQw1U58)

## Overview

The `scripts` directory has three scripts, one each for building (compiling), testing, and starting the application.

The rest of the files relevant files are in `src`

- `index.css` is supposed to define styles of buttons, etc., but these are now defined "locally" by, for example, creating button types in `components/Buttons`
- `index.js` creates two types of entities: (i) a service worker that handles communication between threads; and (ii) pages/windows for the graph and the two editors, graph and algorithm.

Source files are organized into several subdirectors, based on their function.

### Frontend

- `pages` defines the graph and editor pages/windows; user actions in these windows are delgated to other, relevant parts of the code; each page type has overlays that define buttons, menus, etc.; a special case is `Cytoscape.jsx`, which handles graph drawing via the Cytoscape plugin

- `components` handles user interactions via visible elements; the different types are
    - `Buttons`: various types of buttons appearing in the interface; only the style and keyboard shortcuts (if no Ctrl is involved) are defined, with a callback function for each button press; special cases are `PrimaryButton` and `SecondaryButton`, placeholders for two different button styles
    - `ContextMenus`: various menus, typically activated by right clicks; styles may be based on button styles
    - `Popovers`: behave like context menus but are activated by button presses
    - `Prompts`: ask users for input during an animation, report errors, or ask for confirmation; the latter is apparently not used
    - `Tabs`: anything related to the tabs at the top of an editor window; relevant buttons are for a popup window with examples and one for uploading files; these interact with the list of tabs, which, in turn, interacts with individual tabs
    
### Backend

- `globals` is where the shared worker and the Cytoscape interface are activated

- `interfaces` define interfaces for the backend; these are
    - `GraphInterface`: all functionality related to getting and changing graph characteristics; undo/redo (step back/forward) functionality are handled here as well
    - `LayeredGraphInterface`: functionality specific to layered graphs, effectively a subclass of graphs
    - `FileParser` handles converting the text representation of a graph (`gph` or `sgf` format) to its internal representation
    - `AlgorithmInterface` interacts with the thread running the algorithm; the most important functionality is receiving messages from the thread and calling on the `GraphInterface`; the messages are more generic than the specific setters: for example, `setEdgeAttribute` instead of `setWeight`
    - `CytoscapeInterface` generates a Cytpscape respresentation of the graph for visual display
    - `TabInterface` is the backend for editor tabs, managing the content of the tabs
    - `PromptInterface` manages a queue of prompts for situations where a succession of prompts is generated (e.g., an error prompt followed by a confirmation)

- `states` is where the equivalent of classes are defined
    - _atoms sets up `atoms` for various objects; the developer documentation has a more detailed explanation
    - `Algorithm/Algorithm.js` is a simple initialization of an algorithm and all of its necessary components
    - `Algorithm/Thread.js` contains both the data initialization for the thread that runs an algorithm and all of the functions in the API, which are either called directly from the `GraphInterface` (getters) or result in messages (setters)
    - `Graph` contains constructors/definitions of classes related to the graph; class relationships are similar to those in the Java version.
        - `GraphElement` is the super class for nodes, edges, and messages
        - `Graph` is the super class for `StandardGraph` and `LayeredGraph`
    - `ChangeManager` is a list of `ChangeObject`s, each of which records an action, the previous state, and the new state resulting from the action; states are local in the sense that each applies to a single element only; in reality, the change manager is a list of lists, since a single step can trigger a set of changes via the `step(() =>{...})` incantation
    
## Common workflows

### Changes and change records

#### Effecting the change

A typical change requires re-rendering of the graph. To avoid creating multiple copies of the graph, Immer is used. The incantation is
```
const newGraph = produce(graph, (draft) => {
    // code that changes the current graph and/or its elements
}
```
The code refers to components of the graph with the prefix `draft.`, for example `draft.nodes`

#### Creating a change record

Any change that can be undone and redone requires a ***change record*** that records the current state and the state after the change. A change record consists of a list of one or more change objects. For example, a change in an attribute of a node - only one change object in this case - looks like
```
  const newChangeManager = recordChange(changeManager, [
    new ChangeObject(
      "setNodeAttribute",
      {
        id: nodeId,
        attribute: {
          name: name,
          value: graph.nodes.get(nodeId).attributes.get(name),
        },
      },
      {
        id: nodeId,
        attribute: {
          name: name,
          value: value,
        },
      }
    ),
  ]);
```
The constructor for a change object has three arguments
- a tag to identify the type of change
- two records, for previous and current (changed) states, respectively; each has fields that are used during undo and redo operations
In the example, as elsewhere, the tag and the field names are arbitrary, but should obviously be mnemonic. Note also that the value of a field can again be a record, as in the `attribute` field of the example.
It should not, however, be a *mutable data structure* such as an array.

#### Undo and redo

An undo operation, the function `undo`, first retrieves the previous step, i.e., the change record at `changeManager.index - 1` in the array `changeManager.changes`.
The list of change records needs to be reversed in case some of the changes depended on previous ones.
As in the original action on the graph, there is the Immer invocation, in this case containing a switch statement, as in
```
    const newGraph = produce(graph, (draft) => {
      step.forEach((change) => {
        switch (change.action) {
            // in each case, undo an action based on its tag
        }
      })
    })
```
The undo for `"setNodeAttribute"` looks like
```
            draft.nodes
              .get(change.previous.id)
              .attributes.set(
                change.previous.attribute.name,
                change.previous.attribute.value
              );
```

Redo is similar. The only difference is that we use `current` instead of `previous`.

### Thread and algorithm

#### Thread

`Thread.js` is the point of contact for functions called from an animation implementation. All possible functions are collected here in an organized fashion.
Functions that query graph properties call on the relevant graph interface directly.
Definition of a function that modifies the graph/display looks like
```
  // the following causes the animation to take a step
  // a `stepDepth > 0` implies that changes are being collected into a single step
  // `stepDepth` indicates the level of nesting - steps within steps
  if (stepDepth === 0) { postMessage({ action: "step" }) }
  // call the relevant interface function, e.g.,
  [graph, changeManager] = GraphInterface.setNodeAttribute(graph, changeManager, id, name, value)
  // post a message for the algorithm interface
  postMessage({ action: "setNodeAttribute", nodeId: id, name: name, value: value })
  // pause the thread until user solicits a step - if stepDepth is 0,
  // a condition we may not need, but just to be safe
  waitIfNeeded()
```

#### Algorithm interface

`AlgorithmInterface.js` intercepts messages from the thread and takes the appropriate actions. It also reacts to the users step forward and step back requests.
All actions that modify the graph or the change manager are handled via *Jotai* states - see the Galant-JS-Developer-Guide on the Google shared drive. Therefore messages from the thread must effect state changes to allow global access to new states.
For example, inside a `switch` that handles message types, we see
```
        case "setNodeAttribute":
            [newGraph, newChangeManager] = GraphInterface.setNodeAttribute(graph, changeManager, message.nodeId, message.name, message.value);
            updateState(newGraph, newChangeManager);
```
