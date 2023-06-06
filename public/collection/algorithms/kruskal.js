/**
 * @file kruskal.alg
 * animation of Kruskal's MST algorithm
 */

let parent = {}     // parent pointers for disjoint set structure

function initDisjointSets() {
    for ( let node of getNodes() ) {
        parent[node] = node
    }
}

function findSet(node) {
    print(`-> findSet, node = ${node}, parent = ${parent[node]}`)
    if ( node != parent[node] ) {
        parent[node] = findSet(parent[node])
    }
    print(`<- findSet, node = ${node}, parent = ${parent[node]}`)
    return parent[node]
}

function link(node_1, node_2) {
    print(`-> link ${node_1} ${node_2}`)
    parent[node_1] = node_2
    print(`<- link ${node_1} ${node_2} ${parent[node_1]}`)
}

function union(node_1, node_2) {
    link(findSet(node_1), findSet(node_2))
}

step(() => {
    clearNodeMarks();
    clearNodeWeights();
    clearEdgeColors();

    for (let edge of getEdges()) {
        if ( ! hasWeight(edge) ) {
            // setWeight(edge, euclidian(edge));
            display("*** edge ${edge} has no weight, setting to 1 ***")
            setWeight(edge, 1)
        }
    }
})

function byWeight(edge_1, edge_2) {
    return weight(edge_1) - weight(edge_2)
}

initDisjointSets()
let edgeList = getEdges()
edgeList.sort(byWeight)
let totalWeight = 0
let numForestEdges = 0
let numNodes = getNodes().length

for ( let edge of edgeList ) {
    let s = source(edge)
    let t = target(edge)
    step(() => {
        color(edge, "red")
        mark(s); mark(t)
    })
    print(`--- find(${s}) = ${findSet(s)}, find(${t}) = ${findSet(t)}`)
    if ( findSet(s) == findSet(t) ) {
        step(() => {
            color(edge, "yellow")
            hideEdgeWeight(edge)
            display(`endpoints ${s} and ${t} are already connected`)
            unmark(s); unmark(t)
        })
    }
    else {
        step(() => {
            color(edge, "blue")
            totalWeight += weight(edge)
            numForestEdges++
            union(s, t)
            display(`current forest has weight ${totalWeight}`)
            unmark(s); unmark(t)
        })
    }
    if ( numForestEdges == numNodes - 1 ) break
}
display(`--- Done, totalWeight = ${totalWeight}`)