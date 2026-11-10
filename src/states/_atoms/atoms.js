import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import StandardGraph from "states/Graph/StandardGraph";
import ChangeManager from "states/ChangeManager/ChangeManager";

export const graphAtom = atom(new StandardGraph());

export const algorithmChangeManagerAtom = atom(new ChangeManager());
export const userChangeManagerAtom = atom(new ChangeManager());

export const algorithmAtom = atom(null);

export const promptQueueAtom = atom([]);
export const promptAtom = atom(
    (get) => get(promptQueueAtom)[0]
);

export const graphTabsAtom = atomWithStorage('graphTabs', []);
export const algorithmTabsAtom = atomWithStorage('algorithmTabs', []);

export const speechEnabledAtom = atom(false);
/**  Whether the graph exploration is enabled */
export const gskModeAtom = atomWithStorage('gskMode', false);
/** The node user is currently exploring */
export const gskCurrentNodeIdAtom = atom(null);
/** tells gsk to clear navigation history */
export const gskNavigationResetAtom = atom(0);

const storedSpeechSpeedAtom = atomWithStorage('speechSpeed', 1.0);

// Round older saved speeds to the new range.
export const speechSpeedAtom = atom(
    (get) => Math.min(10, Math.max(0.25, Math.round(get(storedSpeechSpeedAtom) * 4) / 4)),
    (get, set, speed) => {
        if (typeof speed === 'function') {
            speed = speed(get(speechSpeedAtom));
        }
        set(storedSpeechSpeedAtom, speed);
    }
);

/** Colors for Light, Dark, and the five graph palettes. */
export const graphThemePresets = {
    light: {
        background: "#ffffff",
        text: "#000000",
        node: "#ffffff",
        edge: "#444444"
    },
    dark: {
        background: "#111827",
        text: "#f9fafb",
        node: "#374151",
        edge: "#d1d5db"
    },
    blueOrange: {
        background: "#ffffff",
        text: "#111111",
        node: "#e69f00",
        edge: "#0072b2"
    },
    ocean: {
        background: "#eff6ff",
        text: "#172554",
        node: "#bfdbfe",
        edge: "#1d4ed8"
    },
    forest: {
        background: "#f0fdf4",
        text: "#052e16",
        node: "#bbf7d0",
        edge: "#166534"
    },
    plum: {
        background: "#faf5ff",
        text: "#3b0764",
        node: "#e9d5ff",
        edge: "#7e22ce"
    },
    sand: {
        background: "#fffbeb",
        text: "#451a03",
        node: "#fde68a",
        edge: "#92400e"
    }
};

/** default color of the graph */
export const defaultAppearance = {
    theme: "light", //start with the light theme
    ...graphThemePresets.light //Use the light theme colors
};

/** saves the graph appearance in  */
export const appearanceAtom = atomWithStorage(
    "galantAppearance",
    defaultAppearance
);

/** default font, size, and colors for the editors */
export const defaultEditorPreferences = {
    fontFamily: "monospace",
    fontSize: 14,
    foreground: "#000000",
    background: "#ffffff"
};

/** Save the editor settings in the browser */
export const editorPreferencesAtom = atomWithStorage(
    "galantEditorPreferences",
    defaultEditorPreferences
);