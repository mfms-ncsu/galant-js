import LayeredGraph from "states/Graph/LayeredGraph";

/**
 * Help function that checks if two nodes have an edge crossing
 * Edge crossings: two edges e = wy and f = xz cross if one of the following holds
 * index(w) < index(x) and index(y) > index(z)
 * index(w) > index(x) and index(y) < index(z)
 * @params e Edge 1 to check
 * @params f Edge 2 to check
 * @author Heath Dyer
 */
function isEdgeCrossed(graph, e, f) {
    if (!(graph instanceof LayeredGraph)) {
        throw new Error("Function can only be performed on layered graphs.");
    }
    //get nodes
    let w = graph.nodes.get(e.source);
    let y = graph.nodes.get(e.target);
    let x = graph.nodes.get(f.source);
    let z = graph.nodes.get(f.target);
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
function getEdgeCrossings(graph, e) {
    if (!(graph instanceof LayeredGraph)) {
        throw new Error("Function can only be performed on layered graphs.");
    }
    let crossings = 0;
    let visitedEdges = new Set();
    graph.nodes.forEach(node => {
        node.edges.forEach(f => {
            if (e != f && !visitedEdges.has(f) && this.isEdgeCrossed(graph, e, f)) {
                // console.log(`${e.attributes.get("label")} crosses ${f.attributes.get("label")}`);
                crossings += 1;
            }
            visitedEdges.add(f);
        });
    });
    // console.log(`crossings: ${crossings}`);
    return crossings;
}

/**
 *  Get total crossings of the graph
 * Total crossings = (sum over e of c(e)) / 2
 * each crossing is counted twice
 * @author Heath Dyer
 */
function getTotalCrossings(graph) {
    if (!(graph instanceof LayeredGraph)) {
        throw new Error("Function can only be performed on layered graphs.");
    }
    let total = 0;
    let visitedEdges = new Set();
    graph.nodes.forEach(node => {
        node.edges.forEach(e => {
            if (!visitedEdges.has(e)) {
                total += this.getEdgeCrossings(graph, e);
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
function getBottleneckCrossings(graph) {
    if (!(graph instanceof LayeredGraph)) {
        throw new Error("Function can only be performed on layered graphs.");
    }
    let max = 0;
    let visitedEdges = new Set();
    graph.nodes.forEach(node => {
        node.edges.forEach(e => {
            if (!visitedEdges.has(e)) {
                const crossings = this.getEdgeCrossings(graph, e);
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
function getNonVerticality(graph, e) {
    if (!(graph instanceof LayeredGraph)) {
        throw new Error("Function can only be performed on layered graphs.");
    }
    const source = graph.nodes.get(e.source);
    const target = graph.nodes.get(e.target);
    return (source.position.x - target.position.x) ** 2;
}

/**
 * Gets total non-verticality of graph
 * Total non-verticality = sum over e of nv(e)
 * @author Heath Dyer
 */
function getTotalNonVerticality(graph) {
    if (!(graph instanceof LayeredGraph)) {
        throw new Error("Function can only be performed on layered graphs.");
    }
    let result = 0;
    let visitedEdges = new Set();
    graph.nodes.forEach(node => {
        node.edges.forEach(e => {
            if (!visitedEdges.has(e)) {
                result += getNonVerticality(graph, e);
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
function getBottleneckNonVerticality(graph) {
    if (!(graph instanceof LayeredGraph)) {
        throw new Error("Function can only be performed on layered graphs.");
    }
    let max = 0;
    let visitedEdges = new Set();
    graph.nodes.forEach(node => {
        node.edges.forEach(e => {
            if (!visitedEdges.has(e)) {
                const nonVerticality = this.getNonVerticality(graph, e);
                if (nonVerticality > max) {
                    max = nonVerticality;
                }
                visitedEdges.add(e);
            }
        });
    });
    return max;
}

const LayeredGraphInterface = {
    isEdgeCrossed,
    getEdgeCrossings,
    getTotalCrossings,
    getBottleneckCrossings,
    getNonVerticality,
    getTotalNonVerticality,
    getBottleneckNonVerticality,
};
export default LayeredGraphInterface;