/**
 * Graph stores the representation of the current graph.
 * 
 * @author Henry Morris
 */
export default class Graph {
    /** Directed graph flag */
    isDirected;
    /** Name of the graph */
    name;
    /** Map of nodes in the graph */
    nodes;
    /** Graph type */
    type;
    /** Array of x and y scales */
    scalar;

    /**
     * Creates a new graph with nodes.
     */
    constructor(name, type) {
        this.isDirected = false;
        this.type = type;
        this.name = name;
        this.nodes = new Map();
    }
}