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
    
    /**
     * Adds a new node to the graph and records the change.
     * @param {*} x x position of the node
     * @param {*} y y position of the node
     * @author Ziyu Wang
     */
    addNode(x, y) {
        // Record the change
        const change = this.#graph.addNode(x,y);
        this.#recordChange([change]);
        return change.current.id;
    }

    /**
     * Adds a new edge to the graph and records the change.
     * @param {*} source Source node id
     * @param {*} target Target node id
     * @author Ziyu Wang
     */
    addEdge(source, target) {
        // Record the state before the change
        this.#recordChange([this.#graph.addEdge(source, target)]);
    }

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

    /**
     * Records a change and updates the index.
     * @param {ChangeObject} change Change object to record
     * @author Ziyu Wang
     */
    #recordChange(change) {
        // Remove all changes after the current index
        this.#changes = this.#changes.slice(0, this.#index);
        this.#changes.push(change);
        this.#index += 1;
    }

}