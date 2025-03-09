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