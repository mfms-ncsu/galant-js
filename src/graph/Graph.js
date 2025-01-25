import ChangeManager from "./ChangeManager/ChangeManager.js";
import FileParser from "./FileParser/FileParser.js";

/**
 * Graph stores the representation of the current graph and has an interface
 * to retrieve adjacency information as well as exporting the graph to a file
 * or cytoscape.
 * Graph also contains interfaces for loading a graph from a file through its
 * file parser and modifying the graph representation through user and algorithm
 * change managers.
 * 
 * @author Henry Morris
 */
class Graph {
    /** Map of nodes in the graph */
    #nodes;

    /**
     * Creates a new graph with nodes, file parser, and change managers.
     */
    constructor() {
        // Create a new map to store a list of the nodes
        this.#nodes = new Map();

        // Create a file parser to load files into this graph
        this.fileParser = new FileParser(this, this.#privateMethods);

        // Create two change managers --- one for user changes and one for algorithm changes.
        this.userChangeManager = new ChangeManager(this, this.#privateMethods);
        this.algorithmChangeManager = new ChangeManager(this, this.#privateMethods);
    }

    /** Public methods */
    getEdge(source, target) {}
    getOutgoingEdges(source) {}
    getIncomingEdges(target) {}
    getAllEdges(nodeId) {}
    toCytoscape() {}

    /** Private methods */
    #addNode(x, y, nodeId, attributes) {}
    #addEdge(source, target, attributes) {}
    #addMessage(message) {}
    #deleteNode(nodeId) {}
    #deleteEdge(source, target) {}
    #setNodePosition(nodeId, x, y) {}
    #setNodeAttribute(nodeId, name, value) {}
    #setEdgeAttribute(source, target, name, value) {}
    #undoChange(change) {}
    #redoChange(change) {}

    /**
     * Private object containing all private methods for passing into file parser
     * and change managers so they can access them.
     */
    #privateMethods = {
        addNode: this.#addNode,
        addEdge: this.#addEdge,
        addMessage: this.#addMessage,
        deleteNode: this.#deleteNode,
        deleteEdge: this.#deleteEdge,
        setNodePosition: this.#setNodePosition,
        setNodeAttribute: this.#setNodeAttribute,
        setEdgeAttribute: this.#setEdgeAttribute,
        undoChange: this.#undoChange,
        redoChange: this.#redoChange
    }
}

/** Export a single instance of Graph */
export default new Graph();