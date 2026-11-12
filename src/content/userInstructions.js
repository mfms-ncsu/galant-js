/**
 * In-app Galant user instructions, shown as navigable help sections.
 */
export const helpSections = [
    {
        id: "overview",
        title: "Overview",
        paragraphs: [
            "Quick Guide to using Galant-JS, Version 3.0.",
            "Galant is a tool for exploration, not a closed system. Customize the examples to create your own animation effects. Better yet, write your own animations using the examples as a guide.",
            "In this help window, use the up and down arrow keys to move between sections. Press space to hear the current section again. Press h or Escape to close help.",
        ],
    },
    {
        id: "load-graph",
        title: "Load a Graph",
        items: [
            "Click Graph Editor or use the g key.",
            "Click the Examples button in the graph editor window or use the Ctrl-E key.",
            "Select a graph from the list in the popup window; the sorting graphs are for sorting algorithms only.",
            "Click Load Graph or use the Ctrl-Shift-L shortcut.",
        ],
    },
    {
        id: "load-algorithm",
        title: "Load an Algorithm",
        items: [
            "Go back to the main window and click Algorithm Editor or use the a key.",
            "Click the Examples button in the algorithm editor window or use the Ctrl-Shift-E shortcut.",
            "Select an algorithm from the popup window.",
            "Click Load Algorithm or use the Ctrl-Shift-L shortcut.",
        ],
    },
    {
        id: "run-algorithm",
        title: "Run the Algorithm",
        items: [
            "Go back to the main window.",
            "Use the left and right arrow keys or click on the arrows at the bottom of the display to step forward and backward.",
            "Use the q key or click on the Exit button to exit the algorithm.",
            "If you want to start over, click Restart Algorithm or use the semicolon key. If that does not work, go back to the algorithm editor and load the algorithm again. The easiest way to do that is to use keyboard shortcuts: a followed by Ctrl-Shift-L.",
        ],
    },
    {
        id: "switch-graphs-algorithms",
        title: "Run additional algorithms or use different graphs",
        items: [
            "To run a different algorithm on the same graph, go to the algorithm editor, choose another algorithm, and load it.",
            "To run the same algorithm on a different graph, load another graph. The selected algorithm is retained and starts again from the beginning.",
        ],
    },
    {
        id: "algorithm-output",
        title: "Algorithm text and speech",
        paragraphs: [
            "Use display(text) to update the banner without speaking. Use speech(text) to speak when speech is enabled. To show and speak the same text together, put both calls inside step(() => { ... }).",
            "Use description(text) for a graph introduction. It opens a text dialog and pauses the algorithm. Continue or Escape closes it and stops its narration.",
            "Existing algorithms that use only display(text) no longer speak automatically. Add speech(text) where narration is wanted.",
        ],
    },
    {
        id: "view-graph",
        title: "Pan, zoom, and Auto-Camera",
        paragraphs: [
            "Use the mouse to pan and zoom in and out of a graph, as you would in a map application. The Auto-Camera feature, under Layout, will center the graph on the canvas.",
            "Some keyboard shortcuts may not work consistently on all browser and platform combinations.",
        ],
    },
    {
        id: "shortcuts-main",
        title: "Keyboard shortcuts: main page",
        items: [
            "a — Open editor page for algorithms.",
            "g — Open editor page for graphs.",
            "h — Open these instructions.",
            "z — Undo the latest editing change. During algorithm execution, the only permitted edits are node movements.",
            "y — Redo the latest change.",
            "r — Revert. Bring the graph back to its original state at load time.",
            "Layout menu — Show the Layout drop down with options for Auto Camera, Auto Layout, and Evenly-Spaced Layout. Auto Camera puts the graph in the center of the window. Auto Layout uses Cytoscape’s force-directed layout. Evenly-Spaced Layout, for layered graphs only, centers each layer and spaces nodes evenly.",
            "n — Show the Nodes drop down with options for Display Labels, Display Weights, and Node Radius. Algorithm functions can override label and weight display.",
            "e — Show the Edges drop down with options for Display Labels, Display Weights, and Directed. Algorithm functions can override label and weight display.",
        ],
    },
    {
        id: "shortcuts-algorithm",
        title: "Keyboard shortcuts: algorithm execution",
        items: [
            "right arrow — Take the next algorithm step.",
            "left arrow — Go back to the previous algorithm step. This does not undo the result of a popup query.",
            "x — Export graph. Save the current display state of the graph to a file.",
            "q — Stop algorithm execution and return to edit mode, reverting the graph to its state before algorithm execution except that node movements during execution are preserved.",
            "semicolon — Restart algorithm execution without having to reload it.",
        ],
    },
    {
        id: "shortcuts-editor",
        title: "Keyboard shortcuts: editor page",
        paragraphs: [
            "These are effective when focus is on one of the two editor pages, Graph or Algorithm. The same shortcuts work for both. On most browser and platform combinations there are times when these do not work. The failures are intermittent and do not appear to be related to user actions.",
        ],
        items: [
            "Ctrl-Shift-E — Show the page of examples.",
            "Ctrl-Shift-O — Upload, or open, a file from the computer.",
            "Ctrl-Shift-L — Load the graph or algorithm.",
            "Ctrl-Shift-S — Download the file.",
        ],
    },
];

export const helpTitle = "Galant User Instructions";

/**
 * Spoken text for one help section, including its place in the list.
 */
export function speakHelpSection(index) {
    const section = helpSections[index];
    if (!section) {
        return "";
    }

    const parts = [
        `Section ${index + 1} of ${helpSections.length}. ${section.title}.`,
        ...(section.paragraphs ?? []),
        ...(section.items ?? []).map((item, itemIndex) => `Step ${itemIndex + 1}. ${item}`),
    ];

    return parts.join(" ");
}
