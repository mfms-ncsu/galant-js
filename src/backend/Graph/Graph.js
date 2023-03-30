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

    mark(node) {
        this.nodes[node].marked = true;
    }

    display(message) {
        this.message = message;
    }
}