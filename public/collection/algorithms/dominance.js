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
 * @todo incorporate into Galant JS - returns id of edge between source and target (both as id's)
 *       faking it
 */
function edgeBetween(source, target) {
    return source + " " + target
}

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

while ( ! PQisEmpty() ) {
    let next_node = removeMin()
    if ( ! next_node ) break   // apparently need this

    step(() => {
        highlight(next_node)
        display("checking node " + next_node)
        color(next_node, "yellow")
        setShape(next_node, "star")
    })
    // @todo use foreach constructs here
    for ( let neighbor of adjacentNodes(next_node) ) {
        if ( ! nodePQ[neighbor] ) continue
        display(`Does ${neighbor} dominate ${next_node}?`)
        // let next_incident = new Set(incident(next_node))
        // let neighbor_incident = new Set(incident(neighbor))              
        // let all_incident = next_incident.union(neighbor_incident)
        let next_adjacent = new Set(adjacentNodes(next_node))
        next_adjacent.add(next_node)
        let neighbor_adjacent = new Set(adjacentNodes(neighbor))
        neighbor_adjacent.add(neighbor)
        let all_adjacent = next_adjacent.union(neighbor_adjacent)
        step(() => {
            // show edges incident on neighbor and their endpoints
            // distinguish between ones adjacent to both and those not
            for ( let both_adjacent_node of neighbor_adjacent.intersection(next_adjacent) ) {
                // nodes adjacent to both
                let edge_between = edgeBetween(next_node, both_adjacent_node)
                console.log("both, node", both_adjacent_node, "edge", edge_between)
                color(both_adjacent_node, "blue")
                highlight(both_adjacent_node)
                setShape(both_adjacent_node, "star")
                // color(edge_between, "blue")
                // highlight(edge_between)
                // if ( both_adjacent_node == neighbor ) {
                //     // ends of edge being tested
                //     color(edge_between, "black")
                // }
            }
            for ( let neighbor_only_adjacent_node of neighbor_adjacent.difference(next_adjacent) ) {
                let edge_between = edgeBetween(neighbor, neighbor_only_adjacent_node)
                console.log("neighbor only, node", neighbor_only_adjacent_node, "edge", edge_between)
                color(neighbor_only_adjacent_node, "yellow")
                setShape(neighbor_only_adjacent_node, "star")
                // color(edge_between, "green")
                // highlight(edge_between)
            }
            for ( let next_only_adjacent_node of next_adjacent.difference(neighbor_adjacent) ) {
                let edge_between = edgeBetween(next_node, next_only_adjacent_node)
                console.log("next only, node", next_only_adjacent_node, "edge", edge_between)
                color(next_only_adjacent_node, "red")
                setShape(next_only_adjacent_node, "triangle")
                // color(edge_between, "red")
                // highlight(edge_between)
            }
        })
        if ( next_adjacent.isSubsetOf(neighbor_adjacent) ) {
            step(() => {
                display(`node ${neighbor} dominates ${next_node}`)
                for ( let edge_to_remove of incident(neighbor) ) {
                    let to_decrease = other(neighbor, edge_to_remove)
                    setWeight(to_decrease, weight(to_decrease) - 1)
                    nodePQ[to_decrease] -= 1
                    deleteEdge(edge_to_remove)
                }
                // put neighbor into cover
                cover.add(neighbor)
                cover_size += 1
                display("cover size = ", cover_size)
                delete nodePQ[neighbor]
                deleteNode(neighbor)
            })
        } // if neighbor dominates
        // clear all animations from this dominance check and blacken node removed from queue
        step(() => {
            // for ( let incident_edge of all_incident ) {
            //     unhighlight(incident_edge)
            //     uncolor(incident_edge)
            // }
            for ( let adjacent_node of all_adjacent ) {
                if ( adjacent_node == neighbor ) continue
                unhighlight(adjacent_node)
                uncolor(adjacent_node)
                clearShape(adjacent_node)
            }
        })
    } // for each neighbor
    color(next_node, "black")
    // hideWeight(next_node)
} // while nodePQ not empty
