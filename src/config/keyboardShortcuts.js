/**
 * Edit app shortcuts and their labels here. Use key names like "v" or "ArrowRight".
 * Add ctrl or shift for modifiers. Use null to disable a shortcut.
 * Bindings without a mode are shared. Mode bindings take priority.
 * Avoid duplicate keys within a mode. Browser and Monaco shortcuts are separate.
 */
const keyboardShortcuts = {
    // Graph window
    openAlgorithmEditor: { key: "a" },
    openGraphEditor: { key: "g" },
    openHelp: { key: "h" },
    openNodeSettings: { key: "n" },
    openEdgeSettings: { key: "e" },
    openLayoutSettings: null,
    toggleSpeech: { key: "v" },
    toggleGskMode: { key: "g", shift: true },
    increaseSpeechSpeed: { key: "ArrowUp", repeat: true },
    decreaseSpeechSpeed: { key: "ArrowDown", repeat: true },

    // Animation navigation
    stepBack: { key: "ArrowLeft", repeat: true },
    stepForward: { key: "ArrowRight", repeat: true },
    exitAlgorithm: { key: "q" },
    restartAlgorithm: { key: ";" },
    exportGraph: { key: "x" },
    toggleDebugMode: { key: "1" },

    // Graph edits
    undo: { key: "z", repeat: true },
    redo: { key: "y", repeat: true },
    revertGraph: { key: "r" },
    saveGraph: { key: "s" },

    // Editor shortcuts also work while typing.
    loadFile: { key: "l", ctrl: true, shift: true, allowInInput: true },
    downloadFile: { key: "s", ctrl: true, shift: true, allowInInput: true },
    openFile: { key: "o", ctrl: true, shift: true, allowInInput: true },
    openExamples: { key: "e", ctrl: true, shift: true, allowInInput: true },

    // These shortcuts apply to the focused control.
    submitPrompt: { key: "Enter", allowInInput: true },
    finishNodeEdit: { key: "Enter", allowInInput: true },
    finishEdgeEdit: { key: "Enter", allowInInput: true },
    renameTab: { key: "Enter", allowInInput: true },
    selectTab: [{ key: "Enter" }, { key: " " }],

    // Add GSK actions here with mode: "gsk".
    gskNextConnection: {
    key: "ArrowDown",
    mode: "gsk",
    repeat: true
    },
    gskPreviousConnection: {
    key: "ArrowUp",
    mode: "gsk",
    repeat: true
    },
    gskMoveToNeighbor: {
    key: "Enter",
    mode: "gsk"
    },
    gskDescribeNode: {
    key: " ",
    mode: "gsk"
    },
    gskStopSpeech: {
    key: "Escape",
    mode: "gsk"
    },
};

let activeShortcutMode = "default";

/**
 * Switch shortcuts between default and GSK mode for this window.
 */
export function setShortcutMode(mode) {
    if (mode !== "default" && mode !== "gsk") {
        throw new Error(`Unknown shortcut mode: ${mode}`);
    }
    activeShortcutMode = mode;
}

export function toggleShortcutMode() {
    if (activeShortcutMode === "default") {
        setShortcutMode("gsk");
    } else {
        setShortcutMode("default");
    }
    return activeShortcutMode;
}

function matchesKey(event, shortcut) {
    return event.key?.toLowerCase() === shortcut.key.toLowerCase()
        && !!event.ctrlKey === !!shortcut.ctrl
        && !!event.shiftKey === !!shortcut.shift
        && !!event.altKey === !!shortcut.alt
        && !!event.metaKey === !!shortcut.meta;
}

/**
 * Checks keys, modifiers, and typing rules. Use repeat to allow held keys.
 * Mode priority applies to held keys regardless of listener order.
 */
export function matchesShortcut(event, shortcut) {
    if (Array.isArray(shortcut)) {
        return shortcut.some(value => matchesShortcut(event, value));
    }
    if (!shortcut || event.defaultPrevented || event.isComposing) {
        return false;
    }
    if (shortcut.mode && shortcut.mode !== activeShortcutMode) {
        return false;
    }
    const typing = event.target?.closest?.('input, textarea, select, [contenteditable]:not([contenteditable="false"])');
    if (!shortcut.allowInInput && typing) {
        return false;
    }
    // Keep the mode toggle available in both modes.
    const modeToggle = keyboardShortcuts.toggleGskMode;
    if (shortcut !== modeToggle && modeToggle && matchesKey(event, modeToggle)) {
        return false;
    }
    if (!shortcut.mode && shortcut !== modeToggle) {
        const modeHasPriority = Object.values(keyboardShortcuts).flat().some(binding =>
            binding?.mode === activeShortcutMode
            && (!typing || binding.allowInInput)
            && matchesKey(event, binding)
        );
        if (modeHasPriority) {
            return false;
        }
    }
    if (event.repeat && !shortcut.repeat) {
        return false;
    }

    return matchesKey(event, shortcut);
}

/**
 * Keeps labels in sync with shortcut settings.
 */
export function shortcutLabel(shortcut) {
    if (Array.isArray(shortcut)) {
        return shortcut.map(shortcutLabel).join(" / ");
    }
    if (!shortcut) {
        return "";
    }
    const modifiers = [shortcut.ctrl && "Ctrl", shortcut.shift && "Shift", shortcut.alt && "Alt", shortcut.meta && "Meta"].filter(Boolean);
    let key = shortcut.key;
    if (key === " ") {
        key = "Space";
    } else if (modifiers.length) {
        key = key.toUpperCase();
    }
    return [...modifiers, key].join("+");
}

export function shortcutHint(shortcut) {
    if (!shortcut) {
        return "";
    }
    return ` (${shortcutLabel(shortcut)})`;
}

export default keyboardShortcuts;
