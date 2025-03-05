import { atom } from "jotai";
import StandardGraph from "utils/graph/Graph/StandardGraph";
import ChangeManager from "utils/graph/ChangeManager/ChangeManager";

export const graphAtom = atom(new StandardGraph());
export const algorithmChangeManagerAtom = atom(new ChangeManager());
export const userChangeManagerAtom = atom(new ChangeManager());