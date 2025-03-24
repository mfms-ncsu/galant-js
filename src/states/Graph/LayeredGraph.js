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
    iterateEdges = (callback) => {
        // let result = 0;
        // let visitedEdges = new Set();
        // graph.nodes.forEach(node => {
        //     node.edges.forEach(edge => {
        //         if (!visitedEdges.has(edge)) {
        //             result = callback(result, edge);
        //             visitedEdges.add(edge);
        //         }
        //     });
        // });
        // return result;
    }

    /**
     * Number of edges that cross edge in graph
     * c(e) = the number of edges that cross edge e
     * @author Heath Dyer
     */
    getEdgeCrossings(edge) {
        let result = 0;
        let visitedEdges = new Set();
        graph.nodes.forEach(node => {
            node.edges.forEach(e => {
                if (e !== edge && !visitedEdges.has(edge) && this.isEdgeCrossed(edge, e)) {
                    result += 1;
                    visitedEdges.add(edge);
                }
            });
        });
        return result;
    }

    /**
     *  Get total crossings of the graph
     * Total crossings = (sum over e of c(e)) / 2
     * each crossing is counted twice
     * @author Heath Dyer
     */
    getTotalCrossings() {
        let result = 0;
        graph.nodes.forEach(node => {
            node.edges.forEach(e => {
                result += this.getEdgeCrossings(e);
            });
        });
        return result;
    }

    /**
     * Gets bottle neck crossings of the graph
     * Bottleneck crossings = max over e of c(e)
     * @author Heath Dyer
     */
    getBottleneckCrossings() {
        let max = 0;
        graph.nodes.forEach(node => {
            node.edges.forEach(e => {
                const crossings = this.getEdgeCrossings(e);
                if (crossings > max) {
                    max = crossings;
                }
            });
        });
        return max;
    }

    /**
     * Helper function to get non-verticality of edge
     * layer =y ,,, index = x
     * Non-verticality of edge e = xy is (position(x) – position()y)2
     * @author Heath Dyer
     */
    getNonVerticality(edge) {
        const source = getSource(graph, edge);
        const target = getTarget(graph, edge);
        return (source.index - target.index) ** 2;
    }

    /**
     * Gets total non-verticality of graph
     * Total non-verticality = sum over e of nv(e)
     * @author Heath Dyer
     */
    getTotalNonVerticality() {
        let result = 0;
        graph.nodes.forEach(node => {
            node.edges.forEach(e => {
                result += this.getNonVerticality(e);
            });
        });
        return result;
    }

    /**
     * Gets bottleneck vertically of graph
     * Bottleneck non-verticality = max over e of nv(e)
     * @author Heath Dyer
     */
    getBottleneckVerticality() {
        let max = 0;
        graph.nodes.forEach(node => {
            node.edges.forEach(e => {
                const crossings = this.getTotalNonVerticality(e);
                if (crossings > max) {
                    max = crossings;
                }
            });
        });
        return max;
    }
}