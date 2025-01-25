/**
 * ChangeManager is an interface for its graph which allows either the
 * algorithm or a user to modify the graph representation. ChangeManager
 * maintains a list of ChangeObjects and an index pointing to the current
 * state between changes.
 * 
 * @author Henry Morris
 */
export default class ChangeManager {
    /** Graph object for which change */
    #graph;
    /** List of steps containing changes */
    #changes;
    /** Current index within changes */
    #index;

    /**
     * Constucts a new ChangeManager with the graph for which to change. Takes in
     * the public graph object as well as its private methods, which are necessary
     * for directly modifying the graph representation.
     * @param {Graph} graph Graph for which to change
     * @param {Object} privateMethods Private methods of the graph
     */
    constructor(graph, privateMethods) {
        // Import the graph object
        this.#graph = graph;
        // Add the private methods into the graph object so the graph can be treated
        // like a single interface
        for (let method in privateMethods) {
            this.#graph[method] = privateMethods[method];
        }

        // Create an empty representation of changes
        this.#changes = [];
        this.#index = 0;
    }

    /** Methods for creating new ChangeObjects */
    addNode(x, y) {}
    addEdge(source, target) {}
    addMessage(message) {}
    deleteNode(nodeId) {}
    deleteEdge(source, target) {}
    setNodeAttribute(nodeId, name, value) {}
    setEdgeAttribute(source, target, name, value) {}

    /**
     * Methods for traversing the existing ChangeObjects Should pass the appropriate 
     * ChangeObject to undo/redoChange in the graph and update the index.
     */
    undo() {}
    redo() {}
}