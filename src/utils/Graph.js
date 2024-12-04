import EdgeObject from "pages/GraphView/utils/EdgeObject";
import NodeObject from "pages/GraphView/utils/NodeObject";

/**
 * @fileoverview Class that constructs a graph and its different functionalities 
 * @author Julian Madrigal
 * @author Vitesh Kambara
 * @author Minghong Zou
 * @author Christina Albores
 * @author Andrew Lanning
 * @author Ethan Godwin
 */
export default class Graph {
    /**
     * Creates an instance of Graph.
     * @param {NodeObject[]} nodes - List of node Objects
     * @param {EdgeObject[]} edges - Object containing edge data.
     * @param {boolean} directed - Indicates whether the graph is directed or not.
     * @param {string} message - Additional message related to the graph.
     * @param {string} name - the name of the graph file
     */
    constructor(nodes, edges, directed, message, name, scalar) {
        this.nodes = nodes;
        this.edges = edges;
        this.directed = directed;
        this.message = message;
        this.name = name;
        this.scalar = scalar;
    }

    /**
     * Creates a unique identifier for an edge.
     * @param {string} source - ID of the source node.
     * @param {string} target - ID of the target node.
     * @returns {string} - Unique edge ID.
     * @throws {Error} - If source or target IDs are not valid.
     */

    createEdgeId(source, target) {
        // if (!(this.nodes.find((node) => node.id === source))) {
        //     throw Error(`Source does not match a node ID: ${source}`)
        // }
        // if (!(this.nodes.find((node) => node.id === target))) {
        //     throw Error(`Target does not match a node ID: ${target}`)
        // }
        let edge_id = `${source} ${target}`;
        /*let duplicate_num = 2;
        for (let edge_id of this.edges) {
            edge_id = `${source} ${target} ${duplicate_num++}`;
        }*/

        return edge_id;
    }
    /**
      * Retrieves the object representing a node.
      * @param {string} nodeId - ID of the node.
      * @returns {NodeObject} - Object representing the node.
     */
    getNodeObject(nodeId) {
        if (typeof nodeId !== 'string') {

            nodeId = typeof nodeId === "object" ? String(nodeId.id) : String(nodeId);
        }
        let foundIndex = this.nodes.findIndex((node) => node.id === nodeId);
        if (foundIndex !== -1) {
            if (!(this.nodes[foundIndex] instanceof NodeObject)) {
                this.nodes[foundIndex] = new NodeObject(this.nodes[foundIndex]);
            }
            return this.nodes[foundIndex];
        } else {
            throw new Error(`Node with ID ${nodeId} not found`);
        }
    }

    /**
     * Retrieves the object representing an edge
     * @param {string} edge - ID of the edge.
     * @returns {EdgeObject} - Object representing the edge.
    */
    getEdgeObject(edgeId) {
        if (typeof edgeId !== 'string') {
            edgeId = typeof edgeId === "object" ? String(edgeId.id) : String(edgeId);
        }
        let foundIndex = this.edges.findIndex((edge) => edge.id === edgeId);
        if (foundIndex === -1) {
            //console.error("Invalid Edge", edgeId);
            throw new Error(`${edgeId} is not a valid edge.`);
        }
        if (typeof (this.edges[foundIndex]) !== EdgeObject) {
            this.edges[foundIndex] = new EdgeObject(this.edges[foundIndex]);
        }
        return this.edges[foundIndex];
    }
    /**
     * Retrieves the object representing a node or an edge.
     * @param {string} id - ID of the node or edge.
     * @returns {GraphObject} - Either the node or the edge the id.
     */
    getGraphObject(id) {
        let string = id;
        if (typeof id !== 'string') {
            string = typeof id === 'object' ? String(id.id) : String(id);
        }
        if (string.includes(" ")) {
            return this.getEdgeObject(string);
        } else {
            return this.getNodeObject(string);
        }
    }

    // composed of all the getters necessary to get each object 

