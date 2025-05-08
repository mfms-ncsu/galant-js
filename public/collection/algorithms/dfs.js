/**
 * Depth first search: works for both undirected and directed graphs
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

let start = promptNode("Enter start node:");
visit(start);

function visit(node) {
    display(`visit ${node}`);
    step(() => {
        discoveryTimes[node] = time++;
    
        mark(node);
        label(node, discoveryTimes[node]);
    });

	for ( let edge of outgoing(node) ) {
        if ( hasColor(edge) ) continue; // seen this edge from the other end (undirected)
	    let nextNode = other(node, edge);
            if ( hasLabel(edge) ) {
                continue;
            }

        step(() => {
            if ( ! marked(nextNode) ) { // not yet visited
                highlight(edge);
                color(edge, "blue");
                highlight(nextNode);
                visit(nextNode);
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
    }

    finishTimes[node] = time++;
    label(node, discoveryTimes[node] + "/" + finishTimes[node]);
}
