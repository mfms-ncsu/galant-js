import {immerable} from "immer";

export default class Graph {
    [immerable] = true;

    constructor(nodes, edges, directed, message) {
        this.nodes = nodes;
        this.edges = edges;
        this.directed = directed;
        this.message = message;
    }

    getNodes() {
        return Object.keys(this.nodes);
    }

    getEdges() {
        return Object.keys(this.edges);
    }

    getNumberOfNodes() {
        return Object.keys(this.nodes).length;
    }

    getNumberOfEdges() {
        return Object.keys(this.edges).length;
    }

    outgoing(node) {
        let edges = [];
        if (this.directed) {
            for (const edge of this.getEdges()) {
                if (this.edges[edge].source === node) {
                    edges.push(edge);
                }
            }
        } else {
            return this.adjacent(node);
        }
        
        
    }

    incoming(node) {
        let edges = [];
        for (const edge of this.edges) {
            if (edge.target === node) {
                edges.push(edge);
            }
        }
        return edges;
    }

    adjacent(node) {
        let edges = [];
        for (const edge of this.edges) {
            if (edge.source === node || edge.target === node) {
                edges.push(edge);
            }
        }
        return edges;
    }

    adjacentNodes(node) {
        let nodes = [];
        for (const edge of this.getEdges()) {
            if (this.edges[edge].source === node && this.edges[edge].target === node) {
                //possibly do nothing
                nodes.push(edge.source);
            }
            else if (this.edges[edge].source === node) {
                nodes.push(edge.target);
            }
            else if (this.edges[edge].target === node) {
                nodes.push(edge.source);
            }
        }
        return nodes;
    }

    incomingNodes(node) {
        let nodes = [];
        if (this.directed) {
            for (const edge of this.getEdges()) {
                if (this.edges[edge].target === node) {
                    //possibly do nothing
                    nodes.push(edge.source);
                }
            }
            return nodes;
        }
        else {
            return this.adjacentNodes(node);
        }
        
    }

    outgoingNodes(node) {
        let nodes = [];
        if (this.directed) {
            for (const edge of this.getEdges()) {
                if (this.edges[edge].source === node) {
                    //possibly do nothing
                    nodes.push(edge.target);
                }
            }
            return nodes;
        }
        else {
            return this.adjacentNodes(node);
        }
        
    }

    source(edge) {
        return this.getEdgeObject(edge).source
    }

    target(edge) {
        return this.getEdgeObject(edge).target;
    }

    getEdgeBetween(source, target) {
        for (const edge of this.getEdges()) {
            if (this.edges[edge].source === source && this.edges[edge].target === target) {
                //possibly do nothing
                return edge
            }
        }
        //This may need to be changed to throw an error later one.
        return null;
    }

    other(node, edge) {
        this.getNodeObject(node);
        let edgeObJ = this.getEdgeObject(edge);

        if (edgeObJ.source === node) {
            return edgeObJ.target;
        }
        else if (edgeObJ.target === node) {
            return edgeObJ.source;
        }
        else {
            throw new Error("The node " + node + "was not connected to edge " + edge);
        }
    }

    colorNode(color, node) {
        this.nodes[node].color = color;
    }

    colorEdge(color, edge) {
        this.edges[edge].color = color;
    }

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
        for (const node of this.nodes) {
            this.unmark(node);
        }
    }

    getNodeObject(node) {
        if (!(node in this.nodes)) {
            throw new Error("This node does not exist " + node);
        }
        return this.nodes[node];
    }

    getEdgeObject(edge) {
        if (!(edge in this.edges)) {
            throw new Error("This edge does not exist " + edge);
        }
        return this.edges[edge];
    }

    display(message) {
        this.message = message;
    }
}