    /**
     * returns the node list
     * @returns {NodeObject[]} the list of nodes
     */
    getNodes() {
        let ids = [];
        this.nodes.forEach(node => ids.push(node.id));
        return ids;
    }

    setNodes(nodesList) {
        if (!Array.isArray(nodesList)) {
            throw Error("nodes must be a list of node objects");
        }
        this._nodes = nodesList;
    }

    getEdges() {
        return this.edges;
    }

    getNumberOfNodes() {
        return this.nodes.length;
    }

    getNumberOfEdges() {
        return this.edges.length;
    }

    getEdgeIds() {
        let edges = [];
        this.edges.forEach((edge) => edges.push(edge.id));
        return edges;
    }

    // composed of the Sources/targets that these edges are starting and ending at 

    source(edgeId) {
        return this.getEdgeObject(edgeId).source;
    }

    target(edgeId) {
        return this.getEdgeObject(edgeId).target;
    }

    /**
     * Retrieves an array of edge IDs between two given nodes.
     * @param {string} source - ID of the source node.
     * @param {string} target - ID of the target node.
     * @returns {string[]} - Array of edge IDs between the source and target nodes.
     */
    getEdgesBetween(sourceId, targetId) {
        let edges = []
        for (const edge of this.getEdges()) {
            if (edge.source === sourceId && edge.target === targetId) {
                edges.push(edge.id);
            } else if (!this.directed &&
                edge.target === sourceId && edge.source === targetId) {
                edges.push(edge.id);
            }
        }
        return edges;
    }

    /**
     * Retrieves the ID of an edge between two given nodes.
     * @param {string} source - ID of the source node.
     * @param {string} target - ID of the target node.
     * @returns {string|null} - ID of the edge between the source and target nodes, or null if no such edge exists.
     */
    getEdgeBetween(sourceId, targetId) {
        let edges = this.getEdgesBetween(sourceId, targetId);
        if (edges.length > 0) {
            return edges[0].id;
        }
        return null;
    }

    /**
     * Retrieves the ID of the node connected to the given edge.
     * @param {GraphObject} obj1 - node or edge.
     * @param {GraphObject} obj2 - node or edge.
     * @returns {string} - ID of the node connected to the edge.
     * @throws {Error} - If the parameters do not consist of one node and one edge.
     * @throws {Error} - If the specified node is not connected to the specified edge.
     */
    other(obj1, obj2) {
        obj1 = this.getGraphObject(obj1)
        obj2 = this.getGraphObject(obj2);
        let node = null;
        let edge = null;
        if (obj2 instanceof NodeObject && obj1 instanceof EdgeObject) {
            node = obj2;
            edge = obj1;
        } else if (obj1 instanceof NodeObject && obj2 instanceof EdgeObject) {
            node = obj1;
            edge = obj2;
        } else {
            throw new Error("other() should be called with one node and one edge");
        }
        if (edge.source === node.id) {
            return edge.target;
        }
        else if (edge.target === node.id) {
            return edge.source;
        }
        else {
            throw new Error("The node " + node + " was not connected to edge " + edge);
        }
    }
    // Adjacencies

    /**
     * Retrieves an array of edge IDs incident to the given node.
     * @param {string} node - ID of the node.
     * @returns {EdgeObject[]} - Array of edge IDs incident to the node.
     */
    incident(nodeId) {
        let incidentEdges = [];
        this.edges.forEach((edge) => {
            if (!incidentEdges.includes(edge) && (edge.source === nodeId || edge.target === nodeId)) {
                incidentEdges.push(edge.id);
            }
        })
        return incidentEdges;
    }

    /**
     * Retrieves an array of incoming edge IDs to the given node.
     * @param {string} nodeId - ID of the node.
     * @returns {string[]} - Array of incoming edge IDs to the node.
     */
    incoming(nodeId) {
        if (!this.directed) {
            return this.incident(nodeId);
        }
        let edges = [];
        for (const edgeId of this.incident(nodeId)) {
            if (this.getEdgeObject(edgeId).target === nodeId) {
                if (!edges.includes(edgeId)) {
                    edges.push(edgeId);
                }
            }
        }
        return edges;
    }

