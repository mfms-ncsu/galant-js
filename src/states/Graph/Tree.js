import Graph from "./Graph";

/**
 * Subclass of Graph.js. The initial type is tree
 * @todo: Need to decide if any more attributes need to be added
 */
export default class Tree extends Graph {

    /**
     * Can be a genral rooted tree or a binary tree.
     * Binary trees display the weights inside of their nodes.
     */
    treeType = "rooted";

    constructor(name) {
        super(name, "tree");
    }
}