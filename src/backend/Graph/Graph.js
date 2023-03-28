import {immerable} from "immer";

export default class Graph {
    [immerable] = true;

    constructor(node, directed, undirected, message) {
        this.node = node;
        this.directed = directed;
        this.undirected = undirected;
        this.message = message;
    }

    getNodes() {
        return Object.keys(this.node);
    }

    mark(node) {
        this.node[node].marked = true;
    }

    display(message) {
        this.message = message;
    }
}