    /**
     * Retrieves an array of outgoing edge IDs from the given node.
     * @param {string} node - ID of the node.
     * @returns {string[]} - Array of outgoing edge IDs from the node.
     */
    outgoing(nodeId) {
        if (!this.directed) {
            return this.incident(nodeId);
        }

        let edges = [];
        for (const edgeId of this.incident(nodeId)) {
            if (this.getEdgeObject(edgeId).source === nodeId) {
                if (!edges.includes(edgeId)) {
                    edges.push(edgeId);
                }
            }
        }
        return edges;
    }

    /**
     * Retrieves an array of IDs of nodes adjacent to the given node.
     * @param {string} node - ID of the node.
     * @returns {string[]} - Array of IDs of nodes adjacent to the node.
     */
    adjacentNodes(nodeId) {
        let edgeIds = this.incident(nodeId);

        let nodes = [];
        for (const edge of edgeIds) {
            let other = this.other(nodeId, edge);
            if (!nodes.includes(other)) {
                nodes.push(other);
            }
        }
        return nodes;
    }

    /**
     * Retrieves an array of IDs of nodes with incoming edges to the given node.
     * @param {string} node - ID of the node.
     * @returns {string[]} - Array of IDs of nodes with incoming edges to the node.
     */
    incomingNodes(nodeId) {
        let edgeIds = this.incoming(nodeId);

        let nodes = [];
        for (const edge of edgeIds) {
            let other = this.other(nodeId, edge);
            if (!nodes.includes(other)) {
                nodes.push(other);
            }
        }
        return nodes;
    }

    /**
     * Retrieves an array of IDs of nodes with outgoing edges from the given node.
     * @param {string} node - ID of the node.
     * @returns {NodeObject[]} - Array of  nodes with outgoing edges from the node.
     */
    outgoingNodes(nodeId) {
        let edgeIds = this.outgoing(nodeId);
        let nodes = [];
        for (const edgeId of edgeIds) {
            let other = this.other(nodeId, edgeId);
            if (!nodes.includes(other)) {
                nodes.push(other);
            }
        }
        return nodes;
    }

    // Functions to cover the marking and unmarkings of nodes on the graph
    mark(nodeId) {
        return this.getNodeObject(nodeId).marked = true;
    }

    unmark(nodeId) {
        return this.getNodeObject(nodeId).marked = false;
    }

    marked(nodeId) {
        return this.getNodeObject(nodeId).marked;
    }

    clearNodeMarks() {
        this.nodes.forEach(node => node.marked = false);
    }


    // Functions to take care of the highlighting of nodes and edges if necessary 
    highlight(id) {
        return this.getGraphObject(id).highlighted = true;
    }

    unhighlight(id) {
        return this.getGraphObject(id).highlighted = false;
    }

    highlighted(id) {
        return this.getGraphObject(id).highlighted;
    }

    clearNodeHighlights() {
        return this.nodes.forEach((node) => node.highlighted = false);
    }

    clearEdgeHighlights() {
        this.edges.forEach((edge) => {
            edge.highlighted = false;
        });
    }


    // Functions to deal with the different actions of color on the graph on nodes or edges
    color(nodeId, color) {
        return this.getGraphObject(nodeId).setColor(color);
    }

    uncolor(nodeId) {
        return this.getGraphObject(nodeId).uncolor();
    }

    getColor(nodeId) {
        return this.getGraphObject(nodeId).color;
    }

    hasColor(nodeId) {
        return this.getGraphObject(nodeId).color !== undefined;
    }

    clearNodeColors() {
        this.nodes.forEach((node) => {
            node.color = undefined; // Ensure the color attribute is cleared
        });
    }

    clearEdgeColors() {
        console.log('CALLED');
        return this.edges.forEach((edge) => edge.color = undefined);
    }

    // Functions to carry out the different actions of labeling on nodes and edges

    label(id, label) {
        this.getGraphObject(id).label = String(label);
    }

    unlabel(id) {
        this.getGraphObject(id).label = undefined;
    }

