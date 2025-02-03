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
     * @param {Number} x X-position of the node
     * @param {Number} y Y-position of the node
     * @returns New node id
     * @author Ziyu Wang
     */
    addNode(x, y) {
        // Record the change
        const change = this.#graph.addNode(x,y);
        this.#recordChange([change]);

        // Return the id of the new node
        return change.current.id;
    }

    /**
     * Adds a new edge to the graph and records the change.
     * @param {String} source Source node id
     * @param {String} target Target node id
     * @author Ziyu Wang
     */
    addEdge(source, target) {
        // Record the change
        this.#recordChange([this.#graph.addEdge(source, target)]);
    }

    /**
     * Adds a new message and records the change.
     * @param {String} message Message to record
     */
    addMessage(message) {
        // Record the change
        this.#recordChange([this.#graph.addMessage(message)]);
    }

    /**
     * Deletes a node from the graph and records the changes.
     * @param {String} nodeId Id of the node to delee
     */
    deleteNode(nodeId) {
        // Record the change
        // Note: since deleteNode already returns an array, don't need brackets
        this.#recordChange(this.#graph.deleteNode(nodeId));
    }

    /**
     * Deletes an edge from the graph and records the change.
     * @param {String} source Source node id
     * @param {String} target Target node id
     */
    deleteEdge(source, target) {
        // Record the change
        this.#recordChange([this.#graph.deleteEdge(source, target)]);
    }

    /**
     * Sets a new node position and records the change.
     * @param {String} nodeId Node to move
     * @param {Number} x New x-position
     * @param {Number} y New y-position
     */
    setNodePosition(nodeId, x, y) {
        // Record the change
        this.#recordChange([this.#graph.setNodePosition(nodeId, x, y)]);
    }

    /**
     * Sets an attribute for a node and records the change.
     * @param {String} nodeId Id of the node
     * @param {String} name Name of the attribute
     * @param {Object} value Value of the attribute
     */
    setNodeAttribute(nodeId, name, value) {
        // Record the change
        this.#recordChange([this.#graph.setNodeAttribute(nodeId, name, value)]);
    }

    /**
     * Sets an attribute for an edge and records the change.
     * @param {String} source Source node id
     * @param {String} target Target node id
     * @param {String} name Name of the attribute
     * @param {Object} value Value of the attribute
     */
    setEdgeAttribute(source, target, name, value) {
        // Record the change
        this.#recordChange([this.#graph.setEdgeAttribute(source, target, name, value)]);
    }

    /**
     * Undoes the last change made to the graph
     * @author Ziyu Wang
     */
    undo() {
        // Check if there are any changes to undo
        if (this.#index > 0) {
            // Get the previous step
            const step = this.#changes[--this.#index];

            // Undo the change
            this.#graph.undoStep(step);

            // Update cytoscape and the step counter in user edit mode
            window.updateCytoscape();
            window.updateStep();
        }
    }

    /**
     * Redoes the last change that was undone
     * @author Ziyu Wang
     */
    redo() {
        // Check if there are any changes to redo
        if (this.#index < this.#changes.length) {
            // Get the next step
            const step = this.#changes[this.#index++];

            // Redo the change
            this.#graph.redoStep(step);

            // Update cytoscape and the step counter in user edit mode
            window.updateCytoscape();
            window.updateStep();
        }
    }

    /**
     * Undoes all changes back to the original graph.
     */
    revert() {
        while (this.#index > 0) {
            this.undo();
        }
    }

    /**
     * Gets the length of changes
     */
    get length() {
        return this.#changes.length;
    }

    /**
     * Gets the current index in changes
     */
    get index() {
        return this.#index;
    }

    /**
     * Records a change and updates the index.
     * @param {ChangeObject} change Change object to record
     * @author Ziyu Wang
     */
    #recordChange(change) {
        // Remove all changes after the current index
        this.#changes = this.#changes.slice(0, this.#index);

        // Push the new change
        this.#changes.push(change);

        // Increment the index
        this.#index++;

        // Update cytoscape and the step counter in user edit mode
        window.updateCytoscape();
        window.updateStep();
    }

}
