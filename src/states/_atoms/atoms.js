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
export const gskModeAtom = atomWithStorage('gskMode', false);
export const gskCurrentNodeIdAtom = atom(null);
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
