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
        for (const edge of this.edges) {
            if (edge.source === node) {
                edges.push(edge);
            }
        }
        return edges;
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
        for (const edge of this.edges) {
            if (edge.source === node && edge.target === node) {
                //possibly do nothing
                nodes.push(edge.source);
            }
            else if (edge.source === node) {
                nodes.push(edge.target);
            }
            else if (edge.target === node) {
                nodes.push(edge.source);
            }
        }
        return nodes;
    }

    incomingNodes(node) {
        let nodes = [];
        for (const edge of this.edges) {
            if (edge.source === node && edge.target === node) {
                //possibly do nothing
                nodes.push(edge.source);
            }
            else if (edge.target === node) {
                nodes.push(edge.source);
            }
        }
        return nodes;
    }

    outgoingNodes(node) {
        let nodes = [];
        for (const edge of this.edges) {
            if (edge.source === node && edge.target === node) {
                //possibly do nothing
                nodes.push(edge.source);
            }
            else if (edge.source === node) {
                nodes.push(edge.target);
            }
        }
        return nodes;
    }

    source(edge) {
        return this.edges[edge].source;
    }

    target(edge) {
        return this.edges[edge].target;
    }

    getEdgeBetween(source, target) {
        for (const edge of this.edges) {
            if (edge.source === source && edge.target === target) {
                //possibly do nothing
                return edge
            }
        }
        //This may need to be changed to throw an error later one.
        return null;
    }

    colorNode(color, node) {
        this.nodes[node].color = color;
    }

    colorEdge(color, edge) {
        this.edges[edge].color = color;
    }

    mark(node) {
        this.nodes[node].marked = true;
    }

    unmark(node) {
        this.nodes[node].marked = false;
    }

    marked(node) {
        return this.nodes[node].marked;
    }

    clearNodeMarks() {
        for (const node of this.nodes) {
            //This might have to be done in Thread since rules need
            //to be generated and I am not sure if all of them would be
            //made in this context
            if (node.marked) {
                node.marked = false;
            }
        }
    }

    display(message) {
        this.message = message;
    }
}