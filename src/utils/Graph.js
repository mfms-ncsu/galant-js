import { immerable } from "immer";

/**
 * @fileoverview Class that constructs a graph and its different functionalities 
 * @author Julian Madrigal
 * @author Vitesh Kambara
 * @author Minghong Zou
 * @author Christina Albores
 */
export default class Graph {
    
    [immerable] = true;

    /**
     * Creates an instance of Graph.
     * @param {Object} nodes - Object containing node data. (Key, Value) = (NodeId, NodeData)
     * @param {Object} edges - Object containing edge data.
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
        if (!(source in this.nodes)) {
            throw Error(`Source does not match a node ID: ${source}`)
        }
        if (!(target in this.nodes)) {
            throw Error(`Target does not match a node ID: ${target}`)
        }
        let edge_id = `${source} ${target}`;
        let duplicate_num = 2;
        while (edge_id in this.edges) {
            edge_id = `${source} ${target} ${duplicate_num++}`;
        }
        return edge_id;
    }
   /**
     * Retrieves the object representing a node.
     * @param {string} node - ID of the node.
     * @returns {Object} - Object representing the node.
    */
    getNodeObject(node) {
        if (!(node in this.nodes)) {
            throw new Error(`${node} is not a valid node.`);
        }
        return this.nodes[node];
    }
    /**
     * Retrieves the object representing an edge
     * @param {string} edge - ID of the edge.
     * @returns {Object} - Object representing the edge.
    */
    getEdgeObject(edge) {
        if (!(edge in this.edges)) {
            throw new Error(`${edge} is not a valid edge.`);
        }
        return this.edges[edge];
    }
    /**
     * Retrieves the object representing a node or an edge.
     * @param {string} id - ID of the node or edge.
     * @returns {Object} - Object representing the node or edge.
     */
    getNodeOrEdgeObject(id) {
        let string = String(id);
        if (string.includes(" ")) {
            return this.getEdgeObject(string);
        } else {
            return this.getNodeObject(string);
        }
    }

    // composed of all the getters necessary to get each object 

    getNodes() {
        return Object.keys(this.nodes);
    }

    getEdges() {
        return Object.keys(this.edges);
    }

    getNumberOfNodes() {
        return this.getNodes().length;
    }

    getNumberOfEdges() {
        return this.getEdges().length;
    }

    // composed of the Sources/targets that these edges are starting and ending at 

    source(edge) {
        return this.getEdgeObject(edge).source
    }

    target(edge) {
        return this.getEdgeObject(edge).target;
    }

