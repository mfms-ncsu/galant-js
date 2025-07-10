/**
 * Like Dijkstra's algorithm: takes both a start node and a destination; uses an a-star search
 *  that incorporates the Euclidian distance between each node and the destination
 */


let predecessorEdge = {}    // edge currently leading to shortest path
let nodePQ = {}             // priority queue of nodes, key is node, value is weight
let destDist = {}           // distance of each node to the destination
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
    // let node of nodePQ does not work because "nodePQ is not iterable"
    for ( const node in nodePQ ) {
        let weight = nodePQ[node]
        if ( weight < min_weight ) {
            min_weight = weight
            min_node = node
        }
    }
    delete nodePQ[min_node]
    return min_node
}

function distance(node1, node2) {
    const x1 = getX(node1)
    const x2 = getX(node2)
    const y1 = getY(node1)
    const y2 = getY(node2)
    const xdiff = x1 - x2
    const ydiff = y1 - y2
    return Math.sqrt(xdiff * xdiff + ydiff * ydiff)
}

step(() => {
    setDirected(false);
    clearNodeMarks();
    hideAllNodeWeights();
    clearNodeColors();
    clearNodeShapes();

    clearEdgeColors();
    clearEdgeHighlights();

    for ( const edge of getEdges() ) {
        setWeight(edge, distance(source(edge), target(edge)))
        showEdgeWeight(edge)
    }

    for ( let node of getNodes() ) {
        nodePQ[node] = Infinity
        setWeight(node, Infinity)
    }
})

let start = promptNode("Enter starting node:", "invalid node ${start}");
let destination = promptNode("Enter destination node:", "invalid node ${destination}");
for ( const node of getNodes() ) {
    destDist[node] = distance(node, destination)
}

step(() => {
    setWeight(start, destDist[start])
    showWeight(start)
})
nodePQ[start] = destDist[start]

let destination_reached = false
while ( PQsize() > 0 ) {
    let current_node = removeMin()
    inTree[current_node] = true
    if ( ! current_node ) {
        display("*** there are unreachable nodes ***")
        break
    }
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

    if ( current_node == destination ) {
        display(`destination ${current_node} reached`)
        destination_reached = true
        break
    }

    for ( const edge of outgoing(current_node) ) {
        let next_node = other(current_node, edge)
        if ( inTree[next_node ] ) continue
        showWeight(next_node)
        let new_weight = weight(current_node) + weight(edge) + destDist[next_node] - destDist[current_node]
        color(edge, "violet")
        if ( new_weight < weight(next_node) ) {
            step(() => {
                if ( predecessorEdge[next_node] ) {
                    color(predecessorEdge[next_node], "yellow")
                    color(edge, "green")
                    setEdgeWidth(edge, 4)
                    display(`relax ${edge} updated weight for ${next_node}`)
                }
                else {
                    color(edge, "red")
                }
                predecessorEdge[next_node] = edge
                setWeight(next_node, new_weight)
                nodePQ[next_node] = new_weight
            })
        }
        else {
            uncolor(edge)
        }
    }
}
if ( ! destination_reached ) {
    display("All reachable nodes have been visited, but destination has not been found")
}