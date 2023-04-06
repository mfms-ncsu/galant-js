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

    color(edge, color) {
        this.edges[edge].color = color;
    }

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
            if (this.edges[e].source === JSON.parse(JSON.stringify(node)) || this.edges[e].target === JSON.parse(JSON.stringify(node))) {
                this.edges[e].invisible = false;   
            }      
        }
    }

    hideNodeWeight(node) {
        this.nodes[node].invisibleWeight = true;
    }

    showNodeWeight(node) {
        this.nodes[node].invisibleWeight = false;
    }

    hideNodeLabel(node) {
        this.nodes[node].invisibleLabel = true;
    }

    showNodeLabel(node) {
        this.nodes[node].invisibleLabel = false;
    }


    hideEdge(edge) {
        this.edges[edge].invisible = true;
    }

    showEdge(edge) {
        this.edges[edge].invisible = false;
    }

    hideEdgeWeight(edge) {
        this.edges[edge].invisibleWeight = true;
    }

    showEdgeWeight(edge) {
        this.edges[edge].invisibleWeight = false;
    }

    hideEdgeLabel(edge) {
        this.edges[edge].invisibleLabel = true;
    }

    showEdgeLabel(edge) {
        this.edges[edge].invisibleLabel = false;
    }
}