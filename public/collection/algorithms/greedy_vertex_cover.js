/**
 * Uses a greedy heuristic attempting to find a minimum vertex cover of a graph.
 * Greedy means that vertices are chosen sorted decreasing degree, updated dynamically
 */

let nodePQ = {}             // priority queue of nodes, key is node, value is weight
let cover = new Set()       // set of nodes in the vertex cover

/**
 * @todo implement priority queue and functions such as degree() inside Galant; look in Thread.js 
 */

function degree(node) {
    let deg = 0
    for ( let edge of outgoing(node) ) {
        deg += 1
    }
    return deg
}

/**
 * @todo implement this in Galant
 */
function showAllNodes() {
    for ( let node of getNodes() ) {
        showNode(node)
    }
}

/**
 * Needed to check if queue is empty - must be a better way
 */
function PQsize() {
    return Object.keys(nodePQ).length
}

/**
 * uses a linear search of the queue
 * @return node with maximum weight
 */
function removeMax() {
    let max_weight = -1
    let max_node = null
    for ( var node in nodePQ ) {
        let weight = nodePQ[node]
        if ( weight > max_weight ) {
            max_weight = weight
            max_node = node
        }
    }
    // problem if all nodes have weight 0
    delete nodePQ[max_node]
    return max_node
}

function checkCover() {
    for ( let edge of getEdges() ) {
        // checking "source(edge) in cover" does not work because of the way JavaScript handles arrays
        // the only way to tell is if the edge has been colored (green)
        // ideally, we would be able to direct the edge at this point
        if ( hasColor(source(edge)) || hasColor(target(edge)) ) continue;
        highlight(edge)
        color(edge, "red")
    }
}

function queueAllNodes() {
    step(() => {
        for ( let node of getNodes() ) {
            setWeight(node, degree(node))
            nodePQ[node] = degree(node)
        }
    })
}

step(() => {
    clearNodeMarks();
    clearNodeWeights();
    clearEdgeColors();
    hideAllEdgeWeights();
    //hideAllEdgeLabels(); needs to be added in Thread.js
})
display("queueing nodes")

queueAllNodes()

let cover_size = 0

while ( PQsize() > 0 ) {
    let next_node = removeMax()
    if ( weight(next_node) === 0 ) break;
    step(() => {
        highlight(next_node)
        display("adding node " + next_node)
        color(next_node, "yellow")
        setShape(next_node, "star")
    })
    step(() => {
        for ( let edge of outgoing(next_node) ) {
            color(edge, "green")
            setEdgeWidth(edge, 5)
            let neighbor = other(next_node, edge)
            if ( nodePQ[neighbor] ) {
                // neighbor is in the queue ?
                nodePQ[neighbor] -= 1
                setWeight(neighbor, weight(neighbor) - 1)
            }
        }
    })
    step(() => {
        hideNode(next_node)
        hideNodeWeight(next_node)
        // put next_node into cover
        cover.add(next_node)
        cover_size += 1
        display("cover size = " + cover_size)
    })
} // while nodePQ not empty
step(() => {
    showAllNodes()
    checkCover()
})
