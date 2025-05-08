/**
 * Breadth first search on a graph; works for both directed and undirected graphs.
 */
// Queue of nodes to visit
let queue = [];
// Number of steps taken
let time = 0;

// Adds a node to the queue
function queueNode(node, weight) {
    highlight(node);
    setWeight(node, weight);
    label(node, "#" + time++);

    queue.push(node);
    display("Queue: " + queue);
    print(`Queued node '${node}'`);
}

step(() => { // Initialize with start node
    clearNodeMarks();
    clearNodeHighlights();
    clearNodeLabels();
    clearNodeWeights();

    clearEdgeHighlights();
    clearEdgeColors();

    let start = promptNode("Enter start node:");
    queueNode(start, 0);
    print(`Starting at node '${start}'`);
});

while (queue.length > 0) {
    let current = queue.shift();
    step(() => { // Visit node
        display("Queue: " + queue);
        print(`Visiting node '${current}'`);
        mark(current);
    });
    
    for (let edge of outgoing(current)) {
        let next = other(current, edge);

        step(() => { // Check outgoing edges
            print(`Checking edge '${edge}'`);
            if ( ! hasColor(edge) ) { // never seen this edge, only relevant for undirected
                if (highlighted(next)) { // already visited node
                    color(edge, "red");
                }
                else { // have not visited node
                    step(() => {
                        color(edge, "blue");
                        highlight(edge)
                        display(`queueing node ${next}`)
                        queueNode(next, weight(current) + 1);
                    })
                }
            }
        });
    }
}
