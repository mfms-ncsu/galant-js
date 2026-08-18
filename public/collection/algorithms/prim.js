/**
 * An implementation of the Prim-Jarnik minimum spanning tree algorithm;
 * this an almost exact copy of Dijkstra's shortest path algorithm
 * with only one difference: node weights are distances to the closest node in the tree
 * rather than distances from the start node
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
    const x_1 = node_map[source(edge)]['x']
    const y_1 = node_map[source(edge)]['y']
    const x_2 = node_map[target(edge)]['x']
    const y_2 = node_map[target(edge)]['y']
    const diff_x = x_1 - x_2
    const diff_y = y_1 - y_2
    return Math.sqrt(diff_x * diff_x + diff_y * diff_y)
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

step(() => {
    clearNodeMarks();
    clearNodeWeights();

    clearEdgeColors();

    for ( const edge of getEdges() ) {
        if ( ! hasWeight(edge) ) {
            display("edge ${edge} has no weight, setting to 1, Euclidian distance does not work ***")
            setWeight(edge, 1)
        }
    }

    for ( const node of getNodes() ) {
        nodePQ[node] = Infinity
        setWeight(node, Infinity)
    }
})

const start_node = promptNode("Enter starting node:", "invalid node ${start_node}");
setWeight(start_node, 0)
nodePQ[start_node] = 0

let total_weight = 0

while ( PQsize() > 0 ) {
    const current_node = removeMin()
    inTree[current_node] = true
    print(current_node)
    step(() => {
        color(current_node, "yellow");
        setShape(current_node, "star")
        if ( predecessorEdge[current_node] ) {
            color(predecessorEdge[current_node], "blue")
            highlight(predecessorEdge[current_node])
            total_weight += weight(predecessorEdge[current_node])
            display(`added edge ${predecessorEdge[current_node]}, total_weight = ${total_weight}`)
        }
    })

    for (const edge of outgoing(current_node) ) {
        const next_node = other(current_node, edge)
        if ( inTree[next_node ]) continue
        const next_dist = weight(edge)
        print(next_node + " " + next_dist)
        color(edge, "violet")
        if ( next_dist < weight(next_node) ) {
            step(() => {
                if ( predecessorEdge[next_node] ) {
                    color(predecessorEdge[next_node], "yellow")
                    color(edge, "green")
                    highlight(edge)
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
display(`Done: MST with weight ${total_weight} found for component reachable from start node`)
