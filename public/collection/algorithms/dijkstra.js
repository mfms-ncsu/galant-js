/**
 * an implementation of Dijkstra's algorithm
 * edges turn yellow when being explored, then
 *  - red if other end seen for the first time
 *  - green if relax yields improvement
 *  - blue when edge becomes part of the tree
 */


let predecessorEdge = {}    // edge currently leading to shortest path
let nodePQ = {}             // priority queue of nodes, key is node, value is weight
let inTree = {}             // true if a node is in the shortest paths tree

/**
 * Needed to check if queue is empty - must be a better way
 */
function PQsize() {
    return Object.keys(nodePQ).length
}

/**
 * uses a linear search of the queue
 * @returns node with minimum weight
 */
function removeMin() {
    let min_weight = Infinity
    let min_node = null
    for ( const node in nodePQ ) {
        const weight = nodePQ[node]
        if ( weight < min_weight ) {
            min_weight = weight
            min_node = node
        }
    }
    delete nodePQ[min_node]
    return min_node
}

/**
 * @return the average weight of the edges, ignoring edges with no weight,
 * and those with non-positive weight.
 * if there are no edges with positive weight, returns 1
 */
function averageWeight() {
    let totalWeight = 0;
    let count = 0;
    for ( const edge of getEdges() ) {
        if ( hasWeight(edge) && weight(edge) > 0 ) {
            totalWeight += weight(edge);
            count++;
        }
    }
    return count > 0 ? totalWeight / count : 1;
}

step(() => {
    clearNodeMarks();
    hideAllNodeWeights();
    clearNodeColors();
    clearNodeShapes();

    clearEdgeColors();
    clearEdgeHighlights();

    for ( const edge of getEdges() ) {
        if ( ! hasWeight(edge) ) {
            const weight = averageWeight()
            display(`edge ${edge} has no weight, setting to average weight ${weight} ***`)
            setWeight(edge, weight)
        }
    }

    for ( const node of getNodes() ) {
        nodePQ[node] = Infinity
        setWeight(node, Infinity)
    }
})

let start_node = promptNode("Enter starting node:", "invalid node ${start_node}");
setWeight(start_node, 0)
showWeight(start_node)
nodePQ[start_node] = 0

while ( PQsize() > 0 ) {
    const current_node = removeMin()
    inTree[current_node] = true
    print(current_node)
    step(() => {
        color(current_node, "yellow");
        setShape(current_node, "star")
        if ( predecessorEdge[current_node] ) {
            color(predecessorEdge[current_node], "blue")
            setEdgeWidth(predecessorEdge[current_node], 6)
            display(`node ${current_node} added
                     with predecessor ${other(current_node, predecessorEdge[current_node])}`)
        }
    })

    const current_dist = weight(current_node)
    for ( const edge of outgoing(current_node) ) {
        const next_node = other(current_node, edge)
        if ( inTree[next_node ] ) continue
        showWeight(next_node)
        const next_dist = current_dist + weight(edge)
        print(next_node + " " + next_dist)
        color(edge, "violet")
        if ( next_dist < weight(next_node) ) {
            step(() => {
                if ( predecessorEdge[next_node] ) {
                    color(predecessorEdge[next_node], "yellow")
                    color(edge, "green")
                    setEdgeWidth(edge, 4)
                    display(`relax ${edge} updated distance of ${next_node} to ${next_dist}`)
                }
                else {
                    color(edge, "red")
                }
                predecessorEdge[next_node] = edge
                setWeight(next_node, next_dist)
                nodePQ[next_node] = next_dist
            })
        }
        else {
            uncolor(edge)
        }
    }
}
display("Algorithm finished: all reachable nodes have been visited")
