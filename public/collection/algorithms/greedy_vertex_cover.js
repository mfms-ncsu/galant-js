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
        if ( source(edge) in cover || target(edge) in cover ) continue;
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
})
display("queueing nodes")

queueAllNodes()

let cover_size = 0

while ( PQsize() > 0 ) {
    let next_node = removeMax()
    if ( weight(next_node) === 0 ) break;
    highlight(next_node)
    display("adding node " + next_node)
    step(() => {
        for ( let edge of outgoing(next_node) ) {
            color(edge, "green")
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