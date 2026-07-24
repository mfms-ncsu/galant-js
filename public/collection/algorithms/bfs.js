/**
 * Breadth first search on a graph; works for both directed and undirected graphs.
 */
// Queue of nodes to visit
let queue = [];
// Number of steps taken
let time = 0;

// Adds a node to the queue
function queueNode(node, weight) {
    queue.push(node);
    step(() => {
        display(`queueing node ${node}, queue = [${queue}]`)
        highlight(node);
        setWeight(node, weight);
        label(node, "#" + time++);
    })
    print(`Queued node '${node}'`);
}

step(() => { // Initialize with start node
    clearNodeMarks();
    clearNodeHighlights();
    clearNodeLabels();
    clearNodeWeights();

    clearEdgeHighlights();
    clearEdgeColors();

    const start = promptNode("Enter start node:");
    queueNode(start, 0);
    print(`Starting at node '${start}'`);
});

while ( queue.length > 0 ) {
    const current = queue.shift();
    step(() => { // Visit node
        display(`visiting node ${current}, queue = [${queue}]`)
        display("Queue: " + queue);
        mark(current);
    });
    
    for ( const edge of outgoing(current) ) {
        const next = other(current, edge);

// !!! avoid steps within steps
//        step(() => { // Check outgoing edges
            print(`Checking edge '${edge}'`);
            if ( ! hasColor(edge) ) { // never seen this edge, only relevant for undirected
                if ( highlighted(next) ) { // already visited node
                    color(edge, "red");
                }
                else { // have not visited node
                    queueNode(next, weight(current) + 1);
                    step(() => {
                        color(edge, "blue");
                        highlight(edge)
                    })
                }
            }
//        });
    }
}
display("Algorithm finished: all reachable nodes have been visited")
