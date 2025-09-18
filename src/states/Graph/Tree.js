import Graph from "./Graph";

/**
 * Subclass of Graph.js. The initial type is tree
 * @todo: Need to decide if any more attributes need to be added
 */
export default class Tree extends Graph {
    constructor(name) {
        super(name, "tree");
    }
}