    /**
     * Retrieves an array of edge IDs between two given nodes.
     * @param {string} source - ID of the source node.
     * @param {string} target - ID of the target node.
     * @returns {string[]} - Array of edge IDs between the source and target nodes.
     */
    getEdgesBetween(source, target) {
        let edges = []
        for (const edge of this.getEdges()) {
            let edgeObj = this.getEdgeObject(edge);
            if (edgeObj.source === source && edgeObj.target === target) {
                edges.push(edge);
            } else if (!this.directed &&
                edgeObj.target === source && edgeObj.source === target) {
                edges.push(edge);
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
    getEdgeBetween(source, target) {
        let edges = this.getEdgesBetween(source, target);
        if (edges.length > 0) {
            return edges[0];
        }
        return null;
    }

    /**
     * Retrieves the ID of the node connected to the given edge.
     * @param {string} id1 - ID of a node or edge.
     * @param {string} id2 - ID of a node or edge.
     * @returns {string} - ID of the node connected to the edge.
     * @throws {Error} - If the parameters do not consist of one node and one edge.
     * @throws {Error} - If the specified node is not connected to the specified edge.
     */
    other(id1, id2) {
        let obj1 = this.getNodeOrEdgeObject(id1);
        let obj2 = this.getNodeOrEdgeObject(id2);

        let node = null;
        let edge = null;
        if (!obj2.source && obj1.source) {
            node = id2;
            edge = id1;
        } else if (!obj1.source && obj2.source) {
            node = id1;
            edge = id2;
        } else {
            throw new Error("other() should be called with one node and one edge");
        }

        let edgeObj = this.getEdgeObject(edge);

        if (edgeObj.source === node) {
            return edgeObj.target;
        }
        else if (edgeObj.target === node) {
            return edgeObj.source;
        }
        else {
            throw new Error("The node " + node + " was not connected to edge " + edge);
        }
    }
    // Adjacencies

    /**
     * Retrieves an array of edge IDs incident to the given node.
     * @param {string} node - ID of the node.
     * @returns {string[]} - Array of edge IDs incident to the node.
     */
    incident(node) {
        this.getNodeObject(node);

        let edges = [];
        for (const edge of this.getEdges()) {
            let edgeObj = this.getEdgeObject(edge);

            if (edgeObj.source === node || edgeObj.target === node) {
                if (!edges.includes(edge)) {
                    edges.push(edge);
                }
            }
        }
        return edges;
    }

    /**
     * Retrieves an array of incoming edge IDs to the given node.
     * @param {string} node - ID of the node.
     * @returns {string[]} - Array of incoming edge IDs to the node.
     */
    incoming(node) {
        this.getNodeObject(node);

        if (!this.directed) {
            return this.incident(node);
        }

        let edges = [];
        for (const edge of this.incident(node)) {
            let edgeObj = this.getEdgeObject(edge);

            if (edgeObj.target === node) {
                if (!edges.includes(edge)) {
                    edges.push(edge);
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
    outgoing(node) {
        this.getNodeObject(node);

        if (!this.directed) {
            return this.incident(node);
        }

        let edges = [];
        for (const edge of this.incident(node)) {
            let edgeObj = this.getEdgeObject(edge);
            if (edgeObj.source === node) {
                if (!edges.includes(edge)) {
                    edges.push(edge);
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
    adjacentNodes(node) {
        let edges = this.incident(node);

        let nodes = [];
        for (const edge of edges) {
            let other = this.other(node, edge)
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
    incomingNodes(node) {
        let edges = this.incoming(node);

        let nodes = [];
        for (const edge of edges) {
            let other = this.other(node, edge)
            if (!nodes.includes(other)) {
                nodes.push(other);
            }
        }
        return nodes;
    }

    /**
     * Retrieves an array of IDs of nodes with outgoing edges from the given node.
     * @param {string} node - ID of the node.
     * @returns {string[]} - Array of IDs of nodes with outgoing edges from the node.
     */
    outgoingNodes(node) {
        let edges = this.outgoing(node);

        let nodes = [];
        for (const edge of edges) {
            let other = this.other(node, edge)
            if (!nodes.includes(other)) {
                nodes.push(other);
            }
        }
        return nodes;
    }

    // Functions to cover the marking and unmarkings of nodes on the graph

    mark(node) {
        this.getNodeObject(node).marked = true;
    }

    unmark(node) {
        this.getNodeObject(node).marked = false;
    }

    marked(node) {
        return this.getNodeObject(node).marked;
    }

    clearNodeMarks() {
        for (const node of this.getNodes()) {
            this.unmark(node);
        }
    }

    // Functions to take care of the highlighting of nodes and edges if necessary 

    highlight(id) {
        this.getNodeOrEdgeObject(id).highlighted = true;
    }

    unhighlight(id) {
        this.getNodeOrEdgeObject(id).highlighted = false;
    }

    highlighted(id) {
        return this.getNodeOrEdgeObject(id).highlighted;
    }

    clearNodeHighlights() {
        for (const node of this.getNodes()) {
            this.unhighlight(node);
        }
    }

    clearEdgeHighlights() {
        for (const edge of this.getEdges()) {
            this.unhighlight(edge);
        }
    }

    // Functions to deal with the different actions of color on the graph on nodes or edges

    color(id, color) {
        this.getNodeOrEdgeObject(id).color = String(color);
    }

    uncolor(id) {
        this.getNodeOrEdgeObject(id).color = undefined;
    }

    getColor(id) {
        return this.getNodeOrEdgeObject(id).color;
    }

    hasColor(id) {
        return this.getNodeOrEdgeObject(id).color !== undefined;
    }

    clearNodeColors() {
        for (const node of this.getNodes()) {
            this.uncolor(node);
        }
    }

    clearEdgeColors() {
        for (const edge of this.getEdges()) {
            this.uncolor(edge);
        }
    }

    // Functions to carry out the different actions of labeling on nodes and edges

    label(id, label) {
        this.getNodeOrEdgeObject(id).label = String(label);
    }

    unlabel(id) {
        this.getNodeOrEdgeObject(id).label = undefined;
    }

    getLabel(id) {
        return this.getNodeOrEdgeObject(id).label;
    }

    hasLabel(id) {
        return(this.getNodeOrEdgeObject(id).label !== undefined && this.getNodeOrEdgeObject(id).label !== null);
    }

    clearNodeLabels() {
        for (const node of this.getNodes()) {
            this.unlabel(node);
        }
    }

    clearEdgeLabels() {
        for (const edge of this.getEdges()) {
            this.unlabel(edge);
        }
    }

    // Functions to interact with the shape of nodes

    shape(id) {
        return this.getNodeOrEdgeObject(id).shape;
    }

    setShape(id, shape) {
        this.getNodeOrEdgeObject(id).shape = String(shape);
    }

    clearShape(id) {
        this.getNodeOrEdgeObject(id).shape = undefined;
    }

    hasShape(id) {
        return this.getNodeOrEdgeObject(id).shape !== undefined;
    }

    clearNodeShapes() {
        for (const node of this.getNodes()) {
            this.clearShape(node);
        }
    }

    // Functions to interact with the border thickness of nodes

    borderWidth(id) {
        return this.getNodeOrEdgeObject(id).borderWidth;
    }

    setBorderWidth(id, borderWidth) {
        if (isNaN(borderWidth)) {
            throw new Error("Border Width must be a number");
        }
        this.getNodeOrEdgeObject(id).borderWidth = borderWidth;
    }

    clearBorderWidth(id) {
        this.getNodeOrEdgeObject(id).borderWidth = undefined;
    }

    hasBorderWidth(id) {
        return this.getNodeOrEdgeObject(id).borderWidth !== undefined;
    }

    clearNodeBorderWidth() {
        for (const node of this.getNodes()) {
            this.clearBorderWidth(node);
        }
    }

    // Functions to interact with the border thickness of nodes

    backgroundOpacity(id) {
        return this.getNodeOrEdgeObject(id).backgroundOpacity;
    }

    setBackgroundOpacity(id, backgroundOpacity) {
        if (isNaN(backgroundOpacity)) {
            throw new Error("Border Opacity must be a number");
        }
        this.getNodeOrEdgeObject(id).backgroundOpacity = backgroundOpacity;
    }

    clearBackgroundOpacity(id) {
        this.getNodeOrEdgeObject(id).backgroundOpacity = undefined;
    }

    hasBackgroundOpacity(id) {
        return this.getNodeOrEdgeObject(id).backgroundOpacity !== undefined;
    }

    clearNodeBackgroundOpacity() {
        for (const node of this.getNodes()) {
            this.clearBackgroundOpacity(node);
        }
    }

    // Functions to interact with the border thickness of nodes

    edgeWidth(id) {
        return this.getNodeOrEdgeObject(id).width;
    }

    setEdgeWidth(id, width) {
        if (isNaN(width)) {
            throw new Error("Edge Width must be a number");
        }
        this.getNodeOrEdgeObject(id).width = width;
    }

    clearEdgeWidth(id) {
        this.getNodeOrEdgeObject(id).width = undefined;
    }

    hasEdgeWidth(id) {
        return this.getNodeOrEdgeObject(id).width !== undefined;
    }

    clearNodeEdgeWidth() {
        for (const node of this.getNodes()) {
            this.clearEdgeWidth(node);
        }
    }

    //Functions to interact with the size of nodes 

    setSize(id, size) {
        if (isNaN(size)) {
            throw new Error("Size must be a number");
        }
        this.getNodeOrEdgeObject(id).size = size;
    }

    clearSize(id) {
        this.getNodeOrEdgeObject(id).size = undefined;
    }

    size(id) {
        return this.getNodeOrEdgeObject(id).size;
    }

    hasSize(id) {
        return this.getNodeOrEdgeObject(id).size !== undefined;
    }

    clearNodeSizes() {
        for (const node of this.getNodes()) {
            this.clearSize(node);
        }
    }

    //Functions to interact with the weight of nodes and edges 

    setWeight(id, weight) {
        if (isNaN(weight)) {
            throw new Error("Weight must be a number");
        }
        this.getNodeOrEdgeObject(id).weight = weight;
    }

    clearWeight(id) {
        this.getNodeOrEdgeObject(id).weight = undefined;
    }

    weight(id) {
        return this.getNodeOrEdgeObject(id).weight;
    }

    hasWeight(id) {
        return (this.getNodeOrEdgeObject(id).weight !== undefined && this.getNodeOrEdgeObject(id).weight !== null);
    }

    clearNodeWeights() {
        for (const node of this.getNodes()) {
            this.clearWeight(node);
        }
    }

    clearEdgeWeights() {
        for (const edge of this.getEdges()) {
            this.clearWeight(edge);
        }
    }

    // Displays a message 

    display(message) {
        this.message = message;
    }

    /**
     * Hides the specified node and all edges incident to it.
     * @param {string} node - ID of the node to hide.
     */
    hideNode(node) {
        this.nodes[node].invisible = true;
        for (let e in this.edges) {
            if (this.edges[e].source === JSON.parse(JSON.stringify(node)) || this.edges[e].target === JSON.parse(JSON.stringify(node))) {
                this.edges[e].invisible = true;
            }
        }
    }

    /**
     * Shows the specified node and makes visible the edges connected to it, if applicable.
     * @param {string} node - ID of the node to show.
     */
    showNode(node) {
        this.nodes[node].invisible = false;
        for (let e in this.edges) {  
            if (this.edges[e].source === JSON.parse(JSON.stringify(node))) {
                // If the target node is visible and the edge should be visible
                if (!this.nodes[this.edges[e].target].invisible && !this.edges[e].shouldBeInvisible) {
                    this.edges[e].invisible = false;
                } 
            }
            else if (this.edges[e].target === JSON.parse(JSON.stringify(node))) {
                // If the source node is visible and the edge should be visible
                if (!this.nodes[this.edges[e].source].invisible && !this.edges[e].shouldBeInvisible) {
                    this.edges[e].invisible = false;
                } 
            }  
        }
    }

  //Functions that deal with the different toggles of what does and doesn't appear on the display of the graph
    hideNodeWeight(node) {
        this.nodes[node].invisibleWeight = true;
    }

    hideAllNodeWeights() {
        for (let n in this.nodes) {
            this.hideNodeWeight(n)
        }
    }

    showNodeWeight(node) {
        this.nodes[node].invisibleWeight = false;
    }

    showAllNodeWeights() {
        for (let n in this.nodes) {
            this.showNodeWeight(n)
        }
    }

    hideNodeLabel(node) {
        this.nodes[node].invisibleLabel = true;
    }

    hideAllNodeLabels() {
        for (let n in this.nodes) {
            this.hideNodeLabel(n)
        }
    }

    showNodeLabel(node) {
        this.nodes[node].invisibleLabel = false;
    }

    showAllNodeLabels() {
        for (let n in this.nodes) {
            this.showNodeLabel(n)
        }
    }


    hideEdge(edge) {
        this.edges[edge].invisible = true;
        this.edges[edge].shouldBeInvisible = true;
    }

    showEdge(edge) {
        this.edges[edge].invisible = false;
        this.edges[edge].shouldBeInvisible = false;
    }

    hideEdgeWeight(edge) {
        this.edges[edge].invisibleWeight = true;
    }

    hideAllEdgeWeights() {
        for (let e in this.edges) {
            this.hideEdgeWeight(e)
        }
    }

    showEdgeWeight(edge) {
        this.edges[edge].invisibleWeight = false;
    }

    showAllEdgeWeights() {
        for (let e in this.edges) {
            this.showEdgeWeight(e)
        }
    }

    hideEdgeLabel(edge) {
        this.edges[edge].invisibleLabel = true;
    }

    hideAllEdgeLabels() {
        for (let e in this.edges) {
            this.hideEdgeLabel(e)
        }
    }

    showEdgeLabel(edge) {
        this.edges[edge].invisibleLabel = false;
    }

    showAllEdgeLabels() {
        for (let e in this.edges) {
            this.showEdgeLabel(e)
        }
    }

    setPosition(nodeId, newPosition) {
        const node = this.getNodeObject(nodeId);
        node.x = newPosition.x;// * this.scalar;
        node.y = newPosition.y;// * this.scalar;
    }

    incrementPosition(nodeId, increment) {
        if (isNaN(increment.x) || isNaN(increment.y)) {
            throw new Error("Increment x & y must be a number");
        }

        const node = this.getNodeObject(nodeId);
        node.x = node.x + (increment.x);// * this.scalar);
        node.y = node.y + (increment.y);// * this.scalar);
    }

    /**
     * Get graph's name to help determine it is sgf file or not
     * @returns {string} graph name
     */
    getName(){
        return this.name;
    }

    /**
     * Method to allow use to change graph name
     * @param name update graph name
     */
    setName(name){
        this.name = name;
    }


}
