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
 * This does not work - node_map is undefined, probably have to import something
 * @param edge edge whose Euclidian distance is to be calculated 
 * @returns distance between endpoints of the edge
 */
function euclidian(edge) {
    let x_1 = node_map[source(edge)]['x']
    let y_1 = node_map[source(edge)]['y']
    let x_2 = node_map[target(edge)]['x']
    let y_2 = node_map[target(edge)]['y']
    let diff_x = x_1 - x_2
    let diff_y = y_1 - y_2
    return Math.sqrt(diff_x * diff_x + diff_y * diff_y)
}

/**
 * uses a linear search of the queue
 * @returns node with minimum weight
 */
function removeMin() {
    let min_weight = Infinity
    let min_node = null
    for ( var node in nodePQ ) {
        let weight = nodePQ[node]
        if ( weight < min_weight ) {
            min_weight = weight
            min_node = node
        }
    }
    delete nodePQ[min_node]
    return min_node
}

step(() => {
    clearNodeMarks();
    clearNodeWeights();

    clearEdgeColors();

    for (let edge of getEdges()) {
        if ( ! hasWeight(edge) ) {
            display("*** edge ${edge} has no weight, setting to 1, Euclidian distance does not work ***")
            setWeight(edge, 1)
        }
    }

    for ( let node of getNodes() ) {
        nodePQ[node] = Infinity
        setWeight(node, Infinity)
    }
})

let start_node = promptNode("Enter starting node:", "invalid node ${start_node}");
setWeight(start_node, 0)
nodePQ[start_node] = 0

while ( PQsize() > 0 ) {
    let current_node = removeMin()
    inTree[current_node] = true
    if ( ! current_node ) {
        display("*** there are unreachable nodes ***")
    }
    print(current_node)
    step(() => {
        mark(current_node);
        if ( predecessorEdge[current_node] ) {
            color(predecessorEdge[current_node], "blue")
        }
        if ( predecessorEdge[current_node] ) {
            display(`node ${current_node} added
                     with predecessor ${other(predecessorEdge[current_node], current_node)}`)
        }
    })

    let current_dist = weight(current_node)
    for (let edge of outgoing(current_node)) {
        let next_node = other(current_node, edge)
        if ( inTree[next_node ]) continue
        let next_dist = current_dist + weight(edge)
        print(next_node + " " + next_dist)
        color(edge, "yellow")
        if ( next_dist < weight(next_node) ) {
            step(() => {
                if ( predecessorEdge[next_node] ) {
                    color(predecessorEdge[next_node], "yellow")
                    color(edge, "green")
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