    getLabel(id) {
        return this.getGraphObject(id).label;
    }

    hasLabel(id) {
        return (this.getGraphObject(id).label !== undefined && this.getGraphObject(id).label !== null);
    }

    clearNodeLabels() {
        return this.nodes.forEach((node) => node.label = undefined);
    }

    clearEdgeLabels() {
        return this.edges.forEach((edge) => this.unlabel(edge.id));
    }


    /**
     * Removes the shapes from all nodes 
     */
    shape(nodeId) {
        return this.getNodeObject(nodeId).shape;
    }

    setShape(nodeId, shape) {
        return this.getNodeObject(nodeId).setShape(shape);
    }

    clearShape(nodeId) {
        return this.getNodeObject(nodeId).clearShape();
    }

    hasShape(nodeId) {
        return this.getNodeObject(nodeId).hasShape();
    }

    clearNodeShapes() {
        this.nodes.forEach((node) => node.clearShape());
    }

    // Functions to interact with the border thickness of nodes
    borderWidth(nodeId) {
        return this.getNodeObject(nodeId).borderWidth;
    }

    setBorderWidth(nodeId, width) {
        return this.getNodeObject(nodeId).setBorderWidth(width);
    }

    clearBorderWidth(nodeId) {
        return this.getNodeObject(nodeId).clearBorderWidth();
    }

    clearNodeBorderWidth() {
        this.nodes.forEach((node) => node.clearBorderWidth());
    }

    hasBorderWidth(nodeId) {
        return this.getNodeObject(nodeId).hasBorderWidth();
    }

    // Functions to interact with the border thickness of nodes
    clearNodeBackgroundOpacity() {
        this.nodes.forEach((node) => node.clearBackgroundOpacity());
    }

    backgroundOpacity(nodeId) {
        return this.getNodeObject(nodeId).backgroundOpacity;
    }

    setBackgroundOpacity(nodeId, opacity) {
        return this.getNodeObject(nodeId).setBackgroundOpacity(opacity);
    }

    hasBackgroundOpacity(nodeId) {
        return this.getNodeObject(nodeId).hasBackgroundOpacity();
    }

    clearBackgroundOpacity(nodeId) {
        return this.getNodeObject(nodeId).clearBackgroundOpacity();
    }
    // Functions to interact with the border thickness of nodes

    edgeWidth(id) {
        return this.getGraphObject(id).width;
    }

    setEdgeWidth(id, width) {
        if (isNaN(width)) {
            throw new Error("Edge Width must be a number");
        }
        this.getGraphObject(id).width = width;
    }

    clearEdgeWidth(id) {
        this.getGraphObject(id).width = undefined;
    }

    hasEdgeWidth(id) {
        return this.getGraphObject(id).width !== undefined;
    }

    clearNodeEdgeWidth() {
        this.nodes.forEach(node => node.width = undefined);
    }

    size(nodeId) {
        return this.getNodeObject(nodeId).size;
    }
    setSize(nodeId, size) {
        return this.getNodeObject(nodeId).setSize(size)
    }
    clearSize(nodeId) {
        return this.getNodeObject(nodeId).clearSize()
    }
    //Functions to interact with the size of nodes 
    hasSize(nodeId) {
        this.getNodeObject(nodeId).hasSize();
    }
    clearNodeSizes() {
        this.nodes.forEach((node) => node.clearSize());
    }

    //Functions to interact with the weight of nodes and edges 

    setWeight(id, weight) {
        if (isNaN(weight)) {
            throw new Error("Weight must be a number");
        }
        this.getGraphObject(id).weight = weight;
    }

    clearWeight(id) {
        this.getGraphObject(id).weight = undefined;
    }

    weight(id) {
        return this.getGraphObject(id).weight;
    }

    hasWeight(id) {
        return (this.getGraphObject(id).weight !== undefined && this.getGraphObject(id).weight !== null);
    }

    clearNodeWeights() {
        this.nodes.forEach(node => node.weight = undefined);
    }

