import ChangeManager from "./ChangeManager/ChangeManager.js";
import ChangeObject from "./ChangeManager/ChangeObject.js";
import CytoscapeManager from "./CytoscapeManager/CytoscapeManager.js";
import Edge from "./GraphElement/Edge.js";
import FileParser from "./FileParser/FileParser.js";
import Message from "./GraphElement/Message.js";
import Node from "./GraphElement/Node.js";

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
export class Graph {
    /** Map of nodes in the graph */
    #nodes;
    /** Scale */
    #scalar;

    /**
     * Creates a new graph with nodes, file parser, and change managers.
     */
    constructor() {
        // Create a new map to store a list of the nodes
        this.#nodes = new Map();

        // Use this scalar in toCytoscape
        this.#scalar = 1;

        // Create a file parser to load files into this graph
        this.fileParser = new FileParser(this, this.#privateMethods);

        // Create two change managers --- one for user changes and one for algorithm changes
        this.userChangeManager = new ChangeManager(this, this.#privateMethods);
        this.algorithmChangeManager = new ChangeManager(this, this.#privateMethods);

        // Create a cytoscape manager to generate element and style arrays of the graph
        this.cytoscapeManager = new CytoscapeManager(this, this.#privateMethods);
    }



    /**
     * Used on the frontend to trigger useEffect whenever the graph changes.
     * @returns A deep copy of the graph's nodes
     */
    getNodesCopy() {
        return JSON.parse(JSON.stringify(this.#nodes));
    }

    /**
     * Gets the edge between a given source and a given target node.
     * @param {String} source Source node id
     * @param {String} target Target node id
     * @returns Edge between source and target, undefined if it doesn't exist
     */
    getEdge(source, target) {
        // Check if the source node exists
        if (this.#nodes.has(source)) {
            // If it does, try to get the edge from source to target
            return this.#nodes.get(source).edges.get(`${source},${target}`);
        } else {
            // If the source node doesn't exist, return undefined
            return undefined;
        }
    }

    /**
     * Gets all edges into and out of the given node.
     * @param {String} nodeId Node id
     * @returns Array of all edges incident to nodeId, undefined if nodeId doesn't exist
     */
    getAllEdges(nodeId) {
        // Check if the node exists
        if (this.#nodes.has(nodeId)) {
            // If it does, return an array of all of its edges
            return [...this.#nodes.get(nodeId).edges.values()];
        } else {
            // If the node doesn't exist, return undefined
            return undefined;
        }
    }

    /**
     * Gets all edges incoming to the given node.
     * @param {String} target Target node id
     * @returns Array of edges incoming to target, undefined if the target doesn't exist
     */
    getIncomingEdges(target) {
        // Return undefined if the node doesn't exist
        if (!this.#nodes.has(target)) {
            return undefined;
        }

        // Keep an array of edges
        const edges = [];

        // Iterate over all edges
        this.#nodes.get(target).edges.forEach(edge => {
            // Only push if the given node is the target
            if (edge.target === target) {
                edges.push(edge);
            }
        });

        return edges;
    }

    /**
     * Gets all edges ougoing from the given node.
     * @param {String} source Source node id
     * @returns Array of edges outgoing from source, undefined if source doesn't exist
     */
    getOutgoingEdges(source) {
        // Return undefined if the node doesn't exist
        if (!this.#nodes.has(source)) {
            return undefined;
        }

        // Keep an array of edges
        const edges = [];

        // Iterate over all edges
        this.#nodes.get(source).edges.forEach(edge => {
            // Only push if the given node is the source
            if (edge.source === source) {
                edges.push(edge);
            }
        });

        return edges;
    }



    /**
     * Removes all nodes from the graph.
     */
    #clear() {
        this.#nodes = new Map();
    }

    /**
     * Generates a scale for the graph after being loaded
     */
    #scale() {
        let max = 1;
        this.#nodes.forEach(node => {
            max = Math.max(max, Math.abs(node.position.x), Math.abs(node.position.y));
        });
        this.#scalar = 500 / max;
    }

    #getScalar() {
        return this.#scalar;
    }

    #getNodes() {
        return this.#nodes;
    }
    
    /**
     * Adds a new node to the graph at the specified position.
     * @param {Number} x X position
     * @param {Number} y Y position
     * @param {String} nodeId Optional argument for setting a predetermined 
     * @param {Object} attributes Initial attributes of the node
     * @returns ChangeObject representing adding a node
     * @throws Error if nodeId already exists in nodes
     */
    #addNode(x, y, nodeId, attributes) {
        // Throw an error if the id is a duplicate
        if (nodeId && this.#nodes.has(nodeId)) {
            throw "Cannot add node with duplicate ID";
        }

        // If the nodeId argument is passed, use that, otherwise generate an id
        nodeId = nodeId || generateId(this.#nodes);

        // Create the node
        let node = new Node(nodeId, x, y);
        this.#nodes.set(nodeId, node);

        // Set the attributes
        for (let name in attributes) {
            node.attributes.has(name) && node.attributes.set(name, attributes[name]);
        }

        // Return a new change object
        return new ChangeObject('addNode', null, {
            id: nodeId,
            position: {
                x: x,
                y: y
            }
        });

        // Get the smallest unused node id for automatic assigning
        function generateId(nodes) {
            let id = 0;
            while (nodes.has(String(id))) id++;
            return String(id);
        }
    }

    /**
     * Adds a new edge to the graph between the specified source and target nodes.
     * @param {String} source Source node id
     * @param {String} target Target node id
     * @param {Object} attributes Initial attributes of the edge
     * @returns ChangeObject representing adding an edge
     * @throws Error if either source or target do not exist in nodes
     */
    #addEdge(source, target, attributes) {
        // Check if both source and target exist, throw an error if not
        if (!(this.#nodes.has(source) && this.#nodes.has(target))) {
            throw "Source and target nodes must exist";
        }

        // Create the edge object
        let edge = new Edge(source, target);

        // Set the attributes
        for (let name in attributes) {
            edge.attributes.has(name) && edge.attributes.set(name, attributes[name]);
        }

        // Add the edge to both the source and target's adjacency lists
        this.#nodes.get(source).edges.set(`${source},${target}`, edge);
        this.#nodes.get(target).edges.set(`${source},${target}`, edge);

        // Return a new ChangeObject
        return new ChangeObject("addEdge", null, {
            source: source,
            target: target
        });
    }

    /**
     * Creates a new Message and returns a ChangeObject with the message.
     * @param {String} message Message to display
     * @returns ChangeObject containing the message
     */
    #addMessage(message) {
        // Create a new message object
        // NOTE: currently doing nothing with this
        const newMessage = new Message(message);

        // Return a new ChangeObject
        return new ChangeObject("message", null, {
            message: message
        });
    }

    /**
     * Deletes a node and its incident edges from the graph. Creates ChangeObjects
     * for each deletion in the step and returns them in an array.
     * @param {String} nodeId ID of the node to delete
     * @returns Array of ChangeObjects for the node and its incident edges
     */
    #deleteNode(nodeId) {
        // Keep an array of ChangeObjects for the delete step
        const changeObjects = [];

        // Get a reference to the node
        const node = this.#nodes.get(nodeId);

        // Delete each edge and push the change objects into the array
        node.edges.forEach(edge => {
            changeObjects.push(this.#deleteEdge(edge.source, edge.target));
        });

        // Create a ChangeObject for the deleted node
        changeObjects.push(new ChangeObject("deleteNode", {
            id: node.id,
            position: node.position,
            attributes: JSON.stringify(node.attributes)
        }, null));

        // Finally, delete the node from the nodes list
        this.#nodes.delete(nodeId);

        // Return the array of ChangeObjects
        return changeObjects;
    }

    /**
     * Deletes the specified edge and creates the appropriate ChangeObject.
     * @param {String} source ID of the source node
     * @param {String} target ID of the target node
     * @returns ChangeObject representing the deleted edge
     */
    #deleteEdge(source, target) {
        // Get a copy of the attributes
        const attributes = this.#nodes.get(source).edges.get(`${source},${target}`).attributes;

        // Delete the edge in the nodes
        this.#nodes.get(source).edges.delete(`${source},${target}`);
        this.#nodes.get(target).edges.delete(`${source},${target}`);

        // Return a new ChangeObject
        return new ChangeObject("deleteEdge", {
            source: source,
            target: target,
            attributes: JSON.stringify(attributes)
        }, null);
    }

    /**
     * Updates a node's position and creates a ChangeObject for the move.
     * @param {String} nodeId Node to move
     * @param {Number} x New x-position
     * @param {Number} y New y-position
     * @returns ChangeObject representing the move
     */
    #setNodePosition(nodeId, x, y) {
        // Get a reference to the node
        const node = this.#nodes.get(nodeId);

        // Store old and new values for the position
        let oldPosition = node.position;
        let newPosition = {
            x: x,
            y: y
        };

        // Update the node's position
        node.position = newPosition;

        // Return a new ChangeObject
        return new ChangeObject("setNodePosition", {
            id: nodeId,
            position: oldPosition
        }, {
            id: nodeId,
            position: newPosition
        });
    }

    /**
     * Sets a new value for an attribute within a node and creates a corresponding
     * ChangeObject to record the change.
     * @param {String} nodeId Node for which to set an attribute value
     * @param {String} name Name of the attribute to set
     * @param {Object} value Value to set for the attribute
     * @returns A ChangeObject representing the attribute change
     */
    #setNodeAttribute(nodeId, name, value) {
        // Get a reference to the node
        const node = this.#nodes.get(nodeId);

        // Store the old value
        let oldValue = node.attributes.get(name);

        // Update the node's attribute
        node.attributes.set(name, value);

        // Return a new ChangeObject
        return new ChangeObject("setNodeAttribute", {
            id: nodeId,
            attribute: {
                name: name,
                value: oldValue
            }
        }, {
            id: nodeId,
            attribute: {
                name: name,
                value: value
            }
        });
    }

    /**
     * Sets a new value for an attribute within an edge and creates a corresponding
     * ChangeObject to record the change.
     * @param {String} source Source node of the edge for which to set an attribute value
     * @param {String} target Target node of the edge for which to set an attribute value
     * @param {String} name Name of the attribute to set
     * @param {Object} value Balue to set for the attribute
     * @returns A ChangeObject representing the attribute change
     */
    #setEdgeAttribute(source, target, name, value) {
        // Get a reference to the edge
        const edge = this.#nodes.get(source).edges.get(`${source},${target}`);

        // Store the old value
        let oldValue = edge.attributes.get(name);

        // Update the edge's attribute
        edge.attributes.set(name, value);

        // Return a new ChangeObject
        return new ChangeObject("setEdgeAttribute", {
            source: source,
            target: target,
            attribute: {
                name: name,
                value: oldValue
            }
        }, {
            source: source,
            target: target,
            attribute: {
                name: name,
                value: value
            }
        });
    }

    /** Breifly implemented, debugging and polishing needed */
    #undoChange(change) {
        switch (change.type) {
            case "addNode":
                this.#nodes.delete(change.new.id);
                break;
            case "deleteNode":
                this.#nodes.set(change.old.id, new Node(change.old.id, change.old.position.x, change.old.position.y));
                break;
            case "addEdge":
                this.#nodes.get(change.new.source).edges.delete(`${change.new.source},${change.new.target}`);
                this.#nodes.get(change.new.target).edges.delete(`${change.new.source},${change.new.target}`);
                break;
            case "deleteEdge":
                this.#nodes.get(change.old.source).edges.set(`${change.old.source},${change.old.target}`, new Edge(change.old.source, change.old.target));
                this.#nodes.get(change.old.target).edges.set(`${change.old.source},${change.old.target}`, new Edge(change.old.source, change.old.target));
                break;
            case "setNodePosition":
                this.#nodes.get(change.old.id).position = change.old.position;
                break;
            case "setNodeAttribute":
                this.#nodes.get(change.old.id).attributes.set(change.old.attribute.name, change.old.attribute.value);
                break;
            case "setEdgeAttribute":
                this.#nodes.get(change.old.source).edges.get(`${change.old.source},${change.old.target}`).attributes.set(change.old.attribute.name, change.old.attribute.value);
                break;
            default:
                break;
        }
    }
    
    /** Breifly implemented, debugging and polishing needed */
    #redoChange(change) {
        switch (change.type) {
            case "addNode":
                this.#nodes.set(change.new.id, new Node(change.new.id, change.new.position.x, change.new.position.y));
                break;
            case "deleteNode":
                this.#nodes.delete(change.old.id);
                break;
            case "addEdge":
                this.#nodes.get(change.new.source).edges.set(`${change.new.source},${change.new.target}`, new Edge(change.new.source, change.new.target));
                this.#nodes.get(change.new.target).edges.set(`${change.new.source},${change.new.target}`, new Edge(change.new.source, change.new.target));
                break;
            case "deleteEdge":
                this.#nodes.get(change.old.source).edges.delete(`${change.old.source},${change.old.target}`);
                this.#nodes.get(change.old.target).edges.delete(`${change.old.source},${change.old.target}`);
                break;
            case "setNodePosition":
                this.#nodes.get(change.new.id).position = change.new.position;
                break;
            case "setNodeAttribute":
                this.#nodes.get(change.new.id).attributes.set(change.new.attribute.name, change.new.attribute.value);
                break;
            case "setEdgeAttribute":
                this.#nodes.get(change.new.source).edges.get(`${change.new.source},${change.new.target}`).attributes.set(change.new.attribute.name, change.new.attribute.value);
                break;
            default:
                break;
        }
    }

    /**
     * Private object containing all private methods for passing into file parser
     * and change managers so they can access them.
     */
    #privateMethods = {
        clear: this.#clear,
        scale: this.#scale,
        getScalar: this.#getScalar,
        getNodes: this.#getNodes,
        addNode: this.#addNode,
        addEdge: this.#addEdge,
        addMessage: this.#addMessage,
        deleteNode: this.#deleteNode,
        deleteEdge: this.#deleteEdge,
        setNodePosition: this.#setNodePosition,
        setNodeAttribute: this.#setNodeAttribute,
        setEdgeAttribute: this.#setEdgeAttribute,
        undoChange: this.#undoChange,
        redoChange: this.#redoChange,
    }
}

/** Export a single instance of Graph */
export default new Graph();
