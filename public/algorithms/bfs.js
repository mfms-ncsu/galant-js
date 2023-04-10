// Queue of nodes to visit
let queue = [];
// Number of steps taken
let time = 0;

// Adds a node to the queue
function queueNode(node) {
    highlight(node);
    label(node, "#" + time++);
    queue.push(node);
    display("Queue: " + queue);
}

step(() => { // Initialize with start node
    clearNodeWeights();
    clearNodeLabels();

    let start = promptNode("Enter start node:");
    setWeight(start, 0);
    queueNode(start);
});

while (queue.length > 0) {
    let current = queue.shift();
    step(() => { // Visit node
        display("Queue: " + queue);
        mark(current);
    });
    
    print(outgoing(current));
    for (let edge of outgoing(current)) {
        print(edge);
        let next = other(current, edge);

        step(() => { // Check adjacent node
            if (!highlighted(next)) {
                color(edge, "blue");

                let distance = weight(current) + 1;
                setWeight(next, distance);
                queueNode(next);
            } else if (hasColor(edge)) {
                highlight(edge);
            } else {
                color(edge, "red");
            }
        });
    }
}
