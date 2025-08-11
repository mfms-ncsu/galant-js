/**
 * Depth first search: works for both undirected and directed graphs.
 */

// time at which each node is discovered
let discoveryTimes = {};
// time at which each node has finished being explored
let finishTimes = {};
// Number of steps taken
let time = 1;

print("dfs");
step(() => {
    clearNodeMarks();
    clearNodeHighlights();
    clearNodeLabels();
    clearEdgeHighlights();
    clearEdgeColors();
    clearEdgeLabels();
    hideAllEdgeWeights();
})

// let user choose another starting node if there are remaining unreachable nodes
let unvisited = new Set(getNodes());
while ( unvisited.size > 0 ) {
    const start = promptNodeFrom("Enter start node:", unvisited);
    visit(start);
}

function visit(node) {
    unvisited.delete(node);
    display(`visit ${node}`);
    step(() => {
        discoveryTimes[node] = time++;
    
        mark(node);
        label(node, discoveryTimes[node]);
    });

     for ( const edge of outgoing(node) ) {
        if ( hasColor(edge) ) continue; // seen this edge from the other end (undirected)
           const nextNode = other(node, edge);
            if ( hasLabel(edge) ) {
                continue;
            }

        step(() => {
            if ( ! marked(nextNode) ) { // not yet visited
                highlight(edge);
                color(edge, "blue");
                highlight(nextNode);
            } else if ( finishTimes[nextNode] == null ) { // ancestor
                label(edge, "B");
                color(edge, "red");
            } else if ( finishTimes[nextNode] > discoveryTimes[node] ) { // descendant
                label(edge, "F");
                color(edge, "green");
            } else {
                label(edge, "C");
                color(edge, "orange");
            }
        });
        // keep the recursive call outside of the step
        if ( ! marked(nextNode) ) { // not yet visited
            visit(nextNode);
        }
    }

    finishTimes[node] = time++;
    label(node, discoveryTimes[node] + "/" + finishTimes[node]);
}
