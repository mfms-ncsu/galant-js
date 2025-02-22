/**
 * ChangeManager is an interface for its graph which allows either the
 * algorithm or a user to modify the graph representation. ChangeManager
 * maintains a list of ChangeObjects and an index pointing to the current
 * state between changes.
 * 
 * @author Henry Morris
 * @author Krisjian Smith
 */
export default class ChangeManager {
    
    /** Graph object for which change */
    #graph;
    /** List of steps containing changes */
    #changes;
    /** Current index within changes */
    #index;

    /**
     * Flag representing whether or not the ChangeManager is currently
     * recording changes
     */
    #isRecording

    /**
     * Temporary list of ChangeObjects used to record a list of several
     * changes. This is used when multiple changes happen in a single
     * algorithm step, so that they are all undone/redone at once
     */
    #currentChangeList


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

        // Set up the temporary change list and isRecording flags
        this.#isRecording = false;
        this.#currentChangeList = [];
    }

    /** Methods for starting and ending a recording of several changes */

    /**
     * Makes the ChangeManager start recording. When recording, the ChangeManager
     * will not save any new ChangeObjects until the recording is over. When the
     * recording is over, it will save all the ChangeObjects at once, so that they
     * will all be undone/redone at once
     */
    startRecording() {
        
        // If we are already recording, and startRecording() is called, then something
        // went wrong. We should throw an error to let the user know that something
        // happened
        if (this.#isRecording) {
            throw new Error("Cannot start recording because this ChangeManager is already recording");
        }
        
        // Reset the change list and set the isRecording flag to true
        this.#currentChangeList = [];
        this.#isRecording = true;
    }

    /**
     * Makes the ChangeManager stop recording. Any changes that happened while recording will be
     * saved as a single entry in the changes list.
     */
    endRecording() {
        
        // If we are not recording, then we cannot stop recording.
        if (!this.#isRecording) {
            throw new Error("Cannot stop recording becausee this ChangeManager has not started recording");
        }


        // Set the isRecording flag back to false
        this.#isRecording = false;
    
        // Record the list of changes, but only if changes were actually made. If
        // the currentChangeList is empty, do nothing.
        if (this.#currentChangeList.length !== 0) {
            this.#recordChange(this.#currentChangeList);
        }

    }
    
    /**
     * Returns true if this ChangeManager is currently recording
     */
    isRecording() {
        return this.#isRecording;
    }

    /** Methods for creating new ChangeObjects */
    
    /**
     * Clears the list of ChangeObjects. This method is used when
     * a new algorithm is loaded. If the list of ChangeObjects is not
     * cleared when a new algorithm or graph is loaded, then the undo/
     * redo feature will try to undo/redo changes from the previous
     * graph or algorithm.
     */
    clear() {
        this.#changes = [];
        this.#index = 0;
        this.#isRecording = false;
        this.#currentChangeList = [];
    }
    
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
     * Sets an attribute for all nodes and records the change.
     * @param {String} name Attribute name
     * @param {Object} value Attribute value
     */
    setNodeAttributeAll(name, value) {
        // Record the change
        // Note: since setNodeAttributeAll returns an array, don't need brackets
        this.#recordChange(this.#graph.setNodeAttributeAll(name, value));
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
     * Sets an attribute for all edges and records the change.
     * @param {String} name Attribute name
     * @param {Object} value Attribute value
     */
    setEdgeAttributeAll(name, value) {
        // Record the change
        // Note: since setEdgeAttributeAll returns an array, don't need brackets
        this.#recordChange(this.#graph.setEdgeAttributeAll(name, value));
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
            if (typeof window !== "undefined" && window.self === window.top) {
                window.updateCytoscape();
                window.updateStep();
                window.updateMessage();
            }
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
            if (typeof window !== "undefined" && window.self === window.top) {
                window.updateCytoscape();
                window.updateStep();
                window.updateMessage();
            }
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
    getLength() {
        return this.#changes.length;
    }

    /**
     * Gets the current index in changes
     */
    getIndex() {
        return this.#index;
    }

    /**
     * Gets the most recent message to display for the user.
     * @returns Most recent message added to changes
     */
    getMessage() {
        for (let i = this.#index; i >= 0; i--) {
            if (this.#changes[i]) {
                for (const change of this.#changes[i]) {
                    if (change.action === "message") {
                        return change.current.message;
                    }
                }
            }
        }
        return null;
    }
    
    /**
     * Records a change and updates the index.
     * @param {ChangeObject} change Change object to record
     * @author Ziyu Wang
     * @author Krisjian Smith
     */
    #recordChange(change) {
        
        // Remove all changes after the current index
        this.#changes = this.#changes.slice(0, this.#index);

        // If we are recording, save the change to the temporary
        // list of changes and return.
        // NOTE: When recording, the cytoscape window will not
        //       be updated. This is important, as
        //       we do not want the window to be updated when
        //       a recording is happening. Recordings
        //       should be started when an algorithm
        //       is doing multiple things in one step. In this
        //       case, we want everything to appear to happen
        //       at one time, but if the window was updated
        //       with every change, we would be able to see
        //       every individual change
        if (this.#isRecording) {
            
            for (let changeObj of change) {
                this.#currentChangeList.push(changeObj);
            }

            return;
        }

        // Push the new change
        this.#changes.push(change);
 
        // Increment the index
        this.#index++;

        // Update cytoscape and the step counter in user edit mode
        if (typeof window !== "undefined" && window.self === window.top) {
            window.updateCytoscape();
            window.updateStep();
            window.updateMessage();
        }
    }

}
