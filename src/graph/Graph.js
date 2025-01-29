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
class Graph {
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
     */
    #addNode(x, y, nodeId, attributes) {
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
     */
    #addEdge(source, target, attributes) {
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