    clearEdgeWeights() {
        this.edges.forEach(edge => edge.weight = undefined);
    }

    // Displays a message 
    display(message) {
        this.message = message;
    }

    /**
     * Hides the specified node. This function should only be called through an algorithm in which case it will
     * be accessed through the hideNode function in Thread.js which will hide incident edges as well.
     * @param {string} node - ID of the node to hide.
     */
    hideNode(nodeId) {
        this.getNodeObject(nodeId).invisible = true;
    }

    /**
     * Shows the specified node and makes visible the edges connected to it, if applicable.
     * @param {string} node - ID of the node to show.
     */
    showNode(nodeId) {
        this.getNodeObject(nodeId).invisible = false;
        this.edges.forEach(edge => {
            if (edge.source === nodeId) {
                // If the target node is visible and the edge should be visible
                if (!this.getNodeObject(edge.target).invisible && !edge.shouldBeInvisible) {
                    edge.invisible = false;
                }
            }
            else if (edge.target === nodeId) {
                // If the source node is visible and the edge should be visible
                if (!this.getNodeObject(edge.source).invisible && !edge.shouldBeInvisible) {
                    edge.invisible = false;
                }
            }
        })

    }



    //Functions that deal with the different toggles of what does and doesn't appear on the display of the graph
    hideAllNodeWeights() {
        this.nodes.forEach((node) => node.invisibleWeight = true);
    }

    hideNodeWeight(nodeId) {
        this.getNodeObject(nodeId).invisibleWeight = true;
    }

    showAllNodeWeights() {
        this.nodes.forEach((node) => node.invisibleWeight = true);
    }

    hideAllNodeLabels() {
        this.nodes.forEach(node => node.invisibleLabel = true);
    }

    showAllNodeLabels() {
        this.nodes.forEach(node => node.invisibleLabel = false);
    }


    hideEdge(edgeId) {
        this.getEdgeObject(edgeId).invisible = true;
        this.getEdgeObject(edgeId).shouldBeInvisible = true;
    }

    showEdge(edgeId) {
        this.getEdgeObject(edgeId).invisible = false;
        this.getEdgeObject(edgeId).shouldBeInvisible = false;
    }

    hideEdgeWeight(edgeId) {
        this.getEdgeObject(edgeId).invisibleWeight = true;
    }

    hideAllEdgeWeights() {
        this.edges.forEach(edge => edge.invisibleWeight = true);
    }

    showEdgeWeight(edgeId) {
        this.getEdgeObject(edgeId).invisibleWeight = false;
    }

    showAllEdgeWeights() {
        this.edges.forEach(edge => edge.invisibleWeight = false);
    }

    hideEdgeLabel(edgeId) {
        const edge = this.getEdgeObject(edgeId);
        edge.invisibleLabel = true; // Hide the label
    }

    showEdgeLabel(edgeId) {
        const edge = this.getEdgeObject(edgeId);
        edge.invisibleLabel = false; // Show the label
    }

    hideAllEdgeLabels() {
        this.edges.forEach(edge => edge.invisibleLabel = true);
    }

    showAllEdgeLabels() {
        this.edges.forEach(edge => this.showEdgeLabel(edge.id));
    }

    incrementPosition(nodeId, increment) {
        if (isNaN(increment.x) || isNaN(increment.y)) {
            throw new Error("Increment x & y must be a number");
        }

        this.getNodeObject(nodeId).x = this.getNodeObject(nodeId).x + (increment.x);// * this.scalar);
        this.getNodeObject(nodeId).y = this.getNodeObject(nodeId).y + (increment.y);// * this.scalar);
    }

    setPosition(nodeId, position) {
        this.getNodeObject(nodeId).x = position.x;
        this.getNodeObject(nodeId).y = position.y;
    }

    /**
     * Get graph's name to help determine it is sgf file or not
     * @returns {string} graph name
     */
    getName() {
        return this.name;
    }

    /**
     * Method to allow use to change graph name
     * @param name update graph name
     */
    setName(name) {
        this.name = name;
    }
}


