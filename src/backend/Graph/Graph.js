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

    getNodes() {
        return Object.keys(this.nodes);
    }

    getEdges() {
        return Object.keys(this.edges);
    }

    mark(node) {
        this.nodes[node].marked = true;
    }

    unmark(node) {
        this.nodes[node].marked = false;
    }
    
    clearNodeMarks() {
        for (let node of this.getNodes()) {
            this.unmark(node);
        }
    }

    color(edge, color) {
        this.edges[edge].color = color;
    }

    display(message) {
        this.message = message;
    }
}