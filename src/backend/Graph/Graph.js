import {immerable} from "immer";

export default class Graph {
    [immerable] = true;

    constructor(nodes, edges, directed, message) {
        this.nodes = nodes;
        this.edges = edges;
        this.directed = directed;
        this.message = message;
    }

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

    getNodeObject(node) {
        if (!(node in this.nodes)) {
            throw new Error(`${node} is not a valid node.`);
        }
        return this.nodes[node];
    }

    getEdgeObject(edge) {
        if (!(edge in this.edges)) {
            throw new Error(`${edge} is not a valid edge.`);
        }
        return this.edges[edge];
    }

    getNodeOrEdgeObject(id) {
        let string = String(id);
        if (string.includes(" ")) {
            return this.getEdgeObject(string);
        } else {
            return this.getNodeObject(string);
        }
    }

    // List getters

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

    // Source/target

    source(edge) {
        return this.getEdgeObject(edge).source
    }

    target(edge) {
        return this.getEdgeObject(edge).target;
    }

    getEdgesBetween(source, target) {
        let edges = []
        for (const edge of this.getEdges()) {
            let edgeObj = this.getEdgeObject(edge);
            if (edgeObj.source === source && edgeObj.target === target) {
                edges.push(edge);
            } else if (!this.directed && // Should edges be read both ways undirected?
                edgeObj.target === source && edgeObj.source === target) {
                edges.push(edge);
            }
        }
        return edges;
    }
    
    getEdgeBetween(source, target) {
        let edges = this.getEdgesBetween(source, target);
        if (edges.length > 0) {
            return edges[0];
        }
        //This may need to be changed to throw an error later on.
        return null;
    }

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
            throw new Error("The node " + node + "was not connected to edge " + edge);
        }
    }

    // Adjacencies

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

    incoming(node) {
        this.getNodeObject(node);

        if (!this.directed) {
            return this.incident(node);
        }

        let edges = [];
        for (const edge of this.getEdges()) {
            let edgeObj = this.getEdgeObject(edge);

            if (edgeObj.target === node) {
                if (!edges.includes(edge)) {
                    edges.push(edge);
                }
            }
        }
        return edges;
    }

    outgoing(node) {
        this.getNodeObject(node);

        if (!this.directed) {
            return this.incident(node);
        }

        let edges = [];
        for (const edge of this.getEdges()) {
            let edgeObj = this.getEdgeObject(edge);

            if (edgeObj.source === node) {
                if (!edges.includes(edge)) {
                    edges.push(edge);
                }
            }
        }
        return edges;
    }

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

    // Marks

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

    // Highlights

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

    // Colors

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
        return this.getNodeOrEdgeObject(id).color != undefined;
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

    // Labels

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
        return this.getNodeOrEdgeObject(id).label != undefined;
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

    // Weights

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
        return this.getNodeOrEdgeObject(id).weight != undefined;
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

    // Display

    display(message) {
        this.message = message;
    }

    hideNode(node) {
        this.nodes[node].invisible = true;
        for (let e in this.edges) {
            if (this.edges[e].source === JSON.parse(JSON.stringify(node)) || this.edges[e].target === JSON.parse(JSON.stringify(node))) {
                this.edges[e].invisible = true;
            }
        }
    }

    showNode(node) {
        this.nodes[node].invisible = false;
        for (let e in this.edges) {  
            if (this.edges[e].source === JSON.parse(JSON.stringify(node))) {
                //if the target node is visible and the edge should be visible
                if(!this.nodes[this.edges[e].target].invisible && this.edges[e].shouldBeInvisible === false) {
                    this.edges[e].invisible = false;
                } 
            }
            else if (this.edges[e].target === JSON.parse(JSON.stringify(node))) {
                //if the source node is visible and the edge should be visible
                if(!this.nodes[this.edges[e].source].invisible && this.edges[e].shouldBeInvisible === false) {
                    this.edges[e].invisible = false;
                } 
            }  
        }
    }

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
}