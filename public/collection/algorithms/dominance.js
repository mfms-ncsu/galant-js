/**
 * Does a sequence of reductions of a graph based on dominance, i.e., if vw
 * is an edge and the neighbors of v are a subset of the neighbors of w, then
 * there is always a minimum vertex cover that includes w. A special case is
 * a degree-one reduction: v has degree one implies that you can include w
 * and throw away v.
 */

let nodePQ = {}             // priority queue of nodes, key is node, value is weight
let cover = new Set()       // set of nodes in the vertex cover
let assigned = new Set()    // set of nodes either in cover or out of cover

/**
 * Needed to check if queue is empty - must be a better way
 */
function PQisEmpty() {
    return Object.keys(nodePQ).length == 0
}

/**
 * uses a linear search of the queue
 * @return node with minimum weight (degree)
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

/**
 * Animation steps to take place if neighbor dominates next_node
 * Also puts neighbor into the cover and updates cover size
 */
function addToCover(next_node, neighbor) {
    step(() => {
        display(`node ${neighbor} dominates ${next_node}`)
        for ( let edge_to_remove of incident(neighbor) ) {
            let to_decrease = other(neighbor, edge_to_remove)
            setWeight(to_decrease, weight(to_decrease) - 1)
            if ( weight(to_decrease) > 0 ) {
                nodePQ[to_decrease] = weight(to_decrease)
            }
        }
        // put neighbor into cover
        cover.add(neighbor)
        cover_size += 1
        delete nodePQ[neighbor]
        hideNode(neighbor)
    })
    // it looks like two display calls in the same step don't work
    // also, display("cover size =", cover_size) appears not to work
}

step(() => {
    setDirected(false);
    clearNodeMarks();
    clearNodeWeights();
    clearEdgeColors();
    hideAllEdgeWeights();
    hideAllEdgeLabels();
})
display("queueing nodes")

queueAllNodes()

let cover_size = 0

/**
 * nodes are considered by increasing degree since a low degree node
 * can only be dominated by a node of equal or higher degree and ...
 * traversing neighbors is more efficient for a low degree node than a high degree one 
 */
while ( ! PQisEmpty() ) {
    let next_node = removeMin()
    if ( ! next_node ) break   // apparently need this, not clear why
    // skip nodes that are already in the cover
    if ( isHidden(next_node) ) continue
    step(() => {
        highlight(next_node)
        display("checking node " + next_node)
        color(next_node, "yellow")
        setShape(next_node, "star")
    })
    for ( let neighbor of visibleNeighbors(next_node) ) {
        display(`Does ${neighbor} dominate ${next_node}?`)
        let next_incident = new Set(incident(next_node))
        let neighbor_incident = new Set(incident(neighbor))              
        let all_incident = next_incident.union(neighbor_incident)
        let next_adjacent = new Set(visibleNeighbors(next_node))
        next_adjacent.add(next_node)
        let neighbor_adjacent = new Set(visibleNeighbors(neighbor))
        neighbor_adjacent.add(neighbor)
        let all_adjacent = next_adjacent.union(neighbor_adjacent)
        step(() => {
            // show edges incident on neighbor and their endpoints
            // distinguish between ones adjacent to both and those not
            for ( let both_adjacent_node of neighbor_adjacent.intersection(next_adjacent) ) {
                if ( next_node == both_adjacent_node ) continue
                // nodes adjacent to both
                let edge_between = getEdgeBetween(next_node, both_adjacent_node)
                color(both_adjacent_node, "cyan")
                highlight(both_adjacent_node)
                setShape(both_adjacent_node, "star")
                color(edge_between, "blue")
                highlight(edge_between)
                if ( both_adjacent_node == neighbor ) {
                    // ends of edge being tested
                    color(edge_between, "black")
                }
            }
            for ( let neighbor_only_adjacent_node of neighbor_adjacent.difference(next_adjacent) ) {
                let edge_between = getEdgeBetween(neighbor, neighbor_only_adjacent_node)
                color(neighbor_only_adjacent_node, "yellow")
                setShape(neighbor_only_adjacent_node, "star")
                color(edge_between, "green")
                highlight(edge_between)
            }
            for ( let next_only_adjacent_node of next_adjacent.difference(neighbor_adjacent) ) {
                let edge_between = getEdgeBetween(next_node, next_only_adjacent_node)
                color(next_only_adjacent_node, "red")
                setShape(next_only_adjacent_node, "triangle")
                color(edge_between, "red")
                highlight(edge_between)
            }
        })
        if ( next_adjacent.isSubsetOf(neighbor_adjacent) ) {
            addToCover(next_node, neighbor)
        } // if neighbor dominates
        else {
            display(`${neighbor} does not dominate ${next_node}`)
        }
        // clear all animations from this dominance check and blacken nodes removed from queue
        step(() => {
            for ( let incident_edge of all_incident ) {
                unhighlight(incident_edge)
                uncolor(incident_edge)
            }
            for ( let adjacent_node of all_adjacent ) {
                unhighlight(adjacent_node)
                uncolor(adjacent_node)
                clearShape(adjacent_node)
            }
        })
    } // for each neighbor
    // color all nodes not in the priority queue black
    step(() => {
            for ( let node of getNodes() ) {
            if ( ! nodePQ[node] ) {
                color(node, "black")
            }
        }
    })
} // while nodePQ not empty
step(() => {
    for ( let node of getNodes() ) {
        showNode(node)
        hideWeight(node)
        uncolor(node)
        if ( cover.has(node) ) {
            color(node, "yellow")
            setShape(node, "square")
        }
    }
    for ( let edge of getEdges() ) {
        if ( ! (cover.has(source(edge)) || cover.has(target(edge))) ) {
            highlight(edge)
            color(edge, "red")
        }
    }
})
