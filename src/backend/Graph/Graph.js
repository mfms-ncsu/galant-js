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