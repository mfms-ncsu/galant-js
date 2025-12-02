import Graph from "./Graph";

/**
 * Subclass of Graph.js. The initial type is tree
 * @todo: Need to decide if any more attributes need to be added
 */
export default class Tree extends Graph {

    /**
     * Can be a genral rooted tree or a binary tree.
     * Currently no difference in behavior between the two, other than acting as keywords for the file parser.
     */
    treeType = "rooted";

    /**
     * Option to have the weights of nodes display as the labels
     * instead of boxes above nodes.
     */
    weightsInside = false;

    constructor(name) {
        super(name, "tree");
    }
}