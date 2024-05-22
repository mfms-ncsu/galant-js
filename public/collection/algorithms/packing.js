let nodePQ = {}             // priority queue of nodes, key is node, value is weight
let packing = new Set()       // set of nodes in the vertex cover

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
 * @return node with minimum weight, so lowest degree
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

let packing_size = 0

while ( PQsize() > 0 ) {
    let next_node = removeMin()
    step(() => {
        highlight(next_node)
        hideNodeWeight(next_node)
        display("adding node " + next_node)
        color(next_node, "yellow")
        setShape(next_node, "star")
    })
    step(() => {
        for ( let edge of outgoing(next_node) ) {
            color(edge, "green")
            setEdgeWidth(edge, 5)
            let neighbor = other(next_node, edge)
            hideNodeWeight(neighbor)
            color(neighbor, "green")
            delete nodePQ[neighbor]
            for ( let cousin_edge of outgoing(neighbor) ) {
                let cousin = other(neighbor, cousin_edge)
                if ( cousin !== next_node ) {
                    hideEdge(cousin_edge)
                }
                // cousins cannot be used as central nodes of a hyperedge
                // for the remainder of the packing
                hideNodeWeight(cousin)
                if ( nodePQ[cousin] ) {
                    color(cousin, "red")
                    delete nodePQ[cousin]
                }
            }
        }
    })
    // put next_node into packing
    packing.add(next_node)
    packing_size += 1
    display("packing size = " + packing_size)
} // while nodePQ not empty
