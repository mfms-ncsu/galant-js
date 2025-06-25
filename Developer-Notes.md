# Notes for developers

More detailed information is in the [developer guide](https://docs.google.com/document/d/1ibreDziizk5vVKjoF42YXN7GGJSG4H8oOu0iwQw1U58)

## Overview

The `scripts` directory has three scripts, one each for building (compiling), testing, and starting the application.

The rest of the files relevant files are in `src`

- `index.css` is supposed to define styles of buttons, etc., but these are now defined "locally" by, for example, creating button types in `components/Buttons`
- `index.js` creates two types of entities: (i) a service worker that handles communication between threads; and (ii) pages/windows for the graph and the two editors, graph and algorithm.

Source files are organized into several subdirectors, based on their function.

### Front end

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
    - `AlgorithmInterface` interacts with the thread running the algorithm; the most important functionality is receiving messages from the thread and calling on the `GraphInterface`; the messages are more generic than the specific setters: for example, `setEdgeAttribute` instead of `setWeight`

