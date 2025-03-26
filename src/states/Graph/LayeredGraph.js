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
     * @params e Edge 1 to check
     * @params f Edge 2 to check
     * @author Heath Dyer
     */
    isEdgeCrossed(e, f) {
        //get nodes
        let w = this.nodes.get(e.source);
        let y = this.nodes.get(e.target);
        let x = this.nodes.get(f.source);
        let z = this.nodes.get(f.target);
        // Check if layers are correct but swapped
        if (w.layer == z.layer && y.layer == x.layer) {
            //we must swap for algorithm correctness
            let temp = x;
            x = z;
            z = temp;
        }
        // Now layers should be correct. If they aren't, they are on different layers
        if (w.layer != x.layer && y.layer != z.layer) {
            return false;
        }
        // Now check if they are crossed
        if (w.index < x.index && y.index > z.index) {
            return true;
        }
        if (w.index > x.index && y.index < z.index) {
            return true;
        } 
        return false;
    }

    /**
     * Number of edges that cross edge in graph
     * c(e) = the number of edges that cross edge e
     * @params e edge to check for crossings
     * @author Heath Dyer
     */
    getEdgeCrossings(e) {
        let crossings = 0;
        let visitedEdges = new Set();
        this.nodes.forEach(node => {
            node.edges.forEach(f => {
                if (e != f && !visitedEdges.has(f) && this.isEdgeCrossed(e, f)) {
                    // console.log(`${e.attributes.get("label")} crosses ${f.attributes.get("label")}`);
                    crossings += 1;
                }
                visitedEdges.add(f);
            });
        });
        return crossings;
    }

    /**
     *  Get total crossings of the graph
     * Total crossings = (sum over e of c(e)) / 2
     * each crossing is counted twice
     * @author Heath Dyer
     */
    getTotalCrossings() {
        let total = 0;
        let visitedEdges = new Set();
        this.nodes.forEach(node => {
            node.edges.forEach(e => {
                if (!visitedEdges.has(e)) {
                    total += this.getEdgeCrossings(e);
                    visitedEdges.add(e);
                }
            });
        });
        return total / 2;
    }

    /**
     * Gets bottle neck crossings of the graph
     * Bottleneck crossings = max over e of c(e)
     * @author Heath Dyer
     */
    getBottleneckCrossings() {
        let max = 0;
        let visitedEdges = new Set();
        this.nodes.forEach(node => {
            node.edges.forEach(e => {
                if (!visitedEdges.has(e)) {
                    const crossings = this.getEdgeCrossings(e);
                    if (crossings > max) {
                        max = crossings;
                    }
                    visitedEdges.add(e);
                }
            });
        });
        return max;
    }

    /**
     * Helper function to get non-verticality of edge
     * Non-verticality of edge e = xy is (position(x) – position()y)2
     * @params e Edge to get non-verticality of
     * @author Heath Dyer
     */
    getNonVerticality(e) {
        const source = this.nodes.get(e.source);
        const target = this.nodes.get(e.target);
        return (source.position.x - target.position.x) ** 2;
    }

    /**
     * Gets total non-verticality of graph
     * Total non-verticality = sum over e of nv(e)
     * @author Heath Dyer
     */
    getTotalNonVerticality() {
        let result = 0;
        let visitedEdges = new Set();
        this.nodes.forEach(node => {
            node.edges.forEach(e => {
                if (!visitedEdges.has(e)) {
                    result += this.getNonVerticality(e);
                    visitedEdges.add(e);
                }
            });
        });
        return result;
    }

    /**
     * Gets bottleneck non-verticality of graph
     * Bottleneck non-verticality = max over e of nv(e)
     * @author Heath Dyer
     */
    getBottleneckNonVerticality() {
        let max = 0;
        let visitedEdges = new Set();
        this.nodes.forEach(node => {
            node.edges.forEach(e => {
                if (!visitedEdges.has(e)) {
                    const nonVerticality = this.getNonVerticality(e);
                    if (nonVerticality > max) {
                        max = nonVerticality;
                    }
                    visitedEdges.add(e);
                }
            });
        });
        return max;
    }
}