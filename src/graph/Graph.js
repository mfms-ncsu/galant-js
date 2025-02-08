import ChangeManager from "./ChangeManager/ChangeManager.js";
import ChangeObject from "./ChangeManager/ChangeObject.js";
import CytoscapeManager from "./CytoscapeManager/CytoscapeManager.js";
import Edge from "./GraphElement/Edge.js";
import FileParser from "./FileParser/FileParser.js";
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
    /** Flag for whether the graph is directed or not */
    #isDirected;

    /**
     * Creates a new graph with nodes, file parser, and change managers.
     */
    constructor() {
        // Create a new map to store a list of the nodes
        this.#nodes = new Map();

        // Use this scalar in toCytoscape
        this.#scalar = 1;

        // Set to false
        this.#isDirected = false;

        // Create a file parser to load files into this graph
        this.fileParser = new FileParser(this, this.#privateMethods);

        // Create two change managers --- one for user changes and one for algorithm changes
        this.userChangeManager = new ChangeManager(this, this.#privateMethods);
        this.algorithmChangeManager = new ChangeManager(this, this.#privateMethods);

        // Create a cytoscape manager to generate element and style arrays of the graph
        this.cytoscapeManager = new CytoscapeManager(this, this.#privateMethods);
    }

    /**
     * Converts the graph to a string representation for exporting to a file.
     * @returns String representation of the current graph
     * @author Ziyu Wang
     */
    toGraphString() {
        let content = "";

        this.#nodes.forEach(node => {
            let attributesString = "";
            if (node.attributes.size > 0) {
                attributesString = " " + [...node.attributes.entries()]
                    .filter(([_,value]) => value !== undefined && value !== false && value !== "")
                    .map(([key, value]) => `${key}:${value}`)
                    .join(" ");
            }
            // eslint-disable-next-line no-undef
            content += `n ${node.id} ${node.position.x} ${node.position.y}${attributesString}\n`;
        });

        this.#nodes.forEach(node => {
            node.edges.forEach(edge => {
                if (edge.source === node.id) {
                    content += `e ${edge.source} ${edge.target}\n`;
                }
            });
        });

        return content;
    }

    /**
     * Gets this graph's scalar.
     * @returns This graph's scalar
     */
    getScalar() {
        return this.#scalar;
    }

    /**
     * Gets this graph's nodes in an array.
     * @returns This graph's nodes in an array
     */
    getNodeArray() {
        return [...this.#nodes.keys()];
    }

    /**
     * Gets an array of all edges in the graph.
     * @returns All edges in the graph
     */
    getEdges() {
        
        // NOTE: This function returns the key of each edge (for edge a->b,
        //       returns the string "a,b". However, for all of our other
        //       edge functions (getAllEdges, getIncomingEdges, etc.) we
        //       return the edge object itself. Why is this one different?
        const edges = [];

        this.#nodes.forEach(node => {
            node.edges.forEach((edge, key) => {
                if (edge.source === node.id) {
                    edges.push(key);
                }
            });
        });

        return edges;
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
            return [...this.#nodes.get(nodeId).edges.keys()];
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
        this.#nodes.get(target).edges.forEach((edge, key) => {
            // Only push if the given node is the target
            if (edge.target === target || !this.#isDirected) {
                edges.push(key);
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
        this.#nodes.get(source).edges.forEach((edge, key) => {
            // Only push if the given node is the source
            if (edge.source === source || !this.#isDirected) {
                edges.push(key);
            }
        });

        return edges;
    }

    /**
     * Gets the node opposite the given on the given edge.
     * @param {String} nodeId Id of the node to check for
     * @param {String} edgeId Id of the edge to check (Source,Target format)
     * @throws if nodeId does not exist in the graph, or if the given edge does not exist
     * @returns Id of the node opposite the given
     */
    getOppositeNode(nodeId, edgeId) {
        
        // Error checking
        // Note that for getters, we usually just return undefined if the node or edge doesn't exist. I am adding
        // detailed error messages in an attempt to debug some Algorithm functions. Feel free to change these to just
        // return undefined to make it consistent with the rest of the graph functions
        if (!this.#nodes.has(nodeId)) {
            throw new Error("Cannot get opposite node of node \"" + nodeId + "\" because it does not exist in the graph");
        }
        if (!this.#nodes.get(nodeId).edges.has(edgeId)) {
            throw new Error("Cannot get the opposite of edge \"" + edgeId + "\" because it does not exist in the graph");
        }

        // Get the edge
        let edge = this.#nodes.get(nodeId).edges.get(edgeId);
        if (!edge) return undefined;

        // Return the id of the opposite node
        return (edge.source === nodeId) ? edge.target : edge.source;
    }

    /**
     * Gets the position of a given node.
     * @param {String} nodeId Node id
     * @returns Node position
     */
    getNodePosition(nodeId) {
        // Get the node
        let node = this.#nodes.get(nodeId);

        if (node) {
            return node.position;
        } else {
            // If the node doesn't exist, return undefined
            return undefined;
        }
    }

    /**
     * Gets an attribute value for a given node.
     * @param {String} nodeId Node id
     * @param {String} name Attribute name
     * @returns Attribute value
     */
    getNodeAttribute(nodeId, name) {
        // Get the node
        let node = this.#nodes.get(nodeId);

        if (node) {
            return node.attributes.get(name);
        } else {
            // If the node doesn't exist, return undefined
            return undefined;
        }
    }

    /**
     * Gets an attribute value for a given edge.
     * @param {String} source Source node id
     * @param {String} target Target node id
     * @param {String} name Attribute name
     * @returns Attribute value
     */
    getEdgeAttribute(source, target, name) {
        // Verify the edge exists and get it
        let sourceNode = this.#nodes.get(source);
        let targetNode = this.#nodes.get(target);
        let edge = sourceNode && targetNode && sourceNode.edges.get(`${source},${target}`);

        if (edge) {
            return edge.getAttribute(name);
        } else {
            // If the edge doesn't exist, return undefined
            return undefined;
        }
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

    /**
     * Gets this graph's nodes
     * @returns This graph's nodes
     */
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
     * @throw new Errorhrows Error if nodeId already exists in nodes
     */
    #addNode(x, y, nodeId, attributes) {
        // Throw an error if the id is a duplicate
        if (nodeId && this.#nodes.has(nodeId)) {
            throw new Error("Cannot add node with duplicate ID");
        }

        // If the nodeId argument is passed, use that, otherwise generate an id
        nodeId = nodeId || generateId(this.#nodes);

        // Create the node
        let node = new Node(nodeId, x, y);
        this.#nodes.set(nodeId, node);

        // Set the attributes
        for (let name in attributes) {
            node.attributes.set(name, attributes[name]);
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
        // Error checking
        this.#verifyNodes(source, target, "create edge");

        // Create the edge object
        let edge = new Edge(source, target);

        // Set the attributes
        for (let name in attributes) {
            edge.attributes.set(name, attributes[name]);
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

        // Error checking
        if (!node) {
            throw new Error("Cannot delete node " + nodeId + " because it does not exist in the graph");
        }

        // Delete each edge and push the change objects into the array
        node.edges.forEach(edge => {
            changeObjects.push(this.#deleteEdge(edge.source, edge.target));
        });

        // Create a ChangeObject for the deleted node
        changeObjects.push(new ChangeObject("deleteNode", {
            id: node.id,
            position: node.position,
            attributes: node.attributes
        }, null));

        // Finally, delete the node from the nodes list
        this.#nodes.delete(nodeId);

        // Return the array of ChangeObjects
        return changeObjects;
    }

    /**
     * Verifies that the nodes source and target exist. If they do not both exist,
     * an exception with a detailed error message is thrown.
     *
     * @param {String} source the first node to check
     * @param {String} target the second node to check
     * @param {String} action the action to show in the error message. For example,
     *                        if you are trying to add an edge, this string should
     *                        be "add an edge", so that the exception message will
     *                        be shown as "Cannot add an edge because ..."
     * @throws exception if either the source or target nodes do not exist
     */
    #verifyNodes(source, target, action) {
        // Error checking
        if (!this.#nodes.has(source) && !this.#nodes.has(target)) {
            throw new Error("Cannot " + action + " because neither the source (" + source + ") nor the" + 
                  " target (" + target + ") node exist in the graph");
        }
        if (!this.#nodes.has(source)) {
            throw new Error("Cannot " + action + " because the source node (" + source + ")" +
                  " does not exist in the graph");
        }
        if (!this.#nodes.has(target)) {
            throw new Error("Cannot " + action + " because the target node (" + target + ")" +
                  " does not exist in the graph");
        }
    }

    /**
     * Deletes the specified edge and creates the appropriate ChangeObject.
     * @param {String} source ID of the source node
     * @param {String} target ID of the target node
     * @returns ChangeObject representing the deleted edge
     */
    #deleteEdge(source, target) {
        // Error checking
        this.#verifyNodes(source, target, "delete edge");

        // Get a copy of the attributes
        const attributes = this.#nodes.get(source).edges.get(`${source},${target}`).attributes;

        // Delete the edge in the nodes
        this.#nodes.get(source).edges.delete(`${source},${target}`);
        this.#nodes.get(target).edges.delete(`${source},${target}`);

        // Return a new ChangeObject
        return new ChangeObject("deleteEdge", {
            source: source,
            target: target,
            attributes: attributes
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

        // Error checking
        if (!node) {
            throw new Error("Cannot set position of node " + nodeId + " because it does not exist in the graph");
        }

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
        if (!this.#nodes.has(nodeId)) {
            throw new Error("Cannot set attribute of node " + nodeId + " because the node does not exist in the graph");
        }

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
     * Sets a new value for an attribute for all nodes and creates an array
     * of corresponding ChangeObjects.
     * @param {String} name Name of the attribute to set
     * @param {*} value Value to set for the attribute
     * @returns An array of ChangeObjects representing the changes
     */
    #setNodeAttributeAll(name, value) {
        // Keep an array of ChangeObjects for the delete step
        const changeObjects = [];

        this.#nodes.forEach(node => {
            // Store the old value
            let oldValue = node.attributes.get(name);

            // Update the node's attribute
            node.attributes.set(name, value);

            // Push a new change object
            changeObjects.push(new ChangeObject("setNodeAttribute", {
                id: node.id,
                attribute: {
                    name: name,
                    value: oldValue
                }
            }, {
                id: node.id,
                attribute: {
                    name: name,
                    value: value
                }
            }));
        });

        return changeObjects;
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
        // Error checking
        this.#verifyNodes(source, target, "set attribute of edge");

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

    /**
     * Sets a new value for an attribute for all edges and creates an array
     * of corresponding ChangeObjects.
     * @param {String} name Name of the attribute to set
     * @param {*} value Value to set for the attribute
     * @returns An array of ChangeObjects representing the changes
     */
    #setEdgeAttributeAll(name, value) {
        // Keep an array of ChangeObjects for the delete step
        const changeObjects = [];

        // Get the edges
        const edges = [];
        this.#nodes.forEach(node => {
            node.edges.forEach((edge) => {
                if (edge.source === node.id) {
                    edges.push(edge);
                }
            });
        });

        edges.forEach(edge => {
            // Store the old value
            let oldValue = edge.attributes.get(name);

            // Update the edge's attribute
            edge.attributes.set(name, value);

            // Push a new change object
            changeObjects.push(new ChangeObject("setEdgeAttribute", {
                source: edge.source,
                target: edge.target,
                attribute: {
                    name: name,
                    value: oldValue
                }
            }, {
                source: edge.source,
                target: edge.target,
                attribute: {
                    name: name,
                    value: value
                }
            }));
        });

        return changeObjects;
    }

    /**
     * Undoes the ChangeObjects in a given step
     * @param {Array[ChangeObject]} changes Array of ChangeObjects in the step
     */
    #undoStep(changes) {
        // Reverse the changes to go through them backwards
        changes = changes.toReversed();

        changes.forEach(change => {
            switch (change.action) {
                case "addNode":
                    this.#nodes.delete(change.current.id);
                    break;
                case "deleteNode":
                    this.#nodes.set(change.previous.id, new Node(change.previous.id, change.previous.position.x, change.previous.position.y));
                    let node = this.#nodes.get(change.previous.id);
                    change.previous.attributes.forEach((value, key) => {
                        node.attributes.set(key, value);
                    });
                    break;
                case "addEdge":
                    this.#nodes.get(change.current.source).edges.delete(`${change.current.source},${change.current.target}`);
                    this.#nodes.get(change.current.target).edges.delete(`${change.current.source},${change.current.target}`);
                    break;
                case "deleteEdge":
                    this.#nodes.get(change.previous.source).edges.set(`${change.previous.source},${change.previous.target}`, new Edge(change.previous.source, change.previous.target));
                    this.#nodes.get(change.previous.target).edges.set(`${change.previous.source},${change.previous.target}`, new Edge(change.previous.source, change.previous.target));
                    let edge = this.#nodes.get(change.previous.source).edges.get(`${change.previous.source},${change.previous.target}`);
                    change.previous.attributes.forEach((value, key) => {
                        edge.attributes.set(key, value);
                    });
                    break;
                case "setNodePosition":
                    this.#nodes.get(change.previous.id).position = change.previous.position;
                    break;
                case "setNodeAttribute":
                    this.#nodes.get(change.previous.id).attributes.set(change.previous.attribute.name, change.previous.attribute.value);
                    break;
                case "setEdgeAttribute":
                    this.#nodes.get(change.previous.source).edges.get(`${change.previous.source},${change.previous.target}`).attributes.set(change.previous.attribute.name, change.previous.attribute.value);
                    break;
                default:
                    break;
            }
        });
    }
    
    /**
     * Redoes the ChangeObjects in a given step
     * @param {Array[ChangeObject]} changes Array of ChangeObjects in the step
     */
    #redoStep(changes) {
        changes.forEach(change => {
            switch (change.action) {
                case "addNode":
                    this.#nodes.set(change.current.id, new Node(change.current.id, change.current.position.x, change.current.position.y));
                    break;
                case "deleteNode":
                    this.#nodes.delete(change.previous.id);
                    break;
                case "addEdge":
                    this.#nodes.get(change.current.source).edges.set(`${change.current.source},${change.current.target}`, new Edge(change.current.source, change.current.target));
                    this.#nodes.get(change.current.target).edges.set(`${change.current.source},${change.current.target}`, new Edge(change.current.source, change.current.target));
                    break;
                case "deleteEdge":
                    this.#nodes.get(change.previous.source).edges.delete(`${change.previous.source},${change.previous.target}`);
                    this.#nodes.get(change.previous.target).edges.delete(`${change.previous.source},${change.previous.target}`);
                    break;
                case "setNodePosition":
                    this.#nodes.get(change.current.id).position = change.current.position;
                    break;
                case "setNodeAttribute":
                    this.#nodes.get(change.current.id).attributes.set(change.current.attribute.name, change.current.attribute.value);
                    break;
                case "setEdgeAttribute":
                    this.#nodes.get(change.current.source).edges.get(`${change.current.source},${change.current.target}`).attributes.set(change.current.attribute.name, change.current.attribute.value);
                    break;
                default:
                    break;
            }
        });
    }

    /**
     * Private object containing all private methods for passing into file parser
     * and change managers so they can access them.
     */
    #privateMethods = {
        clear: this.#clear,
        scale: this.#scale,
        getNodes: this.#getNodes,
        addNode: this.#addNode,
        addEdge: this.#addEdge,
        addMessage: this.#addMessage,
        deleteNode: this.#deleteNode,
        deleteEdge: this.#deleteEdge,
        setNodePosition: this.#setNodePosition,
        setNodeAttribute: this.#setNodeAttribute,
        setNodeAttributeAll: this.#setNodeAttributeAll,
        setEdgeAttribute: this.#setEdgeAttribute,
        setEdgeAttributeAll: this.#setEdgeAttributeAll,
        undoStep: this.#undoStep,
        redoStep: this.#redoStep
    }
}

/** Export a single instance of Graph */
const graphInstance = new Graph();
export default graphInstance;
