/**
 * In-app Galant user instructions, shown as navigable help sections.
 */
export const helpSections = [
    {
        id: "overview",
        title: "Getting started",
        paragraphs: [
            "Galant lets you load a graph and follow an algorithm one step at a time. Speech starts off. Press V to turn it on or off.",
            "Use Tab and Shift+Tab to move between controls. Press Enter or Space to activate a button.",
            "In Help, use Up and Down to move between sections. With the instructions focused, press Space to hear the section again. Shift+Up and Shift+Down change speech speed. H or Escape closes Help.",
        ],
    },
    {
        id: "load",
        title: "Load a graph and algorithm",
        items: [
            "From the main window, press G for the Graph Editor. Press Ctrl+Shift+O to open a file or Ctrl+Shift+E for Examples.",
            "In Examples, use Up and Down to choose a file and Enter to open it in the editor. Escape closes Examples.",
            "Press Ctrl+Shift+L to load the open file into the main window. Return there and press A for the Algorithm Editor. Choose and load an algorithm the same way.",
        ],
    },
    {
        id: "run-algorithm",
        title: "Run an algorithm",
        paragraphs: [
            "In the main window, Right steps forward and Left steps back. You can also click the arrows below the graph. Moving to another step stops the previous narration.",
            "Press semicolon to restart, X to export the current graph, or Q to exit. Load another algorithm to reuse the graph. Loading a different graph starts the selected algorithm again.",
        ],
    },
    {
        id: "explore",
        title: "Explore with the keyboard",
        paragraphs: [
            "Press Shift+G to switch GSK graph exploration on or off. The mode change is spoken even when ordinary speech is off.",
            "In GSK mode, Up and Down select a connection. Right follows it and Left returns to the previous node. With speech on, Space describes the current node. Escape stops narration.",
            "Starting an algorithm returns you to default mode. In default mode, Up and Down adjust speech speed.",
        ],
    },
    {
        id: "preferences",
        title: "Preferences and graph editing",
        paragraphs: [
            "Open User Preferences to change speech, speed, graph appearance, or editor settings. Tab through the settings and choose Done to close.",
            "Use Layout to fit or arrange the graph. Press N for node settings or E for edge settings. In edit mode, Z undoes a change, Y redoes it, and R reverts the graph.",
            "Press S to copy graph edits to the graph editor. Use Ctrl+Shift+S in an editor to download its file.",
        ],
    },
    {
        id: "algorithm-output",
        title: "Writing algorithm messages",
        paragraphs: [
            "Use display(text) for the banner, speak(text) for audio, and announce(text) for both. Narration plays when speech is on.",
            "Use description(text) for an introduction. It pauses the algorithm until you choose Continue or press Escape.",
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
