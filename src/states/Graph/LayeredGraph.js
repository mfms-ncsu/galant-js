import Graph from "./Graph";

export default class LayeredGraph extends Graph {
    /** Graph layers. The index of the array is the layer */
    layers;

    constructor(name) {
        super(name, "layered");
        this.layers = [];
    }

    /**
     * Help function that checks if two nodes have an edge crossing
     * Edge crossings: two edges e = wy and f = xz cross if one of the following holds
     * index(w) < index(x) and index(y) > index(z)
     * index(w) > index(x) and index(y) < index(z)
     * @author Heath Dyer
     */
    isEdgeCrossed(e1, e2) {
        if (e1.source.index < e2.source.index && e1.target.index > e2.target.index) {
            return true;
        }
        else if (e1.source.index > e2.source.index && e1.target.index < e2.target.index) {
            return true;
        } 
        return false;
    }

    /**
     * Helper function to keep track of nodes
     * @param {*} callback Function to perform on edge
     * @returns Returns sum of based on callback
     * @author Heath Dyer
     */
    iterateEdges = (graph, callback) => {
        let result = 0;
        let visitedEdges = new Set();
        graph.nodes.forEach(node => {
            node.edges.forEach(edge => {
                if (!visitedEdges.has(edge)) {
                    result = callback(result, edge);
                    visitedEdges.add(edge);
                }
            });
        });
        return result;
    }

    /**
     * Number of edges that cross edge in graph
     * c(e) = the number of edges that cross edge e
     * @author Heath Dyer
     */
    getEdgeCrossings(edge) {
        return this.iterateEdges(graph, (count, e, visitedEdges) => {
            if (e !== edge && !visitedEdges.has(e) && this.isEdgeCrossed(edge, e)) {
                return count + 1;
            }
            return count;
        });
    }

    /**
     *  Get total crossings of the graph
     * Total crossings = (sum over e of c(e)) / 2
     * each crossing is counted twice
     * @author Heath Dyer
     */
    getTotalCrossings(graph) {
        return this.iterateEdges(graph, (total, edge) => {
            return (total + this.getEdgeCrossings(graph, edge)) / 2;
        });
    }

    /**
     * Gets bottle neck crossings of the graph
     * Bottleneck crossings = max over e of c(e)
     * @author Heath Dyer
     */
    getBottleneckCrossings(graph) {
        return this.iterateEdges(graph, (maxCrossings, edge) => {
            return Math.max(maxCrossings, this.getEdgeCrossings(graph, edge));
        });
    }

    /**
     * Helper function to get non-verticality of edge
     * Non-verticality of edge e = xy is (position(x) – position()y)2
     * @author Heath Dyer
     */
    getNonVerticality(edge) {
        return (edge.source.position - edge.target.position) ** 2;
    }

    /**
     * Gets total non-verticality of graph
     * Total non-verticality = sum over e of nv(e)
     * @author Heath Dyer
     */
    getTotalNonVerticality(graph) {
        return this.iterateEdges(graph, (total, edge) => {
            return total + this.getNonVerticality(edge);
        });
    }

    /**
     * Gets bottleneck vertically of graph
     * Bottleneck non-verticality = max over e of nv(e)
     * @author Heath Dyer
     */
    getBottleneckVerticality(graph) {
        return this.iterateEdges(graph, (maxVerticality, edge) => {
            return Math.max(maxVerticality, this.getNonVerticality(edge));
        });
    }
}