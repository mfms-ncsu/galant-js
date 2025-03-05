/**
 * Graph stores the representation of the current graph.
 * 
 * @author Henry Morris
 */
export default class Graph {
    /** Directed graph flag */
    isDirected;
    /** Map of nodes in the graph */
    nodes;
    /** Graph type */
    type;
    /** Scale */
    scalar;

    /**
     * Creates a new graph with nodes.
     */
    constructor(type) {
        this.isDirected = false;
        this.type = type;
        this.nodes = new Map();
    }
}