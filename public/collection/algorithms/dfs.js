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
    clearNodeWeights();
    clearEdgeHighlights();
    clearEdgeColors();
    clearEdgeLabels();
    hideAllEdgeWeights();
})

// let user choose another starting node if there are remaining unreachable nodes
let unvisited = new Set(getNodes());
while ( unvisited.size > 0 ) {
    display("choose a start node")
    const start = promptNodeFrom("Enter start node:", unvisited);
    visit(start);
}

function visit(node) {
    unvisited.delete(node);
    step(() => {
        display(`visit ${node}; discovery time = ${time}`);
        discoveryTimes[node] = time++;
        mark(node);
        label(node, discoveryTimes[node]);
    });

    for ( const edge of outgoing(node) ) {
        if ( hasColor(edge) ) continue; // seen this edge from the other end (undirected)
            const nextNode = other(node, edge);
            display(`considering edge from ${node} to ${nextNode}`)
            if ( hasLabel(edge) ) {
                display(`edge between ${node} and ${nextNode} has already been seen`)
                continue;
            }

        step(() => {
            if ( ! marked(nextNode) ) { // not yet visited
                highlight(edge);
                color(edge, "blue");
                highlight(nextNode);
                display(`node ${nextNode} has not been visited`)
            } else if ( finishTimes[nextNode] == null ) { // ancestor
                label(edge, "B");
                color(edge, "red");
                display(`recursive visit of ${nextNode} is not done`);
                display(`${nextNode} is an ancestor of ${node}; this is a back edge`)
            } else if ( finishTimes[nextNode] > discoveryTimes[node] ) { // descendant
                label(edge, "F");
                color(edge, "green");
                display(`visit to ${nextNode} was later than visit to ${node}`);
                display(`${nextNode} is a descendant of ${node}; this is a forward edge`)
            } else {
                label(edge, "C");
                color(edge, "orange");
                display(`visit to ${nextNode} was completed earlier than that to ${node}`);
                display(`${nextNode} is in a previously visited branch of the tree; this is a cross edge`)
            }
        });
        // keep the recursive call outside of the step
        if ( ! marked(nextNode) ) { // not yet visited
            visit(nextNode);
            display(`backtracking from node ${nextNode} to resume visit to ${node}`);
        }
    }

    display(`done with recursive visit to ${node}, finish time = ${time}`);
    finishTimes[node] = time++;
    label(node, discoveryTimes[node] + "/" + finishTimes[node]